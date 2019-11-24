import React from 'react';
import './food.css';

class Food extends React.Component {
  constructor(props) {
    super(props);
    this.state = { timeToLive: 100 };
  }


  componentDidMount() {
    this.timeToLiveInterval = setInterval(() => {
      if(this.state.timeToLive <= 0) {
        clearInterval(this.timeToLiveInterval);
      } else {
        this.setState((prevState) => ({ timeToLive: prevState.timeToLive - 5 }));
      }
    }, 1000);
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
        }}
      >
      </div>
    );
  }
}

export default Food;
