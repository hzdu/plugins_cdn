
jQuery(function ($) {
	'use strict';

	var WAL_Product_Purchase = {
		init: function ( ) {
			// Trigger a product purchase commission type
			$(document).on('change', '#wal_module_product_purchase_mode', this.trigger_product_purchase_mode);
			$(document).on('change', '#wal_module_product_purchase_fund_type', this.trigger_product_purchase_fund_type);
			// Add product purchase range rules
			$(document).on('click', '.wal-add-new-product-purchase-range-rule', this.handle_add_product_purchase_range_rule);
			// Remove product purchase fund rule.
			$(document).on('click', '.wal-remove-fund-rule', this.remove_product_purchase_fund_rule);
			this.trigger_on_page_load();

		},
		/**
		 * Trigger on page load
		 * 
		 * @since 3.1.0        
		 */
		trigger_on_page_load: function ( ) {
			WAL_Product_Purchase.product_purchase_mode("#wal_module_product_purchase_mode");
			WAL_Product_Purchase.product_purchase_fund_type("#wal_module_product_purchase_fund_type");
		},
		/**
		 * Trigger product purchase mode
		 * 
		 * @since 3.1.0
		 * @param event event
		 */
		trigger_product_purchase_mode: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget);

			WAL_Product_Purchase.product_purchase_mode($this);
		},
		/**
		 * Trigger product purchase fund type
		 * 
		 * @since 3.1.0
		 * @param event event
		 */
		trigger_product_purchase_fund_type: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget);

			WAL_Product_Purchase.product_purchase_fund_type($this);
		},
		/**
		 * Prouct purchase mode
		 * 
		 * @since 3.1.0
		 * @param element $this
		 */
		product_purchase_mode: function ($this) {
			$('.wal-product-purchase-fund').closest('tr').hide();
			$('.wal-order-total-fund').closest('tr').hide();
			WAL_Product_Purchase.product_purchase_fund_type($this);
		},
		/**
		 * Prouct purchase fund type
		 * 
		 * @since 3.1.0
		 * @param element $this
		 */
		product_purchase_fund_type: function ($this) {
			$('#wal_module_product_purchase_fund_type').closest('tr').hide( );
			$('#wal_module_product_purchase_order_fund_type').closest('tr').hide( );
			$('#wal_module_product_purchase_order_total_range_priority').closest('tr').hide( );
			$('#wal_module_product_purchase_amount').closest('tr').show( );
			$('.wal-product-purchase-order-total-range-table').hide();
			if ('1' === $('#wal_module_product_purchase_mode').val()) {
				$('#wal_module_product_purchase_fund_type').closest('tr').show( );
			} else if ('2' === $('#wal_module_product_purchase_mode').val()) {
				$('#wal_module_product_purchase_order_fund_type').closest('tr').show( );
				$('#wal_module_product_purchase_order_total_minimum_amount').closest('tr').show( );
				$('#wal_module_product_purchase_order_total_maximum_amount').closest('tr').show( );
			} else {
				$('.wal-product-purchase-order-total-range-table').show();
				$('#wal_module_product_purchase_amount').closest('tr').hide( );
				$('#wal_module_product_purchase_order_total_minimum_amount').closest('tr').hide( );
				$('#wal_module_product_purchase_order_total_maximum_amount').closest('tr').hide( );
				$('#wal_module_product_purchase_order_total_range_priority').closest('tr').show( );
			}
		},
		/**
		 * Handle add prouct purchase range rule
		 * 
		 * @since 3.4.0
		 * @param event event
		 */
		handle_add_product_purchase_range_rule: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget),
					group_template = wp.template('wal-product-purchase-order-total-range-rules'),
					wrapper = $($this).closest('.wal-product-purchase-order-total-range-table'),
					unique_id = Math.floor(Math.random() * 26) + Date.now();

			wrapper.find('tbody').append(group_template({group_id: unique_id}));
		},
		/**
		 * Remove product purchasefund rule
		 * 
		 * @since 3.4.0
		 * @param event event
		 */
		remove_product_purchase_fund_rule: function (event) {
			event.preventDefault( );
			var $this = $(event.currentTarget);
			if (!confirm(wal_admin_params.delete_confirm_msg)) {
				return false;
			}

			$this.closest('tr').remove( );
		}
	};
	WAL_Product_Purchase.init( );
});
