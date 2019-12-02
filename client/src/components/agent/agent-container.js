import React from 'react';

// TODO: this can probably be a stateless component
class Agent extends React.Component {
  render() {
    return (
      <div
        className="agent bg-primary border border-dark rounded-circle position-absolute"
        style={{
          top: this.props.coordinates[1],
          left: this.props.coordinates[0],
          width: `${this.props.radius}vw`,
          height: `${this.props.radius}vw`,
        }}
      >
        <div className="d-flex align-items-center justify-content-center w-100 h-100">
          {this.props.coordinates[0]}
        </div>
      </div>
    );
  }
}

export default Agent;
