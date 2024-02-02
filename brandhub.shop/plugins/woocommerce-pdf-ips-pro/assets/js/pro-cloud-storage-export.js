jQuery(document).ready(function($) {
	var url
	
	$("#doaction, #doaction2").on('click', function (event) {
		var actionselected = $(this).attr("id").substr(2);
		var action         = $('select[name="' + actionselected + '"]').val();

		if ( action.startsWith( 'wpo_wcpdf_cloud_service_export_' ) ) {
			event.preventDefault();
			var checked = [];
			$('tbody th.check-column input[type="checkbox"]:checked').each(
				function() {
					checked.push($(this).val());
				}
			);
			
			var order_ids=checked.join('x');
			
			// var H = $(window).height()-120;

			url = 'edit.php?post_type=shop_order&action='+action+'&order_ids='+order_ids+'&TB_iframe=true&height=200&width=300';

			// disable background scrolling
			$("body").css({ overflow: 'hidden' });
		
			tb_show('', url);
			// console.log(order_ids);
		}
	});

	$(window).on('tb_unload', function() {
		// re-enable scrolling after closing thickbox
		// (not really needed since page is reloaded in the next step, but applied anyway)
		$("body").css({ overflow: 'inherit' })

		// reload page
		// window.location.reload()
	});
	
});