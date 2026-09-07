jQuery(function($) {

	"use strict";

	// ****************************************************************
	// Welcome Pointer
	// ****************************************************************

	if (typeof(jQuery().pointer) != 'undefined') {		
		var getbowtied_dashboard_welcome_pointer = {
			content: getbowtied_dashboard_ajax_object.pointer_content,
			position: {
				edge: getbowtied_dashboard_ajax_object.pointer_edge,
				align: getbowtied_dashboard_ajax_object.pointer_align
			},
			pointerClass: getbowtied_dashboard_ajax_object.pointer_class,
			close: function() {
				$.ajax({
					type: 'POST',
					url: getbowtied_dashboard_ajax_object.ajax_url,
					data: {
						action: 'getbowtied_close_dashboard_welcome_pointer',
						security: getbowtied_dashboard_ajax_object._wpnonce,
						content: 'pointer closed'
					},
					success: function(response) {
						console.log(response.data);
						//console.log("cucu");
					}
			    })
			}
		}
	
	    $(getbowtied_dashboard_ajax_object.pointer_target).pointer(getbowtied_dashboard_welcome_pointer).pointer('open');	    
	}

})
