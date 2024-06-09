import Player from './classes/player';
import { createBoard } from './manipulatorDOM';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.create-game');
  startButton.addEventListener('click', () => {
    createGame();
  });
});

let lastMoveMemory = [];
let lastDirection = [];
let forgetMoveCounter = 0;

// I HATE HAVING SO MANY GLOBAL VARIABLES BUT IF I PUT THE EVENT LISTENER FUNCITON INSIDE OF ANOTHER
// ONE THEN IT DOES NOT REMOVE AND COMPUTER STARTS DOING MORE THAN ONE MOVE PER TURN AAAAAAAAAAAAAAAA
let computerBoardElement;
let humanBoardElement;
let computerPlayer;
let humanPlayer;

function handleBoardClick(event) {
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

  computerMove(humanPlayer);
}

function createGame() {
  humanBoardElement = document.querySelector('.left-player .board');
  computerBoardElement = document.querySelector('.right-player .board');

  // RESET BOARD AND GAME STATE
  humanBoardElement.innerHTML = "";
  computerBoardElement.innerHTML = "";
  computerBoardElement.removeEventListener('click', handleBoardClick);

  lastMoveMemory = [];
  lastDirection = [];
  forgetMoveCounter = 0;
  // -------------------------------

  createBoard(humanBoardElement);
  humanPlayer = new Player('human');
  humanPlayer.placeShip([0, 3], 5, 'horizontal');
  humanPlayer.placeShip([5, 0], 2, 'vertical');
  humanPlayer.placeShip([7, 2], 4, 'vertical');
  humanPlayer.placeShip([0, 5], 3, 'horizontal');
  humanPlayer.placeShip([9, 0], 6, 'vertical');

  computerPlayer = new Player('computer');
  computerPlayer.board.placeShipRandomly(5);
  computerPlayer.board.placeShipRandomly(3);
  computerPlayer.board.placeShipRandomly(2);
  computerPlayer.board.placeShipRandomly(4);
  computerPlayer.board.placeShipRandomly(6);

  createBoard(computerBoardElement, computerPlayer);

  // add the new event listener
  computerBoardElement.addEventListener('click', handleBoardClick);
}

function computerMove(humanPlayer) {
  let x, y;

  // if previous hits array is not empty
  if (lastMoveMemory.length > 0) {
    let [lastX, lastY] = lastMoveMemory[0];

    if (lastMoveMemory.length > 2) {
      [lastX, lastY] = lastMoveMemory[lastMoveMemory.length - 1];
    }

    const directions = [
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
      [-1, 0], // up
    ];

    if (lastDirection.length == 0) {
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
          lastDirection.push([dx, dy]);
          lastDirection.push([-dx, -dy]);

          x = newX;
          y = newY;
          break; // valid adjacent cell
        }
      }
    } else {
      for (const [dx, dy] of lastDirection) {
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

          console.log('xD');
          break; // valid adjacent cell
        }
      }
    }
  }

  // if no adjacent cell, or no previous hit
  if ((x === undefined || y === undefined) && lastMoveMemory.length > 0) {
    lastMoveMemory.shift();
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
  if (humanPlayer.board.receiveAttack(x, y)) {
    cell.classList.add('hit');
    lastMoveMemory.push([x, y]);
    forgetMoveCounter = 0;
  } else {
    cell.classList.add('missed');
    forgetMoveCounter++;
    lastDirection.shift();
  }

  if (forgetMoveCounter >= 2) {
    lastDirection = [];
  }

  // forget last move if too many misses in a row
  if (forgetMoveCounter >= 4) {
    lastMoveMemory.shift();
    forgetMoveCounter = 0;
  }
}
