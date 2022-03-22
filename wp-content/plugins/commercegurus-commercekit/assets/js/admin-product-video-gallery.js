/* Javascript Document */
jQuery(document).ready(function($){
	$('body').on('click', '.cgkit-videos', function(e){
		e.preventDefault();
		cgkitVideoDialog(this);
	});
	$('body').on('click', '#browse-media-library', function(e){
		e.preventDefault();
		cgkitAddVideoMedia($(this));
	});
	var inputImage = document.querySelector('input#product_image_gallery');
	if( inputImage ) {
		observer = new MutationObserver((changes) => {
		  changes.forEach(change => {
			  if(change.attributeName.includes('value')){
				addVideoGalleryInterface();
			  }
		  });
		});
		observer.observe(inputImage, {attributes : true});
	}
	addVideoGalleryInterface();
	$('body').on('change', '#cgkit-video-dialog-input', function(e){
		var val = $(this).val().toLowerCase();
		if( val.indexOf('vimeo.com/') != -1 ){
			return;
		}
		if( val.indexOf('youtube.com/') != -1 ){
			return;
		}
		if( val.indexOf('youtu.be/') != -1 ){
			return;
		}
		var vals = val.split('?')[0];
		if( $.inArray(vals.split('.').pop(), ['mp4']) == -1 ){
			$(this).val('');
			alert($(this).data('error'));
		}
	});
});
function addVideoGalleryInterface(){
	jQuery('#product_images_container ul.product_images > li').each(function(){
		var video = jQuery(this).find('span.cgkit-videos');
		if( video.length == 0 ){
			var image_id = jQuery(this).data('attachment_id');
			jQuery(this).append('<span class="dashicons dashicons-video-alt3 cgkit-videos cgkit-addvideos"><input type="hidden" class="cgkit-video-gallery" name="commercekit_wc_video_gallery['+image_id+']" value="" /></span>');
		}
	});
}
function cgkitVideoDialog(obj){
	var video_input = jQuery('#cgkit-video-dialog-input');
	var video_autoplay = jQuery('#cgkit-video-dialog-autoplay');
	var video_dialog = jQuery('#cgkit-video-dialog').dialog({
		title: cgkit_video_dialog_title,
		dialogClass: 'wp-dialog cgkit-video-dialog',
		autoOpen: false,
		width: 'auto',
		modal: true,
		resizable: false,
		closeOnEscape: true,
		position: {
			my: 'center',
			at: 'center',
			of: window
		},
		buttons: [{
			text: cgkit_video_dialog_close,
			click: function() {
				jQuery(this).dialog('close');
			}
			}, {
			text: cgkit_video_dialog_remove,
			click: function() {
				jQuery(obj).removeClass('cgkit-editvideos').addClass('cgkit-addvideos');
				jQuery(obj).find('input.cgkit-video-gallery').val('');
				video_input.val('');
				if( cgkit_video_dialog_auto_play == '1' ){
					video_autoplay.prop('checked', true);
				} else {
					video_autoplay.prop('checked', false);
				}
				jQuery(this).dialog('close');
			}
			}, {
			text: cgkit_video_dialog_save,
			click: function() {
				if( video_input.val() != '' ){
					jQuery(obj).removeClass('cgkit-addvideos').addClass('cgkit-editvideos');
				} else {
					jQuery(obj).removeClass('cgkit-editvideos').addClass('cgkit-addvideos');
				}
				var video_url = video_input.val();
				if( video_url != '' ){
					if( video_autoplay.prop('checked') ){
						video_url += '::1';
					} else {
						video_url += '::0';
					}
				}
				jQuery(obj).find('input.cgkit-video-gallery').val(video_url);
				video_input.val('');
				if( cgkit_video_dialog_auto_play == '1' ){
					video_autoplay.prop('checked', true);
				} else {
					video_autoplay.prop('checked', false);
				}
				jQuery(this).dialog('close');
			}
		}],
		close: function() {
			video_input.val('');
			if( cgkit_video_dialog_auto_play == '1' ){
				video_autoplay.prop('checked', true);
			} else {
				video_autoplay.prop('checked', false);
			}
		},
		open: function() {
			jQuery('.ui-widget-overlay').bind('click', function() {
				jQuery('#cgkit-video-dialog').dialog('close');
			})
		},
	});
	
	var video_val = jQuery(obj).find('input.cgkit-video-gallery').val();
	if( video_val != '' ){
		video_val = video_val.split('::');
		if( video_val[0] != undefined ){
			video_input.val(video_val[0]).change();
		} else {
			video_input.val('');
		}
		if( video_val[1] != undefined && video_val[1] == '1' ){
			video_autoplay.prop('checked', true);
		} else {
			video_autoplay.prop('checked', false);
		}
	} else {
		video_input.val('');
		if( cgkit_video_dialog_auto_play == '1' ){
			video_autoplay.prop('checked', true);
		} else {
			video_autoplay.prop('checked', false);
		}
	}
	video_dialog.dialog('open');
}
function cgkitAddVideoMedia($this){
	var product_video_frame;
	if( product_video_frame ){
		product_video_frame.open();
		return;
	}

	product_video_frame = wp.media.frames.product_video = wp.media({
		title: $this.data('choose'),
		button: {
			text: $this.data('update')
		},
		library: {
			type: 'video/mp4'
		},
		multiple: false
	});	

	product_video_frame.on('select', function() {
		var selection = product_video_frame.state().get('selection');
		selection.map(function(attachment) {
			attachment = attachment.toJSON();
			jQuery('#cgkit-video-dialog-input').val(attachment.url).change();
		});
	});

	product_video_frame.open();
}
