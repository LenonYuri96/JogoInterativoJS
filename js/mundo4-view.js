/**
 * JS QUEST - MUNDO 4: VIEW COM SUPORTE TOTAL A ANIMAÇÕES
 */
class Mundo4View {
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

    // Modal de Vitória Final do Mundo 4 🏆
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
        this.robotMood.textContent = "Bit: Excelente!";
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
      this.victoryXpBadge.innerHTML = `<i class="bi bi-lightning-charge-fill"></i> +${totalXp || 400} XP Ganho`;
    }
    if (!this.bsModalVictory && this.modalVictoryEl && window.bootstrap) {
      this.bsModalVictory = new bootstrap.Modal(this.modalVictoryEl);
    }
    if (this.bsModalVictory) this.bsModalVictory.show();
  }

  updateTelemetry(fnName, argsText, returnText, stackCount = 1) {
    if (this.stackCounter)
      this.stackCounter.textContent = `Operação: ${stackCount} passo(s)`;
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
  // JOGO 13: TREM DOS ARRAYS
  // ==========================================
  renderTrain(
    arrayData = ["📦 Carga 1", "📦 Carga 2"],
    operationName = "Pronto",
  ) {
    this.stage.innerHTML = `
      <div class="train-station">
        <div class="d-flex justify-content-between align-items-center w-100 px-3">
          <span class="badge bg-secondary font-monospace">OPERAÇÃO: ${operationName}</span>
          <span class="badge bg-dark border border-info font-monospace text-info">Tamanho: trem.length = ${arrayData.length}</span>
        </div>

        <div class="rails">
          <!-- Locomotiva Fixa na Frente -->
          <div class="train-wagon locomotive">
            <span class="wagon-index">CABINE</span>
            <div class="wagon-val">🚂 JS</div>
            <div class="wagon-wheels">
              <div class="wheel"></div>
              <div class="wheel"></div>
            </div>
          </div>

          <!-- Vagões indexados numericamente -->
          ${arrayData
            .map(
              (item, idx) => `
            <div class="train-wagon">
              <span class="wagon-index">[${idx}]</span>
              <div class="wagon-val text-truncate">${item}</div>
              <div class="wagon-wheels">
                <div class="wheel"></div>
                <div class="wheel"></div>
              </div>
            </div>
          `,
            )
            .join("")}

          ${arrayData.length === 0 ? '<div class="text-secondary font-monospace small my-auto ps-3">Trem sem vagões! Adicione elementos com push ou unshift.</div>' : ""}
        </div>
      </div>
    `;
  }

  // ==========================================
  // JOGO 14: FÁBRICA DE PIZZAS (MAP, FILTER, REDUCE)
  // ==========================================
  renderPizzaFactory(
    pizzasInitial = [],
    filteredPizzas = [],
    mappedPizzas = [],
    reducedValue = null,
  ) {
    this.stage.innerHTML = `
      <div class="pizza-pipeline">
        <!-- ETAPA 1: ESTEIRA ORIGINAL -->
        <div class="pipeline-step">
          <span class="badge bg-secondary font-monospace">1. ENTRADA (${pizzasInitial.length})</span>
          <div class="pizza-belt">
            ${pizzasInitial.map((p) => `<span class="pizza-item">🍕 ${p.sabor} (R$${p.preco})</span>`).join("")}
          </div>
        </div>

        <!-- ETAPA 2: .filter() -->
        <div class="pipeline-step">
          <span class="badge bg-danger font-monospace">2. .filter()</span>
          <div class="pizza-belt">
            ${
              filteredPizzas.length > 0
                ? filteredPizzas
                    .map(
                      (p) =>
                        `<span class="pizza-item border-danger">🍕 ${p.sabor}</span>`,
                    )
                    .join("")
                : '<span class="text-muted small">Pizzas filtradas aqui</span>'
            }
          </div>
        </div>

        <!-- ETAPA 3: .map() -->
        <div class="pipeline-step">
          <span class="badge bg-warning text-dark font-monospace">3. .map()</span>
          <div class="pizza-belt">
            ${
              mappedPizzas.length > 0
                ? mappedPizzas
                    .map(
                      (val) =>
                        `<span class="pizza-item border-warning text-warning">✨ ${typeof val === "object" ? val.sabor : val}</span>`,
                    )
                    .join("")
                : '<span class="text-muted small">Transformações aqui</span>'
            }
          </div>
        </div>

        <!-- ETAPA 4: .reduce() -->
        <div class="pipeline-step">
          <span class="badge bg-success font-monospace">4. .reduce()</span>
          <div>
            ${
              reducedValue !== null
                ? `<span class="badge bg-success fs-6 font-monospace px-3 py-1">TOTAL ACUMULADO: R$ ${reducedValue}</span>`
                : '<span class="text-muted small">Aguardando agregação...</span>'
            }
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // JOGO 15: VILA DOS OBJETOS
  // ==========================================
  renderVillage(
    house = { teto: "red", cor: "#3b82f6", aberta: false, morador: "Bit" },
  ) {
    const hasRoof = Boolean(house.teto);
    const roofColor = hasRoof
      ? house.teto === "red" || house.teto === "vermelho"
        ? "#dc2626"
        : house.teto === "blue" || house.teto === "azul"
          ? "#2563eb"
          : "#f59e0b"
      : "transparent";

    this.stage.innerHTML = `
      <div class="village-container">
        <div class="house-card">
          <!-- Teto / Telhado do Objeto -->
          <div class="house-roof" style="background: ${roofColor}; border-bottom: 2px solid ${hasRoof ? "#000" : "transparent"};">
            ${hasRoof ? `🏠 Telhado: "${house.teto}"` : '<span class="text-secondary small fst-italic">[Sem Telhado - delete]</span>'}
          </div>

          <!-- Paredes e Atributos Internos -->
          <div class="house-walls text-light">
            <div class="mb-1"><strong>casa = {</strong></div>
            <div class="ps-2">teto: <span class="text-warning">${hasRoof ? `"${house.teto}"` : "undefined"}</span>,</div>
            <div class="ps-2">morador: <span class="text-info">"${house.morador || "Ninguém"}"</span>,</div>
            <div class="ps-2">portaAberta: <span class="${house.aberta ? "text-success" : "text-danger"}">${Boolean(house.aberta)}</span></div>
            <div><strong>};</strong></div>

            <div class="mt-3 p-2 rounded text-center ${house.aberta ? "bg-success bg-opacity-25 border border-success door-active" : "bg-danger bg-opacity-25 border border-danger"}">
              ${house.aberta ? "🚪 Porta: ABERTA (this.aberta = true)" : "🔒 Porta: TRANCADA (this.aberta = false)"}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // JOGO 16: JSON JUNGLE
  // ==========================================
  renderJsonJungle(dataObj, hasError = false, errorMsg = "") {
    let treeHTML = "";

    if (hasError) {
      treeHTML = `
        <div class="alert alert-danger font-monospace mb-0">
          <i class="bi bi-exclamation-triangle-fill"></i> Erro de Sintaxe JSON:<br>
          <small class="text-white">${errorMsg}</small>
        </div>
      `;
    } else {
      treeHTML = `
        <div class="text-success font-monospace mb-2"><i class="bi bi-check2-circle"></i> JSON Válido! Estrutura Mapeada:</div>
        <div class="json-forest-tree">
          <div class="fw-bold text-light">{ Raiz da Floresta:</div>
          ${Object.entries(dataObj)
            .map(
              ([key, value]) => `
            <div class="tree-node">
              <span class="tree-key">"${key}":</span>
              ${
                Array.isArray(value)
                  ? `<span class="text-light">[ ${value.map((v) => `<span class="tree-string">"${v}"</span>`).join(", ")} ]</span>`
                  : typeof value === "string"
                    ? `<span class="tree-string">"${value}"</span>`
                    : typeof value === "number"
                      ? `<span class="tree-number">${value}</span>`
                      : `<span class="tree-boolean">${value}</span>`
              }
            </div>
          `,
            )
            .join("")}
          <div class="fw-bold text-light">}</div>
        </div>
      `;
    }

    this.stage.innerHTML = `<div class="d-flex justify-content-center w-100 ${hasError ? "syntax-error-glow p-2 rounded" : ""}">${treeHTML}</div>`;
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
