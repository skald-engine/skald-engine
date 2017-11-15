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
   *
   * @param {sk.Game} game - The game instance.
   * @param {String} type - The type handled by this middleware.
   */
  constructor(game, type) {
    this._game = game
    this._type = type
  }

  /**
   * The game instance. Readonly.
   * @type {sk.Game}
   */
  get game() {
    return this._game
  }

  /**
   * The middleware type. Readonly.
   * @type {String}
   */
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

    // Validate the resource
    try {
      if (!this.validate(resource)) {
        return
      }
    } catch(e) {
      let message = (e && e.message)? e.message : e;
      pixiResource.error = message
      return
    }

    // Process the loaded resource
    let object = this.process(resource)
    if (!object) {
      pixiResource.error = `Middleware "${this._type}" must return the `+
                           `processed object in the "process" method.`
      return
    }
    resource.object = object

    // Cache it if needed
    this.cache(resource)

    // Save the resource on the manager
    this.game.resources.cacheResource(resource)
  }

  /**
   * Validate the loaded resource. Implement this when inherit.
   *
   * If the resource is not valid, you shoud throw an exception, which will be
   * catched and handled internally. If you want to simply stop the 
   * transformation by this middleware, return `false` (e.g., if you want to 
   * load more data and wait for it). Return `true` to continue the process.
   */
  validate() {}

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