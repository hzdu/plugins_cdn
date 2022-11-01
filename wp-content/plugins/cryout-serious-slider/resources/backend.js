
jQuery(document).ready( function() {
	
	/* hide unused built-in attributes in quick edit */
	jQuery('#the-list').on('click', 'div.row-actions a.editinline', function( event ) {
		setTimeout( function() {
			jQuery('#the-list').find('input[name="post_name"]').parents('label').hide();
			jQuery('#the-list').find('input[name="post_password"]').parents('label').parent().hide();
		}, 3);
	});
	
	/* meta color picker */
	if (jQuery.isFunction(jQuery.fn.wpColorPicker)) {
		jQuery('input[name*="cryout_serious_slider_accent"]').wpColorPicker();
	}
	
	/* 'continue' button */
	jQuery('body').on('click', '.seriousslider-new-slider-button a#new-slider-button', function() {
		jQuery('.seriousslider-new-slider-wrapper').parent().children('.submit').slideDown('fast'); 
		jQuery('.seriousslider-new-slider-button').slideUp( 1, function() {
			jQuery('.seriousslider-new-slider-wrapper').slideDown( 350 );
		});
	});

	/*
	 * bind the media uploader at current and future ( 'live()' ) image upload buttons
	 * single image selection
	 */
	jQuery( document ).on( 'click', '.sslide_set_link', function( e ) {

		e.preventDefault();

		/* get number of post */
		var post_id = this.id.match( /[0-9]+/ );

		/* get parent jQ object of clicked link */
		var origin_parent = jQuery( this ).parent();

		/*  Extend the wp.media object for selection of a single image */
		var text_link = jQuery( this ).text();
		var custom_uploader = wp.media.frames.file_frame = wp.media( {
			title: text_link,
			library: {
				type: 'image'
			},
			button: {
				text: text_link
			},
			multiple: false
		} );

		/*  When a file is selected, grab the URL and set it as the text field's value */
		custom_uploader.on( 'select', function() {
			/*  get selected image */
			var attachment = custom_uploader.state().get( 'selection' ).first().toJSON();

			/* set image as featured for current post via Ajax and print response */
			jQuery.post( ajaxurl, {
				action:			 'cryout_serious_slider_set_image',
				post_id:		post_id,
				thumbnail_id:	attachment.id,
				cryout_sslider_column_nonce:		CRYOUT_MCE_LOCALIZED.nonce,
				cookie:			encodeURIComponent( document.cookie )
			}, function( response ) {
				/* fade in new content */
				origin_parent.html( response ).hide().fadeIn();
			});

		} );

		/* Open the uploader dialog */
		custom_uploader.open();

		/* prevent following the link href */
		return false;

	} );

	/*
	 * remove featured image from post and
	 * display 'set image' link
	 */
	jQuery( document ).on( 'click', '.sslide_delete_link', function( e ) {

		e.preventDefault();

		/* get number of post */
		var post_id = this.id.match( /[0-9]+/ );

		/* get parent jQ object of clicked link */
		var origin_parent = jQuery( this ).parent();

		/* remove featured image */
		jQuery.post( ajaxurl, {
			action:		'cryout_serious_slider_delete_image',
			post_id:	post_id,
			cryout_sslider_column_nonce:	CRYOUT_MCE_LOCALIZED.nonce,
			cookie:		encodeURIComponent( document.cookie )
		}, function( response ) {
			/* fade in new content */
			origin_parent.html( response ).hide().fadeIn();
		});

		/* prevent following the link href */
		return false;

	} );

} );


jQuery(document).ready(function($){

	jQuery('input#tag-name').attr('placeholder', jQuery( '.term-name-wrap > label' ).text() );

	/* Tabs */
	jQuery( function() {
      jQuery( "#seriousslider-tabs" ).tabs();
    } );

	/* Image selector */
	var custom_uploader;
	$('#seriousslider-media').on( 'click', function(e) {
	e.preventDefault();
	/* If the uploader object has already been created, reopen the dialog */
	if (custom_uploader) {
	  custom_uploader.open();
	  return;
	}
	/* Extend the wp.media object */
	custom_uploader = wp.media.frames.file_frame = wp.media({
	  title: jQuery('#seriousslider-media').text(),
	  /* button: {
		text: 'Choose Images'
	  }, */
	  library: {
		type: [ 'image' ]
	  },
	  multiple: true
	});
	custom_uploader.on('select', function() {

		$(".seriousslider-media-container").empty();
		$(".cryout-serious-slider-imagelist").val('');

		var selection = custom_uploader.state().get('selection');
		var ids = [];
		selection.map( function( attachment ) {
			thumbnail_url = attachment.attributes.sizes.thumbnail.url;
			attachment = attachment.toJSON();
			$(".seriousslider-media-container").append("<div class='seriousslider-single-thumb'><img src=" +thumbnail_url+"></div>");
			ids.push( attachment.id );
		});
		$(".cryout-serious-slider-imagelist").val( ids );
	});
	custom_uploader.open();
	});

});

jQuery(document).ready(function($){
	jQuery('body').on( 'click', '.button.media-serious-slider-button', function() {
		tinymceActive = (typeof tinyMCE != 'undefined') && tinyMCE.activeEditor && !tinyMCE.activeEditor.isHidden();
		if ( tinymceActive ) {
			window.tinymce.activeEditor.execCommand('serious_slider_popup','',{});
		} else {
			alert( 'Please switch to the Visual Editor to insert a slider.');
		}		
	});
});

// FIN