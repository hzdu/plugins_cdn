(function ($) {
  $(document).on('click', function () {
    $('#wpfd-core .wpfd-filter-box').addClass('hide');
  });
  $(document).ready(function ($) {
    var wpfd_alt = {
      init: function () {
        if (Wpfd === undefined) {
          console.error('Fail on load Wpfd object!');
          return false;
        }

        $(document).on('wpfd_preview_updated', '#wpfd-core #preview', function () {
          $('#preview .file .file_menu li').unbind('click').on('click', wpfd_alt.onMenuClick);
          $('#preview .wpfd_cat').not('.wpfd_new_category').unbind('click').on('click', wpfd_alt.onCategoryClick);
          $('#preview .wpfd_cat.wpfd_new_category').unbind('click').on('click', wpfd_alt.onNewCategoryClick);
          $('.alt-download-button').on("click", wpfd_alt.onDownloadClick);
          wpfd_alt.filterInitHideInfo();
          wpfd_alt.initFilterButton();

        });
        $(document).on('show', '.bootbox.modal', function () {
          $('.bootbox.modal.fade input').focus();
        });
        $(document).on("submit", ".bootbox form", function (e) {
          e.preventDefault();
          $(".bootbox .button-primary").click();
        });
        // this.initFlipButton();
      },
      $currentCategory: {
        id: null,
        name: '',
        type: '',
      },
      $defaultHide: ['file_modified', 'file_version', 'file_hits'],
      $container: $('.wpfd_files_container'),
      onDownloadClick: function (e) {
        e.stopPropagation();
        var $this = $(this);
        $this.parents().closest('.file').addClass('selected');
        Wpfd.log('alt-download-button clicked!');
        Wpfd.submitbutton('files.download');
      },
      onMenuClick: function (e) {
        // Stop click event on parent
        e.stopPropagation();
        var $this = $(this);
        this.$container = $('.wpfd_files_container');
        $this.parents().closest('.file').addClass('selected');
        var isSelected = this.$container.find('.file.selected').length;
        Wpfd.log('File selected: ' + isSelected);
        var action = $this.data('action');

        Wpfd.submitbutton(action);
        if (action === 'files.copyfile' || action === 'files.movefile' || action === 'files.selectall') {
          $('.wpfd-btn-toolbar').find('#wpfd-cut, #wpfd-copy, #wpfd-paste, #wpfd-delete, #wpfd-download, #wpfd-uncheck').show();
        } else {
          $('.wpfd-btn-toolbar').find('#wpfd-cut, #wpfd-copy, #wpfd-paste, #wpfd-delete, #wpfd-download, #wpfd-uncheck').hide();
        }
        return false;
      },
      onNewCategoryClick: function (e) {
        Wpfd.log('New Category button clicked!');
        if (!wpfd_permissions.can_create_category) {
          bootbox.alert(wpfd_permissions.translate.wpfd_create_category);
          return false;
        }
        wpfd_alt.$currentCategory.type = $(this).data('category-type');

        if (typeof bootbox !== 'undefined') {
          var name_prompt = bootbox.prompt("New category name:", wpfd_alt.createNewCategory);
          name_prompt.find("input[type=text]").select();
          // Prevent Enter event
          name_prompt.find("input[type=text]").on('keypress', function (e) {
            if (e.keyCode === 13) { // Enter
              e.preventDefault();
              name_prompt.find('.button-primary').trigger('click');
              return false;
            }

            if (e.keyCode === 27) { // Escape
              e.preventDefault();
              name_prompt.modal('hide');
              return false;
            }
          });

        } else {
          var newCategoryname = window.prompt("New category name:", "New Category");
          wpfd_alt.createNewCategory(newCategoryname);
        }
      },
      createNewCategory: function (name) {
        Wpfd.log('Creating new category: ' + name + ' type: ' + wpfd_alt.$currentCategory.type);
        if (name !== null) {
          wpfd_alt.$currentCategory.id = $('.dd3-item.active').data('id-category');

          if (wpfd_alt.$currentCategory.type === '') {
            wpfd_alt.$currentCategory.type = 'wordpress';
          }

          // Create url base on current category type
          var newCategoryAjaxUrl = wpfdajaxurl + "task=category.addCategory";
          if (wpfd_alt.$currentCategory.type === 'googleDrive') {
            newCategoryAjaxUrl = wpfd_var.wpfdajaxurl + "?action=wpfdAddonAddCategory&type=" + wpfd_alt.$currentCategory.type;
          } else if (wpfd_alt.$currentCategory.type === 'dropbox') {
            newCategoryAjaxUrl = wpfd_var.wpfdajaxurl + "?action=wpfdAddonAddDropCategory&type=" + wpfd_alt.$currentCategory.type;
          } else if (wpfd_alt.$currentCategory.type === 'onedrive') {
            newCategoryAjaxUrl = wpfd_var.wpfdajaxurl + "?action=wpfdAddonAddOneDriveCategory&type=" + wpfd_alt.$currentCategory.type;
          } else if (wpfd_alt.$currentCategory.type === 'onedrive_business') {
            newCategoryAjaxUrl = wpfd_var.wpfdajaxurl + "?action=wpfdAddonAddOneDriveBusinessCategory&type=" + wpfd_alt.$currentCategory.type;
          } else if (wpfd_alt.$currentCategory.type === 'aws') {
            newCategoryAjaxUrl = wpfd_var.wpfdajaxurl + "?action=wpfdAddonAddAwsCategory&type=" + wpfd_alt.$currentCategory.type;
          } else if (wpfd_alt.$currentCategory.type === 'wordpress') {
            newCategoryAjaxUrl = wpfdajaxurl + "task=category.addCategory";
          }

          Wpfd.log('Current category is: ' + wpfd_alt.$currentCategory.id);

          // Send ajax to create new category
          $.ajax({
            url: newCategoryAjaxUrl,
            type: 'POST',
            data: {name: name, parentId: wpfd_alt.$currentCategory.id},
            beforeSend: function () {
                $.gritter.add({text: wpfd_admin.msg_adding_category});
            }
          })
            .done(function (data) {
              var result = jQuery.parseJSON(data);
              if (result.response === true) {
                // Icon class base on category type
                var icon = '<i class="material-icons wpfd-folder">folder</i>'; // Local category
                if (wpfd_alt.$currentCategory.type === 'googleDrive') {
                  icon = '<i class="google-drive-icon"></i> ';
                } else if (wpfd_alt.$currentCategory.type === 'dropbox') {
                  icon = '<i class="dropbox-icon"></i>';
                } else if (wpfd_alt.$currentCategory.type === 'onedrive') {
                  icon = '<i class="onedrive-icon"></i>';
                } else if (wpfd_alt.$currentCategory.type === 'onedrive_business') {
                  icon = '<i class="onedrive-business-icon"></i>';
                } else if (wpfd_alt.$currentCategory.type === 'aws') {
                  icon = '<i class="wpfd-aws-icon"></i>';
                }
                var newCategoryId = result.datas.id_category;
                var link = '';

                link += '<li class="dd-item dd3-item" data-id="' + newCategoryId +
                  '" data-id-category="' + newCategoryId + '">' +
                  '<div class="dd-handle dd3-handle">' + icon + '</div>' +
                  '<div class="dd-content dd3-content">';

                if (wpfd_permissions.can_edit_category) {
                  link += '<a class="edit"><i class="icon-edit"></i></a>';
                }

                if (wpfd_permissions.can_delete_category) {
                  link += '<a class="trash"><i class="icon-trash"></i></a>';
                }

                if ($('.dd3-content .countfile').length) {
                  link += '<span class="countfile">(0)</span>';
                }

                link += '<a href="" class="t">' +
                  '<span class="title">' + result.datas.name + '</span>' +
                  '</a>' +
                  '</div>';
                // Check if current category is not have any child
                var ol = $('#categorieslist .dd3-item.active > ol.dd-list');
                if (!ol.length) {
                  $('<ol class="dd-list">' + link + '</ol>').hide().appendTo($('#categorieslist .dd3-item.active')).fadeIn();
                  // Add collapse/expand button to parent
                  $('.nested').nestable('setParent', $('#categorieslist .dd3-item.active'));
                } else {
                  $(link).hide().appendTo('#categorieslist .dd3-item.active > ol.dd-list').fadeIn();
                }

                // Alternative theme
                var newIconClass = 'wpfd_cat_' + wpfd_alt.$currentCategory.type;
                // Add to current view
                var newAlternativeCategory = $('<div class="wpfd_cat ' + newIconClass + '" data-category-type="' + wpfd_alt.$currentCategory.type + '" data-category-id="' + newCategoryId + '">' + result.datas.name + '</div>').hide();
                $('#preview .wpfd_categories_container .wpfd_cat').last().after(newAlternativeCategory);

                // Showing them
                newAlternativeCategory.fadeIn();
                // Init click
                $('#preview .wpfd_cat').not('.wpfd_new_category').unbind('click').on('click', wpfd_alt.onCategoryClick);

                // Init click for new category in left
                Wpfd.initMenu();
                //$('#wpfd-categories-col #categorieslist li[data-id-category=' + result.datas.id_category + '] .dd-content').click();
                $('.gritter-item-wrapper ').remove();
                $.gritter.add({text: wpfd_admin.msg_add_category});
                setTimeout(Wpfd.saveTemp, 3000);
                catDroppable();
                $('li[data-id-category=' + result.datas.id_category + '] .dd-content').trigger('wpfd_category_created');
              }
            });
        }
      },
      onCategoryClick: function (e) {
        e.stopPropagation();
        var $this = $(this);
        var categoryId = $this.data('category-id');
        Wpfd.log('Category Id: ' + categoryId + ' clicked!');
        $('#categorieslist').find('[data-id-category="' + categoryId + '"] .dd-content').click();
        return false;
      },
      filterInitHideInfo: function () {
        // Get file info stat in local storage
        var hides = wpfd_alt.filterGetHideInfo();

        if ($.isArray(hides)) {
          $.each(hides, function (i, hide) {
            wpfd_alt.filterHideInfo(hide);
          });
        }
      },
      filterShowInfo: function (name) {
        Wpfd.log('Show col: ' + name);
        $('.file_info').find('.' + name).show();
        wpfd_alt.filterSetHideInfo(name, false);
      },
      filterHideInfo: function (name) {
        Wpfd.log('Hide col: ' + name);
        $('.file_info').find('.' + name).hide();
        wpfd_alt.filterSetHideInfo(name, true);
      },
      filterGetHideInfo: function () {
        var hides = localStorage.getItem('wpfd_hide_state');
        if (hides === null) {
          hides = wpfd_alt.$defaultHide;
          localStorage.setItem('wpfd_hide_state', JSON.stringify(hides));
        } else {
          hides = JSON.parse(hides);
        }

        return hides;
      },
      filterSetHideInfo: function (name, value) {
        Wpfd.log('filterSetHideInfo: name=' + name + ' value=' + value);
        var hides = wpfd_alt.filterGetHideInfo();
        Wpfd.log('filterSetHideInfo get hides:');
        if (value) {
          if (hides.length === 0) {
            hides.push(name);
            Wpfd.log('filterSetHideInfo onHide with hides empty');
            localStorage.setItem('wpfd_hide_state', JSON.stringify(hides));
          } else if ($.inArray(name, hides) === -1) {
            hides.push(name);
            Wpfd.log('filterSetHideInfo onHide');
            localStorage.setItem('wpfd_hide_state', JSON.stringify(hides));
          }
        } else {
          var hides2 = hides.filter(function (v, i, a) {
            return v !== name;
          });

          Wpfd.log('filterSetHideInfo onShow');
          localStorage.setItem('wpfd_hide_state', JSON.stringify(hides2));
        }
      },
      buildFilterBox: function () {
        var boxWrapper = $('<div class="wpfd-filter-box hide"></div>');
        boxWrapper.on('click', function (e) {
          e.stopPropagation();
        });
        var boxList = $('<ul class=""></ul>');
        var items = $('.file:first-child .file_info').find('span');
        var hides = wpfd_alt.filterGetHideInfo();
        if (items.length) {
          items.each(function (index) {
            var checked = 'checked="checked"';
            var $this = $(this);
            var className = $this.prop('class');
            var name = $this.find('strong').html().replace(':', '');
            if ($.inArray(className, hides) !== -1) {
              checked = '';
            }

            var li = '<li>';
            li += '<input type="checkbox" ref="' + className + '" name="filter-' + className + '" ' + checked + '/> ' + name;
            li += '</li>';

            boxList.append(li);
          });
        }
        boxWrapper.append(boxList);
        boxWrapper.find('input').on('change click', function (e) {
          e.stopPropagation();
          if ($(this).is(':checked')) {
            wpfd_alt.filterShowInfo($(this).attr('ref'));
          } else {
            wpfd_alt.filterHideInfo($(this).attr('ref'))
          }
        });

        return boxWrapper;
      },
      initFilterButton: function () {
        // Remove old button
        var filterButton = $('<i id="wpfd_alt_filter" class="material-icons">filter_list</i>');
        var oldButton = $('#wpfd_alt_filter');
        if (oldButton.length) {
          oldButton.remove();
        }
        var oldFilterBox = $('.wpfd-filter-box');
        if (oldFilterBox.length) {
          oldFilterBox.remove();
        }
        var box = wpfd_alt.buildFilterBox();
        var flipButton = $('.wpfd-flip');
        flipButton.after(box);
        flipButton.after(filterButton);
        flipButton.parent().find('#wpfd_alt_filter').unbind('click').on('click', function (e) {
          e.stopPropagation();
          var $this = $(this);
          var filterBox = $this.parent().find('.wpfd-filter-box');
          if (filterBox.hasClass('hide')) {
            filterBox.removeClass('hide');
          } else {
            filterBox.addClass('hide');
          }

        });
      },
      initFlipButton: function () {
        if ($('.wpfd-flip').length) {
          return;
        }
        var flipButton = $('<i class="material-icons wpfd-flip">arrow_right_alt</i>');
        flipButton.on("click", function () {
          var rightCol = $('#rightcol');
          if (!rightCol.is(':visible')) {
            rightCol.addClass('show').removeClass('hide');
            flipButton.css('transform', 'scale(1)');
          } else {
            rightCol.addClass('hide').removeClass('show');
            flipButton.css('transform', 'scale(-1)');
          }
        });
        var oldButton = $('.wpfd-flip');
        if (oldButton.length) {
          oldButton.remove();
        }
        $('.wpfd-search-file').after(flipButton);
      },
    };
    wpfd_alt.init();
  });
})(jQuery);
