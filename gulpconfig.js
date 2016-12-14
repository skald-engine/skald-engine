var argv = require('yargs').argv
var rev = require('git-rev-sync')
var moment = require('moment')

// Initialization
var version = '0.1'
var environment = argv.environment || 'production'
var revision = rev.short()
var date = moment().format('YYYY-MM-DD')
var serverPort = 7777

// Configuration varaibles
module.exports = {version, environment, revision, date, serverPort}
