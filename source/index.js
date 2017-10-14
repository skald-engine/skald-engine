const skald = require('sk')

module.exports.sk = skald
module.exports.skald = skald

if (window) {
  window.sk = skald
  window.skald = skald
}