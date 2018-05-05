const $ = require('sk/$')

/**
 * A middleware is a special type of object responsible for validating and 
 * process loaded resources.
 *
 * When you load a resource, a texture for exemple, the manager will download 
 * the raw data and ask for the texture middleware to validate (if the data is
 * valid or not), process (convert the raw data into a PIXI Texture) and cache 
 * (saving it to PIXI cache). 
 *
 * If you want to load a different type of resource or if you want a different
 * behavior in the loader, you can define your own middlewares by inheriting
 * this class. Notice that you must add you middleware into the resource 
 * manager:
 *
 *     game.resources.useMiddleware('your-type', YourMiddleware)
 *
 * If you implement the `cache` method, remember to implement the `unload` 
 * method too. This is important to proper remove all cache related to a 
 * resource.
 */
class Middleware {

  /**
   * Constructor.
   */
  constructor(type) {
    this._type = type

    this._resources = $.getInjector().resolve('resources')
  }

  get type() {
    return this._type
  }

  /**
   * Internal method used by the resource manager to load the resource. You
   * should not call this manually.
   *
   * @param {Object} pixiResource - The resource object created by the PIXI 
   *        loader.
   */
  run(pixiResource) {
    let resource = pixiResource.skaldResource

    // If it is not the same type, simply ignore
    if (resource.type !== this.type) {
      return
    }

    // Check for the data integrity
    if (!resource.rawData) {
      pixiResource.error = `File did not loaded.`
      return
    }

    console.log(resource)
    
    // Validate the resource
    try {
      if (!this.validate(resource)) {
        return
      }
    } catch(e) {
      pixiResource.error = (e && e.message)? e.message : e
      return
    }

    // Process the loaded resource
    let data = this.process(resource)
    if (!data) {
      pixiResource.error = `Middleware "${this.type}" did not returned the `+
                           `processed object in the "process" method.`
      return
    }
    resource.data = data

    // Cache it if needed
    this.cache(resource)

    // Save the resource on the manager
    this._resources.cache(resource)
  }

  setup() {}

  // check if middleware accepts url, metadata
  check(url, metadata) {
    return true
  }

  // change URL or metadata
  preProcess(url, metadata) {
    return {url, metadata}
  }

  /**
   * Validate the loaded resource. Implement this when inherit.
   *
   * If the resource is not valid, you shoud throw an exception, which will be
   * catched and handled internally. If you want to simply stop the 
   * transformation by this middleware, return `false` (e.g., if you want to 
   * load more data and wait for it). Return `true` to continue the process.
   */
  validate(resource) {
    return true
  }

  /**
   * Create and/or transform the raw data into the final object. Implement this
   * when inherit.
   *
   * Here you must return the final object, otherwise the middleware will 
   * register an resource error.
   *
   * @param {sk.core.Resource} resource - The skald resource.
   */
  process(resource) {}

  /**
   * Save the final object on wherever it need to be. Implement this when 
   * inherit.
   *
   * Notice that, the resource manager will save the resource automatically 
   * there, so in here you only need to save the resource in custom places. For
   * instance, you may save textures on the PIXI cache, or sounds on the sound 
   * manager.
   *
   * If you implement this method, remember to also implement `unload` to erase
   * all cached data.
   * 
   * @param {sk.core.Resource} resource - The skald resource.
   */
  cache(resource) {}

  /**
   * Implement this when inherit to erase the cached data.
   * 
   * @param {sk.core.Resource} resource - The skald resource.
   */
  unload(resource) {}
}


module.exports = Middleware