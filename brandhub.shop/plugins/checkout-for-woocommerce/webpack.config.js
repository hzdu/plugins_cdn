/**
 * WordPress Dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const WooCommerceDependencyExtractionWebpackPlugin = require( '@woocommerce/dependency-extraction-webpack-plugin' );
const commonConfig = require( './webpack.common' );

const sourcesDir = './sources';

const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const {
    defaultRequestToExternal,
    defaultRequestToHandle,
    // Other exports if needed
} = require( '@wordpress/dependency-extraction-webpack-plugin/lib/util' );
const { WordPressEnqueueChunksPlugin } = require( 'wordpress-enqueue-chunks-webpack-plugin' );

const safeDependencies = [
    'jquery',
    '@wordpress/api-fetch',
    '@wordpress/dom-ready',
    '@wordpress/hooks',
    '@wordpress/html-entities',
    '@wordpress/i18n',
    '@wordpress/url',
    '@wordpress/data',
    'react',
    'react-dom',
];

module.exports = [
    // Frontend scripts
    {
        ...commonConfig,
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
            'side-cart': {
                import: [
                    `${sourcesDir}/ts/side-cart.tsx`,
                    `${sourcesDir}/scss/frontend/side-cart.scss`,
                ],
            },
        },
        plugins: [
            ...commonConfig.plugins,
            new WordPressEnqueueChunksPlugin( {
                assetsDir: 'build',
                phpScriptDir: 'sources/php',
                context: 'plugin',
                namespace: 'cfw',
                delimiter: '-',
                configName: 'frontend',
            } ),
            !process.env.WP_NO_EXTERNALS && new DependencyExtractionWebpackPlugin( {
                useDefaults: false,
                requestToExternal: ( request ) => {
                    if ( safeDependencies.includes( request ) ) {
                        return defaultRequestToExternal( request );
                    }

                    return undefined;
                },
                requestToHandle: ( request ) => {
                    if ( safeDependencies.includes( request ) ) {
                        return defaultRequestToHandle( request );
                    }

                    return undefined;
                },
            } ),
        ],
    },
    // Admin scripts
    {
        ...commonConfig,
        entry: {
            ...defaultConfig.entry,
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
            blocks: {
                import: [
                    `${sourcesDir}/ts/blocks.tsx`,
                    `${sourcesDir}/scss/blocks.scss`,
                ],
            },
        },
        plugins: [
            ...commonConfig.plugins,
            new WordPressEnqueueChunksPlugin( {
                assetsDir: 'build',
                phpScriptDir: 'sources/php',
                context: 'plugin',
                namespace: 'cfw',
                delimiter: '-',
                configName: 'admin',
            } ),
            !process.env.WP_NO_EXTERNALS && new WooCommerceDependencyExtractionWebpackPlugin(),
        ],
    },
];

module.exports = module.exports.map( ( config ) => {
    config.plugins = config.plugins.map( ( plugin ) => {
        if ( plugin.constructor.name === 'MiniCssExtractPlugin' ) {
            return new plugin.constructor(
                { ...plugin.options, filename: 'css/[name].css' },
            );
        }
        return plugin;
    } );
    return config;
} );
