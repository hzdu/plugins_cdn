(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.tabswidget = function () {
        $(document).on('click', '.penc-posts-tabs .tabs li a', function (e) {
            var parent = $(this).closest('.penc-posts-tabs'),
                li = $(this).parent('li'),
                tab = li.data('tab');

            e.preventDefault();

            parent.find('.tabs ul > li').removeClass('active');
            li.addClass('active');

            parent.find('.tabs-content > div').removeClass('active').addClass('inactive');
            parent.find('.' + tab).addClass('active');
        });
    };

    $(document).ready(function () {
        PENCI.tabswidget();
    });
})(jQuery);
