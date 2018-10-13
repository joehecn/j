
const webpack = require('webpack')

module.exports = {
  plugins: [
    // superagent
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ]
}
