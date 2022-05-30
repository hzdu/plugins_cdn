"use strict";
jQuery(document).ready(function()
{
	jQuery(document).on('click', '.wcsts_show_new_message_area_button', wcsts_show_new_message_container);
	jQuery(document).on('click', '.wcsts_submit_new_message_button', wcsts_send_new_message);
	jQuery('.wcsts_new_message_textarea').val("");
});
function wcsts_show_new_message_container(event)
{
	var id = jQuery(event.currentTarget).data('id');
	
	//UI
	jQuery(event.currentTarget).hide();
	jQuery('#wcsts_new_message_container_'+id).show();
}
function wcsts_send_new_message(event)
{
	if(wcsts_num_uploads != 0)
	{
		alert(wcsts.wcsts_upload_still_in_progress);
		return;
	}
	
	var id = jQuery(event.currentTarget).data('id');
	var messages_box_id = jQuery(event.currentTarget).data('message-box-id');
	var content_length = wcsts.tiny_mce ? jQuery(tinyMCE.get('wcsts_new_message_textarea_'+id).getBody()).text().length : jQuery('#wcsts_new_message_textarea_'+id).val().length;
	
	if((wcsts.tiny_mce && tinyMCE.get('wcsts_new_message_textarea_'+id).getContent() === "" ) || (!wcsts.tiny_mce && jQuery('#wcsts_new_message_textarea_'+id).val() === ""))
	{
		alert(wcsts.wcsts_empty_message_error);
		return;
	}
	
	if(wcsts_message_min_chars > 0 && content_length < wcsts_message_min_chars)
	{
		alert(wcsts.wcsts_minimum_chars_warning.replace("%s", wcsts_message_min_chars));
		return false;
	}

	var random = Math.floor((Math.random() * 1000000) + 999);
	var formData = new FormData();
	var error_file_size = false;
	var message =  !wcsts.tiny_mce ? jQuery('#wcsts_new_message_textarea_'+id).val() :  tinyMCE.get('wcsts_new_message_textarea_'+id).getContent();
	formData.append('ticket_id', id); 
	formData.append('message', message); 
	formData.append('type_id', jQuery('#wcsts_type_id').val());
	formData.append('type', jQuery('#wcsts_type').val());
	formData.append('list_all_ppt_tickets_of_the_current_user', jQuery('#list_all_ppt_tickets_of_the_current_user').val());
	formData.append('action', 'wcsts_submit_new_message'); 	
	formData.append('wcsts_wpml_language', wcsts.wpml_language);
	formData.append('security', wcsts.security); 	
	
	
	//new file method
	jQuery('.wcsts_file_metadata_'+id).each(function(index,elem)
	{
		if(jQuery(this).val() != "")
			formData.append(jQuery(this).prop('name'), jQuery(this).val());
	});
	
	//UI
	jQuery('#wcsts_new_message_container_'+id).hide();
	jQuery('#wcsts_sending_message_status_'+id).show();
	
	jQuery.ajax({
		url: wcsts.wcsts_ajax_url+"?nocache="+random,
		type: 'POST',
		data: formData,
		async: true,
		success: function (data) 
		{
			//End
			jQuery('#wcsts_sending_message_status_'+id).hide();
			jQuery('#wcsts_show_new_message_area_button_'+id).show();
				
			
			jQuery('#wcsts_tickets_container').html(data);
			
			//UI
			jQuery('#wcsts_messages_box_'+messages_box_id).fadeIn(0);
			wcsts_tinymce_init();
			wcsts_init_pager();
			wcsts_ppt_refresh_ui();
			wcsts_hide_unnecessary_file_input('.wcsts_attachment_input');
			
		},
		error: function (data) 
		{
			
		},
		cache: false,
		contentType: false,
		processData: false
	}); 
}
function wcsts_ppt_refresh_ui()
{
	//ToDo: 1. update message left counter
}