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
    var sourcefile = $("#wpfd-template-preview-box").html();
    var preview_hash = window.location.hash;
    var preview_cParents = {};
    var preview_tree = $('.wpfd-foldertree-preview');
    var preview_root_cat = $('.wpfd-content-preview').data('category');
    var preview_subcategories_hover_color_list = {};
    var allCategoriesBreadcrumbs = '<li><a class="catlink" data-idcat="all_0" href="javascript:void(0);">' + wpfdparams.translates.wpfd_all_categories + '</a></li>';
    var allCategoriesDividerBreadcrumbs = '<li><a class="catlink" data-idcat="all_0" href="javascript:void(0);">' + wpfdparams.translates.wpfd_all_categories + '</a><span class="divider"> &gt; </span></li>';
    if (window.wpfdAjax === undefined) {
        window.wpfdAjax = {};
    }
    window.wpfdAjax[preview_root_cat] = {category: null, file: null};
    $(".wpfd-content-preview").each(function () {
        var preview_topCat = $(this).data('category');
        if (preview_topCat == 'all_0') {
            preview_cParents[preview_topCat] = {parent: 0, term_id: 0, name: $(this).find("h2").text()};
        } else {
            preview_cParents[preview_topCat] = {parent: 0, term_id: preview_topCat, name: $(this).find("h2").text()};
        }

        $(this).find(".wpfdcategory.catlink").each(function () {
            var tempidCat = $(this).data('idcat');
            preview_cParents[tempidCat] = {parent: preview_topCat, term_id: tempidCat, name: $(this).text()};
        });
        initInputSelected(preview_topCat);
        initDownloadSelected(preview_topCat);
    });

    Handlebars.registerHelper('bytesToSize', function (bytes) {
        if (typeof bytes === "undefined") {
            return 'n/a';
        }

        return bytes.toString().toLowerCase() === 'n/a' ? bytes : bytesToSize(bytes);
    });

    initClickFile();

    function preview_initClick() {
        $(document).off('click', '.wpfd-content-preview .catlink').on('click', '.wpfd-content-preview .catlink', function(e) {
            var ctheme = $(this).parents('.wpfd-content').find('.wpfd_root_category_theme').val();
            var c_root_cat = $(this).parents('.wpfd-content').find('.wpfd_root_category_id').val();
            if ($(this).hasClass('backcategory')) {
                c_root_cat = $(this).data('idcat');
            }
            $(".wpfd-content[data-category=" + $(this).parents('.wpfd-content-'+ctheme).data('category') + "] .wpfd-container-"+ctheme).find('.wpfd-categories .wpfdcategory.catlink').each(function () {
                var tempidCat = $(this).data('idcat');
                preview_cParents[tempidCat] = {parent: $(this).parents('.wpfd-content-'+ctheme).data('category'), term_id: tempidCat, name: $(this).attr('title')};
            });
            e.preventDefault();
            load(c_root_cat, $(this).data('idcat'));
        })
    }

    function initInputSelected(sc) {
        $(document).on('change', ".wpfd-content-preview.wpfd-content-multi[data-category=" + sc + "] input.cbox_file_download", function (e) {
            e.stopPropagation();
            var rootCat = ".wpfd-content-preview.wpfd-content-multi[data-category=" + sc + "]";
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
                $(rootCat + " .preview-download-selected").remove();
                var downloadSelectedBtn = $('<a href="javascript:void(0);" class="preview-download-selected" style="display: block;">' + wpfdparams.translates.download_selected + '<i class="zmdi zmdi-check-all wpfd-download-category"></i></a>');
                downloadSelectedBtn.insertAfter($(rootCat).find(" #current_category_slug_" + sc));
            } else {
                $(rootCat + " .wpfdSelectedFiles").remove();
                $(rootCat + " .preview-download-selected").remove();
                hideDownloadAllBtn(sc, false);
            }
            preview_init_pagination($(rootCat).next(".wpfd-pagination"));
        });
    }

    function hideDownloadAllBtn(sc, hide) {
        var rootCat = ".wpfd-content-preview.wpfd-content-multi[data-category=" + sc + "]";
        var downloadCatButton = $(rootCat + " .preview-download-category");
        if (downloadCatButton.length === 0 || downloadCatButton.hasClass('display-download-category')) {
            return;
        }
        if (hide) {
            $(rootCat + " .preview-download-category").hide();
        } else {
            $(rootCat + " .preview-download-category").show();
        }
    }

    function initDownloadSelected(sc) {
        var rootCat = ".wpfd-content-preview.wpfd-content-multi[data-category=" + sc + "]";
        $(document).on('click', rootCat + ' .preview-download-selected', function () {
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
    preview_initClick();

    preview_hash = preview_hash.replace('#', '');
    if (preview_hash !== '') {
        var hasha = preview_hash.split('-');
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
                load(hash_sourcecat, hash_category_id, page);
            }, 100)
        }
    }

    function initClickFile() {
        $('.wpfd-content .wpfd-file-link').unbind('click').click(function (e) {
            var atthref = $(this).attr('href');
            if (atthref !== '#') {
                return;
            }
            e.preventDefault();
            var fileid = $(this).data('id');
            var categoryid = $(this).data('category_id');
            $.ajax({
                url: wpfdparams.wpfdajaxurl + "task=file.display&view=file&id=" + fileid + "&categoryid=" + categoryid + "&rootcat=" + preview_root_cat,
                dataType: "json",
                beforeSend: function() {
                    // setting a timeout
                    if($('body').has('wpfd-preview-box-loader') !== true) {
                        $('body').append('<div class="wpfd-preview-box-loader"></div>');
                    }
                }
            }).done(function (file) {
                var template = Handlebars.compile(sourcefile);
                var html = template(file);
                var box = $("#wpfd-preview-box");
                $('.wpfd-preview-box-loader').each(function () {
                    $(this).remove();
                });
                if (box.length === 0) {
                    $('body').append('<div id="wpfd-preview-box" style="display: none;"></div>');
                    box = $("#wpfd-preview-box");
                }
                box.empty();
                box.prepend(html);
                box.attr('data-id', fileid);
                box.attr('data-catid', categoryid);
                box.attr('class', 'wpfd-preview-box wpfd-download-box');
                if (typeof (file.file.ext) !== 'undefined') {
                    box.attr('data-type', file.file.ext);
                    box.addClass(file.file.ext);
                }
                box.click(function (e) {
                    if ($(e.target).is('#wpfd-preview-box')) {
                        box.hide();
                    }
                    $('#wpfd-preview-box').unbind('click.box').bind('click.box', function (e) {
                        if ($(e.target).is('#wpfd-preview-box')) {
                            box.hide();
                        }
                    });
                });

                if (typeof (file.file.linkdownload) !== 'undefined') {
                    var previewLinkDownload = '<input type="hidden" class="wpfd_file_preview_link_download" value="'+ file.file.linkdownload +'" data-filetitle="'+ file.file.post_title +'" />';
                    box.prepend(previewLinkDownload);
                }

                $('#wpfd-preview-box .wpfd-close').click(function (e) {
                    e.preventDefault();
                    box.hide();
                });

                box.show();

                var dropblock = box.find('.dropblock');
                if ($(window).width() < 400) {
                    dropblock.css('margin-top', '0');
                    dropblock.css('margin-left', '0');
                    dropblock.css('top', '0');
                    dropblock.css('left', '0');
                    dropblock.height($(window).height() - parseInt(dropblock.css('padding-top'), 10) - parseInt(dropblock.css('padding-bottom'), 10));
                    dropblock.width($(window).width() - parseInt(dropblock.css('padding-left'), 10) - parseInt(dropblock.css('padding-right'), 10));
                } else {
                    dropblock.css('margin-top', (-(dropblock.height() / 2) - 20) + 'px');
                    dropblock.css('margin-left', (-(dropblock.width() / 2) - 20) + 'px');
                    dropblock.css('height', '');
                    dropblock.css('width', '');
                    dropblock.css('top', '');
                    dropblock.css('left', '');
                }

                if (dropblock && typeof (file.file.ID) !== 'undefined') {
                    dropblock.attr('data-id', file.file.ID);
                }

                if (typeof wpfdColorboxInit !== 'undefined') {
                    wpfdColorboxInit();
                }
                wpfdTrackDownload();

                $('body.elementor-default #wpfd-preview-box a.wpfd_downloadlink').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var link = $(this).attr('href');
                    window.location.href = link;
                });

                wpfdPreviewDisplayDownloadedFiles();
                wpfdPreviewDownloadFiles();
            });
        });
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
        var upload_type = 'file';
        // Init the uploader
        var uploader = new Resumable({
            target: wpfdparams.wpfduploadajax + '?action=wpfd&task=files.upload&upload_from=front',
            query: {
                id_category: $(currentContainer).find('input[name=id_category]').val(),
            },
            fileParameterName: 'file_upload',
            simultaneousUploads: 1,
            maxChunkRetries: 1,
            maxFileSize: toMB(wpfdparams.maxFileSize),
            maxFileSizeErrorCallback: function (file) {
                alert(file.name + ' ' + _wpfd_text('is too large, please upload file(s) less than ') + wpfdparams.maxFileSize + 'Mb!');
            },
            chunkSize: wpfdparams.serverUploadLimit - 50 * 1024, // Reduce 50KB to avoid error
            forceChunkSize: true,
            fileType: allowedExt,
            fileTypeErrorCallback: function (file) {
                alert(file.name + ' cannot upload!<br/><br/>' + _wpfd_text('This type of file is not allowed to be uploaded. You can add new file types in the plugin configuration'));
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

                if (willUpload) {
                    setTimeout( function() {uploader.upload();}, 1000);
                }
            }
        });

        uploader.on('createFolders', function (files) {
            upload_type = 'folder';
            var currentRootCat = currentContainer.find('input[name=id_category]').val()
            // Prepare category tree
            var paths = files.map(function(file) {
                if (file.hasOwnProperty('catId')) {
                    currentRootCat = file.catId;
                }
                var filePath = (file.hasOwnProperty('relativePath')) ? file.relativePath : file.webkitRelativePath;
                var namePos = filePath.lastIndexOf(file.name);
                return filePath.substr(0,namePos);
            });
            // get unique value (not empty value)
            paths = paths.filter( function(item, i, ar) { return item && ar.indexOf(item) === i } );
            if (paths.length > 0) {
                var categoryType = currentContainer.find('input[name=category_type]').val();
                // Send ajax to initial categories
                $.ajax({
                    url: wpfdparams.wpfduploadajax + '?action=wpfd&task=categories.createCategoriesDeep',
                    data: {
                        paths: paths.join('|'),
                        category_id: currentRootCat,
                        type: categoryType
                    },
                    method: 'POST',
                    success: function (data) {

                    }
                });
            }
        })

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
                    alert('<div>' + response.datas.message + '</div>');
                    return false;
                }
            }
            if (typeof(response) === 'string') {
                alert('<div>' + response + '</div>');
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
            var currentRootCat = currentContainer.find('input[name=id_category]').val();
            var sourcecat = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
            var theme = currentContainer.parents('.wpfd-content.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd_root_category_theme').val();
            var wpfd_tree = $('.wpfd-content[data-category="'+sourcecat+'"] .wpfd-foldertree');
            wpfd_tree.jaofiletree({
                script: wpfdparams.wpfduploadajax + '?juwpfisadmin=false&action=wpfd&task=categories.getCats',
                usecheckboxes: false,
                root: sourcecat,
                expanded: parseInt(wpfdparams.allow_category_tree_expanded) === 1 ? true : false
            });

            var categoryAjaxUrl = wpfdparams.wpfdajaxurl + "task=categories.display&view=categories&id=" + currentRootCat + "&top=" + sourcecat;
            if (wpfdPreviewCategoriesLocalCache.exist(categoryAjaxUrl)) {
                wpfdPreviewCategoriesLocalCache.remove(categoryAjaxUrl);
            }

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
                        var preview_sourcecat = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
                        var current_category  = currentContainer.parents('.wpfd-content.wpfd-content-multi').find('#current_category_' + preview_sourcecat).val();
                        var ordering = $(".wpfd-content-preview.wpfd-content-multi[data-category=" + preview_sourcecat + "]").find('#current_ordering_' + preview_sourcecat).val();
                        var orderingDirection = $(".wpfd-content-preview.wpfd-content-multi[data-category=" + preview_sourcecat + "]").find('#current_ordering_direction_' + preview_sourcecat).val();
                        var page_limit = $(".wpfd-content-preview[data-category=" + preview_sourcecat + "]").find('#page_limit_' + preview_sourcecat).val();
                        var params = $.param({
                            task: 'files.display',
                            view: 'files',
                            id: current_category,
                            rootcat: preview_sourcecat,
                            page: page,
                            orderCol: ordering,
                            orderDir: orderingDirection,
                            page_limit: page_limit
                        });

                        var previewFilesAjaxUrl = wpfdparams.wpfdajaxurl + params;
                        if (wpfdPreviewFilesLocalCache.exist(previewFilesAjaxUrl)) {
                            wpfdPreviewFilesLocalCache.remove(previewFilesAjaxUrl);
                        }

                        load(preview_sourcecat, current_category, null, upload_type);
                        upload_type = 'file';
                    }
                }
            });
        });

        uploader.assignBrowse($(currentContainer).find('#upload_button'));
        uploader.assignBrowse($(currentContainer).find('#upload_folder_button'), true);
        uploader.assignDrop($(currentContainer).find('.jsWpfdFrontUpload'));
    }

    function load(sourcecat, catid, page, upload_type) {
        $(document).trigger('wpfd:category-loading');
        var pathname = window.location.href.replace(window.location.hash, '');
        var container = $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]");
        var view_empty_subcategories = $(".wpfd-content-preview[data-category=" + sourcecat + "] #wpfd_is_empty_subcategories");
        var view_empty_files = $(".wpfd-content-preview[data-category=" + sourcecat + "] #wpfd_is_empty_files");
        container.find('#current_category_' + sourcecat).val(catid);
        container.next('.wpfd-pagination').remove();
        $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").empty();
        $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").html($('#wpfd-loading-wrap').html());

        if (view_empty_subcategories.length) {
            view_empty_subcategories.val('1');
        }

        if (view_empty_files.length) {
            view_empty_files.val('1');
        }

        //Get categories
        var oldCategoryAjax = window.wpfdAjax[preview_root_cat].category;
        var previewCategoriesAjaxUrl = wpfdparams.wpfdajaxurl + "task=categories.display&view=categories&id=" + catid + "&top=" + sourcecat;
        if (oldCategoryAjax !== null) {
            oldCategoryAjax.abort();
        }
        window.wpfdAjax[preview_root_cat].category = $.ajax({
            url: previewCategoriesAjaxUrl,
            dataType: "json",
            cache: true,
            beforeSend: function () {
                if (container.find('.wpfd-form-search-file-category').length) {
                    container.find('.wpfd-form-search-file-category').remove();
                }

                if (wpfdPreviewCategoriesLocalCache.exist(previewCategoriesAjaxUrl) && upload_type != 'folder') {
                    var triggerPreviewCategories = wpfdPreviewCategoriesLocalCache.get(previewCategoriesAjaxUrl);
                    wpfdPreviewCategoriesLocalCacheTrigger(triggerPreviewCategories, sourcecat, page, pathname, catid, container, view_empty_subcategories);
                    return false;
                }
                return true;
            }
        }).done(function (categories) {
            // Set categories trigger
            wpfdPreviewCategoriesLocalCache.set(previewCategoriesAjaxUrl, categories);

            // Search file in category section
            var $displayFileSearch = $(".wpfd-content-preview[data-category=" + sourcecat + "]").find('.wpfd_root_category_display_file_search');
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
                wpfdPreviewSearchFileCategoryHandle();
            }

            if (page !== null && page !== undefined) {
                var stateCatId = catid;

                if (sourcecat === 'all_0' && parseInt(catid) === 0) {
                    stateCatId = 'all_0';
                }

                window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + stateCatId + '-' + categories.category.slug + '-p' + page);
            } else {
                window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-' + categories.category.slug);
            }

            container.find('#current_category_slug_' + sourcecat).val(categories.category.slug);
            var sourcecategories = $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-template-categories").html();
            if (sourcecategories) {
                var template = Handlebars.compile(sourcecategories);
                var html = template(categories);
                if ($(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-categories").length) {
                    $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-categories").remove();
                }
                $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").prepend(html);
            }
            if (categories.category.breadcrumbs !== undefined) {
                if (sourcecat.toString() === 'all_0' && catid.toString() !== 'all_0' && parseInt(catid) !== 0) {
                    categories.category.breadcrumbs = allCategoriesDividerBreadcrumbs + categories.category.breadcrumbs;
                }
                $(".wpfd-content-preview[data-category=" + sourcecat + "] .breadcrumbs").html(categories.category.breadcrumbs);
            }
            for (var i = 0; i < categories.categories.length; i++) {
                preview_cParents[categories.categories[i].term_id] = categories.categories[i];
            }

            preview_breadcrum(sourcecat, catid, categories.category);
            preview_initClick();
            if (preview_tree.length) {
                var currentTree = container.find('.wpfd-foldertree-preview');
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
            wpfd_preview_subcategory_class();

            if (typeof(preview_subcategories_hover_color_list) !== 'undefined') {
                var root_key_exists = sourcecat in preview_subcategories_hover_color_list;
                if (root_key_exists) {
                    var color = preview_subcategories_hover_color_list[sourcecat];
                    wpfd_preview_subcategories_hover_color(sourcecat, color);
                }
            }

            if (view_empty_subcategories.length) {
                view_empty_subcategories.val(categories.categories.length);
                wpfd_view_fire_empty_category_message(sourcecat);
            }
        });
        var ordering = $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_' + sourcecat).val();
        var orderingDirection = $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_direction_' + sourcecat).val();
        var page_limit = $(".wpfd-content-preview[data-category=" + sourcecat + "]").find('#page_limit_' + sourcecat).val();
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
        //Get files
        var oldFileAjax = window.wpfdAjax[preview_root_cat].file;
        var previewFilesAjaxUrl = wpfdparams.wpfdajaxurl + params;
        if (oldFileAjax !== null) {
            oldFileAjax.abort();
        }
        window.wpfdAjax[preview_root_cat].file = $.ajax({
            url: previewFilesAjaxUrl,
            dataType: "json",
            cache: true,
            beforeSend: function () {
                if (wpfdPreviewFilesLocalCache.exist(previewFilesAjaxUrl)) {
                    var previewTriggerFiles = wpfdPreviewFilesLocalCache.get(previewFilesAjaxUrl);
                    wpfdPreviewFilesLocalCacheTrigger(previewTriggerFiles, sourcecat, view_empty_files, previewFilesAjaxUrl);

                    return false;
                }

                return true;
            }
        }).done(function (content) {

            // Set preview files cache
            if (typeof (content.pagination) !== 'undefined' && content.pagination.length) {
                content.cache_pagination = content.pagination;
            }
            wpfdPreviewFilesLocalCache.set(previewFilesAjaxUrl, content);

            if (content.files.length) {
                $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]  .preview-download-category").removeClass("display-download-category");
            } else {
                $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]  .preview-download-category").addClass("display-download-category");
            }

            setTimeout(function() {
                $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]").find('.wpfd-current-url').val(window.location.href);
            }, 1000);

            if (sourcecat.toString() === 'all_0') {
                $(".wpfd-content-preview[data-category=" + sourcecat + "]").parent().find('.wpfd-pagination').remove();
            }

            $(".wpfd-content-preview[data-category=" + sourcecat + "]").after(content.pagination);
            delete content.pagination;
            var sourcefiles = $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-template-files").html();
            var template = Handlebars.compile(sourcefiles);
            var html = template(content);
            html = $('<textarea/>').html(html).val();
            $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview .wpfd_list").find('.file').remove();
            $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").append(html);

            if (typeof (content.filepasswords) !== 'undefined') {
                $.each(content.filepasswords, function( file_id, pw_form ) {
                    var protected_file = $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").find('.wpfd-file-link[data-id="' + file_id + '"]').parent();
                    protected_file.empty();
                    protected_file.addClass('wpfd-password-protection-form');
                    protected_file.append(pw_form);
                });
            }

            if (content.uploadform !== undefined && content.uploadform.length) {
                var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                upload_form_html += content.uploadform;
                upload_form_html += '</div>';
                $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").append(upload_form_html);

                if (typeof (Wpfd) === 'undefined') {
                    Wpfd = {};
                }

                var containers = $(".wpfd-content-preview[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                if (containers.length > 0) {
                    containers.each(function(i, el) {
                        initUploader($(el));
                    });
                }
            }

            // View files
            if (typeof (content.fileview) !== 'undefined' && content.fileview.length) {
                content.fileview.forEach(function (viewFile) {
                    var preview_dropblock = $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview .wpfd-file-link[data-id='"+ viewFile.id +"'] .dropblock");
                    if (viewFile.view === true) {
                        preview_dropblock.css({'background-image': 'url('+ viewFile.link +')'});
                        preview_dropblock.addClass(viewFile.view_class);
                    } else {
                        preview_dropblock.addClass('wpfd-view-default');
                    }
                });
            }

            initClickFile();

            preview_init_pagination($('.wpfd-content-preview[data-category=' + sourcecat + '] + .wpfd-pagination'));

            wpfd_remove_loading($(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview"));
            $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdSelectedFiles").remove();
            $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "] .preview-download-selected").remove();
            hideDownloadAllBtn(sourcecat, false);

            if (view_empty_files.length) {
                view_empty_files.val(content.files.length);
                wpfd_view_fire_empty_category_message(sourcecat);
            }

            wpfdPreviewDisplayDownloadedFiles();
            wpfdPreviewDownloadFiles();
        });

        $(document).trigger('wpfd:category-loaded');
    }

    function preview_breadcrum(preview_topCat, catid, category) {
        var links = [];
        var current_Cat = preview_cParents[catid];
        if (!current_Cat) {
            $(".wpfd-content-preview[data-category=" + preview_topCat + "] .preview-download-category").attr('href', category.linkdownload_cat);
            return false;
        }
        links.unshift(current_Cat);
        if (current_Cat.parent !== 0) {
            while (preview_cParents[current_Cat.parent]) {
                current_Cat = preview_cParents[current_Cat.parent];
                links.unshift(current_Cat);
            }
        }

        var html = '';

        if (preview_topCat.toString() === 'all_0' && catid.toString() !== 'all_0' && parseInt(catid) !== 0) {
            html = allCategoriesDividerBreadcrumbs;
        }

        for (var i = 0; i < links.length; i++) {
            if (parseInt(links[i].term_id) === 0) {
                continue;
            }

            if (i < links.length - 1) {
                if (links[i].term_id != "all_0") {
                    html += '<li><a class="catlink" data-idcat="' + links[i].term_id + '" href="javascript:void(0)">';
                    html += links[i].name + '</a><span class="divider"> &gt; </span></li>';
                }
            } else {
                if (links[i].term_id != "all_0") {
                    html += '<li><span>' + links[i].name + '</span></li>';
                } else {
                    html += '<li><span>' + wpfdparams.translates.wpfd_all_categories + '</span></li>';
                }
            }
        }

        if (html == '' && catid.toString() == 'all_0') {
            html += '<li><span>' + wpfdparams.translates.wpfd_all_categories + '</span></li>';
        }

        $(".wpfd-content-preview[data-category=" + preview_topCat + "] .wpfd-breadcrumbs-preview").html(html);

        $(".wpfd-content-preview[data-category=" + preview_topCat + "] .catlink").click(function (e) {
            e.preventDefault();
            load(preview_topCat, $(this).data('idcat'));
            initClickFile();
        });
        $(".wpfd-content-preview[data-category=" + preview_topCat + "] .preview-download-category").attr('href', category.linkdownload_cat);
    }

    if (preview_tree.length) {
        preview_tree.each(function () {
            var preview_topCat = $(this).parents('.wpfd-content-preview.wpfd-content-multi').data('category');
            $(this).jaofiletree({
                script: wpfdparams.wpfdajaxurl + 'task=categories.getCats',
                usecheckboxes: false,
                root: preview_topCat,
                showroot: preview_cParents[preview_topCat].name,
                expanded: parseInt(wpfdparams.allow_category_tree_expanded) === 1 ? true : false,
                onclick: function (elem, file) {
                    var preview_topCat = $(elem).parents('.wpfd-content-preview.wpfd-content-multi').data('category');
                    if (preview_topCat !== file) {
                        $('.directory', $(elem).parents('.wpfd-content-preview.wpfd-content-multi')).each(function() {
                            if (!$(this).hasClass('selected') && $(this).find('> ul > li').length === 0) {
                                $(this).removeClass('expanded');
                            }
                        });

                        $(elem).parents('.directory').each(function () {
                            var $this = $(this);
                            var category = $this.find(' > a');
                            var parent = $this.find('.icon-open-close');
                            if (parent.length > 0) {
                                if (typeof preview_cParents[category.data('file')] === 'undefined') {
                                    preview_cParents[category.data('file')] = {
                                        parent: parent.data('parent_id'),
                                        term_id: category.data('file'),
                                        name: category.text()
                                    };
                                }
                            }
                        });

                    }

                    load(preview_topCat, file);
                }
            });
        })
    }

    $('.wpfd-content-preview + .wpfd-pagination').each(function (index, elm) {
        var $this = $(elm);
        preview_init_pagination($this);
    });

    function preview_init_pagination($this) {

        var number = $this.find(':not(.current)');

        var wrap = $this.prev('.wpfd-content-preview');

        var sourcecat = wrap.data('category');
        var current_category = wrap.find('#current_category_' + sourcecat).val();

        number.unbind('click').bind('click', function () {
            var page_number = $(this).attr('data-page');
            var current_sourcecat = $(this).attr('data-sourcecat');
            var wrap = $(".wpfd-content-preview[data-category=" + current_sourcecat + "]");
            var current_category = $(".wpfd-content-preview[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
            if (typeof page_number !== 'undefined') {
                var pathname = window.location.href.replace(window.location.hash, '');
                var category = $(".wpfd-content-preview[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
                var category_slug = $(".wpfd-content-preview[data-category=" + current_sourcecat + "]").find('#current_category_slug_' + current_sourcecat).val();
                var ordering = $(".wpfd-content-preview[data-category=" + current_sourcecat + "]").find('#current_ordering_' + current_sourcecat).val();
                var orderingDirection = $(".wpfd-content-preview[data-category=" + current_sourcecat + "]").find('#current_ordering_direction_' + current_sourcecat).val();
                var page_limit = $(".wpfd-content-preview[data-category=" + current_sourcecat + "]").find('#page_limit_' + current_sourcecat).val();
                var stateCatId = category;

                if (current_sourcecat === 'all_0' && parseInt(category) === 0) {
                    stateCatId = 'all_0';
                }

                window.history.pushState('', document.title, pathname + '#' + current_sourcecat + '-' + stateCatId + '-' + category_slug + '-p' + page_number);

                $(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview:not(wpfd-results .wpfd-container-preview) .wpfd_list").remove();
                $(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview:not(wpfd-results .wpfd-container-preview)").append($('#wpfd-loading-wrap').html());

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
                        $('html, body').animate({scrollTop: $(".wpfd-content[data-category=" + current_sourcecat + "]").offset().top}, 'fast');
                    }
                }).done(function (content) {
                    delete content.category;
                    wrap.next('.wpfd-pagination').remove();
                    wrap.after(content.pagination);
                    delete content.pagination;
                    var sourcefiles = $(".wpfd-content-preview.wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-template-files").html();
                    var template = Handlebars.compile(sourcefiles);
                    var html = template(content);

                    if ($(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview:not(wpfd-results .wpfd-container-preview) .wpfd-upload-form").length) {
                        $(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview:not(wpfd-results .wpfd-container-preview) .wpfd-upload-form").before(html);
                    } else {
                        $(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview:not(wpfd-results .wpfd-container-preview)").append(html);
                    }
                    initClickFile();
                    // View files
                    if (typeof (content.fileview) !== 'undefined' && content.fileview.length) {
                        content.fileview.forEach(function (viewFile) {
                            var preview_dropblock = $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview:not(wpfd-results .wpfd-container-preview) .wpfd-file-link[data-id='"+ viewFile.id +"'] .dropblock");
                            if (viewFile.view === true) {
                                preview_dropblock.css({'background-image': 'url('+ viewFile.link +')'});
                                preview_dropblock.addClass(viewFile.view_class);
                            } else {
                                preview_dropblock.addClass('wpfd-view-default');
                            }
                        });
                    }
                    // File password security
                    if (typeof (content.filepasswords) !== 'undefined') {
                        $.each(content.filepasswords, function( file_id, pw_form ) {
                            var protected_file = $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").find('.wpfd-file-link[data-id="' + file_id + '"]').parent();
                            protected_file.empty();
                            protected_file.addClass('wpfd-password-protection-form');
                            protected_file.append(pw_form);
                        });
                    }
                    preview_init_pagination(wrap.next('.wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview:not(wpfd-results .wpfd-container-preview)"));
                    wpfdPreviewDisplayDownloadedFiles();
                    wpfdPreviewDownloadFiles();
                });
            }
        });

    }

    function wpfd_preview_container_with_foldertree() {
        $('.wpfd-content-preview .wpfd-container').each(function () {
            if($(this).children('.with_foldertree').length > 0) {
                $(this).addClass('wpfd_previewcontainer_foldertree');
            } else {
                if($(this).hasClass('wpfd_previewcontainer_foldertree')) {
                    $(this).removeClass('wpfd_previewcontainer_foldertree');
                }
            }
        });

        //parent-content
        $('.wpfd-content-preview').each(function () {
            if($(this).children().has('.wpfd-foldertree').length > 0) {
                $(this).addClass('wpfdcontent_preview_folder_tree');
            } else {
                if($(this).hasClass('wpfdcontent_preview_folder_tree')) {
                    $(this).removeClass('wpfdcontent_preview_folder_tree');
                }
            }
        });
    }

    wpfd_preview_container_with_foldertree();

    function wpfd_preview_subcategory_class() {
        var preview_subcategory = $('.wpfd-content-preview a.wpfdcategory');
        if (preview_subcategory.length) {
            preview_subcategory.addClass('preview_category');
        }
    }
    wpfd_preview_subcategory_class();

    function wpfd_preview_subcategories_hover_color(root_category, color) {
        if (typeof (color) === 'undefined' || color === '') {
            color = '#3e3294';
        }
        var style_el = 'wpfd-view-custom-colors-' + root_category;
        var custom_color = $('<style class="'+ style_el +'">.wpfd-content.wpfd-content-preview[data-category="' + root_category + '"] .preview_category .wpfd-folder:before{color: ' + color + ' !important; }</style>');

        if (! $('.' + style_el).length) {
            $('head').append(custom_color);
        }

        $('.wpfd-content.wpfd-content-preview[data-category="' + root_category + '"] .preview_category').on('mouseover', function () {
            $(this).css({'background-color': color});
        }).on('mouseout', function () {
            $(this).css({'background-color': '#fff'});
        });
    }

    if ($('.wpfd_subcategories_hover_color').length) {
        $('.wpfd_subcategories_hover_color').each(function () {
            var color = $(this).val();
            var root_category = $(this).parents('.wpfd-content').data('category');
            wpfd_preview_subcategories_hover_color(root_category, color);
            preview_subcategories_hover_color_list[root_category] = color;
        });
    }

    function wpfd_view_fire_empty_category_message(category_id) {
        if (!category_id) {
            return;
        }
        var root_category = '.wpfd-content-preview.wpfd-content-multi[data-category=' + category_id + ']';
        var display_empty_category_message = $(root_category).find('#wpfd_display_empty_category_message').val();
        var empty_category_message_val = $(root_category).find('#wpfd_empty_category_message_val').val();
        var is_empty_subcategories = $(root_category).find('#wpfd_is_empty_subcategories').val();
        var is_empty_files = $(root_category).find('#wpfd_is_empty_files').val();

        if (parseInt(display_empty_category_message) !== 1
            || parseInt(is_empty_subcategories) !== 0 || parseInt(is_empty_files) !== 0 ) {
            return;
        }

        var code = '<div class="wpfd-empty-category-message-section">';
        code += '<p class="wpfd-empty-category-message">';
        code += empty_category_message_val;
        code += '</p>';
        code += '</div>';

        $(root_category).find('.wpfd-empty-category-message-section').remove();
        $(root_category).find('.wpfd-container-preview').append(code);
    }

    var destroy_upload = $('.wpfd-upload-form.destroy');
    if (destroy_upload.length) {
        destroy_upload.remove();
    }

    function wpfdPreviewCategoriesLocalCacheTrigger(triggerPreviewCategories, sourcecat, page, pathname, catid, container, view_empty_subcategories) {
        var $displayFileSearch = $(".wpfd-content-preview[data-category=" + sourcecat + "]").find('.wpfd_root_category_display_file_search');
        if ($displayFileSearch.length) {
            var $themeName = $(".wpfd-content-preview[data-category=" + sourcecat + "]").find('.wpfd_root_category_theme').val();

            if (typeof (triggerPreviewCategories.category.correctConvertCategoryId) === 'undefined') {
                triggerPreviewCategories.category.correctConvertCategoryId = 0;
            }

            var $searchContent = '<form action="" id="adminForm-'+ triggerPreviewCategories.category.term_id +'" class="wpfd-adminForm wpfd-form-search-file-category" name="adminForm" method="post">' +
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
                '<input type="hidden" id="filter_catid" class="chzn-select filter_catid" name="catid" value="'+ triggerPreviewCategories.category.correctConvertCategoryId +'" data-cattype="" data-slug="" />' +
                '<input type="hidden" name="theme" value="'+ $themeName +'">' +
                '<input type="hidden" name="limit" value="15">' +
                '<div id="wpfd-results" class="wpfd-results list-results"></div>' +
                '</div>' +
                '</form>';

            $(".wpfd-content-preview[data-category=" + sourcecat + "]").prepend($searchContent);
            wpfdPreviewSearchFileCategoryHandle();
        }

        if (page !== null && page !== undefined) {
            var stateCatId = catid;

            if (sourcecat === 'all_0' && parseInt(catid) === 0) {
                stateCatId = 'all_0';
            }

            window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + stateCatId + '-' + triggerPreviewCategories.category.slug + '-p' + page);
        } else {
            window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-' + triggerPreviewCategories.category.slug);
        }

        container.find('#current_category_slug_' + sourcecat).val(triggerPreviewCategories.category.slug);
        var sourcecategories = $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-template-categories").html();
        if (sourcecategories) {
            var template = Handlebars.compile(sourcecategories);
            var html = template(triggerPreviewCategories);
            $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").prepend(html);
        }
        if (triggerPreviewCategories.category.breadcrumbs !== undefined) {
            $(".wpfd-content-preview[data-category=" + sourcecat + "] .breadcrumbs").html(triggerPreviewCategories.category.breadcrumbs);
        }
        for (var i = 0; i < triggerPreviewCategories.categories.length; i++) {
            preview_cParents[triggerPreviewCategories.categories[i].term_id] = triggerPreviewCategories.categories[i];
        }

        preview_breadcrum(sourcecat, catid, triggerPreviewCategories.category);
        preview_initClick();
        if (preview_tree.length) {
            var currentTree = container.find('.wpfd-foldertree-preview');
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
        wpfd_preview_subcategory_class();

        if (typeof(preview_subcategories_hover_color_list) !== 'undefined') {
            var root_key_exists = sourcecat in preview_subcategories_hover_color_list;
            if (root_key_exists) {
                var color = preview_subcategories_hover_color_list[sourcecat];
                wpfd_preview_subcategories_hover_color(sourcecat, color);
            }
        }

        if (view_empty_subcategories.length) {
            view_empty_subcategories.val(triggerPreviewCategories.categories.length);
            wpfd_view_fire_empty_category_message(sourcecat);
        }
    }

    function wpfdPreviewFilesLocalCacheTrigger(previewTriggerFiles, sourcecat, view_empty_files, previewFilesAjaxUrl) {
        if (previewTriggerFiles.files.length) {
            $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]  .preview-download-category").removeClass("display-download-category");
        } else {
            $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]  .preview-download-category").addClass("display-download-category");
        }

        $(".wpfd-content-preview[data-category=" + sourcecat + "]").after(previewTriggerFiles.cache_pagination);
        var sourcefiles = $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-template-files").html();
        var template = Handlebars.compile(sourcefiles);
        var html = template(previewTriggerFiles);
        html = $('<textarea/>').html(html).val();
        $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview .wpfd_list").find('.file').remove();
        $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").append(html);

        if (typeof (previewTriggerFiles.filepasswords) !== 'undefined') {
            $.each(previewTriggerFiles.filepasswords, function( file_id, pw_form ) {
                var protected_file = $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").find('.wpfd-file-link[data-id="' + file_id + '"]').parent();
                protected_file.empty();
                protected_file.addClass('wpfd-password-protection-form');
                protected_file.append(pw_form);
            });
        }

        if (previewTriggerFiles.uploadform !== undefined && previewTriggerFiles.uploadform.length) {
            var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
            upload_form_html += previewTriggerFiles.uploadform;
            upload_form_html += '</div>';
            $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview").append(upload_form_html);

            if (typeof (Wpfd) === 'undefined') {
                Wpfd = {};
            }

            var containers = $(".wpfd-content-preview[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
            if (containers.length > 0) {
                containers.each(function(i, el) {
                    initUploader($(el));
                });
            }
        }

        // View files
        if (typeof (previewTriggerFiles.fileview) !== 'undefined' && previewTriggerFiles.fileview.length) {
            previewTriggerFiles.fileview.forEach(function (viewFile) {
                var preview_dropblock = $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview .wpfd-file-link[data-id='"+ viewFile.id +"'] .dropblock");
                if (viewFile.view === true) {
                    preview_dropblock.css({'background-image': 'url('+ viewFile.link +')'});
                    preview_dropblock.addClass(viewFile.view_class);
                } else {
                    preview_dropblock.addClass('wpfd-view-default');
                }
            });
        }

        initClickFile();

        preview_init_pagination($('.wpfd-content-preview[data-category=' + sourcecat + '] + .wpfd-pagination'));

        wpfd_remove_loading($(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview"));
        $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdSelectedFiles").remove();
        $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "] .preview-download-selected").remove();
        hideDownloadAllBtn(sourcecat, false);

        if (view_empty_files.length) {
            view_empty_files.val(previewTriggerFiles.files.length);
            wpfd_view_fire_empty_category_message(sourcecat);
        }

        wpfdPreviewDisplayDownloadedFiles();
        wpfdPreviewDownloadFiles();
    }

    // Search file category
    function wpfdPreviewCategoryAjaxSearch(element, ordering, direction, pushState = true) {
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
            'limit': $(sform).find('[name=limit]').val()
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
                $(element).find(".wpfd-results .wpfd-container-preview").addClass('wpfd-container-preview-search');
                if ($(element).find(".wpfd-results .wpfd-form-search-file-category").length) {
                    $(element).find(".wpfd-results .wpfd-form-search-file-category").remove();
                }
                wpfdPreviewInitSorting();
                if (typeof wpfdColorboxInit !== 'undefined') {
                    wpfdColorboxInit();
                }
            }
        });
    }

    // Sort initial
    function wpfdPreviewInitSorting() {
        jQuery('.orderingCol').click(function (e) {
            e.preventDefault();
            var ordering = jQuery(this).data('ordering');
            var direction = jQuery(this).data('direction');
            wpfdPreviewCategoryAjaxSearch(ordering, direction);
        });

        jQuery(".list-results #limit").change(function (e) {
            e.preventDefault();
            jQuery('input[name="limit"]').val(jQuery(this).val());
            var formID = '#' + jQuery(this).closest('form').attr('id');
            wpfdPreviewCategoryAjaxSearch(formID);
            return false;
        });
    }

    function wpfdPreviewSearchFileCategoryHandle() {
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
                wpfdPreviewCategoryAjaxSearch(formID);

                return;
            }
        });

        // Ajax filters
        $(".wpfd-content .btnsearchbelow").on('click', function (e) {
            e.preventDefault();
            var formID = '#' + $(this).closest('form').attr('id');
            wpfdPreviewCategoryAjaxSearch(formID);
            return false;
        });
    }
    wpfdPreviewSearchFileCategoryHandle();

    function wpfdPreviewDisplayDownloadedFiles() {
        var fileDownload = $('.wpfd-content.wpfd-content-preview .file');
        var linkDownload = $('.dropblock .wpfd_downloadlink');
        var user_login_id = wpfdparams.wpfd_user_login_id;
        if (linkDownload.length) {
            linkDownload.on('click', function () {
                var fileId = $(this).parents('.dropblock').data('id');
                var isDownloadedFile = localStorage.getItem('wpfd_downloaded_file_' + user_login_id + '_' + fileId);
                if (isDownloadedFile === null) {
                    localStorage.setItem('wpfd_downloaded_file_' + user_login_id + '_' + fileId, 'yes');
                    $('.wpfd-file-link[data-id="'+ fileId +'"]').parents('.file').addClass('is_downloaded');
                }
            });
        }

        if (fileDownload.length) {
            fileDownload.each(function () {
                var id = $(this).find('.wpfd-file-link').data('id');
                var isFileDownload = localStorage.getItem('wpfd_downloaded_file_' + user_login_id + '_' + id);
                if (isFileDownload) {
                    $(this).addClass('is_downloaded');
                }
            });
        }
    }
    wpfdPreviewDisplayDownloadedFiles();

    function wpfdPreviewDownloadFiles() {
        if (!wpfdparams.offRedirectLinkDownloadImageFile) {
            $('.wpfd-preview-box.png .wpfd_downloadlink, .wpfd-preview-box.jpg .wpfd_downloadlink, .wpfd-preview-box.jpeg .wpfd_downloadlink, .wpfd-preview-box.gif .wpfd_downloadlink').on('click', function (event) {
                event.preventDefault();
                var fileId = $(this).parents('.wpfd-preview-box').attr('data-id');
                var categoryId = $(this).parents('.wpfd-preview-box').attr('data-catid');
                var cloudType = $('.wpfd-content-preview').find('.wpfd_root_category_type').val();

                if (!fileId || !categoryId) {
                    return false;
                }

                window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
            });
        }
    }
    wpfdPreviewDownloadFiles();
});

// Preview categories local cache
var wpfdPreviewCategoriesLocalCache = {
    data: {},
    remove: function (url) {
        delete wpfdPreviewCategoriesLocalCache.data[url];
    },
    exist: function (url) {
        return wpfdPreviewCategoriesLocalCache.data.hasOwnProperty(url) && wpfdPreviewCategoriesLocalCache.data[url] !== null;
    },
    get: function (url) {
        return wpfdPreviewCategoriesLocalCache.data[url];
    },
    set: function (url, cachedData) {
        wpfdPreviewCategoriesLocalCache.remove(url);
        wpfdPreviewCategoriesLocalCache.data[url] = cachedData;
    }
};

// Preview files local cache
var wpfdPreviewFilesLocalCache = {
    data: {},
    remove: function (url) {
        delete wpfdPreviewFilesLocalCache.data[url];
    },
    exist: function (url) {
        return wpfdPreviewFilesLocalCache.data.hasOwnProperty(url) && wpfdPreviewFilesLocalCache.data[url] !== null;
    },
    get: function (url) {
        return wpfdPreviewFilesLocalCache.data[url];
    },
    set: function(url, cachedData) {
        wpfdPreviewFilesLocalCache.remove(url);
        wpfdPreviewFilesLocalCache.data[url] = cachedData;
    }
};