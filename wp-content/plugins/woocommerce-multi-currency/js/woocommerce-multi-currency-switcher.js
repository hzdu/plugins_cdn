jQuery(document).ready(function ($) {
    'use strict';
    woocommerce_multi_currency_switcher.use_session = _woocommerce_multi_currency_params.use_session;
    woocommerce_multi_currency_switcher.ajax_url = _woocommerce_multi_currency_params.ajax_url;
    woocommerce_multi_currency_switcher.switch_by_js = _woocommerce_multi_currency_params.switch_by_js;
    woocommerce_multi_currency_switcher.init();
    jQuery(document.body).on('wmc_cache_compatible_finish', function () {
        jQuery('.wmc-currency-loading').removeClass('wmc-currency-loading');
        jQuery('.wmc-select-currency-js').prop('disabled', false);
        if (_woocommerce_multi_currency_params.do_not_reload_page == 1) {
            if (typeof wc_checkout_params !== 'undefined') {
                if (parseInt(wc_checkout_params.is_checkout) === 1) {
                    jQuery(document.body).trigger('update_checkout');
                }
            }
            if (typeof wc_add_to_cart_params !== 'undefined') {
                if (parseInt(wc_add_to_cart_params.is_cart) === 1) {
                    jQuery('[name="update_cart"]').prop('disabled', false).trigger('click');
                }
            }
        }
    });
    jQuery(document.body).on('wc_fragments_refreshed', function (event) {

    });
});

window.woocommerce_multi_currency_switcher = {
    use_session: 0,
    ajax_url: '',
    switch_by_js: '',
    init: function () {
        jQuery('body').on('click', '.wmc-currency-redirect', function (e) {
            let $select = jQuery(this), $wmc_currency = $select.closest('.wmc-currency'),
                $container = $select.closest('.woocommerce-multi-currency');
            if ($wmc_currency.hasClass('wmc-active')) {
                e.preventDefault();
                return false;
            }
            e.stopPropagation();
            if (woocommerce_multi_currency_switcher.switch_by_js) {
                e.preventDefault();
                wmcSwitchCurrency($select);
            }
            if ($container.hasClass('wmc-currency-trigger-click')) {
                let $current = $container.find('.wmc-current-currency'),
                    $arrow = $container.find('.wmc-current-currency-arrow');
                if ($arrow.length === 0) {
                    $arrow = $container.find('.wmc-open-dropdown-currencies');
                }
                let $sub_currency = $select.closest('.wmc-sub-currency');
                $sub_currency.find('.wmc-hidden').removeClass('wmc-hidden');
                $wmc_currency.addClass('wmc-hidden');
                if ($container.hasClass('wmc-price-switcher')) {
                    $current.html($select.html());
                    $current.find('.wmc-price-switcher-code,.wmc-price-switcher-price').remove();
                } else {
                    if ($container.data('layout') === 'layout10') {
                        $current.find('.vi-flag-64').replaceWith($select.find('.vi-flag-64'));
                        jQuery('.wmc-text').attr('class', `wmc-text wmc-text-${$select.data('currency')}`).html(`<span class="wmc-text-currency-text">(${$select.data('currency')})</span>${$select.data('currency_symbol')}`);
                    } else {
                        $current.html($select.html());
                    }
                    if ($arrow.length > 0) {
                        $current.append($arrow)
                    }
                }
                $select.closest('.wmc-currency-trigger-click-active').removeClass('wmc-currency-trigger-click-active');
            }
        });

        jQuery('.wmc-select-currency-js').on('change', function (e) {
            e.preventDefault();
            if (woocommerce_multi_currency_switcher.switch_by_js) {
                wmcSwitchCurrency(jQuery(this));
            } else {
                if (parseInt(_woocommerce_multi_currency_params.posts_submit) > 0) {
                    window.location.href = jQuery(this).val();
                } else {
                    window.history.replaceState({}, '', jQuery(this).val());
                    window.location.reload();
                }
            }
        })
    },
    setCookie: function (cname, cvalue, expire) {
        var d = new Date();
        d.setTime(d.getTime() + (expire * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getCookie: function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    reload: function () {
        let url = new URL(window.location.href);
        if (parseInt(_woocommerce_multi_currency_params.posts_submit) > 0) {
            url.searchParams.delete('wmc-currency');
            window.location.href = url.href.replace(url.hash, '');
        } else {
            if (url.searchParams.get('wmc-currency')) {
                url.searchParams.delete('wmc-currency');
                window.history.replaceState({}, '', url.href);
            }
            window.location.reload();
        }
    },
};

var wmcSwitchCurrency = function ($switcher) {
    let $wmc = $switcher.closest('.woocommerce-multi-currency'), currency = '', hash = '';
    if (!$wmc.hasClass('wmc-currency-loading')) {
        if ($switcher.is('.wmc-select-currency-js')) {
            currency = $switcher.val();
        } else {
            currency = $switcher.data('currency');
        }
        if (currency) {
            $wmc.addClass('wmc-currency-loading');
            if ($switcher.is('.wmc-select-currency-js')) {
                $wmc.prop('disabled', true);
            }
            if (woocommerce_multi_currency_switcher.use_session == 1) {
                jQuery.ajax({
                    type: 'GET',
                    data: 'action=wmc_currency_switcher&wmc-currency=' + currency,
                    url: woocommerce_multi_currency_switcher.ajax_url,
                    xhrFields: {withCredentials: true},
                    success: function (data) {
                        if (typeof wc_cart_fragments_params === 'undefined' || wc_cart_fragments_params === null) {
                        } else {
                            sessionStorage.removeItem(wc_cart_fragments_params.fragment_name);
                        }
                        if (_woocommerce_multi_currency_params.do_not_reload_page == 1) {
                            window.woocommerce_multi_currency.cacheCompatible();
                            jQuery(document.body).trigger('wc_fragment_refresh');
                        } else {
                            jQuery.when(jQuery(document.body).trigger('wc_fragment_refresh')).done(function () {
                                woocommerce_multi_currency_switcher.reload();
                            });
                        }
                    },
                    error: function (html) {
                    },
                    complete: function () {
                        if (_woocommerce_multi_currency_params.do_not_reload_page != 1) {
                            jQuery('.wmc-currency-loading').removeClass('wmc-currency-loading');
                            jQuery('.wmc-select-currency-js').prop('disabled', false);
                        }
                    },
                })
            } else {
                woocommerce_multi_currency_switcher.setCookie('wmc_current_currency', currency, 86400);
                woocommerce_multi_currency_switcher.setCookie('wmc_current_currency_old', currency, 86400);
                jQuery(document.body).trigger('wmc_switch_currency_by_js_set_cookie', currency);
                if (typeof wc_cart_fragments_params === 'undefined' || wc_cart_fragments_params === null) {
                } else {
                    sessionStorage.removeItem(wc_cart_fragments_params.fragment_name);
                }
                if (_woocommerce_multi_currency_params.do_not_reload_page == 1) {
                    window.woocommerce_multi_currency.cacheCompatible();
                    jQuery(document.body).trigger('wc_fragment_refresh');
                } else {
                    jQuery.when(jQuery(document.body).trigger('wc_fragment_refresh')).done(function () {
                        jQuery('.wmc-currency-loading').removeClass('wmc-currency-loading');
                        woocommerce_multi_currency_switcher.reload();
                    });
                }
            }
        }
    }
};