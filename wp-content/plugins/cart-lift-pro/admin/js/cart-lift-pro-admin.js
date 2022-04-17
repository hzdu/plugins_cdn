( function ( $ ) {
    'use strict';
    /**
     * All of the code for your admin-facing JavaScript source
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

    const EmailTemplateProActions = {
        init: function () {
            this.initProductSearch();
            this.initCategorySearch();
            $( document ).on( 'change', '#cl-free-shipping', this.toggleCouponOption );
            $( document ).on( 'change', '#cl-individual-use', this.toggleCouponOption );
            $( document ).on( 'change', '#cl-auto-apply', this.toggleCouponOption );
        },

        initProductSearch: function () {

            $( '.cl-product-search' ).select2( {
                minimumInputLength: 3,
                allowClear: true,
                ajax: {
                    url: cl_pro_obj.ajaxurl,
                    dataType: 'json',
                    delay: 250,
                    data: function ( params ) {
                        return {
                            term: params.term,
                            action: 'cl_product_search',
                            security: cl_pro_obj.security,
                        };
                    },
                    processResults: function ( data ) {
                        var terms = [];
                        if ( data ) {
                            $.each( data, function ( id, text ) {
                                terms.push( { id: id, text: text } );
                            } );
                        }
                        return {
                            results: terms
                        };
                    },
                    cache: true
                }
            } );
        },

        initCategorySearch: function () {

            $( '.cl-category-search' ).select2( {
                minimumInputLength: 3,
                allowClear: true,
                ajax: {
                    url: cl_pro_obj.ajaxurl,
                    dataType: 'json',
                    delay: 250,
                    data: function ( params ) {
                        return {
                            term: params.term,
                            action: 'cl_category_search',
                            security: cl_pro_obj.security,
                        };
                    },
                    processResults: function ( data ) {
                        var terms = [];
                        if ( data ) {
                            $.each( data, function ( id, text ) {
                                terms.push( { id: id, text: text } );
                            } );
                        }
                        return {
                            results: terms
                        };
                    },
                    cache: true
                }
            } );
        },

        toggleCouponOption: function () {
            let $_this = $( this ),
                id = $_this.attr( 'id' ),
                value = $_this.val();
            if ( value == '1' ) {
                $_this.attr( 'data-status', 'off' );
                $_this.val( 0 );
            }
            else {
                $_this.attr( 'data-status', 'on' );
                $_this.val( 1 );
            }
        }
    };

    const EmailPopupSettings = {
        init: function () {
            $( document ).on( 'submit', '#email-popup-settings', this.email_popup_submit );
        },

        email_popup_submit: function ( e ) {
            e.preventDefault();
            $( '#cl-loader' ).fadeIn();
            $( '#email-popup-notice' ).hide().removeClass( 'cl-success cl-error' );

            var enabler = $( '#email_popup' ).val();
            var popup_logo = $( '#popup_logo_src' ).val();
            var no_thanks_btn = $( '#no_thanks_btn' ).is(':checked') ? 'on' : 'off';
            var modal_title = $( '#modal_title' ).val();
            var modal_description = $( '#modal_description' ).val();
            var modal_button_text = $( '#modal_button_text' ).val();
            var modal_submit_btn_color = $( '#modal_button_color' ).val();

            let payload = {
                'enabler': enabler,
                'popup_logo': popup_logo,
                'no_thanks_btn': no_thanks_btn,
                'popup_title': modal_title,
                'popup_description': modal_description,
                'popup_button_text': modal_button_text,
                'modal_submit_btn_color': modal_submit_btn_color,
            };

            wpAjaxHelperRequest( 'email-popup-submit', payload )
                .success( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                    $( '#email-popup-notice' ).show().addClass( 'cl-success' );
                    $( '#email-popup-notice' ).text( response.message );
                    setTimeout( function () {
                        $( '#email-popup-notice' ).fadeOut().removeClass( 'cl-success' );
                    }, 3000 );
                } )
                .error( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                    $( '#email-popup-notice' ).show().addClass( 'cl-error' );
                    $( '#email-popup-notice' ).text( 'Error Occured' );
                    setTimeout( function () {
                        $( '#email-popup-notice' ).fadeOut().removeClass( 'cl-error' );
                    }, 3000 );
                } );
        },
    };

    const TwilioSmsSettings = {
        init: function () {
            $( document ).on( 'submit', '#twilio-sms-settings', this.twilio_sms_submit );
        },

        twilio_sms_submit: function ( e ) {
            e.preventDefault();

            $( '#cl-loader' ).fadeIn();
            $( '#twilio_sms_notice' ).hide().removeClass( 'cl-success cl-error' );

            var enabler = $( '#twilio_sms' ).is(':checked') === true ? 1 : 0;
            var twilio_account_sid = $( '#twilio_account_sid' ).val();
            var twilio_auth_token = $( '#twilio_auth_token' ).val();
            var twilio_mobile_number = $( '#twilio_mobile_number' ).val();
            var ajaxurl = cl_pro_obj.ajaxurl;
            var ajaxnonce = cl_pro_obj.security;

            jQuery.ajax( {
                type: "POST",
                url: ajaxurl,
                data: {
                    'action': "twilio_sms_submit",
                    'nonce': ajaxnonce,
                    'enabler': enabler,
                    'twilio_account_sid': twilio_account_sid,
                    'twilio_auth_token': twilio_auth_token,
                    'twilio_mobile_number': twilio_mobile_number
                },

                success: function ( response ) {

                    $( '#cl-loader' ).fadeOut();
                    if ( response.status ) {
                        $( '#twilio_sms_notice' ).show().addClass( 'cl-success' );
                        $( '#twilio_sms_notice' ).text( response.message );
                        setTimeout( function () {
                            $( '#twilio_sms_notice' ).fadeOut().removeClass( 'cl-success' );
                        }, 3000 );
                    }
                    else{
                        $( '#twilio_sms_notice' ).show().addClass( 'cl-error' );
                        $( '#twilio_sms_notice' ).text( response.message );

                        setTimeout( function () {
                            $( '#twilio_sms_notice' ).fadeOut().removeClass( 'cl-error' );
                        }, 3000 );
                    }
                },
                error: function ( response ) {

                    $( '#cl-loader' ).fadeOut();
                    $( '#twilio_sms_notice' ).show().addClass( 'cl-error' );
                    $( '#twilio_sms_notice' ).text( response.message );

                    setTimeout( function () {
                        $( '#twilio_sms_notice' ).fadeOut().removeClass( 'cl-error' );
                    }, 3000 );
                }
            } );
        },
    };

    $(document).on('change', '#twilio_sms', function ( e ) {
        e.preventDefault();
        $( '#twilio_sms' ).is(':checked') === true ? $('#twilio_sms_setting_fields').show() : $('#twilio_sms_setting_fields').hide();
    });

    $(document).on('change', '#no_thanks_btn', function ( e ) {
        e.preventDefault();
        $( '#no_thanks_btn' ).is(':checked') ? $('#cl-ignore-email-form').show() : $('#cl-ignore-email-form').hide();
    });

    $( document ).ready( function () {
        EmailTemplateProActions.init();
        EmailPopupSettings.init();

        $( '#twilio_sms' ).is(':checked') === true ? $('#twilio_sms_setting_fields').show() : $('#twilio_sms_setting_fields').hide();

        TwilioSmsSettings.init();

        EmailPopupColorPicker();

        SelectEmailPopupSubmitButtonColor();
    } );

    function EmailPopupColorPicker(){
        $( '.cl-wp-color-picker' ).wpColorPicker({
            change: function(event, ui) {
                var selected_color = ui.color.toString();
                $( '#cl_popup_submit_btn' ).css( 'background-color', selected_color );
            }
        });
    }

    function SelectEmailPopupSubmitButtonColor(){
        var selected_color = $( '#modal_button_color' ).val();
        $( '#cl_popup_submit_btn' ).css( 'background-color', selected_color );
    }

} )( jQuery );
