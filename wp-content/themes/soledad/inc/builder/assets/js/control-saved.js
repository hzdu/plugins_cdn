!function (e, $) {
    "use strict";
    var api = wp.customize;

    function getURLparam(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    }

    var changeID = getURLparam('layout_id');

    api.bind('ready', function () {

        if (changeID.length > 0) {
            $('#customize-save-button-wrapper').val(changeID).change();
        }

        $(['control', 'section', 'panel']).each(function (i, type) {
            $('a[rel="tc-' + type + '"]').click(function (evn) {
                evn.preventDefault();
                var id = $(this).attr('href').replace('#', '');
                if (api[type].has(id)) {
                    api[type].instance(id).focus();
                }
            });
        });
    });

    if (changeID.length > 0) {
        $('#customize-save-button-wrapper').hide();
        $('#customize-header-actions').append('<input type="submit" name="penci_save_header" id="penci_save_header" class="button button-primary penci_save_header" value="Save Header" disabled="">');
    }

    api.bind('change', function () {
        $('#customize-header-actions').find('.penci_save_header').prop('disabled', false);
    });

    $(document).on('click', '#customize-header-actions .penci_save_header', function (eventt) {
        eventt.preventDefault();
        $(window).off('beforeunload');
        var setting_value = api._value,
            dataex = {},
            button = $(this),
            dataPush = {
                'action': 'save_header_builder',
                'nonce': penci_hdbd.nonce,
            };

        if (changeID.length > 0) {
            dataPush['setting_id'] = changeID;
        }

        $.each(setting_value, function (i, ev) {
            var settingtext = ev.id.toString(),
                parseID = settingtext.match(/\)\((.*)\)/);
            if (parseID !== null) {
                dataex[parseID[1]] = ev._value;
            } else if (settingtext.indexOf("penci_header") >= 0 || settingtext.indexOf("penci_hb") >= 0) {
                dataex[ev.id] = ev._value;
            }
        });

        dataPush['setting_value'] = dataex;

        $.ajax({
            url: ajaxurl,
            data: dataPush,
            method: 'post',
            beforeSend: function () {
                button.addClass('loading');
            },
            success: function (response) {
                button.addClass('success');
            },
            complete: function () {
                button.removeClass('loading');
                button.prop('disabled', true);
            }
        });
    });

}(wp, jQuery);
