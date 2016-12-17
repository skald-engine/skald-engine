import {enumeration} from 'utils'

export const VERSION = '%VERSION%'
export const DATE = '%DATE%'
export const ENVIRONMENT = '%ENVIRONMENT%'
export const REVISION = '%REVISION%'

export const POSITION = enumeration({
  TOP_LEFT     : 'top_left',
  TOP_RIGHT    : 'top_right',
  BOTTOM_LEFT  : 'bottom_left',
  BOTTOM_RIGHT : 'bottom_right',
  TOP          : 'top',
  BOTTOM       : 'bottom',
  LEFT         : 'left',
  RIGHT        : 'right',
  CENTER       : 'center',
})

export const DIRECTION = enumeration({
  TOP_LEFT     : 'top_left',
  TOP_RIGHT    : 'top_right',
  BOTTOM_LEFT  : 'bottom_left',
  BOTTOM_RIGHT : 'bottom_right',
  TOP          : 'top',
  BOTTOM       : 'bottom',
  LEFT         : 'left',
  RIGHT        : 'right',
})

export const RENDERER = enumeration({
  AUTO   : 'auto',
  WEBGL  : 'webgl',
  CANVAS : 'canvas',
})

export const ORIENTATION = enumeration({
  PORTRAIT  : 'portrait',
  LANDSCAPE : 'landscape',
})

export const SCALE_MODE = enumeration({
  STRETCH : 'stretch',
  FIT     : 'fit',
  FILL    : 'fill',
  NOSCALE : 'noscale',
})

export const MATH = enumeration({
  PI      : 3.14159265359,
  PI_2    : 6.28318530718,
  HALF_PI : 1.57079632679,
  INV_PI  : 0.31830988618,
  E       : 2.71828182846,
  INV_E   : 0.36787944117,
})

export const LOGGER_LEVEL = enumeration({
  TRACE  : 'trace',
  DEBUG  : 'debug',
  INFO   : 'info',
  WARN   : 'warn',
  ERROR  : 'error',
  FATAL  : 'fatal',
})