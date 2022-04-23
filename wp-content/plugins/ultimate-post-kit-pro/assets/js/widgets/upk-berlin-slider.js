(function ($, elementor) {

    'use strict';

    var widgetBerlinSlider = function ($scope, $) {

        var $slider = $scope.find('.upk-berlin-slider'),
            $settings = $slider.data('settings'),
            $widgetSettings = $slider.data('widget');

        if (!$slider.length) {
            return;
        }
 
 
        const Swiper = elementorFrontend.utils.swiper;
        initSwiper();
        async function initSwiper() {

            var $thumbs = $slider.find('.upk-thumbs-slider.swiper-container');
            var $preview = $slider.find('.upk-main-slider.swiper-container');

            var mainSlider = await new Swiper($preview, $settings);

            var sliderThumbs = await new Swiper($thumbs, {
                spaceBetween: 15,
                slidesPerView: 2,
                touchRatio: 0.2,
                slideToClickedSlide: true,
                loop: ($settings.loop) ? $settings.loop : false,
                speed: ($settings.speed) ? $settings.speed : 500,
                loopedSlides: 4,
                 breakpoints: {
                     768: {
                         slidesPerView: 2.5,
                     },
                     1024: {
                         slidesPerView: 3,
                     },
                     1440: {
                         slidesPerView: 4,
                     },
                 }
            });

            mainSlider.controller.control = sliderThumbs;
            sliderThumbs.controller.control = mainSlider;

            mainSlider.on('slideChange', function () {
                stopVideos();

            });

            var stopVideos = function () {
                $slider.find('.upk-video-wrap').css('z-index', -1);
                var videos = $slider.find('.upk-video-iframe');
                Array.prototype.forEach.call(videos, function (video) {
                    var src = video.src;
                    video.src = src.replace("autoplay=1", "");
                    // $slider.find('.upk-video-iframe').prop("src", "");
                    $slider.find('.upk-play-button-wrapper input:checkbox').prop('checked', false);
                });
            };

            $slider.find('.upk-video-trigger').on('click', function () {
                var videoURL = $(this).data('src').split('?')[0],
                    sliderWrapper = $slider.find('.swiper-slide-active');
                $slider.find('.upk-play-button-wrapper input:checkbox').prop('checked', true);
                sliderWrapper.find('.upk-video-iframe').attr("src", videoURL + "?autoplay=1&modestbranding=1&showinfo=0&rel=0&controls=0&loop=1");
                sliderWrapper.find('.upk-video-wrap').css('z-index', 10);

            });

        }


    };


    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/upk-berlin-slider.default', widgetBerlinSlider);
    });

}(jQuery, window.elementorFrontend));