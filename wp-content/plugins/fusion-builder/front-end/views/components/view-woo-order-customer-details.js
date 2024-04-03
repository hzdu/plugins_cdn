var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		FusionPageBuilder.fusion_woo_order_customer_details = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.5
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

                attributes.elementAttr  = this.elementAttr( atts.values );
                attributes.titleTag     = this.getTitleTag( atts.values );
				attributes.headingsAttr = this.headingsAttr( atts.values );
				attributes.separatorStyle = atts.values.separator_style;
				attributes.extras       = atts.extras;

				return attributes;
			},

			/**
			 * Create the element attributes.
			 *
			 * @since 3.10
			 * @param {Object} values - The options.
			 * @return {Object}
			 */
			elementAttr: function( values ) {
				var atts = {
					'style': this.getInlineStyle( values ),
					'class': 'awb-woo-order-customer-details awb-woo-order-customer-details--' + this.model.get( 'cid' )
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
			 * Create the element attributes.
			 *
			 * @since 3.10
			 * @param {Object} values - The options.
			 * @return {Object}
			 */
			headingsAttr: function( values ) {
				var atts = {
						'style': '',
						'class': 'awb-woo-order-customer-details__title'
					},
					fontVarArgs;


				var titleTypography = _.fusionGetFontStyle( 'headings_typo', values, 'object' );

				fontVarArgs = {
					'font-family': ( titleTypography[ 'font-family' ] ? titleTypography[ 'font-family' ] : '' ),
					'font-weight': ( titleTypography[ 'font-weight' ] ? titleTypography[ 'font-weight' ] : '' ),
					'font-style': ( titleTypography[ 'font-style' ] ? titleTypography[ 'font-style' ] : '' ),
					'font-size': values.headings_typo_font_size,
					'letter-spacing': values.headings_typo_letter_spacing,
					'line-height': values.headings_typo_line_height,
					'text-transform': values.headings_typo_text_transform,
					'color': values.headings_typo_color
				};

				atts.style += this.getHeadingFontVars( this.getTitleTag( values ), fontVarArgs );

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
					'address_typo_line_height',
					'address_typo_text_transform',
					'address_typo_color',
					'separator_style'
                ],
				customVars = {},
                fontFamilyVars = '';

				this.values = values;

				cssVarsOptions.address_typo_font_size = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.address_typo_letter_spacing = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.headings_margin_top = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.headings_margin_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.headings_margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.headings_margin_left = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.separator_color = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.separator_height = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.address_margin_top = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.address_margin_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.address_margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.address_margin_left = { 'callback': _.fusionGetValueWithUnit };

				cssVarsOptions.margin_top = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left = { 'callback': _.fusionGetValueWithUnit };

				if ( ! this.isDefault( 'separator_width' ) ) {
					customVars.separator_width = values.separator_width + '%';
				}

                fontFamilyVars = this.getFontStylingVars( 'address_typo', values );

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars ) + fontFamilyVars;
			},

			getTitleTag: function ( value ) {
				var tagOption = value.title_size;
				if ( 0 < parseInt( tagOption ) ) {
					return 'h' + tagOption;
				}

				if ( ! tagOption ) {
					return 'h2';
				}

				return tagOption;
			}

		} );
	} );
}( jQuery ) );
