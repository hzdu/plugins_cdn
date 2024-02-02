/* global jQuery, yith_default_form_field*/
jQuery(function($) {

  var
      yit_default_form = $('.yith-default-form').data('option-id'),
      yit_default_form_callback = $('.yith-default-form').data('callback'),
      main_table = $('.yith-default-form-main-table'),
      newField = $(document).find('.yith-default-form__popup_wrapper'),
      confirm = $(document).find('#yith-default-form__delete_row'),
      confirmRestoreForm = $(document).find('#yith-default-form__reset_dialog'),
      firstOptionTableElement = $(document).
          find('table.option-list tbody > tr');

  blockParams = {
    message: null,
    overlayCSS: {background: '#fff', opacity: 0.7},
    ignoreIfBlocked: true,
  },

      //Format the "name" of field
      format_name = function(name) {
        // first replace all space with _
        name = name.trim();
        name = name.toLowerCase();
        name = name.replace(/\s/g, '_');
        var regex = /[^A-Za-z0-9_]+/gi;
        name = name.replace(regex, '');
        return name;
      },

      //Submit the field form
      submitRowForm = function() {
        if ($('#name').hasClass('field-exists') ||
            $('#name').hasClass('required')) {
          return false;
        }

        var data = $('.yith-default-form__form_row').
            find('input,select,textarea').
            serializeArray(); // convert form to array
        data.push({name: 'yit_default_form', value: yit_default_form});
        data.push({name: 'request', value: 'save'});
        main_table.block(blockParams);
        newField.dialog('close');
        $.post(document.location.href, data).done(function(data) {
          refreshTable(data);
          main_table.unblock();
        });
      },

      //Duplicate the table row
      duplicateRow = function(row) {
        main_table.block(blockParams);
        $.post(document.location.href, {
          yit_default_form: yit_default_form,
          request: 'duplicate',
          row: row,
        }).done(function(data) {
          refreshTable(data);
          main_table.unblock();
        });
      },

      //Cancel the table row
      cancelRow = function(row) {
        main_table.block(blockParams);
        confirm.dialog('close');
        $.post(document.location.href,
            {yit_default_form: yit_default_form, request: 'cancel', row: row}).
            done(function(data) {
              refreshTable(data);
              main_table.unblock();
            });
      },

      //Cancel the table row
      activateRow = function(row, activated) {
        main_table.block(blockParams);
        $.post(document.location.href, {
          yit_default_form: yit_default_form,
          request: 'activate',
          activated: activated,
          row: row,
        }).done(function(data) {
          main_table.unblock();
        });
      },

      //Sort the table
      sortTable = function(order) {
        main_table.block(blockParams);
        $.post(document.location.href, {
          yit_default_form: yit_default_form,
          request: 'sort',
          order: order,
        }).done(function(data) {
          refreshTable(data);
          main_table.unblock();
        });
      },

      //Sort the table
      restoreDefaultForm = function() {
        main_table.block(blockParams);
        confirmRestoreForm.dialog('close');
        $.post(document.location.href, {
          yit_default_form: yit_default_form,
          request: 'restore',
          callback: yit_default_form_callback,
        }).done(function(data) {
          refreshTable(data);
          main_table.unblock();
        });
      },

      //Refresh the main table
      refreshTable = function(data) {
        if (data !== '') {
          var c = $('<div></div>').html(data),
              table = c.find('.yith-default-form-main-table'),
              popup = c.find('.yith-default-form__popup_wrapper');

          $('.yith-default-form-main-table').html(table.html());
          $('.yith-default-form__popup_wrapper').html(popup.html());
          newField = $(document).find('.yith-default-form__popup_wrapper');
          initSortTable();
        }
      },

      //init the table to sort
      //init the table to sort
      initSortTable = function() {
        $('.yith-default-form-main-table tbody').sortable({
          placeholder: 'ui-state-highlight',
          axis: 'y',
          handle: '.action__sort',
          stop: function() {
            $order = main_table.find('[data-name="name"]');
            var order = [];
            $order.each(function(i, input) {
              order.push($(input).val());
            });
            sortTable(order);
          },
        }).disableSelection();
      },

      initOptionListSortable = function() {
        $(document).find('table.option-list tbody').sortable({
          placeholder: 'ui-state-highlight',
          axis: 'y',
          handle: '.drag',
        }).disableSelection();
      };

  openPopup = function(action = 'add') {

    newField = $('.yith-default-form__popup_wrapper');

    // init dialog
    newField.dialog({
      closeText: '',
      title: yith_default_form_field['popup_title_' + action],
      width: 550,
      modal: true,
      dialogClass: 'yith-plugin-ui yith-default-form-popup',
      buttons: [
        {
          'text': yith_default_form_field[action],
          'click': function() {
            submitRowForm();
          },
          'class': 'yith-save-form',
        }],
    });

    $('.wc-enhanced-select').select2();
    loadDependences();
  },
      getNewOptionRow = function( counter ){
        var currentRow = firstOptionTableElement.clone();
        var innercode = $(currentRow).html();
        innercode = innercode.replace(/{key}/g, counter);
        $(currentRow).html(innercode);
        $(currentRow).attr('data-key', counter);

        return currentRow;
      },
      //load the fields dependence on popup
      loadDependences = function() {
        $(document).
            find('.yith-default-form__popup_wrapper [data-deps]').
            each(function() {

              var t = $(this),
                  wrap = t.closest('tr'),
                  deps = t.attr('data-deps').split(','),
                  values = t.attr('data-deps_value').split(','),
                  conditions = [];

              $.each(deps, function(i, dep) {
                $('[name="' + dep + '"]').on('change', function() {

                  var $tt = $(this),
                      value = $tt.val(),
                      type = $tt.attr('type'),
                      check_values = '';

                  // exclude radio if not checked
                  if (type === 'radio' && !$tt.is(':checked')) {
                    return;
                  }

                  if (type === 'checkbox') {
                    value = $tt.is(':checked') ? 'yes' : 'no';
                  }

                  check_values = values[i] + ''; // force to string
                  check_values = check_values.split('|');

                  conditions[i] = $.inArray(value, check_values) !== -1;

                  if ($.inArray(false, conditions) === -1) {
                    wrap.fadeIn();
                  } else {
                    wrap.fadeOut();
                  }
                }).change();

              });
            });
      };

  initSortTable();

  $(document).on('click', '.yith-default-form__add-fields', function(ev) {
    ev.preventDefault();

    var tableRows = main_table.find('tr');

    if (tableRows.length > 1) {
      var tr = tableRows[1];

      $.each($(tr).find('input[type="hidden"]'), function(i, hidden) {
        var name = $(hidden).data('name'),
            form_input = newField.find('td *[name="' + name + '"]'),
            value = $(hidden).data('default');

        if (name === 'name') {
          form_input.prop('readonly', false);
        }

        if (name === 'options') {
          var tableBody = $(document).find('table.option-list tbody'),
              counter = 0;

          var currentRow = getNewOptionRow(counter );

          tableBody.html('');
          tableBody.append(currentRow);

          initOptionListSortable();
        }

        if (form_input.length) {
          if (form_input.attr('type') === 'checkbox') {
            if ('yes' === value) {
              form_input.prop('checked', true);
            } else {
              form_input.prop('checked', false);
            }
          } else {
            form_input.val(value);
          }
        }
      });

    }
    openPopup();
  });

  $(document).on('blur', '#name', function() {
    var $t = $(this),
        val = $t.val(),
        td = $t.closest('td'),
        popupButton = $('.yith-save-form');

    popupButton.removeClass('disabled').removeAttr('disabled');

    $t.removeClass('required');
    $t.removeClass('field-exists');
    td.find('.description.field-exists').hide();
    td.find('.description.required').hide();

    if ($t.is('[readonly]')) {
      return;
    }

    val = format_name(val);
    $t.val(val);

    if (val === '') {
      $t.addClass('required');
      td.find('.description.required').show();
      popupButton.addClass('disabled').attr('disabled', 'true');
      return false;
    }

    var $fields_names = main_table.find('input[value="' + val + '"]');

    $.each($fields_names, function() {
      var $field = $(this);
      if ($field.val() === val) {
        $t.addClass('field-exists');
        td.find('.description.field-exists').show();
        popupButton.addClass('disabled').attr('disabled', 'true');
        return false;
      }
    });
  });


  $(document).on('click', '.action__edit', function(e) {
    e.preventDefault();
    var $t = $(this),
        tr = $t.closest('tr'),
        formTable = newField.find('#yith_form_fields_table');

    $.each(tr.find('input[type="hidden"]'), function(i, hidden) {
      var name = $(hidden).data('name'),
          form_input = formTable.find('td *[name="' + name + '"]'),
          value = $(hidden).val();

      if (name === 'name') {
        form_input.prop('readonly', true);
      }

      if (name === 'options') {
        var tableBody = $(document).find('table.option-list tbody'),
            counter = 0;

        if (value !== '' && value !== '::') {
          var optionsPair = value.split('|');
          var list = [];
          $.each(optionsPair, function(index, pair) {
            list[index] = pair.split('::');
          });

          if (list.length > 0) {
            $.each(list, function(index, item) {

              if (item[0] !== '') {
                if (counter === 0) {
                  tableBody.html('');
                }
                var currentRow = getNewOptionRow(counter++ );

                $(currentRow).find('.column-label input').val(item[0]);
                $(currentRow).find('.column-value input').val(item[1]);

                tableBody.append(currentRow);
              }
            });
          }
        } else {
          var currentRow = getNewOptionRow(counter );
          tableBody.html('');
          tableBody.append(currentRow);
        }

        initOptionListSortable();
      }

      if (form_input.length) {
        if (form_input.attr('type') === 'checkbox') {
          if ('yes' === value) {
            form_input.prop('checked', true);
          } else {
            form_input.prop('checked', false);
          }
        } else {
          form_input.val(value);
        }
      }

      form_input.change();

    });

    openPopup('edit');
  });

  $(document).on('click', '#add_new_option', function(e) {
    e.preventDefault();

    var tableOptionTbody = $(document).find('table.option-list tbody');
    var rows = tableOptionTbody.find('tr');

    var dataKey = 0;
    $.each(rows, function(index, row) {
      if ($(row).data('key') > dataKey) {
        dataKey = parseInt($(row).data('key'));
      }
    });
    dataKey++;
    var currentRow = getNewOptionRow(dataKey);
    tableOptionTbody.append(currentRow);

    if ($('.option-list tbody tr').length > 1) {
      $('.option-list tbody tr:first-child').find('.delete').show();
    }
  });

  $(document).on('click', '.option-list .delete', function(e) {
    e.preventDefault();
    var $t = $(this),
        row = $t.closest('tr');
    row.remove();
    if ($('.option-list tbody tr').length === 1) {
      $('.option-list tbody tr:first-child').find('.delete').hide();
    }

  });

  $(document).on('click', '.action__duplicate', function() {
    var $t = $(this),
        tr = $t.closest('tr'),
        row = tr.find('[data-name="name"]').val();

    duplicateRow(row);
  });

  $(document).on('change', 'input[name="enabled"]', function() {
    var $t = $(this),
        tr = $t.closest('tr'),
        row = tr.find('[data-name="name"]').val(),
        activated = $t.is(':checked') ? 'yes' : 'no';

    activateRow(row, activated);
  });

  $(document).on('click', '#yith-default-form__restore-default', function(e) {

    e.preventDefault();
    confirmRestoreForm.dialog({
      width: 350,
      modal: true,
      dialogClass: 'yith-plugin-ui yith-default-form__confirm yith-default-form-popup',
      closeText: '',
      buttons: [
        {

          'text': yith_default_form_field.confirmChoice,
          'click': function() {
            restoreDefaultForm();
          },
          'class': 'yith-confirm',
        },
        {
          'text': yith_default_form_field.cancel,
          'click': function() {
            confirmRestoreForm.dialog('close');
          },
          'class': 'yith-close',
        }],

    });

  });

  $(document).on('click', '.action__trash', function(ev) {
    ev.preventDefault();

    var $t = $(this),
        tr = $t.closest('tr'),
        row = tr.find('[data-name="name"]').val();

    // init dialog
    confirm.dialog({
      closeText: '',
      width: 350,
      modal: true,
      dialogClass: 'yith-plugin-ui yith-default-form__confirm yith-default-form-popup',
      buttons: [
        {
          'text': yith_default_form_field.confirmChoice,
          'click': function() {
            cancelRow(row);
          },
          'class': 'yith-confirm',
        },
        {
          'text': yith_default_form_field.cancel,
          'click': function() {
            confirm.dialog('close');
          },
          'class': 'yith-close',
        }],

    });

  });
});