describe('sk/utils/functions/deepCopy.js', () => {
  let deepCopy = require('./deepCopy.js').default

  it('should copy', () => {
    let source = {
      a: 1,
      b: {c: 2},
      d: [5, 6]
    }
    let result = deepCopy(source)

    assert.notStrictEqual(source, result)
    assert.deepEqual(source, result)
  })
})