var queue_ticker = null;
var queue_cnt = 0;
var queue_total = 0;
var queue_interval = 2000;
var total_percentage = 0;

jQuery(function($){
	create_backup_modal = new wlm3_modal( '#create-backup-modal', create_backup );
	restore_backup_modal = new wlm3_modal( '#restore-backup-modal', restore_backup );

	$('.create-backup-btn').click(show_create_backup_modal);
	$('.restore-backup-btn').click(show_restore_backup_modal);
	// $('.delete-backup-btn').click(confirm_delete_backup);
	$('.download-backup-btn').click(download_backup);
	$('.chk-include').click(include_settings_checked);

	if ( $("input[name='import_err']") && $("input[name='import_err']").val() ) {
		console.log($("input[name='import_err']").val());
		$(".wlm-message-holder").show_message({message:$("input[name='import_err']").val(), type:"danger", icon:"danger"});
	}
	if ( $("input[name='import_msg']") && $("input[name='import_msg']").val() ) {
		$(".wlm-message-holder").show_message({message:$("input[name='import_msg']").val(), type:"success", icon:"success"});
	}

	$(".delete-backup-btn").do_confirm({confirm_message : wp.i18n.__( 'Delete Backup?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Delete', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", confirm_delete_backup );

	queue_count = parseInt($('.queue-count').html());
	queue_total = parseInt($('.queue-total').html());

	if ( (queue_count - queue_total) > 0 && $('.backup-pause-btn').attr('action') != 'start' ) {
		clearInterval( queue_ticker );
		queue_ticker = setInterval( update_queue_counter, queue_interval );
	}
	$(".backup-cancel-btn").do_confirm({confirm_message : wp.i18n.__( 'Do you want to cancel this backup?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Yes', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", confirm_cancel_backup );
});

var confirm_cancel_backup = function() {
	var $this_button = $(this);

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "cancel_backup",
	};
	var x = $this_button.save_settings({
		data: settings_data,
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		clearInterval( queue_ticker );
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
				$('.queue-count').html(0);
				$('.create-backup-queue').addClass("d-none").hide();
				$('.create-backup-form').removeClass("d-none").show();
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	console.log(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	console.log(WLM3VARS.request_error);
	    },
	});
}

var update_queue_counter = function () {
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "get_backup_queue_count",
	};
	var x = $('.queue-total').save_settings({
		data: settings_data,
	    on_success: function( $me, $result) {
	    	//prevent progress bar to decrease
	    	if ( $result.cnt >= 0 ) {
		    	queue_total = queue_count - $result.cnt;
		    	total_percentage = 100 - (((queue_count-queue_total)/queue_count) * 100);
		    	total_percentage = total_percentage.toFixed(2) +"%";

		    	$('.queue-total').html(queue_total);

				$('.progress-bar').css("width", total_percentage );
				$('.import-progress').attr("title", total_percentage );

				$('.backup-table').parent().addClass("d-none").hide();
				if ( $result.backup_monitor ) {
					$('.backup-table').parent().removeClass("d-none").show();
					$('.backup-table').html($result.backup_monitor);
				}
	    	}

			if ( $result.cnt == 0 ) {
				clearInterval( queue_ticker );
				$('.queue-count').html(0);
				$('.create-backup-queue').addClass("d-none").hide();
				$('.create-backup-form').removeClass("d-none").show();
				$(this).reload_screen();
			}
			// console.log($result.backup_monitor);
	    },
	    on_fail: function( $me, $data) {
	    	console.log(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	console.log(WLM3VARS.request_error);
	    }
	});
}

var include_settings_checked = function() {
	if ( !$(".include-users").is(":checked") && !$(".include-posts").is(":checked") && !$(".include-settings").is(":checked") ) {
		$('.create-backup-btn').prop("disabled", true);
		$('.create-backup-btn').addClass("-disable");
	} else {
		$('.create-backup-btn').prop("disabled", false);
		$('.create-backup-btn').removeClass("-disable");
	}
}

var show_create_backup_modal = function( e ) {
	e.preventDefault();
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	var include_users   	= $(this).parent().find(".include-users").is(":checked") ? 1 : 0;
	var include_posts   	= $(this).parent().find(".include-posts").is(":checked") ? 1 : 0;
	var include_settings   	= $(this).parent().find(".include-settings").is(":checked") ? 1 : 0;
	$("#" +create_backup_modal.data.id).find("input[name='backup_include_users']").val( include_users );
	$("#" +create_backup_modal.data.id).find("input[name='backup_include_posts']").val( include_posts );
	$("#" +create_backup_modal.data.id).find("input[name='backup_include_settings']").val( include_settings );
	create_backup_modal.open();
}

var show_restore_backup_modal = function( e ) {
	e.preventDefault();
	var name   = $(this).attr("data-name");
	var data_date   = $(this).attr("data-date");
	var msg = wp.i18n.sprintf(
		// Translators: Date.
		wp.i18n.__( 'Do you want to restore the backup you made on <strong>%1$s</strong>?', 'wishlist-member' ),
		data_date
	);
	$("#" +restore_backup_modal.data.id).find("input[name='name']").val( name );
	$("#" +restore_backup_modal.data.id).find(".message").html( msg );
	restore_backup_modal.open();
}

var confirm_delete_backup = function( e ) {
	e.preventDefault();
	// if(!$(this).hasClass('-btn-confirmed')) return;

	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "delete_backup",
		name : $(this).attr("data-name"),
	};

	var x = $this_button.save_settings({
		data: settings_data,
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true});
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		$(".backup-holder-" +$result.details.date).fadeOut(500, function(){ $(this).remove();});
	    	} else {
	    		alert($result.msg);
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		console.log($result);
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    	$this_button.disable_button({disable:false});
	    },
	    on_error: function( $me, $error_fields) {
	    	alert(WLM3VARS.request_error);
	    	$this_button.disable_button({disable:false});
	    },
	    on_done: function( $me, $data) {
	    	$this_button.disable_button({disable:false});
	    }
	});
}

var download_backup = function( e ) {
	e.preventDefault();
	var name   = $(this).attr("data-name");
	$("#download_backup_form").find("input[name='SettingsName']").val(name);
	$("#download_backup_form").submit();
}

var create_backup = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	var modal_id = $this_button.closest(".modal").prop("id");
	var $body = $("#" +modal_id).find(".modal-body");

	var x = $body.save_settings({
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true});
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
	    		$("#backup-holder").html($result.files);
				$("#backup-holder").find('.restore-backup-btn').click(show_restore_backup_modal);
				$("#backup-holder").find('.delete-backup-btn').do_confirm({confirm_message : wp.i18n.__( 'Delete Backup?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Delete', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", confirm_delete_backup );
				$("#backup-holder").find('.download-backup-btn').click(download_backup);
	    	} else {
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		console.log($result);
	    	}
	    	$(this).reload_screen();
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    	$this_button.disable_button( {disable:false});
	    },
	    on_error: function( $me, $error_fields) {
	    	alert(WLM3VARS.request_error);
	    	$this_button.disable_button( {disable:false});
	    },
	    on_done: function( $me, $data) {
	    	$this_button.disable_button( {disable:false});
	    	$("#" +modal_id).unbind("hide.bs.modal");
	    }
	});
}

var restore_backup = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	var modal_id = $this_button.closest(".modal").prop("id");
	var $body = $("#" +modal_id).find(".modal-body");

	var x = $body.save_settings({
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true, text:wp.i18n.__( 'Restoring...', 'wishlist-member' ), icon:"update"});
			$("#" +modal_id).on('hide.bs.modal', function(e) {
				if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) {
					e.preventDefault();
				}
			});
			var msg = wp.i18n.__( 'Please wait while we restore your settings. It might take some time...', 'wishlist-member' );
			$("#" +modal_id).find(".message").html( msg );
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$("#" +modal_id).unbind("hide.bs.modal");
	    		$("#" +modal_id).modal('toggle');
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    	} else {
	    		alert($result.msg);
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    		console.log($result);
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    	$this_button.disable_button({disable:false, text:wp.i18n.__( 'Yes', 'wishlist-member' ), icon:"restore"});
	    },
	    on_error: function( $me, $error_fields) {
	    	alert(WLM3VARS.request_error);
	    	$this_button.disable_button({disable:false, text:wp.i18n.__( 'Yes', 'wishlist-member' ), icon:"restore"});
	    },
	    on_done: function( $me, $data) {
	    	$this_button.disable_button({disable:false, text:wp.i18n.__( 'Yes', 'wishlist-member' ), icon:"restore"});
	    	$("#" +modal_id).unbind("hide.bs.modal");
	    }
	});
}