/* global admin_rewardpoints_price */
jQuery( function ( $ ) {
    'use strict';
    if ( typeof admin_rewardpoints_price === 'undefined' ) {
        return false;
    }

    var Admin_Rewardpoints = {
        init: function ( ) {
            this.trigger_on_pageload( );
            $( document ).on( 'click', '.fpadddiscountrule', this.add_rule );
            $( document ).on( 'click', '.fpdiscount_cart_remove', this.remove_rule );
            $( document ).on( 'keyup', '.sumo_number_input', this.trigger_keyup );
            $( document ).on( 'change', '#sp_rewardpoints_pricing_for_products', this.toggle_rewardpoints_products );
        },
        trigger_on_pageload: function ( ) {
            $( '#sp_inccategories_at_rwpp' ).select2( );
            $( '#sp_exccategories_at_rwpp' ).select2( );
            $( '#sp_inctags_at_rwpp' ).select2( );
            $( '#sp_exctags_at_rwpp' ).select2( );

            Admin_Rewardpoints.get_rewardpoints_products( $( '#sp_rewardpoints_pricing_for_products' ).val() );
        },
        toggle_rewardpoints_products: function ( evt ) {
            evt.preventDefault( );
            var $value = $( evt.currentTarget ).val();

            Admin_Rewardpoints.get_rewardpoints_products( $value );
        },
        get_rewardpoints_products: function ( $value ) {
            $( '#sp_incproducts_at_rwpp' ).closest( 'tr' ).hide( );
            $( '#sp_excproducts_at_rwpp' ).closest( 'tr' ).hide( );
            $( '#sp_inccategories_at_rwpp' ).closest( 'tr' ).hide( );
            $( '#sp_exccategories_at_rwpp' ).closest( 'tr' ).hide( );
            $( '#sp_inctags_at_rwpp' ).closest( 'tr' ).hide( );
            $( '#sp_exctags_at_rwpp' ).closest( 'tr' ).hide( );

            if ( $value === '2' ) {
                $( '#sp_incproducts_at_rwpp' ).closest( 'tr' ).show( );
            } else if ( $value === '3' ) {
                $( '#sp_excproducts_at_rwpp' ).closest( 'tr' ).show( );
            } else if ( $value === '5' ) {
                $( '#sp_inccategories_at_rwpp' ).closest( 'tr' ).show( );
            } else if ( $value === '6' ) {
                $( '#sp_exccategories_at_rwpp' ).closest( 'tr' ).show( );
            } else if ( $value === '8' ) {
                $( '#sp_inctags_at_rwpp' ).closest( 'tr' ).show( );
            } else if ( $value === '9' ) {
                $( '#sp_exctags_at_rwpp' ).closest( 'tr' ).show( );
            }
        },
        remove_rule: function ( ) {
            $( this ).parent( ).parent( ).remove( );
        },
        add_rule: function ( ) {
            var counter = Math.round( new Date( ).getTime( ) + ( Math.random( ) * 100 ) );
            console.log( counter );
            jQuery.ajax( {
                data: ( {
                    action: 'testing',
                    uniq_id: counter,
                    sumo_discount_security: admin_rewardpoints_price.rewardpoints_pricing_nonce,
                } ),
                type: 'POST',
                url: admin_rewardpoints_price.ajax_url,
                dataType: 'html',
                success: function ( data ) {
                    console.log( data );
                    jQuery( '#fpdiscountcartrule' ).append( data );
                    jQuery( 'body' ).trigger( 'wc-enhanced-select-init' );
                }
            } );
            return false;
        },
        trigger_keyup: function ( ) {
            var res = this.value.charAt( 0 );
            if ( res !== '*' ) {
                this.value = this.value.replace( /[^0-9\.]/g, '' );
                if ( this.value < 0.01 ) {
                    this.value = '';
                }
            } else {
                this.value = this.value.replace( /[^*\.]/g, '' );
            }

        },
    };
    Admin_Rewardpoints.init( );
} );
