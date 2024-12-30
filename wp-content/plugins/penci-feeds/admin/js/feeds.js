jQuery(document).ready(function() {

    jQuery('.rss-tooltip').tooltipster({
        'position': 'top-left',
        'theme': 'rss-tooltip-theme'
    });

    // Toggle content for metaboxes
    jQuery('.hndle, .handlediv').click(function() {
        jQuery(this).parent().toggleClass('closed');
        if (jQuery(this).parent().hasClass('closed')) {

        }
    });

    jQuery('.pcfds-meta-box-container').hide();


    function loadPreview()
    {
        var url = jQuery('#pcfds-load-preview-url').val();
        jQuery('#pcfds-preview').show();
        jQuery('#pcfds-preview .inside').empty().addClass('loading');
        jQuery.post(url, jQuery('#pcfds-add-source-form').serialize(), function(data) {
            jQuery('#pcfds-preview .inside').html(data).removeClass('loading');
        });
    }

    jQuery('.feed-preview-btn').click(function() {
        loadPreview();
        return false;
    });

    jQuery('#pcfds-add-source-form').submit(function() {
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

    if (jQuery('#pcfds-add-source-form').hasClass('edit')) {
        loadPreview();
    }

    jQuery('#content-extractor-btn').fancybox({
        beforeLoad: function() {
            jQuery('#content-extractor-iframe').attr('src', jQuery('#pcfds-content-extractor-url').val()+'&feedUrl='+Base64.encode(jQuery('#pcfds-url').val()));
            jQuery.fancybox.update();
        },
        'onClosed' : function() {
            jQuery("#content-extractor").hide();
        }
    });

    jQuery('#pcfds-enable-scrapper').change(function() {
        if (jQuery(this).is(':checked')) {
            jQuery('.content-extractor-options').show();
        } else {
            jQuery('.content-extractor-options').hide();
        }
    });

    jQuery('#pcfds-enable-filters').change(function() {
        if (jQuery(this).is(':checked')) {
            jQuery('.content-filter-options').show();
        } else {
            jQuery('.content-filter-options').hide();
        }
    });

    jQuery('#pcfds-dont-add-excerpt').change(function() {
        if (jQuery(this).is(':checked')) {
            jQuery('#pcfds-limit-excerpt-block').hide();
        } else {
            jQuery('#pcfds-limit-excerpt-block').show();
        }
    });

    jQuery('#pcfds-add-more-tag').change(function() {
        if (jQuery(this).is(':checked')) {
            jQuery('#pcfds-add-more-tag-block').show();
        } else {
            jQuery('#pcfds-add-more-tag-block').hide();
        }
    });

    jQuery('input[name=thumbnail]').change(function() {
        if (jQuery('#featured-upload-option').is(':checked')) {
            jQuery('#featured-upload-block').show();
        } else {
            jQuery('#featured-upload-block').hide();
        }
    });


    // Uploading files
    var fallbackFrames = { image: false };
    var featuredFrames = { image: false };

    jQuery('#featured-upload-block .rss-upload').on('click', function( event ){
        var targetField = jQuery( this ).data( 'target-field' );
        var targetHiddenField = jQuery( this ).data( 'target-hidden-field' );
        var targetType = jQuery( this ).data( 'type' );

        event.preventDefault();

        // If the media frame already exists, reopen it.
        if ( featuredFrames[targetType] ) {
            // Set the post ID to what we want
            featuredFrames[targetType].open();
            return;
        }

        // Create the media frame.
        featuredFrames[targetType] = wp.media.frames.file_frame = wp.media({
            title: jQuery( this ).data( 'dialog-title' ),
            button: {
                text: jQuery( this ).data( 'button-text' ),
            },
            multiple: false  // Set to true to allow multiple files to be selected
        });

        // When an image is selected, run a callback.
        featuredFrames[targetType].on( 'select', function() {
            // We set multiple to false so only get one image from the uploader
            attachment = featuredFrames[targetType].state().get('selection').first().toJSON();

            // Do something with attachment.id and/or attachment.url here
            jQuery("#"+targetField).val(attachment.url).blur();
            jQuery('#'+targetHiddenField).val(attachment.id);
        });

        // Finally, open the modal
        featuredFrames[targetType].open();
    });

    jQuery('#fallback-upload-block .rss-upload').on('click', function( event ){
        var targetField = jQuery( this ).data( 'target-field' );
        var targetHiddenField = jQuery( this ).data( 'target-hidden-field' );
        var targetType = jQuery( this ).data( 'type' );

        event.preventDefault();

        // If the media frame already exists, reopen it.
        if ( fallbackFrames[targetType] ) {
            // Set the post ID to what we want
            fallbackFrames[targetType].open();
            return;
        }

        // Create the media frame.
        fallbackFrames[targetType] = wp.media.frames.file_frame = wp.media({
            title: jQuery( this ).data( 'dialog-title' ),
            button: {
                text: jQuery( this ).data( 'button-text' ),
            },
            multiple: false  // Set to true to allow multiple files to be selected
        });

        // When an image is selected, run a callback.
        fallbackFrames[targetType].on( 'select', function() {
            // We set multiple to false so only get one image from the uploader
            attachment = fallbackFrames[targetType].state().get('selection').first().toJSON();

            // Do something with attachment.id and/or attachment.url here
            jQuery("#"+targetField).val(attachment.url).blur();
            jQuery('#'+targetHiddenField).val(attachment.id);
        });

        // Finally, open the modal
        fallbackFrames[targetType].open();
    });


    jQuery('#pcfds-enable-scrapper').change();
    jQuery('#pcfds-enable-filters').change();
    jQuery('#pcfds-dont-add-excerpt').change();
    jQuery('#pcfds-add-more-tag').change();

    if (jQuery('#featured-upload-option').is(':checked')) {
        jQuery('#featured-upload-block').show();
    } else {
        jQuery('#featured-upload-block').hide();
    }
});

function changeExtractorRule(xpath)
{
    jQuery('#content-extractor-rule').val(xpath);
}

function changeExtractorIgnoreRule(xpath)
{
    jQuery('#content-extractor-ignore-rule').val(xpath);
}