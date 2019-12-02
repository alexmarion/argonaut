// NOTE: this lives in the client directory right now while inside of create-react-app
// The framework does not allow imports from outside the src directory.
// Will move after ejecting.
module.exports = {
  ACTION_TYPES: Object.freeze({
    MOVE: 0,
  }),
  GAME_OBJECT_TYPES: Object.freeze({
    FOOD: 0,
    AGENT: 1,
  }),
  TICK_MS: 1000,
  WORLD_WIDTH: 800,
  WOLRD_HEIGHT: 600,
  STARTING_FOOD_COUNT: 10,
};
