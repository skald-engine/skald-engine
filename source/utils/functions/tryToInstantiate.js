const CONSTRUCTOR_REGEX = new RegExp('is not a constructor', 'gi')
const FUNCTION_REGEX = new RegExp('is not a function', 'gi')

function isInstatiationError(e) {
  return e instanceof TypeError && CONSTRUCTOR_REGEX.test(e.message)
}
function isFunctionError(e) {
  return e instanceof TypeError && FUNCTION_REGEX.test(e.message)
}

export default function tryToInstantiate(object, ...args) {
  try {
    // tries to instantiate as a class
    object = new object(...args)
  } catch(e) {
    if (!isInstatiationError(e)) throw e
      
    try {
      // tries to instantiate indirectly, like generator functions
      object = object(...args)
    } catch(e) {
      if (!isFunctionError(e)) throw e

      // seems to be already instantiated  
    }
  }

  return object
}