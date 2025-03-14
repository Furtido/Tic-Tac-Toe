const board = document.getElementById('board');
  const cells = [];
  let currentPlayer = 'X';

  function createBoard() {
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      cell.dataset.content = ''; // Initialize with empty content
      cell.addEventListener('click', handleCellClick);
      board.appendChild(cell);
      cells.push(cell);
    }
  }

  function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (cells[index].dataset.content !== '') return;

    cells[index].dataset.content = currentPlayer;
    checkWin();
    switchPlayer();
  }

  function checkWin() {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (
        cells[a].dataset.content === currentPlayer &&
        cells[b].dataset.content === currentPlayer &&
        cells[c].dataset.content === currentPlayer
      ) {
        alert(`Player ${currentPlayer} wins!`);
        resetBoard();
        return;
      }
    }

    if (cells.every(cell => cell.dataset.content !== '')) {
      alert('It\'s a draw!');
      resetBoard();
    }
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }

  function resetBoard() {
    cells.forEach(cell => {
      cell.textContent = '';
      cell.dataset.content = '';
    });
    currentPlayer = 'X';
  }

  createBoard();