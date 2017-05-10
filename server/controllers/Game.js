const { Cell } = require('../../shared/enums.js');

let gameState = [];

const initializeGameState = () => {
  const row = () => [Cell.BLANK, Cell.BLANK, Cell.BLANK];

  gameState = [1, 2, 3].map(row);
};

const startGame = (req, res) => {
  const firstPlayer = Math.floor(Math.random() * 2);

  initializeGameState();

  // first player is client
  if (firstPlayer === 1) {
    res.status('200').json({ gameState: JSON.stringify(gameState) });
  }
};

const makeMove = (req, res) => {
  console.log('white made a move!!! :O');
};

module.exports = {
  startGame,
  makeMove,
};
