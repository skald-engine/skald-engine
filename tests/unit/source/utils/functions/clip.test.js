describe('utils/functions/clip.js', () => {
  let clip = sourceRequire('utils/functions/clip.js').default

  describe('sk.utils.clip', () => {
    it('should clip the value', () => {
      assert.equal(clip(0, -5, 5), 0)
      assert.equal(clip(-6, -5, 5), -5)
      assert.equal(clip(6, -5, 5), 5)

      assert.equal(clip(0, 5, 10), 5)
      assert.equal(clip(5, 5, 10), 5)
      assert.equal(clip(10, 5, 10), 10)
    })
  })
})