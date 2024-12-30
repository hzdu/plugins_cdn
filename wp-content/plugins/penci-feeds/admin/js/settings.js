jQuery(document).ready(function() {

    // Toggle content for metaboxes
    jQuery('.hndle, .handlediv').click(function() {
        jQuery(this).parent().toggleClass('closed');
        if (jQuery(this).parent().hasClass('closed')) {

        }
    });

    jQuery('#pcfds-settings-form').submit(function() {
        jQuery.post(
            jQuery(this).attr('action'),
            jQuery(this).serialize(),
            function(data) {
                if (data.status) {
                    window.location = data.redirect_url;
                } else {
                    displayErrors(data.errors);
                }
            },
            'json'
        );
        return false;
    });

    function displayErrors(errors)
    {
        if (!errors) return;
        var offsetTop = 0;
        jQuery.each(errors, function(name, error) {
            var elements = jQuery.find('[name="'+name+'"]');
            if (elements.length) {
                jQuery('[name="'+name+'"]').last().parents('.pcfds-field-container').first().append('<p class="pcfds-error-notice">'+error+'</p>');
                if (!offsetTop) {
                    offsetTop = jQuery('[name="'+name+'"]').last().parents('.pcfds-field-container').first().offset().top;
                }
            }
        });
        if (offsetTop) {
            jQuery(window).scrollTop(offsetTop);
        }
    }

    function clearErrors()
    {
        jQuery('.pcfds-error-notice').remove();
    }
});