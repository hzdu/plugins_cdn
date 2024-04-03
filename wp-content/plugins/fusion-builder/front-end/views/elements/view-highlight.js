var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Highlight Element View.
		FusionPageBuilder.fusion_highlight = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object} - Return the attributes object.
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				this.values = atts.values;

				// Create attribute objects
				attributes.attr   = this.buildAttr( atts.values, atts.extras );

				// Any extras that need passed on.
				attributes.output = atts.values.element_content;

				return attributes;
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object} - Return the attributes object.
			 */
			buildAttr: function( values, extras ) {
				var highlightShortcode = {
						class: 'fusion-highlight',
						style: this.getStyleVariables()
					},
					color           = '' === values.color ? extras.primary_color : values.color,
					brightnessLevel = jQuery.AWB_Color( color ).lightness() * 100;

				if ( values.text_color ) {
					highlightShortcode[ 'class' ] += ' custom-textcolor';
				} else {
					highlightShortcode[ 'class' ] += ( 50 < brightnessLevel ) ? ' light' : ' dark';
				}

				if ( '' !== values[ 'class' ] ) {
					highlightShortcode[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					highlightShortcode.id = values.id;
				}

				if ( 'black' === values.color ) {
					highlightShortcode[ 'class' ] += ' highlight2';
				} else {
					highlightShortcode[ 'class' ] += ' highlight1';
				}

				if ( 'no' !== values.background ) {
					if ( 'full' === values.background_style ) {
						highlightShortcode[ 'class' ] += ' awb-highlight-background';
						if ( 'yes' === values.rounded ) {
							highlightShortcode[ 'class' ] += ' rounded';
						}
					} else {
						highlightShortcode[ 'class' ] += ' awb-highlight-marker';
					}
				} else if ( 'yes' === values.gradient_font ) {
					highlightShortcode[ 'class' ] += ' awb-gradient-text';
				}

				if ( 'yes' === values.text_stroke ) {
					highlightShortcode[ 'class' ] += ' fusion-text-has-stroke';
				}

				return highlightShortcode;
			},

			/**
			 * Get the styling vars.
			 *
			 * @since 3.9
			 * @return string
			 */
			getStyleVariables: function() {
				var gradientText,
					customVars     = [],
					cssVarsOptions = [
						'color',
						'text_color',
						'gradient_start_color'
					];

					cssVarsOptions.text_stroke_size   = { 'callback': _.fusionGetValueWithUnit };
					cssVarsOptions.push( 'text_stroke_color' );


				if ( 'yes' === this.values.gradient_font && 'no' === this.values.background ) {
					gradientText = _.getGradientFontString( this.values, true );
					if ( '' !== gradientText ) {
						customVars[ 'background-image' ] = gradientText;
					}
				}

				return this.getCssVarsForOptions( cssVarsOptions ) + this.getCustomCssVars( customVars );
			}
		} );
	} );
}( jQuery ) );
