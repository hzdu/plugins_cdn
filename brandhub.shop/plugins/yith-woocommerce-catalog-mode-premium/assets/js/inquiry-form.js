/**
 * Inquiry form frontend scripts
 *
 * @package YITH\CatalogMode
 */

jQuery(
	function ( $ ) {

		var field_id;

		$(
			function () {
				"use strict";

				var id_field = '<input type="hidden" name="ywctm-product-id" value="' + ywctm.product_id + '" /><input type="hidden" name="ywctm-params" value="" />';

				switch ( ywctm.form_type ) {

					case 'contact-form-7':
						$( '.ywctm-inquiry-form-wrapper div.wpcf7 > form,  #tab-inquiry_form div.wpcf7 > form' ).append( id_field );
						break;

					case 'ninja-forms':
						$( '.ywctm-inquiry-form-wrapper .ywctm-toggle-content, #tab-inquiry_form' ).append( id_field );
						break;

					case 'formidable-forms':
						var field = $( '#field_ywctm-product-id' );
						if ( field.length > 0 ) {
							field_id = field.attr( 'name' ).replace( 'item_meta[', '' ).replace( ']', '' );
							$( '.ywctm-inquiry-form-wrapper .frm_fields_container, #tab-inquiry_form .frm_fields_container' ).append( id_field ).append( '<input type="hidden" name="ywctm-ff-field-id" value="' + field_id + '" />' );
						}
						break;

					case 'gravity-forms':
						// Event hooked to gform_post_render trigger.
						break;

					case 'wpforms':
						id_field = '<input type="hidden" name="wpforms[ywctm-product-id]" value="' + ywctm.product_id + '" /><input type="hidden" name="wpforms[ywctm-params]" value="" />';

						$( '.ywctm-inquiry-form-wrapper .wpforms-container > form > .wpforms-submit-container,  #tab-inquiry_form .wpforms-container > form > .wpforms-submit-container' ).append( id_field );
						break;

				}

				set_variation_inquiry();

				$( '.ywctm-inquiry-form-wrapper.has-toggle .ywctm-toggle-button' ).on(
					'click',
					function () {
						$( this ).parent().find( '.ywctm-toggle-content' ).slideToggle();
					}
				);

			}
		);

		$( document ).on(
			'woocommerce_variation_has_changed',
			set_variation_inquiry
		);

		$( document ).on(
			'nfFormReady',
			function () {

				field_id = $( '.nf-form-content :input[value="ywctm-product-id"]' ).attr( 'id' );
				$( '.ywctm-inquiry-form-wrapper .ywctm-toggle-content' ).append( '<input type="hidden" name="ywctm-nf-field-id" value="' + field_id + '" />' );
				set_variation_inquiry();

			}
		);

		$( document ).on(
			'gform_post_render',
			function () {

				var id_field = '<input type="hidden" name="ywctm-product-id" value="' + ywctm.product_id + '" /><input type="hidden" name="ywctm-params" value="" />';
				$( '.ywctm-inquiry-form-wrapper .gform_wrapper > form > .gform_footer,  #tab-inquiry_form .gform_wrapper > form > .gform_footer' ).append( id_field );

				set_variation_inquiry();

			}
		);

		function set_variation_inquiry() {

			if ( 'none' === ywctm.form_type ) {
				return
			}

			var params = [];

			$( '.variations select' ).each(
				function () {
					if ( $( 'option:selected', this ).val() ) {
						params.push( 'attribute_' + $( this ).attr( 'id' ) + '=' + $( 'option:selected', this ).val() );
					}
				}
			);
			$( 'input[name="ywctm-params"]' ).val( params );
			$( 'input[name="wpforms[ywctm-params]"]' ).val( params );
			if ( 'ninja-forms' === ywctm.form_type ) {
				$( '#' + field_id ).val(
					JSON.stringify(
						{
							id    : ywctm.product_id,
							params: params,
						}
					)
				);
			}

		}

	}
);
