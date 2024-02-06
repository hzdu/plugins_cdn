jQuery(document).ready(function ($) {
    'use strict';
    $('.s2w-cancel-download-images-button').on('click', function (e) {
        if (!confirm(s2w_cancel_download_images_params.i18n_confirm_cancel)) {
            e.preventDefault();
            return false;
        }
    });
    $('.s2w-empty-queue-images-button').on('click', function (e) {
        if (!confirm(s2w_cancel_download_images_params.i18n_confirm_remove)) {
            e.preventDefault();
            return false;
        }
    })
});
