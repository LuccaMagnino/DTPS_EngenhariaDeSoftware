/**
 * CONTROLLER - Coordena Model e View
 * DTP 01: MVC - Separação de responsabilidade
 * 
 * Responsabilidades:
 * - Receber eventos (teclado, clique)
 * - Chamar métodos do Model
 * - Atualizar a View com resultados
 * - Coordenar fluxo do jogo
 * 
 * PATTERN: Observer Pattern (para eventos)
 * PATTERN: Mediator Pattern (entre Model e View)
 */

class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.setupEventListeners();
    }
    
    /**
     * Configura listeners de eventos
     */
    setupEventListeners() {

        // Listener para teclado (usando document para evitar duplicação)
        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
    }
    
    /**
     * Inicia o jogo com idioma selecionado
     * @param {string} language - 'pt' ou 'en'
     */
    startGameWithLanguage(language) {
        console.log('Iniciando jogo com idioma:', language);
        this.model.startGame(language);
        this.view.showGameScreen();
        this.view.updateInstructions(language);
        this.view.renderBoard();
        console.log('Board renderizado, estado inicial:', this.model.getState());
        this.refreshUI();
    }
    
    /**
     * Processa pressionamento de teclas
     * @param {KeyboardEvent} event - Evento de teclado
     */
    handleKeyPress(event) {
        console.log('Evento keydown detectado:', event.key, 'Estado do jogo:', this.model.getState());
        const state = this.model.getState();
        
        // Se jogo não começou ou terminou, ignora
        if (!state.selectedLanguage || state.gameOver) {
            console.log('Ignorando tecla - jogo não iniciado ou terminado');
            return;
        }
        
        const key = event.key.toUpperCase();
        console.log('Tecla pressionada:', key);
        
        // Tecla Backspace
        if (key === 'BACKSPACE') {
            event.preventDefault();
            this.handleBackspace();
        }
        // Tecla Enter
        else if (key === 'ENTER') {
            event.preventDefault();
            this.handleSubmitWord();
        }
        // Letras A-Z
        else if (/^[A-Z]$/.test(key)) {
            event.preventDefault();
            this.handleLetterPress(key);
        }
    }
    
    /**
     * Trata pressionamento de letra
     * @param {string} letter - Letra pressionada
     */
    handleLetterPress(letter) {
        console.log('Tentando adicionar letra:', letter, 'Estado atual:', this.model.getState());
        const state = this.model.getState();
        const success = this.model.addLetter(letter);
        console.log('Sucesso ao adicionar:', success, 'Nova coluna:', this.model.currentColumn);
        
        if (success) {
            // Usa a coluna original (antes do incremento) para posicionar a tile
            this.view.updateTile(state.currentRow, state.currentColumn, letter);
            console.log('Tile atualizada na posição:', state.currentRow, state.currentColumn);
        }
    }
    
    /**
     * Trata pressionamento de Backspace
     */
    handleBackspace() {
        const state = this.model.getState();
        const success = this.model.removeLetter();
        
        if (success) {
            this.view.updateTile(state.currentRow, state.currentColumn, '');
        }
    }
    
    /**
     * Trata submissão de palavra (Enter)
     */
    handleSubmitWord() {
        const state = this.model.getState();
        
        // Verifica se palavra está completa
        if (!this.model.isWordComplete()) {
            const incompleteMessage = GameConfig.MESSAGES[state.selectedLanguage].incompleteWord || 
                                    (state.selectedLanguage === 'pt' ? 'Palavra incompleta! Digite 5 letras.' : 'Incomplete word! Type 5 letters.');
            this.view.showMessage(incompleteMessage);
            return;
        }
        
        // Obtém feedback de cores
        const feedback = this.model.submitWord();
        if (!feedback) return;
        
        // Aplica cores ao board
        this.view.applyFeedback(state.currentRow, feedback);
        this.view.updateScore(this.model.score);
        
        // Verifica se acertou
        if (this.model.isWordCorrect()) {
            const congratsMessage = GameConfig.MESSAGES[state.selectedLanguage].correctAnswer;
            this.view.showMessage(congratsMessage);
            this.model.nextRound();
            this.view.renderBoard();
            this.refreshUI();
        }
        // Verifica se perdeu (6 tentativas)
        else if (state.currentRow === GameConfig.GRID_ROWS - 1) {
            const gameOverMessage = 
                GameConfig.MESSAGES[state.selectedLanguage].gameOver + this.model.secretWord;
            this.view.showMessage(gameOverMessage);
            this.model.gameOver = true;
        }
        // Próxima tentativa
        else {
            this.model.nextAttempt();
        }
    }
    
    /**
     * Atualiza interface com estado atual
     */
    refreshUI() {
        const state = this.model.getState();
        this.view.updateScore(state.score);
        this.view.updateRound(state.round);
    }
}

// Inicializa controller quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const gameController = new GameController(gameModel, gameView);
    
    // Expõe função global para onclick dos botões (fallback)
    window.startGameWithLanguage = (language) => {
        gameController.startGameWithLanguage(language);
    };
});

