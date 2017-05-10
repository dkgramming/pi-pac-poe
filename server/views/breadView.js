const gpio = require('rpi-gpio');
const config = require('./config.js');
const { Cell } = require('../../shared/enums.js');

const on = pin => gpio.write(pin, true);
const off = pin => gpio.write(pin, false);

const setup = () => {
  config.forEach((cell) => {
    gpio.setup(cell.red, gpio.DIR_OUT);
    gpio.setup(cell.white, gpio.DIR_OUT);
  });
};

const render = (gameState) => {
  gameState.forEach((row, y) => {
    row.forEach((color, x) => {
      const index = (y * 3) + x;

      switch (color) {
        case Cell.RED:
          off(config[index].white);
          on(config[index].red);
          break;
        case Cell.WHITE:
          off(config[index].red);
          on(config[index].white);
          break;
        default:
          off(config[index].red);
          off(config[index].white);
      }
    });
  });
};

module.exports = {
  setup,
  render,
};
