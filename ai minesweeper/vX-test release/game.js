// Récupérer l'élément de la grille
const board = document.getElementById('board');

// Définir les variables
// Utiliser let au lieu de const pour pouvoir modifier les variables
let rows = 10;
let cols = 10;
let mines = 15; 
let mineCount = 0;
let gameOver = false; 
let startTime = 0; 
let endTime = 0; 
let revealedCount = 0; 
let previousRandom = 0; 

function createBoard() {

    board.innerHTML = "";

    mineCount = 0;
    gameOver = false;
    startTime = 0;
    endTime = 0;
    revealedCount = 0;

    // Modifier le style de la grille pour qu'elle s'adapte au nombre de lignes et de colonnes
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

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

	showMessage("Nouvelle grille générée ! Bonne chance ! 😊");
}

function addMines() {
    while (mineCount < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        if (row > 0 || col > 0) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (!cell.classList.contains('mine')) {
                cell.classList.add('mine');
                mineCount++;
            }
        }
    }
}

function showMessage(text) {

    const message = document.getElementById('message');

    let random = Math.floor(Math.random() * 100) + 1;

    if (random === previousRandom) {

        random = Math.floor(Math.random() * 100) + 1;
    }

    message.textContent = text + " (" + random + ")";

    previousRandom = random;
}

function handleClick(event) {
    const cell = event.target;
    if (!gameOver) {
        // Récupérer la ligne et la colonne de la case cliquée
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));
        // Fusionner les deux conditions en utilisant un opérateur logique ou (||)
        if (cell.classList.contains('mine') || (cell.classList.contains('revealed') && countMines(row, col) === countFlags(row, col))) {
            // Si la case est une mine ou si elle est déjà révélée et qu'elle a le même nombre de drapeaux que de mines autour, révéler toutes les mines
            revealNeighbors(("data-row"),("data-col"));
            // Compter le nombre de drapeaux mal placés
            let wrongFlags = 0;
            const cells = document.querySelectorAll('.cell');
            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                if (cell.classList.contains('flagged') && !cell.classList.contains('mine')) {
                    wrongFlags++;
                }
            }
            // Afficher une boîte d'alerte pour annoncer la défaite
            let message = "Vous avez perdu ! 😢";
            // Ajouter le nombre de drapeaux mal placés si nécessaire
           
		   if (wrongFlags > 1) {
                message += " Vous avez placé " + wrongFlags + " drapeaux au mauvais endroit.";
            }
            alert(message);
            // Mettre à jour la variable gameOver
            gameOver = true;
        } else {
            // Sinon, révéler la case
            revealCell(cell);
            // Enregistrer le temps de début si c'est le premier clic
            if (startTime === 0) {
                startTime = Date.now();
            }
            // Vérifier si toutes les cases non-mines sont révélées
            if (revealedCount === rows * cols - mines) {
                // Enregistrer le temps de fin
                endTime = Date.now();
                // Calculer le temps écoulé en secondes
                const elapsed = Math.floor((endTime - startTime) / 1000);
                // Afficher une boîte d'alerte pour annoncer la victoire et le temps écoulé
                alert("Vous avez gagné ! 😊 Vous avez mis " + elapsed + " secondes.");
                // Mettre à jour la variable gameOver
                gameOver = true;
            }
        }
    }
}

function handleRightClick(event) {
    event.preventDefault();
    const cell = event.target;
    if (!gameOver) { 
        if (!cell.classList.contains('revealed')) {
            if (cell.classList.contains('flagged')) {
                cell.classList.remove('flagged');
                cell.classList.add('maybe');
                mineCount++;

                cell.textContent = "?";
            } else if (cell.classList.contains('maybe')) {
                cell.classList.remove('maybe');

                cell.textContent = "";
            } else {
                cell.classList.add('flagged');
                mineCount--;

                cell.textContent = "🚩";
            }
        }
    }
}

function revealMines() {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.classList.contains('mine')) {
            cell.classList.add('revealed');

            cell.style.backgroundColor = "#f00";
        }
    }
}

function revealCell(cell) {
    if (!cell.classList.contains('revealed')) {
        cell.classList.add('revealed');

        revealedCount++;
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

// Ajouter une fonction pour compter les drapeaux autour d'une case
function countFlags(row, col) {
    let flags = 0;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < rows && j >= 0 && j < cols) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                if (cell.classList.contains('flagged')) {
                    flags++;
                }
            }
        }
    }
    return flags;
}

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

function changeMines() {

    const select = document.getElementById('mines');
    const value = parseInt(select.value);

    // Mettre à jour les variables rows, cols et mines en fonction du nombre de mines choisi
    switch (value) {
        case 10:
            rows = 10;
            cols = 10;
			mines = 10;
			board.style.width = "300px";
            board.style.height = "300px";
            break;
        case 20:
            rows = 15;
            cols = 15;
			mines = 30;
			board.style.width = "400px";
            board.style.height = "400px";
            break;
        case 30:
            rows = 20;
            cols = 20;
			mines = 50;
			board.style.width = "500px";
            board.style.height = "500px";
            break;
        case 40:
           rows = 25;
           cols = 25;
		   mines = 80;
		   board.style.width = "600px";
		   board.style.height = "600px";
		   break;
    }

    // Recréer la grille
    createBoard();
}

createBoard();
