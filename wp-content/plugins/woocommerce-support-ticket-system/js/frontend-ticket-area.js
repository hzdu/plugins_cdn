"use strict";
var wcsts_subject_max_chars = 140;
var wcsts_message_max_chars = 500;
var wcsts_message_min_chars = 0;
var wcsts_current_sorting = wcsts.current_sort;
var wcsts_pager = null;
var wcsts_already_resetted_unread_admin_messages_by_ticket_id = new Object();
jQuery(document).ready(function()
{
	jQuery(document).on('click', '#wcsts_new_ticket_button_redirect', wcsts_go_to_new_ticekt_area);
	jQuery(document).on('keyup', '.wcsts_new_message_textarea', wcsts_check_left_char_new_message);
	jQuery(document).on('keyup', '#wcsts_new_ticket_message', wcsts_check_left_char_new_ticket_message);
	jQuery(document).on('keyup', '#wcsts_new_ticket_subject', wcsts_check_left_char_subject);
	
	jQuery(document).on('click', '.wcts_expand_button', wcsts_expand_or_collapse_messages_box);
	jQuery(document).on('change', '#wcsts_sort_by_date_menu, #wcsts_filter_by_status_menu', wcsts_submit_options_form);
	wcsts_subject_max_chars = parseInt(wcsts.subject_max_chars);
	wcsts_message_max_chars = parseInt(wcsts.message_max_chars);
	wcsts_message_min_chars = parseInt(wcsts.message_min_chars);
	jQuery('.wcsts_attachment_input').val("");
	jQuery('#wcsts_new_ticket_message').val("");
	
	wcsts_tinymce_init()
	//pagination 
	wcsts_init_pager();
});
function wcsts_init_pager()
{
	var item_per_page = parseInt(wcsts.item_per_page);
	var container = 'wcsts_ticket_pagination_container';
	var paginator_container = 'wcsts_pagination_navigation';
	if(document.getElementById(container) != null && document.getElementById(container).children.length > item_per_page)
	{
		var currentPage = wcsts_pager != null ? wcsts_pager.currentPage : 1;
		wcsts_pager  = new Pager(container, item_per_page); 
		wcsts_pager.init(); 
		wcsts_pager.showPageNav('wcsts_pager', paginator_container); 
		wcsts_pager.showPage(currentPage);
	}
}
function wcsts_tinymce_init()
{
	if(!wcsts.tiny_mce)
		return;
	tinymce.remove();
	
	tinyMCE.init({
		menubar:false,
		//statusbar: false, //to disable status bar: 
        mode : "specific_textareas",
        editor_selector :"tinymce-enabled",
		setup : function(ed) 
		{
			ed.on('keyup', function (evt) 
			{
				var elem_selector = "#"+jQuery(evt.currentTarget).data('id');
				var id = jQuery(elem_selector).data('id');
				var curr_max_char_count = 0;
				
				if(typeof id !== 'undefined')
					curr_max_char_count = wcsts_substract_char("#wcsts_message_max_char_left_"+id, wcsts_message_max_chars, jQuery(ed.getBody()).text().length);
				else
					curr_max_char_count = wcsts_substract_char("#wcsts_new_ticket_message_max_char_left", wcsts_message_max_chars, jQuery(ed.getBody()).text().length);
				
				if ( curr_max_char_count < 0)
				{
					jQuery(ed.getBody()).text(jQuery(ed.getBody()).text().substring(0,wcsts_message_max_chars));
					evt.preventDefault();
					evt.stopPropagation();
					return false;
				}
				
			});
		} 
    });
	
	
}
function wcsts_go_to_new_ticekt_area(event)
{
	event.preventDefault();
	event.stopImmediatePropagation();
	wcsts_smooth_scroll_to_element('#wcsts_new_ticket_box');
       
	return false;
}
function wcsts_smooth_scroll_to_element(selector)
{
	if(jQuery(selector).length > 0)
		jQuery('html, body').animate({
			  scrollTop: jQuery(selector).offset().top - 100
			}, 1000);
}
function wcsts_check_left_char_new_message(event)
{
	var id = jQuery(event.currentTarget).data('id');
	wcsts_substract_char("#wcsts_message_max_char_left_"+id, wcsts_message_max_chars, jQuery(this).val().length);
}
function wcsts_check_left_char_new_ticket_message(event)
{
	wcsts_substract_char("#wcsts_new_ticket_message_max_char_left", wcsts_message_max_chars, jQuery(this).val().length);
}
function wcsts_check_left_char_subject(event)
{
	wcsts_substract_char("#wcsts_subject_max_char_left", wcsts_subject_max_chars, jQuery(this).val().length);
}
function wcsts_substract_char(selector, max_char, num_char)
{
	var curr_max_char_count = max_char - num_char
	
	jQuery(selector).text(curr_max_char_count < 0 ? 0 : curr_max_char_count);
	
	return curr_max_char_count;
}
function wcsts_replace_bad_char(text)
{
	text = text.replace("'","");
	text = text.replace('"',"");
	return text;
}
function wcsts_on_file_selection(event)
{
	var id = jQuery(event.currentTarget).data('clear-button');
	jQuery('#wcsts_clear_file_button_'+id).fadeIn();
}
function wcsts_on_clear_file_selection(event)
{
	var id = jQuery(event.currentTarget).data('input-file');
	jQuery(event.currentTarget).fadeOut();
	jQuery('#'+id).val("");
}
function wcsts_expand_or_collapse_messages_box(event)
{
	var id = jQuery(event.target).data('id');
	var ticket_id = jQuery(event.target).data('ticket-id');
	jQuery('#wcsts_messages_box_'+id).fadeToggle(function()
		{
			if(jQuery('#wcsts_messages_box_'+id).css('display') == 'block')
			{
				jQuery(event.target).html(wcsts.collapse_button_text);
				wcsts_reset_undread_admin_messages(ticket_id);
			}
			else
				jQuery(event.target).html(wcsts.expand_button_text);
		});
}
function wcsts_reset_undread_admin_messages(ticket_id)
{
	if(ticket_id in wcsts_already_resetted_unread_admin_messages_by_ticket_id)
		return;
	
	wcsts_already_resetted_unread_admin_messages_by_ticket_id[ticket_id] = true;
	
	var random = Math.floor((Math.random() * 1000000) + 999);
	var formData = new FormData();
	formData.append('action', 'wcsts_reset_admin_unread_messages_counter'); 
	formData.append('ticket_id', ticket_id); 
	
	jQuery.ajax({
		url: wcsts.wcsts_ajax_url+"?nocache="+random,
		type: 'POST',
		data: formData,
		async: true,
		success: function (data) 
		{
			
		},
		error: function (data) 
		{
			
		},
		cache: false,
		contentType: false,
		processData: false
	}); 
}
function wcsts_submit_options_form(event)
{
	jQuery('#wcsts_ticket_area_options_form').submit();
}