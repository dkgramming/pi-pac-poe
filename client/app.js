const request = require('request');
const express = require('express');

const { Cell } = require('../shared/enums.js');
const TicTacToe = require('../shared/tic-tac-toe.js');

const app = express();
const port = process.env.PORT || process.env.NODE_PORT || 1337;

const SERVER_URL = 'http://localhost:3000';

const postToServer = (route, gameState, callback) => {
  const requestOptions = {
    method: 'POST',
    url: `${SERVER_URL}${route}`,
  };

  if (gameState) {
    requestOptions.form = { gameState: JSON.stringify(gameState) };
  }

  // console.log(requestOptions);

  request(requestOptions, callback);
};

const parseGameState = body => JSON.parse(JSON.parse(body).gameState);

const makeMove = (gameState) => {
  const nextMove = TicTacToe.findBestMove(gameState, Cell.WHITE);
  console.log(nextMove);

  if (!nextMove) {
    console.log('game over D:');
    return;
  }

  postToServer('/makeMove', nextMove, (error, response, body) => {
    if (!JSON.parse(body).gameOver) {
      const newGameState = parseGameState(body);
      makeMove(newGameState);
    }
  });
};

app.listen(port, () => {
  console.log(`Client PI listening on port ${port}!`);

  postToServer('/startGame', null, (error, response, body) => {
    const gameState = parseGameState(body);
    console.log(gameState);

    makeMove(gameState);
  });
});
