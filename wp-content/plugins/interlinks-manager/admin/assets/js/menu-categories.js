(function($) {

  'use strict';

  $(document).ready(function() {

    'use strict';

    $(document.body).on('click', '#cancel' , function(event){

      //reload the Categories menu
      event.preventDefault();
      window.location.replace(window.daim_admin_url + 'admin.php?page=daim-categories');

    });

    //Dialog Confirm ---------------------------------------------------------------------------------------------------
    window.DAIM = {};
    $(document.body).on('click', '.menu-icon.delete' , function(event){

      'use strict';

      event.preventDefault();
      window.DAIM.categoryToDelete = $(this).prev().val();
      $('#dialog-confirm').dialog('open');

    });

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

          $('#form-delete-' + window.DAIM.categoryToDelete).submit();

        },
        [objectL10n.cancelText]: function() {

          'use strict';

          $(this).dialog('close');

        },
      },
    });
  });

}(window.jQuery));

