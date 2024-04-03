var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Woo Cart Table View.
		FusionPageBuilder.fusion_woo_cart_table = FusionPageBuilder.ElementView.extend( {

			afterPatch: function() {
				var $quantityBoxes = this.$el.find( 'div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)' ).find( '.qty' );

				if ( $quantityBoxes.length && 'function' === typeof jQuery( '#fb-preview' )[ 0 ].contentWindow.avadaAddQuantityBoxes ) {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.avadaAddQuantityBoxes( '.qty', $quantityBoxes );
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
				attributes.cid    = this.model.get( 'cid' );
				attributes.attr   = this.buildAttr( atts.values );

				attributes.wooCartTable = this.buildAttr( atts.values, attributes.cid );
				attributes.cart_table = '';
				if ( 'undefined' !== typeof atts.query_data  ) {
					attributes.cart_table = atts.query_data;
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

				// WooCartTable attributes.
				var wooCartTable = {
					class: 'shop_table shop_table_responsive cart woocommerce-cart-form__contents fusion-woo-cart_table fusion-woo-cart_table-' + cid,
					style: ''
				};

				wooCartTable = _.fusionVisibilityAtts( values.hide_on_mobile, wooCartTable );

				if ( '' !== values[ 'class' ] ) {
					wooCartTable[ 'class' ] += ' ' + values[ 'class' ];
				}

				wooCartTable.style += this.getStyleVariables( values );

				if ( '' !== values.id ) {
					wooCartTable.id = values.id;
				}

				wooCartTable = _.fusionAnimations( values, wooCartTable );

				return wooCartTable;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @return {String}
			 */
			getStyleVariables: function( values ) {

				var cssVarsOptions = [
					'heading_cell_backgroundcolor',
					'heading_color',
					'table_cell_backgroundcolor',
					'text_color',
					'border_color',
					'fusion_font_family_heading_font',
					'fusion_font_variant_heading_font',
					'heading_line_height',
					'heading_text_transform',
					'fusion_font_family_text_font',
					'fusion_font_variant_text_font',
					'text_line_height',
					'text_text_transform'
				];

				cssVarsOptions.margin_top             = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left            = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_top       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_bottom    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_left      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.cell_padding_right     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.heading_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.heading_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_font_size         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_letter_spacing    = { 'callback': _.fusionGetValueWithUnit };

				// For Ajax rendering.
				this.values = values;

				return this.getCssVarsForOptions( cssVarsOptions );
			}

		} );
	} );
}( jQuery ) );
