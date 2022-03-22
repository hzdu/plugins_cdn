/* Javascript Document */
var product_countdown_html = '';
var product_orderbump_html = '';
function add_new_product_countdown(){
	global_radio_count = global_radio_count + 1;
	var html = product_countdown_html;
	html = html.replace('<!--DELETE-->','<a href="javascript:;" class="delete-countdown" onclick="delete_product_countdown(this);">'+global_delete_countdown+'</a>');
	html = html.replace(/name="radio-0"/g,'name="radio-'+global_radio_count+'"');
	jQuery('#product-countdown').append('<div class="postbox change">'+html+'</div>');
	jQuery('#product-countdown .change span.select2-container').remove();
	jQuery('#product-countdown .change select.select2').removeClass('select2-hidden-accessible').html('');
	jQuery('#product-countdown .change .product-ids select.select2').each(function(){
		add_select_select2(jQuery(this))
	});
	jQuery('#product-countdown .change').removeClass('change').addClass('no-change');
	jQuery('#product-countdown').sortable('refresh');
	if( jQuery('#product-countdown .postbox').length > 1 ){
		jQuery('#ctd-order-notice').css('display', 'block');
	} else {
		jQuery('#ctd-order-notice').css('display', 'none');
	}
	validate_countdown_timers();
}
function delete_product_countdown(obj){
	if( confirm(global_delete_countdown_confirm) ){
		jQuery(obj).closest('div.postbox').remove();
		if( jQuery('#product-countdown .postbox').length > 1 ){
			jQuery('#ctd-order-notice').css('display', 'block');
		} else {
			jQuery('#ctd-order-notice').css('display', 'none');
		}
		validate_countdown_timers();
	}
}
function add_select_select2(obj){
	var type = obj.data('type');
	var placeholder = obj.data('placeholder');
	var tab = obj.data('tab');
	var mode = obj.data('mode');
	obj.select2({
		placeholder: placeholder,
		ajax: {
			url: ajaxurl,
			dataType: 'json',
			delay: 250,
			data: function (params) {
				return {
					q: params.term,
					type: type,
					tab: tab,
					mode: mode,
					action: 'commercekit_get_pcids'
				};
			},
			processResults: function( data ) {
				var options = [];
				if ( data ) {
					jQuery.each( data, function( index, text ) {
						options.push( { id: text[0], text: text[1] } );
					});
				}
				return {
					results: options
				};
			},
			cache: true
		},
		minimumInputLength: 3
	});
}
function add_new_order_bump(){
	var html = product_orderbump_html;
	html = html.replace('<!--DELETE-->','<a href="javascript:;" class="delete-orderbump" onclick="delete_product_orderbump(this);">'+global_delete_orderbump+'</a>');
	jQuery('#product-orderbump').append('<div class="postbox change">'+html+'</div>');
	jQuery('#product-orderbump .change span.select2-container').remove();
	jQuery('#product-orderbump .change select.select2').removeClass('select2-hidden-accessible').html('');
	jQuery('#product-orderbump .change select.select2').each(function(){
		add_select_select2(jQuery(this))
	});
	jQuery('#product-orderbump .change').removeClass('change').addClass('no-change');
	jQuery('#product-orderbump').sortable('refresh');
	validate_orderbump_products();
}
function validate_countdown_timers(){
	if( jQuery('#product-countdown input.pdt-title').length > 0 ){
		var can_submit = true;
		jQuery('#product-countdown input.required').each(function(){
			var $this = jQuery(this);
			if( $this.hasClass('error') ){
				$this.removeClass('error');
				$this.parent().parent().find('.input-error').remove();
			}
			if( $this.val() == '' ){
				$this.addClass('error');
				$this.parent().parent().append('<div class="input-error">'+global_required_text+'</div>');
				can_submit = false;
				var box = $this.closest('.postbox');
				if( box.hasClass('closed') ) 
					box.removeClass('closed');
				$this.focus();
				return false;
			}
		});
		if( !can_submit ){
			jQuery('#btn-submit').attr('disabled', 'disabled');
		} else {
			jQuery('#btn-submit').removeAttr('disabled');
		}
	}
}
function delete_product_orderbump(obj){
	if( confirm(global_delete_orderbump_confirm) ){
		jQuery(obj).closest('div.postbox').remove();
		validate_orderbump_products();
	}
}
function validate_orderbump_products(){
	if( jQuery('select.order-bump-product').length > 0 ){
		var can_submit = true;
		jQuery('select.order-bump-product').each(function(){
			var $this = jQuery(this);
			if( $this.find('option').length == 0 ){
				if( !$this.hasClass('error') ){
					$this.addClass('error');
					var $parent = $this.parent().parent();
					$parent.find('.select2-selection').addClass('error');
					$parent.append('<div class="input-error">'+global_required_text+'</div>');
				}
				var box = $this.closest('.postbox');
				if( box.hasClass('closed') ) 
					box.removeClass('closed');
				can_submit = false;
				return false;
			} else {
				$this.removeClass('error');
				var $parent = $this.parent().parent();
				$parent.find('.select2-selection').removeClass('error');
				$parent.find('.input-error').remove();
			}
		});
		if( can_submit ) {
			jQuery('table.admin-order-bump input.required').each(function(){
				var $this = jQuery(this);
				if( $this.hasClass('error') ){
					$this.removeClass('error');
					$this.parent().find('.input-error').remove();
				}
				if( $this.val() == '' ){
					$this.addClass('error');
					$this.after('<div class="input-error">'+global_required_text+'</div>');
					can_submit = false;
					var box = $this.closest('.postbox');
					if( box.hasClass('closed') ) 
						box.removeClass('closed');
					$this.focus();
					return false;
				}
			});
		}
		if( !can_submit ){
			jQuery('#btn-submit').attr('disabled', 'disabled');
		} else {
			jQuery('#btn-submit').removeAttr('disabled');
		}
	}
}
jQuery(document).ready(function(){
	jQuery('body').on('change', 'input.pdt-title', function(){
		var h2 = jQuery(this).closest('.postbox').find('h2 > span');
		if( jQuery(this).val() != '' )
			h2.html(jQuery(this).val());
		else
			h2.html('Title');
	});
	jQuery('body').on('click', 'button.handlediv, .postbox > h2.gray', function(){
		jQuery(this).parent().toggleClass('closed');
	});
	jQuery('body').on('change', 'select.conditions', function(){
		var pids = jQuery(this).closest('.postbox').find('.product-ids');
		var option3 = pids.find('.options');
		var select3 = pids.find('select.select2');
		var select4 = pids.find('input.select3');
		var cval = jQuery(this).val();
		if( cval == 'all' ) {
			pids.hide();
		} else if( cval == 'products' || cval == 'non-products' ) {
			pids.show(); 
			option3.html('Specific products:');
			select3.data('type', 'products');
		} else {
			pids.show(); 
			option3.html('Specific categories:');
			select3.data('type', 'categories');
		}
		select3.select2('destroy'); 
		select3.html('');
		select4.val('');
		add_select_select2(select3);
	});
	jQuery('body').on('change', 'select.select2', function(){
		var pids = jQuery(this).closest('.postbox').find('.product-ids');
		var select3 = pids.find('select.select2');
		var select4 = pids.find('input.select3');
		var selvals = select3.val();
		if( selvals instanceof Array )
			select4.val(selvals.join(','));
	});
	jQuery('select.select2').each(function(){
		add_select_select2(jQuery(this))
	});
	jQuery('body').on('change', 'input.pdt-type', function(){
		var td = jQuery(this).closest('td');
		td.find('input.pdt-type-val').val(jQuery(this).val());
	});
	jQuery('body').on('change', 'input.pdt-active', function(){
		var td = jQuery(this).closest('td');
		if( jQuery(this).prop('checked') )
			td.find('input.pdt-active-val').val(1);
		else
			td.find('input.pdt-active-val').val(0);
	});
	jQuery('body').on('change', '#commercekit_inventory_display, #commercekit_ajax_search, #commercekit_ajs_hidevar, #commercekit_waitlist, #commercekit_wishlist, #commercekit_countdown_timer, #commercekit_order_bump, #commercekit_pdp_triggers, #commercekit_pdp_gallery, #commercekit_pdp_lightbox, #commercekit_pdp_attributes_gallery, #commercekit_pdp_video_autoplay, #commercekit_attribute_swatches, #commercekit_attribute_swatches_plp, #commercekit_as_activate_atc, #commercekit_as_logger', function(){
		if( jQuery(this).prop('checked') )
			jQuery(this).closest('section, tr').addClass('active');
		else
			jQuery(this).closest('section, tr').removeClass('active');
		jQuery('#ajax-loading-mask').show();
		jQuery.ajax({
			url: ajaxurl,
			type: 'POST',
			dataType: 'json',
			data: jQuery('#commercekit-form').serialize(),
			success: function( json ) {
				jQuery('#ajax-loading-mask').hide();
			}
		});
	});
	if( jQuery('#product-countdown #first-row').length > 0 ){
		product_countdown_html = jQuery('#product-countdown #first-row').html();
		jQuery('#product-countdown #first-row').remove();
	}
	jQuery('#product-countdown').sortable({handle:'h2.gray'});
	if( jQuery('#product-orderbump #first-row').length > 0 ){
		product_orderbump_html = jQuery('#product-orderbump #first-row').html();
		jQuery('#product-orderbump #first-row').remove();
	}
	jQuery('#product-orderbump').sortable({handle:'h2.gray'});
	jQuery('#screen_width').val(screen.width);
	jQuery('#screen_height').val(screen.height);
	if( jQuery('#product-countdown .postbox').length > 1 ){
		jQuery('#ctd-order-notice').css('display', 'block');
	} else {
		jQuery('#ctd-order-notice').css('display', 'none');
	}
	jQuery('body').on('change', 'select.order-bump-product, input.required', function(){
		validate_countdown_timers();
		validate_orderbump_products();
	});
	validate_countdown_timers();
	validate_orderbump_products();
	jQuery('#commercekit_ajs_excludes').bind('keyup blur', function(){
		var value = jQuery(this);
		value.val(value.val().replace(/[^0-9\,]/g,'') ); 
	});
	jQuery('table.admin-support #first_name').bind('keyup blur', function(){
		var value = jQuery(this);
		value.val(value.val().replace(/[^a-zA-Z\ ]/g,'') ); 
	});
	jQuery('#commercekit_pdp_thumbnails').bind('change', function(){
		var value = parseInt(jQuery(this).val());
		if( isNaN(value) ) value = 4;
		jQuery(this).val(value);
		if( value < 3 || value > 8 ){
			jQuery('#commercekit_pdp_thumbnails').addClass('error');
			jQuery('#pdp_thumbnails_error').show()
			jQuery('#btn-submit').attr('disabled', 'disabled');
		} else {
			jQuery('#commercekit_pdp_thumbnails').removeClass('error');
			jQuery('#pdp_thumbnails_error').hide()
			jQuery('#btn-submit').removeAttr('disabled');
		}
	});
	jQuery('#commercekit_pdp_gallery_layout').on('change', function(){
		jQuery('#gallery-layout-preview .layout-preview').hide();
		jQuery('#'+jQuery(this).val()+'-preview').show();
	});
	jQuery('#commercekit_pdp_gallery_layout').change();
	jQuery('#commercekit_attribute_swatches, #commercekit_attribute_swatches_plp, #commercekit_as_activate_atc').on('change', function(){
		update_attribute_swatches_options();
	});
	update_attribute_swatches_options();
});
function update_attribute_swatches_options(){
	if( jQuery('#commercekit_attribute_swatches').length > 0 ){
		if( jQuery('#commercekit_attribute_swatches').prop('checked') ){
			jQuery('#cgkit-as-plp-options').removeClass('disable-as-plp');
			jQuery('#as-button-style').show();
		} else {
			jQuery('#cgkit-as-plp-options').addClass('disable-as-plp');
			jQuery('#as-button-style').hide();
		}
		if( jQuery('#commercekit_attribute_swatches_plp').prop('checked') ){
			jQuery('#as-quick-atc').show();
		} else {
			jQuery('#as-quick-atc').hide();
		}
		if( jQuery('#commercekit_attribute_swatches_plp').prop('checked') && jQuery('#commercekit_as_activate_atc').prop('checked') ){
			jQuery('#as-quick-atc-txt').show();
			jQuery('#as-more-opt-txt').hide();
		} else {
			jQuery('#as-quick-atc-txt').hide();
			jQuery('#as-more-opt-txt').show();
		}
	}
}