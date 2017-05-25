/**
 * list of audio systems.
 */
export let audioSystems = []

/**
 * Map of registered systems.
 */
export let systems = {}

/**
 * Map of registered scenes.
 */
export let scenes = {}

/**
 * Map of registered event sheets.
 */
export let eventSheets = {}

/**
 * Map of registered logger handlers.
 */
export let loggerHandlers = {}

/**
 * Map of registered logger formatters.
 */
export let loggerFormatters = {}

/**
 * Map of bitmap font data.
 */
export let bitmapFonts = {}

/**
 * Map of classes by their Ids, this is filled automatically by the 
 * `setClassId` function.
 */
export let classes = {}

/**
 * Creates a new classs ID
 */
let classId = 1
export function setClassId(Class) {
  if (!Class._$classId) {
    classId++
    Class._$classId = classId
    Class.prototype._$classId = classId
    classes[Class._$classId] = Class
  }
}

/**
 * Returns a class ID, setting it if it does not exist.
 */
export function getClassId(Class) {
  if (!Class._$classId) {
    setClassId(Class)
  }

  return Class._$classId
}