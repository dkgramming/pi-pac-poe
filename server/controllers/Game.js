const { Cell } = require('../../shared/enums.js');
const TicTacToe = require('../../shared/tic-tac-toe.js');
const BreadView = require('../views/breadView.js');

// Maintains the state of the Tic-Tac-Toe between requests
let gameState = [];

/**
 * Overrides the current `gameState` with a game board with
 * all empty cells.
 */
const initializeGameState = () => {
  const row = () => [Cell.BLANK, Cell.BLANK, Cell.BLANK];

  gameState = [1, 2, 3].map(row);
};

/**
 * Endpoint to start a new Tic-Tac-Toe game.
 *
 * @param {object} req - HTTP request
 * @param {object} res - HTTP response
 */
const startGame = (req, res) => {
  // Randomly choose which player gets the first move.
  const firstPlayer = Math.floor(Math.random() * 2);

  // Clear the game board.
  initializeGameState();

  // First player is client (client is represented by white LED)
  if (firstPlayer === Cell.WHITE) {
    res.status(200).json({ gameState: JSON.stringify(gameState) });
  } else {
    // First player is server (server is represented by red LED)
    const nextMove = TicTacToe.findBestMove(gameState, Cell.RED);

    BreadView.render(nextMove);

    res.status(200).json({ gameState: JSON.stringify(nextMove) });
  }
};

/**
 * Endpoint to submit a move.
 *
 * @param {object} req - HTTP request
 * @param {object} res - HTTP response
 */
const makeMove = (req, res) => {
  console.log('white made a move!!! :O');

  const newGameState = JSON.parse(req.body.gameState);
  console.log(newGameState);

  BreadView.render(newGameState);

  const nextMove = TicTacToe.findBestMove(newGameState, Cell.RED);

  // If there are no moves to make, then the game is over.
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
