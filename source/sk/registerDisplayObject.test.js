describe('sk/registerDisplayObjects.js', () => {
  let displayObjects = null
  let module = null

  beforeEach(() => {
    displayObjects = []
    mock({'sk/$': {displayObjects}})
    module = require('./registerDisplayObject.js')
  })

  afterEach(() => {
    unmock()
    displayObjects = null
    module = null
  })

  it('should register a new display objet', () => {
    let target = sinon.spy()
    module.registerDisplayObject('unique_name', target)

    assert.equal(displayObjects['unique_name'], target)
  })

  it('should throw an error if registereing an existing object', () => {
    module.registerDisplayObject('unique_name', sinon.spy())

    let f = () => { module.registerDisplayObject('unique_name', sinon.spy()) }
    assert.throws(f)
  })
})