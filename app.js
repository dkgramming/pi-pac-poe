const express = require('express');
const app = express();

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const router = require('./router.js');

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
