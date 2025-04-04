
jQuery( function ( $ ) {
	'use strict';

	var WAL_Fund_Transfer = {
		init: function ( ) {
			// Trigger a fund tranasfer.
			$( document ).on( 'change', '#wal_module_transfer_enabled', this.trigger_fund_transfer );
			// Trigger a transfer fee.
			$( document ).on( 'change', '#wal_module_fund_transfer_fee_enabled', this.trigger_transfer_fee );
			// Trigger a fund request.
			$( document ).on( 'change', '#wal_module_fund_request_enabled', this.trigger_fund_request );
			// Trigger a OTP options.
			$( document ).on( 'change', '#wal_module_fund_transfer_otp_enabled', this.trigger_otp_options );

			this.trigger_on_page_load();

		}, trigger_on_page_load: function ( ) {
			WAL_Fund_Transfer.fund_transfer( "#wal_module_transfer_enabled" );
			WAL_Fund_Transfer.fund_request( "#wal_module_fund_request_enabled" );
			WAL_Fund_Transfer.otp_options( "#wal_module_fund_transfer_otp_enabled" );

		}, trigger_fund_transfer: function ( event ) {
			event.preventDefault( );
			var $this = $( event.currentTarget );

			WAL_Fund_Transfer.fund_transfer( $this );
		}, trigger_transfer_fee: function ( event ) {
			event.preventDefault( );
			var $this = $( event.currentTarget );

			WAL_Fund_Transfer.transfer_fee( $this );
		}, trigger_fund_request: function ( event ) {
			event.preventDefault( );
			var $this = $( event.currentTarget );

			WAL_Fund_Transfer.fund_request( $this );
		}, trigger_otp_options: function ( event ) {
			event.preventDefault( );
			var $this = $( event.currentTarget );

			WAL_Fund_Transfer.otp_options( $this );
		}, fund_transfer: function ( $this ) {
			if ( $( $this ).is( ':checked' ) ) {
				$( '.wal-fund-transfer-field' ).closest( 'tr' ).show( );
				WAL_Fund_Transfer.transfer_fee( "#wal_module_fund_transfer_fee_enabled" );
			} else {
				$( '.wal-fund-transfer-field' ).closest( 'tr' ).hide( );
			}

		}, transfer_fee: function ( $this ) {

			if ( $( $this ).is( ':checked' ) ) {
				$( '#wal_module_fund_transfer_fee_type' ).closest( 'tr' ).show( );
				$( '#wal_module_fund_transfer_fee_amount' ).closest( 'tr' ).show( );
			} else {
				$( '#wal_module_fund_transfer_fee_type' ).closest( 'tr' ).hide( );
				$( '#wal_module_fund_transfer_fee_amount' ).closest( 'tr' ).hide( );
			}

		}, fund_request: function ( $this ) {

			if ( $( $this ).is( ':checked' ) ) {
				$( '.wal-fund-request-field' ).closest( 'tr' ).show( );
			} else {
				$( '.wal-fund-request-field' ).closest( 'tr' ).hide( );
			}

		}, otp_options: function ( $this ) {
			if ( $( $this ).is( ':checked' ) ) {
				$( '.wal-fund-transfer-otp-field' ).closest( 'tr' ).show( );
			} else {
				$( '.wal-fund-transfer-otp-field' ).closest( 'tr' ).hide( );
			}
		}, block: function ( id ) {
			if ( !WAL_Fund_Transfer.is_blocked( id ) ) {
				$( id ).addClass( 'processing' ).block( {
					message: null,
					overlayCSS: {
						background: '#fff',
						opacity: 0.7
					}
				} );
			}
		}, unblock: function ( id ) {
			$( id ).removeClass( 'processing' ).unblock();
		}, is_blocked: function ( id ) {
			return $( id ).is( '.processing' ) || $( id ).parents( '.processing' ).length;
		}
	};
	WAL_Fund_Transfer.init( );
} );
