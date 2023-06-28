/**
 * easyModal.js v1.3.2
 * A minimal jQuery modal that works with your CSS.
 * Author: Flavius Matis - http://flaviusmatis.github.com/
 * URL: https://github.com/flaviusmatis/easyModal.js
 *
 * Copyright 2012, Flavius Matis
 * Released under the MIT license.
 * http://flaviusmatis.github.com/license.html
 */

/* jslint browser: true */
/* global jQuery */

jQuery( function($) {
    'use strict';
    var chatyError;
    var forceSubmit = false;
    var whatsappStatus = false;
    var phoneStatus = false;
    var fbStatus = false;
    var smsStatus = false;
    var viberStatus = false;
    var phoneNumberStatus = false;
    function checkForDevices() {
        $(".chaty-popup").hide();
        if($("#cht-form .js-chanel-desktop").length == 0 || $("#cht-form .js-chanel-mobile").length == 0) {
            $("#no-device-popup").show();
            return false;
        } else if($("#cht-form .js-chanel-desktop:checked").length == 0 && $("#cht-form .js-chanel-mobile:checked").length == 0) {
            $("#device-popup").show();
            return false;
        } else {
            $("#channels-selected-list > li .cht-input-error").removeClass("cht-input-error");
            if(!$("#channels-selected-list > li.has-agent-view").length) {
                var inputError = 0;
                $("#channels-selected-list > li:not(.has-agent-view):not(#chaty-social-close)").find(".channels__input").each(function () {
                    if (jQuery.trim($(this).val()) == "") {
                        inputError++;
                        $(this).addClass("cht-input-error");
                    }
                });
                if (inputError == $("#channels-selected-list > li:not(.has-agent-view):not(#chaty-social-close)").find(".channels__input").length) {
                    if (!$("#chaty-social-Contact_Us").length) {
                        $("#no-device-value").show();
                        return false;
                    }
                }
            } else {
                var inputError = 0;
                $("#channels-selected-list > li:not(.has-agent-view):not(#chaty-social-close)").find(".channels__input").each(function () {
                    if (jQuery.trim($(this).val()) == "") {
                        inputError++;
                        $(this).addClass("cht-input-error");
                    }
                });
                $("#channels-selected-list > li.has-agent-view").find(".agent-input-value").each(function () {
                    if (jQuery.trim($(this).val()) == "") {
                        inputError++;
                        $(this).addClass("cht-input-error");
                    }
                });
                if (inputError == parseInt($("#channels-selected-list > li:not(.has-agent-view):not(#chaty-social-close)").find(".channels__input").length) + parseInt($("#channels-selected-list > li.has-agent-view").find(".agent-input-value").length)) {
                    if (!$("#chaty-social-Contact_Us").length) {
                        $("#no-device-value").show();
                        return false;
                    }
                }

                var isAgentEmpty = 0;
                $("#channels-selected-list > li.has-agent-view .chaty-agent-list .chaty-agent-name").each(function(){
                    if($.trim($(this).val()) == "") {
                        isAgentEmpty++;
                        $(this).addClass("cht-input-error");
                    }
                });
                if(isAgentEmpty) {
                    $("#agent-value-popup").show();
                    return false;
                }
            }
        }
        return checkForTriggers();
    }

    function checkForTriggers() {
        $(".chaty-popup").hide();
        if(!$("#trigger_on_time").is(":checked") && !$("#chaty_trigger_on_exit").is(":checked") && !$("#chaty_trigger_on_scroll").is(":checked")) {
            $("#trigger-popup").show();
            return false;
        }
        return checkForStatus();
    }

    function checkForStatus() {
        $(".chaty-popup").hide();
        if(!$(".cht_active").is(":checked")) {
            $("#status-popup").show();
            return false;
        }
        forceSubmit = true;
        $("#cht-form").trigger("submit");
        return true;
    }

    function checkPreSettings() {
        if(!whatsappStatus) {
            whatsappStatus = true;
            var phoneNumberReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if ($("#cht-form #Whatsapp").length && $("#cht-form #Whatsapp").val() != "") {
                var InputVal = jQuery.trim($("#cht-form #Whatsapp").val());
                chatyError = check_for_number_chaty(InputVal, "Whatsapp");
                if(chatyError) {
                    $("#custom-message-popup .chaty-popup-header").text("Whatsapp number is not valid");
                    $("#custom-message-popup .chaty-popup-body").text("Seems like the WhatsApp number you're trying to enter isn't in the right syntax. Would you like to publish it anyway?");
                    $("#custom-message-popup").show();
                    return false;
                }
            }
        } else if(!phoneStatus) {
            phoneStatus = true;
            if ($("#cht-form #Phone").length && $("#cht-form #Phone").val() != "") {
                var InputVal = jQuery.trim($("#cht-form #Phone").val());
                chatyError = check_for_number_chaty(InputVal, "Phone");
                if(chatyError) {
                    $("#custom-message-popup .chaty-popup-header").text("Phone number is not valid");
                    $("#custom-message-popup .chaty-popup-body").text("Seems like the phone number you're trying to enter isn't in the right syntax. Would you like to publish it anyway?");
                    $("#custom-message-popup").show();
                    return false;
                }
            }
        } else if(!fbStatus) {
            fbStatus = true;
            if ($("#cht-form #Facebook_Messenger").length && $("#cht-form #Facebook_Messenger").val() != "") {
                var faceBookMeReg = /(?:http:\/\/)?m\.me\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/;
                var faceBookReg = /(?:http:\/\/)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/;
                var InputVal = jQuery.trim($("#Facebook_Messenger").val());
                $("#cht-form #Facebook_Messenger").val(InputVal);
                if (!faceBookReg.test(InputVal) && !faceBookMeReg.test(InputVal)) {
                    $("#custom-message-popup .chaty-popup-header").text("Facebook page's URL is not valid");
                    $("#custom-message-popup .chaty-popup-body").text("Please make sure your Facebook page's URL looks like, <br/>https://m.me/YOURPAGE");
                    $("#custom-message-popup").show();
                    return false;
                }
            }
        } else if(!smsStatus) {
            smsStatus = true;
            if ($("#cht-form #SMS").length && $("#cht-form #SMS").val() != "") {
                var InputVal = jQuery.trim($("#cht-form #SMS").val());
                chatyError = check_for_number_chaty(InputVal, "SMS");
                if(chatyError) {
                    $("#custom-message-popup .chaty-popup-header").text("SMS number is not valid");
                    $("#custom-message-popup .chaty-popup-body").text("Seems like the SMS number you're trying to enter isn't in the right syntax. Would you like to publish it anyway?");
                    $("#custom-message-popup").show();
                    return false;
                }
            }
        } else if(!viberStatus) {
            viberStatus = true;
            if ($("#cht-form #Viber").length && $("#cht-form #Viber").val() != "") {
                var InputVal = jQuery.trim($("#cht-form #Viber").val());
                chatyError = check_for_number_chaty(InputVal, "Viber");
                if(chatyError) {
                    $("#custom-message-popup .chaty-popup-header").text("Viber number is not valid");
                    $("#custom-message-popup .chaty-popup-body").text("Seems like the Viber number you're trying to enter isn't in the right syntax. Would you like to publish it anyway?");
                    $("#custom-message-popup").show();
                    return false;
                }
            }
        } else if(!phoneNumberStatus) {
            phoneNumberStatus = true;
            if($("#channels-selected-list .phone-number").length) {
                $("#channels-selected-list .phone-number").each(function(){
                    if(jQuery.trim($(this).val()) != '') {
                        var inputLen = (jQuery.trim($(this).val())).length;
                        if(inputLen > 13) {
                            $("#custom-message-popup .chaty-popup-header").text($(this).data("label")+" number is not valid");
                            $("#custom-message-popup .chaty-popup-body").text("Seems like the "+$(this).data("label")+" number you're trying to enter isn't valid. Would you like to publish it anyway?");
                            $("#custom-message-popup").show();
                            return false;
                        }
                    }
                });
            }
        }
        return checkForDevices();
    }

    $(window).on("load", function(){
        setTimeout(() => {
            $(".wp-editor-container iframe")
                .contents().find('body')
                .css({
                    backgroundColor: '#fff',
                    margin: 0,
                    padding: '0px 10px'
                });
        }, 500)
    });

    $(document).ready(function () {

        $(document).on("click", ".select-cta-fa-icon", function(e){
            //e.preventDefault();
            $("#chat-image-icon").removeClass("active");
            $("#chat-fa-icon").addClass("active");
            $(".widget-img-tooltip").removeClass("active");
            $(".widget-fa-icon-tooltip").addClass("active");
            $("input[name='widget_icon'][value='chat-fa-icon']").prop("checked", true);
        });

        var newIconLib1 = {
            "material":{
                "regular":{
                    "list-icon":"",
                    "icon-style":"mt-regular",
                    "icons":["some","some2"],
                }
            }
        }

        if($("#chat-fa-icon .icon-chat").length) {
            AestheticIconPicker({
                'selector': '#icon-select-chat', // must be an ID
                'onClick': '#select-cta-fa-icon',  // must be an ID
                "iconLibrary": newIconLib1
            });
        }

        $(document).on("click", ".select-cta-image", function(e){
            e.preventDefault();
            $("#chat-image-icon").addClass("active");
            $(".widget-img-tooltip").addClass("active");
            $("#chat-fa-icon").removeClass("active");
            $(".widget-fa-icon-tooltip").removeClass("active");
            $("input[name='widget_icon'][value='chat-image']").prop("checked", true);
            var image = wp.media({
                title: 'Select image for channel',
                multiple: false,
                library: {
                    type: 'image'
                }
            }).open()
                .on('select', function (e) {
                    var imageData = image.state().get('selection').first();
                    imageData = imageData.toJSON();
                    $('#widget_custom_img').val(imageData.id);
                    $("#chat-image-icon .svg-chat-icon svg").remove();
                    $("#chat-image-icon .svg-chat-icon img").remove();
                    $('#chat-image-icon .svg-chat-icon').append("<img src='"+imageData.url+"' alt='widget-custom-img' />");
                    $('#chat-image-icon .svg-chat-icon .custom-img').append("<img src='"+imageData.url+"' alt='widget-custom-img' />");
                    $('#chat-image-icon').addClass("has-image");
                    $(".csaas-widget .csaas-svg img").attr("src",imageData.url);

                });
        });

        // if($("#chat-fa-icon .icon-chat").length) {
        //     $(document).on("click", "#chat-fa-icon", function(){
        //         var newIconLib = {
        //             "material":{
        //                 "regular":{
        //                     "list-icon":"",
        //                     "icon-style":"mt-regular",
        //                     "icons":["some","some2"],
        //                 }
        //             }
        //         }
        //
        //         AestheticIconPicker({
        //             'selector': '#icon-select-chat', // must be an ID
        //             'onClick': '#chat-fa-icon',  // must be an ID
        //             "iconLibrary": newIconLib
        //         });
        //     });
        // }

        $(document).on("click", ".more-btn", function(){
            if($(".cc-bcc-field").hasClass("active")) {
                $(this).text("CC/BCC");
                $(this).append("<i class='fas fa-arrow-down up-down-arrow'></i>");
                $(".cc-bcc-field").removeClass("active");

            } else {
                $(this).text("CC/BCC");
                $(this).append("<i class='fas fa-arrow-up up-down-arrow'></i>");
                $(".cc-bcc-field").addClass("active");

            }

        });

        $(document).on("click", ".recaptcha-type", function (){
            $(".recaptcha-input").removeClass("v2-key v3-key");
            if($(this).val() == "v2") {
                $(".recaptcha-input").addClass("v2-key");
            } else {
                $(".recaptcha-input").addClass("v3-key");
            }
        });


        $(document).on("change", "input[name='cta_type']:checked", function(){
            if($(this).val() == "simple-view") {
                $("#simple-view").removeClass("hide-it");
                $("#chat-view").addClass("hide-it");
                $(".chaty-chat-view-option").removeClass("hide-option");
                $("#cta-header-color-setting").addClass("hide-it");
            } else {
                $("#simple-view").addClass("hide-it");
                $("#chat-view").removeClass("hide-it");
                $(".chaty-chat-view-option").addClass("hide-option");
                $("#cta-header-color-setting").removeClass("hide-it");
            }

            change_custom_preview();
        });

        $(document).on("click", ".add-properties", function(e){
            e.preventDefault();
            $(this).closest(".properties-box").toggleClass("active");
        });

        $(document).on("click", ".properties-list a", function(e){
            e.preventDefault();
            var inputText = $.trim($(this).data("txt"));
            if($(this).closest(".form-horizontal__item").hasClass("has-iframe")) {
                var iframeData = $(this).closest(".form-horizontal__item").find("iframe");
                if(iframeData.contents().find('p').length) {
                    iframeData.contents().find('p:last-child').append(" "+inputText);
                } else {
                    iframeData.contents().find('.mce-content-body').append(" "+inputText);
                }
            } else {
                inputText = $.trim($.trim($(this).closest(".form-horizontal__item").find(".add-properties").val()) + " "+ inputText);
                $(this).closest(".form-horizontal__item").find(".add-properties").val(inputText);
            }

            change_custom_preview();
        });

        $(".form-fonts").SumoSelect({
            placeholder: 'Select font family',
            csvDispCount: 3
        });

        $("#chaty_attention_effect, #chaty_default_state").SumoSelect({
            placeholder: 'Select font family',
            csvDispCount: 3
        });

        $(document).on("click", "#cta_woocommerce_status", function(){
            if($(this).is(":checked")) {
                $(".woocommerce-settings").addClass("active");
            } else {
                $(".woocommerce-settings").removeClass("active");
            }
        });

        // call when any channel is removed or updated
        const channel_list4 = [];
        jQuery('.channels-icons > .icon.active').each( (i, item) => {
            channel_list4.push( item.dataset.social );
        } )
        wp.hooks.doAction('chaty.channel_update', {
            channel     : channel_list4,         // active channel list
            target      : null,               // channel that removed last
            action      : 'added',            // added || removed,
            isExceeded  : false,
        }); 

        var whatsAppInput = [];

        $(document).on("click", ".chaty-switch-toggle", function(){
            setTimeout(function(){
                $(".chaty-field-setting").each(function(){
                    if($(this).is(":checked")) {
                        $(this).closest(".field-setting-col").find(".field-settings").addClass("active");
                    } else {
                        $(this).closest(".field-setting-col").find(".field-settings").removeClass("active");
                    }
                });
            },100);
        });

        $(document).on("change", ".chaty-close_form_after-setting", function(){
            setTimeout(function(){
                $(".chaty-close_form_after-setting").each(function(){
                    if($(this).is(":checked")) {
                        $(this).closest(".form-field-setting-col").find(".close_form_after-settings").addClass("active");
                    } else {
                        $(this).closest(".form-field-setting-col").find(".close_form_after-settings").removeClass("active");
                    }
                });
            },100);
        });

        $(document).on("change", "#save_leads_locally_Contact_Us", function(){
            if(!$(this).is(":checked")) {
                $("#custom-leads-popup").show();
            }
        });

        $(document).on("click", ".aim-insert-icon-button", function(e){
            e.preventDefault();
        });

        var newIconLib = {
            "material":{
                "regular":{
                    "list-icon":"",
                    "icon-style":"mt-regular",
                    "icons":["some","some2"],
                }
            }
        }

        if($(".icon-picker-wrap").length) {
            $(".icon-picker-wrap").each(function(){
                var dataSlug = $(this).data("slug");
                AestheticIconPicker({
                    'selector': '#icon-picker-'+dataSlug, // must be an ID
                    'onClick': '#select-icon-'+dataSlug,  // must be an ID
                    "iconLibrary": newIconLib
                });
            });
        }

        if($("#channel_input_Whatsapp").length) {
            cht_settings.channel_settings['Whatsapp'] = document.querySelector("#channel_input_Whatsapp");
            window.intlTelInput(cht_settings.channel_settings['Whatsapp'], {
                dropdownContainer: document.body,
                formatOnDisplay: true,
                hiddenInput: "full_number",
                initialCountry: "auto",
                nationalMode: false,
                utilsScript: cht_settings.plugin_url+"admin/assets/js/utils.js",
            });
        }

        if($(".custom-channel-Whatsapp:not(#channel_input_Whatsapp)").length) {
            $(".custom-channel-Whatsapp:not(#channel_input_Whatsapp)").each(function(){
                var dataSlag = $(this).closest("li.chaty-channel").data("id");
                if(dataSlag != undefined) {
                    if($("#channel_input_"+dataSlag).length) {
                        cht_settings.channel_settings[dataSlag] = document.querySelector("#channel_input_"+dataSlag);
                        window.intlTelInput(cht_settings.channel_settings[dataSlag], {
                            dropdownContainer: document.body,
                            formatOnDisplay: true,
                            hiddenInput: "full_number",
                            initialCountry: "auto",
                            nationalMode: false,
                            utilsScript: cht_settings.plugin_url + "admin/assets/js/utils.js",
                        });
                    }
                }
            });
        }

        $(document).on("change", ".chaty-redirect-setting", function(){
            setTimeout(function(){
                $(".chaty-redirect-setting").each(function(){
                    if($(this).is(":checked")) {
                        $(this).closest(".form-field-setting-col").find(".redirect_action-settings").addClass("active");
                    } else {
                        $(this).closest(".form-field-setting-col").find(".redirect_action-settings").removeClass("active");
                    }
                });
            },100);
        });

        $(document).on("click", ".email-setting", function(){
            setTimeout(function(){
                $(".email-setting-field").each(function(){
                    if($(this).is(":checked")) {
                        $(this).closest(".form-field-setting-col").find(".email-settings").addClass("active");
                    } else {
                        $(this).closest(".form-field-setting-col").find(".email-settings").removeClass("active");
                    }
                });
            },100);
        });

        $(document).on("click", ".captcha-setting-field", function(){
            if($(this).is(":checked")) {
                $(this).closest(".form-field-setting-col").find(".captcha-settings").addClass("active");
            } else {
                $(this).closest(".form-field-setting-col").find(".captcha-settings").removeClass("active");
            }
        });

        setTimeout(() => {
            $(".whatsapp-welcome-message iframe")
            .contents().find('body')
            .css({
                backgroundColor: '#fff',
                margin: 0,
                padding: '8px 10px'
            });
        }, 100)

        $(document).on("click", ".chaty-embedded-window", function(){
            setTimeout(function(){
                $(".embedded_window-checkbox").each(function(){
                    if($(this).is(":checked")) {
                        $(this).closest("li.chaty-channel").find(".whatsapp-welcome-message").addClass("active");
                        // make the welcome message input box background white
                        // issues: It used to take the default background color of the theme like twenty twenty one
                        const 
                            iframe = $(this).closest("li.chaty-channel").find(".whatsapp-welcome-message iframe");
                            iframe.contents().find('body').css({
                                backgroundColor: '#fff',
                                margin: 0,
                                padding: '8px 10px'
                            });
                            iframe.contents().find('head').append("<style>p {margin:0; padding:0}</style>");
                    } else {
                        $(this).closest("li.chaty-channel").find(".whatsapp-welcome-message").removeClass("active");
                    }
                });
            },300);
        });

        $(document).on("change", "#cht-form input", function(){
            whatsappStatus = false;
            phoneStatus = false;
            fbStatus = false;
            smsStatus = false;
            viberStatus = false;
            phoneNumberStatus = false;
        });

        $(document).on("click", ".remove-js-script", function(e){
            e.preventDefault();
            $(this).closest(".channels__input-box").find("input").val("");
            $(this).closest(".channels__input-box").find("input").removeClass("cht-input-error").removeClass("cht-js-error");
            $(this).closest(".channels__input-box").find(".cht-error-message").remove();
            $(this).remove();
        });

        $("#cht-form").on("submit", function () {
            if(forceSubmit) {
                return true;
            }
            set_social_channel_order();
            $("#chaty-page-options .cht-required").removeClass("cht-input-error");
            $(".chaty-data-and-time-rules .cht-required").removeClass("cht-input-error");
            $(this).find(".cht-error-message").remove();
            $(this).find(".remove-js-script").remove();
            var errorCount = 0;
            if ($("#chaty-page-options .cht-required").length) {
                $("#chaty-page-options .cht-required").each(function () {
                    if (jQuery.trim($(this).val()) == "") {
                        $(this).addClass("cht-input-error");
                        errorCount++;
                    }
                });
            }
            if ($(".chaty-data-and-time-rules .cht-required").length) {
                $(".chaty-data-and-time-rules .cht-required").each(function () {
                    if (jQuery.trim($(this).val()) == "") {
                        $(this).addClass("cht-input-error");
                        errorCount++;
                    }
                });
            }
            if (!cht_nonce_ajax.has_js_access) {
                $("#channels-selected-list .channels__input").each(function(){
                    if($.trim($(this).val()) != "") {
                        if(($.trim($(this).val()).toLowerCase()).indexOf("javascript") != -1) {
                            $("body, html").scrollTop(0);
                            $("#chaty-social-channel").trigger("click");
                            $(this).addClass("cht-input-error cht-js-error");
                            $(this).after("<span class='cht-error-message'>"+cht_nonce_ajax.js_message+"</span><a href='#' class='remove-js-script'>"+cht_nonce_ajax.remove+"</a>")
                            errorCount++;
                        }
                    }
                });
            }
            if(errorCount == 0) {
                return checkPreSettings();
            } else {
                $(".cht-input-error:first").focus();
                return false;
            }
        });
        $(".close-chaty-popup-btn").on("click", function(e){
            e.stopPropagation();
            $(".chaty-popup").hide();
            if($(this).hasClass("keep-leads-in-db")) {
                $("#save_leads_locally_Contact_Us").prop("checked", true);
                $("#custom-leads-popup").hide();
            } else if($(this).hasClass("channel-setting-btn") || $(this).hasClass("channel-setting-step-btn")) {
                $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("completed");
                $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("active");
                $("#chaty-social-channel").addClass("active");
                $(".social-channel-tabs").removeClass("active");
                $("#chaty-tab-social-channel").addClass("active");
                $("body, html").animate({
                    scrollTop: $("#channel-list").offset().top - 125
                }, 250);
            } else if($(this).hasClass("select-trigger-btn")) {
                $("#chaty-triger-targeting").removeClass("completed");
                $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("active");
                $("#chaty-triger-targeting").addClass("active");
                $("#chaty-social-channel, #chaty-app-customize-widget").addClass("completed");
                $(".social-channel-tabs").removeClass("active");
                $("#chaty-tab-triger-targeting").addClass("active");
                $("body, html").animate({
                    scrollTop: $("#trigger-setting").offset().top - 50
                }, 250);
            } else if($(this).hasClass("next-step-btn")) {
                $(".chaty-popup").hide();
                $("#chaty-app-customize-widget, #chaty-triger-targeting").removeClass("completed");
                $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("active");
                $("#chaty-app-customize-widget").addClass("active");
                $("#chaty-social-channel").addClass("completed");
                $(".social-channel-tabs").removeClass("active");
                $("#chaty-tab-customize-widget").addClass("active");
            }
        });
        $(".chaty-popup-inner").on("click", function(e){
            e.stopPropagation();
        });
        $(".chaty-popup-outer").on("click", function(e){
            $(".chaty-popup").hide();
        });
        $(".check-for-numbers").on("click", function(){
            checkPreSettings();
        });
        $(".check-for-device").on("click", function(){
            checkForDevices();
        });
        $(".check-for-triggers").on("click", function(){
            checkForTriggers();
        });
        $(".fill-agent-value").on("click", function(){
            $("#channels-selected-list > li.has-agent-view .chaty-agent-list .chaty-agent-name").removeClass("empty-agent");
            $("#channels-selected-list > li.has-agent-view .chaty-agent-list .chaty-agent-name").each(function(){
                if($.trim($(this).val()) == "") {
                    $(this).addClass("empty-agent");
                }
            });
            $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("active");
            $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("completed");
            $("#chaty-social-channel").addClass("active");
            $(".social-channel-tabs").removeClass("active");
            $("#chaty-tab-social-channel").addClass("active");
            $("#channels-selected-list > li.has-agent-view .chaty-agent-list .chaty-agent-name.empty-agent:first").focus();
        });
        $(".check-for-status").on("click", function(){
            checkForStatus();
        });
        $(".change-status-and-save").on("click", function(){
            $(".cht_active").prop("checked", true);
            forceSubmit = true;
            $(".chaty-popup").hide();
            $("#cht-form").trigger("submit");
        });
        $(".status-and-save").on("click", function(){
            $(".cht_active").prop("checked", false);
            forceSubmit = true;
            $(".chaty-popup").hide();
            $("#cht-form").trigger("submit");
        });
        $(document).on("click", ".preview-section-chaty", function(e){
            e.stopPropagation();
        });

        // jQuery(".chaty-color-field.cht-color").trigger("change");

        $(document).on("change", ".cht-color", function(){
            setWidgetIconColor();
        });

        setWidgetIconColor();

    });
});

function setWidgetIconColor() {
    jQuery(".svg-chat-icon.upload-icons").css("background-color", jQuery(".cht-color").val());
    jQuery(".svg-chat-icon.upload-icons i").css("color", jQuery(".cht-icon-color").val());
}

function check_for_number_chaty(phoneNumber, validationFor) {
    if (phoneNumber != "") {
        if (phoneNumber[0] == "+") {
            phoneNumber = phoneNumber.substr(1, phoneNumber.length)
        }
        if (validationFor == "Phone") {
            if (phoneNumber[0] == "*") {
                phoneNumber = phoneNumber.substr(1, phoneNumber.length)
            }
        }
        if (isNaN(phoneNumber)) {
            return true;
        }
    }
    return false;
}

(function ($) {
    var closeAction = 0;

    jQuery(window).on('popstate', function(event) {
        window.onbeforeunload = null;
        if(window.history && window.history.pushState) {
            window.history.back();
        }
    });

    jQuery(document).ready(function () {
        if(!$(".chaty-table").length) {
            $('body input, body .icon, body textarea, body .btn-cancel:not(.close-btn-set) ').on("click", function (event) {
                window.onbeforeunload = function (e) {
                    e = e || window.event;
                    e.preventDefault = true;
                    e.cancelBubble = true;
                    e.returnValue = 'Your beautiful goodbye message';
                };
            });
        }

        if($(".country-list").length) {
            $(".country-list").SumoSelect({
                placeholder: "Select country",
                search: true,
                selectAll: true,
                clearAll: true
            });
        }

        $(document).on('submit', 'form', function (event) {
            window.onbeforeunload = null;
        });

        $(document).on('change', '.channel-select-input', function (event) {
            var selChannel = $(this).closest("li").attr("data-id");
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                dataType: 'json',
                data: {
                    social: $(this).val(),
                    channel: selChannel,
                    action: 'get_chaty_settings'
                },
                success: function (response) {
                    if(response.status == 1) {
                        if(response.data.slug == "Whatsapp") {
                            if($("#channel_input_"+response.channel).length) {
                                cht_settings.channel_settings[response.channel] = document.querySelector("#channel_input_"+response.channel);
                                window.intlTelInput(cht_settings.channel_settings[response.channel], {
                                    dropdownContainer: document.body,
                                    formatOnDisplay: true,
                                    hiddenInput: "full_number",
                                    initialCountry: "auto",
                                    nationalMode: false,
                                    utilsScript: cht_settings.plugin_url + "admin/assets/js/utils.js",
                                });
                            }
                        } else {
                            $("#chaty-social-"+response.channel+" .channels__input-box").html("<input type='text' class='channels__input' name='cht_social_"+response.channel+"[value]' id='channel_input_"+response.channel+"' />");
                        }
                        $(".custom-icon-"+response.channel+" svg").html(response.data.svg);
                        $("#chaty-social-"+response.channel).attr("data-channel", response.data.slug);
                        $("#chaty-social-"+response.channel).find(".sp-preview-inner").css("background-color", response.data.color);
                        $("#chaty-social-"+response.channel).find(".chaty-color-field").val(response.data.color);
                        $("#chaty-social-"+response.channel).find(".channels__input").attr("placeholder", response.data.placeholder);
                        $("#chaty-social-"+response.channel).find(".channel-example").text(response.data.example);
                        $("#chaty-social-"+response.channel).find(".chaty-title").val(response.data.title);
                        $("#chaty-social-"+response.channel).find(".icon").attr("data-title", response.data.title);
                        $("#chaty-social-"+response.channel).find(".chaty-color-field").trigger("change");
                        $(".help-section").html("");
                        if(response.data.help_link != "") {
                            $(".help-section").html('<div class="viber-help"><a target="_blank" href="'+response.data.help_link+'">'+response.data.help_title+'</a></div>');
                        } else if(response.data.help_text != "") {
                            $(".help-section").html('<div class="viber-help"><span class="help-text">'+response.data.help_text+'</span><span class="help-title">'+response.data.help_title+'</span></div>');
                        }
                    }
                }
            })
        });

        $(document).on("blur", "#channels-selected-list > li:not(#chaty-social-close) .channels__input", function(){
            if($(this).hasClass("border-red") && $(this).val() != "") {
                $(this).removeClass("border-red");
            }
        });

        var count_click = 1000000003;
        $('.show_up').on("click", function () {
            count_click += 10;
            $('#upgrade-modal').css({
                'z-index': count_click,
                display: 'block',
                'margin-left': '-258px'
            });
        });

        $('.color-picker-btn, .color-picker-btn-close, .color-picker-custom button').on('click', function (e) {
            e.preventDefault();

            $('.color-picker-box').toggle();
            $('.color-picker-btn').toggle();
        });

        $(document).on('change', 'input[name="cht_color"]:checked', function () {
            var $this = $(this);
            alert($this)

            var color = $this.val();

            var title = $this.prop('title');
            $('.color-picker-btn .circle').css({backgroundColor: color});
            $('.color-picker-btn .text').text(title);
            $('#chaty-social-close ellipse').attr("fill", color);
            $('.preview .page #iconWidget svg circle').css({fill: color});
            $('.preview .page .chaty-close-icon ellipse').css({fill: color});
            $("#cht_custom_color").val($(this).val());
            $(".upload-icons").css("background-color",$(this).val());
        });

        $(document).on("click", ".color-field", function(){
            if($(this).is(":checked")) {
                $(this).spectrum("show");
            }
        });

        var socialIcon = $('.channels-icons > .icon-sm');
        var socialInputsContainer = $('.social-inputs');
        var click = 0;

        socialIcon.on('click', function () {
            ++click;

            $('#popover').removeClass("shake-it");

            var $this = $(this);

            var social = $this.data('social');

            if ($this.hasClass('active')) {
                icon = $(this).data('social');
                $("#channels-selected-list #chaty-social-"+icon).remove();
                $this.toggleClass('active');
                change_custom_preview();
                // call when any channel is removed or updated
                const channel_list3 = [];
                $('.channels-icons > .icon.active').each( (i, item) => {
                    channel_list3.push( item.dataset.social );
                } )
                wp.hooks.doAction('chaty.channel_update', {
                    channel     : channel_list3,         // active channel list
                    target      : social,               // channel that removed last
                    action      : 'removed',            // added || removed,
                    isExceeded  : false,
                });
                return;
            }
            socialIcon.addClass('disabled');
            icon = $(this).data('social');

            $this.toggleClass('active');


            if ($('section').is('#pro')) {
                var token = 'pro';
            } else {
                var token = 'free';
            }


            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: ajaxurl,
                data: {
                    action: 'choose_social',
                    social: social,
                    nonce_code: cht_nonce_ajax.cht_nonce,
                    version: token,
                    widget_index: $("#widget_index").val()
                },
                beforeSend: function (xhr) {

                },
                success: function (data) {
                    var item = $(data);
                    var itemName = item.find('.icon').data('title');
                    var itemChannel = item.data('channel');
                    socialIcon.removeClass('disabled');
                    if (!$('.channels-selected div[data-social="' + itemName + '"]').length) {
                        $('#chaty-social-close').before(item);
                        if($("#chaty-social-"+social+" .chaty-whatsapp-setting-textarea").length) {
                            editorId = $("#chaty-social-"+social+" .chaty-whatsapp-setting-textarea").attr("id");
                            tinymce.execCommand( 'mceAddEditor', true, editorId);
                        }
                    }

                    var newIconLib = {
                        "material":{
                            "regular":{
                                "list-icon":"",
                                "icon-style":"mt-regular",
                                "icons":["some","some2"],
                            }
                        }
                    }
                    if($("#icon-picker-"+social).length && $("#select-icon-"+social).length) {
                        AestheticIconPicker({
                            'selector': '#icon-picker-' + social, // must be an ID
                            'onClick': '#select-icon-' + social,  // must be an ID
                            "iconLibrary": newIconLib
                        });
                    }
                    if($("#icon-picker-agent-"+social).length && $("#select-icon-agent-"+social).length) {
                        AestheticIconPicker({
                            'selector': '#icon-picker-agent-' + social, // must be an ID
                            'onClick': '#select-icon-agent-' + social,  // must be an ID
                            "iconLibrary": newIconLib
                        });
                    }
                    if($("#chaty-social-"+social+" .agent-list li.agent-info .icon-picker-wrap").length) {
                        $("#chaty-social-"+social+" .agent-list li.agent-info .icon-picker-wrap").each(function(){
                            var dataSulg = $(this).data("slug");
                            if($("#icon-picker-"+dataSulg).length && $("#select-icon-"+dataSulg).length) {
                                AestheticIconPicker({
                                    'selector': '#icon-picker-' +dataSulg, // must be an ID
                                    'onClick': '#select-icon-' +dataSulg,  // must be an ID
                                    "iconLibrary": newIconLib
                                });
                            }
                        });
                    }

                    if(itemChannel == "Whatsapp") {

                    }

                    if(social == "Whatsapp") {
                        if($("#channel_input_Whatsapp").length) {
                            cht_settings.channel_settings['Whatsapp'] = document.querySelector("#channel_input_Whatsapp");
                            window.intlTelInput(cht_settings.channel_settings['Whatsapp'], {
                                dropdownContainer: document.body,
                                formatOnDisplay: true,
                                hiddenInput: "full_number",
                                initialCountry: "auto",
                                nationalMode: false,
                                utilsScript: cht_settings.plugin_url + "admin/assets/js/utils.js",
                            });
                        }
                    }

                    if($(".custom-channel-Whatsapp").length) {
                        $(".custom-channel-Whatsapp").each(function(){
                            if(!$(this).closest(".iti__flag-container").length) {
                                var dataChannel = $(this).closest("li.chaty-channel").data("id");
                                if($("#channel_input_"+dataChannel).length) {
                                    cht_settings.channel_settings[dataChannel] = document.querySelector("#channel_input_" + dataChannel);
                                    window.intlTelInput(cht_settings.channel_settings[dataChannel], {
                                        dropdownContainer: document.body,
                                        formatOnDisplay: true,
                                        hiddenInput: "full_number",
                                        initialCountry: "auto",
                                        nationalMode: false,
                                        utilsScript: cht_settings.plugin_url + "admin/assets/js/utils.js",
                                    });
                                }
                            }
                        });
                    }

                    change_custom_preview();

                    $(document).trigger('chatyColorPicker/trigger', [{
                        $scope   : $(`#chaty-social-${social}`),
                        element  : '.chaty-color-field'
                    }]);

                    // call when any channel is removed or updated
                    const channel_list = [];
                    $('.channels-icons > .icon.active').each( (i, item) => {
                        channel_list.push( item.dataset.social );
                    } )
                    wp.hooks.doAction('chaty.channel_update', {
                        channel     : channel_list,         // active channel list
                        target      : social,              // channel that removed last
                        action      : 'added',            // added || removed,
                        isExceeded  : false,
                    });

                },
                error: function (xhr, status, error) {

                }
            });
        });

        $('.btn-help').on("click", function (event) {
            window.open(
                'https://premio.io/help/chaty/',
                '_blank' // <- This is what makes it open in a new window.
            );
        });

        if($("#cht_color_custom").length) {
            $("#cht_color_custom").spectrum({
                chooseText: "Submit",
                preferredFormat: "hex3",
                cancelText: "Cancel",
                showInput: true,
                showAlpha: true,
                move: function (color) {
                    $(this).val(color.toRgbString());
                    $('#chaty-social-close ellipse').attr("fill", color.toRgbString());
                    $('.preview .page #iconWidget svg circle, .chaty-close-icon svg ellipse').css({fill: color.toRgbString()});
                    $("#cht_custom_color").val(color.toRgbString());
                    // $('.color-picker-btn .circle').css({background: color.toRgbString()});
                },
                change: function (color) {
                    $(this).val(color.toRgbString());
                    $('#chaty-social-close ellipse').attr("fill", color.toRgbString());
                    $('.preview .page #iconWidget svg circle, .chaty-close-icon svg ellipse').css({fill: color.toRgbString()});
                    $("#cht_custom_color").val(color.toRgbString());
                    // $('.color-picker-btn .circle').css({background: color.toRgbString()});
                }
            });
        }

        if($("#analytics_date").length) {
            $("#analytics_date").datepicker();
        }

        if($(".select2-box").length) {
            $("#cht_date_rules_time_zone").SumoSelect({
                search: true,
            });
        }

        if($("#chaty-page-options .page-option-list").length) {
            $("#chaty-page-options .page-option-list").SumoSelect({
                search: false,
            });
        }

        if($("#chaty-page-options .url-option-list").length) {
            $("#chaty-page-options .url-option-list").SumoSelect({
                search: false,
            });
        }

        if($("#chaty-page-options .pages-options").length) {
            $("#chaty-page-options .pages-options").each(function(){
                var eleId = $(this).attr("id");
                setPagesField(eleId, "pages", "Select Pages");
            });
        }

        if($("#chaty-page-options .posts-options").length) {
            $("#chaty-page-options .posts-options").each(function(){
                var eleId = $(this).attr("id");
                setPagesField(eleId, "posts", "Select Posts");
            });
        }

        if($("#chaty-page-options .wp_categories-options").length) {
            $("#chaty-page-options .wp_categories-options").each(function(){
                var eleId = $(this).attr("id");
                setPagesField(eleId, "categories", "Select Categories");
            });
        }

        if($("#chaty-page-options .wp_tags-options").length) {
            $("#chaty-page-options .wp_tags-options").each(function(){
                var eleId = $(this).attr("id");
                setPagesField(eleId, "tags", "Select Tags");
            });
        }

        if($("#chaty-page-options .wc_products-options").length) {
            $("#chaty-page-options .wc_products-options").each(function(){
                var eleId = $(this).attr("id");
                setPagesField(eleId, "products", "Select Products");
            });
        }

        if($("#chaty-page-options .wc_products_on_sale-options").length) {
            $("#chaty-page-options .wc_products_on_sale-options").each(function(){
                var eleId = $(this).attr("id");
                setPagesField(eleId, "sale_products", "Select Products");
            });
        }

        $(document).on("click", ".remove-chaty-options", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if(confirm("Are you sure you want to delete this widget?")) {
                $.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: {
                        action: 'remove_chaty_widget',
                        widget_nonce: $(this).data("nonce"),
                        widget_index: $("#widget_index").val()
                    },
                    beforeSend: function (xhr) {

                    },
                    success: function (res) {
                        window.location = res;
                    },
                    error: function (xhr, status, error) {

                    }
                });
            }
        });

        /* Date: 2019-07-26 */
        var location_href = window.location.href;
        if (window.location.href.indexOf('page=chaty-app&widget=') > -1) {
            $('#toplevel_page_chaty-app .wp-submenu.wp-submenu-wrap li').each(function () {
                var element_href = $(this).find('a').attr('href');
                if (typeof element_href !== 'undefined') {
                    $(this).removeClass('current');
                    if (window.location.href.indexOf(element_href) > -1 && element_href.indexOf('&widget=') > -1) {
                        $(this).addClass('current');
                    }
                }
            });
        }
    });


}(jQuery));

function setPagesField(eleId, searchType, defaultText) {
    jQuery("#"+eleId).select2({
        tags: false,
        multiple: true,
        minimumInputLength: 2,
        minimumResultsForSearch: 10,
        placeholder: defaultText,
        ajax: {
            url: ajaxurl,
            dataType: "json",
            type: "POST",
            quietMillis: 50,
            data: function (params) {
                var queryParameters = {
                    action: 'search_chaty_field',
                    type: searchType,
                    search: params.term
                }
                return queryParameters;
            },
            processResults: function (data) {
                if(data.length) {
                    return {
                        results: jQuery.map(data, function (item) {
                            return {
                                text: item.title,
                                id: item.id
                            }
                        })
                    };
                } else {
                    return {
                        results: jQuery.map(data, function (item) {
                            return {
                                text: "No results are found",
                                id: 0,
                                disabled: true
                            }
                        })
                    };
                }
            }
        }
    });
}

var totalPageOptions = 0;
var pageOptionContent = "";
var totalDateAndTimeOptions = 0;
var dateAndTimeOptionContent = "";
var totalTrafficOptions = 0;
var tafficOptionContent = "";
jQuery(document).ready(function () {
    totalPageOptions = parseInt(jQuery(".chaty-page-option").length);
    pageOptionContent = jQuery(".chaty-page-options-html").html();
    jQuery(".chaty-page-options-html").remove();
    totalDateAndTimeOptions = parseInt(jQuery(".chaty-date-time-option").length);
    dateAndTimeOptionContent = jQuery(".chaty-date-and-time-options-html").html();
    jQuery(".chaty-date-and-time-options-html").remove();

    totalTrafficOptions = parseInt(jQuery(".custom-traffic-rule").length);
    tafficOptionContent = jQuery(".custom-traffic-rules-html").html();
    jQuery(".custom-traffic-rules-html").remove();

    jQuery(document).on("click", ".mail-merge-tags span", function(e){
        var fieldVal = jQuery.trim(jQuery(this).closest(".chaty-setting-col").find("input[type='text']").val());
        fieldVal += " "+jQuery(this).text();
        jQuery(this).closest(".chaty-setting-col").find("input[type='text']").val(jQuery.trim(fieldVal));
    });

    jQuery("#add-traffic-rule").on("click", function () {
        appendHtml = tafficOptionContent.replace(/__count__/g, totalTrafficOptions, tafficOptionContent);
        jQuery(".traffic-custom-rules-box").append(appendHtml);
        jQuery("#url_option_"+totalTrafficOptions).SumoSelect();
        totalTrafficOptions++;
    });

    jQuery(document).on("click", "#create-date-rule", function(e){
        jQuery("#date-schedule").addClass("active");
        jQuery("#cht_date_rules").val("yes");
    });
    jQuery(document).on("click", "#remove-date-rule", function(e){
        jQuery("#date-schedule").removeClass("active");
        jQuery("#cht_date_rules").val("no");
    });
    if(jQuery("#date_start_time").length && jQuery("#date_end_time").length) {
        jQuery("#date_start_time, #date_end_time").timepicker({
            showLeadingZero: true
        });
    }

    if(jQuery("#date_start_date").length) {
        jQuery("#date_start_date").datepicker({
            dateFormat: 'mm/dd/yy',
            altFormat: 'mm/dd/yy',
            onSelect: function(d,i){
                var minDate = jQuery("#date_start_date").datepicker('getDate');
                minDate.setDate(minDate.getDate()); //add two days
                jQuery("#date_end_date").datepicker("option", "minDate", minDate);
                if(jQuery("#date_end_date").val() <= jQuery("#date_start_date").val()) {
                    jQuery("#date_end_date").val(jQuery("#date_start_date").val());
                }

                if(jQuery("#date_end_date").val() == "") {
                    jQuery("#date_end_date").val(jQuery("#date_start_date").val());
                }
            }
        });
    }
    if(jQuery("#date_end_date").length) {
        jQuery("#date_end_date").datepicker({
            dateFormat: 'mm/dd/yy',
            altFormat: 'mm/dd/yy',
            onSelect: function(d,i){
                if(jQuery("#date_start_date").val() == "") {
                    jQuery("#date_start_date").val(jQuery("#date_end_date").val());
                }
            }
        });
    }
    if(jQuery("#date_start_date").length) {
        if(jQuery("#date_start_date").val() != "") {
            var minDate = jQuery("#date_start_date").datepicker('getDate');
            minDate.setDate(minDate.getDate()); //add two days
            jQuery("#date_end_date").datepicker("option", "minDate", minDate);
            if(jQuery("#date_end_date").val() <= jQuery("#date_start_date").val()) {
                jQuery("#date_end_date").val(jQuery("#date_start_date").val());
            }
        }
    }

    jQuery(document).on("click", "#update-chaty-traffic-source-rule", function(e){
        jQuery(".traffic-options-box").addClass("active");
        jQuery("#chaty_traffic_source").val("yes");
    });
    jQuery(document).on("click", "#remove-traffic-rules", function(e){
        jQuery(".traffic-options-box").removeClass("active");
        jQuery("#chaty_traffic_source").val("no");
    });
    jQuery(document).on("click", ".remove-traffic-option", function(e){
        jQuery(this).closest(".custom-traffic-rule").remove();
    });
    
    jQuery('#create-country-rule').on('click', function() {
        const $parent = jQuery(this).parents('.country-option-box');
        $parent.find('.country-list-box').removeClass('hidden');
        $parent.addClass('show-remove-rules-btn');
    })

    jQuery('#remove-country-rules').on('click', function() {
        const $parent = jQuery(this).parents('.country-option-box');
        jQuery("select.country-list")[0].sumo.unSelectAll();
        jQuery(".country-list option:selected").prop("selected", false);
        jQuery(".country-list").trigger("change");
        $parent.find('.country-list-box').addClass('hidden');
        $parent.removeClass('show-remove-rules-btn')
    })

    jQuery("#create-rule").on("click", function () {
        appendHtml = pageOptionContent.replace(/__count__/g, totalPageOptions, pageOptionContent);
        jQuery(".chaty-page-options").append(appendHtml);
        jQuery(".chaty-page-options .chaty-page-option").removeClass("last");
        jQuery(".chaty-page-options .chaty-page-option:last").addClass("last");

        const $parent   = jQuery(this).parents('.chaty-option-box');
        const status    =  $parent.find('.chaty-page-option').length > 0;
        $parent.toggleClass('show-remove-rules-btn', status );

        if (jQuery("#is_pro_plugin").val() == "0") {
            jQuery(".chaty-page-options").find("input").attr("name", "");
            jQuery(".chaty-page-options").find("select").attr("name", "");
            jQuery(".chaty-page-options").find("input").removeClass("cht-required");
            jQuery(".chaty-page-options").find("select").removeClass("cht-required");
        } else {
            jQuery("#url_shown_on_"+totalPageOptions+"_option").SumoSelect({
                search: false,
            });
            jQuery("#url_rules_"+totalPageOptions+"_option").SumoSelect({
                search: false,
            });

            if(jQuery("#url_rules_"+totalPageOptions+"_page_ids").length) {
                var eleId = "url_rules_"+totalPageOptions+"_page_ids";
                setPagesField(eleId, "pages", "Select Pages");
            }

            if(jQuery("#url_rules_"+totalPageOptions+"_post_ids").length) {
                var eleId = "url_rules_"+totalPageOptions+"_post_ids";
                setPagesField(eleId, "posts", "Select Posts");
            }

            if(jQuery("#url_rules_"+totalPageOptions+"_category_ids").length) {
                var eleId = "url_rules_"+totalPageOptions+"_category_ids";
                setPagesField(eleId, "categories", "Select Categories");
            }

            if(jQuery("#url_rules_"+totalPageOptions+"_tag_ids").length) {
                var eleId = "url_rules_"+totalPageOptions+"_tag_ids";
                setPagesField(eleId, "tags", "Select Tags");
            }

            if(jQuery("#url_rules_"+totalPageOptions+"_products_ids").length) {
                var eleId = "url_rules_"+totalPageOptions+"_products_ids";
                setPagesField(eleId, "products", "Select Products");
            }

            if(jQuery("#url_rules_"+totalPageOptions+"_wc_products_ids").length) {
                var eleId = "url_rules_"+totalPageOptions+"_wc_products_ids";
                setPagesField(eleId, "sale_products", "Select Products");
            }
        }
        jQuery("#url_"+totalPageOptions+"_option").SumoSelect();
        totalPageOptions++;
    });

    if(jQuery(".traffic-url-options").length) {
        jQuery(".traffic-url-options").SumoSelect();
    }

    jQuery("#create-data-and-time-rule").on("click", function () {
        appendHtml = dateAndTimeOptionContent.replace(/__count__/g, totalDateAndTimeOptions, dateAndTimeOptionContent);
        jQuery(".chaty-data-and-time-rules").append(appendHtml);
        jQuery(".chaty-data-and-time-rules .chaty-date-time-option").removeClass("last");
        jQuery(".chaty-data-and-time-rules .chaty-date-time-option:last").addClass("last");
        jQuery(".chaty-data-and-time-rules .chaty-date-time-option").removeClass("first");
        jQuery(".chaty-data-and-time-rules .chaty-date-time-option:first").addClass("first");

        if (jQuery("#is_pro_plugin").val() == "0") {
            jQuery(".chaty-data-and-time-rules").find("input").attr("name", "");
            jQuery(".chaty-data-and-time-rules").find("select").attr("name", "");
            jQuery(".chaty-data-and-time-rules").find("input").removeClass("cht-required");
            jQuery(".chaty-data-and-time-rules").find("select").removeClass("cht-required");
        }
        jQuery("#start_time_"+totalDateAndTimeOptions+", #end_time_"+totalDateAndTimeOptions).timepicker({
            showLeadingZero: true
        });
        jQuery('#gmt_'+totalDateAndTimeOptions+'_option').SumoSelect({
            search: true
        });
        // jQuery('#gmt_'+totalDateAndTimeOptions+'_option').on('select2:open', function(e) {
        //     jQuery("body").addClass("no-checkbox");
        // });

        // trigger this method to move "add rule" button to the last card
        const $current  = jQuery('.chaty-data-and-time-rules .chaty-date-time-option:last');
        const $scope    = jQuery(this).parents('.chaty-option-box');
        wp.hooks.doAction('chaty.days_and_hours_add_rule', {
            $scope,
            $current
        });

        jQuery("#url_shown_on_"+totalDateAndTimeOptions+"_option").SumoSelect();

        totalDateAndTimeOptions++;

    });

    // trigger this method to move "add rule" button to the last card
    const $current  = jQuery('.chaty-data-and-time-rules .chaty-date-time-option:last');
    const $scope    = jQuery('.chaty-data-and-time-rules').parents('.chaty-option-box');
    wp.hooks.doAction('chaty.days_and_hours_add_rule', {
        $scope,
        $current
    } )

    jQuery(".chaty-data-and-time-rules .chaty-date-time-option").removeClass("last");
    jQuery(".chaty-data-and-time-rules .chaty-date-time-option:last").addClass("last");
    jQuery(".chaty-data-and-time-rules .chaty-date-time-option").removeClass("first");
    jQuery(".chaty-data-and-time-rules .chaty-date-time-option:first").addClass("first");

    if(totalDateAndTimeOptions > 0) {
        jQuery(".ui-timepicker-input").timepicker({
            showLeadingZero: true
        });
        if(totalDateAndTimeOptions >= 1) {
            jQuery(".chaty-option-box .chaty-date-time-option:last").addClass("last");
        }
    }

    jQuery(document).on("change", "#chaty_attention_effect", function(){
        var currentClass = jQuery(this).attr("data-effect");
        if(currentClass != "") {
            jQuery("#iconWidget").removeClass("chaty-animation-"+currentClass);
        }
        jQuery("#iconWidget").removeClass("start-now");
        jQuery("#iconWidget").addClass("chaty-animation-"+jQuery(this).val()).addClass("start-now");
        jQuery(this).attr("data-effect", jQuery(this).val());
    });

    setInterval(function(){
        var currentClass = jQuery("#chaty_attention_effect").attr("data-effect");
        if(currentClass != "") {
            jQuery("#iconWidget").removeClass("chaty-animation-"+currentClass);
            jQuery("#iconWidget").removeClass("start-now");
            setTimeout(function(){
                jQuery("#iconWidget").addClass("chaty-animation-"+jQuery("#chaty_attention_effect").val()).addClass("start-now");
            }, 1000);
        } else {
            jQuery("#chaty_attention_effect").attr("data-effect", jQuery("#chaty_attention_effect").val());
        }
    }, 5000);

    jQuery(document).on("click", ".remove-chaty", function () {
        const $parent  = jQuery(this).parents('.chaty-option-box');
        jQuery(this).parents(".chaty-page-option").remove();
        $parent.find(".chaty-page-options .chaty-page-option").removeClass("last");
        $parent.find(".chaty-page-options .chaty-page-option:last").addClass("last");

        const status = $parent.find('.chaty-page-option').length > 0;
        if(status) {
            $parent.addClass('show-remove-rules-btn');
        } else {
            $parent.removeClass('show-remove-rules-btn');
        }
    });

    jQuery(document).on("click", "#remove-page-rules", function(e){
        e.preventDefault();
        jQuery("#chaty-page-options .chaty-page-option").remove();
        jQuery(".chaty-option-box").removeClass('show-remove-rules-btn');
    });

    jQuery(document).on("click", ".remove-day-time-rules", function(e){
        e.preventDefault();
        const $parent   = jQuery(this).parents(".chaty-option-box");
        const $scope    = $parent.find('.chaty-date-time-option');
        wp.hooks.doAction('chaty.days_and_hours_remove_rule', $scope, 'all');
        $scope.remove();
        $parent.removeClass('show-remove-rules-btn');
        // bring content into viewport 
        $parent[0].scrollIntoView({
            behavior: "smooth",
            block: "center"
        })
        
    });

    jQuery(document).on("click", ".remove-page-option", function () {
        const $scope = jQuery(this).closest(".chaty-date-time-option");
        wp.hooks.doAction('chaty.days_and_hours_remove_rule', $scope, 'single')
        jQuery(this).closest(".chaty-date-time-option").remove();
    });

    jQuery("#image-upload-content .custom-control-label").on("click", function (e) {
        e.stopPropagation();
        jQuery(this).closest(".custom-control").find("input[type=radio]").prop("checked", true);
        jQuery('.js-widget-i').trigger("change");
        return false;
    });

    // jQuery('.chaty-color-field').spectrum({
    //     chooseText: "Submit",
    //     preferredFormat: "hex3",
    //     cancelText: "Cancel",
    //     showInput: true,
    //     showAlpha: true,
    //     move: function (color) {
    //         jQuery(this).val(color.toRgbString());
    //         jQuery("#cta-box span").css("color", jQuery("#cht_cta_text_color").val());
    //         jQuery("#cta-box span").css("background", jQuery("#cht_cta_bg_color").val());
    //         jQuery("#custom-css").html("<style>.preview .page .chaty-widget .icon:before {border-color: transparent "+jQuery('#cht_cta_bg_color').val()+" transparent transparent } .preview .page .chaty-widget[style*='left: auto;'] .icon:before {border-color: transparent transparent transparent "+jQuery('#cht_cta_bg_color').val()+"}</style>");
    //         chaty_set_bg_color();

    //     },
    //     change: function (color) {
    //         jQuery(this).val(color.toRgbString());
    //         jQuery("#cta-box span").css("color", jQuery("#cht_cta_text_color").val());
    //         jQuery("#cta-box span").css("background", jQuery("#cht_cta_bg_color").val());
    //         jQuery("#custom-css").html("<style>.preview .page .chaty-widget .icon:before {border-color: transparent "+jQuery('#cht_cta_bg_color').val()+" transparent transparent } .preview .page .chaty-widget[style*='left: auto;'] .icon:before {border-color: transparent transparent transparent "+jQuery('#cht_cta_bg_color').val()+"}</style>");
    //         chaty_set_bg_color();
    //     }
    // });

    jQuery(".chaty-color-field").on("change", function () {
        chaty_set_bg_color();
    });

    jQuery(".remove-chaty-img").on("click", function (e) {
        e.stopPropagation();
    });

    var isChatyInMobile = false;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isChatyInMobile = true;
    }

    if(!isChatyInMobile && !jQuery("body").hasClass("theme-utouch-lite")) {
        jQuery("#channels-selected-list").sortable({
            placeholder: "ui-chaty-state-hl",
            items: "li.chaty-channel:not(#chaty-social-close)",
            handle: '.move-icon',
            start: function() {
                jQuery("body").addClass("hide-agents");
            },
            stop: function () {
                jQuery("body").removeClass("hide-agents");
                set_wp_editor();
            },
            update: function (event, ui) {
                set_social_channel_order();
                change_custom_preview();
                set_wp_editor();
            }
        });
    }

    jQuery(document).ready(function(){
        set_wp_editor();

        if(jQuery(".toast-message").length) {
            jQuery(".toast-message").addClass("active");

            setTimeout(function(){
                jQuery(".toast-message").removeClass("active");
            }, 5000);
        }

        jQuery(document).on("click", ".toast-close-btn a", function(e){
            e.preventDefault();
            jQuery(".toast-message").removeClass("active");
        });

        jQuery("input[name='switchPreview']:checked").trigger("change");
    });

    function set_wp_editor() {
        if(jQuery(".chaty-whatsapp-setting-textarea").length) {
            jQuery(".chaty-whatsapp-setting-textarea").each(function(){
                if(jQuery("#cht_social_embedded_message_"+jQuery(this).data("id")+"_ifr").length) {
                    tinymce.get(jQuery(this).attr("id")).remove();
                }
                tinymce.execCommand( 'mceAddEditor', true, jQuery(this).attr("id"));
            });
        }
    }

    jQuery(".close-button-img img, .close-button-img .image-upload").on("click", function () {
        var image = wp.media({
            title: 'Upload Image',
            // mutiple: true if you want to upload multiple files at once
            multiple: false,
            library: {
                type: 'image',
            }
        }).open()
            .on('select', function (e) {
                var uploaded_image = image.state().get('selection').first();
                imageData = uploaded_image.toJSON();
                jQuery('.close-button-img').addClass("active");
                jQuery('.close-button-img input').val(imageData.id);
                jQuery('.close-button-img img').attr("src", imageData.url);
                change_custom_preview();
            });
    });

    jQuery(".remove-close-img").on("click", function () {
        default_image = jQuery("#default_image").val();
        jQuery('.close-button-img').removeClass("active");
        jQuery('.close-button-img input').val("");
        jQuery('.close-button-img img').attr("src", default_image);
        change_custom_preview();
    });

    jQuery(document).on("click", ".chaty-widget.click", function(e){
        e.preventDefault();
        // jQuery(".chaty-channels").toggle();
        jQuery(".chaty-widget").toggleClass("active");
    });

    jQuery(document).on('change', '#chaty-page-options .url-options', function (ev) {
        thisVal = jQuery(this).val();
        siteURL = jQuery("#chaty_site_url").val();
        newURL = siteURL;
        console.log(thisVal);
        jQuery(this).closest(".url-content").find(".url-title").hide();
        jQuery(this).closest(".url-content").find(".url-title").removeClass("active");
        jQuery(this).closest(".url-content").find(".chaty-url").show();
        jQuery(this).closest(".url-content").find(".url-setting-option").removeClass("active");
        jQuery(this).closest(".url-content").find(".url-default").addClass("active");
        jQuery(this).closest(".url-content").find(".items-center").addClass("active");
        if (thisVal == "home") {
            newURL = siteURL;
            jQuery(this).closest(".url-content").find(".url-default").removeClass("active");
            jQuery(this).closest(".url-content").find(".items-center").removeClass("active");
        } else if (thisVal == "page_has_url") {
            newURL = siteURL;
        } else if (thisVal == "page_contains") {
            newURL = siteURL;
        } else if (thisVal == "page_start_with") {
            newURL = siteURL;
        } else if (thisVal == "page_end_with") {
            newURL = siteURL;
        } else {
            jQuery(this).closest(".url-content").find(".url-title").hide();
            jQuery(this).closest(".url-content").find(".chaty-"+thisVal).show();
            jQuery(this).closest(".url-content").find(".url-setting-option").removeClass("active");
            jQuery(this).closest(".url-content").find("."+thisVal+"-option").addClass("active");
        }
        jQuery(this).closest(".url-content").find(".chaty-url").text(newURL);
    });

    jQuery(".chaty-settings.cls-btn a, .close-btn-set").on("click", function (e) {
        e.preventDefault();
        jQuery(".cls-btn-settings, .close-btn-set").toggleClass("active");
    });

    /*Default Values*/
    if (jQuery("input[name='cht_position']:checked").length == 0) {
        jQuery("#right-position").prop("checked", true);
        jQuery("input[name='cht_position']:checked").trigger("change");
    }
    if (jQuery("input[name='widget_icon']:checked").length == 0) {
        jQuery("input[name='widget_icon']:first").prop("checked", true);
        jQuery("input[name='widget_icon']:checked").trigger("change");
    }
    change_custom_preview();
});

var selectedsocialSlug = "";

function upload_chaty_image(socialSlug) {
    selectedsocialSlug = socialSlug;
    var image = wp.media({
        title: 'Upload Image',
        // mutiple: true if you want to upload multiple files at once
        multiple: false,
        library: {
            type: 'image',
        }
    }).open()
        .on('select', function (e) {
            var uploaded_image = image.state().get('selection').first();
            imageData = uploaded_image.toJSON();
            jQuery('#cht_social_image_' + selectedsocialSlug).val(imageData.id);
            jQuery('.custom-image-' + selectedsocialSlug + " img").attr("src", imageData.url);
            jQuery("#chaty_image_" + selectedsocialSlug).addClass("img-active").removeClass("icon-active");
            jQuery("#chaty_image_"+selectedsocialSlug+ " .fa-icon").val("");
            change_custom_preview();
        });
}

function upload_chaty_agent_image(socialSlug) {
    selectedsocialSlug = socialSlug;
    var image = wp.media({
        title: 'Upload Image',
        // mutiple: true if you want to upload multiple files at once
        multiple: false,
        library: {
            type: 'image',
        }
    }).open()
        .on('select', function (e) {
            var uploaded_image = image.state().get('selection').first();
            imageData = uploaded_image.toJSON();
            if(jQuery('#cht_social_agent_image_' + selectedsocialSlug).length) {
                jQuery('#image_agent_data_' + selectedsocialSlug + " img.agent-image").attr("src", imageData.url);
                jQuery("#image_agent_data_" + selectedsocialSlug).addClass("img-active").removeClass("icon-active");
                jQuery("#image_agent_data_"+selectedsocialSlug+" .fa-icon").val("");
                jQuery('#image_agent_data_' + selectedsocialSlug + " input.image-id").val(imageData.id)
                change_custom_preview();
            }
        });
}

function toggle_chaty_setting(socId) {
    jQuery("#chaty-social-" + socId).find(".chaty-advance-settings").toggle();
    jQuery("#chaty-social-" + socId).find(".chaty-advance-settings").toggleClass('active');
    if(socId == "Contact_Us") {
        if(jQuery("#Contact_Us-close-btn").length) {
            var nonce = jQuery("#Contact_Us-close-btn").data("nonce");
            if (!jQuery("#Contact_Us-close-btn").hasClass("active")) {
                jQuery("#Contact_Us-close-btn").addClass("active")
                jQuery.ajax({
                    type: 'POST',
                    url: ajaxurl,
                    data: {
                        "nonce": nonce,
                        "action": 'update_channel_setting'
                    },
                    success: function (response) {

                    }
                });
            }
        }
    }
    if(jQuery("#chaty-social-" + socId+ " .chaty-advance-settings.active").length) {
        // jQuery("body,html").animate({
        //     scrollTop: jQuery("#chaty-social-" + socId+ " .chaty-advance-settings.active").offset().top - 50
        // }, 500);
    }
    change_custom_preview();
}

function chaty_set_bg_color() {
    jQuery(".chaty-color-field:not(.button-color)").each(function () {
        if (jQuery(this).val() != "" && jQuery(this).val() != "#ffffff") {
            if(jQuery(this).hasClass("agent-bg-color")) {
                defaultColor = jQuery(this).val();
                jQuery(this).closest(".chaty-agent-form").find(".chaty-agent-setting").find(".color-element").css("fill", defaultColor);
                jQuery(this).closest(".chaty-agent-form").find(".chaty-agent-setting").find(".custom-agent-image").css("background", defaultColor);
                jQuery(this).closest(".chaty-agent-form").find(".chaty-agent-setting").find(".facustom-icon").css("background", defaultColor);
            } else if(jQuery(this).hasClass("agent-icon-color")) {
                defaultColor = jQuery(this).val();
                jQuery(this).closest("li.agent-info").find(".color-element").css("fill", defaultColor);
                jQuery(this).closest("li.agent-info").find(".custom-chaty-image").css("background", defaultColor);
                jQuery(this).closest("li.agent-info").find(".facustom-icon").css("background", defaultColor);
            } else if (jQuery(this).closest("li").data("id") != "Linkedin" || (jQuery(this).closest("li").data("id") == "Linkedin" && jQuery(this).val() != "#ffffff")) {
                defaultColor = jQuery(this).val();
                jQuery(this).closest(".channels-selected__item").find(".color-element").css("fill", defaultColor);
                jQuery(this).closest(".channels-selected__item").find(".custom-chaty-image").css("background", defaultColor);
                jQuery(this).closest(".channels-selected__item").find(".facustom-icon").css("background", defaultColor);
            }
        }
    });
    change_custom_preview();
}
var activeWeChatChannel = '';
function upload_qr_code(channel_name) {
    activeWeChatChannel = channel_name;
    var image = wp.media({
        title: 'Upload QR Image',
        multiple: false,
        library: {
            type: 'image'
        }
    }).open()
        .on('select', function (e) {
            var uploaded_image = image.state().get('selection').first();
            imageData = uploaded_image.toJSON();
            jQuery('#upload_qr_code_val-'+activeWeChatChannel).val(imageData.id);
            jQuery('#cht_social_image_src_'+activeWeChatChannel).attr("src", imageData.url);
            jQuery(".remove-qr-code-"+activeWeChatChannel).addClass("active");
            change_custom_preview();
        });
}

function remove_qr_code(channel_name) {
    default_image = jQuery("#default_image").val();
    jQuery('#upload_qr_code_val-'+channel_name).val("");
    jQuery('#cht_social_image_src_'+channel_name).attr("src", default_image);
    jQuery(".remove-qr-code-"+channel_name).removeClass("active");
    change_custom_preview();
}

function remove_chaty_image(socId) {
    default_image = jQuery("#default_image").val();
    jQuery('#cht_social_image_' + socId).val("");
    jQuery('#cht_social_image_src_' + socId).attr("src", default_image);
    jQuery("#chaty_image_"+socId).removeClass("icon-active").removeClass("img-active");
    jQuery("#chaty_image_"+socId+ " .fa-icon").val("");
    change_custom_preview();
}

var baseIcon = '<svg version="1.1" id="ch" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-496 507.7 54 54" style="enable-background:new -496 507.7 54 54;" xml:space="preserve">\n' +
        '                            <style type="text/css">.st0 {fill: #A886CD;}  .st1 {fill: #FFFFFF;}\n' +
        '                        </style><g><circle class="st0" cx="-469" cy="534.7" r="27"/></g><path class="st1" d="M-459.9,523.7h-20.3c-1.9,0-3.4,1.5-3.4,3.4v15.3c0,1.9,1.5,3.4,3.4,3.4h11.4l5.9,4.9c0.2,0.2,0.3,0.2,0.5,0.2 h0.3c0.3-0.2,0.5-0.5,0.5-0.8v-4.2h1.7c1.9,0,3.4-1.5,3.4-3.4v-15.3C-456.5,525.2-458,523.7-459.9,523.7z"/>\n' +
        '                                                    <path class="st0" d="M-477.7,530.5h11.9c0.5,0,0.8,0.4,0.8,0.8l0,0c0,0.5-0.4,0.8-0.8,0.8h-11.9c-0.5,0-0.8-0.4-0.8-0.8l0,0\n' +
        '                            C-478.6,530.8-478.2,530.5-477.7,530.5z"/>\n' +
        '                                                    <path class="st0" d="M-477.7,533.5h7.9c0.5,0,0.8,0.4,0.8,0.8l0,0c0,0.5-0.4,0.8-0.8,0.8h-7.9c-0.5,0-0.8-0.4-0.8-0.8l0,0\n' +
        '                            C-478.6,533.9-478.2,533.5-477.7,533.5z"/>\n' +
        '                        </svg>',
    defaultIcon = '<svg version="1.1" id="ch" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-496 507.7 54 54" style="enable-background:new -496 507.7 54 54;" xml:space="preserve">\n' +
        '                            <style type="text/css">.st0 {fill: #A886CD;}  .st1 {fill: #FFFFFF;}\n' +
        '                        </style><g><circle class="st0" cx="-469" cy="534.7" r="27"/></g><path class="st1" d="M-459.9,523.7h-20.3c-1.9,0-3.4,1.5-3.4,3.4v15.3c0,1.9,1.5,3.4,3.4,3.4h11.4l5.9,4.9c0.2,0.2,0.3,0.2,0.5,0.2 h0.3c0.3-0.2,0.5-0.5,0.5-0.8v-4.2h1.7c1.9,0,3.4-1.5,3.4-3.4v-15.3C-456.5,525.2-458,523.7-459.9,523.7z"/>\n' +
        '                                                    <path class="st0" d="M-477.7,530.5h11.9c0.5,0,0.8,0.4,0.8,0.8l0,0c0,0.5-0.4,0.8-0.8,0.8h-11.9c-0.5,0-0.8-0.4-0.8-0.8l0,0\n' +
        '                            C-478.6,530.8-478.2,530.5-477.7,530.5z"/>\n' +
        '                                                    <path class="st0" d="M-477.7,533.5h7.9c0.5,0,0.8,0.4,0.8,0.8l0,0c0,0.5-0.4,0.8-0.8,0.8h-7.9c-0.5,0-0.8-0.4-0.8-0.8l0,0\n' +
        '                            C-478.6,533.9-478.2,533.5-477.7,533.5z"/>\n' +
        '                        </svg>'
var iconBlock = document.getElementById('iconWidget');

function set_social_channel_order() {
    socialString = [];
    jQuery("#channels-selected-list > li.chaty-channel").each(function () {
        socialString.push(jQuery(this).attr("data-id"));
    });
    socialString = socialString.join(",");
    console.log(socialString);
    jQuery("#cht_numb_slug").val(socialString);
}

/*
Date: 2021-08-04 Preview Code
*/

(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if(typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    }
    else {
        factory(jQuery);
    }
}(function ($, undefined) {
    var chtIframeData = "";
    $(document).ready(function() {
        $(document).on("keyup", ".select2-search__field", function(){
            if($(this).val() == "") {
                if($(this).closest(".url-setting-option").length) {
                    var eleId = $(this).closest(".url-setting-option").find("select").attr("id");
                    if($("#"+eleId).length) {
                        $('#'+eleId).select2('close');
                    }
                }
            }
        });

        if(jQuery("#wp-cta_body_text-wrap").length) {
            var iframeData = jQuery("#wp-cta_body_text-wrap").find("iframe");
            chtIframeData = iframeData.contents().find("body").html();
            iframeData.contents().find("head").append("<style>p{margin:0; padding:0 }body{padding:10px !important;}</style>");

            setInterval(function () {
                if ($("#cta-option-chat-view").is(":checked")) {
                    var iframeData = jQuery("#wp-cta_body_text-wrap").find("iframe");
                    bodyMsg = iframeData.contents().find("body").html();
                    if (bodyMsg != chtIframeData) {
                        chtIframeData = bodyMsg;
                        change_custom_preview();
                    }
                }
            }, 2000);
        }

        $(document).on("click", "#image-upload-content .custom-control-radio", function(e){
            e.preventDefault();
            $(".js-upload").prop("checked", true);
            change_custom_preview();
        });

        if(jQuery("#wp-cta_wc_body_text-wrap").length) {
            var iframeData = jQuery("#wp-cta_wc_body_text-wrap").find("iframe");
            iframeData.contents().find("head").append("<style>p{margin:0; padding:0 }body{padding:10px !important;}</style>");
        }


        $(document).on("click", ".btn-cancel", function(e){
            e.preventDefault();
            var socialChannel = $(this).data("social");
            $(this).closest("li.chaty-channel").remove();
            $(".chat-channel-"+socialChannel).removeClass("active");
            change_custom_preview();
            // call when any channel is removed or updated
            const channel_list4 = [];
            jQuery('.channels-icons > .icon.active').each( (i, item) => {
                channel_list4.push( item.dataset.social );
            } )
            wp.hooks.doAction('chaty.channel_update', {
                channel     : channel_list4,         // active channel list
                target      : socialChannel,               // channel that removed last
                action      : 'removed',            // added || removed,
                isExceeded  : false,
            }); 
        });

        $(document).on("click", ".js-switch-preview", function(){
            change_custom_preview();
        });

        $(document).on("click", ".channels__view-check, #cht_close_button", function(){
            change_custom_preview();
        });

        $(document).on("change", "input[name='cht_position']:checked", function(){
            if($(this).val() == "custom") {
                $("#positionPro").show();
            } else {
                $("#positionPro").hide();
            }
            change_custom_preview();
        });

        $(document).on("click", "#aim-modal", function(){
            $(".aim-cancel-icon-button").trigger("click");
        });

        $(document).on("click", ".aim-modal--content", function(e){
            e.stopPropagation()
        });

        $(document).on("click", "#cht_pending_messages", function(){
            if($(this).is(":checked")) {
                $(".pending-message-items").addClass("active");
            } else {
                $(".pending-message-items").removeClass("active");
            }
            change_custom_preview();
        });

        $(document).on("change", "input[name='positionSide']:checked, input[name='cht_cta_action']:checked, input[name='widget_icon']:checked", function(){
            change_custom_preview();
        });

        $(document).on("change", "#chaty_attention_effect, #cht_number_of_messages, #chaty_icons_view", function(){
            change_custom_preview();
        });

        $(document).on("change", ".form-fonts", function(){
            jQuery("#custom-font-style, .preview-google-font").remove();
            if(jQuery(".form-fonts").val() != "") {
                jQuery("head").append("<style id='custom-font-style'></style>");
                customCSS = ".chaty-preview, .chaty-preview *, .chaty-preview *:after { font-family: "+jQuery(".form-fonts").val()+" }";
                jQuery("#custom-font-style").html(customCSS);

                if(jQuery(".form-fonts option:selected").closest("optgroup").attr("label") != "Default") {
                    jQuery("head").append('<link class="preview-google-font" rel="preconnect" href="https://fonts.googleapis.com">' +
                        '<link class="preview-google-font" rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
                        '<link class="preview-google-font" href="https://fonts.googleapis.com/css2?family='+jQuery(".form-fonts").val()+'&display=swap" rel="stylesheet">');
                }
            }
        });

        $(document).on("change", "#chaty_default_state", function(){
            if($(this).val() == "open") {
                $(".hide-show-button").addClass("active");
            } else {
                $(".hide-show-button").removeClass("active");
            }
            change_custom_preview();
        });

        $(document).on("change", "input[name='cht_color']:checked", function(){
            change_custom_preview();
        });

        $(document).on("click", ".chaty-preview.click:not(.single) .chaty-preview-cta, .chaty-preview.open:not(.single) .chaty-preview-cta", function(){
            $(".chaty-preview").toggleClass("active");
        });

        $(document).on("mouseover", ".chaty-preview.hover:not(.single):not(.on) .chaty-preview-cta", function(){
            $(".chaty-preview").addClass("active");
            $(".chaty-preview").addClass("on");
        });

        $(document).on("click", ".chaty-preview.hover:not(.single) .chaty-preview-cta", function(){
            $(".chaty-preview").toggleClass("active");
        });

        $(document).on("mouseleave", ".chaty-preview.hover:not(.single) .chaty-preview-cta", function(){
            $(".chaty-preview").removeClass("on");
        });

        $(document).on("keyup", ".test_textarea", function(){
            change_custom_preview();
        });

        $(document).on("click", ".trigger-block input[type='checkbox']", function(){
            if($(this).is(":checked")) {
                $(this).closest(".trigger-option-block").find("input[type='number']").prop("disabled", false);
                $(this).closest(".trigger-option-block").find("input[type='text']").prop("disabled", false);
            } else {
                $(this).closest(".trigger-option-block").find("input[type='number']").prop("disabled", true);
                $(this).closest(".trigger-option-block").find("input[type='text']").prop("disabled", true);
            }
        });

        if(!$("#trigger_on_time").is(":checked")) {
            $("#chaty_trigger_time").prop("disabled", true);
        }
        if(!$("#chaty_trigger_hide").is(":checked")) {
            $("#chaty_trigger_hide_time").prop("disabled", true);
        }
        if(!$("#chaty_trigger_on_scroll").is(":checked")) {
            $("#chaty_trigger_on_page_scroll").prop("disabled", true);
        }

        jQuery(".form-fonts").trigger("change");
    });
}));

var imageDataEvent = false;
function loadPreviewFile(event) {
    imageDataEvent = event;
    jQuery(event.target).parents('#image-upload-content').find('#uploadInput').prop('checked', true)
    if(jQuery("#testUpload").val() != "") {
        var output = document.getElementById('outputImage');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src) // free memory
            jQuery("#image-upload").addClass("has-custom-image");
            change_custom_preview();
        }
    }
}


/*
Date: 2021-08-04 Chaty in Steps
*/

(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if(typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    }
    else {
        factory(jQuery);
    }
}(function ($, undefined) {
    $(document).ready(function(){

        $(document).on("click", "#chaty-social-channel", function(){
            $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("completed");
            $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("active");
            $(this).addClass("active");
            $(".social-channel-tabs").removeClass("active");
            $("#chaty-tab-social-channel").addClass("active");
            $("#current_step").val(1);
            $(".footer-buttons").removeClass("step-3").removeClass("step-2").addClass("step-1");
        });

        $(document).on("click", "#chaty-app-customize-widget", function(){
            $(".footer-buttons").removeClass("step-3").removeClass("step-1").addClass("step-2");
            checkForFirstStep();
        });

        $(document).on("click", "#chaty-triger-targeting", function(){
            $("#chaty-triger-targeting").removeClass("completed");
            $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("active");
            $(this).addClass("active");
            $("#chaty-social-channel, #chaty-app-customize-widget").addClass("completed");
            $(".social-channel-tabs").removeClass("active");
            $("#chaty-tab-triger-targeting").addClass("active");

            $(".footer-buttons").removeClass("step-1").removeClass("step-2").addClass("step-3");
            $("#current_step").val(3);
        });

        $(document).on("click", "#next-button", function(e){
            e.preventDefault();
            if($("#chaty-social-channel").hasClass("active")) {
                $("#chaty-app-customize-widget").trigger("click");
            } else if($("#chaty-app-customize-widget").hasClass("active")) {
                $("#chaty-triger-targeting").trigger("click");
            }
        });

        $(document).on("click", "#back-button", function(e){
            e.preventDefault();
            if($("#chaty-tab-triger-targeting").hasClass("active")) {
                $("#chaty-triger-targeting").removeClass("completed");
                $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("active");
                $("#chaty-app-customize-widget").addClass("active");
                $("#chaty-social-channel").addClass("completed");
                $(".social-channel-tabs").removeClass("active");
                $("#chaty-tab-customize-widget").addClass("active");
                $(".footer-buttons").removeClass("step-1").removeClass("step-3").addClass("step-2");
                $("#current_step").val(2);
            } else if($("#chaty-app-customize-widget").hasClass("active")) {
                $("#chaty-triger-targeting, #chaty-app-customize-widget").removeClass("completed");
                $(".social-channel-tabs").removeClass("active");
                $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("active");
                $("#chaty-social-channel").addClass("active");
                $("#chaty-tab-social-channel").addClass("active");
                $(".footer-buttons").removeClass("step-2").removeClass("step-3").addClass("step-1");
                $("#current_step").val(1);
            }
        });
    });


    function checkForFirstStep() {
        $(".chaty-popup").hide();
        if($("#cht-form .js-chanel-desktop").length == 0 || $("#cht-form .js-chanel-mobile").length == 0) {
            $("#no-step-device-popup").show();
            return;
        } else if($("#cht-form .js-chanel-desktop:checked").length == 0 && $("#cht-form .js-chanel-mobile:checked").length == 0) {
            $("#device-step-popup").show();
            return;
        }
        $("#chaty-app-customize-widget, #chaty-triger-targeting").removeClass("completed");
        $("#chaty-social-channel, #chaty-app-customize-widget, #chaty-triger-targeting").removeClass("active");
        $("#chaty-app-customize-widget").addClass("active");
        $("#chaty-social-channel").addClass("completed");
        $(".social-channel-tabs").removeClass("active");
        $("#chaty-tab-customize-widget").addClass("active");
        $(".footer-buttons").removeClass("step-1").removeClass("step-3").addClass("step-2");
        $("#current_step").val(2);
    }

}));

/*
Date: 2021-08-04 Agent Functionality
*/

(function (factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if(typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    }
    else {
        factory(jQuery);
    }
}(function ($, undefined) {
    var selectedChannel = "";
    $(document).ready(function(){
        /* AGENT FUNCTIONALITY */
        $(document).on("click", ".customize-agent-button", function(){
            if($(this).closest("li.chaty-channel").find(".agent-info").length == 0) {
                $(this).closest("li.chaty-channel").find(".add-agent-button button").trigger("click");
            }
            change_custom_preview();
        });

        $(document).on("click", ".remove-agent-btn", function(){
            if($(this).closest("ul.agent-list").find("li.agent-info").length == 1) {
                $(this).closest("li.chaty-channel").removeClass("has-agent-view");
                $(this).closest("li.chaty-channel").find(".is-agent-active").val(0);
                $(this).closest("li.chaty-channel").find(".chaty-advance-settings").show();
                $(this).closest("li.chaty-channel").find(".chaty-advance-settings").addClass("active");
            }
            $(this).closest("li.agent-info").remove();
            change_custom_preview();
        });

        $(document).on("click", ".remove-img-icon", function(){
            var thisSlug = $(this).data("slug");
            if($("#image_agent_data_"+thisSlug).length) {
                $("#image_agent_data_"+thisSlug).removeClass("img-active").removeClass("icon-active");
                $("#image_agent_data_"+thisSlug+" .image-id").val("");
                $("#image_agent_data_"+thisSlug+" .fa-icon").val("");
                change_custom_preview();
            }
        });

        $(document).on("click", ".agent-button-action", function(e){
            e.preventDefault();
            $(this).closest("li.chaty-channel").find(".is-agent-active").val(1);
            $(this).closest("li.chaty-channel").addClass("has-agent-view");

            var currentVal = $(this).closest("li.chaty-channel").find(".chaty-default-settings").find(".channels__input").val();

            if($(this).closest("li.chaty-channel").find(".agent-info").length == 0) {
                $(this).closest("li.chaty-channel").find(".add-agent-button button").trigger("click");
                $(this).closest("li.chaty-channel").find(".agent-info").find(".agent-input-value").val(currentVal);

                if(currentVal != "") {
                    $(this).closest("li.chaty-channel").find(".add-agent-button button").trigger("click");
                }
            }

            change_custom_preview();

            $(document).trigger('chatyColorPicker/trigger', [{
                $scope   : $(this).parents('li.chaty-channel'),
                element  : '.chaty-color-field'
            }]);

        });

        $(document).on("click", ".remove-agents-button", function(){
            selectedChannel = $(this).data("id");
            $("#remove-agents-popup").show();
        });


        $(".remove-agent-list").on("click", function(){
            console.log(selectedChannel);
            $("#chaty-social-"+selectedChannel).removeClass("has-agent-view");
            $("#chaty-social-"+selectedChannel+" .is-agent-active").val(0);
            $("#remove-agents-popup").hide();
            change_custom_preview();
        });

        if($(".chaty-channel.has-agent-view .agent-list").length) {
            $(".chaty-channel.has-agent-view .agent-list").each(function(){
                var agentId = $(this).attr("id");
                $("#"+agentId).sortable({
                    placeholder: "ui-chaty-state-hl",
                    items: $("#"+agentId+" > li.agent-info"),
                    handle: '.move-channel-icon',
                    update: function (event, ui) {
                        set_agent_channel_order();
                    }
                });
            })
        }

        $(document).on("click", ".add-agent-button button", function(){
            var thisCount = parseInt($(this).closest(".chaty-agents").data("count"));
            thisCount = thisCount+1;
            var thisSlug = $(this).data("slug");
            $(this).closest(".chaty-agents").data("count", thisCount);
            var tempHtml = $(this).closest(".chaty-agent-advance-setting").find(".default-agent-setting").html();
            tempHtml = tempHtml.replace(/__count__/g,thisCount);
            tempHtml = tempHtml.replace(/chaty-color-field-agent/g,"chaty-color-field");
            tempHtml = tempHtml.replace(/icon-picker-wrap-agent/g,"icon-picker-wrap");
            tempHtml = tempHtml.replace(/chaty-whatsapp-phone-alt/g,"chaty-whatsapp-phone");
            $(this).closest(".chaty-agents").find("ul.agent-list").append("<li class='agent-info'>"+tempHtml+"</li>");

            $(this).closest(".chaty-agents").find("ul.agent-list li.agent-info:last-child .agent-input-value ").focus();
            if($('#agent-icon-picker-'+thisSlug+'-'+thisCount).length && $('#select-agent-icon-'+thisSlug+'-'+thisCount).length) {
                var newIconLib = {
                    "material":{
                        "regular":{
                            "list-icon":"",
                            "icon-style":"mt-regular",
                            "icons":["some","some2"],
                        }
                    }
                }
                AestheticIconPicker({
                    'selector': '#agent-icon-picker-' + thisSlug + '-' + thisCount, // must be an ID
                    'onClick': '#select-agent-icon-' + thisSlug + '-' + thisCount,  // must be an ID
                    "iconLibrary": newIconLib
                });
            }

            change_custom_preview();

            $(document).trigger('chatyColorPicker/trigger', [{
                $scope   : $(this).parents('.chaty-agents'),
                element  : '.chaty-color-field'
            }]);

            var agentId = "agent-list-"+jQuery(this).closest("li.chaty-channel").data("id");
            $("#"+agentId).sortable({
                placeholder: "ui-chaty-state-hl",
                items: $("#"+agentId+" > li.agent-info"),
                handle: '.move-channel-icon',
                update: function (event, ui) {
                    set_agent_channel_order();
                }
            });
        });
    });

    function set_agent_channel_order() {
        $("#channels-selected-list > .chaty-channel.has-agent-view").each(function(){
            var channelId = $(this).data("id");
            var agentOrder = "";
            $("#agent-list-"+channelId+" .agent-channel-setting").each(function(){
                agentOrder += $(this).data("item")+",";
            });
            $("#agent_order_"+channelId).val(agentOrder);
        });
        change_custom_preview();
    }
}));

