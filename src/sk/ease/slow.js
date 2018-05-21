function slowInOut(x, factor=2) {
  factor = 2*factor
  x = Math.min(Math.max(x, 0), 1)
  let y = (1 - Math.pow(x*2 - 1, factor))/2

  if (x <= .5) return y
  if (x > .5) return 1 - y
}

function slowIn(x, factor=2) {
  factor = 2*factor
  x = Math.min(Math.max(x, 0), 1)
  return  1 - Math.pow(x-1, factor)
}

function slowOut(x, factor=2) {
  factor = 2*factor
  x = Math.min(Math.max(x, 0), 1)
  return Math.pow(x, factor)
}


module.exports = {
  slowIn,
  slowOut,
  slowInOut,
}