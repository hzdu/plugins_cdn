(function($, elementor) {

    'use strict';

    var widgetCtA = function() {

        $('.penci-ct-accordion').each(function(e){

            var $ctAcc = $(this),
                $settings = $ctAcc.data('settings'),
                mouse_event = $settings.mouse_event == 'mouseover' ? 'mouseover mouseenter' : $settings.mouse_event;

            var accordionItem = $ctAcc.find('.penci-ct-accordion-item');
            var totalItems = $ctAcc.children().length;

            if (($settings.activeItem == true) && ($settings.activeItemNumber <= totalItems)) {
                $ctAcc.find('.penci-ct-accordion-item').removeClass('active');
                $ctAcc.children().eq($settings.activeItemNumber - 1).addClass('active');
            }

            if (window.matchMedia('(max-width: 960px)').matches){
                mouse_event = 'click';
            }
            
            $(accordionItem).on(mouse_event, function() {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
            });

            if ($settings.activeItem != true) {
                $("body").on(mouse_event, function(e) {
                    if (e.target.$ctAcc == "penci-ct-accordion" || $(e.target).closest(".penci-ct-accordion").length) {} else {
                        $ctAcc.find('.penci-ct-accordion-item').removeClass('active');
                    }
                });
            }
        });
    };

    jQuery(window).on('elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/penci-content-accordion.default', widgetCtA);
    });

    jQuery(window).on('resize', function() {
        widgetCtA();
    });

}(jQuery, window.elementorFrontend));