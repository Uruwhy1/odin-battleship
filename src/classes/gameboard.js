import Ship from './ship';

export default class Board {
  constructor() {
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null),
    );
    this.memory = [];
    this.ships = [];
  }

  placeShipRandomly(length, player) {
    let placed = false;
    while (!placed) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      placed = this.placeShip([row, col], length, orientation, player);
    }
    return placed;
  }

  placeShip(coordArr, length, direction, player) {
    const x = coordArr[0];
    const y = coordArr[1];
    if (!this.__checkCoordinates(x, y, length, direction)) {
      return false; // invalid ship placement;
    }

    const newShip = new Ship(length);
    this.ships.push(newShip);
    for (let i = 0; i < length; i++) {
      let placeX = direction === 'vertical' ? x + i : x;
      let placeY = direction === 'horizontal' ? y + i : y;

      this.board[placeX][placeY] = newShip;

      if (player == 'human') {
        this.__updateDOMCell(placeX, placeY);
      }
    }
    return true;
  }
  __checkCoordinates(x, y, length, direction) {
    if (x > 9 || y > 9 || x < 0 || y < 0) return null;
    // check if ship placement goes out of bounds
    if (direction === 'vertical') {
      if (x + length > 10) return null;
    } else if (direction === 'horizontal') {
      if (y + length > 10) return null;
    }

    // check if the initial coordinate is free
    if (this.board[x][y] !== null) return null;

    // check if spaces are free
    for (let i = 0; i < length; i++) {
      let checkX = direction === 'vertical' ? x + i : x;
      let checkY = direction === 'horizontal' ? y + i : y;

      if (this.board[checkX][checkY] !== null) return null;
    }

    return true;
  }
  __updateDOMCell(x, y) {
    const cell = document.querySelectorAll(
      `.player-board .cell[data-row="${x}"][data-col="${y}"]`,
    );
    cell.forEach((element) => {
      element.classList.add('ship');
    });
  }

  receiveAttack(x, y) {
    if (x > 9 || y > 9 || x < 0 || y < 0) return null;
    if (this.memory.some(([memX, memY]) => memX === x && memY === y))
      return null;
    this.memory.push([x, y]);

    if (this.board[x][y] === null) {
      return false;
    } else {
      this.board[x][y].hit();
      return this.__checkShips();
    }
  }

  __checkShips() {
    console.log(this.ships);
    if (this.ships.every((ship) => ship.isSunk())) {
      return -1;
    }
    return true;
  }
}
