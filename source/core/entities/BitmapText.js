import Entity from 'core/Entity'

export default class BitmapText extends Entity {
  constructor(game, scene, suppressInitialize) {
    let displayObject = new PIXI.extras.BitmapText()
    super(game, scene, displayObject, suppressInitialize)
  }
}