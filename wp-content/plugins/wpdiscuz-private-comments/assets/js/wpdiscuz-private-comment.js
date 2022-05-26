jQuery(document).ready(function ($) {
    $(document).on('click', '#wpdcom .wpdiscuz-private-comment-action', function () {
        var itemID = $(this).attr('id');
        var status = $(this).hasClass('hidden') ? 'private' : 'public';
        if (itemID.length) {
            var data = new FormData();
            data.append('action', 'wpdPrivateCommentChangeStatus');
            data.append('status', status);
            data.append('html_id', itemID);
            wpdiscuzAjaxObj.getAjaxObj(true, true, data).done(function (r) {
                if (typeof r === 'object') {
                    if (r.success) {
                        setTimeout(function () {
                            location.reload(true);
                        }, 100);
                    } else {
                        wpdiscuzAjaxObj.setCommentMessage(r.text, 'error');
                    }
                } else {
                    console.log(r);
                }
                $('#wpdiscuz-loading-bar').fadeOut(250);
            });
        }
    });
});