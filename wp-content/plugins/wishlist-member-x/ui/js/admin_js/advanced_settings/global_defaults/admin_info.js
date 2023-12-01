jQuery(function($){
	$('.admin-info-save').click(save_admin_info);
});

var save_admin_info = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	$this_button.closest('.content-wrapper').save_settings({
	    on_init: function( $me, $data) {
	    	$me.find(".admin-info-save").disable_button({disable:true, icon:"update"});
	    },
	    on_success: function( $me, $result) {
	    	$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	$.each( $error_fields, function( key, obj ) {
  				obj.parent().addClass('has-error');
			});
	    	$me.find(".admin-info-save").disable_button( {disable:false, icon:"save"} );
	    },
	    on_done: function( $me, $data) {
	    	$me.find(".admin-info-save").disable_button( {disable:false, icon:"save"} );
	    },
	});
}

