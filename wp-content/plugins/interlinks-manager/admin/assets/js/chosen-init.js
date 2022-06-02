(function($) {

  'use strict';

  $(document).ready(function() {

    'use strict';

    //initialize chosen on all the select elements
    let chosenElements = [];

    //Interlinks Options Meta Box --------------------------------------------------------------------------------------
    addToChosen('daim-enable-ail');

    //Dashboard Menu ---------------------------------------------------------------------------------------------------
    addToChosen('op');
    addToChosen('sb');
    addToChosen('or');

    //AIL Menu ---------------------------------------------------------------------------------------------------------
    addToChosen('category-id');
    addToChosen('left-boundary');
    addToChosen('right-boundary');
    addToChosen('case-insensitive-search');
    addToChosen('open-new-tab');
    addToChosen('use-nofollow');
    addToChosen('activate-post-types');
    addToChosen('categories');
    addToChosen('tags');
    addToChosen('term-group-id');

    //Terms Menu
    for (let i = 0; i <= 50; i++) {
      addToChosen('post-type-' + i);
      addToChosen('taxonomy-' + i);
      addToChosen('term-' + i);
    }

    //Maintenance Menu -------------------------------------------------------------------------------------------------
    addToChosen('task');

    //Options Menu -----------------------------------------------------------------------------------------------------

    //AIL
    addToChosen('cf');
    addToChosen('daim_default_category_id');
    addToChosen('daim_default_string_before');
    addToChosen('daim_default_string_after');
    addToChosen('daim_default_case_insensitive_search');
    addToChosen('daim_default_open_new_tab');
    addToChosen('daim_default_use_nofollow');
    addToChosen('daim-default-activate-post-types');
    addToChosen('daim-default-categories');
    addToChosen('daim-default-tags');
    addToChosen('daim-default-term-group-id');

    //Suggestions
    addToChosen('daim-suggestions-pool-post-types');
    addToChosen('daim_suggestions_titles');
    addToChosen('daim_suggestions_categories');
    addToChosen('daim_suggestions_tags');
    addToChosen('daim_suggestions_post_type');

    //Juice
    addToChosen('daim_remove_link_to_anchor');
    addToChosen('daim_remove_url_parameters');

    //Tracking
    addToChosen('daim_track_internal_links');

    //Analysis
    addToChosen('daim-dashboard-post-types');
    addToChosen('daim-juice-post-types');
    addToChosen('daim_set_max_execution_time');
    addToChosen('daim_set_memory_limit');

    //Meta Boxes
    addToChosen('daim-interlinks-options-post-types');
    addToChosen('daim-interlinks-optimization-post-types');
    addToChosen('daim-interlinks-suggestions-post-types');

    //Advanced
    addToChosen('daim_default_enable_ail_on_post');
    addToChosen('daim_ail_test_mode');
    addToChosen('daim_random_prioritization');
    addToChosen('daim_ignore_self_ail');
    addToChosen('daim_categories_and_tags_verification');
    addToChosen('daim_general_limit_mode');
    addToChosen('daim_general_limit_subtract_mil');
    addToChosen('daim_protect_attributes');
    addToChosen('daim-protected-tags');
    addToChosen('daim-protected-gutenberg-blocks');
    addToChosen('daim_pagination_dashboard_menu');
    addToChosen('daim_pagination_juice_menu');
    addToChosen('daim_pagination_hits_menu');
    addToChosen('daim_pagination_ail_menu');
    addToChosen('daim_pagination_categories_menu');
    addToChosen('daim_pagination_term_groups_menu');

    $(chosenElements.join(',')).chosen({
      placeholder_text_multiple: window.objectL10n.chooseAnOptionText,
    });

    function addToChosen(elementId) {

      'use strict';

      if ($('#' + elementId).length && chosenElements.indexOf($('#' + elementId)) === -1) {
        chosenElements.push('#' + elementId);
      }

    }

  });

})(window.jQuery);