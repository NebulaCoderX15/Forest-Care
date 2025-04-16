const express = require('express');
const os = require('os');
const app = express();
const port = 3000;

// Middleware to parse incoming JSON
app.use(express.json());

// Store the latest data from ESP32
let latestData = {};

// POST route to receive data from ESP32
app.post('/api/data', (req, res) => {
  const { temperature, humidity, air_quality } = req.body;

  // Save the data
  latestData = { temperature, humidity, air_quality };

  console.log(`Received data: Temp=${temperature}, Humidity=${humidity}, Air Quality=${air_quality}`);
  res.status(200).send('Data received');
});

// GET route to serve the latest data to the frontend
app.get('/api/data', (req, res) => {
  res.json(latestData);
});

// Helper to get your machine’s IPv4 address
const networkInterfaces = os.networkInterfaces();
const ip = Object.values(networkInterfaces)
  .flat()
  .find(i => i.family === 'IPv4' && !i.internal)?.address || 'localhost';

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://${ip}:${port}`);
});
