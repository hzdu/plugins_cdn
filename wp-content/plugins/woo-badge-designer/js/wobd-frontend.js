jQuery(document).ready(function ($) {

    /** Tooltip */
    var wobd_tool = {};
    $('.wobd-tooltip-active').each(function () {
        var id = $('wobd-badges').data('id');
        wobd_tool.id = $(this).tooltipster({
            animation: 'fade'
        });
    });

    /** Change string date format */
    $('[data-wobd-countdown]').each(function () {
        var $this = $(this),
        finalDate = $(this).data('wobd-countdown');
        $this.countdown(finalDate, function (event) {
            var template = $this.closest('.wobd-badges-wrapper').find('.wobd-timer-inner-wrap').data('template');
            if (template == '4' || template == '5') {
                var day = 'd';
                var hour = 'h';
                var min = 'm';
                var sec = 's';
            } else if (template == '6') {
                var day = '';
                var hour = '';
                var min = '';
                var sec = '';
            } else {
                var day = 'Days';
                var hour = 'Hours';
                var min = 'Min';
                var sec = 'Sec';
            }
            var day_format = '<span class="wobd-count-wrapper"><span class="wobd-count">%D</span><span class="wobd-date-text">' + day + '</span></span>';
            var hour_format = '<span class="wobd-count-wrapper"><span class="wobd-count">%H</span><span class="wobd-date-text">' + hour + '</span ></span>';
            var min_format = '<span class="wobd-count-wrapper"><span class="wobd-count">%M</span><span class="wobd-date-text">' + min + '</span></span>';
            var sec_format = '<span class="wobd-count-wrapper"><span class="wobd-count">%S</span><span class="wobd-date-text">' + sec + '</span></span>';
            $this.find('.wobd-time').html(event.strftime(day_format + hour_format + min_format + sec_format));
        });
    });

    function GetTodayDate() {
        var tdate = new Date();
        var dd = tdate.getDate();
        var MM = tdate.getMonth();
        var yyyy = tdate.getFullYear();
        var hh = tdate.getHours();
        var mi = tdate.getMinutes();
        var ss = tdate.getSeconds();
        var currentDate= yyyy+"/"+( MM+1)+"/"+dd+" "+hh+":"+mi+":"+ss;

        return currentDate;
    }

    $('.wobd-timer-inner-wrap').each(function() {
        var count_value = $(this).find('#wobd_count_down').text();
        count_value = $.trim(count_value);
        var display_option = $(this).attr('data-counter-display');
        if (count_value == "00Days00Hours00Min00Sec") {
            if (display_option === '1') {
                $(this).closest('.woocommerce-product-gallery').find('.wobd-badges').remove();
                $(this).closest('.wobd-badges-wrapper').find('.wobd-badges').remove();
            } else {
                $(this).closest('.woocommerce-product-gallery').find('.wobd-timer-inner-wrap').remove();
                $(this).closest('.wobd-badges-wrapper').find('.wobd-timer-inner-wrap').remove();
            }
        }
    }
    );
    var badge_width = $(".wobd-badges-wrapper").width();
    if (badge_width <= '350' && badge_width > '250') {
        $(".wobd-badges-wrapper").addClass('wobd-small-wrap');
    }
    if (badge_width <= '250') {
        $(".wobd-badges-wrapper").addClass('wobd-smaller-wrap');
    }

});