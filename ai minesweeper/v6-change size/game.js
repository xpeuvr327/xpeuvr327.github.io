// Récupérer l'élément de la grille
const board = document.getElementById('board');

// Définir les variables
const rows = 10;
const cols = 10;
let mines = 10; // Modifier cette valeur pour avoir plus de mines
let mineCount = 0;
let gameOver = false; // Ajouter une variable pour indiquer si le jeu est terminé

// Créer la grille
function createBoard() {
    // Effacer le contenu de la grille
    board.innerHTML = "";
    // Réinitialiser les variables
    mineCount = 0;
    gameOver = false;
    // Créer les cases
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            cell.addEventListener('click', handleClick);
            cell.addEventListener('contextmenu', handleRightClick);
            board.appendChild(cell);
        }
    }
    addMines();
    // Afficher le message du jeu
    showMessage("Bonne chance ! 😊");
}

// Ajouter les mines
function addMines() {
    while (mineCount < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        // Ajouter une condition pour empêcher les mines de se générer en haut à gauche
        if (row > 0 || col > 0) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (!cell.classList.contains('mine')) {
                cell.classList.add('mine');
                mineCount++;
            }
        }
    }
}

// Gérer le clic gauche
function handleClick(event) {
    const cell = event.target;
    if (!gameOver) { // Ajouter une condition pour vérifier si le jeu est terminé
        if (cell.classList.contains('mine')) {
            revealMines();
            // Afficher une boîte d'alerte pour annoncer la défaite
            alert("Vous avez perdu ! 😢");
            gameOver = true; // Mettre à jour la variable gameOver
        } else {
            revealCell(cell);
        }
    }
}

// Gérer le clic droit
function handleRightClick(event) {
    event.preventDefault();
    const cell = event.target;
    if (!gameOver) { // Ajouter une condition pour vérifier si le jeu est terminé
        if (!cell.classList.contains('revealed')) {
            if (cell.classList.contains('flagged')) {
                cell.classList.remove('flagged');
                cell.classList.add('maybe');
                mineCount++;
                // Remplacer le drapeau par un point d'interrogation
                cell.textContent = "?";
            } else if (cell.classList.contains('maybe')) {
                cell.classList.remove('maybe');
                // Effacer le point d'interrogation
                cell.textContent = "";
            } else {
                cell.classList.add('flagged');
                mineCount--;
                // Ajouter le code pour afficher l'émoji drapeau
                cell.textContent = "🚩";
            }
        }
    }
}

// Révéler toutes les mines
function revealMines() {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.classList.contains('mine')) {
            cell.classList.add('revealed');
            // Ajouter le code pour changer la couleur des mines en rouge
            cell.style.backgroundColor = "#f00";
        }
    }
}

// Révéler une case
function revealCell(cell) {
    if (!cell.classList.contains('revealed')) {
        cell.classList.add('revealed');
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));
        const mines = countMines(row, col);
        if (mines > 0) {
            cell.textContent = mines;
        } else {
            revealNeighbors(row, col);
        }
    }
}

// Compter les mines adjacentes
function countMines(row, col) {
    let count = 0;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < rows && j >= 0 && j < cols) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                if (cell.classList.contains('mine')) {
                    count++;
                }
            }
        }
    }
    return count;
}

// Révéler les cases adjacentes
function revealNeighbors(row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < rows && j >= 0 && j < cols) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                revealCell(cell);
            }
        }
    }
}

// Ajouter une fonction pour changer le nombre de mines
function changeMines() {
    // Récupérer la valeur du menu déroulant
    const select = document.getElementById('mines');
    const value = parseInt(select.value);
    // Mettre à jour la variable mines
    mines = value;
    // Agrandir ou réduire la grille en fonction du nombre de mines
    switch (mines) {
        case 10:
            board.style.width = "300px";
            board.style.height = "300px";
            break;
        case 20:
            board.style.width = "450px";
            board.style.height = "450px";
            break;
        case 30:
            board.style.width = "600px";
            board.style.height = "600px";
            break;
        case 40:
            board.style.width = "750px";
            board.style.height = "750px";
            break;
    }
    // Recréer la grille
    createBoard();
}

// Ajouter une fonction pour afficher le message du jeu
function showMessage(text) {
    // Récupérer l'élément du message
    const message = document.getElementById('message');
    // Modifier le contenu du message
    message.textContent = text;
}

// Créer la grille
createBoard();
