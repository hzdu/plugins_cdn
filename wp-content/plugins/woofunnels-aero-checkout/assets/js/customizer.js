(function ($) {
        "use strict";


        var wfacpCust = {
            productTagDecode: function ($val) {
                /** all products merge tag */
                if (typeof wfacp_customizer !== 'undefined' && typeof wfacp_customizer.pd !== 'undefined') {
                    $.each(wfacp_customizer.pd, function (k, v) {
                        if (k.substring(0, 1) != '_' && $val.indexOf(v) >= 0) {
                            let keyVal = wfacp_customizer.pd['_' + k];
                            var reg = new RegExp(v, 'g');
                            $val = $val.replace(reg, keyVal);
                        }
                    });
                }
                return $val;
            },
            modify_progress_percent_val: function ($val, $prefix, $suffix) {
                if ($('.wfacp-progress-scale').length > 0) {
                    $('.wfacp-progress-scale').find('span').html($val + '%');
                }
                return $val;
            },
            modify_progress_bar_text: function ($val, $prefix, $suffix) {
                if ($val.indexOf("{{percentage}}") >= 0) {
                    let percentageVal = wp.customize.value('wfacp_c_' + wfacp_customizer.offer_id + '[wfacp_header_progress_bar_percent_val]')();
                    percentageVal = (typeof percentageVal !== 'undefined') ? percentageVal : '';
                    $val = $val.replace('{{percentage}}', '<span>' + percentageVal + '%</span>');
                }
                return $val;
            },
            wfacpSetPseudo: function (elem, pseudo, prop, value) {
                let s = $("style[data-type='wfacp']");


                let css = "\n" + elem
                    .concat(pseudo)
                    .concat("{")
                    .concat(prop + ":")
                    .concat(value + ";}");
                s.append(css);
            },
            wfacpSetFontSize: function (elem, prop, value) {
                let s = $("style[data-type='wfacp']");
                let element = "\n" + elem;

                if (Object.keys(value).length > 0) {
                    for (let i in value) {
                        let css = "";
                        let vl = value[i];
                        if (i === 'mobile') {
                            vl += value['mobile-unit'];
                            css += ("@media (max-width: 680px) {");
                            css += element + "{";
                            css += prop + ":";
                            css += vl + ";}";
                            css += "}";
                            s.append(css);
                        } else if (i === 'tablet') {
                            vl += value['tablet-unit'];
                            css += "@media (max-width: 991px) {";
                            css += element + "{";
                            css += prop + ":";
                            css += vl + ";}";
                            css += "}";
                            s.append(css);
                        } else if (i === 'desktop') {
                            vl += value['desktop-unit'];
                            css += element + "{";
                            css += prop + ":";
                            css += vl + ";}";
                            s.append(css);
                        }
                    }
                }
            }
        };

        function blank_value_check(clasName) {

            $('.wfacp-customer-support-profile-wrap').removeClass("wfacp_display_none");

            var img_src = $(".wfacp_sign_support").attr("src");
            if (typeof img_src == 'undefined') {
                img_src = '';
            }
            if ($('.wfacp-customer-support-title').text() == '' && $('.wfacp-customer-support-desc').text() == '' && img_src == '') {
                $('.wfacp-customer-support-profile-wrap').addClass("wfacp_display_none");
            }
            $(".wfacp-support-details-wrap li").each(function () {
                var $current_li = $(this);
                if ($current_li.children().length == $current_li.children(".wfacp_display_none").length) {
                    $current_li.addClass("wfacp_display_none");
                } else if ($current_li.find(".wfacp-contact-head").text() != '' || $current_li.find(".wfacp_contact_support_wrap").text() != '') {
                    $current_li.removeClass("wfacp_display_none");
                }
            });

        }

        function wfacp_show_form_popup(title) {

        }

        function wfacp_apply_changes(arVal, newval, obj) {
            let cssPropPX = ["max-width", "height", "max-height", "font-size", "border-width", "min-width", "padding-top", "padding-bottom", "padding-left", "padding-right", "border-radius"];
            let type = arVal.type;
            let cssProp = (typeof arVal.prop !== 'undefined') ? arVal.prop : '';
            let prefix = (typeof arVal.prefix !== 'undefined') ? arVal.prefix : '';
            let suffix = (typeof arVal.suffix !== 'undefined') ? arVal.suffix : '';
            console.log(arVal);
            let callback = (typeof arVal.callback !== 'undefined') ? arVal.callback : '';
            if (callback !== '') {
                if (typeof (wfacpCust[callback]) === "function") {
                    newval = wfacpCust[callback](newval, prefix, suffix);
                }
            }
            if (type === 'css') {
                if (Object.keys(cssProp).length > 0) {
                    let pseudo = (typeof arVal.pseudo !== 'undefined') ? arVal.pseudo : false;
                    let is_reponsive = (typeof arVal.responsive !== 'undefined') ? arVal.responsive : false;
                    let cssdata = {};
                    let hover = false;
                    let internal = false;

                    for (let cssPropS in cssProp) {
                        if (cssPropPX.indexOf(cssProp[cssPropS]) >= 0) {
                            suffix = 'px';
                        }

                        hover = (typeof arVal.hover !== 'undefined' && arVal.hover === true) ? arVal.hover : false;
                        internal = (typeof arVal.internal !== 'undefined' && arVal.internal === true) ? arVal.internal : false;

                        if (is_reponsive) {
                            wfacpCust.wfacpSetFontSize(arVal.elem, cssProp[cssPropS], newval);
                            return;
                        }
                        if (pseudo === false) {
                            if (hover === true) {
                                wfacpCust.wfacpSetPseudo(arVal.elem, ":hover", cssProp[cssPropS], prefix + newval + suffix);
                            } else if (internal === true) {
                                wfacpCust.wfacpSetPseudo(arVal.elem, "", cssProp[cssPropS], prefix + newval + suffix);
                            } else {
                                cssdata[cssProp[cssPropS]] = prefix + newval + suffix;
                            }
                        } else {
                            /** pseudo true */
                            wfacpCust.wfacpSetPseudo(arVal.elem, ":" + pseudo, cssProp[cssPropS], prefix + newval + suffix);
                        }

                    }
                    //  console.log(cssdata);
                    if (pseudo === false) {

                        obj.css(cssdata);
                    }
                }
            } else if (type === 'html') {
                let output = prefix + newval + suffix;

                output = wfacpCust.productTagDecode(output);
                output = output.replace(/(?:\r\n|\r|\n)/g, '<br />');
                // obj
                $(arVal.elem).html(output);

            } else if (type === 'class') {

                let cssRemove = (typeof arVal.remove !== 'undefined') ? arVal.remove : '';
                if (Object.keys(cssRemove).length > 0) {
                    obj.removeClass(cssRemove.join(" "));
                    obj.addClass(newval);
                }
            } else if (type === 'add_class') {

                if (typeof arVal.direct !== 'undefined') {
                    let parent = $(arVal.elem);
                    console.log(arVal.elem);

                    let cssRemove = (typeof arVal.remove !== 'undefined') ? arVal.remove : '';
                    if (Object.keys(cssRemove).length > 0) {
                        parent.removeClass(cssRemove.join(" "));
                    }
                    parent.addClass(newval);

                } else {
                    let id = obj.attr("id");
                    let parent = $(arVal.elem + "_field");


                    if (arVal.elem == '#wc_eu_vat_compliance_vat_number') {
                        parent = $("#vat_number_field");
                    }

                    let cssRemove = (typeof arVal.remove !== 'undefined') ? arVal.remove : '';
                    if (Object.keys(cssRemove).length > 0) {
                        parent.removeClass(cssRemove.join(" "));
                    }
                    parent.addClass(newval);
                }
            } else if (type === 'add_remove_class') {

                let classAdd = "wfacp_display_none";
                let parent = $(arVal.elem);

                parent.removeClass(classAdd);

                if (newval != '') {
                    classAdd = "";
                }
                parent.addClass(classAdd);


            }

        }


        if (Object.keys(wfacp_customizer.fields).length > 0) {
            let fields = wfacp_customizer.fields;
            for (let field_key in fields) {
                /* multiple arrays */
                if (Object.keys(fields[field_key]).length == 0) {
                    continue;
                }
                for (let field in fields[field_key]) {
                    wp.customize(field_key, function (value) {
                        let arVal = fields[field_key][field];
                        let obj = $(arVal.elem);
                        if (obj.length = 0)
                            return;
                        value.bind(function (newval) {
                            wfacp_apply_changes(arVal, newval, obj)

                            blank_value_check(arVal.elem);


                            // setTimeout(wfacp_apply_changes, 300, arVal, newval, obj);
                        });
                    });
                }
            }
        }
    }
)
(jQuery);
