(function ($) {
    'use strict';

    var numberedCarousel = {};
    qode.modules.numberedCarousel = numberedCarousel;

    numberedCarousel.qodeNumberedCarousel = qodeNumberedCarousel;
    numberedCarousel.qodeInitElementorNumberedCarousel = qodeInitElementorNumberedCarousel;
    
    numberedCarousel.qodeOnDocumentReady = qodeOnDocumentReady;
    numberedCarousel.qodeOnWindowLoad = qodeOnWindowLoad;

    $(document).ready(qodeOnDocumentReady);
    $(window).on('load', qodeOnWindowLoad);
    
    function qodeOnDocumentReady() {
        qodeNumberedCarousel().init();
    }
    
    function qodeOnWindowLoad() {
        qodeInitElementorNumberedCarousel();
    }
    
    function qodeNumberedCarousel() {
        //initial setup
        var setup = function (carousel) {
            var swiper = new Swiper(carousel, {
                speed: 800,
                centeredSlides: true,
                slidesPerView: 'auto',
                allowTouchMove: false,
                init: false
            });

            var holder = carousel.closest('.qode-numbered-carousel'),
                bgItems = holder.find('.qode-nc-bg-item'),
                indicators = holder.find('.qode-nc-indicator'),
                gridTrigger = holder.find('.qode-nc-grid-line:last-child'),
                ieFallback = qode_body.hasClass('qode-ms-explorer');

            swiper.on('init', function () {
                holder.data('items', bgItems.length);

                iterate(holder, carousel, bgItems, indicators, carousel.find('.swiper-wrapper'));
                changeActiveSlide(holder, swiper);

                //initial animation
                carousel
                    .addClass('qode-show')
                    .one(qode.transitionEnd, function () {
                        holder.addClass('qode-initialized');
                        gridTrigger.one(qode.transitionEnd, function () {
                            holder.data('idle', true);
                        });
                        ieFallback && holder.data('idle', true);
                    });
            });

            swiper.on('slideChangeTransitionEnd', function () {
                iterate(holder, carousel, bgItems, indicators, carousel.find('.swiper-wrapper'));

                //wait for last item to unmask
                holder.removeClass('qode-mask');
                gridTrigger.one(qode.transitionEnd, function () {
                    holder.data('idle', true);
                });
                ieFallback && holder.data('idle', true);
            });

            //initialize swiper
            carousel.waitForImages(swiper.init());
        }

        //toggle on every slide iteration
        var iterate = function (holder, carousel, bgItems, indicators, wrapper) {
            setActiveIndex(holder, carousel);
            changeActiveItem(holder, bgItems);
            changeActiveItem(holder, indicators);
            !qode_body.hasClass('qode-ms-explorer') && roundTransformVal(wrapper);
        }

        //fix swiper calcs for center layout type
        var roundTransformVal = function (wrapper) {
            var val = Math.round(wrapper.css('transform').split(',')[4]);
            
            wrapper.css('transform', 'matrix(1, 0, 0, 1, ' + val + ', 0)');
        }

        //sets active index to holder element
        var setActiveIndex = function (holder, carousel) {
            var activeIndex = carousel.find('.swiper-slide-active').data('index');
            holder.data('active-index', activeIndex);
        }

        //change css class
        var changeClass = function (holder, cssClass) {
            holder
                .removeClass('qode-next qode-prev')
                .addClass(cssClass);
        }

        //declarative item change - bg item, indicators
        var changeActiveItem = function (holder, items) {
            var activeItem = items.filter(function () {
                return $(this).data("index") == holder.data('active-index')
            });

            items.removeClass('qode-active');
            activeItem.addClass('qode-active');
        }

        //declarative slide change
        var changeActiveSlide = function (holder, swiper) {
            var delay = 500,
                speed = 800;

            var slideTo = function (holder, swiper, direction) {
                changeClass(holder, 'qode-' + direction);

                holder.data('idle', false);
                holder.addClass('qode-mask');

                if (direction == 'next') {
                    setTimeout(function () {
                        swiper.slideNext(speed);
                    }, delay);
                } else {
                    //fade before transition
                    holder.addClass('qode-fade-prev-content');
                    setTimeout(function () {
                        holder.removeClass('qode-fade-prev-content');
                        swiper.slidePrev(speed);
                    }, delay * 1.5);
                }
            }

            var clickHandler = function (e) {
                var item = $(e.currentTarget);

                if (item.hasClass('swiper-slide-next')) {
                    holder.data('idle') && slideTo(holder, swiper, 'next');
                } else if (item.hasClass('swiper-slide-prev')) {
                    holder.data('idle') && slideTo(holder, swiper, 'prev');
                }
            }

            var wheelHandler = function (e) {
                if (holder.data('idle')) {
                    var direction = e.deltaY > 0 ? 'next' : 'prev',
                        activeIndex = holder.data('active-index');

                    if (direction == 'next' && activeIndex < holder.data('items') ||
                        direction == 'prev' && activeIndex > 1) {
                        slideTo(holder, swiper, direction);
                    }
                }
            }

            var touchStart = function (e) {
                holder.data('touch-start', parseInt(e.changedTouches[0].clientX));
            }

            var touchMove = function (e) {
                holder.data('touch-move', parseInt(e.changedTouches[0].clientX));

                var delta = holder.data('touch-move') - holder.data('touch-start');

                if (holder.data('idle')) {
                    var direction = delta < 0 ? 'next' : 'prev',
                        activeIndex = holder.data('active-index');

                    if (direction == 'next' && activeIndex < holder.data('items') ||
                        direction == 'prev' && activeIndex > 1) {
                        slideTo(holder, swiper, direction);
                    }
                }
            }

            holder.on('click', '.swiper-slide', clickHandler);
            if (holder.hasClass('qode-change-on-scroll')) {
                holder[0].addEventListener('wheel', wheelHandler);
                Modernizr.touch && holder[0].addEventListener('touchstart', touchStart);
                Modernizr.touch && holder[0].addEventListener('touchmove', touchMove);
            }

            if (qode.windowWidth < 1025) {
                var dragEvent = {
                    down: 'touchstart',
                    up: 'touchend',
                    target: 'srcElement',
                }

                var getXPos = function (e) {
                    return e.originalEvent.changedTouches[0].clientX;
                }

                var touchScrolling = function (oldEvent, newEvent) {
                    var oldY = oldEvent.originalEvent.changedTouches[0].clientY,
                        newY = newEvent.originalEvent.changedTouches[0].clientY;

                    if (Math.abs(newY - oldY) > 100) { // 100 is drag sensitivity
                        return true;
                    };
                    return false;
                }

                var mouseDown = false;
                holder.on(dragEvent.down, function (e) {
                    if (!mouseDown && !$(e[dragEvent.target]).is('a, span')) {
                        var oldEvent = e,
                            xPos = getXPos(e);
                        mouseDown = true;

                        holder.one(dragEvent.up, function (e) {
                            var xPosNew = getXPos(e);
                            if (Math.abs(xPos - xPosNew) > 10 && !touchScrolling(oldEvent, e)) {
                                var activeIndex = holder.data('active-index');
                                if (xPos > xPosNew) {
                                    activeIndex < holder.data('items') && slideTo(holder, swiper, 'next');
                                } else {
                                    activeIndex > 1 && slideTo(holder, swiper, 'prev');
                                }
                            }
                            mouseDown = false;
                        });
                    }
                });
            }
        }

        return {
            init: function () {
                var carousels = $('.qode-numbered-carousel');

                if (carousels.length) {
                    carousels.each(function () {
                        var carousel = $(this).find('.swiper-container');

                        setup(carousel);
                    });
                }
            }
        }
    }
    
    function qodeInitElementorNumberedCarousel(){
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_numbered_carousel.default', function() {
                qode.modules.numberedCarousel.qodeNumberedCarousel().init();
            } );
        });
    }
})(jQuery);