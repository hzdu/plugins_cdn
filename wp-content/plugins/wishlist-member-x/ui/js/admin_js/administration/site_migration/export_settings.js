jQuery(function($){
	$('body').off('.export-settings');
	$('body').on('click.export-settings', '#export-membership-levels', function() {
		if ( $(this).is(':checked') ) {
			$('#membership-levels').show("blind",500);
		} else {
			$('#membership-levels').hide("blind",500);
		}
	});
	$('body').on('click.export-settings', '.export-settings-btn', function() {
		 $("#export_form").submit();
	});

	$('body').on('submit.export-settings', '#export_form', function() {
		$.post(
			WLM3VARS.ajaxurl,
			$(this).serialize(),
			function(data) {
				var a = document.createElement('a');
				var url = window.URL.createObjectURL(new Blob([data.content]));
				a.href = url;
				a.download = data.name;
				// console.log(a);
				// a.click(); //does not work on FF
				a.dispatchEvent(new MouseEvent(`click`, {bubbles: true, cancelable: true, view: window}));
				window.URL.revokeObjectURL(url);
			}
		)
		return false;
	});

	$('.chk_settings').click(function() {
		enable_export();
	});

	// $('.wlm-select-selectall').allow_select_all({column: true,column_class:'col-md-6 no-margin no-padding', class: 'pull-left'}).on("selection_updated", function(){
	// 	enable_export();
	// });
	$('.wlm-select-selectall').allow_select_all().on("selection_updated", function(){
		enable_export();
	});
});

function enable_export() {
	if ( $('.chk_settings:checked').length <= 0 ) {
		$('.export-settings-btn').removeClass("-primary").addClass("-default");
		$('.export-settings-btn').addClass("disabled").prop("disabled", true).attr("disabled", "disabled");
		return;
	}
	if ( $("#export-membership-levels").is(":checked") ) {
		if ( $(".wlm-select").val().length <= 0 ) {
			$('.export-settings-btn').removeClass("-primary").addClass("-default");
			$('.export-settings-btn').addClass("disabled").prop("disabled", true).attr("disabled", "disabled");
			return;
		}
	}
	$('.export-settings-btn').addClass("-primary").removeClass("-default");
	$('.export-settings-btn').removeClass("disabled").prop("disabled", false).removeAttr("disabled");
}
