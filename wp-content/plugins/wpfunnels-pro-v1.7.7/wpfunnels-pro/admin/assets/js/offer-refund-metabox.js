(function( $ ) {
    'use strict';

    /**
     * All of the code for your admin-facing JavaScript source
     * should reside in this file.
     *
     * Note: It has been assumed you will write jQuery code here, so the
     * $ function reference has been prepared for usage within the scope
     * of this function.
     *
     * This enables you to define handlers, for when the DOM is ready:
     *
     * $(function() {
     *
     * });
     *
     * When the window is loaded:
     *
     * $( window ).load(function() {
     *
     * });
     *
     * ...and/or other possibilities.
     *
     * Ideally, it is not considered best practise to attach more than a
     * single DOM-ready or window-load handler for a particular page.
     * Although scripts in the WordPress core, Plugins and Themes may be
     * practising this, we should strive to set a better example in our own work.
     */

    $( '.button.wpfnl-offer-refund' ).on( 'click', function ( e ) {
        e.preventDefault();
        let refund_reason = prompt( 'Enter Refund reason', 'Refund WPFunnels Offer' );

        if ( '' === refund_reason ) {
            return alert( 'Please enter valid refund reason', false );
        } else if ( null === refund_reason ) {
            return false;
        }

        $('#wpfnl-offer-refund-metabox').block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        var button      = $(this),
            order_id    = button.attr( 'data-order-id' ),
            step_id     = button.attr( 'data-step-id' ),
            item_id     = button.attr( 'data-item-id' ),
            product_id  = button.attr( 'data-product-id' ),
            qty         = button.attr( 'data-item-quantity' ),
            amount      = button.attr( 'data-item-amount' ),
            txn_id      = button.attr( 'data-txn-id' );

        var payload = {
            order_id: order_id,
            step_id: step_id,
            product_id: product_id,
            item_id: item_id,
            quantity: qty,
            amount: amount,
            api_refund: true,
            transaction_id: txn_id,
            wpfnl_refund: true,
        }

        wpAjaxHelperRequest("wpfnl-refund-offer", payload)
            .success(function(response) {
                alert(response.msg);
                $('#wpfnl-offer-refund-metabox').unblock();
                window.location.reload();
            })
            .error(function(response) {
                $('#wpfnl-offer-refund-metabox').unblock();
                console.log(response)
            });

    });

    $( '.refund-items' ).on( 'click', function ( e ) {
        $('.wpfnl-refund-notice').remove();
        $('.wc-order-refund-items').prepend('<p class="wpfnl-refund-notice">Here, you can only refund the cost for the main product and order bump products.To refund products sold in Upsell & downsell, go to the WPFunnels Offers section.</p>')
    });

})( jQuery );