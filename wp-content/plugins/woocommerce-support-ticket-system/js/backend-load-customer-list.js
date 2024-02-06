"use strict";
jQuery(document).ready(function()
{
	jQuery(".js-data-customers-ajax").select2(
	{
	  placeholder: wcsts.select2_selected_value == "" ? wcsts.select2_placeholder : wcsts.selected_user_info_label+wcsts.select2_selected_value,
	 /*  width: 350, */
	  ajax: {
		url: ajaxurl,
		dataType: 'json',
		delay: 250,
		multiple: false,
		data: function (params) {
		  return {
			search_string: params.term, // search term
			page: params.page || 1,
			action: 'wcsts_get_customers_list'
		  };
		},
		processResults: function (data, params) 
		{
		  //console.log(params);
		 
		   return {
			results: jQuery.map(data.results, function(obj) 
			{
				var user = (obj.first_name+obj.last_name).length != 0 ? "<br><b>User: </b>"+obj.first_name+" "+obj.last_name+"<br>" : "<br>";
				
				 return { id: obj.ID, text: "<b>Login: </b>"+obj.user_login+"<br>"+  
											 "<b>User ID: </b>"+obj.ID+"<br>"+  
											  "<b>Email: </b>"+obj.email+"<br>"+
											  "<b>Billing: </b> "+obj.billing_name+" "+obj.billing_last_name+" <br>"+obj.billing_email+
											  user
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
	
	//init
	if(wcsts.select2_selected_value != "")
	{
		
	}
	
});
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