jQuery(document).ready(function ($) {
    /* global wpdiscuzAjaxObj */
    var moveToPost = 0;
    var femXHR = 0;

    $(document).on('click', '.wpdiscuz-fem-approve-comment', function () {
        var currentObject = $(this);
        var commentID = getCommentID(currentObject);
        if (confirm(wpdiscuzAjaxObj.fem_confirm_approve)) {
            var data = new FormData();
            data.append('action', 'wfem_moderate');
            data.append('commentID', commentID);
            data.append('status', 'approve');
            var ajax = wpdiscuzAjaxObj.getAjaxObj(true, true, data);
            ajax.done(function (r) {
                if (typeof r === 'object') {
                    if (r.success) {
                        location.reload(true);
                    } else {
                        wpdiscuzAjaxObj.setCommentMessage(r.data, 'error');
                    }
                } else {
                    console.log(r);
                }
                $('#wpdiscuz-loading-bar').fadeOut(250);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('#wpdiscuz-loading-bar').fadeOut(250);
            });
        }
    });

    $(document).on('click', '.wpdiscuz-fem-unapprove-comment', function () {
        var currentObject = $(this);
        var commentID = getCommentID(currentObject);
        if (confirm(wpdiscuzAjaxObj.fem_confirm_unapprove)) {
            var data = new FormData();
            data.append('action', 'wfem_moderate');
            data.append('commentID', commentID);
            data.append('status', 'hold');
            var ajax = wpdiscuzAjaxObj.getAjaxObj(true, true, data);
            ajax.done(function (r) {
                if (typeof r === 'object') {
                    if (r.success) {
                        location.reload(true);
                    } else {
                        wpdiscuzAjaxObj.setCommentMessage(r.data, 'error');
                    }
                } else {
                    console.log(r);
                }
                $('#wpdiscuz-loading-bar').fadeOut(250);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('#wpdiscuz-loading-bar').fadeOut(250);
            });
        }
    });

    $(document).on('click', '.wpdiscuz-fem-trash-comment', function () {
        var currentObject = $(this);
        var commentID = getCommentID(currentObject);
        if (confirm(wpdiscuzAjaxObj.fem_confirm_trash)) {
            var data = new FormData();
            data.append('action', 'wfem_moderate');
            data.append('commentID', commentID);
            data.append('status', 'trash');
            var ajax = wpdiscuzAjaxObj.getAjaxObj(true, true, data);
            ajax.done(function (r) {
                if (typeof r === 'object') {
                    if (r.success) {
                        wpdiscuzAjaxObj.setCommentMessage(r.data, 'success');
                        currentObject.parents('.wpd-comment-wrap').parent().slideUp(1000, function () {
                            $(this).remove();
                        });
                    } else {
                        wpdiscuzAjaxObj.setCommentMessage(r.data, 'error');
                    }
                } else {
                    console.log(r);
                }
                $('#wpdiscuz-loading-bar').fadeOut(250);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('#wpdiscuz-loading-bar').fadeOut(250);
            });
        }
    });

    $(document).on('click', '.wpdiscuz-fem-spam-comment', function () {
        var currentObject = $(this);
        var commentID = getCommentID(currentObject);
        if (confirm(wpdiscuzAjaxObj.fem_confirm_spam)) {
            var data = new FormData();
            data.append('action', 'wfem_moderate');
            data.append('commentID', commentID);
            data.append('status', 'spam');
            var ajax = wpdiscuzAjaxObj.getAjaxObj(true, true, data);
            ajax.done(function (r) {
                if (typeof r === 'object') {
                    if (r.success) {
                        wpdiscuzAjaxObj.setCommentMessage(r.data, 'success');
                        currentObject.parents('.wpd-comment-wrap').parent().slideUp(1000, function () {
                            $(this).remove();
                        });
                    } else {
                        wpdiscuzAjaxObj.setCommentMessage(r.data, 'error');
                    }
                } else {
                    console.log(r);
                }
                $('#wpdiscuz-loading-bar').fadeOut(250);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('#wpdiscuz-loading-bar').fadeOut(250);
            });
        }
    });

    $(document).on('click', '.wpdiscuz-fem-email-comment', function () {
        var commentID = getCommentID($(this));
        var commentAuthor = $(this).parents('div[id^=comment-]').find('.wpd-comment-author').text();
        commentAuthor = commentAuthor.length <= 25 ? commentAuthor : commentAuthor.substring(0, 25) + '...';
        $('.wpdiscuz-fem-email-form').find('em').text(commentAuthor);
        $('.wpdiscuz-fem-email-form').find('#wpdiscuz_fem_email_comment_id').val(commentID);
        $('.wpdiscuz-fem-email').show();
        $('.wpdiscuz-fem-email-form').show();
    });

    $(document).on('click', '.wpdiscuz-fem-send', function () {
        var commentID = $('#wpdiscuz_fem_email_comment_id').val();
        var message = $('.wpdiscuz-fem-msg').val();
        var subject = $('.wpdiscuz-fem-subj').val();
        if (commentID && message) {
            $('.wpdiscuz-fem-email-form').children('#wpdiscuz-fem-not').remove();
            var data = new FormData();
            data.append('action', 'wfem_email');
            data.append('commentID', commentID);
            data.append('subject', subject);
            data.append('message', message);
            var ajax = wpdiscuzAjaxObj.getAjaxObj(true, true, data);
            ajax.done(function (r) {
                $('#wpdiscuz-fem-not').remove();
                $('.wpdiscuz-fem-email').show();
                $('.wpdiscuz-fem-email-form').hide();
                $('.wpdiscuz-fem-response').remove();
                $('.wpdiscuz-fem-email').append(r);
                $('#wpdiscuz-loading-bar').hide();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('#wpdiscuz-loading-bar').fadeOut(250);
            });
        } else {
            $('.wpdiscuz-fem-email-form').children('#wpdiscuz-fem-not').remove();
            $('.wpdiscuz-fem-email-form').append('<div id="wpdiscuz-fem-not">' + wpdiscuzAjaxObj.fem_please_fill + '</div>');
        }
    });

    $(document).on('keyup', '.wpdiscuz-fem-post', function () {
        var postsLike = $('.wpdiscuz-fem-post').val();
        if (femXHR != 0) {
            femXHR.abort();
            femXHR = 0;
        }
        $('#wpdiscuz-loading-bar').fadeOut(250);
        if (postsLike.length > 2) {
            var data = new FormData();
            data.append('action', 'wfem_post_titles');
            data.append('commentPostID', wpdiscuzAjaxObj.wc_post_id);
            data.append('postsLike', postsLike);
            femXHR = wpdiscuzAjaxObj.getAjaxObj(true, true, data);
            femXHR.done(function (r) {
                if (r) {
                    $('.wpdiscuz-fem-posts').show();
                    $('.wpdiscuz-fem-posts').empty();
                    $('.wpdiscuz-fem-posts').append(r);
                } else {
                    $('.wpdiscuz-fem-posts').hide();
                    $('.wpdiscuz-fem-posts').empty();
                }
                $('#wpdiscuz-loading-bar').fadeOut(250);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('#wpdiscuz-loading-bar').fadeOut(250);
            });
        } else {
            $('.wpdiscuz-fem-posts').hide();
            $('.wpdiscuz-fem-posts').empty();
        }
    });

    $(document).on('click', '.wpdiscuz-fem-move-comment', function () {
        var commentID = getCommentID($(this));
        var comment = $(this).parents('#comment-' + commentID).find('.wpd-comment-text').clone();
        $(comment).find('.wpd-top-custom-fields').remove();
        $(comment).find('.wpd-bottom-custom-fields').remove();
        comment = $(comment).text();
        comment = comment.length <= 200 ? comment : comment.substring(0, 200) + '...';
        $('.wpdiscuz-fem-move-form').find('em').text(comment);
        $('.wpdiscuz-fem-move-form').find('#wpdiscuz_fem_move_comment_id').val(commentID);
        $('.wpdiscuz-fem-moving').show();
        $('.wpdiscuz-fem-move-form').show();
    });

    $(document).on('click', '.wpdiscuz-fem-move-form', function () {
        $('.wpdiscuz-fem-posts').hide();
        $('.wpdiscuz-fem-posts').empty();
    });

    $(document).on('click', 'div[id^=fem-post-]', function () {
        var current = $(this).attr('id');
        var text = $(this).text();
        moveToPost = parseInt(current.substring(current.lastIndexOf('-') + 1));
        $('.wpdiscuz-fem-posts').hide();
        $('.wpdiscuz-fem-posts').empty();
        $('.wpdiscuz-fem-post').val(text);
    });

    $(document).on('click', '.wpdiscuz-fem-move', function () {
        if (moveToPost) {
            var commentID = $('#wpdiscuz_fem_move_comment_id').val();
            $('.wpdiscuz-fem-move-form').children('#wpdiscuz-fem-not').remove();
            $('.wpdiscuz-fem-posts').hide();
            var data = new FormData();
            data.append('action', 'wfem_move_comment');
            data.append('commentID', commentID);
            data.append('moveToPost', moveToPost);
            var ajax = wpdiscuzAjaxObj.getAjaxObj(true, true, data);
            ajax.done(function (r) {
                $('#wpdiscuz-fem-not').remove();
                $('.wpdiscuz-fem-moving').show();
                $('.wpdiscuz-fem-move-form').hide();
                $('.wpdiscuz-fem-response').remove();
                $('.wpdiscuz-fem-moving').append(r);
                $('#comment-' + commentID).parent('.wpd-comment-wrap').parent().slideUp(1000, function () {
                    $(this).remove();
                });
                $('#wpdiscuz-loading-bar').fadeOut(250);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('#wpdiscuz-loading-bar').fadeOut(250);
            });
        } else {
            $('.wpdiscuz-fem-move-form').children('#wpdiscuz-fem-not').remove();
            $('.wpdiscuz-fem-move-form').append('<div id="wpdiscuz-fem-not">' + wpdiscuzAjaxObj.fem_choose_post + '</div>');
        }
    });

    $(document).on('click', '.wpdiscuz-fem-blacklist-comment', function () {
        var currentObject = $(this);
        var commentID = getCommentID(currentObject);
        if (confirm(wpdiscuzAjaxObj.fem_confirm_blacklist)) {
            var data = new FormData();
            data.append('action', 'wfem_blacklist');
            data.append('commentID', commentID);
            var ajax = wpdiscuzAjaxObj.getAjaxObj(true, true, data);
            ajax.done(function (r) {
                if (typeof r === 'object') {
                    if (r.success) {
                        currentObject.parents('.wpd-comment-wrap').parent().slideUp(1000, function () {
                            $(this).remove();
                        });
                    } else {
                        wpdiscuzAjaxObj.setCommentMessage(r.data, 'error');
                    }
                } else {
                    console.log(r);
                }
                $('#wpdiscuz-loading-bar').fadeOut(250);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('#wpdiscuz-loading-bar').fadeOut(250);
            });
        }
    });

    $(document).on('click', '.wpdiscuz-fem-delete-comment', function () {
        var currentObject = $(this);
        var commentID = getCommentID(currentObject);
        if (confirm(wpdiscuzAjaxObj.fem_confirm_delete)) {
            var data = new FormData();
            data.append('action', 'wfem_delete');
            data.append('commentID', commentID);
            var ajax = wpdiscuzAjaxObj.getAjaxObj(true, true, data);
            ajax.done(function (r) {
                if (typeof r === 'object') {
                    if (r.success) {
                        currentObject.parents('.wpd-comment-wrap').parent().slideUp(1000, function () {
                            $(this).remove();
                        });
                    } else {
                        wpdiscuzAjaxObj.setCommentMessage(r.data, 'error');
                    }
                } else {
                    console.log(r);
                }
                $('#wpdiscuz-loading-bar').fadeOut(250);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                $('#wpdiscuz-loading-bar').fadeOut(250);
            });
        }
    });

    $(document).on('click', '.wpdiscuz-fem-moving, .wpdiscuz-fem-email, .fa-times, .wpdiscuz-fem-ok', function () {
        $('.wpdiscuz-fem-response, #wpdiscuz-fem-not').remove();
        $('.wpdiscuz-fem-moving, .wpdiscuz-fem-move-form, .wpdiscuz-fem-email-form, .wpdiscuz-fem-posts, .wpdiscuz-fem-email, #wpdiscuz-loading-bar').hide();
        moveToPost = 0;
        $('.wpdiscuz-fem-email-form, .wpdiscuz-fem-move-form').children('#wpdiscuz-fem-not').remove();
        $('.wpdiscuz-fem-email-form').find('em').empty();
        $('.wpdiscuz-fem-msg, .wpdiscuz-fem-subj, .wpdiscuz-fem-post, #wpdiscuz_fem_email_comment_id, #wpdiscuz_fem_move_comment_id').val('');
    });

    function getCommentID(obj) {
        var ID = obj.parents('div[id^=comment-]').attr('id');
        return ID.substring(ID.lastIndexOf('-') + 1);
    }

});