
/* global wal_fund_transfer_params, wal_frontend_params */

jQuery( function ( $ ) {
	'use strict' ;

	if ( typeof wal_fund_transfer_params === 'undefined' || typeof wal_frontend_params === 'undefined' ) {
		return false ;
	}

	var WAL_Fund_Transfer = {

		init : function ( ) {

			// Handle the user name validation for fund transfer.
			$( document ).on( 'change' , '.wal-fund-transfer-user-name' , this.handle_user_name_validation_for_transfer ) ;
			// Handle the user name validation for fund request.
			$( document ).on( 'change' , '.wal-fund-request-user-name' , this.handle_user_name_validation_for_request ) ;
			// Handle the fund transfer fee.
			$( document ).on( 'keyup , change, focus' , '.wal-fund-transfer-amount' , this.handle_fund_transfer_fee ) ;
			// Handle the fund request accept.
			$( document ).on( 'click' , '.wal-accept-fund-request' , this.handle_fund_request_accept ) ;
			// Handle the fund request decline.
			$( document ).on( 'click' , '.wal-decline-fund-request' , this.handle_fund_request_decline ) ;
			// Handle the fund request cancel.
			$( document ).on( 'click' , '.wal-cancel-fund-request' , this.handle_fund_request_cancel ) ;
			// Pagination for fund transfer transaction logs.
			$( document ).on( 'click' , '.wal-dashboard-fund-transfer-transaction-table .wal_pagination' , this.fund_transfer_transaction_logs_pagination ) ;

			// Handles the fund transfer form.
			$( document ).on( 'click' , '.wal-fund-transfer-button' , this.handle_fund_transfer_form ) ;
			// Handles the fund transfer form confirmation.
			$( document ).on( 'click' , '.wal-fund-transfer-confirm-button' , this.handle_fund_transfer_form_confirmation ) ;
			// Handles the fund request form.
			$( document ).on( 'click' , '.wal-fund-request-button' , this.handle_fund_request_form ) ;

		} , handle_user_name_validation_for_transfer : function ( event ) {
			event.preventDefault( ) ;

			WAL_Fund_Transfer.block( '.wal-fund-transfer-form' ) ;

			var data = ( {
				action : 'wal_user_validation_for_transfer' ,
				user_name : $(this).val() ,
				wal_security : wal_fund_transfer_params.user_nonce ,
			} ) ;

			$.post( wal_frontend_params.ajax_url , data , function ( res ) {

				if ( true === res.success ) {
					$('.wal-fund-transfer-user-id').val( res.data.user_id ) ;
					$('.wal-fund-transfer-button').prop('disabled',false);
				} else {
					$('.wal-fund-transfer-button').prop('disabled',true);
					alert( res.data.error ) ;
				}

				WAL_Fund_Transfer.unblock( '.wal-fund-transfer-form' ) ;
			} ) ;
		} , handle_user_name_validation_for_request : function ( event ) {
			event.preventDefault( ) ;

			WAL_Fund_Transfer.block( '.wal-fund-request-form' ) ;

			var data = ( {
				action : 'wal_user_validation_for_request' ,
				user_name : $(this).val() ,
				wal_security : wal_fund_transfer_params.user_nonce ,
			} ) ;

			$.post( wal_frontend_params.ajax_url , data , function ( res ) {

				if ( true === res.success ) {
					$('.wal-fund-request-user-id').val( res.data.user_id ) ;
					$('.wal-fund-request-button').prop('disabled',false);
				} else {
					$('.wal-fund-request-button').prop('disabled',true);
					alert( res.data.error ) ;
				}

				WAL_Fund_Transfer.unblock( '.wal-fund-request-form' ) ;
			} ) ;
		} , handle_fund_transfer_fee : function ( event ) {
			event.preventDefault( ) ;

			if ( 'yes' != wal_fund_transfer_params.fee_enabled || '2' != wal_fund_transfer_params.fee_type ) {
				return false ;
			}

			var $this = $( event.currentTarget ) ,
					price = $this.val() ;
							   
			var $fee = ( wal_fund_transfer_params.fee_value ) ? ( wal_fund_transfer_params.fee_value / 100 ) * price : wal_fund_transfer_params.fee_value ;

			$( '.wal-fund-transfer-fee' ).html( WAL_Fund_Transfer.format_price( $fee ) ) ;

			return true ;

		} , fund_transfer_transaction_logs_pagination : function ( event ) {
			event.preventDefault( ) ;
			var $this = $( event.currentTarget ) ,
					table = $this.closest( 'table.wal-dashboard-fund-transfer-transaction-table' ) ,
					table_body = table.find( 'tbody' ) ,
					page_number = $this.data( 'page' ) ;

			WAL_Fund_Transfer.block( table_body ) ;

			var data = ( {
				action : 'wal_fund_transfer_transaction_logs_pagination' ,
				page_number : page_number ,
				wal_security : wal_frontend_params.pagination_nonce ,
			} ) ;

			$.post( wal_frontend_params.ajax_url , data , function ( res ) {

				if ( true === res.success ) {
					table_body.html( res.data.html ) ;

					WAL_Fund_Transfer.handle_pagination( table , page_number ) ;
				} else {
					alert( res.data.error ) ;
				}

				WAL_Fund_Transfer.unblock( table_body ) ;
			}
			) ;
		} , handle_fund_request_accept : function ( event ) {
			event.preventDefault( ) ;
			var $this = $( event.currentTarget ) ,
					wrapper = $this.closest( '.wal-fund-transfer-transaction-logs' ) ,
					transaction_id = wrapper.find( '.wal-fund-transfer-transaction-id' ).val() ;

			if ( !confirm( wal_fund_transfer_params.accept_alert_msg ) ) {
				return false ;
			}

			WAL_Fund_Transfer.block( wrapper ) ;

			var data = ( {
				action : 'wal_accept_fund_request' ,
				transaction_id : transaction_id ,
				wal_security : wal_fund_transfer_params.fund_transfer_nonce ,
			} ) ;

			$.post( wal_frontend_params.ajax_url , data , function ( res ) {

				if ( true === res.success ) {
					wrapper.html( res.data.html ) ;
				} else {
					alert( res.data.error ) ;
				}

				WAL_Fund_Transfer.unblock( wrapper ) ;
			} ) ;
		} , handle_fund_request_decline : function ( event ) {
			event.preventDefault( ) ;
			var $this = $( event.currentTarget ) ,
					wrapper = $this.closest( '.wal-fund-transfer-transaction-logs' ) ,
					transaction_id = wrapper.find( '.wal-fund-transfer-transaction-id' ).val() ;

			if ( !confirm( wal_fund_transfer_params.decline_alert_msg ) ) {
				return false ;
			}

			WAL_Fund_Transfer.block( wrapper ) ;

			var data = ( {
				action : 'wal_decline_fund_request' ,
				transaction_id : transaction_id ,
				wal_security : wal_fund_transfer_params.fund_transfer_nonce ,
			} ) ;

			$.post( wal_frontend_params.ajax_url , data , function ( res ) {

				if ( true === res.success ) {
					wrapper.html( res.data.html ) ;
				} else {
					alert( res.data.error ) ;
				}

				WAL_Fund_Transfer.unblock( wrapper ) ;
			} ) ;
		} , handle_fund_request_cancel : function ( event ) {
			event.preventDefault( ) ;
			var $this = $( event.currentTarget ) ,
					wrapper = $this.closest( '.wal-fund-transfer-transaction-logs' ) ,
					transaction_id = wrapper.find( '.wal-fund-transfer-transaction-id' ).val() ;

			if ( !confirm( wal_fund_transfer_params.cancel_alert_msg ) ) {
				return false ;
			}

			WAL_Fund_Transfer.block( wrapper ) ;

			var data = ( {
				action : 'wal_cancel_fund_request' ,
				transaction_id : transaction_id ,
				wal_security : wal_fund_transfer_params.fund_transfer_nonce ,
			} ) ;

			$.post( wal_frontend_params.ajax_url , data , function ( res ) {

				if ( true === res.success ) {
					wrapper.html( res.data.html ) ;
				} else {
					alert( res.data.error ) ;
				}

				WAL_Fund_Transfer.unblock( wrapper ) ;
			} ) ;
		} , handle_pagination : function ( table , page_number ) {
			table.find( '.wal_pagination' ).removeClass( 'current' ) ;
			table.find( '.wal_pagination_' + page_number ).addClass( 'current' ) ;

			var next_page = page_number ;
			if ( page_number > 1 ) {
				next_page = page_number - 1 ;
			}

			var last_page = table.find( '.wal_last_pagination' ).data( 'page' ) ;
			if ( page_number < last_page ) {
				last_page = page_number + 1 ;
			}

			table.find( '.wal_next_pagination' ).data( 'page' , last_page ) ;
			table.find( '.wal_prev_pagination' ).data( 'page' , next_page ) ;
		} , format_price : function ( price ) {
			return accounting.formatMoney( price , {
				symbol : wal_frontend_params.currency_symbol ,
				decimal : wal_frontend_params.currency_decimal_sep ,
				thousand : wal_frontend_params.currency_thousand_sep ,
				precision : wal_frontend_params.currency_num_decimals ,
				format : wal_frontend_params.currency_format
			} ) ;
		} , handle_fund_transfer_form : function ( event ) {
			var $this = $( event.currentTarget ) ,
					wrapper = $this.closest( '.wal-fund-transfer-form-wrapper' ) ;

			WAL_Fund_Transfer.block( wrapper ) ;

			return true ;
		} , handle_fund_transfer_form_confirmation : function ( event ) {
			var $this = $( event.currentTarget ) ,
					wrapper = $this.closest( '.wal-fund-transfer-form-wrapper' ) ;

			WAL_Fund_Transfer.block( wrapper ) ;

			return true ;
		} , handle_fund_request_form : function ( event ) {
			var $this = $( event.currentTarget ) ,
					wrapper = $this.closest( '.wal-fund-request-form-wrapper' ) ;

			if ( !confirm( wal_fund_transfer_params.request_alert_msg ) ) {
				event.preventDefault( ) ;
				return false ;
			}

			WAL_Fund_Transfer.block( wrapper ) ;

			return true ;
		} , block : function ( id ) {
			if ( !WAL_Fund_Transfer.is_blocked( id ) ) {
				$( id ).addClass( 'processing' ).block( {
					message : null ,
					overlayCSS : {
						background : '#fff' ,
						opacity : 0.7
					}
				} ) ;
			}
		} , unblock : function ( id ) {
			$( id ).removeClass( 'processing' ).unblock() ;
		} , is_blocked : function ( id ) {
			return $( id ).is( '.processing' ) || $( id ).parents( '.processing' ).length ;
		}
	} ;

	WAL_Fund_Transfer.init( ) ;
} ) ;
