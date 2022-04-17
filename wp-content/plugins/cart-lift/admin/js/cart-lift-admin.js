(function ( $ ) {

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

    function isBlank( str ) {
        return ( !str || /^\s*$/.test( str ));
    }


    AnalyticsAction = {
        init: function () {
            AnalyticsAction.initDatePicker();
            $( document ).on( 'change', '#filter-option', AnalyticsAction.getAnalyticsData );
            $( document ).on( 'click', '#submit_range', AnalyticsAction.getAnalyticsData );
            $( document ).on( 'change', '#to', AnalyticsAction.getAnalyticsData );
        },

        getDate: function ( element ) {
            var date;
            try {
                date = $.datepicker.parseDate( dateFormat, element.value );
            } catch ( error ) {
                date = null;
            }
            return date;
        },

        initDatePicker: function () {
            var dateFormat = "M d, yy",
                from = $( "#from" )
                    .datepicker( {
                        dateFormat: "M d, yy",
                        numberOfMonths: 1,
                        changeMonth: true,
                        changeYear: true,
                        yearRange: "2020:2040"
                    } ).datepicker( "setDate", '-7d' )
                    .on( "change", function () {
                        to.datepicker( "option", "minDate", AnalyticsAction.getDate( this ) );
                    } ),

                to = $( "#to" ).datepicker( {
                    dateFormat: "M d, yy",
                    numberOfMonths: 1,
                    changeMonth: true,
                    changeYear: true,
                    yearRange: "2020:2040"
                } ).datepicker( "setDate", new Date() )
                    .on( "change", function () {
                        from.datepicker( "option", "maxDate", AnalyticsAction.getDate( this ) );
                    } );
        },

        set_value: function ( element, val ) {
            $( '#' + element ).html( val );
        },

        getAnalyticsData: function () {
            let $_this = $( this ),
                data = $_this.val(),
                loader = $( '#cl-loader' );
            data = 'custom';
            var date_start = '';
            var date_end = '';
            if ( data == '0' ) {
                data = 'weekly';
            } else if ( data == 'custom' || data == 'Submit' ) {
                data = 'custom';
                date_start = $( '#from' ).val();
                date_end = $( '#to' ).val();
            }
            let payload = {
                'range': data,
                'date_start': date_start,
                'date_end': date_end,
            };
            cl_chart.destroy();
            loader.fadeIn();
            wpAjaxHelperRequest( 'get-analytics-data', payload )
                .success( function ( response ) {
                    loader.fadeOut();
                    let data = response.data;
                    AnalyticsAction.set_value( 'recapturable-revenue', data.recapturable_revenue );
                    AnalyticsAction.set_value( 'recovered-revenue', data.recovered.revenue );
                    AnalyticsAction.set_value( 'abandoned-total', data.abandoned.total );
                    AnalyticsAction.set_value( 'abandoned-revenue', data.abandoned.revenue );
                    AnalyticsAction.set_value( 'abandoned-carts-rate', data.abandoned_carts_rate );
                    AnalyticsAction.set_value( 'actionable-carts', data.actionable_carts );
                    AnalyticsAction.set_value( 'total-email-sent', data.total_email_sent );


                    let chart_data = data.chart_data;
                    var label = chart_data.labels;
                    var datasets_abandoned = chart_data.abandoned;
                    var datasets_recovered = chart_data.recovered;
                    var config = {
                        type: 'line',
                        data: {
                            labels: label,

                            datasets: [ {
                                label: 'Abandoned',
                                backgroundColor: '#ee8033',
                                borderColor: '#ee8033',
                                data: datasets_abandoned,
                                fill: false,
                            }, {
                                label: 'Recovered',
                                backgroundColor: '#6d41d3',
                                borderColor: '#6d41d3',
                                data: datasets_recovered,
                                fill: false,
                            } ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: 'Cart Overview',
                                fontSize: 18,
                                fontColor: '#363b4e',
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                bodySpacing: 12,
                                titleMarginBottom: 10,
                                xPadding: 7,
                                yPadding: 7,
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            scales: {
                                xAxes: [ {
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                    }
                                } ],
                                yAxes: [ {
                                    display: true,
                                    ticks: {
                                        stepSize: 1
                                    },
                                    scaleLabel: {
                                        display: true,
                                    }
                                } ]
                            }
                        }
                    };
                    var ctx = document.getElementById( 'cl-chart' ).getContext( '2d' );
                    cl_chart = new Chart( ctx, config );
                } )
                .error( function ( response ) {
                    loader.fadeOut();

                } );

        },
    };

    CartActions = {
        init: function () {
            $( '.cl-cart-details' ).on( 'click', function ( e ) {
                e.preventDefault();
                $( this ).parents( '.single-cart-wrapper' ).find( '.cl-cart-modal' ).addClass( 'show' );
            } );
            $( '.cart-modal-close' ).on( 'click', function () {
                $( this ).parents( '.cl-cart-modal' ).removeClass( 'show' );
            } );

            $( document ).on( 'change', '#cl_status_filter', function ( e ) {
                $( "#cl_cart_filter" ).submit();
            } );
        },
    };

    AlertModal = {
        init: function () {
            $( '.cl-cart-delete' ).on( 'click', function ( e ) {
                e.preventDefault();
                $( this ).parents( '.single-cart-wrapper' ).find( '.cl-alert-modal' ).addClass( 'show' );
            } );
            $( '.cl-alert-close, .cl-alert-cancel' ).on( 'click', function () {
                $( this ).parents( '.cl-alert-modal' ).removeClass( 'show' );
            } );

            //------campaign alert modal--------
            $( '.cl-campaign-delete' ).on( 'click', function ( e ) {
                e.preventDefault();
                $( this ).parents( '.single-campaign-wrapper' ).find( '.cl-alert-modal' ).addClass( 'show' );
            } );
            $( '.cl-alert-close, .cl-alert-cancel' ).on( 'click', function () {
                $( this ).parents( '.cl-alert-modal' ).removeClass( 'show' );
            } );

        },
    };

    EmailTemplateActions = {

        init: function () {
            $( document ).on( 'click', '.cl-send-test-email', EmailTemplateActions.send_test_preview_email );
            $( document ).on( 'click', '.cl-toggle-email-template-status-list', EmailTemplateActions.toggle_template_status_list_table );
            $( document ).on( 'click', '.cl-toggle-email-template-status', EmailTemplateActions.toggle_campaign_status );
            // $(document).on('click', '.cl-toggle-email-template-status', EmailTemplateActions.toggle_template_status_list_table);
            $( document ).on( 'click', '.cl-toggle-campaign-coupon', EmailTemplateActions.toggle_campaign_coupon );
            $( document ).on( 'submit', '#cl-email-template-edit-form', EmailTemplateActions.save_campaign );
            $( document ).on( 'change', '#cl-conditional-discount', EmailTemplateActions.toggle_conditional_discount );

            $( '#cl-campaign-email-header-color' ).wpColorPicker();
            $( '#cl-campaign-checkout-color' ).wpColorPicker();

            if ( $( "#cl-campaign-coupon" ).is( ":checked" ) ) {
                $( '.coupon-fields' ).show();
                if ( $( "#cl-conditional-discount" ).is( ":checked" ) ) {
                    $( '.cl-coupon-conditional-fields' ).show();
                    $( '#cl-coupon-amount' ).hide();
                } else {
                    $( '.cl-coupon-conditional-fields' ).hide();
                    $( '#cl-coupon-amount' ).show();
                }
            } else {
                $( '.coupon-fields' ).hide();
            }
            $( document ).on( 'click', '#cl-campaign-coupon', function () {
                $( '.coupon-fields' ).toggle( $( "#cl-campaign-coupon" ).is( ":checked" ) );
            } );

            $( document ).on( 'click', '#cl-conditional-discount', function () {
                $( '.cl-coupon-conditional-fields' ).toggle( $( "#cl-conditional-discount" ).is( ":checked" ) );
                $( '#cl-coupon-amount' ).toggle( !$( "#cl-conditional-discount" ).is( ":checked" ) );
            } );
        },

        toggle_template_status_list_table: function () {
            let $_this = $( this ),
                id = $_this.attr( 'id' ),
                template_id = $_this.attr( 'data-template-id' ),
                current_status = $_this.attr( 'data-status' );

            let payload = {
                'id': template_id,
                'status': current_status
            };

            wpAjaxHelperRequest( 'toggle-email-template-status', payload )
                .success( function ( response ) {
                    /*console.log( 'Woohoo!' );*/
                } )
                .error( function ( response ) {

                } );

        },

        toggle_campaign_status: function () {
            let $_this = $( this ),
                id = $_this.attr( 'id' ),
                value = $_this.val();
            if ( value == '1' ) {
                $_this.attr( 'data-status', 'off' );
                $_this.val( 0 );
            } else {
                $_this.attr( 'data-status', 'on' );
                $_this.val( 1 );
            }
        },

        toggle_campaign_coupon: function () {
            let $_this = $( this ),
                value = $_this.val();
            if ( value == '1' ) {
                $_this.val( 0 );
            } else {
                $_this.val( 1 );
            }
        },

        send_test_preview_email: function () {
            let email_subject = '',
                email_body = '',
                send_to = '',
                email_header_text = '',
                email_header_color = '#6e42d3',
                $_this = $( this );

            if ( $( "#wp-cl_email_body-wrap" ).hasClass( "tmce-active" ) ) {
                email_body = tinyMCE.get( 'cl_email_body' ).getContent();
            } else {
                email_body = $( '#cl_email_body' ).val();
            }
            email_subject = $( '#cl-email-subject' ).val();
            send_to = $( '#cl-test-email' ).val();
            email_header_text = $( '#cl-campaign-email-header' ).val();
            email_checkout_text = $( '#cl-campaign-checkout-text' ).val();
            email_header_color = $( '#cl-campaign-email-header-color' ).val();
            email_checkout_color = $( '#cl-campaign-checkout-color' ).val();
            if ( isBlank( email_subject ) ) {
                alert( 'Please add email subject' );
            } else if ( isBlank( email_body ) ) {
                alert( 'Please add email body' );
            } else if ( isBlank( send_to ) ) {
                alert( 'Please add recipient' );
            } else {

                let payload = {
                    'email_subject': email_subject,
                    'email_body': email_body,
                    'send_to': send_to,
                    'email_header_text': email_header_text,
                    'email_header_color': email_header_color,
                    'email_checkout_color': email_checkout_color,
                    'email_checkout_text': email_checkout_text,
                };
                let message_block = $( "#test_mail_response_msg" );
                message_block.html( '' );
                message_block.hide();
                wpAjaxHelperRequest( 'send-preview-email', payload )
                    .success( function ( response ) {
                        /*console.log( 'Woohoo!' );*/
                        if ( response.success ) {
                            message_block.removeClass( 'cl-error' );
                            message_block.addClass( 'cl-success' ).html( 'Email sent successfully.' ).delay( 1000 ).fadeOut();
                        } else {
                            message_block.addClass( 'cl-error' ).html( 'Email sending failed.' ).delay( 1000 ).fadeOut();
                        }
                        message_block.fadeIn();
                    } )
                    .error( function ( response ) {
                        message_block.addClass( 'cl-error' ).html( 'Email sending failed.' ).delay( 1000 ).fadeOut();
                        message_block.fadeIn();
                    } );
            }
        },

        save_campaign: function () {
            var frequency = $( "#cl-email-frequency" ).val(),
                unit = $( "#cl-email-unit" ).val();
            if ( unit === 'minute' ) {
                if ( frequency < 15 ) {
                    $( "#cl-email-frequency" ).parent( '.send-email-time' ).addClass( 'cl-field-error' );
                    alert( 'Minimum time limit 15 mins' );
                    return false;
                }
            } else {
                $( this ).submit();
            }
        },

        toggle_conditional_discount: function () {
            let $_this = $( this ),
                id = $_this.attr( 'id' ),
                value = $_this.val();
            if ( value == '1' ) {
                $_this.attr( 'data-status', 'off' );
                $_this.val( 0 );
            } else {
                $_this.attr( 'data-status', 'on' );
                $_this.val( 1 );
            }
        }
    };

    GeneralSettingsAction = {
        init: function () {
            $( document ).on( 'submit', '#general-settings-form', GeneralSettingsAction.save_general_settings );
        },
        save_general_settings: function ( e ) {
            e.preventDefault();
            var expiration_frequency = $( "#cl-expiration-time" ).val(),
                cut_off_frequency = $( "#cl-abandonment-time" ).val(),
                error = false;
            if ( cut_off_frequency < 15 ) {
                $( "#cl-abandonment-time" ).parent( '.cl-form-group' ).addClass( 'cl-field-error' );
                alert( 'Minimum time is limit 15 minutes' );
                return false;
            }
            if ( expiration_frequency < 7 ) {
                $( "#cl-expiration-time" ).parent( '.cl-form-group' ).addClass( 'cl-field-error' );
                alert( 'Minimum time is limit 7 days' );
                return false;
            }


            $( '#cl-loader' ).fadeIn();
            $( '#general_settings_notice' ).hide();

            var data = $( this ).serialize();
            console.log(data);
            let payload = {
                'data': data,
            };
            wpAjaxHelperRequest( 'general-save-form', payload )
                .success( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                    $( '#general_settings_notice' ).addClass( 'cl-success' ).fadeIn();
                    $( '#general_settings_notice' ).html( response.message );
                    setTimeout( function () {
                        $( '#general_settings_notice' ).removeClass( 'cl-success' ).fadeOut();
                    }, 3000 );
                } )
                .error( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                    $( '#general_settings_notice' ).addClass( 'cl-error' ).show();
                    $( '#general_settings_notice' ).text( 'Something wrong' );
                    setTimeout( function () {
                        $( '#general_settings_notice' ).removeClass( 'cl-error' ).fadeOut();
                    }, 3000 );
                } );
        }
    };

    OtherSMTPActions = {
        init: function () {
            $( document ).on( 'submit', '#smtp-save-form', OtherSMTPActions.set_smtp_data );
            $( document ).on( 'click', '.cl-toggle-option', OtherSMTPActions.toggle_settings_option );
            $( document ).on( 'click', '#cl_send_test', OtherSMTPActions.test_smtp_data );
        },

        toggle_settings_option: function () {
            let $_this = $( this ),
                id = $_this.attr( 'id' ),
                value = $_this.val();
            if ( value == '1' ) {
                $_this.attr( 'data-status', 'no' );
                $_this.val( 0 );
            } else {
                $_this.attr( 'data-status', 'yes' );
                $_this.val( 1 );
            }

            var name = $( this ).attr( 'name' );
            if ( name == 'enable_webhook' ) {
                if ( value == 0 ) {
                    $( '#cart_webhook' ).fadeIn();
                } else {
                    $( '#cart_webhook' ).fadeOut();
                }
            }

            // var smtp = $(this).attr('name');
            // if (smtp == 'enable_smtp') {
            // 		if (value == 0) {
            // 			$('#smtp-switch').fadeIn();
            // 			$('#smtp-save-form').fadeIn();
            // 		}
            // 		else {
            // 			$('#smtp-switch').fadeOut();
            // 			$('#smtp-save-form').fadeOut();
            // 		}
            // }

            var gdpr = $( this ).attr( 'name' );
            if ( gdpr == 'enable_gdpr' ) {
                if ( value == 0 ) {
                    $( '#cl-gdpr-message' ).fadeIn();
                } else {
                    $( '#cl-gdpr-message' ).fadeOut();
                }
            }
        },

        set_smtp_data: function ( e ) {
            e.preventDefault();
            $( '#cl-loader' ).fadeIn();
            $( '#smtp_notice' ).hide();
            var data = $( this ).serialize();
            var data = btoa( data );
            let payload = {
                'data': data,
            };
            wpAjaxHelperRequest( 'set-other-smtp-data', payload )
                .success( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                    $( '#smtp_notice' ).addClass( 'cl-success' ).show();
                    $( '#smtp_notice' ).text( response.message );
                    setTimeout( function () {
                        $( '#smtp_notice' ).removeClass( 'cl-success' ).fadeOut();
                    }, 3000 );
                } )
                .error( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                    $( '#smtp_notice' ).addClass( 'cl-error' ).show();
                    $( '#smtp_notice' ).text( 'Something wrong' );
                    setTimeout( function () {
                        $( '#smtp_notice' ).removeClass( 'cl-error' ).fadeOut();
                    }, 3000 );
                } );
        },

        test_smtp_data: function ( e ) {
            e.preventDefault();
            $( '#cl-loader' ).fadeIn();
            $( '#smtp_test_notice' ).hide();
            var data = $( "[name='cl_test_email']" ).val();

            let payload = {
                'data': data,
            };
            wpAjaxHelperRequest( 'test-smtp-data', payload )
                .success( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                    if ( response.status == 'success' ) {
                        $( '#smtp_test_notice' ).addClass( 'cl-success' ).show();

                    } else {
                        $( '#smtp_test_notice' ).addClass( 'cl-error' ).show();
                    }
                    $( '#smtp_test_notice' ).text( response.message );
                } )
                .error( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                    $( '#smtp_test_notice' ).addClass( 'cl-error' ).show();
                    $( '#smtp_test_notice' ).text( 'Error Occured' );
                } );
        },
    };

    CampaignCopyAction = {
        init: function () {
            $( document ).on( 'click', '.duplicate-control', CampaignCopyAction.campaign_copy_setup );
        },
        campaign_copy_setup: function ( e ) {
            e.preventDefault();
            $( '#cl-loader' ).fadeIn();

            var data = $( this ).attr( 'data-id' );

            let payload = {
                'data': data,
            };
            wpAjaxHelperRequest( 'campaign-copy-setup', payload )
                .success( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                    location.reload();
                } )
                .error( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                } );
        },
    };

    WebhookTestAction = {
        init: function () {
            $( document ).on( 'click', '#trigger_webhook', WebhookTestAction.cl_webhook_test );
        },

        cl_webhook_test: function ( e ) {
            e.preventDefault();
            $( '#cl-loader' ).fadeIn();
            $( '#webhook-notice' ).hide();
            var url = $( '#webhook_url' ).val();
            if ( $.trim( url ) !== "" ) {
                var param = {
                    "name": 'Demo',
                    "email": 'demo@gmail.com',
                    "status": 'abandoned',
                    "cart_totall": '$216.00',
                    "provider": 'edd',
                    "product_table": '<div style="margin-bottom: 40px;"> <table class="td" cellspacing="0" cellpadding="6" style="color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;width: 100%;font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif" border="1"> <thead> <tr> <th class="td" scope="col" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px;">Product</th> <th class="td" scope="col" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px;">Quantity</th> <th class="td" scope="col" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px;">Price</th> </tr> </thead> <tbody> <tr class="cart_item"> <td class="td" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;"><img style="width: 40px;height: 40px;border: none;font-size: 14px;font-weight: bold;text-decoration: none;text-transform: capitalize;vertical-align: middle;margin-right: 10px;max-width: 100%;width: 40px;height: 40px;" src="">DEMO 1</td> <td class="td" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;">1</td> <td class="td" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;">&#36;50</td> </tr> <tr class="cart_item"> <td class="td" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;"><img style="width: 40px;height: 40px;border: none;font-size: 14px;font-weight: bold;text-decoration: none;text-transform: capitalize;vertical-align: middle;margin-right: 10px;max-width: 100%;width: 40px;height: 40px;" src="">DEMO 2</td> <td class="td" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;">1</td> <td class="td" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;">&#36;166</td> </tr> </tbody> <tfoot> <tr> <th class="td" scope="row" colspan="2" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px;">Total:</th> <td class="td" style="text-align:left; color: #636363;border: 1px solid #e5e5e5;vertical-align: middle;padding: 12px;">&#36;216.00</td> </tr> </tfoot> </table> </div>',
                };
                $.ajax( {
                    url: url,
                    type: 'POST',
                    data: param,
                    success: function ( res ) {
                        $( '#cl-loader' ).fadeOut();
                        $( '#webhook-notice' ).show();
                        $( '#webhook-notice' ).text( 'Success' );
                    },
                    error: function () {
                        $( '#cl-loader' ).fadeOut();
                        $( '#webhook-notice' ).show();
                        $( '#webhook-notice' ).text( 'Error' );
                    }
                } );
            } else {
                $( '#cl-loader' ).fadeOut();
                $( '#webhook-notice' ).show();
                $( '#webhook-notice' ).text( 'No Data Given' );
                /*console.log( 'no data' );*/
            }
        },
    };


    SMTPSwitcherAction = {
        init: function () {
            $( document ).on( 'click', '.cl-toggle-option-smtp', SMTPSwitcherAction.enable_cl_smtp );
        },

        enable_cl_smtp: function ( e ) {
            $( '#cl-loader' ).fadeIn();
            let $_this = $( this ),
                id = $_this.attr( 'id' ),
                value = $_this.val();
            if ( value == '1' ) {
                $_this.attr( 'data-status', 'no' );
                $_this.val( 0 );
            } else {
                $_this.attr( 'data-status', 'yes' );
                $_this.val( 1 );
            }

            var data = $( this ).val();

            let payload = {
                'data': data,
            };
            wpAjaxHelperRequest( 'enable-cl-smtp', payload )
                .success( function ( response ) {
                    if ( response.data == '1' ) {
                        $( '#smtp-switch' ).fadeIn();
                        $( '#smtp-save-form' ).fadeIn();
                    } else {
                        $( '#smtp-switch' ).fadeOut();
                        $( '#smtp-save-form' ).fadeOut();
                    }
                    /*console.log( response.data );*/
                    $( '#cl-loader' ).fadeOut();
                } )
                .error( function ( response ) {
                    $( '#cl-loader' ).fadeOut();
                } );
        },
    };


    $( document ).ready( function () {
        AnalyticsAction.init();
        CartActions.init();
        AlertModal.init();
        EmailTemplateActions.init();
        GeneralSettingsAction.init();
        CampaignCopyAction.init();
        WebhookTestAction.init();
        OtherSMTPActions.init();
        SMTPSwitcherAction.init();

        //-------setting panel tab--------
        $( "#cl-settings-tabs" ).tabs({
            activate: function( event, ui ) {
                let tabID = ui.newPanel.attr('id');
                if( 'twilio-sms' === tabID ) {
                    $('.tab-header .documentation a').attr('href', 'https://rextheme.com/docs/twilio-sms-service-to-recover-abandoned-carts/')
                } else  {
                    $('.tab-header .documentation a').attr('href', 'https://rextheme.com/docs/configure-and-use-cart-lift/')
                }
            }
        });
        $( "#smtp-tabs" ).tabs();

        //--------niceSelect--------
        $( '.cl-select' ).niceSelect();
    } );

    $( document ).on( 'change', '#cl-campaign-coupon-unit, #cl-campaign-coupon-frequency', function ( e ) {
        var coupon_expiration_frequency = $( '#cl-campaign-coupon-frequency' ).val();
        var coupon_expiration_frequency_day = $( '#cl-campaign-coupon-unit' ).val();

        coupon_expiration_frequency = parseInt( coupon_expiration_frequency );

        if ( coupon_expiration_frequency < 2 && coupon_expiration_frequency_day === 'hour' ) {

            $( '#coupon_expiration_frequency' ).fadeIn();
            $( '#coupon_expiration_frequency' ).css( 'display', 'flex' );
            setTimeout( function () {
                $( 'input[name=cl_campaign_coupon_frequency]' ).val(2);
                $( '#coupon_expiration_frequency' ).fadeOut();
            }, 3000 );
        }
    } );

    $( document ).on( 'change', '#cl-campaign-enable-twilio', function ( e ) {
        var is_twilio_enabled = $( '#cl-campaign-enable-twilio' ).val();

        if ( is_twilio_enabled == 1 ) {
            $( '#cl-twilio-campaign-body' ).fadeIn();
        } else {

            $( '#cl-twilio-campaign-body' ).fadeOut();
        }
    } );

})( jQuery );