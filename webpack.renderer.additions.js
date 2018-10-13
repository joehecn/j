
const webpack = require('webpack')

module.exports = {
  output: {
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: { inline: true }
        }
      }
    ]
  }
  // plugins: [
  //   // superagent
  //   new webpack.DefinePlugin({ "global.GENTLY": false })
  // ]
}
