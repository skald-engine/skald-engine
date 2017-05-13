import Manager from 'sk/core/Manager' 
import Scene from 'sk/core/Scene' 
import Transition from 'sk/core/Transition' 
import * as utils from 'sk/utils'

/**
 * The scenes manager is the class that controls all the game scenes. It is
 * created by the game and is accessed using `game.scenes`.
 *
 * The scenes manager stores the current scene that is running, receives the
 * next scene which will replace the current one, and apply a transition
 * effect between these two.
 *
 * You can use the `scenes.play` method to set the base scene. This will 
 * replace all scenes by the new one. By using `scenes.push`, you can stack new
 * scenes over the base scene. You can remove the scene at the top of the stack
 * by using the `scenes.pop` method.
 */
export default class ScenesManager extends Manager {
  /**
   * Constructor.
   */
  constructor(game) {
    super(game)

    // Container for the current scene and stacks
    this._currentStage = null

    // Container for the next scene
    this._nextStage = null

    // Current scene
    this._current = null

    // Next scene, only assigned during transitions
    this._next = null

    // Scene stack, over the current
    this._stack = []

    // Transitions binded to scenes on stack
    this._transitions = []
  }

  /**
   * Current scene. Readonly.
   * @type {Scene}
   */
  get current() {
    return this._current
  }

  /**
   * Manager setup, called by the engine.
   */
  setup() {
    utils.profiling.begin('scenes')

    this._currentStage = new PIXI.Container()
    this._nextStage = new PIXI.Container()
    this._game.stage.addChild(this._currentStage)
    this._game.stage.addChild(this._nextStage)

    utils.profiling.end('scenes')
  }

  /**
   * Removes the base scene and all stacked scenes.
   *
   * @param {String|Scene} sceneOrId - Scene or ID for a registered scene.
   * @param {Transition} [transition] - The transition object.
   */
  play(sceneOrId, transition) {
    if (typeof sceneOrId === 'string') {
      sceneOrId = this.game.create.scene(sceneOrId)
    }

    this._validateScene(sceneOrId)
    this._validateTransition(transition)

    this._startPlay(sceneOrId, transition)
  }

  /**
   * Pushes a scene into the canvas, on the top of the base scene. 
   *
   * @param {String|Scene} sceneOrId - Scene or ID for a registered scene.
   * @param {Transition} [transition] - The transition object.
   */
  push(sceneOrId, transition) {
    if (this._next) {
      throw new Error(`Cannot push a scene during a transition of the base`+
                      `scene (i.e., executing scenes.play action).`)
    }

    if (typeof sceneOrId === 'string') {
      sceneOrId = this.game.create.scene(sceneOrId)
    }

    this._validateScene(sceneOrId)
    this._validateTransition(transition)
    this._startPush(sceneOrId, transition)
  }

  /**
   * Removes the scene on the top of the stack. If there is no scene on the 
   * stack, it won't have any effect.
   *
   * @param {Transition} [transition] - The transition object.
   */
  pop(transition) {
    if (this._next) {
      throw new Error(`Cannot pop a scene during a transition of the base`+
                      `scene (i.e., executing scenes.play action).`)
    }

    if (!this._stack.length) {
      return
    }

    this._validateTransition(transition)
    this._startPop(transition)
  }

  /**
   * Whether the manager is performing a transition on the base scene or not.
   *
   * @return {Boolean}
   */
  inTransition() {
    return !!this._next
  }

  /**
   * Update the transitions and the current scene. Called by the engine, do not
   * call it manually.
   *
   * @param {Number} delta - The delta time in seconds.
   */
  update(delta) {
    // Update transitions
    for (let i=this._transitions.length-1; i>=0; i--) {
      let transition = this._transitions[i].transition
      transition.update(delta)

      if (transition.hasFinished()) {
        this._transitions[i].callback()
      }
    }

    // Update the current scene if not in transition
    if (!this._next && this._current) {
      this._current._update(delta)
      this._current.update(delta)
    }
  }

  /**
   * Starts the play action.
   */
  _startPlay(scene, transition) {
    // Finishes current transition if any
    if (this._next) {
      let currentTransition = this._findTransition(this._nextStage)
      this._endPlay(this._next, currentTransition)
    }

    // Assign next scene
    this._next = scene

    // Stop current
    if (this._current) {
      this._current.stop()
      this._game.events.dispatch('scenes.stop', this._current)
    }

    // Add next scene to stage and enter it
    this._nextStage.addChild(this._next.world)
    this._next.enter()
    this._game.events.dispatch('scenes.enter', this._next)

    // Only apply transition if there is a current scene and a transition
    if (this._current && transition) { 
      // setup transition
      transition.setup(this.game, this._currentStage, this._nextStage)
      this._transitions.push({
        transition: transition,
        callback: ()=>this._endPlay(scene, transition)
      })

      // swap scenes if needed
      if (transition.swapScenes) {
        this._game.stage.swapChildren(
          this._currentStage,
          this._nextStage
        )
      }

      // start transition
      transition.start()
    }
      
    // Stop transition if there is no current scene or a transition
    else {
      this._endPlay(scene)
    }
  }

  /**
   * Finishes the play action, called after the transition.
   */
  _endPlay(scene, transition) {
    // Stop transition if any
    if (transition) {
      this._removeTransition(transition)
    }

    // Remove current scene from stage and call leave
    this._game.stage.removeChild(this._currentStage)
    this._game.stage.removeChild(this._nextStage)

    this._currentStage = new PIXI.Container()
    this._nextStage = new PIXI.Container()
    this._game.stage.addChild(this._currentStage)
    this._game.stage.addChild(this._nextStage)

    this._currentStage.addChild(scene.world)

    if (this._current) {
      this._current.leave()
      this._game.events.dispatch('scenes.leave', this._current)
    }

    // Promote next scene to current and start
    this._current = this._next
    this._current.start()
    this._game.events.dispatch('scenes.start', this._current)

    // Clear next and transition
    this._next = null
    this._stack = []
  }

  /**
   * Starts the push action.
   */
  _startPush(scene, transition) {
    this._game.events.dispatch('scenes.push', scene)
    this._stack.push(scene)

    // Add next scene to stage and enter it
    this._currentStage.addChild(scene.world)
    scene.enter()
    this._game.events.dispatch('scenes.enter', scene)

    // Only apply transition if there is a current scene and a transition
    if (transition) { 
      transition.setup(this.game, null, scene.world)
      this._transitions.push({
        transition: transition,
        callback: ()=>this._endPush(scene, transition)
      })
      transition.start()
    }
      
    // Stop transition if there is no current scene or a transition
    else {
      this._endPush(scene, transition)
    }
  }

  /**
   * Finishes the push action, called after the transition.
   */
  _endPush(scene, transition) {
    // Stop transition if any
    if (transition) {
      this._removeTransition(transition)
    }

    scene.start()
    this._game.events.dispatch('scenes.start', scene)
  }

  /**
   * Starts the pop action.
   */
  _startPop(transition) {
    let scene = this._stack.pop()
    this._game.events.dispatch('scenes.pop', scene)

    // Add next scene to stage and enter it
    scene.stop()
    this._game.events.dispatch('scenes.stop', scene)
    // this._currentStage.removeChild(scene.world)

    // Only apply transition if there is a current scene and a transition
    if (transition) { 
      transition.setup(this.game, scene.world, null)
      this._transitions.push({
        transition: transition,
        callback: ()=>this._endPop(scene, transition)
      })
      transition.start()
    }
      
    // Stop transition if there is no current scene or a transition
    else {
      this._endPop(scene, transition)
    }
  }

  /**
   * Finishes the pop action, called after the transition.
   */
  _endPop(scene, transition) {
    // Stop transition if any
    if (transition) {
      this._removeTransition(transition)
    }

    this._currentStage.removeChild(scene)

    scene.leave()
    this._game.events.dispatch('scenes.leave', scene)
  }

  /**
   * Validates if the provided scene is valid.
   */
  _validateScene(scene) {
    if (!scene || !(scene instanceof Scene)) {
      throw new Error(`Invalid scene parameter. You must provide a valid `+
                      `Scene object or valid scene id.`)
    }
  }

  /**
   * Validates if the provided transition is valid.
   */
  _validateTransition(transition) {
    if (transition && !(transition instanceof Transition)) {
      throw new Error(`Invalid transition parameter. If you provide a `+
                      `transition object, it must be a Transition instance.`)
    }
  }

  /**
   * Get the transition attached to a given scene.
   */
  _findTransition(world) {
    for (let i=0; i<this._transitions.length; i++) {
      let transition = this._transitions[i].transition
      if (transition.currentWorld === world ||
          transition.nextWorld === world) {
        return transition
      }
    }
  }

  /**
   * Remove transition from the list.
   */
  _removeTransition(transition) {
    transition.stop()

    for (let i=0; i<this._transitions.length; i++) {
      if (transition === this._transitions[i].transition) {
        this._transitions.splice(i, 1)
        return
      }
    }
  }
}

