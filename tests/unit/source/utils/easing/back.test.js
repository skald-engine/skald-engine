describe('utils/easing/back.js', () => {

  describe('sk.utils.easing.getBackIn', () => {
    let getBackIn = sourceRequire('utils/easing/back.js').getBackIn

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

  describe('sk.utils.easing.getBackOut', () => {
    let getBackOut = sourceRequire('utils/easing/back.js').getBackOut

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

  describe('sk.utils.easing.getBackInOut', () => {
    let getBackInOut = sourceRequire('utils/easing/back.js').getBackInOut

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

  describe('sk.utils.easing.backIn', () => {
    let backIn = sourceRequire('utils/easing/back.js').backIn

    it('should return correct values', () => {
      assert.closeTo(backIn(0), 0, 0.001)
      assert.closeTo(backIn(1), 1, 0.001)
      assert.notCloseTo(backIn(0.5), 0.5, 0.1)
    })
  })

  describe('sk.utils.easing.backOut', () => {
    let backOut = sourceRequire('utils/easing/back.js').backOut

    it('should return correct values', () => {
      assert.closeTo(backOut(0), 0, 0.001)
      assert.closeTo(backOut(1), 1, 0.001)
      assert.notCloseTo(backOut(0.5), 0.5, 0.1)
    })
  })

  describe('sk.utils.easing.backInOut', () => {
    let backInOut = sourceRequire('utils/easing/back.js').backInOut

    it('should return correct values', () => {
      assert.closeTo(backInOut(0), 0, 0.001)
      assert.closeTo(backInOut(1), 1, 0.001)
      assert.closeTo(backInOut(0.5), 0.5, 0.01)
    })
  })

})