import { gameState } from ".";

export function createBoard(boardElement) {
  boardElement.innerHTML = '';

  for (let col = 0; col < 10; col++) {
    const column = document.createElement('div');
    column.classList.add('column');

    for (let row = 0; row < 10; row++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      cell.style.width = '34px';
      cell.style.height = '34px';
      cell.style.border = '1px solid #fff';
      column.appendChild(cell);

      cell.addEventListener('mouseenter', (event) => handleMouseEnter(event));
      cell.addEventListener('mouseleave', handleMouseLeave);
      cell.addEventListener('mouseup', handleMouseLeave);

    }

    boardElement.appendChild(column);
  }
}

function handleMouseEnter(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const orientation = gameState.direction;
  const shipLength = gameState.count;

  showPreview(row, col, shipLength, orientation);
}

function handleMouseLeave() {
  const cells = document.querySelectorAll('.ship-preview');
  cells.forEach(cell => cell.classList.remove('ship-preview'));
}

function showPreview(row, col, length, orientation) {
  if (length == 1) return;
  if (orientation === 'horizontal') {
    if (col + length <= 10) {
      for (let i = 0; i < length; i++) {
        const previewCell = document.querySelector(`[data-row="${row}"][data-col="${col + i}"]`);
        if (previewCell) {
          previewCell.classList.add('ship-preview');
        }
      }
    }
  } else {
    if (row + length <= 10) {
      for (let i = 0; i < length; i++) {
        const previewCell = document.querySelector(`[data-row="${row + i}"][data-col="${col}"]`);
        if (previewCell) {
          previewCell.classList.add('ship-preview');
        }
      }
    }
  }
}
