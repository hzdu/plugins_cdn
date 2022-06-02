(function($) {

  'use strict';

  $(document).ready(function() {

    'use strict';

    $(document.body).on('click', '#update-archive' , function(){

      'use strict';

      //if another request is processed right now do not proceed with another ajax request
      if ($('#ajax-request-status').val() == 'processing') {return;}

      //prepare ajax request
      const data = {
        'action': 'update_juice_archive',
        'security': daim_nonce,
      };

      //show the ajax loader
      $('#ajax-loader').show();

      //set the ajax request status
      $('#ajax-request-status').val('processing');

      //send ajax request
      $.post(daim_ajax_url, data, function(data) {

        'use strict';

        //reload the dashboard menu ----------------------------------------
        window.location.replace(daim_admin_url + 'admin.php?page=daim-juice');

      });

    });

    $(document.body).on('click', '.open-anchors-modal-window' , function(){

      'use strict';

      event.preventDefault();
      const juice_id = parseInt($(this).attr('data-juice-id'), 10);
      update_url_juice_modal_window(juice_id, 1);

    });

  });

  /**
   * Original Version (not compatible with pre-ES5 browser)
   */
  $(function() {

    'use strict';

    $('#dialog-url-juice').dialog({
      autoOpen: false,
      resizable: false,
      width: 960,
      height: 520,
      modal: true,
      buttons: {
        [window.objectL10n.closeText]: function() {
          $(this).dialog('close');
          $('input.menu-icon').blur();
        },
      },
    });

  });

  /**
   * Update the content of the modal window.
   *
   * @param juice_id
   * @param current_page
   */
  function update_url_juice_modal_window(juice_id, current_page) {

    'use strict';

    //if another request is processed right now do not proceed with another ajax request
    if ($('#ajax-request-status').val() == 'processing') {return;}

    //prepare ajax request
    const data = {
      'action': 'daim_generate_juice_url_modal_window_data',
      'security': daim_nonce,
      juice_id: juice_id,
      current_page: current_page,
    };

    //set the ajax request status
    $('#ajax-request-status').val('processing');

    //send ajax request
    $.post(daim_ajax_url, data, function(data_json) {

      'use strict';

      //open the modal window
      $('#dialog-url-juice').dialog('open');

      //Remove focus from all the buttons included in the dialog
      $('.ui-dialog :button').blur();

      //add data to the modal window
      try {

        const data_a = JSON.parse(data_json);

        //Set the modal window title
        $('#dialog-url-juice').dialog('option', 'title', objectL10n.juiceModalTitleText + ' ' + data_a.url);

        //Delete the existing HTML and generate a new empty table
        $('#dialog-url-juice').empty();
        const table_html = '<div class="daext-items-container"><table class="daext-items"><thead></thead><tbody></tbody></table></div>';
        $('#dialog-url-juice').append(table_html);

        //Generate the head html
        let thead_html = '<tr>';
        thead_html += '<th><div></div><div class="help-icon" title=""></div></th>';
        thead_html += '<th><div></div><div class="help-icon" title=""></div></th>';
        thead_html += '<th><div></div><div class="help-icon" title=""></div></th>';
        thead_html += '<th><div></div><div class="help-icon" title=""></div></th>';
        thead_html += '<th></th>';
        thead_html += '</tr>';

        //Add the empty thead html to the DOM
        $('#dialog-url-juice table thead').append(thead_html);

        //Safely add the elements text and attributes
        $('#dialog-url-juice table thead tr:nth-child(1) th:nth-child(1) div:nth-child(1)').text(objectL10n.postText);
        $('#dialog-url-juice table thead tr:nth-child(1) th:nth-child(1) div:nth-child(2)').attr('title', objectL10n.postTooltipText);
        $('#dialog-url-juice table thead tr:nth-child(1) th:nth-child(2) div:nth-child(1)').text(objectL10n.anchorTextText);
        $('#dialog-url-juice table thead tr:nth-child(1) th:nth-child(2) div:nth-child(2)').attr('title', objectL10n.anchorTextTooltipText);
        $('#dialog-url-juice table thead tr:nth-child(1) th:nth-child(3) div:nth-child(1)').text(objectL10n.juiceText);
        $('#dialog-url-juice table thead tr:nth-child(1) th:nth-child(3) div:nth-child(2)').attr('title', objectL10n.juiceTooltipText);
        $('#dialog-url-juice table thead tr:nth-child(1) th:nth-child(4) div:nth-child(1)').text(objectL10n.juiceVisualText);
        $('#dialog-url-juice table thead tr:nth-child(1) th:nth-child(4) div:nth-child(2)').attr('title', objectL10n.juiceVisualTooltipText);

        //generate the table body html
        let tr_html = '';
        $.each(data_a.body, function(index, value) {

          'use strict';

          //Set the empty tr html
          tr_html = '<tr>';
          tr_html += '<td><a href=""></a></td>';
          tr_html += '<td></td>';
          tr_html += '<td></td>';
          tr_html += '<td>';
          tr_html += '<div id="juice-relative-container">';
          tr_html += '<div id="juice-relative" style="width: ' + parseInt(value.juiceVisual, 10) + 'px"></div>';
          tr_html += '</div>';
          tr_html += '</td>';
          tr_html += '<td class="icons-container"><a class="menu-icon edit" href=""></a></td>';
          tr_html += '</tr>';

          //Add the empty tr html to the DOM
          $('#dialog-url-juice table tbody').append(tr_html);

          //Safely add the elements text and attributes
          $('#dialog-url-juice table tbody tr:nth-child(' + (index + 1) + ') td:nth-child(1) a').text(value.postTitle);
          $('#dialog-url-juice table tbody tr:nth-child(' + (index + 1) + ') td:nth-child(1) a').attr('href', value.postPermalink);
          $('#dialog-url-juice table tbody tr:nth-child(' + (index + 1) + ') td:nth-child(2)').text(value.anchor);
          $('#dialog-url-juice table tbody tr:nth-child(' + (index + 1) + ') td:nth-child(3)').text(value.juice);
          $('#dialog-url-juice table tbody tr:nth-child(' + (index + 1) + ') td:nth-child(5) a').attr('href', daim_admin_url +
          'post.php?post=' + parseInt(value.postId, 10) + '&action=edit');

        });

        //Add the HTML of the pagination
        $('#dialog-url-juice').append(generate_pagination_html(data_a));

        //Init the tooltips present in the modal window
        $( '.ui-dialog .help-icon' ).tooltip({show: false, hide: false});

        //Add the click event listener on the pagination pages
        $(document.body).on('click', '#dialog-url-juice .daext-tablenav-pages a:not(.disabled)' , function(event){

          'use strict';

          event.preventDefault();
          const current_page = parseInt($(this).attr('data-page'), 10);
          if (typeof (current_page) !== 'undefined') {
            update_url_juice_modal_window(juice_id, current_page);
          }

        });

      } catch (e) {

        //do nothing

      }

      $('#ajax-request-status').val('done');

    });

  }

  /**
   * Generate the HTML of the pagination based on the data available in the provided array.
   *
   * @param data_a An array with the data of the pagination
   * @returns {string} The HTML of the pagination
   */
  function generate_pagination_html(data_a){

    'use strict';

    let pagination_html = '';
    pagination_html += '<span class="daext-displaying-num">' + data_a.total_items + ' ' + objectL10n.itemsText + '</span>';

    $.each(data_a.pagination, function(index, item) {

      let class_name = null;

      switch(item.type){

        case 'prev':
          class_name = item.disabled ? 'disabled' : 'prev';
          pagination_html += '<a data-page="' + parseInt(item.destination_page, 10) + '" href="javascript: void(0)" class="' + class_name + '">&#171</a>';
          break;

        case 'next':

          class_name = item.disabled ? 'disabled' : 'prev';
          pagination_html += '<a data-page="' + parseInt(item.destination_page, 10) + '" href="javascript: void(0)" class="' + class_name + '">&#187</a>';

          break;

        case 'ellipses':

          pagination_html += '<span>...</span>';

          break;

        case 'number':

          const class_name_value = item.disabled ? 'class="disabled"' : '';
          pagination_html += '<a data-page="' + parseInt(item.destination_page, 10) + '" href="javascript: void(0)" ' + class_name_value + '>' + parseInt(item.destination_page, 10) + '</a>';

          break;

      }

    });

    return '<div class="daext-tablenav daext-clearfix"><div class="daext-tablenav-pages">' + pagination_html +  '</div></div>';

  }

}(window.jQuery));

