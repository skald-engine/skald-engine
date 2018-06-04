const path = require('path')
const webpack = require('webpack')
const rev = require('git-rev-sync')
const pkg = require('../package.json')

const leftPad = (str, pad) => {
  str = `${str}`
  return pad.substring(0, pad.length - str.length) + str
}

const now = new Date()
const day = leftPad(now.getDate(), '00')
const month = now.getMonth() + 1
const year = now.getFullYear()

module.exports = {
  entry: './src/index.js',
  mode: 'development',

  performance: {
    hints: false
  },

  output: {
    path     : path.resolve(__dirname, '../build/dist/'),
    filename : 'skald.js'
  },

  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },

  optimization: {
    minimize: false
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        VERSION  : JSON.stringify(pkg.version),
        REVISION : JSON.stringify(rev.short()),
        DATE     : JSON.stringify(`${year}-${month}-${day}`),
      }
    })
  ],
  
  watchOptions: {
    poll: true
  },
}




