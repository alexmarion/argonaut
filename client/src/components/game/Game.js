import React from 'react';
import Board from '../board';
import './Game.css';

class Game extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <div>{/* TODO */}</div>
        </div>
      </div>
    );
  }
}

export default Game;
