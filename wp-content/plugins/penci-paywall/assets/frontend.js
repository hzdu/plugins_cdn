(function ($) {

    'use strict'

    /**
     * Ajax send request for unlocking post
     */
    $(document).on('ready penci-ajax-load', function (e, data) {
        window.penci_paywall = window.penci_paywall || {}

        window.penci_paywall = {
            init: function () {
                var base = this

                base.container = $('body')
                base.user_login = base.container.hasClass('logged-in')
                base.form_login = base.container.find('.pencipw_accountlink')
                base.xhr = null
                base.login_button = base.container.find('.pencipw_login a')
                base.package_item_button = base.container.find('.elementor-widget-penci-paywall .penci-pricing-table .button')
                base.path = (pencipw_var.site_slug === undefined) ? '/' : pencipw_var.site_slug
                base.domain = (pencipw_var.site_domain === undefined) ? window.location.hostname : pencipw_var.site_domain

                base.set_event()

                document.cookie = 'paywall_product = false; path = ' + base.path + '; domain = ' + base.domain + '; secure'
            },

            set_event: function () {
                var base = this
                /**
                 * Unlock Popup
                 */
                base.container.find('.pencipw_paywall_unlock_post').off('click').on('click', function (e) {
                    base.post_id = $(this).data('id')
                    base.open_form(e, '#pencipw_unlock_popup')
                })

                base.container.find('#pencipw_unlock_popup .btn.yes').off('click').on('click', function (e) {
                    e.preventDefault()
                    e.stopPropagation()
                    var $element = $(this),
                        ajax_data = {
                            unlock_post_id: '1',
                            action: 'paywall_handler',
                            post_id: base.post_id
                        }
                    $element.find('.fa-spinner').show();
                    $element.find('span').hide();
                    if (base.xhr !== null) {
                        base.xhr.abort()
                    }
                    base.paywall_ajax(ajax_data)
                })

                base.container.find('#pencipw_unlock_popup .btn.no').off('click').on('click', function (e) {
                    $.magnificPopup.close()
                })

                /**
                 * Cancel Subscription
                 */
                base.container.find('.pencipw_manage_status .subscription').off('click').on('click', function (e) {
                    base.open_form(e, '#pencipw_cancel_subs_popup')
                })

                base.container.find('#pencipw_cancel_subs_popup .btn.yes').off('click').on('click', function (e) {
                    e.preventDefault()
                    e.stopPropagation()
                    var $element = $(this),
                        ajax_data = {
                            cancel_subscription: 'yes',
                            action: 'cancel_subs_handler',
                        }
                    $element.find('.fa-spinner').show();
                    $element.find('span').hide();
                    if (base.xhr !== null) {
                        base.xhr.abort()
                    }
                    base.paywall_ajax(ajax_data)
                })

                base.container.find('#pencipw_cancel_subs_popup .btn.no').off('click').on('click', function (e) {
                    $.magnificPopup.close()
                })

                /**
                 * Login Needed
                 */
                if (!base.user_login) {
                    base.login_button.off('click')
                    base.package_item_button.off('click')
                    base.login_button.magnificPopup({
                        items: {
                            src: '#penci-login-popup',
                            type: 'inline',
                            midClick: true,
                            removalDelay: 600,
                            mainClass: 'penci-popup-animation'
                        }
                    });
                    base.package_item_button.magnificPopup({
                        items: {
                            src: '#penci-login-popup',
                            type: 'inline',
                            midClick: true,
                            removalDelay: 600,
                            mainClass: 'penci-popup-animation'
                        }
                    });
                    base.container.find('.pencipw-woo-btn').on('click', function (e) {
                        var $element = $(this),
                            productID = $element.attr('data-product_id'),
                            ajax_data = {
                                product_id: productID,
                                action: 'refresh_checkout_redirect'
                            };

                        document.cookie = 'paywall_product = ' + productID + '; path = ' + base.path + '; domain = ' + base.domain

                        base.xhr = $.ajax({
                            url: pencipw_var.penci_ajax_url,
                            type: 'post',
                            dataType: 'json',
                            data: ajax_data,
                        }).done(function (data) {
                            pencipw_var.login_reload = data.login_reload
                        })

                        $('#penci_loginform form > p:nth-child(2)').text(pencipw_var.paywall_login)
                        $('#penci_registerform form > p:nth-child(2)').text(pencipw_var.paywall_register)
                    })
                } else {
                    base.container.find('.pencipw-woo-btn').off('click').on('click', function (e) {
                        e.preventDefault()
                        e.stopPropagation()
                        var $element = $(this),
                            productID = $element.attr('data-product_id'),
                            ajax_data = {
                                product_id: productID,
                                action: 'add_paywall_product'
                            }
                        $element.find('.fa-spinner').show();
                        $element.find('span').hide();
                        if (base.xhr !== null) {
                            base.xhr.abort()
                        }
                        base.paywall_ajax(ajax_data)
                    })
                }

                base.container.find('.woocommerce-MyAccount-paymentMethods .stripepaywall .delete').off('click').on('click', function (e) {
                    e.preventDefault()
                    e.stopPropagation()
                    var $element = $(this)
                    var sourceID = $element.attr('data-source_id'),
                        ajax_data = {
                            source_id: sourceID,
                            action: 'delete_source_handler'
                        }
                    $element.find('.fa-spinner').show();
                    $element.find('span').hide();
                    if (base.xhr !== null) {
                        base.xhr.abort()
                    }
                    base.paywall_ajax(ajax_data)
                })

                base.container.find('.woocommerce-MyAccount-paymentMethods .stripepaywall .default').off('click').on('click', function (e) {
                    e.preventDefault()
                    e.stopPropagation()
                    var $element = $(this)
                    var sourceID = $element.attr('data-source_id'),
                        ajax_data = {
                            source_id: sourceID,
                            action: 'default_source_handler'
                        }
                    $element.find('.fa-spinner').show();
                    $element.find('span').hide();
                    if (base.xhr !== null) {
                        base.xhr.abort()
                    }
                    base.paywall_ajax(ajax_data)
                })
            },

            paywall_ajax: function (ajaxdata) {
                var base = this
                base.xhr = $.ajax({
                    url: pencipw_var.penci_ajax_url,
                    type: 'post',
                    dataType: 'json',
                    data: ajaxdata,
                }).done(function (data) {
                    if (data.redirect) {
                        window.location.href = data.redirect
                    } else {
                        location.reload()
                    }
                })
            },

            open_form: function (e, popup_id) {
                e.preventDefault()

                $.magnificPopup.open({
                    removalDelay: 500,
                    midClick: true,
                    mainClass: 'mfp-zoom-out mfp-ani-wrap penci-promo-popup-wrapper',
                    type: 'inline',
                    items: {
                        src: popup_id
                    }
                })
            },
        }

        penci_paywall.init()
    })
})(jQuery)