var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        './src/main/js/main'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/main/html/index.html'
        })
    ],
    module: {
        loaders: [
            {test: /\.css$/, loaders: ['style', 'css']},
            {test: /\.less/, loaders: ["style", "css", "less"]},
            {test: /\.(jpg|ttf|eot|svg|woff|woff2)$/, loader: "file-loader"},
            {test: /\.js$/, loaders: ['babel'], include: path.join(__dirname, 'src/main/js')}
        ]
    },
    devServer: {
        contentBase: './target',
        historyApiFallback: true,
        hot: true
    }
};