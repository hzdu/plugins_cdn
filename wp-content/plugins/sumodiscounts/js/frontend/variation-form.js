/* global fpsd_frontend*/

jQuery( function ( $ ) {
    'use strict'

    var FrontEnd = {
        init: function ( ) {
            $( document ).on( 'change', 'input:hidden[name=variation_id]', discount_tag );
        },

        discount_tag: function ( ) {
            $( '.sumo_discount_tag' ).html( ' < strong class = "sumo_discount_tag_msg" > ' + fpsd_frontend.sale_tag + ' < /strong>' );
            $( '.sumo_discount_tag' ).show( );

            var variationid = $( 'input:hidden[name=variation_id]' ).val( );

            if ( variationid > 0 ) {
                var arrayFromPHP = fpsd_frontend.array;

                if ( arrayFromPHP[variationid] ) {
                    $( '.sumo_discount_tag' ).html( '<strong class="sumo_discount_tag_msg">' + arrayFromPHP[variationid] + '</strong>' );
                    $( '.sumo_discount_tag' ).show( );
                } else {
                    $( '.sumo_discount_tag' ).hide( );
                }
            } else {
                if ( !empty( fpsd_frontend.array ) ) {
                    $( '.sumo_discount_tag' ).html( ' < strong class = "sumo_discount_tag_msg" > ' + fpsd_frontend.sale_tag + ' < /strong>' );
                    $( '.sumo_discount_tag' ).show( );
                } else {
                    $( '.sumo_discount_tag' ).hide( );
                }
            }
        }
    }

    FrontEnd.init( );
} );
