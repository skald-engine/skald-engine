const path = require('path')
const webpack = require('webpack')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const rev = require('git-rev-sync')

const pkg = require('../package.json')

module.exports = {
  entry: './source/index.js',
  output: {
    path: path.resolve(__dirname, '../build/dist/'),
    filename: 'skald.js'
  },

  resolve: {
    modules: [path.resolve('./source')]
  },

  plugins: [
    new MinifyPlugin(),
    new CopyPlugin(
      [{
        from : path.resolve(__dirname, '../build/dist/skald.js'), 
        to   : path.resolve(__dirname, '../tests/features/build/skald.js')
      }]
    )
  ]
}

const now = new Date()
const day = now.getDate()
const month = now.getMonth() + 1
const year = now.getFullYear()

new webpack.DefinePlugin({
  'process.env': {
    VERSION  : pkg.version,
    REVISION : rev.short(),
    DATE     : `${year}-${month}-${day}`,
  }
})