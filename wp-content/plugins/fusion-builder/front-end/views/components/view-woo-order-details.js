var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		FusionPageBuilder.fusion_woo_order_details = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.5
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

                attributes.elementAttr      = this.elementAttr( atts.values );
                attributes.details_ordering = atts.values.details_order.split( ',' );
				attributes.extras           = atts.extras;
				attributes.failedMessage    = atts.values.failed_message;

				return attributes;
			},

			/**
			 * Create the element attributes.
			 *
			 * @since 3.5
			 * @param {Object} values - The options.
			 * @return {Object}
			 */
			elementAttr: function( values ) {
				var atts = {
					'style': this.getInlineStyle( values ),
					'class': 'awb-woo-order-details awb-woo-order-details--' + this.model.get( 'cid' )
				};

				atts = _.fusionVisibilityAtts( values.hide_on_mobile, atts );

				if ( values[ 'class' ] ) {
					atts[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( values.id ) {
					atts.id = values.id;
				}

				atts = _.fusionAnimations( values, atts );

				return atts;
			},

			/**
			 * Get inline style.
			 *
			 * @since 3.9
			 * @param {Object} values
			 * @return string
			 */
			getInlineStyle: function( values ) {
				var cssVarsOptions = [
					'item_typo_line_height',
					'item_typo_text_transform',
					'item_typo_color',
                    'detail_typo_line_height',
					'detail_typo_text_transform',
					'detail_typo_color',

					'failed_btn_color',
					'failed_btn_bg_color',
					'failed_btn_border_c',
					'failed_btn_color_hover',
					'failed_btn_bg_color_hover',
					'failed_btn_border_c_hover'
                ],
                    fontFamilyVars = '';

				this.values = values;

                cssVarsOptions.item_typo_font_size        = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.item_typo_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.detail_typo_font_size      = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.detail_typo_letter_spacing = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.btn_padding_top            = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.btn_padding_right          = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.btn_padding_bottom         = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.btn_padding_left           = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.failed_btn_border_w        = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.btn_radius_top_left        = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.btn_radius_top_right       = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.btn_radius_bottom_right    = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.btn_radius_bottom_left     = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.btn_distance               = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.btn_msg_distance           = { 'callback': _.fusionGetValueWithUnit };

                cssVarsOptions.margin_top                 = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.margin_right               = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.margin_bottom              = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.margin_left                = { 'callback': _.fusionGetValueWithUnit };

                fontFamilyVars = this.getFontStylingVars( 'item_typo', values ) +  this.getFontStylingVars( 'detail_typo', values );

				return this.getCssVarsForOptions( cssVarsOptions ) + fontFamilyVars;
			}

		} );
	} );
}( jQuery ) );
