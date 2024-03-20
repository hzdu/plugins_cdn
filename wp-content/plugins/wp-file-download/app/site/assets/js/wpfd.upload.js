/**
 * WP File Download
 *
 * @package WP File Download
 * @author Joomunited
 * @version 1.0
 */


jQuery(document).ready(function ($) {
    if (typeof (Wpfd) === 'undefined') {
        Wpfd = {};
    }

    _wpfd_text = function (text) {
        if (typeof (l10n) !== 'undefined') {
            return l10n[text];
        }
        return text;
    };

    //initUploadBtn();

    function toMB(mb) {
        return mb * 1024 * 1024;
    }

    var allowedExt = wpfd_admin.allowed;
    allowedExt = allowedExt.split(',');
    allowedExt.sort();

    var initUploader = function (currentContainer) {
        // Init the uploader
        var uploader = new Resumable({
            target: wpfd_var.wpfdajaxurl + '?action=wpfd&task=files.upload&upload_from=front',
            query: {
                id_category: $(currentContainer).find('input[name=id_category]').val(),
            },
            fileParameterName: 'file_upload',
            simultaneousUploads: 1,
            maxChunkRetries: 1,
            maxFileSize: toMB(wpfd_admin.maxFileSize),
            maxFileSizeErrorCallback: function (file) {
                alert(file.name + ' ' + _wpfd_text('is too large, please upload file(s) less than ') + wpfd_admin.maxFileSize + 'Mb!');
            },
            chunkSize: wpfd_admin.serverUploadLimit - 50 * 1024, // Reduce 50KB to avoid error
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
                        url: wpfd_var.wpfdajaxurl + '?action=wpfd&task=files.upload',
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
                    url: wpfd_var.wpfdajaxurl + '?action=wpfd&task=categories.createCategoriesDeep',
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
            //load sub categories
            var currentRootCat = currentContainer.find('input[name=id_category]').val()
            var sourcecat = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
            var theme = currentContainer.parents('.wpfd-content.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd_root_category_theme').val();
            var cloneThemeType = currentContainer.parents('.wpfd-content.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd_root_category_clone_theme_type').val();

            var wpfd_tree = (theme == 'tree' || cloneThemeType == 'tree') ? $('.wpfd-content[data-category="'+sourcecat+'"] .wpfd-tree-categories-files') : $('.wpfd-content[data-category="'+sourcecat+'"] .wpfd-foldertree');
            if (wpfd_tree.length) {
                wpfd_tree.jaofiletree({
                    script: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&task=categories.getCats',
                    usecheckboxes: false,
                    root: sourcecat,
                    expanded: parseInt(wpfdparams.allow_category_tree_expanded) === 1 ? true : false
                });
            }

            if (sourcecat != undefined) {
                var categoryAjaxUrl = wpfdparams.wpfdajaxurl + "task=categories.display&view=categories&id=" + currentRootCat + "&top=" + sourcecat;
                setTimeout(function () {
                    $.ajax({
                        url: categoryAjaxUrl,
                        dataType: "json"
                    }).done(function (categories) {
                        var sourcecategories = $(".wpfd-content[data-category=" + sourcecat + "] .wpfd-template-categories").html();
                        if (theme == 'tree' || cloneThemeType == 'tree') {
                            sourcecategories = $("#wpfd-template-tree-categories").html();
                        } else if (cloneThemeType == 'table' || theme == 'table') {
                            sourcecategories = $("#wpfd-template-"+theme+"-categories-" + sourcecat).html();
                        }

                        if (sourcecategories) {
                            var template = Handlebars.compile(sourcecategories);
                            var html = template(categories);

                            if (theme == 'tree' || cloneThemeType == 'tree') {
                                if (categories.categories.length > 0) {
                                    var list     = $(".wpfd-content-tree[data-category=" + sourcecat + "] > ul:not(.breadcrumbs)");
                                    list.find('li.directory').remove();
                                    list.append(html);

                                    var tree_cParents = {};
                                    var current_category_obj = categories.category;
                                    var sourceCatName = $(".wpfd-content-tree[data-category=" + sourcecat + "]").find('.wpfd-category-theme-title').text();
                                    if (sourcecat == 'all_0') {
                                        tree_cParents[sourcecat] = {parent: 0, term_id: 0, name: wpfdparams.translates.wpfd_all_categories};
                                    } else {
                                        tree_cParents[sourcecat] = {parent: 0, term_id: parseInt(sourcecat), name: sourceCatName};
                                    }

                                    tree_cParents[current_category_obj.term_id] = {parent: current_category_obj.parent, term_id: current_category_obj.term_id, name: current_category_obj.name};

                                    var listChildCategories = categories.categories;
                                    for (var i = 0; i < listChildCategories.length; i++) {
                                        var childCategory = listChildCategories[i];
                                        tree_cParents[childCategory.term_id] = {parent: childCategory.parent, term_id: childCategory.term_id, name: childCategory.name};
                                    }

                                    $(".wpfd-content-tree[data-category=" + sourcecat + "] a.catlink:not(.breadcrumbs a.catlink)").unbind('click.cat').bind('click.cat', function (e) {
                                        e.preventDefault();
                                        tree_load($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this));
                                        tree_breadcrum($(this).parents('.wpfd-content-tree').data('category'), $(this).data('idcat'), $(this), tree_cParents);
                                    });
                                }
                            } else {
                                if ($(".wpfd-content[data-category=" + sourcecat + "] .wpfd-categories").length) {
                                    $(".wpfd-content[data-category=" + sourcecat + "] .wpfd-categories").remove();
                                }
                                $(".wpfd-content[data-category=" + sourcecat + "] .wpfd-container-"+theme).prepend(html);

                                if ($(".wpfd-content[data-category=" + sourcecat + "] .wpfd-container-"+theme).find('.wpfd-categories .wpfdcategory.catlink').length == 0) {
                                    var html_category_list = '';
                                    var class_sourcecategories = '';
                                    if (cloneThemeType == 'preview' || theme == 'preview') {
                                        class_sourcecategories = 'preview_category';
                                    }
                                    for (var i = 0; i < categories.categories.length; i++) {
                                        html_category_list += '<a class="wpfdcategory catlink '+class_sourcecategories+'" style="margin : 10px 10px 10px 10px;" href="#" data-idcat="'+categories.categories[i].term_id+'" title="'+categories.categories[i].name+'"><span>'+categories.categories[i].name+'</span><i class="zmdi zmdi-folder wpfd-folder"></i></a>';
                                    }
                                    $(".wpfd-content[data-category=" + sourcecat + "] .wpfd-container-"+theme).find('.wpfd-categories').append(html_category_list);
                                }
                            }

                        }
                    })
                }, 100);
            }
            
            var fileCount  = $(currentContainer).find('.wpfd_process_cancel').length;
            var categoryId = $(currentContainer).find('input[name=id_category]').val();

            $.ajax({
                url: wpfd_var.wpfdajaxurl + '?action=wpfd&task=files.wpfdPendingUploadFiles',
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
                    $(currentContainer).find('#wpfd-upload-messages').append(wpfd_admin.msg_upload_file);
                    $(currentContainer).find('#wpfd-upload-messages').delay(1200).fadeIn(1200, function () {
                        $(currentContainer).find('#wpfd-upload-messages').empty();
                        $(currentContainer).find('.wpfd_process_pause').remove();
                        $(currentContainer).find('.wpfd_process_block').remove();
                    });

                    // Call list files when using show upload form option
                    if (currentContainer.parent('.wpfd-upload-form').length) {
                        var sourcecat         = currentContainer.parents('.wpfd-content.wpfd-content-multi').data('category');
                        var ordering          = currentContainer.parents('.wpfd-content.wpfd-content-multi[data-category=' + sourcecat + ']').find('#current_ordering_' + sourcecat).val();
                        var orderingDirection = currentContainer.parents('.wpfd-content.wpfd-content-multi[data-category=' + sourcecat + ']').find('#current_ordering_direction_' + sourcecat).val();
                        if (typeof ordering === 'undefined') {
                            ordering = 'ordering';
                        }
                        if (typeof orderingDirection === 'undefined') {
                            orderingDirection = 'asc';
                        }
                        var params = $.param({
                            task: 'files.display',
                            view: 'files',
                            id: sourcecat,
                            rootcat: sourcecat,
                            orderCol: ordering,
                            orderDir: orderingDirection
                        });
                        $.ajax({
                            url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&' + params,
                            dataType: 'json'
                        }).done(function (content) {
                            // Default theme
                            if (currentContainer.parents('.wpfd-content-default.wpfd-content-multi[data-category=' + sourcecat + ']').length) {
                                if(content.files.length) {
                                    currentContainer.parents('.wpfd-content-default.wpfd-content-multi[data-category=' + sourcecat + ']').find('.default-download-category').removeClass('display-download-category');
                                } else {
                                    currentContainer.parents('.wpfd-content-default.wpfd-content-multi[data-category=' + sourcecat + ']').find('.default-download-category').addClass('display-download-category');
                                }
                                var sourcefiles = currentContainer.parents('.wpfd-content-default.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd-template-files').html();
                                var template    = Handlebars.compile(sourcefiles);
                                var html        = template(content);
                                html            = $('<textarea/>').html(html).val();
                                $('.wpfd-content-default.wpfd-content-multi[data-category=' + sourcecat + '] + .wpfd-pagination').remove();
                                currentContainer.parents('.wpfd-content-default.wpfd-content-multi[data-category=' + sourcecat + ']').after(content.pagination);
                                delete content.pagination;

                                currentContainer.parents('.wpfd-content-default.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd-container-default .wpfd_list').remove();
                                currentContainer.parents('.wpfd-content-default.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd-upload-form').before(html);

                                if (typeof wpfdColorboxInit !== 'undefined') {
                                    wpfdColorboxInit();
                                }
                                default_init_pagination($('.wpfd-content-default[data-category=' + sourcecat + '] + .wpfd-pagination'));

                                // Display downloaded files
                                wpfdDefaultDisplayDownloadedFiles();
                                wpfdDefaultDownloadFiles();
                            } else if (currentContainer.parents('.wpfd-content-ggd.wpfd-content-multi[data-category=' + sourcecat + ']').length) {
                                if (content.files.length) {
                                    $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]  .ggd-download-category").removeClass("display-download-category");
                                } else {
                                    $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]  .ggd-download-category").addClass("display-download-category");
                                }
                                $('.wpfd-content-ggd.wpfd-content-multi[data-category=' + sourcecat + '] + .wpfd-pagination').remove();
                                $(".wpfd-content-ggd[data-category=" + sourcecat + "]").after(content.pagination);
                                delete content.pagination;
                                var sourcefiles = $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-template-files").html();
                                var template    = Handlebars.compile(sourcefiles);
                                var html        = template(content);
                                html            = $('<textarea/>').html(html).val();
                                $('.wpfd-content-ggd.wpfd-content-multi[data-category=' + sourcecat + '] .wpfd-container-ggd .wpfd_list').remove();
                                $(".wpfd-content-ggd[data-category=" + sourcecat + "] .wpfd-container-ggd .wpfd-upload-form").before(html);
                                ggdInitClickFile();
                                gdd_init_pagination($('.wpfd-content-ggd[data-category=' + sourcecat + '] + .wpfd-pagination'));

                                // Display downloaded files
                                wpfdGgdDisplayDownloadedFiles();
                                wpfdGgdDownloadFiles();
                            } else if (currentContainer.parents('.wpfd-content-table.wpfd-content-multi[data-category=' + sourcecat + ']').length) {
                                var container = $(".wpfd-content-table.wpfd-content-multi[data-category=" + sourcecat + "]");
                                if (content.files.length) {
                                    container.find(".table-download-category").removeClass("display-download-category");
                                } else {
                                    container.find(".table-download-category").addClass("display-download-category");
                                }
                                $(".wpfd-content-multi[data-category=" + sourcecat + "] + .wpfd-pagination").remove();
                                $(".wpfd-content-multi[data-category=" + sourcecat + "]").after(content.pagination);
                                delete content.pagination;
                                var tpltable_source = container.parents().find("#wpfd-template-table-" + sourcecat).html();
                                var template_table  = Handlebars.compile(tpltable_source);
                                var html            = template_table(content);
                                $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").empty();
                                $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").append(html);
                                $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").trigger('change');
                                $(".wpfd-content-multi[data-category=" + sourcecat + "] .mediaTableMenu").find('input').trigger('change');
                                if (typeof wpfdColorboxInit !== 'undefined') {
                                    wpfdColorboxInit();
                                }
                                table_init_pagination($('.wpfd-content-table[data-category=' + sourcecat + '] + .wpfd-pagination'));

                                // Display downloaded files
                                wpfdTableDisplayDownloadedFiles();
                                wpfdTableDownloadFiles();
                            } else if (currentContainer.parents('.wpfd-content-tree.wpfd-content-multi[data-category=' + sourcecat + ']').length) {
                                if (content.files.length) {
                                    $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").removeClass("display-download-category");
                                } else {
                                    $(".wpfd-content-tree[data-category=" + sourcecat + "] .tree-download-category").addClass("display-download-category");
                                }

                                var template = Handlebars.compile(tree_sourcefiles);
                                var html     = template(content);
                                html         = $('<textarea/>').html(html).val();
                                var list     = $(".wpfd-content-tree[data-category=" + sourcecat + "] > ul:not(.breadcrumbs)");
                                list.find('li.ext').remove();
                                list.append(html);
                                treeInitClickFile();

                                // Display downloaded files
                                wpfdTreeDisplayDownloadedFiles();
                                wpfdTreeDownloadFiles();
                            } else if (currentContainer.parents('.wpfd-content-preview.wpfd-content-multi[data-category=' + sourcecat + ']').length) {
                                if (content.files.length) {
                                    $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]  .preview-download-category").removeClass("display-download-category");
                                } else {
                                    $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]  .preview-download-category").addClass("display-download-category");
                                }
                                $('.wpfd-content-preview.wpfd-content-multi[data-category=' + sourcecat + '] + .wpfd-pagination').remove();
                                $(".wpfd-content-preview[data-category=" + sourcecat + "]").after(content.pagination);
                                delete content.pagination;
                                var sourcefiles = $(".wpfd-content-preview.wpfd-content-multi[data-category=" + sourcecat + "]  .wpfd-template-files").html();
                                var template    = Handlebars.compile(sourcefiles);
                                var html        = template(content);
                                html            = $('<textarea/>').html(html).val();
                                $('.wpfd-content-preview.wpfd-content-multi[data-category=' + sourcecat + '] .wpfd-container-preview .wpfd_list').remove();
                                $(".wpfd-content-preview[data-category=" + sourcecat + "] .wpfd-container-preview .wpfd-upload-form").before(html);

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

                                previewInitClickFile();
                                preview_init_pagination($('.wpfd-content-preview[data-category=' + sourcecat + '] + .wpfd-pagination'));

                                // Display downloaded files
                                wpfdPreviewDisplayDownloadedFiles();

                                // Download file(s)
                                wpfdPreviewDownloadFiles();
                            } else {
                                // Clone themes
                                var $cloneThemeName = currentContainer.parents('.wpfd-content.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd_root_category_theme').val();
                                var $cloneRootThemeType = currentContainer.parents('.wpfd-content.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd_root_category_clone_theme_type').val();

                                if ($cloneRootThemeType === 'default') {
                                    if(content.files.length) {
                                        currentContainer.parents('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + ']').find('.'+ $cloneThemeName +'-download-category').removeClass('display-download-category');
                                    } else {
                                        currentContainer.parents('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + ']').find('.'+ $cloneThemeName +'-download-category').addClass('display-download-category');
                                    }
                                    var sourcefiles = currentContainer.parents('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd-template-files').html();
                                    var template    = Handlebars.compile(sourcefiles);
                                    var html        = template(content);
                                    html            = $('<textarea/>').html(html).val();
                                    $('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + '] + .wpfd-pagination').remove();
                                    currentContainer.parents('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + ']').after(content.pagination);
                                    delete content.pagination;

                                    currentContainer.parents('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd-container-'+ $cloneThemeName +' .wpfd_list').remove();
                                    currentContainer.parents('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + ']').find('.wpfd-upload-form').before(html);

                                    if (typeof wpfdColorboxInit !== 'undefined') {
                                        wpfdColorboxInit();
                                    }
                                    default_clone_theme_init_pagination($('.wpfd-content-'+ $cloneThemeName +'[data-category=' + sourcecat + '] + .wpfd-pagination'), $cloneThemeName);

                                    // Display downloaded files
                                    wpfdDefaultCloneThemeDisplayDownloadedFiles($cloneThemeName);
                                    wpfdDefaultCloneThemeDownloadFiles($cloneThemeName);
                                } else if ($cloneRootThemeType === 'ggd') {
                                    if (content.files.length) {
                                        $(".wpfd-content-"+ $cloneThemeName +".wpfd-content-multi[data-category=" + sourcecat + "] ."+ $cloneThemeName +"-download-category").removeClass("display-download-category");
                                    } else {
                                        $(".wpfd-content-"+ $cloneThemeName +".wpfd-content-multi[data-category=" + sourcecat + "] ."+ $cloneThemeName +"-download-category").addClass("display-download-category");
                                    }
                                    $('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + '] + .wpfd-pagination').remove();
                                    $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + sourcecat + "]").after(content.pagination);
                                    delete content.pagination;
                                    var sourcefiles = $(".wpfd-content-"+ $cloneThemeName +".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-template-files").html();
                                    var template    = Handlebars.compile(sourcefiles);
                                    var html        = template(content);
                                    html            = $('<textarea/>').html(html).val();
                                    $('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + '] .wpfd-container-'+ $cloneThemeName +' .wpfd_list').remove();
                                    $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + sourcecat + "] .wpfd-container-"+ $cloneThemeName +" .wpfd-upload-form").before(html);
                                    ggdCloneThemeInitClickFile($cloneThemeName);
                                    gdd_clone_theme_init_pagination($('.wpfd-content-'+ $cloneThemeName +'[data-category=' + sourcecat + '] + .wpfd-pagination'), $cloneThemeName);

                                    // Display downloaded files
                                    wpfdGgdCloneThemeDisplayDownloadedFiles($cloneThemeName);
                                    wpfdGgdCloneThemeDownloadFiles($cloneThemeName);
                                } else if ($cloneRootThemeType === 'preview') {
                                    if (content.files.length) {
                                        $(".wpfd-content-"+ $cloneThemeName +".wpfd-content-multi[data-category=" + sourcecat + "] ."+ $cloneThemeName +"-download-category").removeClass("display-download-category");
                                    } else {
                                        $(".wpfd-content-"+ $cloneThemeName +".wpfd-content-multi[data-category=" + sourcecat + "] ."+ $cloneThemeName +"-download-category").addClass("display-download-category");
                                    }
                                    $('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + '] + .wpfd-pagination').remove();
                                    $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + sourcecat + "]").after(content.pagination);
                                    delete content.pagination;
                                    var sourcefiles = $(".wpfd-content-"+ $cloneThemeName +".wpfd-content-multi[data-category=" + sourcecat + "] .wpfd-template-files").html();
                                    var template    = Handlebars.compile(sourcefiles);
                                    var html        = template(content);
                                    html            = $('<textarea/>').html(html).val();
                                    $('.wpfd-content-'+ $cloneThemeName +'.wpfd-content-multi[data-category=' + sourcecat + '] .wpfd-container-'+ $cloneThemeName +' .wpfd_list').remove();
                                    $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + sourcecat + "] .wpfd-container-"+ $cloneThemeName +" .wpfd-upload-form").before(html);

                                    // View files
                                    if (typeof (content.fileview) !== 'undefined' && content.fileview.length) {
                                        content.fileview.forEach(function (viewFile) {
                                            var preview_dropblock = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + sourcecat + "] .wpfd-container-"+ $cloneThemeName +" .wpfd-file-link[data-id='"+ viewFile.id +"'] .dropblock");
                                            if (viewFile.view === true) {
                                                preview_dropblock.css({'background-image': 'url('+ viewFile.link +')'});
                                                preview_dropblock.addClass(viewFile.view_class);
                                            } else {
                                                preview_dropblock.addClass('wpfd-view-default');
                                            }
                                        });
                                    }

                                    previewCloneThemeInitClickFile($cloneThemeName);
                                    preview_clone_theme_init_pagination($('.wpfd-content-'+ $cloneThemeName +'[data-category=' + sourcecat + '] + .wpfd-pagination'), $cloneThemeName);

                                    // Display downloaded files
                                    wpfdPreviewCloneThemeDisplayDownloadedFiles($cloneThemeName);
                                    wpfdPreviewCloneThemeDownloadFiles($cloneThemeName);
                                } else if ($cloneRootThemeType === 'table') {
                                    var container = $(".wpfd-content-"+ $cloneThemeName +".wpfd-content-multi[data-category=" + sourcecat + "]");
                                    if (content.files.length) {
                                        container.find("."+ $cloneThemeName +"-download-category").removeClass("display-download-category");
                                    } else {
                                        container.find("."+ $cloneThemeName +"-download-category").addClass("display-download-category");
                                    }
                                    $(".wpfd-content-multi[data-category=" + sourcecat + "] + .wpfd-pagination").remove();
                                    $(".wpfd-content-multi[data-category=" + sourcecat + "]").after(content.pagination);
                                    delete content.pagination;
                                    var tpltable_source = container.parents().find("#wpfd-template-"+ $cloneThemeName +"-" + sourcecat).html();
                                    var template_table  = Handlebars.compile(tpltable_source);
                                    var html            = template_table(content);
                                    $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").empty();
                                    $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").append(html);
                                    $(".wpfd-content-multi[data-category=" + sourcecat + "] table tbody").trigger('change');
                                    $(".wpfd-content-multi[data-category=" + sourcecat + "] .mediaTableMenu").find('input').trigger('change');
                                    if (typeof wpfdColorboxInit !== 'undefined') {
                                        wpfdColorboxInit();
                                    }
                                    table_clone_theme_init_pagination($('.wpfd-content-'+ $cloneThemeName +'[data-category=' + sourcecat + '] + .wpfd-pagination'), $cloneThemeName);

                                    // Display downloaded files
                                    wpfdTableCloneThemeDisplayDownloadedFiles($cloneThemeName);
                                    wpfdTableCloneThemeDownloadFiles($cloneThemeName);
                                } else if ($cloneRootThemeType === 'tree') {
                                    if (content.files.length) {
                                        $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + sourcecat + "] ."+ $cloneThemeName +"-download-category").removeClass("display-download-category");
                                    } else {
                                        $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + sourcecat + "] ."+ $cloneThemeName +"-download-category").addClass("display-download-category");
                                    }

                                    var tree_clonethemesourcefiles = $("#wpfd-template-"+ $cloneThemeName +"-files").html();
                                    var template = Handlebars.compile(tree_clonethemesourcefiles);
                                    var html     = template(content);
                                    html         = $('<textarea/>').html(html).val();
                                    var list     = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + sourcecat + "] > ul:not(.breadcrumbs)");
                                    list.find('li.ext').remove();
                                    list.append(html);
                                    treeCloneThemeInitClickFile($cloneThemeName);

                                    // Display downloaded files
                                    wpfdTreeCloneThemeDisplayDownloadedFiles($cloneThemeName);
                                    wpfdTreeCloneThemeDownloadFiles($cloneThemeName);
                                }
                            }
                        });
                    }

                    // Call display files
                    if (currentContainer.find('#wpfd-upload-display-files').length) {
                        var randContainer = currentContainer.data('container');
                        $.ajax({
                            url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&task=files.displayFilesAccordingToEachUploadActions',
                            method: 'POST',
                            dataType: 'json',
                            data: {
                                upload_form_container: randContainer,
                                id_category: categoryId,
                            },
                            success: function (res) {
                                if (res.success === true) {
                                    var html = res.data;
                                    currentContainer.find('#wpfd-results').empty();
                                    currentContainer.find('#wpfd-results').append(html);
                                    if (typeof wpfdColorboxInit !== 'undefined') {
                                        wpfdColorboxInit();
                                    }
                                    displayLimitedFiles();
                                }
                            }
                        });
                    }
                }
            });
            
            var wpfd_upload_type = $(currentContainer).find('input[name=wpfd_upload_type]');
            if (wpfd_upload_type.length) {
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&task=categories.getTreeCats',
                    method: 'POST',
                    success: function (res) {
                        if (res.success === true) {
                            $(currentContainer).find('#wpfd-upload-category-target').html(res.data);
                        }
                    }
                });
            }
        });

        uploader.assignBrowse($(currentContainer).find('#upload_button'));
        uploader.assignBrowse($(currentContainer).find('#upload_folder_button'), true);
        uploader.assignDrop($(currentContainer).find('.jsWpfdFrontUpload'));
    }

    var containers = $('div[class*=wpfdUploadForm]');
    if (containers.length > 0) {
        containers.each(function(i, el) {
            initUploader($(el));

            // Get target category
            if ($(el).find('#wpfd-upload-category-target').length) {
                $(el).find('#wpfd-upload-category-target').on('change', function () {
                    var category_target_id = $(this).val();
                    var category_target_type = $(this).find('option:selected').data('type');
                    var containerData      = $(el).data('container');
                    $(this).parents('.jsWpfdFrontUpload').find('#id_category').val(category_target_id);
                    $(this).parents('.jsWpfdFrontUpload').find('#category_type').val(category_target_type);
                });
            }
        });
    }

    displayLimitedFiles();

    var sourcefile          = $("#wpfd-template-ggd-box").html();
    var previewsourcefile   = $("#wpfd-template-preview-box").html();
    var ggd_root_cat        = $('.wpfd-content-ggd').data('category');
    var preview_root_cat    = $('.wpfd-content-preview').data('category');
    var tree_sourcefiles    = $("#wpfd-template-tree-files").html();
    var tree_sourcefile     = $("#wpfd-template-tree-box").html();

    function default_init_pagination($this) {

        var number = $this.find('a:not(.current)');

        var wrap = $this.prev('.wpfd-content-default');

        var sourcecat = wrap.data('category');
        var current_category = wrap.find('#current_category_' + sourcecat).val();
        // var $ = jQuery;
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

                window.history.pushState('', document.title, pathname + '#' + current_sourcecat + '-' + category + '-wpfd-' + category_slug + '-p' + page_number);

                $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-container-default .wpfd_list").remove();
                $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-container-default").append($('#wpfd-loading-wrap').html());

                var params = $.param({
                    task: 'files.display',
                    view: 'files',
                    id: current_category,
                    rootcat: current_sourcecat,
                    page: page_number,
                    orderCol: ordering,
                    orderDir: orderingDirection
                });

                //Get files
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&' + params,
                    dataType: "json",
                    beforeSend: function () {
                        $('html, body').animate({scrollTop: $(".wpfd-content[data-category=" + current_sourcecat + "]").offset().top}, 'fast');
                    }
                }).done(function (content) {
                    delete content.category;
                    wrap.next('.wpfd-pagination').remove();
                    wrap.after(content.pagination);
                    delete content.pagination;
                    var sourcefiles = $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-template-files").html()
                    var template = Handlebars.compile(sourcefiles);
                    var html = template(content);

                    if ($(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-default .wpfd-upload-form").length) {
                        $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-default .wpfd-upload-form").before(html);
                    } else {
                        $(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-default").append(html);
                    }

                    if (typeof wpfdColorboxInit !== 'undefined') {
                        wpfdColorboxInit();
                    }
                    default_init_pagination(wrap.next('.wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-default.wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-container-default"));
                    wpfdDefaultDisplayDownloadedFiles();
                    wpfdDefaultDownloadFiles();
                });
            }
        });
    }

    function default_clone_theme_init_pagination($this, $themeName) {
        var number = $this.find('a:not(.current)');
        var wrap = $this.prev('.wpfd-content-' + $themeName);
        var sourcecat = wrap.data('category');
        var current_category = wrap.find('#current_category_' + sourcecat).val();
        number.unbind('click').bind('click', function () {
            var page_number = $(this).attr('data-page');
            var current_sourcecat = $(this).attr('data-sourcecat');
            var wrap = $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]");
            var current_category = $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
            if (typeof page_number !== 'undefined') {
                var pathname = window.location.href.replace(window.location.hash, '');
                var category = $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
                var category_slug = $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_category_slug_' + current_sourcecat).val();
                var ordering = $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_ordering_' + current_sourcecat).val();
                var orderingDirection = $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]").find('#current_ordering_direction_' + current_sourcecat).val();

                window.history.pushState('', document.title, pathname + '#' + current_sourcecat + '-' + category + '-wpfd-' + category_slug + '-p' + page_number);

                $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-container-"+ $themeName +" .wpfd_list").remove();
                $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-container-"+ $themeName +"").append($('#wpfd-loading-wrap').html());

                var params = $.param({
                    task: 'files.display',
                    view: 'files',
                    id: current_category,
                    rootcat: current_sourcecat,
                    page: page_number,
                    orderCol: ordering,
                    orderDir: orderingDirection
                });

                //Get files
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&' + params,
                    dataType: "json",
                    beforeSend: function () {
                        $('html, body').animate({scrollTop: $(".wpfd-content[data-category=" + current_sourcecat + "]").offset().top}, 'fast');
                    }
                }).done(function (content) {
                    delete content.category;
                    wrap.next('.wpfd-pagination').remove();
                    wrap.after(content.pagination);
                    delete content.pagination;
                    var sourcefiles = $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-template-files").html()
                    var template = Handlebars.compile(sourcefiles);
                    var html = template(content);

                    if ($(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-"+ $themeName +" .wpfd-upload-form").length) {
                        $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-"+ $themeName +" .wpfd-upload-form").before(html);
                    } else {
                        $(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "] .wpfd-container-"+ $themeName +"").append(html);
                    }

                    if (typeof wpfdColorboxInit !== 'undefined') {
                        wpfdColorboxInit();
                    }
                    default_clone_theme_init_pagination(wrap.next('.wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-"+ $themeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-container-"+ $themeName +""));
                    wpfdDefaultCloneThemeDisplayDownloadedFiles($themeName);
                    wpfdDefaultCloneThemeDownloadFiles($themeName);
                });
            }
        });
    }

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

                window.history.pushState('', document.title, pathname + '#' + current_sourcecat + '-' + category + '-' + category_slug + '-p' + page_number);

                $(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd .wpfd_list").remove();
                $(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd").append($('#wpfd-loading-wrap').html());

                var params = $.param({
                    task: 'files.display',
                    view: 'files',
                    id: current_category,
                    rootcat: current_sourcecat,
                    page: page_number,
                    orderCol: ordering,
                    orderDir: orderingDirection
                });

                //Get files
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&' + params,
                    dataType: "json",
                    beforeSend: function () {
                        $('html, body').animate({scrollTop: $(".wpfd-content[data-category=" + current_sourcecat + "]").offset().top}, 'fast');
                    }
                }).done(function (content) {
                    delete content.category;
                    wrap.next('.wpfd-pagination').remove();
                    wrap.after(content.pagination);
                    delete content.pagination;
                    var sourcefiles = $(".wpfd-content-ggd.wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-template-files").html();
                    var template = Handlebars.compile(sourcefiles);
                    var html = template(content);

                    if ($(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd .wpfd-upload-form").length) {
                        $(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd .wpfd-upload-form").before(html);
                    } else {
                        $(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd").append(html);
                    }
                    ggdInitClickFile();

                    gdd_init_pagination(wrap.next('.wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd"));
                    wpfdGgdDisplayDownloadedFiles();
                    wpfdGgdDownloadFiles();
                });
            }
        });
    }

    function gdd_clone_theme_init_pagination($this, $cloneThemeName) {
        var number = $this.find(':not(.current)');
        var wrap = $this.prev('.wpfd-content-' + $cloneThemeName);
        var sourcecat = wrap.data('category');
        var current_category = wrap.find('#current_category_' + sourcecat).val();

        number.unbind('click').bind('click', function () {
            var page_number = $(this).attr('data-page');
            var current_sourcecat = $(this).attr('data-sourcecat');
            var wrap = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]");
            var current_category = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
            if (typeof page_number !== 'undefined') {
                var pathname = window.location.href.replace(window.location.hash, '');
                var category = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
                var category_slug = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]").find('#current_category_slug_' + current_sourcecat).val();
                var ordering = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]").find('#current_ordering_' + current_sourcecat).val();
                var orderingDirection = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]").find('#current_ordering_direction_' + current_sourcecat).val();

                window.history.pushState('', document.title, pathname + '#' + current_sourcecat + '-' + category + '-' + category_slug + '-p' + page_number);

                $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName +" .wpfd_list").remove();
                $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName).append($('#wpfd-loading-wrap').html());

                var params = $.param({
                    task: 'files.display',
                    view: 'files',
                    id: current_category,
                    rootcat: current_sourcecat,
                    page: page_number,
                    orderCol: ordering,
                    orderDir: orderingDirection
                });

                //Get files
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&' + params,
                    dataType: "json",
                    beforeSend: function () {
                        $('html, body').animate({scrollTop: $(".wpfd-content[data-category=" + current_sourcecat + "]").offset().top}, 'fast');
                    }
                }).done(function (content) {
                    delete content.category;
                    wrap.next('.wpfd-pagination').remove();
                    wrap.after(content.pagination);
                    delete content.pagination;
                    var sourcefiles = $(".wpfd-content-"+ $cloneThemeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-template-files").html();
                    var template = Handlebars.compile(sourcefiles);
                    var html = template(content);

                    if ($(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName +" .wpfd-upload-form").length) {
                        $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName +" .wpfd-upload-form").before(html);
                    } else {
                        $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName).append(html);
                    }
                    ggdCloneThemeInitClickFile($cloneThemeName);
                    gdd_clone_theme_init_pagination(wrap.next('.wpfd-pagination'), $cloneThemeName);
                    wpfd_remove_loading($(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName));
                    wpfdGgdCloneThemeDisplayDownloadedFiles($cloneThemeName);
                    wpfdGgdCloneThemeDownloadFiles($cloneThemeName);
                });
            }
        });
    }

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

                window.history.pushState('', document.title, pathname + '#' + current_sourcecat + '-' + category + '-' + category_slug + '-p' + page_number);

                $(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview .wpfd_list").remove();
                $(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview").append($('#wpfd-loading-wrap').html());

                var params = $.param({
                    task: 'files.display',
                    view: 'files',
                    id: current_category,
                    rootcat: current_sourcecat,
                    page: page_number,
                    orderCol: ordering,
                    orderDir: orderingDirection
                });

                //Get files
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&' + params,
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

                    if ($(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview .wpfd-upload-form").length) {
                        $(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview .wpfd-upload-form").before(html);
                    } else {
                        $(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview").append(html);
                    }
                    previewInitClickFile();

                    // View files
                    if (typeof (content.fileview) !== 'undefined' && content.fileview.length) {
                        content.fileview.forEach(function (viewFile) {
                            var preview_dropblock = $(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview:not(wpfd-results .wpfd-container-preview) .wpfd-file-link[data-id='"+ viewFile.id +"'] .dropblock");
                            if (viewFile.view === true) {
                                preview_dropblock.css({'background-image': 'url('+ viewFile.link +')'});
                                preview_dropblock.addClass(viewFile.view_class);
                            } else {
                                preview_dropblock.addClass('wpfd-view-default');
                            }
                        });
                    }

                    preview_init_pagination(wrap.next('.wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-preview[data-category=" + current_sourcecat + "] .wpfd-container-preview"));
                    wpfdPreviewDisplayDownloadedFiles();

                    // Download file(s)
                    wpfdPreviewDownloadFiles();
                });
            }
        });
    }

    function preview_clone_theme_init_pagination($this, $cloneThemeName) {
        var number = $this.find(':not(.current)');
        var wrap = $this.prev('.wpfd-content-' + $cloneThemeName);
        var sourcecat = wrap.data('category');
        var current_category = wrap.find('#current_category_' + sourcecat).val();

        number.unbind('click').bind('click', function () {
            var page_number = $(this).attr('data-page');
            var current_sourcecat = $(this).attr('data-sourcecat');
            var wrap = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]");
            var current_category = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
            if (typeof page_number !== 'undefined') {
                var pathname = window.location.href.replace(window.location.hash, '');
                var category = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]").find('#current_category_' + current_sourcecat).val();
                var category_slug = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]").find('#current_category_slug_' + current_sourcecat).val();
                var ordering = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]").find('#current_ordering_' + current_sourcecat).val();
                var orderingDirection = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "]").find('#current_ordering_direction_' + current_sourcecat).val();

                window.history.pushState('', document.title, pathname + '#' + current_sourcecat + '-' + category + '-' + category_slug + '-p' + page_number);

                $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName +" .wpfd_list").remove();
                $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName +"").append($('#wpfd-loading-wrap').html());

                var params = $.param({
                    task: 'files.display',
                    view: 'files',
                    id: current_category,
                    rootcat: current_sourcecat,
                    page: page_number,
                    orderCol: ordering,
                    orderDir: orderingDirection
                });

                //Get files
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&' + params,
                    dataType: "json",
                    beforeSend: function () {
                        $('html, body').animate({scrollTop: $(".wpfd-content[data-category=" + current_sourcecat + "]").offset().top}, 'fast');
                    }
                }).done(function (content) {
                    delete content.category;
                    wrap.next('.wpfd-pagination').remove();
                    wrap.after(content.pagination);
                    delete content.pagination;
                    var sourcefiles = $(".wpfd-content-"+ $cloneThemeName +".wpfd-content-multi[data-category=" + current_sourcecat + "]  .wpfd-template-files").html();
                    var template = Handlebars.compile(sourcefiles);
                    var html = template(content);

                    if ($(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName +" .wpfd-upload-form").length) {
                        $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName +" .wpfd-upload-form").before(html);
                    } else {
                        $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName +"").append(html);
                    }
                    previewCloneThemeInitClickFile($cloneThemeName);

                    // View files
                    if (typeof (content.fileview) !== 'undefined' && content.fileview.length) {
                        content.fileview.forEach(function (viewFile) {
                            var preview_dropblock = $(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName +":not(wpfd-results .wpfd-container-"+ $cloneThemeName +") .wpfd-file-link[data-id='"+ viewFile.id +"'] .dropblock");
                            if (viewFile.view === true) {
                                preview_dropblock.css({'background-image': 'url('+ viewFile.link +')'});
                                preview_dropblock.addClass(viewFile.view_class);
                            } else {
                                preview_dropblock.addClass('wpfd-view-default');
                            }
                        });
                    }

                    preview_clone_theme_init_pagination(wrap.next('.wpfd-pagination'), $cloneThemeName);
                    wpfd_remove_loading($(".wpfd-content-"+ $cloneThemeName +"[data-category=" + current_sourcecat + "] .wpfd-container-"+ $cloneThemeName +""));
                    wpfdPreviewCloneThemeDisplayDownloadedFiles($cloneThemeName);
                    wpfdPreviewCloneThemeDownloadFiles($cloneThemeName);
                });
            }
        });
    }

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
                    orderDir: orderingDirection
                });

                //Get files
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&' + params,
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
                    wpfdTableDisplayDownloadedFiles();
                    wpfdTableDownloadFiles();
                });
            }

        });
    }

    function table_clone_theme_init_pagination($this, $cloneThemeName) {

        var number = $this.find('a:not(.current)');
        var wrap = $this.prev('.wpfd-content-' + $cloneThemeName);
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
                    orderDir: orderingDirection
                });

                //Get files
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&' + params,
                    dataType: "json",
                    beforeSend: function () {
                        $('html, body').animate({scrollTop: wrap.offset().top}, 'fast');
                    }
                }).done(function (content) {

                    delete content.category;
                    wrap.next('.wpfd-pagination').remove();
                    wrap.after(content.pagination);
                    delete content.pagination;
                    var tpltable_source = wrap.parents().find("#wpfd-template-"+ $cloneThemeName +"-" + current_sourcecat).html();
                    var template_table = Handlebars.compile(tpltable_source);
                    var html = template_table(content);
                    $(".wpfd-content-multi[data-category=" + current_sourcecat + "] table tbody").append(html);
                    $(".wpfd-content-multi[data-category=" + current_sourcecat + "] table tbody").trigger('change');
                    $(".wpfd-content-multi[data-category=" + current_sourcecat + "] .mediaTableMenu").find('input').trigger('change');

                    if (typeof wpfdColorboxInit !== 'undefined') {
                        wpfdColorboxInit();
                    }
                    table_clone_theme_init_pagination(wrap.next('.wpfd-pagination'), $cloneThemeName);
                    wpfd_remove_loading($(".wpfd-content-multi"));
                    wpfdTableCloneThemeDisplayDownloadedFiles($cloneThemeName);
                    wpfdTableCloneThemeDownloadFiles($cloneThemeName);
                });
            }

        });
    }

    function ggdInitClickFile() {
        $('.wpfd-content .wpfd-file-link').unbind('click').click(function (e) {
            var atthref = $(this).attr('href');
            if (atthref !== '#') {
                return;
            }
            e.preventDefault();
            var fileid = $(this).data('id');
            var categoryid = $(this).data('category_id');
            $.ajax({
                url: wpfd_var.wpfdajaxurl + "?juwpfisadmin=false&action=wpfd&task=file.display&view=file&id=" + fileid + "&categoryid=" + categoryid + "&rootcat=" + ggd_root_cat,
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
                    box.addClass(file.file.ext);
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

    function ggdCloneThemeInitClickFile($cloneThemeName) {
        $('.wpfd-content .wpfd-file-link').unbind('click').click(function (e) {
            var atthref = $(this).attr('href');
            if (atthref !== '#') {
                return;
            }
            e.preventDefault();
            var fileid = $(this).data('id');
            var categoryid = $(this).data('category_id');
            ggd_clone_theme_root_cat = $('.wpfd-content-' + $cloneThemeName).data('category');
            $.ajax({
                url: wpfd_var.wpfdajaxurl + "?juwpfisadmin=false&action=wpfd&task=file.display&view=file&id=" + fileid + "&categoryid=" + categoryid + "&rootcat=" + ggd_clone_theme_root_cat,
                dataType: "json",
                beforeSend: function() {
                    // setting a timeout
                    if($('body').has('wpfd-'+ $cloneThemeName +'-box-loader') !== true) {
                        $('body').append('<div class="wpfd-'+ $cloneThemeName +'-box-loader"></div>');
                    }
                }
            }).done(function (file) {
                var clonesourcefile = $("#wpfd-template-"+ $cloneThemeName +"-box").html();
                var template = Handlebars.compile(clonesourcefile);
                var html = template(file);
                var box = $("#wpfd-"+ $cloneThemeName +"-box");
                $('.wpfd-'+ $cloneThemeName +'-box-loader').each(function () {
                    $(this).remove();
                });
                if (box.length === 0) {
                    $('body').append('<div id="wpfd-'+ $cloneThemeName +'-box" style="display: none;"></div>');
                    box = $("#wpfd-"+ $cloneThemeName +"-box");
                }
                box.empty();
                box.prepend(html);
                box.attr('data-id', fileid);
                box.attr('data-catid', categoryid);
                box.attr('class', 'wpfd-ggd-box wpfd-download-box');
                if (typeof (file.file.ext) !== 'undefined') {
                    box.attr('data-type', file.file.ext);
                    box.addClass(file.file.ext);
                }
                box.click(function (e) {
                    if ($(e.target).is('#wpfd-'+ $cloneThemeName +'-box')) {
                        box.hide();
                    }
                    $('#wpfd-'+ $cloneThemeName +'-box').unbind('click.box').bind('click.box', function (e) {
                        if ($(e.target).is('#wpfd-'+ $cloneThemeName +'-box')) {
                            box.hide();
                        }
                    });
                });
                $('#wpfd-'+ $cloneThemeName +'-box .wpfd-close').click(function (e) {
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

                $('body.elementor-default #wpfd-'+ $cloneThemeName +'-box a.wpfd_downloadlink').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var link = $(this).attr('href');
                    window.location.href = link;
                });

                wpfdGgdCloneThemeDisplayDownloadedFiles($cloneThemeName);
                wpfdGgdCloneThemeDownloadFiles($cloneThemeName);
            });
        });
    }

    function previewInitClickFile() {
        $('.wpfd-content .wpfd-file-link').unbind('click').click(function (e) {
            var atthref = $(this).attr('href');
            if (atthref !== '#') {
                return;
            }
            e.preventDefault();
            var fileid = $(this).data('id');
            var categoryid = $(this).data('category_id');
            $.ajax({
                url: wpfd_var.wpfdajaxurl + "?juwpfisadmin=false&action=wpfd&task=file.display&view=file&id=" + fileid + "&categoryid=" + categoryid + "&rootcat=" + preview_root_cat,
                dataType: "json",
                beforeSend: function() {
                    // setting a timeout
                    if($('body').has('wpfd-preview-box-loader') !== true) {
                        $('body').append('<div class="wpfd-preview-box-loader"></div>');
                    }
                }
            }).done(function (file) {
                var template = Handlebars.compile(previewsourcefile);
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

                $('body.elementor-default #wpfd-preview-box a.wpfd_downloadlink').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var link = $(this).attr('href');
                    window.location.href = link;
                });

                wpfdPreviewDisplayDownloadedFiles();

                // Download file(s)
                wpfdPreviewDownloadFiles();
            });
        });
    }

    function previewCloneThemeInitClickFile($cloneThemeName) {
        $('.wpfd-content .wpfd-file-link').unbind('click').click(function (e) {
            var atthref = $(this).attr('href');
            if (atthref !== '#') {
                return;
            }
            e.preventDefault();
            var fileid = $(this).data('id');
            var categoryid = $(this).data('category_id');
            var preview_clone_theme_root_cat = $('.wpfd-content-' + $cloneThemeName).data('category');
            $.ajax({
                url: wpfd_var.wpfdajaxurl + "?juwpfisadmin=false&action=wpfd&task=file.display&view=file&id=" + fileid + "&categoryid=" + categoryid + "&rootcat=" + preview_clone_theme_root_cat,
                dataType: "json",
                beforeSend: function() {
                    // setting a timeout
                    if($('body').has('wpfd-'+ $cloneThemeName +'-box-loader') !== true) {
                        $('body').append('<div class="wpfd-' + $cloneThemeName + '-box-loader"></div>');
                    }
                }
            }).done(function (file) {
                var clonepreviewsourcefile = $("#wpfd-template-"+ $cloneThemeName +"-box").html();
                var template = Handlebars.compile(clonepreviewsourcefile);
                var html = template(file);
                var box = $("#wpfd-"+ $cloneThemeName +"-box");
                $('.wpfd-'+ $cloneThemeName +'-box-loader').each(function () {
                    $(this).remove();
                });
                if (box.length === 0) {
                    $('body').append('<div id="wpfd-'+ $cloneThemeName +'-box" style="display: none;"></div>');
                    box = $("#wpfd-"+ $cloneThemeName +"-box");
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
                    if ($(e.target).is('#wpfd-'+ $cloneThemeName +'-box')) {
                        box.hide();
                    }
                    $('#wpfd-'+ $cloneThemeName +'-box').unbind('click.box').bind('click.box', function (e) {
                        if ($(e.target).is('#wpfd-'+ $cloneThemeName +'-box')) {
                            box.hide();
                        }
                    });
                });
                $('#wpfd-'+ $cloneThemeName +'-box .wpfd-close').click(function (e) {
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

                $('body.elementor-default #wpfd-'+ $cloneThemeName +'-box a.wpfd_downloadlink').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var link = $(this).attr('href');
                    window.location.href = link;
                });

                wpfdPreviewCloneThemeDisplayDownloadedFiles();
            });
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
                url: wpfd_var.wpfdajaxurl + "?juwpfisadmin=false&action=wpfd&task=file.display&view=file&id=" + fileid + "&categoryid=" + categoryid + "&rootcat=" + $(context).attr('data-category'),
                dataType: "json",
                beforeSend: function() {
                    // setting a timeout
                    if($('body').has('wpfd-tree-box-loader') !== true) {
                        $('body').append('<div class="wpfd-tree-box-loader"></div>');
                    }
                }
            }).done(function (file) {
                var template = Handlebars.compile(tree_sourcefile);
                var html = template(file);
                var box = $("#tree-wpfd-box");
                $('.wpfd-tree-box-loader').each(function () {
                    $(this).remove();
                });
                if (box.length === 0) {
                    $('body').append('<div id="tree-wpfd-box" style="display: none;"></div>');
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

    function treeCloneThemeInitClickFile($cloneThemeName) {
        $('.wpfd-content-'+ $cloneThemeName +' .wpfd-file-link').unbind('click').click(function (e) {
            var context = $(this).parents('.wpfd-content')[0];
            var atthref = $(this).attr('href');
            if (atthref !== '#') {
                return;
            }
            e.preventDefault();
            var fileid = $(this).data('id');
            var categoryid = $(this).data('category_id');

            $.ajax({
                url: wpfd_var.wpfdajaxurl + "?juwpfisadmin=false&action=wpfd&task=file.display&view=file&id=" + fileid + "&categoryid=" + categoryid + "&rootcat=" + $(context).attr('data-category'),
                dataType: "json",
                beforeSend: function() {
                    // setting a timeout
                    if($('body').has('wpfd-'+ $cloneThemeName +'-box-loader') !== true) {
                        $('body').append('<div class="wpfd-'+ $cloneThemeName +'-box-loader"></div>');
                    }
                }
            }).done(function (file) {
                var tree_clonethemesourcefile = $("#wpfd-template-"+ $cloneThemeName +"-box").html();
                var template = Handlebars.compile(tree_clonethemesourcefile);
                var html = template(file);
                var box = $("#"+ $cloneThemeName +"-wpfd-box");
                $('.wpfd-'+ $cloneThemeName +'-box-loader').each(function () {
                    $(this).remove();
                });
                if (box.length === 0) {
                    $('body').append('<div id="'+ $cloneThemeName +'-wpfd-box" style="display: none;"></div>');
                    box = $("#"+ $cloneThemeName +"-wpfd-box");
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
                    if ($(e.target).is('#'+ $cloneThemeName +'-wpfd-box')) {
                        box.hide();
                    }
                    $('#'+ $cloneThemeName +'-wpfd-box').unbind('click.box').bind('click.box', function (e) {
                        if ($(e.target).is('#'+ $cloneThemeName +'-wpfd-box')) {
                            box.hide();
                        }
                    });
                });
                $('#'+ $cloneThemeName +'-wpfd-box .wpfd-close').click(function (e) {
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

                $('body.elementor-default #'+ $cloneThemeName +'-wpfd-box a.wpfd_downloadlink').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var link = $(this).attr('href');
                    window.location.href = link;
                });

                wpfdTreeCloneThemeDisplayDownloadedFiles($cloneThemeName);
                wpfdTreeCloneThemeDownloadFiles($cloneThemeName);
            });
        });
    }

    function displayLimitedFiles() {
        var file_limit = $('select[name="limit"]');
        if (file_limit.length) {
            file_limit.on('change', function () {
                var container   = $(this).parents('.file-upload-content').data('container');
                var category_id = $(this).parents('.file-upload-content').find('#id_category').val();
                var limit       = $(this).val();

                // Return limited files
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + '?juwpfisadmin=false&action=wpfd&task=files.displayFilesAccordingToEachUploadActions',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        upload_form_container: container,
                        id_category: category_id,
                        file_limit: limit
                    },
                    success: function (res) {
                        if (res.success === true) {
                            var html = res.data;
                            $('.file-upload-content[data-container="' + container + '"]').find('#wpfd-results').empty();
                            $('.file-upload-content[data-container="' + container + '"]').find('#wpfd-results').append(html);
                            if (typeof wpfdColorboxInit !== 'undefined') {
                                wpfdColorboxInit();
                            }
                            displayLimitedFiles();
                        }
                    }
                });
            });
        }
    }

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

    function wpfdDefaultCloneThemeDisplayDownloadedFiles($themeName) {
        var fileDownload = $('.wpfd-content.wpfd-content-'+ $themeName +' .file');
        var linkDownload = $('.wpfd-content.wpfd-content-'+ $themeName +' .wpfd_downloadlink');
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

    function wpfdDefaultCloneThemeDownloadFiles($themeName) {
        $('.file.png .wpfd_downloadlink, .file.jpg .wpfd_downloadlink, .file.jpeg .wpfd_downloadlink, .file.gif .wpfd_downloadlink').on('click', function (event) {
            event.preventDefault();
            var fileId = $(this).parents('.file').data('id');
            var categoryId = $(this).parents('.file').data('catid');
            var cloudType = $(this).parents('.wpfd-content-' + $themeName).find('.wpfd_root_category_type').val();

            if (!fileId || !categoryId) {
                return false;
            }

            window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
        });
    }

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

    function wpfdGgdCloneThemeDisplayDownloadedFiles($cloneThemeName) {
        var fileDownload = $('.wpfd-content.wpfd-content-'+ $cloneThemeName +' .file');
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

    function wpfdGgdDownloadFiles() {
        $('.wpfd-ggd-box.png .wpfd_downloadlink, .wpfd-ggd-box.jpg .wpfd_downloadlink, .wpfd-ggd-box.jpeg .wpfd_downloadlink, .wpfd-ggd-box.gif .wpfd_downloadlink').on('click', function (event) {
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

    function wpfdGgdCloneThemeDownloadFiles($cloneThemeName) {
        $cloneThemeName = 'ggd';
        $('.wpfd-'+ $cloneThemeName +'-box.png .wpfd_downloadlink, .wpfd-'+ $cloneThemeName +'-box.jpg .wpfd_downloadlink, .wpfd-'+ $cloneThemeName +'-box.jpeg .wpfd_downloadlink, .wpfd-'+ $cloneThemeName +'-box.gif .wpfd_downloadlink').on('click', function (event) {
            event.preventDefault();
            var fileId = $(this).parents('.wpfd-'+ $cloneThemeName +'-box').attr('data-id');
            var categoryId = $(this).parents('.wpfd-'+ $cloneThemeName +'-box').attr('data-catid');
            var cloudType = $('.wpfd-content-'+ $cloneThemeName).find('.wpfd_root_category_type').val();

            if (!fileId || !categoryId) {
                return false;
            }

            window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
        });
    }

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

    function wpfdPreviewCloneThemeDisplayDownloadedFiles($cloneThemeName) {
        var fileDownload = $('.wpfd-content.wpfd-content-'+ $cloneThemeName +' .file');
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

    function wpfdPreviewDownloadFiles() {
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

    function wpfdPreviewCloneThemeDownloadFiles($cloneThemeName) {
        $cloneThemeName = 'preview';
        $('.wpfd-'+ $cloneThemeName +'-box.png .wpfd_downloadlink, .wpfd-'+ $cloneThemeName +'-box.jpg .wpfd_downloadlink, .wpfd-'+ $cloneThemeName +'-box.jpeg .wpfd_downloadlink, .wpfd-'+ $cloneThemeName +'-box.gif .wpfd_downloadlink').on('click', function (event) {
            event.preventDefault();
            var fileId = $(this).parents('.wpfd-'+ $cloneThemeName +'-box').attr('data-id');
            var categoryId = $(this).parents('.wpfd-'+ $cloneThemeName +'-box').attr('data-catid');
            var cloudType = $('.wpfd-content-'+ $cloneThemeName).find('.wpfd_root_category_type').val();

            if (!fileId || !categoryId) {
                return false;
            }

            window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
        });
    }

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

    function wpfdTableCloneThemeDisplayDownloadedFiles($cloneThemeName) {
        var fileDownload = $('.wpfd-content.wpfd-content-'+ $cloneThemeName +' .file');
        var linkDownload = $('.wpfd-content.wpfd-content-'+ $cloneThemeName +' .wpfd_downloadlink');
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

    function wpfdTableCloneThemeDownloadFiles($cloneThemeName) {
        $('.file.png .wpfd_downloadlink, .file.jpg .wpfd_downloadlink, .file.jpeg .wpfd_downloadlink, .file.gif .wpfd_downloadlink').on('click', function (event) {
            event.preventDefault();
            var fileId = $(this).parents('.file').data('id');
            var categoryId = $(this).parents('.file').data('catid');
            var cloudType = $(this).parents('.wpfd-content-' + $cloneThemeName).find('.wpfd_root_category_type').val();

            if (!fileId || !categoryId) {
                return false;
            }

            window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
        });
    }

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

    function wpfdTreeCloneThemeDisplayDownloadedFiles($cloneThemeName) {
        var fileDownload = $('.wpfd-content.wpfd-content-'+ $cloneThemeName +' li.ext');
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

    function wpfdTreeDownloadFiles() {
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

    function wpfdTreeCloneThemeDownloadFiles($cloneThemeName) {
        $cloneThemeName = 'tree';
        $('.'+ $cloneThemeName +'-wpfd-box.png .wpfd_downloadlink, .'+ $cloneThemeName +'-wpfd-box.jpg .wpfd_downloadlink, .'+ $cloneThemeName +'-wpfd-box.jpeg .wpfd_downloadlink, .'+ $cloneThemeName +'-wpfd-box.gif .wpfd_downloadlink').on('click', function (event) {
            event.preventDefault();
            var fileId = $(this).parents('.'+ $cloneThemeName +'-wpfd-box').attr('data-id');
            var categoryId = $(this).parents('.'+ $cloneThemeName +'-wpfd-box').attr('data-catid');
            var cloudType = $('.wpfd-content-' + $cloneThemeName).find('.wpfd_root_category_type').val();

            if (!fileId || !categoryId) {
                return false;
            }

            window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
        });
    }

    var target_category = $('select.wpfd-upload-category-target');
    if (target_category.length) {
        target_category.each(function () {
            var init_target = $(this).val();
            $(this).parents('.file-upload-content').find('#id_category').val(init_target);
        });
    }
});