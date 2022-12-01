// Imports
const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' );

module.exports = mode => {
    const localModulesDir = path.resolve(__dirname, "node_modules");

    let plugins = [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: `style${(mode !== "development") ? '.min' : ''}.css`
        }),
    ];

    if(mode === "development") {
        plugins.push(new WebpackNotifierPlugin({ alwaysNotify: true }));
    }

    let output = {
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        context: __dirname,
        output: {
            filename: `theme${(mode !== "development") ? ".min" : ''}.js`,
            path: __dirname,
        },
        entry: {
            "default": ["./sources/ts/Theme.ts", "./sources/scss/style.scss"]
        },
        stats: {
            colors: true
        },
        resolve: {
            extensions: ['.scss', '.css', '.ts', '.js'],
            modules: [localModulesDir]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                },
                {
                    test: /\.(scss|css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                minimize: false,
                                url: false
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: plugins,
        optimization: {
            minimizer: [
                new CssMinimizerPlugin(),
            ],
        },

    }

    if (mode === "development") {
        output.devtool = 'source-map';
    }

    return output;
};