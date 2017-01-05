import Sprite from 'core/entities/Sprite'

export default class AnimatedSprite extends Sprite {
  constructor(game, scene, suppressInitialize=false) {
    super(game, scene, true)

    this._spriteSheet = null
    this._frameRate = null
    this._complete = false
    this._playing = false
  }

  _updateTexture()


  play()
  stop()
  gotoAndPlay()
  gotoAndStop()
  update()
  destroy()
}