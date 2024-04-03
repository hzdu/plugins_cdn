var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Product Images Component View.
		FusionPageBuilder.fusion_tb_woo_product_images = FusionPageBuilder.ElementView.extend( {

			/**
			 * Runs before view DOM is patched.
			 *
			 * @since 3.2
			 * @return {void}
			 */
			beforePatch: function() {
				var element = jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( this.$el.find( '.woocommerce-product-gallery' ) );

				if ( 'undefined' !== typeof element.data( 'flexslider' ) ) {
					element.flexslider( 'destroy' );
				}
			},


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
				this.values = atts.values;
				this.params = this.model.get( 'params' );

				// Any extras that need passed on.
				attributes.cid         = this.model.get( 'cid' );
				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.output      = this.buildOutput( atts );

				return attributes;
			},

			/**
			 * Builds attributes.
			 *
			 * @since  3.2
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-woo-product-images fusion-woo-product-images-' + this.model.get( 'cid' ),
						style: '',
						'data-zoom_enabled': 'yes' === values.product_images_zoom ? 1 : 0,
						'data-photoswipe_enabled': 'woocommerce' === values.product_images_layout ? 1 : 0
					} );

				if ( '' !== values.alignment ) {
					attr.style += 'justify-content:' + values.alignment + ';';
				}

				attr.style += this.getStyleVariables( values );

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
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-product-images' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.markup ) {
					output = atts.query_data.markup;
				}

				return output;
			},


			/**
			 * Gets style variables.
			 *
			 * @since  3.9
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var customVars     = [],
					cssVarsOptions = [];

				if ( ( 'right' === values.thumbnail_position || 'left' === values.thumbnail_position ) ) {
					customVars[ 'thumbnail-width' ] = _.fusionGetValueWithUnit( values.thumbnail_column_width, '%' );
				}

				cssVarsOptions.product_images_width = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left          = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
