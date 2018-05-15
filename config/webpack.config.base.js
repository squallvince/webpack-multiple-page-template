/**
 * webpack 基础配置
 */
const webpack = require('webpack');

const path = require('path');
// 引入模板插件
const HTMLWebpackPlugin = require('html-webpack-plugin');
//  环境变量
const env = process.env.NODE_ENV;
// 提取js中的css
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 引入config.js
const config = require('./config');
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 入口文件集合
let Entries = {}

// 生成多页面的集合
Object.keys(config.ProjectDirs).map((dir) => {
  config.ProjectDirs[dir].map((page) => {
    const htmlPlugin = new HTMLWebpackPlugin({
      filename: `${dir}/${page}.html`,
      template: path.resolve(__dirname, `../src/${dir}/${page}.html`),
      chunks: [`${dir}/${page}`],
      minify: {
        'removeAttributeQuotes': true,
        'removeComments': true,
        'removeEmptyAttributes': true,
      }
    });
    HTMLPlugins.push(htmlPlugin);
    Entries[`${dir}/${page}`] = path.resolve(__dirname, `../src/${dir}/js/${page}.js`);
  });
});

let cssLoader = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
    }
  },
  'postcss-loader'
];

let publicPath = function getPublicPath() {
  if (env === 'dev') {
    publicPath = '/';
  } else {
    publicPath = config.env[env];
  }
};

module.exports = {
  // 入口文件
  entry: Entries,
  // 启用 sourceMap
  devtool: 'cheap-module-source-map',
  // 输出文件
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../dist'),
    // publicPath: env === 'dev'
    //       ? '/'
    //       : config.env[env]
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.es6'] // 配置简写，配置过后，书写该文件路径的时候可以省略文件后缀
  },
  // 加载器
  module: {
    rules: [{
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'link:href'],
            interpolate: true
          }
        }]
      },
      {
        // 对 css 后缀名进行处理
        test: /\.css$/,
        // 不处理 node_modules 文件中的 css 文件
        exclude: /node_modules/,
        use: env === 'dev'
          ? ['style-loader', 'css-loader', 'postcss-loader']
          : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssLoader
          })
      },
      {
        test: /\.(js|es6)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
          }],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1,
            // 打包生成图片的名字
            name: 'images/[name].[hash].[ext]'
          }
        }],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['url-loader']
      }
    ],
  },
  // 插件
  plugins: [
    // new webpack.BannerPlugin('Created by YourName.')
    // 自动生成 HTML 插件
    ...HTMLPlugins
  ],
}
