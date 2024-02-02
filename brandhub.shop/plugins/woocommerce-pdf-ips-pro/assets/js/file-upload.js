// Thanks to Mike Jolley!
// http://mikejolley.com/2012/12/using-the-new-wordpress-3-5-media-uploader-in-plugins/

jQuery(document).ready(function($) {
		
	// Uploading files
	var file_frame;
	 
	$('#wpo-wcpdf-settings').on('click', '.upload_file_button', function( event ){
	// $('.upload_file_button').on('click', function( event ){
		// get corresponding input fields
		$row = $(this).parent();
		$id = $row.find('input.static-file-id');
		$filename = $row.find('input.static-file-filename');

		// get remove button text
		remove_button_text = $( this ).data( 'remove_button_text' );
	 
		event.preventDefault();
	 
		// If the media frame already exists, reopen it.
		if ( file_frame ) {
			file_frame.open();
			return;
		}

		// Create the media frame.
		file_frame = wp.media.frames.file_frame = wp.media({
			title: $( this ).data( 'uploader_title' ),
			button: {
				text: $( this ).data( 'uploader_button_text' ),
			},
			multiple: false	// Set to true to allow multiple files to be selected
		});
	 
		// When a file is selected, run a callback.
		file_frame.on( 'select', function() {
			// We set multiple to false so only get one file from the uploader
			attachment = file_frame.state().get('selection').first().toJSON();

			// set the values of the input fields to the attachment id and filename
			$id.val(attachment.id);
			$filename.val(attachment.filename);
			
			// show remove button
			if ( $row.find('.remove_file_button').length == 0 ) {
				remove_button = '<span class="button remove_file_button">'+remove_button_text+'</span>';
				$row.find('.static-file-filename').after(remove_button);
			}
		});
	 
		// Finally, open the modal
		file_frame.open();
	});
 
	$('#wpo-wcpdf-settings').on('click', '.remove_file_button', function( event ){
		$row = $(this).parent();

		// clear inputs and remove remove button ;)
		$id = $row.find('input.static-file-id').val('');
		$filename = $row.find('input.static-file-filename').val('');
		$( this ).remove();
	});		
});