/**
 * CONSTANTES DO JOGO WORDLE MULTI
 * Centraliza toda configuração do sistema
 * DTP 02: Code Complete - Eliminação de números mágicos
 */

const GameConfig = {
    // Dimensões do jogo
    GRID_ROWS: 6,
    GRID_COLUMNS: 5,
    
    // Pontuação
    POINTS_FOR_CORRECT_POSITION: 10,
    POINTS_FOR_LETTER_IN_WORD: 5,
    
    // Mensagens por idioma
    MESSAGES: {
        pt: {
            title: "WORDLE ENG",
            selectLanguage: "Escolha o idioma / Choose your language:",
            portuguese: "Português",
            english: "English",
            instructions: "Tente adivinhar a palavra de 5 letras.",
            correctAnswer: "Acertou!",
            gameOver: "Fim/End! Word: ",
            score: "SCORE",
            round: "RODADA/ROUND",
            incompleteWord: "Palavra incompleta! Digite 5 letras."
        },
        en: {
            title: "WORDLE ENG",
            selectLanguage: "Escolha o idioma / Choose your language:",
            portuguese: "Português",
            english: "English",
            instructions: "Guess the 5-letter word.",
            correctAnswer: "Correct!",
            gameOver: "Game Over! Word: ",
            score: "SCORE",
            round: "ROUND",
            incompleteWord: "Incomplete word! Type 5 letters."
        }
    },
    
    // Dicionários validados (5 letras cada)
    DICTIONARIES: {
        pt: ["TESTE", "DADOS", "LOGIC", "PILHA", "SUITE", "MOUSE", "TELAS", "CRIAR"],
        en: ["CLEAN", "SMELL", "PRINT", "WORLD", "FILES", "STACK", "HELLO", "GAMES"]
    },
    
    // Cores (CSS variables)
    COLORS: {
        CORRECT: "#538d4e",
        PRESENT: "#b59f3b",
        ABSENT: "#3a3a3c",
        BORDER_DEFAULT: "#3a3a3c"
    },
    
    // Dimensões visuais
    TILE_SIZE: "55px",
    TILE_GAP: "5px"
};

// Valida se todas as palavras têm o tamanho correto
(function validateDictionaries() {
    Object.keys(GameConfig.DICTIONARIES).forEach(lang => {
        GameConfig.DICTIONARIES[lang].forEach((word, index) => {
            if (word.length !== GameConfig.GRID_COLUMNS) {
                console.error(
                    `Erro no dicionário "${lang}": Palavra "${word}" tem ${word.length} ` +
                    `letras, esperado ${GameConfig.GRID_COLUMNS}`
                );
                // Remove palavra inválida
                GameConfig.DICTIONARIES[lang].splice(index, 1);
            }
        });
    });
})();
