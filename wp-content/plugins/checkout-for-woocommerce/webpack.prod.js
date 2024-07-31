const { merge } = require( 'webpack-merge' );
const commonFrontend = require( './webpack.config.js' )[ 0 ];
const commonAdmin = require( './webpack.config.js' )[ 1 ];
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' );
const WebpackShellPluginNext = require( 'webpack-shell-plugin-next' );
const ImageminPlugin = require( 'imagemin-webpack-plugin' ).default;

const version = process.env.npm_package_version;
const productionDir = './dist';
const outPath = `${productionDir}/checkout-for-woocommerce`;
const zipName = `checkout-for-woocommerce-${version}.zip`;

const productionSettings = {
    output: {
        filename: 'js/[name].js',
    },
    plugins: [
        /**
         * Uses Imagemin to compress source images.
         *
         * @see https://www.npmjs.com/package/imagemin-webpack-plugin
         */
        new ImageminPlugin( {
            disable: false,
            test: /\.(jpe?g|png|gif|svg)$/i,
            gifsicle: {
                interlaced: true,
            },
            optipng: {
                optimizationLevel: 3,
            },
            jpegtran: {
                quality: 70,
                progressive: true,
            },
            svgo: null,
        } ),
    ],
    optimization: {
        minimizer: [
            /**
             * Minify CSS.
             *
             * @see https://www.npmjs.com/package/css-minimizer-webpack-plugin
             */
            new CssMinimizerPlugin( {
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true },
                        },
                    ],
                },
            } ),
        ],
    },
};

const frontendConfig = merge( commonFrontend, productionSettings );
const adminConfig = merge( commonAdmin, productionSettings );

// Add the WebpackShellPluginNext to the last configuration
adminConfig.plugins.push(
    new WebpackShellPluginNext( {
        onBuildStart: {
            scripts: [
                `rm -rf ${productionDir} && mkdir -p ${productionDir}`,
            ],
        },
        onAfterDone: {
            scripts: [
                // eslint-disable-next-line max-len
                `npx cpy --parents '.' '!./dist' '!./tests' '!./cypress' '!./bin' '!./assets' '!./**/node_modules' '!./**/phpunit' '!./strauss.phar' '!./cypress.env.json' '!./cypress.overrides.json' ${outPath} && cd ${productionDir} && zip --recurse-paths ${zipName} ./checkout-for-woocommerce`,
            ],
        },
    } ),
);

module.exports = [ frontendConfig, adminConfig ];
