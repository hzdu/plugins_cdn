/* global admin_userrole_price */
jQuery( function ( $ ) {
    'use strict';

    if ( typeof admin_userrole_price === 'undefined' ) {
        return false;
    }

    var Admin_UserRole = {
        init: function ( ) {
            this.trigger_on_pageload();
            $( document ).on( 'change', '#sp_urbp_pricing_for_products', this.toggle_userrole_pricing );

        },
        trigger_on_pageload: function () {
            $( '#sp_inccategories_at_urbp' ).select2();
            $( '#sp_exccategories_at_urbp' ).select2();
            $( '#sp_inctags_at_urbp' ).select2();
            $( '#sp_exctags_at_urbp' ).select2();

            Admin_UserRole.get_userrole_pricing( $( '#sp_urbp_pricing_for_products' ).val() );

        },
        toggle_userrole_pricing: function ( evt ) {
            evt.preventDefault( );
            var $value = $( evt.currentTarget ).val();

            Admin_UserRole.get_userrole_pricing( $value );
        },
        get_userrole_pricing: function ( $value ) {
            $( '#sp_incproducts_at_urbp' ).closest( 'tr' ).hide();
            $( '#sp_excproducts_at_urbp' ).closest( 'tr' ).hide();
            $( '#sp_inccategories_at_urbp' ).closest( 'tr' ).hide();
            $( '#sp_exccategories_at_urbp' ).closest( 'tr' ).hide();
            $( '#sp_inctags_at_urbp' ).closest( 'tr' ).hide();
            $( '#sp_exctags_at_urbp' ).closest( 'tr' ).hide();

            if ( $value === '2' ) {
                $( '#sp_incproducts_at_urbp' ).closest( 'tr' ).show();
            } else if ( $value === '3' ) {
                $( '#sp_excproducts_at_urbp' ).closest( 'tr' ).show();
            } else if ( $value === '5' ) {
                $( '#sp_inccategories_at_urbp' ).closest( 'tr' ).show();
            } else if ( $value === '6' ) {
                $( '#sp_exccategories_at_urbp' ).closest( 'tr' ).show();
            } else if ( $value === '8' ) {
                $( '#sp_inctags_at_urbp' ).closest( 'tr' ).show();
            } else if ( $value === '9' ) {
                $( '#sp_exctags_at_urbp' ).closest( 'tr' ).show();
            }
        },

    };

    Admin_UserRole.init();
} );
