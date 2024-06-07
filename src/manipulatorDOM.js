export function createBoard(boardElement) {
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

    
    }

    boardElement.appendChild(column);
  }
}
