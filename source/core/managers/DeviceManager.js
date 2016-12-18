import Manager from 'core/Manager'

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
  constructor(game) {
    super(game)

    /**
     * Browser user agent, same as `navigator.userAgent`.
     * @type {String}
     */
    this.userAgent = null

    /**
     * Browser name. E.g., `Chrome` or `Safari Mobile`.
     * @type {String}
     */
    this.browser = null

    /**
     * Browser version. Notice that the version format may vary depending on 
     * the browser. E.g., `10.2` or `10.2.1334`
     * @type {String}
     */
    this.browserVersion = null

    /**
     * Name of the browser layout engine. E.g., `EdgeHTML`.
     * @type {String}
     */
    this.browserLayout = null

    /**
     * Operational system name. E.g., `Windows` or `Linux`.
     * @type {String}
     */
    this.os = null

    /**
     * OS version. E.g., `10` or '14.2'.
     * @type {String}
     */
    this.osVersion = null

    /**
     * Device name. E.g., `Nexus` or `Galaxy S4`.
     * @type {String}
     */
    this.device = null

    /**
     * The device manufacturer. E.g., `Google` or `Apple`.
     * @type {String}
     */
    this.manufacturer = null

    /**
     * Whether is running on console or not.
     * @type {Boolean}
     */
    this.console = false

    /**
     * Whether is running on desktop or not.
     * @type {Boolean}
     */
    this.desktop = false

    /**
     * Whether is running on mobile or not.
     * @type {Boolean}
     */
    this.mobile = false

    /**
     * Whether is running on NodeJS or not.
     * @type {Boolean}
     */
    this.node = false

    /**
     * Whether is running on web or not. This is true only when the game is not
     * running on NodeJS.
     * @type {Boolean}
     */
    this.web = false

    /**
     * Whether is running on Chrome desktop or Chrome mobile, or not.
     * @type {Boolean}
     */
    this.chrome = false

    /**
     * Whether is running on Safari desktop or mobile, or not.
     * @type {Boolean}
     */
    this.safari = false

    /**
     * Whether is running on Microsoft Edge browser or not.
     * @type {Boolean}
     */
    this.edge = false

    /**
     * Whether is running on Microsoft Internet Explorer browser or not.
     * @type {Boolean}
     */
    this.ie = false

    /**
     * Whether is running on Opera browser or not.
     * @type {Boolean}
     */
    this.opera = false

    /**
     * Whether is running on Firefox browser or not.
     * @type {Boolean}
     */
    this.firefox = false


    /**
     * Whether is running on Windows or not.
     * @type {Boolean}
     */
    this.windows = false

    /**
     * Whether is running on Linux or not. This may include any version or 
     * distribution of Linux.
     * @type {Boolean}
     */
    this.linux = false

    /**
     * Whether is running on a MacOS or not.
     * @type {Boolean}
     */
    this.macOS = false

    /**
     * Whether is running on an iOS or not.
     * @type {Boolean}
     */
    this.iOS = false

    /**
     * Whether is running on an Android or not.
     * @type {Boolean}
     */
    this.android = false

    /**
     * De device pixel ratio, default for desktop is `1`.
     * @type {Number}
     */
    this.pixelRatio = 1

    /**
     * Whether this environment accepts full screen or not.
     * @type {Boolean}
     */
    this.fullscreen = false

    /**
     * Whether the device supports the HTML5 vibration API or not.
     * @type {Boolean}
     */
    this.vibration = false

    /**
     * Whether the browser supports the HTML canvas tag or not.
     * @type {Boolean}
     */
    this.canvas = false

    /**
     * Whether the browser supports the WebGL or not.
     * @type {Boolean}
     */
    this.webGL = false

    /**
     * Whether the browser HTML5 web workers or not.
     * @type {Boolean}
     */
    this.webWorker = false

    /**
     * Whether the browser supports pointer lock or not.
     * @type {Boolean}
     */
    this.pointerLock = false

    /**
     * Whether the browser supports localStorage or not. Notice that, some 
     * browsers that supports local storage, may disable it on incognito mode.
     * @type {Boolean}
     */
    this.localStorage = false

    /**
     * Whether the browser supports access to a file selected in an `<input>` 
     * tag or not.
     * @type {Boolean}
     */
    this.file = false

    /**
     * If browser supports  the `HTMLAudioElement` (or `window.Audio`) tag.
     * @type {Boolean}
     */
    this.audioData = false

    /**
     * If browser supports web audio API.
     * @type {Boolean}
     */
    this.webAudio = false

    /**
     * If browser supports OGG audio format.
     * @type {Boolean}
     */
    this.ogg = false

    /**
     * If browser supports OPUS audio format.
     * @type {Boolean}
     */
    this.opus = false
    
    /**
     * If browser supports MP3 audio format.
     * @type {Boolean}
     */
    this.mp3 = false
    
    /**
     * If browser supports WAV audio format.
     * @type {Boolean}
     */
    this.wav = false
    
    /**
     * If browser supports M4A audio format.
     * @type {Boolean}
     */
    this.m4a = false
    
    /**
     * If browser supports WEBM audio format.
     * @type {Boolean}
     */
    this.webm = false
    
    /**
     * If browser supports DOLBY audio format.
     * @type {Boolean}
     */
    this.dolby = false

    /**
     * If browser supports OGG video format.
     */
    this.oggVideo = false
    /**
     * If browser supports H264 video format.
     */
    this.h264Video = false
    /**
     * If browser supports MP4 video format.
     */
    this.mp4Video = false
    /**
     * If browser supports WEBM video format.
     */
    this.webmVideo = false
    /**
     * If browser supports VP9 video format.
     */
    this.vp9Video = false
    /**
     * If browser supports HLS video format.
     */
    this.hlsVideo = false
  }

  /**
   * Initialize the manager. This method is called by the engine and shouldn't 
   * be called directly.
   */
  setup() {
    this.userAgent = navigator.userAgent

    this._getBrowser()
    this._getLayoutEngine()
    this._getOS()
    this._getDevice()
    this._getManufacturer()

    this._setPlatformShortcuts()
    this._setFeaturesShortcuts()
  }

  _getBrowser() {
    let ua = this.userAgent
    let guess = BROWSERS.find(guess => {
      return RegExp('\\b'+guess.pattern+'\\b', 'i').exec(ua)
    })

    if (guess) {
      this.browser = guess.label
      this._getBrowserVersion(guess)
    }
  }

  _getBrowserVersion(guess) {
    let ua = this.userAgent
    let browser = this.browser
    let string = RegExp('\\b'+guess.pattern+'(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)[0]
    let version = null

    let r = /[\d.]+/.exec(string)
    if (r) {
      version = r[0]
    }

    this.browserVersion = version
  }

  _getLayoutEngine() {
    let ua = this.userAgent
    let guess = LAYOUTS.find(guess => {
      return RegExp('\\b'+guess.pattern+'\\b', 'i').exec(ua)
    })
    
    if (guess) { this.browserLayout = guess.label }
  }

  _getOS() {
    let ua = this.userAgent
    let guess = OSS.find(guess => {
      return RegExp('\\b'+guess.pattern+'(?:/[\\d.]+|[ \\w.]*)', 'i').test(ua)
    })

    if (guess) {
      this.os = guess.label
      this._getOSVersion(guess)
    }
  }

  _getOSVersion(guess) {
    let ua = this.userAgent
    let os = this.os
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

    this.osVersion = version
  }

  _getDevice() {
    let ua = this.userAgent
    let guess = DEVICES.find(guess => {
      return (
        RegExp('\\b'+guess.pattern+' *\\d+[.\\w_]*', 'i').test(ua) ||
        RegExp('\\b'+guess.pattern+' *\\w+-[\\w]*', 'i').test(ua) ||
        RegExp('\\b'+guess.pattern+'(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').test(ua)
      )
    })

    if (guess) { this.device = guess.label }
  }

  _getManufacturer() {
    let ua = this.userAgent
    let device = this.device
    let guess = MANUFACTURERS.find(guess => {
      return guess.pattern === device ||
             RegExp('^'+guess.pattern, 'i').test(device) ||
             RegExp('\\b'+guess.pattern+'(?:\\b|\\w*\\d)', 'i').test(ua)
    })

    if (guess) { this.manufacturer = guess.label }
  }

  _setPlatformShortcuts() {
    this.chrome = matchAny(this.browser, 'Chrome', 'Chrome Mobile')
    this.safari = matchAny(this.browser, 'Safari')
    this.edge = matchAny(this.browser, 'Edge')
    this.ie = matchAny(this.browser, 'IE')
    this.opera = matchAny(this.browser, 'Opera', 'Opera Mini')
    this.firefox = matchAny(this.browser, 'Firefox', 'Firefox for iOS')

    this.windows = matchAny(this.os, 'Windows')
    this.linux = matchAny(this.os, 'Linux')
    this.macOS = matchAny(this.os, 'Mac OS')
    this.iOS = matchAny(this.os, 'iOs')
    this.android = matchAny(this.os, 'Android')
    this.windowsPhone = matchAny(this.os, 'Window Phone')

    this.node = !!process && !!process.versions && !!process.versions.node
    this.web = !this.node
    this.console = matchAny(this.device, 'PlayStation Vita', 'PlayStation', 
                                         'Wii U', 'WiiU', 'Wii', 'Xbox One',
                                         'Xbox 360', 'Xbox')
    this.desktop = (this.windows||this.linux||this.macOS)&&!this.console
    this.mobile = !this.desktop && !this.console
  }

  _setFeaturesShortcuts() {
    this._checkAudio()
    this._checkVideo()
    this._checkFeatures()
  }

  _checkAudio() {
    let element = document.createElement('audio')
    let canPlay = type => !!element.canPlayType(type).replace(/^no$/, '')

    this.audioData = !!window.Audio
    this.webAudio = !!window.AudioContext || !!window.webkitAudioContext
    
    try {
      if (!!element.canPlayType) {
        this.ogg = canPlay('audio/ogg; codecs="vorbis"')
        this.opus = canPlay('audio/ogg; codecs="opus"') ||
                    canPlay('audio/opus;')
        this.mp3 = canPlay('audio/mpeg;')
        this.wav = canPlay('audio/wav; codecs="1"')
        this.m4a = canPlay('audio/x-m4a') ||
                   canPlay('audio/aac')
        this.webm = canPlay('audio/webm; codecs="vorbis"')
        this.edge = canPlay('audio/mp4; codecs="ec-3"') && this.edge
      }
    } catch(e) {}
  }

  _checkVideo() {
    let element = document.createElement('video')
    let canPlay = type => !!element.canPlayType(type).replace(/^no$/, '')
    
    try {
      if (!!element.canPlayType) {
        this.oggVideo = canPlay('video/ogg; codecs="theora"')
        this.h264Video = canPlay('video/mp4; codecs="avc1.42E01E"')
        this.mp4Video = this.h264Video
        this.webmVideo = canPlay('video/webm; codecs="vp8, vorbis"')
        this.vp9Video = canPlay('video/webm; codecs="vp9"')
        this.hlsVideo = canPlay('application/x-mpegURL; codecs="avc1.42E01E"')
      }
    } catch(e) {}
  }

  _checkFeatures() {
    // vibration
    try {
      navigator.vibrate = navigator.vibrate ||
                          navigator.webkitVibrate ||
                          navigator.mozVibrate ||
                          navigator.msVibrate

      this.vibration = !!navigator.vibrate
    } catch(e) {}

    // webgl support
    try {
      let webglElement = document.createElement('canvas')
      webglElement.screencanvas = false;
      this.webgl = !!(window.WebGLRenderingContext && (
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
    this.fullscreen = !!requestFullscreen.find(x=>fullscreenElement[x])

    // localStorage support
    try {
      localStorage.setItem('asdfklajsdklfjajsdklf', 'meh');
      localStorage.removeItem('asdfklajsdklfjajsdklf');
      this.localStorage = true
    } catch(e) {}

    // other simple detections
    this.canvas = !!window.CanvasRenderingContext2D
    this.webWorker = !!window.Worker
    this.pointerLock = 'pointerLockElement' in document ||
                       'mozPointerLockElement' in document ||
                       'webkitPointerLockElement' in document
    this.file = !!window.File &&
                !!window.FileReader &&
                !!window.FileList &&
                !!window.Blob
    this.pixelRatio = window.devicePixelRatio || 1;
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