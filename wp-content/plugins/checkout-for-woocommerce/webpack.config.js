/**
 * External Dependencies
 */
const path = require( 'path' );

/**
 * WordPress Dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );
const { WordPressEnqueueChunksPlugin } = require( 'wordpress-enqueue-chunks-webpack-plugin' );
const WebpackNotifierPlugin = require( 'webpack-notifier' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const WebpackRTLPlugin = require( 'webpack-rtl-plugin' );
const { resolve } = require( 'path' );
const BundleOutputPlugin = require( 'webpack-bundle-output' );
const WooCommerceDependencyExtractionWebpackPlugin = require( '@woocommerce/dependency-extraction-webpack-plugin' );

const sourcesDir = './sources';

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
        entry: {
            ...defaultConfig.entry,
            'cfw-grid': [
                `${sourcesDir}/scss/frontend/cfw-grid.scss`,
            ],
            selectwoo: {
                import: [
                    require.resolve( 'cfwselectwoo/dist/js/selectWoo.full.js' ),
                    require.resolve( 'cfwselectwoo/dist/css/selectWoo.css' ),
                ],
            },
            checkout: {
                import: [
                    require.resolve( 'jquery-first-event/dist/index.js' ),
                    require.resolve( 'EasyTabs/lib/jquery.easytabs.min' ),
                    require.resolve( 'garlicjs/dist/garlic.min.js' ),
                    require.resolve( 'parsleyjs/dist/parsley.min.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/de.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/da.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/es.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/el.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/el.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/fi.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/fi.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/fr.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/it.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/ja.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/nl.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/no.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/hu.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/pl.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sv.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sv.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/he.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/he.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/sk.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sk.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/sl.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sl.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/hu.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/pt-br' ),
                    require.resolve( 'parsleyjs/dist/i18n/pt-pt' ),
                    require.resolve( 'parsleyjs/dist/i18n/zh_cn.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/ru.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/ru.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/lt.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/lt.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/cs.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/cs.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/en.js' ),
                    `${sourcesDir}/ts/checkout.tsx`,
                    `${sourcesDir}/scss/frontend/checkout.scss`,
                ],
            },
            'order-pay': {
                import: [
                    require.resolve( 'jquery-first-event/dist/index.js' ),
                    require.resolve( 'EasyTabs/lib/jquery.easytabs.min' ),
                    require.resolve( 'garlicjs/dist/garlic.min.js' ),
                    require.resolve( 'parsleyjs/dist/parsley.min.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/de.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/da.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/es.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/el.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/el.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/fi.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/fi.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/fr.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/it.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/ja.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/nl.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/no.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/hu.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/pl.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sv.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sv.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/he.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/he.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/sk.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sk.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/sl.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sl.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/hu.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/pt-br' ),
                    require.resolve( 'parsleyjs/dist/i18n/pt-pt' ),
                    require.resolve( 'parsleyjs/dist/i18n/zh_cn.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/ru.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/ru.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/lt.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/lt.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/cs.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/cs.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/en.js' ),
                    `${sourcesDir}/ts/order-pay.tsx`,
                    `${sourcesDir}/scss/frontend/order-pay.scss`,
                ],
            },
            'thank-you': {
                import: [
                    require.resolve( 'jquery-first-event/dist/index.js' ),
                    require.resolve( 'EasyTabs/lib/jquery.easytabs.min' ),
                    require.resolve( 'garlicjs/dist/garlic.min.js' ),
                    require.resolve( 'parsleyjs/dist/parsley.min.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/de.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/da.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/es.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/el.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/el.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/fi.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/fi.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/fr.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/it.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/ja.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/nl.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/no.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/hu.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/pl.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sv.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sv.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/he.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/he.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/sk.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sk.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/sl.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/sl.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/hu.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/pt-br' ),
                    require.resolve( 'parsleyjs/dist/i18n/pt-pt' ),
                    require.resolve( 'parsleyjs/dist/i18n/zh_cn.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/ru.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/ru.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/lt.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/lt.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/cs.js' ),
                    require.resolve( 'parsleyjs/dist/i18n/cs.extra' ),
                    require.resolve( 'parsleyjs/dist/i18n/en.js' ),
                    `${sourcesDir}/ts/thank-you.tsx`,
                    `${sourcesDir}/scss/frontend/thank-you.scss`,
                ],
            },
            'admin-mce': {
                import: `${sourcesDir}/ts/admin/mce.ts`,
                filename: 'js/mce.js',
            },
            admin: [
                `${sourcesDir}/ts/admin/admin.ts`,
                `${sourcesDir}/scss/admin/admin.scss`,
            ],
            'admin-settings': [
                `${sourcesDir}/ts/admin/settings.tsx`,
            ],
            'admin-order-bumps-editor': [
                `${sourcesDir}/ts/admin/order-bumps-editor.tsx`,
            ],
            'admin-plugins': [
                `${sourcesDir}/scss/admin/plugins.scss`,
                require.resolve( 'modaal/dist/js/modaal.min' ),
                `${sourcesDir}/ts/admin/plugins.ts`,
            ],
            'side-cart': {
                import: [
                    `${sourcesDir}/ts/side-cart.tsx`,
                    `${sourcesDir}/scss/frontend/side-cart.scss`,
                ],
            },
            blocks: {
                import: [
                    `${sourcesDir}/ts/blocks.tsx`,
                    `${sourcesDir}/scss/blocks.scss`,
                ],
            },
            'utils-script': {
                import: require.resolve( 'intl-tel-input/build/js/utils.js' ),
                filename: 'js/utils.js',
            },
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
                ],
            } ),
            new WebpackNotifierPlugin(
                {
                    alwaysNotify: true,
                },
            ),
            new RemoveEmptyScriptsPlugin(),
            new WordPressEnqueueChunksPlugin( {
                assetsDir: 'build',
                phpScriptDir: 'sources/php',
                context: 'plugin',
                namespace: 'cfw',
                delimiter: '-',
            } ),
            new WebpackRTLPlugin( {
                filename: 'css/[name]-rtl.css',
            } ),
            new BundleOutputPlugin(),
            !process.env.WP_NO_EXTERNALS && new WooCommerceDependencyExtractionWebpackPlugin(),
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

const cssPluginIndex = module.exports.plugins.findIndex(
    ( e ) => e.constructor.name === 'MiniCssExtractPlugin',
);

module.exports.plugins[ cssPluginIndex ].options.filename = 'css/[name].css';
