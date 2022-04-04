jQuery(document).ready(function ($) {
    'use strict';
    $('#log-viewer-select select[name="log_file"] option').map(function () {
        let $option = $(this), option = $option.attr('value');
        if (option && !$option.attr('selected') && option.indexOf('ald-') === 0) {
            $option.remove();
        }
    })
});