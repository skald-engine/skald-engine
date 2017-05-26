import {scene} from 'sk/scene'
import * as utils from 'sk/utils'

export default PreloadDefault = scene({
  initialize: function() {
    let ball = new sk.display.Graphics()
    ball.beginFill(0xEFEFEF)
        .drawCircle(0, 0, 5)
        .endFill()

    let x = this.game.display.halfWidth
    let y = this.game.display.halfHeight

    this.ball1 = ball.clone()
    this.ball1.x = x-20
    this.ball1.y = y

    this.ball2 = ball.clone()
    this.ball2.x = x
    this.ball2.y = y

    this.ball3 = ball.clone()
    this.ball3.x = x+20
    this.ball3.y = y

    this.powered = new sk.display.Text(
      'powered by\nSkald Engine',
      {
        fontSize : 15,
        fill     : 0xEFEFEF,
        align    : 'center'
      }
    )
    this.powered.x = x
    this.powered.y = y*2 - 30
    this.powered.anchor = {x:.5, y:.5}

    this.addStatic(this.ball1)
    this.addStatic(this.ball2)
    this.addStatic(this.ball3)
    this.addStatic(this.powered)

    this.elapsed = 0
  },

  update: function(delta) {
    const loopTime = 2
    this.elapsed = (this.elapsed+delta)%loopTime
    
    let t = this.elapsed
    let y = this.game.display.halfHeight
    this.ball1.y = y - 10*utils.easing.gaussian(t-0.5)
    this.ball2.y = y - 10*utils.easing.gaussian(t-0.75)
    this.ball3.y = y - 10*utils.easing.gaussian(t-1.0)
  }
})