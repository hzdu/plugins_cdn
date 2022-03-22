/* Javascript Document */
jQuery(document).ready(function($){
	$('body').on('click', '#add_cgkit_gallery', function(e){
		e.preventDefault();
		cgkitAddGallery();
		cgkitSortGallery();
	});
	$('body').on('click', '.cgkit-gallery-delete', function(e){
		e.preventDefault();
		cgkitDeleteGallery(this);
		cgkitSortGallery();
	});
	$('body').on('click', '.add-product-images a', function(e){
		e.preventDefault();
		cgkitAddGalleryImages($(this));
	});
	$('body').on('click', '.cgkit-image-delete', function(e){
		e.preventDefault();
		var $parent = $(this).closest('li.product-image');
		var $container = $(this).closest('.cgkit-attributes-images');
		var $input = $container.find('input.cgkit-product-image-gallery');
		var $slug = $container.data('slug');
		var $image_id = $parent.data('image_id');
		if( $slug && $image_id ){
			cgkitDeleteVideo($slug, $image_id);
		}
		$parent.remove();
		cgkitUpdateGalleryImages($input, $container);
		cgkitSortGalleryImages($input, $container);
	});
	$('body').on('click', '.cgkit-videomanager', function(e){
		e.preventDefault();
		cgkitVideoManager(this);
	});
	$('#variable_product_options').on('reload', function(){
		cgkitReloadAttributeGallery();
	});
	$('body').on('click', '#browse-media-library2', function(e){
		e.preventDefault();
		cgkitAddVideoMedia2($(this));
	});
	prepareAttributesSelect2();
	cgkitSortGallery();
	$('body').on('change', '#cgkit-video-input', function(e){
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
function prepareAttributesSelect2(){
	$select = jQuery('#cgkit_attributes');
	$select.select2({placeholder: $select.data('placeholder')})

	$select.on('select2:selecting', function(e){
		var siblings = e.params.args.data.element.parentElement.children
		var sib_parent = e.params.args.data.element.parentElement.parentElement.children;
		for( var i = 0; i < siblings.length; i++ ){
			if( sib_parent[0].value == 'default_gallery' )
				sib_parent[0].selected = false;
			if( sib_parent[1].value == 'global_gallery' )
				sib_parent[1].selected = false;
			var sib_parent_children = siblings[i].children;
			if( sib_parent_children.length > 0 ){
				for( var j = 0; j < sib_parent_children.length; j++ ){
					sib_parent_children[j].selected = false;
				}
			}
			siblings[i].selected = false;
		}
	});
}
function cgkitAddGallery(){
	var $slug = jQuery('#cgkit_attributes').val().join('_cgkit_');
	var $attr_name = jQuery('#cgkit_attributes option:selected').toArray().map(item => item.text).join(' + ');
	
	if( $slug == '' ){
		return;
	}
	if( jQuery('#cgkit_'+$slug).length > 0 ){
		jQuery('#cgkit_'+$slug).addClass('active');
		jQuery('#cgkit_attributes option:selected').prop('selected', false);
		jQuery('#cgkit_attributes').select2().val(null).trigger('change');
		jQuery('html, body').animate({
			scrollTop: jQuery('#cgkit_'+$slug).offset().top - 200
		}, 500);
		setTimeout(function(){jQuery('#cgkit_'+$slug).removeClass('active');}, 2500);
		return;
	}
	cgkitBlock();
	if( $slug != 'default_gallery' && $slug != 'global_gallery' )
		$attr_name += ' ' + cgkit_gallery_text;
	var $template = cgkit_gallery_template;
	$template = $template.replace(/{slug}/g, $slug);
	$template = $template.replace(/{attr_name}/g, $attr_name);
	if( $slug == 'default_gallery' ){
		jQuery('#cgkit-image-gallery').prepend($template);
	} else if( $slug == 'global_gallery' ){
		if( jQuery('#cgkit_default_gallery').length > 0 )
			jQuery('#cgkit_default_gallery').after($template);
		else
			jQuery('#cgkit-image-gallery').prepend($template);
	} else {
		jQuery('#cgkit-image-gallery').append($template);
	}
	jQuery('#cgkit_attributes option:selected').prop('selected', false);
	jQuery('#cgkit_attributes').select2().val(null).trigger('change');
	jQuery('html, body').animate({
		scrollTop: jQuery('#cgkit_'+$slug).offset().top - 200
	}, 500);

	var $container = jQuery('#cgkit_'+$slug);
	var $input = $container.find('input.cgkit-product-image-gallery');
	cgkitSortGalleryImages($input, $container);
	cgkitUnblock();
}
function cgkitDeleteGallery(obj){
	if( confirm(cgkit_delete_gallery_text) ){
		var parent = jQuery(obj).closest('.cgkit-attributes-images');
		$slug = parent.data('slug');
		parent.find('.product-images .product-image').each(function(){
			var $image_id = jQuery(this).data('image_id');
			if( $slug && $image_id ){
				cgkitDeleteVideo($slug, $image_id);
			}
		});
		parent.remove();
	}
}
function cgkitAddGalleryImages($this){
	var product_gallery_frame;
	var $container = $this.closest('.cgkit-attributes-images');
	var $input = $container.find('input.cgkit-product-image-gallery');
	var $slug = $container.data('slug');
	if( product_gallery_frame ){
		product_gallery_frame.open();
		return;
	}

	product_gallery_frame = wp.media.frames.product_gallery = wp.media({
		title: $this.data('choose'),
		button: {
			text: $this.data('update')
		},
		states: [
			new wp.media.controller.Library({
				title: $this.data('choose'),
				filterable: 'images',
				multiple: true
			})
		]
	});	

	product_gallery_frame.on('select', function() {
		var selection = product_gallery_frame.state().get('selection');
		selection.map(function(attachment) {
			attachment = attachment.toJSON();
			if( attachment.id && $container.find('li.product-image[data-image_id="' + attachment.id + '"]').length < 1 ){
				var attachment_image = attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;

				var $elm = jQuery('<li class="product-image" data-image_id="' + attachment.id + '"><img src="' + attachment_image + '" /><ul class="actions"><li><a href="javascript:;" class="cgkit-image-delete">Remove</a></li></ul><span class="dashicons dashicons-video-alt3 cgkit-videomanager cgkit-addvideo"></span></li>');
				$elm.insertBefore($container.find('li').last());
			}
		});
		cgkitUpdateGalleryImages($input, $container);
		cgkitSortGalleryImages($input, $container);
	});
	product_gallery_frame.open();
}
function cgkitUpdateGalleryImages($input, $container){
	var $image_ids = [];
	$container.find('li.product-image').each(function() {
		$image_id = jQuery(this).data('image_id');
		if( jQuery.inArray($image_id, $image_ids) === -1 )
			$image_ids.push($image_id);
	});
	$input.val($image_ids.join(','));
}
function cgkitSortGallery(){
	jQuery('#cgkit_attr_gallery').sortable({
		items: '.postbox:not(#cgkit_default_gallery,#global_gallery)',
		cursor: 'move',
		scrollSensitivity: 40,
		forcePlaceholderSize: true,
		forceHelperSize: false,
		helper: 'clone',
		opacity: 0.65,
		placeholder: 'wc-metabox-sortable-placeholder',
		start: function(event, ui) {
			ui.item.css('background-color', '#f6f6f6');
		},
		stop: function(event, ui) {
			ui.item.removeAttr('style');
		},
		receive: function(ev, ui) {},
		update: function(current, data) {}
	}).disableSelection();

	jQuery('#cgkit-image-gallery .cgkit-attributes-images').each(function(){
		var $input = jQuery(this).find('input.cgkit-product-image-gallery');
		cgkitSortGalleryImages($input, jQuery(this));
	});
}
function cgkitSortGalleryImages($input, $container){
	var $product_images = $container.find('ul.product-images');
	var $target_container = null;
	var $target_input = null;
	var $target_image_id = null;
	var $source_container = $container;
	var $source_input = $input;
	var $source_slug = null;
	$product_images.sortable({
		items: 'li.product-image:not(.ui-state-disabled)',
		connectWith: '.cgkit-product-images',
		cursor: 'move',
		scrollSensitivity: 40,
		forcePlaceholderSize: true,
		forceHelperSize: false,
		helper: 'clone',
		opacity: 0.65,
		placeholder: 'wc-metabox-sortable-placeholder',
		start: function(event, ui) {
			ui.item.css('background-color', '#f6f6f6');
		},
		stop: function(event, ui) {
			ui.item.removeAttr('style');
		},
		receive: function(ev, ui) {
			if(jQuery(ev.target).find('li.product-image[data-image_id="' + ui.item.data('image_id') + '"]').length > 1) {
				alert('Notice: This image is already exists in target gallery.');
				ui.sender.sortable('cancel');
			} else {
				$target_container = jQuery(ev.target).closest('.postbox');
				$target_input = $target_container.find('input.cgkit-product-image-gallery');
				$target_image_id = ui.item.data('image_id');
				$source_container = jQuery(ui.sender).closest('.postbox');
				$source_input = $source_container.find('input.cgkit-product-image-gallery');
				$source_slug = $source_container.data('slug');
			}
		},
		update: function(current, data) {
			cgkitUpdateGalleryImages($source_input, $source_container);
			if( $target_container && $target_input ){
				var $target_product_images = $target_container.find('ul.product-images');
				$target_product_images.find('.ui-state-disabled:not(:last-child)').appendTo($target_product_images);
				cgkitUpdateGalleryImages($target_input, $target_container);
				if( $target_image_id ){
					var $video = jQuery('#cgkit-video-gallery-inputs').find('input[name="commercekit_video_gallery['+ $source_slug +'][' + $target_image_id + ']"]');
					if( $video.length > 0 ){
						var $video_val = $video.val();
						var $target_slug = $target_container.data('slug');
						jQuery('#cgkit-video-gallery-inputs').append('<input class="cgkit-product-video-gallery" name="commercekit_video_gallery['+$target_slug+']['+$target_image_id+']" value="'+$video_val+'" type="hidden" />');
						$video.remove();
					}
				}
			}
		}
	}).disableSelection();
}
function cgkitVideoManager(obj){
	var dialog = jQuery('#cgkit-dialog-video').dialog({
		title: cgkit_video_title_text,
		dialogClass: 'wp-dialog cgkit-dialog',
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
			text: cgkit_video_close_text,
			click: function() {
				jQuery(this).dialog('close');
			}
			}, {
			text: cgkit_video_remove_text,
			click: function() {
				cgkitUpdateVideo('delete', obj);
				jQuery(this).dialog('close');
			}
			}, {
			text: cgkit_video_save_text,
			click: function() {
				cgkitUpdateVideo('update', obj);
				jQuery(this).dialog('close');
			}
		}],
		close: function() {
			jQuery('#cgkit-video-input').val('');
			jQuery('#cgkit-video-slug').val('');
			jQuery('#cgkit-video-image-id').val('');
			if( cgkit_video_auto_play == '1' ){
				jQuery('#cgkit-video-autoplay').prop('checked', true);
			} else {
				jQuery('#cgkit-video-autoplay').prop('checked', false);
			}
		},
		open: function() {
			jQuery('.ui-widget-overlay').bind('click', function() {
				jQuery('#cgkit-dialog-video').dialog('close');
			})
		},
	});
	
	var $slug = jQuery(obj).closest('.cgkit-attributes-images').data('slug');
	var $image_id = jQuery(obj).closest('li.product-image').data('image_id');
	var $video = jQuery('#cgkit-video-gallery-inputs').find('input[name="commercekit_video_gallery['+ $slug +'][' + $image_id + ']"]');
	var $video_val = $video.length > 0 ? $video.val() : '';

	if( $video_val != '' ){
		$video_val = $video_val.split('::');
		if( $video_val[0] != undefined ){
			jQuery('#cgkit-video-input').val($video_val[0]).change();
		} else {
			jQuery('#cgkit-video-input').val('');
		}
		if( $video_val[1] != undefined && $video_val[1] == '1' ){
			jQuery('#cgkit-video-autoplay').prop('checked', true);
		} else {
			jQuery('#cgkit-video-autoplay').prop('checked', false);
		}
	} else {
		if( cgkit_video_auto_play == '1' ){
			jQuery('#cgkit-video-autoplay').prop('checked', true);
		} else {
			jQuery('#cgkit-video-autoplay').prop('checked', false);
		}
	}
	jQuery('#cgkit-video-slug').val($slug);
	jQuery('#cgkit-video-image-id').val($image_id);
	
	dialog.dialog('open');
}
function cgkitUpdateVideo(action, obj){
	var $video_val = jQuery('#cgkit-video-input').val();
	if( $video_val != '' ){
		if( jQuery('#cgkit-video-autoplay').prop('checked') ){
			$video_val += '::1';
		} else {
			$video_val += '::0';
		}
	}
	var $slug = jQuery('#cgkit-video-slug').val();
	var $image_id = jQuery('#cgkit-video-image-id').val();

	var $video = jQuery('#cgkit-video-gallery-inputs').find('input[name="commercekit_video_gallery['+ $slug +'][' + $image_id + ']"]');
	if( $video.length > 0 ){
		if( action == 'update' && $video_val == '' ){
			$video.remove();
			jQuery(obj).removeClass('cgkit-editvideo').addClass('cgkit-addvideo');
		} else if( action == 'update' ){
			$video.val($video_val);
			jQuery(obj).removeClass('cgkit-addvideo').addClass('cgkit-editvideo');
		} else if( action == 'delete' ){
			$video.remove();
			jQuery(obj).removeClass('cgkit-editvideo').addClass('cgkit-addvideo');
		}
	} else {
		if( action == 'update' && $video_val != ''  ){
			jQuery('#cgkit-video-gallery-inputs').append('<input class="cgkit-product-video-gallery" name="commercekit_video_gallery['+$slug+']['+$image_id+']" value="'+$video_val+'" type="hidden" />');
			jQuery(obj).removeClass('cgkit-addvideo').addClass('cgkit-editvideo');
		}
	}
}
function cgkitDeleteVideo($slug, $image_id){
	var $video = jQuery('#cgkit-video-gallery-inputs').find('input[name="commercekit_video_gallery['+ $slug +'][' + $image_id + ']"]');
	if( $video.length > 0 ){
		$video.remove();
	}
}
function cgkitReloadAttributeGallery(){
	cgkitBlock();
	jQuery.ajax({
		url: ajaxurl + '?action=commercekit_get_ajax_product_gallery&product_id='+woocommerce_admin_meta_boxes.post_id,
		type: 'GET',
		dataType: 'json',
		success: function( json ) {
			cgkitUnblock();
			if( json.status == 1 ){
				jQuery('#cgkit_attr_gallery').html(json.html);
				prepareAttributesSelect2();
				cgkitSortGallery();
				jQuery.ajax({
					url: ajaxurl + '?action=commercekit_update_ajax_product_gallery&product_id='+woocommerce_admin_meta_boxes.post_id,
					type: 'POST',
					data: jQuery('#cgkit_attr_gallery').find('input').serialize(),
					dataType: 'json',
					success: function( json ) {}
				});
			}
		}
	});
}
function cgkitAddVideoMedia2($this){
	var product_video_frame2;
	if( product_video_frame2 ){
		product_video_frame2.open();
		return;
	}

	product_video_frame2 = wp.media.frames.product_video = wp.media({
		title: $this.data('choose'),
		button: {
			text: $this.data('update')
		},
		library: {
			type: 'video/mp4'
		},
		multiple: false
	});	

	product_video_frame2.on('select', function() {
		var selection = product_video_frame2.state().get('selection');
		selection.map(function(attachment) {
			attachment = attachment.toJSON();
			jQuery('#cgkit-video-input').val(attachment.url).change();
		});
	});

	product_video_frame2.open();
}
function cgkitBlock(){
	jQuery('#cgkit_attr_gallery').block({message: null, overlayCSS: { background: '#fff', opacity: 0.6 } });
}
function cgkitUnblock(){
	jQuery('#cgkit_attr_gallery').unblock();
}