import React from 'react';
import Food from '../food';
import './world.scss';

const STARTING_FOOD_COUNT = 10;
const getRandomPosition = () => Math.floor(Math.random() * 1000);

class World extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodPositions: Array.from({ length: STARTING_FOOD_COUNT }, () => ({
        position: {
          x: getRandomPosition(),
          y: getRandomPosition(),
        },
      })),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  renderFood(position) {
    return <Food position={position} />;
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    const foodElements = this.state.foodPositions.map((food) => this.renderFood(food.position));
    return (
      <div className="position-absolute w-100 h-100">{foodElements}</div>
    );
  }
}

export default World;
