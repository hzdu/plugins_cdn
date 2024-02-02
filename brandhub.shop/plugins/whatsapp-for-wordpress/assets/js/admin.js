jQuery(document).ready(function() {
    jQuery('#njt-wa-ads').click(function() {
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: {
                'action': 'njt_wa_ads_save',
                'nonce': window.njt_admin_ads.nonce
            }
        }).done(function(result) {
            if (result.success) {
                jQuery('#njt-wa-ads-wrapper').hide('slow')
            } else {
                console.log("Error", result.data.status)
            }
        });
    })
});