const _makeFixtures = () => {
  return {
    System : class {},
    $      : {},
    utils  : {} 
  }
}

const _require = (fixtures) => {
  mock({
    'sk/$': fixtures.$,
    'sk/utils': fixtures.utils,
    'sk/core/System': fixtures.System
  })
  return require('./system.js').system
}

describe('sk/system.js', () => {
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
    fixtures.$.systems = {'sampleSystem': sinon.spy()}
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

      // invalid check function
      {name: 'a'},

      // duplicated name
      {name: 'sampleSystem', check: () => {}},

      // invalid shortcuts
      {name: 'a', check: () => {}, initialize: 'non function'},
      {name: 'a', check: () => {}, destroy: 'non function'},
      {name: 'a', check: () => {}, update: 'non function'},

      // invalid data
      {name: 'a', check: () => {}, data: 'non object'},
      {name: 'a', check: () => {}, data: {invalidBecauseFunction: fixtures.fn}},

      // invalid methods
      {name: 'a', check: () => {}, methods: 'non object'},
      {name: 'a', check: () => {}, methods: {invalid: 'non function'}},

      // using registered keywords or duplicated variable names
      {name: 'a', check: () => {}, data: {name: ''}},
      {name: 'a', check: () => {}, methods: {name: fixtures.fn}},
      {name: 'a', check: () => {}, data: {b: ''}, methods: {b: fixtures.fn}}
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
      check       : () => {},
      update      : () => {},
      data        : {first: 1, second: 'value'},
      methods     : {third: () => {}}
    }
    fx.createClass.returns(fx.class_)

    // setup mock
    fixtures.fn = () => {} 
    fixtures.$.systems = {'sampleSystem': sinon.spy()}
    fixtures.utils.isFunction = f => (f===1||f==='value'?false:true)
    fixtures.utils.createClass = fx.createClass
    module = _require(fixtures)

    // setup test
    let spec = {
      name: 'sample',
      access: 'super',
      initialize: fx.initialize,
      destroy: fx.destroy,
      check: fx.check,
      update: fx.update,
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
    let system = fixtures.$.systems.sample
    let args = fx.createClass.getCall(0).args

    assert.equal(system, fx.class_)
    assert.isTrue(fx.createClass.calledOnce)

    assert.equal(args[0], fixtures.System)
    assert.deepEqual(args[1], {
      _$data       : spec.data,
      _$methods    : spec.methods,
      _$attributes : Object.keys(spec.data),
    })
    assert.deepEqual(args[2], {
      _$name       : spec.name,
      _$access     : spec.access,
      _$data       : spec.data,
      _$methods    : spec.methods,
      _$attributes : Object.keys(spec.data),
      initialize   : spec.initialize,
      destroy      : spec.destroy,
      check        : spec.check,
      update       : spec.update,
      first        : spec.data.first,
      second       : spec.data.second,
      third        : spec.methods.third
    })
  })
})