module.exports = {
  entry: {
    'index.min': './index.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/build',
    library: {
      root: 'SimpleCrop',
      commonjs: 'simplecrop',
      amd: 'simplecrop'
    },
    libraryTarget: 'umd'
  },
  devtool: '#source-map',
  watch: true
};