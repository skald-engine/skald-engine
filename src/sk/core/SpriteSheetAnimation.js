class SpriteSheetAnimation {
  constructor(name, textures, repeat=true, next=null, speed=null) {
    this.name = name
    this.textures = textures
    this.repeat = !!repeat
    this.next = next
    this.speed = speed || 1
  }
}

module.exports = SpriteSheetAnimation