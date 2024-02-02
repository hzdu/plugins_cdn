import webpack from 'webpack';
import * as path from "path";
import * as url from "url";
import {WebpackManifestPlugin} from "webpack-manifest-plugin";

// noinspection JSUnusedGlobalSymbols - Webpack uses this function to get the config.
export default (env, argv) => {
	const currentMode = (argv.mode === 'production') ? 'production' : 'development';
	const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
	const __filename = url.fileURLToPath(import.meta.url);

	return {
		mode: currentMode,
		entry: {
			'admin-customizer': './extras/modules/admin-customizer/admin-customizer.ts',
			'menu-styler-ui': './extras/modules/menu-styler/menu-styler-ui.ts',
			'menu-styler-features': './extras/modules/menu-styler/menu-styler-features.ts',
			'admin-customizer-preview': './extras/modules/admin-customizer/preview-handler.ts',
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].bundle.js',
			chunkLoadingGlobal: 'wsAmeWebpackChunk',
		},
		optimization: {
			runtimeChunk: 'single',
			splitChunks: {
				cacheGroups: {
					customizable: {
						test: /[\\\/]customizable\./,
						name: 'customizable',
						chunks: 'all',
						enforce: true
					},
				}
			}
		},
		cache: {
			type: 'filesystem',
			buildDependencies: {
				config: [__filename]
			}
		},
		plugins: [
			new webpack.DefinePlugin({
				AME_IS_PRODUCTION: JSON.stringify(currentMode === 'production'),
			}),
			//This can be used to automatically find and load the required chunks
			//for each entry point. However, it doesn't handle inter-chunk dependencies.
			new WebpackManifestPlugin({
				fileName: 'build.manifest.json',
				generate: (seed, files) => {
					const entryPoints = new Set()
					files.forEach(
						(file) => ((file.chunk || {})._groups || []).forEach(
							(group) => entryPoints.add(group)
						)
					)
					const entries = [...entryPoints]
					return entries.reduce((acc, entry) => {
						const name = (entry.options || {}).name
							|| (entry.runtimeChunk || {}).name
						const files = [].concat(
							...(entry.chunks || []).map((chunk) => Array.from(chunk.files))
						).filter(Boolean)
						return name ? {...acc, [name]: files} : acc
					}, seed)
				}
			}),
		],
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: {
						loader: 'ts-loader',
						options: {
							configFile: path.resolve(__dirname, 'tsconfig.json')
						}
					},
					exclude: /node_modules/
				}
			]
		},
		resolve: {
			extensions: ['.ts', '.js']
		}
	};
};