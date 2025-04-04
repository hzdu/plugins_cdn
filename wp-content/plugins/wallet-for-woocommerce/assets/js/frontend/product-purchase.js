
/* global wal_product_purchase_params, wal_product_purchase_frontend_params */

jQuery(function ($) {
	'use strict';

	var WAL_Product_Purchase = {
		init: function ( ) {
			$(document).on('show_variation', this.onFoundVariation);
			$(document).on('hide_variation', this.onResetVariation);
		}, onFoundVariation: function (evt, variation, purchasable) {
			WAL_Product_Purchase.onResetVariation();
			if ($('.wal-variation-product-notice').length && variation && variation.wal_variation_notice) {
				$('.wal-variation-product-notice').html(variation.wal_variation_notice);
				$('.wal-variation-product-notice').show();
			} else {
				$('.wal-variation-product-notice').hide();
			}
		}, onResetVariation: function (evt) {
			if ($('.wal-variation-product-notice').length) {
				$('.wal-variation-product-notice').hide();
			}
		}
	};

	WAL_Product_Purchase.init( );
});
