(function ($) {

    $(window).on('elementor/frontend/init', function () {

        var premiumGlobalCursorHandler = function ($scope, $) {

            if (!$scope.hasClass('premium-gCursor-yes')) {
                return;
            }

            var $eleType = $scope.data('element_type'),
                $eleId = $scope.data("id"),
                $eleInfo = {},
                settings = {},
                isInnerSection = ('section' === $eleType) ? $scope.hasClass('elementor-inner-section') : $scope.closest('.elementor-section').hasClass('elementor-inner-section'),
                parentClass = (isInnerSection) ? 'inner' : 'top';

            if (isInnerSection) {
                $eleInfo.innerSec = ('section' === $eleType) ? $scope : $scope.closest('.elementor-inner-section');
                $eleInfo.innerSecId = $eleInfo.innerSec.data('id');
                $eleInfo.parentCol = $eleInfo.innerSec.closest('.elementor-top-column');
                $eleInfo.parentColId = $eleInfo.parentCol.data('id');
                $eleInfo.parentSec = $eleInfo.parentCol.closest('.elementor-top-section');
                $eleInfo.parentSecId = $eleInfo.parentSec.data('id');
            }

            if ('section' !== $eleType) {
                $eleInfo.section = $scope.closest('.elementor-' + parentClass + '-section');

                if ('widget' === $eleType) {
                    $eleInfo.col = $scope.closest('.elementor-' + parentClass + '-column');
                }
            }

            $eleInfo.colId = ($eleInfo.col) ? $eleInfo.col.data('id') : '';
            $eleInfo.sectionId = ($eleInfo.section) ? $eleInfo.section.data('id') : '';

            generateSettings($eleType, $eleId);

            if (!settings) {
                return false;
            }

            elementorFrontend.waypoint(
                $scope,
                function () {
                    generateGlobalCursor();
                }
            );

            function generateGlobalCursor() {

                var uniqueClass = 'premium-global-cursor-' + $eleId,
                    cursorHtml = '<div class="premium-global-cursor ' + uniqueClass + settings.pulse + settings.buzz + '">' + getCursorHtml(settings) + '</div>';

                $scope.find("." + uniqueClass).remove();
                $scope.prepend(cursorHtml);

                if ('icon' === settings.cursorType && 'svg' === settings.elementSettings.library) {
                    handleSvgIcon(settings.elementSettings.value.url, $eleId);
                }

                if ('lottie' === settings.cursorType) {
                    var $item = $scope.find('.premium-lottie-animation'),
                        instance = new premiumLottieAnimations($item);
                    instance.init();
                }

                var types = ['icon', 'image', 'lottie'],
                    props = {
                        extraTop: 0,
                        extraLeft: 0,
                        elem: uniqueClass,
                        delay: settings.delay,
                        width: $scope.find('.premium-global-cursor').outerWidth(),
                        height: $scope.find('.premium-global-cursor').outerHeight()
                    };

                if (!types.includes(settings.cursorType)) {
                    props.extraLeft = (settings.elementSettings.xpos / 100) * props.width;
                    props.extraTop = (settings.elementSettings.ypos / 100) * props.height;
                    props.width = 0;
                } else {
                    //We need to make sure the arrow is centered.
                    props.extraLeft = 0.5 * props.width;
                    props.extraTop = 0.5 * props.height;
                }

                $scope.off('mousemove');

                $scope.mousemove(function (e) {

                    $scope.css('cursor', 'default');

                    if ('section' !== $eleType) {
                        $eleInfo.section.find('.premium-global-cursor-' + $eleInfo.sectionId).addClass('premium-cursor-not-active');

                        if ('widget' === $eleType) {
                            $eleInfo.col.find('.premium-global-cursor-' + $eleInfo.colId).addClass('premium-cursor-not-active');
                        }
                    }

                    if (isInnerSection) {
                        $eleInfo.parentCol.find('.premium-global-cursor-' + $eleInfo.parentColId).addClass('premium-cursor-not-active');
                        $eleInfo.parentSec.find('.premium-global-cursor-' + $eleInfo.parentSecId).addClass('premium-cursor-not-active');
                    }

                    if (['iamge', 'fimage'].includes(settings.cursorType)) {
                        $("." + uniqueClass).css('display', 'flex');
                    } else {
                        $("." + uniqueClass).show();
                    }

                    followMouse(e, props);

                }).mouseout(function () {

                    if ('section' !== $eleType) {

                        $eleInfo.section.find('.premium-global-cursor-' + $eleInfo.sectionId).removeClass('premium-cursor-not-active');

                        if ('widget' === $eleType) {
                            $eleInfo.col.find('.premium-global-cursor-' + $eleInfo.colId).removeClass('premium-cursor-not-active');
                        }
                    }

                    if (isInnerSection) {
                        $eleInfo.parentCol.find('.premium-global-cursor-' + $eleInfo.parentColId).removeClass('premium-cursor-not-active');
                        $eleInfo.parentSec.find('.premium-global-cursor-' + $eleInfo.parentSecId).removeClass('premium-cursor-not-active');
                    }
                }).mouseleave(function () {
                    $("." + uniqueClass).hide();
                });

            }

            function getCursorHtml(settings) {
                var cursorHtml = '';

                if ('icon' === settings.cursorType) {
                    if ('svg' !== settings.elementSettings.library) {
                        cursorHtml += '<i class=" premium-cursor-icon-fa ' + settings.elementSettings.value + '"></li>';
                    }

                } else if ('image' === settings.cursorType || 'fimage' === settings.cursorType) {
                    cursorHtml += '<img class="premium-cursor-img" src="' + settings.elementSettings.url + '" alt="' + settings.elementSettings.alt + '">';

                } else if ('ftext' === settings.cursorType) {
                    cursorHtml += '<p class="premium-cursor-follow-text">' + escapeHtml(settings.elementSettings.text) + '</p>';

                } else {
                    cursorHtml += '<div class="premium-lottie-animation premium-cursor-lottie-icon" data-lottie-url="' + settings.elementSettings.url + '" data-lottie-loop="' + settings.elementSettings.loop + '" data-lottie-reverse="' + settings.elementSettings.reverse + '" ></div>';
                }

                return cursorHtml;
            }

            function escapeHtml(unsafe) {
                return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(
                    /"/g, "&quot;").replace(/'/g, "&#039;");
            }

            function generateSettings(type, id) {

                var editMode = elementorFrontend.isEditMode(),
                    cursorSettings = {},
                    tempTarget = $scope.find('#premium-global-cursor-' + id),
                    tempTarget2 = $scope.find('#premium-global-cursor-temp-' + id),
                    tempExist = 0 !== tempTarget.length || 0 !== tempTarget2.length,
                    editMode = elementorFrontend.isEditMode() && tempExist;

                if (editMode) {
                    cursorSettings = tempTarget.data('gcursor');

                    if ('widget' === type && !cursorSettings) {
                        cursorSettings = tempTarget2.data('gcursor');
                    }
                } else {
                    cursorSettings = $scope.data('gcursor');

                }

                if (!cursorSettings) {
                    return false;
                }

                settings.cursorType = cursorSettings.cursorType;
                settings.delay = cursorSettings.delay;
                settings.pulse = cursorSettings.pulse;
                settings.buzz = cursorSettings.buzz;
                settings.elementType = type;
                settings.elementSettings = cursorSettings.elementSettings;

                if (0 !== Object.keys(settings).length) {
                    return settings;
                }
            }

            function handleSvgIcon(url, id) {

                var parser = new DOMParser();

                fetch(url)
                    .then(
                        function (response) {
                            if (200 !== response.status) {
                                console.log('Looks like there was a problem loading your svg. Status Code: ' +
                                    response.status);
                                return;
                            }

                            response.text().then(function (text) {
                                var parsed = parser.parseFromString(text, 'text/html'),
                                    svg = parsed.querySelector('svg');

                                $(svg).attr('class', 'premium-cursor-icon-svg');
                                $scope.find('.premium-global-cursor-' + id).html($(parsed).find('svg'));
                            });
                        }
                    );
            }

            function followMouse(e, props) {

                TweenMax.to('.' + props.elem, props.delay, {
                    css: {
                        left: e.clientX + props.extraLeft - props.width,
                        top: e.clientY + props.extraTop - props.width,
                    },
                    ease: Power0.easeOut,
                });
            }
        };

        elementorFrontend.hooks.addAction("frontend/element_ready/global", premiumGlobalCursorHandler);
    });

})(jQuery);