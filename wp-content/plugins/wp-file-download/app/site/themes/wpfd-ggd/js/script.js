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
    var sourcefile = $("#wpfd-template-ggd-box").html();
    var gdd_hash = window.location.hash;
    var ggd_cParents = {};
    var ggd_tree = $('.wpfd-foldertree-ggd');
    var ggd_root_cat = $('.wpfd-content-ggd').data('category');
    var allCategoriesBreadcrumbs = '<li><a class="catlink" data-idcat="all_0" href="javascript:void(0);">' + wpfdparams.translates.wpfd_all_categories + '</a></li>';
    var allCategoriesDividerBreadcrumbs = '<li><a class="catlink" data-idcat="all_0" href="javascript:void(0);">' + wpfdparams.translates.wpfd_all_categories + '</a><span class="divider"> &gt; </span></li>';
    if (window.wpfdAjax === undefined) {
        window.wpfdAjax = {};
    }
    window.wpfdAjax[ggd_root_cat] = {category: null, file: null};
    $(".wpfd-content-ggd").each(function () {
        var ggd_topCat = $(this).data('category');
        if (ggd_topCat == 'all_0') {
            ggd_cParents[ggd_topCat] = {parent: 0, term_id: 0, name: $(this).find("h2").text()};
        } else {
            ggd_cParents[ggd_topCat] = {parent: 0, term_id: ggd_topCat, name: $(this).find("h2").text()};
        }

        $(this).find(".wpfdcategory.catlink").each(function () {
            var tempidCat = $(this).data('idcat');
            ggd_cParents[tempidCat] = {parent: ggd_topCat, term_id: tempidCat, name: $(this).text()};
        });
        initInputSelected(ggd_topCat);
        initDownloadSelected(ggd_topCat);
    });

    Handlebars.registerHelper('bytesToSize', function (bytes) {
        if (typeof bytes === "undefined") {
            return 'n/a';
        }

        return bytes.toString().toLowerCase() === 'n/a' ? bytes : bytesToSize(bytes);
    });

    initClickFile();

    function ggd_initClick() {
        $('.wpfd-content-ggd .catlink').unbind('click').click(function (e) {
            e.preventDefault();
            load($(this).parents('.wpfd-content-ggd').data('category'), $(this).data('idcat'));
        });
    }

    function initInputSelected(sc) {
        $(document).on('change', ".wpfd-content-ggd.wpfd-content-multi[data-category=" + sc + "] input.cbox_file_download", function (e) {
            e.stopPropagation();
            var rootCat = ".wpfd-content-ggd.wpfd-content-multi[data-category=" + sc + "]";
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
                $(rootCat + " .ggd-download-selected").remove();
                var downloadSelectedBtn = $('<a href="javascript:void(0);" class="ggd-download-selected" style="display: block;">' + wpfdparams.translates.download_selected + '<i class="zmdi zmdi-check-all wpfd-download-category"></i></a>');
                downloadSelectedBtn.insertAfter($(rootCat).find(" #current_category_slug_" + sc));
            } else {
                $(rootCat + " .wpfdSelectedFiles").remove();
                $(rootCat + " .ggd-download-selected").remove();
                hideDownloadAllBtn(sc, false);
            }
            gdd_init_pagination($(rootCat).next(".wpfd-pagination"));
        });
    }

    function hideDownloadAllBtn(sc, hide) {
        var rootCat = ".wpfd-content-ggd.wpfd-content-multi[data-category=" + sc + "]";
        var downloadCatButton = $(rootCat + " .ggd-download-category");
        if (downloadCatButton.length === 0 || downloadCatButton.hasClass('display-download-category')) {
            return;
        }
        if (hide) {
            $(rootCat + " .ggd-download-category").hide();
        } else {
            $(rootCat + " .ggd-download-category").show();
        }
    }

    function initDownloadSelected(sc) {
        var rootCat = ".wpfd-content-ggd.wpfd-content-multi[data-category=" + sc + "]";
        $(document).on('click', rootCat + ' .ggd-download-selected', function () {
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
    ggd_initClick();


    gdd_hash = gdd_hash.replace('#', '');
    if (gdd_hash !== '') {
        var hasha = gdd_hash.split('-');
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
                url: wpfdparams.wpfdajaxurl + "task=file.display&view=file&id=" + fileid + "&categoryid=" + categoryid + "&rootcat=" + ggd_root_cat,
                dataType: "json",
                beforeSend: function() {
                    // setting a timeout
                    if($('body').has('wpfd-ggd-box-loader') !== true) {
                        $('body').append('<div class="wpfd-ggd-box-loader"></div>');
                    }
                }
            }).done(function (file) {
                var template = Handlebars.compile(sourcefile);
                var html = template(file);
                var box = $("#wpfd-ggd-box");
                $('.wpfd-ggd-box-loader').each(function () {
                    $(this).remove();
                });
                if (box.length === 0) {
                    $('body').append('<div id="wpfd-ggd-box" style="display: none;"></div>');
                    box = $("#wpfd-ggd-box");
                }
                box.empty();
                box.prepend(html);
                box.attr('data-id', fileid);
                box.attr('data-catid', categoryid);
                box.attr('class', 'wpfd-ggd-box wpfd-download-box');
                if (typeof (file.file.ext) !== 'undefined') {
                    box.attr('data-type', file.file.ext);
                }
                box.click(function (e) {
                    if ($(e.target).is('#wpfd-ggd-box')) {
                        box.hide();
                    }
                    $('#wpfd-ggd-box').unbind('click.box').bind('click.box', function (e) {
                        if ($(e.target).is('#wpfd-ggd-box')) {
                            box.hide();
                        }
                    });
                });

                if (typeof (file.file.linkdownload) !== 'undefined') {
                    var previewLinkDownload = '<input type="hidden" class="wpfd_file_preview_link_download" value="'+ file.file.linkdownload +'" data-filetitle="'+ file.file.post_title +'" />';
                    box.prepend(previewLinkDownload);
                }

                $('#wpfd-ggd-box .wpfd-close').click(function (e) {
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

                $('body.elementor-default #wpfd-ggd-box a.wpfd_downloadlink').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var link = $(this).attr('href');
                    window.location.href = link;
                });

                wpfdGgdDisplayDownloadedFiles();
                wpfdGgdDownloadFiles();
            });
        });
    }

    function load(sourcecat, catid, page) {
        $(document).trigger('wpfd:category-loading');
        var pathname = window.location.href.replace(window.location.hash, '');
        var container = $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]");
        var ggd_empty_subcategories = $(".wpfd-content-ggd[data-category=" + sourcecat + "] #wpfd_is_empty_subcategories");
        var ggd_empty_files = $(".wpfd-content-ggd[data-category=" + sourcecat + "] #wpfd_is_empty_files");
        container.find('#current_category_' + sourcecat).val(catid);
        container.next('.wpfd-pagination').remove();
        $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").empty();
        $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").html($('#wpfd-loading-wrap').html());

        if (ggd_empty_subcategories.length) {
            ggd_empty_subcategories.val('1');
        }

        if (ggd_empty_files.length) {
            ggd_empty_files.val('1');
        }

        //Get categories
        var oldCategoryAjax = window.wpfdAjax[ggd_root_cat].category;
        var categoryAjaxUrl = wpfdparams.wpfdajaxurl + "task=categories.display&view=categories&id=" + catid + "&top=" + sourcecat;
        if (oldCategoryAjax !== null) {
            oldCategoryAjax.abort();
        }
        window.wpfdAjax[ggd_root_cat].category = $.ajax({
            url: categoryAjaxUrl,
            dataType: "json",
            cache: true,
            beforeSend: function () {
                if (container.find('.wpfd-form-search-file-category').length) {
                    container.find('.wpfd-form-search-file-category').remove();
                }

                if (wpfdGgdCategoriesLocalCache.exist(categoryAjaxUrl)) {
                    var triggerCategories = wpfdGgdCategoriesLocalCache.get(categoryAjaxUrl);
                    wpfdGgdCategoriesLocalCacheTrigger(triggerCategories, sourcecat, page, pathname, catid, container, ggd_empty_subcategories);
                    return false;
                }
                return true;
            }
        }).done(function (categories) {
            // Store categories local cache
            wpfdGgdCategoriesLocalCache.set(categoryAjaxUrl, categories);

            // Search file in category section
            var $displayFileSearch = $(".wpfd-content-ggd[data-category=" + sourcecat + "]").find('.wpfd_root_category_display_file_search');
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
                wpfdGgdSearchFileCategoryHandle();
            }

            if (page !== null && page !== undefined) {
                window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-' + categories.category.slug + '-p' + page);
            } else {
                window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-' + categories.category.slug);
            }

            container.find('#current_category_slug_' + sourcecat).val(categories.category.slug);
            var sourcecategories = $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-template-categories").html();
            if (sourcecategories) {
                var template = Handlebars.compile(sourcecategories);
                var html = template(categories);
                if ($(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-categories").length) {
                    $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-categories").remove();
                }
                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").prepend(html);
            }
            if (categories.category.breadcrumbs !== undefined) {
                if (sourcecat.toString() === 'all_0' && catid.toString() !== 'all_0' && parseInt(catid) !== 0) {
                    categories.category.breadcrumbs = allCategoriesDividerBreadcrumbs + categories.category.breadcrumbs;
                }
                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .breadcrumbs").html(categories.category.breadcrumbs);
            }
            for (var i = 0; i < categories.categories.length; i++) {
                ggd_cParents[categories.categories[i].term_id] = categories.categories[i];
            }

            ggd_breadcrum(sourcecat, catid, categories.category);
            ggd_initClick();
            if (ggd_tree.length) {
                var currentTree = container.find('.wpfd-foldertree-ggd');
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

            if ($(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd > .wpfd-password-form").length) {
                hideDownloadAllBtn(sourcecat, true);
                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .ggd-download-category").attr('href', '#');
                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfdcategory").hide();
            }

            if (ggd_empty_subcategories.length) {
                ggd_empty_subcategories.val(categories.categories.length);
                wpfd_ggd_fire_empty_category_message(sourcecat);
            }
        });
        var ordering = $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_' + sourcecat).val();
        var orderingDirection = $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_direction_' + sourcecat).val();
        var page_limit = $(".wpfd-content-ggd[data-category=" + sourcecat + "]").find('#page_limit_' + sourcecat).val();
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
        var oldFileAjax = window.wpfdAjax[ggd_root_cat].file;
        var fileAjaxUrl = wpfdparams.wpfdajaxurl + params;
        if (oldFileAjax !== null) {
            oldFileAjax.abort();
        }
        window.wpfdAjax[ggd_root_cat].file = $.ajax({
            url: fileAjaxUrl,
            dataType: "json",
            cache: true,
            beforeSend: function () {
                if (wpfdGgdFilesLocalCache.exist(fileAjaxUrl)) {
                    var triggerFiles = wpfdGgdFilesLocalCache.get(fileAjaxUrl);
                    wpfdGgdFilesLocalCacheTrigger(triggerFiles, sourcecat, ggd_empty_files, fileAjaxUrl);

                    return false;
                }

                return true;
            }
        }).done(function (content) {

            // Set files local cache
            if (typeof (content.pagination) !== 'undefined' && content.pagination.length) {
                content.cache_pagination = content.pagination;
            }
            wpfdGgdFilesLocalCache.set(fileAjaxUrl, content);

            if (typeof (content.categoryPassword) !== 'undefined' && content.categoryPassword.length) {
                hideDownloadAllBtn(sourcecat, true);
                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .ggd-download-category").attr('href', '#');
                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfdcategory").hide();
                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").empty();
                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").append(content.categoryPassword);
            } else {
                if (content.files.length) {
                    $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]  .ggd-download-category").removeClass("display-download-category");
                } else {
                    $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]  .ggd-download-category").addClass("display-download-category");
                }

                if (sourcecat.toString() === 'all_0') {
                    $(".wpfd-content-ggd[data-category=" + sourcecat + "]").parent().find('.wpfd-pagination').remove();
                }

                $(".wpfd-content-ggd[data-category=" + sourcecat + "]").after(content.pagination);
                delete content.pagination;
                var sourcefiles = $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-template-files").html();
                var template = Handlebars.compile(sourcefiles);
                var html = template(content);
                html = $('<textarea/>').html(html).val();
                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").append(html);

                if (typeof (content.filepasswords) !== 'undefined') {
                    $.each(content.filepasswords, function( file_id, pw_form ) {
                        var protected_file = $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").find('.wpfd-file-link[data-id="' + file_id + '"]').parent();
                        protected_file.empty();
                        protected_file.addClass('wpfd-password-protection-form');
                        protected_file.append(pw_form);
                    });
                }

                if (content.uploadform !== undefined && content.uploadform.length) {
                    var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                    upload_form_html += content.uploadform;
                    upload_form_html += '</div>';
                    $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").append(upload_form_html);

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
                                        if (wpfdGgdFilesLocalCache.exist(fileAjaxUrl)) {
                                            wpfdGgdFilesLocalCache.remove(fileAjaxUrl);
                                        }
                                        var ggd_sourcecat     = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
                                        var current_category  = currentContainer.parents('.wpfd-content.wpfd-content-multi').find('#current_category_' + ggd_sourcecat).val();
                                        load(ggd_sourcecat, current_category);
                                    }
                                }
                            });
                        });

                        uploader.assignBrowse($(currentContainer).find('#upload_button'));
                        uploader.assignDrop($(currentContainer).find('.jsWpfdFrontUpload'));
                    }

                    var containers = $(".wpfd-content-ggd[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                    if (containers.length > 0) {
                        containers.each(function(i, el) {
                            initUploader($(el));
                        });
                    }
                }

                initClickFile();

                gdd_init_pagination($('.wpfd-content-ggd[data-category=' + sourcecat + '] + .wpfd-pagination'));

                wpfd_remove_loading($(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd"));
                $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdSelectedFiles").remove();
                $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "] .ggd-download-selected").remove();
                hideDownloadAllBtn(sourcecat, false);

                if (ggd_empty_files.length) {
                    ggd_empty_files.val(content.files.length);
                    wpfd_ggd_fire_empty_category_message(sourcecat);
                }

                wpfdGgdDisplayDownloadedFiles();
                wpfdGgdDownloadFiles();
            }
        });

        $(document).trigger('wpfd:category-loaded');
    }

    function ggd_breadcrum(ggd_topCat, catid, category) {
        var links = [];
        var current_Cat = ggd_cParents[catid];
        if (!current_Cat) {
            $(".wpfd-content-ggd[data-category=" + ggd_topCat + "] .ggd-download-category").attr('href', category.linkdownload_cat);
            return false;
        }
        links.unshift(current_Cat);
        if (current_Cat.parent !== 0) {
            while (ggd_cParents[current_Cat.parent]) {
                current_Cat = ggd_cParents[current_Cat.parent];
                links.unshift(current_Cat);
            }
        }

        var html = '';

        if (ggd_topCat.toString() === 'all_0' && catid.toString() !== 'all_0' && parseInt(catid) !== 0) {
            html = allCategoriesDividerBreadcrumbs;
        }

        for (var i = 0; i < links.length; i++) {
            if (parseInt(links[i].term_id) === 0) {
                continue;
            }

            if (i < links.length - 1) {
                html += '<li><a class="catlink" data-idcat="' + links[i].term_id + '" href="javascript:void(0)">';
                html += links[i].name + '</a><span class="divider"> &gt; </span></li>';
            } else {
                html += '<li><span>' + links[i].name + '</span></li>';
            }
        }

        $(".wpfd-content-ggd[data-category=" + ggd_topCat + "] .wpfd-breadcrumbs-ggd li").remove();
        $(".wpfd-content-ggd[data-category=" + ggd_topCat + "] .wpfd-breadcrumbs-ggd").append(html);

        $(".wpfd-content-ggd[data-category=" + ggd_topCat + "] .catlink").click(function (e) {
            e.preventDefault();
            load(ggd_topCat, $(this).data('idcat'));
            initClickFile();
        });
        $(".wpfd-content-ggd[data-category=" + ggd_topCat + "] .ggd-download-category").attr('href', category.linkdownload_cat);
    }

    if (ggd_tree.length) {
        ggd_tree.each(function () {
            var ggd_topCat = $(this).parents('.wpfd-content-ggd.wpfd-content-multi').data('category');
            $(this).jaofiletree({
                script: wpfdparams.wpfdajaxurl + 'task=categories.getCats',
                usecheckboxes: false,
                root: ggd_topCat,
                showroot: ggd_cParents[ggd_topCat].name,
                expanded: parseInt(wpfdparams.allow_category_tree_expanded) === 1 ? true : false,
                onclick: function (elem, file) {
                    var ggd_topCat = $(elem).parents('.wpfd-content-ggd.wpfd-content-multi').data('category');
                    if (ggd_topCat !== file) {
                        $('.directory', $(elem).parents('.wpfd-content-ggd.wpfd-content-multi')).each(function() {
                            if (!$(this).hasClass('selected') && $(this).find('> ul > li').length === 0) {
                                $(this).removeClass('expanded');
                            }
                        });

                        $(elem).parents('.directory').each(function () {
                            var $this = $(this);
                            var category = $this.find(' > a');
                            var parent = $this.find('.icon-open-close');
                            if (parent.length > 0) {
                                if (typeof ggd_cParents[category.data('file')] === 'undefined') {
                                    ggd_cParents[category.data('file')] = {
                                        parent: parent.data('parent_id'),
                                        term_id: category.data('file'),
                                        name: category.text()
                                    };
                                }
                            }
                        });

                    }

                    load(ggd_topCat, file);
                }
            });
        })
    }

    $('.wpfd-content-ggd + .wpfd-pagination').each(function (index, elm) {
        var $this = $(elm);
        gdd_init_pagination($this);
    });

    function gdd_init_pagination($this) {

        var number = $this.find(':not(.current)');

        var wrap = $this.prev('.wpfd-content-ggd');

        var sourcecat = wrap.data('category');
        var current_category = wrap.find('#current_category_' + sourcecat).val();

        number.unbind('click').bind('click', function () {
            var page_number = $(this).attr('data-page');
            var current_sourcecat = $(this).attr('data-sourcecat');
            var wrap = $(".wpfd-content-ggd[data-category=" + current_sourcecat + "]");
            var current_category = $(".wpfd-content-ggd[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
            if (typeof page_number !== 'undefined') {
                var pathname = window.location.href.replace(window.location.hash, '');
                var category = $(".wpfd-content-ggd[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
                var category_slug = $(".wpfd-content-ggd[data-category=" + current_sourcecat + "]").find('#current_category_slug_' + current_sourcecat).val();
                var ordering = $(".wpfd-content-ggd[data-category=" + current_sourcecat + "]").find('#current_ordering_' + current_sourcecat).val();
                var orderingDirection = $(".wpfd-content-ggd[data-category=" + current_sourcecat + "]").find('#current_ordering_direction_' + current_sourcecat).val();
                var page_limit = $(".wpfd-content-ggd[data-category=" + current_sourcecat + "]").find('#page_limit_' + current_sourcecat).val();
                window.history.pushState('', document.title, pathname + '#' + current_sourcecat + '-' + category + '-' + category_slug + '-p' + page_number);

                $(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd:not(.wpfd-results .wpfd-container-ggd) .wpfd_list").remove();
                $(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd:not(.wpfd-results .wpfd-container-ggd)").append($('#wpfd-loading-wrap').html());

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
                    var sourcefiles = $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-template-files:not(.wpfd-results .wpfd-template-files)").html();
                    var template = Handlebars.compile(sourcefiles);
                    var html = template(content);

                    if ($(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd:not(.wpfd-results .wpfd-container-ggd) .wpfd-upload-form").length) {
                        $(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd:not(.wpfd-results .wpfd-container-ggd) .wpfd-upload-form").before(html);
                    } else {
                        $(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd:not(.wpfd-results .wpfd-container-ggd)").append(html);
                    }

                    // File password security
                    if (typeof (content.filepasswords) !== 'undefined') {
                        $.each(content.filepasswords, function( file_id, pw_form ) {
                            var protected_file = $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").find('.wpfd-file-link[data-id="' + file_id + '"]').parent();
                            protected_file.empty();
                            protected_file.addClass('wpfd-password-protection-form');
                            protected_file.append(pw_form);
                        });
                    }

                    initClickFile();
                    gdd_init_pagination(wrap.next('.wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd:not(.wpfd-results .wpfd-container-ggd)"));
                    wpfdGgdDisplayDownloadedFiles();
                    wpfdGgdDownloadFiles();
                });
            }
        });

    }

    function wpfd_ggd_container_with_foldertree() {
        $('.wpfd-content-ggd .wpfd-container').each(function () {
            if($(this).children('.with_foldertree').length > 0) {
                $(this).addClass('wpfd_ggdcontainer_foldertree');
            } else {
                if($(this).hasClass('wpfd_ggdcontainer_foldertree')) {
                    $(this).removeClass('wpfd_ggdcontainer_foldertree');
                }
            }
        });

        //parent-content
        $('.wpfd-content-ggd').each(function () {
            if($(this).children().has('.wpfd-foldertree').length > 0) {
                $(this).addClass('wpfdcontent_ggd_folder_tree');
            } else {
                if($(this).hasClass('wpfdcontent_ggd_folder_tree')) {
                    $(this).removeClass('wpfdcontent_ggd_folder_tree');
                }
            }
        });
    }

    wpfd_ggd_container_with_foldertree();

    function wpfd_ggd_fire_empty_category_message(category_id) {
        if (!category_id) {
            return;
        }
        var root_category = '.wpfd-content-ggd.wpfd-content-multi[data-category=' + category_id + ']';
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
        $(root_category).find('.wpfd-container-ggd').append(code);
    }

    var destroy_upload = $('.wpfd-upload-form.destroy');
    if (destroy_upload.length) {
        destroy_upload.remove();
    }

    // Ggd categories local cache trigger
    function wpfdGgdCategoriesLocalCacheTrigger(triggerCategories, sourcecat, page, pathname, catid, container, ggd_empty_subcategories) {
        var $displayFileSearch = $(".wpfd-content-ggd[data-category=" + sourcecat + "]").find('.wpfd_root_category_display_file_search');

        if (typeof (triggerCategories.category.correctConvertCategoryId) === 'undefined') {
            triggerCategories.category.correctConvertCategoryId = 0;
        }

        if ($displayFileSearch.length) {
            var $themeName = $(".wpfd-content-ggd[data-category=" + sourcecat + "]").find('.wpfd_root_category_theme').val();
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

            $(".wpfd-content-ggd[data-category=" + sourcecat + "]").prepend($searchContent);
            wpfdGgdSearchFileCategoryHandle();
        }

        if (page !== null && page !== undefined) {
            window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-' + triggerCategories.category.slug + '-p' + page);
        } else {
            window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + catid + '-' + triggerCategories.category.slug);
        }

        container.find('#current_category_slug_' + sourcecat).val(triggerCategories.category.slug);
        var sourcecategories = $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-template-categories").html();
        if (sourcecategories) {
            var template = Handlebars.compile(sourcecategories);
            var html = template(triggerCategories);
            $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").prepend(html);
        }
        if (triggerCategories.category.breadcrumbs !== undefined) {
            $(".wpfd-content-ggd[data-category=" + sourcecat + "] .breadcrumbs").html(triggerCategories.category.breadcrumbs);
        }
        for (var i = 0; i < triggerCategories.categories.length; i++) {
            ggd_cParents[triggerCategories.categories[i].term_id] = triggerCategories.categories[i];
        }

        ggd_breadcrum(sourcecat, catid, triggerCategories.category);
        ggd_initClick();
        if (ggd_tree.length) {
            var currentTree = container.find('.wpfd-foldertree-ggd');
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

        if ($(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd > .wpfd-password-form").length) {
            hideDownloadAllBtn(sourcecat, true);
            $(".wpfd-content-ggd[data-category=" + sourcecat + "] .ggd-download-category").attr('href', '#');
            $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfdcategory").hide();
        }

        if (ggd_empty_subcategories.length) {
            ggd_empty_subcategories.val(triggerCategories.categories.length);
            wpfd_ggd_fire_empty_category_message(sourcecat);
        }
    }

    function wpfdGgdFilesLocalCacheTrigger(triggerFiles, sourcecat, ggd_empty_files, fileAjaxUrl) {
        if (typeof (triggerFiles.categoryPassword) !== 'undefined' && triggerFiles.categoryPassword.length) {
            hideDownloadAllBtn(sourcecat, true);
            $(".wpfd-content-ggd[data-category=" + sourcecat + "] .ggd-download-category").attr('href', '#');
            $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfdcategory").hide();
            $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").empty();
            $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").append(triggerFiles.categoryPassword);
        } else {
            if (triggerFiles.files.length) {
                $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]  .ggd-download-category").removeClass("display-download-category");
            } else {
                $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]  .ggd-download-category").addClass("display-download-category");
            }

            $(".wpfd-content-ggd[data-category=" + sourcecat + "]").after(triggerFiles.cache_pagination);
            var sourcefiles = $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-template-files").html();
            var template = Handlebars.compile(sourcefiles);
            var html = template(triggerFiles);
            html = $('<textarea/>').html(html).val();
            $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").append(html);

            if (typeof (triggerFiles.filepasswords) !== 'undefined') {
                $.each(triggerFiles.filepasswords, function( file_id, pw_form ) {
                    var protected_file = $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").find('.wpfd-file-link[data-id="' + file_id + '"]').parent();
                    protected_file.empty();
                    protected_file.addClass('wpfd-password-protection-form');
                    protected_file.append(pw_form);
                });
            }

            if (triggerFiles.uploadform !== undefined && triggerFiles.uploadform.length) {
                var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                upload_form_html += triggerFiles.uploadform;
                upload_form_html += '</div>';
                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd").append(upload_form_html);

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
                                    if (wpfdGgdFilesLocalCache.exist(fileAjaxUrl)) {
                                        wpfdGgdFilesLocalCache.remove(fileAjaxUrl);
                                    }
                                    var ggd_sourcecat     = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
                                    var current_category  = currentContainer.parents('.wpfd-content.wpfd-content-multi').find('#current_category_' + ggd_sourcecat).val();
                                    load(ggd_sourcecat, current_category);
                                }
                            }
                        });
                    });

                    uploader.assignBrowse($(currentContainer).find('#upload_button'));
                    uploader.assignDrop($(currentContainer).find('.jsWpfdFrontUpload'));
                }

                var containers = $(".wpfd-content-ggd[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                if (containers.length > 0) {
                    containers.each(function(i, el) {
                        initUploader($(el));
                    });
                }
            }

            initClickFile();

            gdd_init_pagination($('.wpfd-content-ggd[data-category=' + sourcecat + '] + .wpfd-pagination'));

            wpfd_remove_loading($(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd"));
            $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "] .wpfdSelectedFiles").remove();
            $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "] .ggd-download-selected").remove();
            hideDownloadAllBtn(sourcecat, false);

            if (ggd_empty_files.length) {
                ggd_empty_files.val(triggerFiles.files.length);
                wpfd_ggd_fire_empty_category_message(sourcecat);
            }

            wpfdGgdDisplayDownloadedFiles();
            wpfdGgdDownloadFiles();
        }
    }

    // Search file category
    function wpfdGgdCategoryAjaxSearch(element, ordering, direction, pushState = true) {
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
                $(element).find(".wpfd-results .wpfd-container-ggd").addClass('wpfd-container-ggd-search');
                if ($(element).find(".wpfd-results .wpfd-form-search-file-category").length) {
                    $(element).find(".wpfd-results .wpfd-form-search-file-category").remove();
                }
                wpfdGgdInitSorting();
                if (typeof wpfdColorboxInit !== 'undefined') {
                    wpfdColorboxInit();
                }
            }
        });
    }

    // Sort initial
    function wpfdGgdInitSorting() {
        jQuery('.orderingCol').click(function (e) {
            e.preventDefault();
            var ordering = jQuery(this).data('ordering');
            var direction = jQuery(this).data('direction');
            wpfdGgdCategoryAjaxSearch(ordering, direction);
        });

        jQuery(".list-results #limit").change(function (e) {
            e.preventDefault();
            jQuery('input[name="limit"]').val(jQuery(this).val());
            var formID = '#' + jQuery(this).closest('form').attr('id');
            wpfdGgdCategoryAjaxSearch(formID);
            return false;
        });
    }

    function wpfdGgdSearchFileCategoryHandle() {
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
                wpfdGgdCategoryAjaxSearch(formID);

                return;
            }
        });

        // Ajax filters
        $(".wpfd-content .btnsearchbelow").on('click', function (e) {
            e.preventDefault();
            var formID = '#' + $(this).closest('form').attr('id');
            wpfdGgdCategoryAjaxSearch(formID);
            return false;
        });
    }
    wpfdGgdSearchFileCategoryHandle();

    function wpfdGgdDisplayDownloadedFiles() {
        var fileDownload = $('.wpfd-content.wpfd-content-ggd .file');
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
    wpfdGgdDisplayDownloadedFiles();

    function wpfdGgdDownloadFiles() {
        $('.wpfd-ggd-box[data-type="png"] .wpfd_downloadlink, .wpfd-ggd-box[data-type="jpg"] .wpfd_downloadlink, .wpfd-ggd-box[data-type="jpeg"] .wpfd_downloadlink, .wpfd-ggd-box[data-type="gif"] .wpfd_downloadlink').on('click', function (event) {
            event.preventDefault();
            var fileId = $(this).parents('.wpfd-ggd-box').attr('data-id');
            var categoryId = $(this).parents('.wpfd-ggd-box').attr('data-catid');
            var cloudType = $('.wpfd-content-ggd').find('.wpfd_root_category_type').val();

            if (!fileId || !categoryId) {
                return false;
            }

            window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
        });
    }
    wpfdGgdDownloadFiles();
});

// Ggd categories local cache
var wpfdGgdCategoriesLocalCache = {
    data: {},
    remove: function (url) {
        delete wpfdGgdCategoriesLocalCache.data[url];
    },
    exist: function (url) {
        return wpfdGgdCategoriesLocalCache.data.hasOwnProperty(url) && wpfdGgdCategoriesLocalCache.data[url] !== null;
    },
    get: function (url) {
        return wpfdGgdCategoriesLocalCache.data[url];
    },
    set: function (url, cachedData) {
        wpfdGgdCategoriesLocalCache.remove(url);
        wpfdGgdCategoriesLocalCache.data[url] = cachedData;
    }
};

// Ggd files local cache
var wpfdGgdFilesLocalCache = {
    data: {},
    remove: function (url) {
        delete wpfdGgdFilesLocalCache.data[url];
    },
    exist: function (url) {
        return wpfdGgdFilesLocalCache.data.hasOwnProperty(url) && wpfdGgdFilesLocalCache.data[url] !== null;
    },
    get: function (url) {
        return wpfdGgdFilesLocalCache.data[url];
    },
    set: function(url, cachedData) {
        wpfdGgdFilesLocalCache.remove(url);
        wpfdGgdFilesLocalCache.data[url] = cachedData;
    }
};