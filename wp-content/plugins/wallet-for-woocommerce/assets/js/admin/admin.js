/* global wal_admin_params, ajaxurl */

jQuery(function ($) {
	'use strict';

	if (typeof wal_admin_params === 'undefined') {
		return false;
	}

	var WAL_Admin = {
		init: function () {

			// Trigger a wallet myaccount menu.
			$(document).on('change', '#wal_general_hide_wallet_myaccount_menu', this.trigger_wallet_myaccount_menu);
			// Trigger a Discount for Gateway.
			$(document).on('change', '#wal_general_apply_discount_for_wallet_gateway', this.trigger_discount_for_gateway);
			// Trigger a product restriction.
			$(document).on('change', '.wal-product-restriction-type', this.trigger_product_restriction);
			// Trigger a user restriction.
			$(document).on('change', '.wal-user-restriction-type', this.trigger_user_restriction);
			// Trigger a partial payment.
			$(document).on('change', '#wal_general_allow_partial_payments', this.trigger_partial_payment);
			// Trigger a enable module.
			$(document).on('change', '.wal-enable-module', this.trigger_module_enable);
			// Trigger a credit/debit user type.
			$(document).on('change', '.wal-credit-debit-user-type', this.trigger_credit_debit_user_type);
			// Handles the credit/debit funds.
			$(document).on('click', '.wal-credit-debit-action', this.handle_manual_credit_debit);
			// Handles the user credit/debit funds.
			$(document).on('click', '.wal-user-credit-debit-action', this.handle_manual_credit_debit_for_user);
			//Tabbed wallet panel.
			$(document).on('wal-init-tabbed-wallet-panels', this.tabbed_wallet_panels).trigger('wal-init-tabbed-wallet-panels');
			//Trigger wallet withdrawal status.
			$(document).on('change', '.wal-withdrawal-status', this.trigger_wallet_withdrawal_status);
			// Validate wallet gateway funds
			$(document).on('click', '.save_order', this.validate_wallet_gateway_funds);
			// Display redeem wallet balance popup button
			$(document).on('click', '.wal-wallet-balance-redeem-popup-button', this.redeem_wallet_funds_popup_button);
			// Redeem wallet balance manually
			$(document).on('click', '.wal-partial-fund-usage-btn', this.redeem_wallet_balance_manually);
			// Trigger a user restriction.
			$(document).on('change', '.wal-user-selection-type', this.trigger_user_selection);
			// Reset wallet user data
			$(document).on('click', '.wal-reset-user-wallet-data', this.reset_user_wallet_data);
			// Remove Reset Notice 
			$(document).on('click', '.wal-dismiss-notice, .notice-dismiss', this.remove_user_wallet_reseted_success_notice);
			this.trigger_on_page_load();

		},
		/**
		 * Trigger on page load
		 * 
		 * @since 1.0.0
		 * @returns void
		 */
		trigger_on_page_load: function () {
			WAL_Admin.wallet_myaccount_menu('#wal_general_hide_wallet_myaccount_menu');
			WAL_Admin.product_restriction(".wal-product-restriction-type");
			WAL_Admin.discount_for_gateway("#wal_general_apply_discount_for_wallet_gateway");
			WAL_Admin.user_restriction(".wal-user-restriction-type");
			WAL_Admin.partial_payment("#wal_general_allow_partial_payments");
			WAL_Admin.credit_debit_user_type(".wal-credit-debit-user-type");
			WAL_Admin.handle_wallet_withdrawal_status('.wal-withdrawal-status');
			WAL_Admin.user_selection('.wal-user-selection-type');

			$('.wal-page-title-action').appendTo('.wp-heading-inline');

		},
		/**
		 * Trigger wallet myaccount menu
		 * 
		 * @since 1.0.0
		 * @param event event
		 */
		trigger_wallet_myaccount_menu: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			WAL_Admin.wallet_myaccount_menu($this);
		},
		/**
		 * Trigger product restriction
		 * 
		 * @since 1.0.0
		 * @param event event
		 */
		trigger_product_restriction: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			WAL_Admin.product_restriction($this);
		},
		/**
		 * Trigger discount for gateway
		 * 
		 * @since 4.6.0
		 * @param event event
		 */
		trigger_discount_for_gateway: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			WAL_Admin.discount_for_gateway($this);
		},
		/**
		 * Trigger user restriction
		 * 
		 * @since 1.0.0
		 * @param event event
		 */
		trigger_user_restriction: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			WAL_Admin.user_restriction($this);
		},
		/**
		 * Trigger partial payment
		 * 
		 * @since 1.0.0
		 * @param event event
		 */
		trigger_partial_payment: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			WAL_Admin.partial_payment($this);
		},
		/**
		 * Trigger credit debit user type
		 * 
		 * @since 1.0.0
		 * @param event event
		 */
		trigger_credit_debit_user_type: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			WAL_Admin.credit_debit_user_type($this);
		},
		/**
		 * Trigger wallet withdrawal status
		 * 
		 * @since 1.0.0
		 * @param event event
		 */
		trigger_wallet_withdrawal_status: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			WAL_Admin.handle_wallet_withdrawal_status($this);
		},
		/**
		 * Trigger user selection
		 * 
		 * @since 3.5.0
		 * @param event event
		 */
		trigger_user_selection: function (event) {
			event.preventDefault();
			WAL_Admin.user_selection($(event.currentTarget));
		},

		/**
		 * Enable Discount
		 * 
		 * @since 4.6.0
		 * @param element $this 
		 */
		discount_for_gateway: function ($this) {
			if ($($this).is(':checked')) {
				$('#wal_general_discount_type').closest('tr').show();
				$('#wal_general_discount_value').closest('tr').show();
			} else {
				$('#wal_general_discount_type').closest('tr').hide();
				$('#wal_general_discount_value').closest('tr').hide();
			}
		},

		/**
		 * Wallet myaccount menu
		 * 
		 * @since 1.0.0
		 * @param element $this 
		 */
		wallet_myaccount_menu: function ($this) {
			if ($($this).is(':checked')) {
				$('#wal_general_wallet_myaccount_menu_position').closest('tr').hide();
			} else {
				$('#wal_general_wallet_myaccount_menu_position').closest('tr').show();
			}
		},
		/**
		 * Product restriction
		 * 
		 * @since 1.0.0
		 * @param element $this 
		 */
		product_restriction: function ($this) {

			$('.wal-product-restriction-field').closest('tr').hide();

			switch ($($this).val()) {
				case '2':
					$('.wal-include-product-field').closest('tr').show();
					break;
				case '3':
					$('.wal-exclude-product-field').closest('tr').show();
					break;
				case '4':
					$('.wal-include-categories-field').closest('tr').show();
					break;
				case '5':
					$('.wal-exclude-categories-field').closest('tr').show();
					break;
			}
		},
		/**
		 * Handle wallet withdrawal status
		 * 
		 * @since 1.0.0
		 * @param element $this 
		 */
		handle_wallet_withdrawal_status: function ($this) {
			$('#wal-wallet-withdrawal-cancel-reason-content').hide();
			if ('wal_cancelled' === $($this).val()) {
				$('#wal-wallet-withdrawal-cancel-reason-content').show();
			}
		},
		/**
		 * User restriction
		 * 
		 * @since 1.0.0
		 * @param element $this 
		 */
		user_restriction: function ($this) {
			$('.wal-user-restriction-field').closest('tr').hide();

			switch ($($this).val()) {
				case '2':
					$('.wal-include-users-field').closest('tr').show();
					break;
				case '3':
					$('.wal-exclude-users-field').closest('tr').show();
					break;
				case '4':
					$('.wal-include-user-roles-field').closest('tr').show();
					break;
				case '5':
					$('.wal-exclude-user-roles-field').closest('tr').show();
					break;
			}
		},
		/**
		 * User selection
		 * 
		 * @since 3.5.0
		 * @param element $this 
		 */
		user_selection: function ($this) {
			$('.wal-user-selection-field').closest('tr').hide();
			switch ($($this).val()) {
				case '2':
					$('.wal-reset-include-users-field').closest('tr').show();
					break;
				case '3':
					$('.wal-reset-exclude-users-field').closest('tr').show();
					break;
				case '4':
					$('.wal-reset-include-user-roles-field').closest('tr').show();
					break;
				case '5':
					$('.wal-reset-exclude-user-roles-field').closest('tr').show();
					break;
			}
		},
		/**
		 * Partial payment
		 * 
		 * @since 1.0.0
		 * @param element $this 
		 */
		partial_payment: function ($this) {
			if ($($this).is(':checked')) {
				$('.wal-partial-payment-field').closest('tr').show();
			} else {
				$('.wal-partial-payment-field').closest('tr').hide();
			}
		},
		/**
		 * Credit debit user type
		 * 
		 * @since 1.0.0
		 * @param element $this 
		 */
		credit_debit_user_type: function ($this) {
			$('.wal-credit-debit-user-type-field').closest('p').hide();

			switch ($($this).val()) {
				case '2':
				case '3':
					$('.wal-credit-debit-users').closest('p').show();
					break;
				case '4':
				case '5':
					$('.wal-credit-debit-user-roles').closest('p').show();
					break;
			}
		},
		/**
		 * Trigger module enable
		 * 
		 * @since 1.0.0
		 * @param event event 
		 */
		trigger_module_enable: function (event) {
			event.preventDefault();

			var $this = $(event.currentTarget),
				wrapper = $($this).closest('.wal-wallet-modules-content'),
				status = 'disable';

			WAL_Admin.block(wrapper);

			if ($($this).is(':checked')) {
				status = 'enable';
			}

			var data = ({
				action: 'wal_enable_module',
				module: $($this).data('module'),
				status: status,
				wal_security: wal_admin_params.module_nonce,
			});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					alert(res.data.msg);
				} else {
					alert(res.data.error);
				}
				WAL_Admin.unblock(wrapper);
			});
		},
		/**
		 * Handle manual credit debit
		 * 
		 * @since 1.0.0
		 * @param event event 
		 */
		handle_manual_credit_debit: function (event) {
			event.preventDefault();

			var $this = $(event.currentTarget),
				wrapper = $($this).closest('.wal-credit-debit-funds-content');

			if (!confirm(wal_admin_params.confirm_manual_fund_msg)) {
				return false;
			}

			WAL_Admin.block(wrapper);

			var data = ({
				action: 'wal_manual_credit_debit_fund',
				user_type: wrapper.find('.wal-credit-debit-user-type').val(),
				user_ids: wrapper.find('.wal-credit-debit-users').val(),
				user_roles: wrapper.find('.wal-credit-debit-user-roles').val(),
				type: wrapper.find('.wal-credit-debit-type').val(),
				fund: wrapper.find('.wal-credit-debit-fund').val(),
				reason: wrapper.find('.wal-credit-debit-reason').val(),
				wal_security: wal_admin_params.topup_nonce,
			});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					alert(res.data.msg);
					window.location.reload(true);
				} else {
					alert(res.data.error);
					WAL_Admin.unblock(wrapper);
				}

			});
		},
		/**
		 * Handle manual credit debit for user
		 * 
		 * @since 1.0.0
		 * @param event event 
		 */
		handle_manual_credit_debit_for_user: function (event) {
			event.preventDefault();

			var $this = $(event.currentTarget),
				wrapper = $($this).closest('.wal-credit-debit-funds-content');

			if (!confirm(wal_admin_params.confirm_manual_fund_msg)) {
				return false;
			}

			WAL_Admin.block(wrapper);

			var data = ({
				action: 'wal_manual_credit_debit_fund_for_user_wallet',
				user_id: wrapper.find('.wal-credit-debit-user').val(),
				type: wrapper.find('.wal-credit-debit-type').val(),
				fund: wrapper.find('.wal-credit-debit-fund').val(),
				reason: wrapper.find('.wal-credit-debit-reason').val(),
				wal_security: wal_admin_params.topup_nonce,
			});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					alert(res.data.msg);
					window.location.reload(true);
				} else {
					alert(res.data.error);
					WAL_Admin.unblock(wrapper);
				}

			});
		},
		/**
		 * Tabbed wallet panels
		 * 
		 * @since 1.0.0
		 * @param event event 
		 */
		tabbed_wallet_panels: function () {

			// trigger the clicked link.
			$('.wal-wallet-data-tab-link').on('click', function (event) {
				event.preventDefault();
				var $this = $(event.currentTarget),
					panel_wrapper = $($this).closest('.wal-wallet-data-panels-wrapper');

				$('.wal-wallet-data-tab', panel_wrapper).removeClass('active');
				$($this).parent().addClass('active');

				$('div.wal-wallet-options-wrapper', panel_wrapper).hide();
				$($($this).attr('href')).show();
			});

			// Trigger the first link.
			$('div.wal-wallet-data-panels-wrapper').each(function () {

				$(this).find('.wal-wallet-data-tab').eq(0).find('a').click();
			});
		},
		/**
		 * Redeem wallet funds popup button
		 * 
		 * @since 1.0.0
		 * @param event event 
		 */
		redeem_wallet_funds_popup_button: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget),
				wrapper = $('.wc-order-bulk-actions');
			WAL_Admin.block(wrapper);

			var data = ({
				action: 'wal_get_wallet_fund_redeem_popup_content',
				order_id: $($this).val(),
				user_id: $('#customer_user').val(),
				payment_method: $('#_payment_method').val(),
				wal_security: wal_admin_params.redeem_wallet_funds_nonce,
			});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					$('#wal-redeem-wallet-funds-popup').html(res.data.html);
					$(document.body).trigger('wal-enhanced-lightcase');
					$('.wal-popup').trigger('click');
				} else {
					alert(res.data.error);
				}
				WAL_Admin.unblock(wrapper);
			}
			);
		},
		/**
		 * Redeem wallet balance manually
		 * 
		 * @since 1.0.0
		 * @param event event 
		 */
		redeem_wallet_balance_manually: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget),
				wrapper = $('.wc-order-bulk-actions');
			WAL_Admin.block(wrapper);

			var data = ({
				action: 'wal_redeem_wallet_balance_manually',
				order_id: $('#post_ID').val(),
				user_id: $('#customer_user').val(),
				fund: $('.wal-partial-fund-usage-amount').val(),
				wal_security: wal_admin_params.redeem_wallet_funds_nonce,
			});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					alert(res.data.success);
					$('#lightcase-overlay').css("display", "none");
					$('#lightcase-case').css("display", "none");
					$('#woocommerce-order-items').trigger('wc_order_items_reload');
				} else {
					alert(res.data.error);
				}
				$('#woocommerce-order-items').trigger('wc_order_items_reload');
				WAL_Admin.unblock(wrapper);
			}
			);
		},
		/**
		 * Validate wallet gateway funds
		 * 
		 * @since 1.0.0
		 * @param event event 
		 */
		validate_wallet_gateway_funds: function (event) {
			var payment_method = $('#_payment_method').val(),
				user_id = $('#customer_user').val();

			if ('wal_wallet' !== payment_method) {
				return true;
			}

			event.preventDefault();
			var wrapper = $('.wc-order-bulk-actions');
			WAL_Admin.block(wrapper);

			var data = ({
				action: 'wal_validate_create_order_by_wallet_gateway',
				order_id: $('#post_ID').val(),
				payment_method: payment_method,
				user_id: user_id,
				wal_security: wal_admin_params.gateway_funds_nonce,
			});

			$.post(ajaxurl, data, function (res) {
				if (true === res.success) {
					$('.save_order').closest('form').submit();
				} else {
					alert(res.data.error);
				}
				WAL_Admin.unblock(wrapper);
			});
		},

		/**
		 * Reset user wallet data.
		 * 
		 * @since 3.5.0
		 * @param {event} event
		 * @returns bool
		 */
		reset_user_wallet_data: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);
			if (!confirm(wal_admin_params.wallet_reset_confirm_msg)) {
				return false;
			}

			var data = {
				action: 'wal_reset_user_wallet_data',
				serialized_data: $this.closest('form').serialize(),
				wal_security: wal_admin_params.reset_user_wallet_nonce
			};

			// WAL_Admin.block($this.closest('table'));
			$.post(ajaxurl, data, function (response) {
				if (true === response.success) {
					window.location.reload();
				} else {
					window.alert(response.data.error);
				}
				WAL_Admin.unblock($this.closest('table'));
			});
		},

		/**
		 * Remove user wallet reseted success notice
		 * 
		 * @since 3.5.0
		 * @param event event        
		 */
		remove_user_wallet_reseted_success_notice: function (event) {
			event.preventDefault();
			var data = {
				action: 'wal_remove_user_wallet_reseted_success_notice',
				wal_security: wal_admin_params.remove_notice_nonce
			};

			$.post(ajaxurl, data, function (response) {
				if (true === response.success) {
					window.alert(response.data.success);
				} else {
					window.alert(response.data.error);
				}
			});
		},
		/**
		 * Block
		 * 
		 * @since 1.0.0
		 * @param int $id 
		 */
		block: function (id) {
			if (!WAL_Admin.is_blocked(id)) {
				$(id).addClass('processing').block({
					message: null,
					overlayCSS: {
						background: '#fff',
						opacity: 0.7
					}
				});
			}
		},
		/**
		 * Unblock
		 * 
		 * @since 1.0.0
		 * @param int $id  
		 */
		unblock: function (id) {
			$(id).removeClass('processing').unblock();
		},
		/**
		 * Is Blocked
		 * 
		 * @since 1.0.0
		 * @param int $id 
		 */
		is_blocked: function (id) {
			return $(id).is('.processing') || $(id).parents('.processing').length;
		}
	};
	var WAL_Topup_Bonus = {
		init: function () {
			// Handle a topup bonus 
			$(document).on('change', '#wal_general_enable_topup_bonus', this.trigger_topup_bonus_table);
			// Add topup bonus rules
			$(document).on('click', '.wal-add-new-topup-bonus-rule', this.handle_add_topup_bonus_rule);
			// Remove topup bonus rule.
			$(document).on('click', '.wal-remove-rule', this.remove_topup_bonus_rule);
			WAL_Topup_Bonus.wallet_topup_bonus_table('#wal_general_enable_topup_bonus');
		},
		/**
		 * Trigger topup bonus table
		 * 
		 * @since 1.0.0
		 * @param event event
		 */
		trigger_topup_bonus_table: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			WAL_Topup_Bonus.wallet_topup_bonus_table($this);
		},
		/**
		 * Wallet topup bonus table
		 * 
		 * @since 1.0.0
		 * @param element $this
		 */
		wallet_topup_bonus_table: function ($this) {
			if ($($this).is(':checked')) {
				$('.wal-topup-bonus-enable').closest('tr').show();
				$('.wal-topup-bonus-table').show();
			} else {
				$('.wal-topup-bonus-enable').closest('tr').hide();
				$('.wal-topup-bonus-table').hide();
			}

		},
		/**
		 * Handle add topup bonus rule
		 * 
		 * @since 1.0.0
		 * @param event event
		 */
		handle_add_topup_bonus_rule: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget),
				group_template = wp.template('wal-add-topup-bonus-rule'),
				wrapper = $($this).closest('.wal-topup-bonus-table'),
				unique_id = Math.floor(Math.random() * 26) + Date.now();

			wrapper.find('tbody').append(group_template({ group_id: unique_id }));

		},
		/**
		 * Remove topup bonus rule
		 * 
		 * @since 1.0.0
		 * @param event event
		 */
		remove_topup_bonus_rule: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);
			if (!confirm(wal_admin_params.delete_confirm_msg)) {
				return false;
			}

			$this.closest('tr').remove();
		}
	};
	WAL_Admin.init();
	WAL_Topup_Bonus.init();
});
