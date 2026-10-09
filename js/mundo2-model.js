/**
 * JS QUEST - MUNDO 2: MODEL COM SIMULADOR REAL E PERSISTÊNCIA DE CONCLUSÃO
 */
class Mundo2Model {
  constructor() {
    this.xp = 0;
    this.activeActivityIndex = 0;
    this.activeStepIndex = 0;
    this.maxSafetyCycles = 80;

    this.activities = [
      // ==========================================
      // ATIVIDADE 5: LABIRINTO DO ROBÔ
      // ==========================================
      {
        id: "ATIVIDADE 5",
        title: "Labirinto do Robô (Sequência, Condições e Loops)",
        manual: `<h6>Instruções:</h6><p><code>mover()</code> dá 1 passo.<br><code>girarDireita()</code> e <code>girarEsquerda()</code> viram 90°.<br>Paredes 🧱 bloqueiam a passagem!</p>`,
        steps: [
          {
            desc: "Sequência de Comandos: Conduza o robô até o diamante [2, 1] sem bater nas paredes!",
            guideSpeech:
              "Avance até [2, 0], gire para o sul e alcance o diamante 💎 em [2, 1]!",
            initialCode: "mover();\nmover();\ngirarDireita();\nmover();",
            gridSize: 4,
            walls: ["0,1", "1,1", "0,2", "3,0", "3,1", "2,2"],
            start: { x: 0, y: 0, dir: 1 },
            target: { x: 2, y: 1 },
            commands: [
              { code: "mover();", label: "Dar 1 passo para frente" },
              { code: "girarDireita();", label: "Girar 90° à Direita" },
            ],
            explanation: {
              scenario:
                "O robô executou exatamente as 4 instruções sequenciais, contornando a barreira até [2, 1].",
              engine:
                "O motor processou cada linha em ordem sequencial estrita na pilha de chamadas (Call Stack).",
              rule: "Instruções sequenciais são executadas na ordem em que foram escritas.",
            },
          },
          {
            desc: "Repetição com Laço for: Percorra o corredor de 4 passos com um for.",
            guideSpeech:
              "O corredor tem 4 casas até o diamante [4, 1]. Ajuste o laço for para andar exatamente 4 vezes!",
            initialCode: "for (let i = 0; i < 4; i++) {\n  mover();\n}",
            gridSize: 5,
            walls: [
              "0,0",
              "1,0",
              "2,0",
              "3,0",
              "4,0",
              "0,2",
              "1,2",
              "2,2",
              "3,2",
              "4,2",
            ],
            start: { x: 0, y: 1, dir: 1 },
            target: { x: 4, y: 1 },
            commands: [
              {
                code: "for (let i = 0; i < 4; i++) {\n  mover();\n}",
                label: "Laço for de 4 iterações",
              },
            ],
            explanation: {
              scenario:
                "O robô percorreu o corredor sem bater nas paredes laterais, parando no 4º passo.",
              engine:
                "O laço for iniciou em i = 0 e incrementou i++ enquanto i < 4 foi verdadeiro, executando mover() 4 vezes.",
              rule: "Laços for evitam repetição manual de código e garantem contagem exata.",
            },
          },
          {
            desc: "Tomada de Decisão com if: Use haParedeNaFrente() para desviar.",
            guideSpeech:
              "Há uma parede em [2, 0]. Use <code>if (haParedeNaFrente())</code> para fazer o robô virar e desviar!",
            initialCode:
              "while (!noObjetivo()) {\n  if (haParedeNaFrente()) {\n    girarDireita();\n  } else {\n    mover();\n  }\n}",
            gridSize: 4,
            walls: ["2,0", "2,1", "0,2", "3,0", "3,1", "3,2"],
            start: { x: 0, y: 0, dir: 1 },
            target: { x: 1, y: 2 },
            commands: [
              {
                code: "if (haParedeNaFrente()) { girarDireita(); } else { mover(); }",
                label: "Desvio condicional",
              },
            ],
            explanation: {
              scenario:
                "O sensor haParedeNaFrente() detectou o muro em [2, 0], ativou o if e fez o robô desviar até o diamante.",
              engine:
                "A expressão booleana do if foi testada a cada ciclo do while, decidindo o caminho dinamicamente.",
              rule: "Condicionais dentro de laços permitem tomar decisões conforme o ambiente se altera.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 6: ELEVADOR DO FOR
      // ==========================================
      {
        id: "ATIVIDADE 6",
        title: "Elevador do for (Controle de Repetições)",
        manual: `<h6>Estrutura do for:</h6><p><code>for (início; condição; incremento)</code><br>O elevador visita exatamente os andares que seu laço definir.</p>`,
        steps: [
          {
            desc: "Subida Controlada: Suba do 1º até o 6º andar.",
            guideSpeech:
              "Configure o for para parar em <code>andar <= 6</code>. Se você mudar para 3, ele vai parar no 3!",
            initialCode:
              "for (let andar = 1; andar <= 6; andar++) {\n  subir(andar);\n}",
            targetFloor: 6,
            commands: [
              {
                code: "for (let andar = 1; andar <= 6; andar++) {\n  subir(andar);\n}",
                label: "Laço do 1 ao 6",
              },
            ],
            explanation: {
              scenario:
                "O elevador subiu de andar em andar até o 6º e encerrou a viagem.",
              engine:
                "A cada subida, o motor checou andar <= 6. Quando o contador virou 7, a condição deu false e encerrou.",
              rule: "A condição do for é avaliada antes de cada repetição. Se der false, o laço para.",
            },
          },
          {
            desc: "Perigo de Loop Infinito: Provoque e identifique o loop com andar--.",
            guideSpeech:
              "Substitua <code>andar++</code> por <code>andar--</code>. Veja o contador andar de ré e a trava de segurança atuar!",
            initialCode:
              "for (let andar = 1; andar <= 10; andar--) {\n  subir(andar);\n}",
            isInfiniteHazard: true,
            commands: [
              {
                code: "for (let andar = 1; andar <= 10; andar--) {\n  subir(andar);\n}",
                label: "Laço com andar--",
              },
            ],
            explanation: {
              scenario:
                "O elevador tentou descer infinitamente e a trava de segurança cortou a energia.",
              engine:
                "Com andar--, o valor decresce (0, -1, -2...) e a condição andar <= 10 nunca fica falsa.",
              rule: "O incremento deve sempre caminhar na direção de encerrar a condição.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 7: SEMÁFORO LÓGICO
      // ==========================================
      {
        id: "ATIVIDADE 7",
        title: "Semáforo Lógico (Decisões com if / else / switch)",
        manual: `<h6>Controle Viário:</h6><p>Avalia variáveis e altera as luzes e o fluxo de veículos e pedestres.</p>`,
        steps: [
          {
            desc: "Detecção de Pedestre: Interrompa os veículos caso pedestreAguardando seja true.",
            guideSpeech:
              "Escreva a condição: se <code>pedestreAguardando</code> for true, chame <code>fecharSinalCarros()</code>!",
            initialCode:
              "const pedestreAguardando = true;\nif (pedestreAguardando) {\n  fecharSinalCarros();\n}",
            scenario: "pedestrian",
            commands: [
              {
                code: "if (pedestreAguardando) {\n  fecharSinalCarros();\n}",
                label: "Checagem com if",
              },
            ],
            explanation: {
              scenario:
                "O semáforo veicular fechou e o pedestre pôde atravessar com segurança.",
              engine:
                "Como a variável era true, o motor executou o bloco interno do if.",
              rule: "O bloco if só roda quando a expressão entre parênteses resulta em true.",
            },
          },
          {
            desc: 'Painel com switch: Selecione a ação exata para o comando "avancar".',
            guideSpeech:
              'Monte o <code>switch (comando)</code> com o caso "avancar" abrindo o sinal verde com <code>break</code>!',
            initialCode:
              'const comando = "avancar";\nswitch (comando) {\n  case "avancar":\n    abrirSinalVerde();\n    break;\n  case "parar":\n    fecharSinalCarros();\n    break;\n}',
            scenario: "switch_traffic",
            commands: [
              {
                code: 'switch (comando) {\n  case "avancar":\n    abrirSinalVerde();\n    break;\n}',
                label: "Switch com break",
              },
            ],
            explanation: {
              scenario:
                'O painel comparou a string "avancar" e ativou a luz verde.',
              engine:
                "O switch comparou estritamente (===) o comando e o break impediu a execução dos outros cases.",
              rule: "O comando break é essencial para não invadir os casos seguintes dentro do switch.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 8: CAÇA AO BUG DO LOOP
      // ==========================================
      {
        id: "ATIVIDADE 8",
        title: "Caça ao Bug do Loop (Depuração na Oficina)",
        manual: `<h6>Depuração:</h6><p>Encontre erros em contadores invertidos e laços while sem atualização interna.</p>`,
        steps: [
          {
            desc: "Bug do Operário: O contador está com i-- em vez de avançar. Corrija!",
            guideSpeech:
              "O código veio com <code>i--</code>. Altere o editor para <code>i++</code> para consertar o robô!",
            initialCode: "for (let i = 0; i < 5; i--) {\n  trabalhar(i);\n}",
            commands: [
              {
                code: "for (let i = 0; i < 5; i++) {\n  trabalhar(i);\n}",
                label: "Aplicar i++",
              },
            ],
            explanation: {
              scenario:
                "O robô operário agora conta 0, 1, 2, 3, 4 e encerra no 5 com sucesso.",
              engine:
                "Com i++, o contador avança em direção ao limite e finaliza o for normalmente.",
              rule: "Certifique-se de que o contador caminhe em direção à condição de parada.",
            },
          },
          {
            desc: "Bug de Bateria: O while não gasta energia. O energia--; DEVE ficar DENTRO das chaves { } do while!",
            guideSpeech:
              "Atenção: o <code>energia--;</code> precisa ficar <strong>DENTRO</strong> das chaves <code>{ }</code> do while! Se ficar do lado de fora, a energia nunca diminui e o laço roda para sempre.",
            initialCode:
              "let energia = 3;\nwhile (energia > 0) {\n  ligarLuzes();\n}",
            commands: [
              {
                code: "let energia = 3;\nwhile (energia > 0) {\n  ligarLuzes();\n  energia--;\n}",
                label: "Colocar energia--; DENTRO do while",
              },
            ],
            explanation: {
              scenario:
                "O robô consumiu as 3 cargas de bateria (3, 2, 1, 0) e desligou com segurança.",
              engine:
                "Com energia-- dentro do corpo do while, o valor diminui a cada ciclo até que energia > 0 vire false.",
              rule: "Laços while precisam atualizar suas variáveis de controle dentro das chaves { } do próprio bloco.",
            },
          },
        ],
      },
    ];
  }

  getCurrentActivity() {
    return this.activities[this.activeActivityIndex];
  }

  getCurrentStep() {
    return this.getCurrentActivity().steps[this.activeStepIndex];
  }

  addXP(amount) {
    this.xp += amount;
  }

  saveWorldCompletion() {
    try {
      const raw = localStorage.getItem("JS_QUEST_DATA_V1");
      let data = raw
        ? JSON.parse(raw)
        : { xp: 0, completedWorlds: [], completedLevels: [] };

      data.xp = (data.xp || 0) + (this.xp || 400);

      if (!data.completedWorlds) data.completedWorlds = [];
      if (!data.completedWorlds.includes("mundo2")) {
        data.completedWorlds.push("mundo2");
      }

      localStorage.setItem("JS_QUEST_DATA_V1", JSON.stringify(data));
    } catch (e) {
      console.error("Erro ao salvar progresso do Mundo 2:", e);
    }
  }

  // --- INTERPRETADOR 1: LABIRINTO DO ROBÔ ---
  simulateRobot(code, step) {
    const dirs = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];
    const actions = [];
    let state = { ...step.start };
    let hasCollided = false;
    let collisionTile = null;
    let count = 0;

    const env = {
      mover: () => {
        if (hasCollided) return;
        if (++count > this.maxSafetyCycles)
          throw new Error("Loop infinito no labirinto: limite excedido!");

        const nx = state.x + dirs[state.dir].x;
        const ny = state.y + dirs[state.dir].y;
        const key = `${nx},${ny}`;

        if (nx < 0 || nx >= step.gridSize || ny < 0 || ny >= step.gridSize) {
          hasCollided = true;
          collisionTile = { x: nx, y: ny, reason: "borda" };
          actions.push({
            type: "collision",
            tile: collisionTile,
            state: { ...state },
          });
          return;
        }

        if (step.walls.includes(key)) {
          hasCollided = true;
          collisionTile = { x: nx, y: ny, reason: "parede" };
          actions.push({
            type: "collision",
            tile: collisionTile,
            state: { ...state },
          });
          return;
        }

        state.x = nx;
        state.y = ny;
        actions.push({ type: "move", state: { ...state } });
      },
      girarDireita: () => {
        if (hasCollided) return;
        if (++count > this.maxSafetyCycles)
          throw new Error("Limite de segurança excedido!");
        state.dir = (state.dir + 1) % 4;
        actions.push({ type: "turn", state: { ...state } });
      },
      girarEsquerda: () => {
        if (hasCollided) return;
        if (++count > this.maxSafetyCycles)
          throw new Error("Limite de segurança excedido!");
        state.dir = (state.dir + 3) % 4;
        actions.push({ type: "turn", state: { ...state } });
      },
      haParedeNaFrente: () => {
        const nx = state.x + dirs[state.dir].x;
        const ny = state.y + dirs[state.dir].y;
        if (nx < 0 || nx >= step.gridSize || ny < 0 || ny >= step.gridSize)
          return true;
        return step.walls.includes(`${nx},${ny}`);
      },
      noObjetivo: () => {
        return state.x === step.target.x && state.y === step.target.y;
      },
    };

    try {
      const runner = new Function(
        "mover",
        "girarDireita",
        "girarEsquerda",
        "haParedeNaFrente",
        "noObjetivo",
        `"use strict"; ${code};`,
      );
      runner(
        env.mover,
        env.girarDireita,
        env.girarEsquerda,
        env.haParedeNaFrente,
        env.noObjetivo,
      );
    } catch (err) {
      return { ok: false, error: err.message, actions };
    }

    const reachedTarget =
      state.x === step.target.x && state.y === step.target.y;
    return {
      ok: true,
      actions,
      hasCollided,
      collisionTile,
      reachedTarget,
      finalState: state,
    };
  }

  // --- INTERPRETADOR 2: ELEVADOR DO FOR ---
  simulateElevator(code, step) {
    const floorsVisited = [];
    let count = 0;
    let isInfinite = false;

    const env = {
      subir: (andar) => {
        if (++count > 25) {
          isInfinite = true;
          throw new Error("Loop Infinito detectado no elevador!");
        }
        floorsVisited.push(andar);
      },
      descer: (andar) => {
        if (++count > 25) {
          isInfinite = true;
          throw new Error("Loop Infinito detectado no elevador!");
        }
        floorsVisited.push(andar);
      },
    };

    try {
      const runner = new Function("subir", "descer", `"use strict"; ${code};`);
      runner(env.subir, env.descer);
    } catch (err) {
      if (err.message && err.message.includes("Loop Infinito")) {
        isInfinite = true;
      } else {
        return {
          ok: false,
          error: err.message,
          floorsVisited,
          isInfinite: false,
        };
      }
    }

    return {
      ok: true,
      floorsVisited,
      isInfinite,
      lastFloor: floorsVisited[floorsVisited.length - 1] || 1,
    };
  }

  // --- INTERPRETADOR 3: SEMÁFORO LÓGICO ---
  simulateTraffic(code, step) {
    let lightColor = "green";
    let carStopped = false;

    const env = {
      pedestreAguardando: true,
      comando: "avancar",
      fecharSinalCarros: () => {
        lightColor = "red";
        carStopped = true;
      },
      abrirSinalVerde: () => {
        lightColor = "green";
        carStopped = false;
      },
      prepararParada: () => {
        lightColor = "yellow";
        carStopped = true;
      },
    };

    try {
      const runner = new Function(
        "pedestreAguardando",
        "comando",
        "fecharSinalCarros",
        "abrirSinalVerde",
        "prepararParada",
        `"use strict"; ${code};`,
      );
      runner(
        env.pedestreAguardando,
        env.comando,
        env.fecharSinalCarros,
        env.abrirSinalVerde,
        env.prepararParada,
      );
    } catch (err) {
      return { ok: false, error: err.message, lightColor, carStopped };
    }

    return {
      ok: true,
      lightColor,
      carStopped,
    };
  }

  // --- INTERPRETADOR 4: CAÇA AO BUG DO LOOP ---
  simulateWorkshop(code, step) {
    let cycles = 0;
    let isInfinite = false;

    const env = {
      trabalhar: (i) => {
        if (++cycles > 30) {
          isInfinite = true;
          throw new Error("Loop Infinito detectado na oficina!");
        }
      },
      ligarLuzes: () => {
        if (++cycles > 30) {
          isInfinite = true;
          throw new Error("Loop Infinito detectado na oficina!");
        }
      },
    };

    try {
      const runner = new Function(
        "trabalhar",
        "ligarLuzes",
        `"use strict"; ${code};`,
      );
      runner(env.trabalhar, env.ligarLuzes);
    } catch (err) {
      if (err.message && err.message.includes("Loop Infinito")) {
        isInfinite = true;
      } else {
        return { ok: false, error: err.message, cycles, isInfinite: false };
      }
    }

    return {
      ok: true,
      cycles,
      isInfinite,
    };
  }
}
