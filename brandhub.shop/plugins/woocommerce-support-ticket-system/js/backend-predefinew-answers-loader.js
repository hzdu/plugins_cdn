"use strict";
jQuery(document).ready(function()
{
	jQuery("#wcsts_predefiled_answer_loader").selectWoo(
			{
			   width: "100%",
			 ajax: {
				url: ajaxurl,
				dataType: 'json',
				delay: 250,
				tags: "true",
				multiple: true,
				data: function (params) {
				  return {
					search_string: params.term, // search term
					page: params.page || 1,
					action: 'wcsts_get_predefined_answers_list'
				  };
				},
				processResults: function (data, params) 
				{
				  //console.log(params);
				 jQuery("#wcsts_predefiled_answer_loader")
				   return {
					results: jQuery.map(data.results, function(obj) 
					{
						//console.log(obj);
						return { id: obj.id, text: obj.id+" - "+obj.title };
					}),
					pagination: {
								  'more': typeof data.pagination === 'undefined' ? false : data.pagination.more
								}
					};
				},
				cache: true
			  },
			  escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
			  minimumInputLength: 0,
			  templateResult: wcsts_formatRepo,  //defined in: product-fields-configurator-misc.js
			  templateSelection:  wcsts_formatRepoSelection  //defined in: product-fields-configurator-misc.js
			});
	jQuery("#wcsts_predefiled_answer_loader").on("select2:select", wcsts_on_answer_selected);
});
function wcsts_on_answer_selected(event)
{
	jQuery("#wcsts_predefiled_answer_loader").prop("disabled", true);
	jQuery("#wcsts_predefiled_answer_loader_status").fadeIn();
	
	var formData = new FormData();
	formData.append('action', 'wcsts_get_answer');
	formData.append('id', event.currentTarget.value);
	
	jQuery.ajax({
		url: ajaxurl,
		type: 'POST',
		data: formData,
		async: true,
		success: function (data) 
		{
			//UI
			jQuery("#wcsts_predefiled_answer_loader").prop("disabled", false);
			jQuery("#wcsts_predefiled_answer_loader_status").fadeOut();
			
			try {
				const content = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
				tinymce.editors.reply_message.setContent(content);
			}
			catch(err) {}
			jQuery('#reply_message').val(data);
			
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