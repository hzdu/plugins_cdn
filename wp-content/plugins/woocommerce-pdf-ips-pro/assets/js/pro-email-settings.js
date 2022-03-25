jQuery( function( $ ) {
	$( '#woocommerce_pdf_order_notification_empty_body' ).on('change', function (e) {
		var empty_body = $(this).is(':checked');
		$(':input[data-body_only]').each( function(){
			if( empty_body ) {
				$(this).closest('tr').hide();
			} else {
				$(this).closest('tr').show();
			}
		});
	}).trigger('change');
});