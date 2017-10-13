const chai = require('chai')

// Global elements
global.assert = chai.assert

global.sourceRequire = (path) => {
  return require(`${__dirname}/../../source/${path}`)
}