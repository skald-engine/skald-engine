describe('sk/registerLoggerHandler.js', () => {
  let loggerHandlers = null
  let module = null

  beforeEach(() => {
    loggerHandlers = []
    mock({'sk/$': {loggerHandlers}})
    module = require('./registerLoggerHandler.js')
  })

  afterEach(() => {
    unmock()
    loggerHandlers = null
    module = null
  })

  it('should register a new display objet', () => {
    let target = sinon.spy()
    module.registerLoggerHandler('unique_name', target)

    assert.equal(loggerHandlers['unique_name'], target)
  })

  it('should throw an error if registereing an existing object', () => {
    module.registerLoggerHandler('unique_name', sinon.spy())

    let f = () => { module.registerLoggerHandler('unique_name', sinon.spy()) }
    assert.throws(f)
  })
})