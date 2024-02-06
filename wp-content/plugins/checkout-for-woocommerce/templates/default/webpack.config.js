const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );
const WebpackRTLPlugin = require( 'webpack-rtl-plugin' );

module.exports = {
    ...defaultConfig,
    ...{
        plugins: [
            ...defaultConfig.plugins,
            new RemoveEmptyScriptsPlugin(),
            new WebpackRTLPlugin( {
                filename: '[name]-rtl.css',
            } ),
        ],
    },
};
