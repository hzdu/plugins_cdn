(function ($) {

    'use strict';

    const isAjaxLoad = $('.thegem-te-product-add-to-cart').data('ajax-load');
    const isExternalProduct = $('.product-page__wrapper.product-type-external').length > 0;
    const isGroupedProduct = $('.product-page__wrapper.product-type-grouped').length > 0;
    const isSubscriptionProduct = $('.product-page__wrapper.has-subscription-plans').length > 0;

    const stickyHeaderTemplate = (state) => {
        const $stickyTemplate = $('.header-sticky-template')
        const isIos = window.gemBrowser.platform.name === 'ios'

        if (isIos && state === 'show') {
            $stickyTemplate.css({'visibility': 'visible', 'opacity': '1'})
        }

        if (isIos && state === 'hide') {
            $stickyTemplate.css({'visibility': 'hidden', 'opacity': '0'})
        }
    }

    const productScripts = {
        // Initialization the functions
        init: function () {
            productScripts.descriptionTabs();
            productScripts.productVariables();
            productScripts.productRating();
            if (isAjaxLoad) {
                productScripts.ajaxAddToCart();
            }
            productScripts.ajaxAddToWishlist();
            productScripts.ajaxRemoveFromWishlist();
            productScripts.prepareWishlistIcons();
            productScripts.scrollToReviews();
            productScripts.onResize();
        },

        // Product page tabs
        descriptionTabs: () => {
            $('.thegem-te-product-tabs').each((i, tab) => {
                const $wrapper = $('.product-tabs, .product-accordion, .product-one-by-one', tab);
                const $tabsNavItems = $('.product-tabs__nav-item', $wrapper);
                const $accordionNavItems = $('.product-accordion__item-title', $wrapper);
                const isVerticalTabs = $wrapper.data("type") === 'vertical';
                const activeClassTab = 'product-tabs__nav-item--active';
                const activeClassAcc = 'product-accordion__item--active';

                // Tabs navigate change animate line
                const animationLine = ($items, $lines) => {
                    $items.each((i, item) => {
                        $lines.each((i, line) => {
                            if (isVerticalTabs) {
                                line.style.top = item.offsetTop + 'px';
                                line.style.height = item.offsetHeight + 'px';
                            } else {
                                line.style.left = item.offsetLeft + 'px';
                                line.style.width = item.offsetWidth + 'px';
                            }
                        })
                    });
                };

                // Tabs navigate item click
                $tabsNavItems.each((i, item) => {
                    // Animation line init
                    let $activeItems, $activeLines;

                    if ($(item).is('.product-tabs__nav-item--active')) {
                        $activeItems = $(item);
                        $activeLines = $(item).parents('.product-tabs__nav').find('.product-tabs__nav-slide');

                        setTimeout(() => {
                            animationLine($activeItems, $activeLines);
                        }, 50)
                        setTimeout(() => {
                            $('.product-tabs__nav-slide').css('opacity', '1');
                        }, 300)
                    }

                    // Tabs navigate item click
                    $(item).on('click', (e) => {
                        const $self = $(e.currentTarget);
                        const currentAttrValue = '.' + $self.data('id');

                        $self.parents('.thegem-te-product-tabs')
                            .find('.product-accordion__item-title')
                            .removeClass(activeClassAcc).next().hide();

                        $self.parents('.thegem-te-product-tabs')
                            .find('.product-accordion__item-title')
                            .filter(currentAttrValue).addClass(activeClassAcc).next().show();

                        // Change animation line after click
                        $self.parents('.thegem-te-product-tabs')
                            .find('.product-tabs__nav-item').removeClass(activeClassTab);
                        $self.addClass(activeClassTab);

                        $activeItems = $self;
                        $activeLines = $self.parents('.product-tabs__nav').find('.product-tabs__nav-slide');
                        animationLine($activeItems, $activeLines);

                        if (window.tgpLazyItems !== undefined) {
                            window.tgpLazyItems.scrollHandle();
                        }
                    });
                });

                // Accordion navigate item click
                $accordionNavItems.each((i, item) => {
                    $(item).on('click', (e) => {
                        const $self = $(e.currentTarget);
                        const currentAttrValue = '.' + $self.data('id');

                        if ($(window).width() < 768) {
                            setTimeout(() => {
                                const topPosition = $self.offset().top;
                                window.scrollTo({top: topPosition});
                            }, 250);
                        }

                        if ($self.is('.product-accordion__item--active')) {
                            $self.removeClass(activeClassAcc).next().slideUp(300);
                            return;
                        }

                        $self.parents('.thegem-te-product-tabs')
                            .find('.product-accordion__item-title')
                            .removeClass(activeClassAcc).next().slideUp(300);


                        $self.parents('.thegem-te-product-tabs')
                            .find('.product-accordion__item-title')
                            .filter(currentAttrValue).addClass(activeClassAcc).next().slideDown(300);

                        if (window.tgpLazyItems !== undefined) {
                            window.tgpLazyItems.scrollHandle();
                        }
                    });
                });
            });
        },

        // Product page variables
        productVariables: () => {
            const $formCart = $('form.cart');
            const $variationForm = $(".variations_form");
            const $combobox = $(".thegem-combobox");
            const $reset = $('.reset_variations');

            let isComboboxInit = false;

            // Combobox
            const combobox = () => {
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
            };

            // Combobox init
            const comboboxInit = () => {
                if (!isComboboxInit) {
                    setTimeout(() => combobox(), 250);
                    isComboboxInit = true;
                }
            };

            // Combobox refresh
            const comboboxRefresh = () => {
                combobox();
                $(".thegem-combobox-wrap").find(".thegem-combobox:last-of-type").remove();
            };

            // Update data from current variation
            const updateProductDataFromVariations = (form) => {
                const $skuWrap = $(".thegem-te-product-sku .product-sku__list")
                const defaultSku = $(".thegem-te-product-sku .product-sku").data('sku')
                const $weightWrap = $(".thegem-te-product-tabs .woocommerce-product-attributes-item--weight .woocommerce-product-attributes-item__value")
                const defaultWeight = $weightWrap.html()
                const $dimensionsWrap = $(".thegem-te-product-tabs .woocommerce-product-attributes-item--dimensions .woocommerce-product-attributes-item__value")
                const defaultDimensions = $dimensionsWrap.html()

                $(form).on('change', function () {
                    const $self = $(this);
                    const variationID = $('input[name=variation_id]', $self).val()
                    const variations = JSON.parse($self.attr("data-product_variations"));

                    if(variations && (variationID && variationID !== undefined)) {
                        for(const i in variations) {
                            if ( variations[i].variation_id == variationID){
                                const sku = variations[i].sku;
                                const weight = variations[i].weight_html;
                                const dimensions = variations[i].dimensions_html;

                                $skuWrap.html(sku);
                                $weightWrap.html(weight);
                                $dimensionsWrap.html(dimensions);
                            }
                        }
                    } else {
                        $skuWrap.html(defaultSku);
                        $weightWrap.html(defaultWeight);
                        $dimensionsWrap.html(defaultDimensions);
                    }
                })
            }

            // Variations each
            $variationForm.each(function (i, form) {
                let $clearSelection = $('.product-page__reset-variations');

                setTimeout(() => {
                    $clearSelection.removeClass('hidden');
                }, 1000);

                comboboxInit();

                updateProductDataFromVariations(form);
            });

            // Quantity custom buttons
            $('div.quantity:not(.buttons_added)', $formCart).addClass('buttons_added')
                .append('<button type="button" class="plus" >+</button>')
                .prepend('<button type="button" class="minus" >-</button>');

            // Variations reset event
            $reset.on('click', function () {
                $variationForm.each(function (i, form) {
                    $(this).on('change', '.variations select', function () {
                        comboboxRefresh();

                        let text = $('.thegem-combobox__options-item').eq(0).text();
                        $combobox.find('.thegem-combobox__trigger').text(text);
                    });
                });
            });

            $variationForm.on('woocommerce_update_variation_values', function() {
                comboboxRefresh();

                let text = $('.thegem-combobox__options-item').eq(0).text();
                $combobox.find('.thegem-combobox__trigger').text(text);
            });

            // Huck for double submit form
            if (window.history.replaceState) {
                window.history.replaceState(null, null, window.location.href);
            }
        },

        // Product page rating
        productRating: () =>{
            $(".woocommerce-Reviews .stars:not(:first-of-type)").remove();

            let isSelected = false,
                $star = $(".woocommerce-Reviews .stars a");

            $star.on('click', (e) => {
                let $self = $(e.currentTarget);
                isSelected = true;

                $self.prevAll().andSelf().addClass('rating-on');
                $self.nextAll().removeClass('rating-on');
            });

            $star.hover((e) => {
                let $self = $(e.currentTarget);

                $self.prevAll().andSelf().addClass('rating-on');
                $self.nextAll().removeClass('rating-on');
            }, () => {
                if (!isSelected) {
                    $star.removeClass('rating-on');
                }
                isSelected = false;
            });
        },

        // Ajax add to cart
        ajaxAddToCart: () => {
            const $wrapper = $('.thegem-te-product-add-to-cart');

            $wrapper.on('click', '.single_add_to_cart_button', function (e, fragments, cart_hash) {
                e.preventDefault();
                $('.thegem-popup-notification').removeClass('show');

                const $thisButton = $(this);
                const $form = $thisButton.closest('form');
                const data = {};
                $form.serializeArray().forEach(el => {
                    data[el.name] = el.value
                });
                data['action'] = 'thegem_ajax_add_to_cart';
                data['product_id'] = data.product_id ? data.product_id : $thisButton.val();
                data['add-to-cart'] = data['add-to-cart'] ? data['add-to-cart'] : data.product_id;

                // Check empty and out stock variation
                let variation_check = true
                const variationId = $form.find('input[name=variation_id]').val() || 0

                if ($form.find('input[name=variation_id]').length > 0 && $form.data('product_variations')) {
                    $form.data('product_variations').forEach(variation => {
                        if (variationId == 0 || (variation.variation_id == variationId && !variation.is_in_stock)) {
                            variation_check = false
                        }
                    })
                }

                if (!variation_check) return false;

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
                            const $addToCartTarget = $('.thegem-popup-notification-wrap', $wrapper);

                            if ($addToCartTarget) {
                                $('.thegem-popup-notification', $addToCartTarget).removeClass('show');

                                const $cartPopupAdd = $addToCartTarget.find('.thegem-popup-notification.cart');
                                $cartPopupAdd.addClass('show');
                                stickyHeaderTemplate('hide')

                                setTimeout(function () {
                                    $cartPopupAdd.removeClass('show');
                                    stickyHeaderTemplate('show')
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

        // Ajax add to wishlist
        ajaxAddToWishlist: () => {
            const $wrapperCart = $('.thegem-te-product-add-to-cart');
            const $wrapperWishlist = $('.thegem-te-product-add-to-wishlist');

            const initNotificationPopup = (wrapper) => {
                const $wishlistTarget = $('.thegem-popup-notification-wrap', wrapper);
                $('.thegem-popup-notification').removeClass('show');

                if ($wishlistTarget) {
                    $('.thegem-popup-notification', $wishlistTarget).removeClass('show');

                    const $wishlistPopupAdd = $wishlistTarget.find('.thegem-popup-notification.wishlist-add');
                    $wishlistPopupAdd.addClass('show');
                    stickyHeaderTemplate('hide')
                    setTimeout(function () {
                        $wishlistPopupAdd.removeClass('show');
                        stickyHeaderTemplate('show')
                    }, $wishlistPopupAdd.data('timing'));
                }
            }

            $wrapperCart.on('click', '.add_to_wishlist', function () {
                initNotificationPopup($wrapperCart)
            });

            $wrapperWishlist.on('click', '.add_to_wishlist', function () {
                initNotificationPopup($wrapperWishlist)
            });
        },

        // Ajax remove from wishlist
        ajaxRemoveFromWishlist: () => {
            const $wrapperCart = $('.thegem-te-product-add-to-cart');
            const $wrapperWishlist = $('.thegem-te-product-add-to-wishlist');

            const initNotificationPopup = (wrapper) => {
                const $wishlistTarget = $('.thegem-popup-notification-wrap', wrapper);
                $('.thegem-popup-notification').removeClass('show');

                if ($wishlistTarget) {
                    $('.thegem-popup-notification', $wishlistTarget).removeClass('show');

                    const $wishlistPopupRemove = $wishlistTarget.find('.thegem-popup-notification.wishlist-remove');
                    $wishlistPopupRemove.addClass('show');
                    stickyHeaderTemplate('hide')
                    setTimeout(function () {
                        $wishlistPopupRemove.removeClass('show');
                        stickyHeaderTemplate('show')
                    }, $wishlistPopupRemove.data('timing'));
                }
            }

            $wrapperCart.on('click', '.remove_from_wishlist', function (e, fragments, cart_hash) {
                initNotificationPopup($wrapperCart)
            });

            $wrapperWishlist.on('click', '.remove_from_wishlist', function (e, fragments, cart_hash) {
                initNotificationPopup($wrapperWishlist)
            });
        },

        prepareWishlistIcons: () => {
            $('body').on('added_to_wishlist', function (t, el_wrap) {
                $('.thegem-te-product-add-to-wishlist').each(function() {
                    productScripts.replaceWishlistIcons(this);
                });
            });
            $('body').on('removed_from_wishlist', function (t, el_wrap) {
                $('.thegem-te-product-add-to-wishlist').each(function() {
                    productScripts.replaceWishlistIcons(this);
                });
            });
        },

        replaceWishlistIcons: (elem) => {
            var wishlistAddIcon = elem.querySelector('.yith-wcwl-add-button a i');
            if(wishlistAddIcon) {
                var addIcon = elem.querySelector('.product-add-to-wishlist-custom-icons .gem-icon-add-to-wishlist');
                if(addIcon) {
                    wishlistAddIcon.outerHTML = addIcon.outerHTML;
                }
                var wlText = elem.querySelector('.product-add-to-wishlist-text span');
                if(wlText) {
                    wlText.innerHTML = wlText.dataset.addText;
                }
            }
            var wishlistRemoveIcon = elem.querySelector('.yith-wcwl-wishlistexistsremove a i');
            if(wishlistRemoveIcon) {
                var removeIcon = elem.querySelector('.product-add-to-wishlist-custom-icons .gem-icon-remove-to-wishlist');
                if(removeIcon) {
                    wishlistRemoveIcon.outerHTML = removeIcon.outerHTML;
                }
                var wlText = elem.querySelector('.product-add-to-wishlist-text span');
                if(wlText) {
                    wlText.innerHTML = wlText.dataset.removeText;
                }
            }
        },

        //Scroll to reviews
        scrollToReviews: function () {
            const $trigger = $('.thegem-te-product-rating')
            const $wrapper = $('.thegem-te-product-tabs, .thegem-te-product-reviews')
            const $sticky = $('.header-sticky-template')[0]

            $trigger.on('click', '.scroll-to-reviews', function (e) {
                e.preventDefault();

                try {
                    const offset = $sticky ? $sticky.offsetHeight + 10 : 0;
                    const target = $wrapper.offset().top - offset;

                    $(`.product-tabs__nav-item[data-id="reviews"]`, $wrapper).click()
                    $(`.product-accordion__item-body[data-id="reviews"]`, $wrapper).show()

                    $('html, body').animate({scrollTop: target}, 400);
                } catch (e) {}
            });
        },

        // Product page resize
        onResize: () => {
            let resizeTimer;

            $(window).on('resize', function (e) {
                clearTimeout(resizeTimer);

                resizeTimer = setTimeout(function () {

                }, 250);
            });
        },
    };

    // Run the function
    $(function () {
        productScripts.init();
    });

})(jQuery);
