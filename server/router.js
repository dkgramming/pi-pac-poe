const controllers = require('./controllers');

/**
 * Define the endpoints of the server application.
 *
 * @param {object} app - An instance of Express.
 */
const router = (app) => {
  app.post('/startGame', controllers.Game.startGame);
  app.post('/makeMove', controllers.Game.makeMove);
};

module.exports = router;
