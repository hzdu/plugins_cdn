jQuery(
	function($){
		set_schedule_modal = new wlm3_modal( '#set-schedule-modal', set_schedule );
		var enable_modules = 0;

		$( '.toggle-collapse-table' ).click( toggle_collapse_table );

		$( '.chk-all' ).click(
			function(){
				var chk = $( '.chk-all' ).is( ":checked" );
				$( '.chk-contentid' ).each(
					function() {
						if ( ! $( this ).hasClass( "-disable" ) ) {
							$( this ).prop( "checked",chk );
						}
						// enable_modules = enable_modules + parseInt($(this).attr("option_value"));
					}
				);
				// $('.chk-contentid').prop("checked",$('.chk-all').is(":checked"))}
			}
		);

		$( '.wlm-datetimepicker' ).daterangepicker(
			{
				singleDatePicker: true,
				timePicker: true,
				showCustomRangeLabel: false,
				startDate: moment(),
				buttonClasses: "btn -default",
				applyClass: "-success",
				cancelClass: "-bare",
				autoUpdateInput: false,
				locale: {
					format: "MM/DD/YYYY hh:mm a"
				}
			}
		);
		$( '.wlm-datetimepicker' ).on(
			'apply.daterangepicker',
			function(ev, picker) {
				$( this ).val( picker.startDate.format( "MM/DD/YYYY hh:mm a" ) );
			}
		);

		$( '.level-collapse' ).click(
			function() {
				var target = $( this ).data( 'target' );
				$( target ).toggleClass( 'd-none' );
			}
		);

		$( '.blk-actions' ).change( content_action_changed );
		$( '.wlm-select-action' ).change( action_changed );

		$( ".remove-sched-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Delete this schedule?', 'wishlist-member' ), yes_button : 'Delete', placement: 'right'} ).on( "yes.do_confirm", remove_schedule );
		$( '.update-sched-btn' ).click( content_action_changed );

		$( '.enable-content-control-switch' ).each(
			function() {
				enable_modules = enable_modules + parseInt( $( this ).attr( "option_value" ) );
			}
		);
		// for toggle boxes
		$( '.enable-content-control-switch' ).on(
			'click',
			function() {
				$( this ).parent().parent().parent().parent().parent().save_settings(
					{
						on_success: function( $me, $result) {
							var chk = $me.find( ".enable-content-control-switch" );
							$( '.wlm-message-holder' ).show_message( { message : $result.msg, type : $result.msg_type} );
							if ( chk.attr( "option_type" ) == "scheduler" ) {
								chk.attr( "option_value", $result.data.enable_content_scheduler );
							}
							if ( chk.attr( "option_type" ) == "archiver" ) {
								chk.attr( "option_value", $result.data.enable_content_archiver );
							}
							if ( chk.attr( "option_type" ) == "manager" ) {
								chk.attr( "option_value", $result.data.enable_content_manager );
							}

							if ( enable_modules == 0 && $result.data.enable_content_scheduler == 1 ) {
								$( '#the-screen' ).html( $( '#wlm-simple-loader-container' ).html() );
								location.reload();
							}

							if ( enable_modules == 1 && $result.data.enable_content_scheduler == 0 ) {
								$( '#the-screen' ).html( $( '#wlm-simple-loader-container' ).html() );
								location.reload();
							}
							enable_modules = 0;
							$( '.enable-content-control-switch' ).each(
								function() {
									enable_modules = enable_modules + parseInt( $( this ).attr( "option_value" ) );
								}
							);
						},
						on_fail: function( $me, $data) {
							$me = $me.find( ".enable-content-control-switch" );
							alert( WLM3VARS.request_failed );
							$me.prop( 'checked', ! $me.prop( 'checked' ) );
						},
						on_error: function( $me, $error_fields) {
							alert( WLM3VARS.request_error );
						}
					}
				);
			}
		);
	}
);

var toggle_collapse_table = function( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	$this_button.save_settings(
		{
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true,icon:"update"} );
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					$( this ).reload_screen();
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				$this_button.disable_button( {disable:false} );
				alert( WLM3VARS.request_failed );
			},
			on_error: function( $me, $error_fields) {
				$this_button.disable_button( {disable:false} );
				alert( WLM3VARS.request_error );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false} );
			}
		}
	);
}

var action_changed          = function(op ="") {
	if ( typeof op !== 'object' ) {
		operation = op;
	} else {
		operation = $( this ).val();
	}

	var modal_id     = set_schedule_modal.data.id;
	var sched_action = $( "#" + modal_id ).find( "input[name='sched_action']" ).val();

	$( "#" + modal_id ).find( ".action-status-holder" ).addClass( "d-none" );
	$( "#" + modal_id ).find( ".action-moveadd-holder" ).addClass( "d-none" );
	$( "#" + modal_id ).find( ".action-repost-holder" ).addClass( "d-none" );

	$( "#" + modal_id ).find( "input[name='content_action']" ).prop( "required", true );
	$( "#" + modal_id ).find( "input[name='schedule_date']" ).prop( "required", false );
	$( "#" + modal_id ).find( ".wlm-select-cat" ).prop( "required", false );
	$( "#" + modal_id ).find( ".wlm-select-status" ).prop( "required", false );
	$( "#" + modal_id ).find( "input[name='content_every']" ).prop( "required", false );
	$( "#" + modal_id ).find( "input[name='content_by']" ).prop( "required", false );
	$( "#" + modal_id ).find( "input[name='content_repeat']" ).prop( "required", false );

	if ( sched_action == "remove"  ) {
		return;
	}

	$( "#" + modal_id ).find( "input[name='schedule_date']" ).prop( "required", true );

	if ( operation == "add" || operation == "move") {
		$( "#" + modal_id ).find( ".action-moveadd-holder" ).removeClass( "d-none" );
		$( "#" + modal_id ).find( ".wlm-select-cat" ).prop( "required", true );
		var select  = $( "#" + modal_id ).find( ".wlm-select-cat" );
		var plchldr = select.attr( "placeholder" );
		select.val( "" ).trigger( 'change.select2' );
		if ( select.data( 'select2' ) ) {
			select.select2( 'destroy' );
		}
		select.select2( {theme:"bootstrap",placeholder: plchldr} );
	}
	if ( operation == "repost") {
		$( "#" + modal_id ).find( ".action-repost-holder" ).removeClass( "d-none" );
		$( "#" + modal_id ).find( "input[name='content_every']" ).prop( "required", true );
		$( "#" + modal_id ).find( "input[name='content_by']" ).prop( "required", true );
		$( "#" + modal_id ).find( "input[name='content_repeat']" ).prop( "required", true );
	}
	if ( operation == "set") {
		$( "#" + modal_id ).find( ".action-status-holder" ).removeClass( "d-none" );
		$( "#" + modal_id ).find( ".wlm-select-status" ).prop( "required", true );
		var select  = $( "#" + modal_id ).find( ".wlm-select-status" );
		var plchldr = select.attr( "placeholder" );
		select.val( "" ).trigger( 'change.select2' );
		if ( select.data( 'select2' ) ) {
			select.select2( 'destroy' );
		}
		select.select2( {theme:"bootstrap",placeholder: plchldr} );
	}
}

var toggle_scheduler_fields = function( hide = true, for_remove = false ) {
	var modal_id = set_schedule_modal.data.id;
	if ( hide ) {
		$( "#" + modal_id ).find( ".membership-level-select" ).addClass( "d-none" );
		$( "#" + modal_id ).find( ".content-sched-holder" ).addClass( "d-none" );
		$( "#" + modal_id ).find( "input[name='show_after']" ).prop( "required", false );
		$( "#" + modal_id ).find( ".wlm-levels" ).prop( "required", false );
	} else {
		$( "#" + modal_id ).find( ".membership-level-select" ).removeClass( "d-none" );
		$( "#" + modal_id ).find( ".wlm-levels" ).prop( "required", true );
		if ( ! for_remove ) {
			$( "#" + modal_id ).find( ".content-sched-holder" ).removeClass( "d-none" );
			$( "#" + modal_id ).find( "input[name='show_after']" ).prop( "required", true );
		}
	}
}

var toggle_archiver_fields  = function( hide = true, for_remove = false ) {
	var modal_id = set_schedule_modal.data.id;
	if ( hide ) {
		$( "#" + modal_id ).find( ".membership-level-select" ).addClass( "d-none" );
		$( "#" + modal_id ).find( ".archive-date-holder" ).addClass( "d-none" );
		$( "#" + modal_id ).find( "input[name='archive_date']" ).prop( "required", false );
		$( "#" + modal_id ).find( ".wlm-levels" ).prop( "required", false );
	} else {
		$( "#" + modal_id ).find( ".membership-level-select" ).removeClass( "d-none" );
		$( "#" + modal_id ).find( ".wlm-levels" ).prop( "required", true );
		if ( ! for_remove ) {
			$( "#" + modal_id ).find( ".archive-date-holder" ).removeClass( "d-none" );
			$( "#" + modal_id ).find( "input[name='archive_date']" ).prop( "required", true );
		}
	}
}

var toggle_manager_fields   = function( hide = true, action = "", for_remove = false ) {
	var modal_id = set_schedule_modal.data.id;
	if ( hide ) {
		$( "#" + modal_id ).find( ".manager-date-holder" ).addClass( "d-none" );
		$( "#" + modal_id ).find( ".wlm-select-action" ).prop( "required", false );
		$( "#" + modal_id ).find( "input[name='schedule_date']" ).prop( "required", false );
		$( "#" + modal_id ).find( ".wlm-select-status" ).prop( "required", false );
		$( "#" + modal_id ).find( ".wlm-select-cat" ).prop( "required", false );
		$( "#" + modal_id ).find( "input[name='content_every']" ).prop( "required", false );
		$( "#" + modal_id ).find( "input[name='content_by']" ).prop( "required", false );
		$( "#" + modal_id ).find( "input[name='content_repeat']" ).prop( "required", false );
	} else {
		$( "#" + modal_id ).find( ".manager-date-holder" ).removeClass( "d-none" );
		$( "#" + modal_id ).find( ".wlm-select-action" ).prop( "required", true );
		$( "#" + modal_id ).find( "input[name='schedule_date']" ).prop( "required", true );
		$( "#" + modal_id ).find( ".date-holder" ).removeClass( "d-none" );
		action_changed( action );
		if ( ! for_remove ) {
			if ( action == "add" || action == "move") {
				$( "#" + modal_id ).find( ".wlm-select-cat" ).prop( "required", true );
			} else if ( action == "repost") {
				$( "#" + modal_id ).find( "input[name='content_every']" ).prop( "required", true );
				$( "#" + modal_id ).find( "input[name='content_by']" ).prop( "required", true );
				$( "#" + modal_id ).find( "input[name='content_repeat']" ).prop( "required", true );
			} else if ( action == "set") {
				$( "#" + modal_id ).find( ".wlm-select-status" ).prop( "required", true );
			}
		} else {
			$( "#" + modal_id ).find( ".date-holder" ).addClass( "d-none" );
		}
	}
}


var content_action_changed  = function(){
	var operation    = $( this ).val();
	var remove       = false;
	var sched_action = "";
	var wlm_action   = "";
	var ids          = [];

	var levelid  = "";
	var numdays  = "";
	var hidedays = "";

	var scheddate = "";
	var schedid   = "";
	var action    = "";

	var cat = [];

	var repnum = "";
	var repby  = "day";
	var repend = "";

	var status = "";

	var disable_dropdown = false;

	var confirm_protection = false;

	if ( operation ) {
		$( ".chk-contentid:checked" ).each(
			function() {
				ids.push( $( this ).val() );
				if ( $( this ).attr( "protection_status" ).indexOf( "unprotected" ) >= 0 || $( this ).attr( "protection_status" ).indexOf( "open" ) >= 0 ) {
					confirm_protection = true;
				}
			}
		);
		if ( ids.length <= 0 ) {
			$( this ).val( "" ).trigger( 'change.select2' );
			$( ".wlm-message-holder" ).show_message( {message:wp.i18n.__( 'No content selected.', 'wishlist-member' ), type: "danger" } );
			return;
		}
		$( this ).val( "" ).trigger( 'change.select2' );

		if ( operation == "remove_scheduler" ) {
			operation = "scheduler";
			remove    = true;
		}
		if ( operation == "remove_archiver" ) {
			operation = "archiver";
			remove    = true;
		}
		if ( operation == "remove_manager" ) {
			operation = "manager";
			remove    = true;
		}
	} else {
		operation = $( this ).attr( "operation" );
		action    = $( this ).attr( "action" );
		ids.push( $( this ).attr( "postid" ) );

		levelid  = $( this ).attr( "levelid" );
		numdays  = $( this ).attr( "numdays" );
		hidedays = $( this ).attr( "hidedays" );

		scheddate = $( this ).attr( "scheddate" );
		schedid   = $( this ).attr( "schedid" );
		if ( action == "add" || action == "move" ) {
			cat = $( this ).attr( "cat" ).split( '#' );
		} else if ( action == "repost" ) {
			repnum = $( this ).attr( "repnum" );
			repby  = $( this ).attr( "repby" );
			repend = $( this ).attr( "repend" );
		} else if ( action == "set" ) {
			status = $( this ).attr( "status" );
		}

		disable_dropdown = true;
	}

	var modal_id = set_schedule_modal.data.id;

	toggle_scheduler_fields( true );
	toggle_archiver_fields( true );
	toggle_manager_fields( true );

	set_schedule_modal.open();

	$( ".confirm-save-button" ).popover( 'dispose' );
	$( ".confirm-save-button" ).removeClass( 'do-confirm-set' );
	$( ".confirm-save-button" ).removeClass( 'save-button' );
	$( ".confirm-save-button" ).unbind( "click", set_schedule );

	sched_action = remove ? 'remove' : 'set';
	$( "#" + modal_id ).find( "input[name='sched_action']" ).val( sched_action );

	switch ( operation ) {
		case "scheduler":
			toggle_scheduler_fields( false,remove );
			$( "#" + modal_id ).find( "input[name='show_after']" ).val( numdays );
			$( "#" + modal_id ).find( "input[name='show_for']" ).val( hidedays );
			if ( disable_dropdown ) {
				$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Edit Content Schedule (Drip)', 'wishlist-member' ) );
				$( "#" + modal_id ).find( ".save-button span" ).html( "Update Content Schedule" );
				$( ".confirm-save-button" ).click( set_schedule );
			} else {
				if ( remove ) {
					$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Remove Content Schedule (Drip)', 'wishlist-member' ) );
					$( "#" + modal_id ).find( ".confirm-save-button span" ).html( "Remove Content Schedule" );

					$( "#" + modal_id ).find( ".confirm-save-button" ).removeClass( "-primary" ).addClass( "-danger" );
					$( "#" + modal_id ).find( ".confirm-save-button .wlm-icons" ).html( "remove_circle_outline" );

					$( ".confirm-save-button" ).click( set_schedule );
				} else {
					$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Set Content Schedule (Drip)', 'wishlist-member' ) );
					$( "#" + modal_id ).find( ".confirm-save-button span" ).html( "Set Content Schedule" );

					$( "#" + modal_id ).find( ".confirm-save-button" ).removeClass( "-danger" ).addClass( "-primary" );
					$( "#" + modal_id ).find( ".confirm-save-button .wlm-icons" ).html( "save" );

					if ( confirm_protection ) {
						$( ".confirm-save-button" ).do_confirm( {confirm_message : wp.i18n.__( 'Content must be protected in order for Content Scheduling to function properly.<br />Protect it now?', 'wishlist-member' ), yes_button : 'Yes',no_button : 'Cancel', placement: 'bottom'} ).on( "yes.do_confirm", set_schedule );
					} else {
						$( ".confirm-save-button" ).click( set_schedule );
					}

				}
			}
			wlm_action = "set_content_schedule";
			break;
		case "archiver":
			toggle_archiver_fields( false,remove );
			$( "#" + modal_id ).find( "input[name='archive_date']" ).val( scheddate );
			if ( disable_dropdown ) {
				$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Edit Content Archive Date', 'wishlist-member' ) );
				$( "#" + modal_id ).find( ".confirm-save-button span" ).html( "Update Archive Date" );
				$( ".confirm-save-button" ).click( set_schedule );
			} else {
				if ( remove ) {
					$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Remove Content Archive Date', 'wishlist-member' ) );
					$( "#" + modal_id ).find( ".confirm-save-button span" ).html( "Remove Archive Date" );

					$( "#" + modal_id ).find( ".confirm-save-button" ).removeClass( "-primary" ).addClass( "-danger" );
					$( "#" + modal_id ).find( ".confirm-save-button .wlm-icons" ).html( "remove_circle_outline" );
					$( ".confirm-save-button" ).click( set_schedule );
				} else {
					$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Set Content Archive Date', 'wishlist-member' ) );
					$( "#" + modal_id ).find( ".confirm-save-button span" ).html( "Set Archive Date" );

					$( "#" + modal_id ).find( ".confirm-save-button" ).removeClass( "-danger" ).addClass( "-primary" );
					$( "#" + modal_id ).find( ".confirm-save-button .wlm-icons" ).html( "save" );

					if ( confirm_protection ) {
						$( ".confirm-save-button" ).do_confirm( {confirm_message : wp.i18n.__( 'Content must be protected in order for Content Archiving to function properly.<br />Protect it now?', 'wishlist-member' ), yes_button : 'Yes',no_button : 'Cancel', placement: 'bottom'} ).on( "yes.do_confirm", set_schedule );
					} else {
						$( ".confirm-save-button" ).click( set_schedule );
					}

				}
			}
			wlm_action = "set_content_archive";
			break;
		case "manager":
			toggle_manager_fields( false,"set",remove );
			$( "#" + modal_id ).find( "input[name='schedule_date']" ).prop( "required", false ).val( scheddate );
			$( "#" + modal_id ).find( "input[name='content_every']" ).prop( "required", false ).val( repnum );
			$( "#" + modal_id ).find( "input[name='content_repeat']" ).prop( "required", false ).val( repend );

			$( ".confirm-save-button" ).click( set_schedule );

			if ( disable_dropdown ) {
				$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Edit Content Manager Date', 'wishlist-member' ) );
				$( "#" + modal_id ).find( ".confirm-save-button span" ).html( "Update Manager Date" );
			} else {
				if ( remove ) {
					$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Remove Content Manager Date', 'wishlist-member' ) );
					$( "#" + modal_id ).find( ".confirm-save-button span" ).html( "Remove Content Manager Date" );

					$( "#" + modal_id ).find( ".confirm-save-button" ).removeClass( "-primary" ).addClass( "-danger" );
					$( "#" + modal_id ).find( ".confirm-save-button .wlm-icons" ).html( "remove_circle_outline" );
				} else {
					$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Add Content Manager Date', 'wishlist-member' ) );
					$( "#" + modal_id ).find( ".confirm-save-button span" ).html( "Add Content Manager Date" );

					$( "#" + modal_id ).find( ".confirm-save-button" ).removeClass( "-danger" ).addClass( "-primary" );
					$( "#" + modal_id ).find( ".confirm-save-button .wlm-icons" ).html( "save" );
				}
			}
			wlm_action = "set_content_manager";
			break;
		default:
			$( ".wlm-message-holder" ).show_message( {message:wp.i18n.__( 'Invalid Action.', 'wishlist-member' ), type: "danger" } );
			return;
	}

	$( "#" + modal_id ).find( "input[name='schedid']" ).val( schedid );
	$( "#" + modal_id ).find( "input[name='WishListMemberAction']" ).val( wlm_action );
	$( "#" + modal_id ).find( "input[name='contentids']" ).val( ids.join( ',' ) );

	var select  = $( "#" + modal_id ).find( ".wlm-levels" );
	var plchldr = select.attr( "placeholder" );
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	select.select2( {theme:"bootstrap",placeholder: plchldr} );
	select.val( levelid ).prop( "disabled",disable_dropdown ).trigger( 'change.select2' );

	var select  = $( "#" + modal_id ).find( ".wlm-select-action" );
	var plchldr = select.attr( "placeholder" );
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	select.select2( {theme:"bootstrap",placeholder: plchldr} );
	select.val( action ).prop( "disabled",disable_dropdown ).trigger( 'change.select2' );
	if ( disable_dropdown && operation == "manager" ) {
		action_changed( action );
	}

	var select  = $( "#" + modal_id ).find( ".wlm-select-status" );
	var plchldr = select.attr( "placeholder" );
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	select.select2( {theme:"bootstrap",placeholder: plchldr} );
	select.val( status ).trigger( 'change.select2' );

	var select  = $( "#" + modal_id ).find( ".wlm-select-cat" );
	var plchldr = select.attr( "placeholder" );
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	select.select2( {theme:"bootstrap",placeholder: plchldr} );
	select.val( cat ).trigger( 'change.select2' );

	var select  = $( "#" + modal_id ).find( ".wlm-select-by" );
	var plchldr = select.attr( "placeholder" );
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	select.select2( {theme:"bootstrap",placeholder: plchldr} );
	select.val( repby ).trigger( 'change.select2' );

}

var set_schedule = function() {
	var modal_id     = $( this ).closest( ".modal" ).prop( "id" );
	var $body        = $( "#" + modal_id ).find( ".modal-body" );
	var $save_button = $( this );

	var btn_icon = "add_circle_outline";
	if ( $save_button.find( ".wlm-icons" ) ) {
		btn_icon = $save_button.find( ".wlm-icons" ).html();
	}
	var x = $body.save_settings(
		{
			on_init: function( $me, $data) {
				$save_button.disable_button( {disable:true, icon:"update"} );
			},
			on_success: function( $me, $result) {
				$( "#" + modal_id ).modal( 'toggle' );
				if ( $result.success && $result.data ) {
					$( this ).reload_screen();
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
					$( ".chk-all" ).prop( 'checked', false );
					$( ".chk-userid" ).prop( 'checked', false );
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				alert( WLM3VARS.request_failed );
			},
			on_error: function( $me, $error_fields) {
				$.each(
					$error_fields,
					function( key, obj ) {
						obj.parent().addClass( 'has-error' );
					}
				);
				$save_button.disable_button( {disable:false, icon: btn_icon} );
			},
			on_done: function( $me, $data) {
				$save_button.disable_button( {disable:false, icon: btn_icon} );
			}
		}
	);
}

var remove_schedule = function( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	var operation  = $this_button.attr( "operation" );
	var wlm_action = "";

	if ( operation == "remove_scheduler" ) {
		wlm_action = "set_content_schedule";
	}
	if ( operation == "remove_archiver" ) {
		wlm_action = "set_content_archive";
	}
	if ( operation == "remove_manager" ) {
		wlm_action = "set_content_manager";
	}

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : wlm_action,
		sched_action : "remove",
		contentids : $( this ).attr( "postid" ),
		wlm_levels : [$( this ).attr( "levelid" )],
		schedid : $( this ).attr( "schedid" ),
		content_action : $( this ).attr( "action" )
	};

	var x = $( this ).save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.closest( "tr" ).addClass( "text-muted" );
				$this_button.disable_button( {disable:true} );
			},
			on_success: function( $me, $result) {
				if ( $result.success && $result.data ) {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
					$holder = $this_button.closest( "tbody" );
					$this_button.closest( "tr" ).fadeOut(
						500,
						function(){
							$( this ).remove();
							if ( $holder.find( 'tr' ).length <= 0 ) {
								$holder.parent().closest( "tr" ).remove();
							} else {
								var lvls = [];
								$holder.find( 'tr .wlm-level-name' ).each(
									function() {
										lvls.push( $( this ).html() );
									}
								);
								$holder.parent().find( ".thelevels" ).html( lvls.join( "," ) );
							}
						}
					);
				} else {
					$this_button.closest( "tr" ).removeClass( "text-muted" );
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				alert( WLM3VARS.request_failed );
				$this_button.disable_button( {disable:false, class:""} );
				$this_button.closest( "tr" ).removeClass( "text-muted" );
			},
			on_error: function( $me, $error_fields) {
				alert( WLM3VARS.request_failed );
				$this_button.disable_button( {disable:false, class:""} );
				$this_button.closest( "tr" ).removeClass( "text-muted" );
			}
		}
	);
}
