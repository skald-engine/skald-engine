describe('globals_/displayObjects.js', () => {
  let module = sourceRequire('globals_/displayObjects.js')
  let list = module._displayObjects
  let register = module.displayObject

  beforeEach(() => {
    // Clear the display object list
    for (let k in list) delete list[k]
  })

  it('should register a new display objet', () => {
    let target = sinon.spy()

    register('unique_name', target)

    assert.equal(list['unique_name'], target)
  })

  it('should throw an error if registereing an existing object', () => {
    let target = sinon.spy()

    register('unique_name', target)

    let f = () => { register('unique_name', target) }
    assert.throws(f)
  })
})