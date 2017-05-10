/**
 * Generates a random integer.
 *
 * You must provide one or two parameters to the function. If you provide a 
 * single number (N), this function will generate a random value in the 
 * interval [0, N) (does not include N). If you provide two numbers, this 
 * function will generate a random value in the interval [N, M) (does not 
 * include M, but include N).
 *
 * If you don't provide any value, the function will throws an error.
 *
 * @param {Integer} n - The first parameter.
 * @param {Integer} m - The second number.
 * @return {Integer}
 */
export default function int(n, m) {
  // Validate input
  if (typeof n !== 'number')
    throw new Error(`Invalid parameter for random int function "${n}".`)


  // If M is not provided, it will generate a random from zero to N
  if (typeof m === 'undefined') {
    m = n
    n = 0
  }

  let diff = m - n
  return n + parseInt(Math.random()*diff)
}
