jQuery(function($) {
  // contextmenu event gets trigged to right click
  function initContextMenu($context, $menu) {
    var timerLongTouch;
    var longTouch = false;
    function contextFire(e) {
      //e.preventDefault();
      clearTimeout(timerLongTouch);
      // Places the dropdown at mouse tip
      var pageX = typeof e.pageX === "undefined" ? e.changedTouches[0].pageX : e.pageX;
      var pageY = typeof e.pageY === "undefined" ? e.changedTouches[0].pageY : e.pageY;
      var left = pageX;

      var top = pageY - $(window).scrollTop();
      var innerHeight = window.innerHeight;
      var innerWidth = window.innerWidth;
      var bottomSpace = innerHeight - top;
      var right = innerWidth - left;

      if (bottomSpace < 400) {
        top = pageY - $('.wpfd-contextmenu' + $menu).height();
      }
      if (top < 0) {
        top = 32;
      }

      if (right < 270) {
        left = left - 270;
      }

      if (left < 0) {
        left = 0;
      }

      $('.wpfd-contextmenu').css({
        left: left,
        top: top
      });

      // File menu control
      if ($menu === '.wpfd-file-menu') {
        if ($('.file.selected').length === 0) {
          if (!(e.ctrlKey || e.metaKey)) {
            $('.file').removeClass('selected');
          }
          $(e.target).closest('.file').addClass('selected');
        }

        if ($('.file.selected').length === 1) {
          $('.file').removeClass('selected');
          $(e.target).closest('.file').addClass('selected');
          if ($(e.target).closest('.file').hasClass('unpublished')) {
            // Hide unpublish menu, show publish menu
            $('[data-action="file.unpublish"]').hide();
            $('[data-action="file.publish"]').show();
          } else {
            // Hide publish menu, show unpublish
            $('[data-action="file.publish"]').hide();
            $('[data-action="file.unpublish"]').show();
          }
        } else {
          $(e.target).closest('.file').addClass('selected');
          // Maybe multiple select, show all items
          $('[data-action="file.publish"]').show();
          $('[data-action="file.unpublish"]').show();
        }
      } else if ($menu === '.wpfd-folder-menu') {
        var selectedCategory;
        if (typeof e.target !== 'undefined') {
          selectedCategory = $(e.target).closest('.dd-item');
        } else {
          selectedCategory = $('#categorieslist .dd-item.active');
        }
        var type = selectedCategory.data('type');

        if (!type) {
          $('[data-action="folder.synchronize"]').hide();
        } else {
          $('[data-action="folder.synchronize"]').show();
        }
      }
      // Makes sure the dropdown is hidden before
      // showing it up to avoid inconsistency
      destroyContextMenu();

      //Slides down the dropdown
      $('.wpfd-contextmenu' + $menu).slideDown('fast');

      wpfd_contextmenu.init($(e.target));
      // Returning false prevents the default action
      // from happening, which is showing the browser's
      // contextmenu in this case
      return false;
    }
    $($context)
      //.off('touchstart touchmove touchend')
      .on('touchstart', function(event) {
        // Prevent default behavior
        // event.preventDefault();
        if ($menu === '.wpfd-file-menu') {
          event.stopPropagation();
        }
        // Timer for long touch detection
        timerLongTouch = setTimeout(function() {
          // Flag for preventing "normal touch event" trigger when touch ends.
          longTouch = true;
          contextFire(event);
          // Test long touch detection (remove previous alert to test it correctly)
        }, 700);
      })
      .on('touchend', function(event) {
        // Prevent default behavior
        //event.preventDefault();
        if ($menu === '.wpfd-file-menu') {
          event.stopPropagation();
        }
        // If timerLongTouch is still running, then this is not a long touch
        // so stop the timer
        clearTimeout(timerLongTouch);

        if(longTouch){
          longTouch = false;
          // Do here stuff linked to long touch end
          // (if different from stuff done on long touch detection)

        } else {
          // Do here stuff linked to "normal" touch move
        }
      });
    $($context).off('contextmenu', contextFire).on('contextmenu', contextFire);
    $($context).on('click', function(e) {
      destroyContextMenu();
    });
  }
  $('#wpfd_ios_category_menu').off('click').on('click', function(e) {
    // Places the dropdown at mouse tip
    var pageX = typeof e.pageX === "undefined" ? e.changedTouches[0].pageX : e.pageX;
    var pageY = typeof e.pageY === "undefined" ? e.changedTouches[0].pageY : e.pageY;
    var left = pageX;

    var top = pageY - $(window).scrollTop();
    var innerHeight = window.innerHeight;
    var innerWidth = window.innerWidth;
    var bottomSpace = innerHeight - top;
    var right = innerWidth - left;

    if (bottomSpace < 400) {
      top = pageY - $('.wpfd-contextmenu.wpfd-folder-menu').height();
    }
    if (top < 0) {
      top = 32;
    }

    if (right < 270) {
      left = left - 270;
    }

    if (left < 0) {
      left = 0;
    }

    $('.wpfd-contextmenu').css({
      left: left,
      top: top
    });
    var selectedCategory = $('#categorieslist .dd-item.active');
    var type = selectedCategory.data('type');

    if (!type) {
      $('[data-action="folder.synchronize"]').hide();
    } else {
      $('[data-action="folder.synchronize"]').show();
    }
    // Makes sure the dropdown is hidden before
    // showing it up to avoid inconsistency
    destroyContextMenu();

    //Slides down the dropdown
    $('.wpfd-contextmenu.wpfd-folder-menu').slideDown('fast');

    wpfd_contextmenu.init($('.dd-item.active'));
    // Returning false prevents the default action
    // from happening, which is showing the browser's
    // contextmenu in this case
    return false;
  });
  $('#wpfd_ios_file_menu').off('click').on('click', function(e) {
    // Places the dropdown at mouse tip
    var pageX = typeof e.pageX === "undefined" ? e.changedTouches[0].pageX : e.pageX;
    var pageY = typeof e.pageY === "undefined" ? e.changedTouches[0].pageY : e.pageY;
    var left = pageX;

    var top = pageY - $(window).scrollTop();
    var innerHeight = window.innerHeight;
    var innerWidth = window.innerWidth;
    var bottomSpace = innerHeight - top;
    var right = innerWidth - left;

    if (bottomSpace < 400) {
      top = pageY - $('.wpfd-contextmenu.wpfd-file-menu').height();
    }
    if (top < 0) {
      top = 32;
    }

    if (right < 270) {
      left = left - 270;
    }

    if (left < 0) {
      left = 0;
    }

    $('.wpfd-contextmenu').css({
      left: left,
      top: top
    });


    if ($('.file.selected').hasClass('unpublished')) {
      // Hide unpublish menu, show publish menu
      $('[data-action="file.unpublish"]').hide();
      $('[data-action="file.publish"]').show();
    } else {
      // Hide publish menu, show unpublish
      $('[data-action="file.publish"]').hide();
      $('[data-action="file.unpublish"]').show();
    }

    // Makes sure the dropdown is hidden before
    // showing it up to avoid inconsistency
    destroyContextMenu();

    //Slides down the dropdown
    $('.wpfd-contextmenu.wpfd-file-menu').slideDown('fast');

    wpfd_contextmenu.init($('.file.selected'));
    // Returning false prevents the default action
    // from happening, which is showing the browser's
    // contextmenu in this case
    return false;
  });
  function destroyContextMenu() {
    $('.wpfd-contextmenu').hide();
    wpfd_contextmenu.destroy();
  }

  // Init menu on first page load
  initContextMenu('#categorieslist .dd-content', '.wpfd-folder-menu');
  initContextMenu('#wpfd-categories-col .wpfd-pseudo-top-cat', '.wpfd-topfolder-menu');
  initContextMenu('#preview', '.wpfd-preview-menu');

  // Re-init contextmenu when new category created
  $(document).on('wpfd_category_created', '#categorieslist .dd-content', function() {
    initContextMenu('#categorieslist .dd-content', '.wpfd-folder-menu');
  });

  // Re-init contextmenu when categories refreshed
  $(document).on('wpfd_context_folder_refresh', function() {
    initContextMenu('#categorieslist .dd-content', '.wpfd-folder-menu');
  });

  // Re-init files contextmenu when category clicked
  $(document).on('wpfd_preview_updated', '#wpfd-core #preview', function() {
    initContextMenu('#preview .file', '.wpfd-file-menu');
  });

  // Re-init files context menu when search fire
  $(document).on('wpfd_admin_search', '#wpfd-core #wpreview', function() {
    initContextMenu('#preview .file', '.wpfd-file-menu');
  });
  // When left click occurs, hide the contextmenu
  $( document ).on('click', destroyContextMenu);

  var wpfd_contextmenu = {
    context: null,
    init: function(e) {
      var $this = this;
      this.context = e;
      var folderColor = this.context.parent().data('color') ?? false;
      $('.wpfd-contextmenu li:not(".menu-item-disabled"):not([data-custom-action])').on('click', this.exec);

      // $('.js-select-color').on('click', function() {
      //   $('.wp-color-field-inline').minicolors('show', {});
      // });
      $('.js-selected-color').on('input', function() {
        var color = $(this).val();
        $('.wp-color-field-inline').minicolors('value', {
          color: color,
          opacity: 1
        });
      });
      $('.wpfd-color-swatchers .color').on('click', function() {
        var color = $(this).data('color');

        if (color) {
          $this.setColor(color);
          destroyContextMenu();
        }
        return false;
      });
      $('.js-setcolor').on('click', function(e) {
        e.preventDefault();
        var color = $('.wp-color-field-inline').val();

        if (color) {
          $this.setColor(color);
          destroyContextMenu();
        }
        return false;
      });
      var options = {
        inline: true,
        change: function(color, o) {
          $('.js-selected-color').val(color);
          $('.js-select-color').data('color', color);
          $('.js-select-color .material-icons').css('color', color);
        }
      };
      if (folderColor) {
        options.defaultValue = folderColor;
        $('.js-selected-color').val(folderColor);
        $('.js-select-color').data('color', folderColor);
        $('.js-select-color .material-icons').css('color', folderColor);
        // Set selected folder color
        $('.wpfd-color-swatchers .color').removeClass('selected');
        if ($('.wpfd-color-swatchers .color[data-color="'+folderColor+'"]').length) {
          $('.wpfd-color-swatchers .color[data-color="'+folderColor+'"]').addClass('selected');
        }
      }
      $('.wp-color-field-inline').minicolors(options);
      var type = this.context.parents('.dd-item').data('type');
      if (!type) {
        $('[data-action="folder.synchronize"]').hide();
      } else {
        $('[data-action="folder.synchronize"]').show();
      }
    },
    setColor: function(color) {
      var selectedCategory = $('.dd-item.active');

      var categoryId = selectedCategory.data('id-category');
      // Set color data
      selectedCategory.data('color', color);
      var icon = $('.dd-item.active > .dd-handle > .wpfd-folder');
      icon.css('color', color);

      // Save the color
      $.ajax({
        url: wpfdajaxurl + 'task=category.setcolor',
        method: 'POST',
        data: {
          category_id: categoryId,
          color: color
        },
        success: function(data) {
          data = JSON.parse(data);
          if (data.response) {
            var custom_colors = data.datas;
            var custom_html = '';
            for(var color of custom_colors) {
              custom_html += '<div data-color="'+color+'" title="Custom color" class="color custom"><i style="color: '+color+'" class="material-icons wpfd-folder">folder_shared</i></div>';
            }

            $('.wpfd-color-swatchers .color.custom').remove();
            $('.wpfd-color-swatchers').append($(custom_html));

          }
        }
      });
      return;
    },
    destroy: function() {
      $('.wpfd-contextmenu li').off('click');
      $('.js-selected-color').off('input');
      $('.js-setcolor').off('click');
      $('.wpfd-color-swatchers .color').off('click');
    },
    exec: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var action = $(this).data('action');
      if (action === null || wpfd_contextmenu.context === null) {
        return;
      }
      if (action && action.indexOf('.')) {
        var spliter = action.split('.');
        wpfd_contextmenu[spliter[0]][spliter[1]](wpfd_contextmenu.context);
        destroyContextMenu();
      }
    },
    grabFileId: function() {
      return this.context.data('id-file');
    },
    file: {
      cut: function(e) {
        Wpfd.submitbutton('files.movefile');
        $(document).trigger('wpfd_clipboard_file_added');
      },
      copy: function(e) {
        Wpfd.submitbutton('files.copyfile');
        $(document).trigger('wpfd_clipboard_file_added');
      },
      paste: function(e) {
        Wpfd.submitbutton('files.paste');
        $(document).trigger('wpfd_clipboard_paste');
      },
      delete: function(e) {
        Wpfd.submitbutton('files.delete');
        $(document).trigger($.Event('wpfd_context_file_delete'));
      },
      download: function(e) {
        Wpfd.submitbutton('files.download');
        $(document).trigger('wpfd_context_file_download');
      },
      select_all: function(e) {
        Wpfd.submitbutton('files.selectall');
        $(document).trigger('wpfd_context_file_selected_all');
      },
      uncheck: function(e) {
        Wpfd.submitbutton('files.uncheck');
        $(document).trigger('wpfd_context_file_unselected_all');
      },
      publish: function(e) {
        Wpfd.submitbutton('files.publish');
        $(document).trigger('wpfd_context_file_publish');
      },
      unpublish: function() {
        Wpfd.submitbutton('files.unpublish');
        $(document).trigger('wpfd_context_file_unpublish');
      },
      edit: function(e) {
        Wpfd.submitbutton('files.edit');
      }
    },
    top: {
      new: function(e) {
        Wpfd.submitbutton('folder.new');
      },
      google_sync: function(e) {
        Wpfd.syncGoogleDrive(function() {
          $(document).trigger('wpfd_google_sync_completed');
        });
      },
      onedrive_sync: function(e) {
        Wpfd.syncOnedrive(function() {
          $(document).trigger('wpfd_onedrive_sync_completed');
        });
      },
      onedrivebusiness_sync: function(e) {
        Wpfd.syncOnedriveBusiness(function() {
          $(document).trigger('wpfd_onedrive_business_sync_completed');
        });
      },
      dropbox_sync: function(e) {
        Wpfd.syncDropbox(function() {
          $(document).trigger('wpfd_dropbox_sync_completed');
        });
      },
      aws_sync: function(e) {
        Wpfd.syncAws(function() {
          $(document).trigger('wpfd_aws_sync_completed');
        });
      }
    },
    folder: {
      new: function(e) {
        Wpfd.submitbutton('folder.new');
      },
      rename: function(e) {
        Wpfd.submitbutton('folder.rename');
      },
      refresh: function(e) {
        Wpfd.submitbutton('folder.refresh');
      },
      synchronize: function(e) {
        Wpfd.submitbutton('folder.synchronize');
      },
      delete: function(e) {
        Wpfd.submitbutton('folder.delete');
      },
      copy_shortcode: function(e) {
        Wpfd.submitbutton('folder.copy_shortcode');
      },
      change_color: function(e) {
        Wpfd.submitbutton('folder.change_color');
      },
      settings: function(e) {
        Wpfd.submitbutton('folder.settings');
      },
      duplicate: function(e) {
        Wpfd.submitbutton('folder.duplicate');
      }
    }
  }

  if (window.Wpfd !== undefined) {
    window.Wpfd.contextmenu = wpfd_contextmenu;
    window.Wpfd.destroyContextMenu = destroyContextMenu;
  }

  $(document).on('wpfd_clipboard_file_added', function() {
    console.log('a file was added to clipboard');
  });
  $(document).on('wpfd_clipboard_paste', function() {
    console.log('a file in clipboard will paste here');
  });
  $(document).on('wpfd_context_file_delete', function() {
    console.log('a file will be delete');
  });
  $(document).on('wpfd_context_file_selected_all', function() {
    console.log('all file selected');
  });
});