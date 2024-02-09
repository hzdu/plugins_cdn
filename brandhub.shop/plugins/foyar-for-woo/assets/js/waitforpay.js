jQuery( function($) {
    $(document.body).on('click', 'button#place_order', function() {
        $('form.checkout.woocommerce-checkout').block({
            message: '<div class="loader">Loading...</div>',
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            },
            css: {
                border: 'none',
                backgroundColor: 'transparent'
            }
        });
    });
});