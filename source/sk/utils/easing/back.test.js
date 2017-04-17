describe('sk/sk/utils/easing/back.js', () => {

  describe('getBackIn', () => {
    let getBackIn = require('./back.js').getBackIn

    it('should create the correct function', () => {
      let f = getBackIn(1)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.notCloseTo(f(0.5), 0.5, 0.1) // back in/out have a large curve

      f = getBackIn(10)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.notCloseTo(f(0.5), 0.5, 0.1) // back in/out have a large curve
    })
  })

  describe('getBackOut', () => {
    let getBackOut = require('./back.js').getBackOut

    it('should create the correct function', () => {
      let f = getBackOut(1)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.notCloseTo(f(0.5), 0.5, 0.1) // back in/out have a large curve

      f = getBackOut(10)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.notCloseTo(f(0.5), 0.5, 0.1) // back in/out have a large curve
    })
  })

  describe('getBackInOut', () => {
    let getBackInOut = require('./back.js').getBackInOut

    it('should create the correct function', () => {
      let f = getBackInOut(1)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.closeTo(f(0.5), 0.5, 0.01)

      f = getBackInOut(10)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.closeTo(f(0.5), 0.5, 0.01)
    })
  })

  describe('backIn', () => {
    let backIn = require('./back.js').backIn

    it('should return correct values', () => {
      assert.closeTo(backIn(0), 0, 0.001)
      assert.closeTo(backIn(1), 1, 0.001)
      assert.notCloseTo(backIn(0.5), 0.5, 0.1)
    })
  })

  describe('backOut', () => {
    let backOut = require('./back.js').backOut

    it('should return correct values', () => {
      assert.closeTo(backOut(0), 0, 0.001)
      assert.closeTo(backOut(1), 1, 0.001)
      assert.notCloseTo(backOut(0.5), 0.5, 0.1)
    })
  })

  describe('backInOut', () => {
    let backInOut = require('./back.js').backInOut

    it('should return correct values', () => {
      assert.closeTo(backInOut(0), 0, 0.001)
      assert.closeTo(backInOut(1), 1, 0.001)
      assert.closeTo(backInOut(0.5), 0.5, 0.01)
    })
  })

})