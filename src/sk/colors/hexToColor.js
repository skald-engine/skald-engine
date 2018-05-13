/**
 * Converts a hex color string to the int color. The hex input must be in the 
 * format `#FFFFFF`, starting with the '#' character and folowing with 6 hex 
 * digits. Any value different from that, the function will throw a type error.
 *
 * @param {String} value - The hex value.
 * @return {Number} The color as integer.
 */
function hexToColor(value) {
  if (!/#[0-9a-fA-F]{6}/.test(value))
    throw new TypeError(`Invalid hex value "${value}" on 'hexToColor' function.`)
  
  return parseInt(value.substring(1), 16)
}


module.exports = hexToColor