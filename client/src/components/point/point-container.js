import React from 'react';

class Point extends React.Component {
  constructor(props) {
    super(props);
    console.log('here');
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div></div>
    );
  }
}

export default Point;
