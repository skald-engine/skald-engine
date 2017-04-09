describe('utils/functions/isFunction.js', () => {
  let isFunction = sourceRequire('utils/functions/isFunction.js').default

  describe('sk.utils.isFunction', () => {
    it('verify correctly functions', () => {
      let f1 = () => {}
      let f2 = function name(param) { return param }

      assert.isTrue(isFunction(f1))
      assert.isTrue(isFunction(f2))
      assert.isFalse(isFunction(3))
      assert.isFalse(isFunction('=)'))
    })
  })
})