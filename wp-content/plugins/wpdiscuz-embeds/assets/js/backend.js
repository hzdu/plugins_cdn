jQuery(document).ready(function ($) {
    var aspectRatio = 1.78;
    $(document).on('click', '#weSelectMimes', function (e) {
        $('.we-embed-items input[type="checkbox"]').each(function (i, v) {
            $(this).prop('checked', true);
            weEmbedCheckboxStatuses($(this));
        });
    });

    $(document).on('click', '#weUnselectMimes', function (e) {
        $('.we-embed-items input[type="checkbox"]').each(function (i, v) {
            $(this).prop('checked', false);
            weEmbedCheckboxStatuses($(this));
        });
    });

    $(document).on('click', '#weInvertMimes', function (e) {
        $('.we-embed-items input[type="checkbox"]').each(function (i, v) {
            $(this).prop('checked', !$(this).prop('checked'));
            weEmbedCheckboxStatuses($(this));
        });
    });


    $('.we-embed-items .we-provider-checkbox').each(function (i, v) {
        weEmbedCheckboxStatuses($(this));
    });

    $(document).on('click', '.we-embed-items .we-provider-checkbox', function (e) {
        weEmbedCheckboxStatuses($(this));
    });

    function weEmbedCheckboxStatuses(chk) {
        var parent = chk.parents('.we-provider-checkbox-values');
        var children = $('.we-provider-hidden-value', parent);
        if (chk.is(':checked')) {
            $.each(children, function (i, v) {
                var jsonOld = JSON.parse($(v).val());
                var jsonNew = {};
                Object.entries(jsonOld).forEach(([key, value]) => {
                    value['enabled'] = 1;
                    jsonNew[key] = value;
                });
                $(v).text(JSON.stringify(jsonNew));
            });
        } else {
            $.each(children, function (i, v) {
                var jsonOld = JSON.parse($(v).val());
                var jsonNew = {};
                Object.entries(jsonOld).forEach(([key, value]) => {
                    value['enabled'] = 0;
                    jsonNew[key] = value;
                });
                $(v).text(JSON.stringify(jsonNew));
            });
        }
    }

    function weAspectRatioHeight() {
        var widthObj = $('#playerWidth');
        var width = widthObj.val();

        if (isNaN(width)) {
            widthObj.val(100);
            return;
        }

        $('#playerHeight').val(Math.ceil(width / aspectRatio));
    }

    function weAspectRatioWidth() {
        var heightObj = $('#playerHeight');
        var height = heightObj.val();

        if (isNaN(height)) {
            heightObj.val(100);
            return;
        }

        $('#playerWidth').val(Math.ceil(height * aspectRatio));
    }

    $(document).on('change keyup', '#playerWidth', function () {
        weAspectRatioHeight();
    });

    $(document).on('change keyup', '#playerHeight', function () {
        weAspectRatioWidth();
    });
});