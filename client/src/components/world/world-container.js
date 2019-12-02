import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Food from '../food';
import Agent from '../agent';
import { GAME_OBJECT_TYPES, GRID_DIMENSIONS } from '../../constants';
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
    this.state = { grid: {} };
  }

  componentDidMount() {
    // Create the world tick
    this.tickInterval = null; // setInterval(() => this.tick(), TICK_MS);

    // Listen for websocket events
    websocketClient.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    websocketClient.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      // console.log(message.data);
      console.log('Data from server', `${(message.data.length * 2) / 1000000} MB`);
      this.setState({ grid: dataFromServer });
      // TODO: change state based on data received
    };
  }

  componentWillUnmount() {
    // Make sure the tick interval gets cleared
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
