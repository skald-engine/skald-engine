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

    let display = new Entity._$display()
    let components = {}
    for (let k in Entity.components) {
      let c = new Entity.components[k]()
      components[c.access] = c
    }

    return new Entity(this, display, Object.freeze(components))
  }

  /**
   * Creates a system.
   *
   * @param {String} name - The system name.
   */
  system(name, scene) {
    if (!scene) {
      throw new Error(`Trying to create the system "${name} without a scene".`)
    }

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
  eventSheet(name, scene) {
    if (!scene) {
      throw new Error(`Trying to create the system "${name} without a scene".`)
    }

    let EventSheet = $.eventSheets[name]

    if (!EventSheet) {
      throw new Error(`Trying to create a non-existing event sheet "${name}".`)
    }

    let eventSheet = new EventSheet(this.game, scene)

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

    let scene = new Scene(this.game)

    let systems = {}
    for (let k in Scene._$systems) {
      let system = new Scene._$systems[k](this.game, scene)
      systems[system.access] = system
    }

    let eventSheets = {}
    for (let k in Scene._$eventSheets) {
      let eventSheet = new Scene._$eventSheets[k](this.game, scene)
      eventSheets[eventSheet.access] = eventSheet
    }

    scene._systems = Object.freeze(systems)
    scene._eventSheets = Object.freeze(eventSheets)
    scene.initialize()

    return scene
  }
}
