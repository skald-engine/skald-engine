/**
 * Adds the level and timestamp to the message.
 *
 * @param {String} message - The message string.
 * @param {LOGGER_LEVEL} level - The logger level.
 * @return {String} The same string of the input.
 */
export default function detailedFormatter(message, level) {
  let d = new Date()
  let hours   = pad(d.getHours(), 2)
  let minutes = pad(d.getMinutes(), 2)
  let seconds = pad(d.getSeconds(), 2)
  let milliseconds = pad(d.getMilliseconds(), 3)

  let time = `${hours}:${minutes}:${seconds}:${milliseconds}`

  return `[${time}|${level.toUpperCase()}] ${message}`
}

function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length-size);
}