import React from 'react';

const MIN = 0;
const MAX = 3;
const getRandomInt = () => (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN)
  * (Math.random() < 0.5 ? -1 : 1);

class Agent extends React.Component {
  /*
  constructor(props) {
    super(props);
    this.state = {
      position: props.position, // TODO: position probably doesn't need to live in state
      radius: this.props.radius, // TODO: radius may not need to live in state either
    };
  }
  */

  move() {
    const { position: { x, y } } = this.props;
    this.props.gameObjectMoved(
      { x, y },
      { x: x + getRandomInt(), y: y + getRandomInt() },
    );
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
          top: this.props.position.x,
          left: this.props.position.y,
          width: `${this.props.radius}vw`,
          height: `${this.props.radius}vw`,
        }}
      >
        <div className="d-flex align-items-center justify-content-center w-100 h-100">
          {this.props.position.x}
        </div>
      </div>
    );
  }
}

export default Agent;
