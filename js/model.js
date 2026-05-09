/**
 * MODEL - Gerencia estado e lógica do jogo
 * DTP 01: MVC - Separação de responsabilidade
 * 
 * Responsabilidades:
 * - Gerenciar dicionários
 * - Manter estado do jogo (board, score, rodada)
 * - Calcular lógica de pontuação
 * - Validar palavras
 */

class GameModel {
    constructor() {
        this.selectedLanguage = '';
        this.secretWord = '';
        this.currentRow = 0;
        this.currentColumn = 0;
        this.score = 0;
        this.round = 1;
        this.gameOver = false;
        
        // Board: matriz 6x5 para armazenar letras do jogador
        this.board = this.initializeBoard();
    }
    
    /**
     * Inicializa o board com strings vazias
     */
    initializeBoard() {
        const board = [];
        for (let row = 0; row < GameConfig.GRID_ROWS; row++) {
            board[row] = [];
            for (let col = 0; col < GameConfig.GRID_COLUMNS; col++) {
                board[row][col] = '';
            }
        }
        return board;
    }
    
    /**
     * Seleciona idioma e inicia novo jogo
     * @param {string} language - 'pt' ou 'en'
     */
    startGame(language) {
        if (!['pt', 'en'].includes(language)) {
            throw new Error('Idioma inválido');
        }
        
        this.selectedLanguage = language;
        this.selectRandomWord();
    }
    
    /**
     * Seleciona uma palavra aleatória do dicionário
     */
    selectRandomWord() {
        const dictionary = GameConfig.DICTIONARIES[this.selectedLanguage];
        const randomIndex = Math.floor(Math.random() * dictionary.length);
        this.secretWord = dictionary[randomIndex].toUpperCase();
    }
    
    /**
     * Adiciona letra ao board
     * @param {string} letter - Letra a adicionar (A-Z)
     */
    addLetter(letter) {
        if (this.currentColumn < GameConfig.GRID_COLUMNS && !this.gameOver) {
            this.board[this.currentRow][this.currentColumn] = letter.toUpperCase();
            this.currentColumn++;
            return true;
        }
        return false;
    }
    
    /**
     * Remove última letra adicionada
     */
    removeLetter() {
        if (this.currentColumn > 0) {
            this.currentColumn--;
            this.board[this.currentRow][this.currentColumn] = '';
            return true;
        }
        return false;
    }
    
    /**
     * Valida se a palavra foi completada (5 letras)
     */
    isWordComplete() {
        return this.currentColumn === GameConfig.GRID_COLUMNS;
    }
    
    /**
     * Submete a palavra e retorna feedback com cores
     * @returns {Array} Array de objetos com {letter, status, points}
     */
    submitWord() {
        if (!this.isWordComplete()) {
            return null;
        }
        
        const userWord = this.board[this.currentRow].join('');
        const feedback = [];
        let roundPoints = 0;
        
        for (let i = 0; i < GameConfig.GRID_COLUMNS; i++) {
            const letter = userWord[i];
            let status = 'absent';
            let points = 0;
            
            if (letter === this.secretWord[i]) {
                status = 'correct';
                points = GameConfig.POINTS_FOR_CORRECT_POSITION;
            } else if (this.secretWord.includes(letter)) {
                status = 'present';
                points = GameConfig.POINTS_FOR_LETTER_IN_WORD;
            }
            
            roundPoints += points;
            feedback.push({ letter, status, position: i });
        }
        
        this.score += roundPoints;
        return feedback;
    }
    
    /**
     * Verifica se acertou a palavra
     */
    isWordCorrect() {
        const userWord = this.board[this.currentRow].join('');
        return userWord === this.secretWord;
    }
    
    /**
     * Prepara para próxima rodada
     */
    nextRound() {
        this.round++;
        this.currentRow = 0;
        this.currentColumn = 0;
        this.board = this.initializeBoard();
        this.selectRandomWord();
    }
    
    /**
     * Avança para próxima tentativa
     */
    nextAttempt() {
        this.currentRow++;
        this.currentColumn = 0;
        
        if (this.currentRow >= GameConfig.GRID_ROWS) {
            this.gameOver = true;
        }
    }
    
    /**
     * Reseta o jogo
     */
    resetGame() {
        this.selectedLanguage = '';
        this.secretWord = '';
        this.currentRow = 0;
        this.currentColumn = 0;
        this.score = 0;
        this.round = 1;
        this.gameOver = false;
        this.board = this.initializeBoard();
    }
    
    /**
     * Retorna estado atual do jogo
     */
    getState() {
        return {
            selectedLanguage: this.selectedLanguage,
            score: this.score,
            round: this.round,
            currentRow: this.currentRow,
            currentColumn: this.currentColumn,
            gameOver: this.gameOver,
            board: this.board
        };
    }
}

// Instância global
const gameModel = new GameModel();
