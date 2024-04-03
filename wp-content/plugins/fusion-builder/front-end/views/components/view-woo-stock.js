var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Stock Component View.
		FusionPageBuilder.fusion_tb_woo_stock = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.2
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );

				this.values = atts.values;

				// Any extras that need passed on.
				attributes.cid         = this.model.get( 'cid' );
				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.output      = this.buildOutput( atts );

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since  3.2
			 * @param  {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				values.stock_font_size = _.fusionValidateAttrValue( values.stock_font_size, 'px' );
			},

			/**
			 * Builds attributes.
			 *
			 * @since  3.2
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-woo-stock-tb fusion-woo-stock-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				attr.style += this.getStyleVariables();

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			/**
			 * Builds output.
			 *
			 * @since  3.2
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output = '';

				if ( 'undefined' !== typeof atts.markup && 'undefined' !== typeof atts.markup.output && 'undefined' === typeof atts.query_data ) {
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-stock-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_stock ) {
					output = atts.query_data.woo_stock;
				}

				return output;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @return {String}
			 */
			getStyleVariables: function() {
				var cssVarsOptions = [];

				cssVarsOptions = [ 'stock_color' ];

				cssVarsOptions.margin_top      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.stock_font_size = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions );
			}
		} );
	} );
}( jQuery ) );
