describe('utils/easing/linear.js', () => {

  describe('sk.utils.easing.linear', () => {
    let linear = sourceRequire('utils/easing/linear.js').linear

    it('should return correct values', () => {
      assert.equal(linear(0), 0)
      assert.equal(linear(.25), .25)
      assert.equal(linear(.5), .5)
      assert.equal(linear(.75), .75)
      assert.equal(linear(1), 1)
    })
  })

})