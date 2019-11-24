import React from 'react';
import './agent.css';

const MIN = 0;
const MAX = 3;
const getRandomInt = () => ((Math.floor(Math.random() * (MAX - MIN + 1)) + MIN)
  * Math.random() < 0.5 ? -1 : 1);

class Agent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {
        x: 0,
        y: 0,
      },
    };
  }

  move() {
    const { position: { x, y } } = this.state;
    this.setState({
      position: {
        x: x + getRandomInt(),
        y: y + getRandomInt(),
      },
    });
  }

  componentDidUpdate(prevProps) {
    if(this.props.tick !== prevProps.tick) {
      this.move();
    }
  }

  render() {
    return (
      <div
        className="agent bg-primary border border-dark rounded-circle position-absolute"
        style={{
          top: this.state.position.x,
          left: this.state.position.y,
        }}
      >
        <div className="d-flex align-items-center justify-content-center w-100 h-100">
          {this.state.position.x}
        </div>
      </div>
    );
  }
}

export default Agent;
