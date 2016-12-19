import EventEmitter from 'core/EventEmitter'

/**
 * @ignore
 */
export default function Entity(baseclass) {

  /**
   * 
   */
  return class Entity extends EventEmitter(baseclass) {

  }

}