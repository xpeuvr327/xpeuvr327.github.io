var boardSize = 10;
var numMines = 10;
var board = [];
var mines = [];
var flags = 0;
var startTime = null;
var timerInterval = null;

function createBoard() {
    var gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    board = [];
    mines = [];
    flags = 0;
    startTime = null;
    timerInterval = null;

    for (var i = 0; i < boardSize; i++) {
        var row = [];
        for (var j = 0; j < boardSize; j++) {
            var cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener("mousedown", handleCellClick);
            cell.addEventListener("mouseover", handleCellHover);
            row.push(cell);
            gameBoard.appendChild(cell);
        }
        board.push(row);
    }

    for (var i = 0; i < numMines; i++) {
        var mineRow = Math.floor(Math.random() * boardSize);
        var mineCol = Math.floor(Math.random() * boardSize);
        if (mines.some(function(mine) { return mine[0] == mineRow && mine[1] == mineCol })) {
            i--;
        } else {
            mines.push([mineRow, mineCol]);
        }
    }
}

function handleCellClick(event) {
    event.preventDefault();
    if (event.button == 0) {
        var row = parseInt(this.dataset.row);
        var col = parseInt(this.dataset.col);
        if (mines.some(function(mine) { return mine[0] == row && mine[1] == col })) {
            revealMines();
            alert("Vous avez perdu!");
            createBoard();
        } else {
            var numAdjacentMines = countAdjacentMines(row, col);
            if (numAdjacentMines > 0) {
                this.classList.add("revealed");
                this.textContent = numAdjacentMines;
            } else {
                revealEmptyCells(row, col);
            }
        }
    } else if (event.button == 2) {
        var row = parseInt(this.dataset.row);
        var col = parseInt(this.dataset.col);
        if (this.classList.contains("flagged")) {
            this.classList.remove("flagged");
            flags--;
        } else {
            this.classList.add("flagged");
            flags++;
        }
        updateFlagCount();
    }
}

function handleCellHover(event) {
    var row = parseInt(this.dataset.row);
    var col = parseInt(this.dataset.col);
    if (!this.classList.contains("revealed") && !this.classList.contains("flagged")) {
        this.classList.add("hovered");
    }
}

function revealEmptyCells(row, col) {
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
        return;
    }
    var cell = board[row][col];
    if (cell.classList.contains("revealed") || cell.classList.contains("flagged")) {
        return;
    }
    cell.classList.add("revealed");
    var numAdjacentMines = countAdjacentMines(row, col);
    if (numAdjacentMines > 0) {
        cell.textContent = numAdjacentMines;
        return;
    }
    revealEmptyCells(row - 1, col - 1);
    revealEmptyCells(row - 1, col);
    revealEmptyCells(row - 1, col + 1);
    revealEmptyCells(row, col - 1);
    revealEmptyCells(row, col + 1);
    revealEmptyCells(row + 1, col - 1);
    revealEmptyCells(row + 1, col);
    revealEmptyCells(row + 1, col + 1);
}

function revealMines() {
    for (var i = 0; i < mines.length; i++) {
        var row = mines[i][0];
        var col = mines[i][1];
        var cell = board[row][col];
        cell.classList.add("revealed");
        cell.classList.add("mine");
    }
}

function countAdjacentMines(row, col) {
    var count = 0;
    if (hasMine(row - 1, col - 1)) count++;
    if (hasMine(row - 1, col)) count++;
    if (hasMine(row - 1, col + 1)) count++;
    if (hasMine(row, col - 1)) count++;
    if (hasMine(row, col + 1)) count++;
    if (hasMine(row + 1, col - 1)) count++;
