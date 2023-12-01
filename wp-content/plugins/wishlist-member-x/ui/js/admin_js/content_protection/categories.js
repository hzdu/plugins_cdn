jQuery(function($){
	protection_modal_modal = new wlm3_modal( '#protection-modal', update_content_protection );
	add_level_modal = new wlm3_modal( '#add-level-modal', update_content_protection );
	remove_level_modal = new wlm3_modal( '#remove-level-modal', update_content_protection );
	settings_modal = new wlm3_modal( '#settings-modal', function(){} );

	$('.chk-all').click(function(){ $('.chk-contentid').prop("checked",$('.chk-all').is(":checked"))});
	$('.toggle-content-protection').click( toggle_content_protection );
	$('.blk-actions').change(level_action_changed);
	$('.settings-btn').click(show_settings_modal);
});

var show_settings_modal = function() {
	settings_modal.open();
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
	    	$(".wlm-message-holder").show_message({message:wp.i18n.__( 'Invalid Action.', 'wishlist-member' ), type: "danger" });
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

	var parent = $this_button.attr("parent");
	parent = parseInt(parent);

	var dicon = $this_button.find(".wlm-icons").html();
	var newicon = $this_button.find(".wlm-icons").html();

	var protection = $this_button.attr("title");
	var content_type = $this_button.attr("content_type");
	var contentids = $this_button.attr("contentids");
	var content_comment = $this_button.attr("content_comment");
	
	var old_prot = protection;
	if ( protection == "Unprotected" ) {
		protection = wp.i18n.__( 'Protected', 'wishlist-member' );
		newicon = "lock";
	} else if( protection == "Protected" && parent ) {
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
							// console.log(items.html());
							$(".content-tr-" +contentid).attr("class", items.attr("class") );
							$(".content-tbody-" +contentid).html( items.html() );
							// rebind buttons
							$(".content-tbody-" +contentid).find('.toggle-content-protection').click( toggle_content_protection );
							$(".child-tbody-" +contentid ).each(function (i, row) {
								$(this).find("input[name='protection']").remove();
								$(this).find(".toggle-content-protection").trigger("click");
							});
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

						$(".child-tbody-" +contentid ).each(function (i, row) {
							$(this).find("input[name='protection']").remove();
							$(this).find(".toggle-content-protection").trigger("click");
						});
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
