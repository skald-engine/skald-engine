import Manager from 'sk/core/Manager'

import * as $ from 'sk/$'
import * as utils from 'sk/utils'

/**
 * The factory manager.
 *
 * This manager is mainly for internal usage.
 */
export default class CreateManager extends Manager {

  /**
   * Constructor
   *
   * @param {Game} game - The game instances.
   */
  constructor(game) {
    super(game)
  }

  /**
   * Manager setup. Do not call it manually, for engine use only.
   */
  setup() {
    utils.profiling.begin('create')
    utils.profiling.end('create')
  }

  /**
   * Creates a display object.
   *
   * @param {Strign} name - The display object name.
   */
  displayObject(name) {
    let DisplayObject = $.displayObjects[name]

    if (!DisplayObject) {
      throw new Error(`Trying to create a non-existing display object `+
                      `"${name}".`)
    }

    return new DisplayObject()
  }

  /**
   * Creates a component.
   *
   * @param {String} name - The component name.
   */
  component(name) {
    let Component = $.components[name]

    if (!Component) {
      throw new Error(`Trying to create a non-existing component "${name}".`)
    }

    return new Component()
  }

  /**
   * Creates a entity.
   *
   * @param {String} name - The entity name.
   */
  entity(name) {
    let Entity = $.entities[name]

    if (!Entity) {
      throw new Error(`Trying to create a non-existing entity "${name}".`)
    }

    let display = new Entity.display()
    let components = {}
    for (let i=0; i<Entity.components.length; i++) {
      let c = new Entity.components[i]()
      components[c.access] = c
    }

    return new Entity(name, display, components)
  }

  /**
   * Creates a system.
   *
   * @param {String} name - The system name.
   */
  system(name) {
    let System = $.systems[name]

    if (!System) {
      throw new Error(`Trying to create a non-existing system "${name}".`)
    }

    return new System(this.game)
  }

  /**
   * Creates an event sheet.
   *
   * @param {String} name - The event sheet name.
   */
  eventSheet(name) {
    let EventSheet = $.eventSheets[name]

    if (!EventSheet) {
      throw new Error(`Trying to create a non-existing event sheet "${name}".`)
    }

    let eventSheet = new EventSheet(this.game)
    for (let i=0; i<EventSheet._$eventNames.length; i++) {
      let name = EventSheet._$eventNames[i]
      let func = '_callback_'+name

      scene.addEventListener(name, eventSheet[func])
    }

    return eventSheet
  }

  /**
   * Creates a scene.
   */
  scene(name) {
    let Scene = $.scenes[name]

    if (!Scene) {
      throw new Error(`Trying to create a non-existing scene "${name}".`)
    }

    // let scene = new Scene(this.game)

    let layers = {}
    for (let i=0; i<Scene.$layers; i++) {
      let name = Scene.$layers[i]
      layers[name] = new PIXI.Container()
    }

    let systems = {}
    for (let i=0; i<Scene.systems.length; i++) {
      let system = new Scene.systems[i](this.game)
      systems[system.access] = system
    }

    let eventSheets = {}
    for (let i=0; i<Scene.eventSheets.length; i++) {
      let eventSheet = new Scene.eventSheets[i](this.game)
      eventSheets[eventSheet.access] = eventSheet
    }

    return new Scene(this.game, layers, systems, eventSheets)
  }
}
