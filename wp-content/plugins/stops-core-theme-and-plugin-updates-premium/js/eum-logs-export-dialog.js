'use strict';

jQuery(function ($) {

	// Print option
	$('#export-print').on('click', function (e) {
		e.preventDefault();
		window.print();
	});

	// CSV option
	$('#export-csv').on('click', function (e) {
		e.preventDefault();
		var nonce = $('#form-nonce').val();
		var date_start = $('#date-start').val();
		var date_end = $('#date-end').val();
		var $form = $('#form-export-options');
		var $loading = $('#eum-loading');
		$form.css('display', 'none');
		$loading.css('display', 'block');
		$.post(ajaxurl, { action: 'eum_export_csv', nonce: nonce, date_start: date_start, date_end: date_end }, function (response) {
			$form.css('display', 'block');
			$loading.css('display', 'none');
			var blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
			var link = document.body.appendChild(document.createElement('a'));
			var url = URL.createObjectURL(blob);
			link.setAttribute('download', mpsum_export_logs_i18n.export_csv_filename);
			link.setAttribute('style', "display:none;");
			link.setAttribute('href', url);
			link.click();
		});
	});

	// JSON option
	$('#export-json').on('click', function (e) {
		e.preventDefault();
		var nonce = $('#form-nonce').val();
		var date_start = $('#date-start').val();
		var date_end = $('#date-end').val();
		var $form = $('#form-export-options');
		var $loading = $('#eum-loading');
		$form.css('display', 'none');
		$loading.css('display', 'block');
		$.post(ajaxurl, { action: 'eum_export_json', nonce: nonce, date_start: date_start, date_end: date_end }, function (response) {
			$form.css('display', 'block');
			$loading.css('display', 'none');
			var blob = new Blob([response], { type: 'text/json;charset=utf-8;' });
			var link = document.body.appendChild(document.createElement('a'));
			var url = URL.createObjectURL(blob);
			link.setAttribute('download', mpsum_export_logs_i18n.export_json_filename);
			link.setAttribute('style', "display:none;");
			link.setAttribute('href', url);
			link.click();
		});
	});
});