/**
 * JS QUEST - MUNDO 2: CONTROLLER COM CONTROLE DE FLUXO VISUAL
 */
class Mundo2Controller {
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

    // 3. Botão de Avanço dentro do Modal (se o usuário abriu)
    const btnModalNext = document.getElementById("btn-modal-next-mission");
    if (btnModalNext) {
      btnModalNext.addEventListener("click", () => {
        this.view.hideExplanation();
        this.advanceToNextStep();
      });
    }

    // 4. Executar o Código do Editor
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

    // 8. Botão Socorro do Elevador
    if (this.view.stage) {
      this.view.stage.addEventListener("click", (e) => {
        const helpBtn = e.target.closest("#btn-elevator-help");
        if (helpBtn) {
          const step = this.model.getCurrentStep();
          this.view.showExplanation(step.explanation);
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
    this.view.updateTelemetry(0, "i = 0", "true", "Pronto");

    const victoryBar = document.getElementById("mission-success-bar");
    if (victoryBar) victoryBar.classList.add("d-none");

    if (this.model.activeActivityIndex === 0) {
      this.view.renderMaze(step.gridSize, step.walls, step.start, step.target);
    } else if (this.model.activeActivityIndex === 1) {
      this.view.renderElevator(1, 6, false);
    } else if (this.model.activeActivityIndex === 2) {
      this.view.renderTraffic("green", false);
    } else if (this.model.activeActivityIndex === 3) {
      this.view.renderWorkshop(true, false);
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
        "O editor está vazio! Digite instruções ou use os blocos sugeridos.",
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

    // 1. LABIRINTO DO ROBÔ
    if (actIndex === 0) {
      this.view.logTerminal("Executando seus comandos no labirinto...");
      const sim = this.model.simulateRobot(code, step);

      if (!sim.ok) {
        this.stopSimulation();
        this.view.logTerminal(`[ERRO DE SINTAXE] ${sim.error}`, true);
        this.view.setGuideState(
          `Erro de sintaxe no código: ${sim.error}`,
          "warning",
        );
        return;
      }

      if (sim.actions.length === 0) {
        this.stopSimulation();
        this.view.logTerminal(
          "Nenhum comando de movimento foi executado.",
          true,
        );
        return;
      }

      let idx = 0;
      this.executionTimer = setInterval(() => {
        if (idx >= sim.actions.length) {
          this.stopSimulation();

          if (sim.reachedTarget) {
            this.handleMissionSuccess(step);
          } else if (!sim.hasCollided) {
            this.view.setGuideState(
              `⚠️ O robô parou em [${sim.finalState.x}, ${sim.finalState.y}], mas o diamante 💎 está em [${step.target.x}, ${step.target.y}]!`,
              "warning",
            );
          }
          return;
        }

        const action = sim.actions[idx];

        if (action.type === "move") {
          this.view.renderMaze(
            step.gridSize,
            step.walls,
            action.state,
            step.target,
          );
          this.view.logTerminal(
            `Robô avançou para [${action.state.x}, ${action.state.y}].`,
          );
          this.view.updateTelemetry(
            idx + 1,
            `Pos: [${action.state.x},${action.state.y}]`,
            "Livre",
          );
        } else if (action.type === "turn") {
          this.view.renderMaze(
            step.gridSize,
            step.walls,
            action.state,
            step.target,
          );
          this.view.logTerminal("Robô virou 90 graus.");
        } else if (action.type === "collision") {
          this.stopSimulation();
          this.view.renderMaze(
            step.gridSize,
            step.walls,
            action.state,
            step.target,
            action.tile,
            true,
          );
          this.view.logTerminal(
            `[COLISÃO 💥] O robô bateu na parede em [${action.tile.x}, ${action.tile.y}] e parou.`,
            true,
          );
          this.view.setGuideState(
            `💥 Bloqueio físico! O robô colidiu contra a parede em [${action.tile.x}, ${action.tile.y}].`,
            "warning",
          );
          return;
        }

        idx++;
      }, 350);
    }

    // 2. ELEVADOR DO FOR
    else if (actIndex === 1) {
      this.view.logTerminal("Executando laço for no elevador...");
      const sim = this.model.simulateElevator(code, step);

      if (!sim.ok) {
        this.stopSimulation();
        this.view.logTerminal(`[ERRO DE SINTAXE] ${sim.error}`, true);
        this.view.setGuideState(`Erro: ${sim.error}`, "warning");
        return;
      }

      if (sim.isInfinite) {
        this.stopSimulation();
        this.view.logTerminal(
          "[ALERTA DE SEGURANÇA] Loop Infinito! O elevador não para de descer!",
        );
        this.view.renderElevator(1, 6, true);
        this.view.updateTelemetry(
          99,
          "andar = negativo",
          "true (Loop Infinito)",
          "PERIGO",
        );

        if (step.isInfiniteHazard) {
          this.view.logTerminal(
            "🎯 Objetivo alcançado: Loop Infinito identificado com sucesso!",
          );
          this.handleMissionSuccess(step);
        } else {
          this.view.setGuideState(
            "🚨 O elevador entrou em Loop Infinito! Altere o contador para aproximar da condição de parada.",
            "warning",
          );
        }
        return;
      }

      let i = 0;
      this.executionTimer = setInterval(() => {
        if (i >= sim.floorsVisited.length) {
          this.stopSimulation();

          if (sim.lastFloor === step.targetFloor) {
            this.handleMissionSuccess(step);
          } else {
            this.view.setGuideState(
              `⚠️ O elevador parou no ${sim.lastFloor}º andar! A meta era chegar no ${step.targetFloor}º andar.`,
              "warning",
            );
          }
          return;
        }

        const floor = sim.floorsVisited[i];
        this.view.renderElevator(Math.min(Math.max(floor, 1), 6), 6, false);
        this.view.logTerminal(`Elevador no ${floor}º andar.`);
        this.view.updateTelemetry(
          i + 1,
          `andar = ${floor}`,
          `andar <= ${step.targetFloor}`,
        );
        i++;
      }, 350);
    }

    // 3. SEMÁFORO LÓGICO
    else if (actIndex === 2) {
      const sim = this.model.simulateTraffic(code, step);

      if (!sim.ok) {
        this.stopSimulation();
        this.view.logTerminal(`[ERRO] ${sim.error}`, true);
        this.view.setGuideState(`Erro: ${sim.error}`, "warning");
        return;
      }

      this.view.renderTraffic(sim.lightColor, !sim.carStopped);
      this.view.logTerminal(`Luz do semáforo: ${sim.lightColor.toUpperCase()}`);

      if (step.scenario === "pedestrian") {
        if (sim.lightColor === "red") {
          this.handleMissionSuccess(step);
        } else {
          this.view.setGuideState(
            "⚠️ Perigo! Havia pedestre aguardando, mas o sinal dos carros não fechou!",
            "warning",
          );
        }
      } else if (step.scenario === "switch_traffic") {
        if (sim.lightColor === "green") {
          this.handleMissionSuccess(step);
        } else {
          this.view.setGuideState(
            '⚠️ O comando "avancar" precisava ativar a luz verde com break!',
            "warning",
          );
        }
      }
      this.stopSimulation();
    }

    // 4. CAÇA AO BUG DO LOOP
    else if (actIndex === 3) {
      const sim = this.model.simulateWorkshop(code, step);

      if (!sim.ok) {
        this.stopSimulation();
        this.view.logTerminal(`[ERRO] ${sim.error}`, true);
        this.view.setGuideState(`Erro: ${sim.error}`, "warning");
        return;
      }

      if (sim.isInfinite) {
        this.stopSimulation();
        this.view.renderWorkshop(false, true);
        this.view.logTerminal(
          "[ALERTA DE FUMAÇA] O robô superaqueceu! O laço continua infinito.",
        );

        if (
          code.includes("while") &&
          !code.includes("ligarLuzes();\n  energia--;") &&
          !code.includes("ligarLuzes();\n    energia--;") &&
          !code.includes("ligarLuzes(); energia--;")
        ) {
          this.view.setGuideState(
            "🚨 O <code>energia--;</code> foi colocado FORA do while! Mova o <code>energia--;</code> para DENTRO das chaves { } antes de fechar o laço.",
            "warning",
          );
        } else {
          this.view.setGuideState(
            "O robô continua travado em loop infinito! Corrija a variável do laço.",
            "warning",
          );
        }
        return;
      }

      this.stopSimulation();
      this.view.renderWorkshop(true, false);
      this.view.logTerminal("Robô operou perfeitamente sem superaquecimento.");
      this.handleMissionSuccess(step);
    }
  }

  handleMissionSuccess(step) {
    this.model.addXP(100);
    this.view.renderHUD(this.model.xp);
    this.view.setGuideState(
      "🎉 Excelente! Veja o resultado completo da simulação no palco.",
      "happy",
    );

    // EXIBE A BARRA DE SUCESSO SEM FECHAR O PALCO
    const victoryBar = document.getElementById("mission-success-bar");
    if (victoryBar) victoryBar.classList.remove("d-none");
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
      this.refreshUI();
    } else {
      this.model.saveWorldCompletion();
      this.view.setGuideState(
        "🎉 PARABÉNS! Você dominou o Mundo 2 e conquistou a medalha de Mestre do Fluxo!",
        "happy",
      );
      this.view.showWorldVictory(this.model.xp);
    }
  }
}
