(function ($) {
    "use strict";
    var containerID = $('.enable-boxed').length ? 'soledad_wrapper' : 'side-ads-container',
        mainContainer = document.getElementById('side-ads-container'),
        containerElem = document.getElementById(containerID),
        objAdDivRight = document.getElementById('side-ads-right'),
        objAdDivLeft = document.getElementById('side-ads-left'),
        body = document.querySelector('body'),
        html = document.querySelector('html'),
        mainContentW = containerElem.offsetWidth,
        sideMargin = 15,
        marginTop = parseInt(mainContainer.dataset.mt),
        marginTopScroll = parseInt(mainContainer.dataset.mts),
        LeftBannerW = parseInt(mainContainer.dataset.w);

    function FloatTopDiv() {
        let startLX;
        let startLY;
        startLX = ((document.body.clientWidth - mainContentW) / 2) - (LeftBannerW + sideMargin), startLY = marginTop;
        let startRX;
        let startRY;
        startRX = ((document.body.clientWidth - mainContentW) / 2) + (mainContentW + sideMargin), startRY = marginTop;

        var d = document;
        var scrollTopCheck = window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop || 0;

        function set_position(divID, xP, yP) {
            divID.style.left = xP + 'px';
            divID.style.marginTop = yP + 'px';
        }

        if (scrollTopCheck >= Math.abs(marginTop - marginTopScroll)) {
            startLY = marginTopScroll;
            startRY = marginTopScroll;
            objAdDivLeft.style.position = 'fixed';
            objAdDivRight.style.position = 'fixed';
        } else {
            startLY = marginTop;
            startRY = marginTop;
            objAdDivLeft.style.position = 'absolute';
            objAdDivRight.style.position = 'absolute';
        }


        set_position(objAdDivLeft, startLX, startLY);
        set_position(objAdDivRight, startRX, startRY);
    }


    function ShowAdDiv() {
        objAdDivRight.style.display = objAdDivLeft.style.display = 'block';
        body.style.overflowX = html.style.overflowX = 'hidden';
        FloatTopDiv();
    }

    ShowAdDiv();


    window.addEventListener('resize', function () {
        FloatTopDiv();
    });
    window.addEventListener('scroll', function () {
        FloatTopDiv();
    });


})(jQuery);	// EOF
