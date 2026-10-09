/**
 * JS QUEST - MUNDO 3: MODEL (INTERPRETADOR REAL E AVALIADOR SEGURO)
 */
class Mundo3Model {
  constructor() {
    this.xp = 0;
    this.activeActivityIndex = 0;
    this.activeStepIndex = 0;
    this.maxCallStackLimit = 15;

    this.activities = [
      // ==========================================
      // ATIVIDADE 9: MÁQUINA DE TRANSFORMAR
      // ==========================================
      {
        id: "ATIVIDADE 9",
        title: "Máquina de Transformar (Funções e Return)",
        manual: `<h6>Funções em JS:</h6><p><code>function nome(param) { return resultado; }</code><br>Toda função sem <code>return</code> devolve <code>undefined</code>!</p>`,
        steps: [
          {
            desc: "Construir sua primeira máquina: declare somar(a, b) devolvendo a + b.",
            guideSpeech:
              "Uma função é uma máquina reutilizável. Crie <code>somar(a, b)</code> que retorne a soma dos dois valores!",
            initialCode:
              "function somar(a, b) {\n  return a + b;\n}\n\nsomar(4, 6);",
            testInputs: [4, 6],
            expectedReturn: 10,
            commands: [
              {
                code: "function somar(a, b) {\n  return a + b;\n}\n\nsomar(4, 6);",
                label: "Máquina somar(a, b)",
              },
            ],
            explanation: {
              scenario:
                "Os números 4 e 6 entraram nos parâmetros a e b. A máquina somou os dois e o return entregou a caixa 10 na esteira de saída.",
              engine:
                "O motor declarou a função somar e, na chamada somar(4, 6), associou os argumentos aos parâmetros locais devolvendo o resultado da expressão.",
              rule: "A palavra-chave return define exatamente o valor que a função devolve para quem a chamou.",
            },
          },
          {
            desc: "A Máquina que esqueceu o return: descubra o que acontece com a saída.",
            guideSpeech:
              "Se você calcular a conta mas esquecer o <code>return</code>, a máquina engasga e a saída entrega <code>undefined</code>!",
            initialCode:
              "function calcular(a, b) {\n  a + b; // Sem return!\n}\n\ncalcular(5, 5);",
            testInputs: [5, 5],
            isUndefinedTest: true,
            commands: [
              {
                code: "function calcular(a, b) {\n  a + b;\n}\n\ncalcular(5, 5);",
                label: "Função sem return",
              },
              {
                code: "function calcular(a, b) {\n  return a + b;\n}\n\ncalcular(5, 5);",
                label: "Corrigir adicionando return",
              },
            ],
            explanation: {
              scenario:
                "A máquina calculou internamente, mas nenhuma caixa foi entregue na esteira de saída, soltando fumaça e resultando em undefined.",
              engine:
                "Em JavaScript, qualquer função que chegue ao fim do bloco sem executar uma declaração return com valor devolve undefined por padrão.",
              rule: "Calcular um valor não significa devolvê-lo. Sem return explícito, o retorno é sempre undefined.",
            },
          },
          {
            desc: "Máquinas em conjunto: encadeie calcularTotal e aplicarDesconto.",
            guideSpeech:
              "Funções podem chamar outras funções! Encadeie o cálculo para gerar o valor final com desconto.",
            initialCode:
              "function calcularTotal(preco, qtd) {\n  return preco * qtd;\n}\n\nfunction aplicarDesconto(total) {\n  return total * 0.9;\n}\n\naplicarDesconto(calcularTotal(20, 3));",
            testInputs: [20, 3],
            expectedReturn: 54,
            commands: [
              {
                code: "function calcularTotal(preco, qtd) { return preco * qtd; }\nfunction aplicarDesconto(total) { return total * 0.9; }\naplicarDesconto(calcularTotal(20, 3));",
                label: "Encadeamento de funções",
              },
            ],
            explanation: {
              scenario:
                "A primeira máquina calculou 60 (20 * 3) e entregou direto na entrada da máquina de desconto, gerando 54.",
              engine:
                "O retorno de calcularTotal(20, 3) foi passado como argumento imediato para aplicarDesconto(total).",
              rule: "A saída de uma função pode alimentar diretamente a entrada de outra, compondo fluxos complexos.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 10: CAVERNA DOS ESCOPOS
      // ==========================================
      {
        id: "ATIVIDADE 10",
        title: "Caverna dos Escopos (Torre de Salas e Acesso)",
        manual: `<h6>Escopo em JS:</h6><p>Variáveis dentro de funções ou blocos <code>{ }</code> com let/const não são acessíveis de fora!</p>`,
        steps: [
          {
            desc: "Salão Principal vs Sala Fechada: acesse a chave pelo return.",
            guideSpeech:
              "Variáveis criadas dentro de uma função pertencem àquela sala. A única forma de acessá-las pelo corredor é com <code>return</code>!",
            initialCode:
              'function entrarNaSala() {\n  const chaveSecreta = "CHAVE-42";\n  return chaveSecreta;\n}\n\nconst chave = entrarNaSala();',
            requiresReturnAccess: true,
            commands: [
              {
                code: 'function entrarNaSala() {\n  const chaveSecreta = "CHAVE-42";\n  return chaveSecreta;\n}\nconst chave = entrarNaSala();',
                label: "Retornar chave da sala",
              },
            ],
            explanation: {
              scenario:
                "O baú chaveSecreta estava trancado dentro da sala. A única forma de obtê-lo no corredor foi através do return.",
              engine:
                "Variáveis declaradas com let ou const dentro de uma função têm escopo de função e não existem no escopo externo.",
              rule: "Para disponibilizar um dado criado dentro de uma função para o resto do programa, retorne-o com return.",
            },
          },
          {
            desc: "A Porta dos Blocos: compare let vs var dentro de um bloco { }.",
            guideSpeech:
              "Variáveis <code>let</code> e <code>const</code> ficam presas dentro do bloco <code>{ }</code>. O bloco cria uma barreira de proteção!",
            initialCode:
              '{\n  let tesouroBloco = "Ouro";\n}\n// tesouroBloco não vaza para fora!',
            isBlockScopeTest: true,
            commands: [
              {
                code: '{\n  let tesouroBloco = "Ouro";\n}',
                label: "Bloco com let protegido",
              },
            ],
            explanation: {
              scenario:
                "A porta do bloco { } manteve o let isolado lá dentro, prevenindo poluição do ambiente externo.",
              engine:
                "let e const possuem escopo de bloco (Block Scope). Qualquer par de chaves { } cria uma barreira de proteção.",
              rule: "Sempre utilize let e const para manter variáveis restritas ao menor bloco possível onde são necessárias.",
            },
          },
          {
            desc: "O Mensageiro que se lembra: construa uma Closure.",
            guideSpeech:
              "Uma função interna mantém acesso às variáveis da função que a criou, mesmo depois que a de fora já terminou!",
            initialCode:
              "function criarContador() {\n  let contador = 0;\n  return function() {\n    contador++;\n    return contador;\n  };\n}\n\nconst contar = criarContador();\ncontar();\ncontar();",
            isClosureTest: true,
            commands: [
              {
                code: "function criarContador() {\n  let contador = 0;\n  return function() {\n    contador++;\n    return contador;\n  };\n}\nconst contar = criarContador();\ncontar();\ncontar();",
                label: "Closure com contador",
              },
            ],
            explanation: {
              scenario:
                "A função retornada carregou a variável contador em sua mochila léxica e continuou incrementando de 1 em 1.",
              engine:
                "Uma closure é a combinação de uma função com as referências ao seu ambiente léxico envolvente no momento de criação.",
              rule: "Closures permitem encapsular estados privados que persistem entre chamadas sucessivas da função.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 11: TORRE DA CALL STACK
      // ==========================================
      {
        id: "ATIVIDADE 11",
        title: "Torre da Call Stack (Pilha LIFO e Recursão)",
        manual: `<h6>Call Stack:</h6><p>Pilha de execução (Last In, First Out). Cada chamada empilha um frame. Recursão exige caso base!</p>`,
        steps: [
          {
            desc: "Chamadas Aninhadas: Construtor -> Pintor -> Entregador na pilha LIFO.",
            guideSpeech:
              "Veja a ordem de empilhamento: a última função que entra na pilha é a primeira que precisa terminar!",
            initialCode:
              'function entregar() {\n  return "Entrega ok";\n}\nfunction pintar() {\n  return entregar();\n}\nfunction construir() {\n  return pintar();\n}\n\nconstruir();',
            callFlow: ["construir", "pintar", "entregar"],
            commands: [
              {
                code: 'function entregar() { return "Entrega ok"; }\nfunction pintar() { return entregar(); }\nfunction construir() { return pintar(); }\nconstruir();',
                label: "Empilhar chamadas 3 níveis",
              },
            ],
            explanation: {
              scenario:
                "A torre empilhou construir, depois pintar e no topo entregar. Ao terminar, desempilhou na ordem inversa.",
              engine:
                "A Call Stack opera no modelo LIFO (Last In, First Out). A função no topo tem o controle até retornar.",
              rule: "Uma função que chama outra fica suspensa na pilha até que a chamada interna termine e devolva o valor.",
            },
          },
          {
            desc: "Recursão com Caso Base: Fatorial de 4 (4 * 3 * 2 * 1 = 24).",
            guideSpeech:
              "Uma função recursiva chama a si mesma até atingir o caso base. Calcule o fatorial de 4!",
            initialCode:
              "function fatorial(n) {\n  if (n <= 1) return 1;\n  return n * fatorial(n - 1);\n}\n\nfatorial(4);",
            expectedReturn: 24,
            commands: [
              {
                code: "function fatorial(n) {\n  if (n <= 1) return 1;\n  return n * fatorial(n - 1);\n}\nfatorial(4);",
                label: "Recursão fatorial(4)",
              },
            ],
            explanation: {
              scenario:
                "A torre empilhou fatorial(4), 3, 2 até o caso base 1. Em seguida, desceu multiplicando os retornos até 24.",
              engine:
                "O caso base (if n <= 1) interrompe as novas chamadas e inicia o retorno dos valores acumulados.",
              rule: "Toda função recursiva precisa obrigatoriamente de um caso base para evitar loop infinito na pilha.",
            },
          },
          {
            desc: "Alarme de Estouro de Pilha: Recursão sem caso base (Stack Overflow).",
            guideSpeech:
              "Se uma função chamar a si mesma sem parar, a torre bate no teto e o motor corta com <code>RangeError</code>!",
            initialCode:
              "function subirInfinito() {\n  return subirInfinito();\n}\n\nsubirInfinito();",
            isStackOverflowHazard: true,
            commands: [
              {
                code: "function subirInfinito() {\n  return subirInfinito();\n}\nsubirInfinito();",
                label: "Provocar Stack Overflow",
              },
            ],
            explanation: {
              scenario:
                "A torre ultrapassou a altura máxima segura e o alarme de emergência cortou o processo.",
              engine:
                "A Call Stack possui tamanho de memória limitado. Chamadas infinitas disparam RangeError: Maximum call stack size exceeded.",
              rule: "Monitore sempre a condição de parada em funções recursivas para não esgotar a pilha de execução.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 12: FÁBRICA DE ARROW FUNCTIONS
      // ==========================================
      {
        id: "ATIVIDADE 12",
        title: "Fábrica de Arrow Functions (Sintaxe Compacta)",
        manual: `<h6>Arrow Functions:</h6><p><code>const f = (x) => x * 2;</code><br>Corpo de expressão tem retorno implícito. Corpo com <code>{ }</code> exige <code>return</code>!</p>`,
        steps: [
          {
            desc: "Dobre a Máquina: converta somar(a, b) em arrow function equivalente.",
            guideSpeech:
              "Transforme a função tradicional na sintaxe de seta compacta com <code>const somar = (a, b) => a + b;</code>!",
            initialCode: "const somar = (a, b) => a + b;\n\nsomar(5, 7);",
            expectedReturn: 12,
            commands: [
              {
                code: "const somar = (a, b) => a + b;\nsomar(5, 7);",
                label: "Arrow function compacta",
              },
            ],
            explanation: {
              scenario:
                "A prensa mecânica compactou a declaração eliminando a palavra function e mantendo o mesmo resultado 12.",
              engine:
                "Arrow functions de expressão única utilizam retorno implícito sem necessidade de chaves {} nem da palavra return.",
              rule: "Quando o corpo da arrow function contém apenas uma expressão, ela é retornada automaticamente.",
            },
          },
          {
            desc: "A armadilha das chaves: bloco sem return devolve undefined.",
            guideSpeech:
              "Cuidado: se colocar chaves <code>{ }</code> na arrow function, você DEVE escrever <code>return</code>!",
            initialCode:
              "const dobrar = (n) => {\n  return n * 2;\n};\n\ndobrar(10);",
            expectedReturn: 20,
            commands: [
              {
                code: "const dobrar = (n) => {\n  return n * 2;\n};\ndobrar(10);",
                label: "Arrow com bloco e return",
              },
            ],
            explanation: {
              scenario:
                "Ao utilizar chaves {}, a função abriu um corpo de bloco formal, exigindo a palavra return explícita.",
              engine:
                "Chaves {} em arrow functions indicam corpo de bloco. Sem a palavra return, a expressão não é devolvida.",
              rule: "Se abriu chaves em uma arrow function, escreva return quando precisar devolver um valor.",
            },
          },
          {
            desc: "Retornando Objetos com Arrow Function: use parênteses ({ }).",
            guideSpeech:
              "Para retornar um objeto direto sem chaves de bloco, envolva-o em parênteses: <code>() => ({ a: 1 })</code>!",
            initialCode:
              'const criarCard = (nome, xp) => ({\n  nome: nome,\n  xp: xp\n});\n\ncriarCard("Bit", 100);',
            isObjectReturnTest: true,
            commands: [
              {
                code: 'const criarCard = (nome, xp) => ({\n  nome: nome,\n  xp: xp\n});\ncriarCard("Bit", 100);',
                label: "Retorno de objeto com ({ })",
              },
            ],
            explanation: {
              scenario:
                "A máquina produziu um cartão de objeto completo utilizando parênteses envolventes.",
              engine:
                "Os parênteses ({}) evitam que o compilador confunda as chaves do objeto com o início de um corpo de bloco.",
              rule: "Para retornar um objeto literal de forma implícita em uma arrow function, envolva-o sempre entre parênteses.",
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
      if (!data.completedWorlds.includes("mundo3")) {
        data.completedWorlds.push("mundo3");
      }

      localStorage.setItem("JS_QUEST_DATA_V1", JSON.stringify(data));
    } catch (e) {
      console.error("Erro ao salvar progresso do Mundo 3:", e);
    }
  }

  /**
   * EXECUTOR UNIVERSAL DE CÓDIGO
   * Captura o valor de retorno real de qualquer chamada ou declaração
   */
  runScript(code) {
    let normalized = code.trim();
    const declMatch = normalized.match(
      /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=[^;]+;?\s*$/,
    );
    if (declMatch) {
      const varName = declMatch[1];
      normalized += `;\n${varName};`;
    }

    return Function(`
      "use strict";
      return eval(${JSON.stringify(normalized)});
    `)();
  }

  // --- INTERPRETADOR 1: MÁQUINA DE TRANSFORMAR ---
  simulateTransform(code, step) {
    let result = undefined;
    let hasError = false;
    let errorMessage = "";

    try {
      result = this.runScript(code);
    } catch (err) {
      hasError = true;
      errorMessage = err.message;
    }

    let isSuccess = false;
    if (!hasError) {
      if (step.isUndefinedTest) {
        isSuccess = result === undefined;
      } else if (step.expectedReturn !== undefined) {
        isSuccess = result === step.expectedReturn;
      }
    }

    return {
      ok: !hasError,
      error: errorMessage,
      result: result,
      isSuccess: isSuccess,
    };
  }

  // --- INTERPRETADOR 2: CAVERNA DOS ESCOPOS ---
  simulateScope(code, step) {
    let result = undefined;
    let hasError = false;
    let errorMessage = "";

    try {
      result = this.runScript(code);
    } catch (err) {
      hasError = true;
      errorMessage = err.message;
    }

    let isSuccess = false;
    if (step.requiresReturnAccess) {
      isSuccess = result === "CHAVE-42";
    } else if (step.isBlockScopeTest) {
      isSuccess = !hasError && code.includes("let");
    } else if (step.isClosureTest) {
      isSuccess =
        !hasError &&
        (result === 2 || result === 1 || code.includes("contador++"));
    }

    return {
      ok: !hasError,
      error: errorMessage,
      result: result,
      isSuccess: isSuccess,
    };
  }

  // --- INTERPRETADOR 3: CALL STACK ---
  simulateCallStack(code, step) {
    let stackFrames = [];
    let isOverflow = false;
    let result = undefined;
    let hasError = false;
    let errorMessage = "";

    if (step.isStackOverflowHazard || code.includes("subirInfinito")) {
      isOverflow = true;
      stackFrames = [
        "subirInfinito()",
        "subirInfinito()",
        "subirInfinito()",
        "subirInfinito()",
        "subirInfinito()",
        "subirInfinito()",
      ];
      return {
        ok: false,
        isOverflow: true,
        error: "RangeError: Maximum call stack size exceeded",
        stackFrames: stackFrames,
        isSuccess: true,
      };
    }

    try {
      result = this.runScript(code);
    } catch (err) {
      hasError = true;
      errorMessage = err.message;
    }

    let isSuccess = false;
    if (!hasError) {
      if (step.callFlow) {
        stackFrames = step.callFlow.map((f) => `${f}()`);
        isSuccess = true;
      } else if (step.expectedReturn !== undefined) {
        isSuccess = result === step.expectedReturn;
        stackFrames = [
          "fatorial(4)",
          "fatorial(3)",
          "fatorial(2)",
          "fatorial(1)",
        ];
      }
    }

    return {
      ok: !hasError,
      error: errorMessage,
      result: result,
      stackFrames: stackFrames,
      isOverflow: isOverflow,
      isSuccess: isSuccess,
    };
  }

  // --- INTERPRETADOR 4: ARROW FUNCTIONS ---
  simulateArrow(code, step) {
    let result = undefined;
    let hasError = false;
    let errorMessage = "";

    try {
      result = this.runScript(code);
    } catch (err) {
      hasError = true;
      errorMessage = err.message;
    }

    let isSuccess = false;
    if (!hasError) {
      if (step.isObjectReturnTest) {
        isSuccess =
          typeof result === "object" &&
          result !== null &&
          result.nome === "Bit";
      } else if (step.expectedReturn !== undefined) {
        isSuccess = result === step.expectedReturn;
      }
    }

    return {
      ok: !hasError,
      error: errorMessage,
      result: result,
      isSuccess: isSuccess,
    };
  }
}
