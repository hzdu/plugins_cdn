(function ($) {
    "use strict";
    var PENCI = PENCI || {};
    PENCI.sticky_header = function () {
        var headersticky = $(".penci_header.penci_builder_sticky_header_desktop"),
            headertop = $(".penci_header.penci-header-builder.main-builder-header"),
            headernormal = headertop.outerHeight() + 20,
            headermobile = $(".penci_navbar_mobile"),
            lastScrollTop = 0;

        $(window).on("scroll", function () {
            var st = $(this).scrollTop();

            if (st > headernormal) {
                if (headersticky.length) {
                    headersticky.addClass("sticky-apply");
                    headertop.addClass("ns-apply");
                }
            } else {
                if (headersticky.length) {
                    headersticky.removeClass("sticky-apply");
                    headertop.removeClass("ns-apply");
                }
            }

            if (st > headermobile.outerHeight()) {
                headermobile.addClass("mobile-sticky");
            } else {
                headermobile.removeClass("mobile-sticky");
            }

            if (st > lastScrollTop) {
                headersticky.addClass("scrolldown").removeClass("scrollup");
                headermobile.addClass("scrolldown").removeClass("scrollup");
            } else {
                headersticky.addClass("scrollup").removeClass("scrolldown");
                headermobile.addClass("scrollup").removeClass("scrolldown");
            }
            lastScrollTop = st;
        });
    };

    PENCI.main_menu = function () {
        $(".navigation ul.menu > li.penci-mega-menu").on("mouseenter", function () {
            var $this = $(this),
                $row_active = $this.find(".row-active"),
                $rowsLazy = $row_active.find(".penci-lazy");
            $row_active.fadeIn("200").css("display", "inline-block");
        });

        $(".navigation .penci-mega-child-categories a").on(
            "mouseenter",
            function () {
                if ($(this).hasClass("mega-normal-child")) {
                    return;
                }
                if (!$(this).hasClass("cat-active")) {
                    var $this = $(this),
                        $row_active = $this.data("id"),
                        $parentA = $this.parent().children("a"),
                        $parent = $this.closest(".penci-megamenu"),
                        $rows = $this
                            .closest(".penci-megamenu")
                            .find(".penci-mega-latest-posts")
                            .children(".penci-mega-row");
                    $parentA.removeClass("cat-active");
                    $this.addClass("cat-active");
                    $rows.hide();
                    $rows.removeClass("row-active");
                    $parent
                        .find("." + $row_active)
                        .fadeIn("300")
                        .css("display", "inline-block")
                        .addClass("row-active");
                }
            }
        );
    };

    PENCI.mobile_menu = function () {
        // Add indicator

        // Toggle menu when click show/hide menu
        $(".navigation .button-menu-mobile").on("click", function () {
            $("body").addClass("open-mobile-builder-sidebar-nav");
        });

        $(
            ".pc-builder-element nav.penci-vernav-cparent li.menu-item-has-children > a"
        ).on("click", function (e) {
            var $this = $(this);
            e.preventDefault();
            $this.children().children().toggleClass("fa-angle-up");
            $this.next().slideToggle("fast");
        });

        // Close sidebar nav
        $("#close-sidebar-nav").on("click", function () {
            $("body").removeClass("open-sidebar-nav");
        });

        $(".close-mobile-menu-builder").on("click", function (e) {
            e.preventDefault();
            $("body").removeClass("open-mobile-builder-sidebar-nav");
        });
    };
    /* Init functions
       ---------------------------------------------------------------*/
    $(document).ready(function () {
        PENCI.sticky_header();
        PENCI.mobile_menu();
        PENCI.main_menu();
        $("body").on("penci-ajax-menu-loaded", function () {
            PENCI.main_menu();
        });
    });
})(jQuery); // EOF
