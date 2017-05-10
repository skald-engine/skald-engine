describe('sk/utils/random/polar.js', () => {
  it('should generate a random polar number in the upper limit', () => {
    mock({'sk/utils/random/inclusiveRandom': _ => 1})
    let polar = require('./polar.js').default
    assert.equal(polar(), 1)
    unmock()
  })

  it('should generate a random polar number in the lower limit', () => {
    mock({'sk/utils/random/inclusiveRandom': _ => 0})
    let polar = require('./polar.js').default
    assert.equal(polar(), -1)
    unmock()
  })

  it('should use the multiplier', () => {
    {
      mock({'sk/utils/random/inclusiveRandom': _ => 0})
      let polar = require('./polar.js').default
      assert.equal(polar(50), -50)
      unmock()
    }

    {
      mock({'sk/utils/random/inclusiveRandom': _ => 1})
      let polar = require('./polar.js').default
      assert.equal(polar(50), 50)
      unmock()
    }

    {
      mock({'sk/utils/random/inclusiveRandom': _ => .5})
      let polar = require('./polar.js').default
      assert.equal(polar(50), 0)
      unmock()
    }
  })
})