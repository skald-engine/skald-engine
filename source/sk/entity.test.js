const _makeFixtures = () => {
  return {
    Entity : class {},
    $      : {},
    utils  : {} 
  }
}

const _require = (fixtures) => {
  mock({
    'sk/$': fixtures.$,
    'sk/utils': fixtures.utils,
    'sk/core/Entity': fixtures.Entity
  })
  return require('./entity.js').entity
}

describe('sk/entity.js', () => {
  let fixtures = null
  let module = null

  beforeEach(() => {
    fixtures = _makeFixtures()
  })

  afterEach(() => {
    unmock()
  })

  it('should reject declaration with invalid data', () => {
    // setup mock
    fixtures.fn = () => {} 
    fixtures.$.displayObjects = {'sampleDisplay': sinon.spy()}
    fixtures.$.entities = {'sampleEntity': sinon.spy()}
    fixtures.$.components = {'sampleComponent': sinon.spy()}
    fixtures.utils.isFunction = f => f === fixtures.fn
    fixtures.utils.createClass = () => {}
    module = _require(fixtures)

    // setup test
    let specs = [
      // invalid parameters
      null,
      '=)',

      // invalid name
      {},

      // invalid display
      {name: 'sampleEntity', display: 'nonExistent'},

      // duplicated name
      {name: 'sampleEntity', display: 'sampleDisplay'},

      // invalid component
      {name: 'a', display: 'sampleDisplay', components: ['nonExistent']},

      // invalid shortcuts
      {name: 'a', display: 'sampleDisplay', initialize: 'non function'},
      {name: 'a', display: 'sampleDisplay', destroy: 'non function'},

      // invalid data
      {name: 'a', display: 'sampleDisplay', data: 'non object'},
      {name: 'a', display: 'sampleDisplay', data: {invalidBecauseFunction: fixtures.fn}},

      // invalid methods
      {name: 'a', display: 'sampleDisplay', methods: 'non object'},
      {name: 'a', display: 'sampleDisplay', methods: {invalid: 'non function'}},

      // using registered keywords or duplicated variable names
      {name: 'a', display: 'sampleDisplay', data: {name: ''}},
      {name: 'a', display: 'sampleDisplay', methods: {name: fixtures.fn}},
      {name: 'a', display: 'sampleDisplay', data: {b: ''}, methods: {b: fixtures.fn}}
    ]

    // test
    for (let i=0; i<specs.length; i++) {
      let spec = specs[i]
      let data = JSON.stringify(spec)
      let fn = () => { module(spec) }
      assert.throws(fn, null, null, `Did not throw given data ${data}`)
    }
  })

  it('should create a component correctly', () => {
    // fixtures
    let fx = {
      class_      : sinon.spy(),
      createClass : sinon.stub(),
      initialize  : () => {},
      destroy     : () => {},
      data        : {first: 1, second: 'value'},
      methods     : {third: () => {}}
    }
    fx.createClass.returns(fx.class_)

    // setup mock
    fixtures.fn = () => {} 
    fixtures.$.displayObjects = {'sampleDisplay': sinon.spy()}
    fixtures.$.entities = {}
    fixtures.$.components = {'sampleComponent': sinon.spy()}
    fixtures.utils.isFunction = f => (f===1||f==='value'?false:true)
    fixtures.utils.createClass = fx.createClass
    module = _require(fixtures)

    // setup test
    let spec = {
      name: 'sample',
      display: 'sampleDisplay',
      components: ['sampleComponent'],
      initialize: fx.initialize,
      destroy: fx.destroy,
      data: {
        first: fx.data.first,
        second: fx.data.second,
      },
      methods: {
        third: fx.methods.third
      }
    }

    // test
    module(spec)
    let component = fixtures.$.entities.sample
    let args = fx.createClass.getCall(0).args

    assert.equal(component, fx.class_)
    assert.isTrue(fx.createClass.calledOnce)

    assert.equal(args[0], fixtures.Entity)
    assert.deepEqual(args[1], {
      _$data       : spec.data,
      _$methods    : spec.methods,
      _$attributes : Object.keys(spec.data),
      _$components : fixtures.$.components,
      _$display    : fixtures.$.displayObjects.sampleDisplay,
      _$type       : 'sampleDisplay'
    })
    assert.deepEqual(args[2], {
      _$name       : spec.name,
      _$data       : spec.data,
      _$methods    : spec.methods,
      _$components : fixtures.$.components,
      _$display    : fixtures.$.displayObjects.sampleDisplay,
      _$attributes : Object.keys(spec.data),
      _$type       : 'sampleDisplay',
      initialize   : spec.initialize,
      destroy      : spec.destroy,
      first        : spec.data.first,
      second       : spec.data.second,
      third        : spec.methods.third
    })
  })
})