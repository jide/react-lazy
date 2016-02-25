var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
      publicPath: '/',
      filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ["stage-0", "react", "es2015"],
          plugins: ["dev"]
        }
      }
    ]
  },
  resolve: {
    root: [
      path.resolve(__dirname)
    ],
    modulesDirectories: ["src", "node_modules", "node_modules/react/lib", "node_modules/fbjs/lib"],
    extensions: ['', '.js', '.jsx']
  },
  debug: true,
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^\.\/ReactCompositeComponent$/, 'ReactCompositeComponent'),
    new webpack.NormalModuleReplacementPlugin(/^\.\/ReactDOMComponent$/, 'ReactDOMComponent')
  ]
};
