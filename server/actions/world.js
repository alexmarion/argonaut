const Grid = require('./grid');
const agent = require('./agent');
const food = require('./food');
const {
  ACTION_TYPES,
  GAME_OBJECT_TYPES,
  GRID_DIMENSIONS,
  STARTING_FOOD_COUNT,
} = require('../../client/src/constants');

const gameObjects = {
  [GAME_OBJECT_TYPES.FOOD]: food,
  [GAME_OBJECT_TYPES.AGENT]: agent,
};

// Helper methods
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomGridCoordinates = () => Array.from(
  { length: GRID_DIMENSIONS.length },
  (v, i) => getRandomInt(0, GRID_DIMENSIONS[i]),
);

// Create a grid to save the current state of the world
const grid = new Grid(...GRID_DIMENSIONS);

// Create an array for batching movements. These moves are performed on tick
let gridMoves = [];

// Fill the grid with initial food
for(let i = 0; i < STARTING_FOOD_COUNT; i++) {
  grid.set({ type: GAME_OBJECT_TYPES.FOOD, radius: 1 }, ...getRandomGridCoordinates());
}

// Place initial agents on grid
for(let i = 0; i < 10; i++) {
  grid.set({
    type: GAME_OBJECT_TYPES.AGENT,
    radius: 5,
  }, ...getRandomGridCoordinates());
}

/**
 * @description Iterate through the grid and tick each game object.
 */
function runGameObjectTicks() {
  grid.iterate((gameObject, ...coordinates) => {
    if(gameObject != null && gameObjects[gameObject.type] != null) {
      const actions = gameObjects[gameObject.type].tick(...coordinates);
      if(actions && typeof actions === 'object') {
        if(actions[ACTION_TYPES.MOVE]) {
          // Add move into list of moves for this tick
          gridMoves.push(actions[ACTION_TYPES.MOVE]);
        } else if(actions[ACTION_TYPES.NEW_THING]) {
          // TODO
        }
      }
    }
  });
}

/**
 * @description Performs game object movements registered in the gridMoves array.
 */
function moveGameObjects() {
  console.log(JSON.stringify(gridMoves));
  if(gridMoves.length) {
    gridMoves.forEach((move) => {
      // Verify that each move is of the correct type
      if(move != null && typeof move === 'object' && move.oldCoordinates != null) {
        const { oldCoordinates, newCoordinates } = move;

        // If newCoordinates is null the element is removed
        let removeFromOldCoordinates = newCoordinates == null;

        if(!removeFromOldCoordinates
          // Check that move is legal
          && newCoordinates.every((c, i) => c >= 0 && c < GRID_DIMENSIONS[i])
          // Check that position has changed
          && newCoordinates.some((c, i) => c !== oldCoordinates[i])) {
          grid.set(grid.get(...oldCoordinates), ...newCoordinates);
          removeFromOldCoordinates = true;
        }

        // Delete objects marked for removal at their old position
        if(removeFromOldCoordinates) {
          grid.delete(...oldCoordinates);
        }
      }
    });

    // Emptry the moves array
    gridMoves = [];
  }
}

/**
 * @description This is the brain of the world.
 * All functionality which occurs during a frame is called here.
 * @returns {Object[]} TODO: for simplicity this returns a grid reference
 */
function tick() {
  // Get each action for the game elements
  runGameObjectTicks();
  // Perform all move actions
  moveGameObjects();
  return grid;
}

module.exports = { tick };
