(function ($) {
    "use strict";
    var PENCI = PENCI || {};

    PENCI.portfolio_extra = function () {
        if ($().theiaStickySidebar) {
            var top_margin = 90,
                pbody = $('body');
            if (pbody.hasClass('admin-bar') && pbody.hasClass('penci-vernav-enable')) {
                top_margin = 62;
            } else if (!$('body').hasClass('admin-bar') && $('body').hasClass('penci-vernav-enable')) {
                top_margin = 30;
            } else if ($('body').hasClass('admin-bar') && !$('body').hasClass('penci-vernav-enable')) {
                top_margin = 122;
            }

            if ($('body.single-portfolio').find('.portfolio-page-content.portfolio-sticky-content').length > 0) {

                $('.post-entry.portfolio-style-3 .penci-portfolio-meta-wrapper,.post-entry.portfolio-style-3 .portfolio-sticky-content').theiaStickySidebar({
                    additionalMarginTop: top_margin,
                });
            }

        } // if sticky
    }

    /* Init functions
	 ---------------------------------------------------------------*/
    $(document).ready(function () {
        PENCI.portfolio_extra();
    });
})(jQuery);	// EOF
