/**
 * Creates a backIn easing function.
 *
 * @param {Number} amount
 * @return {Function} The easing functions.
 */
export function getBackIn(amount) {
  return x => x*x*((amount+1)*x - amount)
}

/**
 * Creates a back out easing function.
 *
 * @param {Number} amount
 * @return {Function} The easing functions.
 */
export function getBackOut(amount) {
  return x => --x*x*((amount+1)*x + amount) + 1
}

/**
 * Creates a back inOut easing function.
 *
 * @param {Number} amount
 * @return {Function} The easing functions.
 */
export function getBackInOut(amount) {
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
export let backIn = getBackIn(1.7)

/**
 * BackOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let backOut = getBackOut(1.7)

/**
 * BackInOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let backInOut = getBackInOut(1.7)