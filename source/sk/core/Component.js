/**
 * Base class for Skald components.
 * 
 * Components are structures that holds data and operations over these data. 
 * Notice that, a component is an independent object, thus, it **must not** 
 * access any external resources. If you need such a function, try to implement
 * it on a {@link System} or an {@link EventSheet}.
 *
 * You should not use this class directly, instead, you may inherit it or 
 * create components using the {@link component} function. However, we hardly 
 * recommend that you keep the usage limited to the `sk.component` function.
 *
 * If you want to inherit this class manually for any reason, you must set the
 * `_name` variable, at least. Notice that, by creating components like this 
 * you won't be able to use it on entities in the default declaration. 
 */
export default class Component {

  /**
   * Constructor.
   */
  constructor() {
    // Inserted by the `component()` declarator:
    // - _name
    // - _access
    // - _$spec
    // - _$data
    // - _$methods
    // - _$attributes
    
    this.initialize()
  }

  /**
   * The component name, used to link it to an entity. Readonly.
   * @type {String}
   */
  get name() { return this._name }

  /**
   * The component access name, used when accessing the component inside an
   * entity. Readonly.
   * @type {String}
   */
  get access() { return this._access }

  /**
   * The user declared specification of the component. Readonly.
   * @type {Object}
   */
  get $spec() { return this._$spec }

  /**
   * The user declared data of the component. Readonly.
   * @type {Object}
   */
  get $data() { return this._$data }

  /**
   * The user declared methods of the component. Readonly.
   * @type {Object}
   */
  get $methods() { return this._$methods }

  /**
   * The user declared attributes inside the data. Readonly.
   */
  get $attributes() { return this._$attributes }

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
    let data = {}
    for (let i=0; i<this._$attributes; i++) {
      let name = this._$attributes[i]
      data[name] = this[name]
    }

    return data
  }

  /**
   * Imports the component data.
   *
   * @param {Object} data - The component data to be loaded.
   */
  fromJson(data) {
    data = data || {}

    for (let name in data) {
      this[name] = data[name]
    }
  }
}