jQuery(document).ready(function($) {
    //"use strict";

    var accordion = $('#tw-main-outer-wrapper-id').attr('data-accordion');

    var tab_item_width = $('#tw-main-outer-wrapper-id').attr('data-tab-width');


    if (accordion == 'true'){
        // For Accordion
        $( window ).resize(function() {

            if($(window).width() <= 768){
                $('.woocommerce-tabs > ul > li').each(function(){
                    $(this).find('a').addClass('tw-slider-down');
                    var tab_id = $(this).attr('id');
                    var array_break = tab_id.split('-');
                    var current_id = array_break[2];
                    var cor_div_id = '#tab-' + current_id ;
                    $(this).closest('.woocommerce-tabs').find(cor_div_id).appendTo('#' + tab_id);
                });

                $('body').on( 'click', '.wc-tabs li a', function( e ) {

                    var dist = $(this).offset().top;

                    if($(this).hasClass('tw-slider-down')){
                        var $tab = $(this);
                        var $tabs_wrapper = $tab.closest( '.wc-tabs-wrapper' );
                        var $tabs = $tabs_wrapper.find( 'ul.wc-tabs' );
                        if(!$tab.closest( 'li' ).hasClass('active')){
                            $tabs.find( 'li' ).removeClass( 'active' );
                            $tabs_wrapper.find( '.wc-tab, .panel:not(.panel .panel)' ).slideUp('600');

                            $tab.closest( 'li' ).addClass( 'active' );
                            $tabs_wrapper.find( $tab.attr( 'href' ) ).slideDown('600');
                        }
                    }

                    window.scrollTo(0, dist);
                    
                });
            }
        });



    }

    if (tab_item_width !=''){
        $('#tw-main-outer-wrapper-id').find('.wc-tabs > li').css('width', tab_item_width);
    }

    // Map Code
    var maps = [];
    var markers = [];
    function initMap(var_lati, var_long) {

        var $maps = $('.tw-google-map');
        $.each($maps, function (i, value) {
            var zoom_level = parseInt($(value).data('zoomlevel'));
            var location = { lat: parseFloat($(value).data('latitude')), lng: parseFloat($(value).data('longitude')) };
            var mapDivId = $(value).attr('id');

            maps[mapDivId] = new google.maps.Map(document.getElementById(mapDivId), {
                zoom: zoom_level,
                center: location
            });

            markers[mapDivId] = new google.maps.Marker({
                position: location,
                map: maps[mapDivId]
            });
        });
    }

    initMap();
    
    // FAQ Toggle Class

    $('body').on('click', '.tw-faq-question-wrapper', function(e) {
        $(this).toggleClass('tw-faq-show-answer-active');
        $(this).closest('.tw-faq-wrap').find('.tw-faq-answer-wrapper').slideToggle('fast', function () {
            $(this).closest('.tw-faq-wrap').find('.tw-faq-answer-wrapper').toggleClass('tw-faq-show-answer');
        });

    });

    $('.tw_custom_link').each(function(){
        var custom_link = $(this).attr('data-custom-link-url');
        var custom_link_target = $(this).attr('data-custom-link-target');

        var tab_id = $(this).closest('.wc-tab').attr('id');

        var array_break = tab_id.split('-');
        var current_id = array_break[1];

        $(this).closest('.woocommerce-tabs').find('.'+current_id+'_tab > a ').attr("href", custom_link).attr('target', custom_link_target);
        
    });

    
});