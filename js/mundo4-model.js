/**
 * JS QUEST - MUNDO 4: MODEL (INTERPRETADOR REAL E AVALIADOR SEGURO)
 */
class Mundo4Model {
  constructor() {
    this.xp = 0;
    this.activeActivityIndex = 0;
    this.activeStepIndex = 0;

    this.activities = [
      // ==========================================
      // ATIVIDADE 13: TREM DOS ARRAYS
      // ==========================================
      {
        id: "ATIVIDADE 13",
        title: "Trem dos Arrays (push, pop, shift, splice)",
        manual: `<h6>Arrays em JS:</h6><p>Coleções ordenadas por índice numérico de 0 a N-1.<br><code>push()</code> insere no fim, <code>pop()</code> remove do fim.<br><code>shift()</code> remove do início, <code>unshift()</code> insere no início.<br><code>splice(idx, qtd)</code> altera posições específicas.</p>`,
        steps: [
          {
            desc: "Engatar no Fim: Use push() para adicionar o vagão 'Ouro' ao trem.",
            guideSpeech:
              "Arrays são trens ordenados com índices iniciando em 0. Chame <code>trem.push('Ouro')</code> para engatar no final!",
            initialCode:
              "const trem = ['Madeira', 'Carvao'];\ntrem.push('Ouro');\ntrem;",
            operationType: "push",
            expectedCount: 3,
            commands: [
              {
                code: "const trem = ['Madeira', 'Carvao'];\ntrem.push('Ouro');\ntrem;",
                label: "push('Ouro') no final",
              },
            ],
            explanation: {
              scenario:
                "O método push engatou um novo vagão no índice [2], expandindo a composição para 3 itens.",
              engine:
                "O motor JS aloca o novo elemento no endereço correspondente ao próximo índice livre e incrementa o atributo length.",
              rule: "array.push() adiciona um ou mais elementos no final do array e devolve o novo valor de length.",
            },
          },
          {
            desc: "Desengatar do Início: Use shift() para descarregar o primeiro elemento [0].",
            guideSpeech:
              "Para remover o primeiro vagão, use <code>trem.shift()</code>. Veja todos os outros vagões darem um passo à frente!",
            initialCode:
              "const trem = ['Passageiros', 'Cargas', 'Animais'];\nconst removido = trem.shift();\ntrem;",
            operationType: "shift",
            expectedCount: 2,
            commands: [
              {
                code: "const trem = ['Passageiros', 'Cargas', 'Animais'];\nconst removido = trem.shift();\ntrem;",
                label: "shift() no primeiro item",
              },
            ],
            explanation: {
              scenario:
                "O primeiro vagão ('Passageiros') foi descarregado e todos os outros vagões foram reindexados a partir do zero.",
              engine:
                "shift() remove o elemento no índice 0 e desloca todos os elementos subsequentes uma posição para a esquerda (índice i vira i - 1).",
              rule: "array.shift() remove o primeiro item do array e reajusta todos os índices existentes.",
            },
          },
          {
            desc: "Cirurgia no Trem com splice(): Remova 1 item a partir da posição [1].",
            guideSpeech:
              "O <code>splice(inicio, quantos)</code> é o canivete suíço dos arrays. Remova o vagão do meio!",
            initialCode:
              "const trem = ['Loco', 'Defeito', 'Seguro'];\ntrem.splice(1, 1);\ntrem;",
            operationType: "splice",
            expectedCount: 2,
            commands: [
              {
                code: "const trem = ['Loco', 'Defeito', 'Seguro'];\ntrem.splice(1, 1);\ntrem;",
                label: "splice(1, 1) remove o índice 1",
              },
            ],
            explanation: {
              scenario:
                "O vagão com falha na posição [1] foi retirado com precisão cirúrgica sem desmanchar o restante do comboio.",
              engine:
                "splice() altera o conteúdo do array no local exato, deletando e/ou inserindo novos elementos no índice indicado.",
              rule: "array.splice(início, quantidade) muta o array original removendo a quantidade informada a partir do índice.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 14: FÁBRICA DE PIZZAS (MAP, FILTER, REDUCE)
      // ==========================================
      {
        id: "ATIVIDADE 14",
        title: "Fábrica de Pizzas (map, filter e reduce)",
        manual: `<h6>Métodos de Ordem Superior:</h6><p><code>filter(fn)</code> seleciona elementos.<br><code>map(fn)</code> transforma cada elemento.<br><code>reduce(fn, inicial)</code> acumula toda a lista em um valor final.</p>`,
        steps: [
          {
            desc: "Controle de Qualidade: use .filter() para manter apenas pizzas de valor >= 30.",
            guideSpeech:
              "Use <code>.filter()</code> para descartar pizzas de baixo valor da esteira!",
            initialCode:
              "const pizzas = [{ sabor: 'Mussarela', preco: 25 }, { sabor: 'Trufada', preco: 60 }, { sabor: 'Especial', preco: 45 }];\nconst selecionadas = pizzas.filter(p => p.preco >= 30);\nselecionadas;",
            methodTest: "filter",
            commands: [
              {
                code: "const pizzas = [{ sabor: 'Mussarela', preco: 25 }, { sabor: 'Trufada', preco: 60 }, { sabor: 'Especial', preco: 45 }];\npizzas.filter(p => p.preco >= 30);",
                label: "Filtrar preco >= 30",
              },
            ],
            explanation: {
              scenario:
                "A esteira eliminou a pizza de 25 reais e manteve as opções gourmet na linha de produção.",
              engine:
                "filter executa o callback em cada elemento; quando retorna true o item é preservado no novo array gerado.",
              rule: "filter() nunca altera o array original: ele produz um novo array contendo apenas os itens aprovados.",
            },
          },
          {
            desc: "Etiqueta Gourmet: use .map() para transformar cada sabor em caixa alta.",
            guideSpeech:
              "O <code>.map()</code> transforma cada elemento individualmente. Adicione 'TOP: ' antes do sabor!",
            initialCode:
              "const pizzas = [{ sabor: 'Calabresa', preco: 30 }, { sabor: 'Quatro Queijos', preco: 40 }];\nconst gourmet = pizzas.map(p => 'TOP: ' + p.sabor);\ngourmet;",
            methodTest: "map",
            commands: [
              {
                code: "const pizzas = [{ sabor: 'Calabresa', preco: 30 }, { sabor: 'Quatro Queijos', preco: 40 }];\npizzas.map(p => 'TOP: ' + p.sabor);",
                label: "map() transformando sabores",
              },
            ],
            explanation: {
              scenario:
                "Todas as caixas receberam a nova etiqueta 'TOP: ' mantendo a mesma quantidade de itens na esteira.",
              engine:
                "map() itera por todos os itens aplicando a função e devolve um novo array com as transformações no mesmo comprimento.",
              rule: "map() sempre devolve um array com o mesmo tamanho do original, porém com os itens transformados.",
            },
          },
          {
            desc: "Caixa Registradora: calcule o total geral somando todos os preços com .reduce().",
            guideSpeech:
              "Agregue todos os valores em uma única quantia utilizando <code>.reduce()</code> com acumulador!",
            initialCode:
              "const precos = [30, 45, 60];\nconst total = precos.reduce((acum, valor) => acum + valor, 0);\ntotal;",
            methodTest: "reduce",
            expectedVal: 135,
            commands: [
              {
                code: "const precos = [30, 45, 60];\nprecos.reduce((acum, valor) => acum + valor, 0);",
                label: "reduce() somando preços",
              },
            ],
            explanation: {
              scenario:
                "O acumulador reuniu os valores 30 + 45 + 60 partindo de 0 e fechou a conta total em 135.",
              engine:
                "reduce() passa o resultado da iteração anterior para a próxima chamada de callback até gerar um único resultado.",
              rule: "reduce() colapsa uma lista inteira em um único valor final através do acumulador.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 15: VILA DOS OBJETOS
      // ==========================================
      {
        id: "ATIVIDADE 15",
        title: "Vila dos Objetos (Propriedades, Delete e This)",
        manual: `<h6>Objetos em JS:</h6><p>Pares chave-valor <code>{ chave: valor }</code>.<br>Propriedades são acessadas com <code>obj.prop</code>.<br><code>delete obj.prop</code> remove propriedades.<br><code>this</code> aponta para a própria instância do objeto.</p>`,
        steps: [
          {
            desc: "Pintando o Telhado: Altere a propriedade casa.teto para 'vermelho'.",
            guideSpeech:
              "Objetos representam entidades do mundo real. Mude a cor do telhado acessando <code>casa.teto = 'vermelho'</code>!",
            initialCode:
              "const casa = { teto: 'azul', morador: 'Bit', aberta: false };\ncasa.teto = 'vermelho';\ncasa;",
            objectCheck: "roofChange",
            commands: [
              {
                code: "const casa = { teto: 'azul', morador: 'Bit', aberta: false };\ncasa.teto = 'vermelho';\ncasa;",
                label: "Pintar teto de vermelho",
              },
            ],
            explanation: {
              scenario:
                "O atributo teto da casa foi sobrescrito de azul para vermelho imediatamente.",
              engine:
                "O operador de atribuição direta muta a chave existente no mapa interno de slots do objeto na memória heap.",
              rule: "Propriedades de objetos declarados com const podem ter seus valores alterados normalmente.",
            },
          },
          {
            desc: "Demolindo o Telhado: Use delete casa.teto para remover a propriedade.",
            guideSpeech:
              "Para desanexar uma propriedade de um objeto, utilize a palavra reservada <code>delete</code>!",
            initialCode:
              "const casa = { teto: 'vermelho', morador: 'Bit', aberta: false };\ndelete casa.teto;\ncasa;",
            objectCheck: "deleteCheck",
            commands: [
              {
                code: "const casa = { teto: 'vermelho', morador: 'Bit', aberta: false };\ndelete casa.teto;\ncasa;",
                label: "delete casa.teto",
              },
            ],
            explanation: {
              scenario:
                "A casa perdeu o telhado; agora, tentar ler casa.teto devolve undefined porque a chave não existe mais.",
              engine:
                "O operador delete desvincula a chave da estrutura do objeto, liberando a referência correspondente.",
              rule: "delete remove propriedades inteiras de um objeto, e não apenas o seu conteúdo.",
            },
          },
          {
            desc: "Método com 'this': Faça a casa abrir a porta usando this.aberta = true.",
            guideSpeech:
              "Métodos são funções que pertencem a objetos. Use <code>this</code> para manipular os próprios atributos!",
            initialCode:
              "const casa = {\n  morador: 'Bit',\n  aberta: false,\n  abrirPorta() {\n    this.aberta = true;\n  }\n};\ncasa.abrirPorta();\ncasa;",
            objectCheck: "thisMethod",
            commands: [
              {
                code: "const casa = {\n  morador: 'Bit',\n  aberta: false,\n  abrirPorta() {\n    this.aberta = true;\n  }\n};\ncasa.abrirPorta();\ncasa;",
                label: "Método usando this.aberta",
              },
            ],
            explanation: {
              scenario:
                "Ao invocar casa.abrirPorta(), o this referenciou a própria casa e destrancou sua porta.",
              engine:
                "Em métodos de objetos, a palavra-chave this faz referência ao objeto à esquerda do ponto na chamada da função.",
              rule: "O this dentro de um método tradicional aponta diretamente para o objeto que realizou a invocação.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 16: JSON JUNGLE
      // ==========================================
      {
        id: "ATIVIDADE 16",
        title: "JSON Jungle (Validação e Árvore de Dados)",
        manual: `<h6>JSON (JavaScript Object Notation):</h6><p>Formato de texto estrito. Todas as chaves e strings usam aspas duplas <code>" "</code>. Não suporta funções nem vírgula extra no final (trailing comma)!</p>`,
        steps: [
          {
            desc: "Estruturar Dados do Explorador: Valide um objeto JSON com chaves em aspas duplas.",
            guideSpeech:
              'No JSON, todas as chaves e textos exigem aspas duplas obrigatórias <code>"chave": "valor"</code>!',
            initialCode:
              'JSON.parse(\'{\\n  "nome": "Bit",\\n  "nivel": 4,\\n  "ativo": true\\n}\');',
            jsonTest: true,
            commands: [
              {
                code: 'JSON.parse(\'{\\n  "nome": "Bit",\\n  "nivel": 4,\\n  "ativo": true\\n}\');',
                label: "JSON Válido com aspas duplas",
              },
            ],
            explanation: {
              scenario:
                "A string JSON foi analisada e convertida na árvore estruturada da selva com sucesso.",
              engine:
                "JSON.parse analisa a cadeia textual caractere por caractere conforme a especificação RFC 8259.",
              rule: "JSON exige aspas duplas estritas nas chaves e não aceita apóstrofos/aspas simples.",
            },
          },
          {
            desc: "Armadilha da Vírgula Sobrando: Encontre e corrija o SyntaxError no JSON Jungle.",
            guideSpeech:
              "Atenção: JSON não permite vírgula no último item! Remova a vírgula sobressalente.",
            initialCode:
              'JSON.parse(\'{\\n  "reino": "Floresta",\\n  "itens": ["Bussola", "Mapa"]\\n}\');',
            jsonTest: true,
            commands: [
              {
                code: 'JSON.parse(\'{\\n  "reino": "Floresta",\\n  "itens": ["Bussola", "Mapa"]\\n}\');',
                label: "JSON sem vírgula sobrando",
              },
            ],
            explanation: {
              scenario:
                "Ao remover a vírgula do último elemento, a árvore da floresta se estabilizou sem alarmes.",
              engine:
                "Diferente de literais normais do JavaScript, o analisador do JSON rejeita 'trailing commas'.",
              rule: "Nunca deixe vírgulas sobrando após a última propriedade ou item em um formato JSON.",
            },
          },
          {
            desc: "Serialização com JSON.stringify: Converta um objeto da memória em texto seguro.",
            guideSpeech:
              "Use <code>JSON.stringify(objeto)</code> para transformar dados em texto pronto para envio!",
            initialCode:
              "const mochila = { pocao: 2, ouro: 50 };\nJSON.stringify(mochila);",
            jsonStringifyTest: true,
            commands: [
              {
                code: "const mochila = { pocao: 2, ouro: 50 };\nJSON.stringify(mochila);",
                label: "JSON.stringify() em string",
              },
            ],
            explanation: {
              scenario:
                "O objeto da memória foi embalado em uma string pura com chaves entre aspas pronta para tráfego em rede.",
              engine:
                "JSON.stringify varre as propriedades enumeráveis e produz uma representação canônica em string.",
              rule: "JSON.stringify converte objetos em texto; JSON.parse faz o caminho inverso.",
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
      if (!data.completedWorlds.includes("mundo4")) {
        data.completedWorlds.push("mundo4");
      }

      localStorage.setItem("JS_QUEST_DATA_V1", JSON.stringify(data));
    } catch (e) {
      console.error("Erro ao salvar progresso do Mundo 4:", e);
    }
  }

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

  // --- INTERPRETADOR 1: TREM DOS ARRAYS ---
  simulateTrain(code, step) {
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
    let trainState = ["Madeira", "Carvao"];

    if (!hasError && Array.isArray(result)) {
      trainState = result;
      if (step.expectedCount) {
        isSuccess = result.length === step.expectedCount;
      } else {
        isSuccess = true;
      }
    }

    return {
      ok: !hasError,
      error: errorMessage,
      result: result,
      trainState: trainState,
      isSuccess: isSuccess,
    };
  }

  // --- INTERPRETADOR 2: FÁBRICA DE PIZZAS ---
  simulatePizzas(code, step) {
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
      if (step.methodTest === "filter") {
        isSuccess = Array.isArray(result) && result.length === 2;
      } else if (step.methodTest === "map") {
        isSuccess =
          Array.isArray(result) &&
          result.length === 2 &&
          typeof result[0] === "string";
      } else if (step.methodTest === "reduce") {
        isSuccess = result === step.expectedVal;
      }
    }

    return {
      ok: !hasError,
      error: errorMessage,
      result: result,
      isSuccess: isSuccess,
    };
  }

  // --- INTERPRETADOR 3: VILA DOS OBJETOS ---
  simulateVillage(code, step) {
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
    let houseObj = { teto: "red", morador: "Bit", aberta: false };

    if (!hasError && typeof result === "object" && result !== null) {
      houseObj = result;
      if (step.objectCheck === "roofChange") {
        isSuccess = result.teto === "vermelho" || result.teto === "red";
      } else if (step.objectCheck === "deleteCheck") {
        isSuccess = !("teto" in result);
      } else if (step.objectCheck === "thisMethod") {
        isSuccess = result.aberta === true;
      }
    }

    return {
      ok: !hasError,
      error: errorMessage,
      result: result,
      houseObj: houseObj,
      isSuccess: isSuccess,
    };
  }

  // --- INTERPRETADOR 4: JSON JUNGLE ---
  simulateJson(code, step) {
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
    let parsedObj = {};

    if (!hasError) {
      if (step.jsonStringifyTest) {
        isSuccess = typeof result === "string" && result.includes('"ouro":50');
        try {
          parsedObj = JSON.parse(result);
        } catch (e) {
          parsedObj = { texto: result };
        }
      } else if (typeof result === "object" && result !== null) {
        parsedObj = result;
        isSuccess = true;
      }
    }

    return {
      ok: !hasError,
      error: errorMessage,
      result: result,
      parsedObj: parsedObj,
      isSuccess: isSuccess,
    };
  }
}
