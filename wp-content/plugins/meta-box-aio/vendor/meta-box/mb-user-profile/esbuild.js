const esbuild = require( "esbuild" );

const config = {
	bundle: true,
	minify: true,
};

esbuild.build( {
	...config,
	entryPoints: [ 'assets/js/index.js' ],
	outfile: 'assets/user-profile.js',
} );
