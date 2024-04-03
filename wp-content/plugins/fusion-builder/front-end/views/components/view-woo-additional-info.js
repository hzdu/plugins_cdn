var FusionPageBuilder = FusionPageBuilder || {};

( function() {


	jQuery( document ).ready( function() {

		// Woo Rating Component View.
		FusionPageBuilder.fusion_tb_woo_additional_info = FusionPageBuilder.ElementView.extend( {

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
						class: 'fusion-woo-additional-info-tb fusion-woo-additional-info-tb-' + this.model.get( 'cid' ),
						style: ''
					} );

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				attr.style += this.getStyleVariables( values );

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
					output = jQuery( jQuery.parseHTML( atts.markup.output ) ).filter( '.fusion-woo-additional-info-tb' ).html();
					output = ( 'undefined' === typeof output ) ? atts.markup.output : output;
				} else if ( 'undefined' !== typeof atts.query_data && 'undefined' !== typeof atts.query_data.woo_additional_info ) {
					output = atts.query_data.woo_additional_info;
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

				// Heading typography.
				jQuery.each( _.fusionGetFontStyle( 'heading_font', values, 'object' ), function( rule, value ) {
						customVars[ 'heading-' + rule ] = value;
				} );

				// Text typography.
				jQuery.each( _.fusionGetFontStyle( 'text_font', values, 'object' ), function( rule, value ) {
						customVars[ 'text-' + rule ] = value;
				} );

				// Get spacing.
				jQuery.each( [ 'top', 'right', 'bottom', 'left' ], function( index, side ) {
					var cellPaddingName = 'cell_padding_' + side,
						marginName      = 'margin_' + side;


					// Add content padding to style.
					if ( '' !==  values[ cellPaddingName ] ) {
						customVars[ cellPaddingName ] =  _.fusionGetValueWithUnit( values[ cellPaddingName ] );
					}

					// Element margin.
					if ( '' !==  values[ marginName ] ) {
						customVars[ marginName ] = _.fusionGetValueWithUnit( values[ marginName ] );
					}
				} );

				cssVarsOptions = [
					'heading_color',
					'text_color',
					'border_color',
					'table_cell_backgroundcolor',
					'heading_cell_backgroundcolor',
					'heading_line_height',
					'heading_text_transform',
					'text_line_height',
					'text_text_transform'
				];

				cssVarsOptions.heading_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.heading_font_size      = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.heading_letter_spacing = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_font_size         = { 'callback': _.fusionGetValueWithUnit };
				cssVarsOptions.text_letter_spacing    = { 'callback': _.fusionGetValueWithUnit };


				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
