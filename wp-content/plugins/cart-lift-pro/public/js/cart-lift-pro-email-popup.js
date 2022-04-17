(function( $ ) {
    'use strict';
    /**
     * All of the code for your public-facing JavaScript source
     * should reside in this file.
     *
     * Note: It has been assumed you will write jQuery code here, so the
     * $ function reference has been prepared for usage within the scope
     * of this function.
     *
     * This enables you to define handlers, for when the DOM is ready:
     *
     * $(function() {
     *
     * });
     *
     * When the window is loaded:
     *
     * $( window ).load(function() {
     *
     * });
     *
     * ...and/or other possibilities.
     *
     * Ideally, it is not considered best practise to attach more than a
     * single DOM-ready or window-load handler for a particular page.
     * Although scripts in the WordPress core, Plugins and Themes may be
     * practising this, we should strive to set a better example in our own work.
     */

    $(document).ready( function () {
        function isEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        }

        const clEmailPopup = {
            addToCartButton: '',
            init: function () {
                $('.ajax_add_to_cart').on('click', this.showPopUpForm );
                $('.single_add_to_cart_button').on('click', this.showSinglePopUpForm );
                $(document.body).on('click.eddAddToCart', '.edd-add-to-cart', this.showPopUpForm );
                $(document).on('submit', '#cl-email-popup-form', this.storeEmail);
                $(document).on('submit', '#cl-email-popup-form-wc-single', this.storeEmailWCSingle);
                $(document).on('click', '#cl-ignore-email-form', this.ignoreEmailForm);
            },

            showPopUpForm: function (e) {
                if(Cookies.get("cart_lift_ignore_email_popup") === '1') {
                    return;
                }
                e.stopImmediatePropagation();
                e.preventDefault();
                clEmailPopup.addToCartButton = $(this);
                if(cl_pop_up.ignore_popup === '0') {
                    $('#cart-lift-email-popup').addClass('show');
                }
            },

            showSinglePopUpForm: function (e) {
                if(cl_pop_up.ignore_popup === '1') {
                    return;
                }
                if(cl_pop_up.ignore_popup === '0') {
                    e.preventDefault();
                    $('#cart-lift-email-popup').addClass('show');
                }else {
                    $(document).off( 'click', '.single_add_to_cart_button', this.showSinglePopUpForm );
                    $('.single_add_to_cart_button').trigger('click');
                }
            },

            displayPopUpForm: function (e) {
                var data = {
                    action:         "display_email_popup",
                    load_popup:     true,
                    security : cl_pop_up.security,
                };
                if($('#cart-lift-email-popup').length <= 0){
                    $.ajax({
                        type: "post",
                        dataType: 'json',
                        url: cl_pop_up.ajaxurl,
                        data: data,
                        success: function (response) {
                            if (response.success) {
                                var output = response.data;
                                $("body").append(output);
                            }
                        }
                    });
                }
                cl_pop_up.cart_is_empty = '0';

            },

            storeEmail: function(e) {
                e.preventDefault();
                var email = $('#cl-popup-email').val();
                if (!isEmail(email)) {
                    $('.cl-popup-email-invalid-notice').show();
                    return;
                }

                var provider = $("#cl-atc-button").attr('data-provider');

                let data = {
                    'action' : 'cl_store_email',
                    'security' : cl_pop_up.security,
                    'email' : email,
                    'provider': provider
                };
                var $_this = clEmailPopup,
                    page_type = 'wc-shop';
                if($_this.addToCartButton.hasClass('edd-add-to-cart')) {
                    page_type = 'edd-single';
                }else if ($_this.addToCartButton.hasClass('ajax_add_to_cart')) {
                    page_type = 'wc-shop';
                }else if ($_this.addToCartButton.hasClass('single_add_to_cart_button')) {
                    page_type = 'wc-single';
                }
                $.post(
                    cl_pop_up.ajaxurl,
                    data,
                    function (response) {
                        cl_pop_up.ignore_popup = '1';
                        $("#cl-popup-thank-you-notice").show();
                        $("#cart-lift-email-popup").delay(1000).fadeOut();
                        $_this.popupAddToCart(page_type);
                    }
                );
            },

            storeEmailWCSingle: function(e) {
                e.preventDefault();
                var $_this = $(this);
                var email = $('#cl-popup-email').val();
                var provider = $("#cl-atc-button").attr('data-provider');

                let data = {
                    'action' : 'cl_store_email',
                    'security' : cl_pop_up.security,
                    'email' : email,
                    'provider' : provider
                };
                $.post(
                    cl_pop_up.ajaxurl,
                    data,
                    function (response) {
                        cl_pop_up.ignore_popup = '1';
                        $("#cart-lift-email-popup").fadeOut();

                        $(document).off( 'click', '.single_add_to_cart_button', this.showSinglePopUpForm );
                        $('.single_add_to_cart_button').trigger('click');
                    }
                );
            },

            ignoreEmailForm: function (e) {
                e.preventDefault();
                var $_this = clEmailPopup,
                    page_type = 'wc-shop';
                let data = {
                    'action' : 'cl_ignore_email_popup',
                    'security' : cl_pop_up.security,
                };
                $("#cart-lift-email-popup").fadeOut();
                $.post(
                    cl_pop_up.ajaxurl,
                    data,
                    function (response) {
                        cl_pop_up.ignore_popup = '1';
                        $(document).off( 'click', '.single_add_to_cart_button', this.showSinglePopUpForm );
                        $('.single_add_to_cart_button').trigger('click');
                    }
                );
            },

            initCart: function (e) {
                e.preventDefault();
                let data = {
                    'action' : 'cl_reinitialize_popup',
                    'security' : cl_pop_up.security,
                };
                $.post(
                    cl_pop_up.ajaxurl,
                    data,
                    function (response) {

                    }
                );
            },

            popupAddToCart: function (page_type) {
                let el = this.addToCartButton;

                if(page_type === 'wc-shop') {
                    var data,
                        url = cl_pop_up.ajax_url;

                    data = {
                        product_id: el.data('product_id'),
                        quantity: el.data('quantity'),
                        product_sku: el.data('product_sku')
                    };
                    url = '?wc-ajax=add_to_cart';

                    $(document.body).trigger('adding_to_cart', [el, data]);
                    $.ajax({
                        type: 'post',
                        url: url,
                        data: data,
                        beforeSend: function () {
                            el.removeClass('added').addClass('loading');
                        },
                        complete: function () {
                            el.addClass('added').removeClass('loading');
                        },
                        success: function (response) {
                            if (response.fragments && response.cart_hash) {
                                $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, el]);
                            }
                        },
                    });
                }
                else if(page_type === 'edd-single') {
                    $(document).off( 'click', '.edd-add-to-cart', this.showPopUpForm );
                    $('.edd-add-to-cart').trigger('click');
                }


                return false;
            },



            closeEmailPopup: function () {
                $('#cart-lift-email-popup').fadeOut().removeClass("show");
            }
        }

        clEmailPopup.init()
    });

})( jQuery );
