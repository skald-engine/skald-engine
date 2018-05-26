// Configure PIXI
{
  // deisable pixi log
  const pixi = require('pixi.js')
  pixi.utils.skipHello()

  // We have to force PIXI loader to load audio data as an arraybuffer, in 
  // XHR, so we need to register manually the audio extensions. See
  // https://github.com/englercj/resource-loader/issues/31 for more info. 
  let Resource = PIXI.loaders.Resource
  let audioExtensions = ['ogg', 'opus', 'mp3', 'wav', 'm4a', 'webm', 'ac3']
  for (let i=0; i<audioExtensions.length; i++) {
    let ext = audioExtensions[i]
    Resource.setExtensionLoadType(ext, Resource.LOAD_TYPE.XHR);
    Resource.setExtensionXhrType(ext, Resource.XHR_RESPONSE_TYPE.BUFFER);
  }
}

// Create our engine
{
  const $ = require('sk/$')
  $.createEngine()
}
