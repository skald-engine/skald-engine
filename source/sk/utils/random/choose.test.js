describe('sk/utils/random/choose.js', () => {
  let choose = require('./choose.js').default

  it('should choose random values from an array', () => {
    let results = {a:0, b:0, c:0}
    let array = ['a', 'b', 'c']

    for (let i=0; i<5000; i++) {
      let c = choose(array)

      assert.property(results, c)
      results[c] += 1
    }

    // the chance of this test fail is (2/3)**5000 (about 3.49e-881), which is 
    // the chance of `choose` function, working correctly and with equiprobable
    // selection, to don't choose one of the 3 possible values in 5000 trials.
    assert.isTrue(results.a > 0)
    assert.isTrue(results.b > 0)
    assert.isTrue(results.c > 0)
  })

  it('should choose random values from an string', () => {
    let results = {a:0, b:0, c:0}
    let string = 'abc'

    for (let i=0; i<5000; i++) {
      let c = choose(string)

      assert.property(results, c)
      results[c] += 1
    }

    // same probability as above
    assert.isTrue(results.a > 0)
    assert.isTrue(results.b > 0)
    assert.isTrue(results.c > 0)
  })

  it('should throws an error if the provided value is not an array', () => {
    assert.throw(_ => choose(2))
    assert.throw(_ => choose({2:3}))
  })
})