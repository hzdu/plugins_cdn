var add_level_modal, cancel_level_modal, move_level_modal, delete_level_modal;
jQuery(
	function($){
		add_level_modal            = new wlm3_modal(
			'#add-level-modal',
			{
				after_open: function() {
					var modalid = this.id;
					$( '#' + modalid + ' .wlm-levels-notification' ).val( 'sendlevel' ).trigger( 'change.select2' );
					$( '#' + modalid + ' .wlm-levels-emailconfirmation' ).each(
						function() {
							$( this ).val( $( this ).data( 'lastvalue' ) ).trigger( 'change.select2' );
						}
					);
				},
				save_handler: schedule_user_level
			}
		);
		move_level_modal           = new wlm3_modal( '#move-level-modal', schedule_user_level );
		cancel_level_modal         = new wlm3_modal( '#cancel-level-modal', schedule_user_level );
		uncancel_level_modal       = new wlm3_modal( '#uncancel-level-modal', schedule_user_level );
		delete_level_modal         = new wlm3_modal( '#delete-level-modal', schedule_user_level );
		confirm_level_modal        = new wlm3_modal( '#confirm-level-modal', schedule_user_level );
		unconfirm_level_modal      = new wlm3_modal( '#unconfirm-level-modal', schedule_user_level );
		approve_level_modal        = new wlm3_modal( '#approve-level-modal', schedule_user_level );
		unapprove_level_modal      = new wlm3_modal( '#unapprove-level-modal', schedule_user_level );
		ppost_modal                = new wlm3_modal( '#ppost-modal', schedule_user_level );
		unschedule_level_modal     = new wlm3_modal( '#unschedule-level-modal', schedule_user_level );
		unschedule_all_level_modal = new wlm3_modal( '#unschedule-all-level-modal', schedule_user_level );
		sequential_modal           = new wlm3_modal( '#sequential-modal', schedule_user_level );
		subscribe_modal            = new wlm3_modal( '#subscribe-modal', schedule_user_level );

		add_user_modal    = new wlm3_modal( '#add-user-modal', add_user );
		edit_user_modal   = new wlm3_modal( '#edit-user-modal', update_user );
		delete_user_modal = new wlm3_modal( '#delete-modal', delete_user );

		advancesearch_modal = new wlm3_modal( '#advance-search-modal', do_advance_search );

		generic_confirmation_modal = new wlm3_modal( '#generic_confirmation_modal', generic_confirmation_modal );

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
					format: WLM3VARS.js_datetime_format
				}
			}
		);
		$( '.wlm-datetimepicker' ).on(
			'apply.daterangepicker',
			function(ev, picker) {
				$( this ).val( picker.startDate.format( WLM3VARS.js_datetime_format ) );
			}
		);

		$( '.wlm-datepicker' ).daterangepicker(
			{
				singleDatePicker: true,
				timePicker: false,
				showCustomRangeLabel: false,
				startDate: moment(),
				buttonClasses: "btn -default",
				applyClass: "-success",
				cancelClass: "-bare",
				autoApply: false,
				autoUpdateInput: false,
				locale: {
					format: WLM3VARS.js_date_format
				}
			}
		);

		$( '.wlm-datepicker' ).on(
			'apply.daterangepicker',
			function(ev, picker) {
				$( this ).val( picker.startDate.format( WLM3VARS.js_date_format ) );
			}
		);

		$( '.wlm-datepicker-nopast' ).daterangepicker(
			{
				singleDatePicker: true,
				timePicker: false,
				showCustomRangeLabel: false,
				startDate: moment(),
				minDate: moment(),
				buttonClasses: "btn -default",
				applyClass: "-success",
				cancelClass: "-bare",
				autoApply: false,
				autoUpdateInput: false,
				locale: {
					format: WLM3VARS.js_date_format
				}
			}
		);

		$( '.wlm-datepicker-nopast' ).on(
			'apply.daterangepicker',
			function(ev, picker) {
				$( this ).val( picker.startDate.format( WLM3VARS.js_date_format ) );
			}
		);

		$( '.level-collapse' ).click(
			function() {
				var target = $( this ).data( 'target' );
				$( target ).toggleClass( 'd-none' );
			}
		);

		$( '.chk-all' ).click( function(){ $( '.chk-userid' ).prop( "checked",$( '.chk-all' ).is( ":checked" ) )} );
		$( '.add-level-btn' ).click( show_add_level_modal );
		$( '.move-level-btn' ).click( show_move_level_modal );
		$( '.cancel-level-btn' ).click( show_cancel_level_modal );
		$( '.uncancel-level-btn' ).click( show_uncancel_level_modal );
		$( '.delete-level-btn' ).click( show_delete_level_modal );
		$( '.unschedule-level-btn' ).click( show_unschedule_level_modal );
		$( '.toggle-wlm-unsubscribe' ).click( toggle_wlm_unsubscribe_sequential );
		$( '.toggle-wlm-sequential' ).click( toggle_wlm_unsubscribe_sequential );

		$( '.toggle-collapse-table' ).click( toggle_collapse_table );

		$( '.add-user-btn' ).click( show_add_user_modal );
		$( '.edit-user-btn' ).click( show_edit_user_modal );
		// $('.delete-user-btn').click(confirm_delete_user);

		$( ".move-level-button" ).do_confirm( {yes_classes : '-success'} ).on( "yes.do_confirm", schedule_user_level );
		$( ".delete-user-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Delete this Member?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Delete', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", confirm_delete_user );
		$( ".edituser-delete-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Delete this Member?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Delete', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", confirm_delete_user );

		$( '.generate-password' ).click( auto_generate_password );

		$( '.search-btn' ).click( function(){ $( '#search-form' ).submit(); } );
		$( '.advancesearch-btn' ).click( show_advancesearch_modal );
		$( '#filter_dates' ).change( show_hide_daterange );
		$( '#save_search' ).click( show_hide_searchname );
		// $('.remove-savedsearch-btn').click(remove_savedsearch);
		$( ".remove-savedsearch-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Delete this Saved Search?', 'wishlist-member' ), yes_button : 'Delete', placement: 'right'} ).on( "yes.do_confirm", remove_savedsearch );

		$( '.level-actions' ).change( level_action_changed );

		$( '.wlm-levels-from' ).change( level_from_changed );

		$( '.advanced-search-tab' ).click( advanced_search_tab_click );

		$( '.clear-search-fields' ).click( clear_search_fields );

		$( ".wlm-payperposts" ).select2(
			{
				ajax: {
					url: WLM3VARS.ajaxurl,
					dataType: 'json', delay: 500, type: 'POST',
					data: function (params) {
						return {
							search:  params.term || "", page: params.page || 0, page_limit: 16,
							action: 'admin_actions', WishListMemberAction : 'payperpost_search',
						};
					},
					processResults: function (data) {
						var arr  = []
						$.each(
							data.posts,
							function (index, value) {
								arr.push( { id: value.ID, text: value.post_title } )
							}
						)
						var more = ( data.page * data.page_limit ) < data.total;
						return {results: arr, pagination: {more: more}};
					}, cache: true
				},
				minimumInputLength: 1, placeholder: wp.i18n.__( 'Search for Pay Per Post Content', 'wishlist-member' ),theme:"bootstrap",
			}
		);

		$( '.password-field' ).on( 'input', check_password_strength );

		// for pay per post
		$( "#" + edit_user_modal.data.id ).find( ".edit-user-nav-link" ).on(
			'click',
			function(){
				if ( $( this ).hasClass( 'for-pay-per-posts' ) ) {
					$( ".ppp-add-form" ).show();
					$( this ).closest( ".modal-body" ).find( "#pay-per-posts .pp-nav-link" ).first().trigger( "click" );
				}
			}
		);
	}
);

var update_collapse_levels = function(uid, levels) {
	$( '.level-details-tr-' + uid + ' .thelevels' ).html( '' );
	$.each(
		levels,
		function() {
			var statuses = [];
			var html     = $( collapsed_levels_markup );
			html.find( '.level-name' ).html( this.Name );

			if ( ! ! + this.Cancelled) {
				statuses.push( '-cancelled' );
			}
			if ( ! ! + this.Expired) {
				statuses.push( '-expired' );
			}
			if ( ! ! + this.Pending) {
				statuses.push( '-pending' );
			}
			if ( ! ! + this.UnConfirmed) {
				statuses.push( '-unconfirmed' );
			}
			if ( ! ! + this.Scheduled) {
				statuses.push( '-scheduled' );
			}
			if ( ! statuses.length) {
				statuses.push( '-active' );
			}

			html.addClass( statuses.join( ' ' ) );
			$( '.level-details-tr-' + uid + ' .thelevels' ).append( html );
		}
	);
}

var reset_calendar = function() {
	if ( $( '.wlm-datepicker' ).data( 'daterangepicker' ) ) {
		$( '.wlm-datepicker' ).each(
			function() {
				$( this ).data( 'daterangepicker' ).setStartDate( moment() );
				$( this ).data( 'daterangepicker' ).setEndDate( moment() );
			}
		);
	}
}

var show_add_level_modal      = function( e ) {
	e.preventDefault();
	$me = $( this );

	$name  = $( ".user-details-tr-" + $me.attr( "data-userid" ) ).find( ".wlm-user-display-name" ).html();
	$email = $( ".user-details-tr-" + $me.attr( "data-userid" ) ).find( ".wlm-user-email" ).html();
	$( "#" + add_level_modal.data.id ).find( ".modal-title" ).html(
		wp.i18n.sprintf(
			// Translators: 1 - User's name, 2 - User's email address.
			wp.i18n.__( 'Add: %1$s (%2$s)', 'wishlist-member' ),
			$name,
			$email
		)
	);

	add_level_modal.open();
	var select = $( "#" + add_level_modal.data.id ).find( ".wlm-levels" );
	$( "#" + add_level_modal.data.id ).find( "input[name='userids']" ).val( $me.attr( "data-userid" ) );
	select.trigger( 'change.select2' );
	$( "#" + add_level_modal.data.id ).find( "input[name='registration_date']" ).val( "" );

	// get the current level of user
	var current_levels = [];
	if ( $me.parent().parent().parent().find( ".wlm-user-level-details" ).length ) {
		$me.parent().parent().parent().find( ".wlm-user-level-details" ).each(
			function() {
				current_levels.push( $( this ).attr( "data-levelid" ) );
			}
		);
	}
	// disable the current level of user
	select.find( "option" ).each(
		function() {
			if ( $.inArray( $( this ).attr( "value" ), current_levels ) >= 0 ) {
				  $( this ).attr( 'disabled', 'disabled' );
			} else {
				$( this ).removeAttr( 'disabled' );
			}
		}
	);
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	select.select2( {theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Level', 'wishlist-member' )} );
	$( "#" + add_level_modal.data.id ).find( ".wlm-levels-select" ).val( "" ).trigger( 'change.select2' );
	reset_calendar();
}
var show_move_level_modal     = function( e ) {
	e.preventDefault();
	$me = $( this );

	$name  = $( ".user-details-tr-" + $me.attr( "data-userid" ) ).find( ".wlm-user-display-name" ).html();
	$email = $( ".user-details-tr-" + $me.attr( "data-userid" ) ).find( ".wlm-user-email" ).html();
	$( "#" + move_level_modal.data.id ).find( ".modal-title" ).html(
		wp.i18n.sprintf(
			// Translators: 1 - User's name, 2 - User's email address.
			wp.i18n.__( 'Move: %1$s (%2$s)', 'wishlist-member' ),
			$name,
			$email
		)
	);

	$( "#" + move_level_modal.data.id ).find( ".membership-level-select" ).hide();
	$( "#" + move_level_modal.data.id ).find( ".membership-level-display" ).show();
	$( "#" + move_level_modal.data.id ).find( ".membership-level-display .level-name-holder" ).html( $me.attr( "data-lvlname" ) );

	move_level_modal.open();
	var select = $( "#" + move_level_modal.data.id ).find( ".wlm-levels" );
	$( "#" + move_level_modal.data.id ).find( "input[name='userids']" ).val( $( this ).attr( "data-userid" ) );
	$( "#" + move_level_modal.data.id ).find( "[name='wlm_levels']" ).val( "" ).trigger( 'change.select2' );
	$( "#" + move_level_modal.data.id ).find( "input[name='schedule_date']" ).val( "" );
	$( "#" + move_level_modal.data.id ).find( ".has-error" ).removeClass( "has-error" );

	// get the current level of user
	var current_levels = [];
	if ( $me.parent().parent().parent().parent().find( ".wlm-user-level-details" ).length ) {
		$me.parent().parent().parent().parent().find( ".wlm-user-level-details" ).each(
			function() {
				current_levels.push( $( this ).attr( "data-levelid" ) );
			}
		);
	}

	// enable the current level of user
	$( "#" + move_level_modal.data.id ).find( "[name='wlm_level_from']" ).find( "option" ).each(
		function() {
			if ( $.inArray( $( this ).attr( "value" ), current_levels ) < 0 ) {
				  $( this ).attr( 'disabled', 'disabled' );
			} else {
				$( this ).removeAttr( 'disabled' );
			}
		}
	);

	// enable the current level of user
	$( "#" + move_level_modal.data.id ).find( ".wlm-levels-to" ).find( "option" ).each(
		function() {
			if ( $.inArray( $( this ).attr( "value" ), current_levels ) >= 0 ) {
				  $( this ).attr( 'disabled', 'disabled' );
			} else {
				$( this ).removeAttr( 'disabled' );
			}
		}
	);

	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	if ( ! select.data( 'select2' ) ) {
		select.select2( {theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Level', 'wishlist-member' )} );
	}
	$( "#" + move_level_modal.data.id ).find( "[name='wlm_level_from']" ).val( $me.attr( "data-levelid" ) ).trigger( 'change.select2' );
	$( "#" + move_level_modal.data.id ).find( ".wlm-levels-to" ).val( "" ).trigger( 'change.select2' );

	reset_calendar();
}
var show_cancel_level_modal   = function( e ) {
	e.preventDefault();
	$me = $( this );

	$name  = $( ".user-details-tr-" + $me.attr( "data-userid" ) ).find( ".wlm-user-display-name" ).html();
	$email = $( ".user-details-tr-" + $me.attr( "data-userid" ) ).find( ".wlm-user-email" ).html();
	$( "#" + cancel_level_modal.data.id ).find( ".modal-title" ).html(
		wp.i18n.sprintf(
			// Translators: 1 - User's name, 2 - User's email address.
			wp.i18n.__( 'Cancel: %1$s (%2$s)', 'wishlist-member' ),
			$name,
			$email
		)
	);

	$( "#" + cancel_level_modal.data.id ).find( ".membership-level-select" ).hide();
	$( "#" + cancel_level_modal.data.id ).find( ".membership-level-display" ).show();
	$( "#" + cancel_level_modal.data.id ).find( ".membership-level-display .level-name-holder" ).html( $me.attr( "data-lvlname" ) );

	cancel_level_modal.open();
	var select       = $( "#" + cancel_level_modal.data.id ).find( ".wlm-levels-select" );
	var select_notif = $( "#" + cancel_level_modal.data.id ).find( ".wlm-levels-notification" );
	$( "#" + cancel_level_modal.data.id ).find( "input[name='userids']" ).val( $( this ).attr( "data-userid" ) );
	$( "#" + cancel_level_modal.data.id ).find( "input[name='schedule_date']" ).val( "" );

	// get the current level of user
	var current_levels = [];
	if ( $me.parent().parent().parent().parent().find( ".wlm-user-level-details" ).length ) {
		$me.parent().parent().parent().parent().find( ".wlm-user-level-details" ).each(
			function() {
				current_levels.push( $( this ).attr( "data-levelid" ) );
			}
		);
	}
	// disable the current level of user
	select.find( "option" ).each(
		function() {
			if ( $.inArray( $( this ).attr( "value" ), current_levels ) < 0 ) {
				  $( this ).attr( 'disabled', 'disabled' );
			} else {
				$( this ).removeAttr( 'disabled' );
			}
		}
	);
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	if ( ! select.data( 'select2' ) ) {
		select.select2( {theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Level', 'wishlist-member' )} );
	}
	$( "#" + cancel_level_modal.data.id ).find( ".wlm-levels" ).val( $( this ).attr( "data-levelid" ) ).trigger( 'change.select2' );

	if ( select_notif.data( 'select2' ) ) {
		select_notif.select2( 'destroy' );
	}
	if ( ! select_notif.data( 'select2' ) ) {
		select_notif.select2( {theme:"bootstrap"} );
	}
	select_notif.val( "sendlevel" ).trigger( 'change.select2' );
	reset_calendar();
}
var show_uncancel_level_modal = function( e ) {
	e.preventDefault();
	$me = $( this );

	$name  = $( ".user-details-tr-" + $me.attr( "data-userid" ) ).find( ".wlm-user-display-name" ).html();
	$email = $( ".user-details-tr-" + $me.attr( "data-userid" ) ).find( ".wlm-user-email" ).html();
	$( "#" + uncancel_level_modal.data.id ).find( ".modal-title" ).html(
		wp.i18n.sprintf(
			// Translators: 1 - User's name, 2 - User's email address.
			wp.i18n.__( 'Uncancel: %1$s (%2$s)', 'wishlist-member' ),
			$name,
			$email
		)
	);

	$( "#" + uncancel_level_modal.data.id ).find( ".membership-level-select" ).hide();
	$( "#" + uncancel_level_modal.data.id ).find( ".membership-level-display" ).show();
	$( "#" + uncancel_level_modal.data.id ).find( ".membership-level-display .level-name-holder" ).html( $me.attr( "data-lvlname" ) );

	uncancel_level_modal.open();
	var select       = $( "#" + uncancel_level_modal.data.id ).find( ".wlm-levels-select" );
	var select_notif = $( "#" + uncancel_level_modal.data.id ).find( ".wlm-levels-notification" );
	$( "#" + uncancel_level_modal.data.id ).find( "input[name='userids']" ).val( $( this ).attr( "data-userid" ) );

	// get the current level of user
	var current_levels = [];
	if ( $me.parent().parent().parent().parent().find( ".wlm-user-level-details" ).length ) {
		$me.parent().parent().parent().parent().find( ".wlm-user-level-details" ).each(
			function() {
				current_levels.push( $( this ).attr( "data-levelid" ) );
			}
		);
	}
	// disable the current level of user
	select.find( "option" ).each(
		function() {
			if ( $.inArray( $( this ).attr( "value" ), current_levels ) < 0 ) {
				  $( this ).attr( 'disabled', 'disabled' );
			} else {
				$( this ).removeAttr( 'disabled' );
			}
		}
	);
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	if ( ! select.data( 'select2' ) ) {
		select.select2( {theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Level', 'wishlist-member' )} );
	}
	select.val( $( this ).attr( "data-levelid" ) ).trigger( 'change.select2' );

	if ( select_notif.data( 'select2' ) ) {
		select_notif.select2( 'destroy' );
	}
	if ( ! select_notif.data( 'select2' ) ) {
		select_notif.select2( {theme:"bootstrap"} );
	}
	select_notif.val( "sendlevel" ).trigger( 'change.select2' );
	reset_calendar();
}

var show_delete_level_modal     = function( e ) {
	e.preventDefault();
	$me = $( this );

	$name  = $( ".user-details-tr-" + $me.attr( "data-userid" ) ).find( ".wlm-user-display-name" ).html();
	$email = $( ".user-details-tr-" + $me.attr( "data-userid" ) ).find( ".wlm-user-email" ).html();
	$( "#" + delete_level_modal.data.id ).find( ".modal-title" ).html(
		wp.i18n.sprintf(
			// Translators: 1 - User's name, 2 - User's email address.
			wp.i18n.__( 'Remove: %1$s (%2$s)', 'wishlist-member' ),
			$name,
			$email
		)
	);

	$( "#" + delete_level_modal.data.id ).find( ".membership-level-select" ).hide();
	$( "#" + delete_level_modal.data.id ).find( ".membership-level-display" ).show();
	$( "#" + delete_level_modal.data.id ).find( ".membership-level-display .level-name-holder" ).html( $me.attr( "data-lvlname" ) );

	delete_level_modal.open();
	var select = $( "#" + delete_level_modal.data.id ).find( ".wlm-levels" );
	$( "#" + delete_level_modal.data.id ).find( "input[name='userids']" ).val( $( this ).attr( "data-userid" ) );
	$( "#" + delete_level_modal.data.id ).find( "input[name='schedule_date']" ).val( "" );

	// get the current level of user
	var current_levels = [];
	if ( $me.parent().parent().parent().parent().find( ".wlm-user-level-details" ).length ) {
		$me.parent().parent().parent().parent().find( ".wlm-user-level-details" ).each(
			function() {
				current_levels.push( $( this ).attr( "data-levelid" ) );
			}
		);
	}
	// disable the current level of user
	select.find( "option" ).each(
		function() {
			if ( $.inArray( $( this ).attr( "value" ), current_levels ) < 0 ) {
				  $( this ).attr( 'disabled', 'disabled' );
			} else {
				$( this ).removeAttr( 'disabled' );
			}
		}
	);
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	if ( ! select.data( 'select2' ) ) {
		select.select2( {theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Level', 'wishlist-member' )} );
	}
	$( "#" + delete_level_modal.data.id ).find( ".wlm-levels" ).val( $( this ).attr( "data-levelid" ) ).trigger( 'change.select2' );
	reset_calendar();
}
var show_unschedule_level_modal = function( e ) {
	e.preventDefault();
	var schedule_type = $( this ).attr( "data-schedule-type" )
	var level         = $( this ).attr( "data-level-id" );
	var userid        = $( this ).attr( "data-userid" );
	var level_name    = $( this ).closest( 'tr' ).find( ".wlm-level-name" ).html();
	var level_action  = "unschedule_user_level";
	var modal_title   = wp.i18n.__( 'Remove from Schedule', 'wishlist-member' );

	var type = '';
	switch (schedule_type) {
		case 'remove': type = wp.i18n.__( 'Removal', 'wishlist-member' ); break;
		case 'add': type = wp.i18n.__( 'Add', 'wishlist-member' ); break;
		case 'move': type = wp.i18n.__( 'Move', 'wishlist-member' ); break;
		case 'cancel': type = wp.i18n.__( 'Cancellation', 'wishlist-member' ); break;
	}
	var unschedule_message = wp.i18n.sprintf(
		// Translators: 1 - Scheduled type, 2 - Membership level name.
		wp.i18n.__( 'Are you sure you want to Unschedule the scheduled %1$s for the membership level "%2$s"?', 'wishlist-member' ),
		type,
		$.trim( level_name )
	);
	if ( schedule_type == "approve" ) {
		level_action       = "approve_user_level";
		unschedule_message = wp.i18n.__( 'Are you sure you want to Approve the member registration to ', 'wishlist-member' ) + '"' + $.trim( level_name ) + '"';
		var modal_title    = wp.i18n.__( 'Approve Registration to Level', 'wishlist-member' );
	}

	unschedule_level_modal.open();
	$( "#" + unschedule_level_modal.data.id ).find( ".modal-title" ).html( modal_title );
	$( "#" + unschedule_level_modal.data.id ).find( "input[name='level_action']" ).val( level_action );
	$( "#" + unschedule_level_modal.data.id ).find( "input[name='wlm_levels']" ).val( level );
	$( "#" + unschedule_level_modal.data.id ).find( "input[name='schedule_type']" ).val( schedule_type );
	$( "#" + unschedule_level_modal.data.id ).find( "input[name='userids']" ).val( userid );
	$( "#" + unschedule_level_modal.data.id ).find( ".unschedule-message" ).html( unschedule_message );
}

var confirm_delete_user = function( e ) {
	e.preventDefault();

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "delete_user",
		userids : $( this ).attr( "data-userid" ),
	};
	$( '.modal' ).modal( 'hide' );

	var $this_button = $( this );
	var x            = $this_button.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true, class : 'btn-danger'} );
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					if ( Object.keys( $result.data ).length > 1 ) {
						$( this ).reload_screen();
						// window.parent.location.reload(true);
					} else {
						$.each(
							$result.data,
							function( userid, status ) {
								if ( status ) {
									$( ".user-details-tr-" + userid ).fadeOut( 500, function(){ $( this ).remove();} );
									$( ".level-details-tr-" + userid ).fadeOut( 500, function(){ $( this ).remove();} );
								}
							}
						);
						$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
					}
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
			},
			on_error: function( $me, $error_fields) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, class : 'btn-danger' } );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false, class : 'btn-danger'} );
			}
		}
	);
}

var show_advancesearch_modal = function( e ) {
	e.preventDefault();
	advancesearch_modal.open();
	var select = $( "#" + advancesearch_modal.data.id ).find( ".wlm-levels" );
	// if ( !select.data('select2') ) select.select2({theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Level', 'wishlist-member' )});
	if ( ! select.data( 'select2' ) ) {
		select.select2( {theme:"bootstrap"} );
	}
	$( "#" + advancesearch_modal.data.id ).find( "#save_searchname" ).parent().removeClass( 'has-error' );
}

var show_hide_daterange = function() {
	if ( $( this ).val() != "" ) {
		$( this ).closest( ".row" ).find( ".date-ranger" ).show();
	} else {
		$( this ).closest( ".row" ).find( ".date-ranger" ).hide();
	}
}

var show_hide_searchname = function( e ) {
	e.preventDefault();
	if ( $( this ).is( ':checked' ) ) {
		$( this ).closest( ".row" ).find( "#save_searchname" ).css( "visibility", "visible" );
	} else {
		$( this ).closest( ".row" ).find( "#save_searchname" ).css( "visibility", "hidden" );
	}
}

var do_advance_search = function() {
	var dosearch = true;
	if ( $( "#" + advancesearch_modal.data.id ).find( "input[name='save_search']" ).is( ":checked" ) ) {
		var search_name = $( "#" + advancesearch_modal.data.id ).find( "#save_searchname" ).val();
		search_name     = $.trim( search_name );
		if ( ! search_name || search_name == "" ) {
			$( "#" + advancesearch_modal.data.id ).find( "#save_searchname" ).parent().addClass( 'has-error' );
			$( ".wlm-message-holder" ).show_message( {message: wp.i18n.__( 'Name of Saved Search is empty', 'wishlist-member' ), type: 'danger' } );
			dosearch = false;
		}

		if ( dosearch == true ) {
			$( "#" + advancesearch_modal.data.id ).find( ".save-search-list-name" ).each(
				function() {
					if ( $.trim( $( this ).html() ) == search_name ) {
						  $( "#" + advancesearch_modal.data.id ).find( "#save_searchname" ).parent().addClass( 'has-error' );
						  $( ".wlm-message-holder" ).show_message( {message: wp.i18n.__( 'Name of Saved Search already exists', 'wishlist-member' ), type: 'danger' } );
						  dosearch = false;
						  return false;
					}
				}
			);
		}
	}
	if ( dosearch ) {
		$( "#" + advancesearch_modal.data.id ).find( "#advance-search-form" ).submit();
	}
}

var remove_savedsearch = function( e ) {
	e.preventDefault();
	var search_name  = $( this ).attr( "data-search-name" );
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	var parent       = $this_button.parent();
	var modal_id     = $this_button.closest( ".modal" ).prop( "id" );
	var $save_button = $( "#" + modal_id ).find( ".save-button" );

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "remove_savedsearch",
		name : search_name,
	};
	var x             = parent.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true} );
				$save_button.disable_button( {disable:true} );
				// prevent modal from closing until operation is done
				$( "#" + modal_id ).on(
					'hide.bs.modal',
					function(e) {
						if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
							e.preventDefault();
						}
					}
				);
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
					$holder = $( "#" + modal_id ).find( ".saved-search-holder" );
					$this_button.closest( "tr" ).fadeOut(
						500,
						function(){
							$( this ).remove();
							if ( $holder.find( 'tr' ).length <= 0 ) {
								var $markup = '<tr class="tr-none"><td class="text-center" colspan="2">You have no saved searches</td></tr>';
								var $el     = $( $markup );
								$holder.append( $el );
							}
						}
					);
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, class:""} );
				$save_button.disable_button( {disable:false} );
			},
			on_error: function( $me, $error_fields) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, class:""} );
				$save_button.disable_button( {disable:false} );
			},
			on_done: function( $me, $data) {
				$save_button.disable_button( {disable:false} );
				$this_button.disable_button( {disable:false, class:""} );
				$( "#" + modal_id ).unbind( "hide.bs.modal" );
			}
		}
	);
}

var check_password_strength = function () {
	var pass1           = pass2 = $( this ).val();
	var $strengthResult = $( this ).next();
	$strengthResult.removeClass( '-error -warning -info -success' );
	var strength = 1;

	if ( pass1.length <= 0 ) {
		$strengthResult.hide();
		return;
	} else {
		$strengthResult.show();
	}

	if ( /[a-z]/g.exec( pass1 ) == null ) {
		strength = 0;
	}
	if ( /[A-Z]/g.exec( pass1 ) == null ) {
		strength = 0;
	}
	if ( /[0-9]/g.exec( pass1 ) == null ) {
		strength = 0;
	}
	if ( /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\=|\+|\[|\{|\]|\}|\||\;|\:|\"|\,|\<|\.|\>|\'|\?/g.exec( pass1 ) == null ) {
		strength = 0;
	}

	// Add the strength meter results
	switch ( strength ) {
		case 1:
			$strengthResult.addClass( '-success' ).html( wp.i18n.__( 'Strong', 'wishlist-member' ) );
			break;
		default:
			$strengthResult.addClass( '-error' ).html( wp.i18n.__( 'Weak', 'wishlist-member' ) );
	}
}

var add_to_blacklist = function( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	var $save   = false;
	var $action = $( this ).find( "input[name='add_blacklist']" ).length ? "add" : "remove";
	var $title  = "";

	if ( $( this ).hasClass( "blacklist-ip" ) ) {
		$title = $action == "add" ? wp.i18n.__( 'Remove from Blacklist', 'wishlist-member' ) : wp.i18n.__( 'Add to Blacklist', 'wishlist-member' );
	} else {
		$email = $( this ).parent().find( ".email_address" ).html();
		$title = $action == "add" ? wp.i18n.__( 'Remove from Blacklist', 'wishlist-member' ) : wp.i18n.__( 'Add to Blacklist', 'wishlist-member' );
	}

	$( '<input>', { type: 'hidden', name: 'action',value: 'admin_actions'} ).appendTo( $( this ) );
	$( '<input>', { type: 'hidden', name: 'WishListMemberAction' ,value: 'add_remove_blacklist'} ).appendTo( $( this ) );
	var x = $this_button.save_settings(
		{
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true, icon:"update", class : "-bare"} );
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					if ( $action == "add" ) {
						$this_button.find( "input[name='add_blacklist']" ).remove();
					} else {
						$( '<input>', { type: 'hidden', name: 'add_blacklist',value: '1'} ).appendTo( $this_button );
					}
					$action = $action == "add" ? "remove_circle_outline" : "add_circle_outline";
					$this_button.find( ".wlm-icons" ).html( "check" );
					$this_button.find( "small" ).html( $title );
					$this_button.addClass( "text-success" );
					$this_button.find( ".wlm-icons" ).fadeOut(
						1000,
						function(){
							$this_button.find( ".wlm-icons" ).show();
							$this_button.find( ".wlm-icons" ).html( $action );
							$this_button.removeClass( "text-success" );
						}
					);
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				} else {
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				$action = $action == "add" ? "add_circle_outline" : "remove_circle_outline";
				$this_button.disable_button( {disable:false, icon:$action, class : "-bare"} );
			},
			on_error: function( $me, $error_fields) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
				$action = $action == "add" ? "add_circle_outline" : "remove_circle_outline";
				$this_button.disable_button( {disable:false, icon:$action, class : "-bare"} );
			},
			on_done: function( $me, $data) {
				$this_button.find( "input[name='action']" ).remove();
				$this_button.find( "input[name='WishListMemberAction']" ).remove();
				$this_button.disable_button( {disable:false, class : "-bare"} );
			}
		}
	);
}

var reset_limit_counter = function ( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "reset_limit_counter",
		user_id : $this_button.attr( "user-id" ),
	};

	var x = $this_button.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true, icon:"update", class : "-bare"} );
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					$this_button.closest( '.row' ).addClass( "d-none" ).hide();
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				} else {
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, icon: 'refresh', class : "-bare"} );
			},
			on_error: function( $me, $error_fields) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, icon: 'refresh', class : "-bare"} );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false, class : "-bare"} );
			}
		}
	);
}

var level_from_changed = function() {
	var cur_level = $( this ).val();
	var select    = $( '.wlm-levels-to' );
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	select.select2( {theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Level', 'wishlist-member' )} );

	// disable the current level of user
	select.find( "option" ).each(
		function() {
			if ( $( this ).attr( "value" ) == cur_level ) {
				  $( this ).attr( 'disabled', 'disabled' );
			} else {
				$( this ).removeAttr( 'disabled' );
			}
		}
	);
	select.trigger( 'change.select2' );
}

var level_action_changed = function(){
	reset_calendar();
	var operation = $( this ).val();
	var ids       = []
	$( ".chk-userid:checked" ).each(
		function() {
			ids.push( $( this ).val() );
		}
	);
	if ( ids.length <= 0 ) {
		$( this ).val( "" ).trigger( 'change.select2' );
		$( ".wlm-message-holder" ).show_message( {message:wp.i18n.__( 'No user selected.', 'wishlist-member' ), type: "danger" } );
		return;
	}
	$( this ).val( "" ).trigger( 'change.select2' );
	var modal_id = "";
	switch ( operation ) {
		case "add":
			modal_id = add_level_modal.data.id;
			$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Add Member to Level', 'wishlist-member' ) );
			add_level_modal.open();
			break;
		case "move":
			modal_id = move_level_modal.data.id;
			$( "#" + modal_id ).find( ".membership-level-select" ).show();
			$( "#" + modal_id ).find( ".membership-level-display" ).hide();
			$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Move Member to Level', 'wishlist-member' ) );
			move_level_modal.open();
			break;
		case "cancel":
			modal_id = cancel_level_modal.data.id;
			$( "#" + modal_id ).find( ".membership-level-select" ).show();
			$( "#" + modal_id ).find( ".membership-level-display" ).hide();
			$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Cancel Member from Level', 'wishlist-member' ) );
			cancel_level_modal.open();
			break;
		case "uncancel":
			modal_id = uncancel_level_modal.data.id;
			$( "#" + modal_id ).find( ".membership-level-select" ).show();
			$( "#" + modal_id ).find( ".membership-level-display" ).hide();
			$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Uncancel Member from Level', 'wishlist-member' ) );
			uncancel_level_modal.open();
			break;
		case "remove":
			modal_id = delete_level_modal.data.id;
			$( "#" + modal_id ).find( ".membership-level-select" ).show();
			$( "#" + modal_id ).find( ".membership-level-display" ).hide();
			$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Remove Member from Level', 'wishlist-member' ) );
			delete_level_modal.open();
			break;
		case "confirm":
			confirm_level_modal.open();
			modal_id = confirm_level_modal.data.id;
			break;
		case "unconfirm":
			unconfirm_level_modal.open();
			modal_id = unconfirm_level_modal.data.id;
			break;
		case "approve":
			approve_level_modal.open();
			modal_id = approve_level_modal.data.id;
			break;
		case "unapprove":
			unapprove_level_modal.open();
			modal_id = unapprove_level_modal.data.id;
			break;
		case "removepost":
			ppost_modal.open();
			modal_id = ppost_modal.data.id;
			$( "#" + modal_id ).find( "input[name='level_action']" ).val( "user_removepost" );
			$( "#" + modal_id ).find( ".save-button .wlm-icons" ).html( "remove_circle_outline" );
			$( "#" + modal_id ).find( ".save-button .wlm-icons" ).next().html( " Remove Pay Per Post" );
			break;
		case "addpost":
			ppost_modal.open();
			modal_id = ppost_modal.data.id;
			$( "#" + modal_id ).find( "input[name='level_action']" ).val( "user_addpost" );
			$( "#" + modal_id ).find( ".save-button .wlm-icons" ).html( "add_circle_outline" );
			$( "#" + modal_id ).find( ".save-button .wlm-icons" ).next().html( " Add Pay Per Post" );
			break;
		case "clear_scheduled":
			unschedule_all_level_modal.open();
			modal_id = unschedule_all_level_modal.data.id;
			break;
		case "onsequential":
			sequential_modal.open();
			modal_id = sequential_modal.data.id;
			$( "#" + modal_id ).find( ".message" ).html( wp.i18n.__( 'Are you sure you want to Turn On Sequential Upgrade for the selected members?', 'wishlist-member' ) );
			$( "#" + modal_id ).find( "input[name='on']" ).val( 1 );
			break;
		case "offsequential":
			sequential_modal.open();
			modal_id = sequential_modal.data.id;
			$( "#" + modal_id ).find( ".message" ).html( wp.i18n.__( 'Are you sure you want to Turn Off Sequential Upgrade for the selected members?', 'wishlist-member' ) );
			$( "#" + modal_id ).find( "input[name='on']" ).val( 0 );
			break;
		case "subscribe_email":
			subscribe_modal.open();
			modal_id = subscribe_modal.data.id;
			$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Subscribe to Email Broadcast', 'wishlist-member' ) );
			$( "#" + modal_id ).find( ".message" ).html( wp.i18n.__( 'Are you sure you want to Subscribe all selected members to Email Broadcast?', 'wishlist-member' ) );
			$( "#" + modal_id ).find( "input[name='subscribe']" ).val( 1 );
			break;
		case "unsubscribe_email":
			subscribe_modal.open();
			modal_id = subscribe_modal.data.id;
			$( "#" + modal_id ).find( ".modal-title" ).html( wp.i18n.__( 'Unsubscribe to Email Broadcast', 'wishlist-member' ) );
			$( "#" + modal_id ).find( ".message" ).html( wp.i18n.__( 'Are you sure you want to Unsubscribe all selected members to Email Broadcast?', 'wishlist-member' ) );
			$( "#" + modal_id ).find( "input[name='subscribe']" ).val( 0 );
			break;
		case "delete_member":
			delete_user_modal.open();
			modal_id = delete_user_modal.data.id;
			$( "#" + modal_id ).find( ".message" ).html( wp.i18n.__( 'Are you sure you want to delete the selected members?', 'wishlist-member' ) );
			break;

			// Resend Email Confirmation Request
		case 'resend_email_confirmation_request' :
			generic_confirmation_modal.open();
					modal_id = generic_confirmation_modal.data.id;
					$( '#' + modal_id + ' .modal-header .modal-title' ).html( wp.i18n.__( 'Resend Email Confirmation Request', 'wishlist-member' ) );
					$( '#' + modal_id + ' .message' ).html(
						'<p>' + wp.i18n.__( 'Are you sure you want to resend the Email Confirmation Request to the selected members?', 'wishlist-member' ) + '</p>' +
						'<p>' + wp.i18n.__( 'This only affects members that have not yet confirmed their email address.', 'wishlist-member' ) + '</p>'
					);
					$( '#' + modal_id + ' :input[name="WishListMemberAction"]' ).val( 'resend_email_confirmation_request' );
					break;

			// Resend Incomplete Registration Email
		case 'resend_incomplete_registration_email' :
			generic_confirmation_modal.open();
					modal_id = generic_confirmation_modal.data.id;
					$( '#' + modal_id + ' .modal-header .modal-title' ).html( wp.i18n.__( 'Resend Incomplete Registration Email', 'wishlist-member' ) );
					$( '#' + modal_id + ' .message' ).html(
						'<p>' + wp.i18n.__( 'Are you sure you want to resend the Incomplete Registration Email to the selected members?', 'wishlist-member' ) + '</p>' +
						'<p>' + wp.i18n.__( 'This only affects members that have incomplete registrations.', 'wishlist-member' ) + '</p>'
					);
					$( '#' + modal_id + ' :input[name="WishListMemberAction"]' ).val( 'resend_incomplete_registration_email' );
					break;

		default:
			$( ".wlm-message-holder" ).show_message( {message:wp.i18n.__( 'Invalid Action.', 'wishlist-member' ), type: "danger" } );
			return;
	}
	var plchldr = wp.i18n.__( 'Select Membership Level', 'wishlist-member' );
	plchldr    += operation == "add" ? "s" : "";
	$( "#" + modal_id ).find( "input[name='userids']" ).val( ids.join( ',' ) );
	var select = $( "#" + modal_id ).find( ".wlm-levels" );
	select.val( "" ).trigger( 'change.select2' );
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	select.select2( {theme:"bootstrap",placeholder: plchldr} );

	$( "#" + modal_id ).find( ".wlm-levels-notification" ).val( "sendlevel" ).trigger( 'change.select2' );

	select.find( "option" ).each(
		function() {
			$( this ).removeAttr( 'disabled' );
		}
	);

	$( "#" + modal_id ).find( ".has-error" ).removeClass( "has-error" );
	$( "#" + modal_id ).find( "input[name='registration_date']" ).val( "" );
	$( "#" + modal_id ).find( "input[name='schedule_date']" ).val( "" );
}

var generic_confirmation_modal = function() {
	var button = $( this );
	var modal  = button.closest( '.modal' );
	var body   = $( modal ).find( '.modal-body' ).first();
	body.save_settings(
		{
			on_init: function() {
				button.disable_button( { disable: true } );
			},
			on_done: function( $me, $data) {
				button.disable_button( { disable:false } );
					$( this ).reload_screen();
					$( '.wlm-message-holder' ).show_message( { message: wp.i18n.__( 'Email Confirmation Request Sent.', 'wishlist-member' ), type: 'success' } );
			}
		}
	);
}

var schedule_user_level = function() {
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
					if ( Object.keys( $result.data ).length > 1 ) {
						$( this ).reload_screen();
					} else {
						update_level_info( $result );
						$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
					}
					$( ".chk-all" ).prop( 'checked', false );
					$( ".chk-userid" ).prop( 'checked', false );
				} else {
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
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

var toggle_wlm_unsubscribe_sequential = function ( e ) {
	e.preventDefault();
	var $this_button = $( this );

	var dfield = $this_button.attr( "dfield" );
	var dicon  = $this_button.attr( "dicon" );
	// var fld_value = $this_button.find("input[name='" +dfield +"']").val();
	// fld_value = fld_value != "1" ? 1 : 0;
	// $this_button.find("input[name='" +dfield +"']").val(fld_value);

	var fld_value = $this_button.attr( "fieldval" );
	fld_value     = fld_value != "1" ? 1 : 0;
	$this_button.attr( "fieldval", fld_value );

	var userid            = $this_button.closest( ".user-details-tr" ).find( ".chk-userid" ).val();
	var settings_data     = {
		action : "admin_actions",
		WishListMemberAction : "save_user_meta",
		userid : userid,
	};
	settings_data[dfield] = fld_value

	$this_button.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true, icon:"update"} );
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					if (  $this_button.find( ".wlm-icons" ).parent().hasClass( "table-status" ) ) {
						$this_button.find( ".wlm-icons" ).parent().removeClass( "table-status" );
						if ( dfield == "sequential" ) {
							$this_button.find( ".wlm-icons" ).parent().attr( "title",wp.i18n.__( 'Sequential Upgrade (Active)', 'wishlist-member' ) );
						} else {
							$this_button.find( ".wlm-icons" ).parent().attr( "title",wp.i18n.__( 'Email Broadcast (Active)', 'wishlist-member' ) );
						}
					} else {
						$this_button.find( ".wlm-icons" ).parent().addClass( "table-status" );
						if ( dfield == "sequential" ) {
							$this_button.find( ".wlm-icons" ).parent().attr( "title",wp.i18n.__( 'Sequential Upgrade (Inactive)', 'wishlist-member' ) );
						} else {
							$this_button.find( ".wlm-icons" ).parent().attr( "title",wp.i18n.__( 'Email Broadcast (Inactive)', 'wishlist-member' ) );
						}
					}
				}
				$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
			},
			on_fail: function( $me, $data) {
				$this_button.disable_button( {disable:false, icon:dicon } );
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
			},
			on_error: function( $me, $error_fields) {
				$this_button.disable_button( {disable:false, icon:dicon } );
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false, icon:dicon } );
			}
		}
	);
}

var toggle_collapse_table = function( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	$this_button.save_settings(
		{
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true} );
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
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
			},
			on_error: function( $me, $error_fields) {
				$this_button.disable_button( {disable:false} );
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false} );
			}
		}
	);
}

var delete_user = function() {
	var modal_id     = $( this ).closest( ".modal" ).prop( "id" );
	var $body        = $( "#" + modal_id ).find( ".modal-body" );
	var $save_button = $( "#" + modal_id ).find( ".save-button" );
	var x            = $body.save_settings(
		{
			on_init: function( $me, $data) {
				$save_button.disable_button( {disable:true, icon:"update"} );
			},
			on_success: function( $me, $result) {
				$( "#" + modal_id ).modal( 'toggle' );
				// $(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
				if ( $result.success ) {
					if ( Object.keys( $result.data ).length > 1 ) {
						$( this ).reload_screen();
						// window.parent.location.reload(true);
					} else {
						$.each(
							$result.data,
							function( userid, status ) {
								if ( status ) {
									$( ".user-details-tr-" + userid ).fadeOut( 1000, function(){ $( this ).remove();} );
									$( ".level-details-tr-" + userid ).fadeOut( 1000, function(){ $( this ).remove();} );
								}
							}
						);
					}
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
			},
			on_error: function( $me, $error_fields) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
				$save_button.disable_button( {disable:false, text:wp.i18n.__( 'Yes', 'wishlist-member' ) } );
			},
			on_done: function( $me, $data) {
				$save_button.disable_button( {disable:false, text:wp.i18n.__( 'Yes', 'wishlist-member' ) } );
			}
		}
	);
}

var auto_generate_password = function ( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	var password_field = $this_button.closest( ".row" ).find( ".password-field" );
	var settings_data  = {
		action : "admin_actions",
		WishListMemberAction : "generate_password",
	};

	$this_button.disable_button( {disable:true, text:"Please wait..." , class: "-default"} );
	password_field.val( "" );
	password_field.attr( "placeholder", "Please wait..." );

	$.post(
		WLM3VARS.ajaxurl,
		settings_data,
		function( result ) {
			if ( result != 0 || result != "" ) {
				try {
					result_data = wlm.json_parse( result );
					if ( result_data.success ) {
						password_field.val( result_data.data )
						password_field.trigger( 'input' );
					} else {
						$( ".wlm-message-holder" ).show_message( {message:result_data.msg, type:'error', icon:'error'} );
					}
				} catch (e) {
					$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
				}
			}
			$this_button.disable_button( {disable:false, text:"Generate", class: "-default"} );
			password_field.attr( "placeholder", "" );
		}
	)
	.fail(
		function( jqXHR, textStatus ) {
			$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
			$this_button.disable_button( {disable:false, text:"Generate", class: "-default"} );
			password_field.attr( "placeholder", "" );
		}
	)
}

var show_password_field = function( e ) {
	e.preventDefault();
	var pass_container = $( this ).prev();
	pass_container.show();
	pass_container.find( ".password-field" ).trigger( 'input' );
	pass_container.find( ".password-field" ).prop( "name","user_pass" );
	pass_container.find( ".password-field" ).focus();
	$( this ).hide();
}

var hide_password_field = function( e ) {
	e.preventDefault();
	var pass_container = $( this ).closest( ".form-inline" );
	pass_container.find( ".password-field" ).val( "" );
	pass_container.find( ".password-field" ).trigger( 'input' );
	// remove name so that it wont be included
	pass_container.find( ".password-field" ).prop( "name","" );
	pass_container.hide();
	pass_container.next().show();
}

var show_add_user_modal = function( e ) {
	e.preventDefault();
	add_user_modal.open();
	var modal_id = add_user_modal.data.id;
	var $body    = $( "#" + modal_id ).find( ".modal-body" );
	var select   = $( "#" + modal_id ).find( ".wlm-levels-select" );
	if ( ! select.data( 'select2' ) ) {
		select.select2( {theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Level', 'wishlist-member' )} );
	}
	select.val( "" ).trigger( 'change.select2' );

	var select = $( "#" + modal_id ).find( ".wlm-levels-notification" );
	if ( ! select.data( 'select2' ) ) {
		select.select2( {theme:"bootstrap",placeholder: wp.i18n.__( 'Email Notification', 'wishlist-member' )} );
	}
	select.val( "sendlevel" ).trigger( 'change.select2' );

	$( "#" + add_user_modal.data.id ).find( '.wlm-levels-emailconfirmation' ).each(
		function() {
			$( this ).val( $( this ).data( 'lastvalue' ) ).trigger( 'change.select2' );
		}
	);

	// clear error fields
	$body.find( ':input' ).each(
		function () {
			$( this ).parent().removeClass( "has-error" );
		}
	);

	$( "#" + modal_id ).find( ".password-field" ).val( "" );
	$( "#" + modal_id ).find( ".password-field" ).next().hide();
}

var add_user = function() {
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	var modal_id     = $( this ).closest( ".modal" ).prop( "id" );
	var $body        = $( "#" + modal_id ).find( ".modal-body" );
	var $save_button = $( "#" + modal_id ).find( ".save-button" );
	var btn_icon     = "add_circle_outline";
	if ( $( "#" + modal_id ).find( ".save-button .wlm-icons" ) ) {
		btn_icon = $( "#" + modal_id ).find( ".save-button .wlm-icons" ).html();
	}
	var x = $body.save_settings(
		{
			on_init: function( $me, $data) {
				$save_button.disable_button( {disable:true, icon:"update"} );
				// prevent modal from closing until operation is done
				$( "#" + modal_id ).on(
					'hide.bs.modal',
					function(e) {
						if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
							e.preventDefault();
						}
					}
				);
			},
			on_success: function( $me, $result) {
				$save_button.disable_button( {disable:false, icon: btn_icon } );
				if ( $result.success ) {
					$( "#" + modal_id ).modal( 'toggle' );
					$( this ).reload_screen();
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				$save_button.disable_button( {disable:false, icon: btn_icon } );
			},
			on_error: function( $me, $error_fields) {
				$.each(
					$error_fields,
					function( key, obj ) {
						obj.parent().addClass( 'has-error' );
					}
				);
				$save_button.disable_button( {disable:false, icon: btn_icon } );
			},
			on_done: function( $me, $data) {
				$save_button.disable_button( {disable:false, icon: btn_icon } );
				$( "#" + modal_id ).unbind( "hide.bs.modal" );
			}
		}
	);
}

var show_edit_user_modal = function( e ) {
	e.preventDefault();
	var click_event = e;
	var btn_clicked = $( e.target );
	edit_user_modal.open();
	var modal_id     = edit_user_modal.data.id;
	var $body        = $( "#" + modal_id ).find( ".modal-body" );
	var $save_button = $( "#" + modal_id ).find( ".save-button" );

	var $uid = $( this ).attr( "data-userid" );
	if ( $uid == null ) {
		$uid = $( e.target ).attr( "data-userid" );
	}

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "update_user",
		operation : "get_form",
		member_edit_tabs : window.wlm_member_edit_tabs || [],
		userid : $uid,
	};

	$( "#" + modal_id ).find( ".modal-footer" ).hide();
	$( "#" + modal_id ).find( ".modal-title" ).html( "Loading member's data, please wait..." );
	$body.find( ".tab-content" ).html( "" );
	$body.find( ".nav-link-default" ).trigger( "click" );

	$.post(
		WLM3VARS.ajaxurl,
		settings_data,
		function( result ) {
			if ( result != 0 || result != "" ) {
				try {
					result_data = wlm.json_parse( result );
					if ( result_data.success ) {
						$( "#" + modal_id ).find( ".modal-title" ).html(
							wp.i18n.sprintf(
							// Translators: 1 - User's WP display name, 2 - User's email address.
								wp.i18n.__( 'Edit Member: %1$s (%2$s)', 'wishlist-member' ),
								result_data.data.display_name,
								result_data.data.user_email
							)
						);

						$body.find( ".tab-content" ).html( result_data.form );
						if ( result_data.current_user == result_data.data.ID ) {
							$( "#" + modal_id ).find( ".edituser-delete-btn" ).hide();
						} else {
							$( "#" + modal_id ).find( ".edituser-delete-btn" ).attr( "data-userid", result_data.data.ID );
						}
						$body.find( ".reset-limit-counter" ).click( reset_limit_counter );
						$body.find( ".add-blacklist" ).click( add_to_blacklist );
						$body.find( ".show-password-field" ).click( show_password_field );
						$body.find( ".hide-password-field" ).click( hide_password_field );
						$body.find( ".password-field" ).on( 'input', check_password_strength );
						$body.find( ".generate-password" ).click( auto_generate_password );
						$body.find( ".resend-reset-link-btn" ).click( resend_reset_link );
						$body.find( ".logout-everywhere-btn" ).click( logout_everywhere );
						// $body.find(".remove-level-btn").click(modal_level_action);
						$body.find( ".remove-level-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Remove Membership Level?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Remove', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", modal_level_action );
						$body.find( ".cancel-level-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Cancel Membership Level?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Cancel', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", modal_level_action );
						$body.find( ".uncancel-level-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Uncancel Membership Level?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Uncancel', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", modal_level_action );
						$body.find( ".add-userlevel-btn" ).click( add_userlevel );
						$body.find( ".pp-nav-link" ).click( pp_navlink_click );
						$body.find( ".add-ppp-btn" ).click( add_payperpost );
						$body.find( ".remove-usermeta-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Remove Scheduled Action?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Remove', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", remove_usermeta );

						$( '#reset-rss-feed' ).do_confirm().on(
							'yes.do_confirm',
							function() {
								$.post(
									WLM3VARS.ajaxurl,
									{
										action : 'wlm3_generate_new_user_rss',
										user_id : result_data.data.ID
									},
									function( result ) {
										if ( result.success ) {
											$( '#wlm_feed_url' ).val( result.feed_url );
											$( '.wlm-message-holder' ).show_message( { message : wp.i18n.__( 'Feed URL Changed.', 'wishlist-member' ) } );
										}
									}
								);
							}
						);

						// $body.find(".remove-ppp-btn").click(remove_payperpost);
						$body.find( ".remove-ppp-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Remove Pay Per Post?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Remove', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", remove_payperpost );

						select = $body.find( ".wlm-select-country" );
						if ( ! select.data( 'select2' ) ) {
							select.select2( {theme:"bootstrap",placeholder: wp.i18n.__( 'Select Country', 'wishlist-member' )} );
						}

						select = $body.find( ".wlm-levels" );
						if ( ! select.data( 'select2' ) ) {
							select.select2( {theme:"bootstrap",placeholder: wp.i18n.__( 'Select Membership Level', 'wishlist-member' )} );
						}

						var startDateMoment = new moment();
						$body.find( '#DateRangePicker' ).daterangepicker(
							{
								"singleDatePicker": true,
								"timePicker": true,
								"showCustomRangeLabel": false,
								"locale": {
									format: WLM3VARS.js_datetime_format
								},
								"buttonClasses": "btn -default",
								"applyClass": "-condensed -success",
								"cancelClass": "-condensed -link"
							}
						);
						$( "#" + modal_id ).find( ".modal-footer" ).show();
					} else {
						$( "#" + modal_id ).modal( 'toggle' );
						$( ".wlm-message-holder" ).show_message( {message:result_data.msg, type:'error', icon:'error'} );
					}
				} catch (e) {
					$( "#" + modal_id ).modal( 'toggle' );
					$( ".wlm-message-holder" ).show_message( {message:wp.i18n.__( 'Unable to retrieve member information.', 'wishlist-member' ), type: "danger" } );
				}
			}
		}
	)
	.fail(
		function( jqXHR, textStatus ) {
			$( "#" + modal_id ).modal( 'toggle' );
			$( ".wlm-message-holder" ).show_message( {message:wp.i18n.__( 'An error occured.', 'wishlist-member' ), type: "danger" } );
		}
	)
	.always(
		function() {
			// automatically open tabs as specified by the button's data-tab-focus value\
			($(click_event.target).data( 'tab-focus' ) || $(click_event.currentTarget).data( 'tab-focus' ) || '').split( ',' ).forEach(
				function(t) {
					if (t.match( /^#.+$/ )) {
						 t = $( '[data-toggle="tab"]' ).filter( '[href="' + t + '"],[data-target="' + t + '"]' );
						if (t.length) {
							t.click().tab( 'show' );
						}
					}
				}
			);
		}
	);
}

var add_userlevel = function( e ) {
	e.preventDefault();
	var $this_button         = $( this );
	var $level_select2       = $this_button.closest( ".row" ).find( ".add-wlm-levels" );
	var $level_email_select2 = $this_button.closest( ".row" ).find( ".add-wlm-levels-email" );

	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}
	if ( $this_button.closest( ".row" ).find( ".add-wlm-levels" ).val() == "" ) {
		$this_button.closest( ".row" ).find( ".add-wlm-levels" ).parent().addClass( 'has-error' );
		return;
	}
	$level_select2.parent().removeClass( 'has-error' );
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "schedule_user_level",
		level_action : "add_user_level",
		return_user_level_data : "1",
		wlm_levels : $level_select2.val(),
		level_email : $level_email_select2.val(),
		userids : $this_button.attr( "user-id" )
	};
	$level_select2.val( "" ).trigger( 'change.select2' );
	$level_email_select2.val( "sendlevel" ).trigger( 'change.select2' );
	var x = $this_button.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true} );
			},
			on_success: function( $me, $result) {
				if ( $result.success && $result.data ) {
					$.each(
						$result.data,
						function( userid, level_markup ) {
							if ( level_markup ) {
								var level_data  = $( level_markup );
								var level_names = [];
								$( ".wlm-user-levels-" + userid ).find( ".wlm-user-level-details" ).remove();
								$( ".wlm-user-levels-" + userid + " tbody" ).prepend( level_data );

								level_data.find( ".wlm-level-name" ).each(
									function( index ) {
										level_names.push( $( this ).html() );
									}
								);
								// $(".wlm-user-levels-" +userid +" thead .level-collapse .text .thelevels").html(level_names.join(", "));

								$( ".wlm-user-levels-" + userid + " thead .level-collapse" ).removeClass( "d-none" );
								$( ".wlm-user-levels-" + userid + " thead .add-level-btn" ).addClass( "d-none" );
								$( ".wlm-user-levels-" + userid + " tbody" ).addClass( "in" );
								// rebind buttons
								$( ".wlm-user-levels-" + userid + " tbody" ).find( '.move-level-btn' ).click( show_move_level_modal );
								$( ".wlm-user-levels-" + userid + " tbody" ).find( '.cancel-level-btn' ).click( show_cancel_level_modal );
								$( ".wlm-user-levels-" + userid + " tbody" ).find( '.delete-level-btn' ).click( show_delete_level_modal );
								$( ".wlm-user-levels-" + userid + " tbody" ).find( '.unschedule-level-btn' ).click( show_unschedule_level_modal );
							} else {
								$( ".wlm-user-levels-" + userid + " thead .level-collapse .text" ).html( "" );
								$( ".wlm-user-levels-" + userid + " thead .level-collapse" ).addClass( "d-none" );
								$( ".wlm-user-levels-" + userid + " thead .add-level-btn" ).removeClass( "d-none" );
								$( ".wlm-user-levels-" + userid + " tbody" ).removeClass( "in" );
							}
						}
					);

					$holder = $this_button.closest( ".row" ).parent().find( ".user-level-holder" );
					if ( $result.level_data ) {
						$holder.find( ".tr-none" ).remove();
						$.each(
							$result.level_data,
							function( userid, level_data ) {
								$.each(
									level_data,
									function( levelid, data ) {
										var parent  = data.parent ? '<i class="wlm-icons pull-right" title="Parent Level: ' + data.parent + '">person</i>' : '';
										var $markup = '<tr class="d-flex button-hover">';
										$markup    += '<td class="col-4 pt-3"><span class="table-td">' + data.name + parent + '</span></td>';
										$markup    += '<td class="col-3"><input type="text" class="form-control" value="' + data.txnid + '" name="txnid[' + levelid + ']"  placeholder="Transaction ID" /></td>';
										$markup    += '<td class="col-3"><input type="text" class="form-control" value="' + data.regdate + '" name="lvltime[' + levelid + ']"  placeholder="Registration Date" /></td>';
										$markup    += '<td class="col-2"><div class="btn-group-action pull-right pt-1">';
										$markup    += '<a href="#" user-id="' + userid + '" level-id="' + levelid + '" class="btn cancel-level-btn -del-btn" title="Cancel from Level"><span class="wlm-icons md-24 -icon-only">close</span></a>';
										$markup    += '<a href="#" user-id="' + userid + '" level-id="' + levelid + '" class="btn uncancel-level-btn -del-btn d-none" title="Uncancel from Level"><span class="wlm-icons md-24 -icon-only">replay</span></a>';
										$markup    += '<a href="#" user-id="' + userid + '" level-id="' + levelid + '" class="btn remove-level-btn -del-btn" title="Remove from Level"><span class="wlm-icons md-24 -icon-only">delete</span></a>';
										$markup    += '</div></td>';
										$markup    += '</tr>';
										var $el     = $( $markup );
										$el.find( ".remove-level-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Remove Membership Level?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Remove', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", modal_level_action );
										$el.find( ".cancel-level-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Cancel Membership Level?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Cancel', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", modal_level_action );
										$el.find( ".uncancel-level-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Uncancel Membership Level?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Uncancel', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", modal_level_action );
										// $el.find(".remove-level-btn").click(modal_level_action);
										$holder.append( $el );
										$level_select2.find( 'option[value=' + levelid + ']' ).attr( 'disabled', 'disabled' );
									}
								);
							}
						);
						$level_select2.select2( "destroy" ).select2( {theme:"bootstrap"} );
					}
				} else {
					$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
			},
			on_error: function( $me, $error_fields) {
				$this_button.disable_button( {disable:false} );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false} );
			}
		}
	);
}

var update_level_info = function ($result) {
	$.each(
		$result.data,
		function( userid, level_markup ) {
			if ( level_markup ) {
				$( ".wlm-user-levels-" + userid ).removeClass( 'levels0' );
				var level_data  = $( level_markup );
				var level_names = [];

				$( ".wlm-user-levels-" + userid ).find( ".wlm-user-level-details" ).remove();
				$( ".wlm-user-levels-" + userid + " tbody" ).prepend( level_data );

				level_data.find( ".wlm-level-name" ).each(
					function( index ) {
						level_names.push( $( this ).html() );
					}
				);

				// rebind buttons
				$( ".wlm-user-levels-" + userid + " tbody" ).find( '.move-level-btn' ).click( show_move_level_modal );
				$( ".wlm-user-levels-" + userid + " tbody" ).find( '.cancel-level-btn' ).click( show_cancel_level_modal );
				$( ".wlm-user-levels-" + userid + " tbody" ).find( '.uncancel-level-btn' ).click( show_uncancel_level_modal );
				$( ".wlm-user-levels-" + userid + " tbody" ).find( '.delete-level-btn' ).click( show_delete_level_modal );
				$( ".wlm-user-levels-" + userid + " tbody" ).find( '.unschedule-level-btn' ).click( show_unschedule_level_modal );

				update_collapse_levels( userid, $result.user_levels );
			} else {
				$( ".wlm-user-levels-" + userid ).addClass( 'levels0' );
				$( ".wlm-user-levels-" + userid + " tbody .wlm-user-level-details" ).remove();
			}
		}
	);

}

var remove_usermeta = function( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "remove_user_meta",
		userid : $this_button.attr( "user-id" ),
		metakey : $this_button.attr( "meta-key" ),
	};
	var x             = $this_button.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true} );
			},
			on_success: function( $me, $result) {
				if ( $result.success && $result.data ) {
					$holder = $this_button.closest( "tr" ).closest( "tbody" );
					$this_button.closest( "tr" ).fadeOut(
						800,
						function(){
							$( this ).remove();
							if ( $holder.find( 'tr' ).length <= 0 ) {
								var $markup = '<tr class="tr-none"><td class="text-center" colspan="3">No scheduled action</td></tr>';
								var $el     = $( $markup );
								$holder.append( $el );
							}
						}
					);
				} else {
					$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
			},
			on_error: function( $me, $error_fields) {
				$this_button.disable_button( {disable:false} );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false} );
			}
		}
	);
}

var modal_level_action = function( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}
	var $level_email_select2 = $this_button.closest( ".table-wrapper" ).parent().find( ".add-wlm-levels-email" );
	var $level_select2       = $this_button.closest( ".table-wrapper" ).parent().find( ".add-wlm-levels" );

	var my_action = "";
	if ( $this_button.hasClass( "cancel-level-btn" ) ) {
		my_action = "cancel_user_level";
	}
	if ( $this_button.hasClass( "uncancel-level-btn" ) ) {
		my_action = "uncancel_user_level";
	}
	if ( $this_button.hasClass( "remove-level-btn" ) ) {
		my_action = "delete_user_level";
	}

	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "schedule_user_level",
		level_action : my_action,
		wlm_levels : $this_button.attr( "level-id" ),
		level_email : $level_email_select2.val(),
		userids : $this_button.attr( "user-id" )
	};
	var x             = $this_button.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true} );
			},
			on_success: function( $me, $result) {
				if ( $result.success && $result.data ) {
					update_level_info( $result );
					if ( my_action == "delete_user_level" ) {
						$holder = $this_button.closest( "tr" ).closest( "tbody" );
						$this_button.closest( "tr" ).fadeOut(
							500,
							function(){
								$( this ).remove();
								if ( $holder.find( 'tr' ).length <= 0 ) {
									var $markup = '<tr class="tr-none"><td class="text-center" colspan="4">No membership levels</td></tr>';
									var $el     = $( $markup );
									$holder.append( $el );
								}
							}
						);
						$level_select2.find( 'option[value=' + $this_button.attr( "level-id" ) + ']' ).attr( 'disabled', false );
						$level_select2.select2( "destroy" ).select2( {theme:"bootstrap"} );
					} else {
						if ( my_action == "cancel_user_level" ) {
							$this_button.addClass( "d-none" );
							$this_button.closest( "tr" ).find( ".uncancel-level-btn" ).removeClass( "d-none" );
							$this_button.closest( "tr" ).find( ".levelname-holder" ).html( "<strike>" + $this_button.attr( "level-name" ) + "</strike>" );
						} else {
							$this_button.addClass( "d-none" );
							$this_button.closest( "tr" ).find( ".cancel-level-btn" ).removeClass( "d-none" );
							$this_button.closest( "tr" ).find( ".levelname-holder" ).html( $this_button.attr( "level-name" ) );
						}
					}

				} else {
					$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
			},
			on_error: function( $me, $error_fields) {
				$this_button.disable_button( {disable:false} );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false} );
			}
		}
	);
}

var pp_navlink_click = function() {
	$( this ).closest( "#pay-per-posts" ).find( ".add-ppp-btn" ).data( "type", $( this ).data( "type" ) );
	var post_type  = $( this ).data( "type" );
	var post_title = $( this ).data( "title" );

	if ( post_type == "ppphistory" ) {
		$( ".ppp-add-form" ).hide();
		return;
	} else {
		$( ".ppp-add-form" ).show();
	}

	var plchldr = wp.i18n.__( 'Search for Pay Per Posts (Posts Only)', 'wishlist-member' );
	plchldr     = post_type != 'Posts' ? wp.i18n.sprintf(
		// Translators: 1 - Post type name.
		wp.i18n.__( 'Search for Pay Per Post %1$s (%1$s Only)', 'wishlist-member' ),
		post_title
	) : plchldr;

	var exclude_posts = [];
	$( "#pay-per-posts" ).find( "." + post_type + "-holder" ).find( ".remove-ppp-btn" ).each(
		function(){
			exclude_posts.push( $( this ).attr( "post-id" ) );
		}
	);

	select = $( this ).closest( "#pay-per-posts" ).find( ".wlm-payperposts" );
	if ( select.data( 'select2' ) ) {
		select.select2( 'destroy' );
	}
	// only display the post type selected
	select.select2(
		{
			ajax: {
				url: WLM3VARS.ajaxurl,
				dataType: 'json', delay: 500, type: 'POST',
				data: function (params) {
					return {
						search:  params.term || "", page: params.page || 0, page_limit: 16,
						action: 'admin_actions', WishListMemberAction : 'payperpost_search',
						ptype: post_type, exclude_id : exclude_posts,
					};
				},
				processResults: function (data) {
					var arr  = []
					$.each(
						data.posts,
						function (index, value) {
							arr.push( { id: value.ID, text: value.post_title } )
						}
					)
					var more = ( data.page * data.page_limit ) < data.total;
					return {results: arr, pagination: {more: more}};
				},cache: true
			},
			minimumInputLength: 1,
			placeholder: plchldr,theme:"bootstrap",
			language: {
				noResults: function(){
					if (  post_title != 'Posts' ) {
						return wp.i18n.sprintf(
							 // Translators: 1 - Post title
							wp.i18n.__( 'No Pay Per Post %1$s found', 'wishlist-member' ),
							post_title.slice( 0, -1 )
						);
					} else {
						return wp.i18n.__( 'No Pay Per Post found', 'wishlist-member' );
					}
				}
			},
		}
	);
	select.val( "" ).trigger( 'change.select2' );
}

var add_payperpost = function( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}
	var parent       = $this_button.parent();
	var modal_id     = $this_button.closest( ".modal" ).prop( "id" );
	var $save_button = $( "#" + modal_id ).find( ".save-button" );
	$pid             = $this_button.closest( ".row" ).find( ".wlm-payperposts" ).val();
	$userid          = $( "#" + modal_id ).find( "input[name='userid']" ).val();
	if ( ! $userid ) {
		$( ".wlm-message-holder" ).show_message( {message:wp.i18n.__( 'Invalid member.', 'wishlist-member' ), type: "danger" } ); return; }
	if ( ! $pid ) {
		$( ".wlm-message-holder" ).show_message( {message:wp.i18n.__( 'No post selected.', 'wishlist-member' ), type: "danger" } ); return; }
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "add_remove_payperpost",
		operation : "add",
		postid : $pid,
		userid : $userid,
	};
	var x             = parent.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true} );
				$save_button.disable_button( {disable:true} );
				// prevent modal from closing until operation is done
				$( "#" + modal_id ).on(
					'hide.bs.modal',
					function(e) {
						if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
							e.preventDefault();
						}
					}
				);
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					var $result_data = $result.data[$userid] !== 'undefined' ? $result.data[$userid] : $result.data;
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
					$holder = $( "#" + modal_id ).find( "." + $result_data.post_type + "-holder" );

					$holder.find( ".tr-none" ).remove();
					var $markup = '<tr class="button-hover">';
					$markup    += '<td class="post-title">' + $result_data.post_title + '</td>';
					$markup    += '<td width="10%"><div class="btn-group-action">';
					$markup    += '<a href="#" post-id="' + $result_data.ID + '" class="btn remove-ppp-btn -del-btn"><span class="wlm-icons md-24 -icon-only">delete</span></a>';
					$markup    += '</div></td>';
					$markup    += '</tr>';
					var $el     = $( $markup );
					// $el.find(".remove-ppp-btn").click(remove_payperpost);
					$el.find( ".remove-ppp-btn" ).do_confirm( {confirm_message : wp.i18n.__( 'Remove Pay Per Post?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Remove', 'wishlist-member' ), placement: 'right'} ).on( "yes.do_confirm", remove_payperpost );
					$holder.append( $el );
					$this_button.closest( ".row" ).find( ".wlm-payperposts" ).val( "" ).trigger( 'change.select2' );
					$( "#" + modal_id ).find( ".pp-nav-link.active" ).trigger( "click" ); // redo the dropdown of payperpost, to exclude the post added
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, class:""} );
				$save_button.disable_button( {disable:false} );
			},
			on_error: function( $me, $error_fields) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, class:""} );
				$save_button.disable_button( {disable:false} );
			},
			on_done: function( $me, $data) {
				$save_button.disable_button( {disable:false} );
				$this_button.disable_button( {disable:false, class:"-primary"} );
				$this_button.blur();
				$( "#" + modal_id ).unbind( "hide.bs.modal" );
			}
		}
	);
}

var remove_payperpost = function( e ) {
	e.preventDefault();
	var $this_button = $( this );
	var ptitle       = $this_button.closest( "tr" ).find( ".post-title" ).html();
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	var parent       = $this_button.parent();
	var modal_id     = $this_button.closest( ".modal" ).prop( "id" );
	var $save_button = $( "#" + modal_id ).find( ".save-button" );
	$pid             = $( this ).attr( "post-id" );
	$userid          = $( "#" + modal_id ).find( "input[name='userid']" ).val();
	if ( ! $userid ) {
		$( ".wlm-message-holder" ).show_message( {message:wp.i18n.__( 'Invalid member.', 'wishlist-member' ), type: "danger" } ); return; }
	if ( ! $pid ) {
		$( ".wlm-message-holder" ).show_message( {message:wp.i18n.__( 'No post selected.', 'wishlist-member' ), type: "danger" } ); return; }
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "add_remove_payperpost",
		operation : "remove",
		postid : $pid,
		userid : $userid,
	};
	var x             = parent.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true} );
				$save_button.disable_button( {disable:true} );
				// prevent modal from closing until operation is done
				$( "#" + modal_id ).on(
					'hide.bs.modal',
					function(e) {
						if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
							e.preventDefault();
						}
					}
				);
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
					$holder = $( "#" + modal_id ).find( "." + $result.data.post_type + "-holder" );
					$this_button.closest( "tr" ).fadeOut(
						500,
						function(){
							$( this ).remove();
							if ( $holder.find( 'tr' ).length <= 0 ) {
								var $markup = '<tr class="tr-none"><td class="text-center" colspan="2">-None-</td></tr>';
								var $el     = $( $markup );
								$holder.append( $el );
							}
							$( "#" + modal_id ).find( ".pp-nav-link.active" ).trigger( "click" ); // redo the dropdown of payperpost, to include the post remove
						}
					);
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, class:""} );
				$save_button.disable_button( {disable:false} );
			},
			on_error: function( $me, $error_fields) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, class:""} );
				$save_button.disable_button( {disable:false} );
			},
			on_done: function( $me, $data) {
				$save_button.disable_button( {disable:false} );
				$this_button.disable_button( {disable:false, class:""} );
				$this_button.blur();
				$( "#" + modal_id ).unbind( "hide.bs.modal" );
			}
		}
	);
}

var update_user = function() {
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}

	var modal_id     = $( this ).closest( ".modal" ).prop( "id" );
	var $body        = $( "#" + modal_id ).find( ".modal-body" );
	var $save_button = $( "#" + modal_id ).find( ".save-button" );
	var x            = $body.save_settings(
		{
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true, icon:"update"} );
				$save_button.disable_button( {disable:true} );
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
					$( ".user-details-tr-" + $result.userdata.userid ).find( ".wlm-user-display-name" ).html( $result.userdata.display_name.replace( /\\(.)/mg, "$1" ) );
					$( ".user-details-tr-" + $result.userdata.userid ).find( ".wlm-user-email" ).html( $result.userdata.user_email );

					$( ".user-details-tr-" + $result.userdata.userid ).find( ".toggle-wlm-unsubscribe [name='wlm_unsubscribe']" ).val( $result.userdata.wlm_unsubscribe );
					if ( $result.userdata.wlm_unsubscribe == "1" ) {
						$( ".user-details-tr-" + $result.userdata.userid ).find( ".toggle-wlm-unsubscribe .wlm-icons" ).parent().addClass( "table-status" );
						$( ".user-details-tr-" + $result.userdata.userid ).find( ".toggle-wlm-unsubscribe .wlm-icons" ).parent().attr( "title", wp.i18n.__( 'Email Broadcast (Inactive)', 'wishlist-member' ) );
					} else {
						$( ".user-details-tr-" + $result.userdata.userid ).find( ".toggle-wlm-unsubscribe .wlm-icons" ).parent().removeClass( "table-status" );
						$( ".user-details-tr-" + $result.userdata.userid ).find( ".toggle-wlm-unsubscribe .wlm-icons" ).parent().attr( "title", wp.i18n.__( 'Email Broadcast (Active)', 'wishlist-member' ) );
					}
					update_level_info( $result );
					if ($this_button.hasClass( "save-close" ) ) {
						$( "#" + modal_id ).modal( 'toggle' );
					}
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
			},
			on_error: function( $me, $error_fields) {
				$.each(
					$error_fields,
					function( key, obj ) {
						obj.parent().addClass( 'has-error' );
					}
				);
				$this_button.disable_button( {disable:false, icon:"save"  } );
				$save_button.disable_button( {disable:false} );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false, icon:"save" } );
				$save_button.disable_button( {disable:false} );
			}
		}
	);
}

var resend_reset_link = function( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}
	var parent        = $( this ).parent();
	var modal_id      = $( this ).closest( ".modal" ).prop( "id" );
	var $save_button  = $( "#" + modal_id ).find( ".save-button" );
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "resend_reset_link",
		user_login : $( this ).attr( "data-user-login" )
	};
	var x             = parent.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true, class:"", text:wp.i18n.__( 'Sending, please wait...', 'wishlist-member' )} );
				$save_button.disable_button( {disable:true} );
				// prevent modal from closing until operation is done
				$( "#" + modal_id ).on(
					'hide.bs.modal',
					function(e) {
						if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
							e.preventDefault();
						}
					}
				);
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, class:"", text:wp.i18n.__( 'Send Reset Password Link to member', 'wishlist-member' ) } );
				$save_button.disable_button( {disable:false} );
			},
			on_error: function( $me, $error_fields) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false, class:"", text:wp.i18n.__( 'Send Reset Password Link to member', 'wishlist-member' ) } );
				$save_button.disable_button( {disable:false} );
			},
			on_done: function( $me, $data) {
				$this_button.disable_button( {disable:false, class:"", text:wp.i18n.__( 'Send Reset Password Link to member', 'wishlist-member' ) } );
				$save_button.disable_button( {disable:false} );
				$this_button.blur();
				$( "#" + modal_id ).unbind( "hide.bs.modal" );
			}
		}
	);
}

var logout_everywhere = function ( e ) {
	e.preventDefault();
	var $this_button = $( this );
	if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
		return false; // if disabled, do nothing
	}
	var parent        = $( this ).parent();
	var modal_id      = $( this ).closest( ".modal" ).prop( "id" );
	var $save_button  = $( "#" + modal_id ).find( ".save-button" );
	var settings_data = {
		action : "admin_actions",
		WishListMemberAction : "logout_everywhere",
		user_id : $( this ).attr( "data-user-id" )
	};
	var x             = parent.save_settings(
		{
			data: settings_data,
			on_init: function( $me, $data) {
				$this_button.disable_button( {disable:true} );
				$save_button.disable_button( {disable:true} );
				// prevent modal from closing until operation is done
				$( "#" + modal_id ).on(
					'hide.bs.modal',
					function(e) {
						if ( $this_button.prop( "disabled" ) || $this_button.hasClass( "-disable" ) || $this_button.hasClass( "-disabled" ) ) {
							e.preventDefault();
						}
					}
				);
			},
			on_success: function( $me, $result) {
				if ( $result.success ) {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				} else {
					$( ".wlm-message-holder" ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
				}
			},
			on_fail: function( $me, $data) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_failed, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false} );
				$save_button.disable_button( {disable:false} );
			},
			on_error: function( $me, $error_fields) {
				$( ".wlm-message-holder" ).show_message( {message:WLM3VARS.request_error, type:'error', icon:'error'} );
				$this_button.disable_button( {disable:false} );
				$save_button.disable_button( {disable:false} );
			},
			on_done: function( $me, $data) {
				$save_button.disable_button( {disable:false} );
				$this_button.blur();
				$( "#" + modal_id ).unbind( "hide.bs.modal" );
			}
		}
	);

}

var advanced_search_tab_click = function( e ) {
	e.preventDefault();
	if ( $( this ).attr( "aria-controls" ) == "advance-search-holder" ) {
		$( "#" + advancesearch_modal.data.id ).find( ".save-button" ).show();
		$( "#" + advancesearch_modal.data.id ).find( ".clear-search-fields" ).show();
	} else {
		$( "#" + advancesearch_modal.data.id ).find( ".save-button" ).hide();
		$( "#" + advancesearch_modal.data.id ).find( ".clear-search-fields" ).hide();
	}
}

var clear_search_fields = function( e ) {
	e.preventDefault();
	$( "#" + advancesearch_modal.data.id ).find( "input[type='text']" ).val( "" );
	$( "#" + advancesearch_modal.data.id ).find( ".wlm-levels" ).val( "" ).trigger( 'change.select2' );
	$( "#" + advancesearch_modal.data.id ).find( ".date-ranger" ).hide();
}

$( 'body' ).off( '.ip-tracking' );
$( 'body' ).on(
	'change.ip-tracking',
	'select[name="privacy_disable_ip_tracking"]',
	function() {
		switch ( $( this ).val() ) {
			case '1':
				$( '.row.-ip-tracking' ).addClass( '-ip-tracking-disabled' );
				break;
			case '-1':
				$( '.row.-ip-tracking' ).removeClass( '-ip-tracking-disabled' );
				break;
			default:
				$( '.row.-ip-tracking' ).toggleClass( '-ip-tracking-disabled', $( this ).data( 'global-default' ) == '1' );
				break;
		}
	}
);

jQuery(
	function(){
		var hash = document.location.hash.match( /edit-user-(\d+)(?:-(.+))?/ );
		if (hash) {
			var tab = hash[2] ? 'data-tab-focus="#' + hash[2] + '"' : '';
			$( '<a href="#" data-userid="' + hash[1] + '" class="edit-user-btn" onclick="show_edit_user_modal(event)" ' + tab + ' />' ).click();
		}
	}
);
