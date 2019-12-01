const MIN_MOVE = 0;
const MAX_MOVE = 1;
const getRandomInt = () => (Math.floor(Math.random() * (MAX_MOVE - MIN_MOVE + 1)) + MIN_MOVE)
  * (Math.random() < 0.5 ? -1 : 1);
