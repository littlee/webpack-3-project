var path = require('path')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')

var pages = require('./pages')

function getEntry() {
  var e = {}
  pages.forEach(p => {
    e[p] = `./js/${p}.js`
  })
  return e
}

function getPlugins() {
  return pages
    .map(page => {
      return new HtmlWebpackPlugin({
        template: `${page}.html`,
        filename: `${page}.html`,
        chunks: ['common', page]
      })
    })
    .concat([
      new UglifyJsPlugin(),
      new CleanWebpackPlugin('build'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new ExtractTextPlugin('static/css/[hash:8].[name].css'),
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
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
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
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
        })
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
  devtool: 'source-map',
  plugins: getPlugins()
}
