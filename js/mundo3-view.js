/**
 * JS QUEST - MUNDO 3: VIEW COM SUPORTE TOTAL A ANIMAÇÕES
 */
class Mundo3View {
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

    // Modal de Vitória Final do Mundo 3 🏆
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

  updateTelemetry(fnName, argsText, returnText, stackCount = 1) {
    if (this.stackCounter)
      this.stackCounter.textContent = `Call Stack: ${stackCount} frame(s)`;
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
  // JOGO 9: RENDER MÁQUINA DE TRANSFORMAR
  // ==========================================
  renderMachine(
    inputVals = [4, 6],
    outputVal = "__EMPTY__",
    isProcessing = false,
  ) {
    const isCalculated = outputVal !== "__EMPTY__";
    const isUndefined = isCalculated && outputVal === undefined;

    this.stage.innerHTML = `
      <div class="transform-conveyor">
        <!-- ESTEIRA DE ENTRADA -->
        <div class="conveyor-track">
          <div class="cargo-box ${isProcessing ? "box-slide-in" : ""}">
            <span class="small" style="font-size:0.65rem;">ENTRADA</span>
            <span>${Array.isArray(inputVals) ? inputVals.join(", ") : inputVals}</span>
          </div>
        </div>

        <!-- MÁQUINA DE PROCESSAMENTO -->
        <div class="machine-core ${isProcessing ? "active-processing" : ""}">
          <i class="bi bi-gear-wide-connected fs-1 text-warning"></i>
          <span class="font-monospace small text-white mt-1">function()</span>
          <span class="badge bg-purple mt-1" style="font-size:0.65rem; background:#7c3aed;">return</span>
          ${isUndefined ? '<div class="smoke-puff">💨</div>' : ""}
        </div>

        <!-- ESTEIRA DE SAÍDA -->
        <div class="conveyor-track">
          ${
            isCalculated
              ? isUndefined
                ? `
              <div class="cargo-box undefined-box box-slide-out">
                <span class="small" style="font-size:0.65rem;">SEM RETURN!</span>
                <span class="text-warning">undefined</span>
              </div>
            `
                : `
              <div class="cargo-box output-box box-slide-out">
                <span class="small" style="font-size:0.65rem;">PRODUTO</span>
                <span>${outputVal}</span>
              </div>
            `
              : `
            <span class="text-secondary font-monospace small">Aguardando...</span>
          `
          }
        </div>
      </div>
    `;
  }

  // ==========================================
  // JOGO 10: RENDER CAVERNA DOS ESCOPOS
  // ==========================================
  renderScopeTower(hasAccess = true, isClosure = false, counterVal = 1) {
    this.stage.innerHTML = `
      <div class="scope-tower">
        <div class="scope-room global-room">
          <span class="badge bg-primary font-monospace mb-1">ESCOPO GLOBAL (Salão Principal)</span>
          <div class="d-flex gap-2">
            <div class="chest-item">📦 nomeReino = "JS"</div>
            ${isClosure ? `<div class="chest-item text-success backpack-glow">🎒 Mochila Closure: contador = ${counterVal}</div>` : ""}
          </div>

          <div class="scope-room function-room mt-2">
            <span class="badge font-monospace mb-1" style="background:#7c3aed;">ESCOPO DE FUNÇÃO (Sala Particular)</span>
            <div class="d-flex gap-2">
              <div class="chest-item ${hasAccess ? "chest-unlocked" : "locked-alarm"}">
                ${hasAccess ? '🗝️ chaveSecreta = "CHAVE-42"' : "🔒 chaveSecreta (Bloqueado Externamente!)"}
              </div>
            </div>

            <div class="scope-room block-room mt-2">
              <span class="badge bg-warning text-dark font-monospace mb-1">ESCOPO DE BLOCO { }</span>
              <div class="chest-item">💎 let tesouroBloco = "Ouro"</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // JOGO 11: RENDER CALL STACK (LIFO)
  // ==========================================
  renderCallStack(frames = [], isOverflow = false) {
    this.stage.innerHTML = `
      <div class="call-stack-container">
        <span class="badge bg-secondary font-monospace mb-1">TORRE DA CALL STACK (LIFO)</span>
        <div class="stack-base ${isOverflow ? "stack-overflow-alarm" : ""}">
          ${frames
            .map(
              (frame, idx) => `
            <div class="stack-frame ${idx === frames.length - 1 ? "top-frame" : ""}">
              <span class="text-warning small">${idx + 1}.</span>
              <span class="text-light font-monospace">${frame}</span>
              ${idx === frames.length - 1 ? '<span class="badge bg-warning text-dark" style="font-size:0.6rem;">TOPO</span>' : ""}
            </div>
          `,
            )
            .join("")}
          ${frames.length === 0 ? '<div class="text-secondary font-monospace small text-center my-auto">Pilha vazia. Chame uma função!</div>' : ""}
        </div>
        ${
          isOverflow
            ? `
          <div class="badge bg-danger fs-6 p-2 font-monospace shadow pulse-play mt-1">
            💥 RangeError: Maximum call stack size exceeded!
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  // ==========================================
  // JOGO 12: RENDER FÁBRICA DE ARROW FUNCTIONS
  // ==========================================
  renderArrowFactory(
    syntaxText = "const somar = (a, b) => a + b;",
    isCompact = true,
    outputText = "12",
    isSmoking = false,
  ) {
    this.stage.innerHTML = `
      <div class="arrow-press-chamber">
        <div class="piston-press">⬇️ ⚙️</div>
        <div class="d-flex justify-content-between align-items-center w-100 mb-1">
          <span class="badge text-white font-monospace" style="background:#ec4899;">PRENSA DE ARROW FUNCTIONS</span>
          <span class="badge ${isCompact ? "bg-success" : "bg-secondary"} font-monospace">
            ${isCompact ? "SINTAXE COMPACTADA" : "TRADICIONAL"}
          </span>
        </div>

        <div class="syntax-display ${isCompact ? "folded-compact" : ""}">
          <code>${syntaxText}</code>
        </div>

        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-dark border border-secondary font-monospace">Resultado em Saída:</span>
          <span class="badge ${isSmoking ? "bg-secondary" : "bg-success"} font-monospace fs-6 px-3 py-1">
            ${outputText}
          </span>
        </div>
        ${isSmoking ? '<div class="small text-danger font-monospace">⚠️ Bloco com chaves {} sem a palavra return devolve undefined!</div>' : ""}
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
