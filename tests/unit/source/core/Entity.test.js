describe('core/Entity.js', () => {
  beforeEach(() => {
    startMockery()
  })

  afterEach(() => {
    stopMockery()
  })

  it('should contain base attributes', () => {
    class DisplayObjectClass {}
    var displayObjects = {sample: DisplayObjectClass}

    // Import entity class
    mockery.registerMock('globals_/components', sinon.spy())
    mockery.registerMock('globals_/displayObjects', displayObjects)
    let Entity = sourceRequire('core/Entity.js').default

    // Create an entity instance
    let game = sinon.spy()
    let scene = sinon.spy()
    let display = 'sample'
    let components = []

    let entity = new Entity(game, scene, display, components)

    // Asserts
    assert.equal(entity.game, game)
    assert.equal(entity.scene, scene)
    assert.isTrue(entity.display instanceof DisplayObjectClass)
    assert.isDefined(entity.name)
    assert.isDefined(entity.components)
    assert.isDefined(entity.$components)
    assert.isFunction(entity.hasComponent)
    assert.isFunction(entity.has)
    assert.isFunction(entity.toJson)
    assert.isFunction(entity.fromJson)
  })

  it('should call initialize', () => {
    // Import entity class
    let Entity = _genericRequire()

    // Configure generic sub class
    let initialize = sinon.spy()
    class GenericEntity extends Entity {}
    GenericEntity.prototype.initialize = initialize

    // Assert
    let game = sinon.spy()
    let scene = sinon.spy()
    let display = 'sample'
    let components = []

    let entity = new GenericEntity(game, scene, display, components)

    assert.isTrue(initialize.called)
  })

  it('should instantiate components', () => {
    // Setup components map
    class SampleClass {
      constructor() { this.access = 'sampleAccess' }
    }
    let componentList = {
      'sample1': sinon.stub(),
      'sample2': sinon.stub(),
      'sample3': SampleClass,
    }

    // Import entity class
    mockery.registerMock('globals_/components', componentList)
    mockery.registerMock('globals_/displayObjects', {'sample': ()=>{}})
    let Entity = sourceRequire('core/Entity.js').default

    // Configure generic sub class
    let game = sinon.spy()
    let scene = sinon.spy()
    let display = 'sample'
    let components = ['sample1', 'sample3']

    let entity = new Entity(game, scene, display, components)

    // Assert
    assert.isDefined(entity.components.sample1)
    assert.isDefined(entity.components.sampleAccess)
    assert.isTrue(entity.components.sampleAccess instanceof SampleClass)
    assert.isFrozen(entity.components)
  })

  it('should export values to json', () => {
    let Entity = _genericRequire()

    let e = new Entity(sinon.spy(), sinon.spy(), 'sample', [])
    e._name = 'zEntity'
    e._components = {
      'c1': {toJson: () => { return {k1:'value'}} },
      'c2': {toJson: () => { return {k2:444}} },
    }

    let result = e.toJson()
    let expected = {
      name: 'zEntity',
      components: {
        c1: {k1: 'value'},
        c2: {k2: 444},
      }
    }
    assert.deepEqual(result, expected)
  })

  it('should import values from json', () => {
    let Entity = _genericRequire()

    let c1 = sinon.spy()
    let c2 = sinon.spy()
    let e = new Entity(sinon.spy(), sinon.spy(), 'sample', [])
    e._components = {
      'c1': {fromJson: c1 },
      'c2': {fromJson: c2 },
    }

    let param1 = {k: 'value'}
    let param2 = {b: 3}

    e.fromJson({
      name: 'zEntity',
      components: {
        c1: param1,
        c2: param2,
      }
    })

    assert.isTrue(c1.calledWith(param1))
    assert.isTrue(c2.calledWith(param2))
  })

})


function _genericRequire() {
  // Import entity class
  mockery.registerMock('globals_/components', sinon.spy())
  mockery.registerMock('globals_/displayObjects', {'sample': ()=>{}})
  return sourceRequire('core/Entity.js').default
}