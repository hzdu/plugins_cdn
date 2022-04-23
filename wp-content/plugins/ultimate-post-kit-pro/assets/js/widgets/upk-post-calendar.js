/**
 * Start calendar post widget script
 */

 (function($, elementor) {
    'use strict';

    var widgetPostCalendar = function($scope, $) {
        var $CalendarPost = $scope.find('.upk-post-calendar'),
            $HeadingDate = $scope.find('.upk-date-wrapper'),
            $settings = $CalendarPost.data('settings');

        if (!$CalendarPost.length) {
            return;
        }

        var today = jQuery('.upk-post-calendar .upk-current-date').val(),
        selector  = jQuery('.upk-post-calendar .upk-calendar-table td a');
        selector.parent().addClass('upk-has-post');

        showPost(today);

        $($CalendarPost).on('click', '.upk-click-day', function(e) {
            //e.preventDefault();

            jQuery('.upk-post-calendar .upk-calendar-table td').removeClass('upk-selected');
            jQuery(this).parent().parent().addClass('upk-selected');
            var selectedDate = jQuery(this).attr('value');
            showPost(selectedDate);

            var d            = new Date(selectedDate);
            var days         = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
            var dayName      = days[d.getDay()];

            var months       = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
            var monthName    = months[d.getMonth()];

            var dayInfixList = ['', 'ST', 'ND', 'RD', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'ST', 'ND', 'RD', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'TH', 'ST'];

            var day          = d.getDate();
            var dayInfix     = dayInfixList[day];

            $($HeadingDate).html(dayName + ", " + monthName + " " + day + dayInfix);
        });

        function showPost(filterDate) {
            jQuery.ajax({
                url: $CalendarPost.attr('action'),
                type: 'post',
                data: {
                    action: 'ultimate_post_kit_calendar_post',
                    filterDate: filterDate,
                },
                success: function(html) {
                    $($CalendarPost).find('.upk-post-calendar-list').empty();
                    $($CalendarPost).find('.upk-post-calendar-list').append(html).fadeIn(5000);
                },
                error: function() {
                    console.log("Error");
                }
            });
        }

        function upk_get_month(getMonth) {
            jQuery.ajax({
                url: $CalendarPost.attr('action'),
                type: 'post',
                data: {
                    action: 'ultimate_post_kit_calendar',
                    getMonth: getMonth,
                    showPostsList: $settings.showPostList,
                },
                success: function(html) {
                    setTimeout(function() {
                        $($CalendarPost).find('.upk-get-calendar').html(html);
                        $($CalendarPost).find('.upk-calendar-table td a').parent().parent().addClass('upk-has-post');
                    }, 500);
                },
                error: function(html) {
                    console.log("Error");
                }
            });
        }

        var d = new Date(),
            n = d.getMonth() + 1,
            getMonth = n; // default value

            upk_get_month(getMonth);
            $($CalendarPost).on('change', '.upk-month-dropdown', function() {
                var getMonth = this.value;
                upk_get_month(getMonth);
            });
        };

        jQuery(window).on('elementor/frontend/init', function() {
            elementorFrontend.hooks.addAction('frontend/element_ready/upk-post-calendar.default', widgetPostCalendar);
        });
    }(jQuery, window.elementorFrontend));

/**
 * End calendar post widget script
 */

