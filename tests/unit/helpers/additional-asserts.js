module.exports = (chai, util) => {
  let Assertion = chai.Assertion
  let assert = chai.assert
  
  assert.notCloseTo = (act, exp, delta, msg) => {
    new Assertion(act, msg, assert.notCloseTo, true).to.not.be.closeTo(exp, delta)
  }
}
