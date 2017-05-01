describe('sk/utils/lerp.js', () => {
  let lerp = require('./lerp.js').default

  it('verify correctly functions', () => {
    assert.closeTo(lerp(0, 1, 0.1), 0.1, 0.001)
    assert.closeTo(lerp(10, 20, 0.2), 12, 0.001)
    assert.closeTo(lerp(-10, 10, 0.5), 0, 0.001)
    assert.closeTo(lerp(-10, 10, 0.1), -8, 0.001)
    assert.closeTo(lerp(10, 0, 0.9), 1, 0.001)
  })
})