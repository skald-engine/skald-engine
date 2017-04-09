describe('utils/easing/circ.js', () => {

  describe('sk.utils.easing.circIn', () => {
    let circIn = sourceRequire('utils/easing/circ.js').circIn

    it('should return correct values', () => {
      assert.closeTo(circIn(0), 0, 0.001)
      assert.closeTo(circIn(1), 1, 0.001)
      assert.notCloseTo(circIn(0.5), 0.5, 0.1)
    })
  })

  describe('sk.utils.easing.circOut', () => {
    let circOut = sourceRequire('utils/easing/circ.js').circOut

    it('should return correct values', () => {
      assert.closeTo(circOut(0), 0, 0.001)
      assert.closeTo(circOut(1), 1, 0.001)
      assert.notCloseTo(circOut(0.5), 0.5, 0.1)
    })
  })

  describe('sk.utils.easing.circInOut', () => {
    let circInOut = sourceRequire('utils/easing/circ.js').circInOut

    it('should return correct values', () => {
      assert.closeTo(circInOut(0), 0, 0.001)
      assert.closeTo(circInOut(1), 1, 0.001)
      assert.closeTo(circInOut(0.5), 0.5, 0.01)
    })
  })

})