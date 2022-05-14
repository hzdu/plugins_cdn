/**
 * Frontend JS
 *
 * @package YITH\Dynamic\Assets\JS
 */

jQuery(
    function ($) {

        var block_params = {
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                },
                ignoreIfBlocked: true
            },
            default_table = $(document).find(ywdpd_qty_args.column_product_info_class + ' #ywdpd-quantity-table'),
        select_right_info = function (t, update_table) {
            var table = false;
            if (t.length) {
                table = t.parents('#ywdpd-quantity-table');
            } else {
                table = $(document).find(ywdpd_qty_args.column_product_info_class + ' #ywdpd-quantity-table');
            }

            if (table && table.length) {
                var td_qty = false,
                    td_price = false,
                    td_discount = false;
                if (table.hasClass('horizontal')) {
                    if (t.hasClass('qty-info')) {
                        td_qty = t;
                        td_price = table.find('td.qty-price-info').get(t.index() - 1);
                        td_discount = table.find('td.qty-discount-info').get(t.index() - 1);
                        td_price = $(td_price);
                        td_discount = $(td_discount);

                    } else if (t.hasClass('qty-price-info')) {
                        td_price = t;
                        td_qty = table.find('td.qty-info').get(t.index() - 1);
                        td_discount = table.find('td.qty-discount-info').get(t.index() - 1);
                        td_qty = $(td_qty);
                        td_discount = $(td_discount);
                    } else {
                        td_discount = t;
                        td_qty = table.find('td.qty-info').get(t.index() - 1);
                        td_price = table.find('td.qty-price-info').get(t.index() - 1);
                        td_qty = $(td_qty);
                        td_price = $(td_price);
                    }
                } else {
                    if (t.hasClass('qty-info')) {
                        td_qty = t;
                        td_price = t.parent().find('td.qty-price-info');
                        td_discount = t.parent().find('td.qty-discount-info');
                    } else if (t.hasClass('qty-price-info')) {
                        td_price = t;
                        td_qty = t.parent().find('td.qty-info');
                        td_discount = t.parent().find('td.qty-discount-info');
                    } else {
                        td_discount = t;
                        td_qty = t.parent().find('td.qty-info');
                        td_price = t.parent().find('td.qty-price-info');
                    }
                }

                table.find('td').removeClass('ywdpd_active');
                var product_type = table.data('product_type');
                if ('variable' !== product_type) {

                    var new_price = '';
                    if (t.length) {
                        new_price = td_qty.data('formatted_price');
                    } else {
                        new_price = table.data('price_html');
                    }
                    update_price_html(new_price);
                }

              if( t.length) {
                  td_qty.addClass('ywdpd_active');
                  td_price.addClass('ywdpd_active');
                  if (td_discount.length) {
                      td_discount.addClass('ywdpd_active');
                  }
              }
                if (update_table) {
                    update_qty_field(td_qty);
                }
            }
        };

        var select_default_qty = function () {

            if ('yes' === ywdpd_qty_args.is_default_qty_enabled) {
                var table = $(document).find('#ywdpd-quantity-table'),
                    td;

                if ('yes' === ywdpd_qty_args.show_minimum_price) {
                    td = table.find('td.qty-price-info').last();
                } else {
                    td = table.find('td.qty-price-info').first();
                }
                td.trigger('click');
            }
        };
        var update_price_html = function (price) {
            var extra_class = '';
            if ('' !== price) {
                if ($(ywdpd_qty_args.column_product_info_class).parents('.yith-quick-view-content').length) {
                    extra_class = '.yith-quick-view-content ';
                }
                var product_container = $(extra_class + ywdpd_qty_args.column_product_info_class);
                if (!product_container.find('.woocommerce-variation-price').length) {

                    product_container.find(ywdpd_qty_args.product_price_classes).html(price);
                } else {
                    var variations_price = product_container.find('.woocommerce-variation-price .price');

                    variations_price.html(price);
                }
                $(document).trigger('ywdpd_price_html_updated', [price]);
            }
        };

        var update_qty_field = function (td_qty) {

            var qty = 1;
            if (td_qty.length) {
                qty = ('*' !== td_qty.data('qtymax') && !ywdpd_qty_args.select_minimum_quantity) ? td_qty.data('qtymax') : td_qty.data('qtymin');
            }

            $(document).find('form.cart .qty').val(qty);

        };

        $(document).on(
            'click',
            '#ywdpd-quantity-table td',
            function (e) {
                e.preventDefault();
                select_right_info($(this), true);
            }
        );

        var formQtyChange = function(){
            var qty = parseInt($(this).val());
            if ('yes' === ywdpd_qty_args.is_change_qty_enabled && qty > 0) {
                var td_qty_range_info = $(this).parents(ywdpd_qty_args.column_product_info_class).find('#ywdpd-quantity-table')
                    .find('td.qty-info')
                    .filter(
                        function () {
                            var max = $(this).data('qtymax');
                            if (max !== '*') {
                                return $(this).data('qtymin') <= qty && $(this).data('qtymax') >= qty;
                            } else {
                                return $(this).data('qtymin') <= qty;
                            }
                        }
                    );
                select_right_info(td_qty_range_info,false);
            }
        };
        $(document).on(
            'change',
            'form.cart .qty',
            formQtyChange
        );
        select_default_qty();

        $(ywdpd_qty_args.variation_form_class)
            .on('check_variations',function(){
                    $(document).off(
                        'change',
                        'form.cart .qty');
                }
            )
            .on(
                'found_variation',
                function (e, variation) {
                    var product_container = $(this).parents(ywdpd_qty_args.column_product_info_class),
                        table_wrapper = product_container.find('.ywdpd-table-discounts-wrapper');

                    if (!table_wrapper.length) {
                        table_wrapper = $(this).closest('.ywdpd-table-discounts-wrapper');
                    }

                    table_wrapper.replaceWith(variation.table_price);
                    select_default_qty();
                    $(document).find('form.cart .qty').on('change',formQtyChange).trigger('change');
                }
            )
            .on(
                'reset_data',
                function () {
                    var product_container = $(this).parents(ywdpd_qty_args.column_product_info_class),
                        table_wrapper = product_container.find('.ywdpd-table-discounts-wrapper');

                    if (!table_wrapper.length) {
                        table_wrapper = $(this).closest('.ywdpd-table-discounts-wrapper');
                    }

                    if ('yes' === ywdpd_qty_args.show_variable_table) {
                        table_wrapper.html(default_table);
                        select_default_qty();
                    } else {
                        table_wrapper.hide();
                    }
                }
            );
    }
);
