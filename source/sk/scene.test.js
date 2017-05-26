const _makeFixtures = () => {
  return {
    Scene : class {},
    $      : {setClassId: sinon.stub()},
    utils  : {} 
  }
}

const _require = (fixtures) => {
  mock({
    'sk/$': fixtures.$,
    'sk/utils': fixtures.utils,
    'sk/core/Scene': fixtures.Scene
  })
  return require('./scene.js').scene
}

describe('sk/scene.js', () => {
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
    fixtures.utils.isFunction = f => f === fixtures.fn
    fixtures.utils.createClass = () => {}
    module = _require(fixtures)

    // setup test
    let specs = [
      // invalid parameters
      null,
      '=)',

      // invalid shortcuts
      {initialize: 'non function'},
      {enter: 'non function'},
      {start: 'non function'},
      {pause: 'non function'},
      {resume: 'non function'},
      {update: 'non function'},
      {stop: 'non function'},
      {leave: 'non function'},
      {destroy: 'non function'},

      // invalid data
      {data: 'non object'},
      {data: {invalidBecauseFunction: fixtures.fn}},

      // invalid methods
      {methods: 'non object'},
      {methods: {invalid: 'non function'}},

      // using registered keywords or duplicated variable names
      {data: {b: ''}, methods: {b: fixtures.fn}}
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
      enter       : () => {},
      start       : () => {},
      pause       : () => {},
      resume      : () => {},
      update      : () => {},
      stop        : () => {},
      leave       : () => {},
      destroy     : () => {},
      data        : {first: 1, second: 'value'},
      methods     : {third: () => {}}
    }
    fx.createClass.returns(fx.class_)

    // setup mock
    fixtures.fn = () => {} 
    fixtures.utils.isFunction = f => (f===1||f==='value'?false:true)
    fixtures.utils.createClass = fx.createClass
    module = _require(fixtures)

    // setup test
    let spec = {
      name        : 'sample',
      initialize  : fx.initialize,
      enter       : fx.enter,
      start       : fx.start,
      pause       : fx.pause,
      resume      : fx.resume,
      update      : fx.update,
      stop        : fx.stop,
      leave       : fx.leave,
      destroy     : fx.destroy,
      data: {
        first: fx.data.first,
        second: fx.data.second,
      },
      methods: {
        third: fx.methods.third
      }
    }

    // test
    let scene = module(spec)
    let args = fx.createClass.getCall(0).args

    assert.equal(scene, fx.class_)
    assert.isTrue(fx.createClass.calledOnce)

    assert.equal(args[0], fixtures.Scene)
    assert.deepEqual(args[1], {
      _$data        : spec.data,
      _$methods     : spec.methods,
      _$attributes  : Object.keys(spec.data),
    })
    assert.deepEqual(args[2], {
      _$data        : spec.data,
      _$methods     : spec.methods,
      _$attributes  : Object.keys(spec.data),
      initialize    : spec.initialize,
      enter         : spec.enter,
      start         : spec.start,
      pause         : spec.pause,
      resume        : spec.resume,
      update        : spec.update,
      stop          : spec.stop,
      leave         : spec.leave,
      destroy       : spec.destroy,
      first         : spec.data.first,
      second        : spec.data.second,
      third         : spec.methods.third,
    })
  })
})