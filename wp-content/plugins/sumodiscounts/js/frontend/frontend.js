/* global fp_sd_args*/

jQuery( function ( $ ) {
    'use strict'

    var frontend_js = {
        init: function ( ) {
            this.fp_apply_discount_for_user();

            if ( 'yes' === fp_sd_args.check_quantity_pricing_enabled && 'enable' === fp_sd_args.check_quantity_discount_table_enabled ) {
                $( document ).on( 'found_variation.wc-variation-form', { variationForm: this }, this.onFoundVariation );
            }

            $( document ).on( 'focusout', '#billing_email', this.fp_apply_discount_for_user );
        },
        onFoundVariation: function ( ) {
            var variation_id = $( 'input[name=variation_id]' ).val();
            frontend_js.after_disp_after_add_to_cart( variation_id );
        },
        after_disp_after_add_to_cart: function ( variation_id ) {
            if ( variation_id != '' && variation_id != undefined ) {
                frontend_js.block( '.variations_form' );
                var data = ( {
                    action: 'sumo_discounts_var_fields',
                    var_id_data: variation_id,
                } );
                jQuery.post( fp_sd_args.ajaxurl, data, function ( response ) {
                    jQuery( ".sd_print_price_var" ).remove();
                    jQuery( ".sd_variation_datas" ).append( '<span class="sd_print_price_var">' + response + '</span>' );
                    frontend_js.unblock( '.variations_form' );
                } );
            }
        },
        fp_apply_discount_for_user: function () {
            if ( fp_sd_args.checkout_page == true && jQuery( '#billing_email' ).length ) {
                frontend_js.block( '.woocommerce-checkout' );
                var billing_email = jQuery( '#billing_email' ).val();
                var data = {
                    action: 'fp_apply_discount_for_first_purchase',
                    billing_email: billing_email,
                    sumo_security: fp_sd_args.sd_ajax_nonce
                };

                $.ajax( {
                    type: 'POST',
                    url: fp_sd_args.ajaxurl,
                    data: data,
                    dataType: 'JSON',
                    success: function ( response ) {
                        if ( true === response.success ) {
                            $( ".rs_button_redeem_checkout" ).show();
                            $( ".redeeemit" ).show();
                            $( ".checkoutredeem" ).show();
                            $( ".checkout_redeeming" ).show();
                            $( ".woocommerce-form-coupon-toggle" ).show();
                            $( ".rs_checkout_message" ).show();
                            $( ".rs_show_notice_for_hide_redeem_field" ).hide();
                            $( ".rs_show_notice_for_hide_coupon_field" ).hide();

                            if ( response.data.hide_redeem_field == true ) {
                                $( ".rs_button_redeem_checkout" ).hide();
                                $( ".redeeemit" ).hide();
                                $( ".checkoutredeem" ).hide();
                                $( ".checkout_redeeming" ).hide();
                                $( ".rs_show_notice_for_hide_redeem_field" ).show();
                                $( ".rs_show_notice_for_hide_coupon_field" ).show();
                            }
                            if ( response.data.hide_coupon_field == true ) {
                                $( ".woocommerce-form-coupon-toggle" ).hide();
                                $( ".rs_show_notice_for_hide_coupon_field" ).show();
                            }
                            if ( response.data.hide_coupon_field == true || response.data.hide_redeem_field == true ) {
                                $( ".rs_notice_for_redeem_field" ).show();
                            } else {
                                $( ".rs_notice_for_redeem_field" ).hide();
                            }
                            if ( response.data.hide_earn_points_message == true ) {
                                $( ".rs_checkout_message" ).hide();
                            }

                            frontend_js.unblock( '.woocommerce-checkout' );
                            $( 'body' ).trigger( 'update_checkout' );
                        } else {
                            window.alert( response.data.error );
                            frontend_js.unblock( '.woocommerce-checkout' );
                        }
                    },
                } );
            }
        },
        block: function ( id ) {
            $( id ).block( {
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            } );
        },
        unblock: function ( id ) {
            $( id ).unblock();
        },
    };
    frontend_js.init( );
} );
