/* global FusionApp */
/* eslint no-mixed-spaces-and-tabs: 0 */
var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Content Component View.
		FusionPageBuilder.fusion_tb_content = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.2
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
			 * Builds output.
			 *
			 * @since  3.3
			 * @param  {Object} atts - The attributes object.
			 * @return {String}
			 */
			buildOutput: function( atts ) {
				var output    = '',
					stripHTML = ( 'yes' === atts.values.strip_html );

				if ( 'undefined' !== typeof atts.query_data && 'object' === typeof atts.query_data.content ) {
					if ( atts.query_data.content.has_custom_excerpt ) {
						output = _.fusionGetFixedContent( atts.query_data.content, atts.values.excerpt, Number.MAX_SAFE_INTEGER, stripHTML );
					} else {
						output = _.fusionGetFixedContent( atts.query_data.content, atts.values.excerpt, atts.values.excerpt_length, stripHTML );
					}

				}
				if ( '' === output ) {
					output = 'object' === typeof FusionApp.initialData.examplePostDetails && 'string' === typeof FusionApp.initialData.examplePostDetails.post_content ? FusionApp.initialData.examplePostDetails.post_content : _.autop( 'This is some example content.' );
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

				// Title typography.
				jQuery.each( _.fusionGetFontStyle( 'text_font', values, 'object' ), function( rule, value ) {
						customVars[ 'text-' + rule ] = value;
				} );

				cssVarsOptions = [
					'content_alignment',
					'line_height',
					'text_transform'
				];

				cssVarsOptions.font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_color     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top     = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right   = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_bottom  = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left    = { 'callback': _.fusionGetValueWithUnit };

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			},

			/**
			 * Builds attributes.
			 *
			 * @since  2.2
			 * @param  {Object} values - The values object.
			 * @return {Object}
			 */
			buildAttr: function( values ) {
				var attr         = _.fusionVisibilityAtts( values.hide_on_mobile, {
						class: 'fusion-content-tb fusion-content-tb-' + this.model.get( 'cid' ),
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
			}
		} );
	} );
}( jQuery ) );
