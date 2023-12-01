jQuery(function($){
	protection_modal_modal = new wlm3_modal( '#protection-modal', update_content_protection );
	add_level_modal = new wlm3_modal( '#add-level-modal', update_content_protection );
	remove_level_modal = new wlm3_modal( '#remove-level-modal', update_content_protection );
	ppp_modal = new wlm3_modal( '#ppp-modal', update_content_protection );
	edit_modal = new wlm3_modal( '#edit-modal', update_content_protection );
	settings_modal = new wlm3_modal( '#settings-modal', save_settings );

	$('.chk-all').click(function(){ $('.chk-contentid').prop("checked",$('.chk-all').is(":checked"))});
	$('.toggle-content-protection').click( toggle_content_protection );
	$('.edit-btn').click( show_edit_modal );
	$('.blk-actions').change(level_action_changed);
	$('.settings-btn').click(show_settings_modal);

	$('.enable-protection').click( enable_protection );
});

var enable_protection = function() {
	$(this).parent().parent().parent().parent().parent().save_settings({
	    on_success: function( $me, $result) {
	        $me = $me.find(".enable-protection");
	        console.log($result.msg);
	        $(this).reload_screen();
	    },
	    on_fail: function( $me, $data) {
	        $me = $me.find(".enable-protection");
	        alert(WLM3VARS.request_failed);
	        $me.prop('checked', ! $me.prop('checked') );
	    },
	    on_error: function( $me, $error_fields) {
	        alert(WLM3VARS.request_error);
	    }
	});
}

var show_settings_modal = function() {
	settings_modal.open();
}

var save_settings = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing
	var $save_button = $(this).closest(".modal").find(".save-button");

	$(this).closest(".modal").find(".modal-body").save_settings({
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true, icon:"update"});
	    	$save_button.disable_button({disable:true});
	    },
	    on_success: function( $me, $result) {
	    	if ( $this_button.hasClass("-close") ) settings_modal.close();
	    	$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	$.each( $error_fields, function( key, obj ) {
  				obj.parent().addClass('has-error');
			});
	    	$this_button.disable_button( {disable:false, icon:"save"} );
	    	$save_button.disable_button({disable:false});
	    },
	    on_done: function( $me, $data) {
	    	$this_button.disable_button( {disable:false, icon:"save"} );
	    	$save_button.disable_button({disable:false});
	    },
	});
}

var show_edit_modal = function() {
	var modal_id = edit_modal.data.id;
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "get_content_protection",
		id : $(this).attr("data-contentid"),
		type : $(this).attr("data-contenttype"),
	};
	var x = $(this).save_settings({
		data: settings_data,
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		edit_modal.open();
	    		$("#" +modal_id).find(".edit-content").html( $result.html );
	    		$("#" +modal_id).find("input[name='contentids']").val( settings_data.id );
	    		var select = $("#" +modal_id).find(".wlm-levels");
	    		if ( !select.data('select2') ) select.select2({theme:"bootstrap"});
	    	} else {
	    		console.log($result);
	    		alert(WLM3VARS.request_failed);
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	console.log($data);
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	console.log($error_fields);
	    	alert(WLM3VARS.request_error);
	    }
	});
}

var level_action_changed = function() {
	var operation = $(this).val();
	var ids = []
	$(".chk-contentid:checked").each(function() {
		ids.push($(this).val());
    });
    $(this).val("").trigger('change.select2');
    if ( ids.length <= 0 ) {
    	$(".wlm-message-holder").show_message({message:wp.i18n.__( 'No content selected.', 'wishlist-member' ), type: "danger" });
    	return;
    }
	var modal_id = "";
	switch ( operation ) {
	    case "protection":
	        protection_modal_modal.open();
	        modal_id = protection_modal_modal.data.id;
			break;
	    case "add_level":
	        add_level_modal.open();
			modal_id = add_level_modal.data.id;
			break;
	    case "remove_level":
	        remove_level_modal.open();
			modal_id = remove_level_modal.data.id;
			break;
	    case "ppp":
	        ppp_modal.open();
			modal_id = ppp_modal.data.id;
			break;
	    case "pppusers":
	        add_level_modal.open();
			modal_id = add_level_modal.data.id;
			break;
	    default:
	    	$(".wlm-message-holder").show_message({message:wp.i18n.__( 'Invalid action.', 'wishlist-member' ), type: "danger" });
	        return;
	}
	$("#" +modal_id).find("input[name='contentids']").val(ids.join(','));
	var select = $("#" +modal_id).find(".wlm-levels");
	if ( !select.data('select2') ) select.select2({theme:"bootstrap"});
	select.val("").trigger('change.select2');
}

var toggle_content_protection = function (e) {
	e.preventDefault()
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	var dicon = $this_button.find(".wlm-icons").html();
	var newicon = $this_button.find(".wlm-icons").html();

	var protection = $this_button.attr("title");
	var content_type = $this_button.attr("content_type");
	var contentids = $this_button.attr("contentids");
	var content_comment = $this_button.attr("content_comment");

	if ( protection == "Unprotected" ) {
		protection = wp.i18n.__( 'Protected', 'wishlist-member' );
		newicon = "lock";
	} else if( protection == "Protected" && content_type != 'folders' ) {
		protection = wp.i18n.__( 'Inherited', 'wishlist-member' );
		newicon = "inherit";
	} else {
		protection = wp.i18n.__( 'Unprotected', 'wishlist-member' );
		newicon = "lock_open";
	}

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "update_content_protection",
		protection : protection,
		content_type: content_type,
		contentids: contentids,
	};
	if ( content_comment == "1" ) {
		settings_data["content_comment"] = 1;
	}

	$this_button.save_settings({
		data: settings_data,
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true, icon:"update"});
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$this_button.attr("title", protection );
		    	if ( $result.content ) {
					$.each( $result.content, function( contentid, markup ) {
						if ( markup ) {
							var items = $( markup );
							$(".content-tbody-" +contentid).html( items.html() );
							// rebind buttons
							$(".content-tbody-" +contentid).find('.toggle-content-protection').click( toggle_content_protection );
							$(".content-tbody-" +contentid).find('.edit-btn').click( show_edit_modal );
						}
					});
		    	}
	    	} else {
	    		alert($result.msg);
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	$this_button.disable_button( {disable:false, icon:dicon } );
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	$this_button.disable_button( {disable:false, icon:dicon } );
	    	alert(WLM3VARS.request_error);
	    }
	});
}

var update_content_protection = function() {
	var modal_id = $(this).closest(".modal").prop("id");
	var $body = $("#" +modal_id).find(".modal-body");
	var $save_button = $("#" +modal_id).find(".save-button");
	var x = $body.save_settings({
	    on_init: function( $me, $data) {
	    	$save_button.disable_button( {disable:true});
	    },
	    on_success: function( $me, $result) {
	    	$("#" +modal_id).modal('toggle');
	    	// console.log($result);
	    	if ( $result.success && $result.content ) {
				$.each( $result.content, function( contentid, markup ) {
					if ( markup ) {
						var items = $( markup );
						$(".content-tbody-" +contentid).html( items.html() );
						// rebind buttons
						$(".content-tbody-" +contentid).find('.toggle-content-protection').click( toggle_content_protection );
					}
				});
	    	} else {
	    		console.log($result);
	    	}
	    	$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    	$(".chk-all").prop('checked', false);
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	$.each( $error_fields, function( key, obj ) {
  				obj.parent().addClass('has-error');
			});
	    	$save_button.disable_button( {disable:false});
	    },
	    on_done: function( $me, $data) {
	    	$save_button.disable_button( {disable:false});
	    }
	});
}
