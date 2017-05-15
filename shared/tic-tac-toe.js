const { Cell } = require('./enums.js');

const winPermutations = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 5], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // top left to bottom right
  [2, 4, 6], // top right to bottom left
];

/**
 * Translates from array index to a column index.
 *
 * @param {number} index - The array index.
 * @returns {number} - The column index.
 */
const col = index => Math.floor(index / 3);

/**
 * Translates from array index to a row index.
 *
 * @param {number} index - The array index.
 * @returns {number} - The row index.
 */
const row = index => index % 3;

/**
 * Returns win config on the given board if one exists.
 *
 * @returns {(object|null)} - The win config
 */
const findWinConfig = (gameState) => {
  const getCell = index => gameState[row(index)][col(index)];

  const win = winPermutations.map((perm) => {
    // It's a win when all three cells defined in the permutations
    // are of the same color. Blank does not count.
    const isWin = getCell(perm[0]) !== Cell.BLANK &&
                  getCell(perm[0]) === getCell(perm[1]) &&
                  getCell(perm[0]) === getCell(perm[2]);

    return isWin ? {
      color: getCell(perm[0]),
      win: perm,
    } : null;
  });

  // There is a possibility for multiple win configs, so just
  // return the first one.
  return win.reduce((prev, curr) => prev || curr, null);
};

/**
 * Creates a deep clone of the given game state.
 *
 * @param {number[][]} gameState - The state of the Tic-Tac-Toe game.
 * @returns {number[][]} - The cloned gameState.
 */
const clone = gameState => gameState.map(_row => _row.slice(0));

/**
 * Gets all moves that are available given a game state and player color.
 *
 * @param {number[][]} board - The state of the Tic-Tac-Toe game.
 * @param {number} color - The color of the current player.
 * @returns {number[][][]} - An array of game states.
 */
const getMoves = (board, color) => {
  const moves = [];
  const sandbox = clone(board);

  board.forEach((_, r) => {
    board.forEach((cellColor, c) => {
      // A blank cell represents a possible move.
      if (sandbox[r][c] === Cell.BLANK) {
        sandbox[r][c] = color;

        const move = clone(board);
        move[r][c] = color;
        moves.push(move);
      }
    });
  });

  return moves;
};

/**
 * Checks if the the game board is completely empty.
 *
 * @param {number[][]} board - The state of the Tic-Tac-Toe game.
 * @returns {boolean} - Whether the board is empty or not.
 */
const isEmptyBoard = (board) => {
  let isEmpty = true;

  board.forEach((row) => {
    row.forEach((col) => {
      // Short circuit it is already known that the board is empty.
      if (isEmpty && col !== 0) {
        isEmpty = false;
      }
    });
  });
  return isEmpty;
};

/**
 * Returns a randomly chosen move based on the given game
 * state and player color.
 *
 * @param {number[][]} board - The state of the Tic-Tac-Toe game.
 * @param {number} color - The color of the current player.
 * @returns {number[][]} - The randomly chosen move.
 */
const randomMove = (board, color) => {
  const moves = getMoves(board, color);
  const d = new Date();
  const ms = d.getMilliseconds();
  const randomIndex = ms % moves.length;

  return moves[randomIndex];
};

/**
 * Spin lock for a given number of milliseconds.
 *
 * @param {number} ms - Number of milliseconds.
 */
const sleep = (ms) => {
  ms += new Date().getTime();
  while (new Date() < ms) {}
};

/**
 * Returns an optimal move move based on the given game
 * state and player color. Uses the Minimax algorithm.
 *
 * @param {number[][]} board - The state of the Tic-Tac-Toe game.
 * @param {number} color - The color of the current player.
 * @returns {number[][]} - The best move.
 */
const findBestMove = (board, color) => {
  let bestMove = null;
  let bestScore = -Infinity;

  // Optimization: first move takes too long otherwise
  if (isEmptyBoard(board)) {
    return randomMove(board, color);
  }

  getMoves(board, color).forEach((move) => {
    const currentScore = minimax(move, 0, true, color);
    if (currentScore > bestScore) {
      bestMove = move;
      bestScore = currentScore;
    }
  });

  // Wait a bit so that humans can observe changes in the game state.
  sleep(5000);

  return bestMove;
};

/**
 * Returns the score of a move based on the given game
 * state and player color.
 *
 * @param {number[][]} gameState - The state of the Tic-Tac-Toe game.
 * @param {number} depth - How many times the algorithm has recursed.
 * @param {boolean} isMaximizingPlayer - Is the move being calculated from the
 *                                       perspective of the current player.
 * @param {number} color - The color of the current player.
 * @returns {number} - The score of the given move.
 */
const minimax = (gameState, depth, isMaximizingPlayer, color) => {
  // Base case: if board in terminal state, return score
  const winConfig = findWinConfig(gameState);

  // If the current player wins assign a score of 10,
  // otherwise assign a score of -10.
  if (winConfig) {
    return winConfig.color === color ? 10 : -10;
  }

  // The game ended in a tie.
  if (getMoves(gameState, color).length === 0) {
    return 0;
  }

  // Recursive case
  let bestScore;

  if (isMaximizingPlayer) {
    bestScore = -Infinity;
    getMoves(gameState, color).forEach((move) => {
      const value = minimax(move, depth + 1, false, color);
      bestScore = Math.max(bestScore, value);
    });
    return bestScore;
  }

  bestScore = Infinity;

  const otherColor = color === Cell.RED ? Cell.White : Cell.Red;
  getMoves(gameState, otherColor).forEach((move) => {
    const value = minimax(move, depth + 1, true, color);
    bestScore = Math.min(bestScore, value);
  });

  return bestScore;
};

module.exports = {
  getMoves,
  minimax,
  findBestMove,
};
