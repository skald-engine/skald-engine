describe('utils/functions/validateJson.js', () => {
  let deepMerge, dependencies, validateJson

  beforeEach(() => {
    mockery.enable({
      warnOnReplace      : false,
      warnOnUnregistered : false,
      useCleanCache      : true
    })
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  it('should copy default values', () => {
    deepMerge = sinon.stub()

    mockery.registerMock('utils/functions/deepMerge', deepMerge)
    mockery.registerMock('dependencies', dependencies)
    validateJson = require('utils/functions/validateJson').default

    let json = {sample:'value'}
    let defaults = {sample:'replaced', other:'value'}
    let expected = {sample:'value', other:'value'}

    deepMerge.onFirstCall().returns(expected)
    let result = validateJson(json, defaults)

    assert.deepEqual(result, expected)
  })

  it('should validate schema', () => {
    deepMerge = sinon.stub()
    dependencies = sinon.stub()
    let validate = sinon.stub()

    mockery.registerMock('utils/functions/deepMerge', deepMerge)
    mockery.registerMock('dependencies', dependencies)
    validateJson = require('utils/functions/validateJson').default

    let json = {sample:'value'}
    let defaults = {sample:'replaced', other:'value'}
    let schema = {type: 'object'}
    let expected = {sample:'value', other:'value'}

    deepMerge.onFirstCall().returns(expected)
    dependencies.onFirstCall().returns(validate)
    validate.onFirstCall().returns(true)
    let result = validateJson(json, defaults, schema)

    assert.deepEqual(result, expected)
  })

  it('should return error on validation schema', () => {
    deepMerge = sinon.stub()
    dependencies = sinon.stub()
    let validate = sinon.stub()

    mockery.registerMock('utils/functions/deepMerge', deepMerge)
    mockery.registerMock('dependencies', dependencies)
    validateJson = require('utils/functions/validateJson').default

    let json = {sample:'value'}
    let defaults = {sample:'replaced', other:'value'}
    let schema = {type: 'object'}
    let expected = {sample:'value', other:'value'}

    deepMerge.onFirstCall().returns(expected)
    dependencies.onFirstCall().returns(validate)
    validate.onFirstCall().returns(false)
    let fn = () => { validateJson(json, defaults, schema) }

    assert.throws(validateJson)
  })
})