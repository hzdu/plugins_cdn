var isEditMode = false;
var breakpoints = aepro.breakpoints;
( function( $ ) {

    var WooProductsCarousel = function ( $scope , $ ) {

        outer_wrapper =  $scope.find('.ae-swiper-outer-wrapper');

        wid = $scope.data('id');
        wclass = '.elementor-element-' + wid;
        var direction = outer_wrapper.data('direction');
        var speed = outer_wrapper.data('speed');
        var autoplay = outer_wrapper.data('autoplay');
        var duration = outer_wrapper.data('duration');
        var effect = outer_wrapper.data('effect');
        var space = outer_wrapper.data('space');

        var loop = outer_wrapper.data('loop');
        if(loop == 'yes'){
            loop = true;
        }
        else{
            loop = false;
        }
        var zoom = outer_wrapper.data('zoom');
        var slides_per_view = outer_wrapper.data('slides-per-view');
        var ptype = outer_wrapper.data('ptype');
        var navigation = outer_wrapper.data('navigation');
        var clickable = outer_wrapper.data('clickable');

        var pclickable = true;
        if (clickable == 'yes') {
            pclickable = true;
        }else{
            pclickable = false;
        }

        var keyboard = outer_wrapper.data('keyboard');
        var scrollbar = outer_wrapper.data('scrollbar');
        adata = {
            direction: direction,
            speed: speed,
            autoplay: duration,
            effect: effect,
            spaceBetween: space,
            loop: loop,
            zoom: zoom,
            slidesPerView: slides_per_view,
            keyboard: keyboard,
            wrapperClass: 'ae-swiper-wrapper',
            slideClass: 'ae-swiper-slide',
            onInit: function(swiper){

            }
        };

        if (navigation == 'yes') {
            adata['navigation'] = {
                nextEl: '.ae-swiper-button-next',
                prevEl: '.ae-swiper-button-prev',
            }
        }

        if (ptype != '') {

            adata['pagination'] = {
                el: '.ae-swiper-pagination',
                type: ptype,
                clickable: pclickable
            }
        }
        if (scrollbar == 'yes') {

            adata['scrollbar'] = {
                el: '.ae-swiper-scrollbar',
                hide: true
            };
        }

        if(loop == false) {
            adata['autoplayStopOnLast'] = true;
        }


        window.mswiper = new Swiper( '.elementor-element-' + wid  + ' .ae-swiper-container', adata);
        $('.elementor-element-' + wid  + ' .ae-swiper-container').css('visibility','visible');
    };

    var DynamicBgHandler = function ( $scope , $ ) {
        if ( $scope.data( 'ae-bg' ) ){
            $scope.css('background-image','url(' + $scope.data( 'ae-bg' ) + ')');
        }

        BgSliderHandler( $scope , $);

        if(isEditMode){
            return;
        }

        if($scope.parents('.ae-carousel-yes').length > 0){
            return;
        }

        if($scope.parents('.facetwp-template ').length > 0 ) {
            return;
        }


        if ( $scope.data( 'ae-url' ) && $scope.hasClass('ae-link-yes') ){
            $scope.on('click', function (e) {
                if ( $scope.data( 'ae-url' ) && $scope.hasClass('ae-new-window-yes') ) {
                    window.open($scope.data('ae-url'));
                }else{
                    location.href = $scope.data('ae-url');
                }
            })
        }
    };

    $(window).on( 'elementor/frontend/init', function() {

        if ( elementorFrontend.isEditMode() ) {
            isEditMode = true;
        }

       // elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-woo-gallery.default', 	WooGalleryHandler );

        //elementorFrontend.hooks.addAction( 'frontend/element_ready/ae-woo-products.carousel', 	WooProductsCarousel );


    });

} )( jQuery );