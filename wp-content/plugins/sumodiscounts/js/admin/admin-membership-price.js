/* global admin_membership_price */
jQuery( function ( $ ) {
    'use strict';

    if ( typeof admin_membership_price === 'undefined' ) {
        return false;
    }

    var Admin_Membership = {
        init: function () {
            this.trgger_on_page_load();
            $( document ).on( 'change', '#sp_membership_pricing_for_products', this.toggle_membership_products );

        },
        trgger_on_page_load: function () {
            $( '#sp_inccategories_at_membership' ).select2();
            $( '#sp_exccategories_at_membership' ).select2();
            $( '#sp_inctags_at_membership' ).select2();
            $( '#sp_exctags_at_membership' ).select2();
            Admin_Membership.get_membership_products( $( '#sp_membership_pricing_for_products' ).val() );

        },
        toggle_membership_products: function ( evt ) {
            evt.preventDefault( );
            var $value = $( evt.currentTarget ).val();

            Admin_Membership.get_membership_products( $value );
        },
        get_membership_products: function ( $value ) {
            $( '#sp_incproducts_at_membership' ).closest( 'tr' ).hide();
            $( '#sp_excproducts_at_membership' ).closest( 'tr' ).hide();
            $( '#sp_inccategories_at_membership' ).closest( 'tr' ).hide();
            $( '#sp_exccategories_at_membership' ).closest( 'tr' ).hide();
            $( '#sp_inctags_at_membership' ).closest( 'tr' ).hide();
            $( '#sp_exctags_at_membership' ).closest( 'tr' ).hide();

            if ( $value === '2' ) {
                $( '#sp_incproducts_at_membership' ).closest( 'tr' ).show();
            } else if ( $value === '3' ) {
                $( '#sp_excproducts_at_membership' ).closest( 'tr' ).show();
            } else if ( $value === '5' ) {
                $( '#sp_inccategories_at_membership' ).closest( 'tr' ).show();
            } else if ( $value === '6' ) {
                $( '#sp_exccategories_at_membership' ).closest( 'tr' ).show();
            } else if ( $value === '8' ) {
                $( '#sp_inctags_at_membership' ).closest( 'tr' ).show();
            } else if ( $value === '9' ) {
                $( '#sp_exctags_at_membership' ).closest( 'tr' ).show();
            }
        },

    };

    Admin_Membership.init();
} );
