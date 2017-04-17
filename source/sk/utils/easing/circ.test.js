describe('sk/utils/easing/circ.js', () => {

  describe('circIn', () => {
    let circIn = require('./circ.js').circIn

    it('should return correct values', () => {
      assert.closeTo(circIn(0), 0, 0.001)
      assert.closeTo(circIn(1), 1, 0.001)
      assert.notCloseTo(circIn(0.5), 0.5, 0.1)
    })
  })

  describe('circOut', () => {
    let circOut = require('./circ.js').circOut

    it('should return correct values', () => {
      assert.closeTo(circOut(0), 0, 0.001)
      assert.closeTo(circOut(1), 1, 0.001)
      assert.notCloseTo(circOut(0.5), 0.5, 0.1)
    })
  })

  describe('circInOut', () => {
    let circInOut = require('./circ.js').circInOut

    it('should return correct values', () => {
      assert.closeTo(circInOut(0), 0, 0.001)
      assert.closeTo(circInOut(1), 1, 0.001)
      assert.closeTo(circInOut(0.5), 0.5, 0.01)
    })
  })

})