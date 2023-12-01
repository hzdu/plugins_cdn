jQuery( document ).ready(
	function() {
		jQuery( '.wlm-select-action' ).change( action_changed );

		var select  = jQuery( ".wlm-inside-manager" ).find( ".wlm-select-cat" );
		var plchldr = select.attr( "placeholder" );
		select.val( "" ).trigger( 'change.select2' );
		if ( select.data( 'select2' ) ) {
			select.wlmselect2( 'destroy' );
		}
		select.wlmselect2( {placeholder: plchldr} );

		jQuery( '.wlm-manager-save' ).click(
			function() {
				var $btn     = jQuery( this );
				var $message = jQuery( this ).parent().find( '.wlm-message' );
				$btn.addClass( '-disable' ).prop( 'disabled', true );
				$message.html( "Saving..." ).show();
				var data = jQuery( '.wlm-inside-manager :input' ).serialize();
				data    += '&contentids=' + wlm_post_id;
				data    += '&action=admin_actions';
				data    += '&sched_action=set';
				data    += '&WishListMemberAction=set_content_manager';
				data    += '&post_option=1';

				jQuery.post(
					ajaxurl,
					data,
					function( result ) {
						var result_data = "";
						if ( result != 0 || result != "" ) {
							// try parsing result
							try {
								result_data = wlm.json_parse( result );
							} catch (e) {
								result_data = result;
							}
						}

						if ( result_data.success ) {
							var tr = jQuery( '#wlcc_manager_table tbody tr:last' ).clone();
							tr.removeClass( "empty-tr" );
							tr.find( "td .wlm-manage-sched" ).html( result_data.str_sched );
							tr.find( "td .wlm-manager-remove" ).prop( "type", result_data.action_type );
							tr.find( "td .wlm-manager-remove" ).prop( "id", result_data.insertid );
							tr.find( "td .wlm-manager-remove" ).click( manager_remove );

							jQuery( '#wlcc_manager_table tbody' ).append( tr );
							jQuery( '.wlm-inside-manager :input' ).val( "" );
							jQuery( '#wlcc_manager_table tbody tr.empty-tr' ).remove();
						}
						$btn.removeClass( '-disable' ).prop( 'disabled', false );
						$message.html( result_data.msg ).delay( 4000 ).fadeOut( 500 );
					}
				);
				return false;
			}
		);

		jQuery( '.wlm-manager-remove' ).click( manager_remove );
	}
);

var manager_remove = function() {
		var $btn = jQuery( this );
	if ( ! confirm( "Delete this schedule." ) ) {
		return;
	}

		$btn.addClass( '-disable' ).prop( 'disabled', true );
		$btn.closest( "tr" ).fadeOut( 4000 );

		var data = jQuery( '.wlm-inside-manager :input' ).serialize();
		data    += '&contentids=' + wlm_post_id;
		data    += '&action=admin_actions';
		data    += '&sched_action=remove';
		data    += '&WishListMemberAction=set_content_manager';
		data    += '&post_option=1';
		data    += '&id=' + $btn.prop( "id" );
		data    += '&type=' + $btn.prop( "type" );

		jQuery.post(
			ajaxurl,
			data,
			function( result ) {
				var result_data = "";
				if ( result != 0 || result != "" ) {
					// try parsing result
					try {
						result_data = wlm.json_parse( result );
					} catch (e) {
						result_data = result;
					}
				}
				if ( result_data.success ) {
					$btn.closest( "tr" ).remove();
					if ( jQuery( '#wlcc_manager_table tbody tr' ).length <= 0 ) {
						var tr = "<tr class='empty-tr'><td style='border-bottom: 1px solid #eeeeee;'><span class='wlm-manage-sched' style='vertical-align: middle;'>- No schedule -</span>";
						tr    += "<span class='wlm-manage-actions' style='float: right; vertical-align: middle;'><a href='#' class='wlm-manager-remove' type='' id=''>remove</a></span></td></tr>";
						jQuery( '#wlcc_manager_table tbody' ).append( tr );
					}
				} else {
					$btn.closest( "tr" ).fadeIn( 100 );
				}
				$btn.removeClass( '-disable' ).prop( 'disabled', false );
			}
		);
		return false;
}

var action_changed = function() {
	var operation = jQuery( this ).val();
	modal_id      = "wlm-inside-manager";

	jQuery( "." + modal_id ).find( ".action-status-holder" ).addClass( "d-none" );
	jQuery( "." + modal_id ).find( ".action-moveadd-holder" ).addClass( "d-none" );
	jQuery( "." + modal_id ).find( ".action-repost-holder" ).addClass( "d-none" );

	jQuery( "." + modal_id ).find( "input[name='schedule_date']" ).prop( "required", true );
	jQuery( "." + modal_id ).find( "input[name='content_action']" ).prop( "required", true );
	jQuery( "." + modal_id ).find( ".wlm-select-cat" ).prop( "required", false );
	jQuery( "." + modal_id ).find( ".wlm-select-status" ).prop( "required", false );
	jQuery( "." + modal_id ).find( "input[name='content_every']" ).prop( "required", false );
	jQuery( "." + modal_id ).find( "input[name='content_by']" ).prop( "required", false );
	jQuery( "." + modal_id ).find( "input[name='content_repeat']" ).prop( "required", false );

	if ( operation == "add" || operation == "move") {
		jQuery( "." + modal_id ).find( ".action-moveadd-holder" ).removeClass( "d-none" );
		jQuery( "." + modal_id ).find( ".wlm-select-cat" ).prop( "required", true );
		var select  = jQuery( "." + modal_id ).find( ".wlm-select-cat" );
		var plchldr = select.attr( "placeholder" );
		select.val( "" ).trigger( 'change.select2' );
		if ( select.data( 'select2' ) ) {
			select.wlmselect2( 'destroy' );
		}
		select.wlmselect2( {placeholder: plchldr} );
	}
	if ( operation == "repost") {
		jQuery( "." + modal_id ).find( ".action-repost-holder" ).removeClass( "d-none" );
		jQuery( "." + modal_id ).find( "input[name='content_every']" ).prop( "required", true );
		jQuery( "." + modal_id ).find( "input[name='content_by']" ).prop( "required", true );
		jQuery( "." + modal_id ).find( "input[name='content_repeat']" ).prop( "required", true );
	}
	if ( operation == "set") {
		jQuery( "." + modal_id ).find( ".action-status-holder" ).removeClass( "d-none" );
		jQuery( "." + modal_id ).find( ".wlm-select-status" ).prop( "required", true );

		var select  = jQuery( "." + modal_id ).find( ".wlm-select-status" );
		var plchldr = select.attr( "placeholder" );
		select.val( "" ).trigger( 'change.select2' );
		if ( select.data( 'select2' ) ) {
			select.wlmselect2( 'destroy' );
		}
		select.wlmselect2( {placeholder: plchldr} );
	}
}
