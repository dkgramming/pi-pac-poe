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

const col = (index) => Math.floor(index / 3);
const row = (index) => index % 3;

const findWinConfig = (gameState) => {
  const getCell = (index) => {
    return gameState[row(index)][col(index)];
  };

  const win = winPermutations.map((perm) => {
    const isWin = getCell(perm[0]) === getCell(perm[1]) === getCell(perm[2]);
    return {
      color: null,
      win: []
    };
  });    
};
