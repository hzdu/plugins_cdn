var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Woo Cart Coupons View.
		FusionPageBuilder.fusion_woo_cart_coupons = FusionPageBuilder.ElementView.extend( {

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
				attributes.attr   = this.buildAttr( atts.values );

				attributes.wooCartCouponsAttr = this.buildAttr( atts.values, attributes.cid );
				attributes.cart_coupons_content = '';
				if ( 'undefined' !== typeof atts.query_data  ) {
					attributes.cart_coupons_content = atts.query_data;
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

				// WooCartCoupons attributes.
				var wooCartCoupons = {
					class: 'coupon fusion-woo-cart_coupons fusion-woo-cart_coupons-' + cid,
					style: ''
				};

				wooCartCoupons = _.fusionVisibilityAtts( values.hide_on_mobile, wooCartCoupons );

				if ( '' !== values[ 'class' ] ) {
					wooCartCoupons[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( ! this.isDefault( 'buttons_layout' ) ) {
					wooCartCoupons[ 'class' ] += '  buttons-layout-' + values.buttons_layout;
				}

				if ( 'yes' === values.button_span ) {
					wooCartCoupons[ 'class' ] += '  buttons-span-yes';
				}

				if ( '' !== values.id ) {
					wooCartCoupons.id = values.id;
				}

				wooCartCoupons = _.fusionAnimations( values, wooCartCoupons );

				wooCartCoupons.style += this.getStyleVariables( values );

				return wooCartCoupons;
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
					'field_border_focus_color',
					'stacked_buttons_alignment'
				];

				cssVarsOptions.margin_top           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_margin_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_margin_right  = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}

		} );
	} );
}( jQuery ) );
