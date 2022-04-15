/**
 * Start time zone widget script
 */
 
(function ($, elementor) {
    'use strict';
    var widgetTimeZone = function ($scope, $) {
        var $TimeZone = $scope.find('.bdt-time-zone');
        var $TimeZoneTimer = $scope.find('.bdt-time-zone-timer');
        if (!$TimeZone.length) {
            return;
        }
        elementorFrontend.waypoint($TimeZoneTimer, function () {
            var $this = $(this);
            var $settings = $this.data('settings');
            var timeFormat;
            if ($settings.timeHour == '12h') {
                timeFormat = '%I:%M:%S %p';
            } else {
                timeFormat = '%H:%M:%S';
            }
            // dateFormat
            var dateFormat = $settings.dateFormat;
            if (dateFormat != 'emptyDate') {
                dateFormat = '<div class=\"bdt-time-zone-date\"> ' + $settings.dateFormat + ' </div>'
            } else {
                dateFormat = '';
            }
            var country;
            if ($settings.country != 'emptyCountry') {
                country = '<div  class=\"bdt-time-zone-country\">' + $settings.country + '</div>';
            } else {
                country = ' ';
            }
            var timeZoneFormat;
            timeZoneFormat = '<div class=\"bdt-time-zone-dt\"> ' + country + ' ' + dateFormat + ' <div class=\"bdt-time-zone-time\">' + timeFormat + ' </div> </div>';
            var offset = $settings.gmt;
            if (offset == '') return;
            var options = {
                format: timeZoneFormat,
                timeNotation: $settings.timeHour, //'24h',
                am_pm: true,
                utc: (offset == 'local') ? false : true,
                utcOffset: (offset == 'local') ? null : offset,
            }
            $('#' + $settings.id).jclock(options);
        }, {
            offset: 'bottom-in-view'
        });
    };
    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/bdt-time-zone.default', widgetTimeZone);
    });
}(jQuery, window.elementorFrontend));

/**
 * End time zone widget script
 */

