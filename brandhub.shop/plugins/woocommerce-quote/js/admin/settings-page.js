"use strict";
jQuery(document).ready(function()
{ 
	
	jQuery(document).on('click', '.master_option', wcqt_manage_master_option);
	jQuery(document).on('click', '.remove-field', wcqt_remove_input_field_option_area);
	
	//init
	wcqt_manage_master_option(null);
	wcqt_manage_save_button_display(0);
	
	
	
});

function wcqt_remove_input_field_option_area(event)
{
	event.preventDefault();
	const id = jQuery(event.currentTarget).data('id');
	const elem = jQuery('#wcqt_input_field_container_'+id);
	if(confirm(wcqt.confirm_delete_message))
		elem.fadeOut(200, function(){elem.remove()});
	
	return false;
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

function wcqt_init_editor(field_id)
{
	for(var i = 0; i < wcqt.available_langs.length; i++)
	{
		tinyMCE.execCommand( 'mceAddEditor', true, 'wcqt_field_description_editor_'+field_id+'_'+wcqt.available_langs[i] );
	}
}
function wcqt_manage_save_button_display(fadeOut)
{
	if(jQuery("#wcqt-options-container").children().length == 0)
		jQuery('.wcqt_save_button').fadeOut(fadeOut);
	else
		jQuery('.wcqt_save_button').fadeIn()
}
function wcqt_before_ajax_loading()
{
	jQuery(".disable_during_animation").attr('disabled', true);
	jQuery(".load_new_upload_field_spinner, .load_new_input_field_spinner").addClass('is-active');
}
function wcqt_after_ajax_loading()
{
	jQuery(".disable_during_animation").removeAttr('disabled');
	jQuery(".load_new_upload_field_spinner, .load_new_input_field_spinner").removeClass('is-active');
}