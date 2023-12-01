jQuery(function($){
	error_export_modal = new wlm3_modal( '#error-export-modal' );

	var exporting = false;
	var form = $('#export-form');
	$('.export-progress').hide();
	var export_members = function() {
		exporting = true;
		$.post(form.prop('action'), form.serialize(), function(res) {
			response = wlm.json_parse(res);
			$('.export-total').html(response.total);
			$('.export-low').html( response.current_page * response.per_page+1);
			$('.export-high').html( (response.current_page * response.per_page) + response.exported );
			$('.current_page').val( Number($('.current_page').val()) + 1);

			$('.export-progress').show();
			$('.progress-bar').attr("aria-valuemax", response.total );
			$('.progress-bar').attr("aria-valuenow", response.exported );
			$('.progress-bar').css("width", ((((response.current_page * response.per_page) + response.exported) / response.total) * 100) + "%");
			if(response.error) {
				$('.export-progress').hide();
				$('.start-export').disable_button( {disable:false, icon:"file_download"} );
				$("#" +error_export_modal.data.id).find(".message").html(response.error);
				error_export_modal.open();
				return false;
			}
			if(response.has_more) {
				export_members();
			} else {
				$('.export-progress').hide();
				$('.start-export').disable_button( {disable:false, icon:"file_download"} );
				exporting = false;
				form.submit();
			}
		});
	}

	$('.wlm-select-selectall').allow_select_all();

	$('.start-export').on('click', function(e) {
		e.preventDefault();
		$('.current_page').val(0);
		$(this).disable_button( {disable:true, icon:"update"} );
		export_members();
	});

	window.addEventListener("beforeunload", function (e) {
		if(exporting == true) {
			var confirmationMessage = wp.i18n.__( 'Leaving this page will cancel the current export', 'wishlist-member' );
			(e || window.event).returnValue = confirmationMessage;
			return confirmationMessage;
		}
	});
});