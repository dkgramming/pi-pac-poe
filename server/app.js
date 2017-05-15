const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const router = require('./router.js');
const BreadView = require('./views/breadView.js');

// Enable POST request body parsing
app.use(bodyParser.urlencoded({ extended: true }));

// Define the default route for the application.
app.get('/', (req, res) => {
  res.send('Hello World :3');
});

// Expose the endpoints of the application.
router(app);

// Listen for requests on specified port.
app.listen(port, () => {
  console.log(`Server PI listening on port ${port}!`);

  // Prepare the GPIO pins for rendering.
  BreadView.setup();
});
