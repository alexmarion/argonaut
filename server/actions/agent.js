const { ACTION_TYPES } = require('../../client/src/constants');

const MIN_MOVE = 0;
const MAX_MOVE = 1;
const getRandomInt = () => (Math.floor(Math.random() * (MAX_MOVE - MIN_MOVE + 1)) + MIN_MOVE)
  * (Math.random() < 0.5 ? -1 : 1);

/**
 * @description Generates new coordinates for the agent given old coordinates.
 * @param {...number} coordinates
 * @return {number[]} - A new set of coordinates after the move has been calculated.
 */
function move(...coordinates) {
  return coordinates.map((c) => c + getRandomInt());
}

/**
 * @description Perform the agent tick functions.
 * @param {...number} coordinates
 */
function tick(...coordinates) {
  const newCoordinates = move(...coordinates);
  return { [ACTION_TYPES.MOVE]: { oldCoordinates: coordinates, newCoordinates } };
}

module.exports = { tick };
