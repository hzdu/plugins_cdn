jQuery(document).ready(function ($) {

    jQuery('.ultimate-post-kit-notice.is-dismissible .notice-dismiss').on('click', function () {
        $this = jQuery(this).parents('.ultimate-post-kit-notice');
        var $id = $this.attr('id') || '';
        var $time = $this.attr('dismissible-time') || '';
        var $meta = $this.attr('dismissible-meta') || '';

        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'ultimate-post-kit-notices',
                id: $id,
                meta: $meta,
                time: $time,
            },
        });

    });

});