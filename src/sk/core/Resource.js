/**
 * The resource class is an internal helper class that represents the loaded 
 * data from PIXI loader. This is a simple interfarce for middlewares. 
 *
 * The Resource object is created by the ResourcesManager, so ideally you won't
 * need to manually instantiate it.
 */
class Resource {

  /**
   * Constructor.
   *
   * @param {String} type - The resource type ID.
   * @param {String} id - The resource ID, must by unique.
   * @param {String} url - The resource source URL.
   * @param {String} xhrType - The type computed by the loader.
   * @param {Object} rawData - The raw data (before any computation).
   * @param {Object} metadata - A custom metadata object.
   * @param {Object} pixiResource - The resource object created by the PIXI 
   *        loader.
   */
  constructor(type, id, url, xhrType, rawData, metadata, pixiResource) {
    this._type = type
    this._id = id
    this._url = url
    this._xhrType = xhrType
    this._rawData = rawData
    this._metadata = metadata
    this._pixiResource = pixiResource
    this._data = null
  }

  /**
   * The resource ID.
   * @type {String}
   */
  get id() {
    return this._id
  }

  /**
   * The resource source URL.
   * @type {String}
   */
  get url() {
    return this._url
  }

  /**
   * The resource type.
   * @type {String}
   */
  get type() {
    return this._type
  }

  /**
   * The resource type computed the PIXI loader.
   * @type {String}
   */
  get xhrType() {
    return this._xhrType
  }

  /**
   * The raw data (the loaded info before any processing).
   * @type {Object}
   */
  get rawData() {
    return this._rawData
  }

  /**
   * The resource custom metadata.
   * @type {Object}
   */
  get metadata() {
    return this._metadata
  }

  /**
   * 
   */
  get pixiResource() {
    return this._pixiResource
  }

  /**
   * The processed object, which is created or transformed by the middleware.
   * @type {Object}
   */
  get data() {
    return this._data
  }
  set data(value) {
    this._data = value
  }

}


module.exports = Resource