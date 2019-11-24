import React from 'react';
import Food from '../food';
import Agent from '../agent';
import { TICK_MS } from '../../constants';
import './world.scss';

// TODO: to make things easier I'm introducing boundaries for now. Eventually these will be removed
const WORLD_WIDTH = 800;
const WOLRD_HEIGHT = 600;
const STARTING_FOOD_COUNT = 10;

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
    clearInterval(this.tickInterval);
  }

  renderGameObject(gameObject, position) {
    if(gameObject == null || gameObject.type == null) {
      return null;
    }
    const GameObjectTag = GAME_OBJECT_TAGS[gameObject.type];
    if(GameObjectTag == null) {
      return null;
    }
    return <GameObjectTag key={`${GameObjectTag}-${position.x}-${position.y}`} tick={this.state.tick} position={position} />;
  }

  // eslint-disable-next-line class-methods-use-this
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
