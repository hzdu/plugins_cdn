(function ($) {
  $(document).ready(function ($) {
    // Main configuration
    var wpfd_configuration = {
      status: '',
      init: function () {
        $(document).on('change', '.ju-switch-button .switch input[type="checkbox"]', this.switch);
        $(document).on('change', '#search_shortcode .switch input[type="checkbox"]:not(input[name="ref_plain_text_search"]), #search_shortcode select', this.search_shortcode);
        $(document).on('change', '#upload_cattegory_id', this.upload_shortcode);
        $(document).on('change', '#upload_config .switch input[name="ref_display_upload_category_files"]', this.upload_form_with_display_files);
        $(document).on('change', '.switch input[name="ref_revision_pattern_enabled"]', this.toggleRevisionPatternInput);
        var revision_enabled = $('#revision_pattern_enabled').val();
        if (parseInt(revision_enabled) === 0) {
          $('input[name="revision_pattern"]').parent().hide();
        } else {
          $('input[name="revision_pattern"]').parent().show();
        }
        this.showDisplayFilesOption();
        $(document).on('change input', '#ref_statistics_storage_times, #ref_statistics_storage_duration', this.statisticsStorageChanged);
        // $(document).on('click', '.shortcode-copy', this.copy);
        this.search_shortcode();
        $(document).on('click', '.ju-toggle', this.toggle);
        $(document).on('input', '.ju-role-search-input', this.search_roles);
        this.loadStatisticsStorageValue();
        $('#ref_exclude_category_id').chosen({width: 'auto'});
        $('#not_authorized_page').chosen({width: '100%'});
        this.initQtip();
        $(document).on('click', '#wpfd-run-export', this.runExport);
        $(document).on('change', '#export_folder_type', this.showSelectFolderExportOptionAndSaveConfig);
        this.initExportCategoryList();
        $(document).on('click', '#open_export_tree_folders_btn', this.showExportCategoryList);
        $(document).on('click', '.save_export_folders', this.saveExportFolders);
        $(document).on('click', '.save_export_folders, .wpfd-close', this.closeExportCategoryList);
        this.runImportFolders();
        this.showServerFolderTree();
        $(document).on('click', '#import-server-folders-btn', this.runImportServerFolders);
        $(document).on('click', '#run-import-download-manager-btn', this.runImportDownloadManagerFolders);
        this.wpfdGetAllCategories();
        $(document).on('click', '#save-category-disc', this.wpfdProcessAndRunImport);
        $(document).on('click', '#wpfd-close-category-disc', this.wpfdCloseAllCategories);
        $(document).on('click', '#wpfd_import_folder_btn', this.runImportXMLCategories);
        $(document).on('change', '.switch input[name="ref_access_message"]', this.wpfdOnChangeCategoryAccessMessage);
        $(document).on('change', '.switch input[name="ref_empty_message"]', this.wpfdOnChangeCategoryEmptyMessage);
        $(document).on('change', '.switch input[name="ref_admin_pagination"]', this.wpfdOnChangeAdminFileCategoryPagination);
        $(document).on('change', '.switch input[name="ref_admin_load_more"]', this.wpfdOnChangeAdminFileCategoryLoadMore);
        $(document).on('change', '.switch input[name="ref_limit_the_download"]', this.wpfdOnChangeLimitDownload);
        $(document).on('input', '#wpfd-file-access .limit-download-input', function () {
          let val = $(this).val();
          if (parseInt(val) > 999) {
            $(this).val(999);
          }

          if (parseInt(val) < 0) {
            $(this).val('');
          }
        });
        wpfd_configuration.wpfdCategoryPaginationDismod();
        wpfd_configuration.wpfdCategoryLoadMoreDismod();
        this.wpfdSetInitCategoryMessages();
        var stt_storage = $('#ref_statistics_storage_duration');
        if (stt_storage.length) {
          stt_storage.parent().addClass('ju-settings-stt-storage');
        }
      },
      toggleRevisionPatternInput: function(e) {
        $('input[name="revision_pattern"]').parent().slideToggle();
      },
      statisticsStorageChanged: function(e) {
        var $this = $(this);
        var ref = $this.attr('name').replace('ref_', '');
        $('input[name="' + ref + '"]').val($this.val());
      },
      loadStatisticsStorageValue: function() {
        var statistics_storage_times = $('input[name="statistics_storage_times"]').val();
        var statistics_storage_duration = $('input[name="statistics_storage_duration"]').val() || 'forever';
        $('#ref_statistics_storage_times').val(statistics_storage_times);
        $('#ref_statistics_storage_duration').val(statistics_storage_duration);
      },
      switch: function (e) {
        var $this = $(e.target);
        var ref = $this.attr('name').replace('ref_', '');
        $('input[name="' + ref + '"]').val($this.prop('checked') ? 1 : 0);
        if (ref === 'show_categories') {
          $('input[name="' + ref + '"]').trigger('change');
        }
      },
      search_shortcode: function () {
        var cat = $('#cat_filter'),
            tag = $('#tag_filter'),
            display_tag = $('#display_tag'),
            create_filter = $('#create_filter'),
            update_filter = $('#update_filter'),
            type_filter = $('#type_filter'),
            weight_filter = $('#weight_filter'),
            file_per_page = $('#file_per_page'),
            search_theme = $('#search_theme'),
            search_category_id = $('#search_category_id'),
            ref_exclude_category_id = $('#ref_exclude_category_id'),
            search_shortcode_input = $('#shortcode_value');
        var catId = '';
        if (search_category_id.length > 0 && search_category_id.val() !== '') {
          catId = ' catid="' + search_category_id.val() + '"';
        }

        var excludeIds = '';
        if (ref_exclude_category_id.length > 0 && ref_exclude_category_id.val() !== '') {
          if (ref_exclude_category_id.val() !== null) {
            excludeIds = ' exclude="' + ref_exclude_category_id.val().join(',') + '"';
            $('#exclude_category_id').val(ref_exclude_category_id.val().join(','));
          } else {
            $('#exclude_category_id').val('');
          }
        }

        var shortcode = '[wpfd_search' + catId + excludeIds +' cat_filter="' + cat.val() + '" tag_filter="' + tag.val() + '" display_tag="' + display_tag.val() + '" create_filter="' + create_filter.val() + '" update_filter="' + update_filter.val() + '" type_filter="' + type_filter.val() + '" weight_filter="' + weight_filter.val() + '" file_per_page="' + file_per_page.val() + '"';
        if (search_theme.length && search_theme.val() !== '') {
          shortcode += ' theme="' + search_theme.val() + '"';
        }
        shortcode += ']';
        $(search_shortcode_input).val(shortcode);
      },
      upload_shortcode: function () {
        var upload_shortcode_value = $('#upload_shortcode'),
            upload_cattegory_id = $('#upload_cattegory_id');

        if (!upload_cattegory_id.length || !upload_cattegory_id.length) {
          return;
        }
        if (upload_cattegory_id.val().toString() === '0') {
          var shortcode_upload = '[wpfd_upload]';
          upload_shortcode_value.val(shortcode_upload);
        } else {
          var shortcode_upload = '[wpfd_upload category_id="' + upload_cattegory_id.val() + '"]';
          upload_shortcode_value.val(shortcode_upload);
        }
        var display_files = $('input[type="checkbox"][name="ref_display_upload_category_files"]');
        if (display_files.length) {
          display_files.prop('checked', false);
        }
        wpfd_configuration.showDisplayFilesOption();
      },
      upload_form_with_display_files: function() {
        if (!$('#upload_cattegory_id').length) {
          return;
        }
        var shortcode           = $('#upload_shortcode');
        var display_files       = $('#display_upload_category_files');
        var selected_category   = $('#upload_cattegory_id').val();

        if (selected_category.toString() === '0') {
          return;
        }

        if (display_files.val().toString() === '1' && shortcode.val().toString() !== '[wpfd_upload]') {
          var render_shortcode = '[wpfd_upload category_id="' + selected_category + '" display_files="1"]';
          shortcode.val(render_shortcode);
        } else {
          if (shortcode.val().toString() !== '[wpfd_upload]') {
            var render_shortcode = '[wpfd_upload category_id="' + selected_category + '"]';
            shortcode.val(render_shortcode);
          }
        }
      },
      showDisplayFilesOption: function() {
        var selected_category = $('#upload_cattegory_id');
        if (!selected_category.length) {
          return;
        }
        if (selected_category.val().toString() === '0') {
          $('#display_upload_category_files').parents('.ju-settings-option').hide();
        } else {
          $('#display_upload_category_files').parents('.ju-settings-option').show();
        }
      },
      copy: function (e) {
        e.stopPropagation();
        var $this = $(this);
        var inputId = $this.data('ref');
        var linkcopy = $('input[name="' + inputId + '"]').val();
        var inputlink = document.createElement("input");
        inputlink.setAttribute("value", linkcopy);
        document.body.appendChild(inputlink);
        inputlink.select();
        document.execCommand("copy");
        document.body.removeChild(inputlink);
        $.gritter.add({text: wpfd_admin.msg_shortcode_copied_to_clipboard});
        $this.unbind('click');
      },
      toggle: function (e) {
        var $this = $(e.target);
        $this.toggleClass('collapsed');
        $this.next('.ju-settings-option-group').slideToggle();
      },
      search_roles: function (e) {
        var $this = $(e.target);
        var searchKey = $this.val().trim().toLowerCase();
        $('.ju-right-panel .ju-heading.ju-toggle').show();
        $('.ju-right-panel .ju-heading.ju-toggle + .ju-settings-option-group').show();
        if (searchKey === '') {
          return false;
        }
        // Hide everything
        $('.ju-right-panel .ju-heading.ju-toggle').hide();
        $('.ju-right-panel .ju-heading.ju-toggle + .ju-settings-option-group').hide();
        // We are search on role name only
        $('.ju-right-panel .ju-heading.ju-toggle:contains("' + searchKey + '")').show();
        $('.ju-right-panel .ju-heading.ju-toggle:contains("' + searchKey + '") + .ju-settings-option-group').show();

      },
      initQtip: function () {
        $('.ju-setting-label, .wpfd_sub_control label').qtip({
          content: {
            attr: 'title',
          },
          position: {
            my: 'top left',
            at: 'bottom left',
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
        $('#wpfd_generate_error_message').qtip({
          content: {
            attr: 'title',
          },
          position: {
            my: 'top right',
            at: 'bottom right',
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
          },

        });
      },
      runExport: function () {
        var url                 = wpfdajaxurl;
        var type_groups         = ['all', 'only_folder', 'selection_folder'];
        var export_type         = $('select[name="export_folder_type"]').val();
        var selected_categories = $('.wpfd_export_folders').val();
        if (!export_type.length || export_type === '' || !type_groups.indexOf(export_type)) {
          export_type = 'only_folder';
        }
        if (url.indexOf('wpfd') === -1) {
          url = wpfdajaxurl + "?action=wpfd&";
        }
        url = url + "task=config.exportFolder";

        if (export_type === 'selection_folder' && selected_categories === '') {
          return;
        }

        $.ajax({
          url: url,
          method: 'GET',
          data: {},
          beforeSend: function() {
            $('#wpfd-run-export .spinner').show().css({'display' : 'block', 'visibility': 'visible', 'margin': '-2px 2px'});
          },
          success: function (response) {
            $('#wpfd-run-export .spinner').hide().css({'display' : 'none', 'visibility': 'hidden', 'margin': '-2px 2px'});
            window.open(url);
          }
        });
      },
      showSelectFolderExportOptionAndSaveConfig: function () {
        var type = $(this).val();
        if (type === 'selection_folder') {
          $('#open_export_tree_folders_btn').addClass('show').removeClass('hide');
        } else {
          $('#open_export_tree_folders_btn').addClass('hide').removeClass('show');
        }

        // Save params
        var url  = wpfdajaxurl;
        if (url.indexOf('wpfd') === -1) {
          url = wpfdajaxurl + "?action=wpfd&";
        }

        $.ajax({
          url: url + "task=config.wpfdSaveImportExportParams&export_type=" + type,
          method: 'GET',
          data: {},
          beforeSend: function() {
            $('#wpfd-run-export').addClass('reject');
          },
          success: function(result) {
            $('#wpfd-run-export').removeClass('reject');
          },
          error: function () {
            $('#wpfd-run-export').removeClass('reject');
          },
        });
      },
      initExportCategoryList: function () {
        // Show select folder when type = selection_folder
        if ($('#export_folder_type').val() === 'selection_folder') {
          $('#open_export_tree_folders_btn').addClass('show').removeClass('hide');
        }
        // Close Modal in case click outside
        $('body').on('click', function (e) {
          if ($('#wpfd_export_category_list').is(':visible') && !$(e.target).is('#open_export_tree_folders') && !$(e.target).parent('#open_export_tree_folders').length && !$(e.target).parents('#open_export_tree_folders').length) {
            $('#wpfd_export_category_list').hide();
          }
        });
        var url  = wpfdajaxurl;
        if (url.indexOf('wpfd') === -1) {
          url = wpfdajaxurl + "?action=wpfd&";
        }
        // Call ajax category list
        $.ajax({
          url: url + "task=config.wpfdListAllCategories",
          method: 'GET',
          data: {},
          success: function (response) {
            var data    = response.data;
            var success = response.success;
            if( data.length ) {
              var html = '<div id="wpfd_export_category_list" class="has-category">';
              html    += '<div class="wpfd-export-wrap">';
              html    += '<div class="wpfd-export-container">';
              html    += '<div class="wpfd-preloader">Loading...</div>';
              html    += '<div class="wpfd-overlay"></div>';
              html    += '<div class="wpfd-export-content">';
              html    += '<div id="open_export_tree_folders" class="white-popup">';
              html    += '<button class="ju-button save_export_folders orange-button">Save</button>';
              html    += '<span class="spinner save_export_folders_spinner"></span>';
              html    += '<button title="Close (Esc)" type="button" class="wpfd-close">×</button>';
              html    += '<div class="export_tree_folders">';
              html    += '<div class="wpfd-folder-tree wpfd-no-margin wpfd-no-padding">';
              html    += '<ul>';
              var folderIcon = '<svg class="dashicon default-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
              data.forEach(function (category, index) {
                var haveChild = (typeof (data[index + 1]) !== 'undefined' && data[index + 1].level > category.level && data[index + 1].level > 0);
                var paddingLeft = category.level * 18;
                if (!haveChild) {
                  paddingLeft += 16;
                }
                html += '<li class="wpfd-export-category-folder wpfd-export-cat-lv-' + category.level + '" style="padding-left: ' + paddingLeft + 'px;" data-id="' + category.term_id + '" data-id-category="' + category.term_id + '" data-id-parent="' + category.parent + '" data-level="' + category.level + '">';
                if (category.level < 16 && haveChild) {
                  html += '<span class="wpfd-toggle-expand"></span>';
                }
                html += folderIcon;
                html += '<input type="checkbox" class="wpfd_export_category_checkbox" data-id="' + category.term_id + '" value="' + category.term_id + '"/>';
                html += '<span class="wpfd-category-name">' + category.name + '</span>';
                html += '</li>';
              });
              html += '</ul>';
              html += '</div>';
              html += '</div>';
              html += '</div>';
              // End wpfd-export-content
              html += '</div>';
              html += '</div>';
              html += '</div>';
              html += '</div>';

              $('body').append(html);
            } else {
              var html = '<div id="wpfd_export_category_list">';
              html    += '<div class="wpfd-export-wrap">';
              html    += '<div class="wpfd-export-container">';
              html    += '<div class="wpfd-export-content">';
              html    += '<div id="open_export_tree_folders" class="white-popup">';
              html    += '<button class="ju-button save_export_folders orange-button">Save</button>';
              html    += '<span class="spinner save_export_folders_spinner"></span>';
              html    += '<button title="Close (Esc)" type="button" class="wpfd-close">×</button>';
              html    += '<div class="export_tree_folders">';
              html    += '<div class="wpfd-folder-tree wpfd-no-margin wpfd-no-padding">';
              html    += '<ul>';
              html    += '<li>No category found!</li>';
              html    += '</ul>';
              html    += '</div>';
              html    += '</div>';
              html    += '</div>';
              // End wpfd-export-content
              html    += '</div>';
              html    += '</div>';
              html    += '</div>';
              html    += '</div>';

              $('body').append(html);
            }
          }
        });
      },
      showExportCategoryList: function () {
        if ($('#wpfd_export_category_list').length) {
          $('#wpfd_export_category_list').show();
        }
        // set watermark include folders
        $('.wpfd_export_category_checkbox').on('click, change', function () {
          var includes = [];
          $('.wpfd_export_category_checkbox').each(function (i, v) {
            var val = $(v).val();
            if ($(v).is(':checked')) {
              includes.push(val);
            } else {
              var index = includes.indexOf(val);
              if (index > -1) {
                includes.splice(index, 1);
              }
            }
          });

          $('[name="wpfd_export_folders"]').val(includes.join()).change();
        });
      },
      closeExportCategoryList: function () {
        if ($('#wpfd_export_category_list').length) {
          $('#wpfd_export_category_list').hide();
        }
      },
      saveExportFolders: function () {
        var url  = wpfdajaxurl;
        if (url.indexOf('wpfd') === -1) {
          url = wpfdajaxurl + "?action=wpfd&";
        }
        $.ajax({
          url: url + "task=config.setExportExcludeFolders",
          method: 'POST',
          data: {
            wpfd_export_folder_term_ids: $('.wpfd_export_folders').val(),
          },
          beforeSend: function () {
            $('.save_export_folders_spinner').show().css('visibility', 'visible');
          },
          success: function () {
            $('.save_export_folders_spinner').hide();
          }
        });
      },
      runImportFolders: function () {
        var path                = $('#wpfd_import_folder_btn').data('path');
        var id                  = $('#wpfd_import_folder_btn').data('id');
        var import_only_folder  = $('#wpfd_import_folder_btn').data('import_only_folder');
        var url                 = wpfdajaxurl;
        var xml_category_disc   = $('#wpfd-import-xml-disc').val();
        if (url.indexOf('wpfd') === -1) {
          url = wpfdajaxurl + "?action=wpfd&";
        }
        if (path !== '' && id !== '') {
          $.ajax({
            url: url + "task=config.wpfdRunImportFolders",
            method: 'POST',
            data: {
              path: path,
              id: id,
              import_only_folder: (import_only_folder !== '') ? import_only_folder : false,
              xml_category_disc: xml_category_disc,
            },
            beforeSend: function () {
              $('.wpfd_import_error_message_wrap').html('<div id="wpfd-import-loading" class="wpfd-import-loading"></div>');
            },
            success: function (res) {
              $('.wpfd_import_error_message_wrap').html('<div class="import_error_message">' + res.msg + '</div>');
              wpfd_configuration.finishImportServerSession(url);
            },
            error: function () {
              wpfd_configuration.finishImportServerSession(url);
            }
          });
        }
      },
      finishImportServerSession: function (url) {
        $('#wpfd-import-loading').remove();
        $('#wpfd_import_folder_btn').data('path', '').trigger('change');
        $('#wpfd_import_folder_btn').data('id', '').trigger('change');
        $('#wpfd_import_folder_btn').data('import_only_folder', 1).trigger('change');

        $.ajax({
          url: url + "task=config.resetImportFileParams",
          method: 'POST',
          data: {},
          success: function (res) {}
        });
      },
      showServerFolderTree: function () {
        $('#wpfd_foldertree').wpfd_serverfoldertree({
          script: wpfdajaxurl + "task=category.listdir",
          usecheckboxes: 'dirs',
          showroot: '//'
        });
      },
      runImportServerFolders: function (e) {
        e.preventDefault();
        var files = [];

        $($('#wpfd_foldertree').wpfd_serverfoldertree('getchecked')).each(function () {
          files.push(this.file);
        });

        if (files.length === 0) {
          return;
        }

        var preRun = $('#wpfd-import-type').val();
        if (preRun !== 'import-server-folders') {
          $('#wpfd-import-type').val('import-server-folders');
          $('#wpfd-select-category').val('');
        }
        $('#wpfd-server-import-options').show();
        $('#wpfd-all-categories').show();
      },
      runImportDownloadManagerFolders: function () {
        var selected_wpdm_category = $('#import-folders-download-manager .choose-category').val();
        if (selected_wpdm_category === '' || !selected_wpdm_category.length) {
          return;
        }
        var prevRun = $('#wpfd-import-type').val();
        if (prevRun !== 'import-download-manager') {
          $('#wpfd-import-type').val('import-download-manager');
          $('#wpfd-select-category').val('');
        }

        $('#wpfd-server-import-options').hide();
        $('#wpfd-all-categories').show();
      },
      wpfdGetAllCategories: function () {
        var url  = wpfdajaxurl;
        if (url.indexOf('wpfd') === -1) {
          url = wpfdajaxurl + "?action=wpfd&";
        }

        // Call ajax all categories
        $.ajax({
          url: url + "task=config.wpfdListAllCategories",
          method: 'GET',
          data: {},
          success: function (response) {
            var data    = response.data;
            var success = response.success;
            var importOption = '<div id="wpfd-server-import-options" style="display: none">';
            importOption += '<h3 class="import-title">' + wpfd_admin.import_import_option + '</h3>';
            importOption += '<select id="wpfd-import-options" class="inputbox input-block-level ju-input wpfd-import-options">';
            importOption += '<option value="only_selected_folders">Only selected folders</option>';
            importOption += '<option value="all_sub_folders">All sub folders</option>';
            importOption += '</select>';
            importOption += '</div>';
            if( data.length ) {
              var html = '<div id="wpfd-all-categories" class="wpfd-all-categories">';
              html    += '<div class="categories-wrap">';
              html    += '<div class="categories-container">';
              html    += '<div class="wpfd-preloader">Loading...</div>';
              html    += '<div class="wpfd-overlay"></div>';
              html    += '<div class="categories-content">';
              html    += '<input type="hidden" id="wpfd-import-type" value="" />';
              html    += '<div id="tree-category-list" class="tree-category-list white-popup">';
              html    += '<button id="save-category-disc" class="ju-button orange-button save-category-disc">' + wpfd_admin.import_run_import + '</button>';
              html    += '<button title="Close" type="button" id="wpfd-close-category-disc" class="wpfd-close">×</button>';
              html    += '<div class="tree-category-view">';
              html    += '<div class="tree-categories wpfd-no-margin wpfd-no-padding">';
              html    += '<h3 class="import-title wpfd-category-disc-title">' + wpfd_admin.import_target_category + '</h3>';
              html    += '<select id="wpfd-select-category" class="inputbox input-block-level ju-input wpfd-select-category">';
              html    += '<option value="">ROOT</option>';
              data.forEach(function (category, index) {
                var level = '';
                if (category.level > 0) {
                  for(var i = 0; i < category.level; i++) {
                    level += '-';
                  }
                }
                html += '<option value="' + category.term_id + '" class="wpfd-category-item wpfd-cat-lv-' + category.level + '" data-id="' + category.term_id + '" data-id-category="' + category.term_id + '" data-id-parent="' + category.parent + '" data-level="' + category.level + '">';
                html += level + category.name;
                html += '</option>';
              });
              html += '</select>';
              html += importOption;
              html += '</div>';
              html += '</div>';
              html += '</div>';
              // End categories-content
              html += '</div>';
              html += '</div>';
              html += '</div>';
              html += '</div>';

              $('body').append(html);
            } else {
              var html = '<div id="wpfd-all-categories" class="wpfd-all-categories">';
              html    += '<div class="categories-wrap">';
              html    += '<div class="categories-container">';
              html    += '<div class="wpfd-preloader">Loading...</div>';
              html    += '<div class="wpfd-overlay"></div>';
              html    += '<div class="categories-content">';
              html    += '<div id="tree-category-list" class="tree-category-list white-popup">';
              html    += '<button id="save-category-disc" class="ju-button orange-button save-category-disc">Save</button>';
              html    += '<span class="spinner"></span>';
              html    += '<button title="Close" type="button" id="wpfd-close-category-disc" class="wpfd-close">×</button>';
              html    += '<div class="tree-category-view">';
              html    += '<div class="tree-categories wpfd-no-margin wpfd-no-padding">';
              html    += '<ul>';
              html    += '<li>No category found!</li>';
              html    += '</ul>';
              html    += '</div>';
              html    += '</div>';
              html    += '</div>';
              // End categories-content
              html    += '</div>';
              html    += '</div>';
              html    += '</div>';
              html    += '</div>';

              $('body').append(html);
            }
          }
        });
      },
      wpfdProcessAndRunImport: function (e) {
        $('#wpfd-all-categories').hide();
        var url   = wpfdajaxurl;
        var files = [];

        if (url.indexOf('wpfd') === -1) {
          url = wpfdajaxurl + "?action=wpfd&";
        }
        var wpfd_category_disc = $('#wpfd-select-category').val();
        var wpfd_import_option = $('#wpfd-import-options').val();
        var selected_wpdm_category = $('#import-folders-download-manager .choose-category').val();
        var import_type = $('#wpfd-import-type').val();

        if (import_type === 'import-server-folders') {
          $($('#wpfd_foldertree').wpfd_serverfoldertree('getchecked')).each(function () {
            files.push(this.file);
          });

          if (files.length === 0) {
            return;
          }

          $.ajax({
            type: 'POST',
            url: url + 'task=config.wpfdRunImportServerFolders',
            data: {
              wpfd_list_import: files,
              server_category_disc: wpfd_category_disc,
              server_import_option: wpfd_import_option
            },
            beforeSend: function () {
              $('#import-server-folders-btn').find('.spinner').show().css('visibility', 'visible');
            },
            success: function (res) {
              $('#import-server-folders-btn').find('.spinner').hide();
              if ($('#import-server-folders > ul').length) {
                $('#import-server-folders > ul').remove();
              }
              if (res.success === true) {
                $.gritter.add({text: wpfd_admin.msg_import_folder_success});
              } else {
                var messages = '<ul class="wpfd-import-server-message">';
                res.existsTerms.forEach(function (val, index) {
                  messages += '<li style="font-style: italic">' + wpfd_admin.msg_import_folder_failed + ', <span style="font-weight: bold">' + val + '</span> ' + wpfd_admin.msg_import_folder_exists + '.</li>';
                });
                messages += '</ul>';
                $('#import-server-folders').append(messages);
              }
            }
          });
        }

        if (import_type === 'import-download-manager') {
          if (selected_wpdm_category !== '' || selected_wpdm_category.length) {
            $.ajax({
              type: 'POST',
              url: url + 'task=config.wpfdRunImportDownloadManagerFolders',
              data: {
                selected_wpdm_category: selected_wpdm_category,
                wpdm_category_disc: wpfd_category_disc
              },
              beforeSend: function () {
                $('#run-import-download-manager-btn .spinner').show().css('visibility', 'visible');
                if ($('#wpdm-import-message ul').length) {
                  $('#wpdm-import-message ul').remove();
                }
              },
              success: function (res) {
                $('#run-import-download-manager-btn .spinner').hide().css('visibility', 'hidden');
                if (res.success === true) {
                  $.gritter.add({text: wpfd_admin.msg_import_category_success});
                } else {
                  var messages = '<ul>';
                  jQuery.each(res.data, function (index, value) {
                    messages += '<li style="font-style: italic">' + wpfd_admin.msg_import_folder_failed + ', <span style="font-weight: bold">' + value + '</span> ' + wpfd_admin.msg_import_folder_exists + '.</li>';
                  });
                  messages += '</ul>';
                  $('#wpdm-import-message').show().css({'display': 'block', 'visibility': 'visible'}).append(messages);
                }
              }
            });
          }
        }

      },
      wpfdCloseAllCategories: function () {
        if ($('#wpfd-all-categories').length) {
          $('#wpfd-all-categories').hide();
        }
      },
      runImportXMLCategories: function (e) {
        e.preventDefault();
        var preRun = $('#wpfd-import-type').val();
        if (preRun !== 'import-xml-categories') {
          $('#wpfd-import-type').val('import-xml-categories');
          $('#wpfd-select-category').val('');
        }

        $('#wpfd-server-import-options').hide();
        $('#wpfd-all-categories').show();

        $('#save-category-disc').on('click', function () {
          var xmlCategoryDisc = $('#wpfd-select-category').val();
          $('#wpfd_import_folder_btn').unbind("click");
          $('#wpfd-import-xml-disc').val(xmlCategoryDisc);
          $('#wpfd-import-export-form').submit();
        });
      },
      wpfdOnChangeCategoryAccessMessage: function () {
        $('.wpfd_access_message').slideToggle();
      },
      wpfdOnChangeCategoryEmptyMessage: function () {
        $('.wpfd_empty_message').slideToggle();
      },
      wpfdOnChangeAdminFileCategoryPagination: function () {
        $('.wpfd-file-category-list-number.admin_pagination').slideToggle();
        wpfd_configuration.wpfdCategoryLoadMoreDismod();
      },
      wpfdOnChangeAdminFileCategoryLoadMore: function () {
        $('.wpfd-file-category-list-number.admin_load_more').slideToggle();
        wpfd_configuration.wpfdCategoryPaginationDismod();
      },
      wpfdOnChangeLimitDownload: function () {
        $('.limit-download-table-list').slideToggle();
        $('.limit-download-settings-container').toggleClass('full-width');
      },
      wpfdCategoryLoadMoreDismod:function() {
        let admin_pagination_val = $('input#admin_pagination').val() === '1' ? true : false;
        let admin_load_more_val = $('input#admin_load_more').val() === '1' ? true : false;
        if (admin_pagination_val && admin_load_more_val) {
          $('.switch input[name="ref_admin_load_more"]').trigger('click');
        }
      },
      wpfdCategoryPaginationDismod:function() {
        let admin_pagination_val = $('input#admin_pagination').val() === '1' ? true : false;
        let admin_load_more_val = $('input#admin_load_more').val() === '1' ? true : false;
        if (admin_pagination_val && admin_load_more_val) {
          $('.switch input[name="ref_admin_pagination"]').trigger('click');
        }
      },
      wpfdSetInitCategoryMessages: function () {
        var empty_message_val = $('input[name="empty_message_val"]');
        var empty_message_contents = $('#wpfd_empty_message');
        var access_message_val = $('input[name="access_message_val"]');
        var access_message_contents = $('#wpfd_access_message');

        // Set default empty category message contents
        if (empty_message_val.length && empty_message_contents.length && empty_message_val.val() === '') {
          empty_message_val.val(empty_message_contents.val());
        }

        // Set default access category message contents
        if (access_message_val.length && access_message_contents.length && access_message_val.val() === '') {
          access_message_val.val(access_message_contents.val());
        }
      }
    };

    // Search indexer
    var wpfd_indexer = {
      init: function () {
        $(document).on('change', '#search_config .switch input[name="ref_plain_text_search"]', this.onChange);
        $(document).on('mouseover', '#wpfd_rebuild_search_index', this.onMouseOver);
        $(document).on('mouseout', '#wpfd_rebuild_search_index', this.onMouseOut);
        $(document).on('click', '#wpfd_rebuild_search_index', this.run);

        this.onReady();
      },
      onReady: function () {
        var $elem = $('#plain_text_search');
        if ($elem.length && parseInt($elem.val()) === 1) {
          wpfd_indexer.pingTimer();
        }
      },
      onMouseOver: function (e) {
        e.preventDefault();
        var $this = $(e.target);
        this.status = $this.html();
        $this.html('Build Search Index');

        return false;
      },
      onMouseOut: function (e) {
        e.preventDefault();
        var $this = $(e.target);
        $this.html(this.status);

        return false;
      },
      onChange: function (e) {
        var $this = $(e.target);
        var $indexerContainer = $('.rebuild_search_index_wrapper');
        $indexerContainer.slideToggle();
      },
      run: function (e) {
        e.preventDefault();
        var $this = $(e.target);
        var confirm_text = $this.attr('data-confirm');
        var isallow = false;

        if ((confirm_text) && (confirm_text.length > 0)) {
          if (confirm(confirm_text)) {
            isallow = true;
          }
        } else {
          isallow = true;
        }

        if (isallow) {
          wpfd_indexer.ftsAction('fts.submitrebuild', {pid: wpfd_fts.pid}, function (response) {
            //
          });
        }

        return false;
      },
      pingTimer: function () {
        wpfd_indexer.ftsAction('fts.ajaxping', {'pid': wpfd_fts.pid}, wpfd_indexer.pingProgressor);
      },
      indexerBuildStatus: function (status) {
        status = JSON.parse(status);
        if (!status.message) {
          if (parseInt(status.index_ready) === 1) {
            $("#wpfd_rebuild_search_index").css('background', 'linear-gradient(90deg, #5dca70 100%, #2196f3 100%)');
            this.status = "<span class=\"wpfd_fts_status_bullet wpfd_fts_white\">&#10003;</span>"
                + "Index ready! On index: <b>" + status.n_inindex + "</b> files";
            $('#wpfd_rebuild_search_index').html(this.status);
          } else {
            if (status.n_pending) {
              // $('#indexResult .progress').removeClass("hide");
              if (status.n_inindex === 0) {
                $('#wpfd_rebuild_search_index').html('<i class="wpfd-icon-indexing"></i>  Prepare to index ' + status.n_pending + ' files');
              } else {
                var total = status.n_inindex + status.n_pending;
                var processerStatus = '<i class="wpfd-icon-indexing"></i> Indexer is running: ' + status.n_actual + ' / ' + total + ' files';
                var percent = status.n_actual * 100 / (status.n_inindex + status.n_pending);
                $("#wpfd_rebuild_search_index").css('background', 'linear-gradient(90deg, #5dca70 ' + percent + '%, #2196f3 ' + percent + '%)');
                $('#wpfd_rebuild_search_index').html(processerStatus);
              }
            } else if (status.n_pending === 0) {
              $("#wpfd_rebuild_search_index").css('background', 'linear-gradient(90deg, #5dca70 0%, #2196f3 0%)');
              $("#wpfd_rebuild_search_index").html('Rebuild search index');
            } else {
              console.log(status);
            }
          }
        } else {
          this.status = "<span class=\"wpfd_fts_status_bullet wpfd_fts_red\">&#9679;</span>"
              + "<b>" + status.message + "</b>";
          $('#wpfd_rebuild_search_index').html(this.status);
        }
      },
      pingProgressor: function (response) {
        if (('code' in response) && (response['code'] === 0)) {
          wpfd_indexer.indexerBuildStatus(response['status']);
          var result = response['result'];
          switch (result) {
            case 5:
              // Start indexing of part
              wpfd_indexer.ftsAction('fts.rebuildstep', {'pid': wpfd_fts.pid}, wpfd_indexer.pingProgressor);
              break;
            case 10:
              // Indexing in progress (other process)
              setTimeout(wpfd_indexer.pingTimer, wpfd_fts.pingtimeout);
              break;
            case 0:
            default:
              // Nothing to index
              setTimeout(wpfd_indexer.pingTimer, wpfd_fts.pingtimeout);
          }
        }
      },
      ftsAction: function (action, data, callback) {
        var url = wpfdajaxurl;
        if (url.indexOf('wpfd') === -1) {
          url = wpfdajaxurl + "?action=wpfd&"
        }
        $.ajax({
          url: url + "task=" + action,
          method: 'POST',
          data: {'__xr': 1, 'z': JSON.stringify(data)},
          success: function (response) {
            var ret = true;
            if ((typeof callback !== 'undefined') && (callback)) {
              var vars = {};
              for (var i = 0; i < response.length; i++) {
                switch (response[i][0]) {
                  case 'vr':
                    vars[response[i][1]] = response[i][2];
                    break;
                }
              }
              ret = callback(vars);
            }
            if ((ret) || (typeof ret === 'undefined')) {
              for (var i = 0; i < response.length; i++) {
                var data = response[i];
                switch (data[0]) {
                  case 'cn':
                    break;
                  case 'al':
                    alert(data[1]);
                    break;
                  case 'as':
                    if ($(data[1]).length > 0) {
                      $(data[1]).html(data[2]);
                    }
                    break;
                  case 'js':
                    eval(data[1]);
                    break;
                  case 'rd':
                    document.location.href(data[1]);
                    break;
                  case 'rl':
                    window.location.reload();
                    break;
                }
              }
            }
          },
          error: function () {
            window.location.reload();
          },
          dataType: 'json',
        });

      },
    };

    // Search cache config
    var wpfd_search_cache = {
      init: function () {
        $(document).on('change', '#search_config .switch input[name="ref_search_cache"]', this.onChange);

        this.onReady();
      },
      onReady: function () {
        var $elem = $('#search_config .switch input[name="ref_search_cache');
        var $cache_lifetime = $('#search_config input[name="cache_lifetime_val"]').parent();
        if ($elem.length && parseInt($elem.val()) === 1) {
          $cache_lifetime.show();
        } else {
          $cache_lifetime.hide();
        }
      },
      onChange: function (e) {
        var $cache_lifetime = $('#search_config input[name="cache_lifetime_val"]').parent();
        $cache_lifetime.slideToggle();
      }
    }

    // Generate preview
    var wpfd_generate_preview = {
      disabled: false,
      running: false,
      pinger: false,
      init: function() {
        $(document).on('change', '.switch input[name="ref_auto_generate_preview"]', this.onChange);
        $(document).on('click', '#wpfd_generate_preview', {'wrapper': this}, this.run);
        $(document).on('mouseover', '#wpfd_generate_preview', {'wrapper': this}, this.onMouseOver);
        $(document).on('mouseout', '#wpfd_generate_preview', this.onMouseOut);
        // Generate preview show log
        $(document).on('click', '#wpfd_show_log', this.showGeneratePreviewLog);
        this.onReady();
      },
      onReady: function() {
        var $elem = $('#auto_generate_preview');
        if ($elem.length && parseInt($elem.val()) === 1) {
          wpfd_generate_preview.send('generatepreview.status', {}, wpfd_generate_preview.pingProcessor);
        }
      },
      showGeneratePreviewLog: function(e) {
        var $this = $(this);
        var showLabel = $(this).data('show-label');
        var hideLabel = $(this).data('hide-label');
        $('#wpfd_generate_preview-logs').slideToggle(400, function() {
          if ($('#wpfd_generate_preview-logs').is(':visible')) {
            $this.text(hideLabel);
          } else {
            $this.text(showLabel);
          }
        });

      },
      ping: function(data) {
        wpfd_generate_preview.pinger = setTimeout(function() {
          if (wpfd_generate_preview.running) {
            return;
          }
          wpfd_generate_preview.running = true;
          wpfd_generate_preview.send('generatepreview.status', {}, wpfd_generate_preview.pingProcessor);
          wpfd_generate_preview.running = false;
        }, 5000);
      },
      onMouseOver: function (e) {
        e.preventDefault();
        if (wpfd_generate_preview.disabled) {
          return;
        }
        var $this = $(e.target);
        this.status = $this.html();
        $this.html('REGENERATE ALL FILES PREVIEW/THUMBNAIL');

        return false;
      },
      onMouseOut: function (e) {
        e.preventDefault();
        if (wpfd_generate_preview.disabled) {
          return;
        }
        var $this = $(e.target);
        $this.html(this.status);

        return false;
      },
      onChange: function () {
        $('.generate_preview_wrapper').slideToggle();
      },
      run: function() {
        if (wpfd_generate_preview.disabled) {
          return;
        }
        var $this = $(this);
        var confirm_text = $this.attr('data-confirm');
        var isallow = false;

        if ((confirm_text) && (confirm_text.length > 0)) {
          if (confirm(confirm_text)) {
            isallow = true;
          }
        } else {
          isallow = true;
        }

        if (isallow) {
          wpfd_generate_preview.send('generatepreview.restartqueue', {}, function(data) {
            if (typeof (data.code) !== "undefined") {
              $('#wpfd_generate_error_message').html(data.message);
              // Hide error message after 15sec
              setTimeout(function() {
                $('#wpfd_generate_error_message').html('');
              }, 15000);
            } else {
              clearTimeout(wpfd_generate_preview.pinger);
              // Update current status to waiting
              $("#wpfd_generate_preview").css('background', 'linear-gradient(90deg, #5dca70 100%, #2196f3 100%)');
              $('#wpfd_generate_preview').html('Waiting...');
              wpfd_generate_preview.ping();
            }
          });
        }

        return false;
      },
      pingStatus: function() {
        wpfd_generate_preview.send('generatepreview.status', {}, wpfd_generate_preview.updateStatus);
      },
      pingProcessor: function(status) {
        if (typeof status === 'string') {
          status = JSON.parse(status);
        }
        wpfd_generate_preview.updateStatus(status);

        if (!status.is_running && (status.p_generated + status.p_error) !== status.p_total) {
          wpfd_generate_preview.send('generatepreview.runqueue', {}, function() {});
        }
        clearTimeout(wpfd_generate_preview.pinger);
        if ((status.p_generated + status.p_error) !== status.p_total) {
          wpfd_generate_preview.ping();
        }
      },
      updateStatus: function (status) {
        if (typeof status === 'string') {
          status = JSON.parse(status);
        }
        if (typeof status.message !== "undefined") {
          if (status.error && status.code === 'user_not_login') {
            // Disable button
            // $("#wpfd_generate_preview").prop('disabled', true);
            wpfd_generate_preview.disabled = true;
            $("#wpfd_generate_preview").unbind('click').on('click', function() {
              window.location.href = wpfd_configuration_vars.joomunited_connect_url;
            });
          }
          $("#wpfd_generate_preview").css('background', 'linear-gradient(90deg, #5dca70 100%, #2196f3 100%)');
          $('#wpfd_generate_preview').html(status.message);
        } else {
          $("#wpfd_generate_preview").prop('disabled', false);
          wpfd_generate_preview.disabled = false;
          // Prepare
          var pending = status.p_pending;
          var processing = status.p_processing;
          var error = status.p_error;
          var generated = status.p_generated;
          var total = status.p_total;
          var logs = status.logs || '';

          var $logsWrapper = $('#wpfd_generate_preview-logs');

          $logsWrapper.html('');
          if (logs) {
            var logLabel = $logsWrapper.data('label');

            $logsWrapper.show();
            $logsWrapper.html('<h4 class="wpfd_log_label">' + logLabel + '</h4><ul>' + logs.split("\n").map(function(line) { return '<li>' + line + '</li>';}).join('') + '</ul>');
            $logsWrapper.animate({scrollTop: $logsWrapper.prop('scrollHeight')}, 500);
          }

          if (generated + error === total) {
            $("#wpfd_generate_preview").css('background', 'linear-gradient(90deg, #5dca70 0%, #2196f3 0%)');
            if (total === 0 && generated === 0) {
              $("#wpfd_generate_preview").html('Generate Preview/Thumbnail');
            } else {
              $("#wpfd_generate_preview").html(generated + ' files preview/thumbnail generated!');
            }
            $logsWrapper.hide();
          } else {
            var processerStatus = '<i class="wpfd-icon-indexing"></i> Generator is running: ' + generated + ' / ' + total + ' files';
            var percent = generated * 100 / total;
            $("#wpfd_generate_preview").css('background', 'linear-gradient(90deg, #5dca70 ' + percent + '%, #2196f3 ' + percent + '%)');
            $('#wpfd_generate_preview').html(processerStatus);
            $('#wpfd_generate_error_message').html('');
          }

          if (error > 0 && typeof (status.error_message) !== "undefined") {
            $('#wpfd_generate_error_message').html(status.error_message);
          }
        }
      },
      send: function(action, data, callback) {
        var url = wpfdajaxurl;
        if (url.indexOf('wpfd') === -1) {
          url = wpfdajaxurl + "?action=wpfd&"
        }
        $.ajax({
          url: url + "task=" + action,
          method: 'POST',
          data: {data: data},
          success: function(response) {
            if (typeof response === "string") {
              response = JSON.parse(response);
            }
            callback(response);
          }
        });
      }
    };

    // Remember activate tab
    var wpfd_tabs = {
      init: function () {
        $(document).on('click', '.ju-menu-tabs > .tab > a,.ju-top-tabs > .tab > a', this.tabClick);
        // $(document).on('click', '.ju-top-tabs > .tab > a', this.subTabClick);
        $(document).ready(this.activateTabFromCookie);
      },
      tabClick: function (e) {
        var $this = $(e.target);
        var tab_id = $this.attr('href').replace('#', '');
        wpfd_tabs.setActivatedTabToCookie(tab_id);
      },
      subTabClick: function (e) {
        var $this = $(e.target);
        var tab_id = $this.attr('href').replace('#', '');
        wpfd_tabs.setActivatedTabToCookie(tab_id);
      },
      activateTabFromCookie: function () {
        var active_tab = wpfd_tabs.getActivatedTabFromCookie();
        if (active_tab !== '') {
          var tab = $(".ju-menu-tabs a[href='#" + active_tab + "']");
          if (tab.length) {
            tab.trigger('click');
          } else { // This is sub tab
            tab = $(".ju-top-tabs a[href='#" + active_tab + "']");
            var parentHref = $(tab).closest('.ju-content-wrapper').attr('id');
            var tabHref = $(tab).attr('href').replace('#', '');
            $('.ju-menu-tabs .tab a.link-tab').removeClass('expanded active');
            var parentNode = $('.ju-menu-tabs .tab a.link-tab[href="#' + parentHref + '"]');
            $(parentNode).trigger('click');
            $(parentNode).closest('li.tab').find('.ju-submenu-tabs').find('div.link-tab[data-href="#' + tabHref + '"]').trigger('click');
          }
        }
      },
      getActivatedTabFromCookie: function () {
        var name = "wpfd_config_activated_tab=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1);
          if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return '';
      },
      setActivatedTabToCookie: function (id) {
        document.cookie = 'wpfd_config_activated_tab=' + id;
      },
    };

    // Init
    wpfd_configuration.init();
    wpfd_indexer.init();
    wpfd_generate_preview.init();
    wpfd_tabs.init();
    wpfd_search_cache.init();

    // Remove message
    if(jQuery('.save-message').length > 0) {
      var $ =jQuery;
      $('.cancel-btn').on('click', function () {
        $('.save-message').remove();
      });
    }

    if(jQuery('.save-message-error').length > 0) {
      var $ =jQuery;
      $('.cancel-btn').on('click', function () {
        $('.save-message-error').remove();
      });
    }
  });
})(jQuery);