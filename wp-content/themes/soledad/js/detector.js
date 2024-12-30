(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.AdBlocker = function () {
        if (penci_options_set.ad_blocker_detector) {
            var ad_container = $('.Ad-Container');
            if (ad_container.length > 0 && ad_container.css('display') === 'none') {

                if ($('.penci-adblocker-popup').length > 0) {
                    if (penci_options_set.ad_blocker_detector_delay) {
                        setTimeout(function () {
                            PENCI.ShowAdBLockerNotice();
                        }, penci_options_set.ad_blocker_detector_delay);
                    } else {
                        PENCI.ShowAdBLockerNotice();
                    }
                }
            }
        }
    };

    PENCI.ShowAdBLockerNotice = function () {

        if (PENCI.getcookie('penci_adblocker_popup_onetime')) {
            return;
        }

        $.magnificPopup.open({
            items: {
                src: '.penci-adblocker-popup'
            },
            type: 'inline',
            removalDelay: 500,
            tClose: false,
            tLoading: false,
            closeOnBgClick: false,
            callbacks: {
                beforeOpen: function () {
                    this.st.mainClass = 'mfp-ani-wrap penci-promo-popup-wrapper';
                },
                close: function () {
                    if (penci_options_set.penci_adblocker_popup_onetime) {
                        PENCI.setcookie('penci_adblocker_popup_onetime', '1');
                    }
                }
            }
        });
    };

    PENCI.getcookie = function (cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    PENCI.setcookie = function (cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /* Init functions
	 ---------------------------------------------------------------*/
    $(document).ready(function () {
        PENCI.AdBlocker();
    });

})(jQuery);	// EOF