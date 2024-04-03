var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Woo Cart Shipping View.
		FusionPageBuilder.fusion_woo_cart_shipping = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.3
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				attributes.cid    = this.model.get( 'cid' );
				this.values       = atts.values;

				attributes.wooCartShippingAttr = this.buildAttr( atts.values, attributes.cid );
				attributes.cart_shipping_content = '';
				if ( 'undefined' !== typeof atts.query_data  ) {
					attributes.cart_shipping_content = atts.query_data;
				}

				return attributes;
			},

			/**
			 * Builds main attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildAttr: function( values, cid ) {

				// WooFeaturedProductsSliderShortcode attributes.
				var wooCartShippingAttr = {
					class: 'woocommerce-shipping-calculator awb-live fusion-woocommerce-shipping-calculator fusion-woocommerce-shipping-calculator-' + cid,
					style: ''
				};

				wooCartShippingAttr = _.fusionVisibilityAtts( values.hide_on_mobile, wooCartShippingAttr );

				if ( '' !== values[ 'class' ] ) {
					wooCartShippingAttr[ 'class' ] += ' ' + values[ 'class' ];
				}


				if ( '' !== values.id ) {
					wooCartShippingAttr.id = values.id;
				}

				wooCartShippingAttr.style += this.getStyleVariables( values );

				wooCartShippingAttr = _.fusionAnimations( values, wooCartShippingAttr );

				return wooCartShippingAttr;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @param {Object} values - The values.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var customVars = [],
					cssVarsOptions;

				if ( ! this.isDefault( 'field_border_focus_color' ) ) {
					customVars.hover_color = jQuery.AWB_Color( values.field_border_focus_color ).alpha( 0.5 ).toVarOrRgbaString();
				}

				if ( ! this.isDefault( 'field_text_color' ) ) {
					customVars.placeholder_color = jQuery.AWB_Color( values.field_text_color ).alpha( 0.5 ).toVarOrRgbaString();
				}

				cssVarsOptions = [
					'field_bg_color',
					'field_text_color',
					'field_border_color',
					'field_border_focus_color'
				];

				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}

		} );
	} );
}( jQuery ) );
