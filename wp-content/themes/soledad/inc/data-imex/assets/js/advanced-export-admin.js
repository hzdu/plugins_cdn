(function ($) {
    'use strict';

    $(document).on('click', '.penci-content-export', function (event) {
        event.preventDefault();
        var $this = $(this),
            $filetype = $this.data('type'),
            $fileID = $this.data('id');
        $.ajax({
            method: 'GET',
            url: penci_imex_export_object.ajaxurl,
            data: {
                'action': 'penci_export_content',
                'type': $filetype,
                'id': $fileID,
                'request_id': penci_imex_export_object.nonce
            },
            beforeSend: function (data, settings) {
                $this.addClass('loading');
            },
            success: function (data) {
                var blob = new Blob([data]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = $filetype + '-' + $fileID + '.json';
                link.click();
                link.remove();
                $this.removeClass('loading');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
            }
        });
    });

    $(document).on('click', '.penci-import-button', function (event) {
        event.preventDefault();
        var $item = $(this).closest('.penci-imex-item'),
            $id = $item.data('id'),
            $button = $(this),
            $slug = $item.data('slug'),
            $url = $item.data('template_url');

        if (confirm("Are you sure you want to import this header layout?")) {

            $.ajax({
                method: 'POST',
                url: penci_imex_export_object.ajaxurl,
                data: {
                    'action': 'penci_import_content',
                    'id': $id,
                    'content': $url,
                    'slug': $slug,
                    'request_id': penci_imex_export_object.nonce
                },
                beforeSend: function (data, settings) {
                    $button.addClass('loading');
                },
                success: function (data) {
                    $button.removeClass('loading');
                    $button.hide();
                    $('body').find('.penci-imex-item').removeClass('imported');
                    $item.addClass('imported');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
                }
            });
        } else {
            return false;
        }
    });

    $(document).on('submit', '#penci_upload_form', function (event) {
        var form_data = new FormData($('#penci_upload_form')[0]);
        form_data.append('action', 'penci_upload_import');
        $.ajax({
            type: 'POST',
            url: penci_imex_export_object.ajaxurl,
            data: form_data,
            processData: false,
            contentType: false,
            success: function (res) {
                $(document).find('.penci-import-result').html(res.data.text).removeClass('error success').addClass('show ' + res.data.class);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
            }
        });
        event.preventDefault();
    });

})(jQuery);
