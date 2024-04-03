/* global FusionPageBuilderApp */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Checkout Billing Component View.
		FusionPageBuilder.fusion_tb_woo_checkout_billing = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.3
			 * @return null
			 */
			onRender: function() {
				if ( ! jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).hasClass( 'woocommerce' ) ) {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).addClass( 'woocommerce' );
				}
			},

			/**
			 * Runs just before view is removed.
			 *
			 * @since 3.3
			 * @return null
			 */
			beforeRemove: function() {
				var self = this,
					removeClass = true;

				_.find( FusionPageBuilderApp.collection.models, function( element ) {
					if ( self.model.cid !== element.get( 'cid' ) && 'undefined' !== typeof element.get( 'element_type' ) && -1 !== element.get( 'element_type' ).indexOf( 'fusion_tb_woo_checkout' ) ) {
						removeClass = false;

						// Break.
						return true;
					}
				} );

				if ( true === removeClass ) {
					jQuery( '#fb-preview' )[ 0 ].contentWindow.jQuery( 'body' ).removeClass( 'woocommerce' );
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
						class: 'fusion-woo-checkout-billing-tb awb-live fusion-woo-checkout-billing-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				attr.style += this.getStyleVariables( values );

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
			 * @since  3.3
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output = '';

				if ( 'undefined' !== typeof atts.markup && 'undefined' !== typeof atts.markup.output && 'undefined' === typeof atts.query_data ) {
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-checkout-billing-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_checkout_billing ) {
					output = atts.query_data.woo_checkout_billing;
				}

				return output;
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

				if ( ! this.isDefault( 'field_border_focus_color' ) ) {
					customVars.hover_color = jQuery.AWB_Color( values.field_border_focus_color ).alpha( 0.5 ).toVarOrRgbaString();
				}

				if ( ! this.isDefault( 'field_text_color' ) ) {
					customVars.placeholder_color = jQuery.AWB_Color( values.field_text_color ).alpha( 0.5 ).toVarOrRgbaString();
				}

				cssVarsOptions = [
					'field_bg_color',
					'field_text_color',
					'field_border_color',
					'field_border_focus_color'
				];

				cssVarsOptions.margin_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left   = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
