/*ajax call for general tab form save*/	 
jQuery(document).on("submit", "#wc_ast_paypal_settings_form", function(){
	var spinner = jQuery(this).find(".spinner").addClass("active");
	var form = jQuery(this);
	jQuery.ajax({
		url: ajaxurl+"?",
		data: form.serialize(),
		type: 'POST',
		dataType:"json",	
		success: function(response) {
			if( response.success === "true" ){
				spinner.removeClass("active");
				jQuery(".ast_snackbar").addClass('show_snackbar');	
				jQuery(".ast_snackbar").text( "Setings saved successfully." );
				setTimeout(function(){ jQuery(".ast_snackbar").removeClass('show_snackbar'); }, 3000);
				
			} else {
				//show error on front
			}
		},
		error: function(response) {
			console.log(response);			
		}
	});
	return false;
});