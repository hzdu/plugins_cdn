
	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	 function cons(res){
	}
		
	 jQuery.noConflict();
	 jQuery(document).ready(function ($) {
		 

		hide_unhide_squ_sandbox();
		jQuery("#woocommerce_square_enable_sandbox:checkbox").change(function() {
			hide_unhide_squ_sandbox();
		});

		 jQuery('.enable_plugin').click(function(e) {
			 e.preventDefault();
			if (!jQuery(this).is(':checked')) {
				cons('checked');
				var data = {
					action: 'en_plugin',
					status: 'enab',
					pluginid: jQuery(this).attr('id'),
				};
			} else {
				var data = {
					action: 'en_plugin',
					status: 'disab',
					pluginid: jQuery(this).attr('id'),
				};
			}
			cons(data);
			jQuery.post(my_ajax_backend_scripts.ajax_url, data, function(response) {
				var response = JSON.parse(response);
				if(response.status){
					window.location.replace(window.location.href);
				}
			}); 
		});
		
		
		jQuery('.gpayred').click(function(e) {
			e.preventDefault();
			window.location.replace(jQuery(this).parent().attr('href'));
			
		});
		
	 });
	 
	 
	function hide_unhide_squ_sandbox(){
		var ischecked= jQuery("#woocommerce_square_enable_sandbox:checkbox").is(':checked');
		if(ischecked){
			jQuery("#sandbox_application_id").parents("tr").fadeIn();
			jQuery("#woocommerce_square_sandbox_application_id").parents("tr").fadeIn();
			jQuery("#sandbox_access_token").parents("tr").fadeIn();
			jQuery("#woocommerce_square_sandbox_access_token").parents("tr").fadeIn();
			jQuery("#sandbox_location_id").parents("tr").fadeIn();
			jQuery("#woocommerce_square_sandbox_location_id").parents("tr").fadeIn();
			jQuery(".squ-sandbox-description").fadeIn();
			jQuery("#woocommerce_square_api_details").fadeIn();
		} else {
			jQuery("#sandbox_application_id").parents("tr").fadeOut();
			jQuery("#woocommerce_square_sandbox_application_id").parents("tr").fadeOut();
			jQuery("#sandbox_access_token").parents("tr").fadeOut();
			jQuery("#woocommerce_square_sandbox_access_token").parents("tr").fadeOut();
			jQuery("#sandbox_location_id").parents("tr").fadeOut();
			jQuery("#woocommerce_square_sandbox_location_id").parents("tr").fadeOut();
			jQuery(".squ-sandbox-description").fadeOut();
			jQuery("#woocommerce_square_api_details").fadeOut();
		}

	}