jQuery( 'document' ).ready(
	function(){
		jQuery( '#wpep-export-transactions' ).on(
			'click',
			function(e) {
				e.preventDefault();
				jQuery( 'div#wpep-reports-popup-container' ).show();
			}
		);

		jQuery( '.wpep-reports-close, .wpep-reports-popup-overlay' ).on(
			'click',
			function(e) {
				e.preventDefault();
				jQuery( 'div#wpep-reports-popup-container' ).hide();
				jQuery( '#formSelector' )[0].reset();
			}
		);

		jQuery( "#checkAll" ).click(
			function(){
				jQuery( "input[name=wpep_reports_export_fields]" ).prop( 'checked', jQuery( this ).prop( 'checked' ) );
			}
		);

		jQuery( '#wpep-download-now' ).on(
			'click',
			function(a){
				a.preventDefault();
				// alert(1);
				console.log( jQuery( '#formSelector' ).serializeArray() );
				jQuery.ajax(
					{
						url: wpep_reports.ajaxUrl,
						type: "POST",
						dataType: "json",
						data: {
							action: wpep_reports.action,
							nonce: wpep_reports.nonce,
							post_type: wpep_reports.post_type,
							fields: jQuery( '#formSelector' ).serializeArray(),
						},
						beforeSend: function () {
							jQuery( '#wpep-export-transactions' ).attr( 'disabled', 'true' );
						},
						success: function (response) {
							// print response in console log for test only

							console.log( response );
							// jQuery.fileDownload(wpep_reports.reports_download_url);
							if (response.status == true) {
								jQuery( 'div#wpep-reports-popup-container' ).hide();
								jQuery( '#formSelector' )[0].reset();
								window.location.href = wpep_reports.reports_download_url;
								jQuery( '#wpep-export-transactions' ).removeAttr( 'disabled', 'true' );
							}
						}
					}
				);
			}
		);
	}
);
