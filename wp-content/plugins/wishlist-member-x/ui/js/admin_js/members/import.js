var queue_ticker = null;
var queue_cnt = 0;
var queue_interval = 3000;
var total_percentage = 0;
jQuery(function($){
	var form = $('#import-form');

	if ( $(".err_holder").html() !== "" ) $(".wlm-message-holder").show_message({message: $(".err_holder").html(), type:'danger', icon:'success'});
	if ( $(".msg_holder").html() !== "" )  $(".wlm-message-holder").show_message({message: $(".msg_holder").html(), type:'success', icon:'success'});

	$('.import-member').click(function(){
		if ( form.find(".select_mlevels").val().length ) {
			form.find("#importmlevels").val(0);
		}
		form.submit();
	});

	$('.wlm-select-selectall').allow_select_all();

	queue_cnt = parseInt($('.import-count').html());
	queue_cnt = queue_cnt ? queue_cnt : 0;

	if ( queue_cnt > 0 && $('.import-pause-btn').attr('action') != 'start' ) {
		clearInterval( queue_ticker );
		queue_ticker = setInterval( update_queue_counter, queue_interval );
	}

	$('.import-pause-btn').click(pause_import);
	$('.show-import-cancel-modal').click(function(){
		cancel_import_modal.open();
	});
	$(".import-cancel-btn").do_confirm({confirm_message : wp.i18n.__( 'Do you want to cancel this import?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Yes', 'wishlist-member' ), placement: 'right'}).on("yes.do_confirm", confirm_cancel_import );
});

var update_queue_counter = function () {
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "get_import_queue_count",
	};
	var x = $('.import-count').save_settings({
		data: settings_data,
	    on_success: function( $me, $result) {
	    	//prevent progress bar to decrease
	    	if ( $result.cnt < queue_cnt ) {
		    	queue_cnt = $result.cnt;
		    	total_cnt = parseInt($('.import-total').html());
		    	total_cnt = total_cnt ? total_cnt : 0;
		    	total_percentage = (((total_cnt-queue_cnt)/total_cnt) * 100);
		    	total_percentage = total_percentage.toFixed(2) +"%";

		    	$('.import-count').html(queue_cnt);

				$('.progress-bar').css("width", total_percentage );
				$('.import-progress').attr("title", total_percentage );
	    	}

			if ( queue_cnt <= 0 ) {
				clearInterval( queue_ticker );
				$('.import-count').html(0);
				$('.import-queue-holder').addClass("d-none").hide();
			}
			console.log(total_percentage);
	    },
	    on_fail: function( $me, $data) {
	    	console.log(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	console.log(WLM3VARS.request_error);
	    }
	});
}

var pause_import = function() {
	var $this_button = $(this);
	if ( $this_button.prop("disabled") || $this_button.hasClass("-disable") || $this_button.hasClass("-disabled") ) return false; //if disabled, do nothing

	var action = $this_button.attr("action");
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "pause_start_import",
		import_action : action,
	};

	clearInterval( queue_ticker );

	var x = $this_button.save_settings({
		data: settings_data,
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true,icon:"update", class : ''});
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.data.import_action && $result.data.import_action == "start" ) {
	    		queue_ticker = setInterval( update_queue_counter, queue_interval );
	    		$('.import-status').html("");
	    		$this_button.attr("title",wp.i18n.__( 'Pause Import', 'wishlist-member' ));
	    		$this_button.attr("action","pause");
	    		$this_button.find(".wlm-icons").html("pause");
	    	} else {
	    		$('.import-status').html(wp.i18n.__( 'PAUSED', 'wishlist-member' ));
	    		$this_button.attr("title",wp.i18n.__( 'Start Import', 'wishlist-member' ));
	    		$this_button.attr("action","start");
	    		$this_button.find(".wlm-icons").html("play_arrow");
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	console.log(WLM3VARS.request_failed);
	    	action = action == 'start' ? 'play_arrow' : action;
	    	$this_button.disable_button({disable:false,icon:action,class : ''});
	    },
	    on_error: function( $me, $error_fields) {
	    	console.log(WLM3VARS.request_error);
	    	action = action == 'start' ? 'play_arrow' : action;
	    	$this_button.disable_button({disable:false,icon:action,class : ''});
	    },
	    on_done: function( $me, $data) {
	    	$this_button.disable_button({disable:false,class : ''});
	    }
	});
}

var confirm_cancel_import = function() {
	var $this_button = $(this);

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "cancel_member_import",
	};
	var x = $this_button.save_settings({
		data: settings_data,
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		clearInterval( queue_ticker );
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
				$('.import-count').html(0);
				$('.import-queue-holder').addClass("d-none").hide();
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
