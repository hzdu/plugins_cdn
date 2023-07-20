(function( $ ) {
    'use strict';

    /**
     * All of the code for your public-facing JavaScript source
     * should reside in this file.
     */

    $(function() {
        
        //final width --> this is the quick view image slider width
        //maxQuickWidth --> this is the max-width of the quick-view panel

        var customizer = false,
            quickView = $('.xt-woo-quick-view'),
            resizeTimeout,
            currentSlider,
            mobileSliderWidth = 350,
            mobileSliderHeight = 350,
            desktopSliderWidth = 400,
            desktopSliderHeight = 400,
            defaultMaxQuickWidth = 900,
            defaultMaxQuickHeight = 755,
            defaultSliderWidth,
            defaultSliderHeight,
            sliderFinalWidth,
            sliderFinalHeight,
            maxQuickWidth = defaultMaxQuickWidth,
            maxQuickHeight = defaultMaxQuickHeight,
            closeOnOverlayClick = true,
            isVisible = false,
            animationComplete = false,
            recentProduct = null,
            recentVariation = null,
            mobileScreen = false,
            tabletScreen = false,
            winWidth,
            winHeight,
            mobileBrowserFooterBarHeight = 0,
            productSelector = '.product:not(.xt_wooqv-product), .jet-woo-builder-product',
            clickSelector = 'click';

        if(XT_WOOQV.is_inline) {
            $('html').addClass('xt_wooqv-is-inline');
        }

        function initVars() {

            customizer = (typeof(wp) !== 'undefined' && typeof(wp.customize) !== 'undefined');

            desktopSliderWidth = getOption('xt_wooqv-desktop-slider-width', 400, true);
            desktopSliderHeight = getOption('xt_wooqv-desktop-slider-height', 400, true);

            if(XT_WOOQV.is_fullscreen) {
                desktopSliderWidth = getOption('xt_wooqv-desktop-slider-width-fullscreen', 40, true);
            }else if(XT_WOOQV.is_inline) {
                desktopSliderWidth = getOption('xt_wooqv-desktop-slider-width-inline', 400, true);
                desktopSliderHeight = getOption('xt_wooqv-desktop-slider-height-inline', 400, true);
            }
        }

        function updateResponsiveVars() {

            winWidth = $(window).width(),
            winHeight = $(window).height(),
            tabletScreen = winWidth <= XT_WOOQV.layouts.M,
            mobileScreen = winWidth <= XT_WOOQV.layouts.S,
            defaultSliderWidth = tabletScreen ? parseInt(mobileSliderWidth) : parseInt(desktopSliderWidth);
            defaultSliderHeight = tabletScreen ? parseInt(mobileSliderHeight) : parseInt(desktopSliderHeight);
        }

        function getSelectedImage(productElem) {

            if(productElem && productElem.length) {

                var selectedImage = productElem.find('img.attachment-shop_catalog');
                if (selectedImage.length === 0) {

                    selectedImage = productElem.find('.woocommerce-LoopProduct-link > img');

                    if (selectedImage.length === 0) {
                        selectedImage = productElem.find('.woocommerce-LoopProduct-link img').first();

                        if (selectedImage.length === 0) {
                            selectedImage = productElem.find('.attachment-woocommerce_thumbnail').first();

                            if (selectedImage.length === 0) {
                                selectedImage = productElem.find('.woocommerce-LoopProduct-link').first();

                                if (selectedImage.length === 0) {
                                    selectedImage = productElem.find('.wp-post-image').first();
                                }
                            }
                        }
                    }
                }

            }else{

                selectedImage = productElem;
            }

            if (selectedImage && selectedImage.length === 0) {

                if($('.empty-box img').length) {
                    selectedImage = $('.empty-box img');
                }else{
                    selectedImage = productElem;
                }
            }

            return selectedImage;
        }

        function throttle (callback, limit) {
            var wait = false;                  // Initially, we're not waiting
            return function () {               // We return a throttled function
                if (!wait) {                   // If we're not waiting
                    callback.call(this);       // Execute users function
                    wait = true;               // Prevent future invocations
                    setTimeout(function () {   // After a period of time
                        wait = false;          // And allow future invocations
                    }, limit);
                }
            }
        }

        function initEvents() {

            var handler;
            var bodyEvents = $._data(document.body).events;

            if(bodyEvents && typeof(bodyEvents.click) !== 'undefined') {

                var bodyClickEvents = bodyEvents.click;

                for (var i = 0; i < bodyClickEvents.length; i++) {

                    if (bodyClickEvents[i].namespace === 'preview') {
                        handler = bodyClickEvents[i].handler;
                        break;
                    }
                }

                if (handler) {
                    $(document.body).off('click.preview', 'a');
                    $(document.body).on('click.preview', 'a', function (e) {

                        if (!$(e.target).hasClass('xt_wooqv-trigger') && !$(e.target).hasClass('xt_wooqv-trigger-icon')) {
                            handler(e);
                        }

                    });
                }
            }

            if(customizer && XT_WOOQV.can_use_premium_code) {

                if(typeof(wp.customize) !== 'undefined' && typeof(wp.customize.preview) !== 'undefined') {

                    quickView.attrchange({
                        trackValues: true, /* Default to false, if set to true the event object is
					                updated with old and new value.*/
                        callback: function (e) {
                            //event               - event object
                            //event.attributeName - Name of the attribute modified
                            //event.oldValue      - Previous value of the modified attribute
                            //event.newValue      - New value of the modified attribute
                            //Triggered when the selected elements attribute is added/updated/removed

                            if(e.attributeName.search('xt_wooqv-') !== -1) {

                                initVars();

                                setTimeout(function() {

                                    triggerQuickViewResize();
                                    triggerQuickViewResize();

                                },1);

                            }
                        }
                    });

                    var requireWindowResize = [
                        'modal_slider_width_desktop',
                        'modal_slider_width_desktop_fullscreen',
                        'modal_slider_width_desktop_inline',
                        'modal_slider_height_desktop',
                        'modal_slider_height_mobile',
                        'modal_slider_height_mobile_fullscreen',
                        'modal_slider_height_mobile_inline'
                    ];

                    requireWindowResize.forEach(function (setting) {

                        wp.customize.value('xt_wooqv[' + setting + ']').bind(function () {

                            triggerQuickViewResize();
                        });
                    });

                }
            }

            var initQuickViewAnimation = function(productId, variationId, productElem) {

                var selectedImage = getSelectedImage(productElem);

                preloadImage(selectedImage.attr('src'), function() {

                    animateQuickView(productId, variationId, productElem, selectedImage, sliderFinalWidth, maxQuickWidth, 'open');
                });
            };


            //open / close the quick view panel
            $('body').on(clickSelector, function(evt){

                var trigger, product, productId, variationId;

                if( $(evt.target).is('.xt_wooqv-shortcode-trigger:not(.xt_wooqv-shortcode-in-loop)') || $(evt.target).closest('.xt_wooqv-shortcode-trigger:not(.xt_wooqv-shortcode-in-loop)').length ) {

                    evt.preventDefault();
                    evt.stopPropagation();

                    if(XT_WOOQV.can_use_premium_code) {

                        trigger = $(evt.target).hasClass('.xt_wooqv-shortcode-trigger') ? $(evt.target) : $(evt.target).closest('.xt_wooqv-shortcode-trigger');

                        productId = trigger.data('id');
                        variationId = trigger.data('variation');
                        product = trigger.closest(productSelector).first();

                        if(XT_WOOQV.is_redirect) {

                            location.href = trigger.data('url');

                        }else {

                            if (!isVisible) {

                                initQuickViewAnimation(productId, variationId, product);

                            } else {

                                triggerProductQuickView(productId);
                            }
                        }
                    }

                }else if( $(evt.target).is('.xt_wooqv-product-overlay')) {

                    evt.preventDefault();
                    evt.stopPropagation();

                    $(evt.target).next().find('.xt_wooqv-trigger').trigger(clickSelector);

                }else if( $(evt.target).is('.xt_wooqv-trigger') || $(evt.target).closest('.xt_wooqv-trigger').length) {

                    evt.preventDefault();
                    evt.stopPropagation();

                    trigger = $(evt.target).hasClass('.xt_wooqv-trigger') ? $(evt.target) : $(evt.target).closest('.xt_wooqv-trigger');
                    product = trigger.closest(productSelector).first();
                    productId = trigger.data('id');
                    variationId = trigger.data('variation');

                    if(XT_WOOQV.is_redirect) {

                        location.href = trigger.data('url');

                    }else {

                        if (!isVisible) {

                            initQuickViewAnimation(productId, variationId, product);

                        } else {

                            triggerProductQuickView(productId);
                        }
                    }

                }else if(
                    $(evt.target).is('.xt_wooqv-close-icon') ||
                    $(evt.target).is('html.xt_wooqv-active') ||
                    (($(evt.target).is('.xt_wooqv-overlay') || $(evt.target).is('.xt_wooqv-nav')) && closeOnOverlayClick)
                ) {

                    // only close modal on overlay click if animation is complete
                    if(animationComplete && isVisible) {

                        closeQuickView(sliderFinalWidth, maxQuickWidth);
                    }

                }else if($(evt.target).is('.xt_wooqv-prev') || $(evt.target).closest('.xt_wooqv-prev').length) {

                    previousProduct();

                }else if($(evt.target).is('.xt_wooqv-next') || $(evt.target).closest('.xt_wooqv-next').length) {

                    nextProduct();
                }
            });

            if (customizer) {

                var disableClickSelectors = [
                    'a .xt_wooqv-trigger',
                    'a .xt_wooqv-product-overlay'
                ];

                disableClickSelectors = disableClickSelectors.join(',');

                $('body').on('mouseover', disableClickSelectors, function() {

                    var $link = $(this).closest('a');
                    $link.attr('data-href', $link.attr('href')).attr('href', '#');

                }).on('mouseout', disableClickSelectors, function() {

                    var $link = $(this).closest('a');
                    $link.attr('href', $link.attr('data-href'));
                });
            }

            if(XT_WOOQV.can_use_premium_code) {

                document.addEventListener('keyup', function (event) {
                    if (event.defaultPrevented) {
                        return;
                    }

                    var key = event.key || event.keyCode;

                    if (key === 'Escape' || key === 'Esc' || key === 27) {
                        closeQuickView(sliderFinalWidth, maxQuickWidth);
                    }
                });
            }

            // Resize Event
            $(window).on('resize', function() {
                resizeQuickView();
                resizeQuickView();
            });

            $(document.body).on('xt_wooqv-animation-end', function() {

                triggerQuickViewResize();

                if(XT_WOOQV.can_use_premium_code) {
                    checkNavigation();
                }

                setTimeout(function() {

                    if(isVisible) {
                        $('html').addClass('xt_wooqv-ready');
                    }else{
                        $('html').removeClass('xt_wooqv-ready');

                        if(XT_WOOQV.is_inline) {
                            resetInlineQuickView();
                        }
                    }

                }, 10);

                animationComplete = true;

            });

            if(!!XT_WOOQV.close_on_added) {

                var closeModal = function() {

                    if(isVisible) {
                        closeQuickView(sliderFinalWidth, maxQuickWidth);
                    }
                };

                $( document.body ).on( 'xt_atc_added_to_cart', closeModal);
            }
        }

        function relocateInlineQuickView(product, trigger) {

            var position = XT_WOOQV.inline_position;
            var is_shortcode = trigger.hasClass('xt_wooqv-shortcode-trigger');
            var found_shortcode_product = false;

            if(is_shortcode) {
                if(trigger.closest(productSelector).length) {
                    product = trigger.closest(productSelector);
                    found_shortcode_product = true;
                }else{
                    product = trigger;
                }
            }

            if(!is_shortcode || found_shortcode_product) {
                var first_product = findRowProduct(product, 'first');

                if (position === 'below') {
                    product = findRowProduct(product, 'last');
                } else {
                    product = first_product;
                }
            }

            var quickViewWrapper = $('.xt_wooqv-inline-wrap');

            if (quickViewWrapper.length === 0) {
                quickView.wrap('<div class="xt_wooqv-inline-wrap"></div>');
                quickViewWrapper = $('.xt_wooqv-inline-wrap');
            }

            if(!is_shortcode || found_shortcode_product) {
                quickViewWrapper.css({
                    padding: first_product.css('padding'),
                    margin: first_product.css('margin')
                });
                quickViewWrapper.removeClass('xt_wooqv-inline-shortcode');
            }else{
                quickViewWrapper.css({
                    margin: '20px 0'
                });
                quickViewWrapper.addClass('xt_wooqv-inline-shortcode');
            }

            if (position === 'below') {
                quickViewWrapper.removeClass('xt_wooqv-inline-above');
                quickViewWrapper.addClass('xt_wooqv-inline-below');
                quickViewWrapper.insertAfter(product);
            } else {
                quickViewWrapper.removeClass('xt_wooqv-inline-below');
                quickViewWrapper.addClass('xt_wooqv-inline-above');
                quickViewWrapper.insertBefore(product);
            }

        }

        function resetInlineQuickView() {

            $('.xt_wooqv-inline-wrap').removeAttr('style');
        }

        function scrollToInlineQuickView() {

            var elOffset = $('.xt_wooqv-inline-wrap').offset().top;
            var offset = elOffset - 25;

            if(!tabletScreen) {
                var elHeight = 400;
                var windowHeight = $(window).height();

                if (elHeight < windowHeight) {
                    offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
                } else {
                    offset = elOffset;
                }
            }

            $('html, body').animate({scrollTop: offset}, 400);
        }

        function findRowProduct(product, location) {

            var previous_product;
            var product_top = product.offset().top;
            var func = location === 'last' ? 'next' : 'prev';

            do {
                previous_product = product;
                product = product[func]();

            }while(product.length && product.offset().top === product_top);

            return previous_product;
        }

        function getOption(key, defaultVal, isInt) {

            var val;
            isInt = isInt ? isInt : false;

            if(quickView.attr(key)) {

                val = quickView.attr(key);

            }else{

                val = defaultVal;
            }

            if(isInt) {
                val = parseInt(val);
            }

            return val;
        }

        function customizerValuesChanged() {

            // DESKTOP

            if(!tabletScreen) {

                var width_units = XT_WOOQV.is_fullscreen ? 'vw' : 'px';
                var height_units = XT_WOOQV.is_fullscreen ? 'vh' : 'px';

                quickView.css('width', '' );

                if(XT_WOOQV.is_fullscreen) {

                    $('.xt_wooqv-slider-wrapper, .xt_wooqv-slider li').css('width', desktopSliderWidth+width_units);
                    $('.xt_wooqv-item-info').css('width', (100 - parseInt(desktopSliderWidth)) + width_units);

                }else{

                    $('.xt_wooqv-slider-wrapper, .xt_wooqv-slider li').css({width: desktopSliderWidth+width_units, height: desktopSliderHeight+height_units});
                    quickView.css('height', desktopSliderHeight+height_units);
                    $('.xt_wooqv-item-info').css({
                        'width': 'calc(100% - ' + (desktopSliderWidth + width_units) + ')',
                        'height': desktopSliderHeight + height_units
                    });
                }

            }else{

                $('.xt-woo-quick-view, .xt_wooqv-slider-wrapper, .xt_wooqv-slider, .xt_wooqv-slider li').css('height', '');

            }

            resetSlider();
        }

        function resizeQuickView() {

            if(!$('html').hasClass('xt_wooqv-resizing')) {

                $('html').addClass('xt_wooqv-resizing');

                if(resizeTimeout) {
                    clearTimeout(resizeTimeout);
                }

                resizeTimeout = setTimeout(function() {
                    $('html').removeClass('xt_wooqv-resizing');
                }, 500);
            }

            window.requestAnimationFrame(function() {

                updateResponsiveVars();

                if (customizer && XT_WOOQV.can_use_premium_code) {
                    customizerValuesChanged();
                }

                //SET VARS FOR MOBILE

                if (winWidth <= defaultSliderWidth) {

                    sliderFinalWidth = winWidth;
                    maxQuickWidth = sliderFinalWidth;

                } else {

                    sliderFinalWidth = defaultSliderWidth;
                    maxQuickWidth = defaultMaxQuickWidth;
                }

                if (winHeight <= defaultSliderHeight) {

                    sliderFinalHeight = winHeight;
                    maxQuickHeight = sliderFinalHeight;

                } else {

                    sliderFinalHeight = defaultSliderHeight;
                    maxQuickHeight = defaultMaxQuickHeight;
                }

                var quickViewLeft = (winWidth - quickView.width()) / 2,
                    quickViewTop = (winHeight - quickView.height()) / 2,
                    quickViewWidth = (winWidth * 0.8 < maxQuickWidth) ? winWidth * 0.8 : maxQuickWidth;

                quickView.css({
                    'top': quickViewTop > 0 ? quickViewTop : 0,
                    'left': quickViewLeft > 0 ? quickViewLeft : 0,
                    'width': quickViewWidth
                });

                resetSlider();
                resizeInfoBoxHeight();

            });

        }

        function resizeInfoBoxHeight() {

            if (tabletScreen) {

                var height = quickView.find('.xt_wooqv-item-info .xt_wooqv-item-info-inner').outerHeight(true) + mobileBrowserFooterBarHeight;
                quickView.find('.xt_wooqv-item-info').css('height', height);

            } else {

                if(!XT_WOOQV.is_inline) {

                    quickView.find('.xt_wooqv-item-info').css('height', '100%');
                }
            }

        }

        function triggerQuickViewResize() {

            $(window).trigger('resize');
        }

        function closeQuickView(finalWidth, maxQuickWidth, noAnimation, callback) {

            if(!isVisible) {
                return false;
            }

            var productId = getRecentProductId();
            var variationId = getRecentVariationId();
            noAnimation = typeof(noAnimation) !== 'undefined' ? noAnimation : false;

            var productElem = getProductById(productId);
            var selectedImage = getSelectedImage(productElem);

            //update the image in the gallery
            if(!noAnimation && !quickView.hasClass('velocity-animating')) {
                animateQuickView(productId, variationId, productElem, selectedImage, finalWidth, maxQuickWidth, 'close', callback);
            } else {
                closeNoAnimation(selectedImage, finalWidth, maxQuickWidth, callback);
            }
        }

        function animateQuickView(productId, variationId, productElem, image, finalWidth, maxQuickWidth, animationType, callback) {

            //store some image data (width, top position, ...)
            //store window data to calculate quick view panel position

            var topSelected = image.length ? image.offset().top - $(window).scrollTop() : 0,
                leftSelected = image.length ? image.offset().left : 0,
                widthSelected = image.length ? image.width() : 0,

                finalLeft = (winWidth - finalWidth)/2,
                finalTop = (winHeight - sliderFinalHeight)/2,
                quickViewWidth = ( winWidth * 0.8 < maxQuickWidth ) ? winWidth * 0.8 : maxQuickWidth,
                quickViewLeft = (winWidth - quickViewWidth)/2,
                quickViewTop = finalTop;

            animationComplete = false;

            var initialStyles,
                animationStyles,
                animationEasing,
                animationDuration,
                finalStyles

            var translateX = XT_WOOQV.is_fullscreen ? winWidth : winWidth * 0.20;
            var translateY = XT_WOOQV.is_fullscreen ? winHeight : winHeight * 0.20;

            var triggerOpen = function() {

                $('html').addClass('xt_wooqv-active');

                loadProductInfo(productId, variationId, function() {

                    updateResponsiveVars();

                    productElem.addClass('empty-box');

                    if(!!XT_WOOQV.is_fullscreen || !!XT_WOOQV.is_inline) {

                        if( XT_WOOQV.animation_type === 'none') {

                            initialStyles = {
                                'opacity': 1
                            };

                            animationStyles = {
                                'opacity': 1
                            };

                        }else if( XT_WOOQV.animation_type === 'fade') {

                            initialStyles = {
                                'opacity': 0
                            };

                            animationStyles = {
                                'opacity': 1
                            };

                        }else if( XT_WOOQV.animation_type === 'slide-top') {

                            initialStyles = {
                                'translateY': -translateY,
                                'opacity': 1
                            };

                            animationStyles = {
                                'translateY': 0,
                                'opacity': 1
                            };

                        }else if( XT_WOOQV.animation_type === 'slide-bottom') {

                            initialStyles = {
                                'translateY': translateY,
                                'opacity': 1
                            };

                            animationStyles = {
                                'translateY': 0,
                                'opacity': 1
                            };

                        }else if( XT_WOOQV.animation_type === 'slide-left') {

                            initialStyles = {
                                'translateX': -translateX,
                                'opacity': 1
                            };

                            animationStyles = {
                                'translateX': 0,
                                'opacity': 1
                            };

                        }else if( XT_WOOQV.animation_type === 'slide-right') {

                            initialStyles = {
                                'translateX': translateX,
                                'opacity': 1
                            };

                            animationStyles = {
                                'translateX': 0,
                                'opacity': 1
                            };
                        }

                        animationEasing = 'easeInOut';
                        animationDuration = 250;

                    }else{

                        //place the quick view over the image gallery and give it the dimension of the gallery image
                        initialStyles = {
                            'width': widthSelected,
                            'top': topSelected > 0 ? topSelected : 0,
                            'left': leftSelected > 0 ? leftSelected : 0,
                            'scaleX': tabletScreen ? '1' : '0.5',
                            'scaleY': tabletScreen ? '1' : '0.5',
                            'opacity': 0
                        };

                        //animate the quick view: animate its width and center it in the viewport
                        //during this animation, only the slider image is visible
                        animationStyles = {
                            'width': finalWidth,
                            'top': finalTop > 0 ? finalTop : 0,
                            'left': finalLeft > 0 ? finalLeft : 0,
                            'scaleX': '1',
                            'scaleY': '1',
                            'opacity': 1
                        };

                        animationEasing = tabletScreen ? 'easeInOut' : [400, 20];
                        animationDuration = tabletScreen ? 250 : 800;

                    }

                    quickView.velocity(initialStyles, 0).velocity(animationStyles, animationDuration, animationEasing, function(){

                        quickView.addClass('xt_wooqv-animate-width');

                        if(tabletScreen) {
                            quickView.addClass('xt_wooqv-add-content');
                        }

                        finalStyles = {
                            'top': quickViewTop,
                            'left': quickViewLeft,
                            'width': quickViewWidth
                        };

                        //animate the quick view: animate its width to the final value
                        quickView.velocity(finalStyles, ((XT_WOOQV.is_fullscreen || XT_WOOQV.is_inline || tabletScreen) ? 100 : 300), 'ease', function(){
                            //show quick view content

                            resetSlider();
                            triggerQuickViewResize();

                            quickView.addClass('xt_wooqv-add-content');

                            setTimeout(function() {
                                quickView.addClass('xt_wooqv-preview-gallery');
                            }, 50);

                            setTimeout(function() {
                                quickView.removeClass('xt_wooqv-preview-gallery');
                            }, 2000);

                            isVisible = true;
                            $(document.body).trigger('xt_wooqv-animation-end');

                            if(typeof(callback) !== 'undefined') {
                                callback();
                            }

                        });

                    }).addClass('xt_wooqv-is-visible');


                });
            };

            var triggerClose = function() {

                $('html').removeClass('xt_wooqv-ready');
                resetSlider(true);

                if(XT_WOOQV.is_inline) {
                    resetInlineQuickView();
                }

                if(tabletScreen) {

                    quickView.removeClass('xt_wooqv-add-content xt_wooqv-animate-width');
                }

                if(!!XT_WOOQV.is_fullscreen || !!XT_WOOQV.is_inline) {

                    if( XT_WOOQV.animation_type === 'none') {

                        initialStyles = {
                            'opacity': 0
                        };

                        animationStyles = {
                            'opacity': 0
                        };

                    }else if( XT_WOOQV.animation_type === 'fade') {

                        initialStyles = {
                            'opacity': 1
                        };

                        animationStyles = {
                            'opacity': 0
                        };

                    }else if( XT_WOOQV.animation_type === 'slide-top') {

                        initialStyles = {
                            'translateY': 0,
                            'opacity': 1
                        };

                        animationStyles = {
                            'translateY': -translateY,
                            'opacity': 1
                        };

                    }else if( XT_WOOQV.animation_type === 'slide-bottom') {

                        initialStyles = {
                            'translateY': 0,
                            'opacity': 1
                        };

                        animationStyles = {
                            'translateY': translateY,
                            'opacity': 1
                        };

                    }else if( XT_WOOQV.animation_type === 'slide-left') {

                        initialStyles = {
                            'translateX': 0,
                            'opacity': 1
                        };

                        animationStyles = {
                            'translateX': -translateX,
                            'opacity': 1
                        };

                    }else if( XT_WOOQV.animation_type === 'slide-right') {

                        initialStyles = {
                            'translateX': 0,
                            'opacity': 1
                        };

                        animationStyles = {
                            'translateX': translateX,
                            'opacity': 1
                        };
                    }

                }else {

                    var left = (tabletScreen ? quickView.position().left : finalLeft);

                    //close the quick view reverting the animation
                    initialStyles = {
                        'width': finalWidth,
                        'top': finalTop > 0 ? finalTop : 0,
                        'left': left > 0 ? left : 0,
                    };

                    //animate the quick view: animate its width and center it in the viewport
                    //during this animation, only the slider image is visible
                    animationStyles = {
                        'width': widthSelected,
                        'top': topSelected > 0 ? topSelected : 0,
                        'left': leftSelected > 0 ? leftSelected : 0,
                        'scaleX': tabletScreen ? '1' : '0.5',
                        'scaleY': tabletScreen ? '1' : '0.5',
                        'opacity': 0
                    };
                }

                quickView.removeClass('xt_wooqv-add-content').velocity(initialStyles, (XT_WOOQV.is_fullscreen || XT_WOOQV.is_inline || tabletScreen ? 0 : 300), 'ease', function(){

                    $('html').removeClass('xt_wooqv-active');

                    quickView.removeClass('xt_wooqv-animate-width').velocity(animationStyles, (XT_WOOQV.is_fullscreen || XT_WOOQV.is_inline || tabletScreen ? 500 : 500), 'ease', function(){

                        isVisible = false;
                        quickView.removeClass('xt_wooqv-no-transitions xt_wooqv-is-visible');
                        productElem.removeClass('empty-box');

                        triggerQuickViewResize();

                        $(document.body).trigger('xt_wooqv-animation-end');

                        if(typeof(callback) !== 'undefined') {
                            callback();
                        }

                    });
                });

                recentProduct = null;
            };


            if( animationType === 'open' && !isVisible) {

                triggerOpen();

            } else if(isVisible || animationType === 'close') {

                triggerClose();
            }
        }

        function closeNoAnimation(image, finalWidth, maxQuickWidth, callback) {

            resetSlider(true);

            image = image.length ? image : $('.empty-box');

            var topSelected = image.offset().top - $(window).scrollTop(),
                leftSelected = image.offset().left,
                widthSelected = image.width();

            //close the quick view reverting the animation
            $('html').removeClass('xt_wooqv-active xt_wooqv-ready');

            $('.empty-box').removeClass('.empty-box');

            quickView.velocity('stop').removeClass('xt_wooqv-add-content xt_wooqv-no-transitions xt_wooqv-animate-width xt_wooqv-is-visible').css({
                'top': topSelected,
                'left': leftSelected,
                'width': widthSelected,
            });
            isVisible = false;

            triggerQuickViewResize();

            if(XT_WOOQV.is_inline) {
                resetInlineQuickView();
            }

            if(typeof(callback) !== 'undefined') {
                callback();
            }
        }

        function loadProductInfo(id, variation_id, callback) {

            var slider_only = (isVisible) ? 1 : 0;

            if(slider_only && !animationComplete) {
                $(document.body).one('xt_wooqv-animation-end', function () {
                    if (isVisible) {
                        setTimeout(function() {
                            loadProductInfo(id, variation_id, callback)
                        },50)
                    }
                });
                return
            }

            if(typeof(xt_woofc_is_cart_open) !== 'undefined' && xt_woofc_is_cart_open()) {
                xt_woofc_close_cart();
            }

            variation_id = variation_id ? variation_id : 0;
            variation_id = variation_id === -1 ? 0 : variation_id;

            recentProduct = recentProduct ? recentProduct : 0;
            recentVariation = recentVariation ? recentVariation : 0;

            if(!slider_only && XT_WOOQV.is_inline) {
                relocateInlineQuickView(getProductById(id), getProductTriggerById(id));
                scrollToInlineQuickView();
            }

            if(animationComplete) {

                if(slider_only) {

                    quickView.find('.xt_wooqv-slider-wrapper').block({
                        message: null
                    });

                }else{

                    quickView.block({
                        message: null
                    });

                    $('html').addClass('xt_wooqv-loading');
                }

            }else{

                getProductTriggerById(id).block({
                    message: null
                });
            }

            recentProduct = id;
            recentVariation = variation_id;

            if(slider_only && variation_id) {

                var params = {
                    action: 'xt_wooqv_quick_view',
                    id: id,
                    variation_id: variation_id,
                    slider_only: slider_only
                };

                $.ajax({
                    url: XT_WOOQV.wc_ajax_url.toString().replace('%%endpoint%%', 'xt_wooqv_quick_view'),
                    data: params,
                    type: 'get',
                    success: function (data) {

                        replaceSliderWrapper($(data.quickview));

                        onProductLoaded(id, variation_id, data, slider_only, callback);
                    }
                });

            }else{

                getProductContentById(id, function($product, data) {

                    replaceProduct($product);

                    onProductLoaded(id, variation_id, data, slider_only, callback);
                });

            }

        }

        function replaceSliderWrapper($elem) {

            var sliderWrapper = quickView.find('.xt_wooqv-slider-wrapper');
            if(sliderWrapper.length > 1) {
                sliderWrapper.not(':first').remove();
            }

            sliderWrapper.addClass('ontop').before($elem)
            sliderWrapper.css({transition: 'opacity 0.5s', opacity: 0});
            setTimeout(function() {
                sliderWrapper.remove();
            }, 500);
        }

        function replaceProduct($product) {

            quickView.find('.xt_wooqv-product').replaceWith($product);

            // Support Quick View Event
            $('body').trigger('quick-view-displayed');

            // Allow third party plugins hook actions once the quick view has loaded and displayed.
            $('body').trigger('xt-woo-quick-view-displayed');

            window.dispatchEvent(new Event('load', {bubbles: true}));
        }

        function onProductLoaded(id, variation_id, data, slider_only, callback) {

            data = data ? data : null;

            recentProduct = id;
            recentVariation = variation_id;

            if(customizer) {

                customizerValuesChanged();
            }

            if(slider_only) {

                resetSlider();

            }else {

                initProductVariationsEvents();
                initProductBundleEvents();
                initProductCompositeEvents();

            }

            triggerQuickViewResize();


            // Scroll Event
            if(XT.isTouchDevice()) {
                quickView.find('.xt_wooqv-product').off('scroll', throttle(checkMobileOverflowBar, 100));
                quickView.find('.xt_wooqv-product').on('scroll', throttle(checkMobileOverflowBar, 100));
            }

            if(XT_WOOQV.can_use_premium_code) {

                initLightSlider(data, callback);

                if(!slider_only) {
                    checkNavigation();
                }

            }else{

                if(typeof(callback) !== 'undefined') {
                    callback(data);
                }
            }

            if(!slider_only) {

                $(document.body).trigger('xt_wooqv-product-loaded');
            }

            if(animationComplete) {

                if(slider_only) {
                    quickView.find('.xt_wooqv-slider-wrapper').unblock();
                }else {
                    quickView.unblock();
                }

                setTimeout(function () {

                    if(!slider_only) {
                        $('html').removeClass('xt_wooqv-loading');
                    }

                }, slider_only ? 0 : 300);

            }else{
                getProductTriggerById(id).unblock();
            }

            isVisible = true;

        }

        function checkNavigation() {

            if(!!XT_WOOQV.modal_nav_enabled) {

                if (moreProductsAvailable()) {

                    $('html').removeClass('xt_wooqv-hide-nav');

                    if (isFirstProduct()) {
                        $('html').addClass('xt_wooqv-first-product');
                    } else {
                        $('html').removeClass('xt_wooqv-first-product');
                    }

                    if (isLastProduct()) {
                        $('html').addClass('xt_wooqv-last-product');
                    } else {
                        $('html').removeClass('xt_wooqv-last-product');
                    }

                    if(getPrevProduct() === null) {
                        $('html').addClass('xt_wooqv-prev-hidden');
                    }else{
                        $('html').removeClass('xt_wooqv-prev-hidden');
                    }

                    if(getNextProduct() === null) {
                        $('html').addClass('xt_wooqv-next-hidden');
                    }else{
                        $('html').removeClass('xt_wooqv-next-hidden');
                    }

                } else {

                    $('html').addClass('xt_wooqv-hide-nav');
                }
            }
        }

        function initProductVariationsEvents() {

            if ( typeof($.fn.wc_variation_form) === 'function' ) {

                quickView.find( '.variations_form' ).each( function() {

                    $( this ).wc_variation_form();

                    $(this).off('found_variation', onFoundVariation);
                    $(this).find('.reset_variations').off('click', onResetVariation);
                    $(this).find('.reset_variations').off(clickSelector, onResetVariation);
                    $(this).on('found_variation', onFoundVariation);
                    $(this).find('.reset_variations').on(clickSelector, onResetVariation);
                });
            }
        }

        function initProductBundleEvents() {

            if ( typeof($.fn.wc_pb_bundle_form) === 'function' ) {

                quickView.find( '.bundle_form' ).each( function() {

                    $( this ).wc_pb_bundle_form();

                    var $bundle_button = $( this ).find('.bundle_button');
                    var $more_info_button = $( this ).find('.xt_wooqv-more-info');

                    if($bundle_button.length && $more_info_button.length) {
                        $more_info_button.appendTo($bundle_button);
                    }
                });
            }
        }

        function initProductCompositeEvents() {

            if ( typeof($.fn.wc_composite_form) === 'function' ) {

                quickView.find( '.composite_form' ).each( function() {

                    $( this ).wc_composite_form();

                    var $composite_button = $( this ).find('.composite_button');
                    var $more_info_button = $( this ).find('.xt_wooqv-more-info');

                    if($composite_button.length && $more_info_button.length) {
                        $more_info_button.appendTo($composite_button);
                    }
                });
            }
        }

        function onFoundVariation ( event, variation ) {

            loadVariation(variation);
        }

        function onResetVariation() {

            getProductContentById(recentProduct, function($product, data) {

                if($product.length) {

                    replaceSliderWrapper($product.find('.xt_wooqv-slider-wrapper'));

                    onProductLoaded(recentProduct, null, data, true);

                }
            });

        }

        function loadVariation(variation) {

            var id = getRecentProductId();
            var variation_id = variation ? variation.variation_id : -1;

            loadProductInfo(id, variation_id, function() {
                resizeInfoBoxHeight();
            });
        }

        function initLightSlider(data, callback) {

            var attachments = parseInt(quickView.find('.xt_wooqv-slider-wrapper').attr('data-attachments'));
            if(attachments <= 1) {
                if(typeof(callback) !== 'undefined') {
                    callback(data);
                }
                return false;
            }

            currentSlider = quickView.find('.xt_wooqv-slider').lightSlider({
                mode: XT_WOOQV.slider_animation,
                auto: !!XT_WOOQV.slider_autoplay,
                pauseOnHover: true,
                pause: 3000,
                item: !!XT_WOOQV.slider_vertical ? 1 : XT_WOOQV.slider_items_desktop,
                loop: true,
                gallery: !!XT_WOOQV.slider_gallery,
                thumbItem: 7,
                thumbMargin: 0,
                slideMargin:0,
                vertical: !!XT_WOOQV.slider_vertical,
                vThumbWidth: 60,
                verticalHeight: sliderFinalHeight * 0.7,
                enableDrag: XT.isTouchDevice(),
                currentPagerPosition: 'left',
                controls: !!XT_WOOQV.slider_arrows_enabled,
                prevHtml: '<span class="xt_wooqv-arrow-icon '+XT_WOOQV.slider_arrow+'"></span>',
                nextHtml: '<span class="xt_wooqv-arrow-icon '+XT_WOOQV.slider_arrow+'"></span>',
                responsive : [
                    {
                        breakpoint:XT_WOOQV.layouts.M,
                        settings: {
                            thumbItem: 11,
                            item: 1,
                        }
                    },
                    {
                        breakpoint:XT_WOOQV.layouts.S,
                        settings: {
                            thumbItem: 9,
                            item: 1,
                        }
                    }
                ],
                onSliderLoad: function(el) {

                    repositionSliderGalleryImages();

                    if(!!XT_WOOQV.slider_lightbox) {

                        el.lightGallery({
                            selector: '.xt_wooqv-slider .lslide',
                            mode: 'lg-'+XT_WOOQV.slider_animation,
                            prevHtml: '<span class="xt_wooqv-arrow-icon '+XT_WOOQV.slider_arrow+'"></span>',
                            nextHtml: '<span class="xt_wooqv-arrow-icon '+XT_WOOQV.slider_arrow+'"></span>',
                            showAfterLoad: false,
                            enableDrag: XT.isTouchDevice()
                        });

                        el.on('onAfterOpen.lg',function(){

                            var slide = el.find('.lslide.active').index();
                            el.data('lightGallery').slide(slide - 1);
                        });

                    }

                    if(typeof(callback) !== 'undefined') {
                        callback(data);
                    }
                }
            });

        }

        function resetSlider(destroyGallery) {

            if(!!XT_WOOQV.can_use_premium_code) {

                if(currentSlider && typeof(currentSlider.refresh) === 'function') {

                    currentSlider.refresh();
                    currentSlider.goToSlide(1);

                    repositionSliderGalleryImages();

                    if(typeof(destroyGallery) !== 'undefined' && destroyGallery && !!XT_WOOQV.slider_lightbox && currentSlider.data('lightGallery')) {

                        currentSlider.data('lightGallery').destroy();
                    }
                }
            }
        }

        function repositionSliderGalleryImages() {

            if(!!XT_WOOQV.slider_gallery && quickView.find('.lSGallery').length) {

                var $slider = quickView.find('.xt_wooqv-slider-wrapper');
                var $gallery = $slider.find('.lSGallery');

                if(!!XT_WOOQV.slider_vertical) {

                    var height = $gallery.height();

                    var top = ($slider.height() - height) / 2;
                    top = top < 0 ? 0 : top;

                    $gallery.css({height: height, top: top});

                }else{

                    var width = $gallery.width();

                    var left = ($slider.width() - width) / 2;
                    left = left < 0 ? 0 : left;

                    $gallery.css({width: width, left: left});
                }

            }

        }

        function _open(id) {

            id = (typeof(id) !== 'undefined') ? id : null;

            if(isVisible) {
                return;
            }

            var $product = (id !== null) ? getProductById(id) : getFirstProduct();

            $product.find('.xt_wooqv-trigger').trigger(clickSelector);
        }

        function _close() {

            closeQuickView(sliderFinalWidth, maxQuickWidth);
        }

        function previousProduct() {

            if(!isVisible || !recentProduct) {
                return;
            }

            var product = getPrevProduct();
            if(product) {
                triggerProductQuickView(product);
            }
        }

        function nextProduct() {

            if(!isVisible || !recentProduct) {
                return;
            }

            var product = getNextProduct();
            if(product) {
                triggerProductQuickView(product);
            }
        }

        function getPrevProduct() {

            var prev = getCurrentIndex() - 1;
            var product = getProductByIndex(prev);

            if(XT_WOOQV.is_inline && product && product.length && product.hasClass('xt_wooqv-inline-wrap')) {

                prev--;
                product = getProductByIndex(prev);
            }

            return product && product.length ? product : null;
        }

        function getNextProduct() {

            var next = getCurrentIndex() + 1;
            var product = getProductByIndex(next);

            if(XT_WOOQV.is_inline && product && product.length && product.hasClass('xt_wooqv-inline-wrap')) {

                next++;
                product = getProductByIndex(next);
            }

            return product && product.length ? product : null;
        }

        function moreProductsAvailable() {

            return getTotalProducts() > 1;
        }

        function isFirstProduct() {

            if(!isVisible || !recentProduct) {
                return false;
            }

            return recentProduct === getFirstProductId();
        }

        function isLastProduct() {

            if(!isVisible || !recentProduct) {
                return false;
            }

            return recentProduct === getLastProductId();
        }

        function getRecentProduct() {

            return getProductById(getRecentProductId());
        }

        function getRecentProductId() {

            if(recentProduct === null || getProductTriggerById(recentProduct).length === 0) {
                recentProduct = getFirstProductId();
            }

            return recentProduct;
        }

        function getRecentVariationId() {

            return recentVariation;
        }

        function getAllProductTriggers() {

            return $(productSelector).find('.xt_wooqv-trigger');
        }

        function getTotalProducts() {

            return getAllProductTriggers().length;
        }

        function getFirstProduct() {

            return getAllProductTriggers().first().closest(productSelector).first();
        }

        function getLastProduct() {

            return getAllProductTriggers().last().closest(productSelector).first();
        }

        function getFirstProductId() {

            return getProductId(getFirstProduct());
        }

        function getLastProductId() {

            return getProductId(getLastProduct());
        }

        function getProductById(id) {

            return getProductTriggerById(id).closest(productSelector).first();
        }

        function getProductByIndex(index) {

            var product_id;
            var product_triggers = getAllProductTriggers().toArray();

            if (index >= 0 && index < product_triggers.length) {
                product_id = $(product_triggers[index]).data('id');
                return getProductById(product_id);
            }

            return null;
        }
        
        function getCurrentIndex() {

            var product_triggers = getAllProductTriggers().toArray();

            return product_triggers.findIndex(function(trigger) {
                return $(trigger).data('id') === getRecentProductId();
            });
        }

        function getProductTriggerById(id) {

            return $('.xt_wooqv-trigger[data-id='+id+']').first();
        }

        function getProductContentById(id, callback) {

            var $product;
            var trigger = getProductTriggerById(id);

            if(trigger.length && trigger.data('uniqid')) {

                var uniqid = trigger.data('uniqid');
                $product = $($('#xt_wooqv-quickview-'+uniqid).html());
            }

            if($product && $product.length) {

                setTimeout(function () {

                    callback($product, null);

                }, animationComplete ? 300 : 0);

            }else {

                var params = {
                    action: 'xt_wooqv_quick_view',
                    id: id
                };

                $.ajax({
                    url: XT_WOOQV.wc_ajax_url.toString().replace('%%endpoint%%', 'xt_wooqv_quick_view'),
                    data: params,
                    type: 'get',
                    success: function (data) {

                        callback($(data.quickview), data);
                    }
                });
            }
        }

        function getProductId(product) {

            return product.length ? product.find('.xt_wooqv-trigger').data('id') : null;
        }

        function triggerProductQuickView(product) {

            var id;
            if(typeof(product) === "number") {
                id = product;
            }else{
                var trigger = product.find('.xt_wooqv-trigger');
                if(trigger.length) {
                    id = trigger.data('id');
                }
            }

            if(id) {

                var variation_id = getProductTriggerById(id).data('variation');

                quickView.velocity('stop');

                isVisible = false;
                recentProduct = null;
                loadProductInfo(id, variation_id, function() {
                    isVisible = true;
                });
            }
        }

        function preloadImage(src, callback)
        {
            if(src) {
                var img=new Image();
                img.src=src;
                img.onload = function() {
                    callback(true);
                    img.remove();
                };
                img.onerror = function() {
                    callback(false);
                    img.remove();
                }
            }else{
                callback(false);
            }
        }

        /**
         * When bottom > window.innerHeight, we know for a fact that the mobile browser footer bar is visible
         */
        function checkMobileOverflowBar() {

            var elementHeight = Math.floor($(this).height());

            if ((window.innerHeight < elementHeight)) {

                mobileBrowserFooterBarHeight = elementHeight - window.innerHeight;

                resizeInfoBoxHeight();

                $('html').addClass('xt_wooqv-mobile-bar-visible');


            } else {

                mobileBrowserFooterBarHeight = 0;

                $('html').removeClass('xt_wooqv-mobile-bar-visible');

                resizeInfoBoxHeight();
            }
        }

        $(function() {

            initVars();
            updateResponsiveVars();
            initEvents();
            triggerQuickViewResize();

        });

        window.xt_wooqv_resize = triggerQuickViewResize;
        window.xt_wooqv_resize_info = resizeInfoBoxHeight;
        window.xt_wooqv_open = _open;
        window.xt_wooqv_close = _close;
        window.xt_wooqv_is_modal_open = function() {
            return isVisible;
        };

        if(!!XT_WOOQV.can_use_premium_code) {
            window.xt_wooqv_previous = previousProduct;
            window.xt_wooqv_is_first = isFirstProduct;
            window.xt_wooqv_is_last = isLastProduct;
            window.xt_wooqv_next = nextProduct;
        }
    });

})( jQuery );
