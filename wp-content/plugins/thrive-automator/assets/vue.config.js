const isProduction = process.env.NODE_ENV === 'production';
const wpPot = require( 'wp-pot' );
const svgToMiniDataURI = require( 'mini-svg-data-uri' );
module.exports = {
	filenameHashing: false,
	configureWebpack: {
		devtool: isProduction ? false : 'cheap-source-map',
		optimization: {
			splitChunks: false,
			minimize: isProduction,
		},
		externals: {
			"jquery": "jQuery"
		},
	},

	chainWebpack: config => {
		if ( isProduction ) {
			wpPot( {
				destFile: '../languages/thrive-automator.po',
				package: 'Thrive Automator',
				domain: 'thrive-automator',
				src: [
					'../inc/**/*.php',
				]
			} )
		}

		config.plugins.delete( 'html-admin' );

		const imagesRule = config.module.rule( 'images' );

		imagesRule.set( 'parser', {
			dataUrlCondition: {
				maxSize: 150 * 1024
			}
		} )

		const svgRule = config.module.rule( 'svg' );
		svgRule.type( 'asset/inline' );
		svgRule.set( 'generator', {
			dataUrl: content => {
				content = content.toString();
				return svgToMiniDataURI( content );
			}
		} )
	},
	pages: {
		admin: {
			entry: 'src/admin.js',
			chunks: [ 'admin' ]
		},
	},
};
