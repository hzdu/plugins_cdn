/* Javascript Document */
jQuery(document).ready(function($){
	$('select.cgkit-attribute-watches-type').each(function(){
		var cls_val = $(this).val();
		var container = $(this).closest('.cgkit-attribute-swatches');
		cgkitUpdateSwatchType(cls_val, container);
	});
	$('body').on('change', 'select.cgkit-attribute-watches-type', function(){
		var cls_val = $(this).val();
		var container = $(this).closest('.cgkit-attribute-swatches');
		cgkitUpdateSwatchType(cls_val, container);
	});
	$('body').on('click', '.image-cntnr', function(e){
		e.preventDefault();
		cgkitAddImageAS($(this));
	});
	$('body').on('click', '.cgkit-as-delete', function(e){
		e.preventDefault();
		e.stopPropagation();
		var $container = $(this).closest('.cgkit-image');
		$container.find('input.cgkit-image-input').val('');
		$(this).closest('.image-cntnr').html('<span class="dashicons dashicons-arrow-up-alt"></span><div class="title">Add image</div>');
	});
	$('#variable_product_options').on('reload', function(){
		cgkitReloadAttributeSwatches();
	});
	$('input.cgkit-color-input').wpColorPicker();
	$('body').on('change', 'input#cgkit-enable-product', function(){
		if( $(this).prop('checked') ){
			$('#cgkit-swatches-content').removeClass('cgkit-disable-product');
		} else {
			$('#cgkit-swatches-content').addClass('cgkit-disable-product');
		}
	});
});
function cgkitUpdateSwatchType(cls_val, container){
	container.find('li.product-swatches .cgkit-value > span').hide();
	container.find('li.product-swatches .cgkit-value > span.cgkit-'+cls_val).show();
}
function cgkitAddImageAS($this){
	var product_asimage_frame;
	if( product_asimage_frame ){
		product_asimage_frame.open();
		return;
	}

	product_asimage_frame = wp.media.frames.product_gallery = wp.media({
		title: $this.data('choose'),
		button: {
			text: $this.data('update')
		},
		states: [
			new wp.media.controller.Library({
				title: $this.data('choose'),
				filterable: 'images',
				multiple: false
			})
		]
	});	

	product_asimage_frame.on('select', function() {
		var selection = product_asimage_frame.state().get('selection');
		selection.map(function(attachment) {
			attachment = attachment.toJSON();
			if( attachment.id ){
				var attachment_image = attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;
				$this.html('<img src="' + attachment_image + '" /><ul class="actions"><li><a href="javascript:;" class="cgkit-as-delete">x</a></li></ul>');
				var parent = $this.closest('.cgkit-image');
				parent.find('input.cgkit-image-input').val(attachment.id);
			}
		});
	});
	product_asimage_frame.open();
}
function cgkitReloadAttributeSwatches(){
	cgkitASBlock();
	jQuery.ajax({
		url: ajaxurl + '?action=commercekit_get_ajax_attribute_swatches&product_id='+woocommerce_admin_meta_boxes.post_id,
		type: 'GET',
		dataType: 'json',
		success: function( json ) {
			cgkitASBlock();
			if( json.status == 1 ){
				jQuery('#cgkit_attr_swatches').html(json.html);
				jQuery('select.cgkit-attribute-watches-type').change();
				jQuery('input.cgkit-color-input').wpColorPicker();
				jQuery.ajax({
					url: ajaxurl + '?action=commercekit_update_ajax_attribute_swatches&product_id='+woocommerce_admin_meta_boxes.post_id,
					type: 'POST',
					data: jQuery('#cgkit_attr_swatches').find('input, select').serialize(),
					dataType: 'json',
					success: function( json ) {}
				});
			}
		}
	});
}
function cgkitASBlock(){
	jQuery('#cgkit_attr_swatches').block({message: null, overlayCSS: { background: '#fff', opacity: 0.6 } });
}
function cgkitASBlock(){
	jQuery('#cgkit_attr_swatches').unblock();
}