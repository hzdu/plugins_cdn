(function( $ ) {
	'use strict';

	var openPreviewBtn = $('.woocommerce_page_woocommerce_packing_slips_options_options #9_section_group_li_a, .-d9-88-d9-88-da-a9-d8-a7-d9-85-d8-b1-d8-b3_page_woocommerce_packing_slips_options_options #9_section_group_li_a');
	var previewFrameContainer = $('#packing-slip-preview-frame-container');
	var previewFrame = $('#packing-slip-preview-frame');
	var previewFrameSpinner = $('#packing-slip-preview-spinner');
	var previewOrderID= $('#packing-slip-preview-order-id');
	var overlay = $('.packing-slip-preview-frame-overlay');
	var url = window.location.href.split('?')[0];

	previewFrame.load(function(){
        $(this).show();
        previewFrameSpinner.hide();
        previewFrame.show();
    });

	openPreviewBtn.on('click', function(e) {
		e.preventDefault();

		var order_id = $(previewOrderID).val();
		
		overlay.fadeIn();
		previewFrameContainer.fadeIn();
		previewFrameSpinner.show();

		previewFrame.attr("src", url + '?create_packing_slip=' + order_id);

	});

	previewOrderID.on('change', function(e) {

		var order_id = $(this).val();

		previewFrame.hide();
		previewFrameSpinner.show();
		previewFrame.attr("src", url + '?create_packing_slip=' + order_id);
	})

	overlay.on('click', function(e) {
		e.preventDefault();
		previewFrameContainer.fadeOut();
		overlay.fadeOut();
	});


})( jQuery );