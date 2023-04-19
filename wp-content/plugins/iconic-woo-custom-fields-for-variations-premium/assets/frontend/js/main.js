(function( $, document ) {
	var iconic_cffv = {
		cache: function() {
			// templates
			iconic_cffv.tmpl = {};
			iconic_cffv.tmpl.fields = wp.template( 'variation-fields' );
		},

		on_ready: function() {
			iconic_cffv.cache();
			iconic_cffv.setup_variations();
		},

		/**
		 * Setup variations.
		 */
		setup_variations: function() {
			$( document ).on( 'found_variation', '.variations_form', function( event, variation ) {
				var $form = $( this ),
					product_id = $form.data( 'product_id' );

				if ( variation.variation_is_visible ) {
					var $single_variation = $form.find( '.single_variation' ),
						$variation_description = $single_variation.find( '.woocommerce-variation-description' ),
						$shortcode = iconic_cffv.get_shortcode( product_id );

					$template_html = iconic_cffv.tmpl.fields( {
						variation: variation
					} );

					// w3 total cache inline minification adds CDATA tags around our HTML (sigh)
					$template_html = $template_html.replace( '/*<![CDATA[*/', '' );
					$template_html = $template_html.replace( '/*]]>*/', '' );

					if ( $variation_description.length > 0 ) {
						$variation_description.after( $template_html );
					} else {
						$single_variation.prepend( $template_html );
					}

					iconic_cffv.set_shortcode_html( product_id, $template_html );
				} else {
					iconic_cffv.clear_shortcode( product_id );
				}
			} );

			$( document ).on( 'reset_data', '.variations_form', function( event ) {
				var $form = $( this ),
					product_id = $form.data( 'product_id' );

				iconic_cffv.clear_shortcode( product_id );
			} );

			$( document ).on( 'show_variation', '.single_variation', function( event, variation, purchasable ) {
				$( this ).stop().hide().height( '' ).show();
			} );
		},

		/**
		 * Get shortcode container for product.
		 *
		 * @param product_id
		 * @returns {*|jQuery|HTMLElement}
		 */
		get_shortcode: function( product_id ) {
			return $( 'div[data-iconic-cffv="' + product_id + '"]' );
		},

		/**
		 * Clear shortcode container.
		 */
		clear_shortcode: function( product_id ) {
			var $shortcode = iconic_cffv.get_shortcode( product_id );

			$shortcode.html( '' );
		},

		/**
		 * Set Shortcode HTML.
		 * @param int    product_id
		 * @param string html
		 */
		set_shortcode_html: function ( product_id, html ) {
			var shortcodes = iconic_cffv.get_shortcode( product_id );

			shortcodes.each( function () {
				var shortcode = $( this ),
					fields = shortcode.data( 'iconic-fields' );

				shortcode.html( html );

				if ( ! fields.length ) {
					return;
				}

				// If 'fields' parameter is passed, then only show those fields which
				// are present in fields list
				shortcode.find( '.iconic-cffv-field' ).each( function () {
					var this_field_id = $( this ).data( 'field-id' );
					if ( fields.includes( this_field_id ) ) {
						$( this ).show();
					} else {
						$( this ).hide();
					}
				} );
			} );
		}
	};

	$( document ).ready( iconic_cffv.on_ready() );
}( jQuery, document ));