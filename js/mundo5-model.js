/**
 * JS QUEST - MUNDO 5: MODEL (INSTRUÇÕES E REGRAS CORRIGIDAS)
 */
class Mundo5Model {
  constructor() {
    this.xp = 0;
    this.activeActivityIndex = 0;
    this.activeStepIndex = 0;

    this.activities = [
      // ==========================================
      // ATIVIDADE 17: DOM DUNGEON
      // ==========================================
      {
        id: "ATIVIDADE 17",
        title: "DOM Dungeon (Castelo, Classes e Estilos)",
        manual: `<h6>Manipulação do DOM:</h6><p><code>document.querySelector('#id')</code> localiza um elemento.<br><code>el.classList.add('open')</code> adiciona classes CSS.<br><code>el.classList.toggle('lit')</code> alterna classes.<br><code>document.createElement('div')</code> cria um novo elemento, e <code>pai.appendChild(filho)</code> o anexa à tela.</p>`,
        steps: [
          {
            desc: "Abrir o Portão: Localize o portão e adicione a classe 'open'.",
            guideSpeech:
              "Passo 1: Clique em <strong>+ Aplicar</strong> e depois em <strong>EXECUTAR CÓDIGO</strong> para usar <code>porta.classList.add('open')</code> e destravar a passagem do castelo!",
            initialCode:
              "const porta = document.querySelector('#castle-door');\nporta.classList.add('open');",
            targetAction: "doorOpen",
            commands: [
              {
                code: "const porta = document.querySelector('#castle-door');\nporta.classList.add('open');",
                label: "Adicionar classe 'open'",
              },
            ],
            explanation: {
              scenario:
                "A porta do castelo destrancou e brilhou em ciano assim que a classe 'open' foi adicionada.",
              engine:
                "O motor recalculou a cascata CSS (CSSOM) e aplicou as regras de transição da classe no elemento.",
              rule: "classList.add() adiciona uma classe CSS sem substituir nem apagar classes já existentes.",
            },
          },
          {
            desc: "Acender a Tocha: Localize a tocha e alterne com classList.toggle('lit').",
            guideSpeech:
              "Passo 2: Clique em <strong>EXECUTAR CÓDIGO</strong> para acender o fogo da tocha usando <code>tocha.classList.toggle('lit')</code>!",
            initialCode:
              "const tocha = document.querySelector('#torch');\ntocha.classList.toggle('lit');",
            targetAction: "torchLit",
            commands: [
              {
                code: "const tocha = document.querySelector('#torch');\ntocha.classList.toggle('lit');",
                label: "toggle('lit') na tocha",
              },
            ],
            explanation: {
              scenario:
                "A tocha cinzenta se transformou em fogo ardente projetando luz no calabouço.",
              engine:
                "classList.toggle adiciona a classe caso ela não exista, ou a remove se já estiver presente.",
              rule: "classList.toggle() é a forma ideal de ligar/desligar estados de elementos visuais.",
            },
          },
          {
            desc: "Invocar Guardião: Crie um elemento div com texto e anexe com appendChild().",
            guideSpeech:
              "Passo 3: Vamos materializar o Guardião! Crie um elemento <code>div</code>, dê a ele texto e anexe dentro de <code>#dungeon-room</code> com <code>appendChild()</code>.",
            initialCode:
              "const sala = document.querySelector('#dungeon-room');\nconst mob = document.createElement('div');\nmob.id = 'guardian-mob';\nmob.className = 'dungeon-mob';\nmob.textContent = '👾 Guardião Ativo!';\nsala.appendChild(mob);",
            targetAction: "spawnMob",
            commands: [
              {
                code: "const sala = document.querySelector('#dungeon-room');\nconst mob = document.createElement('div');\nmob.id = 'guardian-mob';\nmob.className = 'dungeon-mob';\nmob.textContent = '👾 Guardião Ativo!';\nsala.appendChild(mob);",
                label: "Criar e anexar o Guardião",
              },
            ],
            explanation: {
              scenario:
                "O Guardião 👾 surgiu fisicamente dentro da sala do calabouço com texto e borda vermelha pulsante.",
              engine:
                "document.createElement criou o nó na memória RAM, textContent preencheu o texto e appendChild o fixou na árvore visual do DOM.",
              rule: "Elementos criados dinamicamente só aparecem na tela quando anexados a um elemento pai já presente no DOM.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 18: CAÇA AOS EVENTOS (RADAR)
      // ==========================================
      {
        id: "ATIVIDADE 18",
        title: "Caça aos Eventos (addEventListener)",
        manual: `<h6>Event Listeners:</h6><p><code>elemento.addEventListener('evento', callback)</code> instala sensores de escuta.<br><strong>'click'</strong>: Dispara quando o usuário clica com o botão do mouse.<br><strong>'mouseover'</strong>: Dispara assim que o cursor do mouse passa por cima do elemento.</p>`,
        steps: [
          {
            desc: "Missão 1 (CLIQUE): Execute o código e depois CLIQUE na runa mágica no palco!",
            guideSpeech:
              "👉 <strong>ETAPA 1:</strong> Clique em <strong>EXECUTAR CÓDIGO</strong> para ligar o sensor.<br>👉 <strong>ETAPA 2:</strong> Vá até a runa no palco central e <strong>CLIQUE NELA</strong> com o mouse para revelar o segredo!",
            initialCode:
              "const runa = document.querySelector('#event-rune');\nruna.addEventListener('click', () => {\n  runa.classList.add('revealed');\n});",
            eventType: "click",
            actionInstruction: "👆 CLIQUE NA RUNA COM O MOUSE!",
            commands: [
              {
                code: "const runa = document.querySelector('#event-rune');\nruna.addEventListener('click', () => {\n  runa.classList.add('revealed');\n});",
                label: "Ouvinte de clique ('click')",
              },
            ],
            explanation: {
              scenario:
                "Você registrou o ouvinte com o código e depois, ao clicar na runa, o evento foi acionado revelando o segredo.",
              engine:
                "O EventTarget registrou a função no gatilho 'click'. O motor disparou o callback no loop de eventos ao detectar o toque.",
              rule: "addEventListener registra uma função callback que aguarda a ação do usuário sem bloquear a execução da página.",
            },
          },
          {
            desc: "Missão 2 (MOUSEOVER): Execute o código e depois PASSE O MOUSE POR CIMA da runa!",
            guideSpeech:
              "👉 <strong>ETAPA 1:</strong> Clique em <strong>EXECUTAR CÓDIGO</strong> para ativar o radar.<br>👉 <strong>ETAPA 2:</strong> <strong>PASSE O CURSOR DO MOUSE POR CIMA DA RUNA</strong> (sem precisar clicar) para despertar o poder!",
            initialCode:
              "const runa = document.querySelector('#event-rune');\nruna.addEventListener('mouseover', () => {\n  runa.classList.add('revealed');\n});",
            eventType: "mouseover",
            actionInstruction: "🖱️ PASSE O MOUSE POR CIMA DA RUNA!",
            commands: [
              {
                code: "const runa = document.querySelector('#event-rune');\nruna.addEventListener('mouseover', () => {\n  runa.classList.add('revealed');\n});",
                label: "Ouvinte de hover ('mouseover')",
              },
            ],
            explanation: {
              scenario:
                "Ao cruzar a borda da runa com o mouse, o evento mouseover disparou instantaneamente sem necessidade de clique.",
              engine:
                "O navegador calcula colisões de coordenadas do ponteiro (hit testing) e dispara 'mouseover' ao entrar na caixa do elemento.",
              rule: "Use 'mouseover' para detectar aproximação do cursor e construir menus reativos ou tooltips.",
            },
          },
        ],
      },

      // ==========================================
      // ATIVIDADE 19: CONSTRUTOR DE MINIAPPS
      // ==========================================
      {
        id: "ATIVIDADE 19",
        title: "Construtor de Miniapps (Contador e Lista de Tarefas)",
        manual: `<h6>Aplicações Práticas:</h6><p>Combine estado (variáveis), seletores (querySelector) e eventos para criar ferramentas reais como contadores e gerenciadores de tarefas.</p>`,
        steps: [
          {
            desc: "Contador Interativo: Altere o número exibido no contador.",
            guideSpeech:
              "Execute o código para incrementar a variável <code>contador</code> e atualizar o <code>display.textContent</code>!",
            initialCode:
              "let contador = 0;\nconst display = document.querySelector('#counter-display');\ncontador++;\ndisplay.textContent = contador;",
            appKind: "counter",
            commands: [
              {
                code: "let contador = 0;\nconst display = document.querySelector('#counter-display');\ncontador++;\ndisplay.textContent = contador;",
                label: "Incrementar e renderizar contador",
              },
            ],
            explanation: {
              scenario:
                "O número exibido no painel atualizou para 1 sincronizando o estado com a interface.",
              engine:
                "textContent substituiu os nós filhos de texto do elemento de forma segura.",
              rule: "A sincronização entre o estado (variáveis) e o DOM é a base de todo o ecossistema moderno da web.",
            },
          },
          {
            desc: "Lista de Tarefas: Insira um novo item dinâmico na lista.",
            guideSpeech:
              "Crie um novo elemento <code>li</code> e use <code>appendChild</code> para anexá-lo na lista de afazeres!",
            initialCode:
              "const lista = document.querySelector('#todo-list');\nconst item = document.createElement('li');\nitem.className = 'todo-item-ui';\nitem.textContent = '📌 Dominar o DOM';\nlista.appendChild(item);",
            appKind: "todo",
            commands: [
              {
                code: "const lista = document.querySelector('#todo-list');\nconst item = document.createElement('li');\nitem.className = 'todo-item-ui';\nitem.textContent = '📌 Dominar o DOM';\nlista.appendChild(item);",
                label: "Criar e anexar <li> na lista",
              },
            ],
            explanation: {
              scenario:
                "O item '📌 Dominar o DOM' apareceu na lista de tarefas em tempo real.",
              engine:
                "Um novo elemento <li> foi incorporado ao nó pai <ul> e o navegador recalculou a árvore de layout.",
              rule: "Listas dinâmicas são criadas programaticamente manipulando os nós filhos de contêineres pais.",
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

      data.xp = (data.xp || 0) + (this.xp || 300);
      if (!data.completedWorlds) data.completedWorlds = [];
      if (!data.completedWorlds.includes("mundo5")) {
        data.completedWorlds.push("mundo5");
      }

      localStorage.setItem("JS_QUEST_DATA_V1", JSON.stringify(data));
    } catch (e) {
      console.error("Erro ao salvar progresso do Mundo 5:", e);
    }
  }

  runScript(code) {
    const fn = new Function(code);
    return fn();
  }
}
