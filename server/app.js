const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const router = require('./router.js');
const BreadView = require('./views/breadView.js');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World :3');
});

router(app);

app.listen(port, () => {
  console.log(`Server PI listening on port ${port}!`);
  BreadView.setup();
});
