/* global wfacpkirkiCssVarFields */
var wfacpkirkiCssVars = {

	/**
	 * Get styles.
	 *
	 * @since 3.0.28
	 * @returns {Object}
	 */
	getStyles: function() {
		var style     = jQuery( '#wfacpkirki-css-vars' ),
			styles    = style.html().replace( ':root{', '' ).replace( '}', '' ).split( ';' ),
			stylesObj = {};

		// Format styles as a object we can then tweak.
		_.each( styles, function( style ) {
			style = style.split( ':' );
			if ( style[0] && style[1] ) {
				stylesObj[ style[0] ] = style[1];
			}
		} );
		return stylesObj;
	},

	/**
	 * Builds the styles from an object.
	 *
	 * @since 3.0.28
	 * @param {Object} vars - The vars.
	 * @returns {string}
	 */
	buildStyle: function( vars ) {
		var style = '';

		_.each( vars, function( val, name ) {
			style += name + ':' + val + ';';
		} );
		return ':root{' + style + '}';
	}
};

jQuery( document ).ready( function() {
	_.each( wfacpkirkiCssVarFields, function( field ) {
		wp.customize( field.settings, function( value ) {
			value.bind( function( newVal ) {
				var val = newVal;
				styles = wfacpkirkiCssVars.getStyles();

				_.each( field.css_vars, function( cssVar ) {
					if ( cssVar[2] && _.isObject( value ) && value[ cssVar[2] ] ) {
						newVal = value[ cssVar[2] ];
					}
					styles[ cssVar[0] ] = cssVar[1].replace( '$', newVal );
				} );
				jQuery( '#wfacpkirki-css-vars' ).html( wfacpkirkiCssVars.buildStyle( styles ) )				;
			} );
		} );
	} );
} );
