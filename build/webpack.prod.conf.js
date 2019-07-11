const webpack = require('webpack')
const config = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

const useVersioning = true;
const name = "vue-datetimepicker"

config.output.filename = useVersioning ? `${name}.[hash:7].min.js` : `${name}.min.js`
config.output.libraryTarget = 'umd'
config.output.library = 'hotel-date-picker'

config.entry = path.resolve(__dirname, '../src/components/DatePicker.vue')

config.devtool = '#source-map'

config.module.rules.push({
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: "css-loader",
  }),
})

config.plugins = (config.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),

  new ExtractTextPlugin({
    filename: useVersioning ? `${name}.[hash:7].min.css` : `${name}.min.css`,
  }),

  new UglifyJSPlugin({
    sourceMap: true,

    compress: {
      warnings: false,
      drop_debugger: true,
      drop_console: true,
      screw_ie8: true,
      global_defs: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    },

    mangle: {
      screw_ie8: true,
    },

    output: {
      comments: false,
      screw_ie8: true,
    }
  }),

  new webpack.optimize.OccurrenceOrderPlugin(),
])

module.exports = config
