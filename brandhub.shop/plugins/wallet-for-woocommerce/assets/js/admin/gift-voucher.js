
/* global wal_gift_voucher_params */

jQuery( function ( $ ) {
	'use strict' ;

	var WAL_Gift_Voucher = {
		init : function ( ) {

			// Trigger a gift voucher type.
			$( document ).on( 'change' , '.wal_module_gift_voucher_type' , this.trigger_gift_voucher_type ) ;
			// Handles the gift voucher generation.
			$( document ).on( 'click' , '.wal-generate-gift-vouchers-btn' , this.handles_gift_voucher_generation ) ;

			this.trigger_on_page_load() ;

		} , trigger_on_page_load : function ( ) {
			WAL_Gift_Voucher.gift_voucher_type( "#wal_module_fund_transfer_otp_enabled" ) ;

		} , trigger_gift_voucher_type : function ( event ) {
			event.preventDefault( ) ;
			var $this = $( event.currentTarget ) ;

			WAL_Gift_Voucher.gift_voucher_type( $this ) ;
		} , gift_voucher_type : function ( $this ) {
			if ( '2' == $( $this ).val() ) {
				$( '.wal_module_gift_voucher_excluded_alphabets' ).closest( 'tr' ).show( ) ;
			} else {
				$( '.wal_module_gift_voucher_excluded_alphabets' ).closest( 'tr' ).hide( ) ;
			}

		} , handles_gift_voucher_generation : function ( event ) {
			event.preventDefault( ) ;

			var $this = $( event.currentTarget ) ,
					wrapper = $( $this ).closest( '.wal_module_setting_inner_content-gift_voucher' ) ;

			if ( !confirm( wal_gift_voucher_params.confirm_msg ) ) {
				return false ;
			}

			WAL_Gift_Voucher.block( wrapper , wal_gift_voucher_params.processing_msg ) ;

			var data = ( {
				action : 'wal_generate_gift_vouchers' ,
				form_data : WAL_Gift_Voucher.getFormData() ,
				wal_security : wal_gift_voucher_params.gift_voucher_nonce ,
			} ) ;

			$.post( ajaxurl , data , function ( res ) {
				if ( true === res.success ) {
					alert( res.data.msg ) ;
					window.location.reload( true ) ;
				} else {
					alert( res.data.error ) ;
				}
				WAL_Gift_Voucher.unblock( wrapper ) ;
			} ) ;
		} , getFormData : function () {
			var data = { } ;

			$.each( $( '.wal-wallet-modules-form' ).serializeArray() , function ( index , item ) {
				if ( item.name.indexOf( '[]' ) !== -1 ) {
					item.name = item.name.replace( '[]' , '' ) ;
					data[ item.name ] = $.makeArray( data[ item.name ] ) ;
					data[ item.name ].push( item.value ) ;
				} else {
					data[ item.name ] = item.value ;
				}
			} ) ;

			return data ;
		} , block : function ( id , msg = null ) {
			if ( !WAL_Gift_Voucher.is_blocked( id ) ) {
				$( id ).addClass( 'processing' ).block( {
					message : msg ,
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
	WAL_Gift_Voucher.init( ) ;
} ) ;
