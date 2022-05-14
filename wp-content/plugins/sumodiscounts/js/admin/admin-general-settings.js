/* global admin_general_settings */
jQuery( function ( $ ) {
    'use strict';

    if ( admin_general_settings === 'undefined' ) {
        return false;
    }

    var AdminGeneralSettings = {
        init: function () {
            this.trigger_on_page_load( );
            $( document ).on( 'change', '#sumo_price_display_method_with_discounts', this.toggle_display_method );
            $( document ).on( 'change', '#sumo_enable_discount_tag', this.toggle_discount_method );
        },
        trigger_on_page_load: function () {

            AdminGeneralSettings.get_display_method( $( '#sumo_price_display_method_with_discounts' ).val() );
            AdminGeneralSettings.get_discount_method( $( '#sumo_enable_discount_tag' ) );

            $( 'table#sumo_drag_n_drop_site_wide_discounts' ).sortable( {
                axis: "y",
                items: 'tbody',
                update: function ( event, ui ) {

                    var data = jQuery( this ).sortable( "toArray" );
                    // POST to server using $.post or $.ajax
                    console.log( data );
                    jQuery.ajax( {
                        data: ( {
                            action: 'sumo_drag_and_arrange_tab',
                            data: data,
                            type: 'sitewide',
                            sumo_discount_security: admin_general_settings.arrange_nonce
                        } ),
                        type: 'POST',
                        url: admin_general_settings.ajax_url,
                        success: function ( response ) {
                            console.log( response );
                        },
                    } );
                }
            } );

            $( 'table#sumo_drag_n_drop_bulk_discounts' ).sortable( {
                axis: "y",
                items: 'tbody',
                update: function ( event, ui ) {

                    var data = jQuery( this ).sortable( "toArray" );
                    // POST to server using $.post or $.ajax
                    console.log( data );
                    jQuery.ajax( {
                        data: ( {
                            action: 'sumo_drag_and_arrange_tab',
                            data: data,
                            type: 'bulk',
                            sumo_discount_security: admin_general_settings.arrange_nonce
                        } ),
                        type: 'POST',
                        url: admin_general_settings.ajax_url,
                        success: function ( response ) {
                            console.log( response );
                        },
                    } );
                }
            } );
        },
        toggle_display_method: function ( evt ) {
            evt.preventDefault( );
            var $this = $( evt.currentTarget ).val();

            AdminGeneralSettings.get_display_method( $this );
        },
        toggle_discount_method: function ( evt ) {
            evt.preventDefault( );
            var $this = $( evt.currentTarget );

            AdminGeneralSettings.get_discount_method( $this );
        },

        get_display_method: function ( $value ) {

            if ( $value === '2' ) {
                $( '#sumo_enable_discount_tag' ).closest( 'tr' ).show();
                AdminGeneralSettings.get_discount_method( $( '#sumo_enable_discount_tag' ) );

            } else {
                $( '#sumo_enable_discount_tag' ).closest( 'tr' ).hide();
                $( '#sumo_discount_tag_lable' ).closest( 'tr' ).hide();
                $( '#sumo_enable_discount_for_variable_product' ).closest( 'tr' ).hide();
            }
        },
        get_discount_method: function ( $this ) {
            if ( $( $this ).is( ':checked' ) ) {
                $( '#sumo_enable_discount_for_variable_product' ).closest( 'tr' ).show();
                $( '#sumo_discount_tag_lable' ).closest( 'tr' ).show();
            } else {
                $( '#sumo_enable_discount_for_variable_product' ).closest( 'tr' ).hide();
                $( '#sumo_discount_tag_lable' ).closest( 'tr' ).hide();
            }
        },

    }

    AdminGeneralSettings.init();
} );
