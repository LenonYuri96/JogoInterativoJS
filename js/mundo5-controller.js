/**
 * JS QUEST - MUNDO 5: CONTROLLER COM VALIDAÇÃO PRECISA E FEEDBACK INTERATIVO
 */
class Mundo5Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.dungeonState = {
      isDoorOpen: false,
      isTorchLit: false,
      mobSpawned: false,
    };
    this.appState = {
      count: 0,
      items: ["Explorar o DOM", "Adicionar Ouvintes"],
    };
    this.isListenerArmed = false;
    this.init();
  }

  init() {
    this.bindEvents();
    this.refreshUI();
  }

  bindEvents() {
    // 1. Botão "Como Funciona?"
    const btnExplainLogic = document.getElementById("btn-explain-logic");
    if (btnExplainLogic) {
      btnExplainLogic.addEventListener("click", () => {
        const step = this.model.getCurrentStep();
        if (step && step.explanation) {
          this.view.showExplanation(step.explanation);
        }
      });
    }

    // 2. Botões da Barra de Vitória
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

    // 3. Botão no Modal
    const btnModalNext = document.getElementById("btn-modal-next-mission");
    if (btnModalNext) {
      btnModalNext.addEventListener("click", () => {
        this.view.hideExplanation();
        this.advanceToNextStep();
      });
    }

    // 4. Executar Código
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
          "Código sugerido restaurado no editor!",
          "normal",
        );
      });
    }

    // 7. Chips de Código (+ Aplicar)
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
              "Código aplicado! Agora clique no botão verde <strong>EXECUTAR CÓDIGO ▶</strong>.",
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
    this.isListenerArmed = false;

    this.view.renderHUD(this.model.xp);
    this.view.renderNavigation(
      this.model.activities,
      this.model.activeActivityIndex,
    );
    this.view.renderMission(act, this.model.activeStepIndex, act.steps.length);
    this.view.updateTelemetry("document", "selector", "pronto", 3);

    const victoryBar = document.getElementById("mission-success-bar");
    if (victoryBar) victoryBar.classList.add("d-none");

    // ==========================================
    // RENDERIZAÇÃO INICIAL DE CADA ATIVIDADE
    // ==========================================
    if (this.model.activeActivityIndex === 0) {
      this.view.renderDungeon(this.dungeonState);
    } else if (this.model.activeActivityIndex === 1) {
      this.view.renderEventRadar(
        step.eventType || "click",
        false,
        "1º Execute o código abaixo para ligar o sensor!",
      );
    } else if (this.model.activeActivityIndex === 2) {
      this.view.renderMiniApp(step.appKind || "counter", this.appState);
      this.attachMiniappListeners();
    }
  }

  attachMiniappListeners() {
    const btnInc = document.getElementById("btn-inc");
    const btnDec = document.getElementById("btn-dec");
    const counterDisplay = document.getElementById("counter-display");

    if (btnInc && counterDisplay) {
      btnInc.addEventListener("click", () => {
        this.appState.count++;
        counterDisplay.textContent = this.appState.count;
      });
    }

    if (btnDec && counterDisplay) {
      btnDec.addEventListener("click", () => {
        this.appState.count--;
        counterDisplay.textContent = this.appState.count;
      });
    }

    const btnAdd = document.getElementById("btn-add-todo");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");

    if (btnAdd && todoInput && todoList) {
      btnAdd.addEventListener("click", () => {
        if (!todoInput.value.trim()) return;
        const li = document.createElement("li");
        li.className = "todo-item-ui";
        li.innerHTML = `<span>📌 ${todoInput.value.trim()}</span><span class="badge bg-secondary">novo</span>`;
        todoList.appendChild(li);
        todoInput.value = "";
      });
    }
  }

  runSimulation(code) {
    if (!code || !code.trim()) {
      this.view.setGuideState(
        "O editor está vazio! Digite o comando ou clique em + Aplicar.",
        "warning",
      );
      return;
    }

    this.view.clearTerminal();
    const actIndex = this.model.activeActivityIndex;
    const step = this.model.getCurrentStep();

    // 1. TENTA EXECUTAR O SCRIPT REAL
    try {
      this.model.runScript(code);
    } catch (err) {
      this.view.logTerminal(`[ERRO DE SCRIPT] ${err.message}`, true);
      this.view.setGuideState(`Erro de JavaScript: ${err.message}`, "warning");
      return;
    }

    // ==========================================
    // ATIVIDADE 17: DOM DUNGEON (VALIDAÇÃO VISUAL)
    // ==========================================
    if (actIndex === 0) {
      // Missão 1: Abrir Porta
      if (step.targetAction === "doorOpen") {
        const door = document.querySelector("#castle-door");
        if (door && door.classList.contains("open")) {
          this.dungeonState.isDoorOpen = true;
          this.view.logTerminal(
            "Porta destrancada: classList.add('open') ativado!",
          );
          this.view.updateTelemetry(
            "classList.add",
            "'open'",
            "Destrancada",
            3,
          );
          this.handleMissionSuccess(step);
          return;
        }
      }
      // Missão 2: Acender Tocha
      else if (step.targetAction === "torchLit") {
        const torch = document.querySelector("#torch");
        if (torch && torch.classList.contains("lit")) {
          this.dungeonState.isTorchLit = true;
          this.view.logTerminal(
            "Tocha acesa: classList.toggle('lit') ativado!",
          );
          this.view.updateTelemetry("classList.toggle", "'lit'", "Acesa", 3);
          this.handleMissionSuccess(step);
          return;
        }
      }
      // Missão 3: Invocar Guardião (appendChild)
      else if (step.targetAction === "spawnMob") {
        const mob = document.querySelector("#guardian-mob");
        if (mob) {
          this.dungeonState.mobSpawned = true;
          this.view.logTerminal(
            "Guardião 👾 invocado e adicionado ao castelo!",
          );
          this.view.updateTelemetry(
            "appendChild",
            "guardian-mob",
            "Renderizado",
            4,
          );
          this.handleMissionSuccess(step);
          return;
        }
      }

      this.view.setGuideState(
        "O código rodou, mas o elemento não sofreu a alteração necessária.",
        "warning",
      );
    }

    // ==========================================
    // ATIVIDADE 18: CAÇA AOS EVENTOS (EM DUAS FASES)
    // ==========================================
    else if (actIndex === 1) {
      const rune = document.querySelector("#event-rune");
      if (!rune) return;

      this.isListenerArmed = true;
      const expectedEvt = step.eventType; // 'click' ou 'mouseover'

      this.view.logTerminal(
        `Sensor ativado com addEventListener('${expectedEvt}').`,
      );
      this.view.renderEventRadar(expectedEvt, false, step.actionInstruction);

      // Re-liga o ouvinte com a validação completa da missão
      const activeRune = document.querySelector("#event-rune");
      activeRune.addEventListener(
        expectedEvt,
        () => {
          if (!this.isListenerArmed) return;

          activeRune.classList.add("revealed");
          activeRune.querySelector(".rune-icon").textContent = "✨";
          activeRune.querySelector("h5").textContent = "SEGREDO DESBLOQUEADO!";

          this.view.logTerminal(
            `Evento [${expectedEvt}] capturado pelo navegador com sucesso!`,
          );
          this.view.updateTelemetry(
            "addEventListener",
            `'${expectedEvt}'`,
            "Disparado!",
            1,
          );
          this.handleMissionSuccess(step);
        },
        { once: true },
      );

      if (expectedEvt === "click") {
        this.view.setGuideState(
          "👉 <strong>Agora clique com o mouse em cima da runa no palco central!</strong>",
          "warning",
        );
      } else if (expectedEvt === "mouseover") {
        this.view.setGuideState(
          "👉 <strong>Agora passe o mouse por cima da runa no palco central!</strong> (Não precisa clicar)",
          "warning",
        );
      }
    }

    // ==========================================
    // ATIVIDADE 19: MINIAPPS
    // ==========================================
    else if (actIndex === 2) {
      if (step.appKind === "counter") {
        const display = document.querySelector("#counter-display");
        if (display && display.textContent !== "0") {
          this.view.logTerminal(
            `Contador sincronizado com sucesso: ${display.textContent}`,
          );
          this.handleMissionSuccess(step);
          return;
        }
      } else if (step.appKind === "todo") {
        const list = document.querySelector("#todo-list");
        if (list && list.children.length > 2) {
          this.view.logTerminal("Novo item <li> anexado à lista com sucesso!");
          this.handleMissionSuccess(step);
          return;
        }
      }

      this.view.setGuideState(
        "Verifique se alterou o textContent ou se usou appendChild.",
        "warning",
      );
    }
  }

  handleMissionSuccess(step) {
    this.model.addXP(100);
    this.view.renderHUD(this.model.xp);
    this.view.setGuideState(
      "🎉 Sucesso! A ação e a manipulação do DOM funcionaram perfeitamente.",
      "happy",
    );

    const victoryBar = document.getElementById("mission-success-bar");
    if (victoryBar) victoryBar.classList.remove("d-none");
  }

  advanceToNextStep() {
    const act = this.model.getCurrentActivity();

    // 1. Próxima missão dentro da mesma atividade
    if (this.model.activeStepIndex < act.steps.length - 1) {
      this.model.activeStepIndex++;
      this.refreshUI();
    }
    // 2. Próxima atividade do Mundo 5
    else if (
      this.model.activeActivityIndex <
      this.model.activities.length - 1
    ) {
      alert("🏆 Atividade concluída! Carregando a próxima etapa do Mundo 5...");
      this.model.activeActivityIndex++;
      this.model.activeStepIndex = 0;
      this.refreshUI();
    }
    // 3. Finalização do Mundo 5
    else {
      this.model.saveWorldCompletion();
      this.view.setGuideState(
        "🎉 PARABÉNS! Você dominou o Mundo 5 e conquistou a medalha de Mestre do DOM e Eventos!",
        "happy",
      );
      this.view.showWorldVictory(this.model.xp);
    }
  }
}
