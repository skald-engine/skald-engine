/**
 * Base class for Skald components.
 * 
 * Components are structures that holds data and operations over these data. 
 * Notice that, a component is an independent object, thus, it **must not** 
 * access any external resources. If you need such a function, try to implement
 * it on a {@link System} or an {@link EventSheet}.
 *
 * You should not use this class directly, instead, you can create components 
 * using the {@link component} function.
 */
export default class Component {

  /**
   * Constructor.
   */
  constructor() {
    // Inserted by the `component()` declarator:
    // - _$name
    // - _$access
    // - _$data
    // - _$methods
    // - _$attributes
    
    this.initialize()
  }

  /**
   * The component name, used to link it to an entity. Readonly.
   * @type {String}
   */
  get name() { return this._$name }

  /**
   * The component access name, used when accessing the component inside an
   * entity. Readonly.
   * @type {String}
   */
  get access() { return this._$access }

  /**
   * Initialize function, called in the constructor. Override this to put 
   * initialization logic.
   */
  initialize() {}

  /**
   * Exports the component data.
   *
   * @return {Object}
   */
  toJson() {
    let result = {
      name: this.name,
      data: {}
    }
    for (let i=0; i<this._$attributes; i++) {
      let name = this._$attributes[i]
      result.data[name] = this[name]
    }

    return result
  }

  /**
   * Imports the component data.
   *
   * @param {Object} data - The component data to be loaded.
   */
  fromJson(data) {
    data = data || {}
    data.data = data.data || {}

    for (let name in data.data) {
      this[name] = data.data[name]
    }
  }
}