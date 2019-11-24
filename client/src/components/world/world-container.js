import React from 'react';
import Food from '../food';
import Agent from '../agent';
import './world.scss';

// TODO: to make things easier I'm introducing boundaries for now. Eventually these will be removed
const WORLD_WIDTH = 800;
const WOLRD_HEIGHT = 600;
const STARTING_FOOD_COUNT = 10;

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
      grid[x][y] = <Food key={`food-${x}-${y}`} position={{ x, y }} />;
    }

    this.state = {
      grid,
      agents: [],
      // foodPositions: Array.from({ length: STARTING_FOOD_COUNT }, () => ({
      //   position: {
      //     x: getRandomPosition(),
      //     y: getRandomPosition(),
      //   },
      // })),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidMount() {
    // this.tickInterval = setInterval(() => {
    //   this.setState({ tick: this.state.tick === 0 ? 1 : 0 });
    // }, 15);
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div
        className="position-relative bg-primary m-auto"
        style={{ width: WORLD_WIDTH, height: WOLRD_HEIGHT }}
      >
        <Agent tick={this.state.tick} />
        {this.state.grid}
      </div>
    );
  }
}

export default World;
