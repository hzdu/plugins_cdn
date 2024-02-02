"use strict";
var wcsts_current_number_of_opened_order_tickets = 0;
var wcsts_order_ticket_max_number = 0;
jQuery(document).ready(function()
{
	jQuery(document).on('click', '#wcsts_open_new_ticket_button', wcsts_open_new_ticket);
	wcsts_current_number_of_opened_order_tickets = parseInt(wcsts.current_number_of_opened_order_tickets);
	wcsts_order_ticket_max_number = parseInt(wcsts.order_ticket_max_number);
});
function wcsts_open_new_ticket(event)
{
	var content_length = wcsts.tiny_mce ? jQuery(tinyMCE.get('wcsts_new_ticket_message').getBody()).text().length : jQuery('#wcsts_new_ticket_message').val().length;
	
	if(wcsts_num_uploads != 0)
	{
		alert(wcsts.wcsts_upload_still_in_progress);
		return;
	}
	if(jQuery('#wcsts_new_ticket_subject').val() === "")
	{
		alert(wcsts.wcsts_empty_subject_error);
		return;
	}
	if( (wcsts.tiny_mce && tinyMCE.get('wcsts_new_ticket_message').getContent() === "" ) || (!wcsts.tiny_mce && jQuery('#wcsts_new_ticket_message').val() === ""))
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
	var message = !wcsts.tiny_mce ? jQuery('#wcsts_new_ticket_message').val() : tinyMCE.get('wcsts_new_ticket_message').getContent();
	formData.append('action', 'wcsts_submit_new_ticket'); 
	formData.append('message', message); 
	formData.append('subject', jQuery('#wcsts_new_ticket_subject').val()); 
	if(jQuery('#wcsts_new_ticket_priority').length > 0 )
		formData.append('priority', jQuery('#wcsts_new_ticket_priority').val()); 
	formData.append('type_id', jQuery('#wcsts_type_id').val()); 
	formData.append('type', jQuery('#wcsts_type').val());
	formData.append('wcsts_wpml_language', wcsts.wpml_language); 
	formData.append('security', wcsts.security); 
	//File(s) 
	//new file method
	jQuery('.wcsts_file_metadata').each(function(index,elem)
	{
		if(jQuery(elem).val() != "")
			formData.append(jQuery(elem).prop('name'), jQuery(elem).val());
	});
	
	
	wcsts_current_number_of_opened_order_tickets++;
	
	//UI
	jQuery('#wcsts_open_new_ticket_button').hide();
	jQuery('#wcsts_new_ticket_status').html("");
	jQuery('#wcsts_new_ticket_loader').show();
	
	jQuery.ajax({
		url: wcsts.wcsts_ajax_url+"?nocache="+random,
		type: 'POST',
		data: formData,
		async: true,
		success: function (data) 
		{
			//End
			
			//UI
			jQuery('#wcsts_tickets_container').html(data);
			jQuery('#wcsts_new_ticket_status').html(wcsts.wcsts_new_ticket_result_message);
			jQuery('#wcsts_new_ticket_message').val("");
			wcsts_hide_unnecessary_file_input('.wcsts_attachment_input');
			if( wcsts_order_ticket_max_number!= -1 && wcsts_current_number_of_opened_order_tickets >= wcsts_order_ticket_max_number)
				jQuery('#wcsts_new_ticket_button_redirect').hide();
			
			wcsts_smooth_scroll_to_element('#wcsts_new_ticket_box');
			if(wcsts_pager != null)
				wcsts_pager.currentPage = 1;			
			wcsts_tinymce_init();
			wcsts_init_pager();
		},
		error: function (data) 
		{
			
		},
		cache: false,
		contentType: false,
		processData: false
	}); 
}