const inclusive = require('sk/random/inclusive')

/**
 * Chooses a value in the interval [-1, 1], which can be multiplied by the 
 * provided multiplier parameter.
 *
 * @param {Number} [multiplier=1] - The multiplier to scale the result
 * @return {Number}
 */
function polar(multiplier=1) {
  return multiplier*(inclusive()*2 - 1)
}


module.exports = polar