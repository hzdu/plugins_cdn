jQuery(document).ready(function($) {
	var options = {
		dateFormat: 'yy-mm-dd'
	};

	$('#date-from').datepicker(options);
	$('#date-to').datepicker(options);

	$(function () {
		$('.checkall').on('click', function () {
			$(this).closest('fieldset').find(':checkbox').prop('checked', this.checked);
		});
	});

	// disable status filters for exporting credit notes by document date
	// & export by document date = always "only existing"
	$('#wcpdf-pro-bulk-export #date_type, #wcpdf-pro-bulk-export #template_type').on('change', function (event) {
		if ($('#wcpdf-pro-bulk-export #date_type').val() == 'document_date') {
			$('#wcpdf-pro-bulk-export #only_existing').prop("disabled", true).prop('checked', true);
			if ( $('#wcpdf-pro-bulk-export #template_type').val() == 'credit-note' ) {
				$('#wcpdf-pro-bulk-export .status-filters:input, .checkall').prop("disabled", true);
			} else {
				$('#wcpdf-pro-bulk-export .status-filters:input, .checkall').prop("disabled", false);
			}
		} else {
			$('#wcpdf-pro-bulk-export #only_existing').prop("disabled", false);
			$('#wcpdf-pro-bulk-export .status-filters:input, .checkall').prop("disabled", false);
		}
	}).trigger('change');

	$('.button.bulk-export').on('click', function (event) {
		event.preventDefault();
		if ( $(this).hasClass('disabled') ) {
			return;
		}
		var export_mode = ( $(this).hasClass('wpo_wcpdf_cloud_service_bulk_export') ) ? 'cloud_service' : 'zip';

		$('.button.bulk-export').addClass('disabled');
		$('#wcpdf-pro-bulk-export :input').prop("disabled", true);
		$('.bulk-export-waiting').show();

		var status_filters = [];
		$( '#wcpdf-pro-bulk-export .status-filters' ).each(function() {
			if ($(this).is(":checked")) {
				status_filters.push( $(this).val() );
			}
		});
		var data = {
			action:			'wpo_wcpdf_export_get_order_ids',
			security:		woocommerce_pdf_pro_bulk.nonce,
			date_from:		$( '#wcpdf-pro-bulk-export #date-from' ).val(),
			hour_from:		$( '#wcpdf-pro-bulk-export #hour-from' ).val(),
			minute_from:	$( '#wcpdf-pro-bulk-export #minute-from' ).val(),
			date_to:		$( '#wcpdf-pro-bulk-export #date-to' ).val(),
			hour_to:		$( '#wcpdf-pro-bulk-export #hour-to' ).val(),
			minute_to:		$( '#wcpdf-pro-bulk-export #minute-to' ).val(),
			date_type:		$( '#wcpdf-pro-bulk-export #date_type' ).val(),
			document_type:	$( '#wcpdf-pro-bulk-export #template_type' ).val(),
			status_filter:	status_filters,
		};

		// Allow 3rd parties to alter the arguments sent with the Ajax request
		// @author Aelia
		$(document).trigger('wpo_wcpdf_export_get_order_ids_args', data);

		$.post( woocommerce_pdf_pro_bulk.ajax_url, data, function( response ) {
			response = $.parseJSON(response);
			if ( response !== null && typeof response === 'object' && 'error' in response) {
				wpo_wcpdf_bulk_admin_notice( response.error, 'error' );
				$('.button.bulk-export').removeClass('disabled');
				$('#wcpdf-pro-bulk-export :input').prop("disabled", false);
				$('.bulk-export-waiting').hide();
			} else if (response !== null && typeof response === 'object') {
				// we have order_ids!
				woocommerce_pdf_pro_bulk.saved_files = [];
				woocommerce_pdf_pro_bulk.succescount = 0;
				wpo_wcpdf_save_pdf_bulk( response, Number(woocommerce_pdf_pro_bulk.chunk_size), 0, export_mode );
			}
		});

		function wpo_wcpdf_save_pdf_bulk( order_ids, chunk_size, offset, export_mode ) {
			var order_ids_chunk = order_ids.slice(offset,offset+chunk_size);

			var data = {
				action:			'wpo_wcpdf_export_bulk',
				security:		woocommerce_pdf_pro_bulk.nonce,
				template_type:	$( '#wcpdf-pro-bulk-export #template_type' ).val(),
				skip_free:		$( '#wcpdf-pro-bulk-export #skip_free' ).is(':checked'),
				only_existing:	$( '#wcpdf-pro-bulk-export #only_existing' ).is(':checked'),
				order_ids:		order_ids_chunk,
				export_mode:	export_mode,
			};

			$.ajax({
				async:    true,
				url:      woocommerce_pdf_pro_bulk.ajax_url,
				data:     data,
				type:     'POST',
				success:  function( response ) {
					response = $.parseJSON(response);
					if ( response !== null && typeof response === 'object' && 'error' in response) {
						wpo_wcpdf_bulk_admin_notice( response.error, 'error' );
					} else if (response !== null && typeof response === 'object' && 'success' in response) {
						// success!
						// console.log(response.success.length);
						$.each(response.success, function (order_id, filename) {
							woocommerce_pdf_pro_bulk.succescount++;
							woocommerce_pdf_pro_bulk.saved_files.push(filename);
						});

						var message = woocommerce_pdf_pro_bulk.succescount+' PDF documents saved'
						wpo_wcpdf_bulk_admin_notice( message, 'success', 'replace' );
					}
					// calc make new offset
					offset = offset + chunk_size;
					// continue if we have order_ids left
					if ( offset < order_ids.length ) {
						wpo_wcpdf_save_pdf_bulk( order_ids, chunk_size, offset, export_mode );
					} else {
						$('#wcpdf-pro-bulk-export :input').prop("disabled", false);
						$('.button.bulk-export').removeClass('disabled');
						$('.bulk-export-waiting').hide();

						if (export_mode == 'zip') {
							var template_type = $('#wcpdf-pro-bulk-export #template_type').val();
							if (woocommerce_pdf_pro_bulk.ajax_url.indexOf("?") != -1) {
								var url = woocommerce_pdf_pro_bulk.ajax_url+'&action=wpo_wcpdf_zip_bulk&security='+woocommerce_pdf_pro_bulk.nonce+'&transient='+response.transient+'&template_type='+template_type;
							} else {
								var url = woocommerce_pdf_pro_bulk.ajax_url+'?action=wpo_wcpdf_zip_bulk&security='+woocommerce_pdf_pro_bulk.nonce+'&transient='+response.transient+'&template_type='+template_type;
							}

							var a = document.createElement('A');
							a.href = url;
							a.download = response.filename;
							document.body.appendChild(a);
							a.click();
							document.body.removeChild(a);
						}
					}
				}
			});
		}

		function wpo_wcpdf_bulk_admin_notice( message, type, replace ) {
			var notice = '<div class="wpo_wcpdf_bulk_notice notice notice-'+type+'"><p>'+message+'</p></div>';

			$prev_notices = $('.wpo_wcpdf_bulk_notice.notice-'+type);
			if (typeof replace === 'undefined' || $prev_notices.length == 0) {
				$main_header = $( '#wpbody-content > .wrap > h2:first' );
				$main_header.after( notice );
				$('html, body').animate({ scrollTop: 0 }, 'slow');
			} else {
				$('.wpo_wcpdf_bulk_notice.notice-'+type).first().replaceWith( notice );
			}

		}
	});
});
