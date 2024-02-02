"use strict";
jQuery(document).ready(function()
{
	jQuery(document).on('click', '#wcsts_add_new_custom_status_button', wcsts_add_new_custom_status);
	jQuery(document).on('click', '.wcsts_delete_custom_status', wcsts_remove_custom_status);
});
function wcsts_remove_custom_status(event)
{
	event.preventDefault();
	event.stopImmediatePropagation();
	
	var id_to_remove = jQuery(event.currentTarget).data('id-to-delete');
	if(confirm(wcsts.remove_custom_status_text))
		jQuery("#"+id_to_remove).fadeOut('slow', function(){jQuery(this).remove()});
	
	return false;
}
function wcsts_add_new_custom_status(event)
{	
	event.preventDefault();
	event.stopImmediatePropagation();
	
	var random = Math.floor((Math.random() * 1000000) + 999);
	var formData = new FormData();
	formData.append('action', 'wcsts_load_new_custom_status_configuration_box'); 
	
	//UI
	wcsts_on_load_new_custom_status_configuration_box();
	
	jQuery.ajax({
		url: ajaxurl+"?nocache="+random,
		type: 'POST',
		data: formData,
		async: true,
		success: function (data) 
		{
			//UI
			jQuery('#wcsts_custom_statuses_container').append(data);
			wcsts_finished_loading_new_custom_status_configuration_box()
		},
		error: function (data) 
		{
			//console.log(data);
			//alert("Error: "+data);
		},
		cache: false,
		contentType: false,
		processData: false
	}); 
	
	return false;
}

function wcsts_on_load_new_custom_status_configuration_box()
{
	jQuery('#wcsts_add_new_custom_status_button, #wcsts_submit_button').fadeOut();
	jQuery('#wcsts_preloader_image').animate({ opacity: 1 });
}
function wcsts_finished_loading_new_custom_status_configuration_box()
{
	jQuery('#wcsts_add_new_custom_status_button, #wcsts_submit_button').fadeIn();
	jQuery('#wcsts_preloader_image').animate({ opacity: 0 });
	global_jsc.init();
}