var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		FusionPageBuilder.fusion_woo_order_downloads = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.5
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

                attributes.elementAttr = this.elementAttr( atts.values );
				attributes.extras      = atts.extras;

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
					'class': 'awb-woo-order-downloads awb-woo-order-downloads--' + this.model.get( 'cid' )
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
					'h_cell_bg',
					'b_cell_bg',

					'border_s',
					'border_c',

					'table_h_typo_line_height',
					'table_h_typo_text_transform',
					'table_h_typo_color',

					'table_item_typo_line_height',
					'table_item_typo_text_transform',
					'table_item_typo_color',
					'item_link_color_hover'
				],
					fontFamilyVars = '';
				this.values = values;

				cssVarsOptions.margin_top                     = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.margin_right                   = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.margin_bottom                  = { 'callback': _.fusionGetValueWithUnit };
                cssVarsOptions.margin_left                    = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.h_cell_pad_top                 = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.h_cell_pad_right               = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.h_cell_pad_bottom              = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.h_cell_pad_left                = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.b_cell_pad_top                 = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.b_cell_pad_right               = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.b_cell_pad_bottom              = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.b_cell_pad_left                = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.border_w                       = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.table_h_typo_font_size         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.table_h_typo_letter_spacing    = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.table_item_typo_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.table_item_typo_letter_spacing = { 'callback': _.fusionGetValueWithUnit };

				fontFamilyVars = this.getFontStylingVars( 'table_h_typo', values ) + this.getFontStylingVars( 'table_item_typo', values );

				return this.getCssVarsForOptions( cssVarsOptions ) + fontFamilyVars;
			}

		} );
	} );
}( jQuery ) );
