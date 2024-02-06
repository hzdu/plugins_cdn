jQuery(document).ready(function ($) {
    'use strict';
    let service_carrier_type = vi_wot_customize_params.service_carrier_type;
    let delivered_icons = vi_wot_customize_params.delivered_icons;
    let pickup_icons = vi_wot_customize_params.pickup_icons;
    let transit_icons = vi_wot_customize_params.transit_icons;
    let languages = vi_wot_customize_params.languages;

    function addPreviewControl(name, element, style, suffix = '', type = '') {
        if (type) {
            type = '[' + type + ']';
        }
        wp.customize('woo_orders_tracking_settings' + type + '[' + name + ']', function (value) {
            value.bind(function (newval) {
                $('#vi-wot-orders-tracking-customize-preview-' + name.replace(/_/g, '-')).html(element + '{' + style + ':' + newval + suffix + ' ; }');
            })
        })
    }

    /*Button Track*/
    wp.customize('woo_orders_tracking_settings[tracking_form_button_track_title]', function (value) {
        value.bind(function (newval) {
            $('.vi-woocommerce-orders-tracking-form-search-tracking-number-btnclick').html(newval);
        })
    });
    if (languages.length > 0) {
        for (let i = 0; i < languages.length; i++) {
            wp.customize(`woo_orders_tracking_settings[tracking_form_button_track_title_${languages[i]}]`, function (value) {
                value.bind(function (newval) {
                    $('.vi-woocommerce-orders-tracking-form-search-tracking-number-btnclick').html(newval);
                })
            });
        }
    }
    wp.customize('woo_orders_tracking_settings[tracking_form_button_track_color]', function (value) {
        value.bind(function (newval) {
            $('.vi-woocommerce-orders-tracking-form-search-tracking-number-btnclick').css({color: newval});
        })
    });
    wp.customize('woo_orders_tracking_settings[tracking_form_button_track_bg_color]', function (value) {
        value.bind(function (newval) {
            $('.vi-woocommerce-orders-tracking-form-search-tracking-number-btnclick').css({'background-color': newval});
        })
    });
    wp.customize('woo_orders_tracking_settings[tracking_form_email]', function (value) {
        value.bind(function (newval) {
            let require_order_id = wp.customize('woo_orders_tracking_settings[tracking_form_order_id]').get();
            let $email = $('.vi-woocommerce-orders-tracking-form-order-email');
            let fields_count = 1;
            if (require_order_id == 1) {
                fields_count++;
            }
            if (newval == 1) {
                fields_count++;
                $email.removeClass('vi-woocommerce-orders-tracking-hidden');
            } else {
                $email.addClass('vi-woocommerce-orders-tracking-hidden');
            }
            $('.vi-woocommerce-orders-tracking-form-inputs').attr('class', 'vi-woocommerce-orders-tracking-form-inputs vi-woocommerce-orders-tracking-form-inputs-' + fields_count);
        })
    });
    wp.customize('woo_orders_tracking_settings[tracking_form_require_email]', function (value) {
        value.bind(function (newval) {
            let $email = $('.vi-woocommerce-orders-tracking-form-order-email-input');
            if (newval) {
                $email.attr('placeholder', vi_wot_customize_params.i18n_email_require);
            } else {
                $email.attr('placeholder', vi_wot_customize_params.i18n_email);
            }
        })
    });
    wp.customize('woo_orders_tracking_settings[tracking_form_require_tracking_number]', function (value) {
        value.bind(function (newval) {
            let $tracking_number = $('.vi-woocommerce-orders-tracking-form-search-tracking-number');
            if (newval) {
                $tracking_number.attr('placeholder', vi_wot_customize_params.i18n_order_tracking_number_require);
            } else {
                $tracking_number.attr('placeholder', vi_wot_customize_params.i18n_order_tracking_number);
            }
        })
    });
    wp.customize('woo_orders_tracking_settings[tracking_form_order_id]', function (value) {
        value.bind(function (newval) {
            let require_email = wp.customize('woo_orders_tracking_settings[tracking_form_email]').get();
            let $order_id = $('.vi-woocommerce-orders-tracking-form-order-id');
            let fields_count = 1;
            if (require_email == 1) {
                fields_count++;
            }
            if (newval == 1) {
                fields_count++;
                $order_id.removeClass('vi-woocommerce-orders-tracking-hidden');
            } else {
                $order_id.addClass('vi-woocommerce-orders-tracking-hidden');
            }
            $('.vi-woocommerce-orders-tracking-form-inputs').attr('class', 'vi-woocommerce-orders-tracking-form-inputs vi-woocommerce-orders-tracking-form-inputs-' + fields_count);
        })
    });
    wp.customize('woo_orders_tracking_settings[tracking_form_require_order_id]', function (value) {
        value.bind(function (newval) {
            let $order_id = $('.vi-woocommerce-orders-tracking-form-order-id-input');
            if (newval) {
                $order_id.attr('placeholder', vi_wot_customize_params.i18n_order_id_require);
            } else {
                $order_id.attr('placeholder', vi_wot_customize_params.i18n_order_id);
            }
        })
    });
    wp.customize('woo_orders_tracking_settings[timeline_track_info_template]', function (value) {
        value.bind(function (newval) {
            switch (newval) {
                case '1':
                    $('#vi-wot-orders-tracking-customize-preview-show-timeline-template').html('.woo-orders-tracking-preview-shortcode-template-two{\n' +
                        '                display: none !important;\n' +
                        '            }\n' +
                        '            .woo-orders-tracking-preview-shortcode-template-one{\n' +
                        '                display: block;\n' +
                        '            }');
                    break;
                case '2':
                    $('#vi-wot-orders-tracking-customize-preview-show-timeline-template').html('.woo-orders-tracking-preview-shortcode-template-two{\n' +
                        '                display: block;\n' +
                        '            }\n' +
                        '            .woo-orders-tracking-preview-shortcode-template-one{\n' +
                        '                display: none !important;\n' +
                        '            }');
                    break;
            }
        });
    });
    wp.customize('woo_orders_tracking_settings[timeline_track_info_sort_event]', function (value) {
        value.bind(function (newval) {
            switch (newval) {
                case 'most_recent_to_oldest':
                    $('.woo-orders-tracking-most-recent-to-oldest').removeClass('woo-orders-tracking-shortcode-hidden');
                    $('.woo-orders-tracking-oldest-to-most-recent').addClass('woo-orders-tracking-shortcode-hidden');
                    break;
                case 'oldest_to_most_recent':
                    $('.woo-orders-tracking-oldest-to-most-recent').removeClass('woo-orders-tracking-shortcode-hidden');
                    $('.woo-orders-tracking-most-recent-to-oldest').addClass('woo-orders-tracking-shortcode-hidden');
                    break;
            }
        });
    });
    wp.customize('woo_orders_tracking_settings[timeline_track_info_date_format]', function (value) {
        value.bind(function (newval) {
            let time_format = wp.customize('woo_orders_tracking_settings[timeline_track_info_time_format]').get();
            $.ajax({
                type: 'POST',
                url: vi_wot_customize_params.ajax_url,
                data: {
                    action: 'vi_wot_customize_params_date_time_format',
                    format: newval + ' ' + time_format
                },
                beforeSend: function () {
                },
                success: function (response) {
                    if (response.status && response.status === 'success') {
                        $('.woo-orders-tracking-shortcode-timeline-event-time').html(response.html);
                        $('.woo-orders-tracking-shortcode-timeline-event-content-date').html(response.html);
                    }

                },
                error: function (err) {
                }
            });
        });
    });
    wp.customize('woo_orders_tracking_settings[timeline_track_info_time_format]', function (value) {
        value.bind(function (newval) {
            let date_format = wp.customize('woo_orders_tracking_settings[timeline_track_info_date_format]').get();
            $.ajax({
                type: 'POST',
                url: vi_wot_customize_params.ajax_url,
                data: {
                    action: 'vi_wot_customize_params_date_time_format',
                    format: date_format + ' ' + newval
                },
                success: function (response) {
                    if (response.status && response.status === 'success') {
                        $('.woo-orders-tracking-shortcode-timeline-event-time').html(response.html);
                        $('.woo-orders-tracking-shortcode-timeline-event-content-date').html(response.html);
                    }

                },
                error: function (err) {
                }
            });
        });
    });
    wp.customize('woo_orders_tracking_settings[timeline_track_info_title]', function (value) {
        value.bind(function (newval) {
            newval = newval.replace(/{carrier_name}/g, 'Carrier Name');
            newval = newval.replace(/{tracking_number}/g, 'CUSTOMIZE_PREVIEW');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-title').html(newval.replace(/_/g, '-'));
        });
    });
    addPreviewControl('timeline_track_info_title_alignment', '.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-title', 'text-align', '');
    addPreviewControl('timeline_track_info_title_color', '.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-title', 'color', '');
    addPreviewControl('timeline_track_info_title_font_size', '.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-title', 'font-size', 'px');


    addPreviewControl('timeline_track_info_status_color', '.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap', 'color', '');

    wp.customize('woo_orders_tracking_settings[timeline_track_info_status_background_delivered]', function (value) {
        value.bind(function (newval) {
            $('#vi-wot-orders-tracking-customize-preview-timeline-track-info-status-background-delivered').html('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap.woo-orders-tracking-shortcode-timeline-status-delivered{background-color:' + newval + ' ; }');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap').addClass('woo-orders-tracking-shortcode-hidden');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap.woo-orders-tracking-shortcode-timeline-status-delivered').removeClass('woo-orders-tracking-shortcode-hidden');
        });
    });
    wp.customize('woo_orders_tracking_settings[timeline_track_info_status_background_pickup]', function (value) {
        value.bind(function (newval) {
            $('#vi-wot-orders-tracking-customize-preview-timeline-track-info-status-background-pickup').html('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap.woo-orders-tracking-shortcode-timeline-status-pickup{background-color:' + newval + ' ; }');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap').addClass('woo-orders-tracking-shortcode-hidden');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap.woo-orders-tracking-shortcode-timeline-status-pickup').removeClass('woo-orders-tracking-shortcode-hidden');
        });
    });
    wp.customize('woo_orders_tracking_settings[timeline_track_info_status_background_transit]', function (value) {
        value.bind(function (newval) {
            $('#vi-wot-orders-tracking-customize-preview-timeline-track-info-status-background-transit').html('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap.woo-orders-tracking-shortcode-timeline-status-transit{background-color:' + newval + ' ; }');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap').addClass('woo-orders-tracking-shortcode-hidden');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap.woo-orders-tracking-shortcode-timeline-status-transit').removeClass('woo-orders-tracking-shortcode-hidden');
        });
    });
    wp.customize('woo_orders_tracking_settings[timeline_track_info_status_background_pending]', function (value) {
        value.bind(function (newval) {
            $('#vi-wot-orders-tracking-customize-preview-timeline-track-info-status-background-pending').html('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap.woo-orders-tracking-shortcode-timeline-status-pending{background-color:' + newval + ' ; }');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap').addClass('woo-orders-tracking-shortcode-hidden');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap.woo-orders-tracking-shortcode-timeline-status-pending').removeClass('woo-orders-tracking-shortcode-hidden');
        });
    });
    wp.customize('woo_orders_tracking_settings[timeline_track_info_status_background_alert]', function (value) {
        value.bind(function (newval) {
            $('#vi-wot-orders-tracking-customize-preview-timeline-track-info-status-background-alert').html('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap.woo-orders-tracking-shortcode-timeline-status-alert{background-color:' + newval + ' ; }');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap').addClass('woo-orders-tracking-shortcode-hidden');
            $('.woo-orders-tracking-shortcode-timeline-wrap .woo-orders-tracking-shortcode-timeline-status-wrap.woo-orders-tracking-shortcode-timeline-status-alert').removeClass('woo-orders-tracking-shortcode-hidden');
        });
    });

    addPreviewControl('icon_delivered_color',
        '.woo-orders-tracking-shortcode-timeline-wrap.woo-orders-tracking-shortcode-timeline-wrap-template-one ' +
        '.woo-orders-tracking-shortcode-timeline-events-wrap ' +
        '.woo-orders-tracking-shortcode-timeline-event ' +
        '.woo-orders-tracking-shortcode-timeline-icon-delivered i:before',
        'color', '', 'timeline_track_info_template_one');
    wp.customize('woo_orders_tracking_settings[timeline_track_info_template_one][icon_delivered]', function (value) {
        value.bind(function (newval) {
            if (delivered_icons.hasOwnProperty(newval)) {
                $('.woo-orders-tracking-shortcode-timeline-wrap-template-one .woo-orders-tracking-shortcode-timeline-events-wrap .woo-orders-tracking-shortcode-timeline-event .woo-orders-tracking-shortcode-timeline-icon-delivered').html(`<i class="${delivered_icons[newval]}"></i>`)
            }
        });
    });


    addPreviewControl('icon_pickup_color',
        '.woo-orders-tracking-shortcode-timeline-wrap.woo-orders-tracking-shortcode-timeline-wrap-template-one ' +
        '.woo-orders-tracking-shortcode-timeline-events-wrap ' +
        '.woo-orders-tracking-shortcode-timeline-event ' +
        '.woo-orders-tracking-shortcode-timeline-icon-pickup i:before',
        'color', '', 'timeline_track_info_template_one');
    addPreviewControl('icon_pickup_background',
        '.woo-orders-tracking-shortcode-timeline-wrap.woo-orders-tracking-shortcode-timeline-wrap-template-one ' +
        '.woo-orders-tracking-shortcode-timeline-events-wrap ' +
        '.woo-orders-tracking-shortcode-timeline-event ' +
        '.woo-orders-tracking-shortcode-timeline-icon-pickup ',
        'background-color', '', 'timeline_track_info_template_one');

    wp.customize('woo_orders_tracking_settings[timeline_track_info_template_one][icon_pickup]', function (value) {
        value.bind(function (newval) {
            if (pickup_icons.hasOwnProperty(newval)) {
                $('.woo-orders-tracking-shortcode-timeline-wrap-template-one .woo-orders-tracking-shortcode-timeline-events-wrap .woo-orders-tracking-shortcode-timeline-event .woo-orders-tracking-shortcode-timeline-icon-pickup').html(`<i class="${pickup_icons[newval]}"></i>`)
            }
        });
    });

    addPreviewControl('icon_transit_color',
        '.woo-orders-tracking-shortcode-timeline-wrap.woo-orders-tracking-shortcode-timeline-wrap-template-one ' +
        '.woo-orders-tracking-shortcode-timeline-events-wrap ' +
        '.woo-orders-tracking-shortcode-timeline-event ' +
        '.woo-orders-tracking-shortcode-timeline-icon-transit i:before',
        'color', '', 'timeline_track_info_template_one');
    addPreviewControl('icon_transit_background',
        '.woo-orders-tracking-shortcode-timeline-wrap.woo-orders-tracking-shortcode-timeline-wrap-template-one ' +
        '.woo-orders-tracking-shortcode-timeline-events-wrap ' +
        '.woo-orders-tracking-shortcode-timeline-event ' +
        '.woo-orders-tracking-shortcode-timeline-icon-transit',
        'background-color', '', 'timeline_track_info_template_one');

    wp.customize('woo_orders_tracking_settings[timeline_track_info_template_one][icon_transit]', function (value) {
        value.bind(function (newval) {
            if (transit_icons.hasOwnProperty(newval)) {
                $('.woo-orders-tracking-shortcode-timeline-wrap-template-one .woo-orders-tracking-shortcode-timeline-events-wrap .woo-orders-tracking-shortcode-timeline-event .woo-orders-tracking-shortcode-timeline-icon-transit').html(`<i class="${transit_icons[newval]}"></i>`)
            }
        });
    });
    wp.customize('woo_orders_tracking_settings[custom_css]', function (value) {
        value.bind(function (newval) {
            $('#vi-wot-orders-tracking-customize-preview-custom-css').html(newval);
        });
    });

    wp.customize.preview.bind('active', function () {
        wp.customize.preview.bind('vi_wot_orders_tracking_design_template_one', function () {
            $('#vi-wot-orders-tracking-customize-preview-show-timeline').html('.woo-orders-tracking-shortcode-timeline-wrap{ display: block ; }');
            $('#vi-wot-orders-tracking-customize-preview-show-timeline-template').html('.woo-orders-tracking-preview-shortcode-template-two{\n' +
                '                display: none !important;\n' +
                '            }\n' +
                '            .woo-orders-tracking-preview-shortcode-template-one{\n' +
                '                display: block;\n' +
                '            }');

        });
        wp.customize.preview.bind('vi_wot_orders_tracking_design_general', function () {
            let template = wp.customize('woo_orders_tracking_settings[timeline_track_info_template]').get();
            switch (template) {
                case '1':
                    $('#vi-wot-orders-tracking-customize-preview-show-timeline-template').html('.woo-orders-tracking-preview-shortcode-template-two{\n' +
                        '                display: none !important;\n' +
                        '            }\n' +
                        '            .woo-orders-tracking-preview-shortcode-template-one{\n' +
                        '                display: block;\n' +
                        '            }');
                    break;
                case '2':
                    $('#vi-wot-orders-tracking-customize-preview-show-timeline-template').html('.woo-orders-tracking-preview-shortcode-template-two{\n' +
                        '                display: block;\n' +
                        '            }\n' +
                        '            .woo-orders-tracking-preview-shortcode-template-one{\n' +
                        '                display: none !important;\n' +
                        '            }');
                    break;
            }
        });
    });
});