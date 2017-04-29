
/**
 * Helper function to create classes. This function is specially useful to 
 * reuse the code from declarators (sk.component, sk.entity, etc).
 *
 * Usage:
 *
 *     let Other = sk.utils.createClass(sk.core.Entity, {atClass:'=)'}, {atProto:'=D'})
 *     console.log(Other.atClass) // prints '=)'
 *     console.log(Other.prototype.atProto) // prints '=D'
 *
 * @param {Object} [super] - The super class, which will be used for 
 *        inheritance.
 * @param {Object} [classVariables] - A map with variables that will be 
 *        inserted into the class namespace.
 * @param {Object} [prototypeVariables] - A map with variables that will be
 *        inserted into the prototype namespace.
 */
export default function createClass(Super, classVariables, prototypeVariables) {
  // Super treatment
  Super = Super || Object

  // Create the class
  class Other extends Super {}

  // Insert variables on class namespace
  for (let k in classVariables) Other[k] = classVariables[k]

  // Inser variables on prototype namespace
  for (let k in prototypeVariables) Other.prototype[k] = prototypeVariables[k]

  return Other
}