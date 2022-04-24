(function ($) {

    $(window).on('elementor/frontend/init', function () {

        var PremiumFlipboxHandler = function ($scope, $) {
            var $flipboxElement = $scope.find(".premium-flip-main-box"),
                height = $flipboxElement.height() / 2,
                width = $flipboxElement.width() / 2;

            if ($scope.hasClass("premium-flip-style-cube")) {

                $flipboxElement.on("mouseenter", function () {

                    height = $flipboxElement.height() / 2,
                        width = $flipboxElement.width() / 2;

                    moveCube('rotateY', 'premium-flip-frontrl', -90, width);
                    moveCube('rotateY', 'premium-flip-backrl', 0, width);

                    moveCube('rotateY', 'premium-flip-frontlr', 90, width);
                    moveCube('rotateY', 'premium-flip-backlr', 0, width);

                    moveCube('rotateX', 'premium-flip-fronttb', -90, height);
                    moveCube('rotateX', 'premium-flip-backtb', 0, height);

                    moveCube('rotateX', 'premium-flip-frontbt', 90, height);
                    moveCube('rotateX', 'premium-flip-backbt', 0, height);

                });

                $flipboxElement.on("mouseleave", function () {
                    moveCube('rotateY', 'premium-flip-frontrl', 0, width);
                    moveCube('rotateY', 'premium-flip-backrl', 90, width);

                    moveCube('rotateY', 'premium-flip-frontlr', 0, width);
                    moveCube('rotateY', 'premium-flip-backlr', -90, width);

                    moveCube('rotateX', 'premium-flip-fronttb', 0, height);
                    moveCube('rotateX', 'premium-flip-backtb', 90, height);

                    moveCube('rotateX', 'premium-flip-frontbt', 0, height);
                    moveCube('rotateX', 'premium-flip-backbt', -90, height);

                });

            }

            //to rotate elements
            function moveCube(rotation, el, deg, h) {
                $flipboxElement.find('.' + el).css({
                    'transform': rotation + '(' + deg + 'deg) translateZ(' + h + 'px)',
                    '-webkit-transform': rotation + '(' + deg + 'deg) translateZ(' + h + 'px)',
                    '-moz-transform': rotation + '(' + deg + 'deg) translateZ(' + h + 'px)'
                });
            }

            if (!$scope.hasClass("premium-flip-style-flip"))
                return;

            $flipboxElement.on("mouseenter", function () {
                $(this).addClass("flipped");

                if (!$flipboxElement.data("flip-animation"))
                    return;
                if (
                    $(this)
                        .children(".premium-flip-front")
                        .hasClass("premium-flip-frontrl")
                ) {
                    $(this)
                        .find(
                            ".premium-flip-front .premium-flip-front-content-container .premium-flip-text-wrapper"
                        )
                        .removeClass("PafadeInLeft")
                        .addClass("PafadeInRight");

                    $(this)
                        .find(
                            ".premium-flip-back .premium-flip-back-content-container .premium-flip-back-text-wrapper"
                        )
                        .addClass("PafadeInLeft")
                        .removeClass("PafadeInRight");
                } else if (
                    $(this)
                        .children(".premium-flip-front")
                        .hasClass("premium-flip-frontlr")
                ) {
                    $(this)
                        .find(
                            ".premium-flip-front .premium-flip-front-content-container .premium-flip-text-wrapper"
                        )
                        .removeClass("PafadeInRevLeft")
                        .addClass("PafadeInRevRight");

                    $(this)
                        .find(
                            ".premium-flip-back .premium-flip-back-content-container .premium-flip-back-text-wrapper"
                        )
                        .addClass("PafadeInRevLeft")
                        .removeClass("PafadeInRevRight");
                }
            });

            $flipboxElement.on("mouseleave", function () {
                $(this).removeClass("flipped");

                if (!$flipboxElement.data("flip-animation"))
                    return;
                if (
                    $(this)
                        .children(".premium-flip-front")
                        .hasClass("premium-flip-frontrl")
                ) {
                    $(this)
                        .find(
                            ".premium-flip-front .premium-flip-front-content-container .premium-flip-text-wrapper"
                        )
                        .addClass("PafadeInLeft")
                        .removeClass("PafadeInRight");

                    $(this)
                        .find(
                            ".premium-flip-back .premium-flip-back-content-container .premium-flip-back-text-wrapper"
                        )
                        .removeClass("PafadeInLeft")
                        .addClass("PafadeInRight");
                } else if (
                    $(this)
                        .children(".premium-flip-front")
                        .hasClass("premium-flip-frontlr")
                ) {
                    $(this)
                        .find(
                            ".premium-flip-front .premium-flip-front-content-container .premium-flip-text-wrapper"
                        )
                        .addClass("PafadeInRevLeft")
                        .removeClass("PafadeInRevRight");

                    $(this)
                        .find(
                            ".premium-flip-back .premium-flip-back-content-container .premium-flip-back-text-wrapper"
                        )
                        .removeClass("PafadeInRevLeft")
                        .addClass("PafadeInRevRight");
                }
            });
        };

        elementorFrontend.hooks.addAction('frontend/element_ready/premium-addon-flip-box.default', PremiumFlipboxHandler);

    });
})(jQuery);