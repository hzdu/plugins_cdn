jQuery( function( $ ) {
	// show warning when filename does not contain unique identifier or is used by another document
	$('#wpo-wcpdf-settings #filename').on('change', function(){
		let elem              = $(this);
		let filename          = elem.val();
		let document_type     = elem.closest( '#wpo-wcpdf-settings' ).find( "input[name='option_page']" ).val().replace("wpo_wcpdf_documents_settings_", "");
		let language          = elem.attr( 'name' ).replace("wpo_wcpdf_documents_settings_"+document_type+"[filename]", "").replace('[', '').replace(']', '');
		let filename_warnings = [];

		// check for unique identifiers and duplicate filenames
		if ( filename.length > 0 ) {
			if ( filename.indexOf("{{") == -1 || filename.indexOf("}}") == -1 ) {
				filename_warnings.push( wpo_wcpdf_pro_settings.unique_identifier_warning );
			}

			let filename_duplicates_warning = { response: null };
			filename_existence_check( filename_duplicates_warning, filename, document_type, language );
			
			if ( filename_duplicates_warning.response && filename_duplicates_warning.response.length > 0 ) {
				filename_warnings.push( filename_duplicates_warning.response );
			}
		}

		// show warnings if we have them 
		if ( filename_warnings.length > 0 ) {
			let $row = elem.closest('tr');
			$row.addClass('setting-warning');
			$.each( filename_warnings, function( index, warning_text ) {
				$row.find('td').append( '<div class="filename-duplicate-warning"><p>'+warning_text+'</p></div>' );
			});
		} else {
			elem.closest('tr').removeClass('setting-warning').find('.filename-duplicate-warning').remove();
		}

	}).trigger('change');

	// check if another document is using this filename
	function filename_existence_check( filename_duplicates_warning, filename, document_type, language ) {
		$.ajax({
			url:  ajaxurl,
			data: {
				action:        'wcpdf_pro_filename_existence_check',
				nonce:         wpo_wcpdf_pro_settings.nonce,
				filename:      filename,
				document_type: document_type,
				language:      language,
			},
			type: 'POST',
			cache: false,
			async: false,
			success: function( response ) {
				filename_duplicates_warning.response = response.error;
			},
			error: function( xhr, status, error ) {
				console.log( error );
			},
		});
	}

	// Disable 'Always use most current settings' checkbox when 'Keep PDF' is active
	// Check if keep PDF is active on page load
	if($('input#archive_pdf').prop("checked") == true){
		$( 'input#use_latest_settings' ).prop( 'disabled', true );
	}
	// Disable/enable 'Always use most current settings' checkbox when 'Keep PDF' checkbox changes
	$('input#archive_pdf').on('click', function(){
		if($(this).prop("checked") == true){
			$( 'input#use_latest_settings' ).prop( 'disabled', true );
		}
		else if($(this).prop("checked") == false){
			$( 'input#use_latest_settings' ).prop( 'disabled', false );
		}
	});

	// don't allow status selection  from 'auto_generate_for_statuses' if present in 'disable_for_statuses'
	$( '#wpo-wcpdf-settings #disable_for_statuses' ).on( 'change', function() {
		let disabled_statuses    = $( this ).val();
		let $enable_for_statuses = $( '#wpo-wcpdf-settings #auto_generate_for_statuses' );

		$.each( $enable_for_statuses.find( 'option' ), function( index, option ) {
			let disable_option_status = $.inArray( $( option ).val(), disabled_statuses ) !== -1;

			if( disable_option_status ) {
				if ( $( option ).is( ':selected' ) ) {
					$( option ).prop( 'selected', false );
				}
				$( option ).prop( 'disabled', true );
			} else {
				$( option ).prop( 'disabled', false );
			}
		} );

		$enable_for_statuses.selectWoo().trigger( 'change' );
	} ).trigger( 'change' );

	
});