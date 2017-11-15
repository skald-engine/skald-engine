const Manager = require('sk/core/Manager')
const utils = require('sk/utils')

let globalPoolId = 0

/**
 * Manager for object pooling.
 *
 * You can use this manager to reuse a set of generic objects.
 */
class PoolManager extends Manager {
  
  /**
   * Constructor
   *
   * @param {Game} game - The game instances.
   */
  constructor(game) {
    super(game)

    this._pool = {}
    this._classMap = {}
    this._maxSize = null
  }

  /**
   * Maximum number of pool objects.
   */
  get maxSize() { return this._maxSize }
  set maxSize(v) { this._maxSize = v }

  /**
   * Manager setup. Do not call it manually, for engine use only.
   */
  setup() {
    utils.profiling.begin('pool')

    this._maxSize = this.game.config.pool.maxSize

    utils.profiling.end('pool')
  }

  /**
   * Returns a instance of the provided class. This method will look at the 
   * pool for an inactive instance, if there is no available instance, it will
   * create a new one. Thus, the provided class must accept instantiation 
   * without any arguments.
   *
   * If you provide a non function, this method will throw an error. The same
   * will occour if the class can't be instantiate without arguments.
   *
   * @param {Function} class_ - The target class.
   * @return {Object} The target instance.
   */
  create(class_) {
    // Check the input type
    if (typeof class_ !== 'function') {
      throw new Error(`You must provide a class to create a object in the `+
                      `pool manager. Received "${class_}" instead.`)
    }

    // Verify if class have a pool id
    let id = this._getId(class_)
    if (id === null) {
      this._setId(class_)
    }

    // Get the pool for the object
    let pool = this._pool[id]

    // If there is no pool or the pool is empty, create a new object
    if (!pool || !pool.length) {
      try {
        return new class_()
      } catch (e) {
        throw new Error(`Pool manager could not create a new instance of the `+
                        `provided class. The class must accept instantiation `+
                        `without arguments.`)
      }

    // If there is elements in the pool, return this first one
    } else {
      return pool.shift()
    }
  }

  /**
   * Stores an instance to the pool.
   *
   * @param {Object} instance - The object instance.
   */
  store(instance) {
    // Validate instance type
    if (!instance) {
      throw new Error(`You must provide a valid object to store an item in `+
                      `the pool manager. Received "${instance}" instead.`)
    }

    // Get the pool id, try to get it from the object or the constructor
    let id = this._getId(instance)

    // If there is no id, create the pool id on the object class
    if (id === null) {
      id = this._setId(instance.constructor||instance)
    }

    // Get the pool list
    let pool = this._pool[id]

    // If there is no pool, create one
    if (!pool) {
      pool = this._pool[id] = []
    }

    // Limit the pool to the max size
    if (pool.length >= this._maxSize) {
      pool.shift()
    }

    // Push the provided instance to the end of the pool
    pool.push(instance)
  }

  /**
   * Clean up a pool for a given class or instance.
   *
   * @param {Object|Function} obj - The class or instance.
   */
  clean(obj) {
    let id = this.getId(obj)

    if (id !== null) {
      this._pool[id] = []
    }
  }

  /**
   * Get the class ID.
   */
  _getId(obj) {
    let id = obj._$poolId || (obj.constructor && obj.constructor._$poolId)
    let class_ = this._classMap[id]

    if (obj === class_ || obj.constructor === class_) {
      return id
    }

    return null
  }

  /**
   * Set the class ID.
   */
  _setId(class_) {
    let id = globalPoolId++
    class_._$poolId = id
    this._classMap[id] = class_

    return id
  }
}


module.exports = PoolManager