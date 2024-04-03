var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		FusionPageBuilder.fusion_woo_order_table = FusionPageBuilder.ElementView.extend( {

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
				attributes.showDownloads    = atts.values.display_meta_downloads;
				attributes.extras           = atts.extras;

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
					'class': 'awb-woo-order-table awb-woo-order-table--' + this.model.get( 'cid' )
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
						'f_cell_bg',

						'border_s',
						'border_c',

						'table_h_typo_line_height',
						'table_h_typo_text_transform',
						'table_h_typo_color',

						'table_item_typo_line_height',
						'table_item_typo_text_transform',
						'table_item_typo_color',
						'item_link_color_hover',

						'table_footer_h_line_height',
						'table_footer_h_text_transform',
						'table_footer_h_color',

						'table_footer_i_line_height',
						'table_footer_i_text_transform',
						'table_footer_i_color',

						'table_total_line_height',
						'table_total_text_transform',
						'table_total_color'
					],
					customVars = {},
					fontFamilyVars = '';

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

				cssVarsOptions.f_cell_pad_top                 = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.f_cell_pad_right               = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.f_cell_pad_bottom              = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.f_cell_pad_left                = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.border_w                       = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.table_h_typo_font_size         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.table_h_typo_letter_spacing    = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.table_item_typo_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.table_item_typo_letter_spacing = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.table_footer_h_font_size       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.table_footer_h_letter_spacing  = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.table_footer_i_font_size       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.table_footer_i_letter_spacing  = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.table_total_font_size          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.table_total_letter_spacing     = { 'callback': _.fusionGetValueWithUnit };

				this.values = values;

				if ( values.f_cell_pad_right ) { // By default footer heading cell has custom right padding, make sure to also overwrite that.
					customVars.f_heading_cell_pad_right = _.fusionGetValueWithUnit( values.f_cell_pad_right );
				}

				fontFamilyVars = this.getFontStylingVars( 'table_h_typo', values ) + this.getFontStylingVars( 'table_item_typo', values ) + this.getFontStylingVars( 'table_footer_h', values ) + this.getFontStylingVars( 'table_footer_i', values ) + this.getFontStylingVars( 'table_total', values );

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars ) + fontFamilyVars;
			}

		} );
	} );
}( jQuery ) );
