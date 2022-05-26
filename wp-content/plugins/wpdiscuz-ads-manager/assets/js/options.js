jQuery(document).ready(function ($) {

    var isAdPage = location.href.indexOf(wamDashVars.wamAdsUrl) >= 0 || wamDashVars.wamPostType == 1;
    var isBannerPage = location.href.indexOf(wamDashVars.wamBannersUrl) >= 0;

    if (isAdPage || isBannerPage) {
        $('#toplevel_page_wpdiscuz, #toplevel_page_wpdiscuz > a').removeClass('wp-not-current-submenu');
        $('#toplevel_page_wpdiscuz, #toplevel_page_wpdiscuz > a').addClass('wp-has-current-submenu');
        if (isAdPage) {
            $('#toplevel_page_wpdiscuz .wp-submenu li a:contains("' + wamDashVars.wamAdsMenuTitle + '")').parent().addClass('current');
        } else if (isBannerPage) {
            $('#toplevel_page_wpdiscuz .wp-submenu li a:contains("' + wamDashVars.wamBannersMenuTitle + '")').parent().addClass('current');
        }
    }

    $(function () {
        $(".wam-ad-start").datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $(".wam-ad-end").datepicker("option", "minDate", selectedDate);
            }
        });
        $(".wam-ad-end").datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $(".wam-ad-start").datepicker("option", "maxDate", selectedDate);
            }
        });
    });

    if ($('#_wam_banner_location').val() == wamDashVars.wamLocationList) {
        $('.wam-meta-repeats').show();
    } else {
        $('.wam-meta-repeats').hide();
    }

    $(document).on('change', '#_wam_banner_location', function () {
        if ($(this).val() == wamDashVars.wamLocationList) {
            $('.wam-meta-repeats').show();
        } else {
            $('.wam-meta-repeats').hide();
        }
    });

    $(document).on('click', '.wam-status', function (e) {
        if ($(this).hasClass('wam-status-ended')) {
            e.preventDefault();
            alert(wamDashVars.wamStatusEnded);
        } else {
            if (!confirm(wamDashVars.wamConfirm)) {
                e.preventDefault();
                return;
            }
        }
    });

});