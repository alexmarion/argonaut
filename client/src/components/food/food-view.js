import React from 'react';
import './food.css';

function Food(props) {
  return (
    <div
      className="food position-absolute bg-primary border border-dark"
      style={{
        top: props.position.y,
        left: props.position.x,
      }}
    >
    </div>
  );
}

export default Food;
