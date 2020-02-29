const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    'react-test-2': './examples/react/test-2.jsx',
    'react-test-1': './examples/react/test-1.jsx',
    'vue-test-1': './examples/vue/test-1.js',
    'vue-test-2': './examples/vue/test-2.js',
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  devtool: '#source-map',
  watch: true
};