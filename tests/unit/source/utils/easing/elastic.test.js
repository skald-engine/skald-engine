describe('utils/easing/elastic.js', () => {

  describe('sk.utils.easing.getElasticIn', () => {
    let getElasticIn = sourceRequire('utils/easing/elastic.js').getElasticIn

    it('should create the correct function', () => {
      let f = getElasticIn(1, 1)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.notCloseTo(f(0.5), 0.5, 0.1) // elastic in/out have a large curve

      f = getElasticIn(10, 5)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.notCloseTo(f(0.5), 0.5, 0.1) // elastic in/out have a large curve
    })
  })

  describe('sk.utils.easing.getElasticOut', () => {
    let getElasticOut = sourceRequire('utils/easing/elastic.js').getElasticOut

    it('should create the correct function', () => {
      let f = getElasticOut(1, 1)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.notCloseTo(f(0.5), 0.5, 0.1) // elastic in/out have a large curve

      f = getElasticOut(10, 5)
      assert.closeTo(f(0), 0, 0.001)
      assert.closeTo(f(1), 1, 0.001)
      assert.notCloseTo(f(0.5), 0.5, 0.1) // elastic in/out have a large curve
    })
  })

  describe('sk.utils.easing.getElasticInOut', () => {
    let getElasticInOut = sourceRequire('utils/easing/elastic.js').getElasticInOut

    it('should create the correct function', () => {
      let f = getElasticInOut(1, 1)
      assert.closeTo(f(0), 0, 0.01)
      assert.closeTo(f(1), 1, 0.01)
      assert.closeTo(f(0.5), 0.5, 0.01)

      f = getElasticInOut(10, 5)
      assert.closeTo(f(0), 0, 0.01)
      assert.closeTo(f(1), 1, 0.01)
      assert.closeTo(f(0.5), 0.5, 0.01)
    })
  })

  describe('sk.utils.easing.elasticIn', () => {
    let elasticIn = sourceRequire('utils/easing/elastic.js').elasticIn

    it('should return correct values', () => {
      assert.closeTo(elasticIn(0), 0, 0.001)
      assert.closeTo(elasticIn(1), 1, 0.001)
      assert.notCloseTo(elasticIn(0.5), 0.5, 0.1)
    })
  })

  describe('sk.utils.easing.elasticOut', () => {
    let elasticOut = sourceRequire('utils/easing/elastic.js').elasticOut

    it('should return correct values', () => {
      assert.closeTo(elasticOut(0), 0, 0.001)
      assert.closeTo(elasticOut(1), 1, 0.001)
      assert.notCloseTo(elasticOut(0.5), 0.5, 0.1)
    })
  })

  describe('sk.utils.easing.elasticInOut', () => {
    let elasticInOut = sourceRequire('utils/easing/elastic.js').elasticInOut

    it('should return correct values', () => {
      assert.closeTo(elasticInOut(0), 0, 0.01)
      assert.closeTo(elasticInOut(1), 1, 0.01)
      assert.closeTo(elasticInOut(0.5), 0.5, 0.01)
    })
  })

})