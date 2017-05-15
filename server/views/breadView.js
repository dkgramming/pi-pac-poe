const gpio = require('rpi-gpio');
const config = require('./config.js');
const { Cell } = require('../../shared/enums.js');

/**
 * Sends logic-1 to requested pin.
 *
 * @param {number} pin - The number of the physical pin.
 */
const on = pin => gpio.write(pin, true);

/**
 * Sends logic-0 to requested pin.
 *
 * @param {number} pin - The number of the physical pin.
 */
const off = pin => gpio.write(pin, false);

/**
 * Configure all pins defined in `config.js` to output mode.
 */
const setup = () => {
  config.forEach((cell) => {
    gpio.setup(cell.red, gpio.DIR_OUT);
    gpio.setup(cell.white, gpio.DIR_OUT);
  });
};

/**
 * Renders the state of the game to an LED matrix.
 *
 * @param {number[][]} - The state of the Tic-Tac-Toe game.
 */
const render = (gameState) => {
  gameState.forEach((row, y) => {
    row.forEach((color, x) => {
      // Translate from (x, y) coordinates to an array index.
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
