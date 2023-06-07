/**
 * Wpfd
 *
 * We developed this code with our hearts and passion.
 * We hope you found it useful, easy to understand and to customize.
 * Otherwise, please feel free to contact us at contact@joomunited.com *
 * @package WP File Download
 * @copyright Copyright (C) 2013 JoomUnited (http://www.joomunited.com). All rights reserved.
 * @copyright Copyright (C) 2013 Damien Barrère (http://www.crac-design.com). All rights reserved.
 * @license GNU General Public License version 2 or later; http://www.gnu.org/licenses/gpl-2.0.html
 */

jQuery(document).ready(function ($) {

    var table_tree = $('.wpfd-foldertree-table');
    var table_hash = window.location.hash;
    var table_root_cat = $('.wpfd-content-table').data('category');
    var table_cParents = {};
    if (window.wpfdAjax === undefined) {
        window.wpfdAjax = {};
    }
    window.wpfdAjax[table_root_cat] = {category: null, file: null};
    $(".wpfd-content-table").each(function () {
        var table_topCat = $(this).data('category');
        var topCatName = $(this).find('.head-category-table li:first-child').text();
        var currentCatName = $(this).find("h2").text();
        if (currentCatName !== '') {
            topCatName = currentCatName;
        }
        if (table_topCat == 'all_0') {
            table_cParents[table_topCat] = {parent: 0, term_id: 0, name: topCatName};
        } else {
            table_cParents[table_topCat] = {parent: 0, term_id: table_topCat, name: topCatName};
        }
        $(this).find(".wpfdcategory.catlink").each(function () {
            var tempidCat = $(this).data('idcat');
            table_cParents[tempidCat] = {parent: table_topCat, term_id: tempidCat, name: $(this).text()};
        });
        initInputSelected(table_topCat);
        initDownloadSelected(table_topCat);
    });

    //load media tables
    $('.wpfd-content .mediaTable').mediaTable();

    Handlebars.registerHelper('bytesToSize', function (bytes) {
        if (typeof bytes === "undefined") {
            return 'n/a';
        }

        return bytes.toString().toLowerCase() === 'n/a' ? bytes : bytesToSize(parseInt(bytes));
    });

    function table_initClick() {
        $('.wpfd-content-table .catlink').unbind('click').click(function (e) {
            e.preventDefault();
            table_load($(this).parents('.wpfd-content-table').data('category'), $(this).data('idcat'));
        });
    }

    function initInputSelected(sc) {
        $(document).on('change', ".wpfd-content-table.wpfd-content-multi[data-category=" + sc + "] input.cbox_file_download", function () {
            var rootCat = ".wpfd-content-table.wpfd-content-multi[data-category=" + sc + "]";
            var selectedFiles = $(rootCat + " input.cbox_file_download:checked");
            var filesId = [];
            if (selectedFiles.length) {
                selectedFiles.each(function (index, file) {
                    filesId.push($(file).data('id'));
                });
            }
            if (filesId.length > 0) {
                $(rootCat + " .wpfdSelectedFiles").remove();
                $('<input type="hidden" class="wpfdSelectedFiles" value="' + filesId.join(',') + '" />')
                    .insertAfter($(rootCat).find(" #current_category_slug_" + sc));
                hideDownloadAllBtn(sc, true);
                $(rootCat + " .table-download-selected").remove();
                var downloadSelectedBtn = $('<a href="javascript:void(0);" class="table-download-selected" style="display: block;">' + wpfdparams.translates.download_selected + '<i class="zmdi zmdi-check-all wpfd-download-category"></i></a>');
                downloadSelectedBtn.insertAfter($(rootCat).find("#current_category_slug_" + sc));
            } else {
                $(rootCat + " .wpfdSelectedFiles").remove();
                $(rootCat + " .table-download-selected").remove();
                hideDownloadAllBtn(sc, false);
            }
        });
    }

    function hideDownloadAllBtn(sc, hide) {
        var rootCat = ".wpfd-content-table.wpfd-content-multi[data-category=" + sc + "]";
        var downloadCatButton = $(rootCat + " .table-download-category");
        if (downloadCatButton.length === 0 || downloadCatButton.hasClass('display-download-category')) {
            return;
        }
        if (hide) {
            $(rootCat + " .table-download-category").hide();
        } else {
            $(rootCat + " .table-download-category").show();
        }
    }

    function initDownloadSelected(sc) {
        var rootCat = ".wpfd-content-table.wpfd-content-multi[data-category=" + sc + "]";
        $(document).on('click', rootCat + ' .table-download-selected', function () {
            if ($(rootCat).find('.wpfdSelectedFiles').length > 0) {
                var current_category = $(rootCat).find('#current_category_' + sc).val();
                var category_name = $(rootCat).find('#current_category_slug_' + sc).val();
                var selectedFilesId = $(rootCat).find('.wpfdSelectedFiles').val();
                $.ajax({
                    url: wpfdparams.wpfdajaxurl + "?action=wpfd&task=files.zipSeletedFiles&filesId=" + selectedFilesId + "&wpfd_category_id=" + current_category,
                    dataType: "json",
                }).done(function (results) {
                    if (results.success) {
                        var hash = results.data.hash;
                        window.location.href = wpfdparams.wpfdajaxurl + "?action=wpfd&task=files.downloadZipedFile&hash=" + hash + "&wpfd_category_id=" + current_category + "&wpfd_category_name=" + category_name;
                    } else {
                        alert(results.data.message);
                    }
                })
            }
        });
    }
    table_initClick();

    table_hash = table_hash.replace('#', '');
    if (table_hash !== '') {
        var hasha = table_hash.split('-');
        var re = new RegExp("^(p[0-9]+)$");
        var page = null;
        var stringpage = hasha.pop();

        if (re.test(stringpage)) {
            page = stringpage.replace('p', '');
        }
        var hash_category_id = hasha[1];
        var hash_sourcecat = hasha[0];

        if (parseInt(hash_category_id) > 0 || hash_category_id === 'all_0') {
            if (hash_category_id == 'all_0') {
                hash_category_id = 0;
            }

            setTimeout(function () {
                table_load(hash_sourcecat, hash_category_id, page);
            }, 100);

        }
    }


    function table_load(sourcecat, catid, page) {
        $(document).trigger('wpfd:category-loading');
        var pathname = window.location.href.replace(window.location.hash, '');
        var container = $(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "]");
        var table_empty_subcategories = $(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] #wpfd_is_empty_subcategories");
        var table_empty_files = $(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] #wpfd_is_empty_files");
        container.find('#current_category_' + sourcecat).val(catid);
        container.next('.wpfd-pagination').remove();

        $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").empty();
        wpfd_remove_loading($(".wpfd-content-multi"));
        $(".wpfd-content-multi[data-category=" + sourcecat + "] table").after($('#wpfd-loading-wrap').html());
        $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-categories").empty();
        let loading_message = '<div class="wpfd-loading-message-section" style="width: 100%; display: block; margin: 20px 10px; box-sizing: border-box;"><span style="font-size: 16px; color: #ffc107;">' + wpfdparams.translates.msg_loading + '</span></div>';
        if (wpfdparams.allow_loading_message) {
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table").prepend(loading_message);
        }

        if (table_empty_subcategories.length) {
            table_empty_subcategories.val('1');
        }

        if (table_empty_files.length) {
            table_empty_files.val('1');
        }

        // Get categories
        var oldCategoryAjax = window.wpfdAjax[table_root_cat].category;
        var tableCategoriesAjaxUrl = wpfdparams.wpfdajaxurl + "task=categories.display&view=categories&id=" + catid + "&top=" + sourcecat;
        if (oldCategoryAjax !== null) {
            oldCategoryAjax.abort();
        }
        window.wpfdAjax[table_root_cat].category = $.ajax({
            url: tableCategoriesAjaxUrl,
            dataType: "json",
            cache: true,
            beforeSend: function () {
                if (wpfdTableCategoriesLocalCache.exist(tableCategoriesAjaxUrl)) {
                    var tableTriggerCategories = wpfdTableCategoriesLocalCache.get(tableCategoriesAjaxUrl);
                    wpfdTableCategoriesLocalCacheTrigger(tableTriggerCategories, sourcecat, page, pathname, catid, container, table_empty_subcategories, table_empty_files);
                    if ($(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-loading-message-section").length) {
                        $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-loading-message-section").remove();
                    }

                    return false;
                }

                return true;
            }
        }).done(function (categories) {
            if ($(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-loading-message-section").length) {
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-loading-message-section").remove();
            }
            // Set table categories cache
            wpfdTableCategoriesLocalCache.set(tableCategoriesAjaxUrl, categories);

            if (page !== null && page !== undefined) {
                window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-' + categories.category.slug + '-p' + page);
            } else {
                window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-' + categories.category.slug);
            }

            container.find('#current_category_slug_' + sourcecat).val(categories.category.slug);
            var tpltable_sourcecategories = container.parents().find("#wpfd-template-table-categories-" + sourcecat).html();
            if (tpltable_sourcecategories) {
                var template = Handlebars.compile(tpltable_sourcecategories);
                var html = template(categories);
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-categories").replaceWith(html);
            }
            if (categories.category.breadcrumbs !== undefined) {
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .breadcrumbs").html(categories.category.breadcrumbs);
            }
            if (table_tree.length) {
                var currentTree = container.find('.wpfd-foldertree-table');
                currentTree.find('li').removeClass('selected');
                currentTree.find('i.md').removeClass('md-folder-open').addClass("md-folder");

                currentTree.jaofiletree('open', catid, currentTree);

                var el = currentTree.find('a[data-file="' + catid + '"]').parent();
                el.find(' > i.md').removeClass("md-folder").addClass("md-folder-open");

                if (!el.hasClass('selected')) {
                    el.addClass('selected');
                }

                var ps = currentTree.find('.icon-open-close');

                $.each(ps.get().reverse(), function (i, p) {
                    if (typeof $(p).data() !== 'undefined' && $(p).data('id') == Number(hash_category_id)) {
                        hash_category_id = $(p).data('parent_id');
                        $(p).click();
                    }
                });
            }

            var ordering = $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_' + sourcecat).val();
            var orderingDirection = $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_direction_' + sourcecat).val();
            var page_limit = $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('#page_limit_' + sourcecat).val();
            var params = $.param({
                task: 'files.display',
                view: 'files',
                id: catid,
                rootcat: sourcecat,
                page: page,
                orderCol: ordering,
                orderDir: orderingDirection,
                page_limit: page_limit
            });

            if (table_empty_subcategories.length) {
                table_empty_subcategories.val(categories.categories.length);
                container.find('table.change_display').removeClass('change_display');
                table_fire_empty_category_message(sourcecat);
            }

            //Get files
            var oldCategoryAjax = window.wpfdAjax[table_root_cat].file;
            var tableFilesAjaxUrl = wpfdparams.wpfdajaxurl + params;
            if (oldCategoryAjax !== null) {
                oldCategoryAjax.abort();
            }
            window.wpfdAjax[table_root_cat].file = $.ajax({
                url: tableFilesAjaxUrl,
                dataType: "json",
                cache: true,
                beforeSend: function () {
                    if (wpfdTableFilesLocalCache.exist(tableFilesAjaxUrl)) {
                        var tableFilesTrigger = wpfdTableFilesLocalCache.get(tableFilesAjaxUrl);
                        wpfdTableFilesLocalCacheTrigger(tableFilesTrigger, sourcecat, table_empty_files, container, categories, catid);
                        if ($(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-loading-message-section").length) {
                            $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-loading-message-section").remove();
                        }

                        return false;
                    }
                    return true;
                }
            }).done(function (content) {
                // Set files local cache
                if (typeof (content.pagination) !== 'undefined' && content.pagination.length) {
                    content.cache_pagination = content.pagination;
                }
                wpfdTableFilesLocalCache.set(tableFilesAjaxUrl, content);

                if (typeof (content.categoryPassword) !== 'undefined' && content.categoryPassword.length) {
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .category-pw-form").remove();
                    var category_pwf = '<div class="category-pw-form">' + content.categoryPassword + '</div>';
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .wpfd-categories").hide();
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .mediaTableWrapper").hide();
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table").append(category_pwf);

                    table_breadcrum(sourcecat, catid, categories.category);

                    table_initClick();
                } else {
                    if (content.files.length) {
                        container.find(".table-download-category").removeClass("display-download-category");
                    } else {
                        container.find(".table-download-category").addClass("display-download-category");
                    }
                    $(".wpfd-content-multi[data-category=" + sourcecat + "]").after(content.pagination);
                    delete content.pagination;

                    var tpltable_source = container.parents().find("#wpfd-template-table-" + sourcecat).html();
                    var template_table = Handlebars.compile(tpltable_source);
                    var html = template_table(content);
                    //html = $('<textarea/>').html(html).val();
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").append(html);
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").trigger('change');
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .mediaTableMenu").find('input').trigger('change');

                    if ($(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".wpfd-upload-form").length) {
                        $(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".wpfd-upload-form").remove();
                    }

                    if (typeof (content.filepasswords) !== 'undefined') {
                        $.each(content.filepasswords, function( file_id, pw_form ) {
                            var content_form = '<td class="full-width">' + pw_form + '</td>';
                            $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('.file[data-id="' + file_id + '"]').empty();
                            $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('.file[data-id="' + file_id + '"]').addClass('wpfd-password-protection-form');
                            $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('.file[data-id="' + file_id + '"]').append(content_form);
                        });
                    }

                    if (content.uploadform !== undefined && content.uploadform.length) {
                        var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                        upload_form_html += content.uploadform;
                        upload_form_html += '</div>';
                        $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table").append(upload_form_html);

                        if (typeof (Wpfd) === 'undefined') {
                            Wpfd = {};
                        }

                        _wpfd_text = function (text) {
                            if (typeof (l10n) !== 'undefined') {
                                return l10n[text];
                            }
                            return text;
                        };

                        function toMB(mb) {
                            return mb * 1024 * 1024;
                        }

                        var allowedExt = wpfdparams.allowed;
                        allowedExt = allowedExt.split(',');
                        allowedExt.sort();

                        var initUploader = function (currentContainer) {
                            // Init the uploader
                            var uploader = new Resumable({
                                target: wpfdparams.wpfduploadajax + '?action=wpfd&&task=files.upload&upload_from=front',
                                query: {
                                    id_category: $(currentContainer).find('input[name=id_category]').val(),
                                },
                                fileParameterName: 'file_upload',
                                simultaneousUploads: 2,
                                maxFileSize: toMB(wpfdparams.maxFileSize),
                                maxFileSizeErrorCallback: function (file) {
                                    alert(file.name + ' ' + _wpfd_text('is too large, please upload file(s) less than ') + wpfdparams.maxFileSize + 'Mb!');
                                },
                                chunkSize: wpfdparams.serverUploadLimit - 50 * 1024, // Reduce 50KB to avoid error
                                forceChunkSize: true,
                                fileType: allowedExt,
                                fileTypeErrorCallback: function (file) {
                                    alert(file.name + ' cannot upload!\n\n' + _wpfd_text('This type of file is not allowed to be uploaded. You can add new file types in the plugin configuration'));
                                },
                                generateUniqueIdentifier: function (file, event) {
                                    var relativePath = file.webkitRelativePath || file.fileName || file.name;
                                    var size = file.size;
                                    var prefix = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                                    return (prefix + size + '-' + relativePath.replace(/[^0-9a-zA-Z_-]/img, ''));
                                }
                            });

                            if (!uploader.support) {
                                alert(_wpfd_text('Your browser does not support HTML5 file uploads!'));
                            }

                            if (typeof (willUpload) === 'undefined') {
                                var willUpload = true;
                            }

                            uploader.on('filesAdded', function (files) {
                                files.forEach(function (file) {
                                    var progressBlock = '<div class="wpfd_process_block" id="' + file.uniqueIdentifier + '">'
                                        + '<div class="wpfd_process_fileinfo">'
                                        + '<span class="wpfd_process_filename">' + file.fileName + '</span>'
                                        + '<span class="wpfd_process_cancel">Cancel</span>'
                                        + '</div>'
                                        + '<div class="wpfd_process_full" style="display: block;">'
                                        + '<div class="wpfd_process_run" data-w="0" style="width: 0%;"></div>'
                                        + '</div></div>';

                                    //$('#preview', '.wpreview').before(progressBlock);
                                    currentContainer.find('#preview', '.wpreview').before(progressBlock);
                                    $(currentContainer).find('.wpfd_process_cancel').unbind('click').click(function () {
                                        fileID = $(this).parents('.wpfd_process_block').attr('id');
                                        fileObj = uploader.getFromUniqueIdentifier(fileID);
                                        uploader.removeFile(fileObj);
                                        $(this).parents('.wpfd_process_block').fadeOut('normal', function () {
                                            $(this).remove();
                                        });

                                        if (uploader.files.length === 0) {
                                            $(currentContainer).find('.wpfd_process_pause').fadeOut('normal', function () {
                                                $(this).remove();
                                            });
                                        }

                                        $.ajax({
                                            url: wpfdparams.wpfduploadajax + '?action=wpfd&task=files.upload',
                                            method: 'POST',
                                            dataType: 'json',
                                            data: {
                                                id_category: $('input[name=id_category]').val(),
                                                deleteChunks: fileID
                                            },
                                            success: function (res, stt) {
                                                if (res.response === true) {
                                                }
                                            }
                                        })
                                    });
                                });

                                // Do not run uploader if no files added or upload same files again
                                if (files.length > 0) {
                                    uploadPauseBtn = $(currentContainer).find('.wpreview').find('.wpfd_process_pause').length;
                                    restableBlock = $(currentContainer).find('.wpfd_process_block');

                                    if (!uploadPauseBtn) {
                                        restableBlock.before('<div class="wpfd_process_pause">Pause</div>');
                                        $(currentContainer).find('.wpfd_process_pause').unbind('click').click(function () {
                                            if (uploader.isUploading()) {
                                                uploader.pause();
                                                $(this).text('Start');
                                                $(this).addClass('paused');
                                                willUpload = false;
                                            } else {
                                                uploader.upload();
                                                $(this).text('Pause');
                                                $(this).removeClass('paused');
                                                willUpload = true;
                                            }
                                        });
                                    }

                                    uploader.opts.query = {
                                        id_category: currentContainer.find('input[name=id_category]').val()
                                    };

                                    if (willUpload) uploader.upload();
                                }
                            });

                            uploader.on('fileProgress', function (file) {
                                $(currentContainer).find('.wpfd_process_block#' + file.uniqueIdentifier)
                                    .find('.wpfd_process_run').width(Math.floor(file.progress() * 100) + '%');
                            });

                            uploader.on('fileSuccess', function (file, res) {
                                var thisUploadBlock = currentContainer.find('.wpfd_process_block#' + file.uniqueIdentifier);
                                thisUploadBlock.find('.wpfd_process_cancel').addClass('uploadDone').text('OK').unbind('click');
                                thisUploadBlock.find('.wpfd_process_full').remove();

                                var response = JSON.parse(res);
                                if (response.response === false && typeof(response.datas) !== 'undefined') {
                                    if (typeof(response.datas.code) !== 'undefined' && response.datas.code > 20) {
                                        alert(response.datas.message);
                                        return false;
                                    }
                                }
                                if (typeof(response) === 'string') {
                                    alert(response);
                                    return false;
                                }

                                if (response.response !== true) {
                                    alert(response.response);
                                    return false;
                                }
                            });

                            uploader.on('fileError', function (file, msg) {
                                thisUploadBlock = currentContainer.find('.wpfd_process_block#' + file.uniqueIdentifier);
                                thisUploadBlock.find('.wpfd_process_cancel').addClass('uploadError').text('Error').unbind('click');
                                thisUploadBlock.find('.wpfd_process_full').remove();
                            });

                            uploader.on('complete', function () {
                                var fileCount  = $(currentContainer).find('.wpfd_process_cancel').length;
                                var categoryId = $(currentContainer).find('input[name=id_category]').val();

                                $.ajax({
                                    url: wpfdparams.wpfduploadajax + '?action=wpfd&task=files.wpfdPendingUploadFiles',
                                    method: 'POST',
                                    dataType: 'json',
                                    data: {
                                        uploadedFiles: fileCount,
                                        id_category: categoryId,
                                    },
                                    success: function (res) {
                                        currentContainer.find('.progress').delay(300).fadeIn(300).hide(300, function () {
                                            $(this).remove();
                                        });
                                        currentContainer.find('.uploaded').delay(300).fadeIn(300).hide(300, function () {
                                            $(this).remove();
                                        });
                                        $('#wpreview .file').delay(1200).show(1200, function () {
                                            $(this).removeClass('done placeholder');
                                        });

                                        $('.gritter-item-wrapper ').remove();
                                        $(currentContainer).find('#wpfd-upload-messages').append(wpfdparams.translates.msg_upload_file);
                                        $(currentContainer).find('#wpfd-upload-messages').delay(1200).fadeIn(1200, function () {
                                            $(currentContainer).find('#wpfd-upload-messages').empty();
                                            $(currentContainer).find('.wpfd_process_pause').remove();
                                            $(currentContainer).find('.wpfd_process_block').remove();
                                        });

                                        // Call list files
                                        if (currentContainer.parent('.wpfd-upload-form').length) {
                                            var table_sourcecat   = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
                                            var current_category  = currentContainer.parents('.wpfd-content.wpfd-content-multi').find('#current_category_' + table_sourcecat).val();
                                            table_load(table_sourcecat, current_category);
                                        }
                                    }
                                });
                            });

                            uploader.assignBrowse($(currentContainer).find('#upload_button'));
                            uploader.assignDrop($(currentContainer).find('.jsWpfdFrontUpload'));
                        }

                        var containers = $(".wpfd-content-multi[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                        if (containers.length > 0) {
                            containers.each(function(i, el) {
                                initUploader($(el));
                            });
                        }
                    }

                    for (var i = 0; i < categories.categories.length; i++) {
                        table_cParents[categories.categories[i].term_id] = categories.categories[i];
                    }

                    table_breadcrum(sourcecat, catid, categories.category);

                    table_initClick();
                    if (typeof wpfdColorboxInit !== 'undefined') {
                        wpfdColorboxInit();
                    }
                    wpfdTrackDownload();

                    if ($(".wpfd-content-multi[data-category=" + sourcecat + "] .category-pw-form").length) {
                        $(".wpfd-content-multi[data-category=" + sourcecat + "] .category-pw-form").remove();
                    }

                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .mediaTableWrapper").show();

                    table_init_pagination($('.wpfd-content-table[data-category=' + sourcecat + '] + .wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-multi"));
                    $(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdSelectedFiles").remove();
                    $(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] .table-download-selected").remove();
                    hideDownloadAllBtn(sourcecat, false);

                    if (table_empty_files.length) {
                        table_empty_files.val(content.files.length);
                        container.find('table.change_display').removeClass('change_display');
                        table_fire_empty_category_message(sourcecat);
                    }
                }

                if ($(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .category-pw-form").length) {
                    hideDownloadAllBtn(sourcecat, true);
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .table-download-category").attr('href', '#');
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfdcategory").hide();
                }

                if (content.files.length) {
                    container.find(".wpfd-container-table").removeClass("wpfd-table-hidden");
                    container.find(".mediaTableWrapper .wpfd-table thead").show();
                    container.find(".mediaTableWrapper .mediaTableMenu").show();
                } else {
                    container.find(".wpfd-container-table").addClass("wpfd-table-hidden");
                    container.find(".mediaTableWrapper .wpfd-table thead").css({'display': 'none'});
                    container.find(".mediaTableWrapper .mediaTableMenu").css({'display': 'none'});
                }
            });

        });

        $(document).trigger('wpfd:category-loaded');
    }

    function table_breadcrum(sourcecat, catid, category) {
        var links = [];
        var current_Cat = table_cParents[catid];
        if (!current_Cat) {
            $(".wpfd-content-table[data-category=" + sourcecat + "] .table-download-category").attr('href', category.linkdownload_cat);
            return false;
        }

        links.unshift(current_Cat);

        if (current_Cat.parent !== 0) {
            while (table_cParents[current_Cat.parent]) {
                current_Cat = table_cParents[current_Cat.parent];
                links.unshift(current_Cat);
            }
        }

        var html = '';
        for (var i = 0; i < links.length; i++) {
            if (i < links.length - 1) {
                html += '<li><a class="catlink" data-idcat="' + links[i].term_id + '" href="javascript:void(0)">' + links[i].name + '</a><span class="divider"> &gt; </span></li>';
            } else {
                html += '<li><span>' + links[i].name + '</span></li>';
            }
        }
        $(".wpfd-content-table[data-category=" + sourcecat + "] .wpfd-breadcrumbs-table li").remove();
        $(".wpfd-content-table[data-category=" + sourcecat + "] .wpfd-breadcrumbs-table").append(html);
        $(".wpfd-content-table[data-category=" + sourcecat + "] .table-download-category").attr('href', category.linkdownload_cat);
    }

    if (table_tree.length) {
        table_tree.each(function () {
            var table_topCat = $(this).parents('.wpfd-content-table.wpfd-content-multi').data('category');
            $(this).jaofiletree({
                script: wpfdparams.wpfdajaxurl + 'task=categories.getCats',
                usecheckboxes: false,
                root: table_topCat,
                showroot: table_cParents[table_topCat].name,
                expanded: parseInt(wpfdparams.allow_category_tree_expanded) === 1 ? true : false,
                onclick: function (elem, file) {

                    var table_topCat = $(elem).parents('.wpfd-content-table.wpfd-content-multi').data('category');
                    if (table_topCat !== file) {
                        $('.directory', $(elem).parents('.wpfd-content-table.wpfd-content-multi')).each(function() {
                            if (!$(this).hasClass('selected') && $(this).find('> ul > li').length === 0) {
                                $(this).removeClass('expanded');
                            }
                        });
                        $(elem).parents('.directory').each(function () {
                            var $this = $(this);
                            var category = $this.find(' > a');
                            var parent = $this.find('.icon-open-close');
                            if (parent.length > 0) {
                                if (typeof table_cParents[category.data('file')] === 'undefined') {
                                    table_cParents[category.data('file')] = {
                                        parent: parent.data('parent_id'),
                                        term_id: category.data('file'),
                                        name: category.text()
                                    };
                                }
                            }
                        });

                    }

                    table_load(table_topCat, file);
                }
            });
        })
    }

    $('.wpfd-content-table + .wpfd-pagination').each(function (index, elm) {
        var $this = $(elm);
        table_init_pagination($this);
    });

    function table_init_pagination($this) {
        var number = $this.find('a:not(.current)');
        var wrap = $this.prev('.wpfd-content-table');
        var sourcecat = wrap.data('category');
        var current_category = wrap.find('#current_category_' + sourcecat).val();

        number.unbind('click').bind('click', function () {
            var page_number = $(this).attr('data-page');
            var current_sourcecat = $(this).attr('data-sourcecat');
            var wrap = $(".wpfd-content-multi[data-category=" + current_sourcecat + "]");
            var current_category = wrap.find('#current_category_' + sourcecat).val();
            if (typeof page_number !== 'undefined') {
                var pathname = window.location.href.replace(window.location.hash, '');
                var category = $(".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
                var category_slug = $(".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_category_slug_' + current_sourcecat).val();
                var ordering = $(".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_ordering_' + current_sourcecat).val();
                var orderingDirection = $(".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_ordering_direction_' + current_sourcecat).val();
                var page_limit = $(".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#page_limit_' + current_sourcecat).val();

                window.history.pushState('', document.title, pathname + '#' + current_sourcecat + '-' + category + '-' + category_slug + '-p' + page_number);

                $(".wpfd-content-multi[data-category=" + current_sourcecat + "] table tbody tr:not(.topheader)").remove();
                $(".wpfd-content-multi[data-category=" + current_sourcecat + "] table").after($('#wpfd-loading-wrap').html());
                var params = $.param({
                    task: 'files.display',
                    view: 'files',
                    id: current_category,
                    rootcat: current_sourcecat,
                    page: page_number,
                    orderCol: ordering,
                    orderDir: orderingDirection,
                    page_limit: page_limit
                });

                //Get files
                $.ajax({
                    url: wpfdparams.wpfdajaxurl + params,
                    dataType: "json",
                    beforeSend: function () {
                        $('html, body').animate({scrollTop: wrap.offset().top}, 'fast');
                    }
                }).done(function (content) {

                    delete content.category;
                    wrap.next('.wpfd-pagination').remove();
                    wrap.after(content.pagination);
                    delete content.pagination;
                    var tpltable_source = wrap.parents().find("#wpfd-template-table-" + current_sourcecat).html();
                    var template_table = Handlebars.compile(tpltable_source);
                    var html = template_table(content);
                    $(".wpfd-content-multi[data-category=" + current_sourcecat + "] table tbody").append(html);
                    $(".wpfd-content-multi[data-category=" + current_sourcecat + "] table tbody").trigger('change');
                    $(".wpfd-content-multi[data-category=" + current_sourcecat + "] .mediaTableMenu").find('input').trigger('change');

                    if (typeof wpfdColorboxInit !== 'undefined') {
                        wpfdColorboxInit();
                    }
                    table_init_pagination(wrap.next('.wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-multi"));
                });
            }

        });
    }

    function optimize_Show_fields() {
        if($('.wpfd-content-table .wpfd-container-table').width() < 600) {
            $('.mediaTableMenu li').each(function () {
                if($(this).find('label').text() == 'Description') {
                    $(this).find('input').prop('checked',false);
                }
            });
            $('.wpfd-table .file_desc').hide();
        }
    }

    function wpfd_Table_with_foldertree() {
        //parent-content
        $('.wpfd-content-table').each(function () {
            if($(this).children().has('.wpfd-foldertree').length > 0) {
                $(this).addClass('wpfdcontent_table_folder_tree');
            } else {
                if($(this).hasClass('wpfdcontent_table_folder_tree')) {
                    $(this).removeClass('wpfdcontent_table_folder_tree');
                }
            }
        });
    }

    optimize_Show_fields();

    wpfd_Table_with_foldertree();

    function table_fire_empty_category_message(category_id) {
        if (!category_id) {
            return;
        }
        var root_category = '.wpfd-content-table.wpfd-content-multi[data-category=' + category_id + ']';
        var display_empty_category_message = $(root_category).find('#wpfd_display_empty_category_message').val();
        var empty_category_message_val = $(root_category).find('#wpfd_empty_category_message_val').val();
        var is_empty_subcategories = $(root_category).find('#wpfd_is_empty_subcategories').val();
        var is_empty_files = $(root_category).find('#wpfd_is_empty_files').val();

        if (parseInt(display_empty_category_message) !== 1
            || parseInt(is_empty_subcategories) !== 0 || parseInt(is_empty_files) !== 0 ) {
            return;
        }

        var code = '<tr class="wpfd-empty-category-message-section">';
        code += '<td class="wpfd-empty-category-message full-width">';
        code += empty_category_message_val;
        code += '</td>';
        code += '</tr>';

        $(root_category).find('.wpfd-empty-category-message-section').remove();
        $(root_category).find('.wpfd-container-table table.wpfd-table').addClass('change_display');
        $(root_category).find('.wpfd-container-table table tbody').append(code);
    }

    var destroy_upload = $('.wpfd-upload-form.destroy');
    if (destroy_upload.length) {
        destroy_upload.remove();
    }

    function wpfdTableCategoriesLocalCacheTrigger(tableTriggerCategories, sourcecat, page, pathname, catid, container, table_empty_subcategories, table_empty_files) {
        if (page !== null && page !== undefined) {
            window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-' + tableTriggerCategories.category.slug + '-p' + page);
        } else {
            window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-' + tableTriggerCategories.category.slug);
        }

        container.find('#current_category_slug_' + sourcecat).val(tableTriggerCategories.category.slug);
        var tpltable_sourcecategories = container.parents().find("#wpfd-template-table-categories-" + sourcecat).html();
        if (tpltable_sourcecategories) {
            var template = Handlebars.compile(tpltable_sourcecategories);
            var html = template(tableTriggerCategories);
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-categories").replaceWith(html);
        }
        if (tableTriggerCategories.category.breadcrumbs !== undefined) {
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .breadcrumbs").html(tableTriggerCategories.category.breadcrumbs);
        }
        if (table_tree.length) {
            var currentTree = container.find('.wpfd-foldertree-table');
            currentTree.find('li').removeClass('selected');
            currentTree.find('i.md').removeClass('md-folder-open').addClass("md-folder");

            currentTree.jaofiletree('open', catid, currentTree);

            var el = currentTree.find('a[data-file="' + catid + '"]').parent();
            el.find(' > i.md').removeClass("md-folder").addClass("md-folder-open");

            if (!el.hasClass('selected')) {
                el.addClass('selected');
            }

            var ps = currentTree.find('.icon-open-close');

            $.each(ps.get().reverse(), function (i, p) {
                if (typeof $(p).data() !== 'undefined' && $(p).data('id') == Number(hash_category_id)) {
                    hash_category_id = $(p).data('parent_id');
                    $(p).click();
                }
            });
        }

        var ordering = $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_' + sourcecat).val();
        var orderingDirection = $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_direction_' + sourcecat).val();
        var page_limit = $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('#page_limit_' + sourcecat).val();
        var params = $.param({
            task: 'files.display',
            view: 'files',
            id: catid,
            rootcat: sourcecat,
            page: page,
            orderCol: ordering,
            orderDir: orderingDirection,
            page_limit: page_limit
        });

        if (table_empty_subcategories.length) {
            table_empty_subcategories.val(tableTriggerCategories.categories.length);
            container.find('table.change_display').removeClass('change_display');
            table_fire_empty_category_message(sourcecat);
        }

        //Get files
        var oldCategoryAjax = window.wpfdAjax[table_root_cat].file;
        var tableFilesAjaxUrl = wpfdparams.wpfdajaxurl + params;
        if (oldCategoryAjax !== null) {
            oldCategoryAjax.abort();
        }
        window.wpfdAjax[table_root_cat].file = $.ajax({
            url: tableFilesAjaxUrl,
            dataType: "json",
            cache: true,
            beforeSend: function () {
                if (wpfdTableFilesLocalCache.exist(tableFilesAjaxUrl)) {
                    var tableFilesTrigger = wpfdTableFilesLocalCache.get(tableFilesAjaxUrl);
                    wpfdTableFilesLocalCacheTrigger(tableFilesTrigger, sourcecat, table_empty_files, container, tableTriggerCategories, catid);

                    return false;
                }

                return true;
            }
        }).done(function (content) {
            // Set table files cache
            wpfdTableFilesLocalCache.set(tableFilesAjaxUrl, content);

            if (typeof (content.categoryPassword) !== 'undefined' && content.categoryPassword.length) {
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .category-pw-form").remove();
                var category_pwf = '<div class="category-pw-form">' + content.categoryPassword + '</div>';
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .wpfd-categories").hide();
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .mediaTableWrapper").hide();
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table").append(category_pwf);

                table_breadcrum(sourcecat, catid, tableTriggerCategories.category);

                table_initClick();
            } else {
                if (content.files.length) {
                    container.find(".table-download-category").removeClass("display-download-category");
                } else {
                    container.find(".table-download-category").addClass("display-download-category");
                }
                $(".wpfd-content-multi[data-category=" + sourcecat + "]").after(content.pagination);
                delete content.pagination;

                var tpltable_source = container.parents().find("#wpfd-template-table-" + sourcecat).html();
                var template_table = Handlebars.compile(tpltable_source);
                var html = template_table(content);
                //html = $('<textarea/>').html(html).val();
                $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").append(html);
                $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").trigger('change');
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .mediaTableMenu").find('input').trigger('change');

                if ($(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".wpfd-upload-form").length) {
                    $(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".wpfd-upload-form").remove();
                }

                if (typeof (content.filepasswords) !== 'undefined') {
                    $.each(content.filepasswords, function( file_id, pw_form ) {
                        var content_form = '<td class="full-width">' + pw_form + '</td>';
                        $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('.file[data-id="' + file_id + '"]').empty();
                        $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('.file[data-id="' + file_id + '"]').addClass('wpfd-password-protection-form');
                        $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('.file[data-id="' + file_id + '"]').append(content_form);
                    });
                }

                if (content.uploadform !== undefined && content.uploadform.length) {
                    var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                    upload_form_html += content.uploadform;
                    upload_form_html += '</div>';
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table").append(upload_form_html);

                    if (typeof (Wpfd) === 'undefined') {
                        Wpfd = {};
                    }

                    _wpfd_text = function (text) {
                        if (typeof (l10n) !== 'undefined') {
                            return l10n[text];
                        }
                        return text;
                    };

                    function toMB(mb) {
                        return mb * 1024 * 1024;
                    }

                    var allowedExt = wpfdparams.allowed;
                    allowedExt = allowedExt.split(',');
                    allowedExt.sort();

                    var initUploader = function (currentContainer) {
                        // Init the uploader
                        var uploader = new Resumable({
                            target: wpfdparams.wpfduploadajax + '?action=wpfd&&task=files.upload&upload_from=front',
                            query: {
                                id_category: $(currentContainer).find('input[name=id_category]').val(),
                            },
                            fileParameterName: 'file_upload',
                            simultaneousUploads: 2,
                            maxFileSize: toMB(wpfdparams.maxFileSize),
                            maxFileSizeErrorCallback: function (file) {
                                alert(file.name + ' ' + _wpfd_text('is too large, please upload file(s) less than ') + wpfdparams.maxFileSize + 'Mb!');
                            },
                            chunkSize: wpfdparams.serverUploadLimit - 50 * 1024, // Reduce 50KB to avoid error
                            forceChunkSize: true,
                            fileType: allowedExt,
                            fileTypeErrorCallback: function (file) {
                                alert(file.name + ' cannot upload!\n\n' + _wpfd_text('This type of file is not allowed to be uploaded. You can add new file types in the plugin configuration'));
                            },
                            generateUniqueIdentifier: function (file, event) {
                                var relativePath = file.webkitRelativePath || file.fileName || file.name;
                                var size = file.size;
                                var prefix = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                                return (prefix + size + '-' + relativePath.replace(/[^0-9a-zA-Z_-]/img, ''));
                            }
                        });

                        if (!uploader.support) {
                            alert(_wpfd_text('Your browser does not support HTML5 file uploads!'));
                        }

                        if (typeof (willUpload) === 'undefined') {
                            var willUpload = true;
                        }

                        uploader.on('filesAdded', function (files) {
                            files.forEach(function (file) {
                                var progressBlock = '<div class="wpfd_process_block" id="' + file.uniqueIdentifier + '">'
                                    + '<div class="wpfd_process_fileinfo">'
                                    + '<span class="wpfd_process_filename">' + file.fileName + '</span>'
                                    + '<span class="wpfd_process_cancel">Cancel</span>'
                                    + '</div>'
                                    + '<div class="wpfd_process_full" style="display: block;">'
                                    + '<div class="wpfd_process_run" data-w="0" style="width: 0%;"></div>'
                                    + '</div></div>';

                                //$('#preview', '.wpreview').before(progressBlock);
                                currentContainer.find('#preview', '.wpreview').before(progressBlock);
                                $(currentContainer).find('.wpfd_process_cancel').unbind('click').click(function () {
                                    fileID = $(this).parents('.wpfd_process_block').attr('id');
                                    fileObj = uploader.getFromUniqueIdentifier(fileID);
                                    uploader.removeFile(fileObj);
                                    $(this).parents('.wpfd_process_block').fadeOut('normal', function () {
                                        $(this).remove();
                                    });

                                    if (uploader.files.length === 0) {
                                        $(currentContainer).find('.wpfd_process_pause').fadeOut('normal', function () {
                                            $(this).remove();
                                        });
                                    }

                                    $.ajax({
                                        url: wpfdparams.wpfduploadajax + '?action=wpfd&task=files.upload',
                                        method: 'POST',
                                        dataType: 'json',
                                        data: {
                                            id_category: $('input[name=id_category]').val(),
                                            deleteChunks: fileID
                                        },
                                        success: function (res, stt) {
                                            if (res.response === true) {
                                            }
                                        }
                                    })
                                });
                            });

                            // Do not run uploader if no files added or upload same files again
                            if (files.length > 0) {
                                uploadPauseBtn = $(currentContainer).find('.wpreview').find('.wpfd_process_pause').length;
                                restableBlock = $(currentContainer).find('.wpfd_process_block');

                                if (!uploadPauseBtn) {
                                    restableBlock.before('<div class="wpfd_process_pause">Pause</div>');
                                    $(currentContainer).find('.wpfd_process_pause').unbind('click').click(function () {
                                        if (uploader.isUploading()) {
                                            uploader.pause();
                                            $(this).text('Start');
                                            $(this).addClass('paused');
                                            willUpload = false;
                                        } else {
                                            uploader.upload();
                                            $(this).text('Pause');
                                            $(this).removeClass('paused');
                                            willUpload = true;
                                        }
                                    });
                                }

                                uploader.opts.query = {
                                    id_category: currentContainer.find('input[name=id_category]').val()
                                };

                                if (willUpload) uploader.upload();
                            }
                        });

                        uploader.on('fileProgress', function (file) {
                            $(currentContainer).find('.wpfd_process_block#' + file.uniqueIdentifier)
                                .find('.wpfd_process_run').width(Math.floor(file.progress() * 100) + '%');
                        });

                        uploader.on('fileSuccess', function (file, res) {
                            var thisUploadBlock = currentContainer.find('.wpfd_process_block#' + file.uniqueIdentifier);
                            thisUploadBlock.find('.wpfd_process_cancel').addClass('uploadDone').text('OK').unbind('click');
                            thisUploadBlock.find('.wpfd_process_full').remove();

                            var response = JSON.parse(res);
                            if (response.response === false && typeof(response.datas) !== 'undefined') {
                                if (typeof(response.datas.code) !== 'undefined' && response.datas.code > 20) {
                                    alert(response.datas.message);
                                    return false;
                                }
                            }
                            if (typeof(response) === 'string') {
                                alert(response);
                                return false;
                            }

                            if (response.response !== true) {
                                alert(response.response);
                                return false;
                            }
                        });

                        uploader.on('fileError', function (file, msg) {
                            thisUploadBlock = currentContainer.find('.wpfd_process_block#' + file.uniqueIdentifier);
                            thisUploadBlock.find('.wpfd_process_cancel').addClass('uploadError').text('Error').unbind('click');
                            thisUploadBlock.find('.wpfd_process_full').remove();
                        });

                        uploader.on('complete', function () {
                            var fileCount  = $(currentContainer).find('.wpfd_process_cancel').length;
                            var categoryId = $(currentContainer).find('input[name=id_category]').val();

                            $.ajax({
                                url: wpfdparams.wpfduploadajax + '?action=wpfd&task=files.wpfdPendingUploadFiles',
                                method: 'POST',
                                dataType: 'json',
                                data: {
                                    uploadedFiles: fileCount,
                                    id_category: categoryId,
                                },
                                success: function (res) {
                                    currentContainer.find('.progress').delay(300).fadeIn(300).hide(300, function () {
                                        $(this).remove();
                                    });
                                    currentContainer.find('.uploaded').delay(300).fadeIn(300).hide(300, function () {
                                        $(this).remove();
                                    });
                                    $('#wpreview .file').delay(1200).show(1200, function () {
                                        $(this).removeClass('done placeholder');
                                    });

                                    $('.gritter-item-wrapper ').remove();
                                    $(currentContainer).find('#wpfd-upload-messages').append(wpfdparams.translates.msg_upload_file);
                                    $(currentContainer).find('#wpfd-upload-messages').delay(1200).fadeIn(1200, function () {
                                        $(currentContainer).find('#wpfd-upload-messages').empty();
                                        $(currentContainer).find('.wpfd_process_pause').remove();
                                        $(currentContainer).find('.wpfd_process_block').remove();
                                    });

                                    // Call list files
                                    if (currentContainer.parent('.wpfd-upload-form').length) {
                                        var table_sourcecat   = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
                                        var current_category  = currentContainer.parents('.wpfd-content.wpfd-content-multi').find('#current_category_' + table_sourcecat).val();
                                        table_load(table_sourcecat, current_category);
                                    }
                                }
                            });
                        });

                        uploader.assignBrowse($(currentContainer).find('#upload_button'));
                        uploader.assignDrop($(currentContainer).find('.jsWpfdFrontUpload'));
                    };

                    var containers = $(".wpfd-content-multi[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                    if (containers.length > 0) {
                        containers.each(function(i, el) {
                            initUploader($(el));
                        });
                    }
                }

                for (var i = 0; i < tableTriggerCategories.categories.length; i++) {
                    table_cParents[tableTriggerCategories.categories[i].term_id] = tableTriggerCategories.categories[i];
                }

                table_breadcrum(sourcecat, catid, tableTriggerCategories.category);

                table_initClick();
                if (typeof wpfdColorboxInit !== 'undefined') {
                    wpfdColorboxInit();
                }
                wpfdTrackDownload();

                if ($(".wpfd-content-multi[data-category=" + sourcecat + "] .category-pw-form").length) {
                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .category-pw-form").remove();
                }

                $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .mediaTableWrapper").show();

                table_init_pagination($('.wpfd-content-table[data-category=' + sourcecat + '] + .wpfd-pagination'));
                wpfd_remove_loading($(".wpfd-content-multi"));
                $(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdSelectedFiles").remove();
                $(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] .table-download-selected").remove();
                hideDownloadAllBtn(sourcecat, false);

                if (table_empty_files.length) {
                    table_empty_files.val(content.files.length);
                    container.find('table.change_display').removeClass('change_display');
                    table_fire_empty_category_message(sourcecat);
                }
            }

            if ($(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .category-pw-form").length) {
                hideDownloadAllBtn(sourcecat, true);
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .table-download-category").attr('href', '#');
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfdcategory").hide();
            }
        });
    }

    function wpfdTableFilesLocalCacheTrigger(tableFilesTrigger, sourcecat, table_empty_files, container, categories, catid) {
        if (typeof (tableFilesTrigger.categoryPassword) !== 'undefined' && tableFilesTrigger.categoryPassword.length) {
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .category-pw-form").remove();
            var category_pwf = '<div class="category-pw-form">' + tableFilesTrigger.categoryPassword + '</div>';
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .wpfd-categories").hide();
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .mediaTableWrapper").hide();
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table").append(category_pwf);

            table_breadcrum(sourcecat, catid, categories.category);

            table_initClick();
        } else {
            if (tableFilesTrigger.files.length) {
                container.find(".table-download-category").removeClass("display-download-category");
            } else {
                container.find(".table-download-category").addClass("display-download-category");
            }
            $(".wpfd-content-multi[data-category=" + sourcecat + "]").after(tableFilesTrigger.cache_pagination);

            var tpltable_source = container.parents().find("#wpfd-template-table-" + sourcecat).html();
            var template_table = Handlebars.compile(tpltable_source);
            var html = template_table(tableFilesTrigger);
            $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").append(html);
            $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").trigger('change');
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .mediaTableMenu").find('input').trigger('change');

            if ($(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".wpfd-upload-form").length) {
                $(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".wpfd-upload-form").remove();
            }

            if (typeof (tableFilesTrigger.filepasswords) !== 'undefined') {
                $.each(tableFilesTrigger.filepasswords, function( file_id, pw_form ) {
                    var content_form = '<td class="full-width">' + pw_form + '</td>';
                    $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('.file[data-id="' + file_id + '"]').empty();
                    $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('.file[data-id="' + file_id + '"]').addClass('wpfd-password-protection-form');
                    $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('.file[data-id="' + file_id + '"]').append(content_form);
                });
            }

            if (tableFilesTrigger.uploadform !== undefined && tableFilesTrigger.uploadform.length) {
                var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                upload_form_html += tableFilesTrigger.uploadform;
                upload_form_html += '</div>';
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table").append(upload_form_html);

                if (typeof (Wpfd) === 'undefined') {
                    Wpfd = {};
                }

                _wpfd_text = function (text) {
                    if (typeof (l10n) !== 'undefined') {
                        return l10n[text];
                    }
                    return text;
                };

                function toMB(mb) {
                    return mb * 1024 * 1024;
                }

                var allowedExt = wpfdparams.allowed;
                allowedExt = allowedExt.split(',');
                allowedExt.sort();

                var initUploader = function (currentContainer) {
                    // Init the uploader
                    var uploader = new Resumable({
                        target: wpfdparams.wpfduploadajax + '?action=wpfd&&task=files.upload&upload_from=front',
                        query: {
                            id_category: $(currentContainer).find('input[name=id_category]').val(),
                        },
                        fileParameterName: 'file_upload',
                        simultaneousUploads: 2,
                        maxFileSize: toMB(wpfdparams.maxFileSize),
                        maxFileSizeErrorCallback: function (file) {
                            alert(file.name + ' ' + _wpfd_text('is too large, please upload file(s) less than ') + wpfdparams.maxFileSize + 'Mb!');
                        },
                        chunkSize: wpfdparams.serverUploadLimit - 50 * 1024, // Reduce 50KB to avoid error
                        forceChunkSize: true,
                        fileType: allowedExt,
                        fileTypeErrorCallback: function (file) {
                            alert(file.name + ' cannot upload!\n\n' + _wpfd_text('This type of file is not allowed to be uploaded. You can add new file types in the plugin configuration'));
                        },
                        generateUniqueIdentifier: function (file, event) {
                            var relativePath = file.webkitRelativePath || file.fileName || file.name;
                            var size = file.size;
                            var prefix = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                            return (prefix + size + '-' + relativePath.replace(/[^0-9a-zA-Z_-]/img, ''));
                        }
                    });

                    if (!uploader.support) {
                        alert(_wpfd_text('Your browser does not support HTML5 file uploads!'));
                    }

                    if (typeof (willUpload) === 'undefined') {
                        var willUpload = true;
                    }

                    uploader.on('filesAdded', function (files) {
                        files.forEach(function (file) {
                            var progressBlock = '<div class="wpfd_process_block" id="' + file.uniqueIdentifier + '">'
                                + '<div class="wpfd_process_fileinfo">'
                                + '<span class="wpfd_process_filename">' + file.fileName + '</span>'
                                + '<span class="wpfd_process_cancel">Cancel</span>'
                                + '</div>'
                                + '<div class="wpfd_process_full" style="display: block;">'
                                + '<div class="wpfd_process_run" data-w="0" style="width: 0%;"></div>'
                                + '</div></div>';

                            //$('#preview', '.wpreview').before(progressBlock);
                            currentContainer.find('#preview', '.wpreview').before(progressBlock);
                            $(currentContainer).find('.wpfd_process_cancel').unbind('click').click(function () {
                                fileID = $(this).parents('.wpfd_process_block').attr('id');
                                fileObj = uploader.getFromUniqueIdentifier(fileID);
                                uploader.removeFile(fileObj);
                                $(this).parents('.wpfd_process_block').fadeOut('normal', function () {
                                    $(this).remove();
                                });

                                if (uploader.files.length === 0) {
                                    $(currentContainer).find('.wpfd_process_pause').fadeOut('normal', function () {
                                        $(this).remove();
                                    });
                                }

                                $.ajax({
                                    url: wpfdparams.wpfduploadajax + '?action=wpfd&task=files.upload',
                                    method: 'POST',
                                    dataType: 'json',
                                    data: {
                                        id_category: $('input[name=id_category]').val(),
                                        deleteChunks: fileID
                                    },
                                    success: function (res, stt) {
                                        if (res.response === true) {
                                        }
                                    }
                                })
                            });
                        });

                        // Do not run uploader if no files added or upload same files again
                        if (files.length > 0) {
                            uploadPauseBtn = $(currentContainer).find('.wpreview').find('.wpfd_process_pause').length;
                            restableBlock = $(currentContainer).find('.wpfd_process_block');

                            if (!uploadPauseBtn) {
                                restableBlock.before('<div class="wpfd_process_pause">Pause</div>');
                                $(currentContainer).find('.wpfd_process_pause').unbind('click').click(function () {
                                    if (uploader.isUploading()) {
                                        uploader.pause();
                                        $(this).text('Start');
                                        $(this).addClass('paused');
                                        willUpload = false;
                                    } else {
                                        uploader.upload();
                                        $(this).text('Pause');
                                        $(this).removeClass('paused');
                                        willUpload = true;
                                    }
                                });
                            }

                            uploader.opts.query = {
                                id_category: currentContainer.find('input[name=id_category]').val()
                            };

                            if (willUpload) uploader.upload();
                        }
                    });

                    uploader.on('fileProgress', function (file) {
                        $(currentContainer).find('.wpfd_process_block#' + file.uniqueIdentifier)
                            .find('.wpfd_process_run').width(Math.floor(file.progress() * 100) + '%');
                    });

                    uploader.on('fileSuccess', function (file, res) {
                        var thisUploadBlock = currentContainer.find('.wpfd_process_block#' + file.uniqueIdentifier);
                        thisUploadBlock.find('.wpfd_process_cancel').addClass('uploadDone').text('OK').unbind('click');
                        thisUploadBlock.find('.wpfd_process_full').remove();

                        var response = JSON.parse(res);
                        if (response.response === false && typeof(response.datas) !== 'undefined') {
                            if (typeof(response.datas.code) !== 'undefined' && response.datas.code > 20) {
                                alert(response.datas.message);
                                return false;
                            }
                        }
                        if (typeof(response) === 'string') {
                            alert(response);
                            return false;
                        }

                        if (response.response !== true) {
                            alert(response.response);
                            return false;
                        }
                    });

                    uploader.on('fileError', function (file, msg) {
                        thisUploadBlock = currentContainer.find('.wpfd_process_block#' + file.uniqueIdentifier);
                        thisUploadBlock.find('.wpfd_process_cancel').addClass('uploadError').text('Error').unbind('click');
                        thisUploadBlock.find('.wpfd_process_full').remove();
                    });

                    uploader.on('complete', function () {
                        var fileCount  = $(currentContainer).find('.wpfd_process_cancel').length;
                        var categoryId = $(currentContainer).find('input[name=id_category]').val();

                        $.ajax({
                            url: wpfdparams.wpfduploadajax + '?action=wpfd&task=files.wpfdPendingUploadFiles',
                            method: 'POST',
                            dataType: 'json',
                            data: {
                                uploadedFiles: fileCount,
                                id_category: categoryId,
                            },
                            success: function (res) {
                                currentContainer.find('.progress').delay(300).fadeIn(300).hide(300, function () {
                                    $(this).remove();
                                });
                                currentContainer.find('.uploaded').delay(300).fadeIn(300).hide(300, function () {
                                    $(this).remove();
                                });
                                $('#wpreview .file').delay(1200).show(1200, function () {
                                    $(this).removeClass('done placeholder');
                                });

                                $('.gritter-item-wrapper ').remove();
                                $(currentContainer).find('#wpfd-upload-messages').append(wpfdparams.translates.msg_upload_file);
                                $(currentContainer).find('#wpfd-upload-messages').delay(1200).fadeIn(1200, function () {
                                    $(currentContainer).find('#wpfd-upload-messages').empty();
                                    $(currentContainer).find('.wpfd_process_pause').remove();
                                    $(currentContainer).find('.wpfd_process_block').remove();
                                });

                                // Call list files
                                if (currentContainer.parent('.wpfd-upload-form').length) {
                                    var table_sourcecat   = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
                                    var current_category  = currentContainer.parents('.wpfd-content.wpfd-content-multi').find('#current_category_' + table_sourcecat).val();
                                    table_load(table_sourcecat, current_category);
                                }
                            }
                        });
                    });

                    uploader.assignBrowse($(currentContainer).find('#upload_button'));
                    uploader.assignDrop($(currentContainer).find('.jsWpfdFrontUpload'));
                }

                var containers = $(".wpfd-content-multi[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                if (containers.length > 0) {
                    containers.each(function(i, el) {
                        initUploader($(el));
                    });
                }
            }

            for (var i = 0; i < categories.categories.length; i++) {
                table_cParents[categories.categories[i].term_id] = categories.categories[i];
            }

            table_breadcrum(sourcecat, catid, categories.category);

            table_initClick();
            if (typeof wpfdColorboxInit !== 'undefined') {
                wpfdColorboxInit();
            }
            wpfdTrackDownload();

            if ($(".wpfd-content-multi[data-category=" + sourcecat + "] .category-pw-form").length) {
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .category-pw-form").remove();
            }

            $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .mediaTableWrapper").show();

            table_init_pagination($('.wpfd-content-table[data-category=' + sourcecat + '] + .wpfd-pagination'));
            wpfd_remove_loading($(".wpfd-content-multi"));
            $(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdSelectedFiles").remove();
            $(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] .table-download-selected").remove();
            hideDownloadAllBtn(sourcecat, false);

            if (table_empty_files.length) {
                table_empty_files.val(tableFilesTrigger.files.length);
                container.find('table.change_display').removeClass('change_display');
                table_fire_empty_category_message(sourcecat);
            }
        }

        if ($(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-table .category-pw-form").length) {
            hideDownloadAllBtn(sourcecat, true);
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .table-download-category").attr('href', '#');
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .wpfdcategory").hide();
        }

        if (tableFilesTrigger.files.length) {
            $(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".wpfd-container-table").removeClass("wpfd-table-hidden");
            $(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".mediaTableWrapper .wpfd-table thead").show();
            $(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".mediaTableWrapper .mediaTableMenu").show();
        } else {
            $(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".wpfd-container-table").addClass("wpfd-table-hidden");
            $(".wpfd-content-multi[data-category=" + sourcecat + "]").find(".mediaTableWrapper .mediaTableMenu").css({'display': 'none'});
        }
    }
});

// Table categories local cache
var wpfdTableCategoriesLocalCache = {
    data: {},
    remove: function (url) {
        delete wpfdTableCategoriesLocalCache.data[url];
    },
    exist: function (url) {
        return wpfdTableCategoriesLocalCache.data.hasOwnProperty(url) && wpfdTableCategoriesLocalCache.data[url] !== null;
    },
    get: function (url) {
        return wpfdTableCategoriesLocalCache.data[url];
    },
    set: function (url, cachedData) {
        wpfdTableCategoriesLocalCache.remove(url);
        wpfdTableCategoriesLocalCache.data[url] = cachedData;
    }
};

// Table files local cache
var wpfdTableFilesLocalCache = {
    data: {},
    remove: function (url) {
        delete wpfdTableFilesLocalCache.data[url];
    },
    exist: function (url) {
        return wpfdTableFilesLocalCache.data.hasOwnProperty(url) && wpfdTableFilesLocalCache.data[url] !== null;
    },
    get: function (url) {
        return wpfdTableFilesLocalCache.data[url];
    },
    set: function(url, cachedData) {
        wpfdTableFilesLocalCache.remove(url);
        wpfdTableFilesLocalCache.data[url] = cachedData;
    }
};