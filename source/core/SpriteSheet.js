export default class SpriteSheet {
  constructor() {

  }

  get texture() {}
  get url() {}
  get numFrames() {}
  get scale() {}
  get size() {}
  get width() {}
  get height() {}

  configure(config) {
    Object.assign(this, config)
  }
  
  getFrame(name) {}
  getFrameMeta(name) {}
}


// Define grid frame by frame (same format as texture packer by default)
// Define regular frame (same format as createjs packer by default)