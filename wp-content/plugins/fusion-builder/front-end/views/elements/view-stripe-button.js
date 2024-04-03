var FusionPageBuilder = FusionPageBuilder || {};

( function() {

	jQuery( document ).ready( function() {
		// Fusion Stripe Button View.
		FusionPageBuilder.fusion_stripe_button = FusionPageBuilder.ElementView.extend( {

			/**
			 * Modify template attributes.
			 *
			 * @since 3.1
			 * @param {Object} atts - The attributes object.
			 * @return {Object}
			 */
			filterTemplateAtts: function( atts ) {
                var attributes = {};

                if ( ! this.btnInstance ) {
                    this.btnInstance = new FusionPageBuilder.fusion_button( {
                        model: this.model,
                        attributes: atts
                    } );
                    this.btnInstance.elementTemplate = FusionPageBuilder.template( jQuery( '#tmpl-fusion_button-shortcode' ).html() );
                }

                // Create attribute
                attributes.html = this.btnInstance.render().$el.html();

				return attributes;
			}

		} );
	} );
}( jQuery ) );
