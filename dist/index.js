
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./node-win-wallpaper.cjs.production.min.js')
} else {
  module.exports = require('./node-win-wallpaper.cjs.development.js')
}
