// Logique du jeu de démineur
window.onload = function() {
  function generateGrid();
};
// Variables globales
let size = 10; // Taille du plateau
let mines = 10; // Nombre de mines
let grid = []; // Grille du plateau
let gameOver = false; // Etat du jeu
let squaresToCheck = 0; // Nombre de cases à vérifier
let score = 0; // Score du joueur
let timer = 0; // Temps écoulé
let interval = null; // Intervalle du chrono

// Sélection des éléments du DOM
const board = document.getElementById("board");
const restart = document.getElementById("restart");
const minesCounter = document.getElementById("mines");
const timerCounter = document.getElementById("timer");
const sizeSelector = document.getElementById("size");

// Fonction pour générer une grille aléatoire
function generateGrid() {
  // Réinitialiser la grille
  grid = [];
  // Réinitialiser le nombre de cases à vérifier
  squaresToCheck = 0;
  // Parcourir les lignes
  for (let row = 0; row < size; row++) {
    // Créer une liste pour la ligne
    let rowList = [];
    // Parcourir les colonnes
    for (let col = 0; col < size; col++) {
      // Générer un nombre aléatoire entre 1 et 100
      let random = Math.floor(Math.random() * 100) + 1;
      // Si le nombre est inférieur à 20, placer une mine
      if (random < 20) {
        rowList.push(1);
      } else {
        // Sinon, placer un zéro
        rowList.push(0);
        // Augmenter le nombre de cases à vérifier
        squaresToCheck++;
      }
    }
    // Ajouter la liste à la grille
    grid.push(rowList);
  }
}

// Fonction pour afficher la grille
function displayGrid() {
  // Vider le plateau
  board.innerHTML = "";
  // Définir le nombre de colonnes et de lignes du plateau
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  // Parcourir la grille
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Créer un élément pour la case
      let cell = document.createElement("div");
      // Ajouter la classe cell
      cell.classList.add("cell");
      // Ajouter la case au plateau
      board.appendChild(cell);
      // Ajouter un écouteur d'événement au clic gauche
      cell.addEventListener("click", revealCell);
      // Ajouter un écouteur d'événement au clic droit
      cell.addEventListener("contextmenu", markCell);
    }
  }
}

// Fonction pour révéler une case
function revealCell(event) {
  // Récupérer la case cliquée
  let cell = event.target;
  // Récupérer la position de la case
  let row = cell.parentElement.children.indexOf(cell) % size;
  let col = Math.floor(cell.parentElement.children.indexOf(cell) / size);
  // Récupérer le texte de la case
  let text = cell.textContent;
  // Si le jeu n'est pas terminé et que la case est masquée
  if (!gameOver && text == "") {
    // Si la case contient une mine
    if (grid[row][col] == 1) {
      // Terminer le jeu
      gameOver = true;
      // Changer le style de la case
      cell.classList.add("bomb");
      // Afficher un message de défaite
      alert("GAME OVER ! Tu as touché une bombe !");
      // Afficher le score
      alert(`Ton score : ${score}`);
      // Arrêter le chrono
      clearInterval(interval);
    } else {
      // Sinon, révéler la case
      revealAround(row, col);
    }
  }
}

// Fonction pour révéler les cases autour d'une case
function revealAround(row, col) {
  // Récupérer la case correspondante
  let cell = board.children[row * size + col];
  // Récupérer le texte de la case
  let text = cell.textContent;
  // Si la case est masquée
  if (text == "") {
    // Compter le nombre de mines autour de la case
    let totalMines = countMines(row, col);
    // Changer le style de la case
    cell.classList.add("clear");
    // Afficher le nombre de mines
    cell.textContent = ` ${totalMines} `;
    // Diminuer le nombre de cases à vérifier
    squaresToCheck--;
    // Augmenter le score
    score++;
    // Si le nombre de mines est zéro
    if (totalMines == 0) {
      // Révéler les cases autour de la case
      // Si la case n'est pas sur la première ligne
      if (row > 0) {
        // Révéler la case au-dessus
        revealAround(row - 1, col);
        // Si la case n'est pas sur la première colonne
        if (col > 0) {
          // Révéler la case au-dessus à gauche
          revealAround(row - 1, col - 1);
        }
        // Si la case n'est pas sur la dernière colonne
        if (col < size - 1) {
          // Révéler la case au-dessus à droite
          revealAround(row - 1, col + 1);
        }
      }
      // Si la case n'est pas sur la dernière ligne
      if (row < size - 1) {
        // Révéler la case en dessous
        revealAround(row + 1, col);
        // Si la case n'est pas sur la première colonne
        if (col > 0) {
          // Révéler la case en dessous à gauche
          revealAround(row + 1, col - 1);
        }
        // Si la case n'est pas sur la dernière colonne
        if (col < size - 1) {
          // Révéler la case en dessous à droite
          revealAround(row + 1, col + 1);
        }
      }
    }
  }
}
