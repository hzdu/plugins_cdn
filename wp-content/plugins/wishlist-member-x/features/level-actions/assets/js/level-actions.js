/**
 * Level actions javascript file
 *
 * @package WishListMember/Features/Level_Actions
 */

if ( typeof wlm_show_level_actions !== 'function' ) {
	function wlm_show_level_actions (levelid) {
		var settings_data = {
			action : 'admin_actions',
			WishListMemberAction : 'get_level_actions',
			levelid : levelid,
		};
		var default_html  = "<tr><td colspan='3'>No action is set</td></tr>";
		$( '#table-level-actions .action-table-title' ).html( $( "input[name='name']" ).val() + " " + wp.i18n.__( 'Level Actions', 'wishlist-member' ) );
		var x = $( '#table-level-actions' ).save_settings(
			{
				data: settings_data,
				on_init: function( $me, $data) {
					if ( $me.find( 'tbody tr' ).length <= 0 ) {
						$me.find( 'tbody' ).html( "<tr><td colspan='3'>Loading actions, please wait...</td></tr>" );
					}
				},
				on_success: function( $me, $result) {
					var html = "";
					$.each(
						$result.actions,
						function (index, value) {
							html += "<tr class='button-hover level-action-tr-" + value.ID + "'>";
							html += "<td>" + value.option_value.action_text + "</td>";
							html += "<td>" + value.option_value.schedule + "</td>";
							html += "<td class='text-right'><div class='btn-group-action'>";
							html += "<a href='#' title='Edit Action' actionid='" + value.ID + "' class='edit-action-btn'><span class='wlm-icons md-24 -icon-only'>edit</span></a>&nbsp;&nbsp;";
							html += "<a href='#' title='Delete Action' actionid='" + value.ID + "' class='delete-action-btn'><span class='wlm-icons md-24 -icon-only'>delete</span></a>";
							html += "</div></td>";
							html += "</tr>";
						}
					)
					if ( ! html ) {
						html = default_html;
					}
					$me.find( 'tbody' ).html( html );

					$me.find( '.delete-action-btn' ).do_confirm( {placement:'right',yes_classes:'-danger', confirm_message : wp.i18n.__( 'Are you sure you want to delete this action?', 'wishlist-member' )} ).on(
						'yes.do_confirm',
						function() {
							var actionid      = $( this ).attr( 'actionid' );
							var parent        = $( this ).closest( 'tr' );
							var settings_data = {
								action : "admin_actions",
								WishListMemberAction : "delete_level_action",
								actionid : actionid,
							};
							var x             = $( '#table-level-actions' ).save_settings(
								{
									data: settings_data,
									on_success: function( $me, $result) {
										if ( $result.success ) {
											parent.fadeOut(
												500,
												function(){
													$( this ).remove();
													if ( $me.find( 'tbody tr' ).length <= 0 ) {
														$me.find( 'tbody' ).html( default_html );
													}
												}
											);
											$( '.wlm-message-holder' ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
										} else {
											$( '.wlm-message-holder' ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
										}
									},
								}
							);
						}
					);
				},
			}
		);

	}
}

'wlm_level_actions_loaded' in window || (
	function($) {
		window.wlm_level_actions_loaded = true;
		$( 'body' ).on(
			'wishlistmember_edit_level',
			/**
			 * Data loader.
			 *
			 * @param {object} e Event
			 * @param {object} level Level Object
			 */
			function(e,level) {
				wlm_show_level_actions( level.id );
			}
		);

		$( 'body' ).on(
			'click.wlm3levels',
			'#table-level-actions .edit-action-btn',
			/**
			 * Action edit handler
			 *
			 * @param {object} e  Event
			 */
			function(e) {
				var actionid      = $( this ).attr( 'actionid' );
				var settings_data = {
					action : "admin_actions",
					WishListMemberAction : "get_level_action_details",
					actionid : actionid,
				};
				var x             = $( '#table-level-actions' ).save_settings(
					{
						data: settings_data,
						on_init: function( $me, $data) {
							$( '#level-actions' ).modal( 'toggle' );
							$( '#level-actions' ).find( '.modal-title' ).html( wp.i18n.__( 'Loading action details...', 'wishlist-member' ) );
						},
						on_success: function( $me, $result) {
							if ( $result.success ) {
								var action = $result.action;
								$( '#level-actions' ).find( '.modal-title' ).html( wp.i18n.__( 'Update Level Actions', 'wishlist-member' ) );
								$( '#level-actions' ).find( '.save-button span' ).html( wp.i18n.__( 'Update Action', 'wishlist-member' ) );
								$( '#level-actions' ).find( '.save-button .wlm-icons' ).html( 'update' );

								$( '[name="level_action_id"]' ).val( action.ID );
								$( "#level-actions [name='level_action_event']" ).val( action.option_value.level_action_event ).trigger( 'change.select2' );
								$( "#level-actions [name='level_action_method']" ).val( action.option_value.level_action_method ).trigger( 'change.select2' );
								$( "#level-actions [name='action_levels']" ).val( action.option_value.action_levels ).trigger( 'change.select2' );
								$( "#level-actions [name='level_email']" ).val( action.option_value.level_email ).trigger( 'change.select2' );

								$( "#level-actions [name='level_action_method']" ).prop( "disabled", false );
								$( "#level-actions [name='level_action_method']" ).trigger( 'change' );

								if ( action.option_value.level_action_method == "add-ppp" || action.option_value.level_action_method == "create-ppp" || action.option_value.level_action_method == "remove-ppp"  ) {
									$( "#level-actions [name='ppp_type']" ).val( action.option_value.ppp_type ).trigger( 'change.select2' );
									$( "#level-actions [name='ppp_type']" ).trigger( 'change' );

									var option = new Option( action.option_value.ppp_post_title, action.option_value.ppp_content, true, true );
									$( "#level-actions [name='ppp_content']" ).append( option ).trigger( 'change.select2' );
									$( "#level-actions [name='ppp_content']" ).val( action.option_value.ppp_content ).trigger( 'change.select2' );

									$( "#level-actions [name='ppp_title']" ).val( action.option_value.ppp_title );
								}

								if ( action.option_value.level_action_method == "add" ) {
									$( '.inheritparent-holder' ).show();
									if ( action.option_value.inheritparent == "1" ) {
										$( "#level-actions [name='inheritparent']" ).prop( "checked", true );
									} else {
										$( "#level-actions [name='inheritparent']" ).prop( "checked", false );
									}
								} else {
									$( '.inheritparent-holder' ).hide();
								}

								$( '#level-actions .schedule-ondate-holder' ).hide();
								$( '#level-actions .schedule-after-holder' ).hide();
								if ( action.option_value.sched_toggle == "ondate" ) {
									$( '#level-actions .sched-ondate' ).prop( "checked", true );
									$( '#level-actions .schedule-ondate-holder' ).show();
									$( "#level-actions [name='sched_ondate']" ).val( action.option_value.sched_ondate );
								} else {
									$( '#level-actions .sched-after' ).prop( "checked", true );
									$( '#level-actions .schedule-after-holder' ).show();
									$( "#level-actions [name='sched_after_term']" ).val( action.option_value.sched_after_term );
									$( "#level-actions [name='sched_after_period']" ).val( action.option_value.sched_after_period ).trigger( 'change.select2' );
								}

							} else {
								$( '.wlm-message-holder' ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
								$( '#level-actions' ).modal( 'toggle' );
							}
						},
						on_fail: function( $me, $data) {
							$( '.wlm-message-holder' ).show_message( {message:WLM3VARS.request_failed, type:'danger', icon:'danger'} );
							$( '#level-actions' ).modal( 'toggle' );
						},
						on_error: function( $me, $error_fields) {
							$( '.wlm-message-holder' ).show_message( {message:WLM3VARS.request_error, type:'danger', icon:'danger'} );
							$( '#level-actions' ).modal( 'toggle' );
						},
					}
				);
			}
		);

		$( 'body' ).on(
			'change.wlm3levels',
			'[name="level_action_method"],[name="level_action_event"]',
			/**
			 * In-modal field change handlers
			 *
			 * @param {object} e Event
			 */
			function (e) {

				if ( $( '[name="level_action_event"]' ).val() == ""  ) {
					$( '[name="level_action_method"]' ).prop( "disabled", true );
				} else {
					if ( $( '[name="level_action_event"]' ).val() == "added" ) {
						$("[name='level_action_method'] option[value='cancel-from-same-level']").removeAttr('disabled');
					} else {
						$("[name='level_action_method'] option[value='cancel-from-same-level']").prop("disabled", "true");
						if ( $( '[name="level_action_method"]' ).val() == "cancel-from-same-level" || $( '[name="level_action_method"]' ).val() == null ) {
							$( '[name="level_action_method"]' ).val( "add" ).trigger( 'change.select2' );
						}
					}

					$( '[name="level_action_method"]' ).prop( "disabled", false );
				}

				if ( $( '[name="level_action_method"]' ).val() == "add" ) {
					$( '.inheritparent-holder' ).show();
				} else {
					$( '.inheritparent-holder' ).hide();
				}

				if ( $( '[name="level_action_method"]' ).val() == "remove" ) {
					$( '.wlm-levels-notification' ).parent().hide();
				} else {
					$( '.wlm-levels-notification' ).parent().show();
				}

				$( '.ppp-options-holder' ).hide();
				$( '.sched-options-holder' ).hide();
				$( '.wlm-levels-holder' ).hide();
				$( '.inherit-levels-holder' ).hide();
				if ( $( '[name="level_action_method"]' ).val() != "" ) {
					if ( $( '[name="level_action_method"]' ).val() == "add-ppp" || $( '[name="level_action_method"]' ).val() == "create-ppp" || $( '[name="level_action_method"]' ).val() == "remove-ppp" ) {
						$( '.ppp-options-holder' ).show();
						$( '[name="ppp_type"]' ).trigger( 'change' );
						if ( $( '[name="level_action_method"]' ).val() == "add-ppp" || $( '[name="level_action_method"]' ).val() == "remove-ppp" ) {
							$( '.ppp-options-title-holder' ).hide();
							$( '[name="ppp_content"]' ).parent().find( 'label' ).html( 'Select Content' );
							$( '[name="ppp_title"]' ).prop( "required", false );
						} else {
							$( '.ppp-options-title-holder' ).show();
							$( '[name="ppp_content"]' ).parent().find( 'label' ).html( 'Select Content to Copy' );
							$( '[name="ppp_title"]' ).prop( "required", true );
						}
						$( '[name="action_levels"]' ).prop( "required", false );
						$( '[name="ppp_content"]' ).prop( "required", true );
					} else {
						// Cancel Same Level "Then Do This".
						if ( $( '[name="level_action_method"]' ).val() == "cancel-from-same-level" ) {
							$( '.wlm-levels-holder' ).hide();
							$( '[name="action_levels"]' ).hide();
							$( '[name="action_levels"]' ).prop( "required", false );
						} else {
							$( '[name="action_levels"]' ).show();
							$( '.wlm-levels-holder' ).show();
							$( '[name="action_levels"]' ).prop( "required", true );
						}


						$( '.sched-options-holder' ).show();
						$( '.inherit-levels-holder' ).show();

						$( '[name="ppp_content"]' ).prop( "required", false );
						$( '[name="ppp_title"]' ).prop( "required", false );
					}
				}
			}
		);
	}
)( jQuery );

// level-actions modal.
$( '#level-actions-modal' ).length && new wlm3_modal(
	'#level-actions-modal',
	{
		save_handler: function(event) {
			var settings_data = {
				action : "admin_actions",
				WishListMemberAction : "save_level_actions",
				levelid : $( 'input[name=id]' ).val(),
			};
			var x             = $( '#level-action-data' ).save_settings(
				{
					data: settings_data,
					on_success: function( $me, $result) {
						wlm_show_level_actions( $( 'input[name=id]' ).val() );
						$( '.wlm-message-holder' ).show_message( {message:$result.msg, type:$result.msg_type, icon:$result.msg_type} );
					},
					on_fail: function( $me, $data) {
						console.log( [$me,$data,'fail'] );
						alert( WLM3VARS.request_failed );
					},
					on_error: function( $me, $error_fields) {
						$.each(
							$error_fields,
							function( key, obj ) {
								if ( typeof obj == 'object' ) {
									obj.parent().addClass( 'has-error' );
								}
							}
						);
					},
					on_done: function( $me, $data) {
						event.data.modal.close();
					}
				}
			);
			return false;
		},
		before_open: function(event) {
			$( '.schedule-ondate-holder' ).hide();
			$( '.schedule-after-holder' ).show();
			$( '.inheritparent-holder' ).hide();

			// clear error fields.
			$( '#level-action-data :input' ).each(
				function(){
					$( this ).parent().removeClass( 'has-error' );
				}
			);

			$( '[name="level_action_event"]' ).prop( "required", true );
			$( '[name="level_action_method"]' ).prop( "required", true );

			$( '[name="action_levels"]' ).prop( "required", true );
			$( '[name="ppp_content"]' ).prop( "required", true );
			$( '[name="ppp_title"]' ).prop( "required", true );

			$( '[name="level_action_id"]' ).val( "" );
			$( '#level-actions' ).find( '.modal-title' ).html( wp.i18n.__( 'Add Level Actions', 'wishlist-member' ) );
			$( '#level-actions' ).find( '.save-button span' ).html( wp.i18n.__( 'Add Action', 'wishlist-member' ) );
			$( '#level-actions' ).find( '.save-button .wlm-icons' ).html( 'add' );

			$( '[name="level_action_method"]' ).val( "" ).trigger( 'change.select2' );
			$( '[name="level_action_event"]' ).val( "" ).trigger( 'change.select2' );
			$( '[name="level_action_method"]' ).prop( "disabled", true );

			$( '[name="action_levels"]' ).val( "" ).trigger( 'change.select2' );
			$( '[name="level_email"]' ).val( 'sendlevel' ).trigger( 'change.select2' );
			$( '[name="sched_ondate"]' ).val( "" );
			$( '[name="sched_after_term"]' ).val( "" );

			$( '.sched-options-holder' ).hide();
			$( '.wlm-levels-holder' ).hide();
			$( '.inherit-levels-holder' ).hide();

			$( '.ppp-options-holder' ).hide();
			$( '[name="ppp_title"]' ).val( 'Private-{username}-{timestamp}' );
			$( '[name="ppp_type"]' ).val( 'post' ).trigger( 'change.select2' );
			$( '[name="ppp_content"]' ).val( "" ).trigger( 'change.select2' );
			return true;
		},
		before_close: function(event) {
			$( '[name="level_action_event"]' ).prop( "required", false );
			$( '[name="level_action_method"]' ).prop( "required", false );

			$( '[name="action_levels"]' ).prop( "required", false );
			$( '[name="ppp_content"]' ).prop( "required", false );
			$( '[name="ppp_title"]' ).prop( "required", false );
			return true;
		},
	}
);
