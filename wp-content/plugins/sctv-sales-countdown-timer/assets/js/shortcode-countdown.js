let vi_sctr_x = {}, visctr_ajax = [];
jQuery(document).ready(function () {
    'use strict';
    sctv_run_countdown();
    if (jQuery('body').find('form.variations_form').length) {
        jQuery('body').find('form.variations_form').on("show_variation", function (event, variation) {
            if (jQuery('.woo-sctr-single-product-container').length) {
                jQuery('.woo-sctr-single-product-container').addClass('woo-sctr-countdown-hidden');
            }
            sctv_run_countdown();
        }).on('hide_variation', function () {
            if (jQuery('.woo-sctr-single-product-container.woo-sctr-countdown-hidden').length) {
                jQuery('.woo-sctr-single-product-container').removeClass('woo-sctr-countdown-hidden');
            }
        });
    }
    sctv_fixed();
});
//compatibale vs Elementor
jQuery(window).on('elementor/frontend/init', function () {
    'use strict';
    if (window.elementor) {
        elementorFrontend.hooks.addAction('frontend/element_ready/sales-countdown-timer.default', function () {
            sctv_run_countdown();
        });
    }
});

function sctv_fixed() {
    //infiniteScroll
    jQuery(document).on('append.infiniteScroll', function (event, response, path, items) {
        sctv_run_countdown();
    });
    //ajaxComplete
    jQuery(document).on('ajaxComplete', function (event, jqxhr, settings) {
        sctv_run_countdown();
        return false;
    });
}

function sctv_run_countdown() {
    jQuery(document.body).find('.woo-sctr-progress-bar-fill:not(.woo-sctr-progress-bar-fill-init)').each(function (k, div) {
        jQuery(div).addClass('woo-sctr-progress-bar-fill-init').css({width: (parseFloat(jQuery(div).attr('data-width')) + '%')});
    });
    jQuery('.woo-sctr-value-bar:not(.woo-sctr-value-bar-init)').each(function () {
        jQuery(this).addClass('woo-sctr-value-bar-init').css({'transform': 'rotate(' + jQuery(this).data('deg') + 'deg)'});
    });
    jQuery('.woo-sctr-shortcode-countdown-timer-wrap:not(.woo-sctr-shortcode-countdown-timer-wrap-init)').each(function (i, countdown_wrap) {
        countdown_wrap = jQuery(countdown_wrap);
        countdown_wrap.addClass('woo-sctr-shortcode-countdown-timer-wrap-init');
        let id = countdown_wrap.attr('data-countdown_id');
        if (!id) {
            id = Date.now() + '-' + i;
            countdown_wrap.attr('data-countdown_id', id);
        }
        let time_expire = vi_sctv_get_countdown_time(countdown_wrap.find('.woo-sctr-countdown-end-time'));
        vi_sctv_design_countdown(time_expire, countdown_wrap, id);
    });
}

function vi_sctv_run_countdown(time_expire, countdown_wrap, id) {
    if (!time_expire || !countdown_wrap || !id) {
        return false;
    }
    // Update the countdown every 1 second
    let date, hours, minutes, seconds;
    let dates_deg, hours_deg, minutes_deg, seconds_deg;
    countdown_wrap = jQuery(countdown_wrap);
    countdown_wrap.removeClass('woo-sctr-countdown-hidden');
    countdown_wrap.closest('.woo-sctr-checkout-countdown-wrap-wrap').removeClass('woo-sctr-countdown-hidden');
    clearInterval(vi_sctr_x[id]);
    vi_sctr_x[id] = setInterval(function () {
        let container = jQuery(countdown_wrap).find('.woo-sctr-countdown-timer'),
            date_container = container.find('.woo-sctr-countdown-date-wrap'),
            hour_container = container.find('.woo-sctr-countdown-hour-wrap'),
            minute_container = container.find('.woo-sctr-countdown-minute-wrap'),
            second_container = container.find('.woo-sctr-countdown-second-wrap');
        date = Math.floor(time_expire / 86400);
        hours = Math.floor((time_expire % 86400) / 3600);
        minutes = Math.floor((time_expire % 3600) / 60);
        seconds = Math.floor(time_expire % 60);
        if (date === 0) {
            date_container.addClass('woo-sctr-countdown-hidden');
            if (hours === 0) {
                hour_container.addClass('woo-sctr-countdown-hidden');
            }
        }
        if (container.hasClass('woo-sctr-countdown-timer-7')) {
            sctv_countdown_two(container, date_container, hour_container, minute_container, second_container, date, hours, minutes, seconds);
        } else {
            if (date_container.hasClass('woo-sctr-countdown-hidden') && date > 0) {
                hours += date * 24;
            }
            if (hour_container.hasClass('woo-sctr-countdown-hidden') && hours > 0) {
                minutes += hours * 60;
            }
            if (minute_container.hasClass('woo-sctr-countdown-hidden') && minutes > 0) {
                seconds += minutes * 60;
            }
            if (container.hasClass('woo-sctr-countdown-timer-6')) {
                sctv_countdown_three(container, date_container, hour_container, minute_container, second_container, date, hours, minutes, seconds);
            } else {
                sctv_countdown_one(container, date_container, hour_container, minute_container, second_container, date, hours, minutes, seconds, seconds_deg, minutes_deg, hours_deg, dates_deg);
            }
        }
        time_expire--;
        if (time_expire < 0) {
            clearInterval(vi_sctr_x[id]);
            let time_expire_t = vi_sctv_get_countdown_time(countdown_wrap.find('.woo-sctr-countdown-end-time'));
            vi_sctv_design_countdown(time_expire_t, countdown_wrap, id);
        }
    }, 1000, countdown_wrap, time_expire);
}

function vi_sctv_design_countdown(time_expire, countdown_wrap, id) {
    if (!countdown_wrap || !id) {
        return false;
    }
    countdown_wrap = jQuery(countdown_wrap);
    if (countdown_wrap.hasClass('woo-sctr-shortcode-countdown-timer-wrap-changing')) {
        time_expire = vi_sctv_set_countdown(time_expire, countdown_wrap);
    }
    if (time_expire === 0) {
        if (countdown_wrap.hasClass('woo-sctr-shortcode-countdown-timer-wrap-type-product') ) {
            if (!visctv_param.has_cache) {
                vi_sctv_reload();
            } else {
                let countdown_data_change = countdown_wrap.find('.woo-sctr-countdown-end-time').data('countdown_data_change') || '';
                if (parseInt(countdown_data_change.product_id || 0)) {
                    visctr_ajax.push({
                        url: visctv_param.ajax_url,
                        data: {
                            action: 'visctr_doing_cron',
                            remove_sale: countdown_data_change.remove_sale,
                            product_id: countdown_data_change.product_id,
                        },
                        type: 'post',
                        success: function (response) {
                            visctr_ajax.shift();
                            if (visctr_ajax.length > 0 && response.cron) {
                                jQuery.ajax(visctr_ajax[0]);
                            } else {
                                vi_sctv_reload();
                            }
                        },
                        error: function () {
                            vi_sctv_reload();
                        }
                    });
                    if (visctr_ajax.length === 1) {
                        jQuery.ajax(visctr_ajax[0]);
                    }
                } else if (!visctr_ajax.length) {
                    vi_sctv_reload();
                }
            }
        }
        countdown_wrap.addClass('woo-sctr-countdown-hidden');
        countdown_wrap.closest('.woo-sctr-checkout-countdown-wrap-wrap').addClass('woo-sctr-countdown-hidden');
        return false;
    }
    if (time_expire < 0) {
        countdown_wrap.addClass('woo-sctr-countdown-hidden');
        countdown_wrap.closest('.woo-sctr-checkout-countdown-wrap-wrap').addClass('woo-sctr-countdown-hidden');
        setTimeout(function () {
            let time_expire_t = vi_sctv_get_countdown_time(countdown_wrap.find('.woo-sctr-countdown-end-time'));
            vi_sctv_design_countdown(time_expire_t, countdown_wrap, id);
            if (time_expire_t > 0) {
                vi_sctv_run_countdown(time_expire_t, countdown_wrap, id);
            }
        }, time_expire * (-1), countdown_wrap, id);
    } else {
        let variation_date = Math.floor(time_expire / 86400),
            variation_hours = Math.floor((time_expire % (86400)) / (3600)),
            variation_minutes = Math.floor((time_expire % (3600)) / (60)),
            variation_seconds = Math.floor((time_expire % (60))),
            variation_date_t, variation_hours_t, variation_minutes_t, variation_seconds_t,
            variation_date_deg, variation_hours_deg, variation_minutes_deg, variation_seconds_deg,
            variation_container = jQuery(this).parent().find('.woo-sctr-countdown-timer'),
            variation_date_container = variation_container.find('.woo-sctr-countdown-date-wrap'),
            variation_hour_container = variation_container.find('.woo-sctr-countdown-hour-wrap'),
            variation_minute_container = variation_container.find('.woo-sctr-countdown-minute-wrap'),
            variation_second_container = variation_container.find('.woo-sctr-countdown-second-wrap');
        variation_date_t = variation_date < 10 ? ("0" + variation_date).slice(-2) : variation_date.toString();
        variation_hours_t = variation_hours < 10 ? ("0" + variation_hours).slice(-2) : variation_hours.toString();
        variation_minutes_t = variation_minutes < 10 ? ("0" + variation_minutes).slice(-2) : variation_minutes.toString();
        variation_seconds_t = variation_seconds < 10 ? ("0" + variation_seconds).slice(-2) : variation_seconds.toString();
        if (!variation_container.hasClass('woo-sctr-countdown-timer-7')) {
            if (variation_container.hasClass('woo-sctr-countdown-timer-circle')) {
                variation_seconds_deg = (variation_seconds > 0 ? variation_seconds : 59) * 6;
                if (variation_seconds_deg < 180) {
                    variation_second_container.find('.woo-sctr-countdown-value-circle-container').removeClass('woo-sctr-over50');
                    variation_second_container.find('.woo-sctr-countdown-circle-container').removeClass('woo-sctr-over50');
                    variation_second_container.find('.woo-sctr-first50-bar').addClass('woo-sctr-countdown-hidden');
                } else {
                    variation_second_container.find('.woo-sctr-countdown-value-circle-container').addClass('woo-sctr-over50');
                    variation_second_container.find('.woo-sctr-countdown-circle-container').addClass('woo-sctr-over50');
                    variation_second_container.find('.woo-sctr-first50-bar').removeClass('woo-sctr-countdown-hidden');
                }
                variation_second_container.find('.woo-sctr-value-bar').css({'transform': 'rotate(' + variation_seconds_deg + 'deg)'});
                variation_minutes_deg = (variation_minutes > 0 ? (variation_minutes - 1) : 59) * 6;
                if (variation_minutes_deg < 180) {
                    variation_minute_container.find('.woo-sctr-countdown-value-circle-container').removeClass('woo-sctr-over50');
                    variation_minute_container.find('.woo-sctr-countdown-circle-container').removeClass('woo-sctr-over50');
                    variation_minute_container.find('.woo-sctr-first50-bar').addClass('woo-sctr-countdown-hidden');
                } else {
                    variation_minute_container.find('.woo-sctr-countdown-value-circle-container').addClass('woo-sctr-over50');
                    variation_minute_container.find('.woo-sctr-countdown-circle-container').addClass('woo-sctr-over50');
                    variation_minute_container.find('.woo-sctr-first50-bar').removeClass('woo-sctr-countdown-hidden');
                }
                variation_minute_container.find('.woo-sctr-value-bar').css({'transform': 'rotate(' + variation_minutes_deg + 'deg)'});
                variation_hours_deg = (variation_hours > 0 ? (variation_hours - 1) : 23) * 15;
                if (variation_hours_deg < 180) {
                    variation_hour_container.find('.woo-sctr-countdown-value-circle-container').removeClass('woo-sctr-over50');
                    variation_hour_container.find('.woo-sctr-countdown-circle-container').removeClass('woo-sctr-over50');
                    variation_hour_container.find('.woo-sctr-first50-bar').addClass('woo-sctr-countdown-hidden');
                } else {
                    variation_hour_container.find('.woo-sctr-countdown-value-circle-container').addClass('woo-sctr-over50');
                    variation_hour_container.find('.woo-sctr-countdown-circle-container').addClass('woo-sctr-over50');
                    variation_hour_container.find('.woo-sctr-first50-bar').removeClass('woo-sctr-countdown-hidden');
                }
                variation_hour_container.find('.woo-sctr-value-bar').css({'transform': 'rotate(' + variation_hours_deg + 'deg)'});
                variation_date_deg = variation_date > 0 ? (variation_date - 1) : 0;
                if (variation_date_deg < 180) {
                    variation_date_container.find('.woo-sctr-countdown-value-circle-container').removeClass('woo-sctr-over50');
                    variation_date_container.find('.woo-sctr-countdown-circle-container').removeClass('woo-sctr-over50');
                    variation_date_container.find('.woo-sctr-first50-bar').addClass('woo-sctr-countdown-hidden');
                } else {
                    variation_date_container.find('.woo-sctr-countdown-value-circle-container').addClass('woo-sctr-over50');
                    variation_date_container.find('.woo-sctr-countdown-circle-container').addClass('woo-sctr-over50');
                    variation_date_container.find('.woo-sctr-first50-bar').removeClass('woo-sctr-countdown-hidden');
                }
                variation_date_container.find('.woo-sctr-value-bar').css({'transform': 'rotate(' + variation_date_deg + 'deg)'});
            }
            if (variation_container.hasClass('woo-sctr-shortcode-countdown-unit-animation-default')) {
                if (variation_container.hasClass('woo-sctr-countdown-timer-6')) {
                    variation_second_container.find('.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_seconds_t);
                    variation_second_container.find('.woo-sctr-countdown-two-vertical-bottom').html(variation_seconds_t);

                    variation_minute_container.find('.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_minutes_t);
                    variation_minute_container.find('.woo-sctr-countdown-two-vertical-bottom').html(variation_minutes_t);

                    variation_hour_container.find('.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_hours_t);
                    variation_hour_container.find('.woo-sctr-countdown-two-vertical-bottom').html(variation_hours_t);

                    variation_date_container.find('.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_date_t);
                    variation_date_container.find('.woo-sctr-countdown-two-vertical-bottom').html(variation_date_t);
                } else {
                    variation_second_container.find('.woo-sctr-countdown-second-value').html(variation_seconds_t);
                    variation_minute_container.find('.woo-sctr-countdown-minute-value').html(variation_minutes_t);
                    variation_hour_container.find('.woo-sctr-countdown-hour-value').html(variation_hours_t);
                    variation_date_container.find('.woo-sctr-countdown-date-value').html(variation_date_t);
                }
            } else if (variation_container.hasClass('woo-sctr-shortcode-countdown-unit-animation-slide')) {
                let variation_date_2, variation_hours_2, variation_minutes_2, variation_seconds_2,
                    variation_date_2_t, variation_hours_2_t, variation_minutes_2_t, variation_seconds_2_t;
                variation_date_2 = (variation_date > 0) ? variation_date - 1 : 0;
                variation_hours_2 = (variation_hours > 0) ? variation_hours - 1 : 59;
                variation_minutes_2 = (variation_minutes > 0) ? variation_minutes - 1 : 59;
                variation_seconds_2 = (variation_seconds > 0) ? variation_seconds - 1 : 59;
                variation_date_2_t = variation_date_2 < 10 ? ("0" + variation_date_2).slice(-2) : variation_date_2.toString();
                variation_hours_2_t = variation_hours_2 < 10 ? ("0" + variation_hours_2).slice(-2) : variation_hours_2.toString();
                variation_minutes_2_t = variation_minutes_2 < 10 ? ("0" + variation_minutes_2).slice(-2) : variation_minutes_2.toString();
                variation_seconds_2_t = variation_seconds_2 < 10 ? ("0" + variation_seconds_2).slice(-2) : variation_seconds_2.toString();
                if (variation_container.hasClass('woo-sctr-countdown-timer-6')) {
                    variation_second_container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_seconds_2_t);
                    variation_second_container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-bottom').html(variation_seconds_2_t);
                    variation_second_container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_seconds_t);
                    variation_second_container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-bottom').html(variation_seconds_t);

                    variation_minute_container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_minutes_2_t);
                    variation_minute_container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-bottom').html(variation_minutes_2_t);
                    variation_minute_container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_minutes_t);
                    variation_minute_container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-bottom').html(variation_minutes_t);

                    variation_hour_container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_hours_2_t);
                    variation_hour_container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-bottom').html(variation_hours_2_t);
                    variation_hour_container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_hours_t);
                    variation_hour_container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-bottom').html(variation_hours_t);

                    variation_date_container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_date_2_t);
                    variation_date_container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-bottom').html(variation_date_2_t);
                    variation_date_container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-top').attr('data-value', variation_hours_t);
                    variation_date_container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-bottom').html(variation_hours_t);
                } else {
                    variation_second_container.find('.woo-sctr-countdown-value-container .woo-sctr-countdown-value-1').html(variation_seconds_2_t);
                    variation_minute_container.find('.woo-sctr-countdown-value-container .woo-sctr-countdown-value-1').html(variation_minutes_2_t);
                    variation_hour_container.find('.woo-sctr-countdown-value-container .woo-sctr-countdown-value-1').html(variation_hours_2_t);
                    variation_date_container.find('.woo-sctr-countdown-value-container .woo-sctr-countdown-value-1').html(variation_date_2_t);

                    variation_second_container.find('.woo-sctr-countdown-value-container .woo-sctr-countdown-value-2').html(variation_seconds_t);
                    variation_minute_container.find('.woo-sctr-countdown-value-container .woo-sctr-countdown-value-2').html(variation_minutes_t);
                    variation_hour_container.find('.woo-sctr-countdown-value-container .woo-sctr-countdown-value-2').html(variation_hours_t);
                    variation_date_container.find('.woo-sctr-countdown-value-container .woo-sctr-countdown-value-2').html(variation_date_t);
                }
            } else if (variation_container.hasClass('woo-sctr-shortcode-countdown-unit-animation-flip')) {
                variation_second_container.find('.woo-sctr-countdown-flip-top').attr('data-value', variation_seconds_t);
                variation_second_container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', variation_seconds_t);

                variation_minute_container.find('.woo-sctr-countdown-flip-top').attr('data-value', variation_minutes_t);
                variation_minute_container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', variation_minutes_t);

                variation_hour_container.find('.woo-sctr-countdown-flip-top').attr('data-value', variation_hours_t);
                variation_hour_container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', variation_hours_t);

                variation_date_container.find('.woo-sctr-countdown-flip-top').attr('data-value', variation_date_t);
                variation_date_container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', variation_date_t);
            }
        } else {
            let sec_left_arg, min_left_arg, hour_left_arg, date_left_arg;
            sec_left_arg = variation_seconds_t.split('');
            min_left_arg = variation_minutes_t.split('');
            hour_left_arg = variation_hours_t.split('');
            date_left_arg = variation_date_t.split('');
            if (variation_container.hasClass('woo-sctr-shortcode-countdown-unit-animation-default')) {
                variation_second_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-top').attr('data-value', sec_left_arg[0]);
                variation_second_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(sec_left_arg[0]);
                variation_second_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-top').attr('data-value', sec_left_arg[1]);
                variation_second_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(sec_left_arg[1]);

                variation_minute_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-top').attr('data-value', min_left_arg[0]);
                variation_minute_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(min_left_arg[0]);
                variation_minute_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-top').attr('data-value', min_left_arg[1]);
                variation_minute_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(min_left_arg[1]);

                variation_hour_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-top').attr('data-value', hour_left_arg[0]);
                variation_hour_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(hour_left_arg[0]);
                variation_hour_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-top').attr('data-value', hour_left_arg[1]);
                variation_hour_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(hour_left_arg[1]);

                variation_date_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-top').attr('data-value', date_left_arg[0]);
                variation_date_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(date_left_arg[0]);
                variation_date_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-top').attr('data-value', date_left_arg[1]);
                variation_date_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(date_left_arg[1]);
            } else if (variation_container.hasClass('woo-sctr-shortcode-countdown-unit-animation-slide')) {
                variation_second_container.find('.woo-sctr-countdown-second-1-container .woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', sec_left_arg[0] > 0 ? sec_left_arg[0] - 1 : 5);
                variation_second_container.find('.woo-sctr-countdown-second-1-container .woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(sec_left_arg[0] > 0 ? sec_left_arg[0] - 1 : 5);
                variation_second_container.find('.woo-sctr-countdown-second-1-container .woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', sec_left_arg[0]);
                variation_second_container.find('.woo-sctr-countdown-second-1-container .woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(sec_left_arg[0]);

                variation_second_container.find('.woo-sctr-countdown-second-2-container .woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', sec_left_arg[1] > 0 ? sec_left_arg[1] - 1 : 9);
                variation_second_container.find('.woo-sctr-countdown-second-2-container .woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(sec_left_arg[1] > 0 ? sec_left_arg[1] - 1 : 9);
                variation_second_container.find('.woo-sctr-countdown-second-2-container .woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', sec_left_arg[1]);
                variation_second_container.find('.woo-sctr-countdown-second-2-container .woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(sec_left_arg[1]);

                variation_minute_container.find('.woo-sctr-countdown-minute-1-container .woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', min_left_arg[0] > 0 ? min_left_arg[0] - 1 : 5);
                variation_minute_container.find('.woo-sctr-countdown-minute-1-container .woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(min_left_arg[0] > 0 ? min_left_arg[0] - 1 : 5);
                variation_minute_container.find('.woo-sctr-countdown-minute-1-container .woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', min_left_arg[0]);
                variation_minute_container.find('.woo-sctr-countdown-minute-1-container .woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(min_left_arg[0]);
                variation_minute_container.find('.woo-sctr-countdown-minute-2-container .woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', min_left_arg[1] > 0 ? min_left_arg[1] - 1 : 9);
                variation_minute_container.find('.woo-sctr-countdown-minute-2-container .woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(min_left_arg[1] > 0 ? min_left_arg[1] - 1 : 9);
                variation_minute_container.find('.woo-sctr-countdown-minute-2-container .woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', min_left_arg[1]);
                variation_minute_container.find('.woo-sctr-countdown-minute-2-container .woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(min_left_arg[1]);

                variation_hour_container.find('.woo-sctr-countdown-hour-1-container .woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', hour_left_arg[0] > 0 ? hour_left_arg[0] - 1 : 0);
                variation_hour_container.find('.woo-sctr-countdown-hour-1-container .woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(hour_left_arg[0] > 0 ? hour_left_arg[0] - 1 : 0);
                variation_hour_container.find('.woo-sctr-countdown-hour-1-container .woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', hour_left_arg[0]);
                variation_hour_container.find('.woo-sctr-countdown-hour-1-container .woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(hour_left_arg[0]);
                variation_hour_container.find('.woo-sctr-countdown-hour-2-container .woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', hour_left_arg[1] > 0 ? hour_left_arg[1] - 1 : 0);
                variation_hour_container.find('.woo-sctr-countdown-hour-2-container .woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(hour_left_arg[1] > 0 ? hour_left_arg[1] - 1 : 0);
                variation_hour_container.find('.woo-sctr-countdown-hour-2-container .woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', hour_left_arg[1]);
                variation_hour_container.find('.woo-sctr-countdown-hour-2-container .woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(hour_left_arg[1]);

                variation_date_container.find('.woo-sctr-countdown-date-1-container .woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', date_left_arg[0] > 0 ? date_left_arg[0] - 1 : 0);
                variation_date_container.find('.woo-sctr-countdown-date-1-container .woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(date_left_arg[0] > 0 ? date_left_arg[0] - 1 : 0);
                variation_date_container.find('.woo-sctr-countdown-date-1-container .woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', date_left_arg[0]);
                variation_date_container.find('.woo-sctr-countdown-date-1-container .woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(date_left_arg[0]);
                variation_date_container.find('.woo-sctr-countdown-date-2-container .woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', date_left_arg[1] > 0 ? date_left_arg[1] - 1 : 0);
                variation_date_container.find('.woo-sctr-countdown-date-2-container .woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(date_left_arg[1] > 0 ? date_left_arg[1] - 1 : 0);
                variation_date_container.find('.woo-sctr-countdown-date-2-container .woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', date_left_arg[1]);
                variation_date_container.find('.woo-sctr-countdown-date-2-container .woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(date_left_arg[1]);

            } else if (variation_container.hasClass('woo-sctr-shortcode-countdown-unit-animation-flip')) {
                variation_second_container.find('.woo-sctr-countdown-second-1-wrap .woo-sctr-countdown-flip-top').attr('data-value', sec_left_arg[0]);
                variation_second_container.find('.woo-sctr-countdown-second-1-wrap .woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', sec_left_arg[0]);
                variation_second_container.find('.woo-sctr-countdown-second-2-wrap .woo-sctr-countdown-flip-top').attr('data-value', sec_left_arg[1]);
                variation_second_container.find('.woo-sctr-countdown-second-2-wrap .woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', sec_left_arg[1]);

                variation_minute_container.find('.woo-sctr-countdown-minute-1-wrap .woo-sctr-countdown-flip-top').attr('data-value', min_left_arg[0]);
                variation_minute_container.find('.woo-sctr-countdown-minute-1-wrap .woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', min_left_arg[0]);
                variation_minute_container.find('.woo-sctr-countdown-minute-2-wrap .woo-sctr-countdown-flip-top').attr('data-value', min_left_arg[1]);
                variation_minute_container.find('.woo-sctr-countdown-minute-2-wrap .woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', min_left_arg[1]);

                variation_hour_container.find('.woo-sctr-countdown-hour-1-wrap .woo-sctr-countdown-flip-top').attr('data-value', hour_left_arg[0]);
                variation_hour_container.find('.woo-sctr-countdown-hour-1-wrap .woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', hour_left_arg[0]);
                variation_hour_container.find('.woo-sctr-countdown-hour-2-wrap .woo-sctr-countdown-flip-top').attr('data-value', hour_left_arg[1]);
                variation_hour_container.find('.woo-sctr-countdown-hour-2-wrap .woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', hour_left_arg[1]);

                variation_date_container.find('.woo-sctr-countdown-date-1-wrap .woo-sctr-countdown-flip-top').attr('data-value', date_left_arg[0]);
                variation_date_container.find('.woo-sctr-countdown-date-1-wrap .woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', date_left_arg[0]);
                variation_date_container.find('.woo-sctr-countdown-date-2-wrap .woo-sctr-countdown-flip-top').attr('data-value', date_left_arg[1]);
                variation_date_container.find('.woo-sctr-countdown-date-2-wrap .woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', date_left_arg[1]);
            }
        }
        vi_sctv_run_countdown(time_expire, countdown_wrap, id);
    }
}
function vi_sctv_set_countdown(time_expire, countdown_wrap) {
    countdown_wrap = jQuery(countdown_wrap);
    if (countdown_wrap.hasClass('woo-sctr-shortcode-countdown-timer-wrap-type-product') ){
        let countdown_data_change = countdown_wrap.find('.woo-sctr-countdown-end-time').data('countdown_data_change');
        if (!countdown_data_change || countdown_data_change.product_type ==='variation'){
            vi_sctv_reload();
        }
        if (countdown_wrap.hasClass('woo-sctr-shortcode-countdown-timer-wrap-changing-upcoming')){
            let coundown_message = countdown_data_change.message;
            coundown_message = coundown_message.split('{countdown_timer}');
            if (coundown_message.length < 2){
                return  0;
            }
            let product = countdown_wrap.closest('.vi-sctv-product');
            if (!product.length){
                product = countdown_wrap.closest('.product');
            }
            countdown_wrap.find('.woo-sctr-countdown-timer-text-before').html(coundown_message[0]);
            countdown_wrap.find('.woo-sctr-countdown-timer-text-after').html(coundown_message[1]);
            product.find('.vi-sctv-price').html(countdown_data_change.sale_price_html);
            product.find('.vi-sctv-sale-badge').removeClass('woo-sctr-countdown-hidden');
        }else {
            let coundown_message = countdown_data_change.upcoming_message;
            coundown_message = coundown_message.split('{countdown_timer}');
            if (coundown_message.length < 2){
                return  0;
            }
            if (time_expire < 0) {
                time_expire = Math.round((time_expire * (-1)) / 1000);
            }
            let product = countdown_wrap.closest('.vi-sctv-product');
            if (!product.length) {
                product = countdown_wrap.closest('.product');
            }
            countdown_wrap.find('.woo-sctr-countdown-timer-text-before').html(coundown_message[0]);
            countdown_wrap.find('.woo-sctr-countdown-timer-text-after').html(coundown_message[1]);
            product.find('.vi-sctv-price').html(countdown_data_change.regular_price_html);
            product.find('.vi-sctv-sale-badge').addClass('woo-sctr-countdown-hidden');
        }
    }
    jQuery(document.body).trigger('vi_sctv_countdown_end',countdown_wrap,time_expire);
    countdown_wrap.removeClass('woo-sctr-shortcode-countdown-timer-wrap-changing woo-sctr-shortcode-countdown-timer-wrap-changing-upcoming woo-sctr-shortcode-countdown-timer-wrap-changing-end');
    return time_expire;
}

function vi_sctv_get_countdown_time(input) {
    input = jQuery(input);
    let now = Date.now(), countdown_time_from, countdown_time_to, countdown_time_reset,
        countdown_time_end = input.data('countdown_time_end');
    if (!countdown_time_end) {
        return 0;
    }
    countdown_time_end = new Date(countdown_time_end.replace(' ', 'T') + 'Z');
    countdown_time_end = countdown_time_end.valueOf();
    if (countdown_time_end > now) {
        return Math.round((countdown_time_end - now) / 1000);
    }
    countdown_time_from = input.data('countdown_time_from');
    countdown_time_to = input.data('countdown_time_to');
    countdown_time_reset = input.data('countdown_time_reset');
    if (!countdown_time_from || !countdown_time_to) {
        input.closest('.woo-sctr-shortcode-countdown-timer-wrap').addClass('woo-sctr-shortcode-countdown-timer-wrap-changing woo-sctr-shortcode-countdown-timer-wrap-changing-end');
        return 0;
    }
    countdown_time_from = new Date(countdown_time_from.replace(' ', 'T') + 'Z');
    countdown_time_from = countdown_time_from.valueOf();
    countdown_time_to = new Date(countdown_time_to.replace(' ', 'T') + 'Z');
    countdown_time_to = countdown_time_to.valueOf();
    if (countdown_time_from === countdown_time_end && countdown_time_to > now) {
        input.closest('.woo-sctr-shortcode-countdown-timer-wrap').addClass('woo-sctr-shortcode-countdown-timer-wrap-changing woo-sctr-shortcode-countdown-timer-wrap-changing-upcoming');
        return Math.round((countdown_time_to - now) / 1000);
    }
    if (countdown_time_to === countdown_time_end && parseInt(countdown_time_reset) >= 0) {
        let countdown_time_loop = countdown_time_to - countdown_time_from;
        countdown_time_reset = parseInt(countdown_time_reset) * 1000;
        if (countdown_time_to < now) {
            let missed = Math.floor((now - countdown_time_to) / (countdown_time_loop + countdown_time_reset));
            let countdown_time_from_t = countdown_time_to + missed * (countdown_time_loop + countdown_time_reset) + countdown_time_reset;
            if (countdown_time_from_t > now) {
                input.closest('.woo-sctr-shortcode-countdown-timer-wrap').addClass('woo-sctr-shortcode-countdown-timer-wrap-changing woo-sctr-shortcode-countdown-timer-wrap-changing-end');
                return now - countdown_time_from_t;
            } else {
                input.closest('.woo-sctr-shortcode-countdown-timer-wrap').addClass('woo-sctr-shortcode-countdown-timer-wrap-changing woo-sctr-shortcode-countdown-timer-wrap-changing-upcoming');
                return Math.round((countdown_time_from_t + countdown_time_loop - now) / 1000);
            }
        } else {
            let countdown_time_restart = now - countdown_time_end - countdown_time_reset;
            if (countdown_time_restart < 0) {
                input.closest('.woo-sctr-shortcode-countdown-timer-wrap').addClass('woo-sctr-shortcode-countdown-timer-wrap-changing woo-sctr-shortcode-countdown-timer-wrap-changing-end');
                return now - countdown_time_restart;
            } else {
                input.closest('.woo-sctr-shortcode-countdown-timer-wrap').addClass('woo-sctr-shortcode-countdown-timer-wrap-changing woo-sctr-shortcode-countdown-timer-wrap-changing-upcoming');
                return Math.round((countdown_time_loop - countdown_time_restart) / 1000);
            }
        }
    }
    return 0;
}
function vi_sctv_reload() {
    if (window.location.search){
        window.location.href += '&sctv_countdown_job=' + window.location.href;
    }else {
        window.location.href += '?sctv_countdown_job=' + window.location.href;
    }
}
function sctv_countdown_three(container, date_container, hour_container, minute_container, second_container, date, hours, minutes, seconds) {
    if (container.hasClass('woo-sctr-shortcode-countdown-unit-animation-default')) {
        let seconds_t, minutes_t, hours_t, date_t;
        seconds_t = seconds < 10 ? ("0" + seconds).slice(-2) : seconds;
        minutes_t = minutes < 10 ? ("0" + minutes).slice(-2) : minutes;
        hours_t = hours < 10 ? ("0" + hours).slice(-2) : hours;
        date_t = date < 10 ? ("0" + date).slice(-2) : date;
        second_container.find('.woo-sctr-countdown-two-vertical-top').attr('data-value', seconds_t);
        second_container.find('.woo-sctr-countdown-two-vertical-bottom').html(seconds_t);
        minute_container.find('.woo-sctr-countdown-two-vertical-top').attr('data-value', minutes_t);
        minute_container.find('.woo-sctr-countdown-two-vertical-bottom').html(minutes_t);
        hour_container.find('.woo-sctr-countdown-two-vertical-top').attr('data-value', hours_t);
        hour_container.find('.woo-sctr-countdown-two-vertical-bottom').html(hours_t);
        date_container.find('.woo-sctr-countdown-two-vertical-top').attr('data-value', date_t);
        date_container.find('.woo-sctr-countdown-two-vertical-bottom').html(date_t);
    } else if (container.hasClass('woo-sctr-shortcode-countdown-unit-animation-slide')) {
        if (seconds !== parseInt(second_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html())) {
            second_container.find('.woo-sctr-countdown-value-container').addClass('transition');
            setTimeout(function (container, time_value) {
                let time_value2, time_value1, t;
                t = (time_value > 0) ? time_value - 1 : 59;
                time_value1 = t > 9 ? t : ("0" + t).slice(-2);
                time_value2 = time_value > 9 ? time_value : ("0" + time_value).slice(-2);
                container.removeClass('transition');
                container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-bottom').html(time_value2);
            }, 500, second_container.find('.woo-sctr-countdown-value-container'), seconds);
        }
        if (seconds === 0 && (minutes > 0 || hours > 0 || date > 0)) {
            setTimeout(function (container, time_value) {
                container.find('.woo-sctr-countdown-value-container').addClass('transition');
                setTimeout(function (container, time_value) {
                    let time_value2, time_value1;
                    time_value2 = (time_value > 0) ? time_value - 1 : 59;
                    time_value1 = (time_value2 > 0) ? time_value2 - 1 : 59;
                    time_value1 = time_value1 > 9 ? time_value1 : ("0" + time_value1).slice(-2);
                    time_value2 = time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2);
                    container.find('.woo-sctr-countdown-value-container').removeClass('transition');
                    container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                    container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                    container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                    container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-bottom').html(time_value2);
                }, 500, container, time_value);
            }, 1000, minute_container, minutes);
            if (minutes === 0 && (hours > 0 || date > 0)) {
                setTimeout(function (container, time_value) {
                    container.find('.woo-sctr-countdown-value-container').addClass('transition');
                    setTimeout(function (container, time_value) {
                        let time_value2, time_value1;
                        time_value2 = (time_value > 0) ? time_value - 1 : 59;
                        time_value1 = (time_value2 > 0) ? time_value2 - 1 : 59;
                        time_value1 = time_value1 > 9 ? time_value1 : ("0" + time_value1).slice(-2);
                        time_value2 = time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2);
                        container.find('.woo-sctr-countdown-value-container').removeClass('transition');
                        container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                        container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                        container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                        container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-bottom').html(time_value2);
                    }, 500, container, time_value);
                }, 1000, hour_container, hours);
            }
            if (hours === 0 && date > 0) {
                setTimeout(function (container, time_value) {
                    container.find('.woo-sctr-countdown-value-container').addClass('transition');
                    setTimeout(function (container, time_value) {
                        let time_value2, time_value1;
                        time_value2 = (time_value > 0) ? time_value - 1 : 0;
                        time_value1 = (time_value2 > 0) ? time_value2 - 1 : 0;
                        time_value1 = time_value1 > 9 ? time_value1 : ("0" + time_value1).slice(-2);
                        time_value2 = time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2);
                        container.find('.woo-sctr-countdown-value-container').removeClass('transition');
                        container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                        container.find('.woo-sctr-countdown-value-1.woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                        container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                        container.find('.woo-sctr-countdown-value-2.woo-sctr-countdown-two-vertical-bottom').html(time_value2);

                    }, 500, container, time_value);
                }, 1000, date_container, date);
            }
        }
    } else if (container.hasClass('woo-sctr-shortcode-countdown-unit-animation-flip')) {
        second_container.find('.woo-sctr-countdown-flip-wrap').removeClass('woo-sctr-countdown-flip-active');
        setTimeout(function (container, time_value) {
            let time_value2;
            time_value2 = (time_value > 0) ? time_value - 1 : 59;
            container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));
            container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value > 9 ? time_value : ("0" + time_value).slice(-2));
            container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));
            container.find('.woo-sctr-countdown-flip-wrap').addClass('woo-sctr-countdown-flip-active');
        }, 500, second_container, seconds);
        if (seconds === 0 && (minutes > 0 || hours > 0 || date > 0)) {
            minute_container.find('.woo-sctr-countdown-flip-wrap').removeClass('woo-sctr-countdown-flip-active');
            setTimeout(function (container, time_value) {
                let time_value2;
                time_value2 = (time_value > 0) ? time_value - 1 : 59;

                container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));
                container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value > 9 ? time_value : ("0" + time_value).slice(-2));
                container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));
                container.find('.woo-sctr-countdown-flip-wrap').addClass('woo-sctr-countdown-flip-active');
            }, 500, minute_container, minutes);

            if (minutes === 0 && (hours > 0 || date > 0)) {
                hour_container.find('.woo-sctr-countdown-flip-wrap').removeClass('woo-sctr-countdown-flip-active');
                setTimeout(function (container, time_value) {
                    let time_value2;
                    time_value2 = (time_value > 0) ? time_value - 1 : 59;

                    container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));
                    container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value > 9 ? time_value : ("0" + time_value).slice(-2));
                    container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));
                    container.find('.woo-sctr-countdown-flip-wrap').addClass('woo-sctr-countdown-flip-active');
                }, 500, hour_container, hours);

                if (hours === 0 && date > 0) {
                    date_container.find('.woo-sctr-countdown-flip-wrap').removeClass('woo-sctr-countdown-flip-active');
                    setTimeout(function (container, time_value) {
                        let time_value2;
                        time_value2 = (time_value > 0) ? time_value - 1 : 0;

                        container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));
                        container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value > 9 ? time_value : ("0" + time_value).slice(-2));
                        container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));
                        container.find('.woo-sctr-countdown-flip-wrap').addClass('woo-sctr-countdown-flip-active');
                    }, 500, date_container, date);
                }
            }
        }
    }
}

function sctv_countdown_one(container, date_container, hour_container, minute_container, second_container, date, hours, minutes, seconds, seconds_deg, minutes_deg, hours_deg, dates_deg) {
    if (container.hasClass('woo-sctr-countdown-timer-circle')) {
        setTimeout(function (second_container, seconds) {
            seconds_deg = (seconds > 0 ? seconds : 59) * 6;
            if (seconds_deg < 180) {
                second_container.find('.woo-sctr-countdown-value-circle-container').removeClass('woo-sctr-over50');
                second_container.find('.woo-sctr-countdown-circle-container').removeClass('woo-sctr-over50');
                second_container.find('.woo-sctr-first50-bar').addClass('woo-sctr-countdown-hidden');
            } else {
                second_container.find('.woo-sctr-countdown-value-circle-container').addClass('woo-sctr-over50');
                second_container.find('.woo-sctr-countdown-circle-container').addClass('woo-sctr-over50');
                second_container.find('.woo-sctr-first50-bar').removeClass('woo-sctr-countdown-hidden');
            }
            second_container.find('.woo-sctr-value-bar').css({'transform': 'rotate(' + seconds_deg + 'deg)'});
        }, 500, second_container, seconds);
        if (seconds === 0 && (minutes > 0 || hours > 0 || date > 0)) {
            setTimeout(function (minute_container, minutes) {
                minutes_deg = (minutes > 0 ? (minutes - 1) : 59) * 6;
                if (minutes_deg < 180) {
                    minute_container.find('.woo-sctr-countdown-value-circle-container').removeClass('woo-sctr-over50');
                    minute_container.find('.woo-sctr-countdown-circle-container').removeClass('woo-sctr-over50');
                    minute_container.find('.woo-sctr-first50-bar').addClass('woo-sctr-countdown-hidden');
                } else {
                    minute_container.find('.woo-sctr-countdown-value-circle-container').addClass('woo-sctr-over50');
                    minute_container.find('.woo-sctr-countdown-circle-container').addClass('woo-sctr-over50');
                    minute_container.find('.woo-sctr-first50-bar').removeClass('woo-sctr-countdown-hidden');
                }

                setTimeout(function (minute_container, minutes_deg) {
                    minute_container.find('.woo-sctr-value-bar').css({'transform': 'rotate(' + minutes_deg + 'deg)'});
                }, 500, minute_container, minutes_deg);
            }, 1000, minute_container, minutes);
            if (minutes === 0 && (hours > 0 || date > 0)) {
                setTimeout(function (hours, hour_container) {
                    hours_deg = (hours > 0 ? (hours - 1) : 23) * 15;
                    if (hours_deg < 180) {
                        hour_container.find('.woo-sctr-countdown-value-circle-container').removeClass('woo-sctr-over50');
                        hour_container.find('.woo-sctr-countdown-circle-container').removeClass('woo-sctr-over50');
                        hour_container.find('.woo-sctr-first50-bar').addClass('woo-sctr-countdown-hidden');
                    } else {
                        hour_container.find('.woo-sctr-countdown-value-circle-container').addClass('woo-sctr-over50');
                        hour_container.find('.woo-sctr-countdown-circle-container').addClass('woo-sctr-over50');
                        hour_container.find('.woo-sctr-first50-bar').removeClass('woo-sctr-countdown-hidden');
                    }

                    setTimeout(function (hours_deg, hour_container) {
                        hour_container.find('.woo-sctr-value-bar').css({'transform': 'rotate(' + hours_deg + 'deg)'});
                    }, 500, hours_deg, hour_container);
                }, 1000, hours, hour_container);

                if (hours === 0 && date > 0) {

                    setTimeout(function (date, date_container) {
                        dates_deg = date > 0 ? (date - 1) : 0;
                        if (dates_deg < 180) {
                            date_container.find('.woo-sctr-countdown-value-circle-container').removeClass('woo-sctr-over50');
                            date_container.find('.woo-sctr-countdown-circle-container').removeClass('woo-sctr-over50');
                            date_container.find('.woo-sctr-first50-bar').addClass('woo-sctr-countdown-hidden');
                        } else {
                            date_container.find('.woo-sctr-countdown-value-circle-container').addClass('woo-sctr-over50');
                            date_container.find('.woo-sctr-countdown-circle-container').addClass('woo-sctr-over50');
                            date_container.find('.woo-sctr-first50-bar').removeClass('woo-sctr-countdown-hidden');
                        }
                        setTimeout(function (dates_deg, date_container) {
                            date_container.find('.woo-sctr-value-bar').css({'transform': 'rotate(' + dates_deg + 'deg)'});

                        }, 500, dates_deg, date_container);
                    }, 1000, date, date_container);
                }
            }
        }
    }
    if (container.hasClass('woo-sctr-shortcode-countdown-unit-animation-default')) {
        second_container.find('.woo-sctr-countdown-second-value.woo-sctr-countdown-value-animation-default').html(seconds < 10 ? ("0" + seconds).slice(-2) : seconds);
        minute_container.find('.woo-sctr-countdown-minute-value.woo-sctr-countdown-value-animation-default').html(minutes < 10 ? ("0" + minutes).slice(-2) : minutes);
        hour_container.find('.woo-sctr-countdown-hour-value.woo-sctr-countdown-value-animation-default').html(hours < 10 ? ("0" + hours).slice(-2) : hours);
        date_container.find('.woo-sctr-countdown-date-value.woo-sctr-countdown-value-animation-default').html(date < 10 ? ("0" + date).slice(-2) : date);
    } else if (container.hasClass('woo-sctr-shortcode-countdown-unit-animation-slide')) {
        if (seconds !== parseInt(second_container.find('.woo-sctr-countdown-value-2').html())) {
            second_container.find('.woo-sctr-countdown-value-container').addClass('transition');
            setTimeout(function (container, time_value) {
                let time_value2, time_value1;
                time_value2 = (time_value > 0) ? time_value - 1 : 59;
                time_value1 = (time_value2 > 0) ? time_value2 - 1 : 59;
                container.removeClass('transition');

                container.find('.woo-sctr-countdown-value-1').html(time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));
                container.find('.woo-sctr-countdown-value-2').html(time_value > 9 ? time_value : ("0" + time_value).slice(-2));
            }, 500, second_container.find('.woo-sctr-countdown-value-container'), seconds);
        }
        if (seconds === 0 && (minutes > 0 || hours > 0 || date > 0)) {
            setTimeout(function (container, time_value) {
                container.find('.woo-sctr-countdown-value-container').addClass('transition');
                setTimeout(function (container, time_value) {
                    let time_value2, time_value1;
                    time_value2 = (time_value > 0) ? time_value - 1 : 59;
                    time_value1 = (time_value2 > 0) ? time_value2 - 1 : 59;
                    container.find('.woo-sctr-countdown-value-container').removeClass('transition');
                    container.find('.woo-sctr-countdown-value-1').html(time_value1 > 9 ? time_value1 : ("0" + time_value1).slice(-2));
                    container.find('.woo-sctr-countdown-value-2').html(time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));

                }, 500, container, time_value);
            }, 1000, minute_container, minutes);
            if (minutes === 0 && (hours > 0 || date > 0)) {
                setTimeout(function (container, time_value) {
                    container.find('.woo-sctr-countdown-value-container').addClass('transition');
                    setTimeout(function (container, time_value) {
                        let time_value2, time_value1;
                        time_value2 = (time_value > 0) ? time_value - 1 : 59;
                        time_value1 = (time_value2 > 0) ? time_value2 - 1 : 59;
                        container.find('.woo-sctr-countdown-value-container').removeClass('transition');
                        container.find('.woo-sctr-countdown-value-1').html(time_value1 > 9 ? time_value1 : ("0" + time_value1).slice(-2));
                        container.find('.woo-sctr-countdown-value-2').html(time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));

                    }, 500, container, time_value);
                }, 1000, hour_container, hours);

                if (hours === 0 && date > 0) {
                    setTimeout(function (container, time_value) {
                        container.find('.woo-sctr-countdown-value-container').addClass('transition');
                        setTimeout(function (container, time_value) {
                            let time_value2, time_value1;
                            time_value2 = (time_value > 0) ? time_value - 1 : 0;
                            time_value1 = (time_value2 > 0) ? time_value2 - 1 : 0;
                            container.find('.woo-sctr-countdown-value-container').removeClass('transition');
                            container.find('.woo-sctr-countdown-value-1').html(time_value1 > 9 ? time_value1 : ("0" + time_value1).slice(-2));
                            container.find('.woo-sctr-countdown-value-2').html(time_value2 > 9 ? time_value2 : ("0" + time_value2).slice(-2));

                        }, 500, container, time_value);
                    }, 1000, date_container, date);

                }
            }
        }
    }

}

function sctv_countdown_two(container, date_container, hour_container, minute_container, second_container, date, hours, minutes, seconds) {
    let sec_left_arg, min_left_arg, hour_left_arg, date_left_arg;
    let date_left_1, date_left_2, hour_left_1, hour_left_2, min_left_1, min_left_2, sec_left_1, sec_left_2;
    sec_left_arg = ("0" + seconds).slice(-2);
    min_left_arg = ("0" + minutes).slice(-2);
    hour_left_arg = ("0" + hours).slice(-2);
    date_left_arg = ("0" + date).slice(-2);

    sec_left_arg = sec_left_arg.split('');
    min_left_arg = min_left_arg.split('');
    hour_left_arg = hour_left_arg.split('');
    date_left_arg = date_left_arg.split('');

    sec_left_1 = parseInt(sec_left_arg[0]);
    sec_left_2 = parseInt(sec_left_arg[1]);

    if (container.hasClass('woo-sctr-shortcode-countdown-unit-animation-default')) {

        second_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-top').attr('data-value', sec_left_arg[0]);
        second_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(sec_left_arg[0]);
        second_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-top').attr('data-value', sec_left_arg[1]);
        second_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(sec_left_arg[1]);

        minute_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-top').attr('data-value', min_left_arg[0]);
        minute_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(min_left_arg[0]);
        minute_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-top').attr('data-value', min_left_arg[1]);
        minute_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(min_left_arg[1]);

        hour_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-top').attr('data-value', hour_left_arg[0]);
        hour_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(hour_left_arg[0]);
        hour_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-top').attr('data-value', hour_left_arg[1]);
        hour_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(hour_left_arg[1]);

        date_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-top').attr('data-value', date_left_arg[0]);
        date_container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(date_left_arg[0]);
        date_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-top').attr('data-value', date_left_arg[1]);
        date_container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(date_left_arg[1]);
    } else if (container.hasClass('woo-sctr-shortcode-countdown-unit-animation-slide')) {
        if (sec_left_2 !== parseInt(second_container.find('.woo-sctr-countdown-second-2-container .woo-sctr-countdown-value-2 span').html())) {
            second_container.find('.woo-sctr-countdown-second-2-container').addClass('transition');
            setTimeout(function (container, time_value) {
                let time_value2;
                time_value2 = (time_value > 0) ? time_value - 1 : 9;

                container.removeClass('transition');
                container.find('.woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(time_value2);
                container.find('.woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value);
                container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(time_value);
            }, 500, second_container.find('.woo-sctr-countdown-second-2-container'), sec_left_2);
        }
        if (sec_left_2 === 0) {
            setTimeout(function (container, time_value) {
                container.addClass('transition');
                setTimeout(function (container, time_value) {
                    let time_value1, time_value2;
                    time_value2 = (time_value > 0) ? time_value - 1 : 5;
                    time_value1 = (time_value2 > 0) ? time_value2 - 1 : 5;

                    container.removeClass('transition');
                    container.find('.woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                    container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                    container.find('.woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                    container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(time_value2);
                }, 500, container, time_value);
            }, 1000, second_container.find('.woo-sctr-countdown-second-1-container'), sec_left_1);
        }
        if (seconds === 0 && (minutes > 0 || hours > 0 || date > 0)) {
            min_left_1 = parseInt(min_left_arg[0]);
            min_left_2 = parseInt(min_left_arg[1]);
            setTimeout(function (container, time_value) {
                container.addClass('transition');
                setTimeout(function (container, time_value) {
                    let time_value1, time_value2;
                    time_value2 = (time_value > 0) ? time_value - 1 : 9;
                    time_value1 = (time_value2 > 0) ? time_value2 - 1 : 9;

                    container.removeClass('transition');
                    container.find('.woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                    container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                    container.find('.woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                    container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(time_value2);
                }, 500, container, time_value);
            }, 1000, minute_container.find('.woo-sctr-countdown-minute-2-container'), min_left_2);
            if (min_left_2 === 0) {
                setTimeout(function (container, time_value) {
                    container.addClass('transition');
                    setTimeout(function (container, time_value) {
                        let time_value1, time_value2;
                        time_value2 = (time_value > 0) ? time_value - 1 : 5;
                        time_value1 = (time_value2 > 0) ? time_value2 - 1 : 5;

                        container.removeClass('transition');
                        container.find('.woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                        container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                        container.find('.woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                        container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(time_value2);
                    }, 500, container, time_value);
                }, 1000, minute_container.find('.woo-sctr-countdown-minute-1-container'), min_left_1);
            }
            if (minutes === 0 && (hours > 0 || date > 0)) {
                hour_left_1 = parseInt(hour_left_arg[0]);
                hour_left_2 = parseInt(hour_left_arg[1]);
                setTimeout(function (container, time_value) {
                    container.addClass('transition');
                    setTimeout(function (container, time_value) {
                        let time_value1, time_value2;
                        time_value2 = (time_value > 0) ? time_value - 1 : 9;
                        time_value1 = (time_value2 > 0) ? time_value2 - 1 : 9;

                        container.removeClass('transition');
                        container.find('.woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                        container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                        container.find('.woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                        container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(time_value2);
                    }, 500, container, time_value);
                }, 1000, hour_container.find('.woo-sctr-countdown-hour-2-container'), hour_left_2);
                if (hour_left_2 === 0) {
                    setTimeout(function (container, time_value) {
                        container.addClass('transition');
                        setTimeout(function (container, time_value) {
                            let time_value1, time_value2;
                            time_value2 = (time_value > 0) ? time_value - 1 : 5;
                            time_value1 = (time_value2 > 0) ? time_value2 - 1 : 5;

                            container.removeClass('transition');
                            container.find('.woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                            container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                            container.find('.woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                            container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(time_value2);
                        }, 500, container, time_value);
                    }, 1000, hour_container.find('.woo-sctr-countdown-hour-1-container'), hour_left_1);
                }
                if (hours === 0 && date > 0) {
                    date_left_1 = parseInt(date_left_arg[0]);
                    date_left_2 = parseInt(date_left_arg[1]);
                    setTimeout(function (container, time_value) {
                        container.addClass('transition');
                        setTimeout(function (container, time_value) {
                            let time_value1, time_value2;
                            time_value2 = (time_value > 0) ? time_value - 1 : 9;
                            time_value1 = (time_value2 > 0) ? time_value2 - 1 : 9;

                            container.removeClass('transition');
                            container.find('.woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                            container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                            container.find('.woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                            container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(time_value2);
                        }, 500, container, time_value);
                    }, 1000, date_container.find('.woo-sctr-countdown-date-2-container'), date_left_2);
                    if (date_left_2 === 0 && date_left_1 > 0) {
                        setTimeout(function (container, time_value) {
                            container.addClass('transition');
                            setTimeout(function (container, time_value) {
                                let time_value1, time_value2;
                                time_value2 = (time_value > 0) ? time_value - 1 : 0;
                                time_value1 = (time_value2 > 0) ? time_value2 - 1 : 0;

                                container.removeClass('transition');
                                container.find('.woo-sctr-countdown-value-1  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value1);
                                container.find('.woo-sctr-countdown-value-1 .woo-sctr-countdown-two-vertical-bottom').html(time_value1);
                                container.find('.woo-sctr-countdown-value-2  .woo-sctr-countdown-two-vertical-top').attr('data-value', time_value2);
                                container.find('.woo-sctr-countdown-value-2 .woo-sctr-countdown-two-vertical-bottom').html(time_value2);
                            }, 500, container, time_value);
                        }, 1000, date_container.find('.woo-sctr-countdown-date-1-container'), date_left_1);
                    }
                }
            }

        }
    } else if (container.hasClass('woo-sctr-shortcode-countdown-unit-animation-flip')) {
        second_container.find('.woo-sctr-countdown-second-2-wrap').removeClass('woo-sctr-countdown-flip-active');
        setTimeout(function (container, time_value) {
            let time_value2;
            time_value2 = (time_value > 0) ? time_value - 1 : 9;

            container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2);
            container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value);
            container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2);
            container.addClass('woo-sctr-countdown-flip-active');
        }, 500, second_container.find('.woo-sctr-countdown-second-2-wrap'), sec_left_2);
        if (sec_left_2 === 0) {
            second_container.find('.woo-sctr-countdown-second-1-wrap').removeClass('woo-sctr-countdown-flip-active');
            setTimeout(function (container, time_value) {
                let time_value2;
                time_value2 = (time_value > 0) ? time_value - 1 : 5;
                container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2);
                container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value);
                container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2);
                container.addClass('woo-sctr-countdown-flip-active');
            }, 500, second_container.find('.woo-sctr-countdown-second-1-wrap'), sec_left_1);
        }

        if (seconds === 0 && (minutes > 0 || hours > 0 || date > 0)) {
            min_left_1 = parseInt(min_left_arg[0]);
            min_left_2 = parseInt(min_left_arg[1]);
            minute_container.find('.woo-sctr-countdown-minute-2-wrap').removeClass('woo-sctr-countdown-flip-active');
            setTimeout(function (container, time_value) {
                let time_value2;
                time_value2 = (time_value > 0) ? time_value - 1 : 9;

                container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2);
                container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value);
                container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2);
                container.addClass('woo-sctr-countdown-flip-active');
            }, 500, minute_container.find('.woo-sctr-countdown-minute-2-wrap'), min_left_2);
            if (min_left_2 === 0) {
                minute_container.find('.woo-sctr-countdown-minute-1-wrap').removeClass('woo-sctr-countdown-flip-active');
                setTimeout(function (container, time_value) {
                    let time_value2;
                    time_value2 = (time_value > 0) ? time_value - 1 : 5;
                    container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2);
                    container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value);
                    container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2);
                    container.addClass('woo-sctr-countdown-flip-active');
                }, 500, minute_container.find('.woo-sctr-countdown-minute-1-wrap'), min_left_1);
            }
            if (minutes === 0 && (hours > 0 || date > 0)) {
                hour_left_1 = parseInt(hour_left_arg[0]);
                hour_left_2 = parseInt(hour_left_arg[1]);
                hour_container.find('.woo-sctr-countdown-hour-2-wrap').removeClass('woo-sctr-countdown-flip-active');
                setTimeout(function (container, time_value) {
                    let time_value2;
                    time_value2 = (time_value > 0) ? time_value - 1 : 9;

                    container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2);
                    container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value);
                    container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2);
                    container.addClass('woo-sctr-countdown-flip-active');
                }, 500, hour_container.find('.woo-sctr-countdown-hour-2-wrap'), hour_left_2);
                if (hour_left_2 === 0) {

                    hour_container.find('.woo-sctr-countdown-hour-1-wrap').removeClass('woo-sctr-countdown-flip-active');
                    setTimeout(function (container, time_value) {
                        let time_value2;
                        time_value2 = (time_value > 0) ? time_value - 1 : 5;

                        container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2);
                        container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value);
                        container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2);
                        container.addClass('woo-sctr-countdown-flip-active');
                    }, 500, hour_container.find('.woo-sctr-countdown-hour-1-wrap'), hour_left_1);

                }
                if (hours === 0 && date > 0) {
                    date_left_1 = parseInt(date_left_arg[0]);
                    date_left_2 = parseInt(date_left_arg[1]);

                    date_container.find('.woo-sctr-countdown-date-2-wrap').removeClass('woo-sctr-countdown-flip-active');
                    setTimeout(function (container, time_value) {
                        let time_value2;
                        time_value2 = (time_value > 0) ? time_value - 1 : 9;

                        container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2);
                        container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value);
                        container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2);
                        container.addClass('woo-sctr-countdown-flip-active');
                    }, 500, date_container.find('.woo-sctr-countdown-date-2-wrap'), date_left_2);
                    if (date_left_2 === 0 && date_left_1 > 0) {

                        date_container.find('.woo-sctr-countdown-date-1-wrap').removeClass('woo-sctr-countdown-flip-active');
                        setTimeout(function (container, time_value) {
                            let time_value2;
                            time_value2 = (time_value > 0) ? time_value - 1 : 0;

                            container.find('.woo-sctr-countdown-flip-top').attr('data-value', time_value2);
                            container.find('.woo-sctr-countdown-flip-back,.woo-sctr-countdown-flip-bottom').attr('data-value', time_value);
                            container.find('.woo-sctr-countdown-flip-back .woo-sctr-countdown-flip-bottom').attr('data-value', time_value2);
                            container.addClass('woo-sctr-countdown-flip-active');
                        }, 500, date_container.find('.woo-sctr-countdown-date-1-wrap'), date_left_1);
                    }
                }
            }

        }
    }

}