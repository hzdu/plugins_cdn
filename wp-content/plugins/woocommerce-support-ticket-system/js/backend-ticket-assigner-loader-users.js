"use strict";
jQuery(document).ready(function()
{
	jQuery(".js-data-users-ajax").select2(
	{
	  ajax: {
		url: ajaxurl,
		dataType: 'json',
		delay: 250,
		multiple: true,
		data: function (params) {
		  return {
			search_string: params.term, // search term
			page: params.page || 1,
			action: 'wcsts_get_admins_list'
		  };
		},
		processResults: function (data, params) 
		{
		  //console.log(params);
		   return {
			results: jQuery.map(data.results, function(obj) {
				var first_and_last_name = obj.first_name == "" && obj.last_name == "" ? "N/A" : obj.first_name+" "+obj.last_name;	
				return { id: obj.ID, text: "<b>#"+obj.ID+"</b> "+
											  " - <b>Login: </b> "+obj.user_login+ 
											  " - <b>First and last name: </b> "+first_and_last_name+
											  " - <b>Email: </b>"+obj.email
											  }; 
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
	  templateResult: wcsts_formatRepo, 
	  templateSelection: wcsts_formatRepoSelection  
	}
	);
});