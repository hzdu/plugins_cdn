jQuery( function($) {
	var form = $('#happyforms-export-form');
	var filters = form.find('.export-filters');

	filters.hide();

	form.find('input:radio').on( 'change', function() {
		filters.slideUp('fast');
		switch ( $(this).val() ) {
			case 'export_responses': $('#submission-filters').slideDown(); break;
			case 'export_form': $('#form-filters').slideDown(); break;
		}
	});
} );
