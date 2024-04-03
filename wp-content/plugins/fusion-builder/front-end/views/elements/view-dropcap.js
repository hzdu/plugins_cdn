var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {

		// Dropcap Element View.
		FusionPageBuilder.fusion_dropcap = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 2.0
			 * @param {Object} atts - The attributes.
			 * @return {Object} - Returns the attributes.
			 */
			filterTemplateAtts: function( atts ) {
				var attributes = {};

				this.values = atts.values;

				// Validate values.
				this.validateValues();

				// Create attribute objects
				attributes.attr = this.buildAttr( this.values );

				// Any extras that need passed on.
				attributes.output = atts.values.element_content;

				return attributes;
			},

			/**
			 * Modifies values.
			 *
			 * @param {Object} values - The values.
			 * @return {void}
			 */
			validateValues: function() {

				// Make sure the title text is not wrapped with an unattributed p tag.
				if ( 'undefined' !== typeof this.values.element_content ) {
					this.values.element_content = this.values.element_content.trim();
					this.values.element_content = this.values.element_content.replace( /(<p[^>]+?>|<p>|<\/p>)/img, '' );
				}
			},

			/**
			 * Get the styling vars.
			 *
			 * @since 3.9
			 * @return string
			 */
			getStyleVariables: function() {
				var customVars = {};
				if ( 'yes' === this.values.boxed ) {
					if ( this.values.boxed_radius || '0' === this.values.boxed_radius ) {
						this.values.boxed_radius = ( 'round' === this.values.boxed_radius ) ? '50%' : this.values.boxed_radius;
						customVars[ 'border-radius' ] = this.values.boxed_radius;
					}

					if ( '' !== this.values.text_color ) {
						customVars.color = this.values.text_color;
					}
					if ( '' !== this.values.color ) {
						customVars.background = this.values.color;
					}
				} else if ( '' !== this.values.color ) {
					customVars.color = this.values.color;
				}

				if ( 'yes' === this.values.boxed ) {
					if ( '' !== this.values.text_color ) {
						customVars.color = this.values.text_color;
					}
					if ( '' !== this.values.color ) {
						customVars.background = this.values.color;
					}
				}

				return this.getCustomCssVars( customVars );
			},

			/**
			 * Builds attributes.
			 *
			 * @since 2.0
			 * @param {Object} values - The values.
			 * @return {Object} - Returns the element attributes.
			 */
			buildAttr: function( values ) {
				var attr   = {
						class: 'fusion-dropcap dropcap',
						style: this.getStyleVariables()
					};

				if ( 'yes' === values.boxed ) {
					attr[ 'class' ] += ' dropcap-boxed';
				}

				if ( '' !== values[ 'class' ] ) {
					attr[ 'class' ] += ' ' + values[ 'class' ];
				}

				if ( '' !== values.id ) {
					attr.id = values.id;
				}

				return attr;
			}
		} );
	} );
}( jQuery ) );
