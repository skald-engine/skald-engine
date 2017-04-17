describe('sk/core/EventEmitter.js', () => {
  let EventEmitter = require('./EventEmitter.js').default

  it('should dispatch event', () => {
    let emitter = new EventEmitter()
    let listener1 = sinon.spy()
    let listener2 = sinon.spy()

    emitter.addEventListener('sample', listener1)
    emitter.addEventListener('sample', listener2)
    emitter.emit({type: 'sample'})

    assert.isTrue(listener1.called)
    assert.isTrue(listener2.called)
  })

  it('should remove a event listener', () => {
    let emitter = new EventEmitter()
    let listener1 = sinon.spy()
    let listener2 = sinon.spy()

    emitter.addEventListener('sample', listener1)
    emitter.addEventListener('sample', listener2)
    emitter.removeEventListener('sample', listener2)
    emitter.emit({type: 'sample'})

    assert.isTrue(listener1.called)
    assert.isFalse(listener2.called)
  })

  it('should remove all event listeners', () => {
    let emitter = new EventEmitter()
    let listener1 = sinon.spy()
    let listener2 = sinon.spy()

    emitter.addEventListener('sample', listener1)
    emitter.addEventListener('sample', listener2)
    emitter.removeAllEventListeners('sample')
    emitter.emit({type: 'sample'})

    assert.isFalse(listener1.called)
    assert.isFalse(listener2.called)
  })

  it('should return event names', () => {
    let emitter = new EventEmitter()

    emitter.addEventListener('event1', () => {})
    emitter.addEventListener('event2', () => {})
    emitter.addEventListener('event2', () => {})
    emitter.addEventListener('event3', () => {})

    let result = emitter.getEventNames()
    assert.deepEqual(result, ['event1', 'event2', 'event3'])
  })

  it('should return all listeners for an event', () => {
    let emitter = new EventEmitter()

    emitter.addEventListener('event1', () => {})
    emitter.addEventListener('event2', () => {})
    emitter.addEventListener('event2', () => {})
    emitter.addEventListener('event3', () => {})

    assert.lengthOf(emitter.getEventListeners('event1'), 1)
    assert.lengthOf(emitter.getEventListeners('event2'), 2)
  })

})