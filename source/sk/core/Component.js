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
    // Inserted internally:
    // - _$entity
    // - _$data
    // - _$methods
    // - _$attributes
    
    this.initialize()
  }

  /**
   * Initialize function, called in the constructor. Override this to put 
   * initialization logic.
   */
  initialize() {}

  /**
   * Destroy function, called in the constructor. Override this to put 
   * destroy logic.
   */
  destroy() {}

}