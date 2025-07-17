const express = require('express');
const app = express();

const leaks = [];

app.get('/', (req, res) => {
  res.send('Hello from scalable Node.js backend!');
});

app.get('/kill', (req, res) => {
  console.log('Simulating crash...');
  res.send('Shutting down...');
  process.exit(1);
});

app.get('/leak', (req, res) => {
  leaks.push(Buffer.alloc(5 * 1024 * 1024)); // 5 MB per request
  console.log(`Leaked memory: ${leaks.length * 5} MB`);
  res.send(`Leaked memory: ${leaks.length * 5} MB`);
});

app.get('/cpu', (req, res) => {
  const start = Date.now();
  while (Date.now() - start < 500) {
    Math.random();
  }
  res.send('CPU spike done');
});

let healthy = true;

app.get('/health', (req, res) => {
  if (healthy) res.send('OK');
  else res.status(500).send('Unhealthy');
});

// Optional: toggle health
app.get('/make-unhealthy', (req, res) => {
  healthy = false;
  res.send('Marked as unhealthy');
});

const server = app.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on port 3000');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...  kjehjhewjhh');
  server.close(() => {
    console.log('Server closed gracefully.');
    process.exit(0);
  });
});
