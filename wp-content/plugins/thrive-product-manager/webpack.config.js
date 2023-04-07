const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );

function isProduction() {
	return process.env.NODE_ENV === 'production';
}

function envName( extension = 'js' ) {
	return `[name].${isProduction() ? 'min.' : ''}${extension}`;
}

const maybeDevtool = isProduction() ? {} : {
	/*
	|--------------------------------------------------------------------------
	| source maps
	|--------------------------------------------------------------------------
	*/
	devtool: 'cheap-module-source-map',
};

const plugins = [
	/*
	|--------------------------------------------------------------------------
	| RemoveEmptyScripts
	|--------------------------------------------------------------------------
	|
	| Webpack will always generate an empty js file for each css file.
	| This plugin removes that js file.
	|
	*/
	new RemoveEmptyScriptsPlugin(),

	/*
	|--------------------------------------------------------------------------
	| MiniCssExtractPlugin
	|--------------------------------------------------------------------------
	|
	| Needed to extract css in external files.
	|
	*/
	new MiniCssExtractPlugin( {
		filename: '[name].css',
	} ),
];

const webpackConfig = {

	/*
	|--------------------------------------------------------------------------
	| NODE_ENV variable is passed when running webpack. See package.json -> "scripts" field
	|--------------------------------------------------------------------------
	*/
	mode: process.env.NODE_ENV,

	...maybeDevtool,


	/*
	|--------------------------------------------------------------------------
	| Entry - https://webpack.js.org/concepts/entry-points/
	|--------------------------------------------------------------------------
	|
	| Key-value pairs.
	|   key   => output file path without extension
	|   value => array of source files (or a string with a single source file)
	|
	*/
	entry: {
		/*
		|--------------------------------------------------------------------------
		| Javascript files
		|--------------------------------------------------------------------------
		*/
		'js/dist/tpm-admin': './js/admin/index.js',

		/*
		|--------------------------------------------------------------------------
		| CSS files
		|--------------------------------------------------------------------------
		*/
		'css/tpm-admin': './css/scss/admin.scss',
	},

	/*
	|--------------------------------------------------------------------------
	| Output specification
	|--------------------------------------------------------------------------
	|
	| Output specification - it just needs the main path (`path` field).
	| The keys from `entry` are all relative to the `path` field.
	|
	| JS : filename is [name].js for dev, and [name].min.js for production.
	| CSS: file names are controlled from the `MiniCssExtractPlugin` plugin (see `plugins` entry)
	|
	*/
	output: {
		filename: envName(),
		path: __dirname,
	},

	/*
	|--------------------------------------------------------------------------
	| Externals - https://webpack.js.org/configuration/externals/
	|--------------------------------------------------------------------------
	|
	| The externals configuration option provides a way of excluding dependencies from the output bundles.
	| Instead, the created bundle relies on that dependency to be present in the consumer's (any end-user application) environment.
	| This feature is typically most useful to library developers, however there are a variety of applications for it.
	|
	*/
	externals: {
		jquery: 'jQuery',
	},

	module: {
		rules: [
			/*
			|--------------------------------------------------------------------------
			| SCSS files processing
			|--------------------------------------------------------------------------
			*/
			{
				test: /\.scss$/,

				/*
				|--------------------------------------------------------------------------
				| The loaders are run in reverse order
				|--------------------------------------------------------------------------
				*/
				use: [

					/*
					|--------------------------------------------------------------------------
					| Step 3. Extract CSS
					|--------------------------------------------------------------------------
					|
					| Extract CSS-in-JS to external CSS files
					| https://webpack.js.org/plugins/mini-css-extract-plugin/
					|
					*/
					MiniCssExtractPlugin.loader,

					/*
					|--------------------------------------------------------------------------
					| Step 2. CSS-loader
					|--------------------------------------------------------------------------
					|
					| Used to get output from SASS-loader and pass it over to MiniCssExtractPlugin
					| https://webpack.js.org/loaders/css-loader/
					|
					*/
					{
						loader: 'css-loader',
						options: {
							url: false, // this makes sure that css-loader does not try to process url()s
						}
					},

					/*
					|--------------------------------------------------------------------------
					| Step 1. Process scss files using dart-sass
					|--------------------------------------------------------------------------
					|
					| https://webpack.js.org/loaders/sass-loader/
					|
					*/
					{
						loader: 'sass-loader',
						options: {
						}
					},
				],
			},

			/*
			|--------------------------------------------------------------------------
			| Babel configuration
			|--------------------------------------------------------------------------
			|
			| https://webpack.js.org/loaders/babel-loader/
			|
			*/
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {

						/*
						|--------------------------------------------------------------------------
						| Used to increase the speed of `babelifying`
						|--------------------------------------------------------------------------
						*/
						cacheDirectory: true,

						/*
						|--------------------------------------------------------------------------
						| "ENV" preset
						|--------------------------------------------------------------------------
						|
						| https://babeljs.io/docs/en/babel-preset-env
						|
						| Integrates with browserlist and intelligently knows what to transform in order to support all browsers
						| browserlist definition is located in package.json
						|
						*/
						presets: [ '@babel/preset-env' ],

						/*
						|--------------------------------------------------------------------------
						| Babel plugins
						|--------------------------------------------------------------------------
						*/
						plugins: [
							/*
							|--------------------------------------------------------------------------
							| Shorthand props
							|--------------------------------------------------------------------------
							|
							| Allows shorthand method definitions in objects
							|
							| obj = {
							|   fn1() {
							|   }
							| }
							|
							*/
							'@babel/plugin-transform-shorthand-properties',

							/*
							|--------------------------------------------------------------------------
							| Allow obj = { ...obj1, ...obj2 }
							|--------------------------------------------------------------------------
							*/
							'@babel/plugin-proposal-object-rest-spread',

							/*
							|--------------------------------------------------------------------------
							| Allows obj.field1?.field2?.field3
							|--------------------------------------------------------------------------
							*/
							'@babel/plugin-proposal-optional-chaining',

							/*
							|--------------------------------------------------------------------------
							| Allows obj = a ?? 'something'
							|--------------------------------------------------------------------------
							|
							| https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
							|
							*/
							'@babel/plugin-proposal-nullish-coalescing-operator',
						]
					}
				}
			}
		],
	},
	plugins,
};

module.exports = webpackConfig;
