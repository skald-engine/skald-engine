describe('sk/utils/functions/validateJson.js', () => {
  let deepMerge, validateJson

  beforeEach(() => {
    startMockery()
  })

  afterEach(() => {
    stopMockery()
    resetGlobals()
  })

  it('should copy default values', () => {
    deepMerge = sinon.stub()
    mockery.registerMock('utils/functions/deepMerge', deepMerge)
    validateJson = require('./validateJson').default

    let json = {sample:'value'}
    let defaults = {sample:'replaced', other:'value'}
    let expected = {sample:'value', other:'value'}

    deepMerge.onFirstCall().returns(expected)
    let result = validateJson(json, defaults)

    assert.deepEqual(result, expected)
  })

  it('should validate schema', () => {
    deepMerge = sinon.stub()
    global.jsen = sinon.stub()
    let validate = sinon.stub()

    mockery.registerMock('utils/functions/deepMerge', deepMerge)
    validateJson = require('./validateJson').default

    let json = {sample:'value'}
    let defaults = {sample:'replaced', other:'value'}
    let schema = {type: 'object'}
    let expected = {sample:'value', other:'value'}

    deepMerge.onFirstCall().returns(expected)
    jsen.onFirstCall().returns(validate)
    validate.onFirstCall().returns(true)
    let result = validateJson(json, defaults, schema)

    assert.deepEqual(result, expected)
  })

  it('should return error on validation schema', () => {
    deepMerge = sinon.stub()
    global.jsen = sinon.stub()
    let validate = sinon.stub()

    mockery.registerMock('utils/functions/deepMerge', deepMerge)
    validateJson = require('./validateJson').default

    let json = {sample:'value'}
    let defaults = {sample:'replaced', other:'value'}
    let schema = {type: 'object'}
    let expected = {sample:'value', other:'value'}

    deepMerge.onFirstCall().returns(expected)
    jsen.onFirstCall().returns(validate)
    validate.onFirstCall().returns(false)
    let fn = () => { validateJson(json, defaults, schema) }

    assert.throws(validateJson)
  })
})