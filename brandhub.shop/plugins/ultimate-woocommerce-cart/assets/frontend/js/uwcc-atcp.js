jQuery(document).ready(function ($) {

    $('.uwcc-product-popup-body').mCustomScrollbar({
        theme: 'dark-thin',
        scrollbarPosition: 'outside'
    });

    //On add to cart
    $(document.body).on('added_to_cart', function () {
        if ($('.uwcc-product-popup').hasClass('uwcc-popup-in-view') || $('.uwcc-product-popup').hasClass('uwcc-active')) {
            return;
        }
        if ($(document).find('.uwcc-product-popup').hasClass('uwcc-cartpop-animation-enabled')) {
            var $popup = $(document).find('.uwcc-product-popup');
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
            $('.uwcc-product-popup').toggleClass('uwcc-active');
        }
    });

    $(document.body).on('added_to_cart wc_fragments_loaded', function () {
        setTimeout(function () {
            if ($(document).find('.uwcc-product-slide.owl-carousel').length > 0) {
                var params = JSON.parse($('.uwcc-product-slide.owl-carousel').attr('data-params'));

                $(document).find('.uwcc-product-slide.owl-carousel').owlCarousel({
                    loop: JSON.parse(params.loop),
                    autoplay: JSON.parse(params.autoplay),
                    autoplayTimeout: params.pause,
                    autoplayHoverPause: JSON.parse(params.pause_on_hover),
                    nav: JSON.parse(params.arrows),
                    dots: JSON.parse(params.dots),
                    margin: 20,
                    rtl: JSON.parse(uwcc_atcp_obj.rtl),
                    responsive: {
                        0: {
                            items: 1
                        },
                        580: {
                            items: 2
                        },
                        768: {
                            items: params.items
                        }
                    }
                });
            }
        }, 100);
    });

    $(document).on('click', '.uwcc-product-popup-close, .uwcc-product-popup-overlay, .uwcc-product-popup .uwcc-product-continue-shoping-btn', function () {
        if ($(document).find('.uwcc-product-popup').hasClass('uwcc-cartpop-animation-enabled')) {
            var $popup = $(document).find('.uwcc-product-popup');
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
            $('.uwcc-product-popup').toggleClass('uwcc-active');
        }
        return false;
    });

    //Update cart
    function update_cart(cart_key, new_qty) {
        $('.uwcc-product-popup-inner').append('<div class="uwcc-loader-wrap"><span class="uwcc-loader"></span></div>');
        $.ajax({
            url: uwcc_atcp_obj.wc_ajax_url.toString().replace('%%endpoint%%', 'uwcc_update_cart'),
            type: 'POST',
            data: {
                cart_key: cart_key,
                new_qty: new_qty
            },
            success: function (response) {
                if (response.fragments) {
                    var fragments = response.fragments,
                            cart_hash = response.cart_hash;

                    //Set fragments
                    $.each(response.fragments, function (key, value) {
                        $(key).replaceWith(value);
                    });
                    if (wc_cart_fragments_params) {
                        var cart_hash_key = wc_cart_fragments_params.ajax_url.toString() + '-wc_cart_hash';
                        //Set cart hash
                        sessionStorage.setItem(wc_cart_fragments_params.fragment_name, JSON.stringify(fragments));
                        localStorage.setItem(cart_hash_key, cart_hash);
                        sessionStorage.setItem(cart_hash_key, cart_hash);
                    }
                    $(document.body).trigger('wc_fragments_loaded');
                    $('.uwcc-loader-wrap').fadeOut().remove();
                } else {
                    console.log(response);
                }
            }
        });
    }

    //Qty input on change
    $(document).on('change', '.uwcc-product-input', function (e) {
        var new_qty = parseFloat($(this).val());
        var step = parseFloat($(this).attr('step'));
        var max_value = parseFloat($(this).attr('max'));
        var invalid = false;

        if (new_qty === 0) {
            $(this).parents('.uwcc-product-popup-wrap').find('.uwcc-product-remove').trigger('click');
            return;
        }

        //Check If valid number
        else if (isNaN(new_qty) || new_qty < 0) {
            invalid = true;
        }

        //Check maximum quantity
        else if (new_qty > max_value && max_value > 0) {
            invalid = true;
        }

        //Check Step
        else if ((new_qty % step) !== 0) {
            alert('Quantity can only be purchased in multiple of ' + step);
            invalid = true;
        }

        //Update if everything is fine.
        else {
            var cart_key = $(this).parents('.uwcc-product-details').data('uwcc_key');
            update_cart(cart_key, new_qty);
        }
    });

    //Plus minus buttons
    $(document).on('click', '.uwcc-change-qty', function () {
        var $button = $(this);
        var $input = $button.siblings('.uwcc-product-input');
        $input.trigger('focusin');
        var input_qty = parseFloat($input.val());
        var step = parseFloat($input.attr('step'));
        var min_value = parseFloat($input.attr('min'));
        var max_value = parseFloat($input.attr('max'));

        if ($button.hasClass('uwcc-product-qty-plus')) {
            var new_qty = input_qty + step;
            if (new_qty > max_value && max_value > 0) {
                alert('Maximum Quantity: ' + max_value);
                return;
            }
        } else if ($button.hasClass('uwcc-product-qty-minus')) {
            var new_qty = input_qty - step;
            if (new_qty === 0) {
                $button.parents('.uwcc-product-pdetails').find('.uwcc-product-remove .uwcc-product-icon').trigger('click');
                return;
            } else if (new_qty < min_value) {
                return;
            } else if (input_qty < 0) {
                alert('Invalid');
                return;
            }
        }
        var cart_key = $(this).parents('.uwcc-product-details').data('uwcc_key');
        update_cart(cart_key, new_qty);
    });

    //Remove item from cart
    $(document).on('click', '.uwcc-product-remove', function (e) {
        e.preventDefault();
        var cart_key = $(this).parents('.uwcc-product-popup-wrap').find('.uwcc-product-details').data('uwcc_key');
        update_cart(cart_key, 0);
    });

});