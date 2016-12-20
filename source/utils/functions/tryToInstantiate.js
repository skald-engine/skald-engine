export default function tryToInstantiate(object, ...args) {
  try {
    // tries to instantiate as a class
    object = new object(...args)
  } catch(e) {
    try {
      // tries to instantiate indirectly, like generator functions
      object = object(...args)
    } catch(e) {
      // seems to be already instantiated  
    }
  }

  return object
}