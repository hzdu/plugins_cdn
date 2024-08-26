/**
 * Handles registration of TinyMCE buttons.
 *
 * @since 	1.4.9
 *
 * @package Media_Categories_Module
 * @author WP Media Library
 */

/**
 * Registers the given shortcode as a TinyMCE Plugin, with a button in
 * the Visual Editor toolbar.
 *
 * @since 	1.4.9
 *
 * @param 	object 	block 	Block
 */
function mediaLibraryOrganizerTinyMCERegisterPlugin( block ) {

	( function( $ ) {

		tinymce.PluginManager.add(
			block.prefix + '_' + block.name.replaceAll( '-', '_' ),
			function( editor, url ) {

				// Add Button to Visual Editor Toolbar.
				editor.addButton(
					block.prefix + '_' + block.name.replaceAll( '-', '_' ),
					{
						title: 	block.title,
						image: 	block.icon,
						cmd: 	'media_categories_module_' + block.name.replaceAll( '-', '_' ),
					}
				);

				// Load View when button clicked.
				editor.addCommand(
					block.prefix + '_' + block.name.replaceAll( '-', '_' ),
					function() {

						// Open the TinyMCE Modal.
						editor.windowManager.open(
							{
								id: 	'wpzinc-tinymce-modal',
								title: 	block.title,
								width: 	block.modal.width,
								height: block.modal.height,

								// See dashboard submodule's tinymce-modal.js which handles
								// insert and cancel button clicks.
								buttons: [
									{
										text: media_categories_module_tinymce.labels.cancel,
										classes: 'cancel'
								},
									{
										text: media_categories_module_tinymce.labels.insert,
										subtype: 'primary',
										classes: 'insert'
								}
								]
							}
						);

						// Perform an AJAX call to load the modal's view.
						$.post(
							ajaxurl,
							{
								'action': 		'media_categories_module_tinymce_output_modal',
								'nonce':  		media_categories_module_tinymce.nonce,
								'editor_type':  'tinymce',
								'shortcode': 	block.name
							},
							function( response ) {

								// Inject HTML into modal.
								jQuery( '#wpzinc-tinymce-modal-body' ).html( response );

								// Initialize tabbed interface.
								wp_zinc_tabs_init();

								// Initialize any Selectize instances now.
								mediaLibraryOrganizerSelectizeInit();

							}
						);

					}
				);

			}
		);

	} )( jQuery );

}
