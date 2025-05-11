// Game state
const gameState = {
  rows: 10,
  cols: 10,
  mines: 15,
  mineCount: 0,
  gameOver: false,
  startTime: 0,
  endTime: 0,
  revealedCount: 0,
  previousRandom: 0,
  board: document.getElementById('board'),
  timerElement: document.getElementById('timer'),
  messageElement: document.getElementById('message')
};

// Initialize the game
function initGame() {
  createBoard();
  toggleDarkMode();
  setInterval(updateTimer, 10);
}

// Create the game board
function createBoard() {
  resetGameState();
  setupBoardGrid();
  generateCells();
  addMines();
}

// Reset game state variables
function resetGameState() {
  gameState.mineCount = 0;
  gameState.gameOver = false;
  gameState.startTime = 0;
  gameState.endTime = 0;
  gameState.revealedCount = 0;
  gameState.board.innerHTML = "";
  gameState.timerElement.textContent = `Temps: 0 secondes`;
}

// Set up the board grid layout
function setupBoardGrid() {
  gameState.board.style.gridTemplateColumns = `repeat(${gameState.cols}, 1fr)`;
  gameState.board.style.gridTemplateRows = `repeat(${gameState.rows}, 1fr)`;
}

// Generate all cells for the board
function generateCells() {
  for (let i = 0; i < gameState.rows; i++) {
    for (let j = 0; j < gameState.cols; j++) {
      const cell = createCell(i, j);
      gameState.board.appendChild(cell);
    }
  }
}

// Create a single cell
function createCell(row, col) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('data-row', row);
  cell.setAttribute('data-col', col);
  cell.addEventListener('click', handleClick);
  cell.addEventListener('contextmenu', handleRightClick);
  return cell;
}

// Add mines to the board
function addMines() {
  while (gameState.mineCount < gameState.mines) {
    const row = Math.floor(Math.random() * gameState.rows);
    const col = Math.floor(Math.random() * gameState.cols);

    if (row > 0 || col > 0) {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      if (!cell.classList.contains('mine')) {
        cell.classList.add('mine');
        gameState.mineCount++;
      }
    }
  }
}
// Handle cell click
function handleClick(event) {
  const cell = event.target;
  if (!gameState.gameOver && !cell.classList.contains('flagged')) {
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));

    if (cell.classList.contains('mine')) {
      gameOver();
    } else {
      revealCell(cell);
      checkWinCondition();
    }
  }
}

// Handle right click (flagging)
function handleRightClick(event) {
  event.preventDefault();
  const cell = event.target;
  if (!gameState.gameOver && !cell.classList.contains('revealed')) {
    toggleCellFlag(cell);
  }
}

// Toggle cell flag state
function toggleCellFlag(cell) {
  if (cell.classList.contains('flagged')) {
    cell.classList.remove('flagged');
    cell.classList.add('maybe');
    gameState.mineCount++;
    cell.textContent = "?";
  } else if (cell.classList.contains('maybe')) {
    cell.classList.remove('maybe');
    cell.textContent = "";
  } else {
    cell.classList.add('flagged');
    gameState.mineCount--;
    cell.textContent = "🚩";
  }
}

// Game over logic
function gameOver() {
  revealMines();
  gameState.gameOver = true;
}

// Reveal all mines
function revealMines() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    if (cell.classList.contains('mine')) {
      cell.classList.add('revealed');
      setCellColors(cell);
    }
  });
}

// Set cell colors based on game mode
function setCellColors(cell) {
  if (document.body.classList.contains('dark-mode')) {
    cell.style.backgroundColor = "#777777";
    cell.style.color = "#fff";
  } else {
    cell.style.backgroundColor = "#fff";
    cell.style.color = "#000";
  }
}

// Reveal a single cell
function revealCell(cell) {
  if (!cell.classList.contains('revealed')) {
    cell.classList.add('revealed');
    cell.classList.remove('flagged', 'maybe');
    setCellColors(cell);
    cell.textContent = "";
    gameState.revealedCount++;

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

// Count mines around a cell
function countMines(row, col) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (isValidCell(i, j)) {
        const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
        if (cell.classList.contains('mine')) {
          count++;
        }
      }
    }
  }
  return count;
}

// Check if cell coordinates are valid
function isValidCell(row, col) {
  return row >= 0 && row < gameState.rows && col >= 0 && col < gameState.cols;
}

// Reveal all neighboring cells
function revealNeighbors(row, col) {
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (isValidCell(i, j)) {
        const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
        revealCell(cell);
      }
    }
  }
}

// Check win condition
function checkWinCondition() {
  if (gameState.startTime === 0) {
    gameState.startTime = Date.now();
  }

  if (gameState.revealedCount === gameState.rows * gameState.cols - gameState.mines) {
    gameState.endTime = Date.now();
    const elapsed = Math.floor((gameState.endTime - gameState.startTime) / 1000);
    alert("Vous avez gagné ! 😊 Vous avez mis " + elapsed + " secondes.");
    gameState.gameOver = true;
  }
}

// Change mine difficulty
function changeMines() {
  const select = document.getElementById('mines');
  const value = parseInt(select.value);

  switch (value) {
    case 10:
      setDifficulty(10, 10, 10, "300px");
      break;
    case 20:
      setDifficulty(15, 15, 30, "400px");
      break;
    case 30:
      setDifficulty(20, 20, 50, "500px");
      break;
    case 40:
      setDifficulty(25, 25, 80, "600px");
      break;
  }

  createBoard();
}

// Set game difficulty
function setDifficulty(rows, cols, mines, size) {
  gameState.rows = rows;
  gameState.cols = cols;
  gameState.mines = mines;
  gameState.board.style.width = size;
  gameState.board.style.height = size;
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Update the game timer
function updateTimer() {
  if (gameState.startTime !== 0 && !gameState.gameOver) {
    const currentTime = Date.now();
    const elapsed = (currentTime - gameState.startTime) / 1000;
    gameState.timerElement.textContent = `Temps: ${elapsed.toFixed(2)} secondes`;
  }
}

// Initialize the game when the script loads
initGame();
