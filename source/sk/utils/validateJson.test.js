describe('sk/utils/validateJson.js', () => {
  let deepMerge, validateJson

  afterEach(() => {
    unmock()
    resetGlobals()
  })

  it('should copy default values', () => {
    // Setup mocking
    deepMerge = sinon.stub()
    mock({'sk/utils/deepMerge': deepMerge})
    validateJson = require('./validateJson').default

    // Setup test
    let json = {sample:'value'}
    let defaults = {sample:'replaced', other:'value'}
    let expected = {sample:'value', other:'value'}

    // Test
    deepMerge.onFirstCall().returns(expected)
    let result = validateJson(json, defaults)

    assert.deepEqual(result, expected)
  })

  it('should validate schema', () => {
    // Setup mocking
    deepMerge = sinon.stub()
    global.jsen = sinon.stub()
    mock({'sk/utils/deepMerge': deepMerge})
    validateJson = require('./validateJson').default

    // Setup test
    let validate = sinon.stub()
    let json = {sample:'value'}
    let defaults = {sample:'replaced', other:'value'}
    let schema = {type: 'object'}
    let expected = {sample:'value', other:'value'}

    // Test
    deepMerge.onFirstCall().returns(expected)
    jsen.onFirstCall().returns(validate)
    validate.onFirstCall().returns(true)
    let result = validateJson(json, defaults, schema)

    assert.deepEqual(result, expected)
  })

  it('should return error on validation schema', () => {
    // Setup mocking
    deepMerge = sinon.stub()
    global.jsen = sinon.stub()
    mock({'sk/utils/deepMerge': deepMerge})
    validateJson = require('./validateJson').default

    // Setup test
    let validate = sinon.stub()
    let json = {sample:'value'}
    let defaults = {sample:'replaced', other:'value'}
    let schema = {type: 'object'}
    let expected = {sample:'value', other:'value'}

    // Test
    deepMerge.onFirstCall().returns(expected)
    jsen.onFirstCall().returns(validate)
    validate.onFirstCall().returns(false)
    let fn = () => { validateJson(json, defaults, schema) }

    assert.throws(validateJson)
  })
})