/**
 * Generates a random number between 0 (inclusive) and 1 (inclusive).
 *
 * This function uses rejection sampling to guarantee that it is possible to 
 * return a number in the correct interval. Internally it generates a number 
 * in [-.1, 1.1), but rejects any number that is not contained in the interval
 * [0, 1].
 *
 * @return {Number}
 */
export default function inclusiveRandom() {
  let n = -1
  while (n < 0 || n > 1) {
    n = Math.random()*1.2 - 0.1
  }

  return n
}