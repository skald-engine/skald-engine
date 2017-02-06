import Manager from 'core/Manager' 
import Action from 'core/managers/inputs/Action' 
import {INPUT_DEVICES, GAMEPAD_AXIS, KEY, BUTTON, GAMEPAD} from 'core/constants'
import * as utils from 'utils'

/**
 * The inputs manager is responsible to handle a configurable map of inputs. It
 * is created by the engine and can be accessed via `game.inputs`.
 *
 * With this manager, you are able to configure actions to your game that are
 * independent from any specific keys or buttons of the inputs devices. For 
 * example, you may define an action `reload` that is active when the
 * `<keyboard R>` or `<gamepad X>` are pressed. Then, you may want to change 
 * (or let the player choose) other buttons without any changes in other parts
 * of the game.
 *
 * We call an `action` the abstract action in the game that is not binded to 
 * any specific key (e.g., "horizontal", "jump", "fire"). We call a `command` 
 * the pair `<device, button>` (e.g., "keyboard R", "gamepad A", 
 * "mouse Button 1"). An action may have one or more commands attached to it.
 *
 * Examples:
 *
 *     game.inputs.action('reload')
 *                .add(sk.INPUT_DEVICES.KEYBOARD, sk.KEY.R)
 *                .add(sk.INPUT_DEVICES.GAMEPAD, sk.GAMEPAD.X)
 *
 *    game.inputs.get('reload') // returns 1 if `<keyboard R>` or `<gamepad x`>
 *                              // are pressed
 *
 * As default, this manager configures the following actions:
 *
 * - **horizontal**: for horizontal axis movement, accepting A, D, LEFT, RIGHT 
 *   and the gamepad left stick (x).
 * - **vertical**: for vertical axis movement, accepting W, S, UP, DOWN and the
 *   gamepad left stick (y).
 * - **shoot**: accepting mouse left button and gamepad right trigger.
 * - **jump**: accepting keyboard space and gamepad A button.
 */
export default class InputsManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)
    this._actions = null
  }

  /**
   * Configure and initialize the manager. This method is called by the engine,
   * do not call it manually.
   */
  setup() {
    utils.profiling.begin('boot.managers.inputs')
    this._actions = {}

    this.action('horizontal')
        .add(INPUT_DEVICES.KEYBOARD, KEY.A, -1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.D, 1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.LEFT, -1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.RIGHT, 1)
        .add(INPUT_DEVICES.GAMEPAD,  GAMEPAD_AXIS.LEFT_STICK_X, 1, -1)

    this.action('vertical')
        .add(INPUT_DEVICES.KEYBOARD, KEY.W, -1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.S, 1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.UP, -1)
        .add(INPUT_DEVICES.KEYBOARD, KEY.DOWN, 1)
        .add(INPUT_DEVICES.GAMEPAD,  GAMEPAD_AXIS.LEFT_STICK_Y, 1)
        
    this.action('shoot')
        .add(INPUT_DEVICES.MOUSE,   BUTTON.LEFT, 1)
        .add(INPUT_DEVICES.GAMEPAD, GAMEPAD.RIGHT_TRIGGER, 1)

    this.action('jump')
        .add(INPUT_DEVICES.KEYBOARD, KEY.SPACE)
        .add(INPUT_DEVICES.GAMEPAD,  GAMEPAD.A)

    utils.profiling.end('boot.managers.inputs')
  }
  
  /**
   * Returns an Action object for the provided name. Notice that this method
   * will create the action if it does not exist.
   *
   * @param {String} actionName - The action name.
   * @return {Action} The action object.
   */
  action(actionName) {
    if (!this._actions[actionName]) {
      this._actions[actionName] = new Action(actionName, this.game)
      this.game.log.trace(`(inputs) Creating new action "${actionName}".`)
    }
    return this._actions[actionName]
  }

  /**
   * Adds a new command reference to an action.
   *
   * @param {String} actionName - The action name.
   * @param {INPUT_DEVICES} device - Input device that will trigger the action.
   * @param {KEY|BUTTON|GAMEPAD|GAMEPAD_AXIS} button - The button or key.
   * @param {Number} [multiplier=1] - A numeric multiplier that will be applied
   *        to the result of the command.
   * @return {Action} The action object.
   */
  add(actionName, device, button, mutiplier) {
    if (!actionName) {
      throw new Error(`You must provide an action name.`)
    }
    
    this.game.log.trace(`(inputs) Adding command "<${device}, ${button}, `+
                        `${multiplier}>" to action "${actionName}".`)
    return this.action(actionName).add(device, button, multiplier)
  }

  /**
   * Removes an action from this manager.
   * 
   * @param {String} actionName - The action name.
   */
  remove(actionName) {
    this.game.log.trace(`(inputs) Removing the action "${actionName}".`)
    delete this._actions[actionName]
  }

  /**
   * If actionName is provided, returns a list of all commands inside the 
   * action. If the actionName is not provided, it will return a list of all 
   * actions and their commands.
   *
   * Example:
   *
   *     inputs.list('reload')
   *     // returns [{device:'keyboard', button:68, multiplier:1},
   *     //          {device:'gamepad', button:5, multiplier:1}]
   *
   *     inputs.list()
   *     // returns {reload: [{device:'keyboard', button:68, multiplier:1},
   *     //                   {device:'gamepad', button:5, multiplier:1}]
   *     //         }
   * 
   * @param {String} [actionName] - The action name.
   * @return {Array|Object} list of commands.
   */
  list(actionName) {
    if (actionName) {
      if (this._actions[actionName]) {
        return this._actions[actionName].list()
      }
    } else {
      let result = {}
      let names = Object.keys(this._actions)
      for (let i=0; i<names.length; i++) {
        let name = names[i]
        result[name] = this._actions[name].list()
      }
    }

    return []
  }

  /**
   * Get the state of an action, returning a numeric value (usually between -1 
   * and 1, but it can be others depending on the multiplying factor).
   *
   * @param {String} actionName - The action name.
   * @return {Number} The input state.
   */
  get(actionName) {
    if (this._actions[actionName]) {
      return this._actions[actionName].get()
    }

    return 0
  }

  /**
   * Remove all commands for a given action.
   * 
   * @param {String} actionName - The action name.
   */
  clear(actionName) {
    this.game.log.trace(`(inputs) Removing commands from action "${actionName}".`)

    if (this._actions[actionName]) {
      this._actions[actionName].clear()
    }
  }

}