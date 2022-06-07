(function ($) {
    "use strict";

    var iaa_isLinking = false;
    var iaa_links = new Array();
    var iaa_linkCurrentIndex = -1;
    var iaa_canvasTimer;
    var iaa_mouseX, iaa_mouseY;
    var iaa_linkGradientIndex = 1;
    var iaa_itemWinTimer;
    var iaa_currentDomElement = false;
    var iaa_currentStep = false;
    var iaa_defaultStep = false;
    var iaa_steps = false;
    var iaa_params;
    var iaa_lock = false;
    var iaa_currentLinkIndex = 0;
    var iaa_settings;
    var iaa_formfield;
    var iaa_canSaveLink = true;


    iaa_data = iaa_data[0];
    jQuery(document).ready(function () {
        jQuery('body').append('<div id="iaa_loader"><div class="iaa_spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>');
        jQuery('#iaa_loader').fadeIn();
        jQuery('#iaa_stepsContainer').droppable({
            drop: function (event, ui) {
                var $object = jQuery(ui.draggable[0]);
                jQuery.ajax({
                    url: ajaxurl,
                    type: 'post',
                    data: {
                        action: 'iaa_saveStepPosition',
                        stepID: $object.attr('data-stepid'),
                        posX: parseInt($object.css('left')),
                        posY: parseInt($object.css('top'))
                    }
                });
            }
        });

        jQuery('.imageBtn').click(function () {
            iaa_formfield = jQuery(this).prev('input');
            tb_show('', 'media-upload.php?TB_iframe=true');

            return false;

        });
        window.old_tb_remove = window.tb_remove;
        window.tb_remove = function () {
            window.old_tb_remove();
            iaa_formfield = null;
        };
        window.original_send_to_editor = window.send_to_editor;
        window.send_to_editor = function (html) {
            if (iaa_formfield) {
                fileurl = jQuery('img', html).attr('src');
                jQuery(iaa_formfield).val(fileurl);
                if (jQuery(iaa_formfield).attr('id') == 'iaa_settings_avatarImg') {
                    iaa_autoSaveSettings();
                }
                if (jQuery(iaa_formfield).attr('id') == 'iaa_settings_avatarTalkImg') {
                    iaa_autoSaveSettings();
                }
                tb_remove();
            } else {
                window.original_send_to_editor(html);
            }
        };
        jQuery('#iaa_avatarCustomPreview #iaa_avatarCustomPreview_mouth').draggable({
            containment: "#iaa_avatarCustomPreviewContent",
            axis: "y"
        });

        jQuery('.colorpick').each(function () {
            var $this = jQuery(this);
            if (jQuery(this).prev('.iaa_colorPreview').length == 0) {
                jQuery(this).before('<div class="iaa_colorPreview" style="background-color:#' + $this.val().substr(1, 7) + '"></div>');
            }
            jQuery(this).prev('.iaa_colorPreview').click(function () {
                jQuery(this).next('.colorpick').trigger('click');
            });
            jQuery(this).colpick({
                color: $this.val().substr(1, 7),
                onChange: function (hsb, hex, rgb, el, bySetColor) {
                    jQuery(el).val('#' + hex);
                    jQuery(el).prev('.iaa_colorPreview').css({
                        backgroundColor: '#' + hex
                    });
                }
            });
        });
        if (jQuery('#iaa_winActivation').is('[data-show="true"]') && document.location.href.indexOf('admin.php?page=iaa_') > -1) {
            jQuery('#iaa_winActivation').modal('show');
            jQuery('#iaa_winActivation .modal-dialog').hover(function () {
                jQuery(this).addClass('iaa_hover');
            }, function () {
                jQuery(this).removeClass('iaa_hover');
            });
            iaa_lock = true;
            jQuery('#iaa_closeWinActivationBtn').click(function () {
                if (!iaa_lock) {
                    jQuery('#iaa_winActivation').modal('hide');
                }
            });
            jQuery('#iaa_closeWinActivationBtn .iaa_text').data('num', 10).html('Wait 10 seconds');
            iaa_actTimer = setInterval(function () {
                var num = jQuery('#iaa_closeWinActivationBtn .iaa_text').data('num');
                num--;
                if (num > 0) {
                    jQuery('#iaa_closeWinActivationBtn .iaa_text').data('num', num).html('Wait ' + num + ' seconds');
                } else {
                    jQuery('#iaa_closeWinActivationBtn').removeClass('disabled');
                    iaa_lock = false;
                    jQuery('#iaa_closeWinActivationBtn .iaa_text').data('num', '').html('Close');
                }
            }, 1000);
        } else {
            jQuery('#iaa_winActivation').attr('data-show', 'false');
        }
        jQuery('#iaa_winActivation').on('hide.bs.modal', function (e) {
            if (iaa_lock && !jQuery('#iaa_winActivation .modal-dialog').is('.iaa_hover')) {
                e.preventDefault();
            }
        });
        jQuery('#wpwrap').css({
            height: jQuery('#iaa_bootstraped').height() + 48
        });
        setInterval(function () {
            if (jQuery('#iaa_winStep').css('display') == 'block') {
                jQuery('#wpwrap').css({
                    height: jQuery('#iaa_winStep').height() + 48
                });

            } else {
                jQuery('#wpwrap').css({
                    height: jQuery('#iaa_bootstraped').height() + 48
                });

            }
        }, 1000);

        jQuery('#iaa_settings_avatarType').change(function () {
            if (jQuery('#iaa_settings_avatarType').val() == '0') {
                jQuery('#iaa_avatarDefault').show();
                jQuery('#iaa_avatarCustom').hide();
            } else {
                jQuery('#iaa_avatarDefault').hide();
                jQuery('#iaa_avatarCustom').show();
            }
            iaa_settings_updatePreviewCustomAvatar();
        });

        iaa_canvasTimer = setInterval(iaa_updateStepCanvas, 30);
        jQuery(document).mousemove(function (e) {
            if (iaa_isLinking) {
                iaa_mouseX = e.pageX - jQuery('#iaa_stepsContainer').offset().left;
                iaa_mouseY = e.pageY - jQuery('#iaa_stepsContainer').offset().top;
            }
        });
        jQuery(window).resize(iaa_updateStepsDesign);
        if (jQuery('#iaa_bootstraped.iaa_bootstraped  [data-toggle="select"]').length > 0) {
            jQuery('#iaa_bootstraped.iaa_bootstraped  [data-toggle="select"]').select2();
        }
        iaa_itemWinTimer = setInterval(iaa_updateWinItemPosition, 30);
        jQuery('#iaa_actionSelect').change(function () {
            iaa_changeActionBubble(jQuery('#iaa_actionSelect').val());
        });
        jQuery('#iaa_interactionSelect').change(function () {
            iaa_changeInteractionBubble(jQuery('#iaa_interactionSelect').val());
        });

        jQuery('#iaa_interactionBubble,#iaa_actionBubble,#iaa_linkBubble').hover(function () {
            jQuery(this).addClass('iaa_hover');
        }, function () {
            jQuery(this).removeClass('iaa_hover');
        });
        jQuery('body').click(function () {
            if (!jQuery('#iaa_interactionBubble').is('.iaa_hover')) {
                jQuery('#iaa_interactionBubble').fadeOut();
            }
            if (!jQuery('#iaa_actionBubble').is('.iaa_hover') && !jQuery('#iaa_websiteFrame').is('.iaa_hover') && !jQuery('.iaa_selectElementPanel').is('.iaa_hover')) {
                jQuery('#iaa_actionBubble').fadeOut();
            }
            if (!jQuery('#iaa_linkBubble').is('.iaa_hover')) {
                jQuery('#iaa_linkBubble').fadeOut();
            }
        });
        $('body').on('iaa_confirmSelectElement',function(e,element){iaa_confirmSelectElement(element)});
        jQuery(document).mousedown(function (e) {
            if (e.button == 2 && iaa_isLinking) {
                iaa_isLinking = false;
            }
        });
        jQuery('.iaa_avatarSettingsField a').click(iaa_avatarChangePart);
        jQuery('#iaa_stepText,#iaa_stepTitle').keyup(iaa_previewStep);
        iaa_loadSteps();
        iaa_loadSettings();

        $('[data-action="iaa_closeSettings"]').on('click', iaa_closeSettings);
        $('[data-action="iaa_openSettings"]').on('click', iaa_openSettings);
        $('[data-action="iaa_saveSettings"]').on('click', iaa_saveSettings);
        $('[data-action="iaa_saveStep"]').on('click', iaa_saveStep);
        $('[data-action="iaa_addLinkInteraction"]').on('click', iaa_addLinkInteraction);
        $('[data-action="iaa_linkDel"]').on('click', iaa_linkDel);
        $('[data-action="iaa_interactionSave"]').on('click', iaa_interactionSave);
        $('[data-action="iaa_interactionDel"]').on('click', iaa_interactionDel);
        $('[data-action="iaa_startSelectElement"]').on('click', iaa_startSelectElement);
        $('[data-action="iaa_actionSave"]').on('click', iaa_actionSave);
        $('[data-action="iaa_actionDel"]').on('click', iaa_actionDel);
        $('[data-action="iaa_checkLicense"]').on('click', iaa_checkLicense);
        $('[data-action="iaa_removeAllSteps"]').on('click', iaa_removeAllSteps);
        $('[data-action="iaa_checkLicense"]').on('click', iaa_checkLicense);
        $('[data-action="iaa_linkSave"]').on('click', iaa_linkSave);

        $('[data-action="iaa_importIA"]').on('click', function () {
            $('#iaa_importForm').submit();
        });
        $('[data-action="iaa_addNewStep"]').on('click', function () {
            iaa_addStep(iaa_data['txt_myStep']);
        });
        $('[data-action="iaa_openWinAction"]').on('click', function () {
            iaa_openWinAction(jQuery(this));
        });
        $('[data-action="iaa_openWinInteraction"]').on('click', function () {
            iaa_openWinInteraction(jQuery(this));
        });

    });

    function iaa_autoSaveSettings() {
        sessionStorage.openSettings = 1;
        iaa_saveSettings();
    }

    function iaa_loadSteps() {

        jQuery('#iaa_stepsContainer .iaa_stepBloc,.iaa_loadSteps,.iaa_linkPoint').remove();
        jQuery.ajax({
            url: ajaxurl,
            type: 'post',
            data: {
                action: 'iaa_loadSteps'
            },
            success: function (rep) {
                rep = JSON.parse(rep);
                iaa_params = rep.params;
                iaa_steps = rep.steps;
                jQuery.each(rep.steps, function (index) {
                    var step = this;
                    step.content = JSON.parse(step.content);
                    iaa_addStep(step);
                });
                jQuery.each(rep.links, function (index) {
                    var link = this;
                    link.originID = jQuery('.iaa_stepBloc[data-stepid="' + link.originID + '"]').attr('id');
                    link.destinationID = jQuery('.iaa_stepBloc[data-stepid="' + link.destinationID + '"]').attr('id');
                    link.conditions = JSON.parse(link.conditions);
                    iaa_links[index] = link;
                });
                jQuery('#iaa_loader').fadeOut();
            }
        });
    }
    function iaa_getStepByID(stepID) {
        var rep = false;
        jQuery.each(iaa_steps, function (i) {
            if (this.id == stepID) {
                rep = this;
            }
        });
        return rep;
    }
    function iaa_addStep(step) {
        var title = '';
        var startStep = 0;
        if (!step.content) {
            title = step;
        } else {
            title = step.content.title;

        }
        var newStep = jQuery('<div class="iaa_stepBloc palette palette-clouds"><div class="iaa_stepBlocWrapper"><h4>' + title + '</h4></div>' +
                '<a href="javascript:" class="iaa_btnEdit"><span class="glyphicon glyphicon-pencil"></span></a>' +
                '<a href="javascript:" class="iaa_btnSup"><span class="glyphicon glyphicon-trash"></span></a>' +
                '<a href="javascript:" class="iaa_btnLink"><span class="glyphicon glyphicon-link"></span></a>' +
                '<a href="javascript:" class="iaa_btnStart"><span class="glyphicon glyphicon-flag"></span></a></div>');
        if (step.content && step.content.start == 1) {
            newStep.find('.iaa_btnStart').addClass('iaa_selected');
            newStep.addClass('iaa_selected');
        }
        if (step.elementID) {
            newStep.attr('id', step.elementID);

        } else {
            newStep.uniqueId();
        }

        newStep.children('a.iaa_btnEdit').click(function () {
            iaa_openWinStep(jQuery(this).parent().attr('data-stepid'));
        });
        newStep.children('a.iaa_btnLink').click(function () {
            iaa_startLink(jQuery(this).parent().attr('id'));
        });
        newStep.children('a.iaa_btnSup').click(function () {
            iaa_removeStep(jQuery(this).parent().attr('data-stepid'));
        });
        newStep.children('a.iaa_btnStart').click(function () {
            jQuery('.iaa_stepBloc[data-stepid]').find('.iaa_btnStart').removeClass('iaa_selected');
            jQuery('.iaa_stepBloc[data-stepid]').find('.iaa_btnStart').closest('.iaa_stepBloc').removeClass('iaa_selected');
            jQuery.each(iaa_steps, function () {
                var step = this;
                if (step.id != jQuery(this).parent().attr('data-stepid') && step.content.start == 1) {
                    step.content.start = 0;
                    jQuery.ajax({
                        url: ajaxurl,
                        type: 'post',
                        data: {
                            action: 'iaa_saveStep',
                            step: JSON.stringify(step.content)
                        },
                        success: function () {
                            iaa_loadSteps();
                        }
                    });
                }
            });
            jQuery(this).addClass('iaa_selected');
            jQuery(this).closest('.iaa_stepBloc').addClass('iaa_selected');
            var currentStep = iaa_getStepByID(jQuery(this).parent().attr('data-stepid'));
            currentStep.content.start = 1;
            jQuery.ajax({
                url: ajaxurl,
                type: 'post',
                data: {
                    action: 'iaa_saveStep',
                    step: JSON.stringify(currentStep.content)
                }
            });
        });


        newStep.draggable({
            containment: "parent",
            handle: ".iaa_stepBlocWrapper"
        });
        newStep.children('.iaa_stepBlocWrapper').click(function () {
            if (iaa_isLinking) {
                iaa_stopLink(newStep);
            }
        });
        var posX = 10, posY = 10;
        if (step.content && step.content.previewPosX) {
            posX = step.content.previewPosX;
            posY = step.content.previewPosY;
        } else {
            posX = jQuery('#iaa_stepsOverflow').scrollLeft() + jQuery('#iaa_stepsOverflow').width() / 2 - 64;
            posY = jQuery('#iaa_stepsOverflow').scrollTop() + jQuery('#iaa_stepsOverflow').height() / 2 - 64;
        }
        newStep.hide();
        jQuery('#iaa_stepsContainer').append(newStep);
        newStep.css({
            left: (posX) + 'px',
            top: posY + 'px'
        });
        newStep.fadeIn();
        iaa_updateStepsDesign();
        jQuery('.iaa_btnWinClose').parent().click(function () {
            iaa_closeWin(jQuery(this).parents('.iaa_window'));
        });
        if (iaa_steps.length == 0) {
            startStep = 1;
        }
        if (step.id) {
            newStep.attr('data-stepid', step.id);
        } else {
            jQuery.ajax({
                url: ajaxurl,
                type: 'post',
                data: {
                    action: 'iaa_addStep',
                    elementID: newStep.attr('id'),
                    previewPosX: posX,
                    previewPosY: posY,
                    start: startStep
                },
                success: function (step) {
                    step = jQuery.parseJSON(step);
                    newStep.attr('data-stepid', step.id);
                    if (step.start == 1) {
                        newStep.find('.iaa_btnStart').addClass('iaa_selected');
                        newStep.addClass('iaa_selected');
                    }
                    iaa_steps.push({
                        content: step
                    });
                }
            });
        }
    }

    function iaa_removeStep(stepID) {
        var i = 0;

        jQuery('.iaa_stepBloc[data-stepid="' + stepID + '"]').remove();
        jQuery.ajax({
            url: ajaxurl,
            type: 'post',
            data: {
                action: 'iaa_removeStep',
                stepID: stepID
            },
            success: function () {
            }
        });
    }
    function iaa_updateStepsDesign() {
        jQuery('#wpwrap').css({
            height: jQuery('#iaa_bootstraped').height() + 48
        });
        jQuery('#iaa_stepsCanvas').attr('width', jQuery('#iaa_stepsContainer').outerWidth());
        jQuery('#iaa_stepsCanvas').attr('height', jQuery('#iaa_stepsContainer').outerHeight());
        jQuery('#iaa_stepsCanvas').css({
            width: jQuery('#iaa_stepsContainer').outerWidth(),
            height: jQuery('#iaa_stepsContainer').outerHeight()
        });
        jQuery('#iaa_stepsContainer .iaa_stepBloc > .iaa_stepBlocWrapper > h4').each(function () {
            jQuery(this).css('margin-top', 0 - jQuery(this).height() / 2);
        });
    }

    function iaa_repositionLinkPoint(linkIndex) {
        var link = iaa_links[linkIndex];
        var originLeft = (jQuery('#' + link.originID).offset().left - jQuery('#iaa_stepsContainer').offset().left) + jQuery('#' + link.originID).width() / 2;
        var originTop = (jQuery('#' + link.originID).offset().top - jQuery('#iaa_stepsContainer').offset().top) + jQuery('#' + link.originID).height() / 2;
        var destinationLeft = (jQuery('#' + link.destinationID).offset().left - jQuery('#iaa_stepsContainer').offset().left) + jQuery('#' + link.destinationID).width() / 2;
        var destinationTop = (jQuery('#' + link.destinationID).offset().top - jQuery('#iaa_stepsContainer').offset().top) + jQuery('#' + link.destinationID).height() / 2;
        var posX = originLeft + (destinationLeft - originLeft) / 2;
        var posY = originTop + (destinationTop - originTop) / 2;

        jQuery.each(iaa_links, function (i) {
            if (this.originID == link.destinationID && this.destinationID == link.originID && i < linkIndex) {

                posX += 15;
                posY += 15;
            }
        });
        jQuery('.iaa_linkPoint[data-linkindex="' + linkIndex + '"]').css({
            left: posX + 'px',
            top: posY + 'px'
        });
    }
    function iaa_loadSettings() {
        jQuery.ajax({
            url: ajaxurl,
            type: 'post',
            data: {
                action: 'iaa_loadSettings'
            },
            success: function (settings) {
                settings = jQuery.parseJSON(settings);
                iaa_settings = settings;
                jQuery('.iaa_avatarContainer [data-type="corpse"]').attr('data-num', settings.avatar_corpse);
                jQuery('.iaa_avatarContainer [data-type="hair"]').attr('data-num', settings.avatar_hair);
                jQuery('.iaa_avatarContainer [data-type="head"]').attr('data-num', settings.avatar_head);
                jQuery('.iaa_avatarContainer [data-type="eyes"]').attr('data-num', settings.avatar_eyes);
                jQuery('.iaa_avatarContainer [data-type="mouth"]').attr('data-num', settings.avatar_mouth);
                jQuery('#iaa_settings_position').val(settings.positionScreen);
                jQuery('#iaa_settings_initialText').val(settings.initialText);
                jQuery('#iaa_settings_enable').val(settings.enabled);
                jQuery('#iaa_settings_hideOnClose').val(settings.hideOnClose);
                jQuery('#iaa_settings_colorBubble').val(settings.colorBubble);
                jQuery('#iaa_settings_colorText').val(settings.colorText);
                jQuery('#iaa_settings_colorButtons').val(settings.colorButtons);
                jQuery('#iaa_settings_colorButtonsText').val(settings.colorButtonsText);
                jQuery('#iaa_settings_colorShine').val(settings.colorShine);
                jQuery('#iaa_settings_avatarType').val(settings.avatarType);
                jQuery('#iaa_settings_disableIntro').val(settings.disableIntro);
                jQuery('#iaa_settings_useWPML').val(settings.useWPML);
                jQuery('#iaa_settings_disableMobile').val(settings.disableMobile);

                if (iaa_settings.avatarType) {
                    jQuery('#iaa_avatarCustomPreviewContent img').load(function () {
                        iaa_settings_updatePreviewCustomAvatar();
                    });
                }
                iaa_settings_updatePreviewCustomAvatar();

                if (sessionStorage.openSettings && sessionStorage.openSettings == 1) {
                    sessionStorage.openSettings = 0;
                    iaa_openSettings();
                }
            }
        });
    }
    function iaa_settings_updatePreviewCustomAvatar() {
        if (jQuery('#iaa_settings_avatarType').val() == '1') {
            jQuery('.iaa_avatarContainer').addClass('iaa_customAvatar');
            if (jQuery('#iaa_avatarCustomPreviewContent').width() > 0) {
                jQuery('.iaa_avatarContainer').css({
                    width: jQuery('#iaa_avatarCustomPreviewContent').width() + 'px',
                    height: jQuery('#iaa_avatarCustomPreviewContent').height() + 'px'
                });
                jQuery('.iaa_avatarContainer').append('<img class="iaa_avatar_img" style="width: 100%; height: 100%; position: relative;" src="' + jQuery('#iaa_avatarCustomPreviewContent > img:eq(0)').attr('src') + '" />');
                jQuery('.iaa_avatarContainer').append('<img class="iaa_avatar_mouth" style="left:' + jQuery('#iaa_avatarCustomPreviewContent').width() / 2 + 'px; margin-left: -' + jQuery('#iaa_avatarCustomPreview_mouth').width() / 2 + 'px;" src="' + jQuery('#iaa_avatarCustomPreviewContent > img:eq(1)').attr('src') + '" />');
                jQuery('.iaa_avatarContainer img.iaa_avatar_mouth').css({
                    top: jQuery('#iaa_avatarCustomPreviewContent > img:eq(1)').css('top')
                });
                jQuery('#iaa_avatarCustomPreview_mouth').css({
                    left: '50%',
                    top: jQuery('#iaa_avatarCustomPreviewContent > img:eq(1)').css('top'),
                    marginLeft: (0 - jQuery('#iaa_avatarCustomPreview_mouth').width() / 2) + 'px'
                });
            } else {
                jQuery('.iaa_avatarContainer').css({
                    width: iaa_settings.avatarWidth + 'px',
                    height: iaa_settings.avatarHeight + 'px'
                });
                jQuery('.iaa_avatarContainer').append('<img class="iaa_avatar_img" style="width: 100%; height: 100%; position: relative;" src="' + iaa_settings.avatarImg + '" />');
                jQuery('.iaa_avatarContainer').append('<img class="iaa_avatar_mouth" style="left:' + iaa_settings.avatarWidth / 2 + 'px; margin-left: -' + iaa_settings.avatarMouthWidth / 2 + 'px;" src="' + iaa_settings.avatarTalkImg + '" />');
                jQuery('.iaa_avatarContainer img.iaa_avatar_mouth').css({
                    top: iaa_settings.avatarMouthY + 'px'
                });
                jQuery('#iaa_avatarCustomPreview_mouth').css({
                    left: '50%',
                    top: iaa_settings.avatarMouthY + 'px',
                    marginLeft: (0 - jQuery('#iaa_avatarCustomPreview_mouth').width() / 2) + 'px'
                });
            }
        } else {
            jQuery('.iaa_avatarContainer img').remove();
            jQuery('.iaa_avatarContainer').removeClass('iaa_customAvatar');
            jQuery('.iaa_avatarContainer').css({
                width: 128,
                height: 146
            });
            jQuery('#iaa_bootstraped.iaa_bootstraped .iaa_talkBubble').css({
                bottom: '96px'
            });
        }

        jQuery('#iaa_talkBubble').each(function () {
            jQuery(this).css({
                bottom: parseInt(jQuery(this).closest('.iaa_avatarContainer').css('height')) + 13
            });
        });
    }
    function iaa_openSettings() {
        if (iaa_settings.avatarType == 1) {
            jQuery('#iaa_avatarDefault').hide();
            jQuery('#iaa_avatarCustom').show();
        } else {
            jQuery('#iaa_avatarDefault').show();
            jQuery('#iaa_avatarCustom').hide();
        }
        jQuery('#iaa_panelPreview').fadeOut();
        jQuery('#iaa_panelSettings').fadeIn();

        jQuery('#iaa_avatarCustomPreview_mouth').css({
            left: '50%',
            top: iaa_settings.avatarMouthY + 'px',
            marginLeft: 0 - jQuery('#iaa_avatarCustomPreview_mouth').width() / 2
        });

    }

    function iaa_closeSettings() {
        jQuery('#iaa_panelPreview').fadeIn();
        jQuery('#iaa_panelSettings').fadeOut();
    }

    function iaa_saveSettings() {
        var corpse_num = jQuery('#iaa_avatarPreviewContainer [data-type="corpse"]').attr('data-num');
        var head_num = jQuery('#iaa_avatarPreviewContainer [data-type="head"]').attr('data-num');
        var hair_num = jQuery('#iaa_avatarPreviewContainer [data-type="hair"]').attr('data-num');
        var eyes_num = jQuery('#iaa_avatarPreviewContainer [data-type="eyes"]').attr('data-num');
        var mouth_num = jQuery('#iaa_avatarPreviewContainer [data-type="mouth"]').attr('data-num');

        jQuery('#iaa_loader').fadeIn();

        jQuery.ajax({
            type: 'post',
            url: ajaxurl,
            data: {
                action: 'iaa_saveSettings',
                corpse_num: corpse_num,
                head_num: head_num,
                hair_num: hair_num,
                eyes_num: eyes_num,
                mouth_num: mouth_num,
                position: jQuery('#iaa_settings_position').val(),
                initialText: jQuery('#iaa_settings_initialText').val(),
                hideOnClose: jQuery('#iaa_settings_hideOnClose').val(),
                enable: jQuery('#iaa_settings_enable').val(),
                colorBubble: jQuery('#iaa_settings_colorBubble').val(),
                colorText: jQuery('#iaa_settings_colorText').val(),
                colorButtons: jQuery('#iaa_settings_colorButtons').val(),
                colorButtonsText: jQuery('#iaa_settings_colorButtonsText').val(),
                colorShine: jQuery('#iaa_settings_colorShine').val(),
                avatarType: jQuery('#iaa_settings_avatarType').val(),
                avatarImg: jQuery('#iaa_settings_avatarImg').val(),
                avatarTalkImg: jQuery('#iaa_settings_avatarTalkImg').val(),
                avatarMouthY: parseInt(jQuery('#iaa_avatarCustomPreview_mouth').css('top')),
                avatarWidth: jQuery('#iaa_avatarCustomPreview').width(),
                avatarHeight: jQuery('#iaa_avatarCustomPreview').height(),
                avatarMouthWidth: jQuery('#iaa_avatarCustomPreview_mouth').width(),
                disableIntro: jQuery('#iaa_settings_disableIntro').val(),
                disableMobile: jQuery('#iaa_settings_disableMobile').val(),
                useWPML: jQuery('#iaa_settings_useWPML').val(),
                code: jQuery('#iaa_settings_purchaseCode').val()
            },
            success: function () {
                document.location.href = document.location.href;
            }
        });

    }

    function iaa_avatarChangePart(btn) {
        var part = jQuery(this).parent().attr('data-part');
        var max = jQuery('#iaa_avatarPreviewContainer [data-type="' + part + '"]').attr('data-max');
        var num = jQuery('#iaa_avatarPreviewContainer [data-type="' + part + '"]').attr('data-num');
        if (jQuery(this).find('span').is('.glyphicon.glyphicon-chevron-left')) {
            num--;
            if (num < 1) {
                num = max;
            }
        } else {
            num++;
            if (num > max) {
                num = 1;
            }
        }
        jQuery('#iaa_avatarPreviewContainer [data-type="' + part + '"]').attr('data-num', num);

    }

    function iaa_updateStepCanvas() {
        iaa_linkGradientIndex++;
        if (iaa_linkGradientIndex >= 30) {
            iaa_linkGradientIndex = 1;
        }
        var ctx = jQuery('#iaa_stepsCanvas').get(0).getContext('2d');
        ctx.clearRect(0, 0, jQuery('#iaa_stepsCanvas').attr('width'), jQuery('#iaa_stepsCanvas').attr('height'));
        jQuery.each(iaa_links, function (index) {
            var link = this;
            if (link.destinationID && jQuery('#' + link.originID).length > 0 && jQuery('#' + link.destinationID).length > 0) {
                var posX = parseInt(jQuery('#' + link.originID).css('left')) + jQuery('#' + link.originID).outerWidth() / 2 + 22;
                var posY = parseInt(jQuery('#' + link.originID).css('top')) + jQuery('#' + link.originID).outerHeight() / 2 + 22;
                var posX2 = parseInt(jQuery('#' + link.destinationID).css('left')) + jQuery('#' + link.destinationID).outerWidth() / 2 + 22;
                var posY2 = parseInt(jQuery('#' + link.destinationID).css('top')) + jQuery('#' + link.destinationID).outerHeight() / 2 + 22;
                var grd = ctx.createLinearGradient(posX, posY, posX2, posY2);

                var chkBack = false;
                var iaa_linkGradientIndexA = iaa_linkGradientIndex / 30;
                var gradPos1 = iaa_linkGradientIndexA;
                var gradPos2 = iaa_linkGradientIndexA + 0.1;
                var gradPos3 = iaa_linkGradientIndexA + 0.2;
                ctx.lineWidth = 4;
                if (gradPos2 > 1) {
                    gradPos2 = 0;
                    gradPos3 = 0.2;
                }
                if (gradPos3 > 1) {
                    gradPos3 = 0;
                }

                grd.addColorStop(gradPos1, "#bdc3c7");
                grd.addColorStop(gradPos2, "#1ABC9C");
                grd.addColorStop(gradPos3, "#bdc3c7");
                ctx.strokeStyle = grd;
                ctx.beginPath();
                ctx.moveTo(posX, posY);
                ctx.lineTo(posX2, posY2);
                ctx.stroke();

                if (jQuery('.iaa_linkPoint[data-linkindex="' + index + '"]').length == 0) {
                    var $point = jQuery('<a href="javascript:" data-linkindex="' + index + '" class="iaa_linkPoint"><span class="glyphicon glyphicon-pencil"></span></a>');
                    jQuery('#iaa_stepsContainer').append($point);
                    $point.click(function () {
                        iaa_openWinLink(jQuery(this));
                    });
                }
                iaa_repositionLinkPoint(index);

            } else {
                jQuery('.iaa_linkPoint[data-linkindex="' + index + '"]').remove();
            }
        });
        if (iaa_isLinking) {
            var step = jQuery('#' + iaa_links[iaa_linkCurrentIndex].originID);
            var posX = step.position().left + jQuery('#iaa_stepsOverflow').scrollLeft() + step.outerWidth() / 2;
            var posY = step.position().top + jQuery('#iaa_stepsOverflow').scrollTop() + step.outerHeight() / 2;
            ctx.strokeStyle = "#bdc3c7";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.lineTo(iaa_mouseX, iaa_mouseY);
            ctx.stroke();
        }
    }
    function iaa_checkLicense() {
        var error = false;
        var $field = jQuery('#iaa_winActivation input[name="purchaseCode"]');
        if ($field.val().length < 9) {
            $field.parent().addClass('has-error');
        } else {
            jQuery('#iaa_loader').delay(1400).fadeIn(100);
            jQuery.ajax({
                url: ajaxurl,
                type: 'post',
                data: {action: 'iaa_checkLicense', code: $field.val()},
                success: function (rep) {
                    jQuery('#iaa_loader').fadeOut();
                    if (rep.length == "1") {
                        $field.parent().addClass('has-error');
                    } else {
                        iaa_lock = false;
                        jQuery('#iaa_winActivation').modal('hide');
                    }
                }
            });
        }
    }
    function iaa_openWinStep(stepID) {

        if (iaa_settings.positionScreen == 1) {
            jQuery('#iaa_stepPreview #iaa_avatarPreviewContainer').addClass('iaa_right');
        } else {
            jQuery('#iaa_stepPreview #iaa_avatarPreviewContainer').removeClass('iaa_right');
        }

        if (!stepID) {
            var stepID = 0;
        } else {
            jQuery.ajax({
                url: ajaxurl,
                type: 'post',
                data: {
                    action: 'iaa_loadStep',
                    stepID: stepID
                },
                success: function (step) {
                    step = jQuery.parseJSON(step);
                    step.content = jQuery.parseJSON(step.content);
                    step.content.id = step.id;
                    iaa_currentStep = step.content;
                    iaa_defaultStep = jQuery.extend(true, {}, iaa_currentStep);
                    jQuery('#iaa_stepTitle').val(step.content.title);

                    jQuery('#iaa_stepText').val(step.content.text.replace(/\r?<br \/>/g, "\n"));
                    jQuery('#iaa_interactionsWrapper >*,#iaa_actionsWrapper >*').not('.iaa_stepIconPlus').remove();
                    if (iaa_currentStep.interactions) {
                        jQuery.each(iaa_currentStep.interactions, function () {
                            var interaction = this;
                            iaa_createInteraction(interaction);
                        });
                    }
                    if (iaa_currentStep.actions) {
                        jQuery.each(iaa_currentStep.actions, function () {
                            var action = this;
                            iaa_createAction(action);
                        });
                    }
                    jQuery('#iaa_btns').html('');
                    jQuery('#iaa_winStep').fadeIn();
                    jQuery('#iaa_stepsContainer').slideUp();

                    iaa_previewStep();
                    jQuery('#wpwrap').css({
                        height: jQuery('#iaa_winStep').height() + 48
                    });

                }
            });
        }
        iaa_currentStep = {
            id: stepID,
            text: '',
            actions: new Array(),
            interactions: new Array()
        };

    }

    function iaa_createAction(data) {
        var spanClass = '';
        var isNew = true;
        if (data.elementID) {
            isNew = false;
        }

        switch (data.type) {
            case "showElement":
                spanClass = 'glyphicon glyphicon-search';
                break;
            case "sendEmail":
                spanClass = 'glyphicon glyphicon-envelope';
                break;
            case "changeUrl":
                spanClass = 'glyphicon glyphicon-share-alt';
                break;
            case "executeJS":
                spanClass = 'glyphicon glyphicon-flash';
                break;
            case "sendInteractions":
                spanClass = 'glyphicon glyphicon-cloud-upload';
                break;
        }

        var $circle = jQuery('<div class="iaa_actionCircle" data-type="' + data.type + '"><span class="' + spanClass + '"></span></div>');
        $circle.hide();
        $circle.uniqueId();
        if (isNew) {
            data.elementID = $circle.attr('id');
            iaa_currentStep.actions.push(data);
        } else {
            $circle.attr('id', data.elementID);
        }
        jQuery('#iaa_actionsWrapper .iaa_stepIconPlus').before($circle);
        $circle.fadeIn(250);
        $circle.click(function () {
            iaa_openWinAction(jQuery(this));
        });
    }

    function iaa_createInteraction(data) {
        var spanClass = '';
        var spanContent = '';
        var isNew = true;
        if (data.elementID) {
            isNew = false;
        }
        switch (data.type) {
            case "textfield":
                spanContent = 'T';
                break;
            case "numberfield":
                spanContent = '1';
                break;
            case "select":
                spanClass = 'glyphicon glyphicon-th-list';
                break;
            case "button":
                spanClass = 'glyphicon glyphicon-hand-up';
                break;
        }
        var $circle = jQuery('<div class="iaa_actionCircle" data-type="' + data.type + '"><span class="' + spanClass + '">' + spanContent + '</span></div>');
        $circle.hide();
        $circle.uniqueId();
        data.elementID = $circle.attr('id');
        if (isNew) {
            iaa_currentStep.interactions.push(data);
        }
        jQuery('#iaa_interactionsWrapper .iaa_stepIconPlus').before($circle);
        $circle.fadeIn(250);
        $circle.click(function () {
            iaa_openWinInteraction(jQuery(this));
        });
    }

    function iaa_closeWin(win) {
        win.fadeOut();
        jQuery('#iaa_stepsContainer').slideDown();
    }

    function iaa_startLink(stepID) {
        iaa_isLinking = true;
        iaa_linkCurrentIndex = iaa_links.length;
        iaa_links.push({
            originID: stepID,
            destinationID: null
        });

    }

    function iaa_stopLink(newStep) {
        iaa_isLinking = false;
        var chkLink = false;
        jQuery.each(iaa_links, function () {
            if (this.originID == iaa_links[iaa_linkCurrentIndex].originID && this.destinationID == newStep.attr('id')) {
                chkLink = this;
            }
        });
        if (!chkLink) {
            jQuery('#iaa_loader').fadeIn();
            iaa_links[iaa_linkCurrentIndex].destinationID = newStep.attr('id');
            jQuery.ajax({
                url: ajaxurl,
                type: 'post',
                data: {
                    action: 'iaa_newLink',
                    originStepID: jQuery('#' + iaa_links[iaa_linkCurrentIndex].originID).attr('data-stepid'),
                    destinationStepID: jQuery('#' + iaa_links[iaa_linkCurrentIndex].destinationID).attr('data-stepid')
                },
                success: function (linkID) {
                    iaa_links[iaa_linkCurrentIndex].id = linkID;
                    iaa_loadSteps();
                }
            });
        } else {
            jQuery.grep(iaa_links, function (value) {
                return value != chkLink;
            });
        }
    }

    function iaa_itemsCheckRows(item) {
        var clear = jQuery(item).parent().children('.clearfix');
        clear.detach();
        jQuery(item).parent().append(clear);
    }

    function iaa_openWinInteraction($item) {
        jQuery('#iaa_interactionBubble ').find('input,select').parent().removeClass('has-error');
        jQuery('#iaa_interactionBubble').addClass('iaa_hover');
        setTimeout(function () {
            jQuery('#iaa_interactionBubble').removeClass('iaa_hover');
        }, 50);
        if (jQuery('#iaa_interactionBubble').css('display') == 'block') {
            jQuery('#iaa_interactionBubble').fadeOut();
        }
        jQuery('#iaa_interactionBubble').attr('data-item', $item.attr('id'));
        jQuery('#iaa_interactionBubble').css({
            top: $item.offset().top - jQuery('#iaa_bootstraped.iaa_bootstraped').offset().top + $item.outerHeight() + 12,
            left: $item.offset().left - jQuery('#iaa_bootstraped.iaa_bootstraped').offset().left
        });
        jQuery('#iaa_interactionBubble #iaa_interactionContent > [data-type]').hide();
        if ($item.attr('data-type')) {
            jQuery('#iaa_interactionBubble #iaa_interactionContent > [data-type="select"] .form-group:not(.default)').remove();
            jQuery('#iaa_interactionBubble').attr('data-type', $item.attr('data-type'));
            jQuery('#iaa_interactionBubble').data('type', $item.attr('data-type'));
            jQuery('#iaa_interactionBubble #iaa_interactionContent > [data-type="' + $item.attr('data-type') + '"]').slideDown();
            jQuery("#iaa_interactionSelect").select2("val", $item.attr('data-type'));
            jQuery('#iaa_interactionBubble input[name="itemID"]').val(iaa_currentStep.interactions[$item.index()].itemID);
            jQuery.each(iaa_currentStep.interactions[$item.index()], function (key) {
                jQuery('#iaa_interactionBubble #iaa_interactionContent > [data-type="' + $item.attr('data-type') + '"]').find('[name="' + key + '"]').val(this);
                if ($item.attr('data-type') == 'numberfield' && key == 'validation') {
                    if (this == 'fill') {
                        jQuery('#iaa_interactionValidationSelectNum').val('fill');
                    } else {
                        jQuery('#iaa_interactionValidationSelectNum').val('');
                    }
                }
                if ($item.attr('data-type') == 'textfield' && key == 'validation') {
                    if (this == 'fill') {
                        jQuery('#iaa_interactionValidationSelect').val('fill');
                    } else if (this == 'email') {
                        jQuery('#iaa_interactionValidationSelect').val('email');
                    } else {
                        jQuery('#iaa_interactionValidationSelect').val('');
                    }
                }

                if ($item.attr('data-type') == 'select' && key.substr(0, 2) == 's_') {
                    var $field = iaa_interactionAddSelect('select');
                    $field.find('input').val(this);
                }
            });

        } else {
            jQuery('#iaa_interactionBubble').removeAttr('data-item');
            jQuery('#iaa_interactionBubble').attr('data-type', "null");
            jQuery("#iaa_interactionSelect").select2("val", "");
            jQuery('#iaa_interactionBubble ').find('input,select').val('');
            jQuery('#iaa_interactionBubble ').find('input[name="itemID"]').val(iaa_getUniqueTime());
        }
        jQuery('#iaa_interactionBubble').fadeIn(250);
        
      //  $('#iaa_interactionBubble [data-action="iaa_interactionSave"]').on('click', iaa_interactionSave);
       // $('#iaa_interactionBubble [data-action="iaa_interactionDel"]').on('click', iaa_interactionDel);
        setTimeout(function () {
            jQuery('#wpwrap').css({
                height: jQuery('#iaa_bootstraped').height() + 48
            });
        }, 300);
    }

    function iaa_getUniqueTime() {
        var time = new Date().getTime();
        while (time == new Date().getTime())
            ;
        return new Date().getTime();
    }

    function iaa_changeInteractionBubble(action) {
        jQuery('#iaa_interactionBubble').data('type', action);
        jQuery('#iaa_interactionBubble #iaa_interactionContent > div').slideUp();
        if (action != "") {
            jQuery('#iaa_interactionBubble #iaa_interactionContent > [data-type="' + action + '"]').slideDown();
        }
        if (action == 'select') {
            var nbSel = jQuery('#iaa_interactionContent > [data-type="' + action + '"]').find('.form-group:not(.default)').length;

            if (nbSel == 0 || jQuery('#iaa_interactionContent > [data-type="' + action + '"]').find('.form-group:not(.default):last-child').find('input').val() == '') {
                iaa_interactionAddSelect(action);
            }
        }
    }

    function iaa_interactionAddSelect(action) {
        var nbSel = jQuery('#iaa_interactionContent > [data-type="' + action + '"]').find('.form-group').length;
        var $field = jQuery('<div class="form-group"><label>' + iaa_data.txt_option + '</label><input type="text" placeholder="' + iaa_data.txt_option + '" class="form-control" name="s_' + nbSel + '_value"></div>');
        $field.find('input').keyup(function () {
            if (jQuery(this).val() == '') {
                if (jQuery(this).closest('.form-group:not(.default)').index() > 0) {
                    jQuery(this).closest('.form-group:not(.default)').remove();
                }
            } else {
                if (jQuery(this).closest('.form-group:not(.default)').next('.form-group:not(.default)').length == 0) {
                    iaa_interactionAddSelect(action)
                }
            }
        });
        jQuery('#iaa_interactionContent > [data-type="' + action + '"]').append($field);
        return $field;
    }

    function iaa_openWinLink($item) {
        iaa_currentLinkIndex = $item.attr('data-linkindex');
        jQuery('#iaa_winLink').attr('data-linkindex', $item.attr('data-linkindex'));
        jQuery('.iaa_conditionItem').remove();
        var stepID = jQuery('#' + iaa_links[$item.attr('data-linkindex')].originID).attr('data-stepid');
        var step = iaa_getStepByID(stepID);
        var destID = jQuery('#' + iaa_links[$item.attr('data-linkindex')].destinationID).attr('data-stepid');
        var destination = iaa_getStepByID(destID);
        jQuery('#iaa_linkInteractions').show();
        iaa_currentStep = step;
        jQuery('#iaa_linkOriginTitle').html(step.content.title);
        jQuery('#iaa_linkDestinationTitle').html(destination.content.title);

        jQuery.each(iaa_links[iaa_currentLinkIndex].conditions, function () {
            iaa_addLinkInteraction(this);
        });
        jQuery('#iaa_winLink').fadeIn(250);
        setTimeout(function () {
            jQuery('#wpwrap').css({
                height: jQuery('#iaa_bootstraped').height() + 48
            });
        }, 300);

    }

    function iaa_addLinkInteraction(data) {
        var $item = jQuery('<div class="iaa_conditionItem"></div>');
        var $select = jQuery('<select class="iaa_conditionSelect form-control"></select>');

        $select.append('<option value="_date" data-type="date">' + iaa_data.txt_currentDate + '</option>');
        $select.append('<option value="_page" data-type="page">' + iaa_data.txt_currentPage + '</option>');
        jQuery.each(iaa_steps, function () {
            var step = this;
            jQuery.each(this.content.interactions, function () {
                var interaction = this;
                var interactionID = step.id + '_' + interaction.itemID;
                var typeName = jQuery('#iaa_interactionSelect option[value="' + interaction.type + '"]').html();
                $select.append('<option value="' + interactionID + '" data-type="' + interaction.type + '">' + step.content.title + ' : ' + typeName + ' " ' + interaction.label + ' "</option>');
            });
        });
        var $operator = jQuery('<select class="iaa_conditionoperatorSelect form-control"></select>');
        $select.change(function () {
            var operator = jQuery(this).parent().parent().find('.iaa_conditionoperatorSelect');
            operator.find('option').remove();
            var options = iaa_conditionGetOperators($select.find('option').filter(":selected").attr('data-type'), $select);
            jQuery.each(options, function () {
                operator.append('<option value="' + this.value + '">' + this.text + '</option>');
            });
            $operator.change();
        });
        if (data) {
            $select.val(data.interaction);
        }
        $select.change();
        var options = iaa_conditionGetOperators($select.find('option').filter(":selected").attr('data-type'), $select);
        jQuery.each(options, function () {
            $operator.append('<option value="' + this.value + '">' + this.text + '</option>');
        });

        $operator.change(function () {
            iaa_linksUpdateFields(jQuery(this));
        });
        var $col1 = jQuery('<div class="col-md-4"></div>');
        $col1.append($select);
        $item.append($col1);
        var $row = jQuery('<div class="row"></div>');
        var $col2 = jQuery('<div class="col-md-4"></div>');
        $col2.append($operator);
        $item.append($col2);
        $item.append('<div class="col-md-1"><a href="javascript:" class="iaa_conditionDelBtn" ><span class="glyphicon glyphicon-remove"></span></a> </div>');
        $item.find('.iaa_conditionDelBtn').on('click',function(){
            iaa_conditionRemove(this);
        });
        if (data) {
            $operator.val(data.action);
            $operator.change();
            if (data.value) {
                $operator.parent().parent().find('.iaa_conditionValue').val(data.value);
            }
        }
        setTimeout(function () {
            iaa_linksUpdateFields($operator, data);
            if (data.value) {
                $operator.parent().parent().find('.iaa_conditionValue').val(data.value);
            }
        }, 500);
        jQuery('#iaa_linkInteractions').append($item);
    }

    function iaa_linksUpdateFields($operatorSelect, data) {

        $operatorSelect.parent().parent().find('.iaa_conditionValue').parent().remove();
        if ($operatorSelect.parent().parent().find('.iaa_conditionSelect option:selected').attr('data-type') == "page") {
            if ($operatorSelect.parent().parent().find('.iaa_conditionValue').length == 0) {
                $operatorSelect.parent().parent().find('.col-md-1').before('<div class="col-md-3"><input type="text" placeholder="http://..." class="iaa_conditionValue form-control" /> </div>');
            }
        }
        if ($operatorSelect.parent().parent().find('.iaa_conditionSelect option:selected').attr('data-type') == "numberfield" && ($operatorSelect.val() == 'inferior' || $operatorSelect.val() == 'superior' || $operatorSelect.val() == 'equal')) {
            if ($operatorSelect.parent().parent().find('.iaa_conditionValue').length == 0) {
                $operatorSelect.parent().parent().find('.col-md-1').before('<div class="col-md-3"><input type="number" step="any" class="iaa_conditionValue form-control" /> </div>');
            }
        }
        if (($operatorSelect.parent().parent().find('.iaa_conditionSelect option:selected').attr('data-type') == "date" || $operatorSelect.parent().parent().find('.iaa_conditionSelect option:selected').attr('data-type') == "datefield") && ($operatorSelect.val() == 'inferior' || $operatorSelect.val() == 'superior' || $operatorSelect.val() == 'equal')) {

            if ($operatorSelect.parent().parent().find('.iaa_conditionValue').length == 0) {
                $operatorSelect.parent().parent().find('.col-md-1').before('<div class="col-md-3"><input type="text" step="any" class="iaa_conditionValue form-control"/> </div>');
                $operatorSelect.parent().parent().find('.iaa_conditionValue').datepicker({
                    dateFormat: 'yy-mm-dd'
                });
            }
            if (data && data.value) {
                $operatorSelect.parent().parent().find('.iaa_conditionValue').val(data.value);
            }
        }
    }

    function iaa_conditionRemove(btn) {
        var $btn = jQuery(btn);
        $btn.closest('.iaa_conditionItem').remove();
    }

    function iaa_linkSave() {
        if (iaa_canSaveLink) {
            iaa_canSaveLink = false;
            setTimeout(function () {
                iaa_canSaveLink = true;
            }, 1500);
            iaa_links[iaa_currentLinkIndex].conditions = new Array();
            jQuery('.iaa_conditionItem').each(function () {
                iaa_links[iaa_currentLinkIndex].conditions.push({
                    interaction: jQuery(this).find('.iaa_conditionSelect').val(),
                    action: jQuery(this).find('.iaa_conditionoperatorSelect').val(),
                    value: jQuery(this).find('.iaa_conditionValue').val()
                });
            });
            var cloneLinks = iaa_links.slice();
            jQuery.each(cloneLinks, function () {
                this.originID = jQuery('#' + this.originID).attr('data-stepid');
                this.destinationID = jQuery('#' + this.destinationID).attr('data-stepid');
            });
            jQuery.ajax({
                url: ajaxurl,
                type: 'post',
                data: {
                    action: 'iaa_saveLinks',
                    links: JSON.stringify(cloneLinks)
                },
                success: function () {
                    iaa_closeWin(jQuery('#iaa_winLink'));
                    iaa_loadSteps();
                }
            });
        }
    }

    function iaa_linkDel() {
        iaa_links.splice(jQuery.inArray(iaa_links[iaa_currentLinkIndex], iaa_links), 1);
        var cloneLinks = iaa_links.slice();
        jQuery.each(cloneLinks, function () {
            this.originID = jQuery('#' + this.originID).attr('data-stepid');
            this.destinationID = jQuery('#' + this.destinationID).attr('data-stepid');
        });
        jQuery.ajax({
            url: ajaxurl,
            type: 'post',
            data: {
                action: 'iaa_saveLinks',
                links: JSON.stringify(cloneLinks)
            },
            success: function () {
                iaa_closeWin(jQuery('#iaa_winLink'));
                iaa_loadSteps();
            }
        });
    }

    function iaa_conditionGetOperators(type, $select) {
        var options = new Array();
        switch (type) {
            case "button":
                options.push({
                    value: 'clicked',
                    text: iaa_data.txt_clicked
                });
                break;
            case "numberfield":
                options.push({
                    value: 'filled',
                    text: iaa_data.txt_filled
                });
                options.push({
                    value: 'superior',
                    text: iaa_data.txt_superiorTo
                });
                options.push({
                    value: 'inferior',
                    text: iaa_data.txt_inferiorTo
                });
                options.push({
                    value: 'equal',
                    text: iaa_data.txt_equalTo
                });
                break;
            case "textfield":
                options.push({
                    value: 'filled',
                    text: iaa_data.txt_filled
                });
                break;
            case "page":
                options.push({
                    value: 'equal',
                    text: iaa_data.txt_equalTo
                });
                break;
            case "datefield":
                options.push({
                    value: 'filled',
                    text: iaa_data.txt_filled
                });
                options.push({
                    value: 'superior',
                    text: iaa_data.txt_superiorTo
                });
                options.push({
                    value: 'inferior',
                    text: iaa_data.txt_inferiorTo
                });
                options.push({
                    value: 'equal',
                    text: iaa_data.txt_equalTo
                });
                break;
            case "date":
                options.push({
                    value: 'superior',
                    text: iaa_data.txt_superiorTo
                });
                options.push({
                    value: 'inferior',
                    text: iaa_data.txt_inferiorTo
                });
                options.push({
                    value: 'equal',
                    text: iaa_data.txt_equalTo
                });
                break;

            case "select":
                var stepID = $select.val().substr(0, $select.val().indexOf('_'));
                var itemID = $select.val().substr($select.val().indexOf('_') + 1, $select.val().length);
                var step = iaa_getStepByID(stepID);

                var interaction = false;
                if (step) {
                    jQuery.each(step.content.interactions, function () {
                        if (this.itemID == itemID) {
                            interaction = this;
                        }
                    });
                    jQuery.each(interaction, function (key) {
                        if (key.substr(0, key.indexOf('_') + 1) == 's_' && this != "") {
                            options.push({
                                value: 'v_' + this,
                                text: this
                            });
                        }
                    });

                }

                break;
        }
        return options;
    }

    function iaa_openWinAction($item) {
        jQuery('#iaa_actionBubble').addClass('iaa_hover');
        setTimeout(function () {
            jQuery('#iaa_actionBubble').removeClass('iaa_hover');
        }, 50);
        var action = false;
        jQuery.each(iaa_currentStep.actions, function () {
            if (this.elementID == $item.attr('id')) {
                action = this;
            }
        });

        jQuery('#iaa_actionBubble').attr('data-item', $item.attr('id'));
        jQuery('#iaa_actionBubble').css({
            top: $item.offset().top - jQuery('#iaa_bootstraped.iaa_bootstraped').offset().top + $item.outerHeight() + 12,
            left: $item.offset().left - jQuery('#iaa_bootstraped.iaa_bootstraped').offset().left
        });

        jQuery('#iaa_actionBubble #iaa_actionContent > [data-type]').hide();
        if ($item.attr('data-type')) {
            jQuery('#iaa_actionBubble').data('type', $item.attr('data-type'));
            jQuery("#iaa_actionSelect").select2("val", $item.attr('data-type'));
            jQuery('#iaa_actionBubble #iaa_actionContent > [data-type="' + $item.attr('data-type') + '"]').find('input,select,textarea').each(function () {
                eval('jQuery(this).val(action.' + jQuery(this).attr('name') + '.replace(/\\[g\\]/g,\'"\'));');
                eval('jQuery(this).val(action.' + jQuery(this).attr('name') + '.replace(/\\|g\\|/g,\'"\'));');
            });
            jQuery('#iaa_actionBubble #iaa_actionContent > [data-type="' + $item.attr('data-type') + '"]').slideDown();
        } else {
            jQuery("#iaa_actionSelect").select2("val", "");
            jQuery('#iaa_actionBubble').removeAttr('data-item');
        }
        jQuery('#iaa_actionElementSelected').hide();

        jQuery('#iaa_actionBubble').fadeIn();

     //   $('#iaa_actionBubble [data-action="iaa_actionSave"]').on('click', iaa_actionSave);
     //   $('#iaa_actionBubble [data-action="iaa_actionDel"]').on('click', iaa_actionDel);
    }

    function iaa_changeActionBubble(action) {
        jQuery('#iaa_actionBubble').data('type', action);
        jQuery('#iaa_actionBubble #iaa_actionContent > div').slideUp();
        if (action != "") {
            jQuery('#iaa_actionBubble #iaa_actionContent > [data-type="' + action + '"]').slideDown();
        }
    }

    function iaa_updateWinItemPosition() {
        if (jQuery('#iaa_winStep').css('display') != 'none') {
            var $item = jQuery('#' + jQuery('#iaa_itemWindow').attr('data-item'));
            if ($item.length > 0) {
                jQuery('#iaa_itemWindow').css({
                    top: $item.offset().top - jQuery('#iaa_bootstraped.iaa_bootstraped').offset().top + $item.outerHeight() + 12,
                    left: $item.offset().left - jQuery('#iaa_bootstraped.iaa_bootstraped').offset().left
                });
            } else {
                jQuery('#iaa_itemWindow').fadeOut();
            }
        } else {
            jQuery('#iaa_itemWindow').fadeOut();
        }
    }

    function iaa_checkEmail(emailToTest) {
        if (emailToTest.indexOf("@") != "-1" && emailToTest.indexOf(".") != "-1" && emailToTest != "")
            return true;
        return false;
    }

    function iaa_actionSave() {
        var title = iaa_data.txt_redirection;
        var chkCreate = true;

        var options = {};
        if (jQuery('#iaa_actionBubble').data('type')) {
           var type = jQuery('#iaa_actionBubble').data('type');
            if (jQuery('#iaa_actionBubble').data('type') == 'showElement') {
                title = iaa_data.txt_showElement;
                if (jQuery('#iaa_actionBubble [data-type="showElement"]  [name="element"]').val() == "") {
                    chkCreate = false;
                    jQuery('#iaa_actionBubble [data-type="showElement"] a').addClass('btn-danger');
                }
            } else if (jQuery('#iaa_actionBubble').data('type') == 'sendEmail') {
                title = iaa_data.txt_sendEmail;
                if (!iaa_checkEmail(jQuery('#iaa_actionBubble [data-type="sendEmail"]  [name="email"]').val())) {
                    chkCreate = false;
                    jQuery('#iaa_actionBubble  [data-type="sendEmail"] [name="email"]').parent().addClass('has-error');
                }
            } else if (jQuery('#iaa_actionBubble').data('type') == 'changeUrl') {
                if (jQuery('#iaa_actionBubble [data-type="changeUrl"] [name="url"]').val().indexOf('http') < 0) {
                    chkCreate = false;
                    jQuery('#iaa_actionBubble  [data-type="changeUrl"] [name="url"]').parent().addClass('has-error');
                }
            } else if (jQuery('#iaa_actionBubble').data('type') == 'executeJS') {
                if (jQuery('#iaa_actionBubble [data-type="executeJS"] [name="executeJS"]').val().length < 3) {
                    chkCreate = false;
                    jQuery('#iaa_actionBubble  [data-type="executeJS"] [name="executeJS"]').parent().addClass('has-error');
                }
            }
            if (chkCreate) {
                jQuery('#iaa_actionBubble [data-type="' + type + '"] select,#iaa_actionBubble [data-type="' + type + '"] input, #iaa_actionBubble [data-type="' + type + '"] textarea').each(function () {
                    var value = jQuery(this).val().replace(/\"/g, '|g|');
                    eval('options.' + jQuery(this).attr('name') + '= value;');
                    options.type = type;
                });
                options.elementID = jQuery('#iaa_actionBubble').attr('data-item');
                if (typeof(jQuery('#iaa_actionBubble').attr('data-item')) != 'undefined' && jQuery('#iaa_actionBubble').attr('data-item') != "") {
                    iaa_currentStep.actions[jQuery('#' + jQuery('#iaa_actionBubble').attr('data-item')).index()] = options;
                } else {
                    iaa_createAction(options);
                }
                jQuery('#iaa_actionBubble #iaa_actionContent > div').slideUp();
                jQuery('#iaa_actionBubble').fadeOut();
                iaa_previewStep();
            }
        } else {
            chkCreate = false;

            jQuery('#iaa_interactionBubble #iaa_actionSelect').val('');
            jQuery('#iaa_actionBubble #iaa_actionContent > div').slideUp();
            jQuery('#iaa_actionBubble').fadeOut();
        }

    }

    function iaa_interactionDel() {
        jQuery('#iaa_interactionBubble').fadeOut();
        var itemID = jQuery('#iaa_interactionBubble').attr('data-item');
        if (itemID && itemID != "") {
            var index = jQuery('#' + itemID).index();
            
        iaa_currentStep.interactions = jQuery.grep(iaa_currentStep.interactions, function (interaction) {
            if (interaction.elementID != itemID) {
                return interaction;
            }
        });
          //  iaa_currentStep.interactions.splice(index, 1);
            jQuery('#iaa_interactionsWrapper .iaa_actionCircle').eq(index).remove();
            $('#'+itemID).remove();

        }
        iaa_previewStep();
    }

    function iaa_existInDefaultStep(itemID) {
        var rep = false;
        jQuery.each(iaa_defaultStep.interactions, function () {
            var interaction = this;
            if (interaction.itemID == itemID) {
                rep = true;
            }
        });
        return rep;
    }

    function iaa_actionDel() {
        jQuery('#iaa_actionBubble').fadeOut();
        var itemID = jQuery('#iaa_actionBubble').attr('data-item');
        if (itemID && itemID != "") {
            var index = jQuery('#' + itemID).index();
        iaa_currentStep.actions = jQuery.grep(iaa_currentStep.actions, function (action) {
            if (action.elementID != itemID) {
                return action;
            }
        });
            jQuery('#iaa_actionsWrapper .iaa_actionCircle').eq(index).remove();
            $('#'+itemID).remove();
        }
    }

    function iaa_interactionSave() {
        var spanClass = "";
        var spanContent = "";
        var title = iaa_data.txt_redirection;
        var chkCreate = true;
        var type = '';
        var options = {};
        if (jQuery('#iaa_interactionBubble').data('type')) {
            type = jQuery('#iaa_interactionBubble').data('type');
            if (jQuery('#iaa_interactionBubble').data('type') == 'textfield') {
                spanContent = 'T';
                title = iaa_data.txt_textfield;

                if (jQuery('#iaa_interactionBubble [data-type="textfield"] [name="label"]').val() == "") {
                    chkCreate = false;
                    jQuery('#iaa_interactionBubble [data-type="textfield"] [name="label"]').parent().addClass('has-error');
                }
            }
            if (jQuery('#iaa_interactionBubble').data('type') == 'numberfield') {
                spanContent = '1';
                title = iaa_data.txt_numberfield;
            }
            if (jQuery('#iaa_interactionBubble').data('type') == 'select') {
                spanClass = 'glyphicon glyphicon-th-list';
                title = iaa_data.txt_select;

                var values = new Array();
                jQuery('#iaa_interactionBubble [data-type="select"] .form-group input').each(function () {
                    if (jQuery(this).val() != "") {
                        values.push(jQuery(this).val());
                    }
                });

            }
            if (jQuery('#iaa_interactionBubble').data('type') == 'button') {
                spanClass = 'glyphicon glyphicon-hand-up';
                if (jQuery('#iaa_interactionBubble [data-type="button"] [name="label"]').val() == "") {
                    chkCreate = false;
                    jQuery('#iaa_interactionBubble [data-type="button"] [name="label"]').parent().addClass('has-error');
                }
            }
            if (jQuery('#iaa_interactionBubble [name="itemID"]').val().length < 3) {
                chkCreate = false;
                jQuery('#iaa_interactionBubble [name="itemID"]').parent().addClass('has-error');
            }

            if (chkCreate) {
                jQuery('#iaa_interactionBubble [data-type="' + type + '"] select,#iaa_interactionBubble [data-type="' + type + '"] input, #iaa_interactionBubble [data-type="' + type + '"] textarea').each(function () {
                    eval('options.' + jQuery(this).attr('name') + '= jQuery(this).val();');
                    options.type = type;
                });
                options.itemID = jQuery('#iaa_interactionBubble [name="itemID"]').val();

                if (jQuery('#iaa_interactionBubble').attr('data-item') && jQuery('#iaa_interactionBubble').attr('data-item') != "") {
                    iaa_currentStep.interactions[jQuery('#' + jQuery('#iaa_interactionBubble').attr('data-item')).index()] = options;
                } else {
                    iaa_createInteraction(options);
                    jQuery('#iaa_stepPreview #iaa_avatarPreviewContainer #iaa_talkBubble').height(
                            (parseInt(jQuery('#iaa_stepPreview #iaa_avatarPreviewContainer #iaa_talkBubble').height()) + 48)
                            );
                }

                jQuery('#iaa_interactionBubble #iaa_interactionContent > div').slideUp();
                jQuery('#iaa_interactionBubble').fadeOut();
                iaa_previewStep();

            }
        } else {
            chkCreate = false;
            jQuery('#iaa_interactionBubble #iaa_interactionSelect').val('');
            jQuery('#iaa_interactionBubble #iaa_interactionContent > div').slideUp();
            jQuery('#iaa_interactionBubble').fadeOut();
        }

    }

    function iaa_startSelectElement() {
        if (jQuery('#iaa_websiteFrame').length > 0) {
            jQuery('#iaa_websiteFrame').remove();
            jQuery('.iaa_selectElementPanel').remove();
        }
        jQuery('body').append('<iframe id="iaa_websiteFrame" src="' + iaa_data.websiteUrl + '"></iframe>');
        jQuery('#iaa_websiteFrame').on('load', iaa_websiteFrameLoaded);
        jQuery('#iaa_websiteFrame').hover(function () {
            jQuery('#iaa_websiteFrame').addClass('iaa_hover');
        }, function () {
            jQuery('#iaa_websiteFrame').removeClass('iaa_hover');
        });
        jQuery('body').append('<div id="iaa_bootstraped" class="iaa_bootstraped iaa_selectElementPanel"></div>');
        jQuery('.iaa_selectElementPanel').hover(function () {
            jQuery('.iaa_selectElementPanel').addClass('iaa_hover');
        }, function () {
            jQuery('.iaa_selectElementPanel').removeClass('iaa_hover');
        });
        jQuery('.iaa_selectElementPanel').html('<p>' + iaa_data.txt_selectStart + '</p>');
        jQuery('.iaa_selectElementPanel').append('<p><a href="javascript:" class="btn btn-primary" data-action="iaa_selectionSelectElement" >' + iaa_data.txt_selectBtn + '</a>&nbsp;&nbsp;<a href="javascript:" class="btn btn-danger" data-action="iaa_stopSelectElement">' + iaa_data.txt_cancel + '</a></p>');
        jQuery('.iaa_selectElementPanel').find('[data-action="iaa_stopSelectElement"]').on('click', iaa_stopSelectElement);
        jQuery('.iaa_selectElementPanel').find('[data-action="iaa_selectionSelectElement"]').on('click', iaa_selectionSelectElement);
        jQuery('#iaa_loader').fadeIn();
        jQuery('.iaa_selectElementPanel').delay(500).fadeIn();
    }

    function iaa_selectionSelectElement() {
        jQuery('.iaa_selectElementPanel').html('<p>' + iaa_data.txt_selectSelection + '</p>');
        jQuery('.iaa_selectElementPanel').append('<p><a href="javascript:" class="btn btn-danger"  data-action="iaa_stopSelectElement">' + iaa_data.txt_cancel + '</a></p>');
        jQuery('.iaa_selectElementPanel').find('[data-action="iaa_stopSelectElement"]').on('click', iaa_stopSelectElement);
        
         $('#iaa_websiteFrame')[0].contentWindow.jQuery('body').trigger('iaa_startSelection');
       // var $f = jQuery("#iaa_websiteFrame")[0];
        //var contentWin = $f.contentWindow || $f.contentDocument;
     //   contentWin.iaa_startSelection();
    }

    function iaa_confirmSelectElement(el) {
        iaa_currentDomElement = el;
        jQuery('.iaa_selectElementPanel').html('<p>' + iaa_data.txt_selectConfirm + '</p>');
        jQuery('.iaa_selectElementPanel').append('<p><a href="javascript:" class="btn btn-primary" data-action="iaa_confirmedSelectElement" >' + iaa_data.txt_yes + '</a>&nbsp;&nbsp;<a href="javascript:" data-action="iaa_startSelectElement" class="btn btn-danger">' + iaa_data.txt_no + '</a></p>');
        jQuery('.iaa_selectElementPanel').find('[data-action="iaa_confirmedSelectElement"]').on('click', iaa_confirmedSelectElement);
        jQuery('.iaa_selectElementPanel').find('[data-action="iaa_startSelectElement"]').on('click', iaa_startSelectElement);
    }

    function iaa_websiteFrameLoaded() {
        jQuery('#iaa_loader').fadeOut();
    }

    function iaa_stopSelectElement() {
        jQuery('#iaa_websiteFrame').fadeOut(250);
        jQuery('.iaa_selectElementPanel').fadeOut(250);
        setTimeout(function () {
            jQuery('#iaa_websiteFrame').remove();
            jQuery('.iaa_selectElementPanel').remove();
        }, 300);

    }

    function iaa_confirmedSelectElement() {
        var path = iaa_getPath(iaa_currentDomElement);
        jQuery('#iaa_actionContent input[name="element"]').val(path);
        jQuery('#iaa_actionContent input[name="url"]').val(jQuery('#iaa_websiteFrame').contents().get(0).location.href);
        iaa_stopSelectElement();
        jQuery('#iaa_actionElementSelected').fadeIn();
        jQuery('#iaa_actionBubble').fadeIn();

    }

    function iaa_getPath(el) {
        var path = '';
        if (jQuery(el).length > 0 && typeof (jQuery(el).prop('tagName')) != "undefined") {
            if (!jQuery(el).attr('id') || jQuery(el).attr('id').substr(0, 8) == 'ultimate') {
                path = '>' + jQuery(el).prop('tagName') + ':nth-child(' + (jQuery(el).index() + 1) + ')' + path;
                path = iaa_getPath(jQuery(el).parent()) + path;
            } else {
                path += '#' + jQuery(el).attr('id');
            }
        }
        return path;
    }

    function iaa_saveStep() {
        iaa_currentStep.bubbleWidth = jQuery('#iaa_stepPreview #iaa_talkBubble').innerWidth();
        iaa_currentStep.bubbleHeight = jQuery('#iaa_stepPreview #iaa_talkBubble').innerHeight();
        iaa_previewStep();
        jQuery('#iaa_stepTitle').parent().removeClass('has-error');
        iaa_currentStep.title = jQuery('#iaa_stepTitle').val();
        iaa_currentStep.text = jQuery('#iaa_stepText').val();

        iaa_currentStep.title = iaa_currentStep.title.replace(/\"/g, "'");
        iaa_currentStep.text = iaa_currentStep.text.replace(/\"/g, "'");
        iaa_currentStep.text = iaa_currentStep.text.replace(/\r?\n/g, '<br />');


        if (jQuery('#iaa_stepTitle').val() == "") {
            jQuery('#iaa_stepTitle').parent().addClass('has-error');
        } else {

            var removedInteractions = new Array();
            jQuery.each(iaa_defaultStep.interactions, function () {
                var interaction = this;
                if (jQuery('#' + interaction.elementID).length == 0) {
                    removedInteractions.push(interaction.elementID);
                }
            });


            jQuery.ajax({
                url: ajaxurl,
                type: 'post',
                data: {
                    action: 'iaa_saveStep',
                    step: JSON.stringify(iaa_currentStep),
                    removedInter: removedInteractions
                },
                success: function (stepID) {
                    iaa_currentStep.id = stepID;
                    iaa_closeWin(jQuery('#iaa_winStep'));
                    iaa_loadSteps();


                }
            });
        }
    }

    function iaa_removeAllSteps() {
        jQuery.ajax({
            url: ajaxurl,
            type: 'post',
            data: {
                action: 'iaa_removeAllSteps'
            },
            success: function () {
                iaa_loadSteps();
            }
        });
    }

    function iaa_previewStep() {
        if (jQuery('#iaa_stepPreview #iaa_talkBubble').length > 0) {
            jQuery('#iaa_stepPreview #iaa_talkBubble').remove();
        }
        var txt = jQuery('#iaa_stepText').val();

        txt = txt.replace(/\[b\]/g, "<strong>").replace(/\[\/b\]/g, "</strong>");
        txt = txt.replace(/\[u\]/g, "<u>").replace(/\[\/u\]/g, "</u>");
        txt = txt.replace(/\r?\n/g, '<br />');

        var $bubble = jQuery('<div id="iaa_talkBubble"><div id="iaa_bubbleContent"></div></div>');

        $bubble.find('#iaa_bubbleContent').append('<div class="iaa_talkText"><p>' + txt + '</p></div>');
        $bubble.resizable({
            maxHeight: 260,
            maxWidth: 680,
            minHeight: 32,
            minHeight: 32,
            minWidth: 180,
            stop: function () {
                iaa_currentStep.bubbleWidth = jQuery('#iaa_stepPreview #iaa_talkBubble').innerWidth();
                iaa_currentStep.bubbleHeight = jQuery('#iaa_stepPreview #iaa_talkBubble').innerHeight();
                setTimeout(function () {
                    jQuery('#wpwrap').css({
                        height: jQuery('#iaa_winStep').height() + 48
                    });
                }, 250);
            }
        });
        if (iaa_currentStep.bubbleWidth) {
            $bubble.css({
                width: iaa_currentStep.bubbleWidth + 'px',
                height: iaa_currentStep.bubbleHeight + 'px'
            });
        }

        var interactions = '';
        var buttons = '';
        var lastInteractions = new Array();
        jQuery.each(iaa_currentStep.interactions, function (i) {
            var options = this;
            if (jQuery.inArray(this, lastInteractions) < 0) {
                lastInteractions.push(options);
            } else {
                iaa_currentStep.interactions.splice(jQuery.inArray(iaa_currentStep.interactions[i], iaa_currentStep.interactions), 1);
            }
        });
        jQuery.each(iaa_currentStep.interactions, function () {
            var options = this;
            var lastElementID = options.elementID;
            switch (options.type) {
                case "button":
                    buttons += '<a href="javascript:" class="iaa_btn">' + options.label + '</a>';
                    break;
                case "textfield":
                    interactions += '<div class="iaa_field"><label>' + options.label + '</label><input type="text" data-valisation="' + options.validation + '" /></div>';
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

        $bubble.find('#iaa_bubbleContent').append('<div class="iaa_talkInteraction">' + interactions + '</div>');
        jQuery('#iaa_stepPreview #iaa_avatarPreviewContainer').append($bubble);
        $bubble.css({
            bottom: parseInt($bubble.closest('.iaa_avatarContainer').css('height')) + 13
        });
        jQuery('#iaa_stepPreview').animate({
            height: $bubble.height() + parseInt($bubble.css('bottom')) + 40
        }, 350);
        $bubble.fadeIn();
    }


})(jQuery);