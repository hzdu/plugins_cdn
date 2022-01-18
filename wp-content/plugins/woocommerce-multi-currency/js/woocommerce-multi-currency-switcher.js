jQuery(document).ready(function () {
    'use strict';
    woocommerce_multi_currency_switcher.use_session = _woocommerce_multi_currency_params.use_session;
    woocommerce_multi_currency_switcher.ajax_url = _woocommerce_multi_currency_params.ajax_url;
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

var woocommerce_multi_currency_switcher = {
    use_session: 0,
    ajax_url: '',
    init: function () {
        jQuery('body').on('click', '.wmc-currency-redirect', function (e) {
            e.stopPropagation();
            e.preventDefault();
            wmcSwitchCurrency(jQuery(this));
        });

        jQuery('.wmc-select-currency-js').on('change', function (e) {
            e.preventDefault();
            wmcSwitchCurrency(jQuery(this));
        })
    },

    setCookie: function (cname, cvalue, expire) {
        var d = new Date();
        d.setTime(d.getTime() + (expire * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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