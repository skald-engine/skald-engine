describe('sk/registerLoggerFormatter.js', () => {
  let loggerFormatters = null
  let module = null

  beforeEach(() => {
    loggerFormatters = []
    mock({'sk/$': {loggerFormatters}})
    module = require('./registerLoggerFormatter.js')
  })

  afterEach(() => {
    unmock()
    loggerFormatters = null
    module = null
  })

  it('should register a new display objet', () => {
    let target = sinon.spy()
    module.registerLoggerFormatter('unique_name', target)

    assert.equal(loggerFormatters['unique_name'], target)
  })

  it('should throw an error if registereing an existing object', () => {
    module.registerLoggerFormatter('unique_name', sinon.spy())

    let f = () => { module.registerLoggerFormatter('unique_name', sinon.spy()) }
    assert.throws(f)
  })
})