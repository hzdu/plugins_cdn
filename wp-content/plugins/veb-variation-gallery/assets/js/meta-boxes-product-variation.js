/**
 * WooCommerce Additional Variation Images And Swatches Pro - Addon 2
 *
 * This source file is subject to the GNU General Public License v3.0
 * that is bundled with this package in the file license.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl-3.0.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to support@innovativewp.org so we can send you a copy immediately.
 *
 * @author    InnovativeWP
 * @copyright Copyright (c) 2021, InnovativeWP.
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */
jQuery(function ($) {
    'use strict';

    var wc_meta_boxes_product_variations_actions = {

        init: function init() {
            $('#variable_product_options').on('change', 'input.variable_is_downloadable', this.variable_is_downloadable).on('change', 'input.variable_is_virtual', this.variable_is_virtual).on('change', 'input.variable_manage_stock', this.variable_manage_stock).on('click', 'button.notice-dismiss', this.notice_dismiss).on('click', 'h3 .sort', this.set_menu_order).on('reload', this.reload);

            $('input.variable_is_downloadable, input.variable_is_virtual, input.variable_manage_stock').change();
            $('#woocommerce-product-data').on('woocommerce_variations_loaded', this.variations_loaded);
            $(document.body).on('woocommerce_variations_added', this.variation_added);
        },

        reload: function reload() {
            wc_meta_boxes_product_variations_ajax.load_variations(1);
            wc_meta_boxes_product_variations_pagenav.set_paginav(0);
        },

        variable_is_downloadable: function variable_is_downloadable() {
            $(this).closest('.woocommerce_variation').find('.show_if_variation_downloadable').hide();

            if ($(this).is(':checked')) {
                $(this).closest('.woocommerce_variation').find('.show_if_variation_downloadable').show();
            }
        },

        variable_is_virtual: function variable_is_virtual() {
            $(this).closest('.woocommerce_variation').find('.hide_if_variation_virtual').show();

            if ($(this).is(':checked')) {
                $(this).closest('.woocommerce_variation').find('.hide_if_variation_virtual').hide();
            }
        },

        variable_manage_stock: function variable_manage_stock() {
            $(this).closest('.woocommerce_variation').find('.show_if_variation_manage_stock').hide();
            $(this).closest('.woocommerce_variation').find('.variable_stock_status').show();

            if ($(this).is(':checked')) {
                $(this).closest('.woocommerce_variation').find('.show_if_variation_manage_stock').show();
                $(this).closest('.woocommerce_variation').find('.variable_stock_status').hide();
            }

            if ($('input#_manage_stock:checked').length) {
                $(this).closest('.woocommerce_variation').find('.variable_stock_status').hide();
            }
        },

        notice_dismiss: function notice_dismiss() {
            $(this).closest('div.notice').remove();
        },

        variations_loaded: function variations_loaded(event, needsUpdate) {
            needsUpdate = needsUpdate || false;

            var wrapper = $('#woocommerce-product-data');

            if (!needsUpdate) {
                $('input.variable_is_downloadable, input.variable_is_virtual, input.variable_manage_stock', wrapper).change();

                $('.woocommerce_variation', wrapper).each(function (index, el) {
                    var $el = $(el),
                        date_from = $('.sale_price_dates_from', $el).val(),
                        date_to = $('.sale_price_dates_to', $el).val();

                    if ('' !== date_from || '' !== date_to) {
                        $('a.sale_schedule', $el).click();
                    }
                });

                $('.woocommerce_variations .variation-needs-update', wrapper).removeClass('variation-needs-update');

                $('button.cancel-variation-changes, button.save-variation-changes', wrapper).attr('disabled', 'disabled');
            }

            $('#tiptip_holder').removeAttr('style');
            $('#tiptip_arrow').removeAttr('style');
            $('.woocommerce_variations .tips, .woocommerce_variations .help_tip, .woocommerce_variations .woocommerce-help-tip', wrapper).tipTip({
                'attribute': 'data-tip',
                'fadeIn': 50,
                'fadeOut': 50,
                'delay': 200
            });

            $('.sale_price_dates_fields', wrapper).find('input').datepicker({
                defaultDate: '',
                dateFormat: 'yy-mm-dd',
                numberOfMonths: 1,
                showButtonPanel: true,
                onSelect: function onSelect() {
                    var option = $(this).is('.sale_price_dates_from') ? 'minDate' : 'maxDate',
                        dates = $(this).closest('.sale_price_dates_fields').find('input'),
                        date = $(this).datepicker('getDate');

                    dates.not(this).datepicker('option', option, date);
                    $(this).change();
                }
            });

            $('.woocommerce_variations', wrapper).sortable({
                items: '.woocommerce_variation',
                cursor: 'move',
                axis: 'y',
                handle: '.sort',
                scrollSensitivity: 40,
                forcePlaceholderSize: true,
                helper: 'clone',
                opacity: 0.65,
                stop: function stop() {
                    wc_meta_boxes_product_variations_actions.variation_row_indexes();
                }
            });

            $(document.body).trigger('wc-enhanced-select-init');
        },

        variation_added: function variation_added(event, qty) {
            if (1 === qty) {
                wc_meta_boxes_product_variations_actions.variations_loaded(null, true);
            }
        },

        set_menu_order: function set_menu_order(event) {
            event.preventDefault();
            var $menu_order = $(this).closest('.woocommerce_variation').find('.variation_menu_order');
            var value = window.prompt(woocommerce_admin_meta_boxes_variations.i18n_enter_menu_order, $menu_order.val());

            if (value != null) {
                $menu_order.val(parseInt(value, 10)).change();
                wc_meta_boxes_product_variations_ajax.save_variations();
            }
        },

        variation_row_indexes: function variation_row_indexes() {
            var wrapper = $('#variable_product_options').find('.woocommerce_variations'),
                current_page = parseInt(wrapper.attr('data-page'), 10),
                offset = parseInt((current_page - 1) * woocommerce_admin_meta_boxes_variations.variations_per_page, 10);

            $('.woocommerce_variations .woocommerce_variation').each(function (index, el) {
                $('.variation_menu_order', el).val(parseInt($(el).index('.woocommerce_variations .woocommerce_variation'), 10) + 1 + offset).change();
            });
        }
    };

    var wc_meta_boxes_product_variations_media = {

        variable_image_frame: null,
        setting_variation_image_id: null,
        setting_variation_image: null,
        wp_media_post_id: wp.media.model.settings.post.id,
        init: function init() {
            $('#variable_product_options').on('click', '.upload_image_button', this.add_image);
            $('a.add_media').on('click', this.restore_wp_media_post_id);
        },

        add_image: function add_image(event) {
            var $button = $(this),
                post_id = $button.attr('rel'),
                $parent = $button.closest('.upload_image');

            wc_meta_boxes_product_variations_media.setting_variation_image = $parent;
            wc_meta_boxes_product_variations_media.setting_variation_image_id = post_id;

            event.preventDefault();

            if ($button.is('.remove')) {

                $('.upload_image_id', wc_meta_boxes_product_variations_media.setting_variation_image).val('').change();
                wc_meta_boxes_product_variations_media.setting_variation_image.find('img').eq(0).attr('src', woocommerce_admin_meta_boxes_variations.woocommerce_placeholder_img_src);
                wc_meta_boxes_product_variations_media.setting_variation_image.find('.upload_image_button').removeClass('remove');
            } else {

                if (wc_meta_boxes_product_variations_media.variable_image_frame) {
                    wc_meta_boxes_product_variations_media.variable_image_frame.uploader.uploader.param('post_id', wc_meta_boxes_product_variations_media.setting_variation_image_id);
                    wc_meta_boxes_product_variations_media.variable_image_frame.open();
                    return;
                } else {
                    wp.media.model.settings.post.id = wc_meta_boxes_product_variations_media.setting_variation_image_id;
                }

                wc_meta_boxes_product_variations_media.variable_image_frame = wp.media.frames.variable_image = wp.media({
                    title: woocommerce_admin_meta_boxes_variations.i18n_choose_image,
                    button: {
                        text: woocommerce_admin_meta_boxes_variations.i18n_set_image
                    },
                    states: [new wp.media.controller.Library({
                        title: woocommerce_admin_meta_boxes_variations.i18n_choose_image,
                        filterable: 'all'
                    })]
                });

                wc_meta_boxes_product_variations_media.variable_image_frame.on('select', function () {

                    var attachment = wc_meta_boxes_product_variations_media.variable_image_frame.state().get('selection').first().toJSON(),
                        url = attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;

                    $('.upload_image_id', wc_meta_boxes_product_variations_media.setting_variation_image).val(attachment.id).change();
                    wc_meta_boxes_product_variations_media.setting_variation_image.find('.upload_image_button').addClass('remove');
                    wc_meta_boxes_product_variations_media.setting_variation_image.find('img').eq(0).attr('src', url);

                    wp.media.model.settings.post.id = wc_meta_boxes_product_variations_media.wp_media_post_id;
                });

                wc_meta_boxes_product_variations_media.variable_image_frame.open();
            }
        },

        restore_wp_media_post_id: function restore_wp_media_post_id() {
            wp.media.model.settings.post.id = wc_meta_boxes_product_variations_media.wp_media_post_id;
        }
    };

    var wc_meta_boxes_product_variations_ajax = {

        init: function init() {
            $('li.variations_tab a').on('click', this.initial_load);

            $('#variable_product_options').on('click', 'button.save-variation-changes', this.save_variations).on('click', 'button.cancel-variation-changes', this.cancel_variations).on('click', '.remove_variation', this.remove_variation).on('click', '.downloadable_files a.delete', this.input_changed);

            $(document.body).on('change', '#variable_product_options .woocommerce_variations :input', this.input_changed).on('change', '.variations-defaults select', this.defaults_changed);

            var postForm = $('form#post');

            postForm.on('submit', this.save_on_submit);

            $('input:submit', postForm).bind('click keypress', function () {
                postForm.data('callerid', this.id);
            });

            $('.wc-metaboxes-wrapper').on('click', 'a.do_variation_action', this.do_variation_action);
        },

        check_for_changes: function check_for_changes() {
            var need_update = $('#variable_product_options').find('.woocommerce_variations .variation-needs-update');

            if (0 < need_update.length) {
                if (window.confirm(woocommerce_admin_meta_boxes_variations.i18n_edited_variations)) {
                    wc_meta_boxes_product_variations_ajax.save_changes();
                } else {
                    need_update.removeClass('variation-needs-update');
                    return false;
                }
            }

            return true;
        },

        block: function block() {
            $('#woocommerce-product-data').block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });
        },

        unblock: function unblock() {
            $('#woocommerce-product-data').unblock();
        },

        initial_load: function initial_load() {
            if (0 === $('#variable_product_options').find('.woocommerce_variations .woocommerce_variation').length) {
                wc_meta_boxes_product_variations_pagenav.go_to_page();
            }
        },

        load_variations: function load_variations(page, per_page) {
            page = page || 1;
            per_page = per_page || woocommerce_admin_meta_boxes_variations.variations_per_page;

            var wrapper = $('#variable_product_options').find('.woocommerce_variations');

            wc_meta_boxes_product_variations_ajax.block();

            $.ajax({
                url: woocommerce_admin_meta_boxes_variations.ajax_url,
                data: {
                    action: 'woocommerce_load_variations',
                    security: woocommerce_admin_meta_boxes_variations.load_variations_nonce,
                    product_id: woocommerce_admin_meta_boxes_variations.post_id,
                    attributes: wrapper.data('attributes'),
                    page: page,
                    per_page: per_page
                },
                type: 'POST',
                success: function success(response) {
                    wrapper.empty().append(response).attr('data-page', page);

                    $('#woocommerce-product-data').trigger('woocommerce_variations_loaded');

                    wc_meta_boxes_product_variations_ajax.unblock();
                }
            });
        },

        get_variations_fields: function get_variations_fields(fields) {

            var data = $(':input', fields).serializeJSON();

            $('.variations-defaults select').each(function (index, element) {
                var select = $(element);
                data[select.attr('name')] = select.val();
            });

            return data;
        },

        save_changes: function save_changes(callback) {
            var wrapper = $('#variable_product_options').find('.woocommerce_variations'),
                need_update = $('.variation-needs-update', wrapper),
                data = {};

            if (0 < need_update.length) {
                wc_meta_boxes_product_variations_ajax.block();

                data = wc_meta_boxes_product_variations_ajax.get_variations_fields(need_update);
                data.action = 'woocommerce_save_variations';
                data.security = woocommerce_admin_meta_boxes_variations.save_variations_nonce;
                data.product_id = woocommerce_admin_meta_boxes_variations.post_id;
                data['product-type'] = $('#product-type').val();

                $.ajax({
                    url: woocommerce_admin_meta_boxes_variations.ajax_url,
                    data: data,
                    type: 'POST',
                    success: function success(response) {
                        need_update.removeClass('variation-needs-update');
                        $('button.cancel-variation-changes, button.save-variation-changes').attr('disabled', 'disabled');

                        $('#woocommerce-product-data').trigger('woocommerce_variations_saved');

                        if (typeof callback === 'function') {
                            callback(response);
                        }

                        wc_meta_boxes_product_variations_ajax.unblock();
                    }
                });
            }
        },

        save_variations: function save_variations() {
            $('#variable_product_options').trigger('woocommerce_variations_save_variations_button');

            wc_meta_boxes_product_variations_ajax.save_changes(function (error) {
                var wrapper = $('#variable_product_options').find('.woocommerce_variations'),
                    current = wrapper.attr('data-page');

                $('#variable_product_options').find('#woocommerce_errors').remove();

                if (error) {
                    wrapper.before(error);
                }

                $('.variations-defaults select').each(function () {
                    $(this).attr('data-current', $(this).val());
                });

                wc_meta_boxes_product_variations_pagenav.go_to_page(current);
            });

            return false;
        },

        save_on_submit: function save_on_submit(e) {
            var need_update = $('#variable_product_options').find('.woocommerce_variations .variation-needs-update');

            if (0 < need_update.length) {
                e.preventDefault();
                $('#variable_product_options').trigger('woocommerce_variations_save_variations_on_submit');
                wc_meta_boxes_product_variations_ajax.save_changes(wc_meta_boxes_product_variations_ajax.save_on_submit_done);
            }
        },

        save_on_submit_done: function save_on_submit_done() {
            var postForm = $('form#post'),
                callerid = postForm.data('callerid');

            if ('publish' === callerid) {
                postForm.append('<input type="hidden" name="publish" value="1" />').submit();
            } else {
                postForm.append('<input type="hidden" name="save-post" value="1" />').submit();
            }
        },

        cancel_variations: function cancel_variations() {
            var current = parseInt($('#variable_product_options').find('.woocommerce_variations').attr('data-page'), 10);

            $('#variable_product_options').find('.woocommerce_variations .variation-needs-update').removeClass('variation-needs-update');
            $('.variations-defaults select').each(function () {
                $(this).val($(this).attr('data-current'));
            });

            wc_meta_boxes_product_variations_pagenav.go_to_page(current);

            return false;
        },

        add_variation: function add_variation() {
            wc_meta_boxes_product_variations_ajax.block();

            var data = {
                action: 'woocommerce_add_variation',
                post_id: woocommerce_admin_meta_boxes_variations.post_id,
                loop: $('.woocommerce_variation').length,
                security: woocommerce_admin_meta_boxes_variations.add_variation_nonce
            };

            $.post(woocommerce_admin_meta_boxes_variations.ajax_url, data, function (response) {
                var variation = $(response);
                variation.addClass('variation-needs-update');

                $('.woocommerce-notice-invalid-variation').remove();
                $('#variable_product_options').find('.woocommerce_variations').prepend(variation);
                $('button.cancel-variation-changes, button.save-variation-changes').removeAttr('disabled');
                $('#variable_product_options').trigger('woocommerce_variations_added', 1);
                wc_meta_boxes_product_variations_ajax.unblock();
            });

            return false;
        },

        remove_variation: function remove_variation() {
            wc_meta_boxes_product_variations_ajax.check_for_changes();

            if (window.confirm(woocommerce_admin_meta_boxes_variations.i18n_remove_variation)) {
                var variation = $(this).attr('rel'),
                    variation_ids = [],
                    data = {
                    action: 'woocommerce_remove_variations'
                };

                wc_meta_boxes_product_variations_ajax.block();

                if (0 < variation) {
                    variation_ids.push(variation);

                    data.variation_ids = variation_ids;
                    data.security = woocommerce_admin_meta_boxes_variations.delete_variations_nonce;

                    $.post(woocommerce_admin_meta_boxes_variations.ajax_url, data, function () {
                        var wrapper = $('#variable_product_options').find('.woocommerce_variations'),
                            current_page = parseInt(wrapper.attr('data-page'), 10),
                            total_pages = Math.ceil((parseInt(wrapper.attr('data-total'), 10) - 1) / woocommerce_admin_meta_boxes_variations.variations_per_page),
                            page = 1;

                        $('#woocommerce-product-data').trigger('woocommerce_variations_removed');

                        if (current_page === total_pages || current_page <= total_pages) {
                            page = current_page;
                        } else if (current_page > total_pages && 0 !== total_pages) {
                            page = total_pages;
                        }

                        wc_meta_boxes_product_variations_pagenav.go_to_page(page, -1);
                    });
                } else {
                    wc_meta_boxes_product_variations_ajax.unblock();
                }
            }

            return false;
        },

        link_all_variations: function link_all_variations() {
            wc_meta_boxes_product_variations_ajax.check_for_changes();

            if (window.confirm(woocommerce_admin_meta_boxes_variations.i18n_link_all_variations)) {
                wc_meta_boxes_product_variations_ajax.block();

                var data = {
                    action: 'woocommerce_link_all_variations',
                    post_id: woocommerce_admin_meta_boxes_variations.post_id,
                    security: woocommerce_admin_meta_boxes_variations.link_variation_nonce
                };

                $.post(woocommerce_admin_meta_boxes_variations.ajax_url, data, function (response) {
                    var count = parseInt(response, 10);

                    if (1 === count) {
                        window.alert(count + ' ' + woocommerce_admin_meta_boxes_variations.i18n_variation_added);
                    } else if (0 === count || count > 1) {
                        window.alert(count + ' ' + woocommerce_admin_meta_boxes_variations.i18n_variations_added);
                    } else {
                        window.alert(woocommerce_admin_meta_boxes_variations.i18n_no_variations_added);
                    }

                    if (count > 0) {
                        wc_meta_boxes_product_variations_pagenav.go_to_page(1, count);
                        $('#variable_product_options').trigger('woocommerce_variations_added', count);
                    } else {
                        wc_meta_boxes_product_variations_ajax.unblock();
                    }
                });
            }

            return false;
        },

        input_changed: function input_changed() {
            $(this).closest('.woocommerce_variation').addClass('variation-needs-update');

            $('button.cancel-variation-changes, button.save-variation-changes').removeAttr('disabled');

            $('#variable_product_options').trigger('woocommerce_variations_input_changed');
        },

        defaults_changed: function defaults_changed() {
            $(this).closest('#variable_product_options').find('.woocommerce_variation:first').addClass('variation-needs-update');

            $('button.cancel-variation-changes, button.save-variation-changes').removeAttr('disabled');

            $('#variable_product_options').trigger('woocommerce_variations_defaults_changed');
        },

        do_variation_action: function do_variation_action() {
            var do_variation_action = $('select.variation_actions').val(),
                data = {},
                changes = 0,
                value;

            switch (do_variation_action) {
                case 'add_variation':
                    wc_meta_boxes_product_variations_ajax.add_variation();
                    return;
                case 'link_all_variations':
                    wc_meta_boxes_product_variations_ajax.link_all_variations();
                    return;
                case 'delete_all':
                    if (window.confirm(woocommerce_admin_meta_boxes_variations.i18n_delete_all_variations)) {
                        if (window.confirm(woocommerce_admin_meta_boxes_variations.i18n_last_warning)) {
                            data.allowed = true;
                            changes = parseInt($('#variable_product_options').find('.woocommerce_variations').attr('data-total'), 10) * -1;
                        }
                    }
                    break;
                case 'variable_regular_price_increase':
                case 'variable_regular_price_decrease':
                case 'variable_sale_price_increase':
                case 'variable_sale_price_decrease':
                    value = window.prompt(woocommerce_admin_meta_boxes_variations.i18n_enter_a_value_fixed_or_percent);

                    if (value != null) {
                        if (value.indexOf('%') >= 0) {
                            data.value = accounting.unformat(value.replace(/\%/, ''), woocommerce_admin.mon_decimal_point) + '%';
                        } else {
                            data.value = accounting.unformat(value, woocommerce_admin.mon_decimal_point);
                        }
                    } else {
                        return;
                    }
                    break;
                case 'variable_regular_price':
                case 'variable_sale_price':
                case 'variable_stock':
                case 'variable_weight':
                case 'variable_length':
                case 'variable_width':
                case 'variable_height':
                case 'variable_download_limit':
                case 'variable_download_expiry':
                    value = window.prompt(woocommerce_admin_meta_boxes_variations.i18n_enter_a_value);

                    if (value != null) {
                        data.value = value;
                    } else {
                        return;
                    }
                    break;
                case 'variable_sale_schedule':
                    data.date_from = window.prompt(woocommerce_admin_meta_boxes_variations.i18n_scheduled_sale_start);
                    data.date_to = window.prompt(woocommerce_admin_meta_boxes_variations.i18n_scheduled_sale_end);

                    if (null === data.date_from) {
                        data.date_from = false;
                    }

                    if (null === data.date_to) {
                        data.date_to = false;
                    }

                    if (false === data.date_to && false === data.date_from) {
                        return;
                    }
                    break;
                default:
                    $('select.variation_actions').trigger(do_variation_action);
                    data = $('select.variation_actions').triggerHandler(do_variation_action + '_ajax_data', data);
                    break;
            }

            if ('delete_all' === do_variation_action && data.allowed) {
                $('#variable_product_options').find('.variation-needs-update').removeClass('variation-needs-update');
            } else {
                wc_meta_boxes_product_variations_ajax.check_for_changes();
            }

            wc_meta_boxes_product_variations_ajax.block();

            $.ajax({
                url: woocommerce_admin_meta_boxes_variations.ajax_url,
                data: {
                    action: 'woocommerce_bulk_edit_variations',
                    security: woocommerce_admin_meta_boxes_variations.bulk_edit_variations_nonce,
                    product_id: woocommerce_admin_meta_boxes_variations.post_id,
                    product_type: $('#product-type').val(),
                    bulk_action: do_variation_action,
                    data: data
                },
                type: 'POST',
                success: function success() {
                    wc_meta_boxes_product_variations_pagenav.go_to_page(1, changes);
                }
            });
        }
    };

    var wc_meta_boxes_product_variations_pagenav = {

        init: function init() {
            $(document.body).on('woocommerce_variations_added', this.update_single_quantity).on('change', '.variations-pagenav .page-selector', this.page_selector).on('click', '.variations-pagenav .first-page', this.first_page).on('click', '.variations-pagenav .prev-page', this.prev_page).on('click', '.variations-pagenav .next-page', this.next_page).on('click', '.variations-pagenav .last-page', this.last_page);
        },

        update_variations_count: function update_variations_count(qty) {
            var wrapper = $('#variable_product_options').find('.woocommerce_variations'),
                total = parseInt(wrapper.attr('data-total'), 10) + qty,
                displaying_num = $('.variations-pagenav .displaying-num');

            wrapper.attr('data-total', total);

            if (1 === total) {
                displaying_num.text(woocommerce_admin_meta_boxes_variations.i18n_variation_count_single.replace('%qty%', total));
            } else {
                displaying_num.text(woocommerce_admin_meta_boxes_variations.i18n_variation_count_plural.replace('%qty%', total));
            }

            return total;
        },

        update_single_quantity: function update_single_quantity(event, qty) {
            if (1 === qty) {
                var page_nav = $('.variations-pagenav');

                wc_meta_boxes_product_variations_pagenav.update_variations_count(qty);

                if (page_nav.is(':hidden')) {
                    $('option, optgroup', '.variation_actions').show();
                    $('.variation_actions').val('add_variation');
                    $('#variable_product_options').find('.toolbar').show();
                    page_nav.show();
                    $('.pagination-links', page_nav).hide();
                }
            }
        },

        set_paginav: function set_paginav(qty) {
            var wrapper = $('#variable_product_options').find('.woocommerce_variations'),
                new_qty = wc_meta_boxes_product_variations_pagenav.update_variations_count(qty),
                toolbar = $('#variable_product_options').find('.toolbar'),
                variation_action = $('.variation_actions'),
                page_nav = $('.variations-pagenav'),
                displaying_links = $('.pagination-links', page_nav),
                total_pages = Math.ceil(new_qty / woocommerce_admin_meta_boxes_variations.variations_per_page),
                options = '';

            wrapper.attr('data-total_pages', total_pages);

            $('.total-pages', page_nav).text(total_pages);

            for (var i = 1; i <= total_pages; i++) {
                options += '<option value="' + i + '">' + i + '</option>';
            }

            $('.page-selector', page_nav).empty().html(options);

            if (0 === new_qty) {
                toolbar.not('.toolbar-top, .toolbar-buttons').hide();
                page_nav.hide();
                $('option, optgroup', variation_action).hide();
                $('.variation_actions').val('add_variation');
                $('option[data-global="true"]', variation_action).show();
            } else {
                toolbar.show();
                page_nav.show();
                $('option, optgroup', variation_action).show();
                $('.variation_actions').val('add_variation');

                if (1 === total_pages) {
                    displaying_links.hide();
                } else {
                    displaying_links.show();
                }
            }
        },

        check_is_enabled: function check_is_enabled(current) {
            return !$(current).hasClass('disabled');
        },

        change_classes: function change_classes(selected, total) {
            var first_page = $('.variations-pagenav .first-page'),
                prev_page = $('.variations-pagenav .prev-page'),
                next_page = $('.variations-pagenav .next-page'),
                last_page = $('.variations-pagenav .last-page');

            if (1 === selected) {
                first_page.addClass('disabled');
                prev_page.addClass('disabled');
            } else {
                first_page.removeClass('disabled');
                prev_page.removeClass('disabled');
            }

            if (total === selected) {
                next_page.addClass('disabled');
                last_page.addClass('disabled');
            } else {
                next_page.removeClass('disabled');
                last_page.removeClass('disabled');
            }
        },

        set_page: function set_page(page) {
            $('.variations-pagenav .page-selector').val(page).first().change();
        },

        go_to_page: function go_to_page(page, qty) {
            page = page || 1;
            qty = qty || 0;

            wc_meta_boxes_product_variations_pagenav.set_paginav(qty);
            wc_meta_boxes_product_variations_pagenav.set_page(page);
        },

        page_selector: function page_selector() {
            var selected = parseInt($(this).val(), 10),
                wrapper = $('#variable_product_options').find('.woocommerce_variations');

            $('.variations-pagenav .page-selector').val(selected);

            wc_meta_boxes_product_variations_ajax.check_for_changes();
            wc_meta_boxes_product_variations_pagenav.change_classes(selected, parseInt(wrapper.attr('data-total_pages'), 10));
            wc_meta_boxes_product_variations_ajax.load_variations(selected);
        },

        first_page: function first_page() {
            if (wc_meta_boxes_product_variations_pagenav.check_is_enabled(this)) {
                wc_meta_boxes_product_variations_pagenav.set_page(1);
            }

            return false;
        },

        prev_page: function prev_page() {
            if (wc_meta_boxes_product_variations_pagenav.check_is_enabled(this)) {
                var wrapper = $('#variable_product_options').find('.woocommerce_variations'),
                    prev_page = parseInt(wrapper.attr('data-page'), 10) - 1,
                    new_page = 0 < prev_page ? prev_page : 1;

                wc_meta_boxes_product_variations_pagenav.set_page(new_page);
            }

            return false;
        },

        next_page: function next_page() {
            if (wc_meta_boxes_product_variations_pagenav.check_is_enabled(this)) {
                var wrapper = $('#variable_product_options').find('.woocommerce_variations'),
                    total_pages = parseInt(wrapper.attr('data-total_pages'), 10),
                    next_page = parseInt(wrapper.attr('data-page'), 10) + 1,
                    new_page = total_pages >= next_page ? next_page : total_pages;

                wc_meta_boxes_product_variations_pagenav.set_page(new_page);
            }

            return false;
        },

        last_page: function last_page() {
            if (wc_meta_boxes_product_variations_pagenav.check_is_enabled(this)) {
                var last_page = $('#variable_product_options').find('.woocommerce_variations').attr('data-total_pages');

                wc_meta_boxes_product_variations_pagenav.set_page(last_page);
            }

            return false;
        }
    };

    wc_meta_boxes_product_variations_actions.init();
    wc_meta_boxes_product_variations_media.init();
    wc_meta_boxes_product_variations_ajax.init();
    wc_meta_boxes_product_variations_pagenav.init();
});