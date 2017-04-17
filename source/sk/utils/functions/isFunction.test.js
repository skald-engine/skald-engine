describe('sk/utils/functions/isFunction.js', () => {
  let isFunction = require('./isFunction.js').default

  it('verify correctly functions', () => {
    let f1 = () => {}
    let f2 = function name(param) { return param }

    assert.isTrue(isFunction(f1))
    assert.isTrue(isFunction(f2))
    assert.isFalse(isFunction(3))
    assert.isFalse(isFunction('=)'))
  })
})