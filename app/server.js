const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

// Shut down the server before exiting
process.on('SIGTERM', async () => {
  try {
    await new Promise((r) => server.close(r));
  } finally {
    process.exit(0);
  }
});

// Express app configuration
app.set('trust proxy', true);
app.set('x-powered-by', false);

server.listen(9000);
