/**
 * VIEW - Renderiza interface do usuário
 * DTP 01: MVC - Separação de responsabilidade
 * 
 * Responsabilidades:
 * - Renderizar board
 * - Renderizar mensagens
 * - Atualizar elementos do DOM
 * - Gerenciar visibilidade de telas
 */

class GameView {
    constructor() {
        this.startScreen = document.getElementById('tela-inicio');
        this.gameScreen = document.getElementById('tela-jogo');
        this.boardElement = document.getElementById('board');
        this.scoreElement = document.getElementById('score-val');
        this.roundElement = document.getElementById('round-val');
        this.instructionsElement = document.getElementById('msg-instr');
    }
    
    /**
     * Exibe tela inicial
     */
    showStartScreen() {
        this.startScreen.style.display = 'block';
        this.gameScreen.style.display = 'none';
    }
    
    /**
     * Exibe tela de jogo
     */
    showGameScreen() {
        this.startScreen.style.display = 'none';
        this.gameScreen.style.display = 'flex';
    }
    
    /**
     * Atualiza instruções com base no idioma
     * @param {string} language - 'pt' ou 'en'
     */
    updateInstructions(language) {
        const messages = GameConfig.MESSAGES[language];
        this.instructionsElement.innerText = messages.instructions;
    }
    
    /**
     * Desenha o board completo
     */
    renderBoard() {
        this.boardElement.innerHTML = '';
        
        for (let row = 0; row < GameConfig.GRID_ROWS; row++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'linha';
            
            for (let col = 0; col < GameConfig.GRID_COLUMNS; col++) {
                const tileElement = document.createElement('div');
                tileElement.className = 'tile';
                tileElement.id = `tile-${row}-${col}`;
                rowElement.appendChild(tileElement);
            }
            
            this.boardElement.appendChild(rowElement);
        }
    }
    
    /**
     * Atualiza uma tile com letra
     * @param {number} row - Linha
     * @param {number} col - Coluna
     * @param {string} letter - Letra a exibir
     */
    updateTile(row, col, letter) {
        const tileElement = document.getElementById(`tile-${row}-${col}`);
        if (tileElement) {
            tileElement.innerText = letter;
        }
    }
    
    /**
     * Colore uma tile com base no feedback
     * @param {number} row - Linha
     * @param {number} col - Coluna
     * @param {string} status - 'correct', 'present', 'absent'
     */
    colorTile(row, col, status) {
        const tileElement = document.getElementById(`tile-${row}-${col}`);
        if (!tileElement) return;
        
        let backgroundColor;
        if (status === 'correct') {
            backgroundColor = GameConfig.COLORS.CORRECT;
        } else if (status === 'present') {
            backgroundColor = GameConfig.COLORS.PRESENT;
        } else {
            backgroundColor = GameConfig.COLORS.ABSENT;
        }
        
        tileElement.style.background = backgroundColor;
        tileElement.style.borderColor = 'transparent';
    }
    
    /**
     * Atualiza score na interface
     * @param {number} score - Pontuação atual
     */
    updateScore(score) {
        this.scoreElement.innerText = score;
    }
    
    /**
     * Atualiza rodada na interface
     * @param {number} round - Rodada atual
     */
    updateRound(round) {
        this.roundElement.innerText = round;
    }
    
    /**
     * Exibe mensagem de alerta
     * @param {string} message - Mensagem a exibir
     */
    showMessage(message) {
        alert(message);
    }
    
    /**
     * Limpa board para nova tentativa
     */
    clearRow(row) {
        for (let col = 0; col < GameConfig.GRID_COLUMNS; col++) {
            this.updateTile(row, col, '');
            const tileElement = document.getElementById(`tile-${row}-${col}`);
            if (tileElement) {
                tileElement.style.background = '';
                tileElement.style.borderColor = GameConfig.COLORS.BORDER_DEFAULT;
            }
        }
    }
    
    /**
     * Atualiza visualmente o feedback de uma linha
     * @param {number} row - Linha
     * @param {Array} feedback - Array de {letter, status, position}
     */
    applyFeedback(row, feedback) {
        feedback.forEach(item => {
            this.colorTile(row, item.position, item.status);
        });
    }
}

// Instância global
const gameView = new GameView();
