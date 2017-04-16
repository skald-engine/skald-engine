/**
 * Dict of all registered display objects.
 */
export let _displayObjects = {}

/**
 * Register a display object. A display object is any object that inherit from
 * PIXI.DisplayObject, thus, able to be drawn on the canvas. Notice that you
 * must provide a class to the register (Skald will use `new DiplayObject` 
 * internally), and it must be able to be instantiated without arguments.
 *
 * If another display object with the same name has already been registered, it
 * will throw an error.
 *
 * @param {String} name - The ID of the display object.
 * @param {Function} displayObject - The display object class.
 */
export function displayObject(name, displayObject) {
  if (_displayObjects[name]) {
    throw new Error(`Display object "${name}" already registered.`)
  }

  _displayObjects[name] = displayObject
}