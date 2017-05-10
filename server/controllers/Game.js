const startGame = (req, res) => {
  const firstPlayer = Math.floor(Math.random() * 2);

  // first player is client
  if (firstPlayer === 1) {
    // res.status('200').json({  });
  }
};

const makeMove = (req, res) => {
  console.log('white made a move!!! :O');
};

module.exports = {
  startGame,
  makeMove,
};
