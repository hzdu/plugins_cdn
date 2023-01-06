jQuery(document).ready(function ($) {

    var get_hash = window.location.hash;
    var clean_hash = get_hash.split('$');

    if (typeof sessionStorage != 'undefined') {
        var seopress_bot_tab_session_storage = sessionStorage.getItem("seopress_scan_tab");

        if (clean_hash[1] == '1') { //Scan Tab
            $('#tab_seopress_scan-tab').addClass("nav-tab-active");
            $('#tab_seopress_scan').addClass("active");
        } else if (clean_hash[1] == '2') { //Scan settings Tab
            $('#tab_seopress_scan_settings-tab').addClass("nav-tab-active");
            $('#tab_seopress_scan_settings').addClass("active");
        } else if (seopress_bot_tab_session_storage) {
            $('#seopress-tabs').find('.nav-tab.nav-tab-active').removeClass("nav-tab-active");
            $('#seopress-tabs').find('.seopress-tab.active').removeClass("active");

            $('#' + seopress_bot_tab_session_storage.split('#tab=') + '-tab').addClass("nav-tab-active");
            $('#' + seopress_bot_tab_session_storage.split('#tab=')).addClass("active");
        } else {
            //Default TAB
            $('#tab_seopress_scan-tab').addClass("nav-tab-active");
            $('#tab_seopress_scan').addClass("active");
        }
    };
    $("#seopress-tabs").find("a.nav-tab").click(function (e) {
        e.preventDefault();
        var hash = $(this).attr('href').split('#tab=')[1];

        $('#seopress-tabs').find('.nav-tab.nav-tab-active').removeClass("nav-tab-active");
        $('#' + hash + '-tab').addClass("nav-tab-active");

        if (clean_hash[1] == 1) {
            sessionStorage.setItem("seopress_scan_tab", 'tab_seopress_scan');
        } else if (clean_hash[1] == 2) {
            sessionStorage.setItem("seopress_scan_tab", 'tab_seopress_scan_settings');
        } else {
            sessionStorage.setItem("seopress_scan_tab", hash);
        }

        $('#seopress-tabs').find('.seopress-tab.active').removeClass("active");
        $('#' + hash).addClass("active");
    });

    //Ajax
    $('#seopress_launch_bot').on('click', function (e) {
        e.preventDefault();
        self.process_offset(0, self);
    });
    process_offset = function (offset, self) {
        $.ajax({
            method: 'POST',
            url: seopressAjaxBot.seopress_request_bot,
            data: {
                action: 'seopress_request_bot',
                _ajax_nonce: seopressAjaxBot.seopress_nonce,
                offset: offset,
            },
            success: function (data) {
                if ('done' == data.data.offset) {
                    window.location.reload(true);
                } else {
                    if ($('#seopress_bot_log').val().length > 0) {
                        prev = $('#seopress_bot_log').val();
                    } else {
                        prev = '';
                    }
                    $('#seopress_bot_log').text(data.data.post_title + '\n' + prev);
                    self.process_offset(parseInt(data.data.offset), self);
                }
            },
        });
    };
    $('#seopress_launch_bot').on('click', function () {
        $('#seopress_bot_log').show();
        $(this).attr("disabled", "disabled");
        $('.spinner').css("visibility", "visible");
        $('.spinner').css("float", "none");
    });
});
