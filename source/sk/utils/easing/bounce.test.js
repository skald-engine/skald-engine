describe('sk/utils/easing/bounce.js', () => {

  describe('bounceIn', () => {
    let bounceIn = require('./bounce.js').bounceIn

    it('should return correct values', () => {
      assert.closeTo(bounceIn(0), 0, 0.001)
      assert.closeTo(bounceIn(1), 1, 0.001)
      assert.notCloseTo(bounceIn(0.5), 0.5, 0.1)
    })
  })

  describe('bounceOut', () => {
    let bounceOut = require('./bounce.js').bounceOut

    it('should return correct values', () => {
      assert.closeTo(bounceOut(0), 0, 0.001)
      assert.closeTo(bounceOut(1), 1, 0.001)
      assert.notCloseTo(bounceOut(0.5), 0.5, 0.1)
    })
  })

  describe('bounceInOut', () => {
    let bounceInOut = require('./bounce.js').bounceInOut

    it('should return correct values', () => {
      assert.closeTo(bounceInOut(0), 0, 0.001)
      assert.closeTo(bounceInOut(1), 1, 0.001)
      assert.closeTo(bounceInOut(0.5), 0.5, 0.01)
    })
  })

})