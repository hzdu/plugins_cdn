/* eslint no-mixed-spaces-and-tabs: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Checkout Order Review Component View.
		FusionPageBuilder.fusion_tb_woo_checkout_order_review = FusionPageBuilder.ElementView.extend( {

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
						class: 'fusion-woo-checkout-order-review-tb fusion-woo-checkout-order-review-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( 'show' !== this.values.table_header ) {
					attr[ 'class' ] += ' hide-header';
				}

				if ( 'show' !== this.values.display_product_images ) {
					attr[ 'class' ] += ' hide-product-images';
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
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-checkout-order-review-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_checkout_order_review ) {
					output = atts.query_data.woo_checkout_order_review;
				}

				return output;
			},

			/**
			 * Builds styles.
			 *
			 * @since  3.3
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildStyleBlock: function() {
				var selector, css;
				this.baseSelector = '.fusion-woo-checkout-order-review-tb-' +  this.model.get( 'cid' );
				this.dynamic_css = {};

				selector = [ this.baseSelector + ' tbody tr td', this.baseSelector + ' thead tr th', this.baseSelector + ' tfoot tr th', this.baseSelector + ' tfoot tr td' ];
				if ( !this.isDefault( 'cell_padding_top' ) ) {
				  this.addCssProperty( selector, 'padding-top',  this.values.cell_padding_top );
				}

				if ( !this.isDefault( 'cell_padding_bottom' ) ) {
				  this.addCssProperty( selector, 'padding-bottom',  this.values.cell_padding_bottom );
				}

				if ( !this.isDefault( 'cell_padding_left' ) ) {
				  this.addCssProperty( selector, 'padding-left',  this.values.cell_padding_left );
				}

				if ( !this.isDefault( 'cell_padding_right' ) ) {
				  this.addCssProperty( selector, 'padding-right',  this.values.cell_padding_right );
				}

				selector = this.baseSelector + ' thead tr th';
				if ( !this.isDefault( 'header_cell_backgroundcolor' ) ) {
				  this.addCssProperty( selector, 'background-color',  this.values.header_cell_backgroundcolor );
				}

				if ( !this.isDefault( 'header_color' ) ) {
				  this.addCssProperty( selector, 'color',  this.values.header_color );
				}

				if ( !this.isDefault( 'fusion_font_family_header_font' ) ) {
				  this.addCssProperty( selector, 'font-family',  this.values.fusion_font_family_header_font );
				}

				if ( !this.isDefault( 'fusion_font_variant_header_font' ) ) {
				  this.addCssProperty( selector, 'font-weight',  this.values.fusion_font_variant_header_font );
				}

				if ( !this.isDefault( 'header_font_size' ) ) {
				  this.addCssProperty( selector, 'font-size',  this.values.header_font_size );
				}

				if ( !this.isDefault( 'header_line_height' ) ) {
					this.addCssProperty( selector, 'line-height', this.values.header_line_height );
				}

				if ( !this.isDefault( 'header_text_transform' ) ) {
					this.addCssProperty( selector, 'text-transform', this.values.header_text_transform );
				}

				if ( !this.isDefault( 'header_letter_spacing' ) ) {
					this.addCssProperty( selector, 'letter-spacing',  _.fusionGetValueWithUnit( this.values.header_letter_spacing ) );
				}

				selector = this.baseSelector + ' tbody tr td';
				if ( !this.isDefault( 'table_cell_backgroundcolor' ) ) {
				  this.addCssProperty( selector, 'background-color',  this.values.table_cell_backgroundcolor );
				}

				if ( !this.isDefault( 'text_color' ) ) {
				  this.addCssProperty( selector, 'color',  this.values.text_color );
				}

				if ( !this.isDefault( 'fusion_font_family_text_font' ) ) {
				  this.addCssProperty( selector, 'font-family',  this.values.fusion_font_family_text_font );
				}

				if ( !this.isDefault( 'fusion_font_variant_text_font' ) ) {
				  this.addCssProperty( selector, 'font-weight',  this.values.fusion_font_variant_text_font );
				}

				if ( !this.isDefault( 'text_font_size' ) ) {
				  this.addCssProperty( selector, 'font-size',  this.values.text_font_size );
				}

				if ( !this.isDefault( 'text_line_height' ) ) {
					this.addCssProperty( selector, 'line-height', this.values.text_line_height );
				}

				if ( !this.isDefault( 'text_text_transform' ) ) {
					this.addCssProperty( selector, 'text-transform', this.values.text_text_transform );
				}

				if ( !this.isDefault( 'text_letter_spacing' ) ) {
					this.addCssProperty( selector, 'letter-spacing',  _.fusionGetValueWithUnit( this.values.text_letter_spacing ) );
				}

				selector = this.baseSelector + ' tr, ' +  this.baseSelector + ' tr td, ' +  this.baseSelector + ' tr th, ' +  this.baseSelector + ' tfoot';
				if ( !this.isDefault( 'border_color' ) ) {
				  this.addCssProperty( selector, 'border-color',  this.values.border_color, true );
				}

				selector = this.baseSelector + ' tfoot tr th, ' +  this.baseSelector + ' tfoot tr td';
				if ( !this.isDefault( 'footer_cell_backgroundcolor' ) ) {
				  this.addCssProperty( selector, 'background-color',  this.values.footer_cell_backgroundcolor );
				}

				selector += ', ' +  this.baseSelector + ' .shop_table tfoot .order-total .amount';
				if ( !this.isDefault( 'footer_color' ) ) {
				  this.addCssProperty( selector, 'color',  this.values.footer_color );
				}

				if ( !this.isDefault( 'fusion_font_family_footer_font' ) ) {
				  this.addCssProperty( selector, 'font-family',  this.values.fusion_font_family_footer_font );
				}

				if ( !this.isDefault( 'fusion_font_variant_footer_font' ) ) {
				  this.addCssProperty( selector, 'font-weight',  this.values.fusion_font_variant_footer_font );
				}

				if ( !this.isDefault( 'footer_font_size' ) ) {
				  this.addCssProperty( selector, 'font-size',  this.values.footer_font_size );
				}

				if ( !this.isDefault( 'footer_line_height' ) ) {
					this.addCssProperty( selector, 'line-height', this.values.footer_line_height );
				}

				if ( ! this.isDefault( 'footer_text_transform' ) ) {
					this.addCssProperty( selector, 'text-transform', this.values.footer_text_transform );
				}

				if ( !this.isDefault( 'footer_letter_spacing' ) ) {
					this.addCssProperty( selector, 'letter-spacing',  _.fusionGetValueWithUnit( this.values.footer_letter_spacing ) );
				}

				if ( 'show' !== this.values.table_header ) {
					this.addCssProperty( this.baseSelector + ' thead', 'display', 'none' );
				}

				if ( 'show' !== this.values.display_product_images ) {
					this.addCssProperty( this.baseSelector + ' .product-thumbnail', 'display', 'none' );
					this.addCssProperty( this.baseSelector + ' .shop_table tbody tr', 'height', 'auto' );
				}

				css = this.parseCSS();
				return ( css ) ? '<style>' + css + '</style>' : '';

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


				if ( ! this.isDefault( 'footer_color' ) ) {
					customVars.amount_color = values.footer_color;
				}

				if ( ! this.isDefault( 'fusion_font_variant_footer_font' ) ) {
					customVars.amount_font_weight = values.fusion_font_variant_footer_font;
				}

				if ( ! this.isDefault( 'cell_padding_top' ) ) {
					customVars.header_padding_top = _.fusionGetValueWithUnit( values.cell_padding_top );
					customVars.footer_padding_top = _.fusionGetValueWithUnit( values.cell_padding_top );
				}

				if ( ! this.isDefault( 'cell_padding_bottom' ) ) {
					customVars.header_padding_bottom = _.fusionGetValueWithUnit( values.cell_padding_bottom );
					customVars.footer_padding_bottom = _.fusionGetValueWithUnit( values.cell_padding_bottom );
				}

				if ( ! this.isDefault( 'cell_padding_left' ) ) {
					customVars.header_padding_left = _.fusionGetValueWithUnit( values.cell_padding_left );
					customVars.footer_padding_left = _.fusionGetValueWithUnit( values.cell_padding_left );
				}

				if ( ! this.isDefault( 'cell_padding_right' ) ) {
					customVars.header_padding_right = _.fusionGetValueWithUnit( values.cell_padding_right );
					customVars.footer_padding_right = _.fusionGetValueWithUnit( values.cell_padding_right );
				}

				if ( ! this.isDefault( 'fusion_font_family_footer_font' ) ) {
					customVars.fusion_font_family_footer_td_font = values.fusion_font_family_footer_font;
				}

				if ( ! this.isDefault( 'fusion_font_variant_footer_font' ) ) {
					customVars.fusion_font_variant_footer_td_font = values.fusion_font_variant_footer_font;
				}

				if ( ! this.isDefault( 'footer_font_size' ) ) {
					customVars.footer_td_font_size = _.fusionGetValueWithUnit( values.footer_font_size );
				}

				if ( ! this.isDefault( 'footer_line_height' ) ) {
					customVars.footer_td_line_height = values.footer_line_height;
				}

				if ( ! this.isDefault( 'footer_letter_spacing' ) ) {
					customVars.footer_td_letter_spacing = _.fusionGetValueWithUnit( values.footer_letter_spacing );
				}

				if ( ! this.isDefault( 'footer_text_transform' ) ) {
					customVars.footer_td_text_transform = values.footer_text_transform;
				}


				cssVarsOptions = [
					'header_cell_backgroundcolor',
					'header_color',
					'table_cell_backgroundcolor',
					'text_color',
					'border_color',
					'footer_cell_backgroundcolor',
					'footer_color',
					'fusion_font_family_header_font',
					'fusion_font_variant_header_font',
					'header_line_height',
					'header_text_transform',
					'fusion_font_family_text_font',
					'fusion_font_variant_text_font',
					'text_line_height',
					'text_text_transform',
					'fusion_font_family_footer_font',
					'fusion_font_variant_footer_font',
					'footer_line_height',
					'footer_text_transform'
				];

				cssVarsOptions.margin_top            = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_top      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_bottom   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_left     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_right    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.header_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.header_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_font_size        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_letter_spacing   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.footer_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.footer_letter_spacing = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
