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
		$('.select2-search__field').css( 'width', 'auto' ); // prevents width changes on events

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
	$( 'select.custom-block-type' ).trigger('change'); //ensure visible state matches initially

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
				$current_doc.find('.custom-blocks').append( $block ).trigger( 'wpo_wcpdf_refresh_preview', [ 0 ] );
				$(document.body).trigger( 'wc-enhanced-select-init' );
				$block.find('select.custom-block-type').trigger('change');
				$block.accordion({
					header: '.custom-block-advanced-header',
					collapsible: true,
					active: false,
					activate: function( event, ui ) {
						$('.select2-search__field').css( 'width', '450px' );
					},
				});
				setup_requirements($block);
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
	$( '.dropdown-add-field').on( 'change', function () {
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
				var $html = $( html ).insertBefore( $(this).find('.document.add-field') ).trigger( 'wpo_wcpdf_refresh_preview' );
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
	$( ".field.options [data-key='single_total']" ).on( 'change', function () {
		$block = $(this).closest('.field.options');
		if ( $(this).prop( 'checked' ) ) {
			$block.find( "[data-key='percent'], [data-key='base']" ).prop( 'disabled', true );
			$block.find( "[data-key='percent'], [data-key='base']" ).prop( 'checked', false );
		} else {
			$block.find( "[data-key='percent'], [data-key='base']" ).prop( 'disabled', false );
		}
	});
	// trigger change on page load
	$( ".field.options [data-key='single_total']" ).trigger('change');

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


	// Change template path on description in General settings
	let template_selector     = $( '#wpo-wcpdf-settings #template_path' );
	let description_path      = template_selector.next().find( 'code:first' );

	// make replacement on select change
	$( template_selector ).on( 'change', function() {
		template_path_replacements( $(this).find(':selected').text(), $(this).val() );
	} ).trigger('change');

	function template_path_replacements( template_name, template_path ) {
		let premium_templates = [ 'Business', 'Modern', 'Simple Premium' ];

		// replace plugin path
		if( $.inArray( template_name, premium_templates ) > -1 ) {
			description_path.text( get_template_path_by_id( template_path ) );
		// default to 'Simple Premium' for non premium templates
		} else {
			let simple_premium_template_option = template_selector.find('option').filter( function() {
				if( this.text == 'Simple Premium' ) {
					return this;
				}
			} );
			description_path.text( get_template_path_by_id( simple_premium_template_option.val() ) );
		}
	}

	function get_template_path_by_id( template_id ) {
		let template_path = template_id;
		if ( typeof wpo_wcpdf_admin !== 'undefined' && typeof wpo_wcpdf_admin.template_paths === 'object' ) {
			for ( let path in wpo_wcpdf_admin.template_paths ) {
				if ( wpo_wcpdf_admin.template_paths[path] == template_id ) {
					template_path = path.substring(path.indexOf("wp-content"));
				} 
			}
		}
		return template_path;
	}

	function setup_requirements( block ) {

		// Populate requirement dropdown
		block.find('.custom-block-requirements tr.requirement').each(function( index ) {
			let requirementTitle = $(this).find('label').text();
			let requirementId = $(this).data('requirement_id');
			let $requirements_select = $(this).closest('.custom-block-requirements').find('.select-requirements select');
			$requirements_select.append(
	        	$('<option></option>').val(requirementId).html(requirementTitle)
	        );
		});

		// Either disable requirement from dropdown or hide input when empty
		block.find('.custom-block-requirements tr.requirement').each(function( index ) {
			let requirementId = $(this).data('requirement_id');
			let $requirementInput = $(this).find('td > :input');
			let $requirements_select = $(this).closest('.custom-block-requirements').find('.select-requirements select');
			if ( ( $requirementInput.is(':checkbox') && $requirementInput.is(':checked') ) || ( $requirementInput.is(':checkbox') === false && $requirementInput.val().length > 0 ) ) {
				$requirements_select.find('option[value="' + requirementId + '"]').prop('disabled', true);
			} else {
				$(this).hide();
			}
		});

	}
	// Run once on page load
	$('.custom-block').each(function( index ) {
		setup_requirements( $(this) );
	});

	// Show custom block requirement field
	$('.custom-blocks').on('change', '.select-requirements', function() { 
		let requirement = $(this).val();
		// Show field
		$(this).closest('table.custom-block-requirements').find('tr[data-requirement_id="' + requirement + '"]').show();
		// Disable selected value from dropdown
		$(this).find('option[value="' + requirement + '"]').prop('disabled', true);
		// Set to default
		$(this).val('');
	});

	// Remove custom block requirement field
	$('.custom-blocks').on('click', '.remove-requirement', function() { 
		let $requirement = $(this).closest('tr');
		let requirementId = $requirement.data('requirement_id');
		let $requirements_select = $(this).closest('.custom-block-requirements').find('.select-requirements select');
		// Clear select2
		$requirement.find('select').val('').trigger('change');
		// Hide restriction field
		$requirement.hide();
		// Enable restiction option in dropdown
		$requirements_select.find('option[value="' + requirementId + '"]').removeAttr('disabled');
	});

	// Refresh preview on customizer sortable changes
	$( '#documents .field-list' ).on( 'sortstop', function( event, ui ) {
		$( this ).trigger( 'wpo_wcpdf_refresh_preview' );
	} );

	// Update Preview document type on editor document change
	$( document ).on( 'click', 'ul.document-tabs > li > a', function( event ) {
		let document_type = $( this ).data( 'document_type' );
		$( '#wpo-wcpdf-preview-wrapper :input[name="document_type"]' ).val( document_type ).trigger( 'change' );
	} );

	// Detect if the editor active tab is different from Invoice, and if yes change the preview document type input
	$( document ).ready( function() {
		if ( $( '#documents ul.document-tabs' ).length ) {
			let $active_tab_link = $( '#documents ul.document-tabs > li.ui-state-active > a' );
			let document_type    = $active_tab_link.data( 'document_type' );
			if ( document_type.length && document_type != 'invoice' ) {
				$( '#wpo-wcpdf-preview-wrapper :input[name="document_type"]' ).val( document_type ).trigger( 'change' );
			}
		}
	} );

});