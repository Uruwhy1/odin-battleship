/* eslint-disable no-undef */
import Ship from '../classes/ship.js';

test('Ship instance constructs properly', () => {
  const ship = new Ship(5);
  expect(ship.length).toBe(5);
  expect(ship.timesHit).toBe(0);
  expect(ship.isSunk()).toBe(false);
});

test('Ship sunks when hit length times', () => {
  const ship = new Ship(2);
  ship.hit(), ship.hit();
  expect(ship.isSunk()).toBe(true)
});
