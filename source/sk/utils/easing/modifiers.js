
/**
 * Mirror the provided function.
 *
 * This function returns a new function that divides the input space in the 
 * middle (0.5).
 */
function mirror(f) {
  return x => (x<.5)? f(x*2) : f(1-(x-.5)*2)
}

/**
 * Divides the input space in N.
 */
function repeat(f, N=2) {
  let rate = 1/N
  return x => f((x%rate)*N)
}


module.exports = {
  mirror,
  repeat
}