export default class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
    this.sunk = false;
  }
  hit() {
    this.timesHit++;
    this.isSunk();
  }

  isSunk() {
    if (this.length == this.timesHit) {
      this.sunk = true;
      return true;
    }
    return false;
  }
}
