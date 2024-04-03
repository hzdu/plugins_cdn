/* eslint-disable no-redeclare */
/* eslint no-mixed-spaces-and-tabs: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Mini Cart Component View.
		FusionPageBuilder.fusion_woo_mini_cart = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.8
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.values = atts.values;
				this.params = this.model.get( 'params' );
				this.extras = atts.extras;

				// Any extras that need passed on.
				attributes.cid = this.model.get( 'cid' );
				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.output = this.buildOutput( atts );

				return attributes;
			},

			/**
			 * Builds attributes.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr = _.fusionVisibilityAtts( values.hide_on_mobile, {
					class: 'awb-woo-mini-cart awb-woo-mini-cart-' + this.model.get( 'cid' ),
					style: ''
				} );

				if ( 'no' !== values.show_buttons ) {
					if ( '' !== values.icon_position ) {
						attr[ 'class' ] += ' icon-position-' + values.icon_position;
					}

					if ( '' !== values.buttons_layout ) {
						attr[ 'class' ] += ' layout-' + values.buttons_layout;
					}

					if ( '' !== values.buttons_stretch ) {
						attr[ 'class' ] += ' button-span-' + values.buttons_stretch;
					}

					if ( '' !== values.link_style ) {
						attr[ 'class' ] += ' link-style-' + values.link_style;
					}

					if ( 'button' === values.link_style ) {
						attr[ 'class' ] += '' !== values.view_cart_button_size ? ' view-cart-button-size-' + values.view_cart_button_size : '';
						attr[ 'class' ] += '' !== values.checkout_button_size ? ' checkout-button-size-' + values.checkout_button_size : '';
					}

				} else {
					attr[ 'class' ] += ' hide-buttons';
				}

				if ( 'yes' !== values.show_subtotal ) {
					attr[ 'class' ] += ' hide-subtotal';
				}

				if ( 'yes' !== values.show_remove_icon ) {
					attr[ 'class' ] += ' hide-remove-icon';
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr.style += this.getStyleVariables( values );

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			/**
			 * Builds output.
			 *
			 * @since  3.8
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output = '';

				if ( 'undefined' !== typeof atts.markup && 'undefined' !== typeof atts.markup.output && 'undefined' === typeof atts.query_data ) {
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.awb-woo-mini-cart' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_mini_cart ) {
					output = atts.query_data.woo_mini_cart;
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
				var customVars = [],
					cssVarsOptions;

				// Product title typography.
				jQuery.each( _.fusionGetFontStyle( 'product_title_font', values, 'object' ), function( rule, value ) {
						customVars[ 'product-title-' + rule ] = value;
				} );

				// Price typography.
				jQuery.each( _.fusionGetFontStyle( 'product_price_font', values, 'object' ), function( rule, value ) {
						customVars[ 'product-price-' + rule ] = value;
				} );

				// Subtotal text typography.
				jQuery.each( _.fusionGetFontStyle( 'subtotal_text_font', values, 'object' ), function( rule, value ) {
						customVars[ 'subtotal-text-' + rule ] = value;
				} );

				// Subtotal amount typography.
				jQuery.each( _.fusionGetFontStyle( 'subtotal_amount_font', values, 'object' ), function( rule, value ) {
						customVars[ 'subtotal-amount-' + rule ] = value;
				} );

				// View cart text typography.
				jQuery.each( _.fusionGetFontStyle( 'view_cart_font', values, 'object' ), function( rule, value ) {
						customVars[ 'view-cart-' + rule ] = value;
				} );

				// Checkout text typography.
				jQuery.each( _.fusionGetFontStyle( 'checkout_font', values, 'object' ), function( rule, value ) {
						customVars[ 'checkout-' + rule ] = value;
				} );

				// View cart button gradient.
				if ( ! this.isDefault( 'view_cart_button_gradient_top' ) || ! this.isDefault( 'view_cart_button_gradient_bottom' ) ) {
					customVars[ 'view-cart-button-background' ]       = values.view_cart_button_gradient_top;
					customVars[ 'view-cart-button-background-image' ] = 'linear-gradient( to top, ' + values.view_cart_button_gradient_bottom + ', ' + values.view_cart_button_gradient_top + ' )';
				}

				// View cart button hover gradient.
				if ( ! this.isDefault( 'view_cart_button_gradient_top_hover' ) || ! this.isDefault( 'view_cart_button_gradient_bottom_hover' ) ) {
					customVars[ 'view-cart-button-hover-background' ]       = values.view_cart_button_gradient_top_hover;
					customVars[ 'view-cart-button-hover-background-image' ] = 'linear-gradient( to top, ' + values.view_cart_button_gradient_bottom_hover + ', ' + values.view_cart_button_gradient_top_hover + ' )';
				}

				// Checkout button gradient.
				if ( ! this.isDefault( 'checkout_button_gradient_top' ) || ! this.isDefault( 'checkout_button_gradient_bottom' ) ) {
					customVars[ 'checkout-button-background' ]      = values.checkout_button_gradient_top;
					customVars[ 'checkout-button-background-image' ] = 'linear-gradient( to top, ' + values.checkout_button_gradient_bottom + ', ' + values.checkout_button_gradient_top + ' )';
				}

				// Checkout button hover gradient.
				if ( ! this.isDefault( 'checkout_button_gradient_top_hover' ) || ! this.isDefault( 'checkout_button_gradient_bottom_hover' ) ) {
					customVars[ 'checkout-button-hover-background' ]       = values.checkout_button_gradient_top_hover;
					customVars[ 'checkout-button-hover-background-image' ] = 'linear-gradient( to top, ' + values.checkout_button_gradient_bottom_hover + ', ' + values.checkout_button_gradient_top_hover + ' )';
				}

				if ( 'floated' === values.buttons_layout && '' !== values.buttons_justify ) {
					customVars[ 'links-justify' ] = values.buttons_justify;
				}

				if ( 'stacked' === values.buttons_layout && '' !== values.buttons_alignment ) {
					customVars[ 'links-alignment' ] = values.buttons_alignment;
				}

				cssVarsOptions = [
					'remove_icon_color',
					'remove_icon_hover_color',
					'remove_icon_bg_color',
					'remove_icon_hover_bg_color',
					'separator_color',
					'product_title_color',
					'product_title_hover_color',
					'product_price_color',
					'subtotal_text_color',
					'subtotal_amount_color',
					'view_cart_link_color',
					'view_cart_link_hover_color',
					'view_cart_button_border_color',
					'view_cart_button_border_color_hover',
					'view_cart_button_color',
					'view_cart_button_color_hover',
					'checkout_link_color',
					'checkout_link_hover_color',
					'checkout_button_border_color',
					'checkout_button_border_color_hover',
					'checkout_button_color',
					'checkout_button_color_hover',
					'product_title_line_height',
					'product_title_text_transform',
					'product_price_line_height',
					'subtotal_alignment',
					'subtotal_amount_line_height',
					'view_cart_line_height',
					'view_cart_text_transform',
					'subtotal_amount_font_size',
					'checkout_line_height',
					'checkout_text_transform'
				];

				cssVarsOptions.margin_top                     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right                   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom                  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left                    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.images_max_width               = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.product_title_font_size        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.product_title_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.product_price_font_size        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.product_price_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.subtotal_text_font_size        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.subtotal_text_line_height      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.subtotal_text_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.subtotal_amount_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.view_cart_font_size            = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.view_cart_letter_spacing       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.view_cart_button_border_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.view_cart_button_border_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.view_cart_button_border_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.view_cart_button_border_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.checkout_font_size             = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.checkout_letter_spacing        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.checkout_button_border_top     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.checkout_button_border_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.checkout_button_border_bottom  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.checkout_button_border_left    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.links_margin_top               = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.links_margin_bottom            = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.links_margin_left              = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.links_margin_right             = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
