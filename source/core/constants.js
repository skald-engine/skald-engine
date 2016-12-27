import {enumeration} from 'utils'

/** Skald engine version (we use semantic versioning). */
export const VERSION = '%VERSION%'

/** Build date of the library. */
export const DATE = '%DATE%'

/** Revision of the build (we use the current commit of git). */
export const REVISION = '%REVISION%'

/**
 * Position enum, it holds the following values:
 *
 * - TOP_LEFT
 * - TOP_RIGHT
 * - BOTTOM_LEFT
 * - BOTTOM_RIGHT
 * - TOP
 * - BOTTOM
 * - LEFT
 * - RIGHT
 * - CENTER
 */
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

/**
 * Direction enum, it holds the following values:
 *
 * - TOP_LEFT
 * - TOP_RIGHT
 * - BOTTOM_LEFT
 * - BOTTOM_RIGHT
 * - TOP
 * - BOTTOM
 * - LEFT
 * - RIGHT
 */
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

/**
 * Enumeration of Pixi renderers types:
 *
 * - AUTO
 * - WEBGL
 * - CANVAS
 */
export const RENDERER = enumeration({
  AUTO   : 'auto',
  WEBGL  : 'webgl',
  CANVAS : 'canvas',
})

/**
 * Screen orientation enumeration:
 *
 * - PORTRAIT
 * - LANDSCAPE
 */
export const ORIENTATION = enumeration({
  PORTRAIT  : 'portrait',
  LANDSCAPE : 'landscape',
})

/**
 * Enumeration for automatic resizing:
 *
 * - STRETCH - rescale width and height to full possible size, without keeping
 *   the aspect ratio.
 * - FIT - rescale the canvas to the maximum width OR height, keeping the 
 *   aspect ratio and without cutting any part of the canvas.
 * - FILL - rescale the canvas to fill the whole screen but keeping the aspect
 *   ratio, thus, part of the game will be cut off the screen.
 * - NOSCALE - no automatic scale.
 */
export const SCALE_MODE = enumeration({
  STRETCH : 'stretch',
  FIT     : 'fit',
  FILL    : 'fill',
  NOSCALE : 'noscale',
})

/**
 * Enumeration of mathematical constants:
 * 
 * - PI
 * - PI_2 - pi*2
 * - HALF_PI - pi/2
 * - INV_PI - 1/pi
 * - E
 * - INV_E - 1/e
 */
export const MATH = enumeration({
  PI      : 3.14159265359,
  PI2     : 6.28318530718,
  HALF_PI : 1.57079632679,
  INV_PI  : 0.31830988618,
  E       : 2.71828182846,
  INV_E   : 0.36787944117,
})

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

/**
 * Keyboard keys.
 */
export const KEY = enumeration({
  BACKSPACE         : 8,
  TAB               : 9,
  NUMLOCK           : 12,
  RETURN            : 13,
  ENTER             : 13,
  SHIFT             : 16,
  CTRL              : 17,
  ALT               : 18,
  PAUSE             : 19,
  BREAK             : 19,
  CAPSLOCK          : 20,
  ESCAPE            : 27,
  ESC               : 27,
  SPACE             : 32,
  PAGEUP            : 33,
  PAGEDOWN          : 34,
  END               : 35,
  HOME              : 36,
  LEFT              : 37,
  UP                : 38,
  RIGHT             : 39,
  DOWN              : 40,
  INSERT            : 45,
  DELETE            : 46,
  NUM0              : 48,
  NUM1              : 49,
  NUM2              : 50,
  NUM3              : 51,
  NUM4              : 52,
  NUM5              : 53,
  NUM6              : 54,
  NUM7              : 55,
  NUM8              : 56,
  NUM9              : 57,
  A                 : 65,
  B                 : 66,
  C                 : 67,
  D                 : 68,
  E                 : 69,
  F                 : 70,
  G                 : 71,
  H                 : 72,
  I                 : 73,
  J                 : 74,
  K                 : 75,
  L                 : 76,
  M                 : 77,
  N                 : 78,
  O                 : 79,
  P                 : 80,
  Q                 : 81,
  R                 : 82,
  S                 : 83,
  T                 : 84,
  U                 : 85,
  V                 : 86,
  W                 : 87,
  X                 : 88,
  Y                 : 89,
  Z                 : 90,
  LEFT_WINDOW       : 91,
  RIGHT_WINDOW      : 92,
  SELECT            : 93,
  CONTEXT_MENU      : 93,
  NUMPAD_0          : 96,
  NUMPAD_1          : 97,
  NUMPAD_2          : 98,
  NUMPAD_3          : 99,
  NUMPAD_4          : 100,
  NUMPAD_5          : 101,
  NUMPAD_6          : 102,
  NUMPAD_7          : 103,
  NUMPAD_8          : 104,
  NUMPAD_9          : 105,
  MULTIPLY          : 106,
  ADD               : 107,
  SEPARATOR         : 108,
  SUBTRACT          : 109,
  DECIMAL           : 110,
  DIVIDE            : 111,
  F1                : 112,
  F2                : 113,
  F3                : 114,
  F4                : 115,
  F5                : 116,
  F6                : 117,
  F7                : 118,
  F8                : 119,
  F9                : 120,
  F10               : 121,
  F11               : 122,
  F12               : 123,
  F13               : 124,
  F14               : 125,
  F15               : 126,
  F16               : 127,
  F17               : 128,
  F18               : 129,
  F19               : 130,
  F20               : 131,
  F21               : 132,
  F22               : 133,
  F23               : 134,
  F24               : 135,
  NUMLOCK           : 144,
  SCROLLLOCK        : 145,
  SEMICOLON         : 186,
  EQUAL             : 187,
  COMMA             : 188,
  DASH              : 189,
  PERIOD            : 190,
  SLASH             : 191,
  GRAVE_ACCENT      : 192,
  OPEN_BRACKET      : 219,
  BACK_SLASH        : 220,
  CLOSE_BRAKET      : 221,
  QUOTE             : 222,
  
  MEDIA_MUTE        : 173,
  MEDIA_VOLUME_DOWN : 174,
  MEDIA_VOLUME_UP   : 175,
  MEDIA_NEXT        : 176,
  MEDIA_PREVIOUS    : 177,
  MEDIA_PLAY        : 179,
  MEDIA_STOP        : 164,
  MEDIA_HOME        : 237,
})

/**
 * Mouse buttons
 */
export const BUTTON = enumeration({
  PRIMARY   : 0,
  LEFT      : 0,
  AUXILIARY : 1,
  WHEEL     : 1,
  MIDDLE    : 1,
  SECONDARY : 2,
  RIGHT     : 2,
  BACK      : 3,
  FOURTH    : 3,
  FORWARD   : 4,
  FIFTH     : 4
})

/**
 * Gamepad buttons
 */
export const GAMEPAD = enumeration({
  A              : 0,
  B              : 1,
  X              : 2,
  Y              : 3,
  LB             : 4,
  LEFT_SHOULDER  : 4,
  LEFT_BUMPER    : 4,
  RB             : 5,
  RIGHT_SHOULDER : 5,
  RIGHT_BUMPER   : 5,
  LT             : 6,
  LEFT_TRIGGER   : 6,
  RT             : 7,
  RIGHT_TRIGGER  : 7,
  SELECT         : 8,
  BACK           : 8,
  START          : 9,
  LS             : 10,
  LEFT_THUMB     : 10,
  LEFT_STICK     : 10,
  RS             : 11,
  RIGHT_THUMB    : 11,
  RIGHT_STICK    : 11,
  UP             : 12,
  DOWN           : 13,
  LEFT           : 14,
  RIGHT          : 15,
  META           : 16,
})


/**
 * INPUT AXES CONSTANTS
 */
export const GAMEPAD_AXIS = enumeration({
  LEFT_STICK_X      : 'left_stick_x',
  LEFT_STICK_Y      : 'left_stick_y',
  LEFT_STICK_FORCE  : 'left_stick_force',
  RIGHT_STICK_X     : 'right_stick_x',
  RIGHT_STICK_Y     : 'right_stick_y',
  RIGHT_STICK_FORCE : 'right_stick_force',
  LEFT_TRIGGER      : 'left_trigger',
  RIGHT_TRIGGER     : 'right_trigger',
})