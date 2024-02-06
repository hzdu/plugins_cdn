/**
 * WP File Download Addon Javascript
 *
 * @package WP File Download Addon
 * @author Joomunited
 * @version 1.0.0
 */
(function($, window) {
    $(document).ready(function () {
        var wpfdAddonCloud = {
            init: function () {
                this.repositionInput();
                $(document).on('change', 'input[type="radio"][name="googleSyncMethod"]', this.googleSyncMethodChange);
                $(document).on('change', 'input[type="radio"][name="dropboxSyncMethod"]', this.dropboxSyncMethodChange);
                $(document).on('change', 'input[type="radio"][name="onedriveSyncMethod"]', this.onedriveSyncMethodChange);
                $(document).on('change', 'input[type="radio"][name="onedriveBusinessSyncMethod"]', this.onedriveBusinessSyncMethodChange);
                $(document).on('click', '#gg_disconnect, #drop_disconnect, #onedrive_disconnect, #onedrive_business_disconnect, #aws_disconnect', this.promptConnect);
                $('input[type="radio"][name="googleSyncMethod"]:checked, input[type="radio"][name="dropboxSyncMethod"]:checked, input[type="radio"][name="onedriveSyncMethod"]:checked, input[type="radio"][name="onedriveBusinessSyncMethod"]:checked').trigger('change');
                $("#wpfdAddonlaunch").leanModal();
                $(".wpfd_dropboxBaseFolderId").on('change', function (e) {
                    $('.dropboxBaseFolderId ').val($(this).val());
                });

                $(document).on('click', '#wpfd-btnpush-ggd', this.googlePushClick);
                $(document).on('click', '#wpfd-btnpush-onedrive-business', this.onedriveBusinessPushClick);
            },
            onedriveBusinessPushClick: function (e) {
                e.preventDefault();
                var $this = $(this);
                var defaultLabel = $this.html();
                var security = $(e.target).data('security');

                $.ajax({
                    url: wpfd_var.wpfdajaxurl + "?action=onedriveBusinessWatchChanges",
                    data: {security: security},
                    beforeSend: function () {
                        $this.removeClass('orange-outline-button');
                        $this.attr('disabled', true);
                        $this.html('<i class="wpfd-svg-icon-sync-loading"></i> ' + _wpfd_text('Pending...'));
                    },
                    method: "POST",
                    success: function (res, xhr) {
                        if (res.data.status === true) {
                            $this.attr('disabled', false);
                            $this.html(_wpfd_text('Success! Page will reload now...'));
                            setTimeout(function () {
                                document.location.reload();
                            }, 100);
                        } else {
                            $this.html(defaultLabel);
                            $this.attr('disabled', false);
                            $this.addClass('orange-outline-button');
                            alert(_wpfd_text('Something wrong! Check Console Tab for details.'));
                            console.log(xhr);
                        }
                    },
                    error: function (xhr) {
                        $this.html(defaultLabel);
                        $this.attr('disabled', false);
                        $this.addClass('orange-outline-button');
                        alert(_wpfd_text('Something wrong! Check Console Tab for details.'));
                        console.log(xhr);
                    },
                });
            },
            googlePushClick: function (e) {
                e.preventDefault();
                var $this = $(this);
                var defaultLabel = $this.html();
                var security = $(e.target).data('security');

                $.ajax({
                    url: wpfd_var.wpfdajaxurl + "?action=googleWatchChanges",
                    data: {security: security},
                    beforeSend: function () {
                        $this.removeClass('orange-outline-button');
                        $this.attr('disabled', true);
                        $this.html('<i class="wpfd-svg-icon-sync-loading"></i> ' + _wpfd_text('Pending...'));
                    },
                    method: "POST",
                    success: function (res, xhr) {
                        if (res.data.status === true) {
                            $this.attr('disabled', false);
                            $this.html(_wpfd_text('Success! Page will reload now...'));
                            setTimeout(function () {
                                document.location.reload();
                            }, 500);
                        } else {
                            $this.html(defaultLabel);
                            $this.attr('disabled', false);
                            $this.addClass('orange-outline-button');
                            alert(_wpfd_text('Something wrong! Check Console Tab for details.'));
                            console.log(xhr);
                        }
                    },
                    error: function (xhr) {
                        $this.html(defaultLabel);
                        $this.attr('disabled', false);
                        $this.addClass('orange-outline-button');
                        alert(_wpfd_text('Something wrong! Check Console Tab for details.'));
                        console.log(xhr);
                    },
                });

            },
            repositionInput: function () {
                $("#wpfd-btnconnect-ggd").insertAfter($('#wpfd-theme-cloud .ju-heading'));
                $("#wpfd-btnconnect-dropbox").insertAfter($('#wpfd-theme-dropbox .ju-heading'));
                $("#wpfd-btnconnect-onedrive").insertAfter($('#wpfd-theme-onedrive .ju-heading'));
                $("#wpfd-btnconnect-onedrive-business").insertAfter($('#wpfd-theme-onedrive-business .ju-heading'));
                $("#wpfd-btnconnect-aws").insertAfter($('#wpfd-theme-aws .ju-heading'));

                // Move push notification button
                $(".wpfd-float-message").insertAfter($('#wpfd-btnconnect-ggd'));
                $(".wpfd-aws-error-message").insertAfter($('#wpfd-btnconnect-aws'));
                $("#wpfd-btnpush-ggd").insertAfter($('#wpfd-btnconnect-ggd'));
                $("#wpfd-btnpush-onedrive-business").insertAfter($('#wpfd-btnconnect-onedrive-business'));

                $("#gg_setup").insertAfter($('input[name=googleClientSecret]').parents(".ju-settings-option"));
                $("#ggd_connect_mode").insertBefore($('input[name=googleClientId]').parents(".ju-settings-option"));
                $("#onedrive_connect_mode").insertBefore($('input[name=onedriveKey]').parents(".ju-settings-option"));
                $("#onedrive_business_connect_mode").insertBefore($('input[name=onedriveBusinessKey]').parents(".ju-settings-option"));
                $("#dropbox_connect_mode").insertBefore($('input[name=dropboxKey]').parents(".ju-settings-option"));
                $("#onedriver_setup").insertAfter($('select[name=onedriveSyncTime]').parents(".ju-settings-option"));
                $("#onedriver_business_setup").insertAfter($('select[name=onedriveBusinessSyncTime]').parents(".ju-settings-option"));
                $("#dropbox_setup").insertAfter($('select[name=dropboxSyncTime]').parents(".ju-settings-option"));
                $(".dropboxBaseFolder-setup").insertAfter($('input[name=dropboxSecret]').parents(".ju-settings-option"));
                $(".ggd-documentation").insertAfter($('input.google-drive-submit'));
                $(".dropbox-documentation").insertAfter($('input.dropbox-submit'));
                $(".onedrive-documentation").insertAfter($('input.onedrive-submit'));
                $(".onedrive-business-documentation").insertAfter($('input.onedrive-business-submit'));
            },
            googleSyncMethodChange: function (e) {
                wpfdAddonCloud.showHelp(e.target, 'googleSyncMethod_help', 'googleSync');
            },
            dropboxSyncMethodChange: function (e) {
                wpfdAddonCloud.showHelp(e.target, 'dropboxSyncMethod_help', 'dropboxSync');
            },
            onedriveSyncMethodChange: function (e) {
                wpfdAddonCloud.showHelp(e.target, 'onedriveSyncMethod_help', 'onedriveSync');
            },
            onedriveBusinessSyncMethodChange: function (e) {
                wpfdAddonCloud.showHelp(e.target, 'onedriveBusinessSyncMethod_help', 'onedriveBusinessSync');
            },
            showHelp: function (target, helpBlockId, action) {
                var $this = $(target);
                var $syncHelpBlock = $("#" + helpBlockId);
                if ($this.val() === 'setup_on_server') {
                    if ($syncHelpBlock.length === 0) {
                        $this.parents().closest('.ju-settings-option').append("<div class='ju-settings-pre' id='" + helpBlockId + "'>/usr/bin/php " + wpfd_var.abspath + "wp-cron.php > /dev/null 2>&1</div>");
                        $syncHelpBlock.hide();
                    }
                    $syncHelpBlock.fadeIn();
                } else {
                    $syncHelpBlock.fadeOut();
                }
            },
            promptConnect: function (e) {
                e.preventDefault();
                var $that = $(e.target);
                if (confirm(_wpfd_text('Are you sure to disconnect') + '?')) {
                    window.location = $that.attr('href');
                }
                return false;
            },
        };
        wpfdAddonCloud.init();

        var wpfdAddonWoocommerce = {
            wmSelectMedia: false,
            init: function () {
                $(document).on('wpfd_preview_updated', this._onPreviewUpdate)
                  .on('click', '.jsDismiss span', this._dismissNotice);

                this.watermarkInit();
            },
            watermarkInit: function() {
                $(document).on('click', '#wm_select_media_button', {that: this}, this._initWatermarkMediaSelector)
                  .on('click', '#wpfd_regenerate_watermark', {that: this}, this._onWatermarkRegenerateClick);
            },
            _onPreviewUpdate: function(e) {
                var $button = $('<button type="button" title="Edit product in new tab" class="goProducts">Edit Product</button>');
                $button.on('click', function (e) {
                    e.stopPropagation();
                    var $this = $(e.target);
                    if ($this.parent().hasClass('title')) {
                        var productIds = $this.parent().parent('.isWoocommerce').data('products');
                    } else if ($this.parent().hasClass('isWoocommerce')) {
                        var productIds = $this.parent('.isWoocommerce').data('products');
                    }
                    if (productIds) {
                        var productIdsArr = productIds.toString().split(',');
                        var href = window.location.href;
                        var index = href.indexOf('/wp-admin');
                        var homeUrl = href.substring(0, index);
                        // Using pop() method to go to first product only
                        window.open(homeUrl + '/wp-admin/post.php?post=' + productIdsArr.pop() + '&action=edit', '_blank');
                    }
                });
                var row = $('.isWoocommerce');
                $('.title', row).prepend($button);
            },
            _dismissNotice: function(e) {
                $.ajax({
                    method: 'POST',
                    data: {product: $(e.target).parent().data('product-id')},
                    url: wpfdWooAddonVars.adminurl + 'admin-ajax.php?action=dismiss_wpfd_product_notice',
                    success: function(data) {
                        if (data.success === true) {
                            $(e.target).parent().parent('.wpfd_notice').fadeOut('slow', function(){
                                $(this).remove();
                            });
                        }
                    }
                });
            },
            // Watermark module
            _initWatermarkMediaSelector: function (e) {
                e.preventDefault();
                var that = e.data.that;
                var input = $(this).parent().find('[type=text].ju-input');
                //If the uploader object has already been created, reopen the dialog
                if (that.wmSelectMedia) {
                    that.wmSelectMedia.open();
                    return;
                }
                //Extend the wp.media object
                that.wmSelectMedia = wp.media.frames.file_frame = wp.media({
                    title: 'Choose Image',
                    multiple: false,
                    library: {
                        type: 'image'
                    },
                    button: {
                        text: 'Choose Image'
                    }
                });
                var contentArr = wpfd_var.contenturl.split('/');
                var contentUrl = '/' + contentArr[contentArr.length - 1];
                //When a file is selected, grab the URL and set it as the text field's value
                that.wmSelectMedia.on('select', function () {
                    var attachment = that.wmSelectMedia.state().get('selection').first().toJSON();
                    $(input).val(attachment.sizes.full.url.substring(attachment.sizes.full.url.indexOf(contentUrl)));
                });
                //Open the uploader dialog
                that.wmSelectMedia.open();
            },
            _onWatermarkRegenerateClick: function(e) {
                // Show modal
                e.preventDefault();
                var that = e.data.that;
                var modal = that._initModal();
                modal.disableButton();
                modal.showLoading();
                modal.display();

                // Get watermark files (count)
                $.ajax({
                    url: wpfd_var.wpfdajaxurl + "?action=watermark_init",
                    method: 'GET',
                    success: function(response) {
                        if (response.success && response.data.content !== undefined) {
                            modal.totalFiles = response.data.total;
                            modal.processFiles = 0;
                            //modal.processedIds = [];
                            modal.ids = response.data.ids;
                            modal.updateContent(response.data.content);
                            modal.enableButton();
                        } else {
                            modal.updateContent(response.data.content);
                        }
                    },
                    error: function(error) {
                        console.log(error);
                        modal.hideLoading();
                        modal.updateContent(error.data.content);
                    }
                });
            },
            _initModal: function() {
                var modal = $('#wpfd_wm_modal_container').clone();
                var newId = modal.prop('id') + '_' +(new Date()).getUTCMilliseconds();
                modal.prop('id', newId);

                $('body').append(modal);

                modal.updateContent = function(content) {
                    if (modal.progress) {
                        modal.Progress.updateProgressContent(content);
                    } else {
                        $(this).find('.wpfd-modal-body').html(content);
                    }
                };
                modal.updateProgress = function(val) {
                    modal.Progress.updateProgressBar(val);
                };
                modal.showLoading = function() {
                    modal.updateContent('<div class="wpfd-modal-loading">Loading...</div>')
                };
                modal.hideLoading = function() {
                    modal.find('.wpfd-modal-loading').fadeOut().remove()
                };
                modal.find('.js-modalCancel').on('click', function(e) {
                    e.preventDefault();
                    modal.destroy();
                });
                modal.destroy = function() {
                    modal.fadeOut(200, function() {
                        this.remove();
                    })
                };
                modal.display = function() {
                    modal.find('.wpfd-modal').hide();
                    modal.show();
                    modal.find('.wpfd-modal').fadeIn(200);
                };
                modal.disableButton = function() {
                    modal.find('.js-regenerateButton').hide();
                };
                modal.enableButton = function() {
                    modal.find('.js-regenerateButton').fadeIn();
                };
                modal.find('.js-regenerateButton').on('click', function(e) {
                    if (typeof modal.ids === "undefined") {
                        return false;
                    }
                    modal.Progress.init();
                    if (modal.ids.length <= 0) {
                        return false;
                    }
                    var index = 0;
                    var wmPrune = function () {
                        return $.ajax({
                            url: wpfd_var.wpfdajaxurl + "?action=watermark_prune",
                            method: 'POST',
                            success: function(resp) {
                                if (resp.success) {
                                    modal.updateContent(resp.data.content);
                                }
                            }
                        });
                    }

                    var wmExec = function() {
                        modal.disableButton();
                        var file_id = modal.ids[index];
                        if (!file_id) {
                            // Success
                            modal.updateContent('DONE!');
                            modal.enableButton();
                            modal.updateProgress(100);
                            return;
                        }
                        $.ajax({
                            url: wpfd_var.wpfdajaxurl + "?action=watermark_fileinfo",
                            method: 'POST',
                            //async: false,
                            data: {file_id},
                            success: function(res) {
                                modal.updateContent(res.data.content);
                                if (res.success) {
                                    modal.processFiles++;
                                    $.ajax({
                                        url: wpfd_var.wpfdajaxurl + "?action=watermark_exec",
                                        method: 'POST',
                                        //async: false,
                                        data: {file_id},
                                        success: function(res) {
                                            modal.updateContent(res.data.content);
                                            modal.updateProgress(Math.ceil(modal.processFiles/modal.totalFiles * 100));
                                            if (modal.ids.length === modal.processFiles.length) {
                                                modal.updateProgress(100);
                                            }
                                        }
                                    });
                                } else {
                                    modal.processFiles++;
                                    modal.updateContent(res.data.content);
                                    modal.updateProgress(Math.ceil(modal.processFiles/modal.totalFiles * 100));
                                }
                                //modal.processedIds.push(file_id);
                                //modal.ids.splice(index, 1);
                                index++;
                                wmExec();
                            }
                        });
                    };
                    wmPrune().then(function() {
                        wmExec();
                    });


                });
                var Progress = {
                    init: function (min = 0, max = 100, content = '') {
                        // Showing progress
                        var progress = $('<div class="wpfd-modal-progress-wrapper">' +
                          '<div class="wpfd-progress-content">' + content + '</div>' +
                          '<div class="wpfd-progress-bar">' +
                          '<progress value="' + min + '" max="' + max + '">' +
                          '<div class="progress-bar">' +
                          '<span style="width: ' + min + '%;">' + min + '%</span>' +
                          '</div>' +
                          '</progress></div>' +
                          '</div>');
                        modal.updateContent(progress);
                        modal.progress = true;
                    },
                    destroy: function() {
                        modal.progress = false;
                    },
                    updateProgressContent: function(content) {
                        modal.find('.wpfd-progress-content').html(content);
                    },
                    updateProgressBar: function(val) {
                        modal.find('progress').val(val);
                        modal.find('.progress-bar span').css('width', val + '%');
                        modal.find('.progress-bar span').html(val + '%');
                    },
                };
                modal.Progress = Progress;
                return modal;
            }
        }

        wpfdAddonWoocommerce.init();

    });
})(jQuery, window);


(function($) {
    var wpfd_product_creation = {
        selectMedia: false,
        selectMultiMedia: false,
        init: function() {
            $(document).on('click', '[data-custom-action="file.create_product"]', {that: this}, this.onCreateProductClick)
              .on('click', '.wpfd-modal-header .wpfd-tabs .wpfd-tab', {that: this}, this.onTabClick)
              .on('click', '.wpfd-modal-body .wpfd-tabs .wpfd-tab', {that: this}, this.onTabBodyClick)
              .on('click', '.js-modalCancel', {that: this}, this.onCancelProductCreationModal)
              .on('click', '#wpfd-files-table .file', {that: this}, this.onFileSelection)
              .on('click', '.js-saveProductOpen', {that: this}, this.onSaveProductOpen)
              .on('change', '#product_featured_image', {that: this}, this.onFeaturedImageSelect)
              .on('change', '#product_other_as_gallery', {that: this}, this.onUseOtherAsGalleryChecked)
            ;
        },
        _saveProduct: function(open_after_save = false) {
            var data = {
                product_title: $('#product_title').val(),
                product_sku: $('#product_sku').val(),
                product_price: $('#product_price').val(),
                product_sale_price: $('#product_sale_price').val(),
                product_category: $('#product_category').val(),
                product_files: $('[name="wpfd_product_files"]').val(),
                product_titles: $('[name="wpfd_product_titles"]').val(),
                product_catids: $('[name="wpfd_product_catids"]').val(),
                product_featured_image: $('[name="product_featured_image"]').val(),
                product_gallery_images: $('[name="product_gallery_images"]').val(),
            };
            var productCreationProcess;
            $.ajax({
                url: wpfd_var.wpfdajaxurl + "?action=wpfda_create_product",
                method: 'POST',
                data: data,
                beforeSend: function() {
                    productCreationProcess = wpfd_status.addStatusLine('Creating product ' + data.product_title + '...', 15);
                },
                success: function(data) {
                    if (data.success) {
                        var $errors = '';
                        if (data.data.errors) {
                            $errors = "<br />" + '<ul class="wpfd-error-list">';
                            data.data.errors.forEach(function(error) {
                                $errors += '<li>' + error + '</li>';
                            });
                            $errors += '</ul>';
                        }
                        var dialog = bootbox.dialog(_wpfd_text("New product created successfully!") + $errors,
                          [
                              {
                                  "label": _wpfd_text('Close')
                              },
                              {
                                  "label": _wpfd_text('Edit Product'),
                                  "callback": function() {
                                      window.open(data.data.edit_link.replace('&amp;', '&'), '_blank');
                                  }
                              }
                          ]);
                    } else {
                        if (typeof (data.data.message)) {
                            bootbox.alert(data.data.message);
                        } else {
                            bootbox.alert(_wpfd_text('Product create failed!'));
                        }
                    }
                },
                error: function(error) {
                    bootbox.alert(error);
                },
                complete: function() {
                    productCreationProcess.remove();
                    wpfd_status.close();
                }
            })


        },
        onSaveProductOpen: function(e) {
            e.preventDefault();
            e.data.that._saveProduct(true); // Set true to open product edit page in new tab
            e.data.that._clearModal();
            e.data.that._closeModal();
        },

        onCreateProductClick: function(e) {
            e.preventDefault();
            try {
                // Get selected files

                var files = $('#preview .file.selected');
                if (files.length === 0) {
                    bootbox.alert(_wpfd_text('Please select file(s)'));
                    return false;
                }

                // Set files row
                var files_table = $('#wpfd-files-table');
                // Empty old values
                files_table.html('');

                // Clone table title
                var clone_header = $('.wpfd_row.head').clone();
                $(clone_header).find('.dashicons').remove();
                $(clone_header).find('.th_created_time').remove();
                $(clone_header).find('.th_modified_time').remove();
                $(clone_header).find('.th_version').remove();
                $(clone_header).find('.th_hits').remove();
                $(clone_header).find('.th_size').remove();
                files_table.append($(clone_header));
                var imageFiles = [];
                $.each(files, function(i, file) {
                    var row = $(file).clone();
                    var id = $(file).data('id-file');
                    var ext = $(file).data('file-ext');
                    var name = $(file).find('.title').clone().children().remove().end().text();
                    if (id && ext && ['jpg', 'jpeg', 'png'].indexOf(ext) !== -1) {
                        imageFiles.push({id: id, name: name});
                    }
                    // Clean other elements
                    $(row).find('.filestatus-wrapper').remove();
                    $(row).find('[type="button"]').remove();
                    // Remove no necessary
                    $(row).find('.created').remove();
                    $(row).find('.modified').remove();
                    $(row).find('.version').remove();
                    $(row).find('.hits').remove();
                    $(row).find('.size').remove();

                    files_table.append($(row));
                    // console.log(row);

                });
                // Hide and clear the featured image field
                $('#wpfd_featured_image_wrapper').hide();
                $('#product_featured_image').find('option').not(':first').remove();
                $('#product_other_as_gallery').prop('checked', false);

                if (imageFiles.length) {
                    // Hide featured image field
                    imageFiles.forEach(function(image) {
                        $('#product_featured_image').append($('<option value="'+image.id+'">'+image.name+'</option>'));
                    });
                    $('#wpfd_featured_image_wrapper').show();
                }


                // Show creation modal
                $('#wpfd_woocommerce_product_creation').show();
                e.data.that._loadSelectedFiles();
                window.Wpfd.destroyContextMenu();
            } catch (e) {
                console.log(e);
            }

            return false;
        },
        onFeaturedImageSelect: function(e) {
          e.preventDefault();
          var that = e.data.that;
          that.loadGalleryImages();
          return false;
        },
        onUseOtherAsGalleryChecked: function(e) {
            e.preventDefault();
            if ($(this).is(':checked')) {
                e.data.that.loadGalleryImages();
            } else {
                $('#product_gallery_images').val('');
            }
            return false;
        },
        loadGalleryImages: function() {
            var options = [];
            // Get all options exclude selected
            $('#product_featured_image option:not(:selected)').each(function() {
                if ($(this).attr('value') !== '')
                    options.push($(this).attr('value'));
            });
            if ($('#product_other_as_gallery').is(':checked')) {
                $('#product_gallery_images').val(options.join(','));
            } else {
                $('#product_gallery_images').val('');
            }
        },
        onFileSelection: function(e) {
            $(this).toggleClass('selected');
            // Fill input\
            e.data.that._loadSelectedFiles();
        },
        _loadSelectedFiles: function() {

            var ids = [],
              titles = [],
              catids = [];

            $('#wpfd-files-table .file.selected').each(function() {
                ids.push($(this).data('id-file'));
                catids.push($(this).data('catid-file'));
                titles.push($(this).find('.title').text());
            });

            $('[name="wpfd_product_files"]').val(ids.join('|'));
            $('[name="wpfd_product_catids"]').val(catids.join('|'));
            $('[name="wpfd_product_titles"]').val(titles.join('|'));
        },
        onCancelProductCreationModal: function(e) {
            e.preventDefault();
            // Clear fields
            e.data.that._clearModal();
            e.data.that._closeModal();
            return false;
        },
        _clearModal: function() {
            try {
                var files_table = $('#wpfd-files-table');
                // Empty old values
                files_table.html('');
                $('#wpfd-create-product input').val('');
            } catch (e) {
                console.log(e);
            }
        },
        _closeModal: function() {
            $('#wpfd_woocommerce_product_creation').hide();
        },
        onTabClick: function(e) {
            e.preventDefault();
            $('.wpfd-modal-header ul.wpfd-tabs li').addClass('ju-material-button').removeClass('ju-link-button').removeClass('active');
            $(this).removeClass('ju-material-button').addClass('ju-link-button').addClass('active');
            var id = $(this).data('tab-id');
            $('#' + id).parent().find('.wpfd-tab-content').removeClass('active');
            $('#' + id).addClass('active');
            $(this).insertBefore($(this).prev());
            return false;
        },
        onTabBodyClick: function(e) {
            e.preventDefault();
            $(this).parent().find('li').removeClass('active');
            $(this).addClass('active');
            var id = $(this).data('tab-id');
            $(this).parent().next().find('.wpfd-tab-content').removeClass('active');
            $('#' + id).addClass('active');
            return false;
        },
    };
    $(document).ready(
      function() {
          wpfd_product_creation.init();
      }
    );
})(jQuery);

function autoReload() {
    setTimeout(function () {
        window.location.reload();
    }, 2500);
}
