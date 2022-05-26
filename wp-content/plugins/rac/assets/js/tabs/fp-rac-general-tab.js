jQuery( function ( $ ) {
	'use strict';

	var General_Tab = {
		init: function () {

			// General
			$( document ).on( 'click', '.button-primary', this.validate_settings_value );

			// Cart list
			$( document ).on( 'change', '#rac_allow_user_cartlist', this.toggle_user_select_option );
			$( document ).on( 'change', '#rac_user_notice_display', this.toggle_user_custom_msg );
			$( document ).on( 'change', '#rac_allow_guest_cartlist', this.toggle_guest_select_option );
			$( document ).on( 'change', '#rac_guest_notice_display', this.toggle_guest_custom_msg );
			$( document ).on( 'change', '.rac_cartlist_new_abandon_recover', this.toggle_recover_cart_option );

			// Email
			$( document ).on( 'change', '#custom_restrict', this.toggle_cartlist_entry_restrict_option );
			$( document ).on( 'change', '#custom_exclude', this.toggle_email_sending_restrict_option );
			$( document ).on( 'change', '#rac_mail_template_send_method', this.toggle_email_sending_method_option );
			$( document ).on( 'change', '#enable_remove_abandon_after_x_days', this.toggle_delete_cart_after_days_option );
			$( document ).on( 'change', '#enable_remove_email_log_after_x_days', this.toggle_delete_email_log_after_days_option );
			$( document ).on( 'change', '#rac_remove_carts', this.toggle_get_cartlist_capture_restrict_for_same_email_option );
			$( document ).on( 'change', '#rac_admin_cart_recovered_noti', this.toggle_recover_notification );
			$( document ).on( 'change', '#rac_admin_cart_abandoned_noti', this.toggle_abandoned_notification );

			$( document ).on( 'change', 'input[name=rac_recovered_sender_opt]:radio', this.toggle_recover_notifi_sender_option );
			$( document ).on( 'change', 'input[name=rac_abandoned_sender_opt]:radio', this.toggle_abandoned_notifi_sender_option );

			// Guest Popup.
			$( document ).on( 'change', '#rac_popup_display_method', this.toggle_popup_display_mode );
			$( document ).on( 'change', '#rac_show_hide_name_in_popup', this.toggle_guest_popup_name );
			$( document ).on( 'change', '#rac_show_hide_contactno_in_popup', this.toggle_guest_popup_contactno );

			this.trigger_on_page_load();

		},
		validate_settings_value: function ( event ) {
			var element = {
				rac_abandon_cron_time: '#rac_abandon_cron_time',
				rac_abandon_cart_time_type: '#rac_abandon_cart_time',
				rac_abandon_cart_time_guest: '#rac_abandon_cart_time_guest',
			};
			var x;
			var check = 0;
			for ( x in  element ) {
				if ( $( element[x] ).val() == '' ) {
					event.preventDefault();
					var minvalue = $( element[x] ).data( 'min' );
					$( document.body ).triggerHandler( 'fp_common_error_tip', [ $( element[x] ), fp_validate_text_params.rac_warning_message + ' ' + minvalue ] );
					window.location.hash = '#rac_abandon_cart_time_type';
					check = 1;
				}
			}

			if ( check == '1' ) {
				return false;
			}
		},
		trigger_on_page_load: function () {
			this.get_user_field_option( '#rac_allow_user_cartlist' );
			this.get_guest_field_option( '#rac_allow_guest_cartlist' );
			this.get_recovered_cart_option( '.rac_cartlist_new_abandon_recover' );
			this.get_recover_notification_option( '#rac_admin_cart_recovered_noti' );
			this.get_abandoned_notification_option( '#rac_admin_cart_abandoned_noti' );
			this.get_delete_cart_after_days_option( '#enable_remove_abandon_after_x_days' );
			this.get_delete_email_log_after_days_option( '#enable_remove_email_log_after_x_days' );
			this.get_recovered_notifi_sender_option( "[name=\'rac_recovered_sender_opt\']:checked" );
			this.get_abandoned_notifi_sender_option( "[name=\'rac_abandoned_sender_opt\']:checked" );
			this.get_cartlist_entry_restrict_option( '#custom_restrict' );
			this.get_email_sending_restrict_option( '#custom_exclude' );
			this.get_email_sending_method_option( '#rac_mail_template_send_method' );
			this.get_cartlist_capture_restrict_for_same_email_option( '#rac_remove_carts' );

			// Guest Popup.
			this.get_popup_display_mode( '#rac_popup_display_method' );
			this.get_guest_popup_name( '#rac_show_hide_name_in_popup' );
			this.get_guest_popup_contactno( '#rac_show_hide_contactno_in_popup' );
		},
		toggle_user_select_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_user_field_option( $this );
		},
		toggle_user_custom_msg: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_user_field_msg( $this );
		},
		toggle_guest_select_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_guest_field_option( $this );
		},
		toggle_guest_custom_msg: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_guest_field_msg( $this );
		},
		toggle_recover_cart_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_recovered_cart_option( $this );
		},
		toggle_get_cartlist_capture_restrict_for_same_email_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_cartlist_capture_restrict_for_same_email_option( $this );
		},
		toggle_cartlist_entry_restrict_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_cartlist_entry_restrict_option( $this );
		},
		toggle_recover_notification: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_recover_notification_option( $this );
		},
		toggle_recover_notifi_sender_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_recovered_notifi_sender_option( $this );
		},
		toggle_abandoned_notification: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_abandoned_notification_option( $this );
		},
		toggle_abandoned_notifi_sender_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_abandoned_notifi_sender_option( $this );
		},
		toggle_delete_cart_after_days_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_delete_cart_after_days_option( $this );
		},
		toggle_delete_email_log_after_days_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_delete_email_log_after_days_option( $this );
		},
		toggle_email_sending_restrict_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_email_sending_restrict_option( $this );
		},
		toggle_email_sending_method_option: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );
			General_Tab.get_email_sending_method_option( $this );
		}, toggle_popup_display_mode: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );

			General_Tab.get_popup_display_mode( $this );
		}, toggle_guest_popup_name: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );

			General_Tab.get_guest_popup_name( $this );
		}, toggle_guest_popup_contactno: function ( event ) {
			event.preventDefault();
			var $this = $( event.currentTarget );

			General_Tab.get_guest_popup_contactno( $this );
		},
		get_recover_notification_option: function ( $this ) {
			if ( $( $this ).is( ":checked" ) ) {
				$( '.admin_notification' ).closest( 'tr' ).show();
				$( '.admin_notifi_sender_opt' ).closest( 'tr' ).show();
				General_Tab.get_recovered_notifi_sender_option( "[name=\'rac_recovered_sender_opt\']:checked" );
			} else {
				$( '.admin_notification' ).closest( 'tr' ).hide();
				$( '.admin_notifi_sender_opt' ).closest( 'tr' ).hide();
			}
		},
		get_abandoned_notification_option: function ( $this ) {
			if ( $( $this ).is( ":checked" ) ) {
				$( '.admin_notification_ca' ).closest( 'tr' ).show();
				$( '.admin_notifi_sender_opt_ca' ).closest( 'tr' ).show();
				General_Tab.get_abandoned_notifi_sender_option( "[name=\'rac_abandoned_sender_opt\']:checked" );
			} else {
				$( '.admin_notification_ca' ).closest( 'tr' ).hide();
				$( '.admin_notifi_sender_opt_ca' ).closest( 'tr' ).hide();
			}
		},
		get_user_field_option: function ( $this ) {
			if ( $( $this ).is( ':checked' ) ) {
				$( '.rac_user_notice_info' ).closest( 'tr' ).show();
				General_Tab.get_user_field_msg( '#rac_user_notice_display' );
			} else {
				$( '.rac_user_notice_info' ).closest( 'tr' ).hide();
			}
		},
		get_user_field_msg: function ( $this ) {
			var option = $( $this ).val();
			if ( option != "no" ) {
				$( '#rac_user_pages_for_disp_notice' ).closest( 'tr' ).show();
				$( '#rac_user_notice_msg' ).closest( 'tr' ).show();
			} else {
				$( '#rac_user_pages_for_disp_notice' ).closest( 'tr' ).hide();
				$( '#rac_user_notice_msg' ).closest( 'tr' ).hide();
			}
		},
		get_guest_field_msg: function ( $this ) {
			var option = $( $this ).val();
			if ( option != "no" ) {
				$( '#rac_guest_pages_for_disp_notice' ).closest( 'tr' ).show();
				$( '#rac_guest_notice_msg' ).closest( 'tr' ).show();
			} else {
				$( '#rac_guest_pages_for_disp_notice' ).closest( 'tr' ).hide();
				$( '#rac_guest_notice_msg' ).closest( 'tr' ).hide();
			}
		},
		get_guest_field_option: function ( $this ) {
			if ( $( $this ).is( ':checked' ) ) {
				$( '.rac_guest_notice_info' ).closest( 'tr' ).show();
				General_Tab.get_guest_field_msg( '#rac_guest_notice_display' );
			} else {
				$( '.rac_guest_notice_info' ).closest( 'tr' ).hide();
			}
		},
		get_recovered_cart_option: function ( $this ) {
			if ( $( $this ).is( ':checked' ) ) {
				$( '.rac_cart_depends_parent_new_abandon_option' ).closest( 'tr' ).show();
			} else {
				$( '.rac_cart_depends_parent_new_abandon_option' ).closest( 'tr' ).hide();
			}
		},
		get_recovered_notifi_sender_option: function ( $this ) {
			var sender_opt = $( $this ).val();
			if ( sender_opt == 'woo' ) {
				$( '.local_senders' ).closest( 'tr' ).hide();
			} else {
				$( '.local_senders' ).closest( 'tr' ).show();
			}
		},
		get_abandoned_notifi_sender_option: function ( $this ) {
			var sender_opt = $( $this ).val();
			if ( sender_opt == 'woo' ) {
				$( '.local_senders_ca' ).closest( 'tr' ).hide();
			} else {
				$( '.local_senders_ca' ).closest( 'tr' ).show();
			}
		},
		get_cartlist_capture_restrict_for_same_email_option: function ( $this ) {
			var value = $( $this ).val();
			$( '.rac_remove_hide' ).closest( 'tr' ).hide();
			$( '.rac_remove_status_' + value ).closest( 'tr' ).show();
		},
		get_delete_cart_after_days_option: function ( $this ) {
			var enable_delete_abandon_carts = $( $this ).val();
			if ( enable_delete_abandon_carts === 'no' ) {
				$( '#rac_delete_cart_selection' ).closest( 'tr' ).hide();
				$( '#rac_remove_abandon_after_x_days' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_delete_cart_selection' ).closest( 'tr' ).show();
				$( '#rac_remove_abandon_after_x_days' ).closest( 'tr' ).show();
			}
		},
		get_delete_email_log_after_days_option: function ( $this ) {
			if ( $( $this ).val() === 'no' ) {
				$( '#rac_remove_email_log_after_x_days' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_remove_email_log_after_x_days' ).closest( 'tr' ).show();
			}
		},
		get_cartlist_entry_restrict_option: function ( $this ) {
			var getselectedvalue_fr_cl = $( $this ).val() || [ ];
			$( '.rac_cart_sh_class' ).closest( 'tr' ).hide();
			$( '.rac_show_' + getselectedvalue_fr_cl ).closest( 'tr' ).show();
			$( '#custom_user_name_select_for_restrict_in_cart_list' ).closest( 'tr' ).hide();
			if ( getselectedvalue_fr_cl == 'name' ) {
				$( '#custom_user_name_select_for_restrict_in_cart_list' ).closest( 'tr' ).show();
			}
		},
		get_email_sending_restrict_option: function ( $this ) {
			var getselectedvalue_fr_cl = $( $this ).val() || [ ];
			$( '.rac_email_sh_class' ).closest( 'tr' ).hide();
			$( '.rac_show_email_setting_' + getselectedvalue_fr_cl ).closest( 'tr' ).show();
			$( '#custom_user_name_select' ).closest( 'tr' ).hide();
			if ( getselectedvalue_fr_cl == 'name' ) {
				$( '#custom_user_name_select' ).closest( 'tr' ).show();
			}
		},
		get_email_sending_method_option: function ( $this ) {
			if ( $( $this ).val() !== 'template_time' ) {
				$( '#rac_mail_template_sending_priority' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_mail_template_sending_priority' ).closest( 'tr' ).show();
			}
		}, get_popup_display_mode: function ( $this ) {
			var option = $( $this ).val();
			if ( option == '1' ) {
				$( '#rac_popup_delay_time' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_popup_delay_time' ).closest( 'tr' ).show();
			}
		}, get_guest_popup_name: function ( $this ) {
			var option = $( $this ).val();
			if ( option == '1' ) {
				$( '#rac_force_guest_to_enter_first_last_name' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_force_guest_to_enter_first_last_name' ).closest( 'tr' ).show();
			}
		}, get_guest_popup_contactno: function ( $this ) {
			var option = $( $this ).val();
			if ( option == '1' ) {
				$( '#rac_force_guest_to_enter_phoneno' ).closest( 'tr' ).hide();
			} else {
				$( '#rac_force_guest_to_enter_phoneno' ).closest( 'tr' ).show();
			}
		}
	};
	General_Tab.init();
} );
