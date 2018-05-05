/**
 * Converts an RGB color to an int color. The inputs must be numbers in the 
 * range of 0 to 255, inclusive. Any value out of this range will throw a
 * type error.
 * 
 * @param {Number} red - The red value.
 * @param {Number} green - The green value.
 * @param {Number} blue - The blue value.
 * @return {Number} The color as integer.
 */
function rgbToColor(red, green, blue) {
  if (!Number.isInteger(red) || red < 0 || red > 255)
    throw new TypeError(`Invalid red value "${red}" on 'rgbToColor' function.`)

  if (!Number.isInteger(green) || green < 0 || green > 255)
    throw new TypeError(`Invalid green value "${green}" on 'rgbToColor' function.`)

  if (!Number.isInteger(blue) || blue < 0 || blue > 255)
    throw new TypeError(`Invalid blue value "${blue}" on 'rgbToColor' function.`)
  
  return (red<<16) + (green<<8) + (blue)
}


module.exports = rgbToColor