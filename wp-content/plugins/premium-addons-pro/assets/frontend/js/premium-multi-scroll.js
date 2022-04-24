(function ($) {

    $(window).on('elementor/frontend/init', function () {

        var PremiumScrollHandler = function ($scope, $) {
            var premiumScrollElem = $scope.find(".premium-multiscroll-wrap"),
                premiumScrollSettings = premiumScrollElem.data("settings"),
                id = premiumScrollSettings["id"];

            function loadMultiScroll() {
                $("#premium-scroll-nav-menu-" + id).removeClass(
                    "premium-scroll-responsive"
                );
                $("#premium-multiscroll-" + id).multiscroll({
                    verticalCentered: true,
                    menu: "#premium-scroll-nav-menu-" + id,
                    sectionsColor: [],
                    keyboardScrolling: premiumScrollSettings["keyboard"],
                    navigation: premiumScrollSettings["dots"],
                    navigationPosition: premiumScrollSettings["dotsPos"],
                    navigationVPosition: premiumScrollSettings["dotsVPos"],
                    navigationTooltips: premiumScrollSettings["dotsText"],
                    navigationColor: "#000",
                    loopBottom: premiumScrollSettings["btmLoop"],
                    loopTop: premiumScrollSettings["topLoop"],
                    css3: true,
                    paddingTop: 0,
                    paddingBottom: 0,
                    normalScrollElements: null,
                    //          scrollOverflow: true,
                    //          scrollOverflowOptions: null,
                    touchSensitivity: 5,
                    leftSelector: ".premium-multiscroll-left-" + id,
                    rightSelector: ".premium-multiscroll-right-" + id,
                    sectionSelector: ".premium-multiscroll-temp-" + id,
                    anchors: premiumScrollSettings["anchors"],
                    fit: premiumScrollSettings["fit"],
                    cellHeight: premiumScrollSettings["cellHeight"],
                    id: id,
                    leftWidth: premiumScrollSettings["leftWidth"],
                    rightWidth: premiumScrollSettings["rightWidth"]
                });
            }
            var leftTemps = $(premiumScrollElem).find(".premium-multiscroll-left-temp"),
                rightTemps = $(premiumScrollElem).find(".premium-multiscroll-right-temp"),
                hideTabs = premiumScrollSettings["hideTabs"],
                hideMobs = premiumScrollSettings["hideMobs"],
                deviceType = $("body").data("elementor-device-mode");

            function hideSections(leftSec, rightSec) {
                if ("mobile" === deviceType) {
                    $(leftSec).data("hide-mobs") ?
                        $(leftSec).addClass("premium-multiscroll-hide") :
                        "";
                    $(rightSec).data("hide-mobs") ?
                        $(rightSec).addClass("premium-multiscroll-hide") :
                        "";
                } else {
                    $(leftSec).data("hide-tabs") ?
                        $(leftSec).addClass("premium-multiscroll-hide") :
                        "";
                    $(rightSec).data("hide-tabs") ?
                        $(rightSec).addClass("premium-multiscroll-hide") :
                        "";
                }
            }

            function reOrderTemplates() {
                $(premiumScrollElem)
                    .parents(".elementor-top-section")
                    .removeClass("elementor-section-height-full");
                $.each(rightTemps, function (index) {
                    hideSections(leftTemps[index], rightTemps[index]);
                    if (premiumScrollSettings["rtl"]) {
                        $(leftTemps[index]).insertAfter(rightTemps[index]);
                    } else {
                        $(rightTemps[index]).insertAfter(leftTemps[index]);
                    }
                });
                $(premiumScrollElem)
                    .find(".premium-multiscroll-inner")
                    .removeClass("premium-scroll-fit")
                    .css("min-height", premiumScrollSettings["cellHeight"] + "px");
            }

            switch (true) {
                case hideTabs && hideMobs:
                    if (deviceType === "desktop") {
                        loadMultiScroll();
                    } else {
                        reOrderTemplates();
                    }
                    break;
                case hideTabs && !hideMobs:
                    if (deviceType === "mobile" || deviceType === "desktop") {
                        loadMultiScroll();
                    } else {
                        reOrderTemplates();
                    }
                    break;
                case !hideTabs && hideMobs:
                    if (deviceType === "tablet" || deviceType === "desktop") {
                        loadMultiScroll();
                    } else {
                        reOrderTemplates();
                    }
                    break;
                case !hideTabs && !hideMobs:
                    loadMultiScroll();
                    break;
            }
        };

        elementorFrontend.hooks.addAction('frontend/element_ready/premium-multi-scroll.default', PremiumScrollHandler);
    });
})(jQuery);