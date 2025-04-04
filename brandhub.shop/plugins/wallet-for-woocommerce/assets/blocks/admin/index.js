/**
 * Editor block.
 * 
 * @since 3.7.0
 */
(() => {
	'use strict';

	var reactElement = window.wp.element,
			blocks = window.wp.blocks,
			wc_blocks_checkout = window.wc.blocksCheckout,
			blockEditor = window.wp.blockEditor,
			wp_components = window.wp.components,
			wc_plugin_data = window.wc.wcSettings;

	const{
		redeem_wallet_fund_form_title
	} = wc_plugin_data.getSetting('wal-wc-blocks_data');

	/**
	 * Redeem wallet fund form block class.
	 * 
	 * @since 3.7.0
	 * @return {JSX.Element} A Wrapper used to display the redeem wallet fund form in the cart/checkout block.
	 */
	const RedeemWalletFundFormBlock = {
		cartSchema: JSON.parse("{\"name\":\"woocommerce/wal-wc-cart-redeem-wallet-fund-form-block\",\"icon\":\"calculator\",\"keywords\":[\"redeem\",\"form\",\"wallet\",\"fund\"],\"version\":\"1.0.0\",\"title\":\"Redeem Wallet Fund Form\",\"description\":\"Shows the redeem wallet fund form layout in the cart block.\",\"category\":\"woocommerce\",\"supports\":{\"align\":false,\"html\":false,\"multiple\":false,\"reusable\":false},\"attributes\":{\"className\":{\"type\":\"string\",\"default\":\"\"},\"lock\":{\"type\":\"object\",\"default\":{\"remove\":true,\"move\":false}}},\"parent\":[\"woocommerce/cart-order-summary-block\"],\"textdomain\":\"wallet-for-woocommerce\",\"apiVersion\":2}"),
		checkoutSchema: JSON.parse("{\"name\":\"woocommerce/wal-wc-checkout-redeem-wallet-fund-form-block\",\"icon\":\"calculator\",\"keywords\":[\"redeem\",\"form\",\"wallet\",\"fund\"],\"version\":\"1.0.0\",\"title\":\"Redeem Wallet Fund Form\",\"description\":\"Shows the redeem wallet fund form layout in the checkout block.\",\"category\":\"woocommerce\",\"supports\":{\"align\":false,\"html\":false,\"multiple\":false,\"reusable\":false},\"attributes\":{\"className\":{\"type\":\"string\",\"default\":\"\"},\"lock\":{\"type\":\"object\",\"default\":{\"remove\":true,\"move\":false}}},\"parent\":[\"woocommerce/checkout-order-summary-block\"],\"textdomain\":\"wallet-for-woocommerce\",\"apiVersion\":2}"),
		getElement: function (e) {
			return   reactElement.createElement(wp_components.Disabled, {}, reactElement.createElement(wc_blocks_checkout.TotalsWrapper, {}, RedeemWalletFundFormBlock.getFormField()));
		},
		getFormField: function () {
			return reactElement.createElement(wc_blocks_checkout.Panel, {className: 'wal-redeem-wallet-fund-form-block', title: redeem_wallet_fund_form_title});
		},
		edit: function (attributes) {
			return reactElement.createElement('div', blockEditor.useBlockProps(), RedeemWalletFundFormBlock.getElement());
		},
		save: function (e) {
			return reactElement.createElement('div', blockEditor.useBlockProps.save());
		}
	};

	// Register inner block of redeem wallet fund form in the cart block.  
	blocks.registerBlockType(RedeemWalletFundFormBlock.cartSchema.name, {
		...RedeemWalletFundFormBlock.cartSchema,
		edit: RedeemWalletFundFormBlock.edit,
		save: RedeemWalletFundFormBlock.save
	});

	// Register inner block of redeem wallet form fund in the checkout block.  
	blocks.registerBlockType(RedeemWalletFundFormBlock.checkoutSchema.name, {
		...RedeemWalletFundFormBlock.checkoutSchema,
		edit: RedeemWalletFundFormBlock.edit,
		save: RedeemWalletFundFormBlock.save
	});
})();