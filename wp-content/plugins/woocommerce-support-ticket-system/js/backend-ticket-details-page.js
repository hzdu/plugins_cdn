"use strict";
jQuery(document).ready(function()
{
	jQuery(document).on('click', '.wcsts_delete_message_button', wcsts_delete_selected_message);
	jQuery(document).on('click', '.wcsts_delete_attachment_button', wcsts_delete_selected_attachment);
	wcsts_manage_accordion();
	wcsts_init_select2();
});
function wcsts_init_select2()
{
	jQuery('.wcsts_select2').select2({
		width: '100px'
	});
}
function wcsts_manage_accordion()
{
	var acc = document.getElementsByClassName("wcsts_accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
	  acc[i].addEventListener("click", function(event) 
	  {
		 event.preventDefault();
	
		this.classList.toggle("wcsts_accordion_active");

		
		var panel = this.nextElementSibling;
		if (panel.style.display === "block") {
		  panel.style.display = "none";
		} else {
		  panel.style.display = "block";
		}
		
		return false;
	  });
	}
}
function wcsts_delete_selected_message(event)
{
	var id = jQuery(event.currentTarget).data('id');
	if(!confirm(wcsts_ticket_page.wcsts_confirm_message_error))
		return;
	
	var random = Math.floor((Math.random() * 1000000) + 999);
	var formData = new FormData();
	formData.append('action', 'wcsts_delete_message'); 
	formData.append('ticket_message_id', id);
	
	//UI
	jQuery('#wcsts_ticket_message_'+id).fadeOut('3000', function(){jQuery('#wcsts_ticket_message_'+id).remove();});
	
	jQuery.ajax({
		url: ajaxurl+"?nocache="+random,
		type: 'POST',
		data: formData,
		async: true,
		success: function (data) 
		{
			//UI
		},
		error: function (data) 
		{
			
		},
		cache: false,
		contentType: false,
		processData: false
	});
}
function wcsts_delete_selected_attachment(event)
{
	var unique_value = jQuery(event.currentTarget).data('unique-value');
	var box_id = jQuery(event.currentTarget).data('box-id');
	var message_id = jQuery(event.currentTarget).data('message-id');
	if(!confirm(wcsts_ticket_page.wcsts_confirm_message_error))
		return;
	
	var random = Math.floor((Math.random() * 1000000) + 999);
	var formData = new FormData();
	formData.append('action', 'wcsts_delete_attachment'); 
	formData.append('attachment_unique_value', unique_value);
	formData.append('message_id', message_id);
	
	//UI
	jQuery('#wcsts_single_attachment_'+box_id).fadeOut('3000', function(){jQuery('#wcsts_single_attachment_'+box_id).remove();});
	
	jQuery.ajax({
		url: ajaxurl+"?nocache="+random,
		type: 'POST',
		data: formData,
		async: true,
		success: function (data) 
		{
			//UI
		},
		error: function (data) 
		{
			
		},
		cache: false,
		contentType: false,
		processData: false
	});
}
function wcsts_formatRepo (repo) 
{
	if (repo.loading) return repo.text;
	
	var markup = '<div class="clearfix">' +
			'<div class="col-sm-12">' + repo.text + '</div>';
    markup += '</div>'; 
	
    return markup;
}
function wcsts_formatRepoSelection (repo) 
{
  return repo.full_name || repo.text;
}