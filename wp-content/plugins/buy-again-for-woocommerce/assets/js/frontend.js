/* global bya_frontend_params */

jQuery(function ($) {
    'use strict';

    var BYA_Frontend = {
        init: function () {
            this.trigger_on_page_load();

            $(document).on('click', '.bya_filter_button', this.toggle_bya_table_filter)
            $(document).on('change', '.bya_qty_field', this.change_qty_field_value);
            $(document).on('click', '.bya_add_to_cart_btn', this.add_to_cart);
            $(document).on('click', '.buy_again_btn', this.buy_again);
            $(document).on('click', '.bya_pagination', this.buy_again_pagination_key_change);
            $(document).on('change', '.bya-current-page', this.buy_again_pagination_val_change);
            $(document).on('change', '.bya_sort_action_selector', this.buy_again_product_sort)
            $(document).on('change', '.bya_time_filter', this.change_time_filter_actions);
            $(document).on('change', '.bya_start_date, .bya_end_date', this.change_start_end_datepicker);

            $(window).click(function () {
                $('div.bya_dialog_box').hide();
            });
        },

        trigger_on_page_load: function (event) {
            $('bya_product_search_inp').val();
            BYA_Frontend.time_filter_actions('.bya_time_filter');

            var currentPageNo = localStorage.getItem("current_page");

            if ('' !== currentPageNo && null !== currentPageNo) {
                localStorage.setItem("current_page", '');
                $('.bya-current-page').val(currentPageNo);
                BYA_Frontend.buy_again_pagination(currentPageNo);
            }
        },

        change_start_end_datepicker: function (event) {
            event.preventDefault();
            var $time_filter = $('.bya_time_filter').val();

            if ('6' !== $time_filter) {
                $('.bya_time_filter').val('6');
            }
        },

        change_time_filter_actions: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Frontend.time_filter_actions($this);
        }, time_filter_actions($this) {
            var today = new Date();
            var from_date = '';
            var $start_date = $('.bya_start_date');
            var $end_date = $('.bya_end_date');

            if ($.inArray($($this).val(), ['', '6']) !== -1) {
                if ('6' === $($this).val()) {
                    $('.bya_time_filter_field').closest('div').show();

                } else {
                    $('.bya_time_filter_field').closest('div').hide();
                    $start_date.val('');
                    $start_date.next('.bya_alter_datepicker_value').val('');

                    $end_date.val('');
                    $end_date.next('.bya_alter_datepicker_value').val('');
                }
            } else {
                $('.bya_time_filter_field').closest('div').show();

                if ('2' === $($this).val()) {
                    var from_date = new Date(new Date().setDate(today.getDate() - 30));
                } else if ('3' === $($this).val()) {
                    var from_date = new Date(new Date().setDate(today.getDate() - 60));
                } else if ('4' === $($this).val()) {
                    var from_date = new Date(new Date().setDate(today.getDate() - 90));
                } else if ('5' === $($this).val()) {
                    var from_date = new Date(new Date().setDate(today.getDate() - 180));
                }


                from_date = moment(from_date, 'YYYY-MM-DD').format("YYYY-MM-DD");
                $start_date.val(from_date);
                $start_date.next('.bya_alter_datepicker_value').val(from_date);

                var to_date = moment(today, 'YYYY-MM-DD').format("YYYY-MM-DD");
                $end_date.val(to_date);
                $end_date.next('.bya_alter_datepicker_value').val(to_date);
            }
        },

        toggle_bya_table_filter: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            $('.bya_table_filter_wrap').fadeToggle();
        },

        change_qty_field_value: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Frontend.qty_field_value($this);
        }, qty_field_value: function ($this) {
            if ('yes' == bya_frontend_params.ajax_add_to_cart) {
                var qty = $($this).val(),
                    variation_id = $($this).data('variation_id'),
                    product_id = $($this).data('product_id'),
                    add_to_cart_btn_key = (variation_id == 0) ? '.bya_ajax_add_to_cart_' + product_id : '.bya_ajax_add_to_cart_' + variation_id,
                    buy_again_btn_key = (variation_id == 0) ? '.bya_buy_again_' + product_id : '.bya_buy_again_' + variation_id;

                if (qty == 0) {
                    $(add_to_cart_btn_key).addClass('disabled');
                    $(buy_again_btn_key).addClass('disabled');
                } else {
                    $(add_to_cart_btn_key).removeClass('disabled');
                    $(buy_again_btn_key).removeClass('disabled');
                }

                $(add_to_cart_btn_key).attr('data-quantity', qty);
            }

            var product_id = $($this).data('product_id');
            var variation_id = $($this).data('variation_id');
            var qty = $($this).val();

            if ('0' == variation_id) {
                $('.bya_qty_field_' + variation_id).val(qty)
            } else {
                $('.bya_qty_field_' + product_id).val(qty)
            }
        },

        qty_validation: function (qty_id) {
            var qty = (undefined == $(qty_id).val()) ? parseInt(1) : parseInt($(qty_id).val()),
                min = parseInt($(qty_id).attr('min')),
                max = parseInt($(qty_id).attr('max')),
                step = parseInt($(qty_id).attr('step')),
                msg = '';

            if ('' != min && qty < min) {
                msg = 'Please select the value that is not less than ' + min + '.';
            } else if ('' != max && qty > max) {
                msg = 'Please select the value that is not more than ' + max + '.';
            } else if ('' != step && step > 1) {
                var remaining_val = qty % step;

                if (0 < remaining_val) {
                    var need_val = step - remaining_val;
                    var to_val = qty + need_val;
                    var from_val = to_val - step;

                    msg = 'Please select a valid value. The two nearest valid values are ' + from_val + ' and ' + to_val + '.';
                }
            }

            return msg;
        },

        add_to_cart: function (event) {
            event.preventDefault();

            var $this = $(event.currentTarget),
                product_id = $this.data('product_id'),
                variation_id = $this.data('variation_id'),
                redirect_url = $this.data('redirect_url'),
                price = $this.data('price'),
                qty_id = ('' === variation_id) ? '#bsf_qty_' + product_id : '#bsf_qty_' + variation_id,
                qty = (undefined == $(qty_id).val()) ? parseInt(1) : parseInt($(qty_id).val()),
                msg = BYA_Frontend.qty_validation(qty_id),
                currentPageNo = $('.bya-current-page').val();

            if ('' != msg) {
                $(qty_id).next('div.bya_dialog_box').html('<p>' + msg + '</p>');
                $(qty_id).next('div.bya_dialog_box').show();
                return false;
            }

            if ('' !== redirect_url) {
                window.location.replace(redirect_url);
                return true;
            }

            BYA_Frontend.block($this);
            var data = ({
                action: 'bya_add_to_cart_product',
                product_id: product_id,
                variation_id: variation_id,
                order_id: $this.data('bya_order_id'),
                price: price,
                qty: qty,
                bya_security: bya_frontend_params.add_to_cart_nonce,
            });
            $.post(bya_frontend_params.ajaxurl, data, function (res) {
                if (res.hasOwnProperty('cart_hash')) {
                    if ('yes' == bya_frontend_params.ajax_add_to_cart) {
                        $(document.body).trigger('added_to_cart', [res.fragments, res.cart_hash, $this]);

                        if ('yes' == bya_frontend_params.redirect_add_to_cart) {
                            location.replace(bya_frontend_params.cart_url);
                        }
                    } else {
                        window.location.reload(true);
                        localStorage.setItem("current_page", currentPageNo);
                    }
                } else {
                    window.location.reload(true);
                    localStorage.setItem("current_page", currentPageNo);
                }

                BYA_Frontend.unblock($this);
            });
        },

        buy_again: function (event) {
            var $this = $(event.currentTarget),
                product_id = $this.val(),
                variation_id = $this.data('variation_id'),
                price = $this.data('price'),
                qty_id = ('' === variation_id) ? '#bsf_qty_' + product_id : '#bsf_qty_' + variation_id,
                qty = (undefined == $(qty_id).val()) ? 1 : $(qty_id).val(),
                msg = BYA_Frontend.qty_validation(qty_id);

            if ('' != msg) {
                $(qty_id).next('div.bya_dialog_box').html(msg);
                $(qty_id).next('div.bya_dialog_box').show();
                return false;
            }

            BYA_Frontend.block($this);
            var data = ({
                action: 'bya_buy_again_product',
                product_id: product_id,
                variation_id: variation_id,
                order_id: $this.data('bya_order_id'),
                price: price,
                qty: qty,
                bya_security: bya_frontend_params.buy_again_nonce,
            });
            $.post(bya_frontend_params.ajaxurl, data, function (res) {
                if (true === res.success) {
                    location.replace(res.data.page_url);
                } else {
                    alert(res.data.error);
                }
                BYA_Frontend.unblock($this);
            }
            );
        },
        buy_again_pagination_val_change(e) {
            e.preventDefault()
            let page_no = $(this).val();
            BYA_Frontend.buy_again_pagination(page_no);
        }, buy_again_pagination_key_change(e) {
            e.preventDefault()
            let page_no = $(this).data('page');
            BYA_Frontend.buy_again_pagination(page_no);
        }, buy_again_pagination: function (page_no) {
            var table = $('table.bya_buy_again_product_table'),
                table_body = table.find('tbody'),
                search_inp = $('.bya_product_search_inp').val(),
                current_page = page_no,
                total_page = $('.bya-paging-text').data('total_page'),
                orderby = bya_frontend_params.orderby,
                order = bya_frontend_params.order;

            if ('' == current_page || 0 == current_page) {
                current_page = 1
            }

            if (current_page > total_page) {
                current_page = total_page;
            }

            $('.bya-current-page').val(current_page);

            var data = ({
                action: 'bya_products_pagination',
                page_number: current_page,
                inp: search_inp,
                orderby: orderby,
                order: order,
                page_url: bya_frontend_params.current_page_url,
                bya_get_my_account_end_point_url: bya_frontend_params.bya_get_my_account_end_point_url,
                bya_security: bya_frontend_params.pagination_nonce,
            });

            BYA_Frontend.block(table_body);

            $.post(bya_frontend_params.ajaxurl, data, function (res) {
                if (true === res.success) {
                    table_body.html(res.data.html);

                    let nextPageNo = (current_page < total_page) ? Number(current_page) + 1 : total_page,
                        prevPageNo = (current_page > 1) ? Number(current_page) - 1 : 1;

                    table.find('.bya_next_pagination').data('page', nextPageNo);
                    table.find('.bya_prev_pagination').data('page', prevPageNo);
                    table.find('.bya_pagination').removeClass('bya_readonly');

                    if (current_page >= total_page) {
                        table.find('.bya_last_pagination').addClass('bya_readonly');
                        table.find('.bya_next_pagination').addClass('bya_readonly');
                    }

                    if ((current_page <= 1)) {
                        table.find('.bya_first_pagination').addClass('bya_readonly');
                        table.find('.bya_prev_pagination').addClass('bya_readonly');
                    }
                } else {
                    alert(res.data.error);
                }

                BYA_Frontend.unblock(table_body);
            });
        },

        buy_again_product_search: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget),
                wrapper = $this.closest('div.bya_myaccount_buy_again_wrapper'),
                search_inp = $('.bya_product_search_inp').val();

            var data = ({
                action: 'bya_products_search',
                inp: search_inp,
                page_url: bya_frontend_params.current_page_url,
                bya_security: bya_frontend_params.search_nonce,
            });

            BYA_Frontend.block(wrapper);

            $.post(bya_frontend_params.ajaxurl, data, function (res) {
                if (true === res.success) {
                    wrapper.html(res.data.html);
                    $('.bya_product_search_inp').val(search_inp);
                } else {
                    alert(res.data.error);
                }

                BYA_Frontend.unblock(wrapper);
            }
            );
        },

        buy_again_product_sort: function (event) {
            event.preventDefault();
            var $this = event.currentTarget;
            var url = bya_frontend_params.current_url;
            var args = { 'orderby': 'title', 'order': 'asc' };

            if ('3' == $($this).val()) {
                args['order'] = 'desc';
            } else if ('1' == $($this).val()) {
                args['orderby'] = 'recent';
                url = BYA_Frontend.remove_url_args('order', url);
                delete args.order;
            }

            $.each(args, function (index, value) {
                url = BYA_Frontend.add_url_args(index, value, url);
            });

            window.location.replace(url);
        },

        add_url_args: function (key, value, url) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = url.indexOf('?') !== -1 ? "&" : "?";

            if (url.match(re)) {
                return url.replace(re, '$1' + key + "=" + value + '$2');
            } else {
                return url + separator + key + "=" + value;
            }

        },

        remove_url_args: function (key, url) {
            var re = new RegExp("([?&])" + key + "=.*(&|$)", "i");

            return (url.match(re)) ? url.replace(re, '') : url;
        },

        block: function (id) {
            $(id).block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.7
                }
            });
        },

        unblock: function (id) {
            $(id).unblock();
        },
    };

    BYA_Frontend.init();
});
