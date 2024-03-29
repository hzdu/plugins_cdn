(function ($) {
    'use strict';

    var interactiveLinks = {};
    qode.modules.interactiveLinks = interactiveLinks;

    interactiveLinks.qodeInteractiveLinks = qodeInteractiveLinks;


    interactiveLinks.qodeOnDocumentReady = qodeOnDocumentReady;
    interactiveLinks.qodeOnWindowLoad = qodeOnWindowLoad;

    $(document).ready(qodeOnDocumentReady);
    $(window).on('load', qodeOnWindowLoad);

    /*
     All functions to be called on $(document).ready() should be in this function
     */
    function qodeOnDocumentReady() {
        qodeInteractiveLinks();
    }

    /*
     All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeElementorInteractiveLinks();
    }


    function qodeInteractiveLinks() {
        var holders = $('.qode-interactive-links');

        if (holders.length) {
            holders.each(function () {
                var thisHolder = $(this),
                    links = thisHolder.find('.qode-il-titles-holder .qode-il-link'),
                    images = thisHolder.find('.qode-il-image');

                if( links.length ){
                    links.eq(0).addClass('qode-active');
                    images.eq(0).addClass('qode-active');

                    links.each(function(){
                        var thisLink = $(this);

                        thisLink.on('mouseenter', function(){
                            if( ! thisLink.hasClass('qode-active') ) {
                                var index = thisLink.data('index');
                                images.removeClass('qode-active');
                                links.removeClass('qode-active');
                                thisLink.addClass('qode-active');
                                images.eq(index).addClass('qode-active');
                            }
                        })
                    })
                }
            });
        }
    }

    function qodeElementorInteractiveLinks(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/qode_interactive_links.default', function() {
                qodeInteractiveLinks();
            } );
        });
    }

})(jQuery);