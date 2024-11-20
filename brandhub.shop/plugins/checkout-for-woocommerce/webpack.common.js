/**
 * External Dependencies
 */
const path = require( 'path' );
const dotenv = require( 'dotenv' );

/**
 * WordPress Dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );
const WebpackNotifierPlugin = require( 'webpack-notifier' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const WebpackRTLPlugin = require( 'webpack-rtl-plugin' );
const { resolve } = require( 'path' );
const BundleOutputPlugin = require( 'webpack-bundle-output' );

dotenv.config();
const ENABLE_WEBPACK_NOTIFICATIONS = ( process?.env?.ENABLE_WEBPACK_NOTIFICATIONS ?? 'true' ) === 'true';

module.exports = {
    ...defaultConfig,
    // stats: 'verbose',
    ...{
        output: {
            path: resolve( process.cwd(), 'build' ),
            filename: 'js/[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: { allowTsInNodeModules: true },
                },
                {
                    test: /\.(webp|png|jpe?g|gif)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext]',
                    },
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    exclude: '/node_modules',
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 3,
                                url: false,
                            },
                        },
                        'postcss-loader',
                        'svg-transform-loader/encode-query',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.svg$/,
                    type: 'asset/inline',
                    use: 'svg-transform-loader',
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]',
                    },
                },
            ],
        },
        stats: {
            ...defaultConfig.stats,
            colors: true,
            errorDetails: true,
        },
        plugins: [
            ...defaultConfig.plugins.filter(
                ( plugin ) => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin',
            ),
            /**
             * Copy source files/directories to a build directory.
             *
             * @see https://www.npmjs.com/package/copy-webpack-plugin
             */
            new CopyPlugin( {
                patterns: [
                    {
                        from: '**/*.{jpg,jpeg,png,gif,svg}',
                        to: 'images/[path][name][ext]',
                        context: path.resolve( process.cwd(), 'sources/images' ),
                        noErrorOnMissing: true,
                    },
                    {
                        from: '**/*.{woff,woff2,eot,ttf,otf}',
                        to: 'fonts/[path][name][ext]',
                        context: path.resolve( process.cwd(), 'sources/fonts' ),
                        noErrorOnMissing: true,
                    },
                    {
                        from: '**/files/*.{woff,woff2,eot,ttf,otf}',
                        to: 'css/files/[name][ext]',
                        context: path.resolve( process.cwd(), 'node_modules/@fontsource' ),
                        noErrorOnMissing: true,
                    },
                    {
                        from: path.resolve( __dirname, 'node_modules/intl-tel-input/build/js/utils.js' ),
                        to: 'js/utils.js',
                    },
                ],
            } ),
            ENABLE_WEBPACK_NOTIFICATIONS && new WebpackNotifierPlugin(
                {
                    alwaysNotify: true,
                },
            ),
            new RemoveEmptyScriptsPlugin(),
            new WebpackRTLPlugin( {
                filename: 'css/[name]-rtl.css',
            } ),
            new BundleOutputPlugin(),
        ],
        optimization: {
            ...defaultConfig.optimization,
            splitChunks: {
                ...defaultConfig.optimization.splitChunks,
                cacheGroups: {
                    ...defaultConfig.optimization.splitChunks.cacheGroups,
                    default: {
                        type: 'javascript/auto',
                        chunks: 'all',
                        minChunks: 1,
                        minSize: 100000,
                        maxSize: 250000,
                        reuseExistingChunk: true,
                        name( module, chunks, cacheGroupKey ) {
                            return `${cacheGroupKey}-${chunks.map( ( item ) => item.name ).join( '-' )}`;
                        },
                    },
                    checkoutStyles: {
                        type: 'css/mini-extract',
                        name: 'checkout-styles',
                        chunks: ( chunk ) => chunk.name === 'checkout',
                        enforce: true,
                    },
                    orderpayStyles: {
                        type: 'css/mini-extract',
                        name: 'order-pay-styles',
                        chunks: ( chunk ) => chunk.name === 'order-pay',
                        enforce: true,
                    },
                    thankyouStyles: {
                        type: 'css/mini-extract',
                        name: 'thank-you-styles',
                        chunks: ( chunk ) => chunk.name === 'thank-you',
                        enforce: true,
                    },
                    sidecartStyles: {
                        type: 'css/mini-extract',
                        name: 'side-cart-styles',
                        chunks: ( chunk ) => chunk.name === 'side-cart',
                        enforce: true,
                    },
                    blocksStyles: {
                        type: 'css/mini-extract',
                        name: 'blocks-styles',
                        chunks: ( chunk ) => chunk.name === 'blocks',
                        enforce: true,
                    },
                    adminStyles: {
                        type: 'css/mini-extract',
                        name: 'admin-styles',
                        chunks: ( chunk ) => chunk.name === 'admin',
                        enforce: true,
                    },
                    adminPlugins: {
                        type: 'css/mini-extract',
                        name: 'admin-plugins-styles',
                        chunks: ( chunk ) => chunk.name === 'admin-plugins',
                        enforce: true,
                    },
                    selectwooStyles: {
                        type: 'css/mini-extract',
                        name: 'selectwoo-styles',
                        chunks: ( chunk ) => chunk.name === 'selectwoo',
                        enforce: true,
                    },
                },
            },
        },
    },
};
