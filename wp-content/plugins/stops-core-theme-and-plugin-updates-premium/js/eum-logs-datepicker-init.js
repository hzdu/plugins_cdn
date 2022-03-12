'use strict';

jQuery(function ($) {

	// Initialize date pickers
	var dateFormat = "yy-mm-dd";
	var $from = $('#export_date_start');
	var $to = $('#export_date_end');
	$from.datepicker({
		defaultDate: "-1w",
		changeMonth: true,
		changeYear: true,
		dateFormat: dateFormat
	});
	$to.datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true,
		dateFormat: dateFormat
	});

	// Initialize events
	$('input#log-export').on('click', function (e) {
		e.preventDefault();
		var $target = $(e.target);
		var $export_dialog = $('.export-date-range');
		$export_dialog.css('top', $target.position().top - $target.height() - $export_dialog.height() - 10 + 'px');
		export_go_button_url();
		$export_dialog.slideToggle(1000);
	});
	$('.export-cancel').on('click', function (e) {
		e.preventDefault();
		$('.export-date-range').slideToggle(1000);
	});
	$('#eum-export-go').on('click', function (e) {
		$('.export-date-range').slideToggle(1000);
	});
	$to.on('change', function (e) {
		export_go_button_url();
	});
	$from.on('change', function (e) {
		export_go_button_url();
	});

	function export_go_button_url() {
		// Populate Thickbox URL
		var ajax_url = $('#export-ajax-url').val();
		if ('' != $to.val() && '' != $from.val()) {
			ajax_url += '&date_start=' + encodeURIComponent($from.val()) + '&date_end=' + encodeURIComponent($to.val());
		}
		ajax_url += '&TB_iframe=true';
		var $export_go_button = $('#eum-export-go');
		$export_go_button.prop('href', ajax_url);
	}
	export_go_button_url();
});