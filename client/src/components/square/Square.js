import React from 'react';
import './Square.css';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: null};

    this.squareClick = this.squareClick.bind(this);
  }

  squareClick() {
    this.setState({value: 'X'});
  }

  render() {
    return (
      <button className="square" onClick={this.squareClick}>
        {this.state.value}
      </button>
    );
  }
}

export default Square;
