/* global admin_offer_price */
jQuery( function ( $ ) {
    'use strict';

    if ( typeof admin_offer_price === 'undefined' ) {
        return false;
    }

    var Admin_SpecialOffer = {
        init: function ( ) {
            this.trigger_on_page_load();

            $( document ).on( 'sumo-discount-add-rule', this.trigger_on_page_load );
            $( document ).on( 'change', '.sumo_special_offer_applicable_to_', this.toggle_applicable_products );
            $( document ).on( 'change', '.sumo_pricing_apply_on_products', this.toggle_apply_on_products );
            $( document ).on( 'click', '.add_new_row_for_offer', this.add_new_row );

        },
        trigger_on_page_load: function () {
            $( '.sumo_discounts_rule' ).each( function () {
                Admin_SpecialOffer.get_applicable_products( $( this ).find( '.sumo_special_offer_applicable_to_' ) );
                Admin_SpecialOffer.get_apply_on_products( $( this ).find( '.sumo_pricing_apply_on_products' ) );
            } );
        },
        toggle_applicable_products: function ( evt ) {
            evt.preventDefault( );
            var $this = $( evt.currentTarget );

            Admin_SpecialOffer.get_applicable_products( $this );
        },
        toggle_apply_on_products: function ( evt ) {
            evt.preventDefault( );
            var $this = $( evt.currentTarget );

            Admin_SpecialOffer.get_apply_on_products( $this );
        },
        get_applicable_products: function ( $this ) {
            var val = $( $this ).val();
            var wrapper = $( $this ).closest( 'div.sumo_discounts_rule' );

            if ( val === '' ) {
                wrapper.find( '#sumo_special_offer_apply_to_include_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_include_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_applicable_on_' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_include_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_free_products' ).parent().hide();
                wrapper.find( '.sumo_special_offer_buy_quantity' ).parent().hide();
                wrapper.find( '.sumo_offer_rule_' ).show();
                wrapper.find( '.add_new_row_for_offer' ).show();
            } else if ( val === '1' ) {
                wrapper.find( '#sumo_special_offer_apply_to_include_products' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_include_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_applicable_on_' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_include_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_free_products' ).parent().hide();
                wrapper.find( '.sumo_special_offer_buy_quantity' ).parent().hide();
                wrapper.find( '.sumo_offer_rule_' ).show();
                wrapper.find( '.add_new_row_for_offer' ).show();
            } else if ( val === '2' ) {
                wrapper.find( '#sumo_special_offer_apply_to_include_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_products' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_include_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_applicable_on_' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_include_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_free_products' ).parent().hide();
                wrapper.find( '.sumo_special_offer_buy_quantity' ).parent().hide();
                wrapper.find( '.sumo_offer_rule_' ).show();
                wrapper.find( '.add_new_row_for_offer' ).show();
            } else if ( val === '3' ) {
                wrapper.find( '#sumo_special_offer_apply_to_include_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_include_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_applicable_on_' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_include_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_free_products' ).parent().hide();
                wrapper.find( '.sumo_special_offer_buy_quantity' ).parent().hide();
                wrapper.find( '.sumo_offer_rule_' ).show();
                wrapper.find( '.add_new_row_for_offer' ).show();
            } else if ( val === '4' ) {
                wrapper.find( '#sumo_special_offer_apply_to_include_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_include_category' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_applicable_on_' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_include_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_free_products' ).parent().hide();
                wrapper.find( '.sumo_special_offer_buy_quantity' ).parent().hide();
                wrapper.find( '.sumo_offer_rule_' ).show();
                wrapper.find( '.add_new_row_for_offer' ).show();
            } else if ( val === '5' ) {
                wrapper.find( '#sumo_special_offer_apply_to_include_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_include_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_category' ).parent().show();
                wrapper.find( '#sumo_special_offer_applicable_on_' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_include_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_free_products' ).parent().hide();
                wrapper.find( '.sumo_special_offer_buy_quantity' ).parent().hide();
                wrapper.find( '.sumo_offer_rule_' ).show();
                wrapper.find( '.add_new_row_for_offer' ).show();
            } else if ( val === '6' ) {
                wrapper.find( '#sumo_special_offer_apply_to_include_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_include_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_applicable_on_' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_include_tag' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_free_products' ).parent().hide();
                wrapper.find( '.sumo_special_offer_buy_quantity' ).parent().hide();
                wrapper.find( '.sumo_offer_rule_' ).show();
                wrapper.find( '.add_new_row_for_offer' ).show();
            } else if ( val === '7' ) {
                wrapper.find( '#sumo_special_offer_apply_to_include_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_include_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_applicable_on_' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_include_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_tag' ).parent().show();
                wrapper.find( '#sumo_special_offer_apply_to_free_products' ).parent().hide();
                wrapper.find( '.sumo_special_offer_buy_quantity' ).parent().hide();
                wrapper.find( '.sumo_offer_rule_' ).show();
                wrapper.find( '.add_new_row_for_offer' ).show();
            } else if ( val === '8' ) {
                wrapper.find( '#sumo_special_offer_apply_to_include_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_products' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_include_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_category' ).parent().hide();
                wrapper.find( '#sumo_special_offer_applicable_on_' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_include_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_exclude_tag' ).parent().hide();
                wrapper.find( '#sumo_special_offer_apply_to_free_products' ).parent().show();
                wrapper.find( '.sumo_special_offer_buy_quantity' ).parent().show();
                wrapper.find( '.sumo_offer_rule_' ).hide();
                wrapper.find( '.add_new_row_for_offer' ).hide();
            }
        },
        get_apply_on_products: function ( $this ) {
            var val = $( $this ).val();
            var wrapper = $( $this ).closest( 'div.sumo_discounts_rule' );

            if ( val === '1' ) {
                wrapper.find( '#sumo_pricing_apply_on_include_products' ).parent().hide();
            } else {
                wrapper.find( '#sumo_pricing_apply_on_include_products' ).parent().show();
            }

        },
        add_new_row: function ( ) {
            var uniq_id = $( '.add_new_row_for_offer' ).data( 'uniq_id' );
            $.ajax( {
                data: ( {
                    action: 'sumo_pricing_uniqid_for_offer',
                    rule_type: 'specialoffer',
                    uniq_id: uniq_id,
                    sumo_discount_security: admin_offer_price.offer_pricing_nonce,
                } ),
                type: 'POST',
                url: admin_offer_price.ajax_url,
                success: function ( response ) {
                    $( '.sumo_offer_rule' ).append( response );
                }

            } );
        },

    };

    Admin_SpecialOffer.init();
} );
