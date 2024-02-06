"use strict";
var wcsts_num_uploads = 0;
jQuery(document).ready(function()
{
	jQuery(document).on('click', '.wcsts_view_download_file_button', wcsts_view_download_file);
	jQuery(document).on('click','.wcsts_file_upload_button', wcsts_upload_file);
	jQuery(document).on('click','.wcsts_file_tmp_delete_button', wcsts_delete_tmp_file);
	document.addEventListener('onWCSTSMultipleFileUploaderComplete', wcsts_upload_ended);
	if (window.File && window.FileReader && window.FileList && window.Blob) 
	{
		jQuery(document).on('change' ,'.wcsts_attachment_input', wcsts_on_file_selection);
	} 
	else {
		
	}
	
	
	//UI
	wcsts_hide_unnecessary_file_input('.wcsts_attachment_input');
});

function wcsts_hide_unnecessary_file_input(selector)
{
	jQuery(selector).each(function(index, obj)
	{
		//console.log(jQuery(this).data('hide-index'));
		if(jQuery(this).data('hide-index') != 0)
			jQuery(this).parent().fadeOut(0);
	});
}
function wcsts_show_next_file_input($current_element)
{
	var hide_index = $current_element.data('hide-index');
	var elements = $current_element.parent().parent().find(".wcsts_attachment_input");
	
	jQuery(elements).each(function(index, obj)
	{
		if(jQuery(this).data('hide-index') == hide_index+1)
			jQuery(this).parent().fadeIn();
	});
}
function wcsts_view_download_file(evt)
{
	evt.stopPropagation();
	evt.preventDefault();
	var href =  jQuery(evt.currentTarget).data('href');
	var win = window.open(href, '_blank');
	return false;
}

function wcsts_check_file_size_and_ext(files, max_size, extension, extension_accepted)
{
	if(max_size == "")
		return true;
	
	//size
	if (window.File && window.FileReader && window.FileList && window.Blob)
	{
		if(files != undefined)
		{
			var fsize =files[0].size/1024; 
			var ftype = files[0].type;
			var fname = files[0].name;
			
			if(max_size != 0 && fsize > max_size)
			{
				var size = fsize/1048576; 
				size = size.toFixed(2);
				var max_size_text = (max_size/1024) < 1 ? Math.floor(max_size)+"kb" : Math.floor(max_size/1024)+"Mb";
				alert(wcsts.wcsts_file_size_error+max_size_text);
				return false;
			}
		}
	}
	else{
		alert(wcsts.wcsts_browser_compliant_error);
		return false;
	}
	
	//extension
	if(extension_accepted != undefined && extension_accepted.indexOf(extension) == -1)
	{
		alert(wcsts.wcsts_extension_error);
		return false;
	}
	return true;
}
function wcsts_on_file_selection(evt) 
{
    var files = evt.target.files;
    var file = files[0];
	var id =  jQuery(evt.currentTarget).data('id');
	var max_size =  jQuery(evt.currentTarget).data('max-size');
	var upload_input_field = jQuery(evt.currentTarget);
	var upload_button = jQuery(evt.currentTarget).data('upload-button-id');
	var delete_button = jQuery(evt.currentTarget).data('delete-button-id');
	var extension =  jQuery(evt.currentTarget).val().replace(/^.*\./, '');
	var extension_accepted = jQuery(evt.currentTarget).attr('accept');
	
	wcsts_reset_upload_field_metadata(id);
	if(wcsts_check_file_size_and_ext(files, max_size, extension, extension_accepted))
	{	
		
		jQuery('#wcsts_file_upload_button_'+id).show();
		
		if (files && file) 
		{
			
		   //new
		 wcsts_show_next_file_input(jQuery(evt.currentTarget));
		  jQuery(upload_button).trigger('click');
		}
		//ToDo: Show error message?
	}
	else 
		jQuery(evt.currentTarget).val("");
};
function wcsts_reset_upload_field_metadata(id)
{
	jQuery('#wcsts_file_tmp_delete_button_'+id).hide();
	jQuery('#wcsts_file_tmp_delete_button_'+id).data('file-to-delete', "");
	jQuery('#wcsts_file_tmp_name_'+id).hide();
	jQuery('#wcsts_file_tmp_name_'+id).html("");
	jQuery('#wcsts-filename-'+id).val("");
	jQuery('#wcsts-complete-name-'+id).val("");
    jQuery('#wcsts-filenameprefix-'+id).val("");
}
function wcsts_upload_file(evt)
{
	evt.preventDefault();
	evt.stopPropagation();
	
	var id =  jQuery(evt.currentTarget).data('id');
	var upload_input_field = jQuery(evt.currentTarget).data('upload-field-id');
	var files = jQuery(upload_input_field).prop('files');
	var max_size = jQuery(upload_input_field).data('max-size');
    var file = files[0];
	
	wcsts_num_uploads++;
	
   //UI
   jQuery(evt.currentTarget).hide();
   jQuery(upload_input_field).hide();
   jQuery('#wcsts_upload_progress_status_container_'+id).fadeIn();
   jQuery('#wcsts_file_tmp_delete_button_'+id).hide();
   jQuery('#wcsts_file_upload_button_'+id).hide();
   jQuery('#wcsts_file_tmp_name_'+id).hide();
   
   var current_upload_session_id = Math.floor((Math.random() * 10000000) + 1);
   var tempfile_name  = wcsts_replace_bad_char(file.name);
 
   var multiple_file_uploader = new WCSTSMultipleFileUploader({ field_id:id, 
																ajaxurl: wcsts.wcsts_ajax_url, 
																files: files, 
																file: file, 
																file_name:tempfile_name,
																upload_input_field:upload_input_field,
																current_upload_session_id: current_upload_session_id});
   
	multiple_file_uploader.continueUploading();						
	return false;
			
}
function wcsts_upload_ended(event)
{
	//UI
	wcsts_num_uploads--;
	var id = event.field_id;
	
	jQuery('#wcsts_upload_progress_status_container_'+id).fadeOut();
	jQuery('#wcsts_file_tmp_delete_button_'+id).fadeIn();
	jQuery('#wcsts_file_tmp_name_'+id).fadeIn();
	jQuery('#wcsts-filename-display-'+id).html(event.file_name);
		
	jQuery('#wcsts-filename-'+id).val(event.file_name);
	jQuery('#wcsts-filenameprefix-'+id).val(event.current_upload_session_id);
	jQuery('#wcsts-complete-name-'+id).val(event.current_upload_session_id+"_"+event.file_name);
	jQuery('#wcsts_file_tmp_delete_button_'+id).data('file-to-delete', event.current_upload_session_id+"_"+event.file_name);
	jQuery('#wcsts_file_tmp_name_'+id).text(event.file_name);
}
function wcsts_delete_tmp_file(event)
{
	event.preventDefault();
	event.stopPropagation();

	var file_to_delete =  jQuery(event.currentTarget).data('file-to-delete');
	var id =  jQuery(event.currentTarget).data('id');
	
	jQuery(event.currentTarget).fadeOut();
	if(file_to_delete == "")
		return false;
	
	//UI
	jQuery("#wcsts_input_file_"+id).fadeIn();
	jQuery("#wcsts_input_file_"+id).val("");
	jQuery("#wcsts-filename-"+id).val("");
	jQuery("#wcsts-filenameprefix-"+id).val("");
	jQuery("#wcsts-complete-name-"+id).val("");
	jQuery("#wcsts_input_file_-"+id).val("");
	jQuery('#wcsts_file_tmp_name_'+id).text("");
	
	var formData = new FormData();
	formData.append('action', 'wcsts_delete_tmp_uploaded_file');
	formData.append('file_to_delete', file_to_delete);
	
	jQuery.ajax({
		url: wcsts.wcsts_ajax_url,
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
	return false;
}
function wcsts_replace_bad_char(text)
{
	text = text.replace(/'/g,"");
	text = text.replace(/"/g,"");
	text = text.replace(/ /g,"_");
	
	var remove_special_chars = true;
	var translate_re = /[öäüÖÄÜ]/g;
	var translate = {
		"ä": "a", "ö": "o", "ü": "u",
		"Ä": "A", "Ö": "O", "Ü": "U",
		"ß": "ss" // probably more to come
	  };
	text = text.replace(translate_re, function(match) { 
      return translate[match]; 
    });
	
	if(remove_special_chars)
	{
		text = text.replace(/[^0-9a-zA-Z_.]/g, '');
	}
	
	text = text == "" ? 'file' : text;
	return text;
}