jQuery(function($){
	protection_modal_modal = new wlm3_modal( '#protection-modal', update_content_protection );
	add_level_modal = new wlm3_modal( '#add-level-modal', update_content_protection );
	remove_level_modal = new wlm3_modal( '#remove-level-modal', update_content_protection );
	settings_modal = new wlm3_modal( '#settings-modal' );
	showfiles_modal = new wlm3_modal( '#showfiles-modal' );

	$('.chk-all').click(function(){ $('.chk-contentid').prop("checked",$('.chk-all').is(":checked"))});
	$('.toggle-content-protection').click( toggle_content_protection );
	$('.toggle-autoconfigure').click( toggle_autoconfigure );
	$('.toggle-force-download').click( toggle_force_download );
	$('.blk-actions').change(level_action_changed);
	$('.settings-btn').click(show_settings_modal);

    $('.reset-config-btn').click( do_reset_config );

    $('.show-files-btn').click( show_files_clicked );

    $('.enable-protection').click( enable_protection );

    $('input[name=parentFolder]').apply_cancel( {
    	style : 'padding-top: 30px',
		require_change : false,
    } )
    .click_to_edit()
    .on( 'edit.click_to_edit', function ( e ) {
		$( this ).apply_cancel( 'show' );
    } )
    .on( 'cancel.apply_cancel', function( e ) {
    	$( this ).val( $( this ).data( 'initial' ) );
		$( this ).click_to_edit( 'close' );
		$( this ).apply_cancel( 'hide' );
    } )
    .on( 'apply.apply_cancel', function( e ) {
    	$( '.wlm-message-holder' ).show_message({
    		message : wp.i18n.__( 'Saving...', 'wishlist-member' )
    	});
		$( this ).click_to_edit( 'close' );
		$( this ).apply_cancel( 'hide' );
    	$( this ).closest( '.row' ).save_settings( {
    		on_success: function( me, result ) {
    			var i = $( me ).find( ':input[name=parentFolder]' );
    			i.data( 'initial', i.val() );
    			reload_folder_list();
    		},
    		on_done: function( me, result ) {
    			$( '.wlm-message-holder' ).show_message( {
    				message : result.msg,
    				type : result.msg_type
    			} );
    		}
    	});
    } );
});

var reload_folder_list = function() {
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "get_folders_list",
		userids : $(this).attr("data-userid"),
	};
	$(".folder-list").save_settings({
		data: settings_data,
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$(".folder-list").html( $result.folders );
	    		$('.toggle-content-protection').click( toggle_content_protection );
	    		$('.toggle-force-download').click( toggle_force_download );
	    	} else {
	    		console.log(wp.i18n.__( 'Unable to retrieve files', 'wishlist-member' ));
	    	}
	    }
	});
}

var toggle_autoconfigure = function() {
   $(this).parent().parent().parent().parent().parent().save_settings({
	    on_init: function( $me, $data) {
	    	if ( $data.folder_protection_autoconfig == "1" ) {
	    		$( '.wlm-message-holder' ).show_message({ message : wp.i18n.__( 'Enabling auto-configure...', 'wishlist-member' ) });
	    	} else {
	    		$( '.wlm-message-holder' ).show_message({ message : wp.i18n.__( 'Disabling auto-configure...', 'wishlist-member' )});
	    	}
	    },
        on_success: function( $me, $result) {
            $me = $me.find(".notification-switch");
	    	if ( $result.data.folder_protection_autoconfig == "1" ) {
	    		$( '.wlm-message-holder' ).show_message({ message : wp.i18n.__( 'Auto-Configure enabled', 'wishlist-member' ) });
	    	} else {
	    		$( '.wlm-message-holder' ).show_message({ message : wp.i18n.__( 'Auto-Configure disabled', 'wishlist-member' )});
	    	}
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

var enable_protection = function() {
	$(this).parent().parent().parent().parent().parent().save_settings({
	    on_success: function( $me, $result) {
	        $me = $me.find(".enable-protection");
	        $('.wlm-message-holder' ).show_message({ message : $result.msg, type: $result.msg_type });
	        if ( $result.success ) {
	        	$(this).reload_screen();
	        } else {
	        	$me.prop('checked', ! $me.prop('checked') );
	        }
	    },
	    on_fail: function( $me, $data) {
	        $me = $me.find(".enable-protection");
	        $( '.wlm-message-holder' ).show_message({ message : WLM3VARS.request_failed,type: "danger"});
	        $me.prop('checked', ! $me.prop('checked') );
	    },
	    on_error: function( $me, $error_fields) {
	    	$( '.wlm-message-holder' ).show_message({ message : WLM3VARS.request_error,type: "danger"});
	    }
	});
}

var show_files_clicked = function() {
	var $this_button = $(this);
	var modal_id = showfiles_modal.data.id;
	$("#" +modal_id).find(".modal-title").html(
		wp.i18n.sprintf(
			// Translators: Folder path.
			wp.i18n.__( 'Files inside the folder <strong>%1$s</strong>', 'wishlist-member' ),
			$this_button.attr('data-path')
		)
	);

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "get_folders_files",
		path : $(this).attr("data-path"),
	};
	$this_button.save_settings({
		data: settings_data,
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$("#" +modal_id).find(".modal-body ul").html("");
	    		$.each($result.files, function(i,v) {
					$("#" +modal_id).find(".modal-body ul").append( $("<li class='list-group-item'>" +v +"</li>") );
			    });
	    	} else {
	    		alert($result.msg);
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	alert(WLM3VARS.request_error);
	    }
	});
	showfiles_modal.open();
}

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
	} else if( protection == "Protected" && content_type != 'attachment' && content_type != 'folders' ) {
		protection = wp.i18n.__( 'Inherited', 'wishlist-member' );
		newicon = "security";
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
							$(".content-tbody-" +contentid).find('.toggle-force-download').click( toggle_force_download );
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

var toggle_force_download = function(e) {
	e.preventDefault();
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	var fld_value = $this_button.find("input[name='force_download']").val();
	var old_icon = fld_value != "1" ? "close" : "check";
	var new_icon = fld_value != "1" ? "check" : "close";
	$this_button.find("input[name='force_download']").val( fld_value != "1" ? 1 : 0 );

	$this_button.save_settings({
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true, icon:"update"});
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$this_button.disable_button( {disable:false, icon:new_icon } );
	    	} else {
	    		$this_button.disable_button( {disable:false, icon:old_icon } );
	    		$this_button.find("input[name='force_download']").val(fld_value);
	    		alert($result.msg);
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	$this_button.disable_button( {disable:false, icon:old_icon } );
	    	$this_button.find("input[name='force_download']").val(fld_value);
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	$this_button.disable_button( {disable:false, icon:old_icon } );
	    	$this_button.find("input[name='force_download']").val(fld_value);
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

var do_reset_config = function() {

    $(this).parent().parent().save_settings({
        on_success: function( $me, $result) {
        	if (  $result.success  ) {
	            settings_modal.close();
	            reload_folder_list();
        	} else {
        		alert($result.msg);
        	}
        },
        on_fail: function( $me, $data) {
            alert(WLM3VARS.request_failed);
        },
        on_error: function( $me, $error_fields) {
            alert(WLM3VARS.request_error);
        }
    });
}

