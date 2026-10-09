/**
 * JS QUEST - MUNDO 2: VIEW
 */
class Mundo2View {
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

    this.cycleCounter = document.getElementById("cycle-counter");
    this.telemetryStatus = document.getElementById("telemetry-status");
    this.telemetryCounter = document.getElementById("telemetry-counter");
    this.telemetryCondition = document.getElementById("telemetry-condition");

    // Modal de Explicação
    this.modalExplainEl = document.getElementById("modalExplanation");
    this.bsModalExplain =
      this.modalExplainEl && window.bootstrap
        ? new bootstrap.Modal(this.modalExplainEl)
        : null;
    this.explainScenarioText = document.getElementById("explain-scenario-text");
    this.explainEngineText = document.getElementById("explain-engine-text");
    this.explainRuleText = document.getElementById("explain-rule-text");

    // Modal de Vitória Final do Mundo 2 🏆
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
      btn.className = `btn btn-sm font-monospace text-nowrap ${idx === activeIdx ? "btn-info fw-bold" : "btn-outline-secondary"}`;
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
        this.robotMood.textContent = "Bit: Alerta";
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
      this.victoryXpBadge.innerHTML = `<i class="bi bi-lightning-charge-fill"></i> +${totalXp || 400} XP Ganho`;
    }
    if (!this.bsModalVictory && this.modalVictoryEl && window.bootstrap) {
      this.bsModalVictory = new bootstrap.Modal(this.modalVictoryEl);
    }
    if (this.bsModalVictory) {
      this.bsModalVictory.show();
    }
  }

  updateTelemetry(
    iterations,
    counterText,
    conditionText,
    statusText = "Em Execução",
  ) {
    if (this.cycleCounter)
      this.cycleCounter.textContent = `Iterações: ${iterations}`;
    if (this.telemetryCounter) this.telemetryCounter.textContent = counterText;
    if (this.telemetryCondition)
      this.telemetryCondition.textContent = conditionText;
    if (this.telemetryStatus) this.telemetryStatus.textContent = statusText;
  }

  renderMission(activity, stepIndex, totalSteps) {
    const step = activity.steps[stepIndex];
    if (this.activityId) this.activityId.textContent = activity.id;
    if (this.activityTitle) this.activityTitle.textContent = activity.title;
    if (this.missionStep)
      this.missionStep.textContent = `Missão ${stepIndex + 1}/${totalSteps}`;
    if (this.manualContent) this.manualContent.innerHTML = activity.manual;
    this.setGuideState(step.guideSpeech, "normal");

    // Preenche o editor com o código da missão
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

  renderMaze(
    gridSize,
    walls,
    robotState,
    target,
    collisionTile = null,
    hasBumped = false,
  ) {
    this.stage.innerHTML = "";
    const container = document.createElement("div");
    container.className = "maze-board";
    container.style.gridTemplateColumns = `repeat(${gridSize}, 52px)`;

    const dirIcons = ["👆", "👉", "👇", "👈"];

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement("div");
        cell.className = "maze-tile";
        const key = `${x},${y}`;

        if (walls.includes(key)) {
          cell.classList.add("wall");
          cell.innerHTML = "🧱";
          if (collisionTile && collisionTile.x === x && collisionTile.y === y) {
            cell.classList.add("wall-hit");
            cell.innerHTML = "💥";
          }
        } else if (target.x === x && target.y === y) {
          cell.classList.add("target");
          cell.innerHTML = "💎";
        }

        if (robotState.x === x && robotState.y === y) {
          cell.innerHTML = `<span class="maze-robot ${hasBumped ? "robot-bump" : ""}">${dirIcons[robotState.dir]}</span>`;
          cell.style.backgroundColor = hasBumped
            ? "rgba(239, 68, 68, 0.3)"
            : "rgba(13, 110, 253, 0.25)";
        }

        container.appendChild(cell);
      }
    }
    this.stage.appendChild(container);
  }

  renderElevator(currentFloor, maxFloors = 6, isShaking = false) {
    this.stage.innerHTML = `
      <div class="elevator-shaft">
        <div class="building-floors">
          ${Array.from({ length: maxFloors }, (_, i) => i + 1)
            .map(
              (f) => `
            <div class="floor-row ${f === currentFloor ? "active-floor" : ""}">
              <span class="text-secondary">${f}º Andar</span>
              <span class="badge ${f === currentFloor ? "bg-info text-dark" : "bg-dark"}">${f === currentFloor ? "AQUI" : ""}</span>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="cabin ${isShaking ? "elevator-shake" : ""}">
          <i class="bi bi-person-fill fs-3 text-warning"></i>
          <span class="font-monospace small text-white">${currentFloor}º Andar</span>
        </div>
      </div>
      ${
        isShaking
          ? `
        <div class="mt-3 text-center">
          <button class="btn btn-danger btn-sm font-monospace fw-bold shadow pulse-play" id="btn-elevator-help">
            🚨 BOTÃO SOCORRO: LOOP INFINITO DETECTADO!
          </button>
        </div>
      `
          : ""
      }
    `;
  }

  renderTraffic(lightColor, isCarMoving = false) {
    this.stage.innerHTML = `
      <div class="crossroad-box">
        <div class="traffic-light-housing">
          <div class="light-bulb red ${lightColor === "red" ? "on" : ""}"></div>
          <div class="light-bulb yellow ${lightColor === "yellow" ? "on" : ""}"></div>
          <div class="light-bulb green ${lightColor === "green" ? "on" : ""}"></div>
        </div>
        <div class="road-simulation">
          <div class="traffic-car ${isCarMoving ? "car-driving" : ""}">
            ${lightColor === "green" ? "🚗 💨" : "🚗 🛑"}
          </div>
          <div class="fs-2">
            ${lightColor === "red" ? "🚶‍♂️ ✅" : "🚶‍♂️ ⛔"}
          </div>
        </div>
        <span class="badge ${lightColor === "green" ? "bg-success" : "bg-danger"} font-monospace fs-6">
          Sinal: ${lightColor.toUpperCase()}
        </span>
      </div>
    `;
  }

  renderWorkshop(robotWorking, isSmoking = false) {
    this.stage.innerHTML = `
      <div class="workshop-bay ${isSmoking ? "smoke-alarm" : ""}">
        <div class="fs-1">${isSmoking ? "💥 🚨" : "🤖 ⚙️"}</div>
        <h6 class="text-warning font-monospace mb-1">BANCADA DE TESTE DO ROBÔ</h6>
        <div class="badge ${isSmoking ? "bg-danger" : "bg-success"} font-monospace">
          ${isSmoking ? "SUPER-AQUECIMENTO (LOOP INFINITO)" : "OPERANDO NORMALMENTE"}
        </div>
        <p class="text-light small text-center mb-0">
          ${isSmoking ? "O robô está preso em um laço infinito que nunca atinge a condição de parada!" : "Analise as variáveis no terminal abaixo."}
        </p>
      </div>
    `;
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
