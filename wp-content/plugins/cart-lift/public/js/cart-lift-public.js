(function ( $ ) {

    /**
     * All of the code for your public-facing JavaScript source
     * should reside in this file.
     *
     * Note: It has been assumed you will write jQuery code here, so the
     * $ function reference has been prepared for usage within the scope
     * of this function.
     *
     * This enables you to define handlers, for when the DOM is ready:
     *
     * $(function() {
     *
     * });
     *
     * When the window is loaded:
     *
     * $( window ).load(function() {
     *
     * });
     *
     * ...and/or other possibilities.
     *
     * Ideally, it is not considered best practise to attach more than a
     * single DOM-ready or window-load handler for a particular page.
     * Although scripts in the WordPress core, Plugins and Themes may be
     * practising this, we should strive to set a better example in our own work.
     */

    let typingTimer;
    let doneTypingInterval = 500;

    function isEmail( email ) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test( email );
    }

    CartLiftCheckout = {
        init: function () {
            if ( cl_localized_vars.gdpr === '1' ) {
                var no_thanks = cl_localized_vars.no_thanks;
                $( ".woocommerce-billing-fields__field-wrapper #billing_email" ).after( "<span id='cl_gdpr_message'> <span> " + cl_localized_vars.gdpr_messages + " <a style='cursor: pointer' id='cl_gdpr_no_thanks'>" + no_thanks + "</a></span></span>" );
                $( "#edd-email" ).after( "<span id='cl_gdpr_message'> <span style='font-size: xx-small'> " + cl_localized_vars.gdpr_messages + " <a style='cursor: pointer' id='cl_gdpr_no_thanks'>" + no_thanks + "</a></span></span>" );
            }

            $( document ).on(
                'keyup keypress change',
                'input',
                this.saveCartData
            );

            $( document ).on(
                'keydown',
                'input',
                this.clearTheCountDown
            );

            $( "#cl_gdpr_no_thanks" ).click( function ( e ) {
                e.preventDefault();
                CartLiftCheckout.remove_gdpr_notice()
            } );

            setTimeout( function () {
                CartLiftCheckout.saveCartData();
            }, 800 );
        },

        clearTheCountDown: function () {
            clearTimeout( typingTimer )
        },

        saveCartData: function () {
            var cl_email = '';
            var cl_firstname = '';
            var cl_lastname = '';
            var cl_phone = '';
            var cl_country = '';
            var cl_address_1 = '';
            var cl_city = '';
            var cl_postcode = '';
            var provider = 'wc';
            var wpfunnels_checkout_id = $( '._wpfunnels_checkout_id' ).val();

            /**
             * grabbing checkout field values for edd
             */
            if ( $( "#edd-email" ).length ) {
                cl_email = $( "#edd-email" ).val();
                provider = 'edd';
            }
            if ( $( "#edd-first" ).length ) {
                cl_firstname = $( "#edd-first" ).val();
            }
            if ( $( "#edd-last" ).length ) {
                cl_lastname = $( "#edd-last" ).val();
            }
            /**
             * grabbing checkout field values for woocommerce
             */
            if ( $( "#billing_email" ).length ) {
                cl_email = $( "#billing_email" ).val();
            }
            if ( $( "#billing_first_name" ).length ) {
                cl_firstname = $( "#billing_first_name" ).val();
            }
            if ( $( "#billing_last_name" ).length ) {
                cl_lastname = $( "#billing_last_name" ).val();
            }
            if ( $( "#billing_phone" ).length ) {
                cl_phone = $( "#billing_phone" ).val();
            }
            if ( $( "#billing_country" ).length ) {
                cl_country = $( "#billing_country" ).val();
            }
            if ( $( "#billing_address_1" ).length ) {
                cl_address_1 = $( "#billing_address_1" ).val();
            }
            if ( $( "#billing_city" ).length ) {
                cl_city = $( "#billing_city" ).val();
            }
            if ( $( "#billing_postcode" ).length ) {
                cl_postcode = $( "#billing_postcode" ).val();
            }

            let data = {
                'action': 'cl_save_abandon_cart_data',
                'security': cl_localized_vars.security,
                'email': cl_email,
                'first_name': cl_firstname,
                'last_name': cl_lastname,
                'phone': cl_phone,
                'country': cl_country,
                'address': cl_address_1,
                'city': cl_city,
                'postcode': cl_postcode,
                'provider': provider,
            };

            if ( wpfunnels_checkout_id !== '' ) {
                data['wpfunnels_checkout_id'] = wpfunnels_checkout_id;
            }

            clearTimeout( typingTimer );
            typingTimer = setTimeout( function () {
                if ( CartLiftCheckout.is_email( data.email ) ) {
                    $.post(
                        cl_localized_vars.ajaxurl,
                        data,
                        function ( response ) {
                        }
                    );
                }
            }, doneTypingInterval )
        },

        remove_gdpr_notice: function () {

            var provider = 'wc';
            if ( $( "#edd-email" ).length ) {
                provider = 'edd';
            }
            let data = {
                'action': 'cl_remove_gdpr_notice',
                'security': cl_localized_vars.gdpr_nonce,
                'provider': provider,
            };
            $.post(
                cl_localized_vars.ajaxurl,
                data,
                function ( response ) {
                    if ( response.success ) {
                        $( "#cl_gdpr_message" ).delay( 1000 ).fadeOut();
                    }
                }
            );
        },

        is_email: function ( value ) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test( value );
        }
    };


    jQuery( document ).ready( function () {
            CartLiftCheckout.init();
            var cl_edd_email = $('#cl_edd_email').val();
            var cl_edd_first_name = $('#cl_edd_first_name').val();

            $( "#edd-email" ).val( cl_edd_email );
            $( "#edd-first" ).val( cl_edd_first_name );
        }
    );

})( jQuery );