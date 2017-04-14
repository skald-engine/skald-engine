/**
 * Dict of all registered scenes.
 */
export let _scenes = {}

/**
 * 
 */
export function scene(spec) {
  if (!spec) {
    throw new Error(`Empty scene specification. Please provide an object.`)
  }

  if (!spec.name) {
    throw new Error(`You must provide a scene name.`)
  }

  if (_scenes[spec.name]) {
    throw new Error(`A scene "${spec.name}" has been already registered.`)
  }

  _scenes[name] = spec
}