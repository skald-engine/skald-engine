const pixi = require('pixi.js')

module.exports = {
  Rect              : require('sk/display/Rect'),
  Circle            : require('sk/display/Circle'),
  Line              : require('sk/display/Line'),
  Text              : require('sk/display/Text'),
  
  BitmapText        : pixi.extras.BitmapText,
  Container         : pixi.Container,
  ParticleContainer : pixi.particles.ParticleContainer,
  Sprite            : pixi.Sprite,
  Graphics          : pixi.Graphics,
}