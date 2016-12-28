import Manager from 'core/Manager' 
import Scene from 'core/Scene' 
import Transition from 'core/Transition' 
import {tryToInstantiate} from 'utils' 

/**
 * This manager handle scenes and transitions.
 *
 * You can use the director manager in two different ways. In the first one, 
 * you can simply play the new scene and provide a transition like this:
 *
 *     let myscene = new MyScene()
 *     let transition = new skald.transitions.FadeIn()
 *
 *     game.director.play(myscene, transition)
 *
 * However, in this way you must control manually the scene instantiations and
 * control how and where to store them. Thus, the second way to use this 
 * manager, is exactly by letting it to handle scene instances and transitions.
 *
 * You can register scenes to the director by providing a unique name to the 
 * scene and its class, like this:
 *
 *     game.director.addScene('menu', MenuScene)
 *     game.director.addScene('level', LevelScene)
 *     game.director.addScene('score', ScoreScene)
 *
 * Notice that, you may provide the instance of your scene, but you don't have
 * to. By passing the class, the director will instantiate the scene 
 * internally. Notice that, the director will call the scene `setup` method 
 * right in this time.
 *
 * After adding scenes, you may register default transitions between scenes:
 *
 *     let transition = new skald.transitions.FadeIn()
 *     game.director.addTransition('menu', 'level', transition)
 *
 * which defines a Fade In transition when menu scene is replaced by the level
 * scene. Again, you don't have instantiate the transition by yourself, 
 * however, you may want to do that in order to customize it with the proper
 * duration and easing functions.
 *
 * With scenes and transitions registered, you can change scenes simply by:
 *
 *     game.director.play('menu')
 *
 * It is important to note that the director will instantiate the scenes and
 * transitions only once. Thus, if your scene is very very large, you may want
 * to instantiate the scene objects only when the scene enter the director and
 * destroy them when the scene leaves the director (see the documentation for 
 * the {@link Scene} class to see how).
 *
 */
export default class DirectorManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._scenes = {}
    this._transitions = {}

    this._currentSceneId = null
    this._currentScene = null
    this._nextSceneId = null
    this._nextScene = null
    this._transition = null
  }


  /**
   * The current scene. Readonly.
   * @type {Scene}
   */
  get currentScene() { return this._currentScene }

  /**
   * The current scene id (if the scene is registered). Readonly.
   * @type {String}
   */
  get currentSceneId() { return this._currentSceneId }

  /**
   * The next scene. This is only set during the transition. Readonly.
   * @type {Scene}
   */
  get nextScene() { return this._nextScene }

  /**
   * The next scene id (if registered). This is only set during the transition.
   * Readonly.
   * @type {String}
   */
  get nextSceneId() { return this._nextSceneId }


  /**
   * Register a scene in the director. This method will log a warn if the
   * you try to add a scene with duplicated ID.
   *
   * @param {String} sceneId - A unique ID for the scene. 
   * @param {Scene} scene - The scene class or instance.
   * @throws {Error} If the scene id is not a string.
   * @throws {Error} If the scene is not provided.
   * @throws {Error} If the scene is not an Scene class or object.
   */
  addScene(sceneId, scene) {
    // scene = tryToInstantiate(scene, this.game)

    if (typeof sceneId !== 'string') {
      throw new Error(`ID must be string, received "${sceneId}" instead.`)
    }

    if (!scene) {
      throw new Error(`Scene "${scene}" not provided.`)
    }

    if (sceneId in this._scenes && this._scenes[sceneId] !== scene) {
      this.game.log.warn(`Replacing the ID "${sceneId}" which is already `+
                         `present in Director and linked to another scene.`)
    }

    // if (!(scene instanceof Scene)) {
    //   throw new Error(`Invalid scene object. If you are creating your own `+
    //                   `scene, you must inherit from skald.Scene.`)
    // }

    this.game.log.trace(`(director) Adding scene "${sceneId}".`)
    this._scenes[sceneId] = scene
    return scene
  }

  /**
   * Get a registered scene. Returns null if sceneId is not registered.
   *
   * @param {String} sceneId - The unique ID for the scene.
   */
  getScene(sceneId) {
    return this._scenes[sceneId]
  }

  /**
   * Remove a scene from the director.
   *
   * @param {String} sceneId - The scene ID.
   */
  removeScene(sceneId) {
    this.game.log.trace(`(director) Removing scene "${sceneId}".`)
    delete this._scenes[sceneId]
    delete this._transitions[sceneId]
    Object.keys(this._transitions).forEach(map => {
      delete map[sceneId]
    })
  }


  /**
   * Register a transition between two scenes. This method will log a warning
   * if any of the scene ids are not registered.
   *
   * Notice that, the transition is unidirectional, going from the 
   * `sceneFromId` scene to `sceneToId` scene.
   *
   * @param {String} sceneFromId - The ID of the first scene.
   * @param {String} sceneToId - The ID of the second scene.
   * @param {Transition} transition - The transition.
   * @throws {Error} If sceneFromId is not a string.
   * @throws {Error} If sceneToId is not a string.
   * @throws {Error} If transition is not provided.
   * @throws {Error} If transition is not an instance of skald.Transition.
   */
  addTransition(sceneFromId, sceneToId, transition) {
    if (typeof sceneFromId !== 'string') {
      throw new Error(`ID must be string, received "${sceneFromId}" instead`)
    }

    if (typeof sceneToId !== 'string') {
      throw new Error(`ID must be string, received "${sceneToId}" instead`)
    }

    if (!transition) {
      throw new Error(`Transition not provided`)
    }

    if (!this._scenes[sceneFromId]) {
      this.game.log.warn(`From scene "${sceneFromid}" not registered in the `+
                         `director.`)
    }

    if (!this._scenes[sceneToId]) {
      this.game.log.warn(`To scene "${sceneToId}" not registered in the `+
                         `director.`)
    }

    try {
      // try to instantiate it as Class
      transition = new transition()
    } catch(e) {
      try {
        // try to call it as a function
        transition = transition()
      } catch(e) {
        // transition is already instantiated
      }
    }

    if (!(transition instanceof Transition)) {
      throw new Error(`Invalid transition object. If you are creating your `+
                      `own scene, you must inherit from skald.Transition.`)
    }


    this.game.log.trace(`(director) Adding transition from "${sceneFromId}" `+
                        `to "${sceneToId}."`)
    transition._game = this.game
    let toMap = this._transitions[sceneFromId]
    if (!toMap) toMap = this._transitions[sceneFromId] = {}
    toMap[sceneToId] = transition
  }

  /**
   * Retrieve a registered transition. Returns null if the transition is not
   * registered.
   *
   * @param {String} sceneFromId - The unique ID for the first scene.
   * @param {String} sceneToId - The unique ID for the second scene.
   */
  getTransition(sceneFromId, sceneToId) {
    let toMap = this._transitions[sceneFromId]
    return (toMap || null) && toMap[sceneToId]
  }

  /**
   * Remove a registered transition.
   * 
   * @param {String} sceneFromId - The unique ID for the first scene.
   * @param {String} sceneToId - The unique ID for the second scene.
   */
  removeTransition(sceneFromId, sceneToId) {
    this.game.log.trace(`(director) Removing transition from `+
                        `"${sceneFromId}" to "${sceneToId}."`)
    if (sceneFromId in this._transitions) {
      delete this._transitions[sceneFromId][sceneToId]
    }
  }


  /**
   * Plays a scene.
   *
   * The scene will be replaced immediately if:
   *
   * - Transition parameter is not provided; and
   * - Transition between the current scene and the provided one is not 
   *   registered in the director.
   *
   * @param {Scene|String} sceneOrId - The ID of the registered scene, or the 
   *        scene object.
   * @param {Transition} [transition] - The transition object.
   * @throws {Error} If scene id is not registered or the scene is not 
   *         provided.
   */
  play(sceneOrId, transition) {
    let scene = null
    let sceneId = null

    // split scene object and scene id
    if (typeof sceneOrId === 'string') {
      sceneId = sceneOrId
      scene = tryToInstantiate(this._scenes[sceneId], this.game)
    } else {
      scene = sceneOrId
    }


    if (!scene || !(scene instanceof Scene)) {
      throw new Error(`Invalid scene parameter. You must provide a valid `+
                      `Scene object or valid scene id.`)
    }

    if (transition && !(transition instanceof Transition)) {
      throw new Error(`Invalid transition parameter. If you provide a `+
                      `transition object, it must be a Transition instance.`)
    }

    // If director is performing a transition already, stop it
    if (this._transition) {
      this._completeTransition()
      this._removeCurrentScene()
      this._promoteNextScene()
    }

    // if scene id is not registered into director, throw an error
    if (!scene) {
      throw new Error(`Invalid scene ID "${sceneId}"`)
    }

    // Block transition to the same scene
    if (scene === this._currentScene) {
      throw new Error(`Can't transition to the same scene`)
    }

    // if transitions is not provided, try to find it in transition map
    if (this._currentSceneId && !transition && !!sceneId &&
        this._currentSceneId in this._transitions) {
      transition = this._transitions[this._currentSceneId][sceneId]
    }

    // if we could not find any transition, replace it immediately
    if (!transition) {
      this.game.events.dispatch('scenestop', this._currentScene)
      this._removeCurrentScene()
      this._setCurrentScene(sceneId, scene)

    } else {
      transition._game = this.game
      this._setNextScene(sceneId, scene)

      if (transition.swapScenes) {
        this._swapScenes()
      }
      this._startTransition(transition)
    }
  }

  /**
   * Returns `true` if the director is performing a transition.
   *
   * @return {Boolean}
   */
  inTransition() {
    return !!this._transition
  }

  /**
   * Update method. Called internally by the engine. Do not call it manually.
   *
   * @param {Number} delta
   */
  update(delta) {
    if (this._transition) {
      this._transition.update(delta)

      if (this._transition.hasFinished()) {
        this._completeTransition()
        this._removeCurrentScene()
        this._promoteNextScene()
      }
    } else if (this._currentScene) {
      this._currentScene.update(delta)
    }
  }

  /**
   * Set the current scene, internally.
   */
  _setCurrentScene(sceneId, scene) {
    this.game.log.trace(`(director) Setting current scene with "${sceneId}"`)

    this.game._stage.addChild(scene._world)
    this._currentSceneId = sceneId
    this._currentScene = scene

    this.game.events.dispatch('sceneenter', this._currentScene)
    this.game.events.dispatch('scenestart', this._currentScene)
  }

  /**
   * Set the next scene, internally.
   */
  _setNextScene(sceneId, scene) {
    this.game.log.trace(`(director) Setting next scene with "${sceneId}"`)

    this.game._stage.addChild(scene._world)
    this._nextSceneId = sceneId
    this._nextScene = scene

    this.game.events.dispatch('sceneenter', this._nextScene)
  }

  /**
   * Swap scenes (put the next scene below the current one).
   */
  _swapScenes() {
    if (this._currentScene && this._nextScene)
    this.game._stage.swapChildren(
      this._currentScene._world,
      this._nextScene._world
    )
  }

  /**
   * Promote the next scene to the current scene.
   */
  _promoteNextScene() {
    if (!this._nextScene) return;
    this.game.log.trace(`(director) Promoting next scene to current scene`)

    this._currentSceneId = this._nextSceneId
    this._currentScene = this._nextScene

    this.game.events.dispatch('scenestart', this._currentScene)
  }

  /**
   * Remove the current scene from the director.
   */
  _removeCurrentScene() {
    if (!this._currentScene) return;
    this.game.log.trace(`(director) Removing current scene "${this._currentSceneId}"`)

    this.game._stage.removeChild(this._currentScene._world)

    this.game.events.dispatch('sceneleave', this._currentScene)

    // only call destroy if the scene were created by the director
    if (this._currentSceneId) {
      this._currentScene.destroy()
    }
    
    this._currentSceneId = null
    this._currentScene = null
  }

  /**
   * Start a transition.
   */
  _startTransition(transition) {
    this.game.events.dispatch('scenestop', this._currentScene)
    transition.setup(this.game, this._currentScene, this._nextScene)
    transition.start()
    this._transition = transition
  }

  /**
   * Complete a transition.
   */
  _completeTransition() {
    transition.complete()
    this._transition = null
  }

}