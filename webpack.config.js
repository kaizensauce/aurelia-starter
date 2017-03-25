var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var AureliaWebpackPlugin = require('aurelia-webpack-plugin');
var project = require('./package.json');

const DEBUG = true;
const title = 'Aurelia Navigation Skeleton';
const baseUrl = '/';
const rootDir = path.resolve();
const srcDir = path.resolve('src');
const outDir = path.resolve('dist');

const aureliaBootstrap = [
    'aurelia-bootstrapper-webpack',
    'aurelia-polyfills',
    'aurelia-pal-browser',
    'regenerator-runtime',
];

const aureliaModules = Object.keys(project.dependencies).filter(dep => dep.startsWith('aurelia-'));

module.exports = {
    //debug: true,
    //devtool: 'source-map',
    entry: {
        'app': [], // <-- this array will be filled by the aurelia-webpack-plugin
        'aurelia-bootstrap': aureliaBootstrap,
        'aurelia-modules': aureliaModules.filter(pkg => aureliaBootstrap.indexOf(pkg) === -1)
    },
    output: {
        path: outDir,
        filename: '[name]-bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/, // include: path.resolve('src'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-1'],
                    plugins: ['transform-decorators-legacy']
                }
            }, {
                test: /\.html$/,
                exclude: /index\.html$/,
                loader: 'html-loader'
            }, {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            }, {
                test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)(\?\S*)?$/,
                loader: 'url-loader?limit=100000&name=[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            regeneratorRuntime: 'regenerator-runtime', // to support await/async syntax
            Promise: 'bluebird', // because Edge browser has slow native Promise object
            $: 'jquery', // because 'bootstrap' by Twitter depends on this
            jQuery: 'jquery', // just an alias
            'window.jQuery': 'jquery' // this doesn't expose jQuery property for window, but exposes it to every module
        }),
        new HtmlWebpackPlugin({
            title: title,
            template: 'index.html',
            chunksSortMode: 'dependency'
        }),
        new AureliaWebpackPlugin({
            root: rootDir,
            src: srcDir,
            title: title,
            baseUrl: baseUrl
        }),
        new CopyWebpackPlugin([{
            from: 'favicon.ico',
            to: 'favicon.ico'
        }]),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['aurelia-modules', 'aurelia-bootstrap']
        }),
        /*new webpack.optimize.UglifyJsPlugin({
            beautify: DEBUG ? true : false,
            mangle: DEBUG ? false : {screw_ie8 : true, keep_fnames: true},
            dead_code: DEBUG ? false : true,
            unused: DEBUG ? false : true,
            deadCode: DEBUG ? false : true,
            comments: DEBUG ? true : false,
            compress: {
                screw_ie8: true,
                keep_fnames: true,
                drop_debugger: false,
                dead_code: false,
                unused: false,
                warnings: DEBUG ? true : false
            }
        }),*/
    ]
};