import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Food from '../food';
import Agent from '../agent';
import {
  WORLD_WIDTH,
  WOLRD_HEIGHT,
  STARTING_FOOD_COUNT,
} from '../../constants';
import './world.scss';

const getRandomID = () => Math.random().toString(36).slice(2);

const GAME_OBJECT_TAGS = {
  food: Food,
  agent: Agent,
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomGridPosition = () => ({
  x: getRandomInt(0, WORLD_WIDTH),
  y: getRandomInt(0, WOLRD_HEIGHT),
});

const websocketClient = new W3CWebSocket('ws://127.0.0.1:9001');

class World extends React.Component {
  constructor(props) {
    super(props);
    // The grid represents each pixel currently rendered
    const grid = Array(WORLD_WIDTH).fill(null).map(() => Array(WOLRD_HEIGHT).fill(null));

    // Fill the grid with initial food
    for(let i = 0; i < STARTING_FOOD_COUNT; i++) {
      const { x, y } = getRandomGridPosition();
      grid[x][y] = { type: 'food', radius: 1 };
    }

    // Place an agent on the grid
    const { x, y } = getRandomGridPosition();
    grid[x][y] = { type: 'agent', radius: 5 };

    // Create an array for batching grid movements
    this.gridMoves = [];

    // Set the initial state
    this.state = { grid };

    // Bind functions passed to children
    this.gameObjectMoved = this.gameObjectMoved.bind(this);
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
      console.log('Data from server', dataFromServer, `${(message.data.length * 2) / 1000000} MB`);
      // this.setState({ grid: dataFromServer });
      // TODO: change state based on data received
    };
  }

  componentWillUnmount() {
    // Make sure the tick interval gets cleared
    clearInterval(this.tickInterval);
  }

  // TODO: delete this
  gameObjectMoved(oldPosition, newPosition) {
    this.gridMoves.push({ oldPosition, newPosition });
  }

  renderGameObject(gameObject, position) {
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
      key={`${GameObjectTag}-${position.x}-${position.y}`}
      position={position}
      radius={gameObject.radius}
      gameObjectMoved={this.gameObjectMoved}
    />;
  }

  render() {
    const renderGrid = this.state.grid.map((gridX, x) =>
      gridX.map((gameObject, y) =>
        this.renderGameObject(gameObject, { x, y })));

    return (
      <div
        className="position-relative bg-primary m-auto"
        style={{ width: WORLD_WIDTH, height: WOLRD_HEIGHT }}
      >
        {renderGrid}
      </div>
    );
  }
}

export default World;
