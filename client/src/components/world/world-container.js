import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Food from '../food';
import Agent from '../agent';
import { TICK_MS, WORLD_WIDTH, WOLRD_HEIGHT } from '../../constants';
import './world.scss';

// TODO: to make things easier I'm introducing boundaries for now. Eventually these will be removed
const STARTING_FOOD_COUNT = 10;

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
    this.tickInterval = setInterval(() => this.tick(), TICK_MS);

    // Listen for websocket events
    websocketClient.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    websocketClient.onmessage = (message) => {
      console.log(message);
    };
  }

  componentWillUnmount() {
    // Make sure the tick interval gets cleared
    clearInterval(this.tickInterval);
  }

  tick() {
    if(this.gridMoves.length) {
      // Create a copy of the grid
      const grid = JSON.parse(JSON.stringify(this.state.grid));
      this.gridMoves.forEach((move) => {
        const { oldPosition, newPosition } = move;
        // If newPosition is null the element is removed
        let removeOld = newPosition == null;

        // Check that the move is legal (and has changed the position)
        if(!removeOld
          && newPosition.x >= 0
          && newPosition.x < WORLD_WIDTH
          && newPosition.y >= 0
          && newPosition.y < WOLRD_HEIGHT
          && (newPosition.x !== oldPosition.x || newPosition.y !== oldPosition.y)) {
          grid[newPosition.x][newPosition.y] = grid[oldPosition.x][oldPosition.y];
          removeOld = true;
        }

        if(removeOld) {
          grid[oldPosition.x][oldPosition.y] = null;
        }
      });

      // Detect any collisions and perform required action(s)
      /*
      grid.forEach((gridX, x) => {
        gridX.forEach((gameObject, y) => {
          if(gameObject != null) {
          }
        });
      });
      */

      // Set the new grid and remove the old moves
      this.setState({ grid });
      this.gridMoves = [];
    }

    this.setState({ tick: this.state.tick === 0 ? 1 : 0 });
  }

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
      tick={this.state.tick}
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
