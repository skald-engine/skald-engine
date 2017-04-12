describe('core/Manager.js', () => {
  let Manager
  let GameMock = () => {}

  before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })

    mockery.registerMock('core/Game', GameMock)
    Manager = sourceRequire('core/Manager.js').default
  })

  after(() => {
    mockery.deregisterMock('core/Game')
    mockery.disable()
  })

  it('should contain base methods', () => {
    let game = new GameMock()
    let manager = new Manager(game)

    assert.isDefined(manager.game)
    assert.isFunction(manager.setup)
    assert.isFunction(manager.preUpdate)
    assert.isFunction(manager.update)
    assert.isFunction(manager.postUpdate)
    assert.isFunction(manager.preDraw)
    assert.isFunction(manager.draw)
    assert.isFunction(manager.destroy)
  })

})