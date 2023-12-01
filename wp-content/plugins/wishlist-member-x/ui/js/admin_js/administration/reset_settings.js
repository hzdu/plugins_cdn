jQuery(function($){
	reset_modal = new wlm3_modal( '#reset-modal', reset_settings );
	$('.reset-settings-btn').click(show_reset_modal);
});

var show_reset_modal = function() {
	reset_modal.open();
}

var reset_settings = function () {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	var modal_id = $this_button.closest(".modal").prop("id");
	var $body = $("#" +modal_id).find(".modal-body");

	var x = $body.save_settings({
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true, text:wp.i18n.__( 'Resetting...', 'wishlist-member' ), icon:"update"});
			$("#" +modal_id).on('hide.bs.modal', function(e) {
				if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) {
					e.preventDefault();
				}
			});
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$("#" +modal_id).unbind("hide.bs.modal");
	    		$("#" +modal_id).modal('toggle');
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		 window.parent.location.href = "?page=WishListMember";
	    	} else {
	    		alert($result.msg);
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		console.log($result);
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    	$this_button.disable_button({disable:false, text:wp.i18n.__( 'Yes', 'wishlist-member' ), icon:"delete"});
	    	console.log($data);
	    },
	    on_error: function( $me, $error_fields) {
	    	alert(WLM3VARS.request_error);
	    	$this_button.disable_button({disable:false, text:wp.i18n.__( 'Yes', 'wishlist-member' ), icon:"delete"});
	    },
	    on_done: function( $me, $data) {
	    	$this_button.disable_button({disable:false, text:wp.i18n.__( 'Yes', 'wishlist-member' ), icon:"delete"});
	    	$("#" +modal_id).unbind("hide.bs.modal");
	    }
	});
}