(function ($) {
  // $(document).on('click', function (e) {
  //   var domNode = $('#wpfd-core #restableMenu0');
  //   if (!domNode || domNode.find(e.target).length === 0) {
  //     domNode.addClass('restableMenuClosed');
  //   }
  // });
  var bytesToSize = function(bytes) {
    var sizes = [];
    if (typeof(window.wpfdHelper) !== 'undefined' && typeof(window.wpfdHelper.fileMeasure) !== 'undefined' && window.wpfdHelper.fileMeasure.length > 0) {
      sizes = window.wpfdHelper.fileMeasure;
    } else {
      sizes = ['B','KB','MB','GB','TB','PB'];
    }
    if (bytes <= 0) return 'N/A';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };
  $(document).ready(function ($) {
    var wpfd_core = {
      updateTitleAjax: null,
      updateDescAjax: null,
      oldTitle: null,
      oldDesc: null,
      init: function () {
        if (typeof Wpfd !== 'object') {
          console.error('Fail on load Wpfd object!');
          return false;
        }

        // Add border-radius to visible tb in table
        $(document).on('load mouseover mouseout', '#wpfd-core tr.file td', this.addLastBorder)
          .on('change', '#wpfd-core #rightcol .switch input[type="checkbox"]', this.switch)
          .on('click', '.shortcode-copy', this.copy)
          .on('click', '#wpfd-hamburger', function() {
          var leftCol = $('#wpfd-categories-col');
          if (leftCol.css('left') == '-270px') {
            leftCol.css('left', '0');
          } else {
            leftCol.css('left', '-270px');
          }
        })
          .on('click', '.js-search-clear', function(e) {
            e.preventDefault();
            var selectCategoryMsg = wpfd_admin.msg_admin_search_select_category ? wpfd_admin.msg_admin_search_select_category : '';
              $('[name="search[query]"]').val('');
              $('[name="search[extension]"]').val('');
              $('[name="search[category_id]"]').val('0');
              $('[name="search[category_id]"] + .chzn-container > a > span').text(selectCategoryMsg);
              $('[name="search[created_date]"]').val('');
              $('[name="search[updated_date]"]').val('');
              $('[name="search[weight][from]"]').val('');
              $('[name="search[weight][from_unit]"]').val('b');
              $('[name="search[weight][to]"]').val('');
              $('[name="search[weight][to_unit]"]').val('b');
              $('[name="search[waiting_for_approval]"]').prop('checked', false);
              return false;
          });
        $('.scroller_wrapper_inner').mCustomScrollbar({ // document: http://manos.malihu.gr/jquery-custom-content-scroller/
          axis: 'y',
          theme: 'dark',
          scrollInertia: 300,
          live: true,
          autoHideScrollbar: false,
          contentTouchScroll: false,
          autoExpandScrollbar: true,
        });
        this.loadPreviousCategory();
        this.checkDuplicateStatus();
        $(document).on('click', '#wpfd-categories-col .wpfd_add_new', this.dropDownClick)
          // Events trigger
          .on('wpfd_preview_updated wpfd_admin_search', '#wpfd-core #preview', this.wpfdPreviewUpdated)
          .on('wpfd_category_created', '#categorieslist .dd-content', this.wpfdCategoryCreated)
          .on('wpfd_category_click', '#categorieslist .dd-content', this.wpfdCategoryClick)
          .on('wpfd_category_param_loaded', this.initThemeSelect)
          .on('click', '.edit-category-title', this.setCategoryTitle)
          .on('click', '.edit-category-desc', this.setCategoryDesc)
          .on('keypress', '.edit-category-title.editable', this.updateCategoryTitle)
          .on('keypress', '.edit-category-desc.editable', this.updateCategoryDesc)
          .on('input', '#category_filter_text', this.folderSearch)
          .on('wpfd_file_save_success', this.onFileSaved);

      },
      initColsOptions: function() {
        var cols = $('.wpfd_tbl .wpfd_row.head .wpfd_cell'),
        colsTitle = {};
        // Get current colstate in localStorage
        var currentColsState = localStorage.getItem('wpfd_admin_cols_state', false);
        if (currentColsState) {
          currentColsState = JSON.parse(currentColsState);
          // Init table cols state
          Object.keys(currentColsState).forEach(function(th_key) {
            var colIndex = $('.wpfd_tbl .head .wpfd_cell.th_' + th_key).index();
            if (currentColsState[th_key]) {
              // Show col
              $('.wpfd_tbl .wpfd_cell:nth-child('+(colIndex+1)+')').removeClass('hiddenCol').css('display', 'flex');
            } else { // Hide col
              $('.wpfd_tbl .wpfd_cell:nth-child('+(colIndex+1)+')').addClass('hiddenCol').hide();
            }
          });

        }


        cols.each(function() {
          var th_class = $(this).data('key');
          colsTitle[th_class] = $(this).text().trim();
        });
        // Generate toolbox
        var toolBox = '<div class="wpfd_tbl_toolbox">';
        toolBox += '<i class="material-icons">filter_list</i>';
        toolBox += '<ul>';
        Object.keys(colsTitle).forEach(function(th_key) {
          toolBox += '<li>';
          if (!currentColsState) { // Default open all state
            checked = ' checked';
          } else {
            checked = currentColsState[th_key] ? ' checked' : '';
          }
          toolBox += '<label for="wpfd_col_'+th_key+'"><input type="checkbox" id="wpfd_col_'+th_key+'" name="wpfd_col_'+th_key+'" '+checked+'/> '+colsTitle[th_key]+'</label>';

          toolBox += '</li>';
        });

        toolBox += '</ul>';
        toolBox += '</div>';
        var $toolBox = $(toolBox);
        $('.material-icons', $toolBox).on('click', function(e) {
          e.preventDefault();
          $(this).parent().toggleClass('toolbox_open');
        });
        $('input[name^="wpfd_col_"]', $toolBox).on('change', function(e) {
          e.preventDefault();
          var headerClass = $(this).attr('id');

          if (!headerClass) {
            return false;
          }

          headerClass = headerClass.replace('wpfd_col_', '');
          var checked = $(this).is(':checked');
          var colIndex = $('.wpfd_tbl .head .wpfd_cell.th_' + headerClass).index();
          if (checked) {
            // Show col
            $('.wpfd_tbl .wpfd_cell:nth-child('+(colIndex+1)+')').removeClass('hiddenCol').css('display', 'flex');
          } else { // Hide col
            $('.wpfd_tbl .wpfd_cell:nth-child('+(colIndex+1)+')').addClass('hiddenCol').hide();
          }
          // Update localStorage
          var colsState = {};
          $('.wpfd_tbl .wpfd_row.head .wpfd_cell').each(function() {
              var key = $(this).data('key');
              var isHidden = false;
              colsState[key] = true;
              if ($(this).hasClass('hiddenCol')) {
                colsState[key] = false;
              }
          });
          localStorage.setItem('wpfd_admin_cols_state', JSON.stringify(colsState));
        });
        $toolBox.insertAfter($('.wpfd_tbl'));
      },

      onFileSaved: function(e, params, fileId, catId) {
        var fileDiv = $('.wpfd_row.file[data-id-file="'+fileId+'"]');
        if (fileDiv.length === 0) {
          return false;
        }

        // Update title
        if (params.hasOwnProperty('title')) {
          fileDiv.find('.title').text(params.title.replace(/\\/g, ''));
        }
        // Update filesize
        if (params.hasOwnProperty('size')) {
          if (params.size !== null) {
            fileDiv.find('.size').text(bytesToSize(params.size));
          }
        }
        // Update created
        if (params.hasOwnProperty('created')) {
          fileDiv.find('.created').text(params.created);
        }
        // Update modified
        if (params.hasOwnProperty('modified')) {
          fileDiv.find('.modified').text(params.modified);
        }
        // Update Version
        if (params.hasOwnProperty('version')) {
          fileDiv.find('.version').text(params.version);
        }
        // Update hits
        if (params.hasOwnProperty('hits')) {
          // Get hits text
          var oldHits = fileDiv.find('.hits').text();
          fileDiv.find('.hits').text(params.hits + ' ' + oldHits.split(' ').pop());
        }

        // File public state + icon
        if (params.hasOwnProperty('state')) {
          if (parseInt(params['state']) === 1) {
            fileDiv.removeClass('unpublished');
          } else {
            fileDiv.addClass('unpublished');
            var fileClass = fileDiv.attr('class');
            if (fileClass.indexOf('isPending') !== -1) {
              // Pending file icon
              var $pendingButton = $('<button class="wpfd-pending-btn">'+ wpfd_admin.file_waiting_for_approval +'</button>');
              fileDiv.find('.title').prepend($pendingButton);
            }
          }
        }
        // Icons
        if (params.hasOwnProperty('icons')) {
          $('.filestatus-wrapper', fileDiv).html(params['icons']);
        }
      },
      updateTitle: function (title, oldTitle) {
        var $link = $('.edit-category-title');
        var id_category = $link.data('id-category');
        if (title !== '') {
          wpfd_core.updateTitleAjax = $.ajax({
            url: wpfdajaxurl + "task=category.setTitle",
            data: {id_category: id_category, title: title},
            type: "POST"
          }).done(function (data) {
            result = jQuery.parseJSON(data);
            if (result.response === true) {
              // $link.text(title);
              $link.attr('contenteditable', false);
              $link.removeClass('editable');
              $('[data-id-category="'+id_category+'"] > .dd-content > .t > .title').text(title);
              $('.gritter-item-wrapper ').remove();
              $.gritter.add({text: wpfd_admin.msg_edit_category});
              return true;
            }

            $link.text(oldTitle);
            $link.attr('contenteditable', false);
            $link.removeClass('editable');
            $('[data-id-category="'+id_category+'"] > .dd-content > .t > .title').text(oldTitle);

            return false;
          });
        } else {
          $link.text(oldTitle);
          $link.attr('contenteditable', false);
          $link.removeClass('editable');
          $('[data-id-category="'+id_category+'"] > .dd-content > .t > .title').text(oldTitle);

          return false;
        }
      },
      updateDesc: function (desc, oldDesc) {
        var $link = $('.edit-category-desc');
        var id_category = $link.data('id-category');
        if (desc !== '') {
          wpfd_core.updateDescAjax = $.ajax({
            url: wpfdajaxurl + "task=category.setDescription",
            data: {id_category: id_category, desc: desc},
            type: "POST"
          }).done(function (data) {
            result = jQuery.parseJSON(data);
            if (result.response === true) {
              // $link.text(title);
              $link.attr('contenteditable', false);
              $link.removeClass('editable');
              $('.gritter-item-wrapper ').remove();
              $.gritter.add({text: wpfd_admin.msg_edit_category_desc});
              return true;
            }

            $link.text(oldDesc);
            $link.attr('contenteditable', false);
            $link.removeClass('editable');

            return false;
          });
        } else {
          $link.text(oldDesc);
          $link.attr('contenteditable', false);
          $link.removeClass('editable');

          return false;
        }
      },
      updateCategoryTitle: function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          e.stopPropagation();
          var title = $(this).text();
          // Update title
          wpfd_core.updateTitle(title, wpfd_core.oldTitle);
          wpfd_core.oldTitle = null;
          return false;
        }
      },
      updateCategoryDesc: function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          e.stopPropagation();
          var desc = $(this).text();
          // Update title
          wpfd_core.updateDesc(desc, wpfd_core.oldDesc);
          wpfd_core.oldDesc = null;
          return false;
        }
      },
      setCategoryDesc: function (e) {
        e.preventDefault();
        if (!wpfd_permissions.can_edit_category) {
          bootbox.alert(wpfd_permissions.translate.wpfd_edit_category);
          return false;
        }
        $(this).attr('contenteditable', true);
        $(this).addClass('editable');
        $(this).selectText();
        wpfd_core.oldDesc = $(this).text();
      },
      setCategoryTitle: function (e) {
        e.preventDefault();
        if (!wpfd_permissions.can_edit_category) {
          bootbox.alert(wpfd_permissions.translate.wpfd_edit_category);
          return false;
        }
        $(this).attr('contenteditable', true);
        $(this).addClass('editable');
        $(this).selectText();
        wpfd_core.oldTitle = $(this).text();
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
      },
      addLastBorder: function (e) {
        var $this = $(this);
        $this.parent().find('td').removeClass('bfirst blast');
        $this.parent().find('td:visible:first').addClass('bfirst');
        $this.parent().find('td:visible:last').addClass('blast');
      },
      switch: function (e) {
        var $this = $(this);
        var ref = $this.attr('name').replace('ref_', '');
        $('input[name="' + ref + '"]').val($this.prop('checked') ? 1 : 0);
      },
      loadPreviousCategory: function () {
        var catId = localStorage.getItem('wpfdSelectedCatId');
        if (catId) {
          if (typeof window.parent.selectedCatId !== "undefined") {
            return;
          }
          if (typeof window.parent.selectedFileId !== "undefined") {
            return;
          }
          var previousCat = $('[data-id-category=' + catId + '] .dd-content').first();
          previousCat.click();
          //$('#wpfd-core .scroller_wrapper').mCustomScrollbar("scrollTo", previousCat);
        }
      },
      checkDuplicateStatus: function () {
        var duplicateSuccess = localStorage.getItem('wpfdDuplicateSuccess');
        if (duplicateSuccess) {
          $('#wpfd-categories-col #categorieslist li[data-id-category=' + duplicateSuccess + ']').parents('li.dd-item').removeClass('dd-collapsed');
          $.gritter.add({text: wpfd_admin.msg_duplicate_category});
          localStorage.removeItem('wpfdDuplicateSuccess');
        }
      },
      wpfdCategoryClick: function (e) {
        Wpfd.log('wpfd_category_click fired!');
        e.stopPropagation();
        var categoryId = $(e.target).parent().data('id-category');
        // Save category
        localStorage.setItem('wpfdSelectedCatId', categoryId);

        // Change search form category
        $('[id="search[category_id]"]').val(categoryId);
        $('[id="search[category_id]"]').trigger('chosen:updated').trigger('change');
      },
      wpfdPreviewUpdated: function (e) {
        var preview = $(this);
        Wpfd.log('event wpfd_preview_updated fired!');
        // Init Drop block for overlay
        // Remove old overlay
        if ($('#wpfd-drop-overlay').length) {
          $('#wpfd-drop-overlay').remove();
        }
        var dropOverlay = $('<div id="wpfd-drop-overlay" class="wpfd-drop-overlay hide"><div class="wpfd-overlay-inner">' + wpfd_admin.msg_upload_drop_file + '</div></div>');
        $('#wpfd-core').append(dropOverlay);
        Wpfd.uploader.assignDrop($('#wpfd-drop-overlay'));
        $('#wpfd-drop-overlay').on('drop', function () {
          $(this).addClass('hide');
          $('.wpfd_row.editor').removeClass('drag_drop');
          $('.wpfd_row.editor').addClass('file_version_drag_drop');
        });
        // Show overlay on drag to #preview
        $('#preview').on("dragenter", function (e) {
          if (e.target === this) {
            return;
          }

          $('#wpfd-drop-overlay').removeClass('hide');
          $('.wpfd_row.editor').addClass('drag_drop');
          $('.wpfd_row.editor').removeClass('file_version_drag_drop');
        });
        $(document).on("dragleave", function (e) {
          // Detect is real dragleave
          if (e.originalEvent.pageX !== 0 || e.originalEvent.pageY !== 0) {
            return false;
          }
          $('#wpfd-drop-overlay').addClass('hide');
          $('.wpfd_row.editor').removeClass('drag_drop');
          $('.wpfd_row.editor').addClass('file_version_drag_drop');
        });
        // Add pending icon
        var $pendingButton = $('<button class="wpfd-pending-btn">' + wpfd_admin.file_waiting_for_approval + '</button>');
        var row = $('.isPending');
        $('.title', row).prepend($pendingButton);

        wpfd_core.initColsOptions();
      },
      wpfdCategoryCreated: function (e) {
        Wpfd.log('event wpfd_category_created fired!');
        //$('#wpfd-core .scroller_wrapper').mCustomScrollbar("scrollTo", $(this));
      },
      dropDownClick: function (e) {
        e.preventDefault();
        $('#wpfd-categories-col .ju-dropdown-menu').show();
        return false;
      },
      initThemeSelect: function () {
        $('.wpfd-themes-select .wpfd-theme').on('click', function (e) {
          var $this = $(this);
          $('.wpfd-themes-select .wpfd-theme').removeClass('checked');
          $this.addClass('checked');
          var input = $('#wpfd-theme');
          input.val($this.attr('ref'));
          input.trigger('change'); // Made sure it trigger a change
        });
      },
      folderSearch: function (e) {
        e.preventDefault();
        var keyword = $(this).val().trim().toLowerCase();
        if (keyword === '') {
          $('#categorieslist li').removeClass('folderhide');
          $('#nocategoryfound').remove();
          return false;
        }
        var foundCategories = [], categoriesData = $('.nested').nestable('serialize');

        if (categoriesData) {
          function do_folder_search(items) {
            for (var item of items) {
              var folder_name = $(item.content).find('.title').text();

              if (folder_name.trim().toLowerCase().indexOf(keyword) !== -1) {
                foundCategories.push(item.id);
              }
              if (item.hasOwnProperty('children')) {
                do_folder_search(item.children)
              }
            }
          }

          do_folder_search(categoriesData);

          $('#categorieslist li').addClass('folderhide');
          $('#nocategoryfound').remove();
          if (foundCategories.length) {
            $.each(foundCategories, function (i, v) {
              $('#categorieslist li[data-id="' + v + '"]').removeClass('folderhide closed');
              $('#categorieslist li[data-id="' + v + '"]').parents('#categorieslist li').removeClass('folderhide closed');
            });
          } else {
            // Show message on no category found
            $('<div id="nocategoryfound" style="text-align:center">' + wpfd_admin.msg_no_category_found + '</div>').insertAfter('#categorieslist');
          }
        }
        return false;
      }
    };

    wpfd_core.init();

  });
})(jQuery);
