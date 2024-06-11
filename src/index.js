import Board from './classes/gameboard';
import Player from './classes/player';
import { createBoard } from './manipulatorDOM';
import './styles.css';

export const gameState = {
  resultText: document.querySelector('.result'),
  lastMoveMemory: [],
  lastDirection: [],
  forgetMoveCounter: 0,
  computerBoardElement: null,
  humanBoardElement: null,
  computerPlayer: null,
  humanPlayer: null,
  placementBoardBoard: new Board(),
  count: 6,
  direction: 'vertical',
};

document.addEventListener('DOMContentLoaded', () => {
  const placementWindow = document.querySelector('.placement');
  const placeButton = document.querySelector('.change-positions');

  placeButton.addEventListener('click', () => {
    placementWindow.style.display = 'flex';
    placeButton.style.display = 'none';
  });

  const placementBoard = document.querySelector('.placement .board');
  const placementText = document.querySelector('.placement p');
  const directionButton = document.querySelector('.direction');
  const resetButton = document.querySelector('.reset');
  const randomButton = document.querySelector('.random');

  createBoard(placementBoard);

  resetButton.addEventListener('click', () => {
    createBoard(placementBoard);
    gameState.count = 6;
    gameState.placementBoardBoard = new Board();
    placementText.textContent = `Place ${gameState.count}-length ship`;
  });

  directionButton.addEventListener('click', () => {
    if (gameState.direction === 'vertical') {
      gameState.direction = 'horizontal';
      directionButton.textContent = 'horizontal';
    } else {
      gameState.direction = 'vertical';
      directionButton.textContent = 'vertical';
    }
  });

  placementBoard.addEventListener('mouseup', (event) => {
    if (gameState.count === 1) {
      return null;
    }

    const cell = event.target;
    const x = parseInt(cell.dataset.row);
    const y = parseInt(cell.dataset.col);

    if (
      gameState.placementBoardBoard.placeShip(
        [x, y],
        gameState.count,
        gameState.direction,
        'human',
      )
    ) {
      gameState.count--;
      updateText();
    } else {
      return null;
    }
  });

  randomButton.addEventListener('mouseup', () => {
    if (gameState.count == 1) {
      randomButton.style.animation = 'wrong 0.5s linear';
      placementText.style.animation = 'bigger-green 1.5s linear 1';
      setTimeout(() => {
        randomButton.style.animation = '';
      }, 500);
      setTimeout(() => {
        placementText.style.animation = '';
      }, 1500);
    } else {
      gameState.placementBoardBoard.placeShipRandomly(gameState.count, 'human');
      gameState.count--;
      updateText();
    }
  });

  function updateText() {
    if (gameState.count === 1) {
      placementText.textContent = 'All ships placed!';
    } else {
      placementText.textContent = `Place ${gameState.count}-length ship`;
    }
  }

  const startButtons = document.querySelectorAll('.create-game');
  startButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (gameState.count !== 1) {
        button.style.animation = 'wrong 0.5s linear 1';
        placementText.style.animation = 'bigger-alert 1.5s linear 1';
        setTimeout(() => {
          button.style.animation = '';
        }, 500);
        setTimeout(() => {
          placementText.style.animation = '';
        }, 2000);
      } else {
        placementWindow.style.display = 'none';
        placeButton.style.display = 'block';
        createGame(gameState.placementBoardBoard, placementBoard);
      }
    });
  });
});

function handleBoardClick(event) {
  const cell = event.target;
  if (!cell.classList.contains('cell')) return;

  const x = parseInt(cell.dataset.row);
  const y = parseInt(cell.dataset.col);
  if (
    gameState.computerPlayer.board.memory.some(
      ([memX, memY]) => memX === x && memY === y,
    )
  ) {
    return;
  }

  switch (gameState.computerPlayer.board.receiveAttack(x, y)) {
    case true:
      cell.classList.add('hit');
      console.log('HITT');
      break;
    case false:
      cell.classList.add('missed');
      break;
    case -1:
      cell.classList.add('hit');
      gameState.computerBoardElement.removeEventListener('click', handleBoardClick);
      gameState.resultText.style.animation = 'game-ending 1.5s forwards';
      setTimeout(() => {
        gameState.resultText.style.animation = 'none';
      }, 1500);
      gameState.resultText.textContent = 'Game END! Human victory.';
      break;
    default:
      console.log('Unexpected result');
  }

  computerMove(gameState.humanPlayer);
}

function createGame(humanBoard, humanElement) {
  gameState.humanBoardElement = document.querySelector('.left-player .board');
  gameState.computerBoardElement = document.querySelector(
    '.right-player .board',
  );

  // RESET BOARD AND GAME STATE
  gameState.resultText.display = 'none';
  gameState.humanBoardElement.innerHTML = '';
  gameState.computerBoardElement.innerHTML = '';
  gameState.computerBoardElement.removeEventListener('click', handleBoardClick);

  gameState.lastMoveMemory = [];
  gameState.lastDirection = [];
  gameState.forgetMoveCounter = 0;
  // -------------------------------

  createBoard(gameState.humanBoardElement);
  gameState.humanBoardElement.innerHTML = humanElement.innerHTML;
  gameState.humanPlayer = new Player('human');
  gameState.humanPlayer.board = humanBoard;

  gameState.computerPlayer = new Player('computer');
  gameState.computerPlayer.board.placeShipRandomly(5);
  gameState.computerPlayer.board.placeShipRandomly(3);
  gameState.computerPlayer.board.placeShipRandomly(2);
  gameState.computerPlayer.board.placeShipRandomly(4);
  gameState.computerPlayer.board.placeShipRandomly(6);

  createBoard(gameState.computerBoardElement, gameState.computerPlayer);

  // add the new event listener
  gameState.computerBoardElement.addEventListener('click', handleBoardClick);
}

function computerMove(humanPlayer) {
  let x, y;

  // if previous hits array is not empty
  if (gameState.lastMoveMemory.length > 0) {
    let [lastX, lastY] =
      gameState.lastMoveMemory[gameState.lastMoveMemory.length - 1];

    const directions = [
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
      [-1, 0], // up
    ];

    if (gameState.lastDirection.length === 0) {
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
          gameState.lastDirection.push([dx, dy]);
          gameState.lastDirection.push([-dx, -dy]);

          x = newX;
          y = newY;
          console.log('undirected: last hit based');
          break; // valid adjacent cell
        }
      }
    } else {
      for (const [dx, dy] of gameState.lastDirection) {
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
          console.log('directed: last hit based');

          break; // valid adjacent cell
        }
      }
    }
  }

  // if no adjacent cell, or no previous hit
  if (
    (x === undefined || y === undefined) &&
    gameState.lastMoveMemory.length > 1
  ) {
    gameState.lastMoveMemory.pop();
    computerMove(humanPlayer);
    return;
  }
  if (x === undefined || y === undefined) {
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (
      humanPlayer.board.memory.some(([memX, memY]) => memX === x && memY === y)
    );
  }
  const cell = document.querySelector(
    `.left-player .board .cell[data-row="${x}"][data-col="${y}"]`,
  );

  switch (gameState.humanPlayer.board.receiveAttack(x, y)) {
    case true:
      cell.classList.add('hit');
      gameState.lastMoveMemory.push([x, y]);
      gameState.forgetMoveCounter = 0;
      break;
    case false:
      cell.classList.add('missed');
      gameState.forgetMoveCounter++;
      gameState.lastDirection.pop();
      break;
    case -1:
      cell.classList.add('hit');
      gameState.computerBoardElement.removeEventListener('click', handleBoardClick);
      gameState.resultText.style.animation = 'game-ending 1.5s forwards';
      setTimeout(() => {
        gameState.resultText.style.animation = 'none';
      }, 1500);
      gameState.resultText.textContent = 'Game END! Computer victory.';
      break;
    default:
      console.log('Unexpected result');
  }

  if (gameState.forgetMoveCounter > 2) {
    gameState.lastDirection = [];
  }
  // forget last move if too many misses in a row
  if (gameState.forgetMoveCounter > 4) {
    gameState.lastMoveMemory.shift();
    gameState.forgetMoveCounter = 0;
  }
}
