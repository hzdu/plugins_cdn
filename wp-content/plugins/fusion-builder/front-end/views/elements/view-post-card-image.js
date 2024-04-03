/* global FusionApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Checkout Billing Component View.
		FusionPageBuilder.fusion_post_card_image = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.3
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
			 * @since  3.3
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-' + FusionApp.settings.woocommerce_product_box_design + '-product-image-wrapper fusion-woo-product-image fusion-post-card-image fusion-post-card-image-' + this.model.get( 'cid' ),
						style: this.getStyleVariables( values )
					} );

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.aspect_ratio ) {
					attr[ 'class' ] += ' has-aspect-ratio';
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
			 * @since  3.3
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output = '';

				if ( 'undefined' !== typeof atts.markup && 'undefined' !== typeof atts.markup.output && 'undefined' === typeof atts.query_data ) {
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-product-image' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.fusion_post_card_image ) {
					output = atts.query_data.fusion_post_card_image;
				}

				return output;
			},

			/**
			 * Gets style variables.
			 *
			 * @since 3.9
			 * @return {String}
			 */
			getStyleVariables: function( values ) {
				var cssVarsOptions = [
					'crossfade_bg_color',
					'aspect_ratio_position'
				],
				customVars = [],
				aspectRatio,
				width,
				height;

				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_top_left = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_top_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_bottom_right = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_radius_bottom_left = { 'callback': _.fusionGetValueWithUnit };

				if ( 'custom' ===  values.aspect_ratio && '' !==  values.custom_aspect_ratio ) {
					customVars.aspect_ratio = `100 / ${values.custom_aspect_ratio}`;
				} else {
					aspectRatio = values.aspect_ratio.split( '-' );
					width 		= aspectRatio[ 0 ] || '';
					height 		= aspectRatio[ 1 ] || '';
					customVars.aspect_ratio = `${width} / ${height}`;
				}

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
