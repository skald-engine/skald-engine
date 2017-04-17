import * as $ from 'sk/$'

/**
 * Register a display object. A display object is any object that inherit from
 * PIXI.DisplayObject, thus, able to be drawn on the canvas. Notice that you
 * must provide a class to the register (Skald will use `new DiplayObject` 
 * internally), and it must be able to be instantiated without arguments.
 *
 * If another display object with the same name has already been registered, it
 * will throw an error.
 *
 * Usage example:
 *
 *     sk.registerDisplayObject('sprite_alias', PIXI.Sprite)
 * 
 *
 * @param {String} name - The ID of the display object.
 * @param {Function} displayObject - The display object class.
 */
export function registerDisplayObject(name, displayObject) {
  if ($.displayObjects[name]) {
    throw new Error(`Display object "${name}" already registered.`)
  }

  $.displayObjects[name] = displayObject
}