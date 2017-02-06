import Manager from 'core/Manager'
import * as utils from 'utils'

/**
 * The device manager handles browser, platform and feature identification. It
 * runs all checkup at its setup, and do not need to check things up again. 
 * Notice that, some values will be null because they do not apply to the user
 * platform. For example, if the user is accessing your game on desktop, the
 * `manufacturer` variables will be `null`.
 *
 * This class is based on three different libraries, check them out if you need
 * more detection than what is provided by this manager:
 *
 * - [Phaser device detection](https://github.com/photonstorm/phaser/blob/master/v2/src/utils/Device.js)
 * - [Platform.js library](https://github.com/bestiejs/platform.js)
 * - [Feature.js library](https://github.com/viljamis/feature.js/)
 */
export default class DeviceManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._userAgent = null
    this._browser = null
    this._browserVersion = null
    this._browserLayout = null
    this._os = null
    this._osVersion = null
    this._device = null
    this._manufacturer = null
    this._console = false

    this._desktop = false
    this._mobile = false
    this._node = false
    this._web = false
    
    this._chrome = false
    this._safari = false
    this._edge = false
    this._ie = false
    this._opera = false
    this._firefox = false

    this._windows = false
    this._linux = false
    this._macOS = false
    this._iOS = false
    this._android = false

    this._pixelRatio = 1
    this._fullscreen = false
    this._vibration = false
    this._canvas = false
    this._webGL = false
    this._webWorker = false
    this._pointerLock = false
    this._localStorage = false

    this._file = false
    this._audioData = false
    this._webAudio = false
    this._ogg = false
    this._opus = false
    this._mp3 = false
    this._wav = false
    this._m4a = false
    this._webm = false
    this._dolby = false

    this._oggVideo = false
    this._h264Video = false
    this._mp4Video = false
    this._webmVideo = false
    this._vp9Video = false
    this._hlsVideo = false
  }


  /**
   * Browser user agent, same as `navigator.userAgent`.
   * @type {String}
   */
  get userAgent() { return this._userAgent }

  /**
   * Browser name. E.g., `Chrome` or `Safari Mobile`.
   * @type {String}
   */
  get browser() { return this._browser }

  /**
   * Browser version. Notice that the version format may vary depending on 
   * the browser. E.g., `10.2` or `10.2.1334`
   * @type {String}
   */
  get browserVersion() { return this._browserVersion }

  /**
   * Name of the browser layout engine. E.g., `EdgeHTML`.
   * @type {String}
   */
  get browserLayout() { return this._browserLayout }

  /**
   * Operational system name. E.g., `Windows` or `Linux`.
   * @type {String}
   */
  get os() { return this._os }

  /**
   * OS version. E.g., `10` or '14.2'.
   * @type {String}
   */
  get osVersion() { return this._osVersion }

  /**
   * Device name. E.g., `Nexus` or `Galaxy S4`.
   * @type {String}
   */
  get device() { return this._device }

  /**
   * The device manufacturer. E.g., `Google` or `Apple`.
   * @type {String}
   */
  get manufacturer() { return this._manufacturer }

  /**
   * Whether is running on console or not.
   * @type {Boolean}
   */
  get console() { return this._console }

  /**
   * Whether is running on desktop or not.
   * @type {Boolean}
   */
  get desktop() { return this._desktop }

  /**
   * Whether is running on mobile or not.
   * @type {Boolean}
   */
  get mobile() { return this._mobile }

  /**
   * Whether is running on NodeJS or not.
   * @type {Boolean}
   */
  get node() { return this._node }

  /**
   * Whether is running on web or not. This is true only when the game is not
   * running on NodeJS.
   * @type {Boolean}
   */
  get web() { return this._web }

  /**
   * Whether is running on Chrome desktop or Chrome mobile, or not.
   * @type {Boolean}
   */
  get chrome() { return this._chrome }

  /**
   * Whether is running on Safari desktop or mobile, or not.
   * @type {Boolean}
   */
  get safari() { return this._safari }

  /**
   * Whether is running on Microsoft Edge browser or not.
   * @type {Boolean}
   */
  get edge() { return this._edge }

  /**
   * Whether is running on Microsoft Internet Explorer browser or not.
   * @type {Boolean}
   */
  get ie() { return this._ie }

  /**
   * Whether is running on Opera browser or not.
   * @type {Boolean}
   */
  get opera() { return this._opera }

  /**
   * Whether is running on Firefox browser or not.
   * @type {Boolean}
   */
  get firefox() { return this._firefox }


  /**
   * Whether is running on Windows or not.
   * @type {Boolean}
   */
  get windows() { return this._windows }

  /**
   * Whether is running on Linux or not. This may include any version or 
   * distribution of Linux.
   * @type {Boolean}
   */
  get linux() { return this._linux }

  /**
   * Whether is running on a MacOS or not.
   * @type {Boolean}
   */
  get macOS() { return this._macOS }

  /**
   * Whether is running on an iOS or not.
   * @type {Boolean}
   */
  get iOS() { return this._iOS }

  /**
   * Whether is running on an Android or not.
   * @type {Boolean}
   */
  get android() { return this._android }

  /**
   * De device pixel ratio, default for desktop is `1`.
   * @type {Number}
   */
  get pixelRatio() { return this._pixelRatio }

  /**
   * Whether this environment accepts full screen or not.
   * @type {Boolean}
   */
  get fullscreen() { return this._fullscreen }

  /**
   * Whether the device supports the HTML5 vibration API or not.
   * @type {Boolean}
   */
  get vibration() { return this._vibration }

  /**
   * Whether the browser supports the HTML canvas tag or not.
   * @type {Boolean}
   */
  get canvas() { return this._canvas }

  /**
   * Whether the browser supports the WebGL or not.
   * @type {Boolean}
   */
  get webGL() { return this._webGL }

  /**
   * Whether the browser HTML5 web workers or not.
   * @type {Boolean}
   */
  get webWorker() { return this._webWorker }

  /**
   * Whether the browser supports pointer lock or not.
   * @type {Boolean}
   */
  get pointerLock() { return this._pointerLock }

  /**
   * Whether the browser supports localStorage or not. Notice that, some 
   * browsers that supports local storage, may disable it on incognito mode.
   * @type {Boolean}
   */
  get localStorage() { return this._localStorage }

  /**
   * Whether the browser supports access to a file selected in an `<input>` 
   * tag or not.
   * @type {Boolean}
   */
  get file() { return this._file }

  /**
   * If browser supports  the `HTMLAudioElement` (or `window.Audio`) tag.
   * @type {Boolean}
   */
  get audioData() { return this._audioData }

  /**
   * If browser supports web audio API.
   * @type {Boolean}
   */
  get webAudio() { return this._webAudio }

  /**
   * If browser supports OGG audio format.
   * @type {Boolean}
   */
  get ogg() { return this._ogg }

  /**
   * If browser supports OPUS audio format.
   * @type {Boolean}
   */
  get opus() { return this._opus }

  /**
   * If browser supports MP3 audio format.
   * @type {Boolean}
   */
  get mp3() { return this._mp3 }

  /**
   * If browser supports WAV audio format.
   * @type {Boolean}
   */
  get wav() { return this._wav }

  /**
   * If browser supports M4A audio format.
   * @type {Boolean}
   */
  get m4a() { return this._m4a }

  /**
   * If browser supports WEBM audio format.
   * @type {Boolean}
   */
  get webm() { return this._webm }

  /**
   * If browser supports DOLBY audio format.
   * @type {Boolean}
   */
  get dolby() { return this._dolby }

  /**
   * If browser supports OGG video format.
   */
  get oggVideo() { return this._oggVideo }
  /**
   * If browser supports H264 video format.
   */
  get h264Video() { return this._h264Video }
  /**
   * If browser supports MP4 video format.
   */
  get mp4Video() { return this._mp4Video }
  /**
   * If browser supports WEBM video format.
   */
  get webmVideo() { return this._webmVideo }
  /**
   * If browser supports VP9 video format.
   */
  get vp9Video() { return this._vp9Video }
  /**
   * If browser supports HLS video format.
   */
  get hlsVideo() { return this._hlsVideo }


  /**
   * Initialize the manager. This method is called by the engine and shouldn't 
   * be called directly.
   */
  setup() {
    utils.profiling.begin('device')
    this._userAgent = navigator.userAgent

    this._getBrowser()
    this._getLayoutEngine()
    this._getOS()
    this._getDevice()
    this._getManufacturer()

    this._setPlatformShortcuts()
    this._setFeaturesShortcuts()
    utils.profiling.end('device')
  }

  _getBrowser() {
    utils.profiling.begin('browser')
    let ua = this._userAgent
    let guess = BROWSERS.find(guess => {
      return RegExp('\\b'+guess.pattern+'\\b', 'i').exec(ua)
    })

    if (guess) {
      this._browser = guess.label
      this._getBrowserVersion(guess)
    }
    utils.profiling.end('browser')
  }

  _getBrowserVersion(guess) {
    utils.profiling.begin('browserVersion')
    let ua = this._userAgent
    let browser = this._browser
    let string = RegExp('\\b'+guess.pattern+'(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)[0]
    let version = null

    let r = /[\d.]+/.exec(string)
    if (r) {
      version = r[0]
    }

    this._browserVersion = version
    utils.profiling.end('browserVersion')
  }

  _getLayoutEngine() {
    utils.profiling.begin('layoutEngine')
    let ua = this._userAgent
    let guess = LAYOUTS.find(guess => {
      return RegExp('\\b'+guess.pattern+'\\b', 'i').exec(ua)
    })
    
    if (guess) { this._browserLayout = guess.label }
    utils.profiling.end('layoutEngine')
  }

  _getOS() {
    utils.profiling.begin('os')
    let ua = this._userAgent
    let guess = OSS.find(guess => {
      return RegExp('\\b'+guess.pattern+'(?:/[\\d.]+|[ \\w.]*)', 'i').test(ua)
    })

    if (guess) {
      this._os = guess.label
      this._getOSVersion(guess)
    }
    utils.profiling.end('os')
  }

  _getOSVersion(guess) {
    utils.profiling.begin('osVersion')
    let ua = this._userAgent
    let os = this._os
    let string = RegExp('\\b'+guess.pattern+'(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)[0]
    let version = null

    if (os === 'Windows') {
      let r = /[\d.]+$/.exec(string)
      if (r) version = WINDOWS_VERSION_NAMES[r[0]]
    
    } else if (os === 'iOS' || os === 'Mac OS X') {
      let r = /(\d_?\.?)+/.exec(string)
      if (r) version = r[0].replace(/\_/g, '.')
    
    } else if (os === 'Android' || os === 'Windows Phone') {
      let r = /[\d.]+/.exec(string)
      if (r) version = r[0]
    }

    this._osVersion = version
    utils.profiling.end('osVersion')
  }

  _getDevice() {
    utils.profiling.begin('device')
    let ua = this._userAgent
    let guess = DEVICES.find(guess => {
      return (
        RegExp('\\b'+guess.pattern+' *\\d+[.\\w_]*', 'i').test(ua) ||
        RegExp('\\b'+guess.pattern+' *\\w+-[\\w]*', 'i').test(ua) ||
        RegExp('\\b'+guess.pattern+'(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').test(ua)
      )
    })

    if (guess) { this._device = guess.label }
    utils.profiling.end('device')
  }

  _getManufacturer() {
    utils.profiling.begin('manufacturer')
    let ua = this._userAgent
    let device = this._device
    let guess = MANUFACTURERS.find(guess => {
      return guess.pattern === device ||
             RegExp('^'+guess.pattern, 'i').test(device) ||
             RegExp('\\b'+guess.pattern+'(?:\\b|\\w*\\d)', 'i').test(ua)
    })

    if (guess) { this._manufacturer = guess.label }
    utils.profiling.end('manufacturer')
  }

  _setPlatformShortcuts() {
    utils.profiling.begin('platform')
    this._chrome = matchAny(this._browser, 'Chrome', 'Chrome Mobile')
    this._safari = matchAny(this._browser, 'Safari')
    this._edge = matchAny(this._browser, 'Edge')
    this._ie = matchAny(this._browser, 'IE')
    this._opera = matchAny(this._browser, 'Opera', 'Opera Mini')
    this._firefox = matchAny(this._browser, 'Firefox', 'Firefox for iOS')

    this._windows = matchAny(this._os, 'Windows')
    this._linux = matchAny(this._os, 'Linux')
    this._macOS = matchAny(this._os, 'Mac OS')
    this._iOS = matchAny(this._os, 'iOs')
    this._android = matchAny(this._os, 'Android')
    this._windowsPhone = matchAny(this._os, 'Window Phone')

    this._node = !!process && !!process.versions && !!process.versions.node
    this._web = !this._node
    this._console = matchAny(this._device, 'PlayStation Vita', 'PlayStation', 
                                         'Wii U', 'WiiU', 'Wii', 'Xbox One',
                                         'Xbox 360', 'Xbox')
    this._desktop = (this._windows||this._linux||this._macOS)&&!this._console
    this._mobile = !this._desktop && !this._console
    utils.profiling.end('platform')
  }

  _setFeaturesShortcuts() {
    utils.profiling.begin('features')
    this._checkAudio()
    this._checkVideo()
    this._checkFeatures()
    utils.profiling.end('features')
  }

  _checkAudio() {
    utils.profiling.begin('audio')
    let element = document.createElement('audio')
    let canPlay = type => !!element.canPlayType(type).replace(/^no$/, '')

    this._audioData = !!window.Audio
    this._webAudio = !!window.AudioContext || !!window.webkitAudioContext
    
    try {
      if (!!element.canPlayType) {
        this._ogg = canPlay('audio/ogg; codecs="vorbis"')
        this._opus = canPlay('audio/ogg; codecs="opus"') ||
                    canPlay('audio/opus;')
        this._mp3 = canPlay('audio/mpeg;')
        this._wav = canPlay('audio/wav; codecs="1"')
        this._m4a = canPlay('audio/x-m4a') ||
                   canPlay('audio/aac')
        this._webm = canPlay('audio/webm; codecs="vorbis"')
        this._dolby = canPlay('audio/mp4; codecs="ec-3"') && this._edge
      }
    } catch(e) {}
    utils.profiling.end('audio')
  }

  _checkVideo() {
    utils.profiling.begin('video')
    let element = document.createElement('video')
    let canPlay = type => !!element.canPlayType(type).replace(/^no$/, '')
    
    try {
      if (!!element.canPlayType) {
        this._oggVideo = canPlay('video/ogg; codecs="theora"')
        this._h264Video = canPlay('video/mp4; codecs="avc1.42E01E"')
        this._mp4Video = this._h264Video
        this._webmVideo = canPlay('video/webm; codecs="vp8, vorbis"')
        this._vp9Video = canPlay('video/webm; codecs="vp9"')
        this._hlsVideo = canPlay('application/x-mpegURL; codecs="avc1.42E01E"')
      }
    } catch(e) {}
    utils.profiling.end('video')
  }

  _checkFeatures() {
    utils.profiling.begin('general')
    // vibration
    try {
      navigator.vibrate = navigator.vibrate ||
                          navigator.webkitVibrate ||
                          navigator.mozVibrate ||
                          navigator.msVibrate

      this._vibration = !!navigator.vibrate
    } catch(e) {}

    // webgl support
    try {
      let webglElement = document.createElement('canvas')
      webglElement.screencanvas = false;
      this._webgl = !!(window.WebGLRenderingContext && (
                       webglElement.getContext('webgl') ||
                       webglElement.getContext('experimental-webgl')
                     ))
    } catch(e) {}

    // fullscreen support
    let requestFullscreen = [
      'requestFullscreen',
      'requestFullScreen',
      'webkitRequestFullscreen',
      'webkitRequestFullScreen',
      'msRequestFullscreen',
      'msRequestFullScreen',
      'mozRequestFullScreen',
      'mozRequestFullscreen'
    ]
    let fullscreenElement = document.createElement('div')
    this._fullscreen = !!requestFullscreen.find(x=>fullscreenElement[x])

    // localStorage support
    try {
      localStorage.setItem('asdfklajsdklfjajsdklf', 'meh');
      localStorage.removeItem('asdfklajsdklfjajsdklf');
      this._localStorage = true
    } catch(e) {}

    // other simple detections
    this._canvas = !!window.CanvasRenderingContext2D
    this._webWorker = !!window.Worker
    this._pointerLock = 'pointerLockElement' in document ||
                       'mozPointerLockElement' in document ||
                       'webkitPointerLockElement' in document
    this._file = !!window.File &&
                !!window.FileReader &&
                !!window.FileList &&
                !!window.Blob
    this._pixelRatio = window.devicePixelRatio || 1;
    utils.profiling.end('general')
  }
}



function matchAny(value, ...others) {
  return others.some(other=>other===value)
}

function I(label, pattern) {
  return {
    label   : label,
    pattern : pattern || label.replace(/([ -])(?!$)/g, '$1?')
  }
}

const LAYOUTS = [
  I('EdgeHTML', 'Edge'),
  I('Trident'),
  I('WebKit', 'AppleWebKit'),
  I('iCab'),
  I('Presto'),
  I('NetFront'),
  I('Tasman'),
  I('KHTML'),
  I('Gecko'),
]

const BROWSERS = [
  I('Adobe AIR'),
  I('Arora'),
  I('Avant Browser'),
  I('Breach'),
  I('Camino'),
  I('Electron'),
  I('Epiphany'),
  I('Fennec'),
  I('Flock'),
  I('Galeon'),
  I('GreenBrowser'),
  I('iCab'),
  I('Iceweasel'),
  I('K-Meleon'),
  I('Konqueror'),
  I('Lunascape'),
  I('Maxthon'),
  I('Edge'),
  I('Midori'),
  I('Nook Browser'),
  I('PaleMoon'),
  I('PhantomJS'),
  I('Raven'),
  I('Rekonq'),
  I('RockMelt'),
  I('Samsung Internet', 'SamsungBrowser'),
  I('SeaMonkey'),
  I('Silk', '(?:Cloud9|Silk-Accelerated)'),
  I('Sleipnir'),
  I('SlimBrowser'),
  I('SRWare Iron', 'Iron'),
  I('Sunrise'),
  I('Swiftfox'),
  I('Waterfox'),
  I('WebPositive'),
  I('Opera Mini'),
  I('Opera Mini', 'OPiOS'),
  I('Opera'),
  I('Opera', 'OPR'),
  I('Chrome'),
  I('Chrome Mobile', '(?:CriOS|CrMo)'),
  I('Firefox', '(?:Firefox|Minefield)'),
  I('Firefox for iOS', 'FxiOS'),
  I('IE', 'IEMobile'),
  I('IE', 'MSIE'),
  I('Safari'),
]

const DEVICES = [
  I('BlackBerry', 'BB10'),
  I('BlackBerry'),
  I('Galaxy S', 'GT-I9000'),
  I('Galaxy S2', 'GT-I9100'),
  I('Galaxy S3', 'GT-I9300'),
  I('Galaxy S4', 'GT-I9500'),
  I('Galaxy S5', 'SM-G900'),
  I('Galaxy S6', 'SM-G920'),
  I('Galaxy S6 Edge', 'SM-G925'),
  I('Galaxy S7', 'SM-G930'),
  I('Galaxy S7 Edge', 'SM-G935'),
  I('Google TV'),
  I('Lumia'),
  I('iPad'),
  I('iPod'),
  I('iPhone'),
  I('Kindle'),
  I('Kindle Fire', '(?:Cloud9|Silk-Accelerated)'),
  I('Nexus'),
  I('Nook'),
  I('PlayBook'),
  I('PlayStation Vita'),
  I('PlayStation'),
  I('TouchPad'),
  I('Transformer'),
  I('Wii U', 'WiiU'),
  I('Wii'),
  I('Xbox One'),
  I('Xbox 360', 'Xbox'),
  I('Xoom'),
]

const MANUFACTURERS = [
  I('Apple', 'iPad'),
  I('Apple', 'iPhone'),
  I('Apple', 'iPod'),
  I('Archos'),
  I('Amazon', 'Kindle'),
  I('Asus', 'Transformer'),
  I('Barnes & Noble', 'Nook'),
  I('BlackBerry', 'PlayBook'),
  I('Google', 'Google TV'),
  I('Google', 'Nexus'),
  I('HP', 'TouchPad'),
  I('HTC'),
  I('LG'),
  I('Microsoft', 'Xbox'),
  I('Motorola', 'Xoom'),
  I('Nintendo', 'Wii'),
  I('Nokia', 'Lumia'),
  I('Samsung', 'Galaxy'),
  I('Sony', 'PlayStation'),
]

const OSS = [
  I('Windows Phone'),
  I('Android'),
  I('CentOS'),
  I('Chrome OS', 'CrOS'),
  I('Debian'),
  I('Fedora'),
  I('FreeBSD'),
  I('Gentoo'),
  I('Haiku'),
  I('Kubuntu'),
  I('Linux Mint'),
  I('OpenBSD'),
  I('Red Hat'),
  I('SuSE'),
  I('Ubuntu'),
  I('Xubuntu'),
  I('Cygwin'),
  I('Symbian OS'),
  I('hpwOS'),
  I('webOS'),
  I('Tablet OS'),
  I('Tizen'),
  I('Linux'),
  I('iOS'),
  I('iOS', 'iPhone OS'),
  I('iOS', 'iPad;'),
  I('iOS', 'like Mac OS'),
  I('Mac OS'),
  I('Macintosh'),
  I('Mac'),
  I('Windows')
]

const WINDOWS_VERSION_NAMES = {
  '10.0' : '10',
  '6.4'  : '10 Technical Preview',
  '6.3'  : '8.1',
  '6.2'  : '8',
  '6.1'  : 'Server 2008 R2 / 7',
  '6.0'  : 'Server 2008 / Vista',
  '5.2'  : 'Server 2003 / XP 64-bit',
  '5.1'  : 'XP',
  '5.01' : '2000 SP1',
  '5.0'  : '2000',
  '4.0'  : 'NT',
  '4.90' : 'ME'
}