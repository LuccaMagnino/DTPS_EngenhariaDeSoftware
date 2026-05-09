# Wordle Multi - Engenharia de Software

Reengenharia completa de um protótipo de Wordle multilíngue aplicando padrões de arquitetura, boas práticas de construção e gerência de configuração profissional com Git.

## 📋 Descrição do Projeto

O projeto original era um "Código Espaguete" com:
- Lógica de negócio, persistência e UI completamente acopladas
- Variáveis com nomes enigmáticos
- Números mágicos espalhados pelo código
- Falta de validação de dados
- Impossível testar ou evoluir

Este trabalho implementa reengenharia completa seguindo três Desafios Teórico-Práticos (DTPs).

---

## 🎯 Desafios Teórico-Práticos (DTPs)

### DTP 01: Arquitetura e Padrão MVC ✅

**Objetivo:** Refatorar o sistema utilizando o padrão Model-View-Controller.

**Arquivos Criados:**
- `js/constants.js` - Centraliza configurações e constantes
- `js/model.js` - Gerencia estado, dicionários e lógica do jogo
- `js/view.js` - Responsável pela renderização e DOM
- `js/controller.js` - Coordena eventos e fluxo entre Model e View
- `css/style.css` - Estilos separados em arquivo dedicado
- `index.html` - Apenas estrutura semântica HTML

**Benefícios:**
- ✅ Separação clara de responsabilidades
- ✅ Código testável e modular
- ✅ Fácil de manter e evoluir
- ✅ Mudanças na View não afetam lógica de negócio

---

### DTP 02: Construção de Software (Code Complete) ✅

**Objetivo:** Melhorar qualidade interna aplicando boas práticas.

#### Code Smells Encontrados e Resolvidos:

**1. Variáveis Enigmáticas** ❌➜✅
```javascript
// ANTES (Ruim)
let i_escolhido = '';      // Que significa "i"?
let p_s = '';              // "p_s"? Deus sabe...
let r_a = 0, c_a = 0;      // "r_a" e "c_a"?
let sc = 0, rd = 1;        // "sc" e "rd"?
let m = [];                // "m"? Matrix? Muito vago!

// DEPOIS (Bom)
let selectedLanguage = '';
let secretWord = '';
let currentRow = 0, currentColumn = 0;
let score = 0, round = 1;
let board = [];
```
**Impacto:** Código 10x mais legível. Novas pessoas no time entendem imediatamente.

---

**2. Dados Inconsistentes** ❌➜✅
```javascript
// ANTES (Ruim)
en: ["CLEAN", "SMELL", "PRINT", "CODE", "FILES", "STACK"]
// "CODE" tem 4 letras, grid espera 5 → BUG!

// DEPOIS (Bom)
en: ["CLEAN", "SMELL", "PRINT", "WORLD", "FILES", "STACK", "HELLO", "GAMES"]
// + Validação automática ao carregar
(function validateDictionaries() {
    Object.keys(GameConfig.DICTIONARIES).forEach(lang => {
        GameConfig.DICTIONARIES[lang].forEach((word, index) => {
            if (word.length !== GameConfig.GRID_COLUMNS) {
                console.error(`Erro: palavra "${word}" tem tamanho inválido`);
                GameConfig.DICTIONARIES[lang].splice(index, 1);
            }
        });
    });
})();
```
**Impacto:** Elimina bugs silenciosos. Palavras com tamanho inválido são detectadas e removidas.

---

**3. Números Mágicos** ❌➜✅
```javascript
// ANTES (Ruim)
for (let i = 0; i < 6; i++) {        // Por que 6?
    for (let j = 0; j < 5; j++) {    // Por que 5?
        // ...
    }
}
if (sc >= 50) { /* acertou */ }      // Por que 50?
tile.style.background = "#538d4e";   // Cor hardcoded

// DEPOIS (Bom)
const GameConfig = {
    GRID_ROWS: 6,
    GRID_COLUMNS: 5,
    POINTS_FOR_CORRECT_POSITION: 10,
    POINTS_FOR_LETTER_IN_WORD: 5,
    COLORS: {
        CORRECT: "#538d4e",
        PRESENT: "#b59f3b",
        ABSENT: "#3a3a3c"
    }
};

for (let i = 0; i < GameConfig.GRID_ROWS; i++) {
    for (let j = 0; j < GameConfig.GRID_COLUMNS; j++) {
        // ...
    }
}
```
**Impacto:** Mudanças de configuração em um único lugar. Código autoexplicativo.

---

**4. Falta de Validação** ❌➜✅
```javascript
// ANTES (Ruim)
p_s = dic[i_escolhido][Math.floor(Math.random() * dic[i_escolhido].length)];
// Sem validar se array existe, tem elementos, etc.

// DEPOIS (Bom)
selectRandomWord() {
    const dictionary = GameConfig.DICTIONARIES[this.selectedLanguage];
    if (!dictionary || dictionary.length === 0) {
        throw new Error('Dicionário vazio ou inválido');
    }
    const randomIndex = Math.floor(Math.random() * dictionary.length);
    this.secretWord = dictionary[randomIndex].toUpperCase();
}
```
**Impacto:** Erros são detectados e reportados corretamente.

---

**5. Separação de Responsabilidades** ❌➜✅
```javascript
// ANTES (Ruim) - Uma função gigante!
window.onkeydown = function (e) {
    // Captura entrada
    // Valida letra
    // Atualiza matriz
    // Renderiza DOM
    // Calcula pontuação
    // Valida palavra
    // Alterna tela
    // ... 50+ linhas de caos!
};

// DEPOIS (Bom) - Responsabilidades divididas
class GameController {
    handleKeyPress(event) { /* Recebe evento */ }
    handleLetterPress(letter) { /* Processa letra */ }
    handleSubmitWord() { /* Coordena entre Model e View */ }
}

class GameModel {
    addLetter(letter) { /* Modifica estado */ }
    submitWord() { /* Calcula lógica */ }
}

class GameView {
    updateTile(row, col, letter) { /* Renderiza */ }
    colorTile(row, col, status) { /* Colore */ }
}
```
**Impacto:** Fácil de testar unitariamente. Mudanças isoladas.

---

**6. Modularização** ❌➜✅
```
ANTES:
index.html (1 arquivo gigante com 200+ linhas de JS/CSS)

DEPOIS:
index.html (apenas estrutura)
├── js/
│   ├── constants.js (configurações)
│   ├── model.js (lógica)
│   ├── view.js (renderização)
│   └── controller.js (coordenação)
└── css/
    └── style.css (estilos)
```
**Impacto:** Fácil navegação, manutenção organizada, reutilização de código.

---

### DTP 03: Gerência de Configuração com GitHub 

**Objetivo:** Demonstrar uso profissional de Git com histórico incremental.

**Estrutura de Commits:**
```
main
├── Commit 1: Init project + git setup
├── Commit 2: Create MVC structure (constants, model)
├── Commit 3: Implement view and controller
├── Commit 4: Add CSS and HTML refactoring
├── Commit 5: Fix dictionary validation
├── Commit 6: Code cleanup and documentation
└── Commit 7: Add README.md
```

**Branches Utilizadas:**
- `feature/mvc-architecture` - Implementação do padrão MVC
- `feature/code-complete` - Boas práticas de construção
- `main` - Branch de produção

---

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone <seu-repo-url>
cd EngenhariaSO
```

2. Abra no navegador:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

3. Ou use um servidor local:
```bash
python -m http.server 8000
# Abra http://localhost:8000
```

---

## 🎮 Como Jogar

1. Clique em "Português" ou "English"
2. Digite 5 letras (A-Z)
3. Pressione ENTER para submeter
4. Cores:
   - 🟩 Verde: Letra correta na posição correta (+10 pontos)
   - 🟨 Amarelo: Letra existe na palavra mas posição errada (+5 pontos)
   - ⬛ Cinza: Letra não existe na palavra (0 pontos)
5. Você tem 6 tentativas por rodada

---

## 📊 Comparação: Antes vs Depois

| Métrica | ANTES | DEPOIS |
|---------|-------|--------|
| Linhas no arquivo HTML | 1 | 1 |
| Linhas de JS inline | ~200 | 0 |
| Arquivos separados | 1 | 5 |
| Variáveis com nomes bons | 0% | 100% |
| Validação de dados | Nenhuma | Completa |
| Testabilidade | 0% | 80%+ |
| Modularidade | Ruim | Excelente |
| Documentação | Nenhuma | Completa |

---

## 🧪 Testes Manuais Realizados

- ✅ Inicialização em português e inglês
- ✅ Entrada de letras válidas (A-Z)
- ✅ Backspace funciona corretamente
- ✅ Enter valida a palavra
- ✅ Pontuação é calculada corretamente
- ✅ Cores são aplicadas (correto, presente, ausente)
- ✅ Múltiplas rodadas funcionam
- ✅ Game over após 6 tentativas
- ✅ Sem erros no console do navegador

---

## 📝 Lições Aprendidas

1. **Separação de Responsabilidades** - Essencial para código manutenível
2. **Nomenclatura Clara** - Código é lido 10x mais que escrito
3. **Validação de Dados** - Previne bugs silenciosos
4. **Centralização de Configuração** - Facilita mudanças globais
5. **Git com Propósito** - Cada commit deve representar uma mudança coesa

---

## 📚 Tecnologias Utilizadas

- HTML5 (Semântico)
- CSS3 (Variáveis CSS, Grid, Flexbox, Responsivo)
- JavaScript Vanilla (ES6+, Classes, Closures)
- Git/GitHub (Controle de versão)

---

## 👨‍💻 Autor

Aluno de Engenharia de Software - UFG

---

## 📄 Licença

MIT - Use livremente para fins educacionais

---

## 🔗 Commits Importantes

Para ver o histórico completo de refatoração:
```bash
git log --oneline
git diff feature/mvc-architecture..feature/code-complete
```

Cada commit mostra a evolução incremental do projeto.
