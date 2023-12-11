"use strict";
var wcqt_free_field_id = 0;
jQuery(document).ready(function()
{ 
	wcqt_free_field_id = parseInt(wcqt.next_id);
	jQuery(document).on('click', '.wcqt_add_new_button', wcqt_add_new_quote);
	jQuery(document).on('click', '.wcqt_collapse_options', wcqt_manage_options_area_display);
	jQuery(document).on('click', '.wcqt_remove_field', wcqt_delete_field);
	jQuery(document).on('click', '.master_option', wcqt_manage_master_option);
	jQuery(document).on('click','.duplicate_field', wcqt_duplicate_field);
	
	//init
	wcqt_manage_master_option(null);
	wcqt_manage_save_button_display(0);
	wcqt_init_drag_and_drop();;
});
function wcqt_init_drag_and_drop()
{
	
	jQuery('.wcqt_input_fields_container').sortable({
		connectWith: '.wcqt_input_fields_container',
		handle: '.wcqt_title_and_controllers_container',
		cursor: 'move',
		placeholder: 'placeholder',
		forcePlaceholderSize: true,
		opacity: 0.4,
		stop: function(event, ui)
		{
			
		}
	})
	.disableSelection();
}

function wcqt_manage_master_option(event)
{
	const transition_time = event == null ? 0 : 300;
	
	jQuery('.master_option').each(function(index, elem)
	{
		if(jQuery(elem).is(':checkbox'))
		{
			const hide_process_result = elem.checked ? jQuery(".master_related_"+jQuery(elem).data('related-id')).fadeIn(transition_time) : jQuery(".master_related_"+jQuery(elem).data('related-id')).fadeOut(transition_time);
		}
	});
}
function wcqt_add_new_quote()
{
	
	var formData = new FormData();
	formData.append('action', 'wcqt_get_quote_configuration_template');  
	formData.append('start_index', wcqt_free_field_id++); 
	formData.append('security', wcqt.security); 

	//UI
	wcqt_before_ajax_loading();
	
	jQuery.ajax({
		url: ajaxurl,
		type: 'POST',
		data: formData,
		async: true,
		success: function (response) 
		{
			//UI
			jQuery("#wcqt_quotes_container").append(response);
			//no need: wcqt_init_editor(wcqt_free_field_id);
			wcqt_manage_save_button_display(100);
			wcqt_after_ajax_loading();
			
		},
		error: function (data) 
		{
			
		},
		cache: false,
		contentType: false,
		processData: false
	});
	
	return false;
}
function wcqt_duplicate_field(event)
{
	event.preventDefault();
	event.stopImmediatePropagation();
		
	var random = Math.floor((Math.random() * 1000000) + 999);
	var formData = new FormData();
	var index_to_duplicate = jQuery(event.currentTarget).data('id');
	formData.append('action', 'wcqt_duplicate_field'); 
	formData.append('start_index', wcqt_free_field_id++); 
	formData.append('index_to_duplicate', index_to_duplicate); 
	formData.append('security', wcqt.security); 
	
	//UI
	wcqt_before_ajax_loading();
	
	jQuery.ajax({
		url: ajaxurl+"?nocache="+random,
		type: 'POST',
		data: formData,
		async: true,
		success: function (data) 
		{
			//UI	
			jQuery("#wcqt_quotes_container").append(data);	
			wcqt_manage_save_button_display(100);
			wcqt_after_ajax_loading();
			
			//init
			/* wcqt_checkMultipleUpoloadsCheckbox();
			jQuery(".upload_type").trigger('change'); */
		},
		error: function (data) 
		{
			
		},
		cache: false,
		contentType: false,
		processData: false
	});	
}
function wcqt_init_editor(field_id)
{
	for(var i = 0; i < wcqt.available_langs.length; i++)
	{
		tinyMCE.execCommand( 'mceAddEditor', true, 'wcqt_field_description_editor_'+field_id+'_'+wcqt.available_langs[i] );
	}
}
function wcqt_manage_options_area_display(event)
{
	const id = jQuery(event.currentTarget).data('id');
	jQuery('#wpuef_show_options_button_'+id).text(jQuery('#wcqt_options_container_'+id).css('display') == 'none' ? wcqt.hide_options: wcqt.show_options);
	jQuery('#wcqt_options_container_'+id).fadeToggle();
	
	
	return false;
}
function wcqt_delete_field(event)
{
	const id = jQuery(event.currentTarget).data('id');
	if(confirm(wcqt.confirm_delete_message))
	{
		jQuery('#wcqt_field_container_'+id).fadeOut(300, function() { jQuery(this).remove(); });
	}
	return false;
}
function wcqt_manage_save_button_display(fadeOut)
{
	if(jQuery("#wcqt_quotes_container").children().length == 0)
		jQuery('.wcqt_save_button').fadeOut(fadeOut);
	else
		jQuery('.wcqt_save_button').fadeIn()
}
function wcqt_before_ajax_loading()
{
	jQuery(".disable_during_animation").attr('disabled', true);
	jQuery(".load_new_quote_spinner, .load_new_input_field_spinner").addClass('is-active');
}
function wcqt_after_ajax_loading()
{
	jQuery(".disable_during_animation").removeAttr('disabled');
	jQuery(".load_new_quote_spinner, .load_new_input_field_spinner").removeClass('is-active');
}