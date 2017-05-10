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

const col = index => Math.floor(index / 3);
const row = index => index % 3;

/**
 * @return config : {color : int, win : [int]}
 */
const findWinConfig = (gameState) => {
  const getCell = index => gameState[row(index)][col(index)];

  const win = winPermutations.map((perm) => {
    const isWin = getCell(perm[0]) !== Cell.BLANK &&
                  getCell(perm[0]) === getCell(perm[1]) &&
                  getCell(perm[0]) === getCell(perm[2]);

    return isWin ? {
      color: getCell(perm[0]),
      win: perm,
    } : null;
  });

  return win.reduce((prev, curr) => {
    return prev ? prev : curr;
  }, null);
};

const clone = (gameState) => {
  return gameState.map(_row => _row.slice(0));
};

/*
 * @return [[gameState]]
 */
const getMoves = (board, color) => {
  const moves = [];
  const sandbox = clone(board);

  board.forEach((_, r) => {
    board.forEach((cellColor, c) => {
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

const findBestMove = (board, color) => {
  let bestMove = null;
  let bestScore = -Infinity;

  getMoves(board, color).forEach((move) => {
    const currentScore = minimax(move, 0, true, color);
    if (currentScore > bestScore) {
      bestMove = move;
      bestScore = currentScore;
    }
  });

  return bestMove;
};

/*
 * color (Cell) - color of which player's turn it is
 */
const minimax = (gameState, depth, isMaximizingPlayer, color) => {
  // Base case: if board in terminal state, return score
  const winConfig = findWinConfig(gameState);

  if (winConfig) {
    return winConfig.color === color ? 10 : -10;
  }

  if (getMoves(gameState, color).length === 0) {
    return 0;
  }

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
  findBestMove
};
