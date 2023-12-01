jQuery(function($){
	protection_modal_modal = new wlm3_modal( '#protection-modal', update_content_protection );
	add_level_modal = new wlm3_modal( '#add-level-modal', update_content_protection );
	remove_level_modal = new wlm3_modal( '#remove-level-modal', update_content_protection );
	ppp_modal = new wlm3_modal( '#ppp-modal', update_content_protection );
	edit_modal = new wlm3_modal( '#edit-modal' );
	ppp_user_modal = new wlm3_modal( '#ppp-user-modal', update_content_protection );

	$('.chk-all').click(function(){ $('.chk-contentid').prop("checked",$('.chk-all').is(":checked"))});
	$('.toggle-content-protection').click( toggle_content_protection );
	$('.edit-btn').click( show_edit_modal );
	$('.blk-actions').change(level_action_changed);
	$('.enable-custom-post-type').click( enable_custom_post_type );

	$(".wlm-payperpost-users").select2({
		ajax: {
		    url: WLM3VARS.ajaxurl,
		    dataType: 'json', delay: 500, type: 'POST',
		    data: function (params) {
		      return {
		        search:  params.term || "", page: params.page || 0, page_limit: 20,
				action: 'admin_actions', WishListMemberAction : 'ppp_user_search',
		      };
		    },
		    processResults: function (data) {
		        var arr = []
		        $.each( data.users, function (index, value) {
		            arr.push({ id: value.ID, text: value.display_name + " (" + value.user_email +")" })
		        })
				var more = ( data.page * data.page_limit ) < data.total;
				return {results: arr, pagination: {more: more}};
			}, cache: true
		},
		minimumInputLength: 2, placeholder: wp.i18n.__( 'Search for members', 'wishlist-member' ),theme:"bootstrap",
	});
});

var enable_custom_post_type = function() {
	$(this).parent().parent().parent().parent().parent().save_settings({
	    on_success: function( $me, $result) {
	        $me = $me.find(".enable-custom-post-type");
	        console.log($result.msg);
	        $(this).reload_screen();
	    },
	    on_fail: function( $me, $data) {
	        $me = $me.find(".enable-custom-post-type");
	        alert(WLM3VARS.request_failed);
	        $me.prop('checked', ! $me.prop('checked') );
	    },
	    on_error: function( $me, $error_fields) {
	        alert(WLM3VARS.request_error);
	    }
	});
}

var change_edit_tab = function() {
	if (  $(this).attr("aria-controls") == "ppp" ) {
		var exclude = [];
		$("#ppp").find(".remove-ppp-user-btn").each(function(){
			exclude.push($(this).attr("postuser-id"));
		});
		select = $("#ppp .wlm-payperposts");
		if ( select.data('select2') ) select.select2('destroy');
		select.select2({
			ajax: {
			    url: WLM3VARS.ajaxurl,
			    dataType: 'json', delay: 500, type: 'POST',
			    data: function (params) {
			      return {
			        search:  params.term || "", page: params.page || 0, page_limit: 20,
					action: 'admin_actions', WishListMemberAction : 'ppp_user_search',
					exclude: exclude,
			      };
			    },
			    processResults: function (data) {
			        var arr = []
			        $.each( data.users, function (index, value) {
			            arr.push({ id: value.ID, text: value.display_name + " (" + value.user_email +")" })
			        })
					var more = ( data.page * data.page_limit ) < data.total;
					return {results: arr, pagination: {more: more}};
				}, cache: true
			},
			minimumInputLength: 2, placeholder: wp.i18n.__( 'Search for members', 'wishlist-member' ),theme:"bootstrap",
		});
		select.val("").trigger('change.select2');
	}
}

var add_payperpost_user = function(e) {
	e.preventDefault();
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing
	$pid = $this_button.closest("#ppp").find("input[name='ppp_content_id']").val();
	$userid = $this_button.closest(".row").find(".wlm-payperposts").val();
	if ( !$userid ) { $(".wlm-message-holder").show_message({message:wp.i18n.__( 'Invalid member.', 'wishlist-member' ), type: "danger" }); return; }
	if ( !$pid ) { $(".wlm-message-holder").show_message({message:wp.i18n.__( 'No post selected.', 'wishlist-member' ), type: "danger" }); return; }
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "add_remove_payperpost",
		operation : "add",
		postid : $pid,
		userid : $userid,
	};
	var x = $this_button.save_settings({
		data: settings_data,
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true});
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		$holder = $this_button.closest("#ppp").find( ".user-holder");
	    		$holder.find(".tr-none").remove();
		        $.each( $result.data, function ( uid, data ) {
					var $markup = '<tr class="button-hover d-flex">';
					$markup += '<td class="col-5 display-name">' +data.display_name +'</td>';
					$markup += '<td class="col-5">' +data.user_email +'</td>';
					$markup += '<td class="no-padding col-2"><div class="btn-group-action pull-right">';
					$markup += '<a href="#" postuser-id="' +data.userid +'" class="btn remove-ppp-user-btn -del-btn"><span class="wlm-icons md-24 -icon-only">delete</span></a>';
					$markup += '</div></td>';
					$markup += '</tr>';
					var $el = $($markup);
					$el.find(".remove-ppp-user-btn").do_confirm({confirm_message : wp.i18n.__( 'Remove User from Pay Per Post?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Remove', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", remove_payperpost_user );
		    		$holder.append($el);
		        })
		        $(".content-tr-" +$pid +" .ppp-user-count-holder").html($holder.find('tr').length);
	    		$("#" +edit_modal.data.id).find('.edit-tab').trigger("click");
	    	} else {
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

var remove_payperpost_user = function(e) {
	e.preventDefault();
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing
	var ptitle = $this_button.closest("tr").find(".display-name").html();
	// if ( !confirm("You are removing the access of '" +ptitle +"' from this content.") ) return;
	$pid = $this_button.closest("#ppp").find("input[name='ppp_content_id']").val();
	$userid = $this_button.attr("postuser-id");
	if ( !$userid ) { $(".wlm-message-holder").show_message({message:wp.i18n.__( 'Invalid member.', 'wishlist-member' ), type: "danger" }); return; }
	if ( !$pid ) { $(".wlm-message-holder").show_message({message:wp.i18n.__( 'No post selected.', 'wishlist-member' ), type: "danger" }); return; }
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "add_remove_payperpost",
		operation : "remove",
		postid : $pid,
		userid : $userid,
	};
	var x = $this_button.save_settings({
		data: settings_data,
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true});
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
				$holder = $this_button.closest("#ppp").find( ".user-holder");
	    		$this_button.closest("tr").fadeOut( 500, function(){
	    			$(this).remove();
	    			$("#" +edit_modal.data.id).find('.edit-tab').trigger("click");
		    		if ( $holder.find('tr').length <= 0 ) {
		    			$(".content-tr-" +$pid +" .ppp-user-count-holder").html(0);
						var $markup = '<tr class="tr-none d-flex"><td class="text-center col-12" colspan="3">-None-</td></tr>';
						var $el = $($markup);
			    		$holder.append($el);
		    		} else {
		    			$(".content-tr-" +$pid +" .ppp-user-count-holder").html($holder.find('tr').length);
		    		}
	    		});
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
	    	$this_button.disable_button( {disable:false, class:""});
	    	$this_button.blur();
	    }
	});
}

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
	    		if ( $result.content.post_title ) {
	    			title = "<span style='display:inline-block;margin:0px;padding:0px;width:400px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;'>Edit: ";
	    			title += $result.content.post_title;
	    			title += "</span>";
	    			$("#" +modal_id).find(".modal-title").html(title);
	    		}
	    		edit_modal.open();
	    		$("#" +modal_id).find(".edit-content").html( $result.html );
	    		$("#" +modal_id).transformers();
	    		$("#" +modal_id).find("input[name='contentids']").val( settings_data.id );
	    		var select = $("#" +modal_id).find(".wlm-levels");
	    		if ( !select.data('select2') ) select.select2({theme:"bootstrap", placeholder: wp.i18n.__( 'Select Membership Levels', 'wishlist-member' )});

	    		$('.add-wlm-levels').allow_select_all();

	    		$("#" +modal_id).find('.edit-tab').click( change_edit_tab );

				$("#" +modal_id).find('.add-ppp-btn').click( add_payperpost_user );

				$("#" +modal_id).find(".remove-ppp-user-btn").do_confirm({confirm_message : wp.i18n.__( 'Remove User from Pay Per Post?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Remove', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", remove_payperpost_user );
				// $("#" +modal_id).find(".remove-ppp-user-btn").click( remove_payperpost_user );

				$("#" +modal_id).find(".add-contentlvl-btn").click( add_contentlvl );
				$("#" +modal_id).find(".remove-contentlvl-btn").do_confirm({confirm_message : wp.i18n.__( 'Remove Level from Content?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Remove', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", remove_contentlvl );
				$("#" +modal_id).find('a.-no-delete').tooltip({trigger : 'click'}).on('mouseout', function() {
					$(this).tooltip('hide');
				});

				$("#" +modal_id).find(".wlm-protection").change( change_wlm_protection );
				$("#" +modal_id).find(".wlm-useraccess").change( change_wlm_useraccess );
	    	} else {
	    		console.log($result);
	    		$(".wlm-message-holder").show_message({message:WLM3VARS.request_failed, type: "danger", icon: "danger"});
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	console.log($data);
	    	$(".wlm-message-holder").show_message({message:WLM3VARS.request_failed, type: "danger", icon: "danger"});
	    },
	    on_error: function( $me, $error_fields) {
	    	console.log($error_fields);
	    	$(".wlm-message-holder").show_message({message:WLM3VARS.request_error, type: "danger", icon: "danger"});
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
					display_edit_modal( $this_button, $contentids, $content_type );
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

var change_wlm_useraccess = function() {
	var $this_button = $(this)
	var $useraccess = $this_button.val();
	var $contentids = $this_button.closest(".modal-body").find("input[name='contentids']").val();
	var $content_type = $this_button.closest(".modal-body").find("input[name='content_type']").val();
	var $content_comment = $this_button.closest(".modal-body").find("input[name='content_comment']").val();

	var settings_data = {
		useraccess: $useraccess,
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
					display_edit_modal( $this_button, $contentids, $content_type );
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

	if ( protection == "Inherited" ) {
		protection = wp.i18n.__( 'Protected', 'wishlist-member' );
		newicon = "lock";
	} else if( protection == "Protected") {
		protection = wp.i18n.__( 'Unprotected', 'wishlist-member' );
		newicon = "lock_open";
	} else {
		protection = wp.i18n.__( 'Inherited', 'wishlist-member' );
		newicon = "inherit";
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
	    case "addpppusers":
	        ppp_user_modal.open();
			modal_id = ppp_user_modal.data.id;
			$("#" +modal_id).find("input[name='operation']").val("add");
			$("#" +modal_id).find(".save-button .wlm-icons").html("add_circle_outline");
			$("#" +modal_id).find(".save-button .wlm-icons").next().html(" Add Pay Per Post Member");
			break;
	    case "removepppusers":
	        ppp_user_modal.open();
			modal_id = ppp_user_modal.data.id;
			$("#" +modal_id).find("input[name='operation']").val("remove");
			$("#" +modal_id).find(".save-button .wlm-icons").html("remove_circle_outline");
			$("#" +modal_id).find(".save-button .wlm-icons").next().html(" Remove Pay Per Post Member");
			break;
	    default:
		    $(".wlm-message-holder").show_message({message:wp.i18n.__( 'Invalid action.', 'wishlist-member' ), type: "danger" });
	        return;
	}
	$("#" +modal_id).find("input[name='contentids']").val(ids.join(','));
	var select = $("#" +modal_id).find(".wlm-levels");
	if ( !select.data('select2') ) select.select2({theme:"bootstrap"});
	select.val("").trigger('change.select2');
	$(".wlm-payperpost-users").val("").trigger('change.select2');
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

// Load Pay Per Post JS
$.getScript(WLM3VARS.pluginurl + '/ui/js/admin_js/content_protection/posts/payperpost.js?build=3.24.4');