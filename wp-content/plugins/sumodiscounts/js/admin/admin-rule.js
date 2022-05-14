/* global admin_rule */
jQuery( function ( $ ) {
    'use strict';

    if ( typeof admin_rule === 'undefined' ) {
        return false;
    }

    var AdminRule = {
        init: function ( ) {
            this.trigger_on_page_load();
            $( document ).on( 'sumo-discount-add-rule', this.trigger_on_page_load );
            $( document ).on( 'click', '.sumo_discount_add', this.add_rule );
            $( document ).on( 'click', '.sumo_discounts_remove', this.delete_rule );
            $( document ).on( 'click', '.sumo_delete_row', this.delete_row );
            $( document ).on( 'change', '#sumo_u_p_history_time', this.toggle_user_time );
            $( document ).on( 'change', '.sumo_pricing_apply_to_user', this.toggle_user_filter );
            $( document ).on( 'change', '.sumo_pricing_apply_for_user_type', this.toggle_user_type );
            $( document ).on( 'change', '.sumo_pricing_criteria', this.toggle_pricing_criteria );
            $( document ).on( 'change', '.sumo_user_purchase_history', this.toggle_purchase_history );
            $( document ).on( 'change', '.sumo_pricing_apply_to_products', this.toggle_product_criteria );

        },
        trigger_on_page_load: function () {
            $( '.sumo_discounts_rule' ).each( function (  ) {
                $( 'p' ).find( '.selection' ).select2();
                $( 'p' ).find( 'select' ).select2();

                AdminRule.get_user_filter( $( this ).find( '.sumo_pricing_apply_to_user' ) );
                AdminRule.get_user_time( $( this ).find( '#sumo_u_p_history_time' ) );
                AdminRule.get_user_type( $( this ).find( '.sumo_pricing_apply_for_user_type' ) );
                AdminRule.get_pricing_criteria( $( this ).find( '.sumo_pricing_criteria' ) );
                AdminRule.user_purchase_history( $( this ).find( '.sumo_user_purchase_history' ) );
                AdminRule.get_product_criteria( $( this ).find( '.sumo_pricing_apply_to_products' ) );
            } );
        },
        toggle_user_time: function ( evt ) {
            evt.preventDefault( );
            var $this = $( evt.currentTarget );

            AdminRule.get_user_time( $this );
        },
        toggle_purchase_history: function ( evt ) {
            evt.preventDefault( );
            var $this = $( evt.currentTarget );

            AdminRule.user_purchase_history( $this );
        },
        toggle_pricing_criteria: function ( evt ) {
            evt.preventDefault( );
            var $this = $( evt.currentTarget );

            AdminRule.get_pricing_criteria( $this );
        },
        toggle_user_filter: function ( evt ) {
            evt.preventDefault( );
            var $this = $( evt.currentTarget );

            AdminRule.get_user_filter( $this );
        },
        toggle_user_type: function ( evt ) {
            evt.preventDefault( );
            var $this = $( evt.currentTarget );

            AdminRule.get_user_type( $this );
        },
        toggle_product_criteria: function ( evt ) {
            evt.preventDefault( );
            var $this = $( evt.currentTarget );

            AdminRule.get_product_criteria( $this );
        },
        user_purchase_history: function ( $this ) {
            var val = $( $this ).val();
            var wrapper = $( $this ).closest( 'div.sumo_discounts_rule' );

            if ( val === '' ) {
                wrapper.find( ".sumo_no_of_orders_placed" ).closest( 'p' ).hide( );
                wrapper.find( ".sumo_total_amount_spent_in_site" ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_u_p_history_time' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_uph_from_datepicker' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_uph_to_datepicker' ).closest( 'p' ).hide( );
            } else if ( val === '1' ) {
                wrapper.find( ".sumo_no_of_orders_placed" ).closest( 'p' ).show( );
                wrapper.find( ".sumo_total_amount_spent_in_site" ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_u_p_history_time' ).closest( 'p' ).show( );
                AdminRule.get_user_time( wrapper.find( '#sumo_u_p_history_time' ).val() );

            } else if ( val === '2' ) {
                wrapper.find( ".sumo_no_of_orders_placed" ).closest( 'p' ).hide( );
                wrapper.find( ".sumo_total_amount_spent_in_site" ).closest( 'p' ).show( );
                wrapper.find( '#sumo_u_p_history_time' ).closest( 'p' ).show( );
                AdminRule.get_user_time( wrapper.find( '#sumo_u_p_history_time' ).val() );
            }
        },
        get_pricing_criteria: function ( $this ) {
            var val = $( $this ).val();
            var wrapper = $( $this ).closest( '.sumo_discounts_rule' );


            if ( val === '1' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_inc_condition' ).closest( 'p' ).hide( );
            } else if ( val === '2' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_products_for_cart' ).closest( 'p' ).show( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_inc_condition' ).closest( 'p' ).show( );
            } else if ( val === '3' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_products_for_cart' ).closest( 'p' ).show( );
                wrapper.find( '#sumo_pricing_apply_to_include_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_inc_condition' ).closest( 'p' ).hide( );
            } else if ( val === '4' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_category_for_cart' ).closest( 'p' ).show( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_inc_condition' ).closest( 'p' ).show( );
            } else if ( val === '5' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_category_for_cart' ).closest( 'p' ).show( );
                wrapper.find( '#sumo_pricing_apply_to_include_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_inc_condition' ).closest( 'p' ).hide( );
            } else if ( val === '6' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_inc_condition' ).closest( 'p' ).hide( );
            } else if ( val === '7' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_inc_condition' ).closest( 'p' ).hide( );
            } else if ( val === '8' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_tag_for_cart' ).closest( 'p' ).show( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_inc_condition' ).closest( 'p' ).show( );
            } else if ( val === '9' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_products_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_category_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_tag_for_cart' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_tag_for_cart' ).closest( 'p' ).show( );
                wrapper.find( '#sumo_pricing_inc_condition' ).closest( 'p' ).hide( );
            }
        },
        get_user_type: function ( $this ) {
            var val = $( $this ).val();
            var wrapper = $( $this ).closest( '.sumo_discounts_rule' );

            if ( val === '1' ) {
                wrapper.find( '#sumo_pricing_apply_to_user' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_users' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_users' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_include_users_role' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_exclude_users_role' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_memberplans' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_user_purchase_history' ).closest( 'p' ).show( );
                AdminRule.user_purchase_history( $( '.sumo_user_purchase_history' ).val() );
            } else if ( val === '2' ) {
                wrapper.find( '.sumo_user_purchase_history' ).closest( 'p' ).show( );
                AdminRule.user_purchase_history( $( '.sumo_user_purchase_history' ).val() );
                wrapper.find( '#sumo_pricing_apply_to_user' ).closest( 'p' ).show( );
            } else if ( val === '3' ) {
                wrapper.find( '#sumo_pricing_apply_to_user' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_users' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_users' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_include_users_role' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_exclude_users_role' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_memberplans' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_user_purchase_history' ).closest( 'p' ).hide( );
                wrapper.find( ".sumo_no_of_orders_placed" ).closest( 'p' ).hide( );
                wrapper.find( ".sumo_total_amount_spent_in_site" ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_u_p_history_time' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_uph_from_datepicker' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_uph_to_datepicker' ).closest( 'p' ).hide( );
            }
        },
        get_user_filter: function ( $this ) {
            var val = $( $this ).val();
            var wrapper = $( $this ).closest( '.sumo_discounts_rule' );

            if ( val === '1' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_users' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_users' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_exclude_users_role' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_memberplans' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_include_users_role' ).closest( 'p' ).hide( );
            } else if ( val === '2' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_users' ).closest( 'p' ).show( );
                wrapper.find( '#sumo_pricing_apply_to_exclude_users' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_exclude_users_role' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_memberplans' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_include_users_role' ).closest( 'p' ).hide( );
            } else if ( val === '3' ) {
                wrapper.find( '#sumo_pricing_apply_to_exclude_users' ).closest( 'p' ).show( );
                wrapper.find( '#sumo_pricing_apply_to_include_users' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_exclude_users_role' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_memberplans' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_include_users_role' ).closest( 'p' ).hide( );
            } else if ( val === '4' ) {
                wrapper.find( '#sumo_pricing_apply_to_exclude_users' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_users' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_exclude_users_role' ).closest( 'p' ).hide( );
                wrapper.findwrapper.find( '#sumo_pricing_apply_to_include_memberplans' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_include_users_role' ).closest( 'p' ).hide( );
            } else if ( val === '5' ) {
                wrapper.find( '#sumo_pricing_apply_to_exclude_users' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_users' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_exclude_users_role' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_memberplans' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_include_users_role' ).closest( 'p' ).show( );
            } else if ( val === '6' ) {
                wrapper.find( '#sumo_pricing_apply_to_exclude_users' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_users' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_exclude_users_role' ).closest( 'p' ).show( );
                wrapper.find( '#sumo_pricing_apply_to_include_memberplans' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_include_users_role' ).closest( 'p' ).hide( );
            } else if ( val === '7' ) {
                wrapper.find( '#sumo_pricing_apply_to_exclude_users' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_users' ).closest( 'p' ).hide( );
                wrapper.find( '.sumo_pricing_apply_to_exclude_users_role' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_pricing_apply_to_include_memberplans' ).closest( 'p' ).show( );
                wrapper.find( '.sumo_pricing_apply_to_include_users_role' ).closest( 'p' ).hide( );
            }
        },

        get_user_time: function ( $this ) {
            var val = $( $this ).val();
            var wrapper = $( $this ).closest( '.sumo_discounts_rule' );

            if ( val === '' ) {
                wrapper.find( '#sumo_uph_from_datepicker' ).closest( 'p' ).hide( );
                wrapper.find( '#sumo_uph_to_datepicker' ).closest( 'p' ).hide( );
            } else {
                wrapper.find( '#sumo_uph_from_datepicker' ).closest( 'p' ).show( );
                wrapper.find( '#sumo_uph_to_datepicker' ).closest( 'p' ).show( );
            }
        },
        get_product_criteria: function ( $this ) {
            var val = $( $this ).val();
            var wrapper = $( $this ).closest( '.sumo_discounts_rule' );

            wrapper.find( '#sumo_pricing_apply_to_include_products' ).parent( ).hide( );
            wrapper.find( '#sumo_pricing_apply_to_exclude_products' ).parent( ).hide( );
            wrapper.find( '#sumo_pricing_apply_to_include_category' ).parent( ).hide( );
            wrapper.find( '#sumo_pricing_apply_to_exclude_category' ).parent( ).hide( );
            wrapper.find( '#sumo_pricing_apply_to_include_tag' ).parent( ).hide( );
            wrapper.find( '#sumo_pricing_apply_to_exclude_tag' ).parent( ).hide( );
            wrapper.find( '#sumo_pricing_inc_condition' ).parent( ).hide( );

            if ( val === '2' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_products' ).parent( ).show( );
                wrapper.find( '#sumo_pricing_inc_condition' ).parent( ).show( );
            } else if ( val === '3' ) {
                wrapper.find( '#sumo_pricing_apply_to_exclude_products' ).parent( ).show( );
            } else if ( val === '5' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_category' ).parent( ).show( );
                wrapper.find( '#sumo_pricing_inc_condition' ).parent( ).show( );
            } else if ( val === '6' ) {
                wrapper.find( '#sumo_pricing_apply_to_exclude_category' ).parent( ).show( );
            } else if ( val === '8' ) {
                wrapper.find( '#sumo_pricing_apply_to_include_tag' ).parent( ).show( );
                wrapper.find( '#sumo_pricing_inc_condition' ).parent( ).show( );
            } else if ( val === '9' ) {
                wrapper.find( '#sumo_pricing_apply_to_exclude_tag' ).parent( ).show( );
            }
        },
        delete_rule: function ( evt ) {
            evt.preventDefault();
            $( this ).parent().parent().remove();
        },
        delete_row: function (  ) {
            $( this ).parent().remove();
        },
        add_rule: function ( evt ) {

            var countrewards_dynamic_rule = Math.round( new Date( ).getTime( ) + ( Math.random( ) * 100 ) );
            $( '.sumo_discounts_wrapper' ).block( );
            $.ajax( {
                data: ( {
                    action: $( '.sumo_discount_add' ).data( 'pricing_type' ),
                    uniq_id: countrewards_dynamic_rule,
                    sumo_discount_security: admin_rule.add_rule_nonce,
                } ),
                type: 'POST',
                url: admin_rule.ajax_url,
                success: function ( response ) {
                    // console.log(response);
                    $( '#accordion' ).append( '<div class="group sumo_discounts_rule" ><h3>' + admin_rule.title + '<span class="sumo_discounts_remove button" title="Remove this Rule" style="position:absolute;right:13px;top:3px;">X</span></h3><div>' + response + '</div></div>' );
                    $( 'body' ).trigger( 'wc-enhanced-select-init' );
                    $( 'body' ).trigger( 'sumo-discount-add-rule' );
                    $( '#accordion' ).accordion( 'refresh' );
                    $( '.sp_date' ).datepicker( {
                        dateFormat: "dd-mm-yy"
                    } );
                    $( '.sp__date' ).datepicker( {
                        dateFormat: "yy-mm-dd",
                        maxDate: new Date( )

                    } );
                    $( '.sumo_discounts_wrapper' ).unblock( );
                    $( 'p.form-field span.dashicons-info' ).tipTip( );
                }

            } );

        },

    };
    AdminRule.init( );
} );
