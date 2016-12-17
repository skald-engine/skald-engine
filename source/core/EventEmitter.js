/**
 * The EventEmitter uses the same interface of `eventemitter3` library, used 
 * internally by Pixi.js, so we can keep compatibility with pixi.js stuff and 
 * be able to handle with interaction events of pixi display objects. However,
 * we convert the pixi events to Skald events.
 *
 * When one object receives an event, this event is stored on `game.events` as
 * part of the game event pool, and digested later on the event digest phase
 * of the game loop. The event will bubble through the hierarchy (entity to 
 * scene, and scene to game). Notice that, to dispatch an event, the 
 * EventEmitter must have a reference to the Game instance (via `object.game` 
 * variable) and to the scene instance (if the object is an Entity, via 
 * `object.scene` variable). If the game instance is not present (and the scene
 * in the case of an entity), the event will be digested immediately by the 
 * target object and won't bubble.
 * 
 * References:
 *
 * - [Pixi interaction events](http://pixijs.download/release/docs/PIXI.interaction.InteractionManager.html)
 */
export default class EventEmitter {
  constructor() {
    this._listeners = {}
  }

  eventNames() {}
  listeners() {}
  emit(event) {}
  once(eventType, listener, context) {}
  addListener(eventType, listener, context) {}
  removeListener(eventType, listener, context, once) {}
  removeAllListeners(eventType) {}
}

EventEmitter.prototype.on = EventEmitter.prototype.addListener
EventEmitter.prototype.off = EventEmitter.prototype.removeListener