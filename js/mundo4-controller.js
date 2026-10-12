/**
 * JS QUEST - MUNDO 4: CONTROLLER COM ANIMAÇÕES COMPLETAS E FLUXO VISUAL
 */
class Mundo4Controller {
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

    // 5. Limpar Editor
    const btnClear = document.getElementById("btn-clear-code");
    if (btnClear) {
      btnClear.addEventListener("click", () => {
        this.view.codeInput.value = "";
      });
    }

    // 6. Restaurar Código
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

    // 7. Botão "+ Aplicar" dos Chips
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
              "Código do bloco aplicado no editor! Agora clique em EXECUTAR CÓDIGO.",
              "normal",
            );
          }
        }
      });
    }

    // 8. Navegador de Atividades no Topo
    if (this.view.phaseNav) {
      this.view.phaseNav.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (btn && btn.dataset.index !== undefined) {
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
    this.view.updateTelemetry("pronto", "[]", "esperando", 0);

    const victoryBar = document.getElementById("mission-success-bar");
    if (victoryBar) victoryBar.classList.add("d-none");

    // Cenários visuais padrão para cada atividade
    if (this.model.activeActivityIndex === 0) {
      this.view.renderTrain(["Madeira", "Carvao"], "Aguardando comando...");
    } else if (this.model.activeActivityIndex === 1) {
      this.view.renderPizzaFactory(
        [
          { sabor: "Mussarela", preco: 25 },
          { sabor: "Trufada", preco: 60 },
          { sabor: "Especial", preco: 45 },
        ],
        [],
        [],
        null,
      );
    } else if (this.model.activeActivityIndex === 2) {
      this.view.renderVillage({ teto: "azul", morador: "Bit", aberta: false });
    } else if (this.model.activeActivityIndex === 3) {
      this.view.renderJsonJungle({ nome: "Bit", nivel: 4, ativo: true }, false);
    }
  }

  runSimulation(code) {
    if (!code || !code.trim()) {
      this.view.setGuideState(
        "O editor está vazio! Digite o código ou clique em + Aplicar.",
        "warning",
      );
      return;
    }

    this.view.clearTerminal();
    const actIndex = this.model.activeActivityIndex;
    const step = this.model.getCurrentStep();

    // 1. TREM DOS ARRAYS
    if (actIndex === 0) {
      this.view.logTerminal("Movimentando composição dos vagões...");
      const sim = this.model.simulateTrain(code, step);

      if (!sim.ok) {
        this.view.logTerminal(`[ERRO NO ARRAY] ${sim.error}`, true);
        this.view.setGuideState(
          `Erro ao manipular o array: ${sim.error}`,
          "warning",
        );
        return;
      }

      this.view.renderTrain(sim.trainState, step.operationType || "Executado");
      this.view.logTerminal(
        `Vagões atualizados: [${sim.trainState.join(", ")}]`,
      );
      this.view.updateTelemetry(
        "array.op",
        JSON.stringify(sim.trainState),
        `len: ${sim.trainState.length}`,
        sim.trainState.length,
      );

      if (sim.isSuccess) {
        this.handleMissionSuccess(step);
      } else {
        this.view.setGuideState(
          "A quantidade de vagões não corresponde ao objetivo. Verifique os métodos!",
          "warning",
        );
      }
    }

    // 2. FÁBRICA DE PIZZAS (MAP, FILTER, REDUCE)
    else if (actIndex === 1) {
      this.view.logTerminal("Processando linha funcional de pizzas...");
      const sim = this.model.simulatePizzas(code, step);

      if (!sim.ok) {
        this.view.logTerminal(`[ERRO FUNCIONAL] ${sim.error}`, true);
        this.view.setGuideState(
          `Erro na operação funcional: ${sim.error}`,
          "warning",
        );
        return;
      }

      const initialPizzas = [
        { sabor: "Mussarela", preco: 25 },
        { sabor: "Trufada", preco: 60 },
        { sabor: "Especial", preco: 45 },
      ];
      let filtered = [];
      let mapped = [];
      let reduced = null;

      if (step.methodTest === "filter") filtered = sim.result;
      if (step.methodTest === "map") mapped = sim.result;
      if (step.methodTest === "reduce") reduced = sim.result;

      this.view.renderPizzaFactory(initialPizzas, filtered, mapped, reduced);
      this.view.logTerminal(`Resultado obtido: ${JSON.stringify(sim.result)}`);
      this.view.updateTelemetry(
        step.methodTest,
        "pipeline",
        String(sim.result),
        1,
      );

      if (sim.isSuccess) {
        this.handleMissionSuccess(step);
      } else {
        this.view.setGuideState(
          "O retorno da pipeline não atingiu o resultado esperado. Revise o callback!",
          "warning",
        );
      }
    }

    // 3. VILA DOS OBJETOS
    else if (actIndex === 2) {
      this.view.logTerminal("Acessando e alterando propriedades do objeto...");
      const sim = this.model.simulateVillage(code, step);

      if (!sim.ok) {
        this.view.logTerminal(`[ERRO NO OBJETO] ${sim.error}`, true);
        this.view.setGuideState(
          `Erro ao acessar objeto: ${sim.error}`,
          "warning",
        );
        return;
      }

      this.view.renderVillage(sim.houseObj);
      this.view.logTerminal(`Propriedades: ${JSON.stringify(sim.houseObj)}`);
      this.view.updateTelemetry("casa.prop", "{}", "atualizado", 1);

      if (sim.isSuccess) {
        this.handleMissionSuccess(step);
      } else {
        this.view.setGuideState(
          "Propriedades ou método não correspondem ao objetivo da missão!",
          "warning",
        );
      }
    }

    // 4. JSON JUNGLE
    else if (actIndex === 3) {
      this.view.logTerminal("Validando sintaxe JSON no analisador estrito...");
      const sim = this.model.simulateJson(code, step);

      if (!sim.ok) {
        this.view.renderJsonJungle({}, true, sim.error);
        this.view.logTerminal(`[ERRO JSON] ${sim.error}`, true);
        this.view.setGuideState(
          `Erro de sintaxe JSON: Verifique aspas duplas e vírgulas!`,
          "warning",
        );
        return;
      }

      this.view.renderJsonJungle(sim.parsedObj, false);
      this.view.logTerminal(
        `JSON validado com sucesso! Estrutura: ${JSON.stringify(sim.parsedObj)}`,
      );
      this.view.updateTelemetry("JSON", "parse/stringify", "Válido", 1);

      if (sim.isSuccess) {
        this.handleMissionSuccess(step);
      } else {
        this.view.setGuideState(
          "A estrutura JSON não retornou o formato esperado.",
          "warning",
        );
      }
    }
  }

  handleMissionSuccess(step) {
    this.model.addXP(100);
    this.view.renderHUD(this.model.xp);
    this.view.setGuideState(
      "🎉 Excelente! Operação realizada com sucesso no motor JS.",
      "happy",
    );

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
    // 2. Próxima atividade do Mundo 4
    else if (
      this.model.activeActivityIndex <
      this.model.activities.length - 1
    ) {
      alert("🏆 Atividade concluída! Carregando a próxima etapa do Mundo 4...");
      this.model.activeActivityIndex++;
      this.model.activeStepIndex = 0;
      this.refreshUI();
    }
    // 3. FINALIZA O MUNDO 4 E ABRE O MODAL DE VITÓRIA
    else {
      this.model.saveWorldCompletion();
      this.view.setGuideState(
        "🎉 PARABÉNS! Você dominou o Mundo 4 e conquistou a medalha de Mestre das Coleções e Objetos!",
        "happy",
      );
      this.view.showWorldVictory(this.model.xp);
    }
  }
}
