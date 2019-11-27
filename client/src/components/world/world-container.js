import React from 'react';
import Food from '../food';
import Agent from '../agent';
import { TICK_MS } from '../../constants';
import './world.scss';

// TODO: to make things easier I'm introducing boundaries for now. Eventually these will be removed
const WORLD_WIDTH = 800;
const WOLRD_HEIGHT = 600;
const STARTING_FOOD_COUNT = 10;

const getRandomID = () => Math.random().toString(36).slice(2);

const GAME_OBJECT_TAGS = {
  food: Food,
  agent: Agent,
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomGridPosition = () => ({
  x: getRandomInt(0, WORLD_WIDTH),
  y: getRandomInt(0, WOLRD_HEIGHT),
});

class World extends React.Component {
  constructor(props) {
    super(props);
    // The grid represents each pixel currently rendered
    const grid = Array(WORLD_WIDTH).fill(null).map(() => Array(WOLRD_HEIGHT).fill(null));

    // Fill the grid with initial food
    for(let i = 0; i < STARTING_FOOD_COUNT; i++) {
      const { x, y } = getRandomGridPosition();
      grid[x][y] = { type: 'food' };
    }

    // Place an agent on the grid
    const { x, y } = getRandomGridPosition();
    grid[x][y] = { type: 'agent' };

    this.state = { grid };
  }

  componentDidMount() {
    // Create the world tick
    this.tickInterval = setInterval(() => {
      this.setState({ tick: this.state.tick === 0 ? 1 : 0 });
    }, TICK_MS);
  }

  componentWillUnmount() {
    // Make sure the tick interval gets cleared
    clearInterval(this.tickInterval);
  }

  gameObjectMoved(oldPosition, newPosition) {
    this.setState((prevState) => {
      const grid = prevState.grid.map((gridX, x) => {
        if(x === oldPosition.x) {
          return gridX.map((gameObject, y) => {
            // TODO: don't actually want to mutate this array I don't think.
            // Need some way of batching until the next tick, then moving and doing collision checking all at once
            // This function should append movements to an array and then the tick function should handle the movements and reset the array
            return gameObject;
          });
        }
        return gridX;
      });
      return grid;
    });
    // grid[oldPosition.x][oldPosition.y] = this.state.grid[oldPosition.x][oldPosition.y];
  }

  renderGameObject(gameObject, position) {
    if(gameObject == null || gameObject.type == null) {
      return null;
    }
    const GameObjectTag = GAME_OBJECT_TAGS[gameObject.type];
    if(GameObjectTag == null) {
      return null;
    }
    // const gameObjectID = getRandomID();
    // console.log(gameObjectID);
    return <GameObjectTag key={`${GameObjectTag}-${position.x}-${position.y}`} tick={this.state.tick} position={position} />;
  }

  render() {
    const renderGrid = this.state.grid.map((gridX, x) =>
      gridX.map((gameObject, y) =>
        this.renderGameObject(gameObject, { x, y })));

    return (
      <div
        className="position-relative bg-primary m-auto"
        style={{ width: WORLD_WIDTH, height: WOLRD_HEIGHT }}
      >
        {renderGrid}
      </div>
    );
  }
}

export default World;
