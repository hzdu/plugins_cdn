var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Price Component View.
		FusionPageBuilder.fusion_tb_woo_price = FusionPageBuilder.ElementView.extend( {

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
				this.validateValues( atts.values );

				this.values = atts.values;

				// Any extras that need passed on.
				attributes.cid         = this.model.get( 'cid' );
				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.output      = this.buildOutput( atts );

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since  3.2
			 * @param  {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				var borderRadiusTopLeft     = 'undefined' !== typeof values.border_radius_top_left && '' !== values.border_radius_top_left ? _.fusionGetValueWithUnit( values.border_radius_top_left ) : '0px',
					borderRadiusTopRight    = 'undefined' !== typeof values.border_radius_top_right && '' !== values.border_radius_top_right ? _.fusionGetValueWithUnit( values.border_radius_top_right ) : '0px',
					borderRadiusBottomRight = 'undefined' !== typeof values.border_radius_bottom_right && '' !== values.border_radius_bottom_right ? _.fusionGetValueWithUnit( values.border_radius_bottom_right ) : '0px',
					borderRadiusBottomLeft  = 'undefined' !== typeof values.border_radius_bottom_left && '' !== values.border_radius_bottom_left ? _.fusionGetValueWithUnit( values.border_radius_bottom_left ) : '0px';

				values.border_radius     = borderRadiusTopLeft + ' ' + borderRadiusTopRight + ' ' + borderRadiusBottomRight + ' ' + borderRadiusBottomLeft;
				values.border_radius     = ( '0px 0px 0px 0px' === values.border_radius ) ? '' : values.border_radius;
				values.badge_border_size = _.fusionValidateAttrValue( values.badge_border_size, 'px' );
			},

			/**
			 * Builds attributes.
			 *
			 * @since  3.2
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-woo-price-tb fusion-woo-price-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				attr.style += this.getStyleVariables( values );

				if ( 'yes' !== values.show_sale ) {
					attr[ 'class' ] += ' hide-sale';
				}

				if ( '0px' !== values.badge_border_size ) {
					attr[ 'class' ] += ' has-border';
				}

				if ( '' !== values.sale_position ) {
					attr[ 'class' ] += ' sale-position-' + values.sale_position;
				}

				if ( '' !== values.layout ) {
					attr[ 'class' ] += ' ' + values.layout;
				}

				if ( '' !== values.badge_position && 'no' !== values.show_badge ) {
					attr[ 'class' ] += ' has-badge badge-position-' + values.badge_position;
				}

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
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-price-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_price ) {
					output = atts.query_data.woo_price;
				}

				return output;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var customVars = [],
					cssVarsOptions;

				// Price typography.
				jQuery.each( _.fusionGetFontStyle( 'price_typography', values, 'object' ), function( rule, value ) {
						customVars[ 'price-' + rule ] = value;
				} );

				// Sale typography.
				jQuery.each( _.fusionGetFontStyle( 'sale_typography', values, 'object' ), function( rule, value ) {
						customVars[ 'sale-' + rule ] = value;
				} );

				// Stock typography.
				jQuery.each( _.fusionGetFontStyle( 'stock_typography', values, 'object' ), function( rule, value ) {
						customVars[ 'stock-' + rule ] = value;
				} );

				// Badge typography.
				jQuery.each( _.fusionGetFontStyle( 'badge_typography', values, 'object' ), function( rule, value ) {
						customVars[ 'badge-' + rule ] = value;
				} );

				cssVarsOptions = [
					'price_color',
					'sale_color',
					'stock_color',
					'badge_text_color',
					'badge_bg_color',
					'badge_border_color',
					'price_line_height',
					'price_text_transform',
					'sale_text_transform',
					'stock_line_height',
					'stock_text_transform',
					'badge_line_height',
					'badge_text_transform',
					'alignment',
					'border_radius'
				];

				cssVarsOptions.margin_bottom        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.price_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.price_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.sale_font_size       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.sale_letter_spacing  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.stock_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.stock_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.badge_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.badge_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.badge_border_size    = { 'callback': _.fusionGetValueWithUnit };


				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
