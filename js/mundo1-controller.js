/**
 * JS QUEST - MUNDO 1: CONTROLLER COM CONTROLE DE FLUXO VISUAL
 */
class Mundo1Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    this.bindEvents();
    this.refreshUI();
  }

  bindEvents() {
    // 1. Botão "Como Funciona?" no topo
    const btnExplainLogic = document.getElementById("btn-explain-logic");
    if (btnExplainLogic) {
      btnExplainLogic.addEventListener("click", () => {
        const step = this.model.getCurrentStep();
        if (step && step.explanation) {
          this.view.showExplanation(step.explanation);
        }
      });
    }

    // 2. Botões da Barra de Vitória (não invasiva)
    const btnSuccessExplain = document.getElementById("btn-success-explain");
    if (btnSuccessExplain) {
      btnSuccessExplain.addEventListener("click", () => {
        const step = this.model.getCurrentStep();
        if (step && step.explanation) {
          this.view.showExplanation(step.explanation);
        }
      });
    }

    const btnSuccessNext = document.getElementById("btn-success-next");
    if (btnSuccessNext) {
      btnSuccessNext.addEventListener("click", () => {
        this.advanceToNextStep();
      });
    }

    // 3. Botão de Avanço dentro do Modal (se o usuário abriu o modal)
    const btnModalNext = document.getElementById("btn-modal-next-mission");
    if (btnModalNext) {
      btnModalNext.addEventListener("click", () => {
        this.view.hideExplanation();
        this.advanceToNextStep();
      });
    }

    // 4. Executar Código Digitado no Editor
    const btnRun = document.getElementById("btn-run-game");
    if (btnRun) {
      btnRun.addEventListener("click", () => {
        this.executeUserCode(this.view.codeInput.value);
      });
    }

    // 5. Parar Execução
    const btnStop = document.getElementById("btn-stop-game");
    if (btnStop) {
      btnStop.addEventListener("click", () => {
        this.stopSimulation();
      });
    }

    // 6. Limpar Editor
    const btnClear = document.getElementById("btn-clear-code");
    if (btnClear) {
      btnClear.addEventListener("click", () => {
        this.view.codeInput.value = "";
      });
    }

    // 7. Restaurar Código
    const btnAutoSolve = document.getElementById("btn-auto-solve");
    if (btnAutoSolve) {
      btnAutoSolve.addEventListener("click", () => {
        const step = this.model.getCurrentStep();
        this.view.codeInput.value = step.initialCode;
        this.view.setGuideState(
          "Código original restaurado no editor!",
          "normal",
        );
      });
    }

    // 8. Ações Táteis do Palco (Arena e Laboratório)
    if (this.view.stage) {
      this.view.stage.addEventListener("click", (e) => {
        const arcadeBtn = e.target.closest(".btn-arcade-hit");
        if (arcadeBtn && arcadeBtn.dataset.code) {
          const code = arcadeBtn.dataset.code;
          this.view.codeInput.value = code;
          this.executeUserCode(code);
          return;
        }

        const labBtn = e.target.closest(".btn-lab-valve");
        if (labBtn && labBtn.dataset.code) {
          const code = labBtn.dataset.code;
          this.view.codeInput.value = code;
          this.executeUserCode(code);
          return;
        }
      });
    }

    // 9. Botão "+ Aplicar" dos Chips
    if (this.view.commandDeck) {
      this.view.commandDeck.addEventListener("click", (e) => {
        const insertBtn = e.target.closest(".btn-insert-chip");
        const step = this.model.getCurrentStep();

        if (insertBtn) {
          const idx = parseInt(insertBtn.dataset.cmdIdx, 10);
          const cmd = step.commands[idx];
          if (cmd) {
            this.view.codeInput.value = cmd.code;
            this.view.setGuideState(
              "Código do bloco aplicado no editor! Agora clique em EXECUTAR.",
              "normal",
            );
          }
        }
      });
    }

    // 10. Navegador de Atividades no Topo
    if (this.view.phaseNav) {
      this.view.phaseNav.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (btn && btn.dataset.index !== undefined) {
          this.stopSimulation();
          this.model.activeActivityIndex = parseInt(btn.dataset.index, 10);
          this.model.activeStepIndex = 0;
          this.model.ram.clear();
          this.refreshUI();
        }
      });
    }
  }

  refreshUI() {
    const act = this.model.getCurrentActivity();
    const step = this.model.getCurrentStep();
    this.view.renderHUD(this.model.xp);
    this.view.renderNavigation(
      this.model.activities,
      this.model.activeActivityIndex,
    );
    this.view.renderMission(act, this.model.activeStepIndex, act.steps.length);
    this.view.renderRAMTable(this.model.ram);
    this.view.renderStage(
      this.model.activeActivityIndex,
      this.model.ram,
      null,
      [],
    );

    // Esconde a barra de vitória ao iniciar nova missão
    const victoryBar = document.getElementById("mission-success-bar");
    if (victoryBar) victoryBar.classList.add("d-none");
  }

  stopSimulation() {
    const btnStop = document.getElementById("btn-stop-game");
    const btnRun = document.getElementById("btn-run-game");
    if (btnStop) btnStop.disabled = true;
    if (btnRun) btnRun.disabled = false;
  }

  executeUserCode(code) {
    if (!code || !code.trim()) {
      this.view.setGuideState(
        "O editor está vazio! Digite instruções ou use os blocos sugeridos.",
        "warning",
      );
      return;
    }

    this.stopSimulation();
    this.view.clearTerminal();

    const result = this.model.executeCode(code);

    result.logs.forEach((log) => {
      this.view.logTerminal(log, log.includes("ALERTA"));
    });

    this.view.renderRAMTable(this.model.ram);
    this.view.renderStage(
      this.model.activeActivityIndex,
      this.model.ram,
      result.lastError,
      result.logs,
    );

    const step = this.model.getCurrentStep();
    const stdoutAll = result.logs.join(" ");
    const isSuccess = step.validate(this.model, stdoutAll, result.lastError);

    if (isSuccess) {
      this.model.addXP(100);
      this.view.renderHUD(this.model.xp);
      this.view.setGuideState(
        "🎉 Execução correta! Veja o resultado da simulação no palco.",
        "happy",
      );

      // EXIBE A BARRA DE SUCESSO SEM FECHAR O PALCO
      const victoryBar = document.getElementById("mission-success-bar");
      if (victoryBar) victoryBar.classList.remove("d-none");
    } else {
      this.view.setGuideState(
        "O código foi executado na RAM, mas o resultado ainda não atendeu ao objetivo da missão. Verifique os valores e tente novamente.",
        "warning",
      );
    }
  }

  advanceToNextStep() {
    const act = this.model.getCurrentActivity();

    if (this.model.activeStepIndex < act.steps.length - 1) {
      this.model.activeStepIndex++;
      this.refreshUI();
    } else if (
      this.model.activeActivityIndex <
      this.model.activities.length - 1
    ) {
      alert("🏆 Atividade concluída! Carregando a próxima atividade...");
      this.model.activeActivityIndex++;
      this.model.activeStepIndex = 0;
      this.model.ram.clear();
      this.refreshUI();
    } else {
      this.model.saveWorldCompletion();
      this.view.setGuideState(
        "🎉 PARABÉNS! Você dominou o Mundo 1 e conquistou a medalha de Mestre dos Fundamentos!",
        "happy",
      );
      this.view.showWorldVictory(this.model.xp);
    }
  }
}
