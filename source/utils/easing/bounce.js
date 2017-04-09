/**
 * Bounce in easing.
 *
 * @param {Number} x
 * @return {Number} The converted value.
 */
export function bounceIn(x) {
  return 1 - bounceOut(1-x)
}

/**
 * Bounce out easing.
 *
 * @param {Number} x
 * @return {Number} The converted value.
 */
export function bounceOut(x) {
  if (x < 1/2.75) {
    return (7.5625*x*x)

  } else if (x < 2/2.75) {
    return (7.5625*(x-=1.5/2.75)*x+0.75)

  } else if (x < 2.5/2.75) {
    return (7.5625*(x-=2.25/2.75)*x+0.9375)

  } else {
    return (7.5625*(x-=2.625/2.75)*x +0.984375)
  }
}

/**
 * Bounce inOut easing.
 *
 * @param {Number} x
 * @return {Number} The converted value.
 */
export function bounceInOut(x) {
  if (x<0.5) return bounceIn(x*2)/2
  return bounceOut(x*2-1)/2 + 0.5
}
