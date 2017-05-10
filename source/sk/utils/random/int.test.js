describe('sk/utils/random/int.js', () => {
  let int = require('./int.js').default

  it('should generate a random with only N', () => {
    for (let i=0; i<5000; i++) {
      let number = int(10)
      assert.isTrue(number >= 0, `Error "${number}" should be greater or equal to zero.`)
      assert.isTrue(number < 10, `Error "${number}" should be lesser than 10.`)

      number = int(55)
      assert.isTrue(number >= 0, `Error "${number}" should be greater or equal to zero.`)
      assert.isTrue(number < 55, `Error "${number}" should be lesser than 10.`)
    }
  })

  it('should generate a random with N and M (N<M)', () => {
    for (let i=0; i<5000; i++) {
      let number = int(10, 60)
      assert.isTrue(number >= 10, `Error "${number}" should be greater or equal to 10.`)
      assert.isTrue(number < 60, `Error "${number}" should be lesser than 60.`)

      number = int(-10, 10)
      assert.isTrue(number >= -10, `Error "${number}" should be greater or equal to -10.`)
      assert.isTrue(number < 10, `Error "${number}" should be lesser than 10.`)
    }
  })

  it('should generate a random with N and M (N>M)', () => {
    for (let i=0; i<5000; i++) {
      let number = int(50, 10)
      assert.isTrue(number > 10, `Error "${number}" should be greater than 10.`)
      assert.isTrue(number <= 50, `Error "${number}" should be lesser or equal to 50.`)

      number = int(100, -100)
      assert.isTrue(number > -100, `Error "${number}" should be greater than -100.`)
      assert.isTrue(number <= 100, `Error "${number}" should be lesser or equal to 100.`)
    }
  })

  it('should throw an error if no number is provided', () => {
    assert.throw(() => int())
  })
})