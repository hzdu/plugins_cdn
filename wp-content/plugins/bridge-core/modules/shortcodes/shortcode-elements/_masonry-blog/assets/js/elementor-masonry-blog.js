(function($) {
    'use strict';

    var elementorMasonryBlog = {};
    qode.modules.elementorMasonryBlog = elementorMasonryBlog;

    elementorMasonryBlog.qodeInitElementorMasonryBlog = qodeInitElementorMasonryBlog;


    elementorMasonryBlog.qodeOnWindowLoad = qodeOnWindowLoad;

    $(window).on('load', qodeOnWindowLoad );

    /*
     ** All functions to be called on $(window).load() should be in this function
     */
    function qodeOnWindowLoad() {
        qodeInitElementorMasonryBlog();
    }

    function qodeInitElementorMasonryBlog(){
        $j(window).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_masonry_blog.default', function() {
                initQBlog();
            } );
        });
    }

})(jQuery);