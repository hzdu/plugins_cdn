/* eslint no-mixed-spaces-and-tabs: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Meta Component View.
		FusionPageBuilder.fusion_tb_meta = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.4
			 * @param {Object} atts - The attributes.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				// Validate values.
				this.validateValues( atts.values );
				this.values = atts.values;
				this.extras = atts.extras;

				// Any extras that need passed on.
				attributes.cid         = this.model.get( 'cid' );
				attributes.wrapperAttr = this.buildAttr( atts.values );
				attributes.output      = this.buildOutput( atts );

				return attributes;
			},

			/**
			 * Modifies the values.
			 *
			 * @since  2.2
			 * @param  {Object} values - The values object.
			 * @return {void}
			 */
			validateValues: function( values ) {
				values.border_size = _.fusionValidateAttrValue( values.border_size, 'px' );
				values.height      = _.fusionValidateAttrValue( values.height, 'px' );
			},

			/**
			 * Builds attributes.
			 *
			 * @since  2.4
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-meta-tb fusion-meta-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				attr.style += this.getStyleVariables( values );

				if ( '' !== values.layout ) {
					attr[ 'class' ] += ' ' + values.layout;
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
			 * @since  2.2
			 * @param  {Object} values - The values object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output = '';

				if ( 'undefined' !== typeof atts.markup && 'undefined' !== typeof atts.markup.output && 'undefined' === typeof atts.query_data ) {
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-meta-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.meta ) {
					output = atts.query_data.meta;
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

				_.each( [ 'medium', 'small' ], function( size ) {
					var key = 'alignment_' + size;

					if ( '' === this.values[ key ] ) {
						return;
					}

					customVars[ key ] = values[ key ];
				}, this );

				cssVarsOptions = [
					'text_color',
					'link_color',
					'text_hover_color',
					'border_color',
					'item_border_color',
					'item_background_color',
					'background_color',
					'alignment',
					'stacked_vertical_align',
					'stacked_horizontal_align'
				];

				cssVarsOptions.border_bottom       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_top          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_left         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.border_right        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_border_bottom  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_border_top     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_border_left    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_border_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_padding_top    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_padding_bottom = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_padding_left   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_padding_right  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_margin_top     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_margin_bottom  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_margin_left    = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.item_margin_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.height              = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.font_size           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_bottom      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_left        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_right       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.padding_top         = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
