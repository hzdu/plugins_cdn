jQuery(document).ready(function($) {
	var url
	
	$("#cloud_service_upload_queue, #cloud_service_clear_queue").on('click', function (event) {
		event.preventDefault();

		var url = $(this).attr("href");

		// var H = $(window).height()-120;

		url = url+'&TB_iframe=true&height=200&width=300';

		// disable background scrolling
		// $("body").css({ overflow: 'hidden' });
	
		$(window).on('tb_unload', function() {
			// re-enable scrolling after closing thickbox
			// (not really needed since page is reloaded in the next step, but applied anyway)
			// $("body").css({ overflow: 'inherit' })

			// reload page
			window.location.reload()
		});

		tb_show('', url);
	});
	
});