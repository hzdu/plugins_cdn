jQuery(document).ready(function ($) {
    /**
     cutting content
     */
    $(document).on('change', '#wpdiscuz_widget_content_cutting:not(:checked)', function () {
        $(this).parents(".wpd-opt-row").next().fadeOut(300);
    });

    $(document).on('change', '#wpdiscuz_widget_content_cutting:checked', function () {
        $(this).parents(".wpd-opt-row").next().fadeIn(300);
    });
    
    $(document).on('change', '#wpdiscuz_widget_post_title_cutting:not(:checked)', function () {
        $(this).parents(".wpd-opt-row").next().fadeOut(300);
    });

    $(document).on('change', '#wpdiscuz_widget_post_title_cutting:checked', function () {
        $(this).parents(".wpd-opt-row").next().fadeIn(300);
    });

    // tab sections toggle
    $(document).on('change', '.enable-tab-displaying', function () {
        $(this).parent().parent().next().slideToggle(400);
    });

    // datepicker
    $(document).on('focus', '.wpd_datepicker_wrapper input', function () {
        $(".comments_date_from").datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            maxDate: "m",
            onClose: function (selectedDate) {
                $(".comments_date_to").datepicker("option", "minDate", selectedDate);
            }
        });
        $(".comments_date_to").datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            maxDate: "m",
        });
    });


    //datepicker toggle
    $(document).on('change', '.date_interval_select', function () {
        if ($(this).val() === "custom_date") {
            $(this).next().fadeIn(400);
        } else {
            $(this).next().fadeOut(400);
        }
    });



}); // end ready










