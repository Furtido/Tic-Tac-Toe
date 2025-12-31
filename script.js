// ========================================
// DOM Elements
// ========================================
const board = document.getElementById('board');
const currentPlayerDisplay = document.getElementById('current-player');
const scoreXDisplay = document.getElementById('score-x');
const scoreODisplay = document.getElementById('score-o');
const scoreDrawDisplay = document.getElementById('score-draw');
const resetBtn = document.getElementById('reset-btn');
const resetScoresBtn = document.getElementById('reset-scores-btn');
const modal = document.getElementById('modal');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalBtn = document.getElementById('modal-btn');
const confettiContainer = document.getElementById('confetti');

// ========================================
// Game State
// ========================================
const cells = [];
let currentPlayer = 'X';
let gameActive = true;
let scores = {
  X: 0,
  O: 0,
  draw: 0
};

// Win conditions
const winConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6]  // Diagonal top-right to bottom-left
];

// ========================================
// Initialize Game
// ========================================
function init() {
  loadScores();
  createBoard();
  updateScoreDisplay();
  setupEventListeners();
}

function createBoard() {
  board.innerHTML = '';
  cells.length = 0;
  
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Celda ${i + 1}`);
    cell.setAttribute('tabindex', '0');
    board.appendChild(cell);
    cells.push(cell);
  }
}

function setupEventListeners() {
  // Cell clicks
  board.addEventListener('click', handleCellClick);
  
  // Keyboard support for cells
  board.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (e.target.classList.contains('cell')) {
        handleCellClick(e);
      }
    }
  });
  
  // Button clicks
  resetBtn.addEventListener('click', resetGame);
  resetScoresBtn.addEventListener('click', resetScores);
  modalBtn.addEventListener('click', closeModalAndReset);
  
  // Close modal on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModalAndReset();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModalAndReset();
    }
  });
}

// ========================================
// Game Logic
// ========================================
function handleCellClick(event) {
  const cell = event.target;
  
  if (!cell.classList.contains('cell')) return;
  if (!gameActive) return;
  if (cell.classList.contains('taken')) return;
  
  // Place marker
  placeMarker(cell);
  
  // Check for win or draw
  const winResult = checkWin();
  
  if (winResult) {
    handleWin(winResult);
  } else if (checkDraw()) {
    handleDraw();
  } else {
    switchPlayer();
  }
}

function placeMarker(cell) {
  cell.textContent = currentPlayer;
  cell.classList.add('taken', currentPlayer.toLowerCase());
  cell.setAttribute('aria-label', `Celda ocupada por ${currentPlayer}`);
}

function checkWin() {
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (
      cells[a].textContent === currentPlayer &&
      cells[b].textContent === currentPlayer &&
      cells[c].textContent === currentPlayer
    ) {
      return condition;
    }
  }
  return null;
}

function checkDraw() {
  return cells.every(cell => cell.classList.contains('taken'));
}

function handleWin(winningCells) {
  gameActive = false;
  
  // Highlight winning cells
  winningCells.forEach(index => {
    cells[index].classList.add('winner');
  });
  
  // Update score
  scores[currentPlayer]++;
  saveScores();
  updateScoreDisplay();
  
  // Show confetti
  createConfetti();
  
  // Show modal after short delay
  setTimeout(() => {
    showModal(
      '🎉',
      '¡Victoria!',
      `¡El jugador ${currentPlayer} ha ganado!`
    );
  }, 600);
}

function handleDraw() {
  gameActive = false;
  
  // Update score
  scores.draw++;
  saveScores();
  updateScoreDisplay();
  
  // Show modal
  setTimeout(() => {
    showModal(
      '🤝',
      '¡Empate!',
      'La partida ha terminado en empate'
    );
  }, 300);
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurnIndicator();
}

function updateTurnIndicator() {
  currentPlayerDisplay.textContent = currentPlayer;
  currentPlayerDisplay.className = `current-player player-${currentPlayer.toLowerCase()}`;
}

// ========================================
// Score Management
// ========================================
function loadScores() {
  const savedScores = localStorage.getItem('ticTacToeScores');
  if (savedScores) {
    scores = JSON.parse(savedScores);
  }
}

function saveScores() {
  localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
}

function updateScoreDisplay() {
  scoreXDisplay.textContent = scores.X;
  scoreODisplay.textContent = scores.O;
  scoreDrawDisplay.textContent = scores.draw;
}

function resetScores() {
  scores = { X: 0, O: 0, draw: 0 };
  saveScores();
  updateScoreDisplay();
}

// ========================================
// Modal
// ========================================
function showModal(icon, title, message) {
  modalIcon.textContent = icon;
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.classList.add('active');
  
  // Focus on the play again button
  setTimeout(() => modalBtn.focus(), 100);
}

function closeModal() {
  modal.classList.remove('active');
}

function closeModalAndReset() {
  closeModal();
  setTimeout(resetGame, 200);
}

// ========================================
// Reset Game
// ========================================
function resetGame() {
  // Clear all cells
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.setAttribute('aria-label', `Celda ${parseInt(cell.dataset.index) + 1}`);
  });
  
  // Reset game state
  currentPlayer = 'X';
  gameActive = true;
  updateTurnIndicator();
  
  // Clear confetti
  confettiContainer.innerHTML = '';
}

// ========================================
// Confetti Effect
// ========================================
function createConfetti() {
  const colors = ['#ff6b9d', '#4ecdc4', '#667eea', '#f5576c', '#ffd93d', '#6bcb77'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      
      // Random shapes
      if (Math.random() > 0.5) {
        confetti.style.borderRadius = '50%';
      } else {
        confetti.style.width = '8px';
        confetti.style.height = '16px';
      }
      
      confettiContainer.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => confetti.remove(), 4000);
    }, i * 30);
  }
}

// ========================================
// Start the game
// ========================================
init();