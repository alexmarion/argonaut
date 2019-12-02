const http = require('http');
const express = require('express');
const { server: WebsocketServer } = require('websocket');
const world = require('./actions/world');
const { TICK_MS } = require('../client/src/constants');

const EXPRESS_PORT = 9000;
const WEBSOCKET_PORT = 9001;

const app = express();
const expressServer = http.createServer(app);
const websocketHttpServer = http.createServer();

const closeServer = (server) => new Promise((r) => server.close(r));

// Shut down the server before exiting
process.on('SIGTERM', async () => {
  try {
    await Promise.all([
      closeServer(expressServer),
      closeServer(websocketHttpServer),
    ]);
  } finally {
    process.exit(0);
  }
});

// Express app configuration
app.set('trust proxy', true);
app.set('x-powered-by', false);

// Websocket server configuration
const websocketClients = {};
const websocketUsers = {};
const websocketTypeDefs = {};
const websocketServer = new WebsocketServer({ httpServer: websocketHttpServer });
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4()}${s4()}-${s4()}`;
};

const sendMessage = (json) => {
  // Send data to every client
  // TODO: this should only send messages to clients who are viewing the effected area
  Object.keys(websocketClients).forEach((client) => {
    websocketClients[client].sendUTF(json);
  });
};

// TODO: move this to the world routes file
setInterval(() => {
  const grid = world.tick().getAll();
  const gridMessage = JSON.stringify();
  sendMessage(gridMessage);
}, TICK_MS);

websocketServer.on('request', (request) => {
  const userID = getUniqueID();
  console.log(`${new Date()} Recieved a new connection from origin ${request.origin}.`);
  // TODO: rewrite to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  websocketClients[userID] = connection;
  console.log(`connected: ${userID} in ${Object.getOwnPropertyNames(websocketClients)}`);

  // Initialize the message listener
  connection.on('message', (message) => {
    if(message.type === 'utf8') {
      const dataFromClient = JSON.parse(message.utf8Data);
      const json = { type: dataFromClient.type };
      if(dataFromClient.type === websocketTypeDefs.USER_EVENT) {
        websocketUsers[userID] = dataFromClient;
        json.data = { websocketUsers };
      } else if(dataFromClient.type === websocketTypeDefs.VIEW_CHANGE) {
        // TODO: View change here
      }
      sendMessage(JSON.stringify(json));
    }
  });

  // Initialize the close listener
  connection.on('close', () => { // Takes single argument, connection
    console.log(`${new Date()} Peer ${userID} disconnected.`);
    const json = { type: websocketTypeDefs.USER_EVENT };
    // userActivity.push(`${users[userID].username} left the document`);
    json.data = { websocketUsers };
    delete websocketClients[userID];
    delete websocketUsers[userID];
    sendMessage(JSON.stringify(json));
  });
});

expressServer.listen(EXPRESS_PORT);
websocketHttpServer.listen(WEBSOCKET_PORT);
