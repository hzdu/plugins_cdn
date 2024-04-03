/* eslint no-mixed-spaces-and-tabs: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Checkout Payment Component View.
		FusionPageBuilder.fusion_tb_woo_checkout_payment = FusionPageBuilder.ElementView.extend( {

			onInit: function() {
				var params = this.model.get( 'params' );

				// Check for newer margin params.  If unset but regular is, copy from there.
				if ( 'object' === typeof params ) {

					// Split border width into 4.
					if ( 'undefined' === typeof params.button_border_top && 'undefined' !== typeof params.button_border_width && '' !== params.button_border_width ) {
						params.button_border_top    = parseInt( params.button_border_width ) + 'px';
						params.button_border_right  = params.button_border_top;
						params.button_border_bottom = params.button_border_top;
						params.button_border_left   = params.button_border_top;
						delete params.button_border_width;
					}
					this.model.set( 'params', params );
				}
			},

			/**
			 * Modify template attributes.
			 *
			 * @since 3.3
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
				attributes.cid         = this.model.get( 'cid' );
				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.output      = this.buildOutput( atts );

				return attributes;
			},

			/**
			 * Builds attributes.
			 *
			 * @since  3.3
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-woo-checkout-payment-tb fusion-woo-checkout-payment-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( ! this.isDefault( 'button_style' ) ) {

					attr[ 'class' ] += ' button-custom';

					if ( ! this.isDefault( 'button_size' ) ) {
						attr[ 'class' ] += ' button-' + values.button_size;
					}

					if ( ! this.isDefault( 'button_stretch' ) ) {
						attr[ 'class' ] += ' button-stretch';
					}

				}

				if ( '' !== values.button_alignment ) {
					attr[ 'class' ] += ' button-align-' + values.button_alignment;
				}

				attr.style += this.getStyleVariables( values );

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				return attr;
			},

			/**
			 * Builds output.
			 *
			 * @since  3.3
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output = '';

				if ( 'undefined' !== typeof atts.markup && 'undefined' !== typeof atts.markup.output && 'undefined' === typeof atts.query_data ) {
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-checkout-payment-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_checkout_payment ) {
					output = atts.query_data.woo_checkout_payment;
				}

				return output;
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

				jQuery.each( _.fusionGetFontStyle( 'text_typography', values, 'object' ), function( rule, value ) {
					customVars[ 'text_' + rule ] = value;
				} );

				if ( ! this.isDefault( 'label_padding_left' ) ) {
					customVars.label_padding_left = 'max(55px,' +  values.label_padding_left + ')';
				}

				if ( ( 'string' === typeof values.button_gradient_top && '' !==  values.button_gradient_top ) ||  ( 'string' === typeof values.button_gradient_bottom && '' !==  values.button_gradient_bottom ) ) {
					customVars.button_gradient_top     = values.button_gradient_top;
					customVars.button_background_image = 'linear-gradient( to top, ' +  values.button_gradient_bottom + ', ' +  values.button_gradient_top + ' )';
				}

				if ( ( 'string' === typeof values.button_gradient_top_hover && '' !== values.button_gradient_top_hover ) ||  ( 'string' === typeof values.button_gradient_bottom_hover && '' !== values.button_gradient_bottom_hover ) ) {
					customVars.button_gradient_top_hover     = values.button_gradient_top_hover;
					customVars.button_background_image_hover = 'linear-gradient( to top, ' +  values.button_gradient_bottom_hover + ', ' +  values.button_gradient_top_hover + ' )';
				}

				cssVarsOptions = [
					'link_color',
					'link_hover_color',
					'label_bg_color',
					'label_color',
					'label_hover_color',
					'button_color',
					'button_border_color',
					'label_bg_hover_color',
					'payment_box_bg',
					'payment_color',
					'button_color_hover',
					'button_border_color_hover',
					'text_line_height',
					'text_text_transform'
				];


				cssVarsOptions.margin_top             = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left            = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_font_size         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_letter_spacing    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.label_padding_top      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.label_padding_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.label_padding_right    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.payment_padding_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.payment_padding_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.payment_padding_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.payment_padding_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_border_top      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_border_right    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_border_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_border_left     = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
