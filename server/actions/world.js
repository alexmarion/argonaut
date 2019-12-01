import {
  TICK_MS,
  WORLD_WIDTH,
  WOLRD_HEIGHT,
  STARTING_FOOD_COUNT,
} from '../../constants';

// Helper methods
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomGridPosition = () => ({
  x: getRandomInt(0, WORLD_WIDTH),
  y: getRandomInt(0, WOLRD_HEIGHT),
});

// Create a grid to save the current state of the world
const grid = Array(WORLD_WIDTH).fill(null).map(() => Array(WOLRD_HEIGHT).fill(null));

// Create an array for batching movements. These moves are performed on tick
const gridMoves = [];

// Fill the grid with initial food
for(let i = 0; i < STARTING_FOOD_COUNT; i++) {
  const { x, y } = getRandomGridPosition();
  grid[x][y] = { type: 'food', radius: 1 };
}

// Place an agent on the grid
const { x, y } = getRandomGridPosition();
grid[x][y] = { type: 'agent', radius: 5 };

/**
 * @description Performs game object movements registered in the gridMoves array.
 */
function moveGameObjects() {
  if(gridMoves.length) {
    gridMoves.forEach((move) => {
      // Verify that each move is of the correct type
      if(move != null && typeof move === 'object') {
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
          grid[newPosition.x][newPosition.y] = grid[oldPosition.x][oldPosition.y];
          removeFromOldPosition = true;
        }

        // Nullify objects marked for removal at their old position
        if(removeFromOldPosition) {
          grid[oldPosition.x][oldPosition.y] = null;
        }
      }
    });
  }
}

/**
 * @description This is the brain of the world.
 * All functionality which occurs during a frame is called here.
 */
function tick() {
  moveGameObjects();
}

// Start the tick
setInterval(tick, TICK_MS);
