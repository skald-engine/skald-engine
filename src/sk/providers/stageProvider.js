const sk = require('sk')

function stageProvider() {
  const pixi = sk.inject('pixi')

  return new pixi.Container()
}

module.exports = stageProvider