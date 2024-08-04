// node module that let's us do file system stuffs...
const path = require('path');
const wplib = [
	'blocks',
	'components',
	'date',
	'editor',
	'element',
	'i18n',
	'utils',
	'data',
   ];

// Webpack expects an exported object with all the configurations, so we export an object here
module.exports = {
    entry: './assets/js/gutenberg/block.js', // Where to find our main js
    output: {
        // where we want our built file to go to and be named
        // I name it index.build.js so I keep index files separate
        filename: 'block.build.js',
        // we're going to put our built file in a './build/' folder
        path: path.resolve( __dirname, 'assets/js/min')
    },

    module: {
        rules: [
            {
                // basically tells webpack to use babel with the correct presets
                test: /\.js$/,
			 loader: 'babel-loader',
			 exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['@babel/preset-env' ]
                }
            }
        ]
    },
    externals: wplib.reduce((externals, lib) => {
	externals[`wp.${lib}`] = {
	  window: ['wp', lib],
	};

	return externals;
   }, {
	'react': 'React',
	'react-dom': 'ReactDOM',
   }),
    // Webpack yells at you if you don't choose a mode...
    mode: 'development',
};