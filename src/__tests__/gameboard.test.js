/* eslint-disable no-undef */
import Gameboard from '../classes/gameboard.js';

describe('Gameboard Placing', () => {
  let board = new Gameboard();

  test('places ships correctly', () => {
    const shipLength = 3;
    const coord = [0, 0];
    const hCoord = [1, 0];

    expect(board.placeShip(coord, shipLength, 'vertical')).toBe(true);
    expect(board.board[0][0]).toBeTruthy();
    expect(board.board[0][1]).toBeTruthy();
    expect(board.board[0][2]).toBeTruthy();

    expect(board.placeShip(hCoord, shipLength, 'horizontal')).toBe(true);
    expect(board.board[1][0]).toBeTruthy();
    expect(board.board[2][0]).toBeTruthy();
    expect(board.board[3][0]).toBeTruthy();
  });
  test('prevents invalid ship placement', () => {
    const shipLength = 3;
    const coord = [0, 0];

    expect(board.placeShip(coord, shipLength, 'vertical')).toBe(false);
    expect(board.placeShip([10, 3], shipLength, 'vertical')).toBe(false);
    expect(board.placeShip([3, 10], shipLength, 'vertical')).toBe(false);
  });
});

describe('Gameboard Attacking', () => {
  let board = new Gameboard();
  board.placeShip([0, 0], 3, 'vertical');

  test('succesful attack', () => {
    expect(board.receiveAttack(0, 0)).toBe(true);
    expect(board.receiveAttack(0, 1)).toBe(true);

  });
  test('invalid attack', () => {
    expect(board.receiveAttack(10, 5)).toBe(null);
    expect(board.receiveAttack(0, 1)).toBe(null);
  });
  test('failed attack', () => {
    expect(board.receiveAttack(5, 5)).toBe(false);
  });
});
