var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Rating Component View.
		FusionPageBuilder.fusion_tb_woo_short_description = FusionPageBuilder.ElementView.extend( {

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
						class: 'fusion-woo-short-description-tb fusion-woo-short-description-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr = _.fusionAnimations( values, attr );

				attr.style += this.getStyleVariables( values );

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
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-short-description-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_short_description ) {
					output = atts.query_data.woo_short_description;
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
				jQuery.each( _.fusionGetFontStyle( 'text_font', values, 'object' ), function( rule, value ) {
						customVars[ 'text-' + rule ] = value;
				} );

				cssVarsOptions = [
				'text_color',
				'text_line_height',
				'text_text_transform'
			];

				cssVarsOptions.margin_bottom        = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_left          = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_right         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.margin_top           = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_font_size       = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_letter_spacing  = { 'callback': _.fusionGetValueWithUnit };


				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
