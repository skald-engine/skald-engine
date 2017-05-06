import Manager from 'sk/core/Manager' 
import Scene from 'sk/core/Scene' 
import Transition from 'sk/core/Transition' 
import * as utils from 'sk/utils'

export default class ScenesManager extends Manager {
  
  constructor(game) {
    super(game)

    this._current = null
    
    this._next = null
    this._transition = null
    this._isRunning = false
  }

  get current() { return this._current }

  setup() {
    utils.profiling.begin('scenes')
    utils.profiling.end('scenes')
  }

  play(sceneOrId, transition) {
    // Prepare variables
    if (typeof sceneOrId === 'string') {
      sceneOrId = this.game.create.scene(sceneOrId)
    }

    // Validate
    if (!sceneOrId || !(sceneOrId instanceof Scene)) {
      throw new Error(`Invalid scene parameter. You must provide a valid `+
                      `Scene object or valid scene id.`)
    }
    
    if (transition && !(transition instanceof Transition)) {
      throw new Error(`Invalid transition parameter. If you provide a `+
                      `transition object, it must be a Transition instance.`)
    }

    // Stop current transition, if any
    if (this._transition) {
      this._stopTransition()
    }

    // Start transition
    this._next = sceneOrId
    this._transition = transition
    this._startTransition()
  }

  inTransition() {
    return !!this._transition
  }

  update(delta) {
    if (this._transition) {
      this._transition.update(delta)

      if (this._transition.hasFinished()) {
        this._stopTransition()
      }

    } else if (this._current) {
      this._current._update(delta)
      this._current.update(delta)
    }
  }

  _startTransition() {
    // Stop current
    if (this._current) {
      this._current.stop()
      this.game.events.dispatch('scenes.stop', this._current)
    }

    // Add next scene to stage and enter it
    this.game.stage.addChild(this._next.world)
    this._next.enter()
    this.game.events.dispatch('scenes.enter', this._next)

    // Only apply transition if there is a current scene AND a transition
    if (this._current && this._transition) {
      // Setup transition
      let currentWorld = this._current ? this._current.world : null
      let nextWorld = this._next ? this._next.world : null
      this._transition.setup(this.game, currentWorld, nextWorld)

      // Swap scenes if needed
      if (this._transition.swapScenes) {
        this.game.stage.swapChildren(
          this._current.world,
          this._next.world
        )
      }

      // Start transition
      this._transition.start()

    // Stop transition if there is no current scene OR a transition
    } else {
      this._stopTransition()
    }
  }

  _stopTransition() {
    // Stop transition if any
    if (this._transition) {
      this._transition.stop()
    }

    // Remove current scene from stage and call leave
    if (this._current) {
      this.game.stage.removeChild(this._current.world)
      this._current.leave()
      this.game.events.dispatch('scenes.leave', this._current)
    }

    // Promote next scene to current and start
    this._current = this._next
    this._current.start()
    this.game.events.dispatch('scenes.start', this._current)

    // Clear next and transition
    this._next = null
    this._transition = null
  }
}

