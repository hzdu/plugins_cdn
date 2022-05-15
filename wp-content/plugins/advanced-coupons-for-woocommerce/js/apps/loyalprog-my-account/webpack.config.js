/* eslint-disable */

var path              = require( 'path' );
var UglifyJSPlugin    = require( 'uglifyjs-webpack-plugin' );
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

module.exports = {
    entry   : './src/index.js',
    devtool : 'source-map',
	output  : {
		path 	 : path.resolve( __dirname , 'dist' ),
		filename : 'loyalprog-my-account.js'
	},
    module : {
        rules : [
            {
                test    : /\.js$/,
                exclude : '/node_modules/',
                use     : 'babel-loader'
            },
            {
                test    : /\.scss$/,
                exclude : '/node_modules/',
                use     : ExtractTextPlugin.extract( {
                    use : [ { loader : 'css-loader' , options : { minimize : true } } , 'sass-loader' ]
                } )
            }
        ]
    },
    plugins : [
         new UglifyJSPlugin({sourceMap : true}),
         new ExtractTextPlugin( 'loyalprog-my-account.css' )
    ]
};
