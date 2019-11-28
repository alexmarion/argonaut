const http = require('http');
const express = require('express');
const { server: WebsocketServer } = require('websocket');

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
const websocketServer = new WebsocketServer({ httpServer: websocketHttpServer });
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4()}${s4()}-${s4()}`;
};
websocketServer.on('request', (request) => {
  const userID = getUniqueID();
  console.log(`${new Date()} Recieved a new connection from origin ${request.origin}.`);
  // TODO: rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  websocketClients[userID] = connection;
  console.log(`connected: ${userID} in ${Object.getOwnPropertyNames(websocketClients)}`);
});

expressServer.listen(EXPRESS_PORT);
websocketHttpServer.listen(WEBSOCKET_PORT);
