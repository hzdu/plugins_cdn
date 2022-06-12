(function( $ ) {
	'use strict';

	var openPreviewBtn = $('#24_section_group_li');
	var previewFrameContainer = $('#pdf-catalog-preview-frame-container');
	var previewFrame = $('#pdf-catalog-preview-frame');
	var previewFrameSpinner = $('#pdf-catalog-preview-spinner');
	var previewCategoryID= $('#pdf-catalog-preview-category-id');
	var overlay = $('.pdf-catalog-preview-frame-overlay');

	previewFrame.on('load', function(){
        $(this).show();
        previewFrameSpinner.hide();
        previewFrame.show();
    });

	openPreviewBtn.on('click', function(e) {
		e.preventDefault();

		var category_id = $(previewCategoryID).val();

		overlay.fadeIn();
		previewFrameContainer.fadeIn();
		previewFrameSpinner.show();

		previewFrame.attr("src", woocommerce_pdf_catalog_options.frontend_url + '?pdf-catalog=' + category_id);

	});

	previewCategoryID.on('change', function(e) {

		var category_id = $(this).val();

		previewFrame.hide();
		previewFrameSpinner.show();
		previewFrame.attr("src", woocommerce_pdf_catalog_options.frontend_url + '?pdf-catalog=' + category_id);
	});

	overlay.on('click', function(e) {
		e.preventDefault();
		previewFrameContainer.fadeOut();
		overlay.fadeOut();
	});


})( jQuery );