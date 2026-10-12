/**
 * JS QUEST - MUNDO 5: VIEW COM SUPORTE ROBUSTO AO DOM E ORIENTAÇÃO VISUAL
 */
class Mundo5View {
  constructor() {
    this.stage = document.getElementById("game-stage");
    this.terminal = document.getElementById("v8-terminal");
    this.hudXP = document.getElementById("hud-xp");
    this.phaseNav = document.getElementById("phase-nav");
    this.activityId = document.getElementById("activity-id");
    this.activityTitle = document.getElementById("activity-title");
    this.missionStep = document.getElementById("mission-step");
    this.robotAvatar = document.getElementById("robot-avatar");
    this.robotMood = document.getElementById("robot-mood");
    this.guideSpeech = document.getElementById("guide-speech");
    this.commandDeck = document.getElementById("command-deck");
    this.codeInput = document.getElementById("code-input");
    this.manualContent = document.getElementById("manual-content");

    this.stackCounter = document.getElementById("stack-counter");
    this.telemetryFn = document.getElementById("telemetry-fn");
    this.telemetryArgs = document.getElementById("telemetry-args");
    this.telemetryReturn = document.getElementById("telemetry-return");

    // Modal de Explicação
    this.modalExplainEl = document.getElementById("modalExplanation");
    this.bsModalExplain =
      this.modalExplainEl && window.bootstrap
        ? new bootstrap.Modal(this.modalExplainEl)
        : null;
    this.explainScenarioText = document.getElementById("explain-scenario-text");
    this.explainEngineText = document.getElementById("explain-engine-text");
    this.explainRuleText = document.getElementById("explain-rule-text");

    // Modal de Vitória Final do Mundo 5
    this.modalVictoryEl = document.getElementById("modalWorldVictory");
    this.bsModalVictory =
      this.modalVictoryEl && window.bootstrap
        ? new bootstrap.Modal(this.modalVictoryEl)
        : null;
    this.victoryXpBadge = document.getElementById("victory-xp-badge");
  }

  renderHUD(xp) {
    if (this.hudXP) {
      this.hudXP.innerHTML = `<i class="bi bi-lightning-charge-fill"></i> ${xp} XP`;
    }
  }

  renderNavigation(activities, activeIdx) {
    if (!this.phaseNav) return;
    this.phaseNav.innerHTML = "";
    activities.forEach((act, idx) => {
      const btn = document.createElement("button");
      btn.className = `btn btn-sm font-monospace text-nowrap ${idx === activeIdx ? "btn-danger fw-bold" : "btn-outline-secondary"}`;
      btn.dataset.index = idx;
      btn.innerHTML = `<i class="bi bi-play-circle"></i> ${act.id}: ${act.title.split(" ")[0]}`;
      this.phaseNav.appendChild(btn);
    });
  }

  setGuideState(text, mood = "normal") {
    if (this.guideSpeech) this.guideSpeech.innerHTML = text;
    if (!this.robotAvatar) return;

    this.robotAvatar.className = "robot-avatar";
    if (mood === "happy") {
      this.robotAvatar.textContent = "🥳";
      this.robotAvatar.classList.add("happy");
      if (this.robotMood) {
        this.robotMood.textContent = "Bit: Sucesso!";
        this.robotMood.className = "badge bg-success font-monospace mt-1";
      }
    } else if (mood === "warning") {
      this.robotAvatar.textContent = "🧐";
      this.robotAvatar.classList.add("warning");
      if (this.robotMood) {
        this.robotMood.textContent = "Bit: Atenção!";
        this.robotMood.className =
          "badge bg-warning text-dark font-monospace mt-1";
      }
    } else {
      this.robotAvatar.textContent = "🤖";
      if (this.robotMood) {
        this.robotMood.textContent = "Bit (Mentor)";
        this.robotMood.className = "badge bg-secondary font-monospace mt-1";
      }
    }
  }

  showExplanation(explanationData) {
    if (!explanationData) return;
    if (this.explainScenarioText)
      this.explainScenarioText.innerHTML = explanationData.scenario || "";
    if (this.explainEngineText)
      this.explainEngineText.innerHTML = explanationData.engine || "";
    if (this.explainRuleText)
      this.explainRuleText.innerHTML = explanationData.rule || "";

    if (!this.bsModalExplain && this.modalExplainEl && window.bootstrap) {
      this.bsModalExplain = new bootstrap.Modal(this.modalExplainEl);
    }
    if (this.bsModalExplain) this.bsModalExplain.show();
  }

  hideExplanation() {
    if (this.bsModalExplain) this.bsModalExplain.hide();
  }

  showWorldVictory(totalXp) {
    if (this.victoryXpBadge) {
      this.victoryXpBadge.innerHTML = `<i class="bi bi-lightning-charge-fill"></i> +${totalXp || 300} XP Ganho`;
    }
    if (!this.bsModalVictory && this.modalVictoryEl && window.bootstrap) {
      this.bsModalVictory = new bootstrap.Modal(this.modalVictoryEl);
    }
    if (this.bsModalVictory) this.bsModalVictory.show();
  }

  updateTelemetry(fnName, argsText, returnText, nodeCount = 1) {
    if (this.stackCounter)
      this.stackCounter.textContent = `Nós no DOM: ${nodeCount}`;
    if (this.telemetryFn) this.telemetryFn.textContent = fnName;
    if (this.telemetryArgs) this.telemetryArgs.textContent = argsText;
    if (this.telemetryReturn) this.telemetryReturn.textContent = returnText;
  }

  renderMission(activity, stepIndex, totalSteps) {
    const step = activity.steps[stepIndex];
    if (this.activityId) this.activityId.textContent = activity.id;
    if (this.activityTitle) this.activityTitle.textContent = activity.title;
    if (this.missionStep)
      this.missionStep.textContent = `Missão ${stepIndex + 1}/${totalSteps}`;
    if (this.manualContent) this.manualContent.innerHTML = activity.manual;
    this.setGuideState(step.guideSpeech, "normal");

    if (this.codeInput) {
      this.codeInput.value = step.initialCode || "";
    }

    if (!this.commandDeck) return;
    this.commandDeck.innerHTML = "";

    step.commands.forEach((cmd, cmdIdx) => {
      const card = document.createElement("div");
      card.className =
        "command-chip d-flex justify-content-between align-items-center gap-2";

      const infoDiv = document.createElement("div");
      infoDiv.className = "overflow-hidden";

      const codeSpan = document.createElement("div");
      codeSpan.className =
        "fw-bold text-warning font-monospace small text-truncate";
      codeSpan.textContent = cmd.code.split("\n")[0];

      const labelSpan = document.createElement("div");
      labelSpan.className = "text-secondary small";
      labelSpan.style.fontSize = "0.75rem";
      labelSpan.textContent = cmd.label;

      infoDiv.appendChild(codeSpan);
      infoDiv.appendChild(labelSpan);

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "d-flex gap-1";

      const insertBtn = document.createElement("button");
      insertBtn.className =
        "btn btn-sm btn-outline-info py-0 px-2 font-monospace btn-insert-chip";
      insertBtn.dataset.cmdIdx = cmdIdx;
      insertBtn.textContent = "+ Aplicar";

      actionsDiv.appendChild(insertBtn);
      card.appendChild(infoDiv);
      card.appendChild(actionsDiv);
      this.commandDeck.appendChild(card);
    });
  }

  // ==========================================
  // JOGO 17: DOM DUNGEON (CASTELO)
  // ==========================================
  renderDungeon(state) {
    this.stage.innerHTML = `
      <div class="dungeon-castle">
        <div class="d-flex justify-content-between align-items-center w-100">
          <span class="badge bg-secondary font-monospace"><i class="bi bi-shield-shaded"></i> CASTELO DOM</span>
          <span class="badge bg-dark border border-danger text-danger font-monospace">id="dungeon-room"</span>
        </div>

        <div class="dungeon-room" id="dungeon-room">
          <!-- Tocha -->
          <div class="text-center">
            <div id="torch" class="torch-item ${state.isTorchLit ? "lit" : ""}">🔥</div>
            <span class="badge bg-dark border border-secondary font-monospace small mt-1">#torch</span>
          </div>

          <!-- Porta -->
          <div class="text-center">
            <div id="castle-door" class="dungeon-door ${state.isDoorOpen ? "open" : ""}">
              <span>${state.isDoorOpen ? "🔓" : "🔒"}</span>
            </div>
            <span class="badge bg-dark border border-secondary font-monospace small mt-1">#castle-door</span>
          </div>

          <!-- Guardião (preservado pelo estado) -->
          ${
            state.mobSpawned
              ? `
            <div id="guardian-mob" class="dungeon-mob">
              <span>👾 Guardião Ativo!</span>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  }

  // ==========================================
  // JOGO 18: CAÇA AOS EVENTOS (RADAR)
  // ==========================================
  renderEventRadar(
    eventType = "click",
    isRevealed = false,
    actionText = "Aguardando código...",
  ) {
    this.stage.innerHTML = `
      <div class="event-radar-field text-center">
        <div class="badge bg-secondary font-monospace">RADAR SENSORIAL DE EVENTOS</div>

        <!-- Instrução clara e destacada -->
        <div class="alert alert-info py-2 px-3 mb-1 font-monospace small border-info shadow pulse-callout">
          <i class="bi bi-info-circle-fill"></i> <strong>AÇÃO NECESSÁRIA:</strong> ${actionText}
        </div>

        <div id="event-rune" class="interactive-rune ${isRevealed ? "revealed" : ""}">
          <span class="rune-icon">${isRevealed ? "✨" : "🔮"}</span>
          <h5 class="fw-bold text-light mt-2 mb-1">${isRevealed ? "SEGREDO DESBLOQUEADO!" : "Runa Mística"}</h5>
          <span class="badge bg-dark border border-warning text-warning font-monospace">
            Evento: '${eventType}'
          </span>
        </div>
      </div>
    `;
  }

  // ==========================================
  // JOGO 19: CONSTRUTOR DE MINIAPPS
  // ==========================================
  renderMiniApp(appType = "counter", appState = { count: 0, items: [] }) {
    if (appType === "counter") {
      this.stage.innerHTML = `
        <div class="miniapp-live-card text-center">
          <span class="badge bg-info text-dark font-monospace mb-2">MINIAPP: CONTADOR INTERATIVO</span>
          <h2 id="counter-display" class="display-3 fw-bold font-monospace text-warning my-2">${appState.count}</h2>
          <div class="d-flex justify-content-center gap-3 mt-3">
            <button id="btn-dec" class="btn btn-outline-danger px-4 font-monospace fs-5">- 1</button>
            <button id="btn-inc" class="btn btn-success px-4 font-monospace fs-5">+ 1</button>
          </div>
        </div>
      `;
    } else {
      this.stage.innerHTML = `
        <div class="miniapp-live-card">
          <span class="badge bg-success font-monospace mb-2">MINIAPP: LISTA DE TAREFAS (TODO)</span>
          <div class="input-group mb-2">
            <input type="text" id="todo-input" class="form-control bg-dark text-light border-secondary font-monospace" placeholder="Nova missão...">
            <button id="btn-add-todo" class="btn btn-info font-monospace fw-bold">+ Adicionar</button>
          </div>
          <ul id="todo-list" class="todo-list-ui">
            ${appState.items
              .map(
                (it, idx) => `
              <li class="todo-item-ui">
                <span>📌 ${it}</span>
                <span class="badge bg-secondary">#${idx + 1}</span>
              </li>
            `,
              )
              .join("")}
          </ul>
        </div>
      `;
    }
  }

  logTerminal(msg, isError = false) {
    if (!this.terminal) return;
    const p = document.createElement("div");
    p.className = isError ? "text-danger" : "text-success";
    p.textContent = `> ${msg}`;
    this.terminal.appendChild(p);
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  clearTerminal() {
    if (this.terminal) this.terminal.innerHTML = "";
  }
}
