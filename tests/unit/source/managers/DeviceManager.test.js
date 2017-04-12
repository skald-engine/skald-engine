describe('managers/DeviceManager.js', () => {
  let Manager
  let GameMock = () => {}

  before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    })

    mockery.registerMock('core/Game', GameMock)
    Manager = sourceRequire('managers/DeviceManager.js').default
  })

  after(() => {
    mockery.deregisterMock('core/Game')
    mockery.disable()
  })

  it('should execute setup without errors', () => {
    let game = new GameMock()
    let manager = new Manager(game)

    manager.setup()
  })
})