(function($) {
    'use strict';

    var comparisonSlider = {};
    qode.modules.comparisonSlider = comparisonSlider;
    
    comparisonSlider.qodeInitComparisonSlider = qodeInitComparisonSlider;
    comparisonSlider.qodeInitElementorComparisonSlider = qodeInitElementorComparisonSlider;

    comparisonSlider.qodeOnDocumentReady = qodeOnDocumentReady;
    comparisonSlider.qodeOnWindowLoad = qodeOnWindowLoad;

    $(document).ready(qodeOnDocumentReady);
    $(window).on('load', qodeOnWindowLoad);

    /*
     All functions to be called on $(window).load() should be in this function
     */
    function qodeOnDocumentReady() {
        qodeInitComparisonSlider();
    }
    
    function qodeOnWindowLoad() {
        qodeInitElementorComparisonSlider();
    }

    function qodeInitComparisonSlider() {
        var cmpSliders = $('.qode-comparison-slider');

        if (cmpSliders.length) {
            cmpSliders.each(function (i) {
                var cmpSlider = $(this);

                var orientation = cmpSlider.data('orientation');
                var offset = cmpSlider.data('offset') / 100;

                cmpSlider.waitForImages(function () {
                    cmpSlider.css('visibility', 'visible');
                    cmpSlider.twentytwenty({
                        default_offset_pct: 1.1,
                        orientation: orientation
                    });
                });

                cmpSlider.appear(function () {
                    setTimeout(function () {
                        var height = cmpSlider.height(),
                            width = cmpSlider.width(),
                            pixelHeight = height * offset, //target value
                            pixelWidth = width * offset, //target value
                            handle = cmpSlider.find('.twentytwenty-handle'),
                            image = cmpSlider.find('img:first-of-type'),
                            transitionTime = 700,
                            transitionEasing = 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                            transitionDelay = 100;

                        var position = function () {
                            if (orientation == 'horizontal') {
                                handle.css({
                                    'left': +pixelWidth + 1 + 'px'
                                });

                                image.css({
                                    'clip': 'rect(0px ' + pixelWidth + 'px ' + height + 'px 0px)'
                                });
                            } else {
                                handle.css({
                                    'top': +pixelHeight + 1 + 'px'
                                });

                                image.css({
                                    'clip': 'rect(0px ' + width + 'px ' + pixelHeight + 'px 0px)'
                                });
                            }
                        }

                        image.css('transition', 'all ' + transitionTime + 'ms ' + transitionEasing + ' ' + transitionDelay + 'ms');
                        handle.css('transition', 'all ' + transitionTime + 'ms ' + transitionEasing + ' ' + transitionDelay + 'ms');

                        position();

                        setTimeout(function () {
                            image.css('transition', 'none');
                            handle.css('transition', 'none');
                        }, transitionTime);

                        $(window).resize(function () {
                            height = cmpSlider.height();
                            width = cmpSlider.width();
                            pixelHeight = height * offset; //target value
                            pixelWidth = width * offset; //target value
                            position();
                        });
                    }, 100); //necessary for calcs
                }, {accX: 0, accY: -200});
            });
        }
    }
    
    function qodeInitElementorComparisonSlider() {
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_comparison_slider.default', function() {
                qodeInitComparisonSlider();
            } );
        });
    }

})(jQuery);