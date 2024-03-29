(function($) {
    'use strict';

    var customFont = {};
    qode.modules.customFont = customFont;

    customFont.qodeCustomFontTypeOut = qodeCustomFontTypeOut;
    customFont.qodeInitElementorCustomFont = qodeInitElementorCustomFont;

    customFont.qodeOnDocumentReady = qodeOnDocumentReady;
    customFont.qodeOnWindowLoad = qodeOnWindowLoad;

    $(document).ready(qodeOnDocumentReady);
    $(window).on('load', qodeOnWindowLoad);

    /*
     All functions to be called on $(window).load() should be in this function
     */
    function qodeOnDocumentReady() {
        qodeCustomFontTypeOut();
    }
    
    function qodeOnWindowLoad() {
        qodeInitElementorCustomFont();
    }
    
    function qodeCustomFontTypeOut() {
        var qodeTyped = $('.qode-cf-typed');
        
        if (qodeTyped.length) {
            qodeTyped.each(function () {
                
                //vars
                var thisTyped = $(this),
                    typedWrap = thisTyped.parent('.qode-cf-typed-wrap'),
                    customFontHolder = typedWrap.parent('.custom_font_holder'),
                    strings = typedWrap.data( 'strings' ),
                    options = {
                        strings: strings,
                        typeSpeed: 90,
                        backDelay: 700,
                        loop: true,
                        contentType: 'text',
                        loopCount: false,
                        cursorChar: '_'
                    }
                    
                    if( strings.length > 0 ) {
                        customFontHolder.appear(function () {
                            var typed = new Typed(
                                thisTyped[0],
                                options
                            );
                        }, {accX: 0, accY: 200});
                    }
            });
        }
    }
    
    function qodeInitElementorCustomFont(){
        $(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_custom_font.default', function() {
                qodeCustomFontTypeOut();
            } );
        });
    }

})(jQuery);