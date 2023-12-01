jQuery(function($){
	$('body').off('.system-info');
	$('body').on('click.system-info', '.download-btn', function() {
		 $("#sysinfo_form").submit();
	});

	$('body').on('submit.system-info', '#sysinfo_form', function() {
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
});
