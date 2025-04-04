/* global wal_refund_params, ajaxurl */

jQuery(function ($) {
	'use strict';

	if (typeof wal_refund_params === 'undefined') {
		return false;
	}

	var refund_processing = false;

	var WAL_Admin = {
		init: function ( ) {

			this.append_wallet_refund_button();
		}, append_wallet_refund_button: function () {
			$('.refund-actions .do-manual-refund').before(wal_refund_params.refund_button);
			$('#woocommerce-order-items').on('woocommerce_order_meta_box_do_refund_ajax_data', this.filter_refund_data);
			$('#woocommerce-order-items').on('click', '.refund-actions .do-api-wallet-refund', this.do_wallet_refund);
		}, filter_refund_data: function (eve, data) {
			if (!refund_processing) {
				return data;
			}

			data.wal_is_refund = 'yes';

			$('.refund-actions .do-api-wallet-refund').removeClass('do-manual-refund');

			return data;
		}, do_wallet_refund: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			if (refund_processing) {
				return false;
			}

			refund_processing = true;

			$($this).addClass('do-manual-refund');
			$('.do-api-wallet-refund').trigger('click');

			return true;
		}, block: function (id) {
			if (!WAL_Admin.is_blocked(id)) {
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
	WAL_Admin.init( );
});
