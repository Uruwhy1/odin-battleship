import Ship from './ship';

export default class Board {
  constructor() {
    this.board = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null),
    );
    this.memory = [];
    this.ships = [];
  }

  placeShip(coordArr, length, direction) {
    const x = coordArr[0];
    const y = coordArr[1];

    if (!this.__checkCoordinates(x, y, length, direction)) {
      return false; // invalid ship placement;
    }

    const newShip = new Ship(length);
    this.ships.push(newShip);
    for (let i = 0; i < length; i++) {
      let placeX = direction === 'horizontal' ? x + i : x;
      let placeY = direction === 'vertical' ? y + i : y;

      this.board[placeX][placeY] = newShip;
    }
    return true;
  }
  __checkCoordinates(x, y, length, direction) {
    if (x > 9 || y > 9 || x < 0 || y < 0) return null;
    // check if ship placement goes out of bounds
    if (direction === 'horizontal') {
      if (x + length > 9) return null;
    } else if (direction === 'vertical') {
      if (y + length > 9) return null;
    }

    // check if the initial coordinate is free
    if (this.board[x][y] !== null) return null;

    // check if spaces are free
    for (let i = 0; i < length; i++) {
      let checkX = direction === 'horizontal' ? x + i : x;
      let checkY = direction === 'vertical' ? y + i : y;

      if (this.board[checkX][checkY] !== null) return null;
    }

    return true;
  }

  receiveAttack(x, y) {
    if (x > 9 || y > 9 || x < 0 || y < 0) return null;
    if (this.memory.some(([memX, memY]) => memX === x && memY === y)) return null;
    if (this.board[x][y] == null) return false;
    else {
      this.memory.push([x, y]);
      this.board[x][y].hit();
      this.__checkShips();
      return true;
    }
  }

  __checkShips() {
    if (this.ships.every(ship => ship.isSunk())) {
      alert("ALL SHIPS SUNK")
      return true;
    };
  }
}
