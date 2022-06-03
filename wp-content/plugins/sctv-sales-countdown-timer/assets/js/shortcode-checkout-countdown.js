jQuery(document).ready(function ($) {
    'use strict';
    if (typeof woo_sctr_checkout_countdown_shortcode === 'undefined') {
        return false;
    }
    if (woo_sctr_checkout_countdown_shortcode.sctv_checkout_countdown_check === 'no') {
        return false;
    }
    // console.log(woo_sctr_checkout_countdown_shortcode);
    let checkout_countdown_default, checkout_countdown_current, time_end;
    checkout_countdown_default = woo_sctr_checkout_countdown_shortcode.checkout_countdown_default ? woo_sctr_checkout_countdown_shortcode.checkout_countdown_default : '';
    checkout_countdown_current = woo_sctr_checkout_countdown_shortcode.sctv_checkout_countdown_details ? 1 : '';
    time_end = woo_sctr_checkout_countdown_shortcode.time_end ? parseInt(woo_sctr_checkout_countdown_shortcode.time_end) * 1000 : '';
    sctv_set_discount_checkout(checkout_countdown_default, time_end, checkout_countdown_current);
    jQuery(document.body).on('updated_cart_totals', function () {
        if (jQuery(".woo-sctr-checkout-countdown-wrap-wrap").hasClass('data-sctv_update')) {
            jQuery(".woo-sctr-checkout-countdown-wrap-wrap").removeClass('data-sctv_update');
            return false;
        }
        if (!checkout_countdown_default) {
            return false;
        }
        let update_qty = {
            action: 'woo_sctr_set_session_on_cart_page',
            time_end: time_end,
        };

        $.ajax({
            type: 'post',
            url: woo_sctr_checkout_countdown_shortcode.ajax_url,
            data: update_qty,
            beforeSend: function () {
                // console.log(update_qty);
            },
            success: function (response) {
                // console.log(response);
                if (($(".woo-sctr-checkout-countdown-wrap-wrap").find('.woo-sctr-countdown-timer-layout').length === 0 && checkout_countdown_current) || (response.status && response.status === 'success' && $(".woo-sctr-checkout-countdown-wrap-wrap").find('.woo-sctr-countdown-timer-layout').length)) {
                    setTimeout(function () {
                        jQuery("[name='update_cart']").prop("disabled", false);
                        jQuery(".woo-sctr-checkout-countdown-wrap-wrap").addClass('data-sctv_update');
                        jQuery("[name='update_cart']").trigger("click");
                    }, 100);
                }
                if (response.has_detail) {
                    checkout_countdown_current = 1;
                    $(".woo-sctr-checkout-countdown-wrap-wrap").not('.woo-sctr-checkout-countdown-popup-wrap').removeClass('woo-sctr-checkout-countdown-hidden');
                } else {
                    checkout_countdown_current = '';
                }
                if (response.time_end) {
                    time_end = parseInt(response.time_end) * 1000;
                }
                if ($(".woo-sctr-checkout-countdown-wrap-wrap").find('.woo-sctr-countdown-timer-layout').length === 0 && checkout_countdown_current) {
                    $(".woo-sctr-checkout-countdown-wrap-wrap").load(" .woo-sctr-checkout-countdown-wrap-wrap > *", function () {
                        if ($('#woo-sctr-shortcode-countdown-style').length === 0) {
                            $('head').append('<link rel="stylesheet" id="woo-sctr-shortcode-countdown-style-css" href="' + response.shortcode_css_url + '?ver="' + response.shortcode_version + '" type="text/css" media="all"/>');
                            $('head').append('<style id="woo-sctr-shortcode-countdown-style-inline-css" type="text/css">');
                        }

                        $("#woo-sctr-shortcode-countdown-style-inline-css").load(" #woo-sctr-shortcode-countdown-style-inline-css");
                        sctv_run_countdown('checkout', 1);
                        sctv_set_discount_checkout(checkout_countdown_default, time_end, checkout_countdown_current);
                    });
                    setTimeout(function () {
                        jQuery('.woo-sctr-checkout-countdown-popup-wrap.woo-sctr-checkout-countdown-sticky-top').addClass('woo-sctr-checkout-countdown-popup-show');
                        setCookie('sctv_checkout_countdown', 'shown', time_end);
                        setTimeout(function () {
                            jQuery('.woo-sctr-checkout-countdown-popup-wrap.woo-sctr-checkout-countdown-sticky-top').removeClass('woo-sctr-checkout-countdown-popup-show');
                        }, 3000);
                    }, 1000);
                }
            },
            error: function (err) {
                console.log(JSON.stringify(err));
            }
        });
    });

    $(document.body).on('removed_from_cart', function () {
        if (!checkout_countdown_default || !checkout_countdown_current || !time_end) {
            return false;
        }
        let removed_from_cart = {
            action: 'woo_sctr_set_session',
            type: 'removed_from_cart',
        };
        $.ajax({
            type: 'post',
            url: woo_sctr_checkout_countdown_shortcode.ajax_url,
            data: removed_from_cart,
            beforeSend: function () {
                // console.log(removed_from_cart);
            },
            success: function (response) {
                // console.log(response);

                if (response.has_detail === '1') {
                    checkout_countdown_current = 1;
                } else {
                    checkout_countdown_current = '';
                    // $(".woo-sctr-checkout-countdown-wrap-wrap").not('.woo-sctr-checkout-countdown-popup-wrap').addClass('woo-sctr-checkout-countdown-hidden');
                }
                if (response.status && response.status === 'success') {
                    setTimeout(function () {
                        jQuery('body').trigger("wc_fragment_refresh");
                        jQuery('body').trigger("update_checkout");
                    }, 300);
                }
            },
            error: function (err) {
                console.log(JSON.stringify(err));
            }
        });
    });
    $(document.body).on('added_to_cart', function () {
        if (!checkout_countdown_default) {
            return false;
        }
        if (checkout_countdown_current) {
            return false;
        }
        let data_add_to_cart = {
            action: 'woo_sctr_set_session',
            type: 'added_to_cart',
            is_checkout: woo_sctr_checkout_countdown_shortcode.is_checkout || 'no',
        };
        $.ajax({
            type: 'post',
            url: woo_sctr_checkout_countdown_shortcode.ajax_url,
            data: data_add_to_cart,
            beforeSend: function () {
                // console.log(data_add_to_cart);
            },
            success: function (response) {
                // console.log(response);

                if (response.status === 'success') {
                    setTimeout(function () {
                        jQuery('body').trigger("wc_fragment_refresh");
                        jQuery('body').trigger("update_checkout");
                    }, 300);
                }

                if (response.has_detail) {
                    checkout_countdown_current = 1;
                    $(".woo-sctr-checkout-countdown-wrap-wrap").not('.woo-sctr-checkout-countdown-popup-wrap').removeClass('woo-sctr-checkout-countdown-hidden');
                } else {
                    checkout_countdown_current = '';
                    // $(".woo-sctr-checkout-countdown-wrap-wrap").not('.woo-sctr-checkout-countdown-popup-wrap').addClass('woo-sctr-checkout-countdown-hidden');
                }
                if (response.time_end) {
                    time_end = parseInt(response.time_end) * 1000;
                }
                if (response.html) {
                    $(".woo-sctr-checkout-countdown-wrap-wrap").load(" .woo-sctr-checkout-countdown-wrap-wrap > *", function () {
                        if ($('#woo-sctr-shortcode-countdown-style').length === 0) {
                            $('head').append('<link rel="stylesheet" id="woo-sctr-shortcode-countdown-style-css" href="' + response.shortcode_css_url + '?ver="' + response.shortcode_version + '" type="text/css" media="all"/>');
                            $('head').append('<style id="woo-sctr-shortcode-countdown-style-inline-css" type="text/css">');
                        }
                        $("#woo-sctr-shortcode-countdown-style-inline-css").load(" #woo-sctr-shortcode-countdown-style-inline-css ");
                        sctv_run_countdown('checkout', 1);
                    });
                    setTimeout(function () {
                        jQuery('.woo-sctr-checkout-countdown-popup-wrap.woo-sctr-checkout-countdown-sticky-top').addClass('woo-sctr-checkout-countdown-popup-show');
                        setCookie('sctv_checkout_countdown', 'shown', time_end);
                        setTimeout(function () {
                            jQuery('.woo-sctr-checkout-countdown-popup-wrap.woo-sctr-checkout-countdown-sticky-top').removeClass('woo-sctr-checkout-countdown-popup-show');
                        }, 3000);
                    }, 1000);
                }
                if (checkout_countdown_default && response.has_detail && response.time_end) {
                    sctv_set_discount_checkout(checkout_countdown_default, time_end, checkout_countdown_current);
                }
            },
            error: function (err) {
                console.log(JSON.stringify(err));
            }
        });
    });

    function sctv_set_discount_checkout(checkout_countdown_default, time_end, checkout_countdown_current) {
        if (typeof wc_cart_fragments_params === 'undefined') {
            return false;
        }
        if (!checkout_countdown_default || !time_end || !checkout_countdown_current) {
            return false;
        }
        if ($('.woo-sctr-checkout-countdown-wrap-wrap .woo-sctr-countdown-timer').length === 0) {
            setTimeout(function () {
                window.location.reload();
            }, time_end);
        }
        if (!getCookie('sctv_checkout_countdown')) {
            jQuery('.woo-sctr-checkout-countdown-popup-wrap.woo-sctr-checkout-countdown-sticky-top').addClass('woo-sctr-checkout-countdown-popup-show');
            setCookie('sctv_checkout_countdown', 'shown', time_end);
            setTimeout(function () {
                jQuery('.woo-sctr-checkout-countdown-popup-wrap.woo-sctr-checkout-countdown-sticky-top').removeClass('woo-sctr-checkout-countdown-popup-show');
            }, 3000);
        }

        switch (checkout_countdown_default['change_type']) {
            case 'auto_change':
                let time_next, time_next1, data_auto_change, i, time_loop;
                if (checkout_countdown_default['auto_change_time_type'] === 'minute') {
                    time_next = checkout_countdown_default['auto_change_time'] * 60 * 1000;
                } else {
                    time_next = checkout_countdown_default['auto_change_time'] * 1000;
                }
                if (time_end < time_next) {
                    return false;
                }
                time_loop = Math.floor(time_end / time_next);
                time_next1 = time_end % time_next;
                data_auto_change = {
                    action: 'woo_sctr_set_checkout_discount',
                    type: 'auto_change',
                    discount_amount: checkout_countdown_default['auto_change_discount_amount'],
                    discount_type: checkout_countdown_default['auto_change_discount_type'],
                };
                if (time_loop > 0) {
                    for (i = 0; i < time_loop; i++) {
                        let time_action = time_next1 + time_next * i;
                        if (time_action > 0) {
                            setTimeout(function (data_auto_change, url) {
                                $.ajax({
                                    type: 'POST',
                                    url: url,
                                    data: data_auto_change,
                                    success: function (response) {
                                        // console.log(response);
                                        if (response.status === 'success') {
                                            setTimeout(function () {
                                                jQuery('body').trigger("wc_fragment_refresh");
                                                jQuery('body').trigger("update_checkout");
                                                if (jQuery("[name='update_cart']").length) {
                                                    jQuery("[name='update_cart']").prop("disabled", false);
                                                    jQuery(".woo-sctr-checkout-countdown-wrap-wrap").addClass('data-sctv_update');
                                                    jQuery("[name='update_cart']").trigger("click");
                                                }
                                            }, 300);
                                        } else if (response.status === 'stop') {
                                            window.location.reload();
                                        }
                                    },
                                    error: function (err) {
                                        console.log(JSON.stringify(err));
                                    }
                                });
                            }, time_action, data_auto_change, woo_sctr_checkout_countdown_shortcode.ajax_url);
                        }
                    }
                }
                break;
            case 'custom':
                let language = woo_sctr_checkout_countdown_shortcode.language || '';
                if (checkout_countdown_default['custom_minutes'].length) {
                    for (let j = 0; j < checkout_countdown_default['custom_minutes'].length; j++) {
                        let time_next = parseInt(checkout_countdown_default['custom_minutes'][j]) * 60 + parseInt(checkout_countdown_default['custom_seconds'][j]);
                        time_next = time_next * 1000 < time_end ? time_end - time_next * 1000 : 0;
                        if (time_next > 0) {
                            let data_custom = {
                                action: 'woo_sctr_set_checkout_discount',
                                type: 'custom',
                                is_checkout: woo_sctr_checkout_countdown_shortcode.is_checkout || 'no',
                                message_og: checkout_countdown_default['custom_message_og_' + language][j] || checkout_countdown_default['custom_message_og'][j],
                                message_pg: checkout_countdown_default['custom_message_pg_' + language][j] || checkout_countdown_default['custom_message_pg'][j],
                                free_ship: checkout_countdown_default['custom_free_ship'][j],
                                free_product: checkout_countdown_default['custom_free_product'][j],
                                discount_amount: checkout_countdown_default['custom_discount_amount'][j],
                            };
                            setTimeout(function (data, url) {
                                $.ajax({
                                    type: 'post',
                                    url: url,
                                    data: data,
                                    beforeSend: function () {
                                        // console.log(data);
                                    },
                                    success: function (response) {
                                        // console.log(response);
                                        if (response.status && response.status === 'success') {
                                            setTimeout(function () {
                                                jQuery('body').trigger("wc_fragment_refresh");
                                                jQuery('body').trigger("update_checkout");
                                                jQuery(".woo-sctr-checkout-countdown-wrap-wrap").addClass('data-sctv_update');
                                                jQuery("[name='update_cart']").prop("disabled", false);
                                                jQuery("[name='update_cart']").trigger("click");
                                            }, 300);
                                        }
                                    },
                                    error: function (err) {
                                        console.log(JSON.stringify(err));
                                    }
                                });
                            }, time_next, data_custom, woo_sctr_checkout_countdown_shortcode.ajax_url);
                        }
                    }
                }
                break;
        }

    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    /**
     *
     * @param cname
     * @param cvalue
     * @param expire
     */
    function setCookie(cname, cvalue, expire) {
        let d = new Date();
        d.setTime(d.getTime() + (expire * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
});