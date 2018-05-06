/**
 * Adds the level and timestamp to the logging message. Format example:
 *
 *     [12:20:45:002|DEBUG] This is a logging message
 *
 * @param {String} message - The message string.
 * @param {LOGGER_LEVELS} level - The logger level.
 * @return {String} The formatted string.
 */
function detailedFormatter(message, level) {
  let d = new Date()
  let hours   = _pad(d.getHours(), 2)
  let minutes = _pad(d.getMinutes(), 2)
  let seconds = _pad(d.getSeconds(), 2)
  let milliseconds = _pad(d.getMilliseconds(), 3)

  let time = `${hours}:${minutes}:${seconds}:${milliseconds}`

  return `[${time}|${level.toUpperCase()}] ${message}`
}

// Format the number to a fixed number of digits
function _pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
}

module.exports = detailedFormatter