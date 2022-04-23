(function ($, elementor) {

    'use strict';

    var widgetFoxicoSlider = function ($scope, $) {

        var $carousel = $scope.find('.upk-foxico-slider-wrap'),
            $mainSlider = $scope.find('.upk-main-slide');
        if (!$carousel.length) {
            return;
        }

        var $carouselContainer = $carousel.find('.swiper-container'),
            $settings = $mainSlider.data('settings'),
            $sliderSettings = $mainSlider.data('slider-settings');

        const Swiper = elementorFrontend.utils.swiper;
        initSwiper();
        async function initSwiper() {
            var mainSlider = await new Swiper($carouselContainer, $settings);

            if ($settings.pauseOnHover) {
                $($carouselContainer).hover(function () {
                    (this).swiper.autoplay.stop();
                }, function () {
                    (this).swiper.autoplay.start();
                });
            }

            // start fraction
            if ($sliderSettings.showFraction === true){
                $(document).ready(function () {
                    var totalSlide = $carousel.find('.swiper-pagination-total').text();
                    $carousel.find('.upk-total-count').text(totalSlide.toString().padStart(2, '0'));
                });

                mainSlider.on('transitionStart', function () {
                    $carousel.find('.upk-thumb-pagination .upk-current-count').css({
                        'transform': 'translateY(10px)',
                        'opacity': 0
                    });
                });

                mainSlider.on('transitionEnd', function () {
                    $carousel.find('.upk-thumb-pagination .upk-current-count').css({
                        'transform': 'translateY(0px)',
                        'opacity': 1
                    });

                    var index = $carousel.find('.swiper-pagination-current').text();
                    $carousel.find('.upk-thumb-pagination .upk-current-count').text(index.toString().padStart(2, '0'));

                });
            }
            // end fraction


            var $thumbs = $carousel.find('.upk-thumbs-slide');

            if ($sliderSettings.showPagination !== false) {
                $carousel.find(".swiper-pagination-bullets").children().each(function (i, total) {
                    $(this).text(i += 1);
                });
            }

            var sliderThumbs = await new Swiper($thumbs, {
                parallax: true,
                spaceBetween: 10,
                slidesPerView: 4,
                touchRatio: 0.2,
                slideToClickedSlide: true,
                loop: ($settings.loop) ? $settings.loop : false,
                speed: ($settings.speed) ? $settings.speed : 500,
                loopedSlides: 4,
                navigation: {
                    nextEl: " .upk-button-next",
                    prevEl: " .upk-button-prev",
                },
                pagination: {
                    el: ".upk-number-pagination",
                    type: "fraction",
                },
                breakpoints: {
                    768: {
                        slidesPerView: 1.5,
                    },
                    1024: {
                        slidesPerView: 1.5,
                    },
                    1440: {
                        slidesPerView: 2.5,
                    },
                },

            });

            mainSlider.controller.control = sliderThumbs;
            sliderThumbs.controller.control = mainSlider;
        };
    };


    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/upk-foxico-slider.default', widgetFoxicoSlider);
    });

}(jQuery, window.elementorFrontend));