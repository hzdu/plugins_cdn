var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Woo Featured Product Slider View.
		FusionPageBuilder.fusion_woo_cart_totals = FusionPageBuilder.ElementView.extend( {


			afterPatch: function() {
				this._refreshJs();
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
				attributes.cid    = this.model.get( 'cid' );

				this.values = atts.values;

				attributes.wooCartTotalsWrapper = this.buildWrapperAttr( atts.values, attributes.cid );

				attributes.cart_totals = '';
				if ( 'undefined' !== typeof atts.query_data  ) {
					attributes.cart_totals = atts.query_data;
				}

				return attributes;
			},

			/**
			 * Builds wrapper attributes.
			 *
			 * @since 3.3
			 * @param {Object} values - The values.
			 * @return {Object}
			 */
			buildWrapperAttr: function( values, cid ) {

				var attributes = {
					class: 'fusion-woo-cart-totals-wrapper fusion-woo-cart-totals-wrapper-' + cid,
					style: ''
				};

				attributes = _.fusionVisibilityAtts( values.hide_on_mobile, attributes );

				if ( '' !== values[ 'class' ] ) {
					attributes[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( 'show' === values.buttons_visibility ) {
					attributes[ 'class' ] += ' show-buttons';
					attributes[ 'class' ] += ' buttons-' + values.buttons_layout;

					if ( 'yes' === values.button_span ) {
						attributes[ 'class' ] += ' buttons-span-yes';
					}
				}

				if ( '' !== values.id ) {
					attributes.id = values.id;
				}

				attributes = _.fusionAnimations( values, attributes );

				attributes.style += this.getStyleVariables( values );

				return attributes;
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


				cssVarsOptions = [
					'heading_cell_backgroundcolor',
					'heading_color',
					'border_color',
					'table_cell_backgroundcolor',
					'fusion_font_family_heading_font',
					'fusion_font_variant_heading_font',
					'heading_line_height',
					'heading_text_transform',
					'fusion_font_family_text_font',
					'fusion_font_variant_text_font',
					'text_line_height',
					'text_text_transform',
					'floated_buttons_alignment',
					'stacked_buttons_alignment'
				];

				if ( ! this.isDefault( 'text_color' ) ) {
					customVars.text_color   = values.text_color;
					customVars.button_color = values.text_color;
					customVars.amount_color = values.text_color;
				}

				cssVarsOptions.margin_top             = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left            = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_top       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_bottom    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_left      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_right     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.heading_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.heading_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_font_size         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_letter_spacing    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_margin_top      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_margin_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_margin_left     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.button_margin_right    = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}

		} );
	} );
}( jQuery ) );
