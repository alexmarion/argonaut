import React from 'react';
import './food.css';

// TODO: this can probably be a stateless component
class Food extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radius: this.props.radius,
      timeToLive: 100,
    };
  }

  componentWillUnmount() {
    clearInterval(this.timeToLiveInterval);
  }

  render() {
    return (
      <div
        className="food position-absolute bg-success border border-dark"
        style={{
          top: this.props.coordinates[1],
          left: this.props.coordinates[0],
          opacity: this.state.timeToLive / 100,
          width: `${this.state.radius}vw`,
          height: `${this.state.radius}vw`,
        }}
      >
      </div>
    );
  }
}

export default Food;
