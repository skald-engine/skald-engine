// These are internal helpers to color functions

function hue2rgb(p, q, t) {
  let r
  if (t < 0) t += 1
  if (t > 1) t -= 1
  
  if (t < 1/6) r = p + (q - p) * 6 * t
  else if (t < 1/2) r = q
  else if (t < 2/3) r = p + (q - p) * (2/3 - t) * 6
  else r = p
  
  return Math.round(r*255)
}

function assertColor(color, f) {
  if (!Number.isInteger(color) || color < 0 || color > 16777215)
    throw new TypeError(`Invalid color "${color}" for '${f}' function.`)
}

function assertFloat(number, p, f, min=0, max=1) {
  if (isNaN(number) || !isFinite(number))
    throw new TypeError(`Invalid ${p} value "${number}" on '${f}' function.`)

  return Math.min(Math.max(number, min), max)
}


module.exports = {
  hue2rgb,
  assertFloat,
  assertColor
}