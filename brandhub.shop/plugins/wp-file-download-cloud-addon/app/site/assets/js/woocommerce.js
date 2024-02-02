jQuery(function ($) {
    $(document).on('click', '.wpfd_downloadlink:has(.wpfd-add-to-cart)', function (e) {
        var $this = $(this);
        if (!$this.attr('data-product_id')) {
            return true;
        }

        e.preventDefault();


        var url = $this.attr('href');

        var data = {};
        $.each($this.data(), function (key, value) {
            data[key] = value;
        });

        jQuery.ajax({
            url: wc_add_to_cart_params.wc_ajax_url.toString().replace('%%endpoint%%', 'add_to_cart'),
            method: 'POST',
            data: data,
            success: function (response, status, xhr) {
                if (!response) {
                    return;
                }

                if (response.error && response.product_url) {
                    window.location = response.product_url;
                    return;
                }

                // Redirect to cart option
                if (wc_add_to_cart_params.cart_redirect_after_add === 'yes') {
                    window.location = wc_add_to_cart_params.cart_url;
                    return;
                }

                // Trigger event so themes can refresh other areas.
                $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $this]);

                // Fallback, made sure added to cart button added.
                if ( ! wc_add_to_cart_params.is_cart && $this.parent().find( '.added_to_cart' ).length === 0 ) {
                    $this.removeClass( 'loading' );
                    $this.addClass( 'added' );
                    $this.after( ' <a href="' + wc_add_to_cart_params.cart_url + '" class="added_to_cart wc-forward" title="' +
                        wc_add_to_cart_params.i18n_view_cart + '">' + wc_add_to_cart_params.i18n_view_cart + '</a>' );
                }
            },
        });
        return false;
    });


    if (typeof (Handlebars) !== 'undefined') {
        Handlebars.registerHelper('plural', function(number, text) {
            var singular = number === 1;
            // If no text parameter was given, just return a conditional s.
            if ( typeof text !== 'string' ) return singular ? '' : 's';
            // Split with regex into group1/group2 or group1(group3)
            var match = text.match( /^([^()\/]+)(?:\/(.+))?(?:\((\w+)\))?/ );
            // If no match, just append a conditional s.
            if ( !match ) return text + ( singular ? '' : 's' );
            // We have a good match, so fire away
            return singular && match[1] // Singular case
                || match[2] // Plural case: 'bagel/bagels' --> bagels
                || match[1] + ( match[3] || 's' ); // Plural case: 'bagel(s)' or 'bagel' --> bagels
        });
    }
});
