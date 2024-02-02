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
    var allCategoriesBreadcrumbs = '<li><a class="catlink" data-idcat="all_0" href="javascript:void(0);">' + wpfdparams.translates.wpfd_all_categories + '</a></li>';
    var allCategoriesDividerBreadcrumbs = '<li><a class="catlink" data-idcat="all_0" href="javascript:void(0);">' + wpfdparams.translates.wpfd_all_categories + '</a><span class="divider"> &gt; </span></li>';
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
                if (container.find('.wpfd-form-search-file-category').length) {
                    container.find('.wpfd-form-search-file-category').remove();
                }

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

            // Search file in category section
            var $displayFileSearch = container.find('.wpfd_root_category_display_file_search');
            if ($displayFileSearch.length) {
                var $themeName = container.find('.wpfd_root_category_theme').val();

                if (typeof (categories.category.correctConvertCategoryId) === 'undefined') {
                    categories.category.correctConvertCategoryId = 0;
                }

                var $searchContent = '<form action="" id="adminForm-'+ categories.category.term_id +'" class="wpfd-adminForm wpfd-form-search-file-category" name="adminForm" method="post">' +
                    '<div id="loader" style="display:none; text-align: center">' +
                    '<img src="'+ wpfdparams.wpfd_plugin_url +'/app/site/assets/images/searchloader.svg" style="margin: 0 auto"/>' +
                    '</div>' +
                    '<div class="box-search-filter wpfd-category-search-section">' +
                    '<div class="searchSection">' +
                    '<div class="only-file input-group clearfix wpfd_search_input" id="Search_container">' +
                    '<img src="'+ wpfdparams.wpfd_plugin_url +'/app/site/assets/images/search-24.svg" class="material-icons wpfd-icon-search wpfd-search-file-category-icon" />' +
                    '<input type="text" class="pull-left required txtfilename" name="q" id="txtfilename" autocomplete="off" placeholder="'+ wpfdparams.translates.msg_search_file_category_placeholder +'" value="" />' +
                    '</div>' +
                    '<button id="btnsearchbelow" class="btnsearchbelow wpfd-btnsearchbelow" type="button">'+ wpfdparams.translates.msg_search_file_category_search +'</button>' +
                    '</div>' +
                    '<input type="hidden" id="filter_catid" class="chzn-select filter_catid" name="catid" value="'+ categories.category.correctConvertCategoryId +'" data-cattype="" data-slug="" />' +
                    '<input type="hidden" name="theme" value="'+ $themeName +'">' +
                    '<input type="hidden" name="limit" value="15">' +
                    '<div id="wpfd-results" class="wpfd-results list-results"></div>' +
                    '</div>' +
                    '</form>';

                container.prepend($searchContent);
                wpfdTableSearchFileCategoryHandle();
            }

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
                if (sourcecat.toString() === 'all_0' && catid.toString() !== 'all_0' && parseInt(catid) !== 0) {
                    categories.category.breadcrumbs = allCategoriesDividerBreadcrumbs + categories.category.breadcrumbs;
                }
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
                        wpfdTableFilesLocalCacheTrigger(tableFilesTrigger, sourcecat, table_empty_files, container, categories, catid, tableFilesAjaxUrl);
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

                    if (sourcecat.toString() === 'all_0') {
                        $(".wpfd-content-multi[data-category=" + sourcecat + "]").parent().find('.wpfd-pagination').remove();
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
                                            // Refresh uploaded files on caching
                                            if (wpfdTableFilesLocalCache.exist(tableFilesAjaxUrl)) {
                                                wpfdTableFilesLocalCache.remove(tableFilesAjaxUrl);
                                            }
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

                wpfdTableDisplayDownloadedFiles();
                wpfdTableDownloadFiles();
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

        if (sourcecat.toString() === 'all_0' && catid.toString() !== 'all_0' && parseInt(catid) !== 0) {
            html = allCategoriesDividerBreadcrumbs;
        } else if ((sourcecat.toString() === 'all_0' && catid.toString() === 'all_0')
            || (sourcecat.toString() === 'all_0' && parseInt(catid) === 0)) {
            html = allCategoriesBreadcrumbs;
        }

        for (var i = 0; i < links.length; i++) {
            if (parseInt(links[i].term_id) === 0) {
                continue;
            }

            if (i < links.length - 1) {
                if (links[i].parent.toString() === 'undefined') {
                    continue;
                }
                html += '<li><a class="catlink" data-idcat="' + links[i].term_id + '" href="javascript:void(0)">' + links[i].name + '</a><span class="divider"> &gt; </span></li>';
            } else {
                html += '<li><span>' + links[i].name + '</span></li>';
            }
        }

        $(".wpfd-content-table[data-category=" + sourcecat + "] .wpfd-breadcrumbs-table li").remove();
        $(".wpfd-content-table[data-category=" + sourcecat + "] .wpfd-breadcrumbs-table").html(html);
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

                $(".wpfd-content-multi[data-category=" + current_sourcecat + "] table:not(.wpfd-results .wpfd-table) tbody tr:not(.topheader)").remove();
                $(".wpfd-content-multi[data-category=" + current_sourcecat + "] table:not(.wpfd-results .wpfd-table)").after($('#wpfd-loading-wrap').html());
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
                    $(".wpfd-content-multi[data-category=" + current_sourcecat + "] table:not(.wpfd-results .wpfd-table) tbody").append(html);
                    $(".wpfd-content-multi[data-category=" + current_sourcecat + "] table:not(.wpfd-results .wpfd-table) tbody").trigger('change');
                    $(".wpfd-content-multi[data-category=" + current_sourcecat + "] .mediaTableMenu").find('input').trigger('change');

                    if (typeof (content.filepasswords) !== 'undefined') {
                        $.each(content.filepasswords, function( file_id, pw_form ) {
                            var content_form = '<td class="full-width">' + pw_form + '</td>';
                            $(".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('.file[data-id="' + file_id + '"]').empty();
                            $(".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('.file[data-id="' + file_id + '"]').addClass('wpfd-password-protection-form');
                            $(".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('.file[data-id="' + file_id + '"]').append(content_form);
                        });
                    }

                    if (typeof wpfdColorboxInit !== 'undefined') {
                        wpfdColorboxInit();
                    }
                    table_init_pagination(wrap.next('.wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-multi"));
                    wpfdTableDisplayDownloadedFiles();
                    wpfdTableDownloadFiles();
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
        var $displayFileSearch = container.find('.wpfd_root_category_display_file_search');

        if (typeof (tableTriggerCategories.category.correctConvertCategoryId) === 'undefined') {
            tableTriggerCategories.category.correctConvertCategoryId = 0;
        }

        if ($displayFileSearch.length) {
            var $themeName = $(".wpfd-content-multi[data-category=" + sourcecat + "]").find('.wpfd_root_category_theme').val();
            var $searchContent = '<form action="" id="adminForm-'+ tableTriggerCategories.category.term_id +'" class="wpfd-adminForm wpfd-form-search-file-category" name="adminForm" method="post">' +
                '<div id="loader" style="display:none; text-align: center">' +
                '<img src="'+ wpfdparams.wpfd_plugin_url +'/app/site/assets/images/searchloader.svg" style="margin: 0 auto"/>' +
                '</div>' +
                '<div class="box-search-filter wpfd-category-search-section">' +
                '<div class="searchSection">' +
                '<div class="only-file input-group clearfix wpfd_search_input" id="Search_container">' +
                '<img src="'+ wpfdparams.wpfd_plugin_url +'/app/site/assets/images/search-24.svg" class="material-icons wpfd-icon-search wpfd-search-file-category-icon" />' +
                '<input type="text" class="pull-left required txtfilename" name="q" id="txtfilename" autocomplete="off" placeholder="'+ wpfdparams.translates.msg_search_file_category_placeholder +'" value="" />' +
                '</div>' +
                '<button id="btnsearchbelow" class="btnsearchbelow wpfd-btnsearchbelow" type="button">'+ wpfdparams.translates.msg_search_file_category_search +'</button>' +
                '</div>' +
                '<input type="hidden" id="filter_catid" class="chzn-select filter_catid" name="catid" value="'+ tableTriggerCategories.category.correctConvertCategoryId +'" data-cattype="" data-slug="" />' +
                '<input type="hidden" name="theme" value="'+ $themeName +'">' +
                '<input type="hidden" name="limit" value="15">' +
                '<div id="wpfd-results" class="wpfd-results list-results"></div>' +
                '</div>' +
                '</form>';

            $(".wpfd-content-multi[data-category=" + sourcecat + "]").prepend($searchContent);
            wpfdTableSearchFileCategoryHandle();
        }

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
                    wpfdTableFilesLocalCacheTrigger(tableFilesTrigger, sourcecat, table_empty_files, container, tableTriggerCategories, catid, tableFilesAjaxUrl);

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
                                        // Refresh uploaded files on caching
                                        if (wpfdTableFilesLocalCache.exist(tableFilesAjaxUrl)) {
                                            wpfdTableFilesLocalCache.remove(tableFilesAjaxUrl);
                                        }
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

            wpfdTableDisplayDownloadedFiles();
            wpfdTableDownloadFiles();
        });
    }

    function wpfdTableFilesLocalCacheTrigger(tableFilesTrigger, sourcecat, table_empty_files, container, categories, catid, tableFilesAjaxUrl) {
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
                                    // Refresh uploaded files on caching
                                    if (wpfdTableFilesLocalCache.exist(tableFilesAjaxUrl)) {
                                        wpfdTableFilesLocalCache.remove(tableFilesAjaxUrl);
                                    }
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

        wpfdTableDisplayDownloadedFiles();
        wpfdTableDownloadFiles();
    }

    // Search file category
    function wpfdTableCategoryAjaxSearch(element, ordering, direction, pushState = true) {
        var $ = jQuery;
        var sform = element;
        var $key = $(sform).find('input[name=q]').val();
        var $placeholder = $(sform).find('input[name=q]').attr('placeholder');

        // Avoid conflict key search
        if ($key.toString() === $placeholder.toString()) {
            $key = '';
        }

        // Get the form data
        var formData = {
            'q': $key,
            'catid': $(sform).find('[name=catid]').val(),
            'theme': $(sform).find('[name=theme]').val(),
            'limit': $(sform).find('[name=limit]').val(),
            'theme_column': $(sform).find('[name=theme_column]').val()
        };

        formData = cleanObj(formData);

        if (jQuery.isEmptyObject(formData) ||
            (typeof (formData.q) === 'undefined' &&
                typeof (formData.catid) !== 'undefined' &&
                parseInt(formData.catid) === 0)) {
            $(element).find(".txtfilename").focus();
            return false;
        }

        if ((typeof ordering !== 'undefined') && ordering) formData.ordering = ordering;
        if ((typeof direction !== 'undefined') && direction) formData.dir = direction;

        // Pagination
        if (pushState) {
            var filter_url = jQuery.param(formData);
            var currentUrl = window.location.search;
            var pushUrl;
            if (typeof URLSearchParams !== 'undefined') {
                var currentFilters = new URLSearchParams(currentUrl.substring(1));
                Object.keys(formData).forEach(function (key) {
                    if (currentFilters.has(key)) {
                        currentFilters.delete(key);
                    }
                });
                if (currentUrl.substring(1) === '?' && currentFilters.toString() !== '') {
                    pushUrl = currentFilters.toString() + '&' + filter_url;

                } else {
                    pushUrl = '?' + filter_url;
                }

                window.history.pushState(formData, "", pushUrl);
            }
        }

        $.ajax({
            method: "POST",
            url: wpfdparams.wpfdajaxurl + "task=search.display",
            data: formData,
            beforeSend: function () {
                $(element).find(".wpfd-results").html('');
                $(element).find(".wpfd-results").prepend($(element).find("#loader").clone().show());
            },
            success: function (result) {
                $(element).find(".wpfd_search_file_suggestion").html('');
                $(element).find(".wpfd_search_file_suggestion").fadeOut(300);

                $(element).find(".wpfd-results").html(result);
                $(element).find(".wpfd-results .wpfd-table").addClass('wpfd-table-search');
                if ($(element).find(".wpfd-results .wpfd-form-search-file-category").length) {
                    $(element).find(".wpfd-results .wpfd-form-search-file-category").remove();
                }
                wpfdTableInitSorting();
                if (typeof wpfdColorboxInit !== 'undefined') {
                    wpfdColorboxInit();
                }
            }
        });
    }

    // Sort initial
    function wpfdTableInitSorting() {
        jQuery('.orderingCol').click(function (e) {
            e.preventDefault();
            var ordering = jQuery(this).data('ordering');
            var direction = jQuery(this).data('direction');
            wpfdTableCategoryAjaxSearch(ordering, direction);
        });

        jQuery(".list-results #limit").change(function (e) {
            e.preventDefault();
            jQuery('input[name="limit"]').val(jQuery(this).val());
            var formID = '#' + jQuery(this).closest('form').attr('id');
            wpfdTableCategoryAjaxSearch(formID);
            return false;
        });
    }

    function wpfdTableSearchFileCategoryHandle() {
        $(".wpfd-content .wpfd-adminForm").submit(function (e) {
            e.preventDefault();
            return false;
        });

        $('.wpfd-content .txtfilename').on('keyup', function(e) {
            var $this = $(this);
            if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter')
            {
                e.preventDefault();

                if ($this.val() === '') {
                    return;
                }

                var formID = '#' + $this.closest('form').attr('id');
                wpfdTableCategoryAjaxSearch(formID);

                return;
            }
        });

        // Ajax filters
        $(".wpfd-content .btnsearchbelow").on('click', function (e) {
            e.preventDefault();
            var formID = '#' + $(this).closest('form').attr('id');
            wpfdTableCategoryAjaxSearch(formID);
            return false;
        });
    }
    wpfdTableSearchFileCategoryHandle();

    function wpfdTableDisplayDownloadedFiles() {
        var fileDownload = $('.wpfd-content.wpfd-content-table .file');
        var linkDownload = $('.wpfd-content.wpfd-content-table .wpfd_downloadlink');
        var user_login_id = wpfdparams.wpfd_user_login_id;
        if (linkDownload.length) {
            linkDownload.on('click', function () {
                var fileId = $(this).parents('.file').data('id');
                var isDownloadedFile = localStorage.getItem('wpfd_downloaded_file_' + user_login_id + '_' + fileId);
                if (isDownloadedFile === null) {
                    localStorage.setItem('wpfd_downloaded_file_' + user_login_id + '_' + fileId, 'yes');
                    $(this).parents('.file').addClass('is_downloaded');
                }
            });
        }

        if (fileDownload.length) {
            fileDownload.each(function () {
                var id = $(this).data('id');
                var isFileDownload = localStorage.getItem('wpfd_downloaded_file_' + user_login_id + '_' + id);
                if (isFileDownload) {
                    $(this).addClass('is_downloaded');
                }
            });
        }
    }
    wpfdTableDisplayDownloadedFiles();

    function wpfdTableDownloadFiles() {
        $('.file.png .wpfd_downloadlink, .file.jpg .wpfd_downloadlink, .file.jpeg .wpfd_downloadlink, .file.gif .wpfd_downloadlink').on('click', function (event) {
            event.preventDefault();
            var fileId = $(this).parents('.file').data('id');
            var categoryId = $(this).parents('.file').data('catid');
            var cloudType = $(this).parents('.wpfd-content-table').find('.wpfd_root_category_type').val();

            if (!fileId || !categoryId) {
                return false;
            }

            window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
        });
    }
    wpfdTableDownloadFiles();

    function wpfdTableInitDefaultOption() {
        var $           = jQuery;
        var checkitem   = $('.wpfdTableMenu .media-item');
        var showList    = [];
        if (checkitem.length) {
            checkitem.each(function () {
                if ($(this).prop("checked") == true) {
                    showList.push($(this).val());
                }
            });
            if (showList.length > 0) {
                jQuery("#total-media-list").val(showList.join(","));
            } else {
                jQuery("#total-media-list").val("");
            }
            var desc = "";
            var category = "";
            var ver = "";
            var size = "";
            var hits = "";
            var dateadd = "";
            var download = "";
            for(var i = 0; i<showList.length;i++) {
                if(showList[i] == "Description" ) {
                    desc = "Description";
                }
                if(showList[i] == "Category" ) {
                    category = "Category";
                }
                if(showList[i] == "Version") {
                    ver = "Version";
                }
                if(showList[i] == "Size") {
                    size = "Size";
                }
                if(showList[i] == "Hits") {
                    hits = "Hits";
                }
                if(showList[i] == "Date added") {
                    dateadd = "Date added";
                }
                if(showList[i] == "Download") {
                    download = "Download";
                }
            }
            if(desc === "Description") {
                jQuery(".file_desc").removeClass('filehidden');
            } else {
                jQuery(".file_desc").addClass('filehidden');
            }
            if(category === "Category") {
                jQuery(".file_category").removeClass('filehidden');
            } else {
                jQuery(".file_category").addClass('filehidden');
            }
            if (ver === "Version") {
                jQuery(".file_version").removeClass('filehidden');
            } else {
                jQuery(".file_version").addClass('filehidden');
            }
            if (size === "Size") {
                jQuery(".file_size").removeClass('filehidden');
            } else {
                jQuery(".file_size").addClass('filehidden');
            }
            if (hits === "Hits") {
                jQuery(".file_hits").removeClass('filehidden');
            } else {
                jQuery(".file_hits").addClass('filehidden');
            }
            if (dateadd === "Date added") {
                jQuery(".file_created").removeClass('filehidden');
            } else {
                jQuery(".file_created").addClass('filehidden');
            }
            if (download === "Download") {
                jQuery(".file_download_tbl").removeClass('filehidden');
            } else {
                jQuery(".file_download_tbl").addClass('filehidden');
            }

            var wpfdTable = $('.wpfd-results table.wpfd-search-result');
            wpfdTable.each(function() {
                var visibleRow = $(this).find('tbody tr');
                visibleRow.each(function() {
                    var visibleColumn = $(this).find('td:not(.filehidden)');
                    visibleColumn.each(function() {
                        if ($(this).is(visibleColumn.last())) {
                            $(this).attr('colspan', 2);
                        } else {
                            $(this).attr('colspan', 1);
                        }
                    })
                })
            })
        }

    }
    function wpfdTableInitUploadDefaultOption(container) {
        var $           = jQuery;
        var checkitem   = $(".file-upload-content[data-container='" + container + "'] .wpfdTableMenu .media-item");
        var showList    = [];
        checkitem.each(function () {
            if ($(this).prop("checked") == true) {
                showList.push($(this).val());
            }
        });
        if (showList.length > 0) {
            jQuery(".file-upload-content[data-container='" + container + "'] #total-media-list").val(showList.join(","));
        } else {
            jQuery(".file-upload-content[data-container='" + container + "'] #total-media-list").val("");
        }
        var desc        = "";
        var category    = "";
        var ver         = "";
        var size        = "";
        var hits        = "";
        var dateadd     = "";
        var download    = "";
        for(var i = 0; i<showList.length;i++) {
            if(showList[i] == "Description" ) {
                desc = "Description";
            }
            if(showList[i] == "Category") {
                category = "Category";
            }
            if(showList[i] == "Version") {
                ver = "Version";
            }
            if(showList[i] == "Size") {
                size = "Size";
            }
            if(showList[i] == "Hits") {
                hits = "Hits";
            }
            if(showList[i] == "Date added") {
                dateadd = "Date added";
            }
            if(showList[i] == "Download") {
                download = "Download";
            }
        }
        if(desc === "Description") {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_desc").removeClass('filehidden');
        } else {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_desc").addClass('filehidden');
        }
        if(category === "Category") {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_category").removeClass('filehidden');
        } else {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_category").addClass('filehidden');
        }
        if (ver === "Version") {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_version").removeClass('filehidden');
        } else {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_version").addClass('filehidden');
        }
        if (size === "Size") {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_size").removeClass('filehidden');
        } else {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_size").addClass('filehidden');
        }
        if (hits === "Hits") {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_hits").removeClass('filehidden');
        } else {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_hits").addClass('filehidden');
        }
        if (dateadd === "Date added") {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_created").removeClass('filehidden');
        } else {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_created").addClass('filehidden');
        }
        if (download === "Download") {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_download_tbl").removeClass('filehidden');
        } else {
            jQuery(".file-upload-content[data-container='" + container + "'] .file_download_tbl").addClass('filehidden');
        }
    }
    function wpfdTableShowViewOption() {
        var $         = jQuery;
        var checkitem = $('.wpfdTableMenu .media-item');
        $(document).on("click", ".wpfdTableMenu", function() {
            $(this).addClass('showlist');
            $(document).on("click", checkitem, function() {
                if (!$(this).parents('.file-upload-content').length) {
                    wpfdTableInitDefaultOption();
                    if($(".list-results .file_desc").hasClass("filehidden") && $(".list-results .file_created").hasClass("filehidden") ) {
                        $(".list-results .file_download_tbl").addClass("file_download_inline");
                    } else {
                        $(".list-results .file_download_tbl").removeClass("file_download_inline");
                    }
                    var checkall = $(".list-results .table thead th");
                    if(!checkall.hasClass("filehidden")) {
                        $(".list-results .file_title").addClass("adv_file_tt");
                    } else {
                        $(".list-results .file_title").removeClass("adv_file_tt");
                    }
                } else {
                    var container = $(this).parents('.file-upload-content').data('container');
                    wpfdTableInitUploadDefaultOption(container);
                    if($(".file-upload-content[data-container='" + container + "'] .list-results .file_desc").hasClass("filehidden") && $(".file-upload-content[data-container='" + container + "'] .list-results .file_created").hasClass("filehidden") ) {
                        $(".file-upload-content[data-container='" + container + "'] .list-results .file_download_tbl").addClass("file_download_inline");
                    } else {
                        $(".file-upload-content[data-container='" + container + "'] .list-results .file_download_tbl").removeClass("file_download_inline");
                    }
                    var checkall = $(".file-upload-content[data-container='" + container + "'] .list-results .table thead th");
                    if(!checkall.hasClass("filehidden")) {
                        $(".file-upload-content[data-container='" + container + "'] .list-results .file_title").addClass("adv_file_tt");
                    } else {
                        $(".file-upload-content[data-container='" + container + "'] .list-results .file_title").removeClass("adv_file_tt");
                    }
                }
            });

            $(document).mouseup(e => {
                if (!$(".wpfdTableMenu").is(e.target)
                    && $(".wpfdTableMenu").has(e.target).length === 0)
                {
                    $(".wpfdTableMenu").removeClass('showlist');
                }
            });

            // Close media option when clicking outside
            $(document).mouseup(function(e)
            {
                var container = $(".wpfd-content.wpfd-content-table .mediaTableMenu");

                // if the target of the click isn't the container nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0)
                {
                    container.hide();
                    container.addClass('mediaTableMenuClosed');
                }
            });
        });
    }
    wpfdTableInitDefaultOption();
    wpfdTableShowViewOption();
    if (jQuery('.wpfd-results-tooltip').length) {
        jQuery('.wpfd-results-tooltip').qtip({
            content: {
                attr: 'title',
            },
            position: {
                my: 'bottom left',
                at: 'top left',
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
                delay: 10,
            }
        });
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