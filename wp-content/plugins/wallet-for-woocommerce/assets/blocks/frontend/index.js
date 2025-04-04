/**
 * Cart / Checkout block.
 * 
 * @since 3.7.0
 */
(() => {
	'use strict';

	var reactElement = window.wp.element,
			wc_blocks_checkout = window.wc.blocksCheckout,
			wc_plugin_data = window.wc.wcSettings,
			wp_data = window.wp.data,
			notice_ids = [];

	const {
		createNotice, removeNotice
	} = wp_data.dispatch('core/notices');

	const{
		redeem_wallet_fund_added_message,
		redeem_wallet_fund_removed_message,
		apply_discount_for_gateway
	} = wc_plugin_data.getSetting('wal-wc-blocks_data');

	/**
	 * Cart redeem wallet fund form block class.
	 * 
	 * @since 3.7.0
	 * @return {JSX.Element} A Wrapper used to display the redeem wallet fund form in the cart page.
	 */
	const CartRedeemWalletFundFormBlock = {
		context: 'wc/cart',
		getElement: function (e) {
			// Remove notices if already added to aviod duplicates.
			removeNotices(CartRedeemWalletFundFormBlock.context);

			if (!e.extensions['wal-wallet']) {
				return '';
			}

			createNotices(e.extensions['wal-wallet']['notices'], CartRedeemWalletFundFormBlock.context);

			// Return if the content doest not exists.
			if (!e.extensions['wal-wallet']['cart_redeem_wallet_fund_form_html']) {
				return '';
			}

			return reactElement.createElement(wc_blocks_checkout.TotalsWrapper, null,
					reactElement.createElement(wc_blocks_checkout.Panel, {className: 'wal-block-redeem-wallet-fund-apply-panel', title: e.extensions['wal-wallet'].redeem_wallet_fund_title},
							reactElement.createElement(reactElement.RawHTML, null, e.extensions['wal-wallet']['cart_redeem_wallet_fund_form_html'])));
		}
	};

	/**
	 * Checkout redeem wallet fund form block class.
	 * 
	 * @since 3.7.0
	 * @return {JSX.Element} A Wrapper used to display the redeem wallet fund form in the checkout page.
	 */
	const CheckoutRedeemWalletFundFormBlock = {
		context: 'wc/checkout',
		getElement: function (e) {
			// Remove notices if already to aviod duplicates.
			removeNotices(CheckoutRedeemWalletFundFormBlock.context);

			if (!e.extensions['wal-wallet']) {
				return '';
			}

			createNotices(e.extensions['wal-wallet']['notices'], CheckoutRedeemWalletFundFormBlock.context);

			// Return if the content doest not exists.
			if (!e.extensions['wal-wallet']['checkout_redeem_wallet_fund_form_html']) {
				return '';
			}

			return reactElement.createElement(wc_blocks_checkout.TotalsWrapper, null,
					reactElement.createElement(wc_blocks_checkout.Panel, {className: 'wal-block-redeem-wallet-fund-apply-panel', title: e.extensions['wal-wallet'].redeem_wallet_fund_title},
							reactElement.createElement(reactElement.RawHTML, null, e.extensions['wal-wallet']['checkout_redeem_wallet_fund_form_html'])));
		}
	};

	/**
	 * Wallet fees class.
	 * 
	 * @since 3.7.0
	 * @return {JSX.Element} A Wrapper used to display the redeem wallet fund as fees in the cart/checkout pages.
	 */
	const WalletFeesBlock = {
		getElement: function (e) {
			if (!e.extensions['wal-wallet']) {
				return '';
			}

			// Return if the content doest not exists.
			if (!e.extensions['wal-wallet']['wallet_fee_html']) {
				return '';
			}

			WalletFeesBlock.hideWCWalletFeesWrapper();

			return reactElement.createElement(reactElement.Fragment, null,
					reactElement.createElement(wc_blocks_checkout.ExperimentalDiscountsMeta, null,
							reactElement.createElement(reactElement.RawHTML, null, e.extensions['wal-wallet']['wallet_fee_html'])));
		},
		hideWCWalletFeesWrapper: function () {
			let cart_fee_wrapper = jQuery('.wp-block-woocommerce-cart-order-summary-fee-block'),
					checkout_fee_wrapper = jQuery('.wp-block-woocommerce-checkout-order-summary-fee-block');

			if (cart_fee_wrapper.length && 1 === cart_fee_wrapper.find('.wc-block-components-totals-fees').length) {
				cart_fee_wrapper.hide();
			} else if (checkout_fee_wrapper.length && 1 === checkout_fee_wrapper.find('.wc-block-components-totals-fees').length) {
				checkout_fee_wrapper.hide();
			} else {
				jQuery('.wc-block-components-totals-fees__wallet-credits').hide();
			}
		}
	};

	/**
	 * Handles events for redeem form of wallet fund.
	 * 
	 * @since 3.7.0
	 * @type object
	 */
	const RedeemFormHandler = {
		init: function () {
			jQuery( window ).on('load', function() {
				RedeemFormHandler.add_discount_in_blocks_checkout();
		   	});

			jQuery(document).ready(function() {
				RedeemFormHandler.add_discount_in_blocks_checkout();
		   	});

			setTimeout(function(){
				RedeemFormHandler.add_discount_in_blocks_checkout();
			}, 3000);
			jQuery(document).on('keyup', '.wal-block-redeem-wallet-fund', this.validate_fund_input_field);
			jQuery(document).on('click', '.wal-block-redeem-wallet-fund_button', this.apply_redeem_wallet_fund);
			jQuery(document).on('click', '.wal-block-remove-wallet-fund_link', this.remove_redeem_wallet_fund);
			jQuery(document).on('change', '.wc-block-components-radio-control__input', this.add_discount_in_blocks_checkout);
		},
		validate_fund_input_field: function (e) {
			let $this = jQuery(e.currentTarget);
			if ($this.val()) {
				jQuery('.wal-block-redeem-wallet-fund_button').attr('disabled', false);
			} else {
				jQuery('.wal-block-redeem-wallet-fund_button').attr('disabled', true);
			}

			// Hide the error while entering the fund value.
			jQuery('.wc-block-components-validation-error').text('');
		},
		apply_redeem_wallet_fund: function (e) {
			e.preventDefault( );
			let $this = jQuery(e.currentTarget),
					wrapper = jQuery($this).closest('.wal-block-redeem-wallet-fund-form_fields');

			Block(wrapper);
			wc_blocks_checkout.extensionCartUpdate({
				namespace: 'wal-wallet',
				data: {
					action: 'apply_redeem_wallet_fund',
					fund: wrapper.find('.wc-block-components-text-input').val()
				}
			}).then(() => {
				createNotice('success', redeem_wallet_fund_added_message, {
					id: 'wal-reeem-wallet-fund-applied',
					context: 'wc/cart',
					type: 'snackbar'
				});
			}).catch(err => {
				jQuery('.wc-block-components-validation-error').text(err.message);
			}).finally(() => {
				WalletFeesBlock.hideWCWalletFeesWrapper();
				unBlock(wrapper);
			});
		},
		remove_redeem_wallet_fund: function (e) {
			e.preventDefault( );
			let $this = jQuery(e.currentTarget);

			Block($this);
			wc_blocks_checkout.extensionCartUpdate({
				namespace: 'wal-wallet',
				data: {
					action: 'remove_redeem_wallet_fund'
				}
			}).then(() => {
				createNotice('success', redeem_wallet_fund_removed_message, {
					id: 'wal-reeem-wallet-fund-removed',
					context: 'wc/cart',
					type: 'snackbar'
				});
			}).catch(err => {
				alert(err);
			}).finally(() => {
				unBlock($this);
			});
		},
		add_discount_in_blocks_checkout : function () {
			if ( 'yes' == apply_discount_for_gateway ) {
				var gateway_id = jQuery('input[name="radio-control-wc-payment-method-options"]:checked').val();
				wc_blocks_checkout.extensionCartUpdate( {
					namespace: 'wal-add-gateway-discount',
					data: {
						action : 'add-discount',
						gateway_id : gateway_id
					},
				} );
			}
		} ,
	};

	/**
	 * Create notices to the block.
	 * 
	 * @since 3.7.0
	 * @param {array} notices
	 * @param {string} context
	 * @returns {undefined}
	 */
	function createNotices(notices, context) {
		// Add eligible notices.
		if (notices) {
			jQuery.each(notices, function (index, notice) {
				if (!notice.content) {
					return null;
				}

				createNotice(notice.type, '<div class="wal-notices-wrapper">' + notice.content + '</div>', {
					id: index,
					context: context,
					isDismissible: true
				});

				notice_ids.push(index);
			});
		}
	}

	/**
	 * Remove added notices from the block.
	 * 
	 * @since 3.7.0
	 * @param {string} context
	 * @returns {undefined}
	 */
	function removeNotices(context) {
		jQuery.each(notice_ids, function (index, id) {
			removeNotice(id, context);
		});
	}

	/**
	 * Block
	 * 
	 * @since 1.0.0
	 * @param string id             
	 */
	function Block(id) {
		if (!isBlocked(id)) {
			jQuery(id).addClass('processing').block({
				message: null,
				overlayCSS: {
					background: '#fff',
					opacity: 0.7
				}
			});
		}
	}
	/**
	 * Unblock
	 * 
	 * @since 1.0.0
	 * @param string id             
	 */
	function unBlock(id) {
		jQuery(id).removeClass('processing').unblock();
	}
	/**
	 * Is Blocked
	 * 
	 * @since 1.0.0
	 * @param string id             
	 */
	function isBlocked(id) {
		return jQuery(id).is('.processing') || jQuery(id).parents('.processing').length;
	}

	// Inititalize the events for redeem wallet fund form. 
	RedeemFormHandler.init();

	// Register redeem wallet fund form inner block in the cart block.
	wc_blocks_checkout.registerCheckoutBlock({
		metadata: JSON.parse("{\"name\":\"woocommerce/wal-wc-cart-redeem-wallet-fund-form-block\",\"icon\":\"calculator\",\"keywords\":[\"redeem\",\"form\",\"wallet\",\"fund\"],\"version\":\"1.0.0\",\"title\":\"Redeem Wallet Fund Form\",\"description\":\"Shows the redeem wallet fund form layout in the cart block.\",\"category\":\"woocommerce\",\"supports\":{\"align\":false,\"html\":false,\"multiple\":false,\"reusable\":false},\"attributes\":{\"className\":{\"type\":\"string\",\"default\":\"\"},\"lock\":{\"type\":\"object\",\"default\":{\"remove\":true,\"move\":false}}},\"parent\":[\"woocommerce/cart-order-summary-block\"],\"textdomain\":\"wallet-for-woocommerce\",\"apiVersion\":2}"),
		component: CartRedeemWalletFundFormBlock.getElement
	});

	// Register redeem wallet fund form inner block in the checkout block.
	wc_blocks_checkout.registerCheckoutBlock({
		metadata: JSON.parse("{\"name\":\"woocommerce/wal-wc-checkout-redeem-wallet-fund-form-block\",\"icon\":\"calculator\",\"keywords\":[\"redeem\",\"form\",\"wallet\",\"fund\"],\"version\":\"1.0.0\",\"title\":\"Redeem Wallet Fund Form\",\"description\":\"Shows the redeem wallet fund form layout in the checkout block.\",\"category\":\"woocommerce\",\"supports\":{\"align\":false,\"html\":false,\"multiple\":false,\"reusable\":false},\"attributes\":{\"className\":{\"type\":\"string\",\"default\":\"\"},\"lock\":{\"type\":\"object\",\"default\":{\"remove\":true,\"move\":false}}},\"parent\":[\"woocommerce/checkout-order-summary-block\"],\"textdomain\":\"wallet-for-woocommerce\",\"apiVersion\":2}"),
		component: CheckoutRedeemWalletFundFormBlock.getElement
	});

	// Register wallet fee inner block in the cart block.
	wc_blocks_checkout.registerCheckoutBlock({
		metadata: JSON.parse("{\"name\":\"woocommerce/wal-wc-cart-wallet-fee-block\",\"icon\":\"calculator\",\"keywords\":[\"wallet\",\"fee\"],\"version\":\"1.0.0\",\"title\":\"Wallet Fee\",\"description\":\"Shows the wallet fee layout in the cart block.\",\"category\":\"woocommerce\",\"supports\":{\"align\":false,\"html\":false,\"multiple\":false,\"reusable\":false},\"attributes\":{\"className\":{\"type\":\"string\",\"default\":\"\"},\"lock\":{\"type\":\"object\",\"default\":{\"remove\":true,\"move\":false}}},\"parent\":[\"woocommerce/cart-order-summary-block\"],\"textdomain\":\"wallet-for-woocommerce\",\"apiVersion\":2}"),
		component: WalletFeesBlock.getElement
	});

	// Register wallet fee inner block in the checkout block.
	wc_blocks_checkout.registerCheckoutBlock({
		metadata: JSON.parse("{\"name\":\"woocommerce/wal-wc-checkout-wallet-fee-block\",\"icon\":\"calculator\",\"keywords\":[\"wallet\",\"fee\"],\"version\":\"1.0.0\",\"title\":\"Wallet Fee\",\"description\":\"Shows the wallet fee layout in the checkout block.\",\"category\":\"woocommerce\",\"supports\":{\"align\":false,\"html\":false,\"multiple\":false,\"reusable\":false},\"attributes\":{\"className\":{\"type\":\"string\",\"default\":\"\"},\"lock\":{\"type\":\"object\",\"default\":{\"remove\":true,\"move\":false}}},\"parent\":[\"woocommerce/checkout-order-summary-block\"],\"textdomain\":\"wallet-for-woocommerce\",\"apiVersion\":2}"),
		component: WalletFeesBlock.getElement
	});

})();