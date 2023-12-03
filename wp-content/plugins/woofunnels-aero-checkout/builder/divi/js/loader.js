class CheckoutForm extends React.Component {
    static slug = 'wfacp_checkout_form';

    constructor() {
        super();
        this.timeout = null;
        this.state = {formData: 'Loading ....'}
    }

    static css(props) {
        const utils = window.ET_Builder.API.Utils;
        let wfacp_divi_style = [];
        wfacp_divi_style = wfacp_checkout_form_fields(utils, props);
        return [wfacp_divi_style];
    }

    componentDidMount() {

        this.run_ajax();
    }


    run_ajax() {
        let settings = JSON.stringify(this.props);
        let div_container = jQuery('.wfacp_form_divi_container');
        div_container.addClass('wfacp_divi_loader');
        window.wfacp_send_ajax({
            'action': 'get_divi_form_data',
            'type': 'post',
            'data': settings,
            'headers': {'Content-type': 'application/json'},
        }, (rsp) => {
            this.setState({formData: rsp});

            div_container.removeClass('wfacp_divi_loader');
            this.handle_body_class(this.props.wfacp_label_position);
        });

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (JSON.stringify(this.props) === JSON.stringify(prevProps)) {
            return;
        }
        clearTimeout(this.timeout);
        this.handle_body_class(this.props.wfacp_label_position);

        this.timeout = setTimeout(() => {
            this.run_ajax();
        }, 600);
    }

    render() {

        return React.createElement("div", {
            className: "wfacp_form_divi_container wfacp_divi_loader"
        }, React.createElement("div", {
            className: "wfacp_divi_forms",
            id: "wfacp-e-form",
            dangerouslySetInnerHTML: {
                __html: this.state.formData
            }
        }));
    }

    handle_body_class(position_label) {
        jQuery(document.body).removeClass('wfacp-inside');
        jQuery(document.body).removeClass('wfacp-top');
        jQuery(document.body).removeClass('wfacp-modern-label');
        jQuery(document.body).addClass(position_label);
        jQuery(document.body).trigger('wfacp_intl_setup');
    }
}

class CheckoutForm_Summary extends React.Component {
    static slug = 'wfacp_checkout_form_summary';

    constructor() {
        super();

        this.timeout = null;
        this.state = {formData: 'Loading ....'}
    }

    static css(props) {
        const utils = window.ET_Builder.API.Utils;
        let wfacp_divi_style = wfacp_checkout_form_summary_fields(utils, props);
        return [wfacp_divi_style];
    }

    componentDidMount() {
        this.run_ajax();
    }

    run_ajax() {

        let settings = JSON.stringify(this.props);
        let div_container = jQuery('.wfacp_checkout_form_summary');
        div_container.addClass('wfacp_divi_loader');
        window.wfacp_send_ajax({
            'action': 'get_divi_order_summary_data',
            'type': 'post',
            'data': settings,
            'headers': {'Content-type': 'application/json'},
        }, (rsp) => {
            this.setState({formData: rsp});
            div_container.removeClass('wfacp_divi_loader');
        });

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (JSON.stringify(this.props) === JSON.stringify(prevProps)) {
            return;
        }


        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.run_ajax();
        }, 600);
    }

    render() {
        return React.createElement("div", {
            className: "wfacp_checkout_form_summary wfacp_divi_loader"
        }, React.createElement("div", {
            className: "wfacp_divi_forms",
            id: "wfacp-mini-cart",
            dangerouslySetInnerHTML: {
                __html: this.state.formData
            }
        }));
    }
}

(function ($) {

    window.wfacp_prepare_divi_css = function (data, utils, props) {
        var main_output = [];
        for (let m in data.margin_padding) {
            (function (key, selector) {
                var spacing = props[key];
                if (spacing != null && spacing !== '' && spacing.split("|")) {
                    var element_here = key.indexOf("_padding");
                    var ele = "padding";
                    if (element_here === -1) {
                        ele = "margin";
                    }
                    spacing = props[key].split("|");
                    var enable_edited = props[key + "_last_edited"];
                    var key_tablet = props[key + "_tablet"];
                    var key_phone = props[key + "_phone"];
                    var enable_responsive_active = enable_edited && enable_edited.startsWith("on");
                    main_output.push({
                        'selector': selector,
                        'declaration': ele + `-top: ${spacing[0]}  !important; ` + ele + `-right: ${spacing[1]} !important; ` + ele + `-bottom: ${spacing[2]}  !important; ` + ele + `-left: ${spacing[3]}  !important;`
                    });

                    if (key_tablet && enable_responsive_active && key_tablet && '' !== key_tablet) {
                        var spacing_tablet = key_tablet.split("|");
                        main_output.push({
                            'selector': selector,
                            'declaration': ele + `-top: ${spacing_tablet[0]} !important;` + ele + `-right: ${spacing_tablet[1]} !important; ` + ele + `-bottom: ${spacing_tablet[2]}  !important; ` + ele + `-left: ${spacing_tablet[3]}  !important;`,
                            'device': 'tablet',
                        });
                    }

                    if (key_phone && enable_responsive_active && key_phone && '' !== key_phone) {
                        var spacing_phone = key_phone.split("|");
                        main_output.push({
                            'selector': selector,
                            'declaration': ele + `-top: ${spacing_phone[0]} !important; ` + ele + `-right: ${spacing_phone[1]} !important; ` + ele + `-bottom: ${spacing_phone[2]} !important; ` + ele + `-left: ${spacing_phone[3]} !important;`,
                            'device': 'phone',
                        });
                    }
                }
            })(m, data.margin_padding[m]);
        }
        for (let n in data.normal_data) {
            (function (key, selector, css_prop) {
                main_output.push({
                    'selector': selector,
                    'declaration': `${css_prop}:${props[key]}` + '!important'
                });
                var device_enable = props[key + "_last_edited"] && props[key + "_last_edited"].startsWith('on');
                if (device_enable === true) {
                    main_output.push({
                        'selector': selector,
                        'declaration': `${css_prop}:${props[key + "_tablet"]}` + '!important',
                        'device': 'tablet',
                    });
                    main_output.push({
                        'selector': selector,
                        'declaration': `${css_prop}:${props[key + "_phone"]}` + '!important',
                        'device': 'phone',
                    });

                }
            })(n, data.normal_data[n]['selector'], data.normal_data[n]['property']);
        }
        for (let t in data.typography_data) {
            (function (key, selector) {
                var property = data.typography[key];
                main_output.push({'selector': selector, 'declaration': utils.setElementFont(props[property])});
            })(t, data.typography_data[t]);
        }
        for (let border_key in data.border_data) {
            let selector = data.border_data[border_key];
            (function (border_key, selector) {
                var border_type = props[border_key + '_border_type'];
                var width_top = props[border_key + '_border_width_top'];
                var width_bottom = props[border_key + '_border_width_bottom'];
                var width_left = props[border_key + '_border_width_left'];
                var width_right = props[border_key + '_border_width_right'];
                var border_color = props[border_key + '_border_color'];
                var radius_top_left = props[border_key + '_border_radius_top'];
                var radius_top_right = props[border_key + '_border_radius_bottom'];
                var radius_bottom_right = props[border_key + '_border_radius_left'];
                var radius_bottom_left = props[border_key + '_border_radius_right'];
                if ('none' === border_type) {
                    main_output.push({'selector': selector, 'declaration': 'border-style:none !important;'});
                    main_output.push({'selector': selector, 'declaration': 'border-radius:none !important;'});
                } else {
                    main_output.push({'selector': selector, 'declaration': `border-color:${border_color} !important;`});
                    main_output.push({'selector': selector, 'declaration': `border-style:${border_type} !important;`});
                    main_output.push({'selector': selector, 'declaration': `border-top-width:${width_top}px !important;`});
                    main_output.push({'selector': selector, 'declaration': `border-bottom-width:${width_bottom}px !important;`});
                    main_output.push({'selector': selector, 'declaration': `border-left-width:${width_left}px !important;`});
                    main_output.push({'selector': selector, 'declaration': `border-right-width:${width_right}px !important;`});
                    main_output.push({'selector': selector, 'declaration': `border-top-left-radius:${radius_top_left}px !important;`});
                    main_output.push({'selector': selector, 'declaration': `border-top-right-radius:${radius_top_right}px !important;`});
                    main_output.push({'selector': selector, 'declaration': `border-bottom-right-radius:${radius_bottom_right}px !important;`});
                    main_output.push({'selector': selector, 'declaration': `border-bottom-left-radius:${radius_bottom_left}px !important;`});
                }
            })(border_key, selector);
        }
        for (let shadow_key in data.box_shadow) {
            let selector = data.box_shadow[shadow_key];
            (function (border_key, selector) {
                var enabled = props[border_key + '_shadow_enable'];
                var type = props[border_key + '_shadow_type'];
                var horizontal = props[border_key + '_shadow_horizontal'];
                var vertical = props[border_key + '_shadow_vertical'];
                var blur = props[border_key + '_shadow_blur'];
                var spread = props[border_key + '_shadow_spread'];
                var color = props[border_key + '_shadow_color'];
                if ('on' == enabled) {
                    main_output.push({'selector': selector, 'declaration': `box-shadow:${horizontal}px ${vertical}px ${blur}px ${spread}px ${color} ${type} !important;`});
                } else {
                    main_output.push({'selector': selector, 'declaration': 'box-shadow:none !important;'});
                }
            })(shadow_key, selector);
        }
        return main_output;
    }
    var aero_id = $('#wfacp_aero_checkout_id').attr('content');

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    setCookie('wfacp_elementor_open_page', '', -5);
    $(document.body).on('wfacp_step_switching', function (e, v) {
        if (v.hasOwnProperty('current_step')) {
            var str = aero_id + '@' + v.current_step;
            setCookie('wfacp_divi_open_page', str, 1);
        }
    });
    $(document.body).on('click', '.et-fb-form__toggle', function () {
        let el = $(this);
        setTimeout((el) => {
            let siblings = el.children('.et-fb-form__group');
            if (siblings.length === 0) {
                return;
            }
            let border_top = el.find('.wfacp_border_width_top');
            border_top.each(function () {
                $(this).closest('.et-fb-form__group').addClass('wfacp_divi_border wfacp_divi_border_width_start wfacp_border_width_top');
            });
            let border_bottom = el.find('.wfacp_border_width_bottom');
            border_bottom.each(function () {
                $(this).closest('.et-fb-form__group').addClass('wfacp_divi_border  wfacp_border_width_bottom');
            });
            let border_left = el.find('.wfacp_border_width_left');
            border_left.each(function () {
                $(this).closest('.et-fb-form__group').addClass('wfacp_divi_border  wfacp_border_width_left');
            });
            let border_right = el.find('.wfacp_border_width_right');
            border_right.each(function () {
                $(this).closest('.et-fb-form__group').addClass('wfacp_divi_border wfacp_divi_border_width_end  wfacp_border_width_right');
            });
            siblings.each(function () {
                let heading = $(this).closest('.wfacp_heading_divi_builder');
                if (heading.length > 0) {
                    heading.remove();
                    let text = $(this).find('.et-fb-form__label-text');
                    if (text.length > 0) {
                        $(this).closest('.et-fb-form__label').replaceWith("<h3 class='wfacp_c_heading'>" + text.text() + "</h3>");
                    }
                }
            });
        }, 50, el);

    });
    $(document.body).on('keypress', '.wfacp_divi_textarea', function (e) {        // IE
        var keynum
        if (window.event) {
            keynum = e.keyCode;
        } else if (e.which) {
            keynum = e.which;
        }
        if (keynum === 13) {
            return false;
        }
    });
    $(document.body).on('keypress', '.wfacp_divi_border textarea', function (e) {        // IE
        var keynum
        if (window.event) {
            keynum = e.keyCode;
        } else if (e.which) {
            keynum = e.which;
        }
        if (keynum === 13) {
            return false;
        }
    });
    $(window).on('et_builder_api_ready', (event, API) => {
        API.registerModules([CheckoutForm, CheckoutForm_Summary]);
    });
})(jQuery);