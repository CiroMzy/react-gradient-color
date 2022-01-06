/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devConfig = {
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, path.resolve(__dirname, "docs")),
    historyApiFallback: true,
    open: true,
    hot: true,
    port: 9002
  },
  mode: 'development',
  devtool: "sourceMap",
  entry: {
    gradientColor: path.resolve(__dirname, 'docs/index.jsx'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'docs'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "gradientColorPicker",
      template: path.resolve(__dirname,'docs/index.html'), // 源模板文件
      filename: "index.html"
    })

  ]
};

module.exports = devConfig;
