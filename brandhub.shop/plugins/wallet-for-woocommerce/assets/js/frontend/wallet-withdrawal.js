
/* global wal_frontend_params, wal_wallet_withdrawal_params */

jQuery( function ( $ ) {
	'use strict';

	if ( typeof wal_frontend_params === 'undefined' ) {
		return false;
	}

	var WAL_Wallet_Withdrawal = {

		init: function ( ) {
			// Handle the wallet withdrawal payment gateway toggle.
			$( document ).on( 'change', '.wal-withdrawal-payment-gateway', this.toggle_wallet_withdrawal_payment_gateway );
			// Handle the wallet withdrawal settings form.
			$( document ).on( 'click', '.wal-withdrawal-settings-button', this.handle_wallet_withdrawal_settings_form );
			// Handle the wallet withdrawal request form.
			$( document ).on( 'click', '.wal-withdrawal-request-form-wrapper .wal-form-button', this.handle_wallet_withdrawal_request_form );
			// Pagination for wallet withdrawal transactions.
			$(document).on('click', '.wal-dashboard-wallet-withdrawal-transactions-table .wal_pagination', this.wallet_withdrawal_transactions_pagination);
			// User withdrawal cancelled reason
			$(document).on('click', '.wal-user-withdrawal-cancelled-reason', this.user_withdrawal_cancelled_reason);

			this.trigger_on_page_load();

		}, trigger_on_page_load: function ( ) {
			WAL_Wallet_Withdrawal.handle_wallet_withdrawal_payment_gateway( '.wal-withdrawal-payment-gateway' );
		}, toggle_wallet_withdrawal_payment_gateway: function ( event ) {
			event.preventDefault( );
			var $this = $( event.currentTarget );

			WAL_Wallet_Withdrawal.handle_wallet_withdrawal_payment_gateway( $this );
		}, handle_wallet_withdrawal_payment_gateway: function ( $this ) {
			var value = $( $this ).val();

			$( '.wal-withdrawal-gateway-fields' ).closest( 'p' ).hide();
			$( '.wal-' + value + '-gateway-fields' ).closest( 'p' ).show();
		}, wallet_withdrawal_transactions_pagination: function ( event ) {
			event.preventDefault( );
			var $this = $( event.currentTarget ),
					table = $this.closest( 'table.wal-dashboard-wallet-withdrawal-transactions-table' ),
					table_body = table.find( 'tbody' ),
					page_number = $this.data( 'page' );

			WAL_Wallet_Withdrawal.block( table_body );

			var data = ( {
				action: 'wal_wallet_withdrawal_transactions_pagination',
				page_number: page_number,
				wal_security: wal_frontend_params.pagination_nonce,
			} );

			$.post( wal_frontend_params.ajax_url, data, function ( res ) {

				if ( true === res.success ) {
					table_body.html( res.data.html );

					WAL_Wallet_Withdrawal.handle_pagination( table, page_number );
				} else {
					alert( res.data.error );
				}

				WAL_Wallet_Withdrawal.unblock( table_body );
			}
			);
		}, handle_wallet_withdrawal_settings_form: function ( event ) {
			var $this = $( event.currentTarget ),
					wrapper = $this.closest( '.wal-withdrawal-settings-form-wrapper' );

			WAL_Wallet_Withdrawal.block( wrapper );

			return true;
		}, handle_wallet_withdrawal_request_form: function ( event ) {
			var $this = $( event.currentTarget ),
					wrapper = $this.closest( '.wal-withdrawal-request-form-wrapper' );

			WAL_Wallet_Withdrawal.block( wrapper );

			return true;
		}, handle_pagination: function ( table, page_number ) {
			table.find( '.wal_pagination' ).removeClass( 'current' );
			table.find( '.wal_pagination_' + page_number ).addClass( 'current' );

			var next_page = page_number;
			if ( page_number > 1 ) {
				next_page = page_number - 1;
			}

			var last_page = table.find( '.wal_last_pagination' ).data( 'page' );
			if ( page_number < last_page ) {
				last_page = page_number + 1;
			}

			table.find( '.wal_next_pagination' ).data( 'page', last_page );
			table.find( '.wal_prev_pagination' ).data( 'page', next_page );
		}, format_price: function ( price ) {
			return accounting.formatMoney( price, {
				symbol: wal_frontend_params.currency_symbol,
				decimal: wal_frontend_params.currency_decimal_sep,
				thousand: wal_frontend_params.currency_thousand_sep,
				precision: wal_frontend_params.currency_num_decimals,
				format: wal_frontend_params.currency_format
			});
		}, user_withdrawal_cancelled_reason: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget),
					wrapper = $('.wal-frontend-table');
								
			WAL_Wallet_Withdrawal.block(wrapper);
			var data = ({
				action: 'wal_get_user_withdrawal_cancelled_reason',
				withdrawal_id: $this.data('id'),
				wal_security: wal_wallet_withdrawal_params.wallet_withdrawal_nonce
			});

			$.post(wal_frontend_params.ajax_url, data, function (res) {
				if (true === res.success) {      
					$('#wal-wallet-cancelled-reason-popup').html(res.data.html);
					$(document.body).trigger('wal-enhanced-lightcase');
					$('.wal-popup').trigger('click');
				} else {
					alert(res.data.error);
				}
				WAL_Wallet_Withdrawal.unblock(wrapper);
			});
		}, block: function (id) {
			if (!WAL_Wallet_Withdrawal.is_blocked(id)) {
				$(id).addClass('processing').block({
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

	WAL_Wallet_Withdrawal.init( );
} );
