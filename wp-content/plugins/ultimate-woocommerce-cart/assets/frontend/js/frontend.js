(function ($) {
    'use strict';

    $(document).ready(function () {

        var ajaxUrl = uwcc_frontend_js_obj.ajax_url;
        var wpNonce = uwcc_frontend_js_obj.ajax_nonce;
        var iframe_src = uwcc_frontend_js_obj.iframe_src;

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'uwcc_get_refresh_fragments',
                wp_nonce: wpNonce
            },
            success: function (response) {

                if (response.fragments) {

                    //Set fragments
                    $.each(response.fragments, function (key, value) {
                        $(key).replaceWith(value);
                    });

                    if (('sessionStorage' in window && window.sessionStorage !== null)) {

                        sessionStorage.setItem(wc_cart_fragments_params.fragment_name, JSON.stringify(response.fragments));
                        sessionStorage.setItem(wc_cart_fragments_params.cart_hash_key, response.cart_hash);
                        localStorage.setItem(wc_cart_fragments_params.cart_hash_key, response.cart_hash);

                        if (response.cart_hash) {
                            sessionStorage.setItem('wc_cart_created', (new Date()).getTime());
                        }
                    }

                    $(document.body).trigger('wc_fragments_refreshed');
                }
            }
        });

        $('.uwcc-scrollbar-on').find('.uwcc-body').mCustomScrollbar({
            theme: 'dark-thin',
            scrollbarPosition: 'outside'
        });

        $('.uwcc-scrollbar-on').find('.uwcc-cart-popup-inner-section-checkout > .woocommerce').mCustomScrollbar({
            theme: 'dark-thin',
            scrollbarPosition: 'outside'
        });

        $('.uwcc-elementor-active.uwcc-scrollbar-on').find('.uwcc-checkout-elementor-container').mCustomScrollbar({
            theme: 'dark-thin',
            scrollbarPosition: 'outside'
        });

        $('body').find('[class^="uwcc-open-cart-"], [class*=" uwcc-open-cart-"]').on('click', function (e) {
            var classes = $(this).attr('class').split(' ');
            var classitem;
            $.each(classes, function (index, item) {
                if (item.indexOf('uwcc-open-cart-') >= 0) {
                    classitem = item;
                    return false;
                }
            });

            var $id = $('#uwcc-main-wrapper-' + classitem.replace(/^\D+/g, ''));

            if ($id.length > 0) {
                $id.find('.uwcc-toggle-button').trigger('click');
            }
        });

        $('body').find('.uwcc-toggle-button').on('click', function () {
            // Add Toggle class on buton toggle
            $(this).closest('.uwcc-main-wrapper').toggleClass('uwcc-cartbasket-open');
            $(this).toggleClass('uwcc-toggle-btn-open');
            var $popup = $(this).next('.uwcc-cart-popup');

            /*Add/Remove sff-freeze class to HTML*/
            if ($(this).closest('.uwcc-main-wrapper').hasClass('uwcc-freeze-scrollbar-on')) {
                $('html').toggleClass('uwcc-freeze');
            }

            if ($popup.hasClass('uwcc-cartpop-animation-enabled')) {
                var showAnimation = $popup.data('showanimation');
                var hideAnimation = $popup.data('hideanimation');

                if ($popup.hasClass('uwcc-popup-in-view') && hideAnimation) {
                    $popup.addClass('animate--animated ' + hideAnimation);
                    $popup.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
                        $popup.removeClass('animate--animated uwcc-popup-in-view ' + hideAnimation);
                    });
                } else if (!$popup.hasClass('uwcc-popup-in-view') && showAnimation) {
                    $popup.addClass('animate--animated uwcc-popup-in-view ' + showAnimation);
                    $popup.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
                        $popup.removeClass('animate--animated ' + showAnimation);
                    });
                } else if ($popup.hasClass('uwcc-popup-in-view')) {
                    $popup.removeClass('uwcc-popup-in-view');
                } else {
                    $popup.addClass('uwcc-popup-in-view');
                }
            } else {
                $(this).next('.uwcc-cart-popup').toggleClass('uwcc-active');
            }
        });

        $('body').find('.uwcc-cart-close, .uwcc-main-wrapper-bg').on('click', function () {
            $(document.body).trigger('wc_fragment_refresh');
            $(this).closest('.uwcc-main-wrapper').find('.uwcc-toggle-button').trigger('click');
            $(this).closest('.uwcc-main-wrapper').find('.uwcc-cart-popup-inner-section-cart').addClass('uwcc-active');
            $(this).closest('.uwcc-main-wrapper').find('.uwcc-cart-popup-inner-section-checkout').removeClass('uwcc-active');
            return false;
        });

        $('body').on('click', '.uwcc-el-remove-all-cart-items, .uwcc-remove-all-cart-items', function (e) {
            e.preventDefault();
            $(this).closest('.uwcc-cart-popup').append('<div class="uwcc-loader-wrap"><span class="uwcc-loader"></span></div>');
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: ajaxUrl,
                data: {
                    action: 'uwcc_clear_all_cart',
                    wp_nonce: wpNonce
                },
                success: function (response) {

                    if (!response || response.error) {
                        return;
                    }

                    var fragments = response.fragments;

                    // Replace fragments
                    if (fragments) {
                        $.each(fragments, function (key, value) {
                            $(key).replaceWith(value);
                        });
                    }

                    $(document.body).trigger('uwcc_change_slider_products');

                    $('.uwcc-loader-wrap').fadeOut().remove();
                }
            });
        });

        // Image animation movement when add to cart button is clicked
        // And Open panel
        $(document).on('click', '.add_to_cart_button', function () {
            var cart = $('.uwcc-toggle-button:first').find('.uwcc-toggle-open-btn');

            if (cart.length && cart.is(':visible')) {
                var imgtodrag = $(this).closest('.product').find('img').eq(0);

                if (imgtodrag.length) {
                    var imgclone = imgtodrag.clone()
                            .offset({
                                top: imgtodrag.offset().top,
                                left: imgtodrag.offset().left
                            })
                            .css({
                                'opacity': '0.8',
                                'position': 'absolute',
                                'height': '150px',
                                'width': '150px',
                                'z-index': '100'
                            })
                            .appendTo($('body'))
                            .animate({
                                'top': cart.offset().top + 10,
                                'left': cart.offset().left + 10,
                                'width': 75,
                                'height': 75
                            }, 1000);

                    setTimeout(function () {
                        cart.effect('shake', {
                            times: 2,
                            distance: 150
                        }, 200);
                    }, 1500);

                    imgclone.animate({
                        'width': 0,
                        'height': 0
                    }, function () {
                        $(this).detach()
                    });
                }
            }

            if ($('.uwcc-cart-popup-inner-section-checkout').hasClass('uwcc-active')) {
                $('.uwcc-cart-popup-inner-section-cart').addClass('uwcc-active');
                $('.uwcc-cart-popup-inner-section-checkout').removeClass('uwcc-active');
            }

            setTimeout(function () {
                if (!$('.uwcc-toggle-button.uwcc-open-on-add-to-cart').closest('.uwcc-main-wrapper').hasClass('uwcc-cartbasket-open')) {
                    $('.uwcc-toggle-button.uwcc-open-on-add-to-cart').trigger('click');
                }
            }, 2000);
        });

        // Open cart on clicking view cart button
        $(document).on('click', '.added_to_cart', function (e) {
            if ($('.uwcc-main-wrapper').length) {
                e.preventDefault();
                $(document).find('.uwcc-toggle-button:first').trigger('click');
            }
        });

        $(document).on('click', '.uwcc-remove', function (e) {
            e.preventDefault();

            $(this).closest('.uwcc-cart-popup').append('<div class="uwcc-loader-wrap"><span class="uwcc-loader"></span></div>');

            var cart_item_id = $(this).attr('data-cart_item_id'),
                    cart_item_key = $(this).attr('data-cart_item_key');

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: ajaxUrl,
                data: {
                    action: 'uwcc_remove_item',
                    cart_item_id: cart_item_id,
                    cart_item_key: cart_item_key,
                    wp_nonce: wpNonce
                },
                success: function (response) {

                    if (!response || response.error) {
                        return;
                    }

                    var fragments = response.fragments;

                    // Replace fragments
                    if (fragments) {
                        $.each(fragments, function (key, value) {
                            $(key).replaceWith(value);
                        });
                    }

                    $(document.body).trigger('uwcc_change_slider_products');

                    $('.uwcc-loader-wrap').fadeOut().remove();
                }
            });
        });

        // This function runs after the item is added to cart
        $(document.body).on('added_to_cart uwcc_change_slider_products', function (e, fragments, cart_hash, this_button) {
            if ($('.uwcc-suggested-items-wrap').length) {
                $('.uwcc-suggested-items-wrap').each(function () {
                    var $slider = $(this);
                    var post_id = $slider.data('id');
                    var settings = $slider.data('settings');

                    $(document.body).trigger('update_checkout');

                    $.ajax({
                        url: ajaxUrl,
                        type: 'POST',
                        data: {
                            action: 'uwcc_change_slider_products',
                            post_id: post_id,
                            settings: settings,
                            wp_nonce: wpNonce
                        },
                        success: function (res) {
                            $slider.html(res);

                            if ($slider.find('.uwcc-slide.owl-carousel').length > 0) {
                                var params = JSON.parse($slider.find('.uwcc-slide.owl-carousel').attr('data-params'));

                                $slider.find('.uwcc-slide.owl-carousel').owlCarousel({
                                    items: params.items,
                                    loop: JSON.parse(params.loop),
                                    autoplay: JSON.parse(params.autoplay),
                                    autoplayTimeout: params.pause,
                                    autoplayHoverPause: JSON.parse(params.pause_on_hover),
                                    nav: JSON.parse(params.arrows),
                                    dots: JSON.parse(params.dots),
                                    margin: 15,
                                    rtl: JSON.parse(uwcc_frontend_js_obj.rtl),
                                    responsive: {
                                        0: {
                                            items: params.items_mobile
                                        },
                                        768: {
                                            items: params.items_tablet
                                        },
                                        900: {
                                            items: params.items
                                        }
                                    }
                                });
                            }
                        }
                    });
                });
            }
        });

        // Apply Discount Coupons
        $('body').find('.uwcc-coupon-submit').on('click', function (e) {
            e.preventDefault();
            var $button = $(this);
            var couponCode = $button.prev('.uwcc-coupon-code-input').val();
            $button.addClass('uwcc-button-loading');
            $.ajax({
                url: ajaxUrl,
                type: 'POST',
                data: {
                    action: 'add_coupon_code',
                    couponCode: couponCode,
                    wp_nonce: wpNonce
                },
                success: function (response) {
                    var $responseField = $button.closest('.uwcc-coupon').find('.uwcc-cpn-resp');
                    $responseField.html(response.msg);
                    if (response.result == 'not valid' || response.result == 'already applied') {
                        $responseField.css({'background-color': '#e2401c', 'color': '#fff'});
                    } else {
                        $responseField.css({'background-color': '#0f834d', 'color': '#fff'});
                    }
                    $responseField.fadeIn().delay(2000).fadeOut();
                    $(document.body).trigger('wc_fragment_refresh');
                    $(document.body).trigger('update_checkout');
                    $button.removeClass('uwcc-button-loading');
                }
            });
        });

        // Apply Discount Coupons by Direct CLick
        $(document).on('click', '.uwcc-apply-available-coupon', function (e) {
            $(this).closest('.uwcc-cart-popup').append('<div class="uwcc-loader-wrap"><span class="uwcc-loader"></span></div>');
            var $button = $(this);
            var couponCode = $button.attr('data-uwcc-coupon-code');
            if (!couponCode) {
                return;
            }
            $button.closest('.uwcc-cart-popup').find('.uwcc-coupon-code-input').val(couponCode).trigger('change');
            $button.closest('.uwcc-cart-popup').find('.uwcc-coupon-submit').trigger('click');
            $button.closest('.uwcc-cart-popup').find('.uwcc-coupon-code-input').val('');
            setTimeout(function () {
                $('.uwcc-loader-wrap').fadeOut().remove();
            }, 2000);
        });

        // Remove Applied Discount Coupons
        $('body').on('click', '.uwcc-remove-cpn', function () {

            $(this).closest('.uwcc-cart-popup').append('<div class="uwcc-loader-wrap"><span class="uwcc-loader"></span></div>');
            var couponCode = $(this).parent('li').attr('data-code'),
                    $removeBtn = $(this);

            $.ajax({
                url: ajaxUrl,
                type: 'POST',
                data: {
                    action: 'uwcc_remove_coupon_code',
                    couponCode: couponCode,
                    wp_nonce: wpNonce
                },
                success: function (response) {
                    var $responseField = $removeBtn.closest('.uwcc-coupon').find('.uwcc-cpn-resp');
                    $responseField.html(response);
                    $responseField.css({'background-color': '#0f834d', 'color': '#fff'});
                    $responseField.fadeIn().delay(2000).fadeOut();
                    $(document.body).trigger('wc_fragment_refresh');
                    $(document.body).trigger('update_checkout');
                    setTimeout(function () {
                        $('.uwcc-loader-wrap').fadeOut().remove();
                    }, 1000);
                }
            });

        });

        $(document).on('click', '.uwcc-qty-plus, .uwcc-qty-minus', function () {
            // Get values
            var $qty = $(this).closest('.uwcc-item-qty').find('.qty'),
                    currentVal = parseFloat($qty.val()),
                    max = parseFloat($qty.attr('max')),
                    min = parseFloat($qty.attr('min')),
                    step = $qty.attr('step');

            // Format values
            if (!currentVal || currentVal === '' || currentVal === 'NaN')
                currentVal = 0;
            if (max === '' || max === 'NaN')
                max = '';
            if (min === '' || min === 'NaN')
                min = 0;
            if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN')
                step = 1;

            // Change the value
            if ($(this).is('.uwcc-qty-plus')) {
                if (max && (currentVal >= max)) {
                    $qty.val(max);
                } else {
                    $qty.val(currentVal + parseFloat(step));
                }
            } else {
                if (min && (currentVal <= min)) {
                    $qty.val(min);
                } else if (currentVal > 0) {
                    $qty.val(currentVal - parseFloat(step));
                }
            }

            // Trigger change event
            $qty.trigger('change');
        });

        // Quantity change 
        $('body').on('change', 'input[name="uwcc-qty-input"]', function () {
            // Get values
            var $qty = $(this),
                    currentVal = parseFloat($qty.val()),
                    max = parseFloat($qty.attr('max')),
                    min = parseFloat($qty.attr('min')),
                    step = $qty.attr('step');

            // Format values
            if (!currentVal || currentVal === '' || currentVal === 'NaN')
                currentVal = 0;
            if (max === '' || max === 'NaN')
                max = '';
            if (min === '' || min === 'NaN')
                min = 0;
            if (max && (currentVal >= max)) {
                $qty.val(max);
            }
            if (!min === 0 && (min && (currentVal <= min))) {
                $qty.val(min);
            }

            $(this).closest('.uwcc-cart-popup').append('<div class="uwcc-loader-wrap"><span class="uwcc-loader"></span></div>');

            var qty = $(this).val();
            var ckey = $(this).closest('.uwcc-cart-items').data('ckey');

            $(this).prop('disabled', true);

            $.ajax({
                url: ajaxUrl,
                type: 'POST',
                data: 'action=change_item_qty&ckey=' + ckey + '&qty=' + qty + '&wp_nonce=' + wpNonce,
                success: function (response) {
                    $(this).prop('disabled', false);
                    $(document.body).trigger('wc_fragment_refresh');
                    setTimeout(function () {
                        $(document.body).trigger('uwcc_change_slider_products');
                        $('.uwcc-loader-wrap').fadeOut().remove();
                    }, 1000);
                }
            });
        });

        // Suggested Product Carousel
        if ($('.uwcc-cpt-active').find('.uwcc-slide.owl-carousel').length > 0) {
            $('.uwcc-cpt-active').find('.uwcc-slide.owl-carousel').each(function () {
                var $slider = $(this);
                var params = JSON.parse($slider.attr('data-params'));

                $slider.owlCarousel({
                    items: params.items,
                    loop: JSON.parse(params.loop),
                    autoplay: JSON.parse(params.autoplay),
                    autoplayTimeout: params.pause,
                    autoplayHoverPause: JSON.parse(params.pause_on_hover),
                    nav: JSON.parse(params.arrows),
                    dots: JSON.parse(params.dots),
                    margin: 15,
                    rtl: JSON.parse(uwcc_frontend_js_obj.rtl),
                    responsive: {
                        0: {
                            items: params.items_mobile
                        },
                        768: {
                            items: params.items_tablet
                        },
                        900: {
                            items: params.items
                        }
                    }
                });
            });
        }

        $('body').find('.uwcc-coupons-lists-wrap h4').on('click', function () {
            $(this).parent().find('.uwcc-coupons-lists').slideToggle();
        });

        $('body').on('click', '.uwcc-continue-shoping-btn, .uwcc-cart-button a', function () {
            if ($(this).attr('href') == '#') {
                $(this).closest('.uwcc-main-inner-wrapper').find('.uwcc-toggle-button').trigger('click');
                return false;
            }
        });

        $('body').on('click', '.uwcc-direct-checkout-on .uwcc-checkout-btn', function (e) {
            e.preventDefault();
            var $mainWrapper = $(this).closest('.uwcc-main-wrapper');
            $mainWrapper.find('.uwcc-cart-popup').append('<div class="uwcc-loader-wrap"><span class="uwcc-loader"></span></div>');

            $(document.body).trigger('update_checkout');

            var iframeCheckout = $mainWrapper.find('.uwcc-checkout-iframe');

            if (iframeCheckout.length) {
                var cartid = $mainWrapper.attr('id').substr(18);

                if ($mainWrapper.hasClass('uwcc-elementor-active')) {
                    $mainWrapper.find('.uwcc-checkout-iframe').attr('src', iframe_src + '&cart_id=' + cartid + '&elementor_active=1');
                } else {
                    $mainWrapper.find('.uwcc-checkout-iframe').attr('src', iframe_src + '&cart_id=' + cartid);
                }

                $mainWrapper.find('.uwcc-checkout-iframe').load(function () {
                    $mainWrapper.find('.uwcc-cart-popup-inner-section-cart').removeClass('uwcc-active');
                    $mainWrapper.find('.uwcc-cart-popup-inner-section-checkout').addClass('uwcc-active');
                    $('.uwcc-loader-wrap').fadeOut().remove();
                });
            } else {
                setTimeout(function () {
                    $mainWrapper.find('.uwcc-cart-popup-inner-section-cart').removeClass('uwcc-active');
                    $mainWrapper.find('.uwcc-cart-popup-inner-section-checkout').addClass('uwcc-active');
                    $('.uwcc-loader-wrap').fadeOut().remove();
                }, 2000);
            }
        });

        $('body').on('click', '.uwcc-back-to-cart', function (e) {
            e.preventDefault();
            $(document.body).trigger('wc_fragment_refresh');
            var $popup = $(this).closest('.uwcc-cart-popup');
            $popup.append('<div class="uwcc-loader-wrap"><span class="uwcc-loader"></span></div>');
            setTimeout(function () {
                $popup.find('.uwcc-cart-popup-inner-section-cart').addClass('uwcc-active');
                $popup.find('.uwcc-cart-popup-inner-section-checkout').removeClass('uwcc-active');
                $('.uwcc-loader-wrap').fadeOut().remove();
            }, 1000);
        });

        $(document).on('wc_fragments_refreshed load', function () {
            $(document).trigger('uwcc_checkout_refresh');
        });

        $(document.body).on('change', 'select[name="billing_state"], input[name="billing_postcode"], input[name="billing_city"]', function () {
            $('body').trigger('update_checkout');
            setTimeout(function () {
                $(document.body).trigger('wc_fragment_refresh');
            }, 2000);
        });

    });

})(jQuery);