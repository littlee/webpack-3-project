var path = require('path')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')

var pages = require('./pages')

function getEntry() {
  var e = {}
  pages.forEach(p => {
    e[p] = `./js/${p}.js`
  })
  e.dev = [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/dev-server'
  ]
  return e
}

function getPlugins() {
  return pages
    .map(page => {
      return new HtmlWebpackPlugin({
        template: `${page}.html`,
        filename: `${page}.html`,
        chunks: ['dev', 'common', page]
      })
    })
    .concat([
      new CleanWebpackPlugin('build'),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common'
      }),
      new CopyWebpackPlugin([
        {
          from: 'images',
          to: 'static/images'
        }
      ])
    ])
}

module.exports = {
  entry: getEntry,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/js/[hash:8].[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: ['transform-class-properties', 'transform-object-rest-spread'],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9'
                  ],
                  flexbox: 'no-2009'
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9'
                  ],
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/images/[hash:8].[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/fonts/[hash:8].[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './build',
    hot: true,
    open: true
  },
  plugins: getPlugins()
}
