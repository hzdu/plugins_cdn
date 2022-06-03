
jQuery(document).ready(function () {
    'use strict';
    init_tab();
    function init_tab(tab_default = 'general') {
        jQuery('.vi-ui.vi-ui-main.tabular.menu .item').vi_tab({
            history: true,
            historyType: 'hash'
        });
        /*Setup tab*/
        let tabs,
            tabEvent = false,
            initialTab = tab_default,
            navSelector = '.vi-ui.vi-ui-main.menu';
        // Initializes plugin features
        jQuery.address.strict(false).wrap(true);

        if (jQuery.address.value() == '') {
            jQuery.address.history(false).value(initialTab).history(true);
        }
        // Address handler
        jQuery.address.init(function (event) {

            // Tabs setup
            tabs = jQuery('.vi-ui.vi-ui-main.menu')
                .vi_tab({
                    history: true,
                    historyType: 'hash'
                });

            // Enables the plugin for all the tabs
            jQuery(navSelector + ' a').on('click', function (event) {
                tabEvent = true;
                tabEvent = false;
                return true;
            });

        });
    }
    init_general();
    function init_general() {
        jQuery('.vi-ui.dropdown:not(.woo-sctr-dropdown-init)').addClass('woo-sctr-dropdown-init').dropdown();
        jQuery('.vi-ui.checkbox:not(.woo-sctr-checkbox-init)').addClass('woo-sctr-checkbox-init').checkbox();
        jQuery('.color-picker:not(.woo-sctr-color-picker-init)').addClass('woo-sctr-color-picker-init').each(function () {
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
        jQuery('body').on('click', function () {
            jQuery('.iris-picker').hide();
        });
        jQuery(document.body).on('change','input[type="checkbox"]', function () {
            if (jQuery(this).prop('checked')) {
                jQuery(this).val('1');
                jQuery(this).parent().find('input[type="hidden"]').val('1');
                if (jQuery(this).hasClass('woo-stcr-checkout-test-mode-enable')) {
                    jQuery('.woo-stcr-checkout-test-mode-reset').removeClass('disabled');
                }
            } else {
                jQuery(this).val('');
                jQuery(this).parent().find('input[type="hidden"]').val('');
                if (jQuery(this).hasClass('woo-stcr-checkout-test-mode-enable')) {
                    jQuery('.woo-stcr-checkout-test-mode-reset').addClass('disabled');
                }
            }
        });
        jQuery('.woo-stcr-checkout-countdown-discount-type').dropdown({
            onChange: function (val) {
                if (val === 'none') {
                    jQuery('#woo-stcr-checkout-countdown-discount-amount').removeAttr('required').addClass('woo-sctr-hidden');
                    if (jQuery('#woo-stcr-checkout-countdown-change').val() === 'auto_change') {
                        jQuery('#woo-stcr-checkout-countdown-change').val('none').trigger('change');
                    }
                } else {
                    jQuery('#woo-stcr-checkout-countdown-discount-amount').attr('required', 'required').removeClass('woo-sctr-hidden');
                    if (jQuery('#woo-stcr-checkout-countdown-change').val() === 'auto_change') {
                        jQuery('.woo-stcr-checkout-countdown-change-auto-change-warning').addClass('woo-sctr-hidden');
                        jQuery('.woo-stcr-checkout-countdown-change-auto-change').removeClass('woo-sctr-hidden');
                        jQuery('#woo-stcr-checkout-countdown-change-auto-change-detail-value , #woo-stcr-checkout-countdown-change-auto-change-time').attr('required', 'required');
                    }
                }
            }
        });
        jQuery('.woo-stcr-checkout-countdown-change').dropdown({
            onChange: function (val) {
                jQuery('.woo-stcr-checkout-countdown-change-wrap').addClass('woo-sctr-hidden');
                jQuery('#woo-stcr-checkout-countdown-change-auto-change-detail-value , #woo-stcr-checkout-countdown-change-auto-change-time').removeAttr('required');
                switch (val) {
                    case 'auto_change':
                        if (jQuery('#woo-stcr-checkout-countdown-discount-type').val() === 'none') {
                            jQuery('.woo-stcr-checkout-countdown-change-auto-change-warning').removeClass('woo-sctr-hidden');
                            return false;
                        }
                        jQuery('.woo-stcr-checkout-countdown-change-auto-change-warning').addClass('woo-sctr-hidden');
                        jQuery('.woo-stcr-checkout-countdown-change-auto-change').removeClass('woo-sctr-hidden');
                        jQuery('#woo-stcr-checkout-countdown-change-auto-change-detail-value , #woo-stcr-checkout-countdown-change-auto-change-time').attr('required', 'required');
                        break;
                    case 'custom':
                        jQuery('.woo-stcr-checkout-countdown-change-wrap.woo-stcr-checkout-countdown-change-custom').removeClass('woo-sctr-hidden');
                        break;
                    default:
                }
            }
        });
        jQuery('.woo-stcr-checkout-countdown-change-auto-change-time-type').dropdown({
            onChange: function (val) {
                jQuery('#woo-stcr-checkout-countdown-change-auto-change-time').val(null);
                if (val === 'minute') {
                    jQuery('#woo-stcr-checkout-countdown-change-auto-change-time').attr('min', 1);
                } else {
                    jQuery('#woo-stcr-checkout-countdown-change-auto-change-time').attr('min', 15);
                }
            }
        });
        jQuery('#woo-stcr-checkout-countdown-change-auto-change-time').unbind().on('change',function () {
            let div_parent = jQuery(this).parent().parent();
            div_parent.find('.wotv-error-auto-change-time').addClass('woo-sctr-hidden');
            if (!jQuery(this).val()) {
                div_parent.find('.wotv-error-auto-change-time-no-value').removeClass('woo-sctr-hidden');
                return false;
            }
            let min_time, max_time, current_time_t,
                current_time = parseInt(jQuery(this).val()),
                minute_default = jQuery('#woo-stcr-checkout-countdown-time-minute').val() ? parseInt(jQuery('#woo-stcr-checkout-countdown-time-minute').val()) : 0,
                second_default = jQuery('#woo-stcr-checkout-countdown-time-second').val() ? parseInt(jQuery('#woo-stcr-checkout-countdown-time-second').val()) : 0,
                auto_change_type = jQuery('#woo-stcr-checkout-countdown-change-auto-change-time-type').val();
            max_time = minute_default * 60 + second_default;
            if (max_time === 0) {
                jQuery('.woo-stcr-checkout-countdown-time-warning').removeClass('woo-sctr-hidden');
                return false;
            } else {
                jQuery('.woo-stcr-checkout-countdown-time-warning').addClass('woo-sctr-hidden');
            }
            if (auto_change_type === 'minute') {
                min_time = 1;
                current_time_t = current_time * 60;
            } else {
                min_time = 15;
                current_time_t = current_time;
            }
            if (current_time < min_time) {
                jQuery(this).val(min_time);
                div_parent.find('.wotv-error-auto-change-time-minimum-second').removeClass('woo-sctr-hidden');
                return false;
            }
            if (current_time_t >= max_time) {
                jQuery(this).val(null);
                div_parent.find('.wotv-error-auto-change-time-over-time').removeClass('woo-sctr-hidden');
                return false;
            }
        });
        jQuery(document.body).on('keyup','.woo-sctr-message-checkout-countdown-timer', function () {
            let message = jQuery(this).val();
            let check_countdown = message.split('{countdown_timer}');
            if (check_countdown.length < 2) {
                jQuery(this).parent().find('.woo-sctr-warning-message-checkout-countdown-timer').removeClass('woo-sctr-hidden');
            } else {
                jQuery(this).parent().find('.woo-sctr-warning-message-checkout-countdown-timer').addClass('woo-sctr-hidden');
            }
        });
        jQuery(document.body).on('change', '#woo-stcr-checkout-countdown-reset', function () {
            let val = jQuery(this).val();
            if (!val) {
                jQuery(this).val(30);
            }
        });
        jQuery('.woo-stcr-checkout-countdown-display-on-page').dropdown({
            onChange: function (val) {
                if (jQuery.inArray('assign', val) !== -1) {
                    jQuery('.woo-stcr-checkout-countdown-assign-page').removeClass('woo-sctr-hidden');
                } else {
                    jQuery('.woo-stcr-checkout-countdown-assign-page').addClass('woo-sctr-hidden');
                }
            }
        });
        jQuery(document.body).on('click','.woo-stcr-checkout-test-mode-reset', function (e) {
            if (!jQuery('#woo-stcr-checkout-test-mode-enable').prop('checked') || jQuery(this).hasClass('loading')) {
                return false;
            }
            jQuery.ajax({
                type: 'POST',
                url: 'admin-ajax.php?action=sctv_test_mode_reset',
                beforeSend: function () {
                    jQuery('.woo-stcr-checkout-test-mode-reset').addClass('loading');
                    jQuery('.woo-stcr-checkout-test-mode-message').remove();
                },
                success: function (response) {
                    if (response.status === 'success') {
                        jQuery('.woo-stcr-checkout-test-mode-reset').after('<span class="description woo-stcr-checkout-test-mode-message" style="color: green;">' + response.message + '</span>');
                    } else {
                        jQuery('.woo-stcr-checkout-test-mode-reset').after('<span class="description woo-stcr-checkout-test-mode-message" style="color: red;">' + response.message + '</span>');
                    }
                    setTimeout(function () {
                        jQuery('.woo-stcr-checkout-test-mode-message').remove();
                    }, 3000);
                },
                error: function (err) {
                    console.log(JSON.stringify(err));
                },
                complete: function () {
                    jQuery('.woo-stcr-checkout-test-mode-reset').removeClass('loading');
                }
            });
            e.stopPropagation();
        });
        jQuery(document.body).on('click','.woo-ctr-settings-checkout-page-btnsave', function () {
            jQuery('.woo-stcr-checkout-countdown-warning').addClass('woo-sctr-hidden');
            let minute_default = jQuery('#woo-stcr-checkout-countdown-time-minute').val() ? parseInt(jQuery('#woo-stcr-checkout-countdown-time-minute').val()) : 0,
                second_default = jQuery('#woo-stcr-checkout-countdown-time-second').val() ? parseInt(jQuery('#woo-stcr-checkout-countdown-time-second').val()) : 0;
            if (minute_default === 0 && second_default === 0) {
                jQuery('.woo-stcr-checkout-countdown-time-warning').removeClass('woo-sctr-hidden');
                return false;
            }
            if (!jQuery('#woo-stcr-checkout-countdown-free-ship').prop('checked') && jQuery('#woo-stcr-checkout-countdown-discount-type').val() === 'none') {
                jQuery('.woo-stcr-checkout-offer-warning').removeClass('woo-sctr-hidden');
                return false;
            }
            jQuery(this).attr('type', 'submit');
        });
        jQuery(document.body).on('change','.woo-stcr-checkout-countdown-time-second-class', function () {
            let check_second = jQuery(this).val() ? parseInt(jQuery(this).val()):'';
            if (!check_second || check_second < 0) {
                jQuery(this).val(0);
            } else if (check_second > 59) {
                jQuery(this).val(59);
            }
        });
        jQuery('.woo-stcr-checkout-countdown-change-custom-wrap:not(.woo-stcr-checkout-countdown-change-custom-wrap-init)').each(function () {
            visctv_checkout_change_custom(jQuery(this));
        });
    }
    function visctv_checkout_change_custom(rule) {
        rule.addClass('woo-stcr-checkout-countdown-change-custom-wrap-init').villatheme_accordion('refresh');
        rule.find('.vi-ui.checkbox:not(.woo-sctr-checkbox-init)').addClass('woo-sctr-checkbox-init').checkbox();
        rule.find('.woo-stcr-checkout-countdown-change-custom input[type ="number"]').on('change',function () {
            if (!jQuery(this).val()) {
                jQuery(this).val(0);
            }
        });
        rule.on('keyup','.woo-stcr-checkout-countdown-decrease-custom-message',function () {
            let message_custom = jQuery(this).val();
            if (message_custom.indexOf('{countdown_timer}') === -1) {
                jQuery(this).parent().find('.woo-sctr-warning-message-checkout-countdown-timer').removeClass('woo-sctr-hidden');
            } else {
                jQuery(this).parent().find('.woo-sctr-warning-message-checkout-countdown-timer').addClass('woo-sctr-hidden');
            }
        });
        rule.on('change','.woo-stcr-checkout-countdown-decrease-custom-minute',function () {
            let minute, minute_check;
            minute = parseInt(jQuery(this).val());
            minute_check = parseInt(jQuery('#woo-stcr-checkout-countdown-time-minute').val());
            if (!minute) {
                minute = 0;
            } else if (minute < 0) {
                minute = 0;
            } else if (minute >= minute_check) {
                minute = minute_check - 1;
            }
            jQuery(this).val(minute);
        });
        rule.on('click','.woo-sctr-button-edit-duplicate', function (e) {
            e.stopPropagation();
            let new_id = jQuery('.woo-stcr-checkout-countdown-change-custom-wrap').length;
            let current_minute = parseInt(rule.find('.woo-stcr-checkout-countdown-decrease-custom-minute').val());
            let newRow = rule.clone();
            var $now = Date.now();
            newRow.removeClass('woo-stcr-checkout-countdown-change-custom-wrap-init').find('.woo-stcr-checkout-countdown-decrease-custom-ids').val($now);
            newRow.attr('data-custom_id', new_id);
            newRow.find('.vi-ui.checkbox').unbind().checkbox();
            newRow.find('.woo-stcr-checkout-countdown-decrease-custom-id').html(new_id + 1);
            newRow.find('.woo-stcr-checkout-countdown-decrease-custom-minute').val(current_minute - 1 > 0 ? current_minute - 1 : 0);
            jQuery('.woo-stcr-checkout-countdown-change-custom-wrap-wrap').append(newRow);
            visctv_checkout_change_custom(jQuery('.woo-stcr-checkout-countdown-change-custom-wrap:not(.woo-stcr-checkout-countdown-change-custom-wrap-init)'));
        });
        rule.on('click','.woo-sctr-button-edit-remove', function (e) {
            if (jQuery('.woo-sctr-button-edit-remove').length === 1) {
                alert('You can not remove the last item.');
                return false;
            }
            if (confirm("Would you want to remove this?")) {
                rule.remove();
            }
            e.stopPropagation();
        });
    }

});