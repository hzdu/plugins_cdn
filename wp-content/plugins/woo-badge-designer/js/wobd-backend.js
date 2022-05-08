jQuery(document).ready(function($) {
    /*
     * Upload Image
     */
    $('body').on("click", ".wobd_custom_image_url_button", function(e) {
        e.preventDefault();
        var btnClicked = $(this);
        var image = wp.media({
            title: 'Insert badge Image',
            button: {text: 'Insert badge Image'},
            library: {type: 'image'},
            multiple: false
        }).open()
                .on('select', function(e) {
                    var uploaded_image = image.state().get('selection').first();
                    console.log(uploaded_image);
                    var image_url = uploaded_image.toJSON().url;
                    $('.wobd-own-badge-image').attr('src', image_url);
                    $('.wobd-custom-image').val(image_url);
                    if ($('.wobd-custom-image').val(image_url) != '') {
                        $('.wobd-image-preview').show();
                        $('.wobd-image-ribbon').find('img').attr("src", image_url);
                    } else {
                        $('.wobd-image-preview').hide();
                    }
                });

    });
    /*
     * Badges Settings Tab
     */
    $('.wobd-settings-tigger').click(function() {
        $('.wobd-settings-tigger').removeClass('wobd-settings-active');
        $(this).addClass('wobd-settings-active');
        var active_setting_key = $('.wobd-settings-tigger.wobd-settings-active').data('menu');
        $('.wobd-badge-tab-setting-wrap').removeClass('wobd-active-badge-setting');
        $('.wobd-badge-tab-setting-wrap[data-menu-ref="' + active_setting_key + '"]').addClass('wobd-active-badge-setting');
    });
    /*
     * Configure calendar date
     */
    $(".wobd-end-time").datetimepicker({
        showSecond: true,
        dateFormat: 'yy/mm/dd',
        timeFormat: 'hh:mm:ss',
        onSelect: function() {
            var time = $(this).datetimepicker('getDate');
            $('[data-wobd-countdown]').each(function() {
                var $this = $(this),
                        finalDate = time;
                // alert(finalDate);
                $this.countdown(finalDate, function(event) {
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
        }
    });
    /*
     * Show Hide Badge Type
     */
//    $('.wobd-badge-type').click();

    $('.wobd-badge-type').click(function() {
        var badge_type = $(this).val();
        if (badge_type === 'text') {
            $('.wobd-badge-text-settings-wrap').show();
            $('.wobd-badge-icon-settings-wrap').hide();
            wobd_disable_second_text();
        } else if (badge_type === 'icon') {
            $('.wobd-badge-text-settings-wrap').hide();
            $('.wobd-badge-icon-settings-wrap').show();
            $('.wobd-badge-second-text-wrap').hide();
        } else {
            $('.wobd-badge-text-settings-wrap').show();
            $('.wobd-badge-icon-settings-wrap').show();
            $('.wobd-badge-second-text-wrap').hide();
        }

    });
    $('body').on("change", ".wobd-background-type", function() {
        var type = $('.wobd-badge-type:checked').val();
        var background_type = $(this).val();
        if (background_type === 'image-background') {
            $('.wobd-badge-image-settings-wrap').show();
            $('.wobd-text-background-wrap').hide();
            var bg_class = 'wobd-image-bg-wrap ';
            if ($('.wobd-badges').hasClass('wobd-text-bg-wrap')) {
                $('.wobd-badges').removeClass('wobd-text-bg-wrap');
                $('.wobd-badges').addClass(bg_class);
            }
            var template = $('.wobd-existing-image:checked').val();
            for (i = 1; i <= 30; i++) {
                if ($('.wobd-badges').hasClass('wobd-text-template-' + i + '')) {
                    $('.wobd-badges').removeClass('wobd-text-template-' + i + '');
                    $('.wobd-badges').addClass('wobd-image-' + template + '');
                }
            }
            var check_value = $('.wobd-existing-image:checked').val();
            var image_src = $('.wobd-existing-image:checked').next('.wobd-existing-images-demo').html();
            $('#wobd-badge').html('');
            var text = $('.wobd-badge-text').val();
            $('#wobd-badge').prepend('<div class="wobd-image-ribbon">' + image_src + '</div><div class="wobd-inner-text-container">' + text + '</div>');
            wobd_img_badge_type(type);
            wobd_disable_second_text();
        } else {
            $('.wobd-badge-image-settings-wrap').hide();
            $('.wobd-text-background-wrap').show();
            var bg_class = 'wobd-text-bg-wrap ';
            $('.wobd-image-ribbon').remove();
            $('.wobd-inner-text-container').remove();
            if ($('.wobd-badges').hasClass('wobd-image-bg-wrap')) {
                $('.wobd-badges').removeClass('wobd-image-bg-wrap');
                $('.wobd-badges').addClass(bg_class);
            }
            var template = $('.wobd-text-design:checked').val();
            for (i = 1; i <= 31; i++) {
                if ($('.wobd-badges').hasClass('wobd-image-' + i + '')) {
                    $('.wobd-badges').removeClass('wobd-image-' + i + '');
                    $('.wobd-badges').addClass('wobd-text-' + template + '');
                }
            }
            wobd_txt_bg_badge_type(type);
            wobd_disable_second_text();
        }

    }
    );

    /*
     * Template Preview
     */
    $('.wobd-badge-template').on('change', function() {
        var template_value = $(this).val();
        var array_break = template_value.split('-');
        var current_id = array_break[1];
        $('.wobd-badge-common').hide();
        $('#wobd-badge-demo-' + current_id).show();
    });
    if ($(".wobd-badge-template option:selected").length > 0) {
        var grid_view = $(".wobd-badge-template option:selected").val();
        var array_break = grid_view.split('-');
        var current_id1 = array_break[1];
        $('.wobd-badge-common').hide();
        $('#wobd-badge-demo-' + current_id1).show();
    }

    /*
     * Checked button to enable tooltip
     */
    var wobd_tool = {};
    $('.wobd-tooltip-active').each(function() {
        var id = $('wobd-badges').data('id');
        wobd_tool.id = $(this).tooltipster({
            animation: 'fade'
        });
    });
    $(".wobd-tooltip-text").keyup(function() {
        $('.wobd-tooltip-active').tooltipster("destroy");
        $('.wobd-tooltip-active').attr("title", $(this).val()).tooltipster({
        });
    });
    $('body').on("click", ".wobd-display-tooltip", function() {
        if ($(this).is(':checked'))
        {
            $(this).val('1');
            $('.wobd-badges').addClass('wobd-tooltip-active tooltipstered');
            var content = $('.wobd-tooltip-text').val();
            $(".wobd-badges").attr('title', content);
            $('.wobd-tooltip-active').tooltipster({
            });
        } else
        {
            $(this).val('0');
            $('.wobd-badges').removeClass('wobd-tooltip-active tooltipstered');
            $('.wobd-tooltip-active').tooltipster("destroy");
        }
    });
    $('.wobd-bg-color').wpColorPicker();
    $('.wobd-coner-color').wpColorPicker();
    $('.wobd-text-color').wpColorPicker();
    $('.wobd-display-custom').click(function() {
        var text_template = $('.wobd-text-design:checked').val();
        if ($(this).is(':checked'))
        {
            $(this).val('1');
            $('.wobd-custom-design-container').show();
        } else
        {
            $('.wobd-custom-design-container').hide();
            $(this).val('0');
        }
    });
    $('.wobd-timer-color').wpColorPicker();
    $('.wobd-timer-custom-color').click(function() {
        if ($(this).is(':checked'))
        {
            $(this).val('1');
            $('.wobd-custom-design-timer-wrap').show();
        } else
        {
            $(this).val('0');
            $('.wobd-custom-design-timer-wrap').hide();
        }
    });
    $('.wobd-tooltip-text-color').wpColorPicker();
    $('.wobd-tooltip-bg-color').wpColorPicker();
    $('.wobd-tooltip-custom-color').click(function() {
        if ($(this).is(':checked'))
        {
            $(this).val('1');
            $('.wobd-tooltip-custom-design-wrap').show();
        } else
        {
            $(this).val('0');
            $('.wobd-tooltip-custom-design-wrap').hide();
        }
    });
    $('.wobd-disable-badges-timer').click(function() {
        if ($(this).is(':checked'))
        {
            $(this).val('1');
        } else
        {
            $(this).val('0');
        }
    });
    $('.wobd-disable-badges').click(function() {
        if ($(this).is(':checked'))
        {
            $(this).val('1');
        } else
        {
            $(this).val('0');
        }
    });
    $('.wobd-display-badges-single').click(function() {
        if ($(this).is(':checked'))
        {
            $(this).val('1');
        } else
        {
            $(this).val('0');
        }
    });

    /*
     * Checked button to enable timer
     */

    $('.wobd-display-timer').click(function() {
        if ($(this).is(':checked'))
        {
            $(this).val('1');
            $('.wobd-timer-inner-wrap').show();
            $('.wobd-timer-inner-wrap').attr('data-counter-display', '1');
        } else
        {
            $(this).val('0');
            $('.wobd-timer-inner-wrap').hide();
        }
    });
    $('body').on("change", ".wobd-timer-templates", function() {
        var template = $(this).val();
        for (i = 1; i <= 10; i++) {
            if ($('.wobd-timer-inner-wrap').hasClass('wobd-timer-template-' + i + '')) {
                $('.wobd-timer-inner-wrap').removeClass('wobd-timer-template-' + i + '');
                $('.wobd-timer-inner-wrap').addClass('wobd-timer-template-' + template + '');
            } else {
                $('.wobd-timer-inner-wrap').addClass('wobd-timer-template-' + template + '');
            }
        }
    });
    $('[data-wobd-countdown]').each(function() {
        var $this = $(this),
                finalDate = $(this).data('wobd-countdown');
        $this.countdown(finalDate, function(event) {
            var template = $('.wobd-timer-templates:checked').val();
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
    $('.wobd-timer-inner-wrap').each(function() {
        var count_value = $(this).closest('.wobd-badges-wrapper').find('#wobd_count_down').text();
        var display_option = $(this).closest('.wobd-badges').data('counter-display');
        if (count_value === "00 days 00h:00m:00s") {
            if (display_option === '1') {
                $(this).closest('.wobd-badges-wrapper').find('.wobd-badges').remove();
            } else {
                $(this).closest('.wobd-badges-wrapper').find('.wobd-timer-inner-wrap').remove();
            }
        }
    }
    );
    /*
     * Preview Panel
     */

    /*
     * Change the position of badge text in preview
     */

    $('.wobd-badge-position').on("change", function() {
        var position = $(this).val();
        var position_class = 'wobd-position-' + position;
        if ($('.wobd-badges').hasClass('wobd-position-left_center')) {
            $('.wobd-badges').removeClass('wobd-position-left_center');
            $('.wobd-badges').addClass(position_class);
        }
        if ($('.wobd-badges').hasClass('wobd-position-left_top')) {
            $('.wobd-badges').removeClass('wobd-position-left_top');
            $('.wobd-badges').addClass(position_class);
        }
        if ($('.wobd-badges').hasClass('wobd-position-left_bottom')) {
            $('.wobd-badges').removeClass('wobd-position-left_bottom');
            $('.wobd-badges').addClass(position_class);
        }
        if ($('.wobd-badges').hasClass('wobd-position-right_center')) {
            $('.wobd-badges').removeClass('wobd-position-right_center');
            $('.wobd-badges').addClass(position_class);
        }
        if ($('.wobd-badges').hasClass('wobd-position-right_top')) {
            $('.wobd-badges').removeClass('wobd-position-right_top');
            $('.wobd-badges').addClass(position_class);
        }
        if ($('.wobd-badges').hasClass('wobd-position-right_bottom')) {
            $('.wobd-badges').removeClass('wobd-position-right_bottom');
            $('.wobd-badges').addClass(position_class);
        }
    });
    $('body').on("change", ".wobd-text-design", function() {
        var template = $(this).val();
        var type = $('.wobd-badge-type:checked').val();
        for (i = 1; i <= 30; i++) {
            if ($('.wobd-badges').hasClass('wobd-text-template-' + i + '')) {
                $('.wobd-badges').removeClass('wobd-text-template-' + i + '');
                $('.wobd-badges').addClass('wobd-text-' + template + '');
            } else {
                $('.wobd-badges').addClass('wobd-text-' + template + '');
            }
            if (template === 'template-24') {

                $('.wobd-badges').html('<div class="wobd-text-main-wrap"><div class="wobd-text-inner-wrap"><div class="wobd-text" id="wobd-badge"><div class="wobd-second-text"></div></div></div></div>');
            } else {
                $('.wobd-badges').html('<div class="wobd-text " id="wobd-badge"><div class="wobd-second-text"></div></div>');
            }
            wobd_txt_bg_badge_type(type);
            wobd_disable_second_text();
        }

        if (template == 'template-8' || template == 'template-10' || template == 'template-13' || template == 'template-14' || template == 'template-20' || template == 'template-21' || template == 'template-22' || template == 'template-27' || template == 'template-29') {
            $('select option[value="left_center"]').attr("disabled", true);
            $('select option[value="right_center"]').attr("disabled", true);
        } else {
            $('select option[value="left_center"]').attr("disabled", false);
            $('select option[value="right_center"]').attr("disabled", false);
        }
    });
    $('body').on("change", ".wobd-existing-image", function() {
        var template = $(this).val();
        for (i = 1; i <= 31; i++) {
            if ($('.wobd-badges').hasClass('wobd-image-' + i + '')) {
                $('.wobd-badges').removeClass('wobd-image-' + i + '');
                $('.wobd-badges').addClass('wobd-image-' + template + '');
            }
        }
        wobd_disable_second_text();
    });
    /*
     * icon picker
     */
    $('.icon-picker-input').iconPicker();
    /*
     * Badge type preview mechanism
     */
    function wobd_txt_bg_badge_type(type) {
        var template = $('.wobd-text-design:checked').val();
        if (template === 'template-24') {
            var wobd_class = '.wobd-text-inner-wrap div';
        } else {
            var wobd_class = 'div';
        }
        if (type === 'text')
        {
            $('.wobd-text-bg-wrap').find(wobd_class).addClass('wobd-text');
            $('.wobd-text-bg-wrap').find(wobd_class).removeClass('wobd-icon');
            var text = $(".wobd-badge-text").val();
            var second_text = $('.wobd-second-badge-text').val();
            $(".wobd-text i").remove();
            var template = $('.wobd-text-design:checked').val();
            if (template == 'template-8' || template == 'template-11' || template == 'template-12' || template == 'template-15' || template == 'template-16' || template == 'template-19' || template == 'template-20' || template == 'template-21' || template == 'template-22' || template == 'template-23' || template == 'template-27' || template == 'template-28')
            {
                $('.wobd-text').html(text);
            } else {
                $('.wobd-text').html(text + '<div class="wobd-second-text">' + second_text + '</div>');
            }
        } else if (type === 'icon') {
            $('.wobd-text-bg-wrap').find('.wobd-text').addClass('wobd-icon');
            var font = $('.icon-picker-input').val().split('|');
            var icon = font[ 0 ] + ' ' + font[ 1 ];
            $(".wobd-text").html('<i class="' + icon + '" aria-hidden="true"></i>');
        } else {
            $('.wobd-text-bg-wrap').find('.wobd-text').addClass('wobd-icon');
            var text = $(".wobd-badge-text").val();
            var font = $('.icon-picker-input').val().split('|');
            var icon = font[ 0 ] + ' ' + font[ 1 ];
            $(".wobd-text").html('<i class="' + icon + '" aria-hidden="true"></i>' + text);
        }
    }
    function wobd_img_badge_type(type) {
        if (type === 'text')
        {
            $('.wobd-icon').attr('class', 'wobd-text');
            var text = $(".wobd-badge-text").val();
            var second_text = $('.wobd-second-badge-text').val();
            $('.wobd-inner-text-container').remove();
            var image_template = $('.wobd-existing-image:checked').val();
            if (image_template == '17' || image_template == '18' || image_template == '19' || image_template == '20' || image_template == '30' || image_template == '31') {
                $('<div class="wobd-inner-text-container"><div class="wobd-first-text">' + text + '</div></div>').insertAfter('.wobd-image-ribbon');
            } else {
                $('<div class="wobd-inner-text-container"><div class="wobd-first-text">' + text + '</div><div class="wobd-second-text">' + second_text + '</div></div>').insertAfter('.wobd-image-ribbon');
            }
        } else if (type === 'icon') {
            $('.wobd-text').attr('class', 'wobd-text wobd-icon');
            var font = $('.icon-picker-input').val().split('|');
            var icon = font[ 0 ] + ' ' + font[ 1 ];
            $('.wobd-inner-text-container').remove();
            $('<div class="wobd-inner-text-container"><i class="' + icon + '" aria-hidden="true"></i></div>').insertAfter('.wobd-image-ribbon');
        } else {
            if ($('#wobd-badge').hasClass('wobd-text')) {
                $('#wobd-badge').addClass('wobd-icon');
            }
            if ($('#wobd-badge').hasClass('wobd-icon')) {
                $('#wobd-badge').addClass('wobd-text');
            }
            var text = $(".wobd-badge-text").val();
            var font = $('.icon-picker-input').val().split('|');
            $('.wobd-inner-text-container').remove();
            var icon = font[ 0 ] + ' ' + font[ 1 ];
            $('<div class="wobd-inner-text-container"><i class="' + icon + '" aria-hidden="true"></i>' + text + '</div>').insertAfter('.wobd-image-ribbon');
        }
    }
    $('body').on("click", ".wobd-badge-type", function() {
        var type = $(this).val();
        var bg_type = $('.wobd-background-type:checked').val();
        if (bg_type === 'text-background') {
            wobd_txt_bg_badge_type(type);
        } else {
            wobd_img_badge_type(type);
        }
    });
    $(document).on("click", ".icon-picker-list > li > a", function() {
        var bg_type = $('.wobd-background-type:checked').val();
        var type = $('.wobd-badge-type:checked').val();
        if (bg_type === 'text-background') {
            wobd_txt_bg_badge_type(type);
        } else {
            wobd_img_badge_type(type);
        }
    });
    /*
     * Show text in preview pane
     */
    $(".wobd-badge-text").keyup(function() {
        var bg_type = $('.wobd-background-type:checked').val();
        var type = $('.wobd-badge-type:checked').val();
        if (bg_type === 'text-background') {
            wobd_txt_bg_badge_type(type);
        } else {
            wobd_img_badge_type(type);
        }
    });
    $(".wobd-second-badge-text").keyup(function() {
        var bg_type = $('.wobd-background-type:checked').val();
        var type = $('.wobd-badge-type:checked').val();
        if (bg_type === 'text-background') {
            wobd_txt_bg_badge_type(type);
        } else {
            wobd_img_badge_type(type);
        }

    });
    /*
     * Change pre existing image badges in preview
     */
    $('body').on("click", ".wobd-existing-image", function() {
        var image_src = $(this).closest('.wobd-hide-radio').find('.wobd-existing-images-demo img').attr("src");
        var type = $('.wobd-badge-type:checked').val();
        $('.wobd-image-ribbon').find('img').attr("src", image_src);
        wobd_img_badge_type(type);
    });

    /*
     * Configure count down timer in preview
     */

    $(".wobd-setting-timer-text").keyup(function() {
        var content = $(this).val();
        $('.wobd-setting-timer-text').text(content);
    });
    $('.wobd-timer-position').on("change", function() {
        var position = $(this).val();
        var position_class = 'wobd-timer-position-' + position;
        if ($('.wobd-timer-inner-wrap').hasClass('wobd-timer-position-top')) {
            $('.wobd-timer-inner-wrap').removeClass('wobd-timer-position-top');
            $('.wobd-timer-inner-wrap').addClass(position_class);
        }
        if ($('.wobd-timer-inner-wrap').hasClass('wobd-timer-position-bottom')) {
            $('.wobd-timer-inner-wrap').removeClass('wobd-timer-position-bottom');
            $('.wobd-timer-inner-wrap').addClass(position_class);
        }
        if ($('.wobd-timer-inner-wrap').hasClass('wobd-timer-position-left')) {
            $('.wobd-timer-inner-wrap').removeClass('wobd-timer-position-left');
            $('.wobd-timer-inner-wrap').addClass(position_class);
        }
        if ($('.wobd-timer-inner-wrap').hasClass('wobd-timer-position-right')) {
            $('.wobd-timer-inner-wrap').removeClass('wobd-timer-position-right');
            $('.wobd-timer-inner-wrap').addClass(position_class);
        }

    });
    function wobd_disable_second_text() {
        var bg_type = $('.wobd-background-type:checked').val();
        if (bg_type === 'text-background') {
            var template = $('.wobd-text-design:checked').val();
            if (template == 'template-8' || template == 'template-11' || template == 'template-12' || template == 'template-15' || template == 'template-16' || template == 'template-19' || template == 'template-20' || template == 'template-21' || template == 'template-22' || template == 'template-23' || template == 'template-27' || template == 'template-28') {
                $('.wobd-badge-second-text-wrap').hide();
            } else {
                $('.wobd-badge-second-text-wrap').show();
            }
        } else {
            var template = $('.wobd-existing-image:checked').val();
            if (template == '17' || template == '18' || template == '19' || template == '20' || template == '30' || template == '31')
            {
                $('.wobd-badge-second-text-wrap').hide();
            } else {
                $('.wobd-badge-second-text-wrap').show();
            }
        }
    }
    $('.wobd-text-background-wrap').mCustomScrollbar({
        theme: 'dark-3',
        mouseWheel: {enable: true},
        axis: 'y'

    });
    $('.wobd-existing-image-wrap').mCustomScrollbar({
        theme: 'dark-3',
        mouseWheel: {enable: true},
        axis: 'y'

    });
    $('.wobd-timer-inner-template-wrap').mCustomScrollbar({
        theme: 'dark-3',
        mouseWheel: {enable: true},
        axis: 'y'

    });
    $('.wobd-display-auto-calculate').click(function() {
        if ($(this).is(':checked'))
        {
            $(this).val('1');
            $('.wobd-auto-percentage-wrapper').show();
        } else
        {
            $(this).val('0');
            $('.wobd-auto-percentage-wrapper').hide();
        }
    });
    $('.wobd-enable-extra-text').click(function() {
        if ($(this).is(':checked'))
        {
            $(this).val('1');
            $('.wobd-extra-text-wrapper').show();
        } else
        {
            $(this).val('0');
            $('.wobd-extra-text-wrapper').hide();
        }
    });
    $('.wobd-enable-minus').click(function() {
        if ($(this).is(':checked'))
        {
            $(this).val('1');
        } else
        {
            $(this).val('0');
        }
    });
}
);