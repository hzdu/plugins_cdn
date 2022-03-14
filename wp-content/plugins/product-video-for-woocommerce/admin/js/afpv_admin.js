jQuery(document).ready(function($) {


	// Allow custom amount.
    $( 'input#afpv_enable_featured_video_product_page' ).on( 'change', function() {
        if ( $( this ).is( ':checked' ) ) {
            $( '#afpv_enable_featured_image_as_first_img' ).closest( '.meta_field_full' ).show('slow');
            $( '#afpv_enable_featured_image_as_first_img' ).closest( '.meta_field_full' ).show('slow');
        } else {
            $( '#afpv_enable_featured_image_as_first_img' ).closest( '.meta_field_full' ).hide('slow');
            $( '#afpv_enable_featured_image_as_first_img' ).closest( '.meta_field_full' ).hide('slow');
        }
    }).trigger( 'change' );


	var ajaxurl = k_php_var.admin_url;
	var nonce   = k_php_var.nonce;
	jQuery('.afpv_applied_products').select2({

		ajax: {
			url: ajaxurl, // AJAX URL is predefined in WordPress admin
			dataType: 'json',
			type: 'POST',
			delay: 250, // delay in ms while typing when to perform a AJAX search

			data: function (params) {
				return {
					q: params.term, // search query
					action: 'afpv_search_product', // AJAX action for admin-ajax.php
					nonce: nonce // AJAX nonce for admin-ajax.php
				};
			},

			processResults: function( data ) {
				var options = [];
				if ( data ) {
					// data is the array of arrays, and each of them contains ID and the Label of the option
					$.each( data, function( index, text ) { // do not forget that "index" is just auto incremented value
						options.push( { id: text[0], text: text[1]  } );
					});
				}
				return {
					results: options
				};
			},
			cache: true
		},

		multiple: true,
		placeholder: 'Choose Products',
		minimumInputLength: 3 // the minimum of symbols to input before perform a search
	});

	jQuery('.afpv-custom-vid').fadeOut();

	jQuery('.afpv-custom-vid-product-level').fadeOut();

	

});

function getVideoType(value) {

	"use strict";

	if (value == 'youtube') {
		jQuery('#youtube').show();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'facebook') {
		jQuery('#youtube').hide();
		jQuery('#facebook').show();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'dailymotion') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').show();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'vimeo') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').show();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'metacafe') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').show();
		jQuery('#custom').hide();
	} else if (value == 'custom') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').show();
	}

}

jQuery(document).ready(function($) {

	"use strict";

	// $('.afpv_applied_products').select2({
	// 	minimumInputLength: 3 // only start searching when the user has input 3 or more characters
	// });

	var value = $("#afpv_featured_video_type option:selected").val();
	if (value == 'youtube') {
		jQuery('#youtube').show();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'facebook') {
		jQuery('#youtube').hide();
		jQuery('#facebook').show();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'dailymotion') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').show();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'vimeo') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').show();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'metacafe') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').show();
		jQuery('#custom').hide();
	} else if (value == 'custom') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').show();
	}

});

jQuery(document).ready(function($) {

	"use strict";

	// $('.afpv_applied_products').select2({
	// 	minimumInputLength: 3 // only start searching when the user has input 3 or more characters
	// });

	var value = $("#afpv_product_video_type option:selected").val();
	if (value == 'youtube') {
		jQuery('#youtube').show();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'facebook') {
		jQuery('#youtube').hide();
		jQuery('#facebook').show();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'dailymotion') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').show();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'vimeo') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').show();
		jQuery('#metacafe').hide();
		jQuery('#custom').hide();
	} else if (value == 'metacafe') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').show();
		jQuery('#custom').hide();
	} else if (value == 'custom') {
		jQuery('#youtube').hide();
		jQuery('#facebook').hide();
		jQuery('#dailymotion').hide();
		jQuery('#vimeo').hide();
		jQuery('#metacafe').hide();
		jQuery('#custom').show();
	}

});

function afpv_video() { 

	"use strict";
	var image = wp.media({ 
		title: 'Upload Video',
		// mutiple: true if you want to upload multiple files at once
		multiple: false
	}).open()
	.on('select', function(){
		// This will return the selected image from the Media Uploader, the result is an object
		var uploaded_image = image.state().get('selection').first();
		// We convert uploaded_image to a JSON object to make accessing it easier
		// Output to the console uploaded_image
		var image_url = uploaded_image.toJSON().url;
		// Let's assign the url value to the input field
		jQuery('#afpv_video_url').val(image_url);
		// jQuery('#afpv-videp-id').html("<source src='"+image_url+"' type='video/mp4' />");
		jQuery('.afpv-custom-vid').html("<source src='"+image_url+"' type='video/mp4' />");
		jQuery('.afpv-custom-vid').fadeIn();
		jQuery('.afpv-custom-vid-product-level').html("<source src='"+image_url+"' type='video/mp4' />");
		jQuery('.afpv-custom-vid-product-level').fadeIn();
	});

}

function afpv_image() { 

	"use strict";
	var image = wp.media({ 
		title: 'Upload Image',
		// mutiple: true if you want to upload multiple files at once
		multiple: false
	}).open()
	.on('select', function(){
		// This will return the selected image from the Media Uploader, the result is an object
		var uploaded_image = image.state().get('selection').first();
		// We convert uploaded_image to a JSON object to make accessing it easier
		// Output to the console uploaded_image
		var image_url = uploaded_image.toJSON().url;
		// Let's assign the url value to the input field
		jQuery('#afpv_thumb_url').val(image_url);
		jQuery('#logodisplay').html("<img src='"+image_url+"' width='200' />");
	});

}

function afpv_clear_image() {

	"use strict";
	jQuery('#afpv_thumb_url').val('');
	jQuery('#logodisplay').html("");

}

jQuery(document).ready(function($) {


	/*=== Script For Gallery Options Enable & Disable ===*/

	if ($("#pv_select_gallery_template_option").val()=='html5_lightbox_template') {
		$('.afpv-lightbox-gallery-img').closest('img').show();
		$('.woo-gallery-img').closest('img').hide();
	} else if ($("#pv_select_gallery_template_option").val()=='woo_gallery_template') {
		$('.woo-gallery-img').closest('img').show();
		$('.afpv-lightbox-gallery-img').closest('img').hide();
	} else {
		$('.afpv-lightbox-gallery-img').closest('img').hide();
		$('.woo-gallery-img').closest('img').hide();
	}

	jQuery(function ($) {
		$("#pv_select_gallery_template_option").change(function () {
			if ($(this).val()=='html5_lightbox_template') {
				$('.afpv-lightbox-gallery-img').closest('img').show();
				$('.woo-gallery-img').closest('img').hide();
			} else if ($(this).val()=='woo_gallery_template') {
				$('.woo-gallery-img').closest('img').show();
				$('.afpv-lightbox-gallery-img').closest('img').hide();
			} else {
				$('.afpv-lightbox-gallery-img').closest('img').hide();
				$('.woo-gallery-img').closest('img').hide();
			}
		});
	});



	/*=== Script For Gallery Selection ===*/

	if ($("#pv_select_gallery_template_option").val()=='woo_gallery_template') {
		$('#pv_gallery_thumbnail_position').closest('tr').show();
		$('#pv_gallery_thumbnail_to_show').closest('tr').show();
		$('#pv_gallery_thumbnail_to_scroll').closest('tr').show();
		$('#pv_arrows_gallery_controller').closest('tr').show();
		$('#pv_dots_gallery_controller').closest('tr').show();
		$('#pv_autoplay_gallery').closest('tr').show();
		$('#afpv-play-icon-box').closest('tr').show();
		$('#pv_product_page_thumbnails_width').closest('tr').hide();

	} else {
		$('#pv_gallery_thumbnail_position').closest('tr').hide();
		$('#pv_gallery_thumbnail_to_show').closest('tr').hide();
		$('#pv_gallery_thumbnail_to_scroll').closest('tr').hide();
		$('#pv_arrows_gallery_controller').closest('tr').hide();
		$('#pv_dots_gallery_controller').closest('tr').hide();
		$('#pv_autoplay_gallery').closest('tr').hide();
		$('#afpv-play-icon-box').closest('tr').hide();
		$('#pv_product_page_thumbnails_width').closest('tr').show();
	}

	jQuery(function ($) {
		$("#pv_select_gallery_template_option").change(function () {

			if ($(this).val()=='woo_gallery_template') {
				$('#pv_gallery_thumbnail_position').closest('tr').show();
				$('#pv_gallery_thumbnail_to_show').closest('tr').show();
				$('#pv_gallery_thumbnail_to_scroll').closest('tr').show();
				$('#pv_autoplay_gallery').closest('tr').show();
				$('#pv_arrows_gallery_controller').closest('tr').show();
				$('#pv_dots_gallery_controller').closest('tr').show();
				$('#afpv-play-icon-box').closest('tr').show();
				$('#pv_product_page_thumbnails_width').closest('tr').hide();
			} else {
				$('#pv_gallery_thumbnail_position').closest('tr').hide();
				$('#pv_gallery_thumbnail_to_show').closest('tr').hide();
				$('#pv_gallery_thumbnail_to_scroll').closest('tr').hide();
				$('#pv_autoplay_gallery').closest('tr').hide();
				$('#pv_arrows_gallery_controller').closest('tr').hide();
				$('#pv_dots_gallery_controller').closest('tr').hide();
				$('#afpv-play-icon-box').closest('tr').hide();
				$('#pv_product_page_thumbnails_width').closest('tr').show();
			}

		});

	});



	/*=== Script For Gallery Positions Enable & Disable ===*/

	if ($("#pv_gallery_thumbnail_position").val()=='pv_gallery_thumbnail_left_position') {

		$('.afpv_gallery_left_position').closest('img').show();
		$('.afpv_gallery_right_position').closest('img').hide();
		$('.afpv_gallery_top_position').closest('img').hide();
		$('.afpv_gallery_bottom_position').closest('img').hide();

	} else if ($("#pv_gallery_thumbnail_position").val()=='pv_gallery_thumbnail_right_position') {

		$('.afpv_gallery_right_position').closest('img').show();
		$('.afpv_gallery_left_position').closest('img').hide();
		$('.afpv_gallery_top_position').closest('img').hide();
		$('.afpv_gallery_bottom_position').closest('img').hide();

	} else if ($("#pv_gallery_thumbnail_position").val()=='pv_gallery_thumbnail_top_position') {

		$('.afpv_gallery_right_position').closest('img').hide();
		$('.afpv_gallery_left_position').closest('img').hide();
		$('.afpv_gallery_top_position').closest('img').show();
		$('.afpv_gallery_bottom_position').closest('img').hide();

	} else {

		$('.afpv_gallery_right_position').closest('img').hide();
		$('.afpv_gallery_left_position').closest('img').hide();
		$('.afpv_gallery_top_position').closest('img').hide();
		$('.afpv_gallery_bottom_position').closest('img').show();

	}

	jQuery(function ($) {
		$("#pv_gallery_thumbnail_position").change(function () {

			if ($(this).val()=='pv_gallery_thumbnail_left_position') {

				$('.afpv_gallery_left_position').closest('img').show();
				$('.afpv_gallery_right_position').closest('img').hide();
				$('.afpv_gallery_top_position').closest('img').hide();
				$('.afpv_gallery_bottom_position').closest('img').hide();

			} else if ($(this).val()=='pv_gallery_thumbnail_right_position') {

				$('.afpv_gallery_right_position').closest('img').show();
				$('.afpv_gallery_left_position').closest('img').hide();
				$('.afpv_gallery_top_position').closest('img').hide();
				$('.afpv_gallery_bottom_position').closest('img').hide();

			} else if ($(this).val()=='pv_gallery_thumbnail_top_position') {

				$('.afpv_gallery_right_position').closest('img').hide();
				$('.afpv_gallery_left_position').closest('img').hide();
				$('.afpv_gallery_top_position').closest('img').show();
				$('.afpv_gallery_bottom_position').closest('img').hide();

			} else {

				$('.afpv_gallery_right_position').closest('img').hide();
				$('.afpv_gallery_left_position').closest('img').hide();
				$('.afpv_gallery_top_position').closest('img').hide();
				$('.afpv_gallery_bottom_position').closest('img').show();
				
			}

		});

	});

});


