const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const WooCommerceDependencyExtractionWebpackPlugin = require( '@woocommerce/dependency-extraction-webpack-plugin' );

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new WooCommerceDependencyExtractionWebpackPlugin(),
	],
	entry: {
		'wpc-wizard': './assets/react/wpc-wizard.js',
	},
	output: {
		...defaultConfig.output,
		path: path.resolve( process.cwd(), 'assets/react/build' ),
	},
};
