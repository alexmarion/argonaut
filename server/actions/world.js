import agent from './agent';
import food from './food';
import {
  ACTION_TYPES,
  GAME_OBJECT_TYPES,
  TICK_MS,
  WORLD_WIDTH,
  WOLRD_HEIGHT,
  STARTING_FOOD_COUNT,
} from '../../constants';

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
const grid = Array(WORLD_WIDTH).fill(null).map(() => Array(WOLRD_HEIGHT).fill(null));

// Create an array for batching movements. These moves are performed on tick
const gridMoves = [];

// Fill the grid with initial food
for(let i = 0; i < STARTING_FOOD_COUNT; i++) {
  const { x, y } = getRandomGridPosition();
  grid[x][y] = { type: GAME_OBJECT_TYPES.FOOD, radius: 1 };
}

// Place an agent on the grid
const initialAgentPosition = getRandomGridPosition();
grid[initialAgentPosition.x][initialAgentPosition.y] = { type: GAME_OBJECT_TYPES.AGENT, radius: 5 };

/**
 * @description Iterate through the grid and tick each game object.
 */
function runGameObjectTicks() {
  grid.forEach((gridX, x) => {
    gridX.forEach((gameObject, y) => {
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
  });
}

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
  // Get each action for the game elements
  runGameObjectTicks();
  // Perform all move actions
  moveGameObjects();
}

// Start the tick
setInterval(tick, TICK_MS);
