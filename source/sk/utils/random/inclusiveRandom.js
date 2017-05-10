describe('sk/utils/random/inclusiveRandom.js', () => {
  let inclusiveRandom = require('./inclusiveRandom.js').default

  it('should generate a random number between 0 and 1, both inclusive', () => {
    for (let i=0; i<5000; i++) {
      let number = inclusiveRandom()
      assert.isTrue(number >= 0, `Error "${number}" should be greater or equal to 0.`)
      assert.isTrue(number <= 1, `Error "${number}" should be lesser or equal to 1.`)
    }
  })
})