var chai = require('chai')
var sinon = require('sinon-chai')
var should = chai.should()
var expect = chai.expect
var assert = chai.assert

// configure chai
chai.use(sinon)

// global configuration
global.should = should
global.expect = expect
global.assert = assert
global.testRequire = function(name) {
  return require(__dirname + '/' + name)
}
global.sourceRequire = function(name) {
  return require(__dirname + '/../../source/' + name)
}