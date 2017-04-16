describe('globals_/entities.js', () => {
  beforeEach(() => {
    startMockery()
  })

  afterEach(() => {
    stopMockery()
  })

  it('should register a new entity', () => {
    // Mock libraries
    let module = _simpleRequire(null, {'displaySample':sinon.spy()})
    let list = module._entities
    let register = module.entity

    // Clear the entity list
    for (let k in list) delete list[k]

    // Start test
    register({
      name    : 'the_entity',
      display : 'displaySample'
    })

    assert.isDefined(list['the_entity'])
  })

  it('should throw an error if registering an existing entity', () => {
    // Mock libraries
    let module = _simpleRequire(null, {'displaySample':sinon.spy()})
    let list = module._entities
    let register = module.entity

    // Clear the entity list
    for (let k in list) delete list[k]

    // Start test
    let spec = {
      name    : 'the_entity',
      display : 'displaySample'
    }
    register(spec)

    let f = () => { register(spec) }

    assert.throws(f)
  })
})


function _simpleRequire(components, displayObjects) {
  // Mock libraries
  let componentList = components || []
  let displayObjectsList = displayObjects || []
  let Entity = sinon.spy()

  mockery.registerMock('globals_/components', componentList)
  mockery.registerMock('globals_/displayObjects', displayObjectsList)
  mockery.registerMock('core/Entity', Entity)
  return sourceRequire('globals_/entities.js')
}