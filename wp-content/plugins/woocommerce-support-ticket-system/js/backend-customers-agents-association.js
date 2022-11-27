"use strict";
jQuery(document).ready(function()
{
	jQuery(document).on('submit', '#wcsts_assign_tickets_form', wcsts_assign_tickets_form_submit);
});
function wcsts_assign_tickets_form_submit(event)
{
	
	if(jQuery("#wcsts_select2_user_id").val().length == 0 && jQuery("#wcsts_select2_customer_id").val().length != 0)
		return confirm(wcsts.user_ids_missing_message);

	return true;
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