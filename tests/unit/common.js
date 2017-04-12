require('./helpers/polyfills')

var chai = require('chai')
var chaiSinon = require('sinon-chai')
var sinon = require('sinon')
var mockery = require('mockery')
var additionalAsserts = require('./helpers/additional-asserts')

var should = chai.should()
var expect = chai.expect
var assert = chai.assert

// Configure chai
chai.use(chaiSinon)
chai.use(additionalAsserts)

// Global configuration
global.should = should
global.expect = expect
global.assert = assert
global.sinon = sinon
global.mockery = mockery

global.testRequire = function(name) {
  return require(__dirname + '/' + name)
}
global.sourceRequire = function(name) {
  return require(__dirname + '/../../source/' + name)
}
global.rootRequire = function(name) {
  return require(__dirname + '/../../' + name)
}
global.startMockery = () => {
  mockery.enable({
    warnOnReplace      : false,
    warnOnUnregistered : false,
    useCleanCache      : true
  })
}
global.stopMockery = () => {
  mockery.deregisterAll()
  mockery.disable()
}
global.resetGlobals = () => {
  global.window = {}
  global.document = {}
  global.navigator = {userAgent: ''}
  global.PIXI = {}
}

// Add source to node path so we can import packages in the library
process.env.NODE_PATH = __dirname + '/../../source/'
require('module').Module._initPaths()

// Setup global variables
resetGlobals()