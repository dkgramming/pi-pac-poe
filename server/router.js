const controllers = require('./controllers');

const router = (app) => {
  app.post('/startGame', controllers.Game.startGame);
  app.post('/makeMove', controllers.Game.makeMove);
};

module.exports = router;
