// Définir les variables
const board = document.getElementById('board');
const reset = document.getElementById('reset');
const width = 10;
const height = 10;
const mines = 10;
let squares = [];
let isGameOver = false;

// Créer le plateau de jeu
function createBoard() {
    // Générer les mines
    const mineArray = Array(mines).fill('mine');
    const emptyArray = Array(width * height - mines).fill('valid');
    const gameArray = emptyArray.concat(mineArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    // Créer les cases
    for (let i = 0; i < width * height; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(shuffledArray[i]);
        board.appendChild(square);
        squares.push(square);

        // Ajouter les événements
        square.addEventListener('click', function(e) {
            click(square);
        });

        square.oncontextmenu = function(e) {
            e.preventDefault();
            addFlag(square);
        };
    }

    // Ajouter les numéros
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if (squares[i].classList.contains('valid')) {
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('mine')) total++;
            if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('mine')) total++;
            if (i > 10 && squares[i - width].classList.contains('mine')) total++;
            if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('mine')) total++;
            if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('mine')) total++;
            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('mine')) total++;
            if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('mine')) total++;
            if (i < 89 && squares[i + width].classList.contains('mine')) total++;
            squares[i].setAttribute('data', total);
        }
    }
}

createBoard();

// Ajouter un drapeau
function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains('checked') && (document.querySelectorAll('.flag').length < mines)) {
        if (!square.classList.contains('flag')) {
            square.classList.add('flag');
            square.innerHTML = ' 🚩';
        } else {
            square.classList.remove('flag');
            square.innerHTML = '';
        }
    }
}

// Cliquer sur une case
function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (square.classList.contains('checked') || square.classList.contains('flag')) return;
    if (square.classList.contains('mine')) {
        gameOver(square);
    } else {
        let total = square.getAttribute('data');
        if (total != 0) {
            square.classList.add('checked');
            square.innerHTML = total;
            return;
        }
        checkSquare(square, currentId);
    }
    square.classList.add('checked');
}

// Vérifier les cases adjacentes
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1].id;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        if (currentId > 9 && !isRightEdge) {
            const newId = squares[parseInt(current