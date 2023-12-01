jQuery(function($){
	protection_modal_modal = new wlm3_modal( '#protection-modal', update_content_protection );
	add_level_modal = new wlm3_modal( '#add-level-modal', update_content_protection );
	remove_level_modal = new wlm3_modal( '#remove-level-modal', update_content_protection );
	ppp_modal = new wlm3_modal( '#ppp-modal', update_content_protection );
	edit_modal = new wlm3_modal( '#edit-modal', update_content_protection );

	$('.chk-all').click(function(){ $('.chk-contentid').prop("checked",$('.chk-all').is(":checked"))});
	$('.toggle-content-protection').click( toggle_content_protection );
	$('.edit-btn').click( show_edit_modal );

	$('.blk-actions').change(level_action_changed);
});

var show_edit_modal = function() {
	display_edit_modal( $(this), $(this).attr("data-contentid"), $(this).attr("data-contenttype") );
}

var display_edit_modal = function( $this, contentid, contenttype ) {
	var modal_id = edit_modal.data.id;
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "get_content_protection",
		id : contentid,
		type : contenttype,
	};
	var x = $this.save_settings({
		data: settings_data,
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		edit_modal.open();
	    		$("#" +modal_id).find(".edit-content").html( $result.html );
	    		$("#" +modal_id).find("input[name='contentids']").val( settings_data.id );
	    		var select = $("#" +modal_id).find(".wlm-levels");
	    		if ( !select.data('select2') ) select.select2({theme:"bootstrap", placeholder: wp.i18n.__( 'Select Membership Levels', 'wishlist-member' )});

	    		$('.add-wlm-levels').allow_select_all();

				$("#" +modal_id).find(".add-contentlvl-btn").click( add_contentlvl );
				$("#" +modal_id).find(".remove-contentlvl-btn").do_confirm({confirm_message : wp.i18n.__( 'Remove Level from Comment?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Remove', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", remove_contentlvl );
				$("#" +modal_id).find('a.-no-delete').tooltip({trigger : 'click'}).on('mouseout', function() {
					$(this).tooltip('hide');
				});

				$("#" +modal_id).find(".wlm-protection").change( change_wlm_protection );
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

var change_wlm_protection = function() {
	var $this_button = $(this)
	var $protection = $this_button.val();
	var $contentids = $this_button.closest(".modal-body").find("input[name='contentids']").val();
	var $content_type = $this_button.closest(".modal-body").find("input[name='content_type']").val();
	var $content_comment = $this_button.closest(".modal-body").find("input[name='content_comment']").val();

	var settings_data = {
		protection: $protection,
		content_type: $content_type,
		contentids: $contentids,
		action : "admin_actions",
		WishListMemberAction : "update_content_protection",
	};
	if ( $content_comment ) settings_data['content_comment'] = $content_comment;

	$this_button.save_settings({
		data: settings_data,
	    on_init: function( $me, $data) {
	    	$this_button.prop("disabled", true);
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
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
					$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
					display_edit_modal( $this_button, $contentids, "comment" );
		    	}
	    	} else {
	    		alert($result.msg);
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	$this_button.prop("disabled", false);
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	$this_button.prop("disabled", false);
	    	alert(WLM3VARS.request_error);
	    },
	    on_done: function( $me, $data) {
	    	$this_button.prop("disabled", false);
	    }
	});
}

var add_contentlvl = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing
	$lvlid = $this_button.closest(".row").find(".add-wlm-levels").val();
	$selected_options = $this_button.closest(".row").find(".add-wlm-levels option:selected");
	$lvlname = {};
	$selected_options.each(function(){
		$lvlname[$(this).val()] = $(this).html();
	});
	$contentids = $this_button.closest(".modal-body").find("input[name='contentids']").val();
	$content_type = $this_button.closest(".modal-body").find("input[name='content_type']").val();
	$content_comment = $this_button.closest(".modal-body").find("input[name='content_comment']").val();
	if ( !$lvlid ) { $(".wlm-message-holder").show_message({message:wp.i18n.__( 'No level selected.', 'wishlist-member' ), type: "danger" }); return; }
	if ( !$content_type ) { $(".wlm-message-holder").show_message({message:wp.i18n.__( 'Invalid content type.', 'wishlist-member' ), type: "danger" }); return; }
	if ( !$contentids ) { $(".wlm-message-holder").show_message({message:wp.i18n.__( 'No content selected.', 'wishlist-member' ), type: "danger" }); return; }
	var settings_data = {
		wlm_levels: $lvlid,
		content_type: $content_type,
		contentids: $contentids,
		level_action : "add",
		action : "admin_actions",
		WishListMemberAction : "update_content_protection",
	};
	if ( $content_comment ) settings_data['content_comment'] = $content_comment;

	var x = $this_button.save_settings({
		data: settings_data,
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true});
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		$holder = $this_button.closest(".modal-body").find(".contentlevel-holder");
	    		$holder.find(".tr-none").remove();
	    		$.each( $lvlname, function( $i, $n ) {
					var $markup = '<tr class="button-hover d-flex">';
					$markup += '<td width="90%" class="lvl-name">' +$n +'</td>';
					$markup += '<td width="10%" class="no-padding"><div class="btn-group-action pull-right">';
					$markup += '	<a href="#" level-id="' +$i +'" class="btn remove-contentlvl-btn -del-btn">';
					$markup += '		<span class="wlm-icons md-24 -icon-only">delete</span>';
					$markup += '	</a>';
					$markup += '</div></td>';
					$markup += '</tr>';
					var $el = $($markup);
					$el.find(".remove-contentlvl-btn").do_confirm({confirm_message : wp.i18n.__( 'Remove Level from Content?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Remove', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", remove_contentlvl );
		    		$holder.append($el);
		    		$this_button.closest(".row").find(".add-wlm-levels option[value='" +$i +"']").attr("disabled","disabled");
	    		});

	    		if ( $this_button.closest(".row").find(".add-wlm-levels").data('select2') ) $this_button.closest(".row").find(".add-wlm-levels").select2('destroy');
				$this_button.closest(".row").find(".add-wlm-levels").select2({theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Levels', 'wishlist-member' )});
	    		$this_button.closest(".row").find(".add-wlm-levels").val("").trigger('change.select2');
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
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		console.log($result);
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    	$this_button.disable_button( {disable:false, class:""});
	    },
	    on_error: function( $me, $error_fields) {
	    	alert(WLM3VARS.request_error);
	    	$this_button.disable_button( {disable:false, class:""});
	    },
	    on_done: function( $me, $data) {
	    	$this_button.disable_button( {disable:false, class:"-primary"});
	    	$this_button.blur();
	    }
	});
}

var remove_contentlvl = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing
	$lvlid = $this_button.attr("level-id");
	$contentids = $this_button.closest(".modal-body").find("input[name='contentids']").val();
	$content_type = $this_button.closest(".modal-body").find("input[name='content_type']").val();
	$content_comment = $this_button.closest(".modal-body").find("input[name='content_comment']").val();
	if ( !$lvlid ) { $(".wlm-message-holder").show_message({message:wp.i18n.__( 'No level selected.', 'wishlist-member' ), type: "danger" }); return; }
	if ( !$content_type ) { $(".wlm-message-holder").show_message({message:wp.i18n.__( 'Invalid content type.', 'wishlist-member' ), type: "danger" }); return; }
	if ( !$contentids ) { $(".wlm-message-holder").show_message({message:wp.i18n.__( 'No content selected.', 'wishlist-member' ), type: "danger" }); return; }
	var settings_data = {
		wlm_levels: [$lvlid],
		content_type: $content_type,
		contentids: $contentids,
		level_action : "remove",
		action : "admin_actions",
		WishListMemberAction : "update_content_protection",
	};
	if ( $content_comment ) settings_data['content_comment'] = $content_comment;

	var x = $this_button.save_settings({
		data: settings_data,
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true});
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		$holder = $this_button.closest(".modal-body").find(".contentlevel-holder");
	    		$this_button.closest("tr").fadeOut( 500, function(){
	    			$(this).remove();
		    		if ( $holder.find('tr').length <= 0 ) {
						var $markup = '<tr class="tr-none"><td class="text-center" colspan="2">-None-</td></tr>';
						var $el = $($markup);
			    		$holder.append($el);
		    		}
	    		});
	    		$(".add-wlm-levels option[value='" +$lvlid +"']").removeAttr("disabled");
	    		if ( $(".add-wlm-levels").data('select2') ) $this_button.closest(".row").find(".add-wlm-levels").select2('destroy');
				$(".add-wlm-levels").select2({theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Levels', 'wishlist-member' )});

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
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		console.log($result);
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    	$this_button.disable_button( {disable:false, class:""});
	    },
	    on_error: function( $me, $error_fields) {
	    	alert(WLM3VARS.request_error);
	    	$this_button.disable_button( {disable:false, class:""});
	    },
	    on_done: function( $me, $data) {
	    	$this_button.disable_button( {disable:false, class:"-primary"});
	    	$this_button.blur();
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
	} else if( protection == "Protected" && content_type != 'categories' && content_type != 'folders' && !content_comment ) {
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
							$(".content-tr-" +contentid).attr("class", items.attr("class") );
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
						$(".content-tbody-" +contentid).find('.edit-btn').click( show_edit_modal );
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
