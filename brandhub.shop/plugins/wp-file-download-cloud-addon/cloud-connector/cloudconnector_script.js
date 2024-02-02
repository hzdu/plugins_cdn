jQuery(document).ready(function ($) {
    $(".ggd-automatic-connect, .onedrive-automatic-connect, .onedrive-business-automatic-connect, .dropbox-automatic-connect").on('click', function (e) {
        e.preventDefault();
        var data_link = $(this).data('link');
        var data_network = $(this).data('network');
        var extension = 'wp-file-download-addon.zip';
        window.open(cloudconnector_var.connector + data_network + '/login?sendback=' + data_link + '&extension=' + extension + '&ju_token=' + cloudconnector_var.ju_token,
            'cloudconnectwindow',
            'location=yes,height=620,width=560,scrollbars=yes,status=yes'
        );
    });

    $(".ggd-automatic-disconnect, .onedrive-automatic-disconnect, .onedrive-business-automatic-disconnect, .dropbox-automatic-disconnect").on('click', function (e) {
        e.preventDefault();
        var $that = $(e.target);
        if (confirm('Are you sure to disconnect?')) {
            window.location = $that.attr('href');
        }
        return false;
    });

    $('.ggd-mode-radio-field .ju-radiobox').on('click', function () {
        var val = $(this).val();
        if (val === 'automatic') {
            $('input[name="googleClientId"]').parents('.ju-settings-option').hide();
            $('input[name="googleClientSecret"]').parents('.ju-settings-option').hide();
            $('#gg_setup').hide();
            $('#gg_disconnect').hide();
            $('#ggconnect').hide();
            $('.joom_cloudconnector_wrap').show();
            $('.ggd-ju-connect-message').show();
            $('#wpfd-btnpush-ggd').hide();
            $('.wpfd-ggd-watch-change-message').hide();
            if ($('#wpfd-btn-automaticdisconnect-ggd').hasClass("ju-visibled")) {
                $('#wpfd-btn-automaticdisconnect-ggd').show();
            } else {
                $('#wpfd-btn-automaticdisconnect-ggd').hide();
            }

            if ($('#wpfd-btn-automaticconnect-ggd').hasClass("ju-visibled")) {
                $('#wpfd-btn-automaticconnect-ggd').show();
            } else {
                $('#wpfd-btn-automaticconnect-ggd').hide();
            }
        } else {
            $('input[name="googleClientId"]').parents('.ju-settings-option').show();
            $('input[name="googleClientSecret"]').parents('.ju-settings-option').show();
            $('#gg_setup').show();
            $('#ggconnect').show();
            $('#gg_disconnect').show();
            $('.joom_cloudconnector_wrap').hide();
            $('#wpfd-btn-automaticconnect-ggd').hide();
            $('#wpfd-btn-automaticdisconnect-ggd').hide();
            $('.ggd-ju-connect-message').hide();
            $('#wpfd-btnpush-ggd').show();
            $('.wpfd-ggd-watch-change-message').show();
        }

        $.ajax({
            url: cloudconnector_var.ajaxurl + '?action=cloudconnector_ggd_changemode',
            method: 'POST',
            dataType: 'json',
            data: {
                value: val,
                cloudconnect_nonce : cloudconnector_var.nonce
            },
            success: function (res) {

            }
        })

    });

    $('.od-mode-radio-field .ju-radiobox').on('click', function () {
        var val = $(this).val();

        if (val === 'automatic') {
            $('input[name="onedriveKey"]').parents('.ju-settings-option').hide();
            $('input[name="onedriveSecret"]').parents('.ju-settings-option').hide();
            $('#onedriver_setup').hide();
            $('#onedrive_disconnect').hide();
            $('#onedrive_connect').hide();
            $('.od-ju-connect-message').show();

            if ($('#wpfd-btn-automaticdisconnect-onedrive').hasClass("ju-visibled")) {
                $('#wpfd-btn-automaticdisconnect-onedrive').show();
            } else {
                $('#wpfd-btn-automaticdisconnect-onedrive').hide();
            }

            if ($('#wpfd-btn-automaticconnect-onedrive').hasClass("ju-visibled")) {
                $('#wpfd-btn-automaticconnect-onedrive').show();
            } else {
                $('#wpfd-btn-automaticconnect-onedrive').hide();
            }
        } else {
            $('input[name="onedriveKey"]').parents('.ju-settings-option').show();
            $('input[name="onedriveSecret"]').parents('.ju-settings-option').show();
            $('#onedriver_setup').show();
            $('#onedrive_connect').show();
            $('#onedrive_disconnect').show();
            $('#wpfd-btn-automaticconnect-onedrive').hide();
            $('#wpfd-btn-automaticdisconnect-onedrive').hide();
            $('.od-ju-connect-message').hide();
        }

        $.ajax({
            url: cloudconnector_var.ajaxurl + '?action=cloudconnector_onedrive_changemode',
            method: 'POST',
            dataType: 'json',
            data: {
                value: val,
                cloudconnect_nonce : cloudconnector_var.nonce
            },
            success: function (res) {

            }
        })

    });

    $('.odb-mode-radio-field .ju-radiobox').on('click', function () {
        var val = $(this).val();

        if (val === 'automatic') {
            $('input[name="onedriveBusinessKey"]').parents('.ju-settings-option').hide();
            $('input[name="onedriveBusinessSecret"]').parents('.ju-settings-option').hide();
            $('#onedriver_business_setup').hide();
            $('#onedrive_business_connect').hide();
            $('#onedrive_business_disconnect').hide();
            $('.odb-ju-connect-message').show();

            if ($('#wpfd-btn-automaticdisconnect-onedrive-business').hasClass("ju-visibled")) {
                $('#wpfd-btn-automaticdisconnect-onedrive-business').show();
            } else {
                $('#wpfd-btn-automaticdisconnect-onedrive-business').hide();
            }

            if ($('#wpfd-btn-automaticconnect-onedrive-business').hasClass("ju-visibled")) {
                $('#wpfd-btn-automaticconnect-onedrive-business').show();
            } else {
                $('#wpfd-btn-automaticconnect-onedrive-business').hide();
            }
        } else {
            $('input[name="onedriveBusinessKey"]').parents('.ju-settings-option').show();
            $('input[name="onedriveBusinessSecret"]').parents('.ju-settings-option').show();
            $('#onedriver_business_setup').show();
            $('#onedrive_business_connect').show();
            $('#onedrive_business_disconnect').show();
            $('#wpfd-btn-automaticconnect-onedrive-business').hide();
            $('#wpfd-btn-automaticdisconnect-onedrive-business').hide();
            $('.odb-ju-connect-message').hide();
        }

        $.ajax({
            url: cloudconnector_var.ajaxurl + '?action=cloudconnector_onedrive_business_changemode',
            method: 'POST',
            dataType: 'json',
            data: {
                value: val,
                cloudconnect_nonce : cloudconnector_var.nonce
            },
            success: function (res) {

            }
        })

    });

    $('.dropbox-mode-radio-field .ju-radiobox').on('click', function () {
        var val = $(this).val();

        if (val === 'automatic') {
            $('input[name="dropboxKey"]').parents('.ju-settings-option').hide();
            $('input[name="dropboxSecret"]').parents('.ju-settings-option').hide();
            $('#drop_connect').hide();
            $('#drop_disconnect').hide();
            $('.dropbox-ju-connect-message').show();

            if ($('#wpfd-btn-automaticdisconnect-dropbox').hasClass("ju-visibled")) {
                $('#wpfd-btn-automaticdisconnect-dropbox').show();
            } else {
                $('#wpfd-btn-automaticdisconnect-dropbox').hide();
            }

            if ($('#wpfd-btn-automaticconnect-dropbox').hasClass("ju-visibled")) {
                $('#wpfd-btn-automaticconnect-dropbox').show();
            } else {
                $('#wpfd-btn-automaticconnect-dropbox').hide();
            }
        } else {
            $('input[name="dropboxKey"]').parents('.ju-settings-option').show();
            $('input[name="dropboxSecret"]').parents('.ju-settings-option').show();
            $('#drop_connect').show();
            $('#drop_disconnect').show();
            $('#wpfd-btn-automaticconnect-dropbox').hide();
            $('#wpfd-btn-automaticdisconnect-dropbox').hide();
            $('.dropbox-ju-connect-message').hide();
        }

        $.ajax({
            url: cloudconnector_var.ajaxurl + '?action=cloudconnector_dropbox_changemode',
            method: 'POST',
            dataType: 'json',
            data: {
                value: val,
                cloudconnect_nonce : cloudconnector_var.nonce
            },
            success: function (res) {

            }
        })

    });

    $('.ju-disconnected-autoconnect').qtip({
        content: {
            attr: 'title',
        },
        position: {
            my: 'top left',
            at: 'bottom left',
        },
        style: {
            tip: {
                corner: true,
            },
            classes: 'wpfd-qtip qtip-rounded wpfd-qtip-dashboard',
        },
        show: 'mouseover',
        hide: {
            fixed: true,
            delay: 0,
        },

    });
});