/**
 * 生产环境配置
 */

// 引入基础配置
const webpackBase = require('./webpack.config.base');
// 引入 webpack
const webpack = require('webpack');
const path = require('path');
//  提取css
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 引入 webpack-merge 插件
const webpackMerge = require('webpack-merge');
// 清理 dist 文件夹
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 引入压缩JS模块
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 合并配置文件
module.exports = webpackMerge(webpackBase, {
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].[hash].css'
    }),
    // 自动清理 dist 文件夹
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),  //根目录
      verbose: true,    //开启在控制台输出信息
      dry: false　　　　  //启用删除文件
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          warnings: false
        }
      })
    ]
  }
});
