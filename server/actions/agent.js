const { ACTION_TYPES } = require('../../client/src/constants');

const MIN_MOVE = 0;
const MAX_MOVE = 1;
const getRandomInt = () => (Math.floor(Math.random() * (MAX_MOVE - MIN_MOVE + 1)) + MIN_MOVE)
  * (Math.random() < 0.5 ? -1 : 1);

/**
 * A pair of x,y integer coordinates
 * @typedef {Object} Position
 * @property {number} x - An integer representing the x coordinate
 * @property {number} y - An integer representing the y coordinate
 */

/**
 * @description Generates new coordinates for the agent given old coordinates.
 * @param {Position} position
 * @return {Position} - A new position after the move has been calculated.
 */
function move({ x, y }) {
  const newX = x + getRandomInt();
  const newY = y + getRandomInt();
  return { x: newX, y: newY };
}

/**
 * @description Perform the agent tick functions.
 * @param {Position} position
 */
function tick(position) {
  const newPosition = move(position);
  return { [ACTION_TYPES.MOVE]: { oldPosition: position, newPosition } };
}

module.exports = { tick };
