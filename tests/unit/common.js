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
global.window = {}
global.document = {}
global.navigator = {userAgent: ''}

global.testRequire = function(name) {
  return require(__dirname + '/' + name)
}
global.sourceRequire = function(name) {
  return require(__dirname + '/../../source/' + name)
}
global.rootRequire = function(name) {
  return require(__dirname + '/../../' + name)
}

// Add source to node path so we can import packages in the library
process.env.NODE_PATH = __dirname + '/../../source/';
require('module').Module._initPaths();