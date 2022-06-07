(function ($) {
    "use strict";

    var iaa_selectionMode = false;
    var iaa_elementShow = false;
    var iaa_started = false;
    var iaa_isClosing = false;
    var iaa_pastInteractions = new Array();
    var iaa_talkTimer = false;
    var iaa_previewMode = false;
    iaa_data = iaa_data[0];

    jQuery.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1] || 0;
        }
    };

    function iaa_isIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    jQuery(document).ready(function () {
        jQuery('body').on('iaa_startSelection',iaa_startSelection);
        if (sessionStorage.iaa_interactions) {
            iaa_pastInteractions = jQuery.parseJSON(sessionStorage.iaa_interactions);
        }
    });
    jQuery(window).on('load',function () {
        jQuery.each(iaa_data.steps, function () {
            this.content = jQuery.parseJSON(this.content);
        });
        jQuery.each(iaa_data.links, function () {
            this.conditions = jQuery.parseJSON(this.conditions);
        });

        if (iaa_data.settings.disableMobile == 1 && jQuery(window).width() <= 480) {
        } else {
            if (!iaa_isIframe() || document.referrer.indexOf('wp-admin') < 0) {
                if (iaa_elementShow != "" && iaa_elementShow.length > 0) {
                    iaa_showElement(iaa_elementShow);
                }
                iaa_initAssistant();
            }
            jQuery('*').click(function (e) {
                if (iaa_selectionMode) {
                    if (jQuery(this).children().length == 0 || jQuery(this).is('a') || jQuery(this).is('button') || jQuery(this).is('img') || jQuery(this).is('select')) {
                        e.preventDefault();
                        jQuery('.iaa_selectedDom').removeClass('iaa_selectedDom');
                        jQuery(this).addClass('iaa_selectedDom');                        
                        window.parent.jQuery('body').trigger('iaa_confirmSelectElement', [this]);
                        iaa_selectionMode = false;
                    }

                }
            });
            jQuery(window).resize(function () {
                if (jQuery('.creative_banner[data-id] .cbb_aiAssistant').length > 0) {
                    $assistant = jQuery('#iaa_avatarPreviewContainer');
                    $assistant.children('div:not(#iaa_talkBubble)').hide();
                    $assistant.children('img').hide();
                    $assistant.css({
                        position: 'absolute',
                        top: jQuery('.creative_banner[data-id] .cbb_aiAssistant').offset().top,
                        left: jQuery('.creative_banner[data-id] .cbb_aiAssistant').offset().left + jQuery('.creative_banner[data-id] .cbb_aiAssistant').width() / 2,
                        width: 0,
                        marginLeft: 0,
                        height: jQuery('.creative_banner[data-id] .cbb_aiAssistant').height()
                    });

                    $assistant.find('#iaa_talkBubble').css({
                        bottom: jQuery('.creative_banner[data-id] .cbb_aiAssistant').height() + 20
                    });
                }
            });
        }
    });
    function iaa_startOnStep(title) {
        var stepID = 0;
        jQuery.each(iaa_data.steps, function () {
            if (this.content.title == title) {
                stepID = this.id;
            }
        });
        if (stepID > 0) {
            sessionStorage.iaa_step = stepID;
            sessionStorage.iaa_closed = 0;
            jQuery('#iaa_avatarPreviewContainer').animate({bottom: 0}, 500);
            jQuery('#iaa_talkBubble').fadeIn();
            iaa_initAssistant();
        }
    }
    function iaa_repositionMouth() {
        jQuery('.iaa_avatarContainer img.iaa_avatar_mouth').css({
            top: iaa_data.settings.avatarMouthY + 'px',
            visibility: 'hidden',
            display: 'block'
        });
        jQuery('.iaa_avatarContainer img.iaa_avatar_mouth').css({
            marginLeft: (0 - jQuery('.iaa_avatarContainer img.iaa_avatar_mouth').outerWidth() / 2) + 'px'
        });
        jQuery('.iaa_avatarContainer img.iaa_avatar_mouth').css({
            display: '',
            visibility: 'visible'
        });
    }

    function iaa_initAssistant() {
        if (sessionStorage.iaa_closed != 1) {
            if (jQuery('#iaa_avatarPreviewContainer').length > 0) {
                jQuery('#iaa_avatarPreviewContainer').remove();
            }
            var $assistant = jQuery('<div id="iaa_avatarPreviewContainer" class="iaa_avatarContainer"></div>');
            if (iaa_data.settings.avatar_head == 1) {
                $assistant.addClass('iaa_genderF');
            }
            $assistant.html(
                    '<div class="iaa_avatar_corpse" data-num="' + iaa_data.settings.avatar_corpse + '" data-type="corpse"></div>' +
                    '<div class="iaa_avatar_head" data-num="' + iaa_data.settings.avatar_head + '" data-type="head" ></div>' +
                    '<div class="iaa_avatar_mouth" data-num="1" data-type="mouth" ></div>' +
                    '<div class="iaa_avatar_eyes" data-num="' + iaa_data.settings.avatar_eyes + '" data-type="eyes"></div>' +
                    '<div class="iaa_avatar_hair" data-num="' + iaa_data.settings.avatar_hair + '" data-type="hair" >' +
                    '</div>');
            if (iaa_data.settings.positionScreen == 1) {
                $assistant.addClass('iaa_right');
            } else {
                $assistant.removeClass('iaa_right');
            }
            jQuery('body').append($assistant);

            if (iaa_data.settings.avatarType == 1) {
                jQuery('.iaa_avatarContainer').addClass('iaa_customAvatar');

                if (iaa_data.settings.avatarWidth > 0) {

                    jQuery('.iaa_avatarContainer').css({
                        width: iaa_data.settings.avatarWidth + 'px',
                        height: iaa_data.settings.avatarHeight + 'px'
                    });
                }
                jQuery('.iaa_avatarContainer').append('<img class="iaa_avatar_img" style="width:' + iaa_data.settings.avatarWidth + 'px;height:' + iaa_data.settings.avatarHeight + 'px ;" src="' + iaa_data.settings.avatarImg + '" />');

                jQuery('.iaa_avatarContainer').append('<img class="iaa_avatar_mouth"  style="left:' + iaa_data.settings.avatarWidth / 2 + 'px; width: auto; margin-left: -' + iaa_data.settings.avatarMouthWidth / 2 + 'px;" src="' + iaa_data.settings.avatarTalkImg + '" />');
                jQuery('.iaa_avatarContainer .iaa_avatar_mouth').on('load',iaa_repositionMouth);
            }

            $assistant.append('<div id="iaa_talkBubble"><a href="javascript:" class="iaa_bubbleCloseBtn"><span class="glyphicon glyphicon-remove"></span> </a></div>');
            $assistant.find('#iaa_talkBubble').css({
                bottom: parseInt($assistant.css('height')) + 13
            });
            $assistant.find('.iaa_bubbleCloseBtn').click(iaa_closeAssistant);
            if (sessionStorage.iaa_step && sessionStorage.iaa_step > 0) {
                iaa_loadStep(sessionStorage.iaa_step);
            } else {
                sessionStorage.iaa_step = 0;
                var originStepID = 0;
                jQuery.each(iaa_data.steps, function () {
                    if (this.content.start == 1) {
                        originStepID = this.id;
                    }
                });
                iaa_loadStep(0);
                $assistant.attr('data-originid', originStepID);

            }
            $assistant.click(function () {
                var originStepID = 0;
                jQuery.each(iaa_data.steps, function () {
                    if (this.content.start == 1) {
                        originStepID = this.id;
                    }
                });
                if (!iaa_isClosing) {
                    if (sessionStorage.iaa_step == 0) {
                        iaa_loadStep(originStepID);
                    } else if (sessionStorage.iaa_step == "undefined") {
                        iaa_loadStep(originStepID);
                    }
                }
            });
            if (jQuery('.creative_banner[data-id] .cbb_aiAssistant').length > 0) {
                $assistant.addClass('iaa_cbbActive');
                jQuery('.creative_banner[data-id] .cbb_aiAssistant').css('cursor', 'pointer');
                jQuery('.creative_banner[data-id] .cbb_aiAssistant').click(function () {
                    jQuery('#iaa_avatarPreviewContainer').trigger('click');
                });
                $assistant.children('div:not(#iaa_talkBubble)').hide();
                $assistant.children('img').hide();
                $assistant.css({
                    position: 'absolute',
                    top: jQuery('.creative_banner[data-id] .cbb_aiAssistant').offset().top,
                    left: jQuery('.creative_banner[data-id] .cbb_aiAssistant').offset().left + jQuery('.creative_banner[data-id] .cbb_aiAssistant').width() / 2,
                    width: 0,
                    marginLeft: 0,
                    height: jQuery('.creative_banner[data-id] .cbb_aiAssistant').height()
                });

                $assistant.find('#iaa_talkBubble').css({
                    bottom: jQuery('.creative_banner[data-id] .cbb_aiAssistant').height() + 20
                });
            }

        }
    }
    function iaa_stepBtnClick(btn) {
        var potentialNextSteps = new Array();
        jQuery.each(iaa_data.links, function () {
            if (this.originID == sessionStorage.iaa_step && this.destinationID > 0) {
                potentialNextSteps.push(this);
            }
        });
        var selectedIndex = 0;
        var chkCondition = false;
        jQuery.each(potentialNextSteps, function () {
            var link = this;
            if (link.conditions && link.conditions.length > 0) {
                jQuery.each(link.conditions, function () {
                    var condition = this;
                    var validation = '';
                    var value = '';
                    var min = 0;
                    var max = 0;
                    var type = 'button';
                    var originStepID = condition.interaction.substr(0, condition.interaction.indexOf('_'));
                    var itemID = condition.interaction.substr(condition.interaction.indexOf('_') + 1, condition.interaction.length);
                    var $target = jQuery('[data-id="' + itemID + '"]');
                    if (originStepID == sessionStorage.iaa_step && jQuery('[data-id="' + itemID + '"]').length > 0) {
                        validation = $target.attr('data-validation');
                        type = $target.attr('data-type');
                        value = $target.find('input,select,textarea').val();
                        min = $target.find('input[type="number"]').attr('min');
                        max = $target.find('input[type="number"]').attr('max');
                    } else {
                        var inter = iaa_getBackupInteraction(originStepID, itemID);
                        validation = inter.validation;
                        type = inter.type;
                        value = inter.value;
                        min = inter.min;
                        max = inter.max;
                    }
                    $target.removeClass('iaa_error');

                    if ($target.is('[data-validation="fill"]') && !iaa_isFieldValid(validation, type, value)) {
                        $target.addClass('iaa_error');
                    }

                    switch (condition.action) {
                        case "clicked":
                            if (jQuery('a[data-id="' + itemID + '"]').length > 0 && jQuery(btn).attr('data-id') != itemID) {
                                potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                                    return v != link;
                                });
                            } else if (jQuery('a[data-id="' + itemID + '"]').length == 0 && (!inter || inter.value != 'clicked')) {
                                potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                                    return v != link;
                                });
                            } else {
                                chkCondition = true;
                            }
                            break;
                        case "filled":
                            if (!iaa_isFieldValid(validation, type, value, min, max)) {
                                $target.addClass('iaa_error');
                                potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                                    return v != link;
                                });
                            } else {
                                chkCondition = true;
                            }
                            break;
                        case "equal":
                            if (condition.interaction == '_page') {
                                if (document.location.href == condition.value || document.location.href + '/' == condition.value || document.location.href == condition.value + '/') {
                                    chkCondition = true;
                                } else {
                                    potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                                        return v != link;
                                    });
                                }
                            } else {
                                if (value != condition.value) {
                                    potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                                        return v != link;
                                    });
                                } else {
                                    chkCondition = true;
                                }
                            }
                            break;
                        case "superior":
                            if (condition.interaction == '_date') {
                                var date = new Date();
                                var y = date.getFullYear();
                                var m = date.getMonth() + 1;
                                var d = date.getDate();
                                if (m < 10) {
                                    m = '0' + m;
                                }
                                if (d < 10) {
                                    d = '0' + d;
                                }
                                date = y + '-' + m + '-' + d;
                                date = date.replace("-", "");
                                date = date.replace("-", "");
                                var dateCondition = condition.value.replace("-", "");
                                dateCondition = dateCondition.replace("-", "");
                                if (date < dateCondition) {
                                    potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                                        return v != link;
                                    });
                                } else {
                                    chkCondition = true;
                                }
                            } else {
                                if (parseFloat(value) < parseFloat(condition.value)) {
                                    potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                                        return v != link;
                                    });
                                }
                            }
                            break;
                        case "inferior":
                            if (condition.interaction == '_date') {
                                var date = new Date();
                                var y = date.getFullYear();
                                var m = date.getMonth() + 1;
                                var d = date.getDate();
                                if (m < 10) {
                                    m = '0' + m;
                                }
                                if (d < 10) {
                                    d = '0' + d;
                                }
                                date = y + '-' + m + '-' + d;
                                date = date.replace("-", "");
                                date = date.replace("-", "");
                                var dateCondition = condition.value.replace("-", "");
                                dateCondition = dateCondition.replace("-", "");
                                if (date > dateCondition) {
                                    potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                                        return v != link;
                                    });
                                } else {
                                    chkCondition = true;
                                }
                            } else {
                                if (parseFloat(value) > parseFloat(condition.value)) {
                                    potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                                        return v != link;
                                    });
                                } else {
                                    chkCondition = true;
                                }
                            }
                            break;
                        default:
                            if (!condition.action || condition.action.substr(0, 2) != 'v_' || value != condition.action.substr(2, condition.action.length)) {
                                potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                                    return v != link;
                                });
                            } else {
                                chkCondition = true;

                            }
                            break;

                    }
                });
            }
        });
        if (chkCondition) {
            jQuery.each(potentialNextSteps, function () {
                var link = this;
                if (!link.conditions || link.conditions.length == 0) {
                    potentialNextSteps = jQuery.grep(potentialNextSteps, function (v) {
                        return v != link;
                    });
                }
            });
        }
        if (potentialNextSteps.length > 0 && jQuery('#iaa_talkBubble .iaa_error').length == 0) {
            sessionStorage.iaa_step_done = 0;
            iaa_backupInteractions(btn);
            iaa_loadStep(potentialNextSteps[0].destinationID);
        } else if (jQuery('#iaa_talkBubble .iaa_error').length == 0) {
            iaa_closeAssistant();
        }

    }
    function iaa_getBackupInteraction(stepID, itemID) {
        var rep = false;
        if (sessionStorage.iaa_interactions) {
            iaa_pastInteractions = jQuery.parseJSON(sessionStorage.iaa_interactions);
        }
        jQuery.each(iaa_pastInteractions, function () {
            var interaction = this;
            if (stepID == 0 || interaction.stepID == stepID) {
                jQuery.each(interaction.interactions, function () {
                    if (this.itemID == itemID) {
                        rep = this;
                    }
                });
            }
        });
        return rep;
    }
    function iaa_backupInteractions(btn) {
        var interactions = new Array();
        jQuery('.iaa_talkInteraction .iaa_field').each(function () {
            sessionStorage.iaa_dialog += '<p>' + jQuery(this).children('label').html() + ' : <strong>' + jQuery(this).children('input,select,textarea').val() + '</strong></p>';
            interactions.push({
                itemID: jQuery(this).attr('data-id'),
                validation: jQuery(this).attr('data-validation'),
                type: jQuery(this).attr('data-type'),
                value: jQuery(this).children('input,select,textarea').val(),
                min: jQuery(this).attr('min'),
                max: jQuery(this).attr('max')
            });
        });
        interactions.push({
            itemID: jQuery(btn).attr('data-id'),
            type: 'button',
            value: 'clicked'
        });
        sessionStorage.iaa_dialog += '<p>' + iaa_data.txt_btnClicked + ' : <strong>' + jQuery(btn).html() + '</strong></p>';
        iaa_pastInteractions.push({
            stepID: sessionStorage.iaa_step,
            interactions: interactions
        });
        sessionStorage.iaa_interactions = JSON.stringify(iaa_pastInteractions);
    }
    function iaa_isFieldValid(validation, type, value, min, max) {
        var rep = true;
        switch (validation) {
            case "fill":
                if (value.length == 0 || value == 0) {
                    rep = false;
                }
                if (type == "numberfield" && parseFloat(min) > 0 && parseFloat(value) < parseFloat(min)) {
                    rep = false;
                }
                if (type == "numberfield" && parseFloat(max) > 0 && parseFloat(value) > parseFloat(max)) {
                    rep = false;
                }
                break;
            case "email":
                if (!iaa_checkEmail(value)) {
                    rep = false;
                }
                break;


        }
        return rep;
    }

    function iaa_checkEmail(email) {
        if (email.indexOf("@") != "-1" && email.indexOf(".") != "-1" && email != "") {
            return true;
        } else {
            return false;
        }
    }
    function iaa_closeAssistant() {
        iaa_isClosing = true;
        iaa_pastInteractions = new Array();
        sessionStorage.iaa_dialog = '';
        sessionStorage.iaa_interactions = '';
        sessionStorage.iaa_step_done = '';

        setTimeout(function () {
            iaa_isClosing = false;
            if (iaa_data.settings.disableIntro == 0) {
                if (sessionStorage.iaa_step == 0) {
                    jQuery('#iaa_talkBubble').fadeOut(250);
                    if (iaa_data.settings.hideOnClose == 1) {
                        sessionStorage.iaa_closed = 1;
                        jQuery('#iaa_avatarPreviewContainer').animate({
                            bottom: -200
                        }, 500);
                    }
                } else {
                    sessionStorage.iaa_step = 0;
                    iaa_initAssistant();
                }
            } else {
                sessionStorage.iaa_step = 0;
                jQuery('#iaa_talkBubble').fadeOut(250);
                if (iaa_data.settings.hideOnClose == 1) {
                    sessionStorage.iaa_closed = 1;
                    jQuery('#iaa_avatarPreviewContainer').animate({
                        bottom: -200
                    }, 500);
                }
            }
        }, 250);

    }

    function iaa_checkFields() {
        jQuery('#iaa_talkBubble #iaa_bubbleContent input[type="number"]').keydown(function (e) {
            if (jQuery(this).is('[step="any"]')) {
                if (jQuery.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                        (e.keyCode == 65 && e.ctrlKey === true) ||
                        e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 190 ||
                        (e.keyCode >= 35 && e.keyCode <= 40)) {
                    return;
                }
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            } else {
                if (jQuery.inArray(e.keyCode, [9, 27, 13]) !== -1 ||
                        (e.keyCode == 65 && e.ctrlKey === true) ||
                        (e.keyCode >= 35 && e.keyCode <= 40)) {
                    return;
                }
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            }
        });
    }
    function iaa_say(content) {
        jQuery('#iaa_avatarPreviewContainer').attr('data-talk', '1');
        setTimeout(function () {
            jQuery('#iaa_avatarPreviewContainer').attr('data-talk', '0');
        }, 3000);
        jQuery('#iaa_talkBubble').removeClass('iaa_open');
        jQuery('#iaa_talkBubble').fadeOut(250);
        setTimeout(function () {
            jQuery('#iaa_talkBubble').html('');
            jQuery('#iaa_talkBubble').html('<a href="javascript:" class="iaa_bubbleCloseBtn"><span class="glyphicon glyphicon-remove"></span> </a>');
            jQuery('.iaa_bubbleCloseBtn').hover(function () {
                jQuery(this).addClass('iaa_hover');
            }, function () {
                jQuery(this).removeClass('iaa_hover');
            });
            jQuery('.iaa_bubbleCloseBtn').click(iaa_closeAssistant);
            jQuery('#iaa_talkBubble').css({
                width: content.bubbleWidth,
                height: content.bubbleHeight,
                maxWidth: jQuery(window).width() - (jQuery('#iaa_talkBubble').offset().left + 20),
                maxHeight: jQuery(window).height() - jQuery('#iaa_talkBubble').offset().bottom
            });
            if (content.text || content.interactions) {
                content.text = content.text.replace(/\[b\]/g, "<strong>").replace(/\[\/b\]/g, "</strong>");
                content.text = content.text.replace(/\[u\]/g, "<u>").replace(/\[\/u\]/g, "</u>");
                content.text = content.text.replace(/\r?\n/g, '<br/>');
                var contentText = content.text;
                var elementsToReplace = new Array();
                var i = 0;
                while ((i = contentText.indexOf('[interaction', i)) != -1) {
                    var endPos = contentText.indexOf("]", contentText.indexOf("id='", i) + 4) - 1;
                    var interactionID = contentText.substr(contentText.indexOf("id='", i) + 4, endPos - (contentText.indexOf("id='", i) + 4));
                    var interaction = iaa_getBackupInteraction(0, interactionID);
                    elementsToReplace.push({
                        oldValue: contentText.substr(i, (contentText.indexOf(']', i) + 1) - (i)),
                        newValue: interaction.value
                    });
                    i++;
                }
                jQuery.each(elementsToReplace, function () {
                    contentText = contentText.replace(this.oldValue, this.newValue);
                });

                var interactions = '';
                var buttons = '';
                jQuery('#iaa_talkBubble').append('<div id="iaa_bubbleContent"><div class="iaa_talkText"><p>' + contentText + '</p></div></div>');
                jQuery.each(content.interactions, function () {
                    var options = this;
                    switch (options.type) {
                        case "button":
                            buttons += '<a href="javascript:" class="iaa_btn"  data-id="' + options.itemID + '">' + options.label + '</a>';
                            break;
                        case "textfield":
                            interactions += '<div class="iaa_field" data-type="textfield" data-id="' + options.itemID + '" data-validation="' + options.validation + '"><label>' + options.label + '</label><input type="text" data-valisation="' + options.validation + '" /></div>';
                            break;
                        case "numberfield":
                            var step = '';
                            if (options.decimals == 1) {
                                step = 'step="any"';
                            }
                            interactions += '<div class="iaa_field" data-type="numberfield" data-id="' + options.itemID + '" data-validation="' + options.validation + '"><label>' + options.label + '</label><input type="number" ' + step + ' value="' + options.min + '" min="' + options.min + '" max="' + options.max + '"  /></div>';
                            break;

                        case "select":
                            var values = new Array();
                            var select = '<select>';
                            jQuery.each(options, function (key) {
                                if (key.substr(0, 2) == 's_') {
                                    if (this != "") {
                                        values.push(this);
                                        select += '<option value="' + this + '">' + this + '</option>';
                                    }
                                }
                            });
                            select += '</select>';
                            interactions += '<div class="iaa_field" data-type="select" data-id="' + options.itemID + '"><label>' + options.label + '</label>' + select + '</div>';

                            break;
                    }
                    ;
                });
                interactions += '<p class="iaa_btns">' + buttons + '</p>';
                jQuery('#iaa_talkBubble #iaa_bubbleContent').append('<div class="iaa_talkInteraction">' + interactions + '</div>');
                jQuery('#iaa_talkBubble #iaa_bubbleContent .iaa_btn').on('click',function(){
                    iaa_stepBtnClick(this);
                });
            } else if (typeof (content) == 'string' && content.length > 0) {
                content = content.replace(/\[b\]/g, "<strong>").replace(/\[\/b\]/g, "</strong>");
                content = content.replace(/\[u\]/g, "<u>").replace(/\[\/u\]/g, "</u>");
                content = content.replace(/\r?\n/g, '<br/>');
                jQuery('#iaa_talkBubble').append('<div id="iaa_bubbleContent"><div class="iaa_talkText"><p>' + content + '</p></div></div>');
            }
            if (content.title) {
                sessionStorage.iaa_dialog += '<h2>' + content.title + '</h2>';
                sessionStorage.iaa_dialog += '<p>' + contentText + '</p>';
            }
            if ((jQuery('#iaa_talkBubble .iaa_talkText p').length > 0 && jQuery('#iaa_talkBubble .iaa_talkText p').html().length > 0) ||
                    (jQuery('#iaa_talkBubble .iaa_talkInteraction').length > 0 && jQuery('#iaa_talkBubble .iaa_talkInteraction').html().length > 0)) {

                if (jQuery('.creative_banner[data-id] .cbb_aiAssistant').length > 0) {
                    jQuery('#iaa_talkBubble').css({
                        opacity: 0,
                        display: 'block'
                    });
                    jQuery('#iaa_talkBubble').css({
                        left: 0 - jQuery('#iaa_talkBubble').width() / 2,
                        opacity: 1
                    });
                    jQuery('#iaa_talkBubble').hide();
                }
                jQuery('#iaa_talkBubble').fadeIn(250);
                iaa_talk();
            }
            setTimeout(function () {
                if (jQuery('#iaa_bubbleContent').length > 0 && jQuery('#iaa_bubbleContent')[0].scrollHeight > jQuery('#iaa_talkBubble').height()) {
                    jQuery('#iaa_talkBubble').css({
                        paddingRight: 6
                    });
                    jQuery('.iaa_bubbleCloseBtn').css({
                        marginRight: 2
                    });
                    jQuery('#iaa_bubbleContent').css({
                        paddingRight: 4
                    });
                } else {
                    jQuery('#iaa_talkBubble').css({
                        paddingRight: 18
                    });
                    jQuery('.iaa_bubbleCloseBtn').css({
                        marginRight: -12
                    });
                    jQuery('#iaa_bubbleContent').css({
                        paddingRight: 0
                    });
                }
            }, 250);

            iaa_checkFields();

            jQuery('#iaa_talkBubble').addClass('iaa_open');
        }, 400);

    }

    function iaa_loadStep(stepID) {
        jQuery('.iaa_selectedDom').removeClass('iaa_selectedDom');
        sessionStorage.iaa_step = stepID;
        if (stepID > 0) {
            var step = iaa_getStepByID(stepID);
            if (!step) {
                iaa_loadStep(0);
            } else {
                iaa_initActions(step);
            }
        } else {
            sessionStorage.iaa_interactions = '[]';
            sessionStorage.iaa_step_done = 0;
            sessionStorage.iaa_redir = 0;
            sessionStorage.iaa_dialog = '';
            if (iaa_data.settings.disableIntro == 1) {
                var originStepID = 0;
                jQuery.each(iaa_data.steps, function () {
                    if (this.content.start == 1) {
                        originStepID = this.id;
                    }
                });
                iaa_loadStep(originStepID);
            } else {
                iaa_say(iaa_data.settings.initialText);
            }
            jQuery('#iaa_talkBubble').css('height', 'auto');
        }
    }

    function iaa_getStepByID(stepID) {
        var rep = false;
        jQuery.each(iaa_data.steps, function () {
            if (this.id == stepID) {
                rep = this;
            }
        });
        return rep;
    }
    function iaa_initActions(step) {
        sessionStorage.iaa_step_done = 0;
        if (step.content.actions.length == 0) {
            iaa_say(step.content);
        }
        jQuery.each(step.content.actions, function () {
            var action = this;
            jQuery.each(action, function (key) {
                eval('action.' + key + ' = action.' + key + '.replace(/\\[g\\]/g,\'"\');');
            });
            switch (action.type) {
                case "sendEmail":
                    jQuery.ajax({
                        url: iaa_data.ajaxurl,
                        type: 'post',
                        data: {
                            action: 'iaa_sendDialogEmail',
                            dialog: sessionStorage.iaa_dialog,
                            sendTo: action.email,
                            subject: action.subject
                        }
                    });
                    iaa_say(step.content);
                    break;
                case "changeUrl":
                    if (!sessionStorage.iaa_redir || sessionStorage.iaa_redir != step.id) {
                        sessionStorage.iaa_redir = step.id;
                        var currentUrl = document.location.href;
                        if (document.location.href.indexOf('iaa_action') > 0) {
                            currentUrl = document.location.href.substr(0, document.location.href.indexOf('iaa_action'));
                        }
                        if (currentUrl != action.url && action.url + '/' != currentUrl && currentUrl + '/' != action.url) {
                            var website = iaa_data.siteUrl;
                            website = website.replace('http://', '');
                            website = website.replace('https://', '');
                            website = website.replace('www.', '');
                            if (action.url.indexOf(website) < 0) {
                                sessionStorage.iaa_step = 0;
                            }
                            if (action.url.indexOf('[LANG]') > -1) {
                                if (iaa_data.wmplDef == iaa_data.wpmlLang) {
                                    iaa_data.wpmlLang = "";
                                }
                                action.url = action.url.replace(/[LANG]/g, iaa_data.wpmlLang);
                            }
                            if (document.location.href.indexOf('iaa_action=preview') > -1) {
                                if (action.url.indexOf('?') > 0) {
                                    document.location.href = action.url + '&iaa_action=preview';
                                } else {
                                    document.location.href = action.url + '?iaa_action=preview';
                                }
                            } else {
                                document.location.href = action.url;
                            }
                        } else {
                            iaa_say(step.content);
                        }

                    } else {
                        var currentUrl = document.location.href;
                        if (document.location.href.indexOf('iaa_action') > 0) {
                            currentUrl = document.location.href.substr(0, document.location.href.indexOf('iaa_action') - 1);
                        }
                        if (currentUrl != action.url && action.url + '/' != currentUrl && currentUrl + '/' != action.url) {
                            sessionStorage.iaa_step = 0;

                            iaa_closeAssistant();
                        } else {
                            iaa_say(step.content);
                        }
                    }
                    break;
                case "executeJS":
                    iaa_say(step.content);
                    action.executeJS = action.executeJS.replace(/\|g\|/g, '"');
                    eval(action.executeJS);
                    break;
                case "showElement":
                    if (document.location.href != action.url && action.url + '/' != document.location.href && document.location.href + '/' != action.url) {
                        var website = iaa_data.siteUrl;
                        website = website.replace('http://', '');
                        website = website.replace('https://', '');
                        website = website.replace('www.', '');
                        if (action.url.indexOf(website) < 0) {
                            sessionStorage.iaa_step = 0;
                        }

                        if (action.url.indexOf('[LANG]') > -1) {
                            if (iaa_data.wmplDef == iaa_data.wpmlLang) {
                                iaa_data.wpmlLang = "";
                            }
                            action.url = action.url.replace(/[LANG]/g, iaa_data.wpmlLang);
                        }
                        if (!sessionStorage.iaa_redir || sessionStorage.iaa_redir != step.id) {
                            sessionStorage.iaa_redir = step.id;
                            document.location.href = action.url;
                        }
                    } else {
                        iaa_showElement(action.element);
                        iaa_say(step.content);
                    }
                    break;
                case "sendInteractions":
                    iaa_say(step.content);
                    jQuery.ajax({
                        url: action.url,
                        type: 'post',
                        action: {
                            interactions: iaa_pastInteractions
                        }
                    });
                    break;
                default:
                    iaa_say(step.content);
                    break;

            }
        });
        sessionStorage.iaa_step_done = 1;
    }

    function iaa_startSelection() {
        iaa_selectionMode = true;
    }

    function iaa_showElement(el, avatarImg) {
        if (jQuery(el).length > 0) {
            jQuery(el).addClass('iaa_selectedDom');
            if (iaa_isAnyParentFixed(jQuery(el))) {

                jQuery('html,body').animate({scrollTop: jQuery(el).position().top - 200}, 500);
            } else {
                jQuery('html,body').animate({scrollTop: jQuery(el).offset().top - 200}, 500);
            }
        }
    }

    function iaa_isAnyParentFixed($el, rep) {
        if (!rep) {
            var rep = false;
        }
        try {
            if ($el.parent().length > 0 && $el.parent().css('position') == "fixed") {
                rep = true;
            }
        } catch (e) {
        }
        if (!rep && $el.parent().length > 0) {
            rep = iaa_isAnyParentFixed($el.parent(), rep);
        }
        return rep;
    }
    function iaa_talk() {
        if (!iaa_talkTimer) {
            iaa_talkTimer = setInterval(function () {
                iaa_talk();
            }, 200);
        }
        if (jQuery('#iaa_avatarPreviewContainer').attr('data-talk') == "1") {
            if (jQuery('#iaa_avatarPreviewContainer .iaa_avatar_mouth').is('.iaa_talk')) {
                jQuery('#iaa_avatarPreviewContainer .iaa_avatar_mouth').removeClass('iaa_talk');
            } else {
                jQuery('#iaa_avatarPreviewContainer .iaa_avatar_mouth').addClass('iaa_talk');
            }
        } else {
            jQuery('#iaa_avatarPreviewContainer .iaa_avatar_mouth').removeClass('iaa_talk');
            if (iaa_talkTimer) {
                clearInterval(iaa_talkTimer);
                iaa_talkTimer = false;
            }
        }
    }

})(jQuery);