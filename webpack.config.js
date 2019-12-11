module.exports = {
  entry: {
    'react-test-2': './react/test-2.jsx',
  },
  module: {
    rules: [
      { 
        test: /\.css$/, 
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx?$/, 
        use: ['babel-loader'], 
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  devtool: '#source-map',
  watch: true
};