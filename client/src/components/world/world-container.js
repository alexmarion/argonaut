import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Food from '../food';
import Agent from '../agent';
import { GAME_OBJECT_TYPES, GRID_DIMENSIONS, TICK_MS } from '../../constants';
import './world.scss';

// const getRandomID = () => Math.random().toString(36).slice(2);

const GAME_OBJECT_TAGS = {
  [GAME_OBJECT_TYPES.FOOD]: Food,
  [GAME_OBJECT_TYPES.AGENT]: Agent,
};

const websocketClient = new W3CWebSocket('ws://127.0.0.1:9001');

function recursiveGridMap(grid, fxn, ...coordinates) {
  return Object.keys(grid).map((coordinate) => {
    const numCoordinate = Number(coordinate);
    return coordinates.length === GRID_DIMENSIONS.length - 1
      ? fxn(grid[coordinate], ...coordinates, numCoordinate)
      : recursiveGridMap(grid[coordinate], fxn, ...coordinates, numCoordinate);
  });
}

function renderGameObject(gameObject, ...coordinates) {
  if(gameObject == null || gameObject.type == null) {
    return null;
  }
  const GameObjectTag = GAME_OBJECT_TAGS[gameObject.type];
  if(GameObjectTag == null) {
    return null;
  }
  // const gameObjectID = getRandomID();
  // console.log(gameObjectID);
  return <GameObjectTag
    key={`${GameObjectTag}${coordinates.map((c) => `-${c}`)}`}
    coordinates={coordinates}
    radius={gameObject.radius}
  />;
}

class World extends React.Component {
  constructor(props) {
    super(props);
    // Set the initial state to an empty grid
    this.state = { grid: {}, tick: 0 };
    this.tickQueue = [];
  }

  componentDidMount() {
    // Create the world tick
    this.tickInterval = null; // setInterval(() => this.tick(), TICK_MS);

    // Listen for websocket events
    websocketClient.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    websocketClient.onmessage = (message) => {
      // TODO: introduce a delay and begin to queue messages from the server. This will make the performance faster
      const dataFromServer = JSON.parse(message.data);
      // console.log(message.data);
      console.log('Data from server', `${(message.data.length * 2) / 1000000} MB`);
      this.tickQueue.push(dataFromServer);
    };

    // TODO: need a better way of animating than updating state.
    // Frame rate of setState simply isn't fast enough for smooth animation
    // Wait 1 seconds before starting tick
    this.tickTimeout = setTimeout(() => {
      this.tickInterval = setInterval(() => {
        const grid = this.tickQueue.pop();
        this.setState({ grid });
      }, TICK_MS);
    }, 1000);
    // this.tickTimeout = setTimeout(() => {
    //   // Jumpstart updates
    //   this.tickInterval = setInterval(() => {
    //     this.setState((s) => ({ tick: s.tick ? 0 : 1}));
    //   }, TICK_MS);
    //   // this.setState({ tick: 1 });
    // }, 2000);
  }

  componentDidUpdate() {
    const grid = this.tickQueue.pop();
    if(grid) {
      this.setState({ grid });
    }
  }

  componentWillUnmount() {
    // Make sure the tick timeout and interval gets cleared
    clearTimeout(this.tickTimeout);
    clearInterval(this.tickInterval);
  }

  render() {
    const renderGrid = recursiveGridMap(this.state.grid, renderGameObject);
    return (
      <div
        className="position-relative bg-primary m-auto"
        style={{ width: GRID_DIMENSIONS[0], height: GRID_DIMENSIONS[1] }}
      >
        {renderGrid}
      </div>
    );
  }
}

export default World;
