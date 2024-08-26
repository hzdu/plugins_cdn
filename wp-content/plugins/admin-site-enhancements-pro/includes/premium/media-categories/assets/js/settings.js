/**
 * JavaScript for the settings interface.
 *
 * @since 	1.0.0
 *
 * @package Media_Categories_Module
 * @author 	Media Categories Module
 */

jQuery( document ).ready(
	function( $ ) {

		/**
		 * Initialize Selectize Instances
		 */
		if ( typeof mediaLibraryOrganizerSelectizeInit !== 'undefined' ) {
			mediaLibraryOrganizerSelectizeInit();
		}

		/**
		 * Save Settings via AJAX
		 */
		$( 'form#media-categories-module' ).on(
			'submit',
			function( e ) {

				// Don't submit form.
				e.preventDefault();

				// Show modal and overlay.
				wpzinc_modal_open( media_categories_module_settings.save_settings_modal.title, '' );

				// Send via AJAX.
				$.ajax(
					{
						url: 		ajaxurl,
						type: 		'POST',
						async:    	true,
						data: 		{
							action: 	media_categories_module_settings.save_settings_action,
							nonce: 		media_categories_module_settings.save_settings_nonce,
							settings: 	JSON.stringify( $( this ).serializeArray() )
						},
						error: function( a, b, c ) {

							// Close modal and overlay.
							wpzinc_modal_close();

						},
						success: function( result ) {

							if ( ! result.success ) {
								wpzinc_modal_show_error_message_and_exit( result.data );
							}

							// Show success message and close.
							wpzinc_modal_show_success_and_exit( media_categories_module_settings.save_settings_modal.title_success );

						}
					}
				);

			}
		);

	}
);
