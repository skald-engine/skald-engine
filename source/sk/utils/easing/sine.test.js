describe('sk/utils/easing/sine.js', () => {

  describe('sineIn', () => {
    let sineIn = require('./sine.js').sineIn

    it('should return correct values', () => {
      assert.closeTo(sineIn(0), 0, 0.001)
      assert.closeTo(sineIn(1), 1, 0.001)
      assert.notCloseTo(sineIn(0.5), 0.5, 0.01)
    })
  })

  describe('sineOut', () => {
    let sineOut = require('./sine.js').sineOut

    it('should return correct values', () => {
      assert.closeTo(sineOut(0), 0, 0.001)
      assert.closeTo(sineOut(1), 1, 0.001)
      assert.notCloseTo(sineOut(0.5), 0.5, 0.01)
    })
  })

  describe('sineInOut', () => {
    let sineInOut = require('./sine.js').sineInOut

    it('should return correct values', () => {
      assert.closeTo(sineInOut(0), 0, 0.001)
      assert.closeTo(sineInOut(1), 1, 0.001)
      assert.closeTo(sineInOut(0.5), 0.5, 0.01)
    })
  })

})