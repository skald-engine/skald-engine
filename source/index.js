// Sub namespace elements
import * as utils from 'utils'
import * as config from 'config'
export {utils, config}

// Global namespace elements
export * from 'globals_'
export * from 'core'

// Initialize the library
import * as bootstrap from 'bootstrap.js'

// Exporting namespace
global.sk = exports
global.skald = exports
