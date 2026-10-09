/**
 * JS QUEST - MUNDO 3: CONTROLLER COM ANIMAÇÕES COMPLETAS E FLUXO VISUAL
 */
class Mundo3Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.executionTimer = null;
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

    // 2. Botões da Barra de Vitória Não-Invasiva
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

    // 3. Botão de Avanço dentro do Modal
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
        this.runSimulation(this.view.codeInput.value);
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

    // 8. Botão "+ Aplicar" dos Chips
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
              "Código do bloco aplicado no editor! Agora clique em EXECUTAR FUNÇÃO.",
              "normal",
            );
          }
        }
      });
    }

    // 9. Navegador de Atividades no Topo
    if (this.view.phaseNav) {
      this.view.phaseNav.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (btn && btn.dataset.index !== undefined) {
          this.stopSimulation();
          this.model.activeActivityIndex = parseInt(btn.dataset.index, 10);
          this.model.activeStepIndex = 0;
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
    this.view.updateTelemetry("nenhuma", "[]", "pendente", 0);

    const victoryBar = document.getElementById("mission-success-bar");
    if (victoryBar) victoryBar.classList.add("d-none");

    // Estado inicial visual de cada jogo
    if (this.model.activeActivityIndex === 0) {
      this.view.renderMachine(step.testInputs || [4, 6], "__EMPTY__", false);
    } else if (this.model.activeActivityIndex === 1) {
      this.view.renderScopeTower(true, false, 1);
    } else if (this.model.activeActivityIndex === 2) {
      this.view.renderCallStack([], false);
    } else if (this.model.activeActivityIndex === 3) {
      this.view.renderArrowFactory(
        "const somar = (a, b) => a + b;",
        true,
        "12",
        false,
      );
    }
  }

  stopSimulation() {
    if (this.executionTimer) {
      clearInterval(this.executionTimer);
      this.executionTimer = null;
    }
    const btnStop = document.getElementById("btn-stop-game");
    const btnRun = document.getElementById("btn-run-game");
    if (btnStop) btnStop.disabled = true;
    if (btnRun) btnRun.disabled = false;
  }

  runSimulation(code) {
    if (!code || !code.trim()) {
      this.view.setGuideState(
        "O editor está vazio! Digite o código da função ou clique em + Aplicar.",
        "warning",
      );
      return;
    }

    this.stopSimulation();
    this.view.clearTerminal();

    const actIndex = this.model.activeActivityIndex;
    const step = this.model.getCurrentStep();
    const btnStop = document.getElementById("btn-stop-game");
    const btnRun = document.getElementById("btn-run-game");
    if (btnStop) btnStop.disabled = false;
    if (btnRun) btnRun.disabled = true;

    // ==========================================
    // 1. MÁQUINA DE TRANSFORMAR (ANIMADA)
    // ==========================================
    if (actIndex === 0) {
      this.view.logTerminal("Alimentando a esteira com os argumentos...");
      // Fase 1: Caixa entra e engrenagens giram
      this.view.renderMachine(step.testInputs || [4, 6], "__EMPTY__", true);

      setTimeout(() => {
        const sim = this.model.simulateTransform(code, step);
        this.stopSimulation();

        if (!sim.ok) {
          this.view.logTerminal(`[ERRO DE EXECUÇÃO] ${sim.error}`, true);
          this.view.setGuideState(
            `Erro na sua função: ${sim.error}`,
            "warning",
          );
          this.view.renderMachine(
            step.testInputs || [4, 6],
            "__EMPTY__",
            false,
          );
          return;
        }

        // Fase 2: Entrega o produto verde OU solta fumaça de undefined
        this.view.renderMachine(step.testInputs || [4, 6], sim.result, false);
        this.view.logTerminal(
          `Transformação concluída. Valor devolvido pelo return: ${sim.result}`,
        );
        this.view.updateTelemetry(
          "função",
          JSON.stringify(step.testInputs || [4, 6]),
          String(sim.result),
          1,
        );

        if (sim.isSuccess) {
          this.handleMissionSuccess(step);
        } else {
          this.view.setGuideState(
            `A máquina devolveu ${sim.result}, mas o esperado era ${step.expectedReturn}! Ajuste a expressão de retorno.`,
            "warning",
          );
        }
      }, 700);
    }

    // ==========================================
    // 2. CAVERNA DOS ESCOPOS (ANIMADA)
    // ==========================================
    else if (actIndex === 1) {
      this.view.logTerminal("Inspecionando os baús e portões de escopo...");
      const sim = this.model.simulateScope(code, step);
      this.stopSimulation();

      if (!sim.ok) {
        this.view.renderScopeTower(false, false, 0);
        this.view.logTerminal(`[ESCOPO BLOQUEADO] ${sim.error}`, true);
        this.view.setGuideState(
          `Acesso negado: a variável está trancada no escopo interno e não pode ser lida de fora!`,
          "warning",
        );
        return;
      }

      const isClosure = step.isClosureTest;
      const counterVal = sim.result === 2 ? 2 : sim.result === 1 ? 1 : 2;
      this.view.renderScopeTower(true, isClosure, counterVal);
      this.view.logTerminal(
        `Acesso concedido. Valor obtido com sucesso: ${sim.result}`,
      );
      this.view.updateTelemetry("escopo", "[]", String(sim.result), 1);

      if (sim.isSuccess) {
        this.handleMissionSuccess(step);
      } else {
        this.view.setGuideState(
          "Acesse a variável através do return da função.",
          "warning",
        );
      }
    }

    // ==========================================
    // 3. TORRE DA CALL STACK (LIFO ANIMADO PASSO A PASSO)
    // ==========================================
    else if (actIndex === 2) {
      this.view.logTerminal("Iniciando empilhamento na Call Stack...");
      const sim = this.model.simulateCallStack(code, step);

      if (sim.isOverflow) {
        this.stopSimulation();
        this.view.renderCallStack(sim.stackFrames, true);
        this.view.logTerminal(
          "[ALERTA DE SEGURANÇA] RangeError: Maximum call stack size exceeded!",
          true,
        );
        this.view.updateTelemetry("subirInfinito", "[]", "💥 ESTOURO", 99);
        this.handleMissionSuccess(step);
        return;
      }

      if (!sim.ok) {
        this.stopSimulation();
        this.view.logTerminal(`[ERRO NA PILHA] ${sim.error}`, true);
        this.view.setGuideState(`Erro: ${sim.error}`, "warning");
        return;
      }

      // Animação passo a passo de empilhar e depois desempilhar
      let currentFrames = [];
      let pushIdx = 0;

      // 1. Empilhando (Push)
      this.executionTimer = setInterval(() => {
        if (pushIdx < sim.stackFrames.length) {
          currentFrames.push(sim.stackFrames[pushIdx]);
          this.view.renderCallStack([...currentFrames], false);
          this.view.logTerminal(
            `PUSH: ${sim.stackFrames[pushIdx]} entrou na pilha.`,
          );
          this.view.updateTelemetry(
            sim.stackFrames[pushIdx],
            "[]",
            "executando",
            currentFrames.length,
          );
          pushIdx++;
        } else {
          clearInterval(this.executionTimer);
          // 2. Desempilhando (Pop)
          setTimeout(() => {
            this.executionTimer = setInterval(() => {
              if (currentFrames.length > 0) {
                const popped = currentFrames.pop();
                this.view.renderCallStack([...currentFrames], false);
                this.view.logTerminal(`POP: ${popped} terminou e desempilhou.`);
                this.view.updateTelemetry(
                  "retornando",
                  "[]",
                  String(sim.result || "OK"),
                  currentFrames.length,
                );
              } else {
                this.stopSimulation();
                this.view.logTerminal(
                  `Pilha totalmente desempilhada. Resultado final: ${sim.result}`,
                );
                if (sim.isSuccess) {
                  this.handleMissionSuccess(step);
                }
              }
            }, 350);
          }, 400);
        }
      }, 400);
    }

    // ==========================================
    // 4. FÁBRICA DE ARROW FUNCTIONS (ANIMADA)
    // ==========================================
    else if (actIndex === 3) {
      this.view.logTerminal("Prensando função mecânica na sintaxe de seta...");
      const sim = this.model.simulateArrow(code, step);
      this.stopSimulation();

      if (!sim.ok) {
        this.view.logTerminal(`[ERRO DE SINTAXE] ${sim.error}`, true);
        this.view.setGuideState(
          `Erro de sintaxe na arrow function: ${sim.error}`,
          "warning",
        );
        return;
      }

      const displayOut =
        typeof sim.result === "object"
          ? JSON.stringify(sim.result)
          : String(sim.result);
      const isSmoking = sim.result === undefined;

      this.view.renderArrowFactory(
        code.split("\n")[0],
        true,
        displayOut,
        isSmoking,
      );
      this.view.logTerminal(
        `Arrow function executada com retorno: ${displayOut}`,
      );
      this.view.updateTelemetry("arrowFn", "[]", displayOut, 1);

      if (sim.isSuccess) {
        this.handleMissionSuccess(step);
      } else {
        this.view.setGuideState(
          `A arrow function devolveu ${displayOut}, mas o esperado era ${step.expectedReturn || "outro valor"}! Lembre-se: chaves {} exigem a palavra return!`,
          "warning",
        );
      }
    }
  }

  handleMissionSuccess(step) {
    this.model.addXP(100);
    this.view.renderHUD(this.model.xp);
    this.view.setGuideState(
      "🎉 Execução correta! O comportamento do motor correspondeu ao esperado.",
      "happy",
    );

    // Exibe a barra de vitória sem fechar o palco
    const victoryBar = document.getElementById("mission-success-bar");
    if (victoryBar) victoryBar.classList.remove("d-none");
  }

  advanceToNextStep() {
    const act = this.model.getCurrentActivity();

    // 1. Próxima missão da atividade atual
    if (this.model.activeStepIndex < act.steps.length - 1) {
      this.model.activeStepIndex++;
      this.refreshUI();
    }
    // 2. Próxima atividade do Mundo 3
    else if (
      this.model.activeActivityIndex <
      this.model.activities.length - 1
    ) {
      alert(
        "🏆 Atividade concluída! Carregando a próxima atividade do Mundo 3...",
      );
      this.model.activeActivityIndex++;
      this.model.activeStepIndex = 0;
      this.refreshUI();
    }
    // 3. FINALIZA O MUNDO 3 E ABRE O MODAL DE VITÓRIA
    else {
      this.model.saveWorldCompletion();
      this.view.setGuideState(
        "🎉 PARABÉNS! Você dominou o Mundo 3 e conquistou a medalha de Mestre dos Poderes Funcionais!",
        "happy",
      );
      this.view.showWorldVictory(this.model.xp);
    }
  }
}
