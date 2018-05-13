const pixi = require('pixi.js')

function stageProvider() {
  let stage = new pixi.Container()
  
  stage.views = new pixi.Container()
  stage.modals = new pixi.Container()
  stage.debug = new pixi.Container()

  stage.addChild(stage.views)
  stage.addChild(stage.modals)
  stage.addChild(stage.debug)

  return stage
}

module.exports = stageProvider