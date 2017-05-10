const request = require('request');
const express = require('express');

const app = express();

const port = process.env.PORT || process.env.NODE_PORT || 1337;

app.listen(port, () => {
  console.log(`Client PI listening on port ${port}!`);
});

request({ method: 'POST', url: 'http://localhost:3000/startGame' }, (err, response, body) => {
  console.log(body);
});
