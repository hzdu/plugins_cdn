/* global admin_quantity_price */
jQuery( function ( $ ) {
    'use strict';
    if ( typeof admin_quantity_price === 'undefined' ) {
        return false;
    }

    var Admin_Quantity_Price = {
        init: function ( ) {
            $( document ).on( 'click', '.add_new_row_for_quantity', this.add_new_row );
        },
        add_new_row: function ( ) {
            var uniq_id = $( '.add_new_row_for_quantity' ).data( 'uniq_id' );
            $.ajax( {
                data: ( {
                    action: 'sumo_pricing_uniqid_for_qty',
                    rule_type: 'quantity',
                    uniq_id: uniq_id,
                    sumo_discount_security: admin_quantity_price.quantity_pricing_nonce
                } ),
                type: 'POST',
                url: admin_quantity_price.ajax_url,
                success: function ( response ) {
                    $( '.sumo_quantity_rule' ).append( response );
                }

            } );
        },
    };
    Admin_Quantity_Price.init( );
} );
