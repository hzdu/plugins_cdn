jQuery(document).ready(function ($) {
    $(document).on('click', '.wpds-send-email', function () {
        if ($(this).attr('data-id').length) {
            var wpdsId = $(this).attr('data-id');
            tb_show(wpdsScripts.email_caption, ajaxurl + "?action=" + wpdsScripts.action_form + "&id=" + wpdsId + "&width=700&height=350");
        }
        return false;
    });

    $(document).on('click', '.wpds-follow-send-email', function () {
        if ($(this).attr('data-id').length) {
            var wpdsId = $(this).attr('data-id');
            tb_show(wpdsScripts.email_caption, ajaxurl + "?action=" + wpdsScripts.follow_action_form + "&id=" + wpdsId + "&width=700&height=350");
        }
        return false;
    });


    $(document).on('click', '#wpds-mail-submit', function () {
        var id = $('#wpds-mail-id').val();
        var subject = $('#wpds-mail-subject').val();
        var text = $('#wpds-mail-text').val();
        var wpdsForm = $('#wpds-mail-form');
        wpdsForm.submit(function (event) {
            event.preventDefault();
        });
        if (wpdsForm[0].checkValidity() && id && subject && text) {
            $('#TB_ajaxContent').html('<img class="wpds-load" src="' + wpdsScripts.loader + '">');
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: wpdsScripts.action_send_mail,
                    id: id,
                    subject: subject,
                    text: text,
                }
            }).done(function (response) {
                try {
                    var obj = JSON.parse(response);
                    var contClass = 'wpds-respons-' + obj.code;
                    $('#TB_ajaxContent').html('<div class="' + contClass + '">' + obj.message + '</div>');
                } catch (e) {
                    console.log(e);
                }
            });
        }
    });

    $(document).on('click', '#wpds-follow-mail-submit', function () {
        var id = $('#wpds-mail-id').val();
        var subject = $('#wpds-mail-subject').val();
        var text = $('#wpds-mail-text').val();
        var wpdsForm = $('#wpds-mail-form');
        wpdsForm.submit(function (event) {
            event.preventDefault();
        });
        if (wpdsForm[0].checkValidity() && id && subject && text) {
            $('#TB_ajaxContent').html('<img class="wpds-load" src="' + wpdsScripts.loader + '">');
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: wpdsScripts.action_send_follow_mail,
                    id: id,
                    subject: subject,
                    text: text,
                }
            }).done(function (response) {
                try {
                    var obj = JSON.parse(response);
                    var contClass = 'wpds-respons-' + obj.code;
                    $('#TB_ajaxContent').html('<div class="' + contClass + '">' + obj.message + '</div>');
                } catch (e) {
                    console.log(e);
                }
            });
        }
    });
    
    $(document).on('click', '#wpds-view-stat', function () {
        tb_show(wpdsScripts.stat_caption, ajaxurl + "?action=" + wpdsScripts.action_view_stats + "&width=350&height=250");
    });

    $(document).on('click', '#wpds-view-follow-stat', function () {
        tb_show(wpdsScripts.stat_caption, ajaxurl + "?action=" + wpdsScripts.action_view_follow_stats + "&width=350&height=250");
    });

});