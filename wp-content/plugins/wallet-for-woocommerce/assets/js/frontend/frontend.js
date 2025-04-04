
/* global wal_frontend_params */

jQuery(function ($) {
	'use strict';

	if (typeof wal_frontend_params === 'undefined') {
		return false;
	}

	var WAL_Frontend = {

		init: function ( ) {
			// Toggle the checkout partial fund usage..
			$(document).on('click', '.wal-checkout-partial-fund-usage-link', this.toggle_checkout_partial_fund_usage);
			// Handles the cart partial fund usage.
			$(document).on('click', '.wal-cart-partial-fund-usage-btn', this.handle_cart_partial_fund_usage);
			// Handles the cart remove partial fund.
			$(document).on('click', '.wal-cart-remove-partial-fund', this.handle_cart_remove_partial_fund);
			// Handles the checkout remove partial fund.
			$(document).on('click', '.wal-checkout-remove-partial-fund', this.handle_checkout_remove_partial_fund);
			// Handles the checkout partial fund usage.
			$(document).on('click', '.wal-checkout-partial-fund-usage-btn', this.handle_checkout_partial_fund_usage);
			//Update the cart when updating shipping.
			$(document.body).on('updated_shipping_method', this.updated_shipping_method);

			// Handles the predefined top up form.
			$(document).on('click', '.wal-topup-predefined-button', this.handle_topup_predefined_button);
			// Handles the form.
			$(document).on('click', '.wal-redeem-gift-voucher-form-btn', this.handle_form);
			// Pagination.
			$(document).on('click', '.wal-pagination', this.pagination);
			// Update wallet details in the checkout page after updated checkout.
			$(document.body).on('updated_checkout', this.update_wallet_details_in_checkout);
			$(document.body).on('click', '.wal-shipping-list-options', this.valid_shipping_lists);
			WAL_Frontend.add_discount_in_checkout();
			$( document ).on( 'payment_method_selected' , this.add_discount_in_checkout ) ;

		},
		update_wallet_details_in_checkout: function (e, data) {
			if (data && data.fragments) {
				if (data.fragments.wal_redeem_wallet_fund_form_html) {
					$('#wal-redeem-wallet-fund-forms-wrapper').replaceWith(data.fragments.wal_redeem_wallet_fund_form_html);
				}	

				if (data.fragments.wal_discount_notice_for_gateway) {
					$('#wal-discount-notice-for-gateway-wrapper').replaceWith(data.fragments.wal_discount_notice_for_gateway);
				}
			}
		},
		valid_shipping_lists: function (event) {
			event.preventDefault() ;
			var $this = $(event.currentTarget),
				wrapper = $('.wal-shipping-methods-wrapper');
				WAL_Frontend.block(wrapper);

			var data = ({
				action: 'wal_get_valid_shipping_methods_html',
				shipping_lists: $this.data('shipping_lists'),
				wal_security: wal_frontend_params.shipping_list_nonce,
			});

			$.post(wal_frontend_params.ajax_url, data, function (res) {
				if (true === res.success) {
					$('#wal-shipping-lists-modal').html(res.data.html);
					$(document.body).trigger('wal-enhanced-lightcase');
					$('.wal-popup').trigger('click');
				} else {
					alert(res.data.error);
				}
				WAL_Frontend.unblock(wrapper);
			}
			);
		},
		/**
		 * Pagination
		 * 
		 * @since 3.4.0
		 * @param event event 
		 */
		pagination: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget),
					wrapper = $this.closest('.wal-dashboard-content-wrapper');

			var data = ({
				action: 'wal_pagination_action',
				selected_page: $this.data('page'),
				table_name: wrapper.data('table_name'),
				wal_security: wal_frontend_params.pagination_action_nonce
			});
			$.post(wal_frontend_params.ajax_url, data, function (res) {
				if (true === res.success) {
					wrapper.replaceWith(res.data.html);
				} else {
					alert(res.data.error);
				}
			}
			);
		},
		/**
		 * Toggle checkout partial fund usage
		 * 
		 * @since 3.4.0
		 * @return bool         
		 */
		toggle_checkout_partial_fund_usage: function (  ) {
			$('.wal-checkout-partial-fund-usage-content').slideToggle(400, function () {
				$('.wal-checkout-partial-fund-usage-content').find(':input:eq(0)').focus();
			});
			return false;
		},
		/**
		 * Handle cart partial fund usage
		 * 
		 * @since 1.0.0
		 * @param event event         
		 */
		handle_cart_partial_fund_usage: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget),
					wrapper = $($this).closest('.wal-redeem-wallet-fund-form-wrapper');

			WAL_Frontend.block(wrapper);

			var data = ({
				action: 'wal_apply_partial_fund',
				fund: wrapper.find('.wal-partial-fund-usage-amount').val(),
				wal_security: wal_frontend_params.partial_fund_usage_nonce,
			});

			$.post(wal_frontend_params.ajax_url, data, function (res) {
				$(document.body).trigger('wc_update_cart');
				WAL_Frontend.unblock(wrapper);
			});
		},
		/**
		 * Handle cart remove partial fund
		 * 
		 * @since 1.0.0
		 * @param event event         
		 */
		handle_cart_remove_partial_fund: function (event) {
			event.preventDefault( );

			var $this = $(event.currentTarget),
					wrapper = $($this).closest('.cart_totals');

			WAL_Frontend.block(wrapper);

			var data = ({
				action: 'wal_remove_partial_fund',
				wal_security: wal_frontend_params.partial_fund_usage_nonce,
			});

			$.post(wal_frontend_params.ajax_url, data, function (res) {
				$(document.body).trigger('wc_update_cart');
				WAL_Frontend.unblock(wrapper);
			});
		},
		/**
		 * Handle checkout partial fund usage
		 * 
		 * @since 1.0.0
		 * @param event event         
		 */
		handle_checkout_partial_fund_usage: function (event) {
			event.preventDefault( );

			var $this = $(event.currentTarget),
					wrapper = $($this).closest('.wal-redeem-wallet-fund-form-wrapper');

			WAL_Frontend.block(wrapper);

			var data = ({
				action: 'wal_apply_partial_fund',
				fund: wrapper.find('.wal-partial-fund-usage-amount').val(),
				wal_security: wal_frontend_params.partial_fund_usage_nonce,
			});

			$.post(wal_frontend_params.ajax_url, data, function (res) {
				WAL_Frontend.unblock(wrapper);
				$(document.body).trigger('update_checkout'); 
			});
		},
		/**
		 * Handle checkout remove partial fund
		 * 
		 * @since 1.0.0
		 * @param event event         
		 */
		handle_checkout_remove_partial_fund: function (event) {
			event.preventDefault( );

			var $this = $(event.currentTarget),
					wrapper = $($this).parents('.woocommerce-checkout-review-order');

			WAL_Frontend.block(wrapper);

			var data = ({
				action: 'wal_remove_partial_fund',
				wal_security: wal_frontend_params.partial_fund_usage_nonce,
			});

			$.post(wal_frontend_params.ajax_url, data, function (res) {
				WAL_Frontend.unblock(wrapper);
				$(document.body).trigger('update_checkout');
			});
		},
		/**
		 * Update shipping method
		 * 
		 * @since 1.0.0        
		 */
		updated_shipping_method: function () {
			$(document.body).trigger('wc_update_cart');
		},
		/**
		 * Handle topup predefined button
		 * 
		 * @since 1.0.0
		 * @param event event     
		 */
		handle_topup_predefined_button: function (event) {
			event.preventDefault( );

			var $this = $(event.currentTarget),
					wrapper = $($this).closest('.wal-topup-form-wrapper'),
					fund = $($this).data('fund');

			wrapper.find('.wal-topup-form-amount').val(fund);

		},
		/**
		 * Handle pagination
		 * 
		 * @since 1.0.0
		 * @param html table  
		 * @param int page_number    
		 */
		handle_pagination: function (table, page_number) {
			table.find('.wal_pagination').removeClass('current');
			table.find('.wal_pagination_' + page_number).addClass('current');

			var next_page = page_number;
			if (page_number > 1) {
				next_page = page_number - 1;
			}

			var last_page = table.find('.wal_last_pagination').data('page');
			if (page_number < last_page) {
				last_page = page_number + 1;
			}

			table.find('.wal_next_pagination').data('page', last_page);
			table.find('.wal_prev_pagination').data('page', next_page);
		},
		/**
		 * Handle form
		 * 
		 * @since 1.0.0
		 * @param event event             
		 */
		handle_form: function (event) {

			var $this = $(event.currentTarget),
					wrapper = $this.closest('.wal-form-wrapper');

			WAL_Frontend.block(wrapper);

			return true;
		},
		/**
		 * Handle form
		 * 
		 * @since 4.6.0
		 * @param event event             
		 */
		add_discount_in_checkout : function () {
			if ( wal_frontend_params.is_checkout && 'yes' == wal_frontend_params.is_gateway_discount_enabled ) {
				$(document.body).trigger('update_checkout');
			}
		} ,
		/**
		 * Block
		 * 
		 * @since 1.0.0
		 * @param int id             
		 */
		block: function (id) {
			if (!WAL_Frontend.is_blocked(id)) {
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
		 * @param int id             
		 */
		unblock: function (id) {
			$(id).removeClass('processing').unblock();
		},
		/**
		 * Is Blocked
		 * 
		 * @since 1.0.0
		 * @param int id             
		 */
		is_blocked: function (id) {
			return $(id).is('.processing') || $(id).parents('.processing').length;
		}
	};
 
	WAL_Frontend.init( );
});
