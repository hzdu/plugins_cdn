/**
 * Gift Popup JS
 *
 * @package YITH\Dynamic\Assets\JS
 */

jQuery(
    function ($) {

        var gift_popup = $(document).find('.ywdpd_popup');

        var block_params = {
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            },
            ignoreIfBlocked: true
        };

        var total_product_to_add_by_rule = {},
            product_added_with_qty_by_rule = {},
            product_variation_added_by_rule = {},
            hashCode = function (s) {
                var h = 0, i = s.length;
                while (i > 0) {
                    h = (h << 5) - h + s.charCodeAt(--i) | 0;
                }
                return h;
            },
            init_global_var = function () {
                gift_popup.find('.ywdpd_single_rule_container').each(
                    function () {
                        var id = $(this).attr('id'),
                            amount_item = $(this).data('allowed_items');

                            total_product_to_add_by_rule[id] = parseInt(amount_item);
                            product_added_with_qty_by_rule[id] = [];
                            product_variation_added_by_rule[id] = [];
                    }
                );
            },
            get_allowed_item_by_rule = function (rule_id) {
                var items = 0;
                rule_id = "" + rule_id;
                if (rule_id.indexOf('ywdpd_single_rule_') === -1) {
                    rule_id = 'ywdpd_single_rule_' + rule_id;
                }
                if (total_product_to_add_by_rule[rule_id]) {
                    items = total_product_to_add_by_rule[rule_id];
                }
                return items;
            },
            get_qty_added = function (rule, key) {

                var total = 0;

                var items = $(rule).find('li.product.item .ywdpd_qty');
                if (typeof key == 'undefined') {
                    key = '';
                }

                items.each(
                    function () {
                        var t = $(this);
                        if ('' === key || (key !== t.attr('id'))) {
                            var qty = t.html();
                            qty = '' === qty ? 0 : parseInt(qty);
                            total = total + qty;
                        }
                    }
                );

                return total;
            },
            add_product_in_list = function (rule_id, product_id, variation_id, variations) {
                rule_id = "" + rule_id;
                if (rule_id.indexOf('ywdpd_single_rule_') === -1) {
                    rule_id = 'ywdpd_single_rule_' + rule_id;
                }
                if (typeof variation_id === 'undefined') {
                    variation_id = '';
                }

                if (typeof variations === 'undefined') {
                    variations = {};
                }
                var key = product_id + '_' + variation_id + '_' + JSON.stringify(variations);
                key = hashCode(key);

                if (found_index_product_in_list(rule_id, key) === -1) {
                    var obj = {
                        key: key,
                        product_id: product_id,
                        variation_id: variation_id,
                        variations: variations,
                        quantity: 1
                    };
                    product_added_with_qty_by_rule[rule_id].push(obj);
                }

                return key;
            },
            remove_product_in_list = function (rule_id, key) {
                rule_id = "" + rule_id;
                if (rule_id.indexOf('ywdpd_single_rule_') === -1) {
                    rule_id = 'ywdpd_single_rule_' + rule_id;
                }

                var index = found_index_product_in_list(rule_id, key);
                if (index >= 0) {
                    product_added_with_qty_by_rule[rule_id].splice(index, 1);
                }

            },
            increase_quantity_in_product_list = function (rule_id, key) {
                rule_id = "" + rule_id;
                if (rule_id.indexOf('ywdpd_single_rule_') === -1) {
                    rule_id = 'ywdpd_single_rule_' + rule_id;
                }

                var index = found_index_product_in_list(rule_id, key);

                if (index >= 0) {

                    var rule = product_added_with_qty_by_rule[rule_id][index];
                    rule.quantity = rule.quantity + 1;
                    product_added_with_qty_by_rule[rule_id][index] = rule;

                }

            },
            found_index_product_in_list = function (rule_id, key) {
                var index = -1;
                rule_id = "" + rule_id;
                if (rule_id.indexOf('ywdpd_single_rule_') === -1) {
                    rule_id = 'ywdpd_single_rule_' + rule_id;
                }

                if (product_added_with_qty_by_rule[rule_id]) {

                    var product_in_rules = product_added_with_qty_by_rule[rule_id];
                    $.each(
                        product_in_rules,
                        function (i, rule) {

                            if (rule.key == key) {

                                index = i;
                                return false;
                            }
                        }
                    );
                }
                return index;
            },
            decrease_quantity_in_product_list = function (rule_id, key) {
                rule_id = "" + rule_id;
                if (rule_id.indexOf('ywdpd_single_rule_') === -1) {
                    rule_id = 'ywdpd_single_rule_' + rule_id;
                }
                var index = found_index_product_in_list(rule_id, key);

                if (index >= 0) {

                    var rule = product_added_with_qty_by_rule[rule_id][index];
                    rule.quantity = rule.quantity - 1;
                    product_added_with_qty_by_rule[rule_id][index] = rule;

                }
            },
            show_confirm_button = function (rule_id) {
                var tot = gift_popup.find('.ywdpd_single_rule_container').length,
                    btn = gift_popup.find('.ywdpd_btn_container');

                if (get_allowed_item_by_rule(rule_id) > 1 || tot > 1) {

                    if (btn.length) {
                        btn.show();
                    }
                } else {
                    btn.find('a').click();
                }

            },
            init_component = function () {
                init_qty_field();
                gift_popup.on(
                    'click',
                    '.ywdpd_step1 ul.ywdpd_popup_items li.product .single_add_to_cart_button',
                    function (e) {
                        e.preventDefault();
                        var li = $(this).closest('li.product.item'),
                            product_id = li.data('product_id'),
                            rule_id = li.data('ywdpd_rule_id'),
                            product_type = li.data('product_type'),
                            items_allowed = get_allowed_item_by_rule(rule_id);

                        if (!$(this).hasClass('variable')) {
                            // add gift product in the cart.
                            $(document).trigger('ywdpd_first_product_added', [li, rule_id, product_id, items_allowed]);

                        } else {
                            // show second step.
                            var type = $(this).data('ywdpd_action');

                            var data = {
                                product_id: product_id,
                                rule_id: rule_id,
                                action: ywdpd_popup_args.actions.show_second_step,
                                security: ywdpd_popup_args.nonces.show_second_step,
                                rule_type: type
                            };
                            $.ajax(
                                {
                                    type: 'POST',
                                    url: ywdpd_popup_args.ajax_url,
                                    data: data,
                                    dataType: 'json',
                                    beforeSend: function () {
                                        li.parents('.ywdpd_single_rule_container').block(block_params);
                                    },
                                    success: function (response) {

                                        if (response.template !== '') {

                                            go_to_step2(response.template);
                                        }

                                    },
                                    complete: function () {
                                        li.parents('.ywdpd_single_rule_container').unblock();
                                    }
                                }
                            );
                        }

                    }
                );
                gift_popup.on(
                    'click',
                    '.ywdpd_btn_container a',
                    function () {

                        var step1 = $(this).parents('.ywdpd_step1'),
                            rule_to_apply = step1.find('.ywdpd_single_rule_container'),
                            count = 0,
                            tot_rule = rule_to_apply.length;
                        $('.ywdpd_popup_stage').block(block_params);
                        rule_to_apply.each(
                            function () {
                                count++;
                                var ajax_action,
                                    ajax_nonces;

                                if ($(this).hasClass('gift_products')) {
                                    ajax_action = ywdpd_popup_args.actions.add_gift_to_cart;
                                    ajax_nonces = ywdpd_popup_args.nonces.add_gift_to_cart;
                                } else if ($(this).hasClass('special_offer')) {
                                    ajax_action = ywdpd_popup_args.actions.add_special_to_cart;
                                    ajax_nonces = ywdpd_popup_args.nonces.add_special_to_cart;
                                } else {
                                    ajax_action = ywdpd_popup_args.actions.add_bogo_to_cart;
                                    ajax_nonces = ywdpd_popup_args.nonces.add_bogo_to_cart;
                                }
                                var data = {
                                    rules_to_apply: product_added_with_qty_by_rule,
                                    action: ajax_action,
                                    security: ajax_nonces,
                                };
                                $.ajax(
                                    {
                                        type: 'POST',
                                        url: ywdpd_popup_args.ajax_url,
                                        data: data,
                                        dataType: 'json',
                                        success: function (response) {
                                            if (count == tot_rule) {
                                                setTimeout(
                                                    function () {
                                                        if (typeof response.fragments !== 'undefined') {

                                                            $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash]);
                                                        }
                                                    },
                                                    1000
                                                );
                                            }
                                        },
                                        complete: function () {
                                            if (count == tot_rule) {
                                                $('.ywdpd_popup_stage').unblock();
                                                close_popup(true);
                                            }
                                        }
                                    }
                                );
                            }
                        );

                    }
                );
                gift_popup.on('click', '.ywdpd_close', function (e) {
                    close_popup(false);
                });
                gift_popup.on('click', function (e) {
                    if ( typeof  e.originalEvent !== 'undefined' && e.originalEvent.target.className.indexOf('ywdpd_popup cart') >= 0) {
                        close_popup(false);
                    }
                });
            },
            init_popup = function () {
                init_global_var();
                init_slider();
                init_component();
            },
            show_popup = function () {

                init_popup();
                setTimeout(
                    function () {
                        gift_popup.fadeIn(300);
                        center();
                        $(document).trigger('ywdpd_popup_ready');
                    },
                    900
                );

            },
            close_popup = function (with_changes) {
                with_changes = typeof with_changes !== 'undefined' ? with_changes : false;
                gift_popup.fadeOut(300);
                if (gift_popup.hasClass('cart') && with_changes) {
                    $(document).trigger('wc_update_cart');
                }
            },
            update_counter = function (rule_id) {

                var single_rule = $(document).find('#ywdpd_single_rule_' + rule_id),
                    allowed_items = get_allowed_item_by_rule(rule_id),
                    tot_added = get_qty_added(single_rule),
                    remain = allowed_items - tot_added;
                if (remain == 0) {
                    single_rule.find('.ywdpd_qty_increase.button').addClass('disabled');
                    single_rule.find('.single_add_to_cart_button.button').addClass('disabled');
                } else {
                    single_rule.find('.ywdpd_qty_increase.button').removeClass('disabled');
                    single_rule.find('.single_add_to_cart_button.button').removeClass('disabled');
                }
            },
            init_slider = function () {
                var max_items = 3,
                    sliders = gift_popup.find('.ywdpd_popup_stage');

                sliders.each(
                    function () {

                        var slider = $(this).find('.owl-carousel'),
                            item = parseInt(slider.find('li').length),
                            autoWidth = true,
                            margin = 30,
                            center = false,
                            nav = true,
                            ul = $(this).find('ul.ywdpd_popup_items');

                        item = item > max_items ? max_items : item;

                        if (item > 1) {

                            if (item >= 3) {
                                ul.css({'padding-left': '5px'});
                            }else{

                                ul.css({'padding-left': '30px'});
                            }

                            slider.owlCarousel(
                                {
                                    loop: false,
                                    margin: margin,
                                    center: center,
                                    autoWidth: autoWidth,
                                    nav: nav,
                                    rtl: 'true' === ywdpd_popup_args.rtl,
                                    navText: ['<span></span>', '<span></span>'],
                                    responsiveClass: true,
                                    onInitialized: function (e) {

                                        var count = e.item.count;

                                        if (count > 1) {
                                            ul.find('.owl-stage').css({'margin': '0 auto'});
                                        }
                                    },
                                    responsive: {
                                        0: {
                                            items: 1,
                                            autoWidth: false,
                                            margin: 10
                                        },
                                        721: {
                                            items: item
                                        },
                                        1000: {
                                            items: item
                                        }
                                    }
                                }
                            );
                        } else {
							ul.addClass('ywdpd_one_item');
                        }
                    }
                );

            },
            init_qty_field = function () {

                $(document).find('.ywdpd_qty_arrows, .single_add_to_cart_button').on(
                    'touchstart mousedown',
                    function (e) {
                        // Prevent carousel swipe.

                        e.stopImmediatePropagation();

                    }
                );

                $(document).on(
                    'click',
                    '.ywdpd_qty_remove.button',
                    function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        var qty_field = $(this).closest('.ywdpd_qty_input').find('.ywdpd_qty'),
                            button = $(this).parents('.ywdpd_qty_fields_container').parent().find('.single_add_to_cart_button'),
                            rule_container = $(this).closest('.ywdpd_single_rule_container'),
                            li = qty_field.closest('li.product.item'),
                            rule_id = li.data('ywdpd_rule_id'),
                            key = qty_field.attr('id');

                        remove_product_in_list(rule_id, key);

                        if (button.hasClass('variable')) {
                            qty_field.parent().parent().remove();
                            if (!$(this).parents('.ywdpd_qty_fields_container').find('.ywdpd_qty_field').length) {
                                li.removeClass('added');
                            }
                        } else {
                            qty_field.attr('id', '');
                            qty_field.html('');
                            qty_field.parent().parent().hide();
                            li.removeClass('added');
                            button.show();
                        }

                        update_counter(rule_id);

                    }
                );
                $(document).on(
                    'click',
                    '.ywdpd_qty_decrease.button',
                    function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        var qty_field = $(this).closest('.ywdpd_qty_input').find('.ywdpd_qty'),
                            rule_container = $(this).closest('.ywdpd_single_rule_container'),
                            li = qty_field.closest('li.product.item'),
                            rule_id = li.data('ywdpd_rule_id'),
                            product_id = li.data('product_id'),
                            min_num_allowed = 1,
                            current_number = parseInt(qty_field.html()),
                            new_value = current_number - 1;

                        if (new_value >= min_num_allowed) {
                            qty_field.html(new_value);
                            $(document).trigger('ywdpd_product_qty_decreased', [$(this), li, rule_id, product_id, qty_field]);
                        }

                        if (new_value == 1) {
                            $(this).addClass('disabled').removeClass('visible');
                            $(this).closest('.ywdpd_qty_input').find('.ywdpd_qty_remove').addClass('visible');
                        } else {
                            $(this).removeClass('disabled');
                        }

                        var max = get_qty_added(rule_container),
                            max_num_allowed = get_allowed_item_by_rule(rule_id);

                        if (max < max_num_allowed) {
                            $('.ywdpd_qty_input .ywdpd_qty_increase').removeClass('disabled');
                            $(rule_container).find('.single_add_to_cart_button').removeClass('disabled');
                        }

                    }
                );
                $(document).on(
                    'click',
                    '.ywdpd_qty_increase.button',
                    function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        var qty_field = $(this).closest('.ywdpd_qty_input').find('.ywdpd_qty'),
                            rule_container = $(this).closest('.ywdpd_single_rule_container'),
                            li = qty_field.closest('li.product.item'),
                            rule_id = li.data('ywdpd_rule_id'),
                            product_id = li.data('product_id'),
                            max_num_allowed = parseInt(get_allowed_item_by_rule(rule_id)),
                            current_number = qty_field.html(),
                            new_value,
                            max = get_qty_added(rule_container, qty_field.attr('id'));

                        current_number = '' === current_number ? 0 : parseInt(current_number);
                        new_value = current_number + 1;
                        max = max_num_allowed - max;

                        if (new_value <= max) {
                            qty_field.html(new_value);
                            $(document).trigger('ywdpd_product_qty_increased', [$(this), li, rule_id, product_id, qty_field]);
                        }

                        if (new_value == max) {
                            $('.ywdpd_qty_input .ywdpd_qty_increase').addClass('disabled');
                            $(this).closest('.ywdpd_qty_input').find('.ywdpd_qty_decrease').removeClass('disabled');
                            $(rule_container).find('.single_add_to_cart_button').addClass('disabled');
                        } else {
                            $('.ywdpd_qty_input .ywdpd_qty_increase').removeClass('disabled');
                        }

                        if (new_value > 1) {
                            $(this).closest('.ywdpd_qty_input').find('.ywdpd_qty_decrease').addClass('visible');
                            $(this).closest('.ywdpd_qty_input').find('.ywdpd_qty_remove').removeClass('visible');
                        }
                    }
                );
            },
            back_to_step1 = function () {
                gift_popup.find('.ywdpd_step2').fadeOut(
                    300,
                    function () {
                        gift_popup.find('.ywdpd_step1').fadeIn(300);
                        gift_popup.find('.ywdpd_step2').html('');
                    }
                );

            },
            go_to_step2 = function (template) {

                gift_popup.find('.ywdpd_step1').fadeOut(
                    300,
                    function () {
                        gift_popup.find('.ywdpd_step2').html(template);
                        gift_popup.find('.ywdpd_step2 .variations_form').each(
                            function () {
                                $(this).wc_variation_form();
                            }
                        );

                        variation_events();
                        init_variation_form();
                        add_variable_gift();
                        gift_popup.find('.ywdpd_step2').fadeIn(300);
                        $(document).trigger('ywdpd_step2_initialized');
                    }
                );

            },
            center = function () {

                var popup_wrapper = gift_popup.find('.ywdpd_popup_wrapper'),
                    rules = popup_wrapper.find('.ywdpd_single_rule_container'),
                    max_width = 715,
                    current_width = popup_wrapper.css('width'),
                    w,
                    h = popup_wrapper.outerHeight(),
                    W = $('.ywdpd_popup').width(),
                    H = $('.ywdpd_popup').height(),
                    screen_width = $(window).width();
                if (screen_width > 720) {

                    rules.each(
                        function () {
                            var li = $(this).find('ul li'),
                                amount_li = li.length;

                            if (amount_li >= 3) {
                                current_width = max_width;
                                return;
                            } else {

                                current_width = 438;

                            }
                        }
                    );
                } else {
                    current_width = current_width.replace('px', '');
                    current_width = parseFloat(current_width);
                    h = parseFloat(h) - 10;

                    if ($('#wpadminbar').length) {
                        h = h - $('#wpadminbar').height();
                    }
                }

                w = current_width;

                popup_wrapper.css(
                    {
                        position: 'fixed',
                        top: ((H - h) / 2) + "px", // '15%',
                        left: ((W - w) / 2) + "px"
                    }
                );
            },
            show_qty_field = function (el) {
                $(el).find('.single_add_to_cart_button.button').hide();
                $(el).find('.ywdpd_qty_field').show();
                $(el).find('.ywdpd_qty_arrows .ywdpd_qty_remove').addClass('visible');
                $(el).find('.ywdpd_qty_arrows .ywdpd_qty_increase ').addClass('visible');
            },
            variation_events = function () {
                $('.variations_form.cart')
                    .on(
                        'found_variation',
                        function (e, variation) {

                            var form = $(this),
                                rule_id = $(this).parent().find('.ywdpd_rule_id').val(),
                                rule_row = $('#ywdpd_single_rule_' + rule_id),
                                product_id = $('input[name="product_id"]').val(),
                                item = rule_row.find("li.item[data-product_id='" + product_id + "']"),
                                rule_type = $('input.ywdpd_rule_type').val(),
                                type_discount = item.data('discount_type'),
                                amount_discount = item.data('discount_amount'),
                                tot_to_add = item.data('total_to_add');

                            var data = {
                                'ywdp_check_rule_id': rule_id,
                                'product_id': variation.variation_id,
                                rule_type: rule_type,
                                type_discount: type_discount,
                                amount_discount: amount_discount,
                                tot_to_add: tot_to_add,
                                action: ywdpd_popup_args.actions.check_variable,
                                security: ywdpd_popup_args.nonces.check_variable
                            };

                            $.ajax(
                                {
                                    type: 'POST',
                                    url: ywdpd_popup_args.ajax_url,
                                    data: data,
                                    dataType: 'json',
                                    beforeSend: function () {
                                        form.block(block_params);
                                    },
                                    success: function (response) {

                                        if (!response.variation_found) {

                                            if (variation.is_in_stock) {
                                                $('.ywdpd_add_to_gift').removeClass('disabled');
                                                $('.ywdpdp_single_product p.stock.out-of-stock').remove();
                                            } else {
                                                $('.ywdpdp_single_product .variations_form.cart').append(variation.availability_html);
                                                $('.ywdpd_add_to_gift').addClass('disabled');
                                            }
                                        } else {
                                            $('.ywdpd_add_to_gift').addClass('disabled');
                                        }
                                        $('.ywdpd_step2 .price').html(response.price);
                                        $('.ywdpd_step2 .price').show();
                                    },
                                    complete: function () {
                                        form.unblock();
                                    }
                                }
                            );
                        }
                    )
                    .on(
                        'reset_data',
                        function () {
                            $('.ywdpd_add_to_gift').addClass('disabled');
                            $('.ywdpdp_single_product p.stock.out-of-stock').remove();
                            $('.ywdpd_step2 .price').hide();
                        }
                    );

                $('.ywdpd_step2')
                    .on(
                        'select2:open',
                        function () {
                            $('.select2-container').addClass('ywcdd_select2');
                        }
                    )
                    .on(
                        'select2:closing',
                        function () {
                            $('.select2-container').removeClass('ywcdd_select2');
                        }
                    );
            },
            init_variation_form = function () {
                var variation_form = $('.ywdpd_step2 .ywdpdp_single_product');

                if (variation_form.length && variation_form.hasClass('variation')) {
                    variation_form.find('select').select2();
                    variation_form.on(
                        'click',
                        '.reset_variations',
                        function () {
                            variation_form.find('select').val('').trigger('change');
                        }
                    );

                    check_attributes_selected(variation_form);
                    variation_form.on(
                        'change',
                        'select',
                        function () {
                            check_attributes_selected(variation_form);
                        }
                    );

                }
            },
            check_attributes_selected = function (variation_form) {
                var button = variation_form.find('.ywdpd_add_to_gift'),
                    enable = true;

                button.addClass('disabled');

                variation_form.find('select').each(
                    function () {
                        if ('' === $(this).val()) {
                            enable = false;
                            return;
                        }
                    }
                );

                if (enable) {
                    button.removeClass('disabled');
                }
            },
            get_variation = function (button) {
                var container = button.closest('.ywdpd_single_product_right'),
                    variations = container.find('[name^="attribute"]'),
                    var_items = {};

                variations.each(
                    function () {

                        var t = $(this),
                            name = t.attr('name');

                        var_items[name] = t.val();
                    }
                );

                return var_items;
            },
            get_variation_html = function (variations, button) {
                var html = '',
                    container = button.closest('.ywdpd_single_product_right');

                $.each(
                    variations,
                    function (name, value) {

                        let field = container.find('[name ="' + name + '"]'),
                            label = container.find('label[for="' + field.attr('id') + '"]');

                        html += '<div class="ywdpd_single_attribute">';
                        html += "<span class='attribute_name'>" + label.html() + ':</span>';
                        html += "<span class='attribute_value'>" + value + '</span>';
                        html += '</div>';
                    }
                );

                return html;
            },
            add_variable_gift = function () {
                $(document).on(
                    'click',
                    '.ywdpd_add_to_gift',
                    function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        var product_id = $('input[name="product_id"]').val(),
                            variation_id = $('input.variation_id').val(),
                            variations = get_variation($(this)),
                            rule_id = $('input.ywdpd_rule_id').val(),
                            rule = $(document).find('#ywdpd_single_rule_' + rule_id),
                            li;

                        if ($(this).parent().parent().parent().hasClass('variation')) {
                            li = rule.find('ul.ywdpd_popup_items li[data-product_id="' + variation_id + '"]');
                        } else {
                            li = rule.find('ul.ywdpd_popup_items li[data-product_id="' + product_id + '"]');
                        }
                        var key = add_product_in_list(rule_id, product_id, variation_id, variations),
                            qty_field = li.find("#" + key + '.ywdpd_qty');

                        if (!qty_field.length) {
                            var $row = '<div class="ywdpd_qty_field">';

                            $row += '<div class="ywdpd_qty_input">';
                            $row += '<span class="ywdpd_qty_label">' + ywdpd_popup_args.i18n_qty_field_label + '</span>';
                            $row += '<div class="ywdpd_attribute_fields"></div>';
                            $row += '<span class="ywdpd_qty"></span>';
                            $row += '<span class="ywdpd_qty_arrows">';
                            $row += '<span class="ywdpd_qty_remove button visible"><span></span></span>';
                            $row += '<span class="ywdpd_qty_decrease button"><span></span></span>';
                            $row += '<span class="ywdpd_qty_increase button visible"><span></span></span>';
                            $row += '</span>';
                            $row += '</div>';
                            $row += '</div>';

                            var new_field = $($row),
                                variations_html = get_variation_html(variations, $(this));

                            new_field.find('.ywdpd_qty').attr('id', key);
                            new_field.find('.ywdpd_qty').html(1);
                            new_field.find('.ywdpd_attribute_fields').html(variations_html);

                            new_field.appendTo(li.find('.ywdpd_qty_fields_container')).show();
                            li.addClass('added');
                            init_qty_field();
                        } else {
                            qty_field.parent().find('.ywdpd_qty_increase.button').click();
                        }

                        show_confirm_button(rule_id);
                        update_counter(rule_id);
                        back_to_step1();

                    }
                );
            };

        $(document).on(
            'click',
            '.ywdpd_back',
            function () {
                back_to_step1();
            }
        );

        $(document).on(
            'click',
            '.ywdpd_footer a',
            function (e) {
                e.preventDefault();
                close_popup();
            }
        );
        $(document).on(
            'keyup',
            function (e) {
                if (e.keyCode == 27) {
                    close_popup();
                }
            }
        );
        $(document).on(
            'ywdpd_first_product_added',
            function (e, element, rule_id, product_id, items_allowed) {
                var new_key = add_product_in_list(rule_id, product_id),
                    tot = gift_popup.find('.ywdpd_single_rule_container').length;
                element.find('.ywdpd_qty').attr('id', new_key);
                element.find('.ywdpd_qty').html(1);
                update_counter(rule_id);
                element.addClass('added');
                if (items_allowed > 1 || tot > 1) {
                    show_qty_field(element);
                    show_confirm_button(rule_id);
                } else {
                    $('.ywdpd_btn_container a').click();
                }
            }
        );

        $(document).on(
            'ywdpd_product_qty_increased',
            function (e, button, li, rule_id, product_id, qty_field) {

                increase_quantity_in_product_list(rule_id, qty_field.attr('id'));
                update_counter(rule_id);
            }
        );
        $(document).on(
            'ywdpd_product_qty_decreased',
            function (e, button, li, rule_id, product_id, qty_field) {
                decrease_quantity_in_product_list(rule_id, qty_field.attr('id'));
                update_counter(rule_id);
            }
        );
        if (gift_popup.length) {
            $(window).on(
                'resize',
                function () {
                    center();
                }
            );

            show_popup();
        }

        $(document.body).on(
            'updated_wc_div',
            function () {

                if (gift_popup.length) {
                    gift_popup.remove();
                }
                var data = {
                    action: ywdpd_popup_args.actions.update_gift_popup,
                    security: ywdpd_popup_args.nonces.update_gift_popup
                };

                $.ajax(
                    {
                        type: 'POST',
                        url: ywdpd_popup_args.ajax_url,
                        data: data,
                        dataType: 'json',

                        success: function (response) {
                            if ('' !== response.popup) {
                                $(document.body).append($(response.popup));
                                gift_popup = $(document).find('.ywdpd_popup');
                                $(window).on(
                                    'resize',
                                    function () {
                                        center();
                                    }
                                );

                                show_popup();
                            }
                        }
                    }
                );
            }
        ).on(
            'added_to_cart',
            function(){
                if (gift_popup.length) {
                    gift_popup.remove();
                }
                var data = {
                    action: ywdpd_popup_args.actions.show_popup_on_shop,
                    security: ywdpd_popup_args.nonces.show_popup_on_shop
                };

                $.ajax(
                    {
                        type: 'POST',
                        url: ywdpd_popup_args.ajax_url,
                        data: data,
                        dataType: 'json',

                        success: function (response) {
                            if ('' !== response.popup) {
                                $(document.body).append($(response.popup));
                                gift_popup = $(document).find('.ywdpd_popup');
                                $(window).on(
                                    'resize',
                                    function () {
                                        center();
                                    }
                                );

                                show_popup();
                            }
                        }
                    }
                );
            }
        );
    }
);
