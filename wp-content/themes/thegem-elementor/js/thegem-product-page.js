(function ($) {

    'use strict';

    let isTouch = window.gemSettings.isTouch,
        isMobile = $(window).width() < 768 && /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false,
        isTabletPortrait = $(window).width() === 768 && isTouch && window.matchMedia("(orientation: portrait)") ? true : false,
        isSticky = $('.single-product-content').attr('data-sticky') === 'yes' ? true : false,
        isAjaxLoad = $('.single-product-content').attr('data-ajax-load') === 'yes' ? true : false,
        isOneByOne = $('.single-product-content-bottom').attr('data-review-layout') === 'one_by_one' ? true : false,
        isGridGallery = $('.product-gallery__grid').attr('data-gallery') === 'grid' ? true : false,
        isMenuVertical = $('.single-product-content').attr('data-menu-vertical') === 'yes' ? true : false,
        isComboboxInit = false,
        isExternalProduct = $('.product-page__wrapper.product-type-external').length > 0,
        isGroupedProduct = $('.product-page__wrapper.product-type-grouped').length > 0,
        isSubscriptionProduct = $('.product-page__wrapper.has-subscription-plans').length > 0,

        productPageScripts = {
            // Initialization the functions
            init: function () {
                productPageScripts.default();
                productPageScripts.tabs();
                productPageScripts.accordion();
                productPageScripts.stickyColumn();
                productPageScripts.rating();
                productPageScripts.productVariable();
                productPageScripts.productQuantity();
                if (isAjaxLoad) {
                    productPageScripts.ajaxAddToCart();
                }
                productPageScripts.ajaxAddToWishlist();
                productPageScripts.ajaxRemoveFromWishlist();
                productPageScripts.scrollToReviews();
                productPageScripts.onResize();
            },

            default: function () {
                let $clearSelection = $('.product-page__reset-variations');
                let $popupNotification = $('.thegem-popup-notification-wrap');

                $popupNotification.closest('#main').addClass('over-header');

                setTimeout(() => {
                    $clearSelection.removeClass('hidden');
                }, 400);
            },

            // Product page tabs
            tabs: function () {
                let $tabs = $('.thegem-tabs'),
                    $tabNavItem = $('.thegem-tabs__nav-item'),
                    $tabNavItemActive = $('.thegem-tabs__nav-item--active'),
                    $line = $('.thegem-tabs__nav-slide'),
                    isVertical = $tabs.attr("data-type") === 'vertical',
                    activeClass = 'thegem-tabs__nav-item--active',
                    $accItemTitle = $('.thegem-accordion__item-title'),
                    $accItemBody = $('.thegem-accordion__item-body'),
                    accActiveClass = 'thegem-accordion__item--active',

                    getPosition = ($target) => {
                        let $position = {
                            top: $target.offsetTop,
                            left: $target.offsetLeft
                        };
                        return $position;
                    },

                    animateLine = ($target, $ln) => {
                        let currentWidth = $target.offsetWidth,
                            currentHeight = $target.offsetHeight,
                            currentPos = getPosition($target);

                        if (isVertical) {
                            $ln[0].style.top = currentPos.top + 'px';
                            $ln[0].style.height = currentHeight + 'px';
                        } else {
                            $ln[0].style.left = currentPos.left + 'px';
                            $ln[0].style.width = currentWidth + 'px';
                        }
                    },

                    onLoadLine = () => {
                        animateLine($tabNavItemActive[0], $line);
                    };

                $tabNavItem.each(function (index, el) {
                    onLoadLine();

                    setTimeout(function () {
                        $line[0].style.transition = '0.25s ease';
                    }, 200);
                });

                $tabNavItem.on('click', function (e) {
                    let currentAttrvalue = '#' + $(this).attr('data-id');

                    $tabNavItem.removeClass(activeClass);
                    $(this).addClass(activeClass);
                    $accItemTitle.removeClass(accActiveClass);
                    $accItemBody.filter(currentAttrvalue).prev().addClass(accActiveClass);
                    $accItemBody.hide().filter(currentAttrvalue).show();

                    animateLine(e.currentTarget, $line);
                    if (window.tgpLazyItems !== undefined) {
                        window.tgpLazyItems.scrollHandle();
                    }
                });
            },

            // Product page accordion
            accordion: function () {
                let $accItem = $('.thegem-accordion__item'),
                    $accItemTitle = $('.thegem-accordion__item-title'),
                    $accItemBody = $('.thegem-accordion__item-body'),
                    $tabNavItem = $('.thegem-tabs__nav-item'),
                    activeClass = 'thegem-accordion__item--active',
                    tabActiveClass = 'thegem-tabs__nav-item--active';

                $accItemTitle.click(function(e){
                    const current = $(this).attr('data-id');
                    const currentAttrValue = '#' + current;

                    if ($(window).width() < 768) {
                        setTimeout(() => {
                            const topPosition = $(e.target).offset().top;
                            window.scrollTo({top: topPosition});
                        }, 250);
                    }

                    if($(e.target).is('.thegem-accordion__item--active')){
                        $(this).removeClass(activeClass);
                        $('.thegem-accordion__item-body:visible').slideUp(300);
                    } else {
                        $accItemTitle.removeClass(activeClass).filter(this).addClass(activeClass);
                        $accItemBody.slideUp(300).filter(currentAttrValue).slideDown(300);
                    }

                    $tabNavItem.removeClass(tabActiveClass);
                    $('.thegem-tabs__nav-item[data-id=' + current + ']').addClass(tabActiveClass);
                    if (window.tgpLazyItems !== undefined) {
                        window.tgpLazyItems.scrollHandle();
                    }
                });
            },

            // Product page sticky
            stickyColumn: function () {
                const $wrapper = $('.single-product-content'),
                    $leftColumn = $('.product-page__left-column', $wrapper),
                    $rightColumn = $('.product-page__right-column', $wrapper),
                    $header = $('#site-header-wrapper'),
                    headerH = $header.length > 0 && !isMenuVertical ? $header[0].clientHeight : 0;

                const stickyInit = (el) => {
                    const offset = headerH - 1;
                    const stickyOffset = $wrapper.data('sticky-offset');

                    $(el).sticky({
                        to: 'top',
                        offset: stickyOffset ? stickyOffset : offset,
                        effectsOffset: stickyOffset ? stickyOffset : offset,
                        parent: $wrapper
                    })
                }

                const stickyDestroy = (el) => {
                    $(el).sticky('destroy');
                };

                setTimeout(function () {
                    let $leftColumnHeight = $leftColumn.height(),
                        $rightColumnHeight = $rightColumn.height();

                    if (isSticky && !isMobile && !isTabletPortrait) {
                        if (!isGridGallery) {
                            $leftColumnHeight > $rightColumnHeight ? stickyInit($rightColumn) : stickyInit($leftColumn);
                        } else {
                            $leftColumnHeight > $rightColumnHeight ? stickyInit($rightColumn) : null;
                        }
                    }
                }, 200);
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

                    if ($(this).parents(".thegem-combobox-wrap").length === 0){
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
                        hideIndex = () =>{
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

                $star.click(function(e){
                    isSelected = true;
                    $(this).prevAll().andSelf().addClass('rating-on');
                    $(this).nextAll().removeClass('rating-on');
                });
                $star.hover(function(){
                    $(this).prevAll().andSelf().addClass('rating-on');
                    $(this).nextAll().removeClass('rating-on');
                });
                $star.mouseout(function(){
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

                    comboboxInit = () => {
                        if(!isComboboxInit) {
                            setTimeout(() => productPageScripts.combobox(), 250);
                            isComboboxInit = true;
                        }
                    },
                    comboboxRefresh = () => {
                        productPageScripts.combobox();
                        $(".thegem-combobox-wrap").find(".thegem-combobox:last-of-type").remove();
                    };

                $variationForm.each(function () {
                    comboboxInit();
                });

                $reset.on('click', function(){
                    $variationForm.each(function () {
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

                //huck for double submit form
                if ( window.history.replaceState ) {
                    window.history.replaceState( null, null, window.location.href );
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
                let $wrapper =  $('.single-product-content');

                $wrapper.on('click', '.single_add_to_cart_button', function (e, fragments, cart_hash) {
                    e.preventDefault();

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

                    if ($form.find('input[name=variation_id]').length > 0 && $form.data('product_variations').length > 0) {
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
                                let $addToCartTarget = $('.thegem-popup-notification-wrap');

                                if ($addToCartTarget) {
                                    $('.thegem-popup-notification', $addToCartTarget).removeClass('show');

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
                let $wrapper =  $('.single-product-content');

                $wrapper.on('click', '.add_to_wishlist', function () {
                    let $wishlistTarget = $('.thegem-popup-notification-wrap');

                    if ($wishlistTarget) {
                        $('.thegem-popup-notification', $wishlistTarget).removeClass('show');

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
                let $wrapper =  $('.single-product-content');

                $wrapper.on('click', '.remove_from_wishlist', function (e, fragments, cart_hash) {
                    let $wishlistTarget = $('.thegem-popup-notification-wrap');

                    if ($wishlistTarget) {
                        $('.thegem-popup-notification', $wishlistTarget).removeClass('show');

                        let $wishlistPopupRemove = $wishlistTarget.find('.thegem-popup-notification.wishlist-remove');
                        $wishlistPopupRemove.addClass('show');
                        setTimeout(function () {
                            $wishlistPopupRemove.removeClass('show');
                        }, $wishlistPopupRemove.data('timing'));
                    }
                });
            },

            //Scroll to reviews
            scrollToReviews: function() {
                let $wrapper = $('.woocommerce-product-rating .product-reviews-link'),
                    $header = $('#site-header')[0],
                    $target = isOneByOne ? $('#thegem-reviews.thegem-one-by-one__item ') : $('.product-page__bottom-column'),
                    fixedHeight = $('#site-header').height(),
                    targetId = '#thegem-reviews',
                    targetEl = $('[data-id="thegem-reviews"]')[0];

                $wrapper.on('click', '.woocommerce-review-link', function (e) {
                    e.preventDefault();

                    if (!$(targetId).is(":visible")) {
                       $(targetEl).trigger('click');
                    }

                    $(window).scroll(function () {
                        if ($(this).scrollTop() > 0) {
                            fixedHeight = $header.clientHeight;
                        }
                    });

                    $("html, body").animate({scrollTop: $target.offset().top - fixedHeight}, 500);
                });
            },

            // Product page resize
            onResize: function () {
                let $accItem = $('.thegem-accordion__item'),
                    tabView = 'thegem-accordion__item--tab-view',

                    initMobileTabs = () => {
                        $accItem.removeClass(tabView);
                    },

                    revertMobileTabs = () => {
                        $accItem.addClass(tabView);
                    };

                if (isMobile) {
                    initMobileTabs();
                } else {
                    productPageScripts.tabs();
                    revertMobileTabs();
                }

                window.addEventListener("resize", function () {
                    isMobile = window.outerWidth < 768 ? true : false;

                    if (isMobile) {
                        initMobileTabs();
                    } else {
                        productPageScripts.tabs();
                        revertMobileTabs();
                    }
                }, false);
            },
        };

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/woocommerce-product-data-tabs.default', function ($scope, $) {
            productPageScripts.tabs();
            productPageScripts.accordion();
            productPageScripts.rating();
        });
        elementorFrontend.hooks.addAction('frontend/element_ready/woocommerce-product-add-to-cart.default', function ($scope, $) {
            productPageScripts.productVariable();
            productPageScripts.productQuantity();
        });
    });

    // Run the function
    $(function () {
        productPageScripts.init();

        $.fn.initProductPageScripts = function () {
            productPageScripts.init();
        };
    });

})(jQuery);
