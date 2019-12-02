const Grid = require('./grid');
const agent = require('./agent');
const food = require('./food');
const {
  ACTION_TYPES,
  GAME_OBJECT_TYPES,
  WORLD_WIDTH,
  WOLRD_HEIGHT,
  STARTING_FOOD_COUNT,
} = require('../../client/src/constants');

const gameObjects = {
  [GAME_OBJECT_TYPES.FOOD]: food,
  [GAME_OBJECT_TYPES.AGENT]: agent,
};

// Helper methods
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomGridPosition = () => ({
  x: getRandomInt(0, WORLD_WIDTH),
  y: getRandomInt(0, WOLRD_HEIGHT),
});

// Create a grid to save the current state of the world
const grid = new Grid(WORLD_WIDTH, WOLRD_HEIGHT);

// Create an array for batching movements. These moves are performed on tick
let gridMoves = [];

// Fill the grid with initial food
for(let i = 0; i < STARTING_FOOD_COUNT; i++) {
  const { x, y } = getRandomGridPosition();
  grid.set({ type: GAME_OBJECT_TYPES.FOOD, radius: 1 }, x, y);
}

// Place an agent on the grid
const initialAgentPosition = getRandomGridPosition();
grid.set({
  type: GAME_OBJECT_TYPES.AGENT,
  radius: 5,
}, initialAgentPosition.x, initialAgentPosition.y);

/**
 * @description Iterate through the grid and tick each game object.
 */
function runGameObjectTicks() {
  grid.iterate((gameObject, x, y) => {
    if(gameObject != null && gameObjects[gameObject.type] != null) {
      const actions = gameObjects[gameObject.type].tick({ x, y });
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
      if(move != null && typeof move === 'object' && move.oldPosition != null) {
        const { oldPosition, newPosition } = move;

        // If newPosition is null the element is removed
        let removeFromOldPosition = newPosition == null;

        // Check that the move is legal (and has changed the position)
        if(!removeFromOldPosition
          && newPosition.x >= 0
          && newPosition.x < WORLD_WIDTH
          && newPosition.y >= 0
          && newPosition.y < WOLRD_HEIGHT
          && (newPosition.x !== oldPosition.x || newPosition.y !== oldPosition.y)) {
          // grid[newPosition.x][newPosition.y] = grid[oldPosition.x][oldPosition.y];
          grid.set(grid.get(oldPosition.x, oldPosition.y), newPosition.x, newPosition.y);
          removeFromOldPosition = true;
        }

        // Delete objects marked for removal at their old position
        if(removeFromOldPosition) {
          grid.delete(oldPosition.x, oldPosition.y);
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
