/**
 * Creates an back in easing function.
 *
 * @param {Number} amount
 * @return {Function} The easing functions.
 */
export function getBackIn(amount) {
  return x => x*x*((amount+1)*x - amount)
}

/**
 * Creates an back out easing function.
 *
 * @param {Number} amount
 * @return {Function} The easing functions.
 */
export function getBackOut(amount) {
  return x => --x*x*((amount+1)*x + amount) + 1
}

/**
 * Creates an back inOut easing function.
 *
 * @param {Number} amount
 * @return {Function} The easing functions.
 */
export function getBackInOut(amount) {
  amount*=1.525
  return function(x) {
    if ((x*=2)<1) return 0.5*(x*x*((amount+1)*x-amount))
    return 0.5*((x-=2)*x*((amount+1)*x+amount)+2)
  };
}


/**
 * Back in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let backIn = getBackIn(1.7)

/**
 * Back out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let backOut = getBackOut(1.7)

/**
 * Back inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let backInOut = getBackInOut(1.7)
