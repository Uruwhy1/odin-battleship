import Player from './classes/player';
import { createBoard } from './manipulatorDOM';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const humanBoardElement = document.querySelector('.left-player .board');
  const computerBoardElement = document.querySelector('.right-player .board');

  createBoard(humanBoardElement);
  const humanPlayer = new Player('human');
  humanPlayer.placeShip([0, 3], 5, 'horizontal'); // Place a ship for testing
  humanPlayer.placeShip([5, 0], 2, 'vertical'); // Place a ship for testing
  humanPlayer.placeShip([7, 2], 4, 'vertical'); // Place a ship for testing
  humanPlayer.placeShip([9, 0], 6, 'vertical'); // Place a ship for testing

  const computerPlayer = new Player('computer');
  computerPlayer.placeShip([0, 3], 5, 'horizontal'); // Place a ship for testing
  computerPlayer.placeShip([5, 0], 2, 'vertical'); // Place a ship for testing
  computerPlayer.placeShip([7, 2], 4, 'vertical'); // Place a ship for testing
  computerPlayer.placeShip([9, 0], 6, 'vertical'); // Place a ship for testing

  createBoard(computerBoardElement, computerPlayer);

  let currentTurn = 'human';

  computerBoardElement.addEventListener('click', (event) => {
    if (currentTurn !== 'human') return;
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;

    const x = parseInt(cell.dataset.row);
    const y = parseInt(cell.dataset.col);
    if (
      computerPlayer.board.memory.some(
        ([memX, memY]) => memX === x && memY === y,
      )
    ) {
      return;
    }

    if (computerPlayer.board.receiveAttack(x, y)) {
      cell.classList.add('hit');
    } else {
      cell.classList.add('missed');
    }

    currentTurn = 'computer';
    computerMove();
  });

  const lastMoveMemory = [];
  let forgetMoveCounter = 0;

  function computerMove() {
    let x, y;

    
    // if previous hits array is not empty
    if (lastMoveMemory.length > 0) {
      const [lastX, lastY] = lastMoveMemory[0];
      
      const directions = [
        [0, 1], // right
        [1, 0], // down
        [0, -1], // left
        [-1, 0], // left
      ];

      for (const [dx, dy] of directions) {
        const newX = lastX + dx;
        const newY = lastY + dy;

        // check adjacent cell
        if (
          newX >= 0 &&
          newX < 10 &&
          newY >= 0 &&
          newY < 10 &&
          !humanPlayer.board.memory.some(
            ([memX, memY]) => memX === newX && memY === newY,
          )
        ) {
          x = newX;
          y = newY;
          break; // valid adjacent cell
        }
      }
    }

    // if no adjacent cell, or no previous hit
    if ((x === undefined || y === undefined) && lastMoveMemory.length > 0) {
      lastMoveMemory.shift();
      computerMove()
      return
    }
    if (x === undefined || y === undefined) {
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      } while (
        humanPlayer.board.memory.some(
          ([memX, memY]) => memX === x && memY === y,
        )
      );
    }
    const cell = document.querySelector(
      `.left-player .board .cell[data-row="${x}"][data-col="${y}"]`,
    );
    if (humanPlayer.board.receiveAttack(x, y)) {
      cell.classList.add('hit');
      lastMoveMemory.push([x, y]);
      forgetMoveCounter = 0;
    } else {
      cell.classList.add('missed');
      forgetMoveCounter++;
    }

    // forget last move if too many misses in a row
    if (forgetMoveCounter >= 4) {
      lastMoveMemory.pop(); // 
      forgetMoveCounter = 0; //
    }

    currentTurn = 'human';
  }
});
