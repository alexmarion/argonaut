import React from 'react';
import Food from '../food';
import Agent from '../agent';
import './world.scss';

const STARTING_FOOD_COUNT = 10;
const getRandomPosition = () => Math.floor(Math.random() * 500);

class World extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agents: [],
      foodPositions: Array.from({ length: STARTING_FOOD_COUNT }, () => ({
        position: {
          x: getRandomPosition(),
          y: getRandomPosition(),
        },
      })),
    };

    this.tick();
  }

  tick() {
    this.tickInterval = setInterval(() => {
      this.setState({ tick: this.state.tick === 0 ? 1 : 0 });
    }, 15);
  }

  // eslint-disable-next-line class-methods-use-this
  renderFood(position) {
    return <Food key={`food-${position.x}-${position.y}`} position={position} />;
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    const foodElements = this.state.foodPositions.map((food) => this.renderFood(food.position));
    return (
      <div className="position-absolute w-100 h-100">
        <Agent tick={this.state.tick} />
        {foodElements}
      </div>
    );
  }
}

export default World;
