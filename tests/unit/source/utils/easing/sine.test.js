describe('utils/easing/sine.js', () => {

  describe('sk.utils.easing.sineIn', () => {
    let sineIn = sourceRequire('utils/easing/sine.js').sineIn

    it('should return correct values', () => {
      assert.closeTo(sineIn(0), 0, 0.001)
      assert.closeTo(sineIn(1), 1, 0.001)
      assert.notCloseTo(sineIn(0.5), 0.5, 0.01)
    })
  })

  describe('sk.utils.easing.sineOut', () => {
    let sineOut = sourceRequire('utils/easing/sine.js').sineOut

    it('should return correct values', () => {
      assert.closeTo(sineOut(0), 0, 0.001)
      assert.closeTo(sineOut(1), 1, 0.001)
      assert.notCloseTo(sineOut(0.5), 0.5, 0.01)
    })
  })

  describe('sk.utils.easing.sineInOut', () => {
    let sineInOut = sourceRequire('utils/easing/sine.js').sineInOut

    it('should return correct values', () => {
      assert.closeTo(sineInOut(0), 0, 0.001)
      assert.closeTo(sineInOut(1), 1, 0.001)
      assert.closeTo(sineInOut(0.5), 0.5, 0.01)
    })
  })

})