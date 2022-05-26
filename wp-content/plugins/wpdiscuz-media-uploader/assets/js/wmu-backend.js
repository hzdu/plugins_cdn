jQuery(document).ready(function ($) {
    var doingAjax = false;
    var location = window.location.href;

    if (location.indexOf('page=' + wmuJsObj.wmuWpdiscuzPageSettings + '&wmuRegenerate=attachments') >= 0) {
        var regenerateBtn = $('#wmu-regenerate-metakeys');
        if (regenerateBtn.length) {
            $('html, body').animate({
                scrollTop: $('#wmu-regenerate-metakeys').offset().top
            }, 4000);
        }
    }

    if ($('#wmuIsEmbed').is(':checked')) {
        $('.tr-wmuIsEmbedContent').show();
    } else {
        $('.tr-wmuIsEmbedContent').hide();
    }

    $(document).on('change', '#wmuIsEmbed', function () {
        if ($('#wmuIsEmbed').is(':checked')) {
            $('.tr-wmuIsEmbedContent').show();
        } else {
            $('.tr-wmuIsEmbedContent').hide();
        }
    });

    $(document).on('click', '#wmu-regenerate-metakeys', function (e) {
        var btn = $(this);
        $('.wmu-regenerate-percent-wrap').removeClass('wmu-hide');
        var commentsCount = parseInt($('#wmuCommentsCount').val());
        var data = new FormData();
        data.append('action', 'wmuRegenerateMetakeys');
        data.append('commentId', 0);
        data.append('allCommentsCount', commentsCount);
        wmuRegenerateKeys(data);
        btn.attr('disabled', 'disabled');
    });
    
    $(document).on('submit', '.wpd-settings-tab_' + wmuJsObj.wmuTabSlug + ' form', function () {
        $('[data-wpd-opt=wmuCustomMimeTypes] .wpd-custom-option-group.wpd-custom-option-group-default').remove();
    });
    $(document).on('click', '[data-wpd-opt=wmuCustomMimeTypes] .wpd-custom-option-group-add', function () {
        var count = $('.wpd-custom-option-group:not(.wpd-custom-option-group-default)').length;
        var cloned = $(this).prev('.wpd-custom-option-group.wpd-custom-option-group-default').clone();
        cloned.removeClass('wpd-custom-option-group-default');
        cloned.find('.wpd-custom-option-label').attr('name', cloned.find('.wpd-custom-option-label').attr('name').replace('[default]', '[' + count + ']'));
        cloned.find('.wpd-custom-option-value').attr('name', cloned.find('.wpd-custom-option-value').attr('name').replace('[default]', '[' + count + ']'));
        cloned.insertBefore($(this).prev('.wpd-custom-option-group.wpd-custom-option-group-default'));
    });
    $(document).on('click', '[data-wpd-opt=wmuCustomMimeTypes] .wpd-custom-option-group .dashicons.dashicons-trash', function () {
        if (confirm(wmuJsObj.wmuRemoveCustomMimeMessage)) {
            var wrap = $(this).parents('.wpd-custom-option-group-wrapper');
            $(this).parents('.wpd-custom-option-group').remove();
            $.each($('.wpd-custom-option-group', wrap), function (i) {
                $('.wpd-custom-option-label', this).attr('name', $('.wpd-custom-option-label', this).attr('name').replace(/\[\d+\]/is, '[' + i + ']'));
                $('.wpd-custom-option-value', this).attr('name', $('.wpd-custom-option-value', this).attr('name').replace(/\[\d+\]/is, '[' + i + ']'));
            });
        }
    });

    function wmuRegenerateKeys(data) {
        doingAjax = true;
        var ajax = wmuGetAjaxObj(data);
        ajax.done(function (response) {
            try {
                var r = response.data;
                data = new FormData();
                data.append('action', 'wmuRegenerateMetakeys');
                data.append('commentId', r.commentId);
                data.append('allCommentsCount', r.allCommentsCount);
                var progress = r.progress < 1 ? 1 : r.progress;
                $('.wmu-regenerate-percent').text(progress + '%');
                if (progress < 100) {
                    wmuRegenerateKeys(data);
                } else {
                    doingAjax = false;
                    setTimeout(function () {
                        $('.wmu-regenerate-percent-wrap').addClass('wmu-hide');
                    }, 1000);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
    
    
    $(document).on('click', '.import-cir', function (e) {
        e.preventDefault();
        var btn = $(this);
        btn.attr('disabled', 'disabled');
        $('.fas', btn).addClass('fa-pulse fa-spinner').removeClass('wc-hidden');
        importCIR(btn);
    });
    
    function importCIR(btn) {
        doingAjax = true;
        var data = btn.parents('.wc-form').serialize();
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {cirData: data, 'action': 'wpdImportCIR'}
        }).done(function (response) {
            try {
                var resp = JSON.parse(response);
                $('.cir-step').val(resp.step);
                if (resp.progress < 100) {
                    importCIR(btn);
                } else {
                    btn.removeAttr('disabled');
                    $('.fas', btn).removeClass('fa-pulse fa-spinner').addClass('wc-hidden');
                }


                if (resp.progress <= 3) {
                    $('.cir-import-progress').text(3 + '%');
                } else {
                    if (resp.progress < 100) {
                        $('.cir-import-progress').text(resp.progress + '%');
                    } else {
                        $('.cir-import-progress').css({'color': '#10b493'});
                        $('.cir-import-progress').text(resp.progress + '% Done');
                        $('.cir-step').val(0);
                        doingAjax = false;
                    }
                }

            } catch (e) {
                console.log(e);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
    }
    
    
    $(document).on('click', '.import-dco', function (e) {
        e.preventDefault();
        var btn = $(this);
        btn.attr('disabled', 'disabled');
        $('.fas', btn).addClass('fa-pulse fa-spinner').removeClass('wc-hidden');
        importDCO(btn);
    });
    function importDCO(btn) {
        doingAjax = true;
        var data = btn.parents('.wc-form').serialize();
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {dcoData: data, 'action': 'wpdImportDCO'}
        }).done(function (response) {
            try {
                var resp = JSON.parse(response);
                $('.dco-step').val(resp.step);
                if (resp.progress < 100) {
                    importDCO(btn);
                } else {
                    btn.removeAttr('disabled');
                    $('.fas', btn).removeClass('fa-pulse fa-spinner').addClass('wc-hidden');
                }


                if (resp.progress <= 3) {
                    $('.dco-import-progress').text(3 + '%');
                } else {
                    if (resp.progress < 100) {
                        $('.dco-import-progress').text(resp.progress + '%');
                    } else {
                        $('.dco-import-progress').css({'color': '#10b493'});
                        $('.dco-import-progress').text(resp.progress + '% Done');
                        $('.dco-step').val(0);
                        doingAjax = false;
                    }
                }

            } catch (e) {
                console.log(e);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        });
    }

    if (wmuJsObj.wmuLazyLoadImages) {
        function wmuImagesInit() {
            var imgDefer = $('table.comments img');
            for (var i = 0; i < imgDefer.length; i++) {
                var wmuImg = $(imgDefer[i]);
                var wmuSrcAttr = wmuImg.attr('wmu-data-src');
                if (wmuSrcAttr) {
                    wmuImg.attr('src', wmuSrcAttr);
                }
            }
        }
        wmuImagesInit();
    }


    window.onbeforeunload = function () {
        if (doingAjax) {
            return "You have attempted to leave this page while background task is running. Are you sure?";
        }
    }

    function wmuGetAjaxObj(data) {
        return $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: data,
            contentType: false,
            processData: false,
        });
    }

});