/* global admin_cart_price */
jQuery( function ( $ ) {
    'use strict';
    if ( typeof admin_cart_price === 'undefined' ) {
        return false;
    }

    var Admin_Cart_Price = {
        init: function ( ) {
            $( document ).on( 'click', '.add_new_row_for_cart_total', this.add_new_row );
        },
        add_new_row: function () {
            var uniq_id = $( '.add_new_row_for_cart_total' ).data( 'uniq_id' );
            $.ajax( {
                data: ( {
                    action: 'sumo_pricing_uniqid_for_cart',
                    rule_type: 'cart_total',
                    uniq_id: uniq_id,
                    sumo_discount_security: admin_cart_price.cart_pricing_nonce
                } ),
                type: 'POST',
                url: admin_cart_price.ajax_url,
                success: function ( response ) {
                    $( '.sumo_cart_total_rule' ).append( response );
                }

            } );
        },

    };
    Admin_Cart_Price.init( );
} );
