# Guia de Desenvolvimento - Wordle Multi

## Arquitetura MVC Implementada

```
┌─────────────────────────────────────┐
│           User Interface            │
│          (index.html / CSS)         │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│     Controller (Coordenador)        │
│  - Recebe eventos do usuário        │
│  - Coordena Model e View            │
│  - Gerencia fluxo da aplicação      │
└──────┬──────────────────────┬───────┘
       │                      │
       ▼                      ▼
┌──────────────────┐  ┌─────────────────┐
│  Model           │  │  View           │
│  (Lógica)        │  │  (Renderização) │
│ - Estado         │  │ - DOM updates   │
│ - Regras         │  │ - Estilos       │
│ - Dados          │  │ - Feedback      │
└──────────────────┘  └─────────────────┘
```

## Estrutura de Arquivos

```
EngenhariaSO/
├── index.html          # Apenas estrutura HTML
├── README.md           # Documentação principal
├── DEVELOPMENT.md      # Este arquivo
├── .gitignore         # Configuração Git
│
├── css/
│   └── style.css      # Estilos unificados
│
├── js/
│   ├── constants.js   # Configurações e constantes (DTP 02)
│   ├── model.js       # Model - Lógica e Estado
│   ├── view.js        # View - Renderização
│   └── controller.js  # Controller - Coordenação
│
└── .git/              # Repositório Git
```

## Fluxo de Execução

### 1. Inicialização
```javascript
// 1. DOM carrega
document.addEventListener('DOMContentLoaded', () => {
    // 2. Cria instâncias
    const gameController = new GameController(gameModel, gameView);
    // 3. Exponibiliza função global
    window.startGameWithLanguage = ...
});
```

### 2. Início do Jogo
```
Clique em "Português" 
    ↓
startGameWithLanguage('pt')
    ↓
Controller.startGameWithLanguage('pt')
    ↓
Model.startGame('pt') → selectRandomWord()
View.showGameScreen()
View.renderBoard()
```

### 3. Input do Usuário
```
Tecla pressionada
    ↓
window.onkeydown (Controller)
    ↓
Model.addLetter(letter) / removeLetter() / submitWord()
    ↓
View.updateTile() / colorTile() / applyFeedback()
```

## Padrões de Design Utilizados

### 1. **MVC (Model-View-Controller)**
- **Model**: Separa lógica de negócio da interface
- **View**: Apenas renderização, nenhuma lógica
- **Controller**: Recebe eventos e coordena

### 2. **Observer Pattern**
- Controller observa eventos de teclado
- Notifica Model de mudanças
- View reage a mudanças do Model

### 3. **Mediator Pattern**
- Controller atua como mediador
- Model e View não se comunicam diretamente
- Reduz acoplamento

### 4. **Singleton Pattern**
- Instâncias globais de gameModel, gameView, gameController
- Garante uma única instância do jogo

## Boas Práticas Implementadas (DTP 02)

### ✅ Nomenclatura Clara
```javascript
// ❌ Evitado
let r_a = 0;    // Enigmático
let dic = [];   // Vago
let m = [];     // Muito ambíguo

// ✅ Utilizado
let currentRow = 0;
let dictionaries = {};
let board = [];
```

### ✅ Sem Números Mágicos
```javascript
// ❌ Evitado
if (score >= 50) { ... }
for (let i = 0; i < 6; i++) { ... }

// ✅ Utilizado
const GAME_CONFIG = {
    GRID_ROWS: 6,
    GRID_COLUMNS: 5,
    POINTS_FOR_CORRECT_POSITION: 10
};
```

### ✅ Validação de Dados
```javascript
// Valida dicionários ao carregar
(function validateDictionaries() { ... })();

// Valida seleção de idioma
if (!['pt', 'en'].includes(language)) {
    throw new Error('Idioma inválido');
}
```

### ✅ Separação de Responsabilidades
- Constants.js: Apenas configuração
- Model.js: Apenas lógica
- View.js: Apenas renderização
- Controller.js: Apenas coordenação

### ✅ Modularização
- Cada classe tem responsabilidade única
- Fácil de testar isoladamente
- Fácil de estender

## Como Adicionar Funcionalidades

### Exemplo: Adicionar novo idioma

```javascript
// 1. Constantes (js/constants.js)
MESSAGES: {
    es: {
        title: "WORDLE ENG",
        instructions: "Adivina la palabra de 5 letras."
    }
},
DICTIONARIES: {
    es: ["MUNDO", "GATOS", "PERRO", "CASA", "LIBRO", "MESA"]
}

// 2. Controller atualiza botão
<button class="btn-idioma" onclick="startGameWithLanguage('es')">Español</button>

// 3. Pronto! Sem mudanças no Model ou View
```

### Exemplo: Mudar cores

```javascript
// 1. Apenas atualizar constants.js
COLORS: {
    CORRECT: "#00FF00",      // Novo verde
    PRESENT: "#FFD700",      // Novo amarelo
    ABSENT: "#696969"        // Novo cinza
}

// 2. CSS e View usam variáveis
// Cores mudam automaticamente em toda aplicação!
```

## Testes Manuais

### Checklist de Funcionalidade

- [ ] Página inicial carrega corretamente
- [ ] Botões Português e English funcionam
- [ ] Digitação de letras funciona (A-Z)
- [ ] Backspace remove última letra
- [ ] Enter valida com 5 letras
- [ ] Pontuação é calculada corretamente
- [ ] Cores são aplicadas (verde, amarelo, cinza)
- [ ] Após acertar, nova rodada começa
- [ ] Após 6 tentativas, game over
- [ ] Troca de idioma funciona

### Teste de Navegador

```bash
# Firefox
firefox index.html

# Chrome
google-chrome index.html

# Edge
msedge index.html
```

### Verificar Console

```javascript
// Abrir DevTools (F12)
// Console deve estar vazio (sem erros)
```

## Git Workflow

### Branches Utilizadas

```
main (production)
├── feature/mvc-architecture (DTP 01)
└── feature/code-complete (DTP 02)
```

### Fazer um Novo Commit

```bash
# 1. Fazer mudança
# (editar arquivo)

# 2. Ver status
git status

# 3. Adicionar mudança
git add arquivo.js

# 4. Fazer commit
git commit -m "tipo(escopo): descrição"

# Exemplos:
# feat(model): adicionar nova validação
# fix(view): corrigir renderização de tiles
# docs(readme): atualizar instruções
# refactor(controller): simplificar handleKeyPress
```

### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudança em documentação
- `style`: Formatação de código
- `refactor`: Refatoração sem mudança de funcionalidade
- `test`: Adição de testes
- `chore`: Mudanças de ferramentas

## Debugging

### Verificar Estado do Game

```javascript
// No console (F12)
gameModel.getState()

// Output:
{
    selectedLanguage: "pt",
    score: 35,
    round: 1,
    currentRow: 1,
    currentColumn: 0,
    gameOver: false,
    board: [["T", "E", "S", "T", "E"], ...]
}
```

### Encontrar a Palavra Atual

```javascript
gameModel.secretWord
// Output: "TESTE"
```

### Simular Clique de Botão

```javascript
startGameWithLanguage('en')
```

## Performance Considerations

- Sem requisições HTTP
- Sem dependências externas
- Renderização rápida
- Memória mínima

## Compatibilidade de Navegadores

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (não suportado)

## Próximas Melhorias Possíveis

1. **Persistência**: Salvar score em LocalStorage
2. **Temas**: Dark/Light mode toggle
3. **Animações**: Transições suaves
4. **Testes Unitários**: Jest para testar Model
5. **Internacionalização**: i18n para mais idiomas
6. **Mobile**: Teclado virtual para mobile
7. **Estatísticas**: Histórico de partidas
8. **Multiplayer**: Comparar scores com outros

---

**Versão**: 1.0.0  
**Última atualização**: Maio 2026  
**Autor**: Aluno de Engenharia de Software - UFG
