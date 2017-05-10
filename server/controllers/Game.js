const { Cell } = require('../../shared/enums.js');
const TicTacToe = require('../../shared/tic-tac-toe.js');
const BreadView = require('../views/breadView.js');

let gameState = [];

const initializeGameState = () => {
  const row = () => [Cell.BLANK, Cell.BLANK, Cell.BLANK];

  gameState = [1, 2, 3].map(row);
};

const startGame = (req, res) => {
  const firstPlayer = Math.floor(Math.random() * 2);

  initializeGameState();

  // first player is client
  if (firstPlayer === Cell.WHITE) {
    res.status(200).json({ gameState: JSON.stringify(gameState) });
  } else {
    const nextMove = TicTacToe.findBestMove(gameState, Cell.RED);

    BreadView.render(nextMove);

    res.status(200).json({ gameState: JSON.stringify(nextMove) });
  }
};

const makeMove = (req, res) => {
  console.log('white made a move!!! :O');

  const newGameState = JSON.parse(req.body.gameState);
  console.log(newGameState);

  BreadView.render(newGameState);

  const nextMove = TicTacToe.findBestMove(newGameState, Cell.RED);

  if (!nextMove) {
    console.log('game ended :O');
    return res.status(200).json({ gameOver: true });
  }

  BreadView.render(nextMove);

  return res.status(200).json({ gameState: JSON.stringify(nextMove) });
};

module.exports = {
  startGame,
  makeMove,
};
