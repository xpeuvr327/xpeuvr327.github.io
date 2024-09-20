const board = document.getElementById('board');
const size = document.getElementById('size');
const reset = document.getElementById('reset');
const mines = document.getElementById('mines');
const timer = document.getElementById('timer');

let rows = 10;
let cols = 10;
let numMines = 10;
let numFlags = 0;
let numRevealed = 0;
let gameover = false;
let startTime = null;
let timerInterval = null;

function init() {
    // Create cells
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            board.appendChild(cell);
        }
    }

    // Add mines
    const cells = document.querySelectorAll('.cell');
    const mineIndices = getMineIndices(numMines, rows, cols);
    for (const index of mineIndices) {
        cells[index].classList.add('mine');
    }

    // Add event listeners
    board.addEventListener('mousedown', handleCellMouseDown);
    board.addEventListener('mouseup', handleCellMouseUp);
    reset.addEventListener('click', handleResetClick);

    // Start timer
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function getMineIndices(numMines, rows, cols) {
    const indices = new Set();
    while (indices.size < numMines) {
        const index = Math.floor(Math.random() * rows * cols);
        indices.add(index);
    }
    return [...indices];
}

function handleCellMouseDown(event) {
    if (event.button === 2) {
        event.preventDefault();
        const cell = event.target;
        if (!cell.classList.contains('revealed')) {
            if (cell.classList.contains('flagged')) {
                cell.classList.remove('flagged');
                cell.classList.add('maybe');
                numFlags++;
            } else if (cell.classList.contains('maybe')) {
                cell.classList.remove('maybe');
            } else {
                cell.classList.add('flagged');
                numFlags--;
            }
            mines.textContent = `Mines: ${numMines - numFlags}`;
        }
    }
}

function handleCellMouseUp(event) {
    if (event.button === 0) {
        const cell = event.target;
        if (!cell.classList.contains('revealed') && !cell.classList.contains('flagged') && !cell.classList.contains('maybe')) {
            if (gameover) {
                return;
            }
            if (numRevealed === 0) {
                addMines(cell.dataset.row, cell.dataset.col);
                startTimer();
            }
            revealCell(cell);
            checkWin();
        }
    }
}

function handleResetClick() {
    resetGame();
}

function resetGame() {
    const cells = document.querySelectorAll('.cell');
    for (const cell of cells) {
        cell.classList.remove('mine', 'flagged', 'revealed', 'maybe');
        cell.innerHTML = '';
    }
    numFlags = 0;
    numRevealed = 0;
    gameover = false;
    clearInterval(timerInterval);
    timer.textContent = 'Time: 0';
    numMines = parseInt(size.value);
    mines.textContent = `Mines: ${numMines}`;
    rows = numMines;
    cols = numMines;
    init();
}

init();
