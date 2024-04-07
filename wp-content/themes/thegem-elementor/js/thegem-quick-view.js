(function ($) {

    'use strict';

    let productQuickViewScripts = {
        // Initialization the functions
        init: function () {
            productQuickViewScripts.default();
            productQuickViewScripts.combobox();
            productQuickViewScripts.productVariable();
            productQuickViewScripts.productQuantity();
            productQuickViewScripts.ajaxAddToCart();
            productQuickViewScripts.ajaxAddToWishlist();
            productQuickViewScripts.ajaxRemoveFromWishlist();
        },

        default: function () {
            let $rightColumn = $('.product-quick-view .product-page__right-column');
            setTimeout(function () {
                $rightColumn.css('scroll-behavior', 'auto');
            }, 0);

            let $notifyWrap = $('.thegem-popup-notification-wrap');
            $notifyWrap.css('display', 'block');

            $('.woocommerce-review-link').on('click', function (e) {
                e.preventDefault();
            })
        },

        // Product page combobox
        combobox: function () {
            $(".thegem-select").each(function () {
                let template = '<div class="thegem-combobox">';
                template += '<div class="thegem-combobox__trigger">' + $('option:selected', this).text() + '</div>';
                template += '<div class="thegem-combobox__options">';
                $(this).find("option").each(function () {
                    template += '<div class="thegem-combobox__options-item" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</div>';
                });
                template += '</div></div>';

                if ($(this).parents(".thegem-combobox-wrap").length === 0) {
                    $(this).wrap('<div class="thegem-combobox-wrap"></div>');
                }
                //$(this).hide();
                $(this).after(template);
            });

            $(".thegem-combobox__options-item:first-of-type").hover(function () {
                $(this).parents(".thegem-combobox__options").addClass("hover");
            }, function () {
                $(this).parents(".thegem-combobox__options").removeClass("hover");
            });

            $(".thegem-combobox__trigger").on("click", function (e) {
                e.stopPropagation();

                let $count = $('table.variations tr').length,
                    $table = $('table.variations'),
                    hideIndex = () => {
                        setTimeout(function () {
                            $('tr, td.value', $table).css('z-index', 0);
                        }, 200);
                    };

                $('tr, td.value', $table).css('z-index', 0);
                $(this).parents('tr, td.value').css('z-index', $count);

                if ($(this).parents(".thegem-combobox.opened").length != 0) {
                    $(".thegem-combobox").removeClass("opened");
                    hideIndex();
                    return;
                }

                $('html').one('click', function () {
                    $(".thegem-combobox").removeClass("opened");
                    hideIndex();
                    return;
                });

                $(".thegem-combobox").removeClass("opened");

                $(this).parents(".thegem-combobox").toggleClass("opened");
            });

            $(".thegem-combobox__options-item").on("click", function () {
                $(this).parents(".thegem-combobox-wrap").find("select").val($(this).data("value")).change();
                $(this).parents(".thegem-combobox__options").find(".thegem-combobox__options-item").removeClass("selection");
                $(this).addClass("selection");
                $(this).parents(".thegem-combobox").removeClass("opened");
                $(this).parents(".thegem-combobox").find(".thegem-combobox__trigger").text($(this).text());
            });
        },

        // Product page rating
        rating: function () {
            let isSelected = false,
                $star = $("#reviews.woocommerce-Reviews .stars a");

            $star.click(function (e) {
                isSelected = true;
                $(this).prevAll().andSelf().addClass('rating-on');
                $(this).nextAll().removeClass('rating-on');
            });
            $star.hover(function () {
                $(this).prevAll().andSelf().addClass('rating-on');
                $(this).nextAll().removeClass('rating-on');
            });
            $star.mouseout(function () {
                if (!isSelected) {
                    $star.removeClass('rating-on');
                }
                isSelected = false;
            });
        },

        // Product page variable
        productVariable: function () {
            let $variationForm = $(".variations_form"),
                $combobox = $(".thegem-combobox"),
                $reset = $('.reset_variations'),

                comboboxRefresh = () => {
                    productQuickViewScripts.combobox();
                    $(".thegem-combobox-wrap").find(".thegem-combobox:last-of-type").remove();
                };

            $reset.on('click', function () {
                $variationForm.each(function () {
                    $(this).on('change', '.variations select', function () {
                        comboboxRefresh();

                        let text = $('.thegem-combobox__options-item').eq(0).text();
                        $combobox.find('.thegem-combobox__trigger').text(text);
                    });
                });
            });

            //huck for double submit form
            if (window.history.replaceState) {
                window.history.replaceState(null, null, window.location.href);
            }
        },

        // Product page quantity
        productQuantity: function () {
            let $form = $('form.cart');

            $('div.quantity:not(.buttons_added)', $form).addClass('buttons_added')
                .append('<button type="button" class="plus" >+</button>')
                .prepend('<button type="button" class="minus" >-</button>');
        },

        // Product page ajax add to cart
        ajaxAddToCart: function () {
            let $wrapper = $('.product-quick-view__wrapper');

            $wrapper.on('click', '.single_add_to_cart_button', function (e, fragments, cart_hash) {
                e.preventDefault();

                let $thisButton = $(this),
                    $form = $thisButton.closest('form.cart'),
                    id = $thisButton.val(),
                    productQty = $form.find('input[name=quantity]').val() || 1,
                    productId = $form.find('input[name=product_id]').val() || id,
                    variationId = $form.find('input[name=variation_id]').val() || 0;

                let item = {};
                $form.find('select[name^=attribute]').each(function () {
                    let attribute = $(this).attr("name");
                    let attributeVal = $(this).val();

                    item[attribute] = attributeVal;
                });

                let data = {
                    action: 'woocommerce_ajax_add_to_cart',
                    product_id: productId,
                    product_sku: '',
                    quantity: productQty,
                    variation_id: variationId,
                    variation: item,
                };

                if ($form.find('input[name=variation_id]').length > 0 && variationId == 0) {
                    return false;
                }

                $(document.body).trigger('adding_to_cart', [$thisButton, data]);

                $.ajax({
                    type: 'post',
                    url: wc_add_to_cart_params.ajax_url,
                    data: data,
                    success: function (response) {
                        if (response.error && response.product_url) {
                            window.location = response.product_url;
                            return;
                        } else {
                            let $addToCartTarget = $(e.currentTarget).parents('.product-quick-view__wrapper');

                            if ($addToCartTarget) {
                                $('.thegem-popup-notification', $wrapper).removeClass('show');

                                let $cartPopupAdd = $addToCartTarget.find('.thegem-popup-notification.cart');
                                $cartPopupAdd.addClass('show');
                                setTimeout(function () {
                                    $cartPopupAdd.removeClass('show');
                                }, $cartPopupAdd.data('timing'));
                            }

                            $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $thisButton]);
                            $('.added_to_cart').hide();
                        }
                    },
                });

                return false;
            });
        },

        // Product page ajax add to wishlist
        ajaxAddToWishlist: function () {
            let $wrapper = $('.product-quick-view__wrapper');

            $wrapper.on('click', '.add_to_wishlist', function () {
                let $wishlistTarget = $(this).parents('.product-quick-view__wrapper');

                if ($wishlistTarget) {
                    $('.thegem-popup-notification', $wrapper).removeClass('show');

                    let $wishlistPopupAdd = $wishlistTarget.find('.thegem-popup-notification.wishlist-add');
                    $wishlistPopupAdd.addClass('show');
                    setTimeout(function () {
                        $wishlistPopupAdd.removeClass('show');
                    }, $wishlistPopupAdd.data('timing'));
                }
            });
        },

        // Product page ajax remove from wishlist
        ajaxRemoveFromWishlist: function () {
            let $wrapper = $('.product-quick-view__wrapper');

            $wrapper.on('click', '.remove_from_wishlist', function (e, fragments, cart_hash) {
                let $wishlistTarget = $(this).parents('.product-quick-view__wrapper');

                if ($wishlistTarget) {
                    $('.thegem-popup-notification', $wrapper).removeClass('show');

                    let $wishlistPopupRemove = $wishlistTarget.find('.thegem-popup-notification.wishlist-remove');
                    $wishlistPopupRemove.addClass('show');
                    setTimeout(function () {
                        $wishlistPopupRemove.removeClass('show');
                    }, $wishlistPopupRemove.data('timing'));
                }
            });
        },
    };

    // Run the function
    $(function () {
        productQuickViewScripts.init();

        $.fn.initProductQuickViewScripts = function () {
            productQuickViewScripts.init();
        };
    });

})(jQuery);
