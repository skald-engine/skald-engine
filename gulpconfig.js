let argv    = require('yargs').argv
let rev     = require('git-rev-sync')
let moment  = require('moment')
let pkg     = require('./package.json')

// Configuration
let config = {
  server: {
    port: 7777
  },
  build: {
    version  : pkg.version,
    revision : rev.short(),
    date     : moment().format('YYYY-MM-DD'),
    file     : `skald.min.js`,
    dependencies: [
      'bower_components/jsen/dist/jsen.min.js',
      'bower_components/pixi.js/dist/pixi.min.js',
    ]
  }
}

// Export
module.exports = config
