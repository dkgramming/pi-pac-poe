const request = require('request');
const express = require('express');

const { Cell } = require('../shared/enums.js');
const TicTacToe = require('../shared/tic-tac-toe.js');

const app = express();
const port = process.env.PORT || process.env.NODE_PORT || 1337;

const SERVER_URL = 'http://localhost:3000';

/**
 * Helper function that wraps `request`. Provides full URL for a given route.
 * Also format as the `gameState` as a string if provided so that it can be
 * sent in the body of the HTTP request.
 *
 * @param {string} route - The name of the route exposed by the server.
 * @param {number[][]} gameState - The state of the Tic-Tac-Toe game.
 * @param {function} callback - Function to call once the request finishes.
 */
const postToServer = (route, gameState, callback) => {
  const requestOptions = {
    method: 'POST',
    url: `${SERVER_URL}${route}`,
  };

  if (gameState) {
    requestOptions.form = { gameState: JSON.stringify(gameState) };
  }

  request(requestOptions, callback);
};

/**
 * Converts string to gameState object.
 *
 * @param {string} body - The body of an HTTP response.
 * @returns {number[][]} - The state of the Tic-Tac-Toe game.
 */
const parseGameState = body => JSON.parse(JSON.parse(body).gameState);

/**
 * Chooses best move given current state of the game, then sends that move
 * to the sever.
 *
 * @param {number[][]} gameState - The state of the Tic-Tac-Toe game.
 */
const makeMove = (gameState) => {
  const nextMove = TicTacToe.findBestMove(gameState, Cell.WHITE);
  console.log(nextMove);

  if (!nextMove) {
    console.log('game over D:');
    return;
  }

  postToServer('/makeMove', nextMove, (error, response, body) => {
    // Continue making moves until the server responds that game is over.
    if (!JSON.parse(body).gameOver) {
      const newGameState = parseGameState(body);
      makeMove(newGameState);
    }
  });
};

/**
 * Entry point to the client application. Sends request to the server to
 * start a new game of Tic-Tac-Toe.
 */
app.listen(port, () => {
  console.log(`Client PI listening on port ${port}!`);

  postToServer('/startGame', null, (error, response, body) => {
    const gameState = parseGameState(body);
    console.log(gameState);

    makeMove(gameState);
  });
});
