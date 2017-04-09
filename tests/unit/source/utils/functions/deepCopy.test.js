describe('utils/functions/deepCopy.js', () => {
  let deepCopy = sourceRequire('utils/functions/deepCopy.js').default

  describe('sk.utils.deepCopy', () => {
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
})