module.exports = {
  entry: {
    'react-test-2': './examples/react/test-2.jsx',
    'react-test-1': './examples/react/test-1.jsx',
  },
  module: {
    rules: [{
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