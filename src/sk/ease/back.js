/**
 * Creates a backIn easing function.
 *
 * @param {Number} amount
 * @return {Function} The easing functions.
 */
function getBackIn(amount) {
  return x => x*x*((amount+1)*x - amount)
}

/**
 * Creates a back out easing function.
 *
 * @param {Number} amount
 * @return {Function} The easing functions.
 */
function getBackOut(amount) {
  return x => --x*x*((amount+1)*x + amount) + 1
}

/**
 * Creates a back inOut easing function.
 *
 * @param {Number} amount
 * @return {Function} The easing functions.
 */
function getBackInOut(amount) {
  amount*=1.525
  return (x) => {
    if ((x*=2)<1) return 0.5*(x*x*((amount+1)*x-amount))
    return 0.5*((x-=2)*x*((amount+1)*x+amount)+2)
  };
}

/**
 * BackIn easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const backIn = getBackIn(1.7)

/**
 * BackOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const backOut = getBackOut(1.7)

/**
 * BackInOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const backInOut = getBackInOut(1.7)

module.exports = {
  getBackIn,
  getBackOut,
  getBackInOut,
  backIn,
  backOut,
  backInOut
}