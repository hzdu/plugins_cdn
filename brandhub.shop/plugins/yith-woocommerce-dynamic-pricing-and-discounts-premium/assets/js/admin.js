/**
 * Admin JS
 *
 * @package YITH\Dynamic\Assets\JS
 */

jQuery(
    function ($) {
        "use strict";
        var fields = $(document).find('[data-ywdpd-deps]'),
            target_deps = [],
            target_deps_id = [],
            initialized = false,
            target_sub_types = $(document).find('#_rule_for,#_rule_apply_adjustment_discount_for,#_user_rules'),
            discount_mode_field = $(document).find('#_discount_mode'),
            ajax_url = yith_ywdpd_admin.ajax_url;

        var manage_sub_fields = function (field) {
            let value = field.val(),
                parent_id = field.attr('id');

            // Manage the field that depends by Rule For field ( All products, Specific products, etc ).
            if ('_rule_for' === parent_id) {
                manage_rule_type_option(value);
            } else if ('_rule_apply_adjustment_discount_for' === parent_id) {
                manage_rule_adjustment_option(value);
            } else if ('_user_rules' === parent_id) {
                manage_user_rule_option(value);
            }
        };

        var manage_rule_type_option = function (value) {
            let ids_to_manage = {
                '_active_exclude': true,
                '_exclude_rule_for-specific_products': true,
                '_exclude_rule_for-specific_tag': true,
                '_exclude_rule_for-specific_categories': true,
                '_exclude_rule_for-vendor_list_excluded': true,
                '_exclude_rule_for-brand_list_excluded': true
            };
            if ('specific_categories' === value) {
                ids_to_manage['_exclude_rule_for-specific_categories'] = false;
            } else if ('specific_tag' === value) {
                ids_to_manage['_exclude_rule_for-specific_tag'] = false;
            } else if ('vendor_list' === value) {
                ids_to_manage['_exclude_rule_for-vendor_list_excluded'] = false;
            } else if ('specific_brands' === value) {
                ids_to_manage['_exclude_rule_for-brand_list_excluded'] = false;
            }

            $.each(
                ids_to_manage,
                function (index, value) {
                    var parent = $('#' + index).parent();
                    if (value) {
                        parent.show();
                    } else {
                        parent.hide();
                    }
                }
            );
        };

        var manage_rule_adjustment_option = function (value) {
            let ids_to_manage = {
                '_active_apply_adjustment_to_exclude': true,
                '_exclude_apply_adjustment_rule_for-specific_products': true,
                '_exclude_apply_adjustment_rule_for-specific_tag': true,
                '_exclude_apply_adjustment_rule_for-specific_categories': true,
                '_exclude_apply_adjustment_rule_for-brand_list_excluded': true,
                '_exclude_apply_adjustment_rule_for-vendor_list_excluded': true
            };

            if ('specific_categories' === value) {
                ids_to_manage['_exclude_apply_adjustment_rule_for-specific_categories'] = false;
            } else if ('specific_tag' === value) {
                ids_to_manage['_exclude_apply_adjustment_rule_for-specific_tag'] = false;
            } else if ('vendor_list' === value) {
                ids_to_manage['_exclude_apply_adjustment_rule_for-vendor_list_excluded'] = false;
            } else if ('specific_brands' === value) {
                ids_to_manage['_exclude_apply_adjustment_rule_for-brand_list_excluded'] = false;
            }

            $.each(
                ids_to_manage,
                function (index, value) {
                    var parent = $('#' + index).parent();
                    if (value) {
                        parent.show();
                    } else {
                        parent.hide();
                    }
                }
            );
        };

        var manage_user_rule_option = function (value) {
            let ids_to_manage = {
                '_enable_user_rule_exclude': true,
                '_user_rule_exclude-specific_customers': true,
                '_user_rule_exclude-specific_roles': true,
                '_user_rule_exclude-specific_membership': true,
            };

            if ('role_list' === value) {
                ids_to_manage['_user_rule_exclude-specific_customers'] = false;
            } else if ('role_list' === value) {
                ids_to_manage['_user_rule_exclude-specific_roles'] = false;
            } else if ('specific_membership' === value) {
                ids_to_manage['_user_rule_exclude-specific_membership'] = false;
            }

            $.each(
                ids_to_manage,
                function (index, value) {
                    var parent = $('#' + index).parent();
                    if (value) {
                        parent.show();
                    } else {
                        parent.hide();
                    }
                }
            );
        };

        var change_label_option = function (value) {
            var $rule_for = $(document).find('#_rule_for-container label:first-child'),
                $quantity_based = $(document).find('#_quantity_based-container label:first-child'),
                $user_rules = $(document).find('#_user_rules-container label:first-child'),
                $schedule_discount_mode = $(document).find('#_schedule_discount_mode-container').closest('label'),
                $table_note_apply_to = $(document).find('#_table_note_apply_to-container label:first-child'),
                $table_note_apply_to_desc = $(document).find('#_table_note_apply_to-container span.description'),
                $exclude_user_label = $(document).find('#_enable_user_rule_exclude-container label:first-child'),
                $exclude_user_desc = $(document).find('#_enable_user_rule_exclude-container span.description'),
                $repeat_desc = $(document).find('#_so-repeat-container  span.description');

            if ('exclude_items' === value) {
                value = 'bulk';
            }

            if (typeof yith_ywdpd_admin.labels.rule_type[value] !== 'undefined') {
                var field = yith_ywdpd_admin.labels.rule_type[value];

                if (typeof field.rule_for !== 'undefined') {
                    $rule_for.html(field.rule_for.label);
                }
                if (typeof field.quantity_based !== 'undefined') {
                    $quantity_based.html(field.quantity_based.label);
                }
                if (typeof field.user_rules !== 'undefined') {
                    $user_rules.html(field.user_rules.label);
                }
                if (typeof field.schedule_discount_mode !== 'undefined') {
                    $schedule_discount_mode.html(field.schedule_discount_mode.label);
                }
                if (typeof field.table_note_apply_to !== 'undefined') {
                    $table_note_apply_to.html(field.table_note_apply_to.label);
                    $table_note_apply_to_desc.html(field.table_note_apply_to.desc);
                }

                if (typeof field.enable_user_rule_exclude !== 'undefined') {
                    $exclude_user_label.html(field.enable_user_rule_exclude.label);
                    $exclude_user_desc.html(field.enable_user_rule_exclude.desc);
                }

                if (typeof field.repeat !== 'undefined') {
                    $repeat_desc.html(field.repeat.desc);

                }
            }
        };

        var manage_schedule_option = function (value) {
            if ('no_schedule' === value) {
                $(document).find('#_schedule_discount_mode-container .yith-plugin-fw-field-schedule').hide();
            } else {
                $(document).find('#_schedule_discount_mode-container .yith-plugin-fw-field-schedule').show();
            }
        };

        var toggle_price_symbol = function (symbol_field, value) {
            if ('percentage' === value) {
                symbol_field.html(yith_ywdpd_admin.percent_symbol);
            } else {
                symbol_field.html(yith_ywdpd_admin.currency_symbol);
            }
        };

        var scroll_to = function (element) {
            $('html,body').animate(
                {
                    scrollTop: element.offset().top - 100,
                },
                'slow'
            );
        };

        var init_cart_rule_field = function () {
                var cart_rules_list = $('#_cart_discount_rules');
                show_hide_cart_notice_fields(cart_rules_list);
                /**
                 * Register toggle enabled
                 */
                $(document).on(
                    'change',
                    '.yith-plugin-ui--ywdpd_discount-post_type tr td.status .ywdpd-toggle-enabled input',
                    function () {
                        var enabled = $(this).val() === 'yes' ? 'yes' : 'no',
                            container = $(this).closest('.ywdpd-toggle-enabled'),
                            discountID = container.data('discount-id');

                        $.ajax(
                            {
                                type: 'POST',
                                data: {
                                    action: yith_ywdpd_admin.actions.enable_or_disable_rule,
                                    security: yith_ywdpd_admin.nonces.enable_or_disable_rule,
                                    id: discountID,
                                    enabled: enabled,
                                },
                                url: ajax_url,
                                success: function (response) {
                                    if (typeof response.error !== 'undefined') {
                                        alert(response.error);
                                    }
                                }

                            }
                        );
                    }
                );

                $(document).on(
                    'yith-add-box-button-toggle',
                    function () {

                        var single_add_toggle = $(document).find('#_cart_discount_rules_add_box');
                        show_right_options(single_add_toggle, true);

                    }
                );

                $(document).on(
                    'change',
                    '.ywdpd_condition_for',
                    function () {

                        var single_row = $(this).parent().parent().parent(),
                            toggle_element,
                            is_new = false;

                        if (single_row.hasClass('yith-add-box-row')) {
                            toggle_element = $('#_cart_discount_rules_add_box');
                            is_new = true;
                        } else {
                            toggle_element = $(this).closest('.yith-toggle-content');
                            show_hide_cart_notice_fields($('#_cart_discount_rules'));
                        }
                        show_right_options(toggle_element, is_new);
                    }
                );

                $(document).on(
                    'change',
                    '.user_discount_to input[type="radio"]',
                    function () {

                        var toggle_element = $(this).closest('#_cart_discount_rules_add_box'),
                            is_new = true;

                        if (!toggle_element.length) {
                            toggle_element = $(this).closest('.yith-toggle-content');
                            is_new = false;
                        }
                        show_right_options(toggle_element, is_new);
                    }
                );

                $(document).on(
                    'change',
                    '#_cart_discount_rules input[type="checkbox"]',
                    function () {

                        var toggle_element = $(this).closest('#_cart_discount_rules_add_box'),
                            is_new = true;

                        if (!toggle_element.length) {
                            toggle_element = $(this).closest('.yith-toggle-content');
                            is_new = false;
                        }
                        show_right_options(toggle_element, is_new);
                    }
                );

                $(document).on(
                    'click',
                    '#_cart_discount_rules .yith-delete-button',
                    function () {
                        var toggle = $(this).parents('.yith-toggle-row');

                        show_hide_cart_notice_fields(toggle, 1);
                    }
                );

                $(document).on(
                    'change',
                    '.ywdpd_cart_item_qty_type input[type="radio"], .ywdpd_product_type input[type="radio"]',
                    function () {

                        var toggle_element = $(this).closest('#_cart_discount_rules_add_box'),
                            is_new = true;

                        if (!toggle_element.length) {
                            toggle_element = $(this).closest('.yith-toggle-content');
                            is_new = false;
                        }
                        show_right_options(toggle_element, is_new);
                    }
                );

                $(document).on(
                    'yith-toggle-element-item-before-add',
                    function (e, add_box, toggle_el) {
                        show_hide_cart_notice_fields(toggle_el);
                        show_right_options(toggle_el, false);

                    }
                );

                $(document).on(
                    'yith-toggle-change-counter',
                    function (e, hidden_obj, add_box) {

                        if ('_cart_discount_rules_add_box' === add_box.attr('id')) {
                            var toggle_element = add_box.parents('.toggle-element').find('.yith-toggle-row'),
                                max_index = 0;

                            toggle_element.each(
                                function () {

                                    var current_index = $(this).data('item_key');

                                    if (max_index < current_index) {
                                        max_index = current_index;
                                    }
                                }
                            );

                            hidden_obj.val(max_index + 1);
                        }
                    }
                );
                var toggle_elements = $(document).find('#_cart_discount_rules .yith-toggle-content');

                toggle_elements.each(
                    function () {

                        show_right_options($(this), false);
                    }
                );

            },
            show_hide_cart_notice_fields = function (container, with_delete) {

                with_delete = typeof with_delete !== 'undefined' ? with_delete : 0;
                var selectWithValues = container.find('.ywdpd_condition_for').filter(function () {
                        const select = $(this);
                        return 'cart_subtotal' === select.val();
                    }),
                    checkbox = $('#_show_notice_cart'),
                    parent = checkbox.parents('.the-metabox'),
                    count_element = selectWithValues.length - with_delete;

                if (count_element > 0) {
                    parent.show();
                } else {

                    if (checkbox.is(':checked')) {
                        checkbox.click();
                    }
                    parent.hide();
                }
            };

        var show_right_options = function (toggle_element, add_new) {

            var class_to_toggle;

            if (add_new) {
                class_to_toggle = '.yith-add-box-row';
            } else {
                class_to_toggle = '.yith-toggle-content-row';
            }

            var rows_to_toggle = toggle_element.find(class_to_toggle).not('.ywdpd_general_rule'),
                toggle_type = toggle_element.find(class_to_toggle).find('.ywdpd_condition_for').val(),
                rows_to_hide = rows_to_toggle.not('.' + toggle_type),
                rows_to_show = rows_to_toggle.filter('.' + toggle_type),
                single_row = '';

            rows_to_hide.addClass('hide_row');

            if ('customers' === toggle_type) {

                single_row = rows_to_show.find('.user_discount_to').parents(class_to_toggle);
                show_right_user_options(single_row, rows_to_show, class_to_toggle);
                single_row.removeClass('hide_row');
            } else if ('cart_items' === toggle_type) {
                single_row = rows_to_show.find('.ywdpd_cart_item_qty_type').parents(class_to_toggle);
                show_right_cart_item_options(single_row, rows_to_show, class_to_toggle);

                single_row.removeClass('hide_row');
            } else if ('product' === toggle_type) {
                single_row = rows_to_show.find('.ywdpd_product_type').parents(class_to_toggle);
                show_right_product_options(single_row, rows_to_show, class_to_toggle);
                single_row.removeClass('hide_row');
            } else {
                rows_to_show.removeClass('hide_row');
            }

        };

        var show_right_user_options = function (element, rows, class_toggle) {

            var users_type = rows.find('.user_discount_to input[type="radio"]:checked').val(),
                sub_rows_to_show = rows.filter('.' + users_type),
                sub_row_to_hide = rows.not('.' + users_type);

            sub_row_to_hide.addClass('hide_row');

            if ('all' === users_type) {
                var single_sub_row = sub_rows_to_show.find('.ywdpd_enable_exclude_users').parents(class_toggle);
                show_right_exclude_user_options(sub_rows_to_show);
                single_sub_row.removeClass('hide_row');
            } else {
                sub_rows_to_show.removeClass('hide_row');
            }

        };

        var show_right_exclude_user_options = function (rows) {
            var show = rows.find('.ywdpd_enable_exclude_users input[type="checkbox"]').is(':checked');

            if (show) {
                rows.filter('.customers_list_excluded').removeClass('hide_row');
            } else {

                rows.filter('.customers_list_excluded').addClass('hide_row');
            }

        };

        var show_right_cart_item_options = function (element, rows) {
            var cart_item_type = rows.find('.ywdpd_cart_item_qty_type input[type="radio"]:checked').val(),
                sub_rows_to_show = rows.filter('.' + cart_item_type),
                sub_row_to_hide = rows.not('.' + cart_item_type);

            sub_rows_to_show.removeClass('hide_row');
            sub_row_to_hide.addClass('hide_row');

        };

        var show_right_product_options = function (element, rows, class_toggle) {
            var type = rows.find('.ywdpd_product_type input[type="radio"]:checked').val(),
                sub_rows_to_show = rows.filter('.' + type),
                sub_rows_to_hide = rows.not('.' + type),
                s1,
                s2,
                s3,
                s4,
                s5,
                s6;

            sub_rows_to_hide.addClass('hide_row');
            if ('require_product' === type) {

                s1 = sub_rows_to_show.find('.ywdpd_enable_require_product').parents(class_toggle);
                s2 = sub_rows_to_show.find('.ywdpd_enable_require_product_categories').parents(class_toggle);
                s3 = sub_rows_to_show.find('.ywdpd_enable_require_product_tag').parents(class_toggle);
                s4 = sub_rows_to_show.find('.ywdpd_enable_require_product_vendors').parents(class_toggle);
                s5 = sub_rows_to_show.find('.ywdpd_enable_require_product_brands').parents(class_toggle);

                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_require_product', '.enable_require_product_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_require_product_categories', '.enable_require_product_category_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_require_product_tag', '.enable_require_product_tag_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_require_product_vendors', '.enable_require_product_vendors_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_require_product_brands', '.enable_require_product_brands_list');
                s1.removeClass('hide_row');
                s2.removeClass('hide_row');
                s3.removeClass('hide_row');
                s4.removeClass('hide_row');
                s5.removeClass('hide_row');
            } else if ('exclude_product' === type) {
                s1 = sub_rows_to_show.find('.ywdpd_enable_exclude_require_product').parents(class_toggle);
                s2 = sub_rows_to_show.find('.ywdpd_enable_exclude_on_sale_product').parents(class_toggle);
                s3 = sub_rows_to_show.find('.ywdpd_enable_exclude_product_categories').parents(class_toggle);
                s4 = sub_rows_to_show.find('.ywdpd_enable_exclude_product_tag').parents(class_toggle);
                s5 = sub_rows_to_show.find('.ywdpd_enable_exclude_product_vendors').parents(class_toggle);
                s6 = sub_rows_to_show.find('.ywdpd_enable_exclude_product_brands').parents(class_toggle);

                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_exclude_require_product', '.enable_exclude_product_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_exclude_product_categories', '.enable_exclude_product_category_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_exclude_product_tag', '.enable_exclude_product_tag_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_exclude_product_vendors', '.enable_exclude_product_vendors_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_exclude_product_brands', '.enable_exclude_product_brands_list');

                s1.removeClass('hide_row');
                s2.removeClass('hide_row');
                s3.removeClass('hide_row');
                s4.removeClass('hide_row');
                s5.removeClass('hide_row');
                s6.removeClass('hide_row');

            } else if ('disable_product' === type) {
                s1 = sub_rows_to_show.find('.ywdpd_enable_disable_product').parents(class_toggle);
                s2 = sub_rows_to_show.find('.ywdpd_enable_disable_product_categories').parents(class_toggle);
                s3 = sub_rows_to_show.find('.ywdpd_enable_disable_product_tag').parents(class_toggle);
                s4 = sub_rows_to_show.find('.ywdpd_enable_disable_product_brands').parents(class_toggle);

                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_disable_product', '.enable_disable_product_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_disable_product_categories', '.enable_disable_product_category_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_disable_product_tag', '.enable_disable_product_tag_list');
                show_right_product_list_options(sub_rows_to_show, '.ywdpd_enable_disable_product_brands', '.enable_disable_product_brands_list');

                s1.removeClass('hide_row');
                s2.removeClass('hide_row');
                s3.removeClass('hide_row');
                s4.removeClass('hide_row');

            }
        };

        var show_right_product_list_options = function (rows, field_id_to_check, field_to_hide) {
            var show = rows.find(field_id_to_check + ' input[type="checkbox"]').is(':checked');

            if (show) {
                rows.filter(field_to_hide).removeClass('hide_row');
            } else {

                rows.filter(field_to_hide).addClass('hide_row');
            }
        };

        $(document).on(
            'ywdpd-init-fields',
            function () {
                init_cart_rule_field();

                fields.each(
                    function () {
                        var t = $(this),
                            parent = t.closest('.the-metabox'),
                            deps = t.data('ywdpd-deps'),
                            show = true;

                        $.each(
                            deps,
                            function (i, dep) {
                                var target_dep = $('#' + dep.id),
                                    compare = typeof dep.compare === 'undefined' ? '==' : dep.compare,
                                    current_value;

                                // it's a radio button.
                                if (target_dep.hasClass('yith-plugin-fw-radio')) {
                                    current_value = target_dep.find('input[type="radio"]').filter(':checked').val();
                                } else if (target_dep.hasClass('yith-plugin-fw-select')) {
                                    current_value = target_dep.val();

                                } else {
                                    current_value = target_dep.is(':checked') ? 'yes' : 'no';
                                }

                                if (!initialized && target_deps_id.indexOf(dep.id) < 0) {

                                    target_deps.push(target_dep);
                                    target_deps_id.push(dep.id);
                                }

                                if (show) {
                                    var value = dep.value.split(',');
                                    switch (compare) {
                                        case '==':
                                        case '===':
                                            show = value.indexOf(current_value) >= 0;
                                            break;
                                        case '!=':
                                        case '!==':
                                            show = value.indexOf(current_value) < 0;
                                            break;
                                    }
                                }
                            }
                        );

                        if (show) {
                            parent.show();
                        } else {
                            parent.hide();
                        }
                    }
                );
                target_sub_types.each(
                    function () {
                        manage_sub_fields($(this));
                        $(this).on(
                            'change',
                            function () {
                                manage_sub_fields($(this));
                            }
                        );
                    }
                );
                change_label_option(discount_mode_field.val());
                discount_mode_field.on(
                    'change',
                    function () {
                        var value = $(this).val();
                        change_label_option(value);
                        if ('discount_whole' === value || 'category_discount' === value) {
                            $('#_rule_for-all_products').click();
                        }
                        if ('category_discount' == value) {
                            manage_rule_type_option('specific_categories');
                        } else {
                            manage_sub_fields($('#_rule_for'));
                        }
                    }
                );

                var schedule_opt = $(document).find('#schedule_mode input[type="radio"]:checked').val(),
                    current_discount_mode = $(document).find('#_discount_mode').val();

                if ('category_discount' == current_discount_mode) {
                    manage_rule_type_option('specific_categories');
                } else {
                    manage_sub_fields($('#_rule_for'));
                }
                manage_schedule_option(schedule_opt);
                $(document).on(
                    'change',
                    '#schedule_mode input[type="radio"]',
                    function () {
                        var t = $(this);
                        manage_schedule_option(t.val());
                    }
                );
                // Type discount event, change the price symbol.
                $(document).on(
                    'change',
                    '.ywdpd_qty_discount',
                    function () {
                        var value = $(this).val(),
                            symbol = $(this).parent().find('span.ywdpd_symbol');
                        toggle_price_symbol(symbol, value);
                    }
                );
                $(document).on(
                    'change',
                    '#_simple_whole_discount_discount_mode',
                    function () {
                        var value = $(this).val(),
                            symbol = $(this).parent().parent().parent().find('.ywdpd_symbol');
                        toggle_price_symbol(symbol, value);
                    }
                );

            }
        ).trigger('ywdpd-init-fields');
        initialized = true;

        $.each(
            target_deps,
            function (i, target_dep) {

                target_dep.on(
                    'change',
                    function () {
                        $(document).trigger('ywdpd-init-fields');
                    }
                );
            }
        );
        $('#_schedule_from').datetimepicker(
            {
                timeFormat: 'HH:mm',
                minDate: new Date(),
                dateFormat: 'yy-mm-dd',
                onSelect: function () {
                    $('#_schedule_to').datetimepicker('option', 'minDate', $(this).datetimepicker('getDate'));
                }

            }
        );
        $('#_schedule_to').datetimepicker(
            {
                timeFormat: 'HH:mm',
                minDate: new Date(),
                dateFormat: 'yy-mm-dd',
                onSelect: function () {
                    $('#_schedule_from').datetimepicker('option', 'maxDate', $(this).datetimepicker('getDate'));
                }

            }
        );

        $('#_schedule_from, #_schedule_to')
            .each(
                function () {
                    $(this).prop('placeholder', 'YYYY-MM-DD HH:mm')
                }
            )
            .datetimepicker(
                {
                    timeFormat: 'HH:mm',
                    defaultDate: '',
                    dateFormat: 'yy-mm-dd',
                    numberOfMonths: 1,
                }
            );

        $('.post-type-ywdpd_discount table.wp-list-table').sortable(
            {
                items: 'tbody tr:not(.inline-edit-row)',
                cursor: 'move',
                handle: '.priority.column-priority',
                axis: 'y',
                forcePlaceholderSize: true,
                helper: 'clone',
                opacity: 0.65,
                start: function (event, ui) {
                    ui.item.css('background-color', '#f6f6f6');
                },
                stop: function (event, ui) {
                    ui.item.removeAttr('style');

                    var fields_ids = $('.post-type-ywdpd_discount table.wp-list-table tbody tr th.check-column input').get(),
                        rule_ids = [];

                    $.each(
                        fields_ids,
                        function (i, field) {

                            rule_ids.push($(field).val());
                        }
                    );

                    rule_ids = rule_ids.join();
                    var data = {
                        action: yith_ywdpd_admin.actions.sort_discount_rules,
                        security: yith_ywdpd_admin.nonces.sort_discount_rules,
                        rule_ids: rule_ids,
                    };
                    $.ajax(
                        {
                            type: 'POST',
                            url: ajax_url,
                            data: data,
                            dataType: 'json',
                            success: function (response) {
                            }
                        }
                    );
                }
            }
        );
        // Create a new quantity rule.
        $(document).on(
            'click',
            '.ywdpd_new_rule',
            function (e) {
                e.preventDefault();
                var $t = $(this),
                    table = $t.parent().parent().find('.discount-rules'),
                    rows = table.find('.discount-table-row'),
                    max_index = 1;
                rows.each(
                    function () {
                        var index = $(this).data('index');
                        if (index > max_index) {
                            max_index = index;
                        }
                    }
                );

                var new_index = max_index + 1,
                    template;

                if ('rules-container' === table.parent().parent().parent().attr('id')) {
                    template = wp.template('ywdpd-quantity-discount-row');
                } else {
                    template = wp.template('ywdpd-quantity-category-discount-row');
                }

                var new_row = $(template({index: new_index}));

                new_row.appendTo(table);

                $(document.body).trigger('wc-enhanced-select-init');
                $(document.body).trigger('yith-framework-enhanced-select-init');
            }
        );
        /**
         * Remove a row pricing rules
         **/
        $(document).on(
            'click',
            '.yith-icon.yith-icon-trash',
            function () {
                var $t = $(this),
                    current_row = $t.closest('div.discount-table-row');

                if (!current_row.length) {
                    current_row = $t.closest('div.cart-rule-row');
                }
                current_row.remove();
            }
        );

        // Manage required fields.
        $('.yith-plugin-ui--ywdpd_discount-post_type form').submit(
            function (e) {
                var required_field = $(this).find('.yith-plugin-fw--required'),
                    title = $(document).find('.yith-plugin-ui--ywdpd_discount-post_type #title'),
                    send = true,
                    row = false;

                if( '' === title.val() ){
                    send = false;
                    row = title;
                    title.addClass('ywdpd_required_check');
                }
                if( send ) {
                    required_field.each(
                        function () {
                            var current_row = $(this);
                            if (current_row.is(':visible')) {
                                var select = current_row.find('select');
                                if (select.length) {
                                    var selected = select.find(':selected');
                                    if (selected.length === 0) {
                                        send = false;
                                        if (!row) {
                                            row = current_row;
                                        }
                                        current_row.addClass('ywdpd_required_check');
                                    }
                                }
                            }
                        }
                    );
                }


                if (!send) {
                    e.preventDefault();
                    scroll_to(row);
                    var selects = $(document).find('.yith-plugin-ui--ywdpd_discount-post_type .yith-plugin-fw--required.ywdpd_required_check select');

                    selects.on(
                        'select2:open',
                        function (e) {
                            $(this).parents('.yith-plugin-fw--required').removeClass('ywdpd_required_check');
                            e.stopImmediatePropagation();
                        }
                    );

                    title.on(
                        'change',
                        function(){
                            title.removeClass('ywdpd_required_check');
                    }
                    );

                }
            }
        );

        // POPUP.
        $('.yith-plugin-ui--ywdpd_discount-post_type  a.page-title-action, .ywdpd_add_new_dynamic_rule').on(
            'click',
            function (e) {
                e.preventDefault();
                e.stopPropagation();
                yith.ui.modal(
                    {
                        'width': 790,
                        'title': false,
                        'content': $('#ywdpd_rule_manger_popup').html(),
                        'footer': false,
                        'scrollContent': false,
                        'classes': {
                            'title': 'ywdpd_admin_popup_title',
                            'content': 'ywdpd_admin_popup_content',
                        }
                    }
                );
            }
        );

        // Quantity table panel.
        $('#ywdpd_show_percentage_in_table').on(
            'change',
            function () {
                var element = $('#ywdpd_quantity_table_labels .option-element.ywdpd_discount_heading');
                if ($(this).is(':checked')) {
                    element.addClass('show');
                } else {
                    element.removeClass('show');
                }
            }
        ).trigger('change');

        $('#ywdpd_show_quantity_table').on(
            'change',
            function (){
             var element = $('#ywdpd_qty_table_shortcode').parents('tr'),
                 field_to_check = $('#ywdpd_show_quantity_table_place');

             if( ! $(this).is(':checked')){
                 element.hide();
             }else{
                  field_to_check.trigger('change');
             }
            }
        ).trigger('change');

    }

);
