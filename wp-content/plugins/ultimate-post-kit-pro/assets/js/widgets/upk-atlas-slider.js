(function ($, elementor) {

    'use strict';

    var widgetAtlasSlider = function ($scope, $) {

        var $slider = $scope.find('.upk-atlas-slider'),
            $settings = $slider.data('settings'),
            $widgetSettings = $slider.data('widget');

        if (!$slider.length) {
            return;
        }

        const Swiper = elementorFrontend.utils.swiper;
        initSwiper();
        async function initSwiper() {

            var $thumbs = $slider.find('.upk-atlas-slider-playlist');
            var $preview = $slider.find('.upk-atlas-slider-preview');

            var mainSlider = await new Swiper($preview, $settings);

            var sliderThumbs = await new Swiper($thumbs, {
                spaceBetween: 10,
                slidesPerView: 7,
                touchRatio: 0.2,
                slideToClickedSlide: true,
                loop: ($settings.loop) ? $settings.loop : false,
                speed: ($settings.speed) ? $settings.speed : 500,
                loopedSlides: 4,
                scrollbar: {
                    el: $widgetSettings.id + ' .swiper-scrollbar',
                    draggable: true,
                },
                breakpoints: {
                    0: {
                        direction: 'horizontal',
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    768: {
                        direction: 'vertical',
                        slidesPerView: 6,
                        spaceBetween: 10,
                    },
                    1024: {
                        direction: 'vertical',
                        slidesPerView: 7,
                        spaceBetween: 20,
                    },
                },
            });

            mainSlider.controller.control = sliderThumbs;
            sliderThumbs.controller.control = mainSlider;

            mainSlider.on('slideChange', function () {
                stopVideos();
            });

            var stopVideos = function () {
                $slider.find('.upk-atlas-video-wrap').css('z-index', -1);
                var videos = $slider.find('.upk-atlas-video-iframe');
                Array.prototype.forEach.call(videos, function (video) {
                    var src = video.src;
                    video.src = src.replace("?autoplay=1", "");
                    $slider.find('.upk-atlas-video-iframe').prop("src", "");
                });
            };

            $slider.find('.upk-atlas-video-trigger').on('click', function () {
                var videoURL = $(this).data('src').split('?')[0],
                    sliderWrapper = $slider.find('.swiper-slide-active .upk-atlas-image-wrap');

                sliderWrapper.find('.upk-atlas-video-iframe').attr("src", videoURL + "?autoplay=1");
                sliderWrapper.find('.upk-atlas-video-wrap').css('z-index', 10);

            });
        }


    };


    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/upk-atlas-slider.default', widgetAtlasSlider);
    });

}(jQuery, window.elementorFrontend));