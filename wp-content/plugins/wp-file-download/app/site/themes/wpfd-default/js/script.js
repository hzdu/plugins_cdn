/**
 * WP File Download
 *
 * @package WP File Download
 * @author Joomunited
 * @version 1.0
 */

jQuery(document).ready(function ($) {
    // var sourcefiles = $("#wpfd-template-files").html();
    // var sourcecategories = $("#wpfd-template-categories").html();
    var default_hash = window.location.hash;
    var tree = $('.wpfd-foldertree-default');
    var tree_source_cat = $('.wpfd-content-default').data('category');
    var allCategoriesBreadcrumbs = '<li><a class="catlink" data-idcat="all_0" href="javascript:void(0);">' + wpfdparams.translates.wpfd_all_categories + '</a></li>';
    var allCategoriesDividerBreadcrumbs = '<li><a class="catlink" data-idcat="all_0" href="javascript:void(0);">' + wpfdparams.translates.wpfd_all_categories + '</a><span class="divider"> &gt; </span></li>';
    var cParents = {};
    if (window.wpfdAjax === undefined) {
        window.wpfdAjax = {};
    }
    window.wpfdAjax[tree_source_cat] = {category: null, file: null};

    $(".wpfd-content-default").each(function () {
        var topCat = $(this).data('category');
        cParents[topCat] = {parent: 0, term_id: topCat, name: $(this).find("h2").text()};
        $(this).find(".wpfdcategory.catlink").each(function () {
            var tempidCat = $(this).data('idcat');
            if (topCat == 'all_0') {
                cParents[tempidCat] = {parent: 0, term_id: 0, name: $(this).text()};
            } else {
                cParents[tempidCat] = {parent: topCat, term_id: tempidCat, name: $(this).text()};
            }
        });
        initInputSelected(topCat);
        initDownloadSelected(topCat);
    });

    Handlebars.registerHelper('bytesToSize', function (bytes) {
        if (typeof bytes === "undefined") {
            return 'n/a';
        }

        return bytes.toString().toLowerCase() === 'n/a' ? bytes : bytesToSize(parseInt(bytes));
    });

    Handlebars.registerHelper("xif", function(param, second, options) {
        if (param === second) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    function default_initClick() {
        $('.wpfd-content-default .catlink').unbind('click').click(function () {
            default_load($(this).parents('.wpfd-content-default.wpfd-content-multi').data('category'), $(this).data('idcat'));
            return false;
        });
    }

    function initInputSelected(sc) {
        $(document).on('change', ".wpfd-content-default.wpfd-content-multi[data-category=" + sc + "] input.cbox_file_download", function () {
            var rootCat = ".wpfd-content-default.wpfd-content-multi[data-category=" + sc + "]";
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
                $(rootCat + " .default-download-selected").remove();
                var downloadSelectedBtn = $('<a href="javascript:void(0);" class="default-download-selected" style="display: block;">' + wpfdparams.translates.download_selected + '<i class="zmdi zmdi-check-all wpfd-download-category"></i></a>');
                downloadSelectedBtn.insertAfter($(rootCat).find(" #current_category_slug_" + sc));
            } else {
                $(rootCat + " .wpfdSelectedFiles").remove();
                $(rootCat + " .default-download-selected").remove();
                hideDownloadAllBtn(sc, false);
            }
        });
    }

    function hideDownloadAllBtn(sc, hide) {
        var rootCat = ".wpfd-content-default.wpfd-content-multi[data-category=" + sc + "]";
        var downloadCatButton = $(rootCat + " .default-download-category");
        if (downloadCatButton.length === 0 || downloadCatButton.hasClass('display-download-category')) {
            return;
        }
        if (hide) {
            $(rootCat + " .default-download-category").hide();
        } else {
            $(rootCat + " .default-download-category").show();
        }
    }

    function initDownloadSelected(sc) {
        var rootCat = ".wpfd-content-default.wpfd-content-multi[data-category=" + sc + "]";
        $(document).on('click', rootCat + ' .default-download-selected', function () {
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
    default_initClick();

    default_hash = default_hash.replace('#', '');
    if (default_hash !== '' && default_hash.indexOf('-wpfd-') !== -1) {
        var hasha = default_hash.split('-');
        var re = new RegExp("^(p[0-9]+)$");
        var page = null;
        var stringpage = hasha.pop();

        if (re.test(stringpage)) {
            page = stringpage.replace('p', '');
        }

        var hash_category_id = hasha[1];
        var hash_sourcecat = hasha[0];

        if (hash_sourcecat.toString() === 'all_0' && parseInt(hash_category_id) === 0) {
            hash_category_id = 'all_0';
        }

        if (parseInt(hash_category_id) > 0 || hash_category_id === 'all_0') {
            if (hash_sourcecat.toString() !== 'all_0' && hash_category_id == 'all_0') {
                hash_category_id = 0;
            }
            setTimeout(function () {
                default_load(hash_sourcecat, hash_category_id, page);
            }, 100);
        }
    }

    function default_load(sourcecat, catid, page) {
        $(document).trigger('wpfd:category-loading');
        var pathname = window.location.href.replace(window.location.hash, '');
        var container = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]");
        var containerDefault = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-container-default");
        var empty_subcategories = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] #wpfd_is_empty_subcategories");
        var empty_files = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] #wpfd_is_empty_files");
        container.find('#current_category_' + sourcecat).val(catid);
        container.next('.wpfd-pagination').remove();

        containerDefault.empty();
        containerDefault.html($('#wpfd-loading-wrap').html());

        if (empty_subcategories.length) {
            empty_subcategories.val('1');
        }

        if (empty_files.length) {
            empty_files.val('1');
        }

        // Get categories
        var oldCategoryAjax = window.wpfdAjax[tree_source_cat].category;
        if (oldCategoryAjax !== null) {
            oldCategoryAjax.abort();
        }
        var categoryAjaxUrl = wpfdparams.wpfdajaxurl + "?action=wpfd&task=categories.display&view=categories&id=" + catid + "&top=" + sourcecat;
        window.wpfdAjax[tree_source_cat].category = $.ajax({
            url: wpfdparams.wpfdajaxurl + "?action=wpfd&task=categories.display&view=categories&id=" + catid + "&top=" + sourcecat,
            dataType: "json",
            cache: true,
            beforeSend: function () {
                if (container.find('.wpfd-form-search-file-category').length) {
                    container.find('.wpfd-form-search-file-category').remove();
                }

                if (wpfdDefaultCategoriesLocalCache.exist(categoryAjaxUrl)) {
                    var triggerCategories = wpfdDefaultCategoriesLocalCache.get(categoryAjaxUrl);
                    wpfdDefaultCategoriesLocalCacheTrigger(triggerCategories, sourcecat, page, pathname, catid, container, empty_subcategories);
                    return false;
                }
                return true;
            }
        }).done(function (categories) {
            wpfdDefaultCategoriesLocalCache.set(categoryAjaxUrl, categories);

            // Search file in category section
            var $displayFileSearch = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]").find('.wpfd_root_category_display_file_search');
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
                wpfdDefaultSearchFileCategoryHandle();
            }

            if (page !== null && page !== undefined) {
                window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-wpfd-' + categories.category.slug + '-p' + page);
            } else {
                window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-wpfd-' + categories.category.slug);
            }

            container.find('#current_category_slug_' + sourcecat).val(categories.category.slug);
            var sourcecategories = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-template-categories").html();
            if (sourcecategories) {
                var template = Handlebars.compile(sourcecategories);
                var html = template(categories);
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").prepend(html);
            }

            if (categories.category.breadcrumbs !== undefined) {
                if (sourcecat.toString() === 'all_0' && catid.toString() !== 'all_0' && parseInt(catid) !== 0) {
                    categories.category.breadcrumbs = allCategoriesDividerBreadcrumbs + categories.category.breadcrumbs;
                }
                $(".wpfd-content-multi[data-category=" + sourcecat + "] .breadcrumbs").html(categories.category.breadcrumbs);
            }
            for (var i = 0; i < categories.categories.length; i++) {
                cParents[categories.categories[i].term_id] = categories.categories[i];
            }

            default_breadcrum(sourcecat, catid, categories.category);
            default_initClick();

            if (tree.length) {
                var currentTree = container.find('.wpfd-foldertree-default');
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

            if ($(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default > .wpfd-password-form").length) {
                hideDownloadAllBtn(sourcecat, true);
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .default-download-category").attr('href', '#');
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdcategory").hide();
            }

            if (empty_subcategories.length) {
                empty_subcategories.val(categories.categories.length);
                fire_empty_category_message(sourcecat);
            }
        });
        var ordering = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_' + sourcecat).val();
        var orderingDirection = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_direction_' + sourcecat).val();

        var page_limit = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]").find('#page_limit_' + sourcecat).val();
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
        var oldFileAjax = window.wpfdAjax[tree_source_cat].file;
        var fileAjaxUrl = wpfdparams.wpfdajaxurl + params;
        if (oldFileAjax !== null) {
            oldFileAjax.abort();
        }
        window.wpfdAjax[tree_source_cat].file = $.ajax({
            url: fileAjaxUrl,
            dataType: "json",
            cache: true,
            beforeSend: function () {
                if (wpfdDefaultFilesLocalCache.exist(fileAjaxUrl)) {
                    var triggerFiles = wpfdDefaultFilesLocalCache.get(fileAjaxUrl);
                    wpfdDefaultFilesLocalCacheTrigger(triggerFiles, sourcecat, empty_files, fileAjaxUrl);
                    return false;
                }
                return true;
            }
        }).done(function (content) {
            // Set files local cache
            if (typeof (content.pagination) !== 'undefined' && content.pagination.length) {
                content.cache_pagination = content.pagination;
            }
            wpfdDefaultFilesLocalCache.set(fileAjaxUrl, content);

            if (typeof (content.categoryPassword) !== 'undefined' && content.categoryPassword.length) {
                hideDownloadAllBtn(sourcecat, true);
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .default-download-category").attr('href', '#');
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdcategory").hide();
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").empty();
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").append(content.categoryPassword);
            } else {
                if (content.files.length) {
                    $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .default-download-category").removeClass("display-download-category");
                } else {
                    $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .default-download-category").addClass("display-download-category");
                }

                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]").after(content.pagination);
                delete content.pagination;
                var sourcefiles = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-template-files").html();
                if (sourcefiles) {
                    var template = Handlebars.compile(sourcefiles);
                    var html = template(content);
                    html = $('<textarea/>').html(html).val();
                    $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").append(html);
                }

                if (typeof (content.filepasswords) !== 'undefined') {
                    $.each(content.filepasswords, function( file_id, pw_form ) {
                        $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").find('.file[data-id="' + file_id + '"]').empty();
                        $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").find('.file[data-id="' + file_id + '"]').addClass('wpfd-password-protection-form');
                        $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").find('.file[data-id="' + file_id + '"]').append(pw_form);
                    });
                }

                if (content.uploadform !== undefined && content.uploadform.length) {
                    var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                    upload_form_html += content.uploadform;
                    upload_form_html += '</div>';
                    $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").append(upload_form_html);

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
                            target: wpfdparams.wpfduploadajax + '?action=wpfd&task=files.upload&upload_from=front',
                            query: {
                                id_category: $(currentContainer).find('input[name=id_category]').val(),
                            },
                            fileParameterName: 'file_upload',
                            simultaneousUploads: 2,
                            maxFileSize: toMB(wpfdparams.maxFileSize),
                            maxFileSizeErrorCallback: function (file) {
                                bootbox.alert(file.name + ' ' + _wpfd_text('is too large, please upload file(s) less than ') + wpfdparams.maxFileSize + 'Mb!');
                            },
                            chunkSize: wpfdparams.serverUploadLimit - 50 * 1024, // Reduce 50KB to avoid error
                            forceChunkSize: true,
                            fileType: allowedExt,
                            fileTypeErrorCallback: function (file) {
                                bootbox.alert(file.name + ' cannot upload!<br/><br/>' + _wpfd_text('This type of file is not allowed to be uploaded. You can add new file types in the plugin configuration'));
                            },
                            generateUniqueIdentifier: function (file, event) {
                                var relativePath = file.webkitRelativePath || file.fileName || file.name;
                                var size = file.size;
                                var prefix = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                                return (prefix + size + '-' + relativePath.replace(/[^0-9a-zA-Z_-]/img, ''));
                            }
                        });

                        if (!uploader.support) {
                            bootbox.alert(_wpfd_text('Your browser does not support HTML5 file uploads!'));
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
                                        url: wpfd_var.wpfduploadajax + '?action=wpfd&task=files.upload',
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
                                    bootbox.alert('<div>' + response.datas.message + '</div>');
                                    return false;
                                }
                            }
                            if (typeof(response) === 'string') {
                                bootbox.alert('<div>' + response + '</div>');
                                return false;
                            }

                            if (response.response !== true) {
                                bootbox.alert(response.response);
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
                            var ajax_url = typeof (wpfdparams.wpfduploadajax) !== 'undefined' ? wpfdparams.wpfduploadajax : wpfd_var.wpfduploadajax;
                            $.ajax({
                                url: ajax_url + '?action=wpfd&task=files.wpfdPendingUploadFiles',
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
                                        if (wpfdDefaultFilesLocalCache.exist(fileAjaxUrl)) {
                                            wpfdDefaultFilesLocalCache.remove(fileAjaxUrl);
                                        }
                                        var sourcecat         = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
                                        var current_category  = currentContainer.parents('.wpfd-content.wpfd-content-multi').find('#current_category_' + sourcecat).val();

                                        default_load(sourcecat, current_category);
                                        return false;
                                    }
                                }
                            });
                        });

                        uploader.assignBrowse($(currentContainer).find('#upload_button'));
                        uploader.assignDrop($(currentContainer).find('.jsWpfdFrontUpload'));
                    }

                    var containers = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                    if (containers.length > 0) {
                        containers.each(function(i, el) {
                            initUploader($(el));
                        });
                    }
                }

                if (typeof wpfdColorboxInit !== 'undefined') {
                    wpfdColorboxInit();
                }

                wpfdTrackDownload();

                default_init_pagination($('.wpfd-content-default[data-category=' + sourcecat + '] + .wpfd-pagination'));
                wpfd_remove_loading($(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-container-default"));
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdSelectedFiles").remove();
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .default-download-selected").remove();
                hideDownloadAllBtn(sourcecat, false);
            }
            if (empty_files.length) {
                empty_files.val(content.files.length);
                fire_empty_category_message(sourcecat);
            }

            wpfdDefaultDisplayDownloadedFiles();
            wpfdDefaultDownloadFiles();
        });
        $(document).trigger('wpfd:category-loaded');
    }

    function default_breadcrum(sourcecat, catid, category) {
        var links = [];
        var current_Cat = cParents[catid];
        var defaultdownloadcategory = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .default-download-category");
        if (!current_Cat) {
            defaultdownloadcategory.attr('href', category.linkdownload_cat);
            return false;
        }
        links.unshift(current_Cat);
        if (current_Cat.parent !== 0) {
            while (cParents[current_Cat.parent]) {
                current_Cat = cParents[current_Cat.parent];
                links.unshift(current_Cat);
            }
        }

        var html = '';
        if (sourcecat.toString() === 'all_0' && catid.toString() !== 'all_0') {
            html = allCategoriesDividerBreadcrumbs;
        }
        for (var i = 0; i < links.length; i++) {
            if (links[i].parent.toString() === 'undefined') {
                continue;
            }
            if (i < links.length - 1) {
                html += '<li><a class="catlink" data-idcat="' + links[i].term_id + '" href="javascript:void(0)">';
                html += links[i].name + '</a><span class="divider"> &gt; </span></li>';
            } else {
                html += '<li><span>' + links[i].name + '</span></li>';
            }
        }

        $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-breadcrumbs-default li").remove();
        $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-breadcrumbs-default").append(html);
        defaultdownloadcategory.attr('href', category.linkdownload_cat);
    }

    if (tree.length) {
        tree.each(function () {
            var topCat = $(this).parents('.wpfd-content-default.wpfd-content-multi').data('category');
            $(this).jaofiletree({
                script: wpfdparams.wpfdajaxurl + 'task=categories.getCats',
                usecheckboxes: false,
                root: topCat,
                showroot: cParents[topCat].name,
                expanded: parseInt(wpfdparams.allow_category_tree_expanded) === 1 ? true : false,
                onclick: function (elem, file) {

                    var topCat = $(elem).parents('.wpfd-content-default.wpfd-content-multi').data('category');
                    if (topCat !== file) {
                        $('.directory', $(elem).parents('.wpfd-content-default.wpfd-content-multi')).each(function() {
                            if (!$(this).hasClass('selected') && $(this).find('> ul > li').length === 0) {
                                $(this).removeClass('expanded');
                            }
                        });

                        $(elem).parents('.directory').each(function () {
                            var $this = $(this);
                            var category = $this.find(' > a');
                            var parent = $this.find('.icon-open-close');
                            if (parent.length > 0) {
                                if (typeof cParents[category.data('file')] === 'undefined') {
                                    cParents[category.data('file')] = {
                                        parent: parent.data('parent_id'),
                                        term_id: category.data('file'),
                                        name: category.text()
                                    };
                                }
                            }
                        });

                    }

                    default_load(topCat, file);
                }
            });
        })

    }

    $('.wpfd-content-default + .wpfd-pagination').each(function (index, elm) {
        var $this = $(elm);
        default_init_pagination($this);
    });

    function default_init_pagination($this) {

        var number = $this.find('a:not(.current)');
        var wrap = $this.prev('.wpfd-content-default');
        var sourcecat = wrap.data('category');
        var current_category = wrap.find('#current_category_' + sourcecat).val();

        number.unbind('click').bind('click', function () {
            var page_number = $(this).attr('data-page');
            var current_sourcecat = $(this).attr('data-sourcecat');
            var wrap = $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]");
            var current_category = $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
            if (typeof page_number !== 'undefined') {
                var pathname = window.location.href.replace(window.location.hash, '');
                var category = $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
                var category_slug = $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_category_slug_' + current_sourcecat).val();
                var ordering = $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_ordering_' + current_sourcecat).val();
                var orderingDirection = $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_ordering_direction_' + current_sourcecat).val();
                var page_limit = $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#page_limit_' + current_sourcecat).val();

                window.history.pushState('', document.title, pathname + '#' + current_sourcecat + '-' + category + '-wpfd-' + category_slug + '-p' + page_number);

                $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-default:not(.wpfd-results .wpfd-container-default) .wpfd_list").remove();
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-default:not(.wpfd-results .wpfd-container-default)").append($('#wpfd-loading-wrap').html());

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
                    var sourcefiles = $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-template-files:not(.wpfd-results .wpfd-template-files)").html();
                    var template = Handlebars.compile(sourcefiles);
                    var html = template(content);

                    if ($(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-default:not(.wpfd-results .wpfd-container-default) .wpfd-upload-form").length) {
                        $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-default:not(.wpfd-results .wpfd-container-default) .wpfd-upload-form").before(html);
                    } else {
                        $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-default:not(.wpfd-results .wpfd-container-default)").append(html);
                    }

                    // File password security
                    if (typeof (content.filepasswords) !== 'undefined') {
                        $.each(content.filepasswords, function( file_id, pw_form ) {
                            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").find('.file[data-id="' + file_id + '"]').empty();
                            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").find('.file[data-id="' + file_id + '"]').addClass('wpfd-password-protection-form');
                            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").find('.file[data-id="' + file_id + '"]').append(pw_form);
                        });
                    }

                    if (typeof wpfdColorboxInit !== 'undefined') {
                        wpfdColorboxInit();
                    }
                    default_init_pagination(wrap.next('.wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-default:not(.wpfd-results .wpfd-container-default)"));
                    wpfdDefaultDisplayDownloadedFiles();
                    wpfdDefaultDownloadFiles();
                });
            }
        });
    }

    function wpfd_container_with_foldertree() {
        $('.wpfd-content-default .wpfd-container').each(function () {
            if($(this).children('.with_foldertree').length > 0) {
                $(this).addClass('wpfd_dfcontainer_foldertree');
            } else {
                if($(this).hasClass('wpfd_dfcontainer_foldertree')) {
                    $(this).removeClass('wpfd_dfcontainer_foldertree');
                }
            }
        });

        //parent-content
        $('.wpfd-content-default').each(function () {
            if($(this).children().has('.wpfd-foldertree').length > 0) {
                $(this).addClass('wpfd_contentdefault_foldertree');
            } else {
                if($(this).hasClass('wpfd_contentdefault_foldertree')) {
                    $(this).removeClass('wpfd_contentdefault_foldertree');
                }
            }
        });
    }

    wpfd_container_with_foldertree();

    function fire_empty_category_message(category_id) {
        if (!category_id) {
            return;
        }
        var root_category = '.wpfd-content-default.wpfd-content-multi[data-category=' + category_id + ']';
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
        $(root_category).find('.wpfd-container-default').append(code);
    }

    var destroy_upload = $('.wpfd-upload-form.destroy');
    if (destroy_upload.length) {
        destroy_upload.remove();
    }

    // Local categories cache trigger
    function wpfdDefaultCategoriesLocalCacheTrigger(triggerCategories, sourcecat, page, pathname, catid, container, empty_subcategories) {
        var $displayFileSearch = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]").find('.wpfd_root_category_display_file_search');
        if ($displayFileSearch.length) {
            var $themeName = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]").find('.wpfd_root_category_theme').val();

            if (typeof (triggerCategories.category.correctConvertCategoryId) === 'undefined') {
                triggerCategories.category.correctConvertCategoryId = 0;
            }

            var $searchContent = '<form action="" id="adminForm-'+ triggerCategories.category.term_id +'" class="wpfd-adminForm wpfd-form-search-file-category" name="adminForm" method="post">' +
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
                '<input type="hidden" id="filter_catid" class="chzn-select filter_catid" name="catid" value="'+ triggerCategories.category.correctConvertCategoryId +'" data-cattype="" data-slug="" />' +
                '<input type="hidden" name="theme" value="'+ $themeName +'">' +
                '<input type="hidden" name="limit" value="15">' +
                '<div id="wpfd-results" class="wpfd-results list-results"></div>' +
                '</div>' +
                '</form>';

            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]").prepend($searchContent);
            wpfdDefaultSearchFileCategoryHandle();
        }

        if (page !== null && page !== undefined) {
            window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-wpfd-' + triggerCategories.category.slug + '-p' + page);
        } else {
            window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-wpfd-' + triggerCategories.category.slug);
        }

        container.find('#current_category_slug_' + sourcecat).val(triggerCategories.category.slug);
        var sourcecategories = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-template-categories").html();
        if (sourcecategories) {
            var template = Handlebars.compile(sourcecategories);
            var html = template(triggerCategories);
            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").prepend(html);
        }
        if (triggerCategories.category.breadcrumbs !== undefined) {
            $(".wpfd-content-multi[data-category=" + sourcecat + "] .breadcrumbs").html(triggerCategories.category.breadcrumbs);
        }
        for (var i = 0; i < triggerCategories.categories.length; i++) {
            cParents[triggerCategories.categories[i].term_id] = triggerCategories.categories[i];
        }

        default_breadcrum(sourcecat, catid, triggerCategories.category);
        default_initClick();

        if (tree.length) {
            var currentTree = container.find('.wpfd-foldertree-default');
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

        if ($(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default > .wpfd-password-form").length) {
            hideDownloadAllBtn(sourcecat, true);
            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .default-download-category").attr('href', '#');
            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdcategory").hide();
        }

        if (empty_subcategories.length) {
            empty_subcategories.val(triggerCategories.categories.length);
            fire_empty_category_message(sourcecat);
        }
    }

    // Local files cache trigger
    function wpfdDefaultFilesLocalCacheTrigger(triggerFiles, sourcecat, empty_files, fileAjaxUrl) {
        if (typeof (triggerFiles.categoryPassword) !== 'undefined' && triggerFiles.categoryPassword.length) {
            hideDownloadAllBtn(sourcecat, true);
            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .default-download-category").attr('href', '#');
            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdcategory").hide();
            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").empty();
            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").append(triggerFiles.categoryPassword);
        } else {
            if (triggerFiles.files.length) {
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .default-download-category").removeClass("display-download-category");
            } else {
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .default-download-category").addClass("display-download-category");
            }

            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]").after(triggerFiles.cache_pagination);
            var sourcefiles = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-template-files").html();
            var template = Handlebars.compile(sourcefiles);
            var html = template(triggerFiles);
            html = $('<textarea/>').html(html).val();
            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").append(html);

            if (typeof (triggerFiles.filepasswords) !== 'undefined') {
                $.each(triggerFiles.filepasswords, function( file_id, pw_form ) {
                    $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").find('.file[data-id="' + file_id + '"]').empty();
                    $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").find('.file[data-id="' + file_id + '"]').addClass('wpfd-password-protection-form');
                    $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").find('.file[data-id="' + file_id + '"]').append(pw_form);
                });
            }

            if (triggerFiles.uploadform !== undefined && triggerFiles.uploadform.length) {
                var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                upload_form_html += triggerFiles.uploadform;
                upload_form_html += '</div>';
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-container-default").append(upload_form_html);

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
                        target: wpfdparams.wpfduploadajax + '?action=wpfd&task=files.upload&upload_from=front',
                        query: {
                            id_category: $(currentContainer).find('input[name=id_category]').val(),
                        },
                        fileParameterName: 'file_upload',
                        simultaneousUploads: 2,
                        maxFileSize: toMB(wpfdparams.maxFileSize),
                        maxFileSizeErrorCallback: function (file) {
                            bootbox.alert(file.name + ' ' + _wpfd_text('is too large, please upload file(s) less than ') + wpfdparams.maxFileSize + 'Mb!');
                        },
                        chunkSize: wpfdparams.serverUploadLimit - 50 * 1024, // Reduce 50KB to avoid error
                        forceChunkSize: true,
                        fileType: allowedExt,
                        fileTypeErrorCallback: function (file) {
                            bootbox.alert(file.name + ' cannot upload!<br/><br/>' + _wpfd_text('This type of file is not allowed to be uploaded. You can add new file types in the plugin configuration'));
                        },
                        generateUniqueIdentifier: function (file, event) {
                            var relativePath = file.webkitRelativePath || file.fileName || file.name;
                            var size = file.size;
                            var prefix = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                            return (prefix + size + '-' + relativePath.replace(/[^0-9a-zA-Z_-]/img, ''));
                        }
                    });

                    if (!uploader.support) {
                        bootbox.alert(_wpfd_text('Your browser does not support HTML5 file uploads!'));
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
                                    url: wpfd_var.wpfduploadajax + '?action=wpfd&task=files.upload',
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
                                bootbox.alert('<div>' + response.datas.message + '</div>');
                                return false;
                            }
                        }
                        if (typeof(response) === 'string') {
                            bootbox.alert('<div>' + response + '</div>');
                            return false;
                        }

                        if (response.response !== true) {
                            bootbox.alert(response.response);
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
                        var ajax_url = typeof (wpfdparams.wpfduploadajax) !== 'undefined' ? wpfdparams.wpfduploadajax : wpfd_var.wpfduploadajax;
                        $.ajax({
                            url: ajax_url + '?action=wpfd&task=files.wpfdPendingUploadFiles',
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
                                    if (wpfdDefaultFilesLocalCache.exist(fileAjaxUrl)) {
                                        wpfdDefaultFilesLocalCache.remove(fileAjaxUrl);
                                    }
                                    var sourcecat         = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
                                    var current_category  = currentContainer.parents('.wpfd-content.wpfd-content-multi').find('#current_category_' + sourcecat).val();

                                    default_load(sourcecat, current_category);
                                    return false;
                                }
                            }
                        });
                    });

                    uploader.assignBrowse($(currentContainer).find('#upload_button'));
                    uploader.assignDrop($(currentContainer).find('.jsWpfdFrontUpload'));
                };

                var containers = $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                if (containers.length > 0) {
                    containers.each(function(i, el) {
                        initUploader($(el));
                    });
                }
            }

            if (typeof wpfdColorboxInit !== 'undefined') {
                wpfdColorboxInit();
            }

            wpfdTrackDownload();

            default_init_pagination($('.wpfd-content-default[data-category=' + sourcecat + '] + .wpfd-pagination'));
            wpfd_remove_loading($(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-container-default"));
            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdSelectedFiles").remove();
            $(".wpfd-content-default.wpfd-content-multi[data-category=" + sourcecat + "] .default-download-selected").remove();
            hideDownloadAllBtn(sourcecat, false);
        }
        if (empty_files.length) {
            empty_files.val(triggerFiles.files.length);
            fire_empty_category_message(sourcecat);
        }

        wpfdDefaultDisplayDownloadedFiles();
        wpfdDefaultDownloadFiles();
    }

    // Search file category
    function wpfdDefaultCategoryAjaxSearch(element, ordering, direction, pushState = true) {
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
                $(element).find(".wpfd-results .wpfd-container-default").addClass('wpfd-container-default-search');
                if ($(element).find(".wpfd-results .wpfd-form-search-file-category").length) {
                    $(element).find(".wpfd-results .wpfd-form-search-file-category").remove();
                }
                wpfdDefaultInitSorting();
                if (typeof wpfdColorboxInit !== 'undefined') {
                    wpfdColorboxInit();
                }
            }
        });
    }

    // Sort initial
    function wpfdDefaultInitSorting() {
        jQuery('.orderingCol').click(function (e) {
            e.preventDefault();
            var ordering = jQuery(this).data('ordering');
            var direction = jQuery(this).data('direction');
            wpfdDefaultCategoryAjaxSearch(ordering, direction);
        });

        jQuery(".list-results #limit").change(function (e) {
            e.preventDefault();
            jQuery('input[name="limit"]').val(jQuery(this).val());
            var formID = '#' + jQuery(this).closest('form').attr('id');
            wpfdDefaultCategoryAjaxSearch(formID);
            return false;
        });
    }

    function wpfdDefaultSearchFileCategoryHandle() {
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
                wpfdDefaultCategoryAjaxSearch(formID);

                return;
            }
        });

        // Ajax filters
        $(".wpfd-content .btnsearchbelow").on('click', function (e) {
            e.preventDefault();
            var formID = '#' + $(this).closest('form').attr('id');
            wpfdDefaultCategoryAjaxSearch(formID);
            return false;
        });
    }
    wpfdDefaultSearchFileCategoryHandle();

    function wpfdDefaultDisplayDownloadedFiles() {
        var fileDownload = $('.wpfd-content.wpfd-content-default .file');
        var linkDownload = $('.wpfd-content.wpfd-content-default .wpfd_downloadlink');
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
    wpfdDefaultDisplayDownloadedFiles();

    function wpfdDefaultDownloadFiles() {
        $('.file.png .wpfd_downloadlink, .file.jpg .wpfd_downloadlink, .file.jpeg .wpfd_downloadlink, .file.gif .wpfd_downloadlink').on('click', function (event) {
            event.preventDefault();
            var fileId = $(this).parents('.file').data('id');
            var categoryId = $(this).parents('.file').data('catid');
            var cloudType = $(this).parents('.wpfd-content-default').find('.wpfd_root_category_type').val();

            if (!fileId || !categoryId) {
                return false;
            }

            window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
        });
    }
    wpfdDefaultDownloadFiles();
});

// Default categories local cache
var wpfdDefaultCategoriesLocalCache = {
    data: {},
    remove: function (url) {
        delete wpfdDefaultCategoriesLocalCache.data[url];
    },
    exist: function (url) {
        return wpfdDefaultCategoriesLocalCache.data.hasOwnProperty(url) && wpfdDefaultCategoriesLocalCache.data[url] !== null;
    },
    get: function (url) {
        return wpfdDefaultCategoriesLocalCache.data[url];
    },
    set: function (url, cachedData) {
        wpfdDefaultCategoriesLocalCache.remove(url);
        wpfdDefaultCategoriesLocalCache.data[url] = cachedData;
    }
};

// Default files local cache
var wpfdDefaultFilesLocalCache = {
    data: {},
    remove: function (url) {
        delete wpfdDefaultFilesLocalCache.data[url];
    },
    exist: function (url) {
        return wpfdDefaultFilesLocalCache.data.hasOwnProperty(url) && wpfdDefaultFilesLocalCache.data[url] !== null;
    },
    get: function (url) {
        return wpfdDefaultFilesLocalCache.data[url];
    },
    set: function(url, cachedData) {
        wpfdDefaultFilesLocalCache.remove(url);
        wpfdDefaultFilesLocalCache.data[url] = cachedData;
    }
};