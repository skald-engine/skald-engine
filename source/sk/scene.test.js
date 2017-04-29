const _makeFixtures = () => {
  return {
    Scene : class {},
    $      : {},
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
    fixtures.$.scenes = {'sampleScene': sinon.spy()}
    fixtures.$.systems = {'sampleSystem': sinon.spy()}
    fixtures.$.eventSheets = {'sampleEventSheet': sinon.spy()}
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

      // duplicated name
      {name: 'sampleScene'},

      // invalid shortcuts
      {name: 'a', initialize: 'non function'},
      {name: 'a', enter: 'non function'},
      {name: 'a', start: 'non function'},
      {name: 'a', pause: 'non function'},
      {name: 'a', resume: 'non function'},
      {name: 'a', update: 'non function'},
      {name: 'a', stop: 'non function'},
      {name: 'a', leave: 'non function'},
      {name: 'a', destroy: 'non function'},

      // invalid references
      {name: 'a', eventSheets: ['non existent']},
      {name: 'a', systems: ['non existent']},

      // invalid data
      {name: 'a', data: 'non object'},
      {name: 'a', data: {invalidBecauseFunction: fixtures.fn}},

      // invalid methods
      {name: 'a', methods: 'non object'},
      {name: 'a', methods: {invalid: 'non function'}},

      // using registered keywords or duplicated variable names
      {name: 'a', data: {name: ''}},
      {name: 'a', methods: {name: fixtures.fn}},
      {name: 'a', data: {b: ''}, methods: {b: fixtures.fn}}
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
    fixtures.$.scenes = {'sampleScene': sinon.spy()}
    fixtures.$.systems = {'sampleSystem': sinon.spy()}
    fixtures.$.eventSheets = {'sampleEventSheet': sinon.spy()}
    fixtures.utils.isFunction = f => (f===1||f==='value'?false:true)
    fixtures.utils.createClass = fx.createClass
    module = _require(fixtures)

    // setup test
    let spec = {
      name        : 'sample',
      systems     : ['sampleSystem'],
      eventSheets : ['sampleEventSheet'],
      layers      : ['background', 'foreground'],
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
    module(spec)
    let scene = fixtures.$.scenes.sample
    let args = fx.createClass.getCall(0).args

    assert.equal(scene, fx.class_)
    assert.isTrue(fx.createClass.calledOnce)

    assert.equal(args[0], fixtures.Scene)
    assert.deepEqual(args[1], {
      _$data        : spec.data,
      _$methods     : spec.methods,
      _$attributes  : Object.keys(spec.data),
      _$systems     : fixtures.$.systems,
      _$eventSheets : fixtures.$.eventSheets,
      _$layers      : spec.layers
    })
    assert.deepEqual(args[2], {
      _$name        : spec.name,
      _$data        : spec.data,
      _$methods     : spec.methods,
      _$attributes  : Object.keys(spec.data),
      _$systems     : fixtures.$.systems,
      _$eventSheets : fixtures.$.eventSheets,
      _$layers      : spec.layers,
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