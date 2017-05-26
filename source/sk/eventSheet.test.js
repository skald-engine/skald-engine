const _makeFixtures = () => {
  return {
    EventSheet : class {},
    $      : {setClassId: sinon.stub()},
    utils  : {} 
  }
}

const _require = (fixtures) => {
  mock({
    'sk/$': fixtures.$,
    'sk/utils': fixtures.utils,
    'sk/core/EventSheet': fixtures.EventSheet
  })
  return require('./eventSheet.js').eventSheet
}

describe('sk/eventSheet.js', () => {
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
      destroy     : () => {},
      event1      : () => {},
      event2      : () => {},
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
      initialize: fx.initialize,
      destroy: fx.destroy,
      events: {
        'event.name.1': fx.event1,
        'event.name.2': fx.event2,
      },
      data: {
        first: fx.data.first,
        second: fx.data.second,
      },
      methods: {
        third: fx.methods.third
      }
    }

    // test
    let eventSheet = module(spec)
    let args = fx.createClass.getCall(0).args

    assert.equal(eventSheet, fx.class_)
    assert.isTrue(fx.createClass.calledOnce)

    assert.equal(args[0], fixtures.EventSheet)
    assert.deepEqual(args[1], {
      _$data       : spec.data,
      _$methods    : spec.methods,
      _$attributes : Object.keys(spec.data),
      _$events     : spec.events,
      _$eventNames : Object.keys(spec.events)
    })
    assert.deepEqual(args[2], {
      _$data                   : spec.data,
      _$methods                : spec.methods,
      _$attributes             : Object.keys(spec.data),
      _$events                 : spec.events,
      _$eventNames             : Object.keys(spec.events),
      initialize               : spec.initialize,
      destroy                  : spec.destroy,
      first                    : spec.data.first,
      second                   : spec.data.second,
      third                    : spec.methods.third,
      '_callback_event.name.1' : spec.events['event.name.1'],
      '_callback_event.name.2' : spec.events['event.name.2'],
    })
  })
})