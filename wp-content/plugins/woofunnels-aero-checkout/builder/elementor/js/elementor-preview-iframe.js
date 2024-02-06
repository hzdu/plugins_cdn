(function ($) {


    var aero_id = $('#wfacp_aero_checkout_id').attr('content');

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    setCookie('wfacp_elementor_open_page', '', -5);
    $(document.body).on('wfacp_step_switching', function (e, v) {
        if (v.hasOwnProperty('current_step')) {
            var str = aero_id + '@' + v.current_step;
            setCookie('wfacp_elementor_open_page', str, 1);
        }
    });
})(jQuery);