module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],            
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    // other plugins,
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
    }),
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
output: {
  path: __dirname + '/dist',
  publicPath: '/',
  filename: 'bundle.js'
},
devServer: {
  contentBase: './dist'
}
};
