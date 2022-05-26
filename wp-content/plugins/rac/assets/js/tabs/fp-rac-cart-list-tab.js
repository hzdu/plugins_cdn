/* global fp_rac_cartlist_tab_obj, ajaxurl */

jQuery( function ( $ ) {
	'use strict' ;

	if ( typeof fp_rac_cartlist_tab_obj === 'undefined' ) {
		return false ;
	}

	var Cart_List_Tab = {
		init : function () {
			$( document ).on( 'click' , '.rac_mailstatus_check_indi' , this.stop_start_sending_email_current_cartlist ) ;
			$( document ).on( 'click' , '.rac_manual_recovered' , this.manaul_recovered_current_cart_list ) ;
			$( document ).on( 'change' , '.rac_mail_status_checkboxes' , this.select_mailstatus_current_checkbox ) ;
			$( document ).on( 'dblclick' , '.rac_edit_option' , this.update_guest_email ) ;
			$( document ).on( 'click' , '.rac_customer_email_subscribe' , this.email_subscribe_unsubscribe_function ) ;
			$( document ).on( 'click' , '.rac_cartlist_email_status_info' , this.email_info_display_function ) ;
			$( document ).on( 'click' , '.rac_cartlist_manual_recover_popup_link' , this.manual_recover_popup_display_function ) ;
			$( document ).on( 'click' , '.rac_manual_order_entry_btn' , this.manual_recover_order_entry_function ) ;
			$( document ).on( 'click' , '.rac_popup_close' , this.manual_recover_popup_close_function ) ;
			$( document ).on( 'click' , '.rac_email_info_popup_close_btn' , this.manual_recover_popup_close_function ) ;
		} ,
		select_mailstatus_current_checkbox : function ( event ) {
			event.preventDefault() ;
			var $this = $( event.currentTarget ) ;
			if ( $( $this ).is( ':checked' ) ) {
				$( $this ).nextAll( '.rac_mailstatus_check_indi' ).removeAttr( 'disabled' ) ;
			} else {
				$( $this ).nextAll( '.rac_mailstatus_check_indi' ).attr( 'disabled' , 'disabled' ) ;
			}
		} ,
		manaul_recovered_current_cart_list : function ( event ) {
			event.preventDefault() ;
			var $this = $( event.currentTarget ) ;
			var message = confirm( fp_rac_cartlist_tab_obj.rac_cart_list_manual_recovered_alert ) ;
			if ( message == true ) {
				var row_id = $( $this ).data( 'racmrid' ) ;
				jQuery( $this ).hide() ;
				jQuery( '#rac_load_image' + row_id ).css( 'display' , 'block' ) ;
				var data = {
					row_id : row_id ,
					action : 'rac_manual_recovered' ,
					rac_security : fp_rac_cartlist_tab_obj.recover_status
				}
				$.ajax( {
					type : 'POST' ,
					url : ajaxurl ,
					data : data
				} ).done( function ( response ) {
					window.location.reload() ;
				} ) ;
			}
		} ,
		email_subscribe_unsubscribe_function : function ( event ) {
			event.preventDefault() ;
			var $this = $( event.currentTarget ) ;
			var user_id = $( $this ).data( 'user_id' ) ;
			var email_id = $( $this ).data( 'email_id' ) ;
			var dataclicked = $( $this ).data( 'value' ) ;
			var data = {
				action : 'fp_rac_undo_unsubscribe' ,
				getcurrentuser : user_id ,
				email_id : email_id ,
				dataclicked : dataclicked ,
				rac_security : fp_rac_cartlist_tab_obj.rac_unsubcribe_nonce
			} ;
			$.ajax( {
				type : 'POST' ,
				url : ajaxurl ,
				data : data
			} ).done( function ( response ) {
				window.location.reload() ;
			} ) ;
		} ,
		email_info_display_function : function ( event ) {
			event.preventDefault() ;
			var $this = $( event.currentTarget ) ;
			var data = {
				action : 'rac_cartlist_email_info_popup' ,
				cart_list_id : $( $this ).data( 'rac_cart_list_id' ) ,
				rac_security : fp_rac_cartlist_tab_obj.rac_cart_list_email_info_disp_nonce ,
			} ;
			$.ajax( {
				type : 'POST' ,
				url : ajaxurl ,
				data : data
			} ).done( function ( response ) {
				if ( true === response.success ) {
					$( response.data.content ).appendTo( 'body' ) ;
					$( document ).on( 'click' , 'body' , Cart_List_Tab.manual_recover_popup_outside_close_function ) ;
				} else {
					window.alert( response.data.error ) ;
				}
			} ) ;
		} ,
		manual_recover_popup_display_function : function ( event ) {
			event.preventDefault() ;
			var $this = $( event.currentTarget ) ;
			var data = {
				action : 'rac_manual_recover_popup' ,
				cart_list_id : $( $this ).data( 'rac_cart_list_id' ) ,
				rac_security : fp_rac_cartlist_tab_obj.rac_manual_order_id_nonce ,
			} ;
			$.ajax( {
				type : 'POST' ,
				url : ajaxurl ,
				data : data
			} ).done( function ( response ) {
				if ( true === response.success ) {
					$( response.data.content ).appendTo( 'body' ) ;
					jQuery( document ).on( 'click' , 'body' , Cart_List_Tab.manual_recover_popup_outside_close_function ) ;
				} else {
					window.alert( response.data.error ) ;
				}
			} ) ;
		} ,
		manual_recover_popup_close_function : function ( event ) {
			event.preventDefault() ;
			var $this = $( event.currentTarget ) ;
			$( $this ).closest( 'div.fp_rac_popup_wrapper' ).remove() ;
		} ,
		manual_recover_popup_outside_close_function : function ( event ) {
			if ( $( event.target ).attr( 'class' ) == "fp_rac_popup_wrapper" ) {
				$( '.fp_rac_popup_content' ).parent().remove() ;
				$( '.fp_rac_email_info_popup_content' ).parent().remove() ;
			}
		} ,
		manual_recover_order_entry_function : function ( event ) {
			event.preventDefault() ;
			var $this = $( event.currentTarget ) ;
			var data = {
				action : 'rac_manual_recover_order_entry' ,
				cart_list_id : $( '.rac_cart_list_id' ).val() ,
				manual_order_id : $( '.rac_manual_order_id_num' ).val() ,
				rac_security : fp_rac_cartlist_tab_obj.rac_manual_order_id_nonce ,
			} ;
			$.ajax( {
				type : 'POST' ,
				url : ajaxurl ,
				data : data
			} ).done( function ( response ) {
				if ( true === response.success ) {
					window.alert( response.data.content ) ;
					window.location.reload()
				} else {
					window.alert( response.data.error ) ;
				}
			} ) ;
		} ,
		stop_start_sending_email_current_cartlist : function ( event ) {
			event.preventDefault() ;
			var $this = $( event.currentTarget ) ;
			var row_id = $( $this ).data( 'racmoptid' ) ;
			var obj = $( $this ) ;
			$( $this ).attr( 'disabled' , true ) ;
			var current_state = $( $this ).data( 'currentsate' ) ;
			var data = {
				row_id : row_id ,
				action : 'mailstatus_cartlist' ,
				status : current_state ,
				rac_security : fp_rac_cartlist_tab_obj.mailstatus_cartlist
			}
			$.ajax( { type : 'POST' , url : ajaxurl , data : data } ).done( function ( response ) {
				obj.data( 'currentsate' , response ) ;
				if ( current_state == 'SEND' ) {
					obj.text( 'Stop Mailing' ) ;
				} else {
					obj.text( 'Start Mailing' ) ;
				}
				$( '.rac_mail_status_checkboxes' ).attr( 'checked' , false ) ;
			} ) ;

		} ,
		update_guest_email : function ( event ) {
			event.preventDefault() ;
			var $this = $( event.currentTarget ) ;
			$( $this ).next().remove() ;
			$( $this ).parent().removeAttr( 'class' ) ;
			var p = $( $this ).text() ;
			var value = $( '<div class="raceditemail"><textarea class="rac_content_get" name="one" style="width:200px;height:100px;">' + p + '</textarea></br><input class="rac_save" type="button" value="' + fp_rac_cartlist_tab_obj.rac_save_label + '"/></div>' ) ;
			var one = $( '.rac_content_get' ).val() ;
			var id = $( $this ).attr( 'data-id' ) ;
			$( '.rac_content_get' ).parent().html( one ) ;
			$( $this ).empty() ;
			$( $this ).append( value ) ;
			$( '.rac_save' ).click( function () {
				$( '.rac_save' ).prop( 'disabled' , true ) ;
				var email = $( '.rac_content_get' ).val() ;
				var data = {
					action : 'edit_value_update_now' ,
					email : email ,
					id : id ,
					rac_security : fp_rac_cartlist_tab_obj.update_guest_email
				}

				$.ajax( {
					type : 'POST' ,
					url : ajaxurl ,
					data : data
				} ).done( function ( response ) {
					$( '.rac_save' ).prop( 'disabled' , false ) ;
					var p = $( $this ).text() ;
					var value = $( '<div class="raceditemail"><textarea class="rac_content_get" name="one" style="width:200px;height:100px;">' + p + '</textarea></br><input class="rac_save" type="button" value="' + fp_rac_cartlist_tab_obj.rac_save_label + '"/></div>' ) ;
					var one = $( '.rac_content_get' ).val() ;
					var id = $( $this ).attr( 'data-id' ) ;
					$( '.rac_content_get' ).parent().html( one ) ;
					$( $this ).parent().parent().parent().addClass( 'rac_tool_info' ) ;
				} ) ;
			} ) ;
		}

	} ;
	Cart_List_Tab.init() ;
} ) ;
