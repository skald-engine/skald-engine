describe('sk/utils/functions/deepMerge.js', () => {
  let deepMerge = require('./deepMerge.js').default

  it('should copy', () => {
    let sourceA = {
      a: 1,
      b: {c: 2},
      d: [5, 6]
    }
    let sourceB = {
      e: 9,
      b: {c: 3, d: 4},
      d: [1]
    }
    let expected = {
      a: 1,
      e: 9,
      b: {c: 3, d: 4},
      d: [5, 6, 1]
    }
    
    let result = deepMerge(sourceA, sourceB)
    assert.deepEqual(expected, result)
  })
})