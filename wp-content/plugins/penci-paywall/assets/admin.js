(function ($) {

    'use strict';

    $(document).on('ready', function (e, data) {
        var wrapper = $('#wpinv_item_details'),
            select = $('#wpinv_item_type');
        wrapper.find('.penci_gp_options').hide();

        var classname = select.val();
        wrapper.find('.penci_gp_options').hide();
        wrapper.find('.pc_show_' + classname).show();

        select.on('change', function (e) {
            classname = this.value;
            wrapper.find('.penci_gp_options').hide();
            wrapper.find('.pc_show_' + classname).show();
        });

    });
})(jQuery)