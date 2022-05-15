const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {
    NODE_ENV = 'production'
} = process.env;

module.exports = {
    entry: './src/index.ts',
    mode: NODE_ENV,
    devtool: 'source-map',
    watch: NODE_ENV === 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'edit-advanced-coupon.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new TerserPlugin({ sourceMap: true }),
        ]
    },
    plugins: [
        new TerserPlugin({ sourceMap: true }),
        new MiniCssExtractPlugin({ filename: 'edit-advanced-coupon.css' })
    ]
};
