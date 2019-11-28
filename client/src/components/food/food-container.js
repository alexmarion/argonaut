import React from 'react';
import './food.css';
import { TICK_MS } from '../../constants';

class Food extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radius: this.props.radius,
      timeToLive: 100,
    };
  }


  componentDidMount() {
    this.timeToLiveInterval = setInterval(() => {
      if(this.state.timeToLive <= 0) {
        clearInterval(this.timeToLiveInterval);
        this.props.gameObjectMoved(this.props.position);
      } else {
        this.setState((prevState) => ({ timeToLive: prevState.timeToLive - 2 }));
      }
    }, TICK_MS);
  }

  componentWillUnmount() {
    clearInterval(this.timeToLiveInterval);
  }

  render() {
    return (
      <div
        className="food position-absolute bg-success border border-dark"
        style={{
          top: this.props.position.y,
          left: this.props.position.x,
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
