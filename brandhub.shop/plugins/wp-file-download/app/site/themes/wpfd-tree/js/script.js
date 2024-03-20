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
    var sourcefiles = $("#wpfd-template-tree-files").html();
    var sourcecategories = $("#wpfd-template-tree-categories").html();
    var sourcefile = $("#wpfd-template-tree-box").html();
    var tree_hash = window.location.hash;
    var tree_cParents = {};
    var tree_root_category_id = $(".wpfd-content.wpfd-content-tree").length ? $(".wpfd-content.wpfd-content-tree").data('category') : null;
    var allCategoriesBreadcrumbs = '<li><a class="wpfd-all-categories-link" data-idcat="all_0" href="javascript:void(0);">' + wpfdparams.translates.wpfd_all_categories + '</a></li>';
    var allCategoriesDividerBreadcrumbs = '<li><a class="wpfd-all-categories-link" data-idcat="all_0" href="javascript:void(0);">' + wpfdparams.translates.wpfd_all_categories + '</a><span class="divider"> &gt; </span></li>';

    initInputSelected();
    Handlebars.registerHelper('bytesToSize', function (bytes) {
        if (typeof bytes === "undefined") {
            return 'n/a';
        }

        return bytes.toString().toLowerCase() === 'n/a' ? bytes : bytesToSize(bytes);
    });

    treeInitClickFile();

    tree_hash = tree_hash.replace('#', '');
    if (tree_hash !== '') {
        var hasha = tree_hash.split('-');
        var hash_category_id = hasha[1];
        var hash_sourcecat = hasha[0];

        if (parseInt(hash_category_id) > 0) {
            setTimeout(function () {
                tree_loadcategory(hash_category_id, hash_sourcecat);
            }, 100);
        }
    }

    $('.wpfd-content-tree a.catlink').unbind('click.cat').bind('click.cat', function (e) {
        e.preventDefault();
        tree_load($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
        tree_breadcrum($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
        $(this).parent().removeClass('collapsed').addClass('expanded');
    });
    function initInputSelected() {
        $(document).on('change', ".wpfd-content-tree.wpfd-content-multi input.cbox_file_download:not('.search-download-checkbox')", function () {
            inputSelect( $(this).parents('.wpfd-content')[0]);
        });
    }
    function inputSelect( context) {
        var sc = $(context).data('category');
        var selectedFiles = $("input.cbox_file_download:checked", context);
        var filesId = [];
        if (selectedFiles.length) {
            selectedFiles.each(function (index, file) {
                filesId.push($(file).data('id'));
            });
        }
        if (filesId.length > 0) {
            $(".wpfdSelectedFiles", context).remove();
            $('<input type="hidden" class="wpfdSelectedFiles" value="' + filesId.join(',') + '" />')
                .insertAfter($("#current_category_slug_" + sc));
            hideDownloadAllBtn(context, true);
            $(".tree-download-selected", context).remove();
            var downloadSelectedBtn = $('<a href="javascript:void(0);" class="tree-download-selected" style="display: block;">' + wpfdparams.translates.download_selected + '<i class="zmdi zmdi-check-all wpfd-download-category"></i></a>');
            downloadSelectedBtn.insertAfter($("#current_category_slug_" + sc));
            initDownloadSelected();
        } else {
            $(".wpfdSelectedFiles", context).remove();
            $(".tree-download-selected", context).remove();
            hideDownloadAllBtn(context);
        }
    }
    function hideDownloadAllBtn(context, hide) {
        var downloadCatButton = $(".tree-download-category", context);
        if (downloadCatButton.length === 0 || downloadCatButton.hasClass('display-download-category')) {
            return;
        }
        if (hide) {
            $(".tree-download-category", context).hide();
        } else {
            $(".tree-download-category", context).show();
        }
    }

    function initDownloadSelected() {
        $('.wpfd-content-tree.wpfd-content-multi .tree-download-selected').on('click', function () {
            var context = $(this).parents('.wpfd-content')[0];
            var sc = $(context).data('category');
            if ($('.wpfdSelectedFiles', context).length > 0) {
                var category_name = $("#current_category_slug_" + sc).val();
                var selectedFilesId = $('.wpfdSelectedFiles', context).val();
                $.ajax({
                    url: wpfdparams.wpfdajaxurl + "?action=wpfd&task=files.zipSeletedFiles&filesId=" + selectedFilesId + "&wpfd_category_id=" + $(context).attr('data-category'),
                    dataType: "json"
                }).done(function (results) {
                    if (results.success) {
                        var hash = results.data.hash;
                        window.location.href = wpfdparams.wpfdajaxurl + "?action=wpfd&task=files.downloadZipedFile&hash=" + hash + "&wpfd_category_id=" + $(context).attr('data-category') + "&wpfd_category_name=" + category_name;
                    } else {
                        alert(results.data.message);
                    }
                })
            }
        });
    }
    function tree_loadcategory($catid, $sourcecat) {
        $.ajax({
            url: wpfdparams.wpfdajaxurl + "task=categories.getParentsCats&id=" + $catid + "&displaycatid=" + $sourcecat,
            dataType: "json"
        }).done(function (ob) {
            tree_load($sourcecat, ob[0], $('.wpfd-content-tree [data-idcat="' + ob[0] + '"]'), ob);
        });
    }

    function treeInitClickFile() {
        $('.wpfd-content-tree .wpfd-file-link').unbind('click').click(function (e) {
            var context = $(this).parents('.wpfd-content')[0];
            var atthref = $(this).attr('href');
            if (atthref !== '#') {
                return;
            }
            e.preventDefault();
            var fileid = $(this).data('id');
            var categoryid = $(this).data('category_id');

            $.ajax({
                url: wpfdparams.wpfdajaxurl + "task=file.display&view=file&id=" + fileid + "&categoryid=" + categoryid + "&rootcat=" + $(context).attr('data-category'),
                dataType: "json",
                beforeSend: function() {
                    // setting a timeout
                    if($('body').has('wpfd-tree-box-loader') !== true) {
                        $('body').append('<div class="wpfd-tree-box-loader"></div>');
                    }
                }
            }).done(function (file) {
                var template = Handlebars.compile(sourcefile);
                var html = template(file);
                var box = $("#tree-wpfd-box");
                $('.wpfd-tree-box-loader').each(function () {
                    $(this).remove();
                });
                if (box.length === 0) {
                    $('body').append('<div id="tree-wpfd-box" style="display: hidden;"></div>');
                    box = $("#tree-wpfd-box");
                }
                box.empty();
                box.prepend(html);
                box.attr('data-id', fileid);
                box.attr('data-catid', categoryid);
                box.attr('class', 'tree-wpfd-box wpfd-download-box');
                if (typeof (file.file.ext) !== 'undefined') {
                    box.attr('data-type', file.file.ext);
                    box.addClass(file.file.ext);
                }
                box.click(function (e) {
                    if ($(e.target).is('#tree-wpfd-box')) {
                        box.hide();
                    }
                    $('#tree-wpfd-box').unbind('click.box').bind('click.box', function (e) {
                        if ($(e.target).is('#tree-wpfd-box')) {
                            box.hide();
                        }
                    });
                });

                if (typeof (file.file.linkdownload) !== 'undefined') {
                    var previewLinkDownload = '<input type="hidden" class="wpfd_file_preview_link_download" value="'+ file.file.linkdownload +'" data-filetitle="'+ file.file.post_title +'" />';
                    box.prepend(previewLinkDownload);
                }

                $('#tree-wpfd-box .wpfd-close').click(function (e) {
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

                $('body.elementor-default #tree-wpfd-box a.wpfd_downloadlink').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var link = $(this).attr('href');
                    window.location.href = link;
                });

                wpfdTreeDisplayDownloadedFiles();
                wpfdTreeDownloadFiles();
            });
        });
    }

    function wantDelete(item, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) {
                arr.splice(i, 1);
                break;
            }
        }
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

        var current_category  = currentContainer.parents('.wpfd-content-tree').find('li.directory.active .catlink').data('idcat');

        // Init the uploader
        var uploader = new Resumable({
            target: wpfdparams.wpfduploadajax + '?action=wpfd&task=files.upload&upload_from=front',
            query: {
                id_category: currentContainer.parents('.wpfd-content-tree').find('li.directory.active .catlink').data('idcat'),
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

        uploader.on('createFolders', function (files) {
            var currentRootCat = currentContainer.find('input[name=id_category]').val();
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

            var sourcecat = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
            var current_category  = currentContainer.parents('.wpfd-content-tree').find('li.directory.active .catlink').data('idcat');
            if (!current_category) {
                current_category = $('input[name=id_category]').val();
            }
            var categoryAjaxUrl = wpfdparams.wpfdajaxurl + "task=categories.display&view=categories&id=" + current_category + "&top=" + sourcecat;
            $.ajax({
                url: categoryAjaxUrl,
                dataType: "json"
            }).done(function (categories) {
                var sourcecategories = $("#wpfd-template-tree-categories").html();
                if (sourcecategories) {
                    var template = Handlebars.compile(sourcecategories);
                    var html = template(categories);

                    var current_category_obj = categories.category;
                    var sourceCatName = $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd-category-theme-title').text();
                    if (sourcecat == 'all_0') {
                        tree_cParents[sourcecat] = {parent: 0, term_id: 0, name: wpfdparams.translates.wpfd_all_categories};
                    } else {
                        tree_cParents[sourcecat] = {parent: 0, term_id: parseInt(sourcecat), name: sourceCatName};
                    }

                    tree_cParents[current_category_obj.term_id] = {parent: current_category_obj.parent, term_id: current_category_obj.term_id, name: current_category_obj.name};

                    if (categories.categories.length > 0) {
                        if (current_category == sourcecat) {
                            var list     = $(".wpfd-content-tree[data-category=" + sourcecat + "] > ul:not(.breadcrumbs)");
                        } else {
                            var list     = $(".wpfd-content-tree[data-category=" + sourcecat + "] li.directory.active > ul");
                        }
                        list.find('li.directory').remove();
                        list.append(html);

                        var listChildCategories = categories.categories;
                        for (var i = 0; i < listChildCategories.length; i++) {
                            var childCategory = listChildCategories[i];
                            tree_cParents[childCategory.term_id] = {parent: childCategory.parent, term_id: childCategory.term_id, name: childCategory.name};
                        }

                        $(".wpfd-content-tree[data-category=" + sourcecat + "] a.catlink:not(.breadcrumbs a.catlink)").unbind('click.cat').bind('click.cat', function (e) {
                            e.preventDefault();
                            tree_load($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
                            tree_breadcrum($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
                            $('.wpfd-content-tree[data-category=' + sourcecat + '] input[name="id_category"]').val($(this).data('idcat'));
                        });
                    }
                }
            })

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
                        var tree_sourcecat    = currentContainer.parents('.wpfd-content-tree').data('category');
                        var current_category  = currentContainer.parents('.wpfd-content-tree').find('li.directory.active .catlink').data('idcat');

                        if (typeof (tree_sourcecat) === 'undefined') {
                            tree_sourcecat = currentContainer.parents('.wpfd-content-tree').find('.wpfd_root_category_id').length ?
                                currentContainer.parents('.wpfd-content-tree').find('.wpfd_root_category_id').val() : $('.wpfd_root_category_id').val();
                        }

                        if (typeof (tree_sourcecat) === 'undefined' && tree_root_category_id !== null) {
                            tree_sourcecat = tree_root_category_id;
                        }

                        if (typeof (current_category) === 'undefined') {
                            current_category = tree_sourcecat;
                        }

                        $.ajax({
                            url: wpfdparams.wpfdajaxurl + "task=files.display&view=files&id=" + current_category + "&rootcat=" + tree_sourcecat,
                            dataType: "json"
                        }).done(function (content) {
                            if (content.files.length) {
                                $(".wpfd-content-tree[data-category=" + tree_sourcecat + "] .tree-download-category").removeClass("display-download-category");
                            } else {
                                $(".wpfd-content-tree[data-category=" + tree_sourcecat + "] .tree-download-category").addClass("display-download-category");
                            }

                            var template = Handlebars.compile(sourcefiles);
                            var html     = template(content);
                            html         = $('<textarea/>').html(html).val();
                            if (parseInt(current_category) === parseInt(tree_sourcecat)) {
                                $('.wpfd-content-tree[data-category="' + tree_sourcecat + '"] .wpfd-tree-categories-files > li.ext').remove();
                                $('.wpfd-content-tree[data-category="' + tree_sourcecat + '"] .wpfd-tree-categories-files').append(html);
                            } else {
                                $('.wpfd-content-tree[data-category="' + tree_sourcecat + '"] .catlink[data-idcat="' + current_category + '"] + ul > li:not(.directory)').remove();
                                $('.wpfd-content-tree[data-category="' + tree_sourcecat + '"] .catlink[data-idcat="' + current_category + '"] + ul').append(html);
                            }
                            treeInitClickFile();
                            wpfdTreeDisplayDownloadedFiles();
                            wpfdTreeDownloadFiles();

                            // Remove caches
                            var treeCategoriesAjaxUrl = wpfdparams.wpfdajaxurl + "task=categories.display&view=categories&id=" + current_category;
                            if (wpfdTreeCategoriesLocalCache.exist(treeCategoriesAjaxUrl)) {
                                wpfdTreeCategoriesLocalCache.remove(treeCategoriesAjaxUrl);
                            }

                            var ordering = $(".wpfd-content-tree.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_' + sourcecat).val();
                            var orderingDirection = $(".wpfd-content-tree.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_direction_' + sourcecat).val();
                            var params = $.param({
                                task: 'files.display',
                                view: 'files',
                                id: current_category,
                                rootcat: sourcecat,
                                orderCol: ordering,
                                orderDir: orderingDirection
                            });
                            var treeFilesAjaxUrl = wpfdparams.wpfdajaxurl + params;
                            if (wpfdTreeFilesLocalCache.exist(treeFilesAjaxUrl)) {
                                wpfdTreeFilesLocalCache.remove(treeFilesAjaxUrl);
                            }
                        });
                    }
                }
            });
        });

        uploader.assignBrowse($(currentContainer).find('#upload_button'));
        uploader.assignBrowse($(currentContainer).find('#upload_folder_button'), true);
        uploader.assignDrop($(currentContainer).find('.jsWpfdFrontUpload'));
    }

    window.tree_load = function(sourcecat, category, elem, loadcats) {
        if (!jQuery.isEmptyObject(loadcats)) {
            wantDelete(category, loadcats);
        }

        var pathname = window.location.href.replace(window.location.hash, '');

        var ul = elem.parent().children('ul');
        $('.wpfd-content-tree').find('.active').removeClass('active');
        elem.parent().addClass('active');
        if (ul.length > 0) {
            //close cat
            ul.slideUp(400, null, function () {
                $(this).remove();
                elem.parent().removeClass('open expanded').addClass('collapsed');
                elem.parent().removeClass('wpfd-loading-tree');
                elem.parent().find('.wpfd-loading-tree-bg').remove();
                inputSelect(sourcecat);
            });
            var root_linkdownload_cat = $(".wpfd-content-tree[data-category=" + sourcecat + "] #root_linkdownload_cat").val();
            var root_countfile_cat = $(".wpfd-content-tree[data-category=" + sourcecat + "] #root_countfile_cat").val();
            $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").attr('href', root_linkdownload_cat);

            if (root_countfile_cat !== "0") {
                $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").removeClass("display-download-category");
            } else {
                $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").addClass("display-download-category");
            }

            return;
        } else {
            elem.parent().addClass('wpfd-loading-tree');
            elem.parent().prepend($('#wpfd-loading-tree-wrap').html());
        }
        if ($(elem).hasClass('clicked')) {
            return;
        }
        $(elem).addClass('clicked');
        var tree_empty_subcategories = $(".wpfd-content-tree[data-category=" + sourcecat + "] #wpfd_is_empty_subcategories");
        var tree_empty_files = $(".wpfd-content-tree[data-category=" + sourcecat + "] #wpfd_is_empty_files");
        var treeCategoriesAjaxUrl = wpfdparams.wpfdajaxurl + "task=categories.display&view=categories&id=" + category;

        if (tree_empty_subcategories.length) {
            tree_empty_subcategories.val('1');
        }

        if (tree_empty_files.length) {
            tree_empty_files.val('1');
        }

        //Get categories
        $.ajax({
            url: treeCategoriesAjaxUrl,
            dataType: "json",
            cache: true,
            beforeSend: function () {
                if ($(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd-form-search-file-category').length) {
                    $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd-form-search-file-category').remove();
                }

                if (wpfdTreeCategoriesLocalCache.exist(treeCategoriesAjaxUrl)) {
                    var treeCategoriesTrigger = wpfdTreeCategoriesLocalCache.get(treeCategoriesAjaxUrl);
                    wpfdTreeCategoriesLocalCacheTrigger(treeCategoriesTrigger, sourcecat, elem, loadcats, category, pathname, tree_empty_subcategories, tree_empty_files);
                    $('.wpfd-content-tree[data-category=' + sourcecat + '] input[name="id_category"]').val(category);
                    return false;
                }
                return true;
            }
        }).done(function (categories) {
            // Tree categories cache
            wpfdTreeCategoriesLocalCache.set(treeCategoriesAjaxUrl, categories);

            var current_category_obj = categories.category;
            var sourceCatName = $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd-category-theme-title').text();
            if (sourcecat == 'all_0') {
                tree_cParents[sourcecat] = {parent: 0, term_id: 0, name: wpfdparams.translates.wpfd_all_categories};
            } else {
                tree_cParents[sourcecat] = {parent: 0, term_id: parseInt(sourcecat), name: sourceCatName};
            }

            tree_cParents[current_category_obj.term_id] = {parent: current_category_obj.parent, term_id: current_category_obj.term_id, name: current_category_obj.name};

            if (categories.categories.length) {
                var listChildCategories = categories.categories;
                for (var i = 0; i < listChildCategories.length; i++) {
                    var childCategory = listChildCategories[i];
                    tree_cParents[childCategory.term_id] = {parent: childCategory.parent, term_id: childCategory.term_id, name: childCategory.name};
                }
            }

            // Search file in category section
            var $displayFileSearch = $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd_root_category_display_file_search');
            if ($displayFileSearch.length) {
                var $themeName = $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd_root_category_theme').val();

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

                $(".wpfd-content-tree[data-category=" + sourcecat + "]").prepend($searchContent);
                wpfdTreeSearchFileCategoryHandle();
            }

            window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + category + '-' + categories.category.slug);

            if (typeof (sourcecategories) === 'undefined') {
                sourcecategories = $('#wpfd-template-tree-categories').html();
            }

            var template = Handlebars.compile(sourcecategories);
            var html = template(categories);

            if (categories.categories.length > 0) {
                elem.parents('li').append('<ul style="display:none;">' + html + '</ul>');
                $(".wpfd-content-tree[data-category=" + sourcecat + "] a.catlink:not(.breadcrumbs a.catlink)").unbind('click.cat').bind('click.cat', function (e) {
                    e.preventDefault();
                    tree_load($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
                    tree_breadcrum(sourcecat, $(this).data('idcat'), $(this));
                    $('.wpfd-content-tree[data-category=' + sourcecat + '] input[name="id_category"]').val($(this).data('idcat'));
                    treeInitClickFile();
                });
            }

            // Show breadcrumbs
            if (categories.category.breadcrumbs !== undefined) {
                if (sourcecat.toString() === 'all_0') {
                    categories.category.breadcrumbs = allCategoriesDividerBreadcrumbs + categories.category.breadcrumbs;
                }

                $(".wpfd-content-tree[data-category=" + sourcecat + "] .breadcrumbs").html(categories.category.breadcrumbs);
                $('.wpfd-content-tree[data-category=' + sourcecat + '] .breadcrumbs a.catlink').addClass('breadcrumblink');
                $('.wpfd-content-tree[data-category=' + sourcecat + '] .breadcrumbs a.catlink').unbind('click.cat').bind('click.cat', function (e) {
                    e.preventDefault();
                    $(this).parents('.wpfd-content-tree').find('a.catlink[data-idcat='+ $(this).data('idcat') +']:not(.breadcrumblink)').parent().find('ul li.directory').removeClass('expanded').addClass('collapsed');
                    $(this).parents('.wpfd-content-tree').find('a.catlink[data-idcat='+ $(this).data('idcat') +']:not(.breadcrumblink)').parent().find('ul li.directory > ul').hide();
                    if (parseInt($(this).data('idcat')) === parseInt(sourcecat)) {
                        $(this).parents('.wpfd-content-tree').find('.wpfd-tree-categories-files > li.directory').removeClass('expanded').addClass('collapsed');
                        $(this).parents('.wpfd-content-tree').find('.wpfd-tree-categories-files > li.directory > ul').hide();
                    }
                    tree_load($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
                    tree_breadcrum($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
                    $(this).parents('.wpfd-content-tree').find('a.catlink[data-idcat='+ $(this).data('idcat') +']:not(.breadcrumblink)').parent().addClass('active');
                    treeInitClickFile();
                });

                $('.wpfd-all-categories-link').on('click', function (e) {
                    e.preventDefault();
                    $('.wpfd-content-tree[data-category=' + sourcecat + ']').find('ul li.directory').removeClass('expanded').addClass('collapsed');
                    $('.wpfd-content-tree[data-category=' + sourcecat + ']').find('ul li.directory > ul').hide();
                    $('.wpfd-content-tree[data-category=' + sourcecat + ']').find('.wpfd-upload-form').remove();
                    $('.wpfd-content-tree[data-category=' + sourcecat + '] .breadcrumbs').empty().html(allCategoriesBreadcrumbs);
                    treeInitClickFile();

                    // Push all categories state
                    window.history.pushState('', document.title, pathname + '#' + sourcecat + '-all_0-' + categories.category.slug);
                });
            }

            tree_breadcrum(sourcecat, category, elem);
            $('.wpfd-content-tree[data-category=' + sourcecat + '] input[name="id_category"]').val(category);

            $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").attr('href', categories.category.linkdownload_cat);
            var ordering = $(".wpfd-content-tree.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_' + sourcecat).val();
            var orderingDirection = $(".wpfd-content-tree.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_direction_' + sourcecat).val();
            var params = $.param({
                task: 'files.display',
                view: 'files',
                id: category,
                rootcat: sourcecat,
                orderCol: ordering,
                orderDir: orderingDirection
            });

            if (tree_empty_subcategories.length) {
                tree_empty_subcategories.val(categories.categories.length);
                tree_fire_empty_category_message(sourcecat, elem);
            }

            var treeFilesAjaxUrl = wpfdparams.wpfdajaxurl + params;

            //Get files
            $.ajax({
                url: treeFilesAjaxUrl,
                dataType: "json",
                cache: true,
                beforeSend: function () {
                    if (wpfdTreeFilesLocalCache.exist(treeFilesAjaxUrl)) {
                        var treeFilesTrigger = wpfdTreeFilesLocalCache.get(treeFilesAjaxUrl);
                        wpfdTreeFilesLocalCacheTrigger(treeFilesTrigger, sourcecat, elem, loadcats, tree_empty_files, treeFilesAjaxUrl);

                        return false;
                    }

                    return true;
                }
            }).done(function (content) {
                // Tree files cache
                wpfdTreeFilesLocalCache.set(treeFilesAjaxUrl, content);

                if (typeof (content.categoryPassword) !== 'undefined' && content.categoryPassword.length) {
                    $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").hide();
                    $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").attr('href', '#');
                    $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").addClass('tree-download-category-password-protection');
                    var category_pwf = '<div class="category-pw-form" style="color: #999999">' + content.categoryPassword + '</div>';
                    if (elem.parent().children('ul').length === 0) {
                        elem.parent().append('<ul style="display:none;">' + category_pwf + '</ul>');
                    } else {
                        elem.parent().children('ul li.directory').remove();
                        elem.parent().children('ul').prepend(category_pwf);
                    }

                    treeInitClickFile();

                    elem.parent().children('ul').slideDown(400, null, function () {
                        elem.parent().addClass('open expanded');
                        elem.parent().removeClass('wpfd-loading-tree collapsed');
                        elem.parent().find('.wpfd-loading-tree-bg').remove();
                    });

                    $('.category-pw-form').parent().find('li.directory').hide();
                } else {
                    if (content.files.length) {
                        $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").removeClass("display-download-category");
                    } else {
                        $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").addClass("display-download-category");
                    }

                    if ($(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").hasClass('tree-download-category-password-protection')) {
                        $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").removeClass('tree-download-category-password-protection');
                        $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").show();
                    }

                    if (typeof (sourcefiles) === 'undefined') {
                        sourcefiles = $("#wpfd-template-tree-files").html();
                    }

                    var template = Handlebars.compile(sourcefiles);
                    var html = template(content);
                    html = $('<textarea/>').html(html).val();
                    if (elem.parent().children('ul').length === 0) {
                        elem.parent().append('<ul style="display:none;">' + html + '</ul>');
                    } else {
                        elem.parent().children('ul').append(html);
                    }

                    if ($(".wpfd-content-tree[data-category=" + sourcecat + "] .wpfd-upload-form").length) {
                        $(".wpfd-content-tree[data-category=" + sourcecat + "] .wpfd-upload-form").remove();
                    }

                    if (typeof (content.filepasswords) !== 'undefined') {
                        $.each(content.filepasswords, function( file_id, pw_form ) {
                            var protected_file = $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd-file-link[data-id="' + file_id + '"]').parent();
                            protected_file.empty();
                            protected_file.addClass('wpfd-password-protection-form');
                            protected_file.append(pw_form);
                        });
                    }

                    if (content.uploadform !== undefined && content.uploadform.length) {
                        var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                        upload_form_html += content.uploadform;
                        upload_form_html += '</div>';
                        $(".wpfd-content-tree[data-category=" + sourcecat + "]").append(upload_form_html);

                        if (typeof (Wpfd) === 'undefined') {
                            Wpfd = {};
                        }


                        var containers = $(".wpfd-content-tree[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                        if (containers.length > 0) {
                            containers.each(function(i, el) {
                                initUploader($(el));
                            });
                        }
                    }

                    treeInitClickFile();
                    elem.parent().children('ul').slideDown(400, null, function () {

                        elem.parent().addClass('open expanded');
                        elem.parent().removeClass('wpfd-loading-tree collapsed');
                        elem.parent().find('.wpfd-loading-tree-bg').remove();
                    });

                    if (!jQuery.isEmptyObject(loadcats)) {
                        var ccat = loadcats[0];
                        tree_load(sourcecat, ccat, $('.wpfd-content-tree [data-idcat="' + ccat + '"]'), loadcats);
                    }
                    inputSelect(sourcecat);

                    if (tree_empty_files.length) {
                        tree_empty_files.val(content.files.length);
                        tree_fire_empty_category_message(sourcecat, elem);
                    }

                    if ($(".wpfd-content-tree[data-category=" + sourcecat + "] + .wpfd-pagination").length) {
                        $(".wpfd-content-tree[data-category=" + sourcecat + "] + .wpfd-pagination").remove();
                    }

                    wpfdTreeDisplayDownloadedFiles();
                    wpfdTreeDownloadFiles();
                }
            });

            $(elem).removeClass('clicked');
        });


    }

    window.tree_breadcrum = function(sourcecat, catid, category, tree_cParents2) {
        var links = [];
        var current_Cat = tree_cParents[catid];
        if (current_Cat == undefined) {
            if (!jQuery.isEmptyObject(tree_cParents2)) {
                tree_cParents = tree_cParents2;
                current_Cat = tree_cParents2[catid];
            } else {
                return;
            }
        }
        links.unshift(current_Cat);
        if (current_Cat.parent !== 0) {
            while (tree_cParents[current_Cat.parent]) {
                current_Cat = tree_cParents[current_Cat.parent];
                links.unshift(current_Cat);
            }
        }

        var html = '';
        if (sourcecat.toString() === 'all_0' && catid.toString() !== 'all_0' && parseInt(catid) !== 0) {
            html = allCategoriesDividerBreadcrumbs;
        }
        for (var i = 0; i < links.length; i++) {
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
        $(".wpfd-content-tree.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-breadcrumbs-tree").html(html);
        $(".wpfd-content-tree.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-breadcrumbs-tree .catlink").click(function (e) {
            e.preventDefault();
            tree_load($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
            $(".wpfd-content-tree.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-tree-categories-files").find('.directory').removeClass('active');
            $(".wpfd-content-tree.wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-tree-categories-files .catlink[data-idcat="+$(this).data('idcat')+"]").parent().addClass('active');
            tree_breadcrum(sourcecat, $(this).data('idcat'), $(this));
            treeInitClickFile();
        });
    }

    function tree_fire_empty_category_message(category_id, element) {
        if (!category_id) {
            return;
        }
        var root_category = '.wpfd-content-tree[data-category=' + category_id + ']';
        var display_empty_category_message = $(root_category).find('#wpfd_display_empty_category_message').val();
        var empty_category_message_val = $(root_category).find('#wpfd_empty_category_message_val').val();
        var is_empty_subcategories = $(root_category).find('#wpfd_is_empty_subcategories').val();
        var is_empty_files = $(root_category).find('#wpfd_is_empty_files').val();

        if (parseInt(display_empty_category_message) !== 1
            || parseInt(is_empty_subcategories) !== 0 || parseInt(is_empty_files) !== 0 ) {
            return;
        }

        var code = '<li class="wpfd-empty-category-message">';
        code += empty_category_message_val;
        code += '</li>';

        $(root_category).find('.wpfd-empty-category-message').remove();
        element.parent().children('ul').prepend(code);
    }

    var destroy_upload = $('.wpfd-upload-form.destroy');
    if (destroy_upload.length) {
        destroy_upload.remove();
    }

    function wpfdTreeCategoriesLocalCacheTrigger(treeCategoriesTrigger, sourcecat, elem, loadcats, category, pathname, tree_empty_subcategories, tree_empty_files) {
        var $displayFileSearch = $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd_root_category_display_file_search');
        if ($displayFileSearch.length) {
            var $themeName = $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd_root_category_theme').val();
            var $searchContent = '<form action="" id="adminForm-'+ treeCategoriesTrigger.category.term_id +'" class="wpfd-adminForm wpfd-form-search-file-category" name="adminForm" method="post">' +
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
                '<input type="hidden" id="filter_catid" class="chzn-select filter_catid" name="catid" value="'+ treeCategoriesTrigger.category.correctConvertCategoryId +'" data-cattype="" data-slug="" />' +
                '<input type="hidden" name="theme" value="'+ $themeName +'">' +
                '<input type="hidden" name="limit" value="15">' +
                '<div id="wpfd-results" class="wpfd-results list-results"></div>' +
                '</div>' +
                '</form>';

            $(".wpfd-content-tree[data-category=" + sourcecat + "]").prepend($searchContent);
            wpfdTreeSearchFileCategoryHandle();
        }

        window.history.pushState('', document.title, pathname + '#' + sourcecat + '-' + category + '-' + treeCategoriesTrigger.category.slug);

        var template = Handlebars.compile(sourcecategories);
        var html = template(treeCategoriesTrigger);
        if (treeCategoriesTrigger.categories.length > 0) {
            elem.parents('li').append('<ul style="display:none;">' + html + '</ul>');
            $(".wpfd-content-tree[data-category=" + sourcecat + "] a.catlink").unbind('click.cat').bind('click.cat', function (e) {
                e.preventDefault();
                tree_load($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
                tree_breadcrum(sourcecat, $(this).data('idcat'), $(this));
                treeInitClickFile();
            });
        }

        // Show breadcrumbs
        if (treeCategoriesTrigger.category.breadcrumbs !== undefined) {
            $(".wpfd-content-tree[data-category=" + sourcecat + "] .breadcrumbs").html(treeCategoriesTrigger.category.breadcrumbs);
            $('.wpfd-content-tree[data-category=' + sourcecat + '] .breadcrumbs a.catlink').addClass('breadcrumblink');
            $('.wpfd-content-tree[data-category=' + sourcecat + '] .breadcrumbs a.catlink').unbind('click.cat').bind('click.cat', function (e) {
                e.preventDefault();
                $(this).parents('.wpfd-content-tree').find('a.catlink[data-idcat='+ $(this).data('idcat') +']:not(.breadcrumblink)').parent().find('ul li.directory').removeClass('expanded').addClass('collapsed');
                $(this).parents('.wpfd-content-tree').find('a.catlink[data-idcat='+ $(this).data('idcat') +']:not(.breadcrumblink)').parent().find('ul li.directory > ul').hide();
                if (parseInt($(this).data('idcat')) === parseInt(sourcecat)) {
                    $(this).parents('.wpfd-content-tree').find('.wpfd-tree-categories-files > li.directory').removeClass('expanded').addClass('collapsed');
                    $(this).parents('.wpfd-content-tree').find('.wpfd-tree-categories-files > li.directory > ul').hide();
                }
                tree_load($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
                tree_breadcrum($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
                $(this).parents('.wpfd-content-tree').find('a.catlink[data-idcat='+ $(this).data('idcat') +']:not(.breadcrumblink)').parent().addClass('active');
                treeInitClickFile();
            });

            $('.wpfd-all-categories-link').on('click', function (e) {
                e.preventDefault();
                $('.wpfd-content-tree[data-category=' + sourcecat + ']').find('ul li.directory').removeClass('expanded').addClass('collapsed');
                $('.wpfd-content-tree[data-category=' + sourcecat + ']').find('ul li.directory > ul').hide();
                $('.wpfd-content-tree[data-category=' + sourcecat + ']').find('.wpfd-upload-form').remove();
                $('.wpfd-content-tree[data-category=' + sourcecat + '] .breadcrumbs').empty().html(allCategoriesBreadcrumbs);
                treeInitClickFile();
            });
        }

        $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").attr('href', treeCategoriesTrigger.category.linkdownload_cat);
        var ordering = $(".wpfd-content-tree.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_' + sourcecat).val();
        var orderingDirection = $(".wpfd-content-tree.wpfd-content-multi[data-category=" + sourcecat + "]").find('#current_ordering_direction_' + sourcecat).val();
        var params = $.param({
            task: 'files.display',
            view: 'files',
            id: category,
            rootcat: sourcecat,
            orderCol: ordering,
            orderDir: orderingDirection
        });

        if (tree_empty_subcategories.length) {
            tree_empty_subcategories.val(treeCategoriesTrigger.categories.length);
            tree_fire_empty_category_message(sourcecat, elem);
        }

        var treeFilesAjaxUrl = wpfdparams.wpfdajaxurl + params;

        // Get files
        $.ajax({
            url: treeFilesAjaxUrl,
            dataType: "json",
            cache: true,
            beforeSend: function () {
                if (wpfdTreeFilesLocalCache.exist(treeFilesAjaxUrl)) {
                    var treeFilesTrigger = wpfdTreeFilesLocalCache.get(treeFilesAjaxUrl);
                    wpfdTreeFilesLocalCacheTrigger(treeFilesTrigger, sourcecat, elem, loadcats, tree_empty_files, treeFilesAjaxUrl);

                    return false;
                }

                return true;
            }
        }).done(function (content) {
            wpfdTreeFilesLocalCache.set(treeFilesAjaxUrl, content);

            if (typeof (content.categoryPassword) !== 'undefined' && content.categoryPassword.length) {
                $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").hide();
                $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").attr('href', '#');
                $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").addClass('tree-download-category-password-protection');
                var category_pwf = '<div class="category-pw-form" style="color: #999999">' + content.categoryPassword + '</div>';
                if (elem.parent().children('ul').length === 0) {
                    elem.parent().append('<ul style="display:none;">' + category_pwf + '</ul>');
                } else {
                    elem.parent().children('ul li.directory').remove();
                    elem.parent().children('ul').prepend(category_pwf);
                }

                treeInitClickFile();

                elem.parent().children('ul').slideDown(400, null, function () {
                    elem.parent().addClass('open expanded');
                    elem.parent().removeClass('wpfd-loading-tree collapsed');
                    elem.parent().find('.wpfd-loading-tree-bg').remove();
                });

                $('.category-pw-form').parent().find('li.directory').hide();
            } else {
                if (content.files.length) {
                    $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").removeClass("display-download-category");
                } else {
                    $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").addClass("display-download-category");
                }

                if ($(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").hasClass('tree-download-category-password-protection')) {
                    $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").removeClass('tree-download-category-password-protection');
                    $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").show();
                }

                var template = Handlebars.compile(sourcefiles);
                var html = template(content);
                html = $('<textarea/>').html(html).val();
                if (elem.parent().children('ul').length === 0) {
                    elem.parent().append('<ul style="display:none;">' + html + '</ul>');
                } else {
                    elem.parent().children('ul').append(html);
                }

                if ($(".wpfd-content-tree[data-category=" + sourcecat + "] .wpfd-upload-form").length) {
                    $(".wpfd-content-tree[data-category=" + sourcecat + "] .wpfd-upload-form").remove();
                }

                if (typeof (content.filepasswords) !== 'undefined') {
                    $.each(content.filepasswords, function( file_id, pw_form ) {
                        var protected_file = $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd-file-link[data-id="' + file_id + '"]').parent();
                        protected_file.empty();
                        protected_file.addClass('wpfd-password-protection-form');
                        protected_file.append(pw_form);
                    });
                }

                if (content.uploadform !== undefined && content.uploadform.length) {
                    var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                    upload_form_html += content.uploadform;
                    upload_form_html += '</div>';
                    $(".wpfd-content-tree[data-category=" + sourcecat + "]").append(upload_form_html);

                    if (typeof (Wpfd) === 'undefined') {
                        Wpfd = {};
                    }

                    var containers = $(".wpfd-content-tree[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                    if (containers.length > 0) {
                        containers.each(function(i, el) {
                            initUploader($(el));
                        });
                    }
                }

                treeInitClickFile();
                elem.parent().children('ul').slideDown(400, null, function () {

                    elem.parent().addClass('open expanded');
                    elem.parent().removeClass('wpfd-loading-tree collapsed');
                    elem.parent().find('.wpfd-loading-tree-bg').remove();
                });

                if (!jQuery.isEmptyObject(loadcats)) {
                    var ccat = loadcats[0];
                    tree_load(sourcecat, ccat, $('.wpfd-content-tree [data-idcat="' + ccat + '"]'), loadcats);
                }
                inputSelect(sourcecat);

                if (tree_empty_files.length) {
                    tree_empty_files.val(content.files.length);
                    tree_fire_empty_category_message(sourcecat, elem);
                }

                wpfdTreeDisplayDownloadedFiles();
                wpfdTreeDownloadFiles();
            }
        });

        $(elem).removeClass('clicked');
    }

    function wpfdTreeFilesLocalCacheTrigger(treeFilesTrigger, sourcecat, elem, loadcats, tree_empty_files, treeFilesAjaxUrl) {
        if (typeof (treeFilesTrigger.categoryPassword) !== 'undefined' && treeFilesTrigger.categoryPassword.length) {
            $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").hide();
            $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").attr('href', '#');
            $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").addClass('tree-download-category-password-protection');
            var category_pwf = '<div class="category-pw-form" style="color: #999999">' + treeFilesTrigger.categoryPassword + '</div>';
            if (elem.parent().children('ul').length === 0) {
                elem.parent().append('<ul style="display:none;">' + category_pwf + '</ul>');
            } else {
                elem.parent().children('ul li.directory').remove();
                elem.parent().children('ul').prepend(category_pwf);
            }

            treeInitClickFile();

            elem.parent().children('ul').slideDown(400, null, function () {
                elem.parent().addClass('open expanded');
                elem.parent().removeClass('wpfd-loading-tree collapsed');
                elem.parent().find('.wpfd-loading-tree-bg').remove();
            });

            $('.category-pw-form').parent().find('li.directory').hide();
        } else {
            if (treeFilesTrigger.files.length) {
                $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").removeClass("display-download-category");
            } else {
                $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").addClass("display-download-category");
            }

            if ($(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").hasClass('tree-download-category-password-protection')) {
                $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").removeClass('tree-download-category-password-protection');
                $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").show();
            }

            var template = Handlebars.compile(sourcefiles);
            var html = template(treeFilesTrigger);
            html = $('<textarea/>').html(html).val();
            if (elem.parent().children('ul').length === 0) {
                elem.parent().append('<ul style="display:none;">' + html + '</ul>');
            } else {
                elem.parent().children('ul').append(html);
            }

            if ($(".wpfd-content-tree[data-category=" + sourcecat + "] .wpfd-upload-form").length) {
                $(".wpfd-content-tree[data-category=" + sourcecat + "] .wpfd-upload-form").remove();
            }

            if (typeof (treeFilesTrigger.filepasswords) !== 'undefined') {
                $.each(treeFilesTrigger.filepasswords, function( file_id, pw_form ) {
                    var protected_file = $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd-file-link[data-id="' + file_id + '"]').parent();
                    protected_file.empty();
                    protected_file.addClass('wpfd-password-protection-form');
                    protected_file.append(pw_form);
                });
            }

            if (treeFilesTrigger.uploadform !== undefined && treeFilesTrigger.uploadform.length) {
                var upload_form_html = '<div class="wpfd-upload-form" style="margin: 20px 10px">';
                upload_form_html += treeFilesTrigger.uploadform;
                upload_form_html += '</div>';
                $(".wpfd-content-tree[data-category=" + sourcecat + "]").append(upload_form_html);

                if (typeof (Wpfd) === 'undefined') {
                    Wpfd = {};
                }

                var containers = $(".wpfd-content-tree[data-category=" + sourcecat + "] div[class*=wpfdUploadForm]");
                if (containers.length > 0) {
                    containers.each(function(i, el) {
                        initUploader($(el));
                    });
                }
            }

            treeInitClickFile();
            elem.parent().children('ul').slideDown(400, null, function () {

                elem.parent().addClass('open expanded');
                elem.parent().removeClass('wpfd-loading-tree collapsed');
                elem.parent().find('.wpfd-loading-tree-bg').remove();
            });

            if (!jQuery.isEmptyObject(loadcats)) {
                var ccat = loadcats[0];
                tree_load(sourcecat, ccat, $('.wpfd-content-tree [data-idcat="' + ccat + '"]'), loadcats);
            }
            inputSelect(sourcecat);

            if (tree_empty_files.length) {
                tree_empty_files.val(treeFilesTrigger.files.length);
                tree_fire_empty_category_message(sourcecat, elem);
            }

            wpfdTreeDisplayDownloadedFiles();
            wpfdTreeDownloadFiles();
        }
    }

    // Search file category
    function wpfdTreeCategoryAjaxSearch(element, ordering, direction, pushState = true) {
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
                if ($(element).find(".wpfd-results .wpfd-form-search-file-category").length) {
                    $(element).find(".wpfd-results .wpfd-form-search-file-category").remove();
                }
                wpfdTreeInitSorting();
                if (typeof wpfdColorboxInit !== 'undefined') {
                    wpfdColorboxInit();
                }
            }
        });
    }

    // Sort initial
    function wpfdTreeInitSorting() {
        jQuery('.orderingCol').click(function (e) {
            e.preventDefault();
            var ordering = jQuery(this).data('ordering');
            var direction = jQuery(this).data('direction');
            wpfdTreeCategoryAjaxSearch(ordering, direction);
        });

        jQuery(".list-results #limit").change(function (e) {
            e.preventDefault();
            jQuery('input[name="limit"]').val(jQuery(this).val());
            var formID = '#' + jQuery(this).closest('form').attr('id');
            wpfdTreeCategoryAjaxSearch(formID);
            return false;
        });
    }

    function wpfdTreeSearchFileCategoryHandle() {
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
                wpfdTreeCategoryAjaxSearch(formID);

                return;
            }
        });

        // Ajax filters
        $(".wpfd-content .btnsearchbelow").on('click', function (e) {
            e.preventDefault();
            var formID = '#' + $(this).closest('form').attr('id');
            wpfdTreeCategoryAjaxSearch(formID);
            return false;
        });
    }
    wpfdTreeSearchFileCategoryHandle();

    function wpfdTreeDisplayDownloadedFiles() {
        var fileDownload = $('.wpfd-content.wpfd-content-tree li.ext');
        var linkDownload = $('.dropblock .wpfd_downloadlink');
        var user_login_id = wpfdparams.wpfd_user_login_id;
        if (linkDownload.length) {
            linkDownload.on('click', function () {
                var fileId = $(this).parents('.dropblock').data('id');
                var isDownloadedFile = localStorage.getItem('wpfd_downloaded_file_' + user_login_id + '_' + fileId);
                if (isDownloadedFile === null) {
                    localStorage.setItem('wpfd_downloaded_file_' + user_login_id + '_' + fileId, 'yes');
                    $('.wpfd-file-link[data-id="'+ fileId +'"]').parents('li.ext').addClass('is_downloaded');
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
    wpfdTreeDisplayDownloadedFiles();

    function wpfdTreeDownloadFiles() {
        if (!wpfdparams.offRedirectLinkDownloadImageFile) {
            $('.tree-wpfd-box.png .wpfd_downloadlink, .tree-wpfd-box.jpg .wpfd_downloadlink, .tree-wpfd-box.jpeg .wpfd_downloadlink, .tree-wpfd-box.gif .wpfd_downloadlink').on('click', function (event) {
                event.preventDefault();
                var fileId = $(this).parents('.tree-wpfd-box').attr('data-id');
                var categoryId = $(this).parents('.tree-wpfd-box').attr('data-catid');
                var cloudType = $('.wpfd-content-tree').find('.wpfd_root_category_type').val();

                if (!fileId || !categoryId) {
                    return false;
                }

                window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
            });
        }
    }
    wpfdTreeDownloadFiles();
});


// Tree categories local cache
var wpfdTreeCategoriesLocalCache = {
    data: {},
    remove: function (url) {
        delete wpfdTreeCategoriesLocalCache.data[url];
    },
    exist: function (url) {
        return wpfdTreeCategoriesLocalCache.data.hasOwnProperty(url) && wpfdTreeCategoriesLocalCache.data[url] !== null;
    },
    get: function (url) {
        return wpfdTreeCategoriesLocalCache.data[url];
    },
    set: function (url, cachedData) {
        wpfdTreeCategoriesLocalCache.remove(url);
        wpfdTreeCategoriesLocalCache.data[url] = cachedData;
    }
};

// Tree files local cache
var wpfdTreeFilesLocalCache = {
    data: {},
    remove: function (url) {
        delete wpfdTreeFilesLocalCache.data[url];
    },
    exist: function (url) {
        return wpfdTreeFilesLocalCache.data.hasOwnProperty(url) && wpfdTreeFilesLocalCache.data[url] !== null;
    },
    get: function (url) {
        return wpfdTreeFilesLocalCache.data[url];
    },
    set: function(url, cachedData) {
        wpfdTreeFilesLocalCache.remove(url);
        wpfdTreeFilesLocalCache.data[url] = cachedData;
    }
};