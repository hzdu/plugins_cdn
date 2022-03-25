jQuery(function($) {
	$( "#documents .field-list" ).sortable({
		items: '.field',
		cursor: 'move',
	});

	$( document ).on( "click", ".delete-field", function() { 
		$(this).parent().remove();
	});

	// hide & disable input fields based on type selection
	$( '.custom-blocks' ).on( 'change', 'select.custom-block-type', function () {
		var option = $( this ).val();
		var $current_block = $( this ).closest('.custom-block');
		$current_block.find('.custom-block-settings tr, .custom-block-advanced > p').each(function( index ) {
			var types = $( this ).data('types');
			if (option.length && typeof types !== 'undefined') {
				if (types.indexOf(option) !== -1) {
					$( this ).find('input, textarea').prop('disabled', false);
					$( this ).show();
				} else {
					$( this ).find('input, textarea').val('').prop('disabled', true);
					$( this ).hide();
				}
			}
		});
		$current_block.accordion({
			header: '.custom-block-advanced-header',
			collapsible: true,
			active: false,
			activate: function( event, ui ) {
				$('.select2-search__field').css( 'width', 'auto' );
			},
		});
	})
	$( 'select.custom-block-type' ).change(); //ensure visible state matches initially

	// Add Custom block

	$( '.document-content' ).on( "click", ".button.add-custom-block", function() { 
		var $current_doc = $( this ).closest('.document-content');
		var document_type = $current_doc.data('document-type');
		var data = {
			security:      wpo_wcpdf_templates.nonce,
			action:        'wcpdf_templates_add_custom_block',
			document_type: document_type,
		};

		xhr = $.ajax({
			type:		'POST',
			url:		wpo_wcpdf_templates.ajaxurl,
			data:		data,
			success:	function( data ) {
				var $block = $( data );
				$current_doc.find('.custom-blocks').append( $block );
				$(document.body).trigger( 'wc-enhanced-select-init' );
				$block.find('select.custom-block-type').change();
				$block.accordion({
					header: '.custom-block-advanced-header',
					collapsible: true,
					active: false,
					activate: function( event, ui ) {
						$('.select2-search__field').css( 'width', 'auto' );
					},
				});
			}
		});
	});

	// Custom block of type custom field: placeholder notice
	$( document ).on( "input", ".custom-block-settings .meta_key input", function() { 
		if( ( $(this).val().indexOf("{{") !== -1 ) || $(this).val().indexOf("}}") !== -1 ) {
			$(this).closest('td').addClass('tooltip');
		} else {
			$(this).closest('td').removeClass('tooltip');
		}
	});

	// Add field to totals or columns

	$( '.dropdown-add-field').change(function () {
		var $section = $(this).closest('.field-list');
		var $current_doc = $( this ).closest('.document-content');
		var document_type = $current_doc.data('document-type');
		var $field_value = $(this).val();
		var data = {
			security:      	wpo_wcpdf_templates.nonce,
			action:        	'wcpdf_templates_add_totals_columns_field',
			section:       	$section.data('section_key'),
			document_type: 	document_type,
			field_value:   	$field_value,
		};

		xhr = $.ajax({
			context:    $section,
			type:		'POST',
			url:		wpo_wcpdf_templates.ajaxurl,
			data:		data,
			success:	function( html ) {
				var $html = $( html ).insertBefore( $(this).find('.document.add-field') );
				$html.accordion({
					header: '.field-title',
					collapsible: true,
					active: 0,
				});
				$( "#documents .field-list" ).sortable({
					items: '.field',
					cursor: 'move'
				});
				$( ".dropdown-add-field" ).val('default');
			}
		});
	});

	// Disable VAT percent and VAT base when single_total is checked
	$( ".field.options [data-key='single_total']" ).change(function () {
		$block = $(this).closest('.field.options');
		if ( $(this).attr( 'checked' ) ) {
			$block.find( "[data-key='percent'], [data-key='base']" ).prop( 'disabled', true );
			$block.find( "[data-key='percent'], [data-key='base']" ).attr( 'checked', false );
		} else {
			$block.find( "[data-key='percent'], [data-key='base']" ).prop( 'disabled', false );
		}
	});
	// trigger change on page load
	$( ".field.options [data-key='single_total']" ).change();

	$( '.field.options' ).accordion({
		header: '.field-title',
		collapsible: true,
		active: false
	});

	$( '.fields.library' ).accordion({
		header: 'h4'
	});


	$( '#documents' ).tabs().show();
	$(document.body).trigger( 'wc-enhanced-select-init' );
});
		