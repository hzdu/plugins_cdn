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
            simultaneousUploads: 2,
            maxFileSize: toMB(wpfd_admin.maxFileSize),
            maxFileSizeErrorCallback: function (file) {
                bootbox.alert(file.name + ' ' + _wpfd_text('is too large, please upload file(s) less than ') + wpfd_admin.maxFileSize + 'Mb!');
            },
            chunkSize: wpfd_admin.serverUploadLimit - 50 * 1024, // Reduce 50KB to avoid error
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
                            } else {
                                if (currentContainer.parents('.wpfd-content-ggd.wpfd-content-multi[data-category=' + sourcecat + ']').length) {
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
                                    initClickFile();
                                    gdd_init_pagination($('.wpfd-content-ggd[data-category=' + sourcecat + '] + .wpfd-pagination'));
                                } else {
                                    if (currentContainer.parents('.wpfd-content-table.wpfd-content-multi[data-category=' + sourcecat + ']').length) {
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
                                    } else {
                                        if (currentContainer.parents('.wpfd-content-tree.wpfd-content-multi[data-category=' + sourcecat + ']').length) {
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
                                        }
                                    }
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
        });

        uploader.assignBrowse($(currentContainer).find('#upload_button'));
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
                    var containerData      = $(el).data('container');
                    $(this).parents('.jsWpfdFrontUpload').find('#id_category').val(category_target_id);
                });
            }
        });
    }

    displayLimitedFiles();

    var sourcefile          = $("#wpfd-template-ggd-box").html();
    var ggd_root_cat        = $('.wpfd-content-ggd').data('category');
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
                    initClickFile();

                    gdd_init_pagination(wrap.next('.wpfd-pagination'));
                    wpfd_remove_loading($(".wpfd-content-ggd[data-category=" + current_sourcecat + "] .wpfd-container-ggd"));
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
                });
            }

        });
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

                if (typeof wpfdColorboxInit !== 'undefined') {
                    wpfdColorboxInit();
                }

                $('body.elementor-default #wpfd-ggd-box a.wpfd_downloadlink').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var link = $(this).attr('href');
                    window.location.href = link;
                });
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
                    $('body').append('<div id="tree-wpfd-box" style="display: hidden;"></div>');
                    box = $("#tree-wpfd-box");
                }
                box.empty();
                box.prepend(html);
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

                if (typeof wpfdColorboxInit !== 'undefined') {
                    wpfdColorboxInit();
                }

                $('body.elementor-default #tree-wpfd-box a.wpfd_downloadlink').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var link = $(this).attr('href');
                    window.location.href = link;
                });
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

    var target_category = $('select.wpfd-upload-category-target');
    if (target_category.length) {
        target_category.each(function () {
            var init_target = $(this).val();
            $(this).parents('.file-upload-content').find('#id_category').val(init_target);
        });
    }
});
