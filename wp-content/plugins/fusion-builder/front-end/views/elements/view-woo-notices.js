/* eslint no-mixed-spaces-and-tabs: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Notices Component View.
		FusionPageBuilder.fusion_tb_woo_notices = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.2
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				this.values = atts.values;

				// Any extras that need passed on.
				attributes.cid         = this.model.get( 'cid' );
				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.output      = this.buildOutput( atts );

				return attributes;
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
						class: 'fusion-woo-notices-tb fusion-woo-notices-tb-' + this.model.get( 'cid' ),
						style: this.getStyleVariables()
					} );

				if ( '' !== values.alignment ) {
					attr[ 'class' ] += ' alignment-text-' + values.alignment;
				}

				if ( '' !== values.show_button ) {
					attr[ 'class' ] += ' show-button-' + values.show_button;
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
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-notices-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_notices ) {
					output = atts.query_data.woo_notices;
				}

				return output;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @return {String}
			 */
			 getStyleVariables: function() {
				var customVars = [],
					cssVarsOptions = [
						'font_color',
						'border_style',
						'border_color',
						'background_color',
						'icon_color',
						'link_color',
						'link_hover_color',
						'success_border_color',
						'success_background_color',
						'success_text_color',
						'success_icon_color',
						'success_link_color',
						'success_link_hover_color',
						'error_border_color',
						'error_background_color',
						'error_text_color',
						'error_icon_color',
						'error_link_color',
						'error_link_hover_color'
					];

				cssVarsOptions.margin_top = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_top = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_left = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.font_size = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_sizes_top = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_sizes_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_sizes_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_sizes_left = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_top_left = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_top_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_bottom_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_bottom_left = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.icon_size = { 'callback': _.fusionGetValueWithUnit };

				if ( ! this.isDefault( 'cart_icon_style' ) ) {
					customVars.cart_icon_content = '';
					customVars.cart_icon_margin_right = '0';
				}

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
