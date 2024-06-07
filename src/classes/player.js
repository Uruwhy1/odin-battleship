import Board from './gameboard';

export default class Player {
  constructor(type) {
    this.type = type;
    this.board = new Board();
  }

  placeShip(coordArr, length, direction) {
    this.board.placeShip(coordArr, length, direction, this.type);
  }
}
