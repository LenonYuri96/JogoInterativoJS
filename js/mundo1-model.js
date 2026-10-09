/**
 * JS QUEST - MUNDO 1: MODEL COM INTERPRETADOR REAL E SALVAMENTO DE CONCLUSÃO
 */
class Mundo1Model {
  constructor() {
    this.xp = 0;
    this.activeActivityIndex = 0;
    this.activeStepIndex = 0;
    this.ram = new Map();

    this.arena = { leftHp: 100, rightHp: 100 };

    this.activities = [
      // ==========================================
      // ATIVIDADE 1: FÁBRICA DE CAIXAS
      // ==========================================
      {
        id: "ATIVIDADE 1",
        title: "Fábrica de Caixas (Variáveis & Memória)",
        manual: `<h6>Mecânica de Memória:</h6><p><code>let</code> cria slots mutáveis.<br><code>const</code> impede reatribuição da variável.<br>Propriedades dentro de objetos em <code>const</code> podem ser alteradas!</p>`,
        steps: [
          {
            desc: "Alocar variável mutável e atualizar seu valor na RAM.",
            guideSpeech:
              "Declare <code>let vida = 100;</code> e em seguida atualize para <code>vida = 80;</code>. Se você mudar os números, a RAM mostrará seus novos valores!",
            initialCode: "let vida = 100;\nvida = 80;",
            commands: [
              {
                code: "let vida = 100;\nvida = 80;",
                label: "Criar vida e atualizar para 80",
              },
            ],
            validate: (model) => {
              const v = model.ram.get("vida");
              return v && v.kind === "let" && v.val === "80";
            },
            explanation: {
              scenario:
                "A gaveta de memória foi alocada com 100 e depois atualizada para 80 sem recriar a variável.",
              engine:
                "O motor alocou um endereço fixo na RAM e permitiu a reatribuição porque a variável foi declarada com let.",
              rule: "Utilize let para identificadores cujo valor precisará ser atualizado ao longo do programa.",
            },
          },
          {
            desc: "Testar a trava de segurança do const (provocar TypeError).",
            guideSpeech:
              'Declare <code>const id = "007";</code> e tente forçar <code>id = "008";</code>. O motor vai protestar com TypeError e fazer o cadeado tremer!',
            initialCode: 'const id = "007";\nid = "008";',
            commands: [
              {
                code: 'const id = "007";\nid = "008";',
                label: "Tentar forçar nova atribuição em const",
              },
            ],
            validate: (model, stdout, lastError) => {
              const entry = model.ram.get("id");
              return (
                entry &&
                entry.kind === "const" &&
                Boolean(lastError && lastError.includes("TypeError"))
              );
            },
            explanation: {
              scenario:
                "O cadeado neon tremou e a reatribuição foi bloqueada imediatamente pelo motor.",
              engine:
                "O compilador marca variáveis const com a flag interna [[Writable]]: false. Qualquer tentativa de reatribuição dispara TypeError.",
              rule: "Constantes garantem previsibilidade: seu identificador nunca pode ser substituído por um novo valor.",
            },
          },
          {
            desc: "Mutar propriedades internas de Objeto em Const.",
            guideSpeech:
              "Objetos em <code>const</code> são mutáveis por dentro! Crie <code>const hero = { pts: 10 };</code> e altere <code>hero.pts = 25;</code>.",
            initialCode: "const hero = { pts: 10 };\nhero.pts = 25;",
            commands: [
              {
                code: "const hero = { pts: 10 };\nhero.pts = 25;",
                label: "Alterar propriedade interna hero.pts",
              },
            ],
            validate: (model) => {
              const entry = model.ram.get("hero");
              return (
                entry && entry.kind === "const" && entry.val.includes("pts: 25")
              );
            },
            explanation: {
              scenario:
                "O cadeado da variável permaneceu trancado enquanto a propriedade interna pts foi alterada para 25.",
              engine:
                "A constante protege o ponteiro de referência do objeto na Heap. Modificar propriedades internas não altera o ponteiro da raiz.",
              rule: "Const protege a referência da variável, não a imutabilidade das propriedades internas do objeto.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 2: CIDADE DOS TIPOS
      // ==========================================
      {
        id: "ATIVIDADE 2",
        title: "Cidade dos Tipos (O Scanner do typeof)",
        manual: `<h6>Classificação de Tipos:</h6><p><code>typeof null === "object"</code> é um comportamento histórico.<br><code>NaN</code> pertence formalmente ao tipo number.<br><code>Array.isArray()</code> é o método seguro para checar listas.</p>`,
        steps: [
          {
            desc: "Inspecionar o comportamento histórico de typeof null.",
            guideSpeech:
              "Execute <code>typeof null;</code>. O scanner a laser inspecionará a tag binária do valor na memória!",
            initialCode: "typeof null;",
            commands: [{ code: "typeof null;", label: "Escanear typeof null" }],
            validate: (model, stdout) => stdout.includes('"object"'),
            explanation: {
              scenario:
                'O scanner exibiu a etiqueta "object" para o valor primitivo null.',
              engine:
                "Nas primeiras versões do JS (1995), ponteiros nulos compartilhavam os mesmos bits de identificação (000) que objetos, mantido até hoje.",
              rule: 'Null representa a ausência intencional de valor, mas typeof retorna "object" por retrocompatibilidade.',
            },
          },
          {
            desc: "Inspecionar a natureza numérica do NaN (Not a Number).",
            guideSpeech:
              'Converta um texto inválido com <code>Number("abc")</code> e inspecione seu tipo com <code>typeof n;</code>!',
            initialCode: 'const n = Number("abc");\ntypeof n;',
            commands: [
              {
                code: 'const n = Number("abc");\ntypeof n;',
                label: "Gerar NaN e verificar typeof",
              },
            ],
            validate: (model, stdout) => {
              const hasNanInRam =
                model.ram.has("n") && model.ram.get("n").val === "NaN";
              const hasNumberOutput =
                stdout.includes('"number"') || stdout.includes("number");
              const hasNanOutput = stdout.includes("NaN");
              return (hasNanInRam || hasNanOutput) && hasNumberOutput;
            },
            explanation: {
              scenario:
                'A conversão gerou o valor NaN e o scanner confirmou que seu tipo formal é "number".',
              engine:
                "NaN representa um estado numérico que falhou em um cálculo (especificação IEEE-754), logo seu tipo primitivo é number.",
              rule: 'Para checar se um valor é inválido de verdade, utilize Number.isNaN(x), pois typeof sempre retornará "number".',
            },
          },
          {
            desc: "Diferenciar Array com Array.isArray().",
            guideSpeech:
              'O typeof de uma lista diz apenas "object". A forma confiável é <code>Array.isArray([1, 2]);</code>. Execute!',
            initialCode: "Array.isArray([1, 2]);",
            commands: [
              {
                code: "Array.isArray([1, 2]);",
                label: "Validar lista com Array.isArray()",
              },
            ],
            validate: (model, stdout) =>
              stdout.includes("true") && stdout.includes("Array"),
            explanation: {
              scenario:
                "O validador confirmou com true que a estrutura é uma coleção ordenada.",
              engine:
                "Arrays são subtipos de objetos com métodos e índices especiais. Array.isArray() analisa o protótipo real da estrutura.",
              rule: "Nunca use typeof para identificar listas ou arrays. Utilize sempre Array.isArray().",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 3: ARENA DOS OPERADORES
      // ==========================================
      {
        id: "ATIVIDADE 3",
        title: "Arena Arcade dos Operadores (== vs ===)",
        manual: `<h6>Regras de Comparação:</h6><p><code>==</code> faz coerção implícita antes de comparar.<br><code>===</code> exige tipos e valores idênticos.<br><code>||</code> retorna o operando truthy real.</p>`,
        steps: [
          {
            desc: "Duelo com == (Igualdade Abstrata e Coerção Mágica).",
            guideSpeech:
              'Execute <code>"5" == 5;</code>. Veja o lutador da esquerda receber a aura de conversão e acertar o golpe com TRUE!',
            initialCode: '"5" == 5;',
            commands: [{ code: '"5" == 5;', label: "Disparar duelo com ==" }],
            validate: (model, stdout) =>
              stdout.includes("==") && stdout.includes("true"),
            explanation: {
              scenario:
                'O lutador "5" (string) foi convertido para número e causou dano crítico no oponente.',
              engine:
                "O operador == aplicou coerção implícita (ToNumber), convertendo a string para número antes de realizar o teste.",
              rule: "A igualdade solta (==) converte tipos automaticamente, o que pode mascarar comportamentos indesejados.",
            },
          },
          {
            desc: "Duelo com === (Igualdade Estrita e Bloqueio de Tipos).",
            guideSpeech:
              'Agora compare os mesmos valores com <code>"5" === 5;</code>. Veja o escudo azul repelir o ataque com FALSE!',
            initialCode: '"5" === 5;',
            commands: [{ code: '"5" === 5;', label: "Disparar duelo com ===" }],
            validate: (model, stdout) =>
              stdout.includes("===") && stdout.includes("false"),
            explanation: {
              scenario:
                "O escudo do oponente bloqueou o ataque porque os tipos eram incompatíveis.",
              engine:
                "A igualdade estrita (===) checa primeiro os tipos de dados. Como string !== number, retorna false imediatamente.",
              rule: "Prefira sempre === em projetos profissionais para evitar conversões mágicas e imprevistas.",
            },
          },
          {
            desc: "Curto-Circuito com operador lógico ||.",
            guideSpeech:
              'Execute <code>"" || "Visitante";</code>. Veja como o operador devolve a string reserva em vez de apenas true/false!',
            initialCode: '"" || "Visitante";',
            commands: [
              {
                code: '"" || "Visitante";',
                label: "Avaliar curto-circuito com ||",
              },
            ],
            validate: (model, stdout) => stdout.includes('"Visitante"'),
            explanation: {
              scenario:
                'Como a string inicial era vazia (falsy), o combatente reserva "Visitante" entrou no ringue.',
              engine:
                'O operador || avalia o lado esquerdo; sendo falsy (""), ele interrompe a checagem e retorna o próprio operando da direita.',
              rule: "Operadores lógicos em JavaScript retornam o próprio valor do operando avaliado, permitindo definir valores padrão.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 4: CALDEIRÃO & COERÇÃO
      // ==========================================
      {
        id: "ATIVIDADE 4",
        title: "Caldeirão & Fornalha de Coerção (+ vs *)",
        manual: `<h6>Fusão de Tipos:</h6><p><code>+</code> prioriza concatenação textual se houver string.<br><code>*</code>, <code>-</code> e <code>/</code> forçam coerção numérica.<br>Strings preenchidas são sempre Truthy.</p>`,
        steps: [
          {
            desc: "A Solda de Strings com o operador +.",
            guideSpeech:
              'Execute <code>"1" + 1;</code>. Veja a gosma de cola fundir os operandos na string "11"!',
            initialCode: '"1" + 1;',
            commands: [{ code: '"1" + 1;', label: "Fundir com operador +" }],
            validate: (model, stdout) => stdout.includes('"11"'),
            explanation: {
              scenario:
                'Os dois frascos foram soldados e produziram a string concatenada "11".',
              engine:
                "Quando o operador + encontra pelo menos um operando do tipo string, ele prioriza ToString e concatena os valores.",
              rule: 'Ao receber números de formulários HTML, converta-os previamente com Number(), senão 10 + 20 virará "1020".',
            },
          },
          {
            desc: "A Fornalha Laser com o operador de multiplicação (*).",
            guideSpeech:
              'Execute <code>"3" * "2";</code>. Veja as aspas estilhaçarem no fogo e virarem o número 6 real!',
            initialCode: '"3" * "2";',
            commands: [{ code: '"3" * "2";', label: "Fundir com operador *" }],
            validate: (model, stdout) =>
              stdout.includes("6") && !stdout.includes('"6"'),
            explanation: {
              scenario:
                "O calor da fornalha destruiu as aspas de texto e calculou o valor aritmético 6.",
              engine:
                "Como não existe operação de multiplicação entre textos, o motor converte ambos os operandos para número e calcula.",
              rule: "Operadores matemáticos como *, - e / sempre forçam a conversão dos operandos para o tipo number.",
            },
          },
          {
            desc: 'O Sensor Truthy: Boolean("false").',
            guideSpeech:
              'Execute <code>Boolean("false");</code>. Descubra por que qualquer texto preenchido é avaliado como verdadeiro!',
            initialCode: 'Boolean("false");',
            commands: [
              { code: 'Boolean("false");', label: 'Avaliar Boolean("false")' },
            ],
            validate: (model, stdout) =>
              stdout.includes("true") && stdout.includes("Boolean"),
            explanation: {
              scenario:
                "O sensor acendeu a luz verde confirmando que o valor é Truthy.",
              engine:
                "Toda string não vazia (comprimento > 0) é Truthy em JavaScript, independentemente dos caracteres que estejam dentro dela.",
              rule: 'Apenas a string vazia ("") é Falsy. Qualquer texto preenchido com caracteres resulta em true quando convertido para booleano.',
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

  generateAddress() {
    return (
      "0x" +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .toUpperCase()
        .padStart(6, "0")
    );
  }

  saveWorldCompletion() {
    try {
      const raw = localStorage.getItem("JS_QUEST_DATA_V1");
      let data = raw
        ? JSON.parse(raw)
        : { xp: 0, completedWorlds: [], completedLevels: [] };

      data.xp = (data.xp || 0) + (this.xp || 400);

      if (!data.completedWorlds) data.completedWorlds = [];
      if (!data.completedWorlds.includes("mundo1")) {
        data.completedWorlds.push("mundo1");
      }

      localStorage.setItem("JS_QUEST_DATA_V1", JSON.stringify(data));
    } catch (e) {
      console.error("Erro ao salvar progresso do Mundo 1:", e);
    }
  }

  /**
   * EXECUTA O CÓDIGO DO ALUNO INJETANDO A RAM NO ESCOPO REAL
   */
  executeCode(code) {
    const logs = [];
    let lastError = null;

    const cleanLines = [];
    code.split("\n").forEach((raw) => {
      const trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith("//")) return;
      const parts = trimmed
        .split(";")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      parts.forEach((p) => cleanLines.push(p + ";"));
    });

    for (let line of cleanLines) {
      try {
        const declMatch = line.match(
          /^(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+);?$/,
        );
        const reassignMatch = line.match(
          /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+);?$/,
        );
        const mutateMatch = line.match(
          /^([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+);?$/,
        );

        if (declMatch) {
          const [, kind, name, rawExpr] = declMatch;
          const evaluated = this.safeEval(rawExpr.replace(/;$/, ""));
          if (!evaluated.ok) throw new Error(evaluated.err);

          this.ram.set(name, {
            addr: this.generateAddress(),
            name: name,
            kind: kind,
            type: evaluated.type,
            val: evaluated.val,
            isLocked: kind === "const",
          });
          logs.push(`[RAM] Alocou ${kind} ${name} com ${evaluated.val}`);
        } else if (mutateMatch) {
          const [, objName, prop, rawVal] = mutateMatch;
          if (!this.ram.has(objName))
            throw new ReferenceError(`${objName} não existe na RAM`);

          const target = this.ram.get(objName);
          const evaluated = this.safeEval(rawVal.replace(/;$/, ""));
          target.val = `{ ${prop}: ${evaluated.val} }`;
          logs.push(
            `[OBJETO] Alterou ${objName}.${prop} para ${evaluated.val}`,
          );
        } else if (reassignMatch) {
          const [, name, rawVal] = reassignMatch;
          if (!this.ram.has(name))
            throw new ReferenceError(`${name} não foi declarada`);

          const target = this.ram.get(name);
          if (target.kind === "const") {
            throw new TypeError(`Assignment to constant variable "${name}"`);
          }

          const evaluated = this.safeEval(rawVal.replace(/;$/, ""));
          target.val = evaluated.val;
          target.type = evaluated.type;
          logs.push(`[RAM] Atualizou ${name} para ${evaluated.val}`);
        } else {
          const cleanExpr = line.replace(/;$/, "");
          const evaluated = this.safeEval(cleanExpr);
          if (!evaluated.ok) throw new Error(evaluated.err);
          logs.push(
            `[MOTOR] ${cleanExpr} => ${evaluated.val} (${evaluated.type})`,
          );
        }
      } catch (err) {
        lastError = `${err.name}: ${err.message}`;
        logs.push(`[ALERTA DO MOTOR] ${lastError}`);
      }
    }

    return { logs, lastError };
  }

  safeEval(expression) {
    try {
      let scopeDeclarations = "";
      if (this.ram && this.ram.size > 0) {
        this.ram.forEach((entry, varName) => {
          scopeDeclarations += `let ${varName} = ${entry.val};\n`;
        });
      }

      const fn = new Function(`
        "use strict";
        ${scopeDeclarations}
        return (${expression});
      `);
      const val = fn();
      let printed = typeof val === "string" ? `"${val}"` : String(val);
      if (Array.isArray(val)) printed = `[${val.join(", ")}]`;
      if (typeof val === "object" && val !== null && !Array.isArray(val))
        printed = JSON.stringify(val);

      return {
        ok: true,
        val: printed,
        type: typeof val,
      };
    } catch (e) {
      return { ok: false, err: e.message };
    }
  }
}
