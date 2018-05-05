import {enumeration} from 'sk/utils'

/**
 * Logger levels enum:
 *
 * - TRACE - for very detailed (and possibly with performance impact) debug 
 *   information.
 * - DEBUG - for debug information.
 * - INFO - to register that everything is running as expected.
 * - WARN - potentially harmful situation, without stopping the execution.
 * - ERROR - an error has occurred but it wont need to stop the execution.
 * - FATAL - should be used to log errors that will abort the execution of the
 *   game.
 */
export const LOGGER_LEVEL = enumeration({
  TRACE  : 'trace',
  DEBUG  : 'debug',
  INFO   : 'info',
  WARN   : 'warn',
  ERROR  : 'error',
  FATAL  : 'fatal',
})