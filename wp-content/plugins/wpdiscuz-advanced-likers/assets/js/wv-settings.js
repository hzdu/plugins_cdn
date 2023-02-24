jQuery(document).ready(function ($) {
    $('body').on('change', '#wv_read_more', function () {
        if ($(this).is(':checked')) {
            $(this).parents('.wpd-opt-row').next().show();
        } else {
            $(this).parents('.wpd-opt-row').next().hide();
        }
    });

    $('.wv-iconpicker').iconpicker({
        placement: 'bottom',
        selectedCustomClass: 'wv-bg-primary',
        component: '.wv-icon-preview',
        collision: true
    });

    $('.iconpicker-item').on('click', function () {
        var iconClass = $('i', this).attr('class');
        $(this).parents('.wv_level_box').find('.wv-icon-preview').children('i').removeClass().addClass(iconClass);
    });

    var doingAjax = false;
    window.onbeforeunload = confirmExit;
    function confirmExit() {
        if (doingAjax) {
            return "You have attempted to leave this page while background task is running. Are you sure?";
        }
    }
    $('.recount-user-votes-step').val(0);
    $(document).on('click', '.recount-user-votes', function (e) {
        console.log("clicked");
        e.preventDefault();
        if ($('.recount-user-votes-start-id').val() >= 0) {
            var btn = $(this);
            btn.attr('disabled', 'disabled');
            $('.fas', btn).addClass('fa-pulse fa-spinner').removeClass('wc-hidden');
            recountVotes(btn);
        }

    });
    function recountVotes(btn) {
        doingAjax = true;
        var data = new FormData();
        data.append('action', 'wvRecountVotes');
        data.append('recount-user-votes-start-id', $('.recount-user-votes-start-id').val());
        data.append('recount-user-votes-count', $('.recount-user-votes-count').val());
        data.append('recount-user-votes-step', $('.recount-user-votes-step').val());
        data.append('wv_recount_nonce', $('#wv_recount_nonce').val());
        data.append('_wp_http_referer', $('[name=_wp_http_referer]').val());
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            processData: false,
            contentType: false,
            data: data
        }).done(function (response) {
            try {
                var resp = JSON.parse(response);
                $('.recount-user-votes-step').val(resp.step);
                $('.recount-user-votes-start-id').val(resp.startId);
                if (resp.progress < 100) {
                    recountVotes(btn);
                } else {
                    btn.removeAttr('disabled');
                    $('.fas', btn).removeClass('fa-pulse fa-spinner').addClass('wc-hidden');
                }

                if (resp.progress <= 1) {
                    $('.recount-user-votes-import-progress').text(1 + '%');
                } else {
                    if (resp.progress < 100) {
                        $('.recount-user-votes-import-progress').text(resp.progress + '%');
                    } else {
                        $('.recount-user-votes-import-progress').css({'color': '#10b493'});
                        $('.recount-user-votes-import-progress').text(resp.progress + '% Done');
                        $('.recount-user-votes-count').val(0);
                        $('.recount-user-votes-step').val(0);
                        $('.recount-user-votes-start-id').val(0);
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
});