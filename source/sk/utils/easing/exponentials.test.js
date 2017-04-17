describe('sk/utils/easing/exponentials.js', () => {
  let exponentials = require('./exponentials.js')

  describe('getPowIn', () => {
    let getPowIn = exponentials.getPowIn

    it('should create the correct function', () => {
      let f = getPowIn(1) // linear
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(0.25), 0.25, 0.001)
      assert.closeTo(f(0.5), 0.5, 0.001)
      assert.closeTo(f(0.75), 0.75, 0.001)
      assert.closeTo(f(1), 1, 0.001)

      f = getPowIn(10)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.notCloseTo(f(0.5), 0.5, 0.1)
    })
  })

  describe('getPowOut', () => {
    let getPowOut = exponentials.getPowOut

    it('should create the correct function', () => {
      let f = getPowOut(1) // linear
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(0.25), 0.25, 0.001)
      assert.closeTo(f(0.5), 0.5, 0.001)
      assert.closeTo(f(0.75), 0.75, 0.001)
      assert.closeTo(f(1), 1, 0.001)

      f = getPowOut(10)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.notCloseTo(f(0.5), 0.5, 0.1)
    })
  })

  describe('getPowInOut', () => {
    let getPowInOut = exponentials.getPowInOut

    it('should create the correct function', () => {
      let f = getPowInOut(1) // not quite linear
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.closeTo(f(0.5), 0.5, 0.01)

      f = getPowInOut(10)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.closeTo(f(0.5), 0.5, 0.01)
    })
  })

  describe('quadIn', () => {
    let quadIn = exponentials.quadIn

    it('should return correct values', () => {
      assert.closeTo(quadIn(0), 0, 0.001)
      assert.closeTo(quadIn(1), 1, 0.001)
      assert.notCloseTo(quadIn(0.5), 0.5, 0.1)
    })
  })

  describe('quadOut', () => {
    let quadOut = exponentials.quadOut

    it('should return correct values', () => {
      assert.closeTo(quadOut(0), 0, 0.001)
      assert.closeTo(quadOut(1), 1, 0.001)
      assert.notCloseTo(quadOut(0.5), 0.5, 0.1)
    })
  })

  describe('quadInOut', () => {
    let quadInOut = exponentials.quadInOut

    it('should return correct values', () => {
      assert.closeTo(quadInOut(0), 0, 0.01)
      assert.closeTo(quadInOut(1), 1, 0.01)
      assert.closeTo(quadInOut(0.5), 0.5, 0.01)
    })
  })

  describe('cubicIn', () => {
    let cubicIn = exponentials.cubicIn

    it('should return correct values', () => {
      assert.closeTo(cubicIn(0), 0, 0.001)
      assert.closeTo(cubicIn(1), 1, 0.001)
      assert.notCloseTo(cubicIn(0.5), 0.5, 0.1)
    })
  })

  describe('cubicOut', () => {
    let cubicOut = exponentials.cubicOut

    it('should return correct values', () => {
      assert.closeTo(cubicOut(0), 0, 0.001)
      assert.closeTo(cubicOut(1), 1, 0.001)
      assert.notCloseTo(cubicOut(0.5), 0.5, 0.1)
    })
  })

  describe('cubicInOut', () => {
    let cubicInOut = exponentials.cubicInOut

    it('should return correct values', () => {
      assert.closeTo(cubicInOut(0), 0, 0.01)
      assert.closeTo(cubicInOut(1), 1, 0.01)
      assert.closeTo(cubicInOut(0.5), 0.5, 0.01)
    })
  })

  describe('quartIn', () => {
    let quartIn = exponentials.quartIn

    it('should return correct values', () => {
      assert.closeTo(quartIn(0), 0, 0.001)
      assert.closeTo(quartIn(1), 1, 0.001)
      assert.notCloseTo(quartIn(0.5), 0.5, 0.1)
    })
  })

  describe('quartOut', () => {
    let quartOut = exponentials.quartOut

    it('should return correct values', () => {
      assert.closeTo(quartOut(0), 0, 0.001)
      assert.closeTo(quartOut(1), 1, 0.001)
      assert.notCloseTo(quartOut(0.5), 0.5, 0.1)
    })
  })

  describe('quartInOut', () => {
    let quartInOut = exponentials.quartInOut

    it('should return correct values', () => {
      assert.closeTo(quartInOut(0), 0, 0.01)
      assert.closeTo(quartInOut(1), 1, 0.01)
      assert.closeTo(quartInOut(0.5), 0.5, 0.01)
    })
  })

  describe('quintIn', () => {
    let quintIn = exponentials.quintIn

    it('should return correct values', () => {
      assert.closeTo(quintIn(0), 0, 0.001)
      assert.closeTo(quintIn(1), 1, 0.001)
      assert.notCloseTo(quintIn(0.5), 0.5, 0.1)
    })
  })

  describe('quintOut', () => {
    let quintOut = exponentials.quintOut

    it('should return correct values', () => {
      assert.closeTo(quintOut(0), 0, 0.001)
      assert.closeTo(quintOut(1), 1, 0.001)
      assert.notCloseTo(quintOut(0.5), 0.5, 0.1)
    })
  })

  describe('quintInOut', () => {
    let quintInOut = exponentials.quintInOut

    it('should return correct values', () => {
      assert.closeTo(quintInOut(0), 0, 0.01)
      assert.closeTo(quintInOut(1), 1, 0.01)
      assert.closeTo(quintInOut(0.5), 0.5, 0.01)
    })
  })

  describe('expoIn', () => {
    let expoIn = exponentials.expoIn

    it('should return correct values', () => {
      assert.closeTo(expoIn(0), 0, 0.001)
      assert.closeTo(expoIn(1), 1, 0.001)
      assert.notCloseTo(expoIn(0.5), 0.5, 0.1)
    })
  })

  describe('expoOut', () => {
    let expoOut = exponentials.expoOut

    it('should return correct values', () => {
      assert.closeTo(expoOut(0), 0, 0.001)
      assert.closeTo(expoOut(1), 1, 0.001)
      assert.notCloseTo(expoOut(0.5), 0.5, 0.1)
    })
  })

  describe('expoInOut', () => {
    let expoInOut = exponentials.expoInOut

    it('should return correct values', () => {
      assert.closeTo(expoInOut(0), 0, 0.01)
      assert.closeTo(expoInOut(1), 1, 0.01)
      assert.closeTo(expoInOut(0.5), 0.5, 0.01)
    })
  })
})