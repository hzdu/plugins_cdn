jQuery(document).ready(function($) {

  'use strict';

  removeBorderLastTableTr();

  $(document.body).on('click', '.group-trigger' , function(){

    'use strict';

    //open and close the various sections of the tables area
    const target = $(this).attr('data-trigger-target');
    $('.' + target).toggle();

    $(this).find('.expand-icon').toggleClass('arrow-down');

    removeBorderLastTableTr();

    /**
     * Prevent a bug that causes the "All" text (used in the chosen multiple when there are no items selected) to be
     * hidden.
     */
    $('.chosen-container-multi .chosen-choices .search-field input').each(function() {

      'use strict';

      $(this).css('width', 'auto');

    });

  });

  $(document.body).on('click', '#cancel' , function(event){

    'use strict';

    //reload the Autolinks menu
    event.preventDefault();
    window.location.replace(window.daim_admin_url + 'admin.php?page=daim-autolinks');

  });

  //Submit the filter form when the select box changes
  $(document.body).on('change', '#daext-filter-form select' , function(){

    'use strict';

    $('#daext-filter-form').submit();

  });

  /*
 Remove the bottom border on the last visible tr included in the form
 */
  function removeBorderLastTableTr() {

    'use strict';

    $('table.daext-form-table tr > *').css('border-bottom-width', '1px');
    $('table.daext-form-table tr:visible:last > *').css('border-bottom-width', '0');

  }

  //Dialog Confirm ---------------------------------------------------------------------------------------------------
  window.DAIM = {};
  $(document.body).on('click', '.menu-icon.delete' , function(event){

    'use strict';

    event.preventDefault();
    window.DAIM.autolinkToDelete = $(this).prev().val();
    $('#dialog-confirm').dialog('open');

  });

  /**
   * Dialog confirm initialization.
   */
  $(function() {

    'use strict';

    $('#dialog-confirm').dialog({
      autoOpen: false,
      resizable: false,
      height: 'auto',
      width: 340,
      modal: true,
      buttons: {
        [objectL10n.deleteText]: function() {

          'use strict';

          $('#form-delete-' + window.DAIM.autolinkToDelete).submit();

        },
        [objectL10n.cancelText]: function() {

          'use strict';

          $(this).dialog('close');

        },
      },
    });

  });

});