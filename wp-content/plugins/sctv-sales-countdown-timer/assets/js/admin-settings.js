jQuery(document).ready(function () {
    'use strict';
    jQuery('.vi-ui.vi-ui-main.tabular.menu .item').vi_tab({
        history: true,
        historyType: 'hash',
    });
    jQuery('.woo-sctr-accordion-wrap:not(.woo-sctr-accordion-wrap-init)').each(function () {
        jQuery(this).visctv_countdown_timer();
    });
    jQuery('body').on('click', function () {
        jQuery('.iris-picker').hide();
    });
    jQuery('[data-tab="general"]').find('.vi-ui.checkbox').checkbox();
    jQuery('[data-tab="general"]').find('input[type="checkbox"]').unbind().on('change', function () {
        if (jQuery(this).prop('checked')) {
            jQuery(this).parent().find('input[type="hidden"]').val('1');
        } else {
            jQuery(this).parent().find('input[type="hidden"]').val('');
        }
    });
    jQuery(document).on('click', '.woo-sctr-bt-save:not(.loading)', function () {
        let button = jQuery(this);
        jQuery('.woo-sctr-bt-save').addClass('loading');
        jQuery('#woo-scrt-message-error').addClass('woo-sctr-countdown-hidden');
        let z, v, nameArr = jQuery('input[name="sale_countdown_name[]"]');
        for (z = 0; z < nameArr.length; z++) {
            if (!jQuery('input[name="sale_countdown_name[]"]').eq(z).val()) {
                alert('Name cannot be empty!');
                if (!jQuery('.woo-sctr-accordion').eq(z).hasClass('woo-sctr-active-accordion')) {
                    jQuery('.woo-sctr-accordion').eq(z).addClass('woo-sctr-active-accordion');
                    jQuery('.woo-sctr-panel').eq(z).css({'max-height': jQuery('.woo-sctr-panel').eq(z).prop('scrollHeight') + 'px'})
                }
                jQuery('.loading').removeClass('loading');
                return false;
            }
        }
        for (z = 0; z < nameArr.length - 1; z++) {
            for (v = z + 1; v < nameArr.length; v++) {
                if (jQuery('input[name="sale_countdown_name[]"]').eq(z).val() === jQuery('input[name="sale_countdown_name[]"]').eq(v).val()) {
                    alert("Names are unique!");
                    if (!jQuery('.woo-sctr-accordion').eq(v).hasClass('woo-sctr-active-accordion')) {
                        jQuery('.woo-sctr-accordion').eq(v).addClass('woo-sctr-active-accordion');
                        jQuery('.woo-sctr-panel').eq(v).css({'max-height': jQuery('.woo-sctr-panel').eq(v).prop('scrollHeight') + 'px'})
                    }
                    jQuery('.loading').removeClass('loading');
                    return false;
                }
            }
        }
        button.attr('type', 'submit');
    });
    jQuery(document).on('click', '.woo-sctr-save1:not(.loading)', function () {
        let button = jQuery(this);
        button.addClass('loading');
        jQuery('#woo-scrt-message-error').addClass('woo-sctr-countdown-hidden');
        let myArr,  myData = {}, temp;
        if (save_update_key) {
            myData['update_key'] = jQuery('#auto-update-key').val();
        }
        myData['save_all_changes'] = save_all_change ? 'yes' : '';
        myData['save_update_key'] = save_update_key ? 'yes' : '';
        myData['woo_ctr_nonce_field'] = jQuery('#_woo_ctr_settings_page_nonce_field').val();
        if (save_all_change) {
            var nameArr = jQuery('input[name="sale_countdown_name[]"]');
            var z, v;
            for (z = 0; z < nameArr.length; z++) {
                if (!jQuery('input[name="sale_countdown_name[]"]').eq(z).val()) {
                    alert('Name cannot be empty!');
                    if (!jQuery('.woo-sctr-accordion').eq(z).hasClass('woo-sctr-active-accordion')) {
                        jQuery('.woo-sctr-accordion').eq(z).addClass('woo-sctr-active-accordion');
                        jQuery('.woo-sctr-panel').eq(z).css({'max-height': jQuery('.woo-sctr-panel').eq(z).prop('scrollHeight') + 'px'})
                    }
                    button.removeClass('loading')
                    return false;
                }
            }
            for (z = 0; z < nameArr.length - 1; z++) {
                for (v = z + 1; v < nameArr.length; v++) {
                    if (jQuery('input[name="sale_countdown_name[]"]').eq(z).val() === jQuery('input[name="sale_countdown_name[]"]').eq(v).val()) {
                        alert("Names are unique!");
                        if (!jQuery('.woo-sctr-accordion').eq(v).hasClass('woo-sctr-active-accordion')) {
                            jQuery('.woo-sctr-accordion').eq(v).addClass('woo-sctr-active-accordion');
                            jQuery('.woo-sctr-panel').eq(v).css({'max-height': jQuery('.woo-sctr-panel').eq(v).prop('scrollHeight') + 'px'})
                        }
                        button.removeClass('loading')
                        return false;
                    }
                }
            }
            myArr = [
                'sale_countdown_active',
                'sale_countdown_name',
                'sale_countdown_id',
                'sale_countdown_loop_enable',
                'sale_countdown_loop_time_val',
                'sale_countdown_loop_time_type',
                'sale_countdown_fom_date',
                'sale_countdown_fom_time',
                'sale_countdown_to_date',
                'sale_countdown_to_time',
                'sale_countdown_message',
                'sale_countdown_layout',
                'sale_countdown_display_type',
                'sale_countdown_message_position',
                'sale_countdown_time_units',
                'sale_countdown_time_separator',
                'sale_countdown_datetime_format',
                'sale_countdown_datetime_format_custom_date',
                'sale_countdown_datetime_format_custom_hour',
                'sale_countdown_datetime_format_custom_minute',
                'sale_countdown_datetime_format_custom_second',
                'sale_countdown_animation_style',

                'sale_countdown_layout_fontsize',
                'sale_countdown_layout_1_background',
                'sale_countdown_layout_1_color',
                'sale_countdown_layout_1_border_color',
                'sale_countdown_layout_1_border_radius',
                'sale_countdown_layout_1_padding',
                'sale_countdown_layout_1_sticky_background',
                'sale_countdown_layout_1_sticky_color',
                'sale_countdown_layout_1_sticky_border_color',

                'sale_countdown_template_1_time_unit_position',
                'sale_countdown_template_1_time_unit_color',
                'sale_countdown_template_1_time_unit_background',
                'sale_countdown_template_1_time_unit_fontsize',
                'sale_countdown_template_1_value_color',
                'sale_countdown_template_1_value_background',
                'sale_countdown_template_1_value_border_color',
                'sale_countdown_template_1_value_border_radius',
                'sale_countdown_template_1_value_width',
                'sale_countdown_template_1_value_height',
                'sale_countdown_template_1_value_font_size',

                'sale_countdown_template_2_item_border_color',
                'sale_countdown_template_2_item_border_radius',
                'sale_countdown_template_2_item_height',
                'sale_countdown_template_2_item_width',
                'sale_countdown_template_2_value_color',
                'sale_countdown_template_2_value_background',
                'sale_countdown_template_2_value_fontsize',
                'sale_countdown_template_2_time_unit_color',
                'sale_countdown_template_2_time_unit_background',
                'sale_countdown_template_2_time_unit_fontsize',
                'sale_countdown_template_2_time_unit_position',

                'sale_countdown_template_3_value_color',
                'sale_countdown_template_3_value_background',
                'sale_countdown_template_3_value_fontsize',
                'sale_countdown_template_3_time_unit_color',
                'sale_countdown_template_3_time_unit_background',
                'sale_countdown_template_3_time_unit_fontsize',

                'sale_countdown_template_4_value_border_color1',
                'sale_countdown_template_4_value_border_color2',
                'sale_countdown_template_4_value_color',
                'sale_countdown_template_4_value_background',
                'sale_countdown_template_4_value_fontsize',
                'sale_countdown_template_4_value_border_width',
                'sale_countdown_template_4_value_diameter',
                'sale_countdown_template_4_time_unit_color',
                'sale_countdown_template_4_time_unit_background',
                'sale_countdown_template_4_time_unit_fontsize',
                'sale_countdown_template_4_time_unit_position',
                'sale_countdown_circle_smooth_animation',

                'sale_countdown_template_5_item_border_width',
                'sale_countdown_template_5_item_diameter',
                'sale_countdown_template_5_value_color',
                'sale_countdown_template_5_value_fontsize',
                'sale_countdown_template_5_time_unit_color',
                'sale_countdown_template_5_time_unit_fontsize',
                'sale_countdown_template_5_date_border_color1',
                'sale_countdown_template_5_date_border_color2',
                'sale_countdown_template_5_date_background',
                'sale_countdown_template_5_hour_border_color1',
                'sale_countdown_template_5_hour_border_color2',
                'sale_countdown_template_5_hour_background',
                'sale_countdown_template_5_minute_border_color1',
                'sale_countdown_template_5_minute_border_color2',
                'sale_countdown_template_5_minute_background',
                'sale_countdown_template_5_second_border_color1',
                'sale_countdown_template_5_second_border_color2',
                'sale_countdown_template_5_second_background',

                'sale_countdown_template_6_time_unit_position',
                'sale_countdown_template_6_value_width',
                'sale_countdown_template_6_value_height',
                'sale_countdown_template_6_value_border_radius',
                'sale_countdown_template_6_value_fontsize',
                'sale_countdown_template_6_value_color1',
                'sale_countdown_template_6_value_color2',
                'sale_countdown_template_6_value_background1',
                'sale_countdown_template_6_value_background2',
                'sale_countdown_template_6_value_box_shadow',
                'sale_countdown_template_6_value_cut_color',
                'sale_countdown_template_6_value_cut_behind',
                'sale_countdown_template_6_time_unit_color',
                'sale_countdown_template_6_time_unit_fontsize',
                'sale_countdown_template_6_time_unit_grid_gap',

                'sale_countdown_template_7_time_unit_position',
                'sale_countdown_template_7_value_width',
                'sale_countdown_template_7_value_height',
                'sale_countdown_template_7_value_border_radius',
                'sale_countdown_template_7_value_fontsize',
                'sale_countdown_template_7_value_color1',
                'sale_countdown_template_7_value_color2',
                'sale_countdown_template_7_value_background1',
                'sale_countdown_template_7_value_background2',
                'sale_countdown_template_7_value_box_shadow',
                'sale_countdown_template_7_value_cut_color',
                'sale_countdown_template_7_value_cut_behind',
                'sale_countdown_template_7_time_unit_color',
                'sale_countdown_template_7_time_unit_fontsize',
                'sale_countdown_template_7_time_unit_grid_gap',

                'sale_countdown_single_product_sticky',
                'sale_countdown_single_product_position',
                'sale_countdown_mobile_resize',
                'sale_countdown_loop_resize',
                'sale_countdown_sticky_resize',

                'sale_countdown_archive_page_enable',
                'sale_countdown_archive_page_assign',
                'sale_countdown_archive_page_position',

                'sale_countdown_progress_bar_message',
                'sale_countdown_progress_bar_type',
                'sale_countdown_progress_bar_order_status',
                'sale_countdown_progress_bar_position',
                'sale_countdown_progress_bar_template',
                'sale_countdown_progress_bar_message_position',
                'sale_countdown_progress_bar_template_1_background',
                'sale_countdown_progress_bar_template_1_color',
                'sale_countdown_progress_bar_template_1_message_color',
                'sale_countdown_progress_bar_template_1_border_radius',
                'sale_countdown_progress_bar_template_1_height',
                'sale_countdown_progress_bar_template_1_width',
                'sale_countdown_progress_bar_template_1_width_type',
                'sale_countdown_progress_bar_template_1_font_size',

                'sale_countdown_wrap_border_radius_in_single',
                'sale_countdown_wrap_border_color_in_single',
                'sale_countdown_progress_bar_position_in_single',
                'sale_countdown_progress_bar_message_position_in_single',

                'sale_countdown_upcoming_enable',
                'sale_countdown_upcoming_progress_bar_enable',
                'sale_countdown_upcoming_message',

                'sale_countdown_sticky_width',
                'sale_countdown_sticky_time_unit_disable',
                'sale_countdown_add_to_cart_button',
            ];
            for (var eleName in myArr) {
                temp = [];
                jQuery('[name="' + myArr[eleName] + '[]"]').map(function () {
                    temp.push(jQuery(this).val());
                });
                myData[myArr[eleName]] = temp;
            }
        }
        jQuery.ajax({
            type: 'post',
            dataType: 'json',
            url: 'admin-ajax.php?action=woo_sctr_save_settings',
            data: myData,
            success: function (response) {
                // console.log(response);
                button.removeClass('loading');
                if (response.status === 'successful') {
                    if (save_update_key) {
                        location.reload();
                    } else if (save_all_change) {
                        jQuery('.woo-sctr-save-sucessful-popup').animate({'bottom': '45px'}, 500);
                        setTimeout(function () {
                            jQuery('.woo-sctr-save-sucessful-popup').animate({'bottom': '-300px'}, 200);
                        }, 5000);
                    }
                }else if (response.message){
                    jQuery('#woo-scrt-message-error').removeClass('woo-sctr-countdown-hidden').html('<p>'+response.message+'</p>');
                    jQuery.scroll_to_notices(jQuery('#woo-scrt-message-error'));
                }
            },
            error: function (err) {
                console.log(err.responseText);
                button.removeClass('loading');
            }
        });
    });

    //Auto update
    jQuery('.villatheme-get-key-button').one('click', function (e) {
        let v_button = jQuery(this);
        v_button.addClass('loading');
        let data = v_button.data();
        let item_id = data.id;
        let app_url = data.href;
        let main_domain = window.location.hostname;
        main_domain = main_domain.toLowerCase();
        let popup_frame;
        e.preventDefault();
        let download_url = v_button.attr('data-download');
        popup_frame = window.open(app_url, "myWindow", "width=380,height=600");
        window.addEventListener('message', function (event) {
            /*Callback when data send from child popup*/
            let obj = jQuery.parseJSON(event.data);
            let update_key = '';
            let message = obj.message;
            let support_until = '';
            let check_key = '';
            if (obj['data'].length > 0) {
                for (let i = 0; i < obj['data'].length; i++) {
                    if (obj['data'][i].id == item_id && (obj['data'][i].domain == main_domain || obj['data'][i].domain == '' || obj['data'][i].domain == null)) {
                        if (update_key == '') {
                            update_key = obj['data'][i].download_key;
                            support_until = obj['data'][i].support_until;
                        } else if (support_until < obj['data'][i].support_until) {
                            update_key = obj['data'][i].download_key;
                            support_until = obj['data'][i].support_until;
                        }
                        if (obj['data'][i].domain == main_domain) {
                            update_key = obj['data'][i].download_key;
                            break;
                        }
                    }
                }
                if (update_key) {
                    check_key = 1;
                    jQuery('.villatheme-autoupdate-key-field').val(update_key);
                }
            }
            v_button.removeClass('loading');
            if (check_key) {
                jQuery('<p><strong>' + message + '</strong></p>').insertAfter(".villatheme-autoupdate-key-field");
                jQuery(v_button).closest('form').submit();
            } else {
                jQuery('<p><strong> Your key is not found. Please contact support@villatheme.com </strong></p>').insertAfter(".villatheme-autoupdate-key-field");
            }
        });
    });
});
jQuery.fn.visctv_countdown_timer=function () {
    new visctv_countdown_timer_init(this);
    return this;
};
var visctv_countdown_timer_init = function (rule) {
    this.rule = rule;
    this.init();
};
visctv_countdown_timer_init.prototype.init = function () {
    let self = this;
    let rule = this.rule;
    rule.addClass('woo-sctr-accordion-wrap-init').villatheme_accordion('refresh');
    rule.find('.vi-ui.dropdown:not(.woo-sctr-dropdown-init)').addClass('woo-sctr-dropdown-init').dropdown();
    rule.find('.vi-ui.checkbox:not(.woo-sctr-checkbox-init)').addClass('woo-sctr-checkbox-init').checkbox();
    rule.find('.color-picker:not(.woo-sctr-color-picker-init)').addClass('woo-sctr-color-picker-init').each(function () {
        jQuery(this).css({backgroundColor: jQuery(this).val()}).unbind().iris({
            change: function (event, ui) {
                let val = ui.color.toString();
                jQuery(this).css({backgroundColor: val}).val(val).trigger('change');
            },
            hide: true,
            border: true
        }).on('click', function (e) {
            jQuery('.iris-picker').hide();
            jQuery(this).parent().find('.iris-picker').show();
            e.stopPropagation();
        }).on('change keyup', function () {
            jQuery(this).css({'background': jQuery(this).val()});
        });
    });
    self.copy_shortcode(rule);
    self.color_picker(rule);
    self.checkbox(rule);
    self.dropdown(rule);
    self.change_value(rule);
    self.clone(rule);
    self.remove(rule);
};
visctv_countdown_timer_init.prototype.remove = function (container) {
    container.on('click', ('.woo-sctr-button-edit-remove'), function (e) {
        if (jQuery('.woo-sctr-button-edit-remove').length === 1) {
            alert('You can not remove the last item.');
            return false;
        }
        if (confirm("Would you want to remove this?")) {
            container.remove();
        }
        e.stopPropagation();
    });
};
visctv_countdown_timer_init.prototype.clone = function (container) {
    container.on('click','.woo-sctr-button-edit-duplicate:not(.loading)', function (e) {
        e.stopPropagation();
        let clone = container.clone(),
            new_id = Date.now(),
            inline_style = jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html();
        jQuery(this).addClass('loading');
        inline_style += '.woo-sctr-accordion-wrap-' + new_id + '  .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container:after {background:' + container.find('.woo-sctr-countdown-template-4-value-background').val() + ';}';
        jQuery('#vi-sales-countdown-timer-admin-css-inline-css').html(inline_style);
        for (let i = 0; i < clone.find('.vi-ui.dropdown').length; i++) {
            let selected = container.find('.vi-ui.dropdown').eq(i).dropdown('get value');
            clone.find('.vi-ui.dropdown').eq(i).dropdown('set selected', selected);
        }
        clone.attr('data-accordion_id', new_id);
        clone.find('.woo-sctr-id').val(new_id);
        clone.find('.woo-sctr-shortcode-text span.woo-sctr-shortcode-show').html('[sales_countdown_timer id="' + new_id + '"]');
        clone.find('.iris-picker').remove();
        clone.visctv_countdown_timer().insertAfter(container);
        jQuery(this).removeClass('loading');
        e.stopPropagation();
    });
};
visctv_countdown_timer_init.prototype.change_value = function (container) {
    /* layout 1*/
    container.on('change','.woo-sctr-countdown-layout-1-border-radius', function () {
        container.find('.woo-sctr-countdown-timer-layout.woo-sctr-layout-1 ').css({'border-radius': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-layout-1-padding', function () {
        container.find('.woo-sctr-countdown-timer-layout.woo-sctr-layout-1 ').css({'padding': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-layout-fontsize', function () {
        container.find('.woo-sctr-countdown-timer-layout').css({'font-size': jQuery(this).val() + 'px'});
    });

    /*countdown template 1 */
    container.on('change','.woo-sctr-countdown-template-1-value-font-size', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'font-size': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-1-value-border-radius', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'border-radius': jQuery(this).val() + 'px'})
    });
    container.on('change','.woo-sctr-countdown-template-1-value-height', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'height': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-1-value-width', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'width': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-1-text-fontsize', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'font-size': jQuery(this).val() + 'px'})
    });

    /* countdown template 2 */
    container.on('change','.woo-sctr-countdown-template-2-item-border-radius', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-unit ').css({'border-radius': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-2-item-height', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-unit ').css({'height': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-2-item-width', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-unit ').css({'width': jQuery(this).val() + 'px'});
    });
    container.on('change', '.woo-sctr-countdown-template-2-item-value-fontsize',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'font-size': jQuery(this).val() + 'px'});
    });
    container.on('change', '.woo-sctr-countdown-template-2-item-time-unit-fontsize',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'font-size': jQuery(this).val() + 'px'});
    });

    /*countdown template 3  */
    container.on('change','.woo-sctr-countdown-template-3-value-fontsize', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-3 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'font-size': jQuery(this).val() + 'px'});
    });
    container.on('change', '.woo-sctr-countdown-template-3-time-unit-fontsize',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-3 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'font-size': jQuery(this).val() + 'px'});
    });

    /*countdown template 4  */
    container.on('change','.woo-sctr-countdown-template-4-value-fontsize', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'font-size': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-4-time-unit-fontsize', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'font-size': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-4-value-border-width', function () {
        let circle_border_width = parseInt(jQuery(this).val()||0);
        let circle_diameter = parseInt(container.find('.woo-sctr-countdown-template-4-value-diameter').val());
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container .woo-sctr-value-bar').css({'border-width': circle_border_width + 'px'});
        if (circle_border_width === 0) {
            container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container.woo-sctr-over50 .woo-sctr-first50-bar  ').css({'background-color': 'transparent'});
        } else {
            container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container.woo-sctr-over50 .woo-sctr-first50-bar  ').css({'background-color': container.find('.woo-sctr-countdown-template-4-value-border-color-2').val()});
        }
        let str = jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(),
            id = container.data('accordion_id');
        let reg_str = '.woo-sctr-accordion-wrap-' + id + '  .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container:after {width:[\\s\\S]*?;}';
        let reg = new RegExp(reg_str);
        let match = reg.exec(str);
        let str1 = '.woo-sctr-accordion-wrap-' + id + '  .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container:after {width:' + (circle_diameter - 2 * circle_border_width) + 'px ;height:' + (circle_diameter - 2 * circle_border_width) + 'px ; top:' + circle_border_width + 'px ; left:' + circle_border_width + 'px ;}';
        if (match) {
            str = str.replace(match[0], str1);
            jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
        } else {
            str += str1;
            jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
        }
    });
    container.on('change','.woo-sctr-countdown-template-4-value-diameter', function () {
        if (!jQuery(this).val()){
            jQuery(this).val(70);
        }
        let circle_border_width = parseInt(container.find('.woo-sctr-countdown-template-4-value-border-width').val()||0);
        let circle_diameter = parseInt(jQuery(this).val());
        if (circle_border_width === 0) {
            container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container.woo-sctr-over50 .woo-sctr-first50-bar  ').css({'background-color': 'transparent'});
        } else {
            container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container.woo-sctr-over50 .woo-sctr-first50-bar  ').css({'background-color': container.find('.woo-sctr-countdown-template-4-value-border-color-2').val()});
        }
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container').css({
            'width': circle_diameter + 'px',
            'height': circle_diameter + 'px',
        });
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container:not(.woo-sctr-over50) .woo-sctr-left-half-clipper ,.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container.woo-sctr-over50 .woo-sctr-first50-bar  ').css(
            {'clip': 'rect(0,' + circle_diameter + 'px,' + circle_diameter + 'px,' + circle_diameter / 2 + 'px)'});
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container .woo-sctr-value-bar  ').css({
            'clip': 'rect(0,' + circle_diameter / 2 + 'px,' + circle_diameter + 'px,0 )',
            'border-width': circle_border_width + 'px'
        });

        let str = jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(),
            id = container.data('accordion_id');
        let reg_str = '.woo-sctr-accordion-wrap-' +id + '  .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container:after {width:[\\s\\S]*?;}';
        let reg = new RegExp(reg_str);
        let match = reg.exec(str);
        let str1 = '.woo-sctr-accordion-wrap-' + id+ '  .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container:after {width:' + (circle_diameter - 2 * circle_border_width) + 'px ;height:' + (circle_diameter - 2 * circle_border_width) + 'px ; top:' + circle_border_width + 'px ; left:' + circle_border_width + 'px ;}';
        if (match) {
            str = str.replace(match[0], str1);
            jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
        } else {
            str += str1;
            jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
        }
    });

    /*countdown template 5  */
    container.on('change', '.woo-sctr-countdown-template-5-item-border-width',function () {
        if (!jQuery(this).val()) {
            jQuery(this).val(0);
        }
        let circle_border_width = jQuery(this).val();
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container .woo-sctr-countdown-circle').css({'border-width': circle_border_width + 'px'});
        container.find(' .woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container .woo-sctr-value-bar ').css({'border-width': circle_border_width + 'px'});
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-over50 .woo-sctr-first50-bar').css({'border-width': circle_border_width + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-5-item-diameter', function () {
        if (!jQuery(this).val()) {
            jQuery(this).val(90);
        }
        let circle_diameter = parseInt(jQuery(this).val());
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container').css({
            'width': circle_diameter + 'px',
            'height': circle_diameter + 'px'
        });
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container:not(.woo-sctr-over50) .woo-sctr-left-half-clipper ,.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-over50 .woo-sctr-first50-bar  ').css({'clip': 'rect(0,' + circle_diameter + 'px,' + circle_diameter + 'px,' + circle_diameter / 2 + 'px)'});
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container .woo-sctr-value-bar').css({'clip': 'rect(0,' + circle_diameter / 2 + 'px,' + circle_diameter + 'px,0 )'});
    });
    container.on('change','.woo-sctr-countdown-template-5-value-fontsize', function () {
        if (!jQuery(this).val()) {
            jQuery(this).val(30);
        }
        let value_fontsize = parseInt(jQuery(this).val());
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container .woo-sctr-countdown-value').css({
            'font-size': value_fontsize + 'px',
        });
    });
    container.on('change','.woo-sctr-countdown-template-5-time-unit-fontsize', function () {
        if (!jQuery(this).val()) {
            jQuery(this).val(12);
        }
        let time_unit_fontsize = parseInt(jQuery(this).val());
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container .woo-sctr-countdown-text').css({'font-size': time_unit_fontsize + 'px'});
    });

    /*countdown template 6  */
    container.on('change','.woo-sctr-countdown-template-6-value-width', function () {
        if (!jQuery(this).val()) {
            jQuery(this).val(48);
        }
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap').css({'width': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-6-value-height', function () {
        if (!jQuery(this).val()) {
            jQuery(this).val(40);
        }
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap').css({'height': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-6-value-border-radius', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap').css({'border-radius': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-6-value-fontsize', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap span').css({'font-size': jQuery(this).val() + 'px'});
    });
    container.on('change', '.woo-sctr-countdown-template-6-time-unit-fontsize',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-text').css({'font-size': jQuery(this).val() + 'px'});
    });
    container.on('change', '.woo-sctr-countdown-template-6-time-unit-grid-gap',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-unit-two-vertical-wrap').css({'grid-gap': jQuery(this).val() + 'px'});
    });

    /*countdown template 7  */
    container.on('change','.woo-sctr-countdown-template-7-value-width', function () {
        if (!jQuery(this).val()) {
            jQuery(this).val(50);
        }
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap').css({'width': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-7-value-height', function () {
        if (!jQuery(this).val()) {
            jQuery(this).val(75);
        }
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap').css({'height': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-7-value-border-radius', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap').css({'border-radius': jQuery(this).val() + 'px'});
    });
    container.on('change', '.woo-sctr-countdown-template-7-value-fontsize',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap span').css({'font-size': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-7-time-unit-fontsize', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-text').css({'font-size': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-countdown-template-7-time-unit-grid-gap', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-unit-two-vertical-wrap').css({'grid-gap': jQuery(this).val() + 'px'});
    });

    /*progress bar template 1*/
    container.on('change','.woo-sctr-progress-bar-template-1-font-size', function () {
        container.find('.woo-sctr-progress-bar-message').css({'font-size': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-progress-bar-template-1-border-radius', function () {
        container.find('.woo-sctr-progress-bar-wrap').css({'border-radius': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-progress-bar-template-1-height', function () {
        container.find('.woo-sctr-progress-bar-wrap').css({'height': jQuery(this).val() + 'px'});
    });
    container.on('change','.woo-sctr-progress-bar-template-1-width', function () {
        let width = jQuery(this).val();
        if (parseInt(width) > 0) {
            width = width + container.find('.woo-sctr-progress-bar-template-1-width-type select').val();
        } else {
            width = '100%';
        }
        container.find('.woo-sctr-progress-bar-wrap').css({'width': width});
    });
    container.on('keyup','.woo-sctr-progress-bar-message-input', function () {
        let pg_message = jQuery(this).val();
        pg_message = pg_message.replace(/{quantity_left}/g, '80');
        pg_message = pg_message.replace(/{quantity_sold}/g, '20');
        pg_message = pg_message.replace(/{percentage_sold}/g, '20');
        pg_message = pg_message.replace(/{percentage_left}/g, '20');
        pg_message = pg_message.replace(/{goal}/g, '100');
        container.find('.woo-sctr-progress-bar-message').html(pg_message);
    });

    /* general */
    container.on('keyup','.woo-sctr-name', function () {
        container.find('.woo-sctr-accordion-name').html(jQuery(this).val());
    });
    container.on('change','.woo-sctr-sale-from-date', function () {
        container.find('.woo-sctr-short-description-from-date').html(jQuery(this).val());
    });
    container.on('change', '.woo-sctr-sale-from-time',function () {
        container.find('.woo-sctr-short-description-from-time').html(jQuery(this).val());
    });
    container.on('change','.woo-sctr-sale-to-date', function () {
        container.find('.woo-sctr-short-description-to-date').html(jQuery(this).val());
    });
    container.on('change','.woo-sctr-sale-to-time', function () {
        container.find('.woo-sctr-short-description-to-time').html(jQuery(this).val());
    });
    container.on('keyup','.woo-sctr-message', function () {
        var textBefore, textAfter, message = jQuery(this).val();
        var temp = message.split('{countdown_timer}');
        if (temp.length < 2) {
            jQuery('.woo-sctr-warning-message-countdown-timer').removeClass('woo-sctr-hidden');
        } else {
            jQuery('.woo-sctr-warning-message-countdown-timer').addClass('woo-sctr-hidden');
            textBefore = temp[0];
            textAfter = temp[1];
        }
        container.find('.woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-text-before').html(textBefore);
        container.find('.woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-text-after').html(textAfter);
    });
    container.on('keyup', '.woo-sctr-datetime-format-custom-date', function () {
        container.find('.woo-sctr-countdown-date-text').html(jQuery(this).val());
    });
    container.on('keyup', '.woo-sctr-datetime-format-custom-hour', function () {
        container.find('.woo-sctr-countdown-hour-text').html(jQuery(this).val());
    });
    container.on('keyup', '.woo-sctr-datetime-format-custom-minute', function () {
        container.find('.woo-sctr-countdown-minute-text').html(jQuery(this).val());
    });
    container.on('keyup', '.woo-sctr-datetime-format-custom-second', function () {
        container.find('.woo-sctr-countdown-second-text').html(jQuery(this).val());
    });

};
visctv_countdown_timer_init.prototype.checkbox = function (container) {
    container.find('input[type="checkbox"]').unbind().on('change', function () {
        if (jQuery(this).prop('checked')) {
            jQuery(this).parent().find('input[type="hidden"]').val('1');
            if (jQuery(this).hasClass('woo-sctr-countdown-template-6-value-box-shadow-check')) {
                container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap').css({'box-shadow': '0 3px 4px 0 rgba(0,0,0, 0.15), inset 2px 4px 0 0 rgba(255,255, 255, 0.08)'});
            } else if (jQuery(this).hasClass('woo-sctr-countdown-template-6-value-cut-behind-check')) {
                container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top').removeClass('woo-sctr-countdown-two-vertical-top-cut-default').addClass('woo-sctr-countdown-two-vertical-top-cut-behind');
                let str = jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(),
                    id= container.data('accordion_id'),
                    color = jQuery('.woo-sctr-countdown-template-6-value-cut-color').val();
                let reg_str = '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-6  .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind::after{box-shadow:[\\s\\S]*?;}';
                let reg = new RegExp(reg_str);
                let match = reg.exec(str), str1;
                container.find('.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind').css({'border-bottom': 'unset'});
                str1 = '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-6  .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind::after{box-shadow: inset 0px 1px 0px 0px ' + color + ';}';
                if (match) {
                    str = str.replace(match[0], str1);
                    jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
                } else if (str1) {
                    jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str + str1);
                }
            } else if (jQuery(this).hasClass('woo-sctr-countdown-template-7-value-box-shadow-check')) {
                container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap').css({'box-shadow': '0 3px 4px 0 rgba(0,0,0, 0.15), inset 2px 4px 0 0 rgba(255,255, 255, 0.08)'});
            } else if (jQuery(this).hasClass('woo-sctr-countdown-template-7-value-cut-behind-check')) {
                container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top').removeClass('woo-sctr-countdown-two-vertical-top-cut-default').addClass('woo-sctr-countdown-two-vertical-top-cut-behind');
                let str = jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(),
                    id= container.data('accordion_id'),
                    color = jQuery('.woo-sctr-countdown-template-7-value-cut-color').val();
                let reg_str = '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind::after{box-shadow:[\\s\\S]*?;}';
                let reg = new RegExp(reg_str);
                let match = reg.exec(str), str1;
                container.find('.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind').css({'border-bottom': 'unset'});
                str1 = '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind::after{box-shadow: inset 0px 1px 0px 0px  ' + color + ';}';
                if (match) {
                    str = str.replace(match[0], str1);
                    jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
                } else if (str1) {
                    jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str + str1);
                }
            }
        } else {
            jQuery(this).parent().find('input[type="hidden"]').val('');
            if (jQuery(this).hasClass('woo-sctr-countdown-template-6-value-box-shadow-check')) {
                container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap').css({'box-shadow': 'unset'});
            } else if (jQuery(this).hasClass('woo-sctr-countdown-template-6-value-cut-behind-check')) {
                container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top').addClass('woo-sctr-countdown-two-vertical-top-cut-default').removeClass('woo-sctr-countdown-two-vertical-top-cut-behind');
                let str = jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(),
                    id= container.data('accordion_id'),
                    color = jQuery('.woo-sctr-countdown-template-6-value-cut-color').val();
                let reg_str = '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-6  .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind::after{box-shadow:[\\s\\S]*?;}';
                let reg = new RegExp(reg_str);
                let match = reg.exec(str), str1= '';
                container.find('.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-default').css({'border-bottom': '1px solid ' +color});
                if (match) {
                    str = str.replace(match[0], str1);
                    jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
                }
            }
            if (jQuery(this).hasClass('woo-sctr-countdown-template-7-value-box-shadow-check')) {
                container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap').css({'box-shadow': 'unset'});
            } else if (jQuery(this).hasClass('woo-sctr-countdown-template-7-value-cut-behind-check')) {
                container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top').addClass('woo-sctr-countdown-two-vertical-top-cut-default').removeClass('woo-sctr-countdown-two-vertical-top-cut-behind');
                let str = jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(),
                    id= container.data('accordion_id'),
                    color = jQuery('.woo-sctr-countdown-template-7-value-cut-color').val();
                let reg_str = '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind::after{box-shadow:[\\s\\S]*?;}';
                let reg = new RegExp(reg_str);
                let match = reg.exec(str), str1 = '';
                container.find('.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-default').css({'border-bottom': '1px solid ' + color});
                if (match) {
                    str = str.replace(match[0], str1);
                    jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
                }
            }
        }
    });
};
visctv_countdown_timer_init.prototype.color_picker = function (container) {
    /* countdown timer  layout 1*/
    container.on('change keyup','.woo-sctr-countdown-layout-1-color', function () {
        container.find('.woo-sctr-countdown-timer-layout.woo-sctr-layout-1,.woo-sctr-countdown-timer-layout.woo-sctr-layout-1 .woo-sctr-countdown-timer-text-wrap').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-layout-1-background', function () {
        container.find('.woo-sctr-countdown-timer-layout.woo-sctr-layout-1').css({'background': jQuery(this).val()});
        jQuery(this).parent().find('.color-picker').css({'background': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-layout-1-border-color', function () {
        if (jQuery(this).val() !== '') {
            container.find('.woo-sctr-countdown-timer-layout.woo-sctr-layout-1').css({'border': '1px solid ' + jQuery(this).val()});
        } else {
            container.find('.woo-sctr-countdown-timer-layout.woo-sctr-layout-1').css({'border': 'none'});
            jQuery(this).parent().find('.color-picker').css({'background': 'none'});
        }
    });

    /* template 1 */
    container.on('change keyup', '.woo-sctr-countdown-template-1-value-color',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-1-value-background', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value').css({'background': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-1-value-border-color',function () {
        if (jQuery(this).val() !== '') {
            container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'border': '1px solid ' + jQuery(this).val()});
        } else {
            container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'border': 'none'});
        }
    });
    container.on('change keyup','.woo-sctr-countdown-template-1-text-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-1-text-background', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-1 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'background': jQuery(this).val()});
    });

    /*template 2*/
    container.on('change keyup','.woo-sctr-countdown-template-2-item-border-color', function () {
        if (jQuery(this).val() !== '') {
            container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-unit ').css({'border': '1px solid ' + jQuery(this).val()});
        } else {
            container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-unit ').css({'border': 'none'});
        }
    });
    container.on('change keyup','.woo-sctr-countdown-template-2-item-value-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-2-item-value-background', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'background': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-2-item-time-unit-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-2-item-time-unit-background', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-2 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'background': jQuery(this).val()});
    });

    /*template 3*/
    container.on('change keyup','.woo-sctr-countdown-template-3-value-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-3 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-3-value-background', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-3 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'background': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-3-time-unit-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-3 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-3-time-unit-background', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-3 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'background': jQuery(this).val()});
    });

    /* template 4 */
    container.on('change keyup','.woo-sctr-countdown-template-4-value-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-4-value-border-color-1', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container').css({'background': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-4-value-border-color-2',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container.woo-sctr-over50 .woo-sctr-first50-bar').css({'background-color': jQuery(this).val()});
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container .woo-sctr-value-bar').css({'border-color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-4-value-background', function () {
        let str = jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(),
            id = container.data('accordion_id');
        let reg_str = '.woo-sctr-accordion-wrap-' + id + '  .woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container::after {background:[\\s\\S]*?;}';
        let reg = new RegExp(reg_str);
        let match = reg.exec(str);
        if (match) {
            str = str.replace(match[0], '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container::after {background:' + jQuery(this).val() + ';}');
        } else {
            str += '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-value-circle-container::after {background:' + jQuery(this).val() + ';}';
        }
        jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
    });
    container.on('change keyup','.woo-sctr-countdown-template-4-time-unit-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-4-time-unit-background',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-4 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'background': jQuery(this).val()});
    });

    /* template 5 */
    container.on('change keyup','.woo-sctr-countdown-template-5-value-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-value ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-5-time-unit-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-unit-wrap .woo-sctr-countdown-text ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-5-date-background', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-date .woo-sctr-countdown-circle ').css({'background': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-5-date-border-color1',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-date .woo-sctr-countdown-circle ').css({'border-color': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-5-date-border-color2',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-date .woo-sctr-value-bar ').css({'border-color': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-5-hour-background',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-hour .woo-sctr-countdown-circle ').css({'background': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-5-hour-border-color1', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-hour .woo-sctr-countdown-circle ').css({'border-color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-5-hour-border-color2', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-hour .woo-sctr-value-bar ').css({'border-color': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-5-minute-background', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-minute .woo-sctr-countdown-circle ').css({'background': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-5-minute-border-color1', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-minute .woo-sctr-countdown-circle ').css({'border-color': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-5-minute-border-color2',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-minute .woo-sctr-value-bar ,.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-minute.woo-sctr-over50 .woo-sctr-first50-bar ').css({'border-color': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-5-second-background',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-second .woo-sctr-countdown-circle ').css({'background': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-5-second-border-color1', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-second .woo-sctr-countdown-circle ').css({'border-color': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-countdown-template-5-second-border-color2',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-circle-container.woo-sctr-countdown-second .woo-sctr-value-bar,.woo-sctr-countdown-timer.woo-sctr-countdown-timer-5 .woo-sctr-countdown-second.woo-sctr-over50 .woo-sctr-first50-bar ').css({'border-color': jQuery(this).val()});
    });

    /* template 6 */
    container.on('change keyup', '.woo-sctr-countdown-template-6-value-color1',function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-6-value-background1', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top ').css({'background': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-6-value-color2', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-bottom ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-6-value-background2', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-bottom ').css({'background': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-6-value-cut-color', function () {
        let str = jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(),
            id= container.data('accordion_id'),
            color = jQuery(this).val();
        let reg_str = '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind::after{box-shadow:[\\s\\S]*?;}';
        let reg = new RegExp(reg_str);
        let match = reg.exec(str), str1;
        if (container.find('.woo-sctr-countdown-template-6-value-cut-behind-check').prop('checked')) {
            container.find('.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind').css({'border-bottom': 'unset'});
            str1 = '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind::after{box-shadow: inset 0px 1px 0px 0px ' + color + ';}';
        } else {
            str1 = '';
            container.find('.woo-sctr-countdown-timer-6 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-default').css({'border-bottom': '1px solid ' +color});
        }
        if (match) {
            str = str.replace(match[0], str1);
            jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
        } else if (str1) {
            jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str + str1);
        }
    });
    container.on('change keyup','.woo-sctr-countdown-template-6-time-unit-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-6 .woo-sctr-countdown-text ').css({'color': jQuery(this).val()});
    });

    /* template 7 */
    container.on('change keyup','.woo-sctr-countdown-template-7-value-color1', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-7-value-background1', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top ').css({'background': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-7-value-color2', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-bottom ').css({'color': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-7-value-background2', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-bottom ').css({'background': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-countdown-template-7-value-cut-color', function () {
        let str = jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(),
            id= container.data('accordion_id'),
            color = jQuery(this).val();
        let reg_str = '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind::after{box-shadow:[\\s\\S]*?;}';
        let reg = new RegExp(reg_str);
        let match = reg.exec(str), str1;
        if (container.find('.woo-sctr-countdown-template-7-value-cut-behind-check').prop('checked')) {
            container.find('.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind').css({'border-bottom': 'unset'});
            str1 = '.woo-sctr-accordion-wrap-' + id + ' .woo-sctr-countdown-timer-layout .woo-sctr-countdown-timer-wrap .woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-behind::after{box-shadow: 0px 1px 0px 0px ' + color + ';}';
        } else {
            str1 = '';
            container.find('.woo-sctr-countdown-timer-7 .woo-sctr-countdown-two-vertical-wrap .woo-sctr-countdown-two-vertical-top.woo-sctr-countdown-two-vertical-top-cut-default').css({'border-bottom': '1px solid ' + color});
        }
        if (match) {
            str = str.replace(match[0], str1);
            jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str);
        } else if (str1) {
            jQuery('#vi-sales-countdown-timer-admin-settings-inline-css').html(str + str1);
        }
    });
    container.on('change keyup','.woo-sctr-countdown-template-7-time-unit-color', function () {
        container.find('.woo-sctr-countdown-timer.woo-sctr-countdown-timer-7 .woo-sctr-countdown-text ').css({'color': jQuery(this).val()});
    });

    /* progress bar */
    container.on('change keyup','.woo-sctr-progress-bar-template-1-background', function () {
        container.find('.woo-sctr-progress-bar-wrap').css({'background': jQuery(this).val()});
    });
    container.on('change keyup', '.woo-sctr-progress-bar-template-1-color',function () {
        container.find('.woo-sctr-progress-bar-fill').css({'background': jQuery(this).val()});
    });
    container.on('change keyup','.woo-sctr-progress-bar-template-1-message-color', function () {
        container.find('.woo-sctr-progress-bar-message').css({'color': jQuery(this).val()});
    });
};
visctv_countdown_timer_init.prototype.dropdown = function (container) {
    container.find('.woo-sctr-sal-countdown-display-type').unbind().dropdown({
        onChange: function (val) {
            container.find('.woo-sctr-design-countdown-timer, .woo-sctr-countdown-timer-wrap').addClass('woo-sctr-countdown-hidden');
            container.find('.woo-sctr-design-countdown-timer.woo-sctr-design-countdown-timer-' + val + ', .woo-sctr-countdown-timer-wrap.woo-sctr-countdown-timer-wrap-' + val).removeClass('woo-sctr-countdown-hidden');
            if (jQuery.inArray(val, ['6', '7']) !== -1) {
                container.find('.woo-sctr-animation-style [data-value="flip"]').removeClass("disabled");
                container.find('.woo-sctr-animation-style option[value="flip"]').prop("disabled", false);
            } else {
                if (container.find('.woo-sctr-animation-style option[value="flip"]').prop('selected')) {
                    container.find('.woo-sctr-animation-style select').val('default').trigger('change');
                }
                container.find('.woo-sctr-animation-style [data-value="flip"]').removeClass('active selected').addClass("disabled");
            }
            if (jQuery.inArray(val, ['4', '5']) !== -1) {
                container.find('.woo-sctr-countdown-circle-smooth-animation-wrap').removeClass('woo-sctr-hidden');
            } else {
                container.find('.woo-sctr-countdown-circle-smooth-animation-wrap').addClass('woo-sctr-hidden');
            }
        }
    });
    container.find('.woo-sctr-message-position').unbind().dropdown({
        onChange: function (val) {
            if (val === 'inline_countdown') {
                container.find('.woo-sctr-countdown-timer-layout').addClass('woo-sctr-countdown-timer-layout-same-line');
            } else {
                container.find('.woo-sctr-countdown-timer-layout').removeClass('woo-sctr-countdown-timer-layout-same-line');
            }
        }
    });
    container.find('.woo-sctr-time-separator').unbind().dropdown({
        onChange: function (val) {
            switch (val) {
                case 'dot':
                    container.find('.woo-sctr-countdown-time-separator').html('.');
                    break;
                case 'comma':
                    container.find('.woo-sctr-countdown-time-separator').html(',');
                    break;
                case 'colon':
                    container.find('.woo-sctr-countdown-time-separator').html(':');
                    break;
                default:
                    container.find('.woo-sctr-countdown-time-separator').html('');
            }
        }
    });
    container.find('.woo-sctr-count-style').unbind().dropdown({
        onChange: function (val) {
            switch (val) {
                case '1':
                    container.find('.woo-sctr-countdown-date-text').html('days');
                    container.find('.woo-sctr-countdown-hour-text').html('hrs');
                    container.find('.woo-sctr-countdown-minute-text').html('mins');
                    container.find('.woo-sctr-countdown-second-text').html('secs');
                    container.find('.woo-sctr-datetime-format-style-custom').addClass('woo-sctr-hidden');
                    break;
                case '2':
                    container.find('.woo-sctr-countdown-date-text').html('days');
                    container.find('.woo-sctr-countdown-hour-text').html('hours');
                    container.find('.woo-sctr-countdown-minute-text').html('minutes');
                    container.find('.woo-sctr-countdown-second-text').html('seconds');
                    container.find('.woo-sctr-datetime-format-style-custom').addClass('woo-sctr-hidden');
                    break;
                case '3':
                    container.find('.woo-sctr-countdown-date-text').html('');
                    container.find('.woo-sctr-countdown-hour-text').html('');
                    container.find('.woo-sctr-countdown-minute-text').html('');
                    container.find('.woo-sctr-countdown-second-text').html('');
                    container.find('.woo-sctr-datetime-format-style-custom').addClass('woo-sctr-hidden');
                    break;
                case '#other':
                    container.find('.woo-sctr-datetime-format-style-custom').removeClass('woo-sctr-hidden');
                    container.find('.woo-sctr-countdown-date-text').html(container.find('.woo-sctr-datetime-format-custom-date').val());
                    container.find('.woo-sctr-countdown-hour-text').html(container.find('.woo-sctr-datetime-format-custom-hour').val());
                    container.find('.woo-sctr-countdown-minute-text').html(container.find('.woo-sctr-datetime-format-custom-minute').val());
                    container.find('.woo-sctr-countdown-second-text').html(container.find('.woo-sctr-datetime-format-custom-second').val());
                    break;
                default:
                    container.find('.woo-sctr-countdown-date-text').html('d');
                    container.find('.woo-sctr-countdown-hour-text').html('h');
                    container.find('.woo-sctr-countdown-minute-text').html('m');
                    container.find('.woo-sctr-countdown-second-text').html('s');
                    container.find('.woo-sctr-datetime-format-style-custom').addClass('woo-sctr-hidden');
            }
        }
    });
    container.find('.woo-sctr-time-units-display-select').unbind().dropdown({
        onChange: function (val) {
            let check_has_all = false;
            container.find('.woo-sctr-time-units-display').val(val);
            let count_unit_select = val.length;
            container.find('.woo-sctr-countdown-timer-wrap:not(.woo-sctr-countdown-timer-wrap-7)').each(function () {
                let countdown_template = jQuery(this).data('countdown_template'),
                    wrap_change = jQuery(this).find('.woo-sctr-countdown-timer');
                wrap_change.removeClass('woo-sctr-shortcode-countdown-count-unit-grid-one woo-sctr-shortcode-countdown-count-unit-grid-two woo-sctr-shortcode-countdown-count-unit-grid-three woo-sctr-shortcode-countdown-count-unit-grid-four');
                wrap_change.find('.woo-sctr-countdown-unit-wrap').removeClass('woo-sctr-countdown-unit-wrap-two');
                wrap_change.find('.woo-sctr-countdown-unit-wrap .woo-sctr-countdown-time-separator').addClass('woo-sctr-countdown-hidden');
                switch (count_unit_select) {
                    case 1:
                        wrap_change.addClass('woo-sctr-shortcode-countdown-count-unit-grid-one');
                        break;
                    case 2:
                        wrap_change.addClass('woo-sctr-shortcode-countdown-count-unit-grid-two');
                        break;
                    case 3:
                        wrap_change.addClass('woo-sctr-shortcode-countdown-count-unit-grid-three');
                        break;
                    default:
                        wrap_change.addClass(' woo-sctr-shortcode-countdown-count-unit-grid-four');
                        check_has_all = true;
                }
                if (count_unit_select !== 1) {
                    wrap_change.find('.woo-sctr-countdown-date-wrap').addClass('woo-sctr-countdown-unit-wrap-two');
                    wrap_change.find('.woo-sctr-countdown-date-wrap .woo-sctr-countdown-time-separator').removeClass('woo-sctr-countdown-hidden');
                    if (count_unit_select === 0 || jQuery.inArray('minute', val) !== -1 || jQuery.inArray('second', val) !== -1) {
                        wrap_change.find('.woo-sctr-countdown-hour-wrap').addClass('woo-sctr-countdown-unit-wrap-two');
                        wrap_change.find('.woo-sctr-countdown-hour-wrap .woo-sctr-countdown-time-separator').removeClass('woo-sctr-countdown-hidden');
                    }
                    if (count_unit_select === 0 || jQuery.inArray('second', val) !== -1) {
                        wrap_change.find('.woo-sctr-countdown-minute-wrap').addClass('woo-sctr-countdown-unit-wrap-two');
                        wrap_change.find('.woo-sctr-countdown-minute-wrap .woo-sctr-countdown-time-separator').removeClass('woo-sctr-countdown-hidden');
                    }
                }
                let date = 1, hour = 2, minute = 3, second = 4,
                    date_t, hour_t, minute_t, second_t;
                if (countdown_template === '5' || countdown_template === '4') {
                    minute = 30;
                    second = 40;
                }
                if (check_has_all) {
                    wrap_change.find('.woo-sctr-countdown-unit-wrap').removeClass('woo-sctr-countdown-hidden');
                } else {
                    if (val.indexOf('day') === -1) {
                        wrap_change.find('.woo-sctr-countdown-date-wrap').addClass('woo-sctr-countdown-hidden');
                        hour = date * 24 + 2;
                    } else {
                        wrap_change.find('.woo-sctr-countdown-date-wrap').removeClass('woo-sctr-countdown-hidden');
                    }

                    if (val.indexOf('hour') === -1) {
                        wrap_change.find('.woo-sctr-countdown-hour-wrap').addClass('woo-sctr-countdown-hidden');
                        minute = hour * 60 + 3;
                    } else {
                        wrap_change.find('.woo-sctr-countdown-hour-wrap').removeClass('woo-sctr-countdown-hidden');
                    }
                    if (val.indexOf('minute') === -1) {
                        wrap_change.find('.woo-sctr-countdown-minute-wrap').addClass('woo-sctr-countdown-hidden');
                        second = minute * 60 + 4;
                    } else {
                        wrap_change.find('.woo-sctr-countdown-minute-wrap').removeClass('woo-sctr-countdown-hidden');
                    }

                    if (val.indexOf('second') === -1) {
                        wrap_change.find('.woo-sctr-countdown-second-wrap').addClass('woo-sctr-countdown-hidden');
                    } else {
                        wrap_change.find('.woo-sctr-countdown-second-wrap').removeClass('woo-sctr-countdown-hidden');
                    }
                }
                date_t = date > 9 ? date : '0' + date;
                hour_t = hour > 9 ? hour : '0' + hour;
                minute_t = minute > 9 ? minute : '0' + minute;
                second_t = second > 9 ? second : '0' + second;
                switch (countdown_template) {
                    case 6:
                        wrap_change.find('.woo-sctr-countdown-date-value.woo-sctr-countdown-two-vertical-top').attr('data-value', date_t);
                        wrap_change.find('.woo-sctr-countdown-date-value.woo-sctr-countdown-two-vertical-bottom').html(date_t);
                        wrap_change.find('.woo-sctr-countdown-hour-value.woo-sctr-countdown-two-vertical-top').attr('data-value', hour_t);
                        wrap_change.find('.woo-sctr-countdown-hour-value.woo-sctr-countdown-two-vertical-bottom').html(hour_t);
                        wrap_change.find('.woo-sctr-countdown-minute-value.woo-sctr-countdown-two-vertical-top').attr('data-value', minute_t);
                        wrap_change.find('.woo-sctr-countdown-minute-value.woo-sctr-countdown-two-vertical-bottom').html(minute_t);
                        wrap_change.find('.woo-sctr-countdown-second-value.woo-sctr-countdown-two-vertical-top').attr('data-value', second_t);
                        wrap_change.find('.woo-sctr-countdown-second-value.woo-sctr-countdown-two-vertical-bottom').html(second_t);
                        break;
                    default:
                        wrap_change.find('.woo-sctr-countdown-date-value').html(date_t);
                        wrap_change.find('.woo-sctr-countdown-hour-value').html(hour_t);
                        wrap_change.find('.woo-sctr-countdown-minute-value').html(minute_t);
                        wrap_change.find('.woo-sctr-countdown-second-value').html(second_t);
                }
            });
        }
    });
    let has_time_unit = [1,2,4,6,7];
    jQuery.each(has_time_unit, function (k, v) {
        container.find('.woo-sctr-countdown-template-'+v+'-time-unit-position').unbind().dropdown({
            onChange: function (val) {
                if (val === 'top') {
                    if (v===2){
                        container.find('.woo-sctr-countdown-timer-2  .woo-sctr-countdown-unit').css({'grid-template-rows': '35% 65%'});
                    }
                    container.find('.woo-sctr-countdown-timer-'+v+' .woo-sctr-datetime-format-position-top').removeClass('woo-sctr-countdown-hidden');
                    container.find('.woo-sctr-countdown-timer-'+v+' .woo-sctr-datetime-format-position-bottom').addClass('woo-sctr-countdown-hidden');
                } else {
                    container.find('.woo-sctr-countdown-timer-'+v+' .woo-sctr-datetime-format-position-top').addClass('woo-sctr-countdown-hidden');
                    container.find('.woo-sctr-countdown-timer-'+v+' .woo-sctr-datetime-format-position-bottom').removeClass('woo-sctr-countdown-hidden');
                    if (v===2){
                        container.find('.woo-sctr-countdown-timer-2  .woo-sctr-countdown-unit').css({'grid-template-rows': '65% 35%'});
                    }
                }

            }
        });
    });
    container.find('.woo-sctr-progress-bar-order-status-select').dropdown({
        onChange: function (val) {
            container.find('.woo-sctr-progress-bar-order-status').val(val);
        }
    });
    container.find('.woo-sctr-progress-bar-message-position').dropdown({
        onChange: function (val) {
            container.find('.woo-sctr-progress-bar-message').addClass('woo-sctr-progress-bar-hidden');
            container.find('.woo-sctr-progress-bar-wrap-container').removeClass('woo-sctr-progress-bar-wrap-inline');
            switch (val) {
                case 'above_progressbar':
                    container.find('.woo-sctr-progress-bar-message-above').removeClass('woo-sctr-progress-bar-hidden');
                    break;
                case 'below_progressbar':
                    container.find('.woo-sctr-progress-bar-message-below').removeClass('woo-sctr-progress-bar-hidden');
                    break;
                case 'in_progressbar':
                    container.find('.woo-sctr-progress-bar-message-in').removeClass('woo-sctr-progress-bar-hidden');
                    break;
                case 'left_progressbar':
                    container.find('.woo-sctr-progress-bar-wrap-container').addClass('woo-sctr-progress-bar-wrap-inline');
                    container.find('.woo-sctr-progress-bar-message-above').removeClass('woo-sctr-progress-bar-hidden');
                    break;
                default:
                    container.find('.woo-sctr-progress-bar-wrap-container').addClass('woo-sctr-progress-bar-wrap-inline');
                    container.find('.woo-sctr-progress-bar-message-below').removeClass('woo-sctr-progress-bar-hidden');
            }
        }
    });
    container.find('.woo-sctr-progress-bar-type').dropdown({
        onChange: function (val) {
            if (val === 'increase') {
                container.find('.woo-sctr-progress-bar-fill').css('width', '20%');
            } else {
                container.find('.woo-sctr-progress-bar-fill').css('width', '80%');
            }
        }
    });
    container.find('.woo-sctr-progress-bar-template-1-width-type').dropdown({
        onChange: function (val) {
            let width = container.find('.woo-sctr-progress-bar-template-1-width').val();
            if (parseInt(width) > 0) {
                width = width + val;
            } else {
                width = '100%';
            }
            container.find('.woo-sctr-progress-bar-wrap').css({'width': width});
        }
    });
};
visctv_countdown_timer_init.prototype.copy_shortcode = function (rule) {
    rule.on('click', '.woo-sctr-short-description-copy-shortcode:not(.woo-sctr-short-description-copy-shortcode-loading)', function (e) {
        jQuery(this).addClass('woo-sctr-short-description-copy-shortcode-loading');
        let val = '[sales_countdown_timer id="' + rule.find('.woo-sctr-id').val() + '"]',
            $temp = jQuery("<input>");
        jQuery("body").append($temp);
        $temp.val(val).select();
        document.execCommand("copy");
        $temp.remove();
        rule.find('.woo-sctr-shortcode-copied').removeClass('woo-sctr-countdown-hidden');
        setTimeout(function (rule) {
            rule.find('.woo-sctr-shortcode-copied').addClass('woo-sctr-countdown-hidden');
        }, 5000, rule);
        jQuery(this).removeClass('woo-sctr-short-description-copy-shortcode-loading');
        e.stopPropagation();
    });
};