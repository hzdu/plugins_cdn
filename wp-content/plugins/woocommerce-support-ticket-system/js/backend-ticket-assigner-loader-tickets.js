"use strict";
jQuery(document).ready(function()
{
	jQuery(".js-data-tickets-ajax").select2(
	{
	  ajax: {
		url: ajaxurl,
		dataType: 'json',
		delay: 250,
		multiple: false,
		data: function (params) {
		  return {
			search_string: params.term, // search term
			page: params.page || 1,
			action: 'wcsts_get_tickets_list'
		  };
		},
		processResults: function (data, params) 
		{
		  //console.log(params);
		 
		   return {
			results: jQuery.map(data.results, function(obj) {
				return { id: obj.ID, text: "<b>#"+obj.ID+"</b>"+
											   " - <b>Opened on: </b> "+obj.ticket_open_date+
											   " - <b>Status: </b> "+obj.ticket_status+
											   " - <b>Type: </b> "+obj.ticket_type
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
	});
});
