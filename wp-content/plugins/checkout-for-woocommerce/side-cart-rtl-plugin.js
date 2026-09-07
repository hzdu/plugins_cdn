/**
 * Custom RTL plugin that only processes side-cart-styles.css
 * Based on @wordpress/scripts RtlCssPlugin
 */
const path = require( 'node:path' );
const rtlcss = require( 'rtlcss' );
const webpack = require( 'webpack' );

const isSideCartCss = ( filename ) =>
	path.extname( filename ) === '.css' && filename.includes( 'side-cart-styles' );

class SideCartRtlPlugin {
	processAssets = ( compilation, callback ) => {
		const chunks = Array.from( compilation.chunks );

		chunks.forEach( ( chunk ) => {
			const files = Array.from( chunk.files );

			files.filter( isSideCartCss ).forEach( ( filename ) => {
				const src = compilation.assets[ filename ].source();
				const dst = rtlcss.process( src );
				const dstFileName = filename.replace( '.css', '-rtl.css' );

				compilation.assets[ dstFileName ] = new webpack.sources.RawSource( dst );
				chunk.files.add( dstFileName );
			} );
		} );

		callback();
	};

	apply( compiler ) {
		compiler.hooks.compilation.tap( 'SideCartRtlPlugin', ( compilation ) => {
			compilation.hooks.processAssets.tapAsync(
				{
					name: 'SideCartRtlPlugin',
					stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
				},
				( chunks, callback ) => this.processAssets( compilation, callback )
			);
		} );
	}
}

module.exports = SideCartRtlPlugin;
