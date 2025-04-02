class CellInfo {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.revealed = false;
        this.flagged = false;
        this.maybe = false;
        this.value = null; // null si non révélée, nombre de mines adjacentes si révélée
    }
}

class DemineurAutoplayer {
    constructor() {
        this.rows = parseInt(document.querySelector('#mines').value) === 10 ? 10 :
                   parseInt(document.querySelector('#mines').value) === 20 ? 15 :
                   parseInt(document.querySelector('#mines').value) === 30 ? 20 : 25;
        this.cols = this.rows;
        this.board = [];
        this.initialClick = true;
        this.gameOver = false;
        this.timer = null;

        // Initialiser la représentation interne du plateau
        this.initializeBoard();

        this.log("Autoplayer initialisé avec un plateau de " + this.rows + "x" + this.cols);
    }

    // Initialise la représentation interne du plateau
    initializeBoard() {
        this.board = [];
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = new CellInfo(i, j);
            }
        }
    }

    // Met à jour la représentation interne après un clic
    updateBoardState() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.getAttribute('data-row'));
            const col = parseInt(cell.getAttribute('data-col'));

            // Vérifier si la cellule est révélée
            if (cell.classList.contains('revealed')) {
                this.board[row][col].revealed = true;
                if (cell.textContent && !isNaN(parseInt(cell.textContent))) {
                    this.board[row][col].value = parseInt(cell.textContent);
                } else if (cell.classList.contains('mine')) {
                    this.board[row][col].value = 'X';
                } else {
                    this.board[row][col].value = 0;
                }
            }

            // Vérifier si la cellule est marquée
            if (cell.classList.contains('flagged')) {
                this.board[row][col].flagged = true;
            } else {
                this.board[row][col].flagged = false;
            }

            if (cell.classList.contains('maybe')) {
                this.board[row][col].maybe = true;
            } else {
                this.board[row][col].maybe = false;
            }
        });

        // Vérifier si le jeu est terminé
        this.gameOver = document.querySelectorAll('.revealed.mine').length > 0 ||
                       document.querySelectorAll('.cell:not(.mine).revealed').length === (this.rows * this.cols - mines);
    }

    // Effectue un clic sur une cellule
    clickCell(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            this.log(`Clic sur la cellule (${row}, ${col})`);
            cell.click();
            this.updateBoardState();
        }
    }

    // Effectue un clic droit sur une cellule (placer un drapeau)
    rightClickCell(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            this.log(`Drapeau sur la cellule (${row}, ${col})`);

            // Simuler un clic droit
            const rightClickEvent = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                button: 2
            });

            cell.dispatchEvent(rightClickEvent);
            this.updateBoardState();
        }
    }

    // Obtient les voisins d'une cellule
    getNeighbors(row, col) {
        const neighbors = [];
        for (let i = Math.max(0, row - 1); i <= Math.min(this.rows - 1, row + 1); i++) {
            for (let j = Math.max(0, col - 1); j <= Math.min(this.cols - 1, col + 1); j++) {
                if (i !== row || j !== col) {
                    neighbors.push(this.board[i][j]);
                }
            }
        }
        return neighbors;
    }

    // Trouve une cellule aléatoire non révélée et non marquée
    getRandomUnrevealedCell() {
        const unrevealedCells = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (!this.board[i][j].revealed && !this.board[i][j].flagged && !this.board[i][j].maybe) {
                    unrevealedCells.push(this.board[i][j]);
                }
            }
        }

        if (unrevealedCells.length > 0) {
            return unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)];
        }

        return null;
    }

    // Trouve une cellule sûre à cliquer basée sur l'analyse
    findSafeMove() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.board[i][j];
                if (cell.revealed && cell.value > 0) {
                    const neighbors = this.getNeighbors(i, j);
                    const unrevealedNeighbors = neighbors.filter(n => !n.revealed);
                    const flaggedNeighbors = neighbors.filter(n => n.flagged);

                    // Si toutes les mines autour de cette cellule sont déjà marquées, les cellules restantes sont sûres
                    if (cell.value === flaggedNeighbors.length && unrevealedNeighbors.length > flaggedNeighbors.length) {
                        const safeCell = unrevealedNeighbors.find(n => !n.flagged);
                        if (safeCell) {
                            this.log(`ANALYSE: Cellule (${i}, ${j}) a ${cell.value} mines adjacentes, toutes marquées. Cellule (${safeCell.row}, ${safeCell.col}) est sûre.`);
                            return safeCell;
                        }
                    }
                }
            }
        }

        return null;
    }

    // Trouve une mine à marquer basée sur l'analyse
    findMineToFlag() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.board[i][j];
                if (cell.revealed && cell.value > 0) {
                    const neighbors = this.getNeighbors(i, j);
                    const unrevealedNeighbors = neighbors.filter(n => !n.revealed && !n.flagged);
                    const flaggedNeighbors = neighbors.filter(n => n.flagged);

                    // Si le nombre de cellules non révélées est égal au nombre de mines adjacentes restantes, elles sont toutes des mines
                    if (unrevealedNeighbors.length > 0 && cell.value - flaggedNeighbors.length === unrevealedNeighbors.length) {
                        this.log(`ANALYSE: Cellule (${i}, ${j}) a ${cell.value} mines adjacentes, ${flaggedNeighbors.length} déjà marquées. Toutes les cellules non révélées adjacentes sont des mines.`);
                        return unrevealedNeighbors[0];
                    }
                }
            }
        }

        return null;
    }

    // Effectue un mouvement
    makeMove() {
        if (this.gameOver) {
            this.log("Jeu terminé. Redémarrage de l'autoplayer...");
            this.stop();
            this.start();
            return;
        }

        this.updateBoardState();

        // Premier clic toujours en haut à gauche (c'est un conseil donné dans le texte du jeu)
        if (this.initialClick) {
            this.clickCell(0, 0);
            this.initialClick = false;
            return;
        }

        // 1. Chercher un mouvement sûr basé sur l'analyse
        const safeMove = this.findSafeMove();
        if (safeMove) {
            this.clickCell(safeMove.row, safeMove.col);
            return;
        }

        // 2. Chercher une mine à marquer
        const mineToFlag = this.findMineToFlag();
        if (mineToFlag) {
            this.rightClickCell(mineToFlag.row, mineToFlag.col);
            return;
        }

        // 3. Essayer une cellule aléatoire si aucune stratégie ne fonctionne
        const randomCell = this.getRandomUnrevealedCell();
        if (randomCell) {
            this.log("ANALYSE: Aucun mouvement sûr trouvé, tentative aléatoire.");
            this.clickCell(randomCell.row, randomCell.col);
            return;
        }

        this.log("Aucun mouvement possible");
    }

    // Démarre l'autoplayer
// Démarre l'autoplayer
start() {
    this.log("L'autoplayer démarre...");
    this.gameOver = false;
    this.initialClick = true;
    this.initializeBoard();

    // Clear the console log when starting a new game
    const consoleDiv = document.getElementById('console');
    consoleDiv.innerHTML = '';

    // Réinitialiser le jeu
    document.getElementById('restart').click();

    // Commencer à jouer
    this.timer = setInterval(() => this.makeMove(), 300);
    gamesPlayed++;
}

    // Arrête l'autoplayer
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.log("L'autoplayer est arrêté");
        }
    }

// Log messages to the console div
log(message) {
    const consoleDiv = document.getElementById('console');
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    consoleDiv.appendChild(logEntry);

    // Limit the log to 10 rows
    const logEntries = consoleDiv.getElementsByTagName('p');
    while (logEntries.length > 5) {
        consoleDiv.removeChild(logEntries[0]);
    }
}
}

// Créer et démarrer l'autoplayer
const autoplayer = new DemineurAutoplayer();
autoplayer.start();
