
/* global wal_wallet_withdrawal_params */

jQuery(function ($) {
	'use strict';

	var WAL_Wallet_Withdrawal = {
		init: function ( ) {

			// Trigger a withdrawal fee.
			$(document).on('change', '.wal-wallet-withdrawal-gateway-fee', this.trigger_withdrawal_fee);
			// Trigger a OTP options.
			$(document).on('change', '#wal_module_wallet_withdrawal_otp_enabled', this.trigger_otp_options);
			// Validate the withdraw request when approve it.
			$(document).on('click', '.wal-approve-post', this.validate_withdrawal_approve_request);
			// Validate the withdraw request when cancel it.
			$(document).on('click', '.wal-cancel-post', this.validate_withdrawal_cancel_request);
			// Handle wallet withdraw edit post.
			$(document).on('click', '.wal-edit-post', this.handle_wallet_withdrawal_edit_post);
			// Wallet withdrawal cancelled reason popup.
			$(document).on('click', '.wal-wallet-withdrawal-cancelled-reason', this.wallet_withdrawal_cancelled_reason_popup);
			// Cancel wallet withdrawal
			$(document).on('click', '.wal-withdrawal-cancel-btn', this.cancel_wallet_withdrawal);

			//Paypal Gateway.
			// Trigger a paypal credentials options.
			$(document).on('change', '#wal_module_withdrawal_paypal_sandbox_enabled', this.trigger_paypal_credentials_options);

			this.trigger_on_page_load();

		}, trigger_on_page_load: function ( ) {
			WAL_Wallet_Withdrawal.otp_options("#wal_module_wallet_withdrawal_otp_enabled");
			WAL_Wallet_Withdrawal.withdrawal_fee(".wal-wallet-withdrawal-gateway-fee");

			//Paypal Gateway.
			WAL_Wallet_Withdrawal.paypal_credentials_options("#wal_module_withdrawal_paypal_sandbox_enabled");
		}, trigger_withdrawal_fee: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget);

			WAL_Wallet_Withdrawal.withdrawal_fee($this);
		}, trigger_otp_options: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget);

			WAL_Wallet_Withdrawal.otp_options($this);
		}, trigger_paypal_credentials_options: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget);

			WAL_Wallet_Withdrawal.paypal_credentials_options($this);
		}, withdrawal_fee: function ($this) {
			if ($($this).is(':checked')) {
				$('.wal-wallet-withdrawal-gateway-fee-field').closest('tr').show( );
			} else {
				$('.wal-wallet-withdrawal-gateway-fee-field').closest('tr').hide( );
			}
		}, otp_options: function ($this) {
			if ($($this).is(':checked')) {
				$('.wal-wallet-withdrawal-otp-field').closest('tr').show( );
			} else {
				$('.wal-wallet-withdrawal-otp-field').closest('tr').hide( );
			}
		}, paypal_credentials_options: function ($this) {
			if ($($this).is(':checked')) {
				$('.wal-wallet-withdrawal-paypal-gateway-live-credentials').closest('tr').hide( );
				$('.wal-wallet-withdrawal-paypal-gateway-sandbox-credentials').closest('tr').show( );
			} else {
				$('.wal-wallet-withdrawal-paypal-gateway-live-credentials').closest('tr').show( );
				$('.wal-wallet-withdrawal-paypal-gateway-sandbox-credentials').closest('tr').hide( );
			}
		}, validate_withdrawal_approve_request: function (event) {
			var message = confirm(wal_wallet_withdrawal_params.approve_confirm_msg);
			if (!message) {
				event.preventDefault();
				return;
			}
		}, validate_withdrawal_cancel_request: function (event) {
			var message = confirm(wal_wallet_withdrawal_params.cancel_confirm_msg);
			if (!message) {
				event.preventDefault();
				return;
			}
			WAL_Wallet_Withdrawal.wallet_withdrawal_cancel_popup(event);
		}, handle_wallet_withdrawal_edit_post: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget),
					data = ({
						action: 'wal_set_wallet_withdrawal_edit_post',
						withdrawal_id: $this.data('id'),
						wal_security: wal_wallet_withdrawal_params.wallet_withdrawal_nonce,
					});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					var parse_url = new DOMParser().parseFromString(res.data.link, "text/html");
					var url = parse_url.documentElement.textContent;
					window.location.href = url;
				} else {
					alert(res.data.error);
				}
			});
		}, wallet_withdrawal_cancelled_reason_popup: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget),
					wrapper = $this.closest('table');
			WAL_Wallet_Withdrawal.block(wrapper);
			var data = ({
				action: 'wal_get_wallet_withdrawal_cancelled_reason',
				withdrawal_id: $this.data('id'),
				wal_security: wal_wallet_withdrawal_params.wallet_withdrawal_nonce
			});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					$('#wal-wallet-withdrawal-modal').html(res.data.html);
					$(document.body).trigger('wal-enhanced-lightcase');
					$('.wal-popup').trigger('click');
				} else {
					alert(res.data.error);
				}
				WAL_Wallet_Withdrawal.unblock(wrapper);
			});
		}, wallet_withdrawal_cancel_popup: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget),
					data = ({
						action: 'wal_get_wallet_withdrawal_cancel_popup_content',
						withdrawal_id: $this.data('id'),
						wal_security: wal_wallet_withdrawal_params.wallet_withdrawal_nonce
					});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					$('#wal-wallet-withdrawal-modal').html(res.data.html);
					$(document.body).trigger('wal-enhanced-lightcase');
					$('.wal-popup').trigger('click');
				} else {
					alert(res.data.error);
				}
			});
		}, cancel_wallet_withdrawal: function (event) {
			event.preventDefault( );
			var wrapper = $('.wal-wallet-withdrawal-cancel-wrapper');
			WAL_Wallet_Withdrawal.block(wrapper);
			var data = ({
				action: 'wal_cancel_wallet_withdrawal',
				withdrawal_id: $('.wal-withdrawal-id').val(),
				reason: $('#wal_withdrawal_cancelled_reason').val(),
				wal_security: wal_wallet_withdrawal_params.wallet_withdrawal_nonce
			});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					window.location.reload(true);
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
				});
			}
		}, unblock: function (id) {
			$(id).removeClass('processing').unblock();
		}, is_blocked: function (id) {
			return $(id).is('.processing') || $(id).parents('.processing').length;
		}
	};
	WAL_Wallet_Withdrawal.init( );
});
