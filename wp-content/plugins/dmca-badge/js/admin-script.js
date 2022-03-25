;(function ($, window, document) {
    "use strict";


    $(window).on('load', function () {
        $('#dmca-badge-settings-badge-html').attr('readonly', true);

        $('.dmca-badge-wrap').not('.selected').parent().parent().parent().parent().fadeOut();

        // DMCA no badge display fix after reset
        let hasSelection = false;

        $('#field-badge-selection-input > ul > li > label').each(function (index) {
            if (!hasSelection && $(this).hasClass('selected')) {
                hasSelection = true;
            }
        });

        if (!hasSelection) {
            $('label[for=dmca-badge-settings-badge-badge-selection-regular]').trigger('click');
        }

        let widgetElement = $('#field-dmca-widget-enable-input');

        if (widgetElement) {
            widgetElement.addClass('dmca-badge-wrap').addClass('dmca-widget-badge');
        }
    });


    $(document).on('click', 'textarea.copy-code-section, #dmca-badge-settings-badge-html', function () {
        $(this).focus().select();
    });

    $(document).on('change', '#field-badge-selection-input > ul > li > label > input[type="radio"]', function () {
        $(this).parent().parent().parent().find('.selected').removeClass('selected');
        $(this).parent().addClass('selected');

        let dmcaBadgeWrap = $('.dmca-badge-wrap'),
            selectedSection = $('.dmca-badge-wrap.dmca-' + $(this).val() + '-badge'),
            selectedSectionTable = selectedSection.parent().parent().parent().parent();

        dmcaBadgeWrap.removeClass('selected');
        selectedSection.addClass('selected');

        dmcaBadgeWrap.not('.selected').parent().parent().parent().parent().slideUp();
        selectedSectionTable.slideDown();
        selectedSectionTable.css('display', 'block');
    });


    /**
     * Return url paramenter
     *
     * @param name
     * @returns {string | number}
     */
    $.getUrlParam = function (name) {
        let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

        if (typeof results === 'undefined' || results === null) {
            return 0;
        }

        return results[1] || 0;
    };

    let badgeHtmlTextAreaWidth = 568,
        badgePreviewMargin = 20,
        badgeWrappers = $("#dmca-badge-settings-badges").find(".badge-option-wrapper"),
        badgeUrlElem = $("#dmca-badge-settings-badge-url"),
        badgeUrl = badgeUrlElem.val(),
        badgeHtmlTextArea = $("#dmca-badge-settings-badge-html"),
        badgeInputArea = $("#field-html-input");


    $(document).on('click', '.dmca_pages .row-actions span.add', function () {

        let thisButton = $(this),
            thisRow = thisButton.parent().parent().parent(),
            thisPageID = thisRow.data('row-id'),
            thisStatusField = thisRow.find('.dmca-status'),
            currentStatus = thisStatusField.html(),
            addAllPageButton = $('.add-all-pages'),
            loginToken = addAllPageButton.data('token'),
            ajaxURL = addAllPageButton.data('ajaxurl');

        if (typeof thisRow === 'undefined' || typeof thisPageID === 'undefined') {
            return;
        }

        thisStatusField.html('Processing...');

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: ajaxURL,
            context: this,
            data: {
                action: 'dmca_sync_page',
                page_id: thisPageID,
                login_token: loginToken,
            },
            success: function (response) {
                console.log(response);
                if (response.success) {
                    thisStatusField.html('Sent');
                    thisRow.removeClass('dmca-status-pending').addClass('dmca-status-sent');
                } else {
                    thisRow.removeClass('dmca-status-pending').addClass('dmca-status-error');
                    thisStatusField.html(currentStatus);
                }
            }
        });
    });


    $(document).on('click', '.add-all-pages', function () {
        $(document.body).trigger('process_first_pending_row');
    });


    $(document).on('process_first_pending_row', function () {

        let wpListTable = $('.wp-list-table.dmca_pages'),
            paginationLinks = $('.pagination-links'),
            firstPendingRow = wpListTable.find('tbody tr.dmca-status-pending').first(),
            thisPageID = firstPendingRow.data('row-id'),
            thisStatusField = firstPendingRow.find('.dmca-status'),
            currentStatus = thisStatusField.html(),
            paginateButtonNext = paginationLinks.find('.next-page.button'),
            paginateButtonNextLink = paginateButtonNext.attr('href'),
            addAllPageButton = $('.add-all-pages'),
            loginToken = addAllPageButton.data('token'),
            ajaxURL = addAllPageButton.data('ajaxurl');

        console.log({
            firstPendingRow, thisPageID
        });

        if (typeof firstPendingRow === 'undefined' || typeof thisPageID === 'undefined') {

            console.log(paginateButtonNext.html());
            if (!paginateButtonNext.hasClass('disabled') && typeof paginateButtonNextLink !== 'undefined') {
                // window.location.href = paginateButtonNextLink + '&autoclick=yes';
            }

            return;
        }

        thisStatusField.html('Processing...');

        setTimeout(function () {

            /**
             * Process Request
             */
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: ajaxURL,
                context: this,
                data: {
                    action: 'dmca_sync_page',
                    page_id: thisPageID,
                    login_token: loginToken,
                },
                success: function (response) {
                    if (response.success) {
                        thisStatusField.html('Sent');
                        firstPendingRow.removeClass('dmca-status-pending').addClass('dmca-status-sent');
                    } else {
                        firstPendingRow.removeClass('dmca-status-pending').addClass('dmca-status-error');
                        thisStatusField.html(currentStatus);
                    }
                }
            });


            /**
             * Recall the process
             */
            $(document.body).trigger('process_first_pending_row');
        }, 1500);
    });


    $(document).on('click', '.dmca-sync-pages', function () {

        let sync_Button = $(this),
            page_Item = $('.page-items .page-item:first-child');

        sync_Dmca_pages(page_Item, sync_Button);
    });


    $(document).on('ready', function () {
        badgeWrappers.find("img").click(function () {
            badgeWrappers.find("img.selected").removeClass("selected");
            $(this).addClass("selected");
            updateBadgePreview($(this).attr("src"), true);
        });

        if ($.getUrlParam('autoclick') === 'yes') {
            $('.add-all-pages').click();
            // $(document.body).trigger('process_first_pending_row');
        }

        if (typeof badgeUrl !== 'undefined' && badgeUrl.length) {
            updateBadgePreview(badgeUrl, false);
        }
    });


    /**
     * Update badge preview image
     *
     * @param badgeUrl
     * @param reinitialize
     */
    function updateBadgePreview(badgeUrl, reinitialize) {
        badgeInputArea.show();
        var badgeHtml = $("#badge-template").text().replace("{{badge_url}}", badgeUrl);
        if (reinitialize) {
            badgeUrlElem.val(badgeUrl);
            badgeHtmlTextArea.val(badgeHtml);
        }
        $("#badge-preview").remove();
        badgeHtmlTextArea.before("<div id=\"badge-preview\"><img src=\"" + badgeUrl + "\"/></div>");
        waitForImageLoad(badgeUrl, function () {
            var badgeWidth = parseInt($("#badge-preview").css("width").replace("px", ""));
            var newTextAreaWidth = badgeHtmlTextAreaWidth - badgeWidth - badgePreviewMargin;
            badgeHtmlTextArea.css("width", newTextAreaWidth + "px");
        });
    }


    /**
     * @see https://stackoverflow.com/a/1820460/102699
     */
    function waitForImageLoad(url, callback) {
        let image = new Image();
        image.onload = callback;
        image.src = url;
    }
})(jQuery, window, document);