const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: {
    pageA: './src/a.js',
    pageB: './src/b.js',
    vendor: ['lodash']
  },
  output: {
    filename: '[name]-[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize']
        })
      },
      {
        test: /\.less$/, // ['css-loader?minimize&-autoprefixer!postcss-loader', 'less-loader']
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize', 'less-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name]-[contenthash].css'),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name
      }

      return chunk
        .mapModules(m => path.relative(m.context, m.request))
        .join('_')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
  ]
}
