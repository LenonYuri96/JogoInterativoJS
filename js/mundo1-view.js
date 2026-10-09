/**
 * JS QUEST - MUNDO 1: VIEW
 */
class Mundo1View {
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

    this.ramTableBody = document.getElementById("ram-table-body");
    this.ramCount = document.getElementById("ram-count");

    // Modal de Explicação
    this.modalExplainEl = document.getElementById("modalExplanation");
    this.bsModalExplain =
      this.modalExplainEl && window.bootstrap
        ? new bootstrap.Modal(this.modalExplainEl)
        : null;
    this.explainScenarioText = document.getElementById("explain-scenario-text");
    this.explainEngineText = document.getElementById("explain-engine-text");
    this.explainRuleText = document.getElementById("explain-rule-text");

    // Modal de Vitória Final do Mundo 1 🏆
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

  renderRAMTable(ramMap) {
    if (!this.ramTableBody) return;
    if (this.ramCount)
      this.ramCount.textContent = `${ramMap.size} Variáveis Alocadas`;

    if (ramMap.size === 0) {
      this.ramTableBody.innerHTML =
        '<tr><td colspan="6" class="text-center text-muted fst-italic">Memória vazia. Insira código para alocar slots.</td></tr>';
      return;
    }

    this.ramTableBody.innerHTML = "";
    ramMap.forEach((entry) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="text-info">${entry.addr}</td>
        <td class="text-warning fw-bold">${entry.name}</td>
        <td><span class="badge ${entry.kind === "const" ? "bg-danger" : "bg-primary"}">${entry.kind}</span></td>
        <td class="text-light">${entry.type}</td>
        <td class="text-success fw-bold">${entry.val}</td>
        <td>${entry.isLocked ? '<i class="bi bi-lock-fill text-danger"></i> Trancada' : '<i class="bi bi-unlock text-success"></i> Aberta'}</td>
      `;
      this.ramTableBody.appendChild(tr);
    });
  }

  renderStage(activityIndex, ramMap, lastError, lastLogs) {
    if (!this.stage) return;
    this.stage.innerHTML = "";

    // ==========================================
    // ATIVIDADE 1: CAIXAS DE MEMÓRIA FÍSICA
    // ==========================================
    if (activityIndex === 0) {
      const grid = document.createElement("div");
      grid.className = "ram-slot-grid";

      if (ramMap.size === 0) {
        grid.innerHTML =
          '<div class="text-secondary font-monospace text-center"><i class="bi bi-box-seam fs-1 d-block mb-1"></i>Nenhuma caixa na RAM ainda.<br>Clique no botão verde acima para executar!</div>';
      } else {
        ramMap.forEach((entry) => {
          const box = document.createElement("div");
          const isErrorOnThis = lastError && lastError.includes(entry.name);
          box.className = `physical-box ${entry.isLocked ? "is-const" : ""} ${isErrorOnThis ? "shake-box" : ""}`;
          box.innerHTML = `
            <div class="box-header">
              <span class="text-warning font-monospace">${entry.kind} ${entry.name}</span>
              ${entry.isLocked ? '<i class="bi bi-lock-fill text-danger"></i>' : '<i class="bi bi-unlock text-info"></i>'}
            </div>
            <div class="box-payload">${entry.val}</div>
            <div class="text-center pb-1 text-secondary font-monospace" style="font-size: 0.65rem;">
              Endereço: ${entry.addr}
            </div>
          `;
          grid.appendChild(box);
        });
      }
      this.stage.appendChild(grid);
    }

    // ==========================================
    // ATIVIDADE 2: SCANNER DE TIPOS
    // ==========================================
    else if (activityIndex === 1) {
      const last =
        lastLogs[lastLogs.length - 1] || "Pronto para escanear a etiqueta...";
      this.stage.innerHTML = `
        <div class="scanner-box">
          <div class="scan-laser"></div>
          <i class="bi bi-upc-scan fs-1 text-success mb-2 d-block"></i>
          <span class="badge bg-secondary font-monospace mb-2">SCANNER DE TIPOS ECMASCRIPT</span>
          <div class="fs-5 font-monospace text-warning my-2">${last.replace("[MOTOR] ", "")}</div>
        </div>
      `;
    }

    // ==========================================
    // ATIVIDADE 3: ARENA ARCADE DOS OPERADORES 🥊
    // ==========================================
    else if (activityIndex === 2) {
      const isCoerced = lastLogs.some(
        (l) => l.includes("==") && l.includes("true"),
      );
      const isBlocked = lastLogs.some(
        (l) => l.includes("===") && l.includes("false"),
      );
      const isTagTeam = lastLogs.some((l) => l.includes('"Visitante"'));

      const leftHp = isBlocked ? 70 : 100;
      const rightHp = isCoerced ? 50 : isTagTeam ? 40 : 100;

      this.stage.innerHTML = `
        <div class="arcade-arena ${isCoerced || isBlocked ? "screen-shake" : ""}">
          <div class="arena-ring-floor">
            <div class="fighters-row">
              <div class="fighter-card ${isCoerced ? "active-punch" : ""}">
                <div class="fighter-avatar">${isTagTeam ? "🦸" : "🥊"}</div>
                <div class="fighter-token text-info">${isTagTeam ? '"Visitante"' : '"5"'}</div>
                <div class="text-secondary small font-monospace">${isTagTeam ? "String" : "String"}</div>
                <div class="hp-bar-outer"><div class="hp-bar-inner" style="width: ${leftHp}%"></div></div>
              </div>

              <div class="versus-center">
                ${isCoerced ? '<span class="badge bg-warning text-dark impact-badge">💥 COERÇÃO! TRUE (-50 HP)</span>' : ""}
                ${isBlocked ? '<span class="badge bg-info text-dark impact-badge">🛡️ BLOCKED! FALSE (0 DANO)</span>' : ""}
                ${isTagTeam ? '<span class="badge bg-purple text-white impact-badge">🤼 RESERVA ASSUMIU!</span>' : ""}
                ${!isCoerced && !isBlocked && !isTagTeam ? '<span class="badge bg-danger fs-5 px-3 py-2 font-monospace">VS</span>' : ""}
                <div class="text-secondary small mt-1 font-monospace">Ringue de Tipos</div>
              </div>

              <div class="fighter-card ${isBlocked ? "shield-up" : ""} ${isCoerced ? "hit-damage" : ""}">
                <div class="fighter-avatar">🥋</div>
                <div class="fighter-token text-warning">5</div>
                <div class="text-secondary small font-monospace">Number</div>
                <div class="hp-bar-outer"><div class="hp-bar-inner ${rightHp < 60 ? "low" : ""}" style="width: ${rightHp}%"></div></div>
              </div>
            </div>
          </div>

          <div class="arcade-action-bar">
            <button class="btn btn-sm btn-warning fw-bold font-monospace btn-arcade-hit" data-code='"5" == 5;'>
              👊 Golpe == (Coerção)
            </button>
            <button class="btn btn-sm btn-info fw-bold font-monospace btn-arcade-hit" data-code='"5" === 5;'>
              🛡️ Escudo === (Bloqueio)
            </button>
            <button class="btn btn-sm btn-secondary fw-bold font-monospace btn-arcade-hit" data-code='"" || "Visitante";'>
              🤼 Troca || (Curto-Circuito)
            </button>
          </div>
        </div>
      `;
    }

    // ==========================================
    // ATIVIDADE 4: CALDEIRÃO & COERÇÃO 🧪
    // ==========================================
    else if (activityIndex === 3) {
      const isGlued = lastLogs.some((l) => l.includes('"11"'));
      const isLaserMath = lastLogs.some((l) => l.includes("6"));
      const isTruthy = lastLogs.some(
        (l) => l.includes("Boolean") && l.includes("true"),
      );

      this.stage.innerHTML = `
        <div class="alchemical-lab ${isLaserMath ? "screen-shake" : ""}">
          <div class="chamber-vat">
            <div class="flask-row">
              <div class="chemical-flask ${isLaserMath ? "broken-glass" : ""} ${isGlued ? "glue-merge" : ""}">
                <span class="fs-4">${isLaserMath ? "💥" : isTruthy ? "📦" : "🧪"}</span>
                <span>${isLaserMath ? "3" : isTruthy ? '"false"' : '"1"'}</span>
                <span class="small text-secondary" style="font-size: 0.65rem;">${isLaserMath ? "Derretido" : "String"}</span>
              </div>

              <div class="vat-operator-core">
                ${isGlued ? "🧲 COLA" : isLaserMath ? "🔥 LASER" : isTruthy ? "⚖️ SENSOR" : "➔"}
              </div>

              <div class="chemical-flask ${isLaserMath ? "broken-glass" : ""} ${isGlued ? "glue-merge" : ""}">
                <span class="fs-4">${isLaserMath ? "💥" : isTruthy ? "🟢" : "🧪"}</span>
                <span>${isLaserMath ? "2" : isTruthy ? "TRUE" : "1"}</span>
                <span class="small text-secondary" style="font-size: 0.65rem;">${isLaserMath ? "Derretido" : isTruthy ? "Truthy" : "Number"}</span>
              </div>
            </div>
          </div>

          <div class="text-center">
            ${isGlued ? '<span class="badge bg-purple fs-5 font-monospace text-white px-3 py-2">➔ POÇÃO "11" (String Concatenada)</span>' : ""}
            ${isLaserMath ? '<span class="badge bg-success fs-5 font-monospace text-white px-3 py-2">➔ BARRA DE OURO 6 (Cálculo Numérico)</span>' : ""}
            ${isTruthy ? '<span class="badge bg-success fs-5 font-monospace text-white px-3 py-2">➔ SENSOR ATIVADO: TRUE (Truthy)</span>' : ""}
            ${!isGlued && !isLaserMath && !isTruthy ? '<span class="badge bg-secondary font-monospace">Clique em um dos botões abaixo para testar a química!</span>' : ""}
          </div>

          <div class="lab-controls-bar">
            <button class="btn btn-sm btn-purple text-white fw-bold font-monospace btn-lab-valve" style="background: #9333ea;" data-code='"1" + 1;'>
              🧲 Pistola de Cola (+)
            </button>
            <button class="btn btn-sm btn-danger fw-bold font-monospace btn-lab-valve" data-code='"3" * "2";'>
              🔥 Canhão Laser de Calor (*)
            </button>
            <button class="btn btn-sm btn-success fw-bold font-monospace btn-lab-valve" data-code='Boolean("false");'>
              ⚖️ Sensor Truthy
            </button>
          </div>
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
