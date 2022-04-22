window.WP_Grid_Builder && WP_Grid_Builder.on('init', function (wpgb) {

    wpgb.facets.on( 'refresh', function() {
        jQuery('.ae-post-collection').css({ 'opacity': '0.6', 'pointer-events': 'none' });

    } );
    wpgb.facets.on('loaded', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/ae-post-blocks-adv.grid', PostBlocksAdvHandler);
        jQuery('.ae-post-collection').css({ 'opacity': '1', 'pointer-events': 'all' });
    });

});
const PostBlocksAdvHandler = ($scope, jQuery) => {
   
    $scope.find('.elementor-section').each(function(){
        elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
    });

    $scope.find('.elementor-column').each(function(){
        elementorFrontend.elementsHandler.runReadyTrigger(jQuery(this));
    });
  
}
