jQuery(document).ready(function ($) {
    /* global wpdiscuzAjaxObj */
    var voteAjax = '';
    $('body').on('click', '.wv-view-all-button:not(.wv-view-all-button-clicked)', function () {
        var voteResult = $(this);
        var voteType = 'total';
        if ($(this).hasClass('wv-view-all-button-dislike')) {
            voteType = 'dislike';
        } else if ($(this).hasClass('wv-view-all-button-like')) {
            voteType = 'like';
        }
        var id = $(this).parents('.wpd-comment-right').attr('id');
        id = id.substring(id.lastIndexOf('-') + 1);
        var wvHead = voteResult.parents('.wpd-comment-footer').find('.wv-body[data-type=' + voteType + '] .wv-head');
        $(this).addClass('wv-view-all-button-clicked');
        ajaxVote(id, 'viewAll', voteResult, voteType, wvHead);
    });
    $('body').on('click', '.wv-read_more', function () {
        $('.wv-read_more').remove();
        var id = $('.wv_hidden_id').val();
        $('.wv_hidden_id').remove();
        var page = $('.wv_hidden_page').val();
        $('.wv_hidden_page').remove();
        var type = $('.wv_hidde_type').val();
        $('.wv_hidde_type').remove();
        var ajaxVoteSeparateNew = ajaxSend(id, type, 'viewAll', page);
        ajaxVoteSeparateNew.done(function (response) {
            $('#wpdiscuz-loading-bar').hide();
            $('.wv-all-html').append(response);
        });
    });
    $('body').on('mouseover mouseout', '.vote-head', function (e) {
        if (e.type === 'mouseover') {
            $(this).stop().show();
        } else if (e.type === 'mouseout') {
            $(this).stop().hide();
        }
    });
    $('body').on('click', '.wv-view-all', function () {
        $('.wv-all-html').hide();
        $('.wv-all-html').html('');
        $('.wv-view-all').hide();
    });
    $('body').on('mouseout', '.wpd-vote-result', function () {
        if (voteAjax) {
            voteAjax.abort();
        }
        $('#wpdiscuz-loading-bar').hide();
        $('.vote-head').hide();
    });
    $('body').on('mouseenter', '.wpd-vote-result', function () {
        var voteResult = $(this);
        var voteType = 'total';
        if ($(this).hasClass('wpd-vote-result-dislike')) {
            voteType = 'dislike';
        } else if ($(this).hasClass('wpd-vote-result-like')) {
            voteType = 'like';
        }
        var id = voteResult.parents('.wpd-comment-right').attr('id');
        id = id.substring(id.lastIndexOf('-') + 1);
        var wvHead = voteResult.parents('.wpd-comment-footer').find('.wv-body[data-type=' + voteType + '] .wv-head');
        if (voteResult.hasClass('wv-hovered')) {
            wvHead.show();
        } else {
            ajaxVote(id, 'voters', voteResult, voteType, wvHead);
        }
    });
    function setHtml(html, voteResult, voteType) {
        var wvHead = voteResult.parents('.wpd-comment-footer').find('.wv-body[data-type=' + voteType + '] .wv-head');
        if (html) {
            if (wvHead.length) {
                wvHead.parent('.wv-body').replaceWith(html);
            } else {
                $(html).appendTo(voteResult.parents('.wpd-comment-footer').find('.wpd-vote'));
            }
            wvHead = voteResult.parents('.wpd-comment-footer').find('.wv-body[data-type=' + voteType + '] .wv-head');
            wvHead.show();
        } else {
            wvHead.hide();
        }
    }
    function viewAll(html, v) {
        v.hide();
        $('.wv-all-html').html(html);
        $('.wv-view-all').show();
        $('.wv-all-html').css({'display': 'flex'});
    }
    function ajaxVote(id, act, voteResult, voteType, v) {
        voteAjax = ajaxSend(id, voteType, act);
        voteAjax.done(function (response) {
            $('#wpdiscuz-loading-bar').hide();
            if (act === 'viewAll') {
                viewAll(response, v);
                $('.wv-view-all-button').removeClass('wv-view-all-button-clicked');
            } else {
                if (0 == parseInt(wpdiscuzAjaxObj.wvRealTime)) {
                    voteResult.addClass('wv-hovered');
                }
                setHtml(response, voteResult, voteType);
            }
        });
    }
    function ajaxSend(id, typeVote, act, page) {
        page = page ? page : 1;
        $('#wpdiscuz-loading-bar').show();
        return $.ajax({
            type: 'POST',
            url: wpdiscuzAjaxObj.url,
            data: {
                page: page,
                hovered: typeVote,
                id: id,
                action: act
            }
        });
    }
});