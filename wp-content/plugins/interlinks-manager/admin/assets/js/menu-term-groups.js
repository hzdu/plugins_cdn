(function($) {

  'use strict';

  $(document).ready(function() {

    'use strict';

    //Handle Post Type Change ------------------------------------------------------------------------------------------
    $(document.body).on('change', '.post-type' , function(){

      'use strict';

      //get the post type
      const postType = $(this).val();

      //get the id
      const id = parseInt($(this).attr('data-id'), 10);

      //delete the options of taxonomy with the same id
      $('#taxonomy-' + id + ' option:not(.default)').remove();

      //delete the options of terms with the same id
      $('#term-' + id + ' option:not(.default)').remove();

      //prepare ajax request
      const data = {
        'action': 'daim_get_taxonomies',
        'security': window.daim_nonce,
        'post_type': postType,
      };

      //send ajax request
      $.post(window.daim_ajax_url, data, function(data) {

        'use strict';

        let isJson = true,
            taxonomies = null;

        try {
          taxonomies = $.parseJSON(data);
        } catch (e) {
          isJson = false;
        }

        if (isJson) {

          //add the taxonomies
          $.each(taxonomies, function(index, taxonomy) {

            'use strict';

            $('#taxonomy-' + id).append('<option value="' + taxonomy.name + '">' + taxonomy.label + '</option>');

          });

        }

        updateChosenField('#taxonomy-' + id, '0');

        updateChosenField('#term-' + id, '0');

      });

    });

    //Handle Taxonomy Change -------------------------------------------------------------------------------------------

    $(document.body).on('change', '.taxonomy' , function(){

      'use strict';

      //get the taxonomy
      const taxonomy = $(this).val();

      //get the id
      const id = parseInt($(this).attr('data-id'), 10);

      //delete the options of terms with the same id
      $('#term-' + id + ' option:not(.default)').remove();

      //prepare ajax request
      const data = {
        'action': 'daim_get_terms',
        'security': window.daim_nonce,
        'taxonomy': taxonomy,
      };

      //send ajax request
      $.post(window.daim_ajax_url, data, function(data) {

        'use strict';

        let isJson = true,
            terms = null;

        try {
          terms = $.parseJSON(data);
        } catch (e) {
          isJson = false;
        }

        if (parseInt(data, 10) !== 0 && isJson) {

          //add the taxonomies
          $.each(terms, function(index, termObj) {

            'use strict';

            $('#term-' + id).append('<option value="' + termObj.term_id + '">' + termObj.name + '</option>');

          });

        }

        updateChosenField('#term-' + id, '0');

      });

    });

    //Dialog Confirm ---------------------------------------------------------------------------------------------------
    window.DAIM = {};
    $(document.body).on('click', '.menu-icon.delete' , function(event){

      'use strict';

      event.preventDefault();
      window.DAIM.termGroupToDelete = $(this).prev().val();
      $('#dialog-confirm').dialog('open');

    });

  });

  /**
   * Update the selection of a specific chosen field (field_selector) based on the provided value (selected_value)
   *
   * @param field_selector
   * @param selected_value
   */
  function updateChosenField(field_selector, selected_value) {

    'use strict';

    $(field_selector + ' option').removeAttr('selected');
    $(field_selector + ' option[value=' + selected_value + ']').attr('selected', 'selected');
    $(field_selector).trigger('chosen:updated');

  }

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
          $('#form-delete-' + window.DAIM.termGroupToDelete).submit();
        },
        [objectL10n.cancelText]: function() {
          $(this).dialog('close');
        },
      },
    });

  });

}(window.jQuery));