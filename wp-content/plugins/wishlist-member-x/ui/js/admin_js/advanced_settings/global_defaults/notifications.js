jQuery(function($){
	$('.notification-switch').click(save_notification_settings);
	$('.edit-notification').click(edit_notification);
	$('.edit-notification-save').click(edit_notification_save);
});

var save_notification_settings = function() {
	//save the value
	$(this).parent().parent().save_settings({
	    on_success: function( $me, $result) {
	    	$me = $me.find(".notification-switch");
			if ( $me.prop('checked') ) {
				$me.closest('.row').find(".edit-notification").disable_button({disable:false});
			} else {
				$me.closest('.row').find(".edit-notification").disable_button({disable:true});
			}

			//display check mark
	    	var $markup = "<a href=\"javascrip:void(0);\" class=\"btn -icon-only\"><i class=\"wlm-icons text-success\">check</i></a>";
			var $el = $($markup);
	    	$me.closest('.row').find(".edit-notification").after($el);
	    	$el.fadeOut(2000);
	    },
	    on_fail: function( $me, $data) {
	    	$me = $me.find(".notification-switch");
	    	alert(WLM3VARS.request_failed);
	    	$me.prop('checked', ! $me.prop('checked') );
	    },
	    on_error: function( $me, $error_fields) {
	    	alert(WLM3VARS.request_error);
	    }
	});
}

var edit_notification = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	var $option_title 	= $this_button.closest('.row').find(".title-label").html();
	var $option_key 		= $this_button.closest('.row').find(".notification-switch").prop("name");
	var $option_content 	= $("#" +$option_key +"_holder").html();
	if ( $option_content ) {
		$("#edit-notification-modal").modal();
		$("#edit-notification-modal").find(".modal-title span").html($option_title);
		$("#edit-notification-modal").find(".modal-body .content-wrapper").html($option_content);
		$("#edit-notification-modal").find(".modal-footer .notification-button-id").val($option_key);
	} else {
		alert(wp.i18n.__( 'No options available.', 'wishlist-member' ));
	}
}

var edit_notification_save = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	$this_button.closest('.modal-content').find(".content-wrapper").save_settings({
	    on_init: function( $me, $data) {
	    	$('#edit-notification-modal').find(".edit-notification-save").disable_button({disable:true, icon:"update"});
	    },
	    on_success: function( $me, $result) {
	    	var btn_id = $("#edit-notification-modal").find(".modal-footer .notification-button-id").val();
	    	$('#edit-notification-modal').modal('toggle');
		    $("#edit-notification-modal").find(".modal-body .content-wrapper").html("");
		    $("#edit-notification-modal").find(".modal-footer .notification-button-id").val("");

		    //display check mark
	    	var $markup = "<a href=\"javascrip:void(0);\" class=\"btn -icon-only\"><i class=\"wlm-icons text-success\">check</i></a>";
			var $el = $($markup);
	    	$('#' +btn_id +"_btn").after($el);
	    	$el.fadeOut(2000);
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	$.each( $error_fields, function( key, obj ) {
  				obj.parent().addClass('has-error');
			});
	    	$('#edit-notification-modal').find(".edit-notification-save").disable_button( {disable:false, icon:"save"} );
	    },
	    on_done: function( $me, $data) {
	    	$('#edit-notification-modal').find(".edit-notification-save").disable_button( {disable:false, icon:"save"} );
	    },
	    // debug: true
	});
}

$("#edit-notification-modal").on("hidden.bs.modal", function () { //clear modal when closed
    $("#edit-notification-modal").find(".modal-body .content-wrapper").html("");
    $("#edit-notification-modal").find(".modal-footer .notification-button-id").val("");
});