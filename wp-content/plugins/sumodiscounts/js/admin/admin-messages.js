
jQuery( function ( $ ) {
    'use strict';
    var Admin_Messages = {
        init: function ( ) {
            this.trigger_on_page_load( );
            $( document ).on( 'change', '#sp_show_cart_rules_in_single_product', this.toggle_rules_for_single_product );
            $( document ).on( 'change', '#sp_show_cart_rules_in_shop', this.toggle_rules_for_shop );
            $( document ).on( 'change', '#sp_cart_rule_message_in_cart', this.toggle_rules_for_cart );
            $( document ).on( 'change', '#sp_show_discount_applied_in_cart', this.toggle_discount_applied_in_cart );
            $( document ).on( 'change', '#sp_show_special_offer_pricing_message_on_single_product', this.toggle_offer_price_in_sp );
        },
        trigger_on_page_load: function ( ) {
            Admin_Messages.get_rules_for_single_product( $( '#sp_show_cart_rules_in_single_product' ).val() );
            Admin_Messages.get_rules_for_shop( $( '#sp_show_cart_rules_in_shop' ).val() );
            Admin_Messages.get_rules_for_cart( $( '#sp_cart_rule_message_in_cart' ).val() );
            Admin_Messages.get_discount_applied_in_cart( $( '#sp_show_discount_applied_in_cart' ).val() );
            Admin_Messages.get_offer_price_in_sp( $( '#sp_show_special_offer_pricing_message_on_single_product' ).val() );
        },
        toggle_rules_for_single_product: function ( evt ) {
            evt.preventDefault( );
            var $value = $( evt.currentTarget ).val( );
            Admin_Messages.get_rules_for_single_product( $value );
        },
        toggle_rules_for_shop: function ( evt ) {
            evt.preventDefault( );
            var $value = $( evt.currentTarget ).val( );
            Admin_Messages.get_rules_for_shop( $value );
        },
        toggle_rules_for_cart: function ( evt ) {
            evt.preventDefault( );
            var $value = $( evt.currentTarget ).val( );
            Admin_Messages.get_rules_for_cart( $value );
        },
        toggle_discount_applied_in_cart: function ( evt ) {
            evt.preventDefault( );
            var $value = $( evt.currentTarget ).val( );
            Admin_Messages.get_discount_applied_in_cart( $value );
        },
        toggle_offer_price_in_sp: function ( evt ) {
            evt.preventDefault( );
            var $value = $( evt.currentTarget ).val( );
            Admin_Messages.get_offer_price_in_sp( $value );
        },
        get_rules_for_single_product: function ( $value ) {
            if ( $value === 'show' ) {
                $( '#sp_cart_rule_message_in_single_product' ).closest( 'tr' ).show( );
            } else {
                $( '#sp_cart_rule_message_in_single_product' ).closest( 'tr' ).hide( );
            }
        },
        get_rules_for_shop: function ( $value ) {
            if ( $value === 'show' ) {
                $( '#sp_cart_rule_message_in_shop' ).closest( 'tr' ).show( );
            } else {
                $( '#sp_cart_rule_message_in_shop' ).closest( 'tr' ).hide( );
            }
        },
        get_rules_for_cart: function ( $value ) {
            if ( $value === 'show' ) {
                $( '#sp_cart_rule_message_in_cart' ).closest( 'tr' ).show( );
            } else {
                $( '#sp_cart_rule_message_in_cart' ).closest( 'tr' ).hide( );
            }
        },
        get_discount_applied_in_cart: function ( $value ) {
            if ( $value === 'show' ) {
                $( '#sp_discount_applied_message_in_cart' ).closest( 'tr' ).show( );
            } else {
                $( '#sp_discount_applied_message_in_cart' ).closest( 'tr' ).hide( );
            }
        },
        get_offer_price_in_sp: function ( $value ) {
            if ( $value === 'show' ) {
                $( '#sp_message_for_special_offer_same_pro_in_single_product' ).closest( 'tr' ).show( );
                $( '#sp_message_for_special_offer_diff_pro_in_single_product' ).closest( 'tr' ).show( );
            } else {
                $( '#sp_message_for_special_offer_same_pro_in_single_product' ).closest( 'tr' ).hide( );
                $( '#sp_message_for_special_offer_diff_pro_in_single_product' ).closest( 'tr' ).hide( );
            }
        },
    }

    Admin_Messages.init( );
} );
