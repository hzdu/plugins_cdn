(function( $ ) {
   'use strict';

   $(document).ready( function() {
      
      // TABS

      //Selects current tab label & shows current tab pane / content, while hiding all other labels and content that is not selected
      const selectTab = element => {

         //stores the active class for tab labels
         const active = document.querySelector('.item-active');

         //stores visible class for tab pane / content
         const visible = document.querySelector('.content-visible');

         //refrences actual element with the corresponding tab pane / content
         //get the element's id from the href of the selected tab label
         //use split method on the href to get the id or '#' which gives us an array of the url and the selected id
         //from the array we grab the index of [1] to isolate the id we want
         // const tabContent = document.getElementById(element.id.split('#')[1]);
         const tabContent = document.getElementById('tab-content-'+element.id);

         //the console log will show the id of the tab label selected
         //console.log(element.href.split('#')[1]);

         //first, if the active class exists on our tab label we remove it
         if (active) {
          active.classList.remove('item-active');
         }

         //add back the active class to the selected tab label
         element.classList.add('item-active');

         //similarly, if the visible class exists on our tab pane / content we remove it
         if (visible) {
          visible.classList.remove('content-visible');
         }

         //add back the visible class to the corresponding tab pane / content
         tabContent.classList.add('content-visible');

      }

      //event delegation
      document.addEventListener('click', event => {

         //if a tab label is clicked
         if (event.target.matches('.tab-item div')) {
          //run the selectTab function, pass in the click event target 
          selectTab(event.target);
          
          //the console log will show which tab label / anchor link is being selected
          //console.log(event.target);
         }

      }, false);

      // ===== CUSTOM POST TYPES ======

      var pageHeading = $('.wp-heading-inline').text();

      if ( $('#cpt_plural_name').length > 0) {
         var cptPluralLabelSaved = $('#cpt_plural_name').val();
         if ( cptPluralLabelSaved != '') {
            $('.wp-heading-inline').text(pageHeading+': '+cptPluralLabelSaved);      
         }
      }

      // CPT labels auto-populate based on plural and singular names

      $('#cpt_singular_name').bind('keypress keyup blur', function() {
         var cptSingularLabelValue = $(this).val();
         if ( cptSingularLabelValue != '' ) {
            $('#cpt_label_add_new_item').val('Add New '+$(this).val());
            $('#cpt_label_edit_item').val('Edit '+$(this).val());
            $('#cpt_label_new_item').val('New '+$(this).val());
            $('#cpt_label_view_item').val('View '+$(this).val());
            $('#cpt_label_parent_item_colon').val('Parent '+$(this).val()+':');
            $('#cpt_label_archives').val($(this).val()+' Archives');
            $('#cpt_label_attributes').val($(this).val()+' Attributes');
            $('#cpt_label_insert_into_item').val('Insert into '+$(this).val().toLowerCase());
            $('#cpt_label_uploaded_to_this_item').val('Uploaded to this '+$(this).val().toLowerCase());
            $('#cpt_label_item_published').val($(this).val()+' published');
            $('#cpt_label_item_published_privately').val($(this).val()+' published privately');
            $('#cpt_label_item_reverted_to_draft').val($(this).val()+' reverted to draft');
            $('#cpt_label_item_scheduled').val($(this).val()+' scheduled');
            $('#cpt_label_item_updated').val($(this).val()+' updated');
            $('#cpt_label_item_link').val($(this).val()+' Link');
            $('#cpt_label_item_link_description').val('A link to a '+$(this).val().toLowerCase());
         } else {
            $('#cpt_label_add_new_item').val('');
            $('#cpt_label_edit_item').val('');
            $('#cpt_label_new_item').val('');
            $('#cpt_label_view_item').val('');
            $('#cpt_label_parent_item_colon').val('');
            $('#cpt_label_archives').val('');
            $('#cpt_label_attributes').val('');
            $('#cpt_label_insert_into_item').val('');
            $('#cpt_label_uploaded_to_this_item').val('');
            $('#cpt_label_item_published').val('');
            $('#cpt_label_item_published_privately').val('');
            $('#cpt_label_item_reverted_to_draft').val('');
            $('#cpt_label_item_scheduled').val('');
            $('#cpt_label_item_updated').val('');
            $('#cpt_label_item_link').val('');
            $('#cpt_label_item_link_description').val('');
         }
      });

      $('#cpt_plural_name').bind('keypress keyup blur', function() {
         var cptPluralLabelValue = $(this).val();
         if ( cptPluralLabelValue != '' ) {
            $('.wp-heading-inline').text(pageHeading+': '+$(this).val());
            $('#cpt_label_view_items').val('View '+$(this).val());
            $('#cpt_label_search_items').val('Search '+$(this).val());
            $('#cpt_label_not_found').val('No '+$(this).val().toLowerCase()+' found');
            $('#cpt_label_not_found_in_trash').val('No '+$(this).val().toLowerCase()+' found in Trash');
            $('#cpt_label_all_items').val('All '+$(this).val());
            $('#cpt_label_menu_name').val($(this).val());
            $('#cpt_label_filter_items_list').val('Filter '+$(this).val().toLowerCase()+' list');
            $('#cpt_label_items_list_navigation').val($(this).val()+' list navigation');
            $('#cpt_label_items_list').val($(this).val()+' list');
         } else {
            $('.wp-heading-inline').text(pageHeading);
            $('#cpt_label_view_items').val('');
            $('#cpt_label_search_items').val('');
            $('#cpt_label_not_found').val('');
            $('#cpt_label_not_found_in_trash').val('');
            $('#cpt_label_all_items').val('');
            $('#cpt_label_menu_name').val('');
            $('#cpt_label_filter_items_list').val('');
            $('#cpt_label_items_list_navigation').val('');
            $('#cpt_label_items_list').val('');               
         }
      });

      $('#cpt_key').bind('keypress keyup blur', function() {
         var cptSlug = $(this).val();
         if ( cptSlug != '' ) {
            $('.post-type-key-text').text(cptSlug);
         } else {
            $('.post-type-key-text').text('movie');
         }
      });
      var cptSlugSaved = $('#cpt_key').val();
      $('.post-type-key-text').text(cptSlugSaved);
      
      // capability_type
      
      $(document).on('change','#cpt_capability_type', function() {
         if ( $('#cpt_capability_type').find(':selected').val() == 'custom' ) {
            $('label[for="cpt_capability_type_custom_slug_singular"]').show();
            $('#cpt_capability_type_custom_slug_singular').show();
            $('#cpt_capability_type_custom_slug_plural').show();
            $('label[for="cpt_map_meta_cap"]').show();
            $('#label-for-cpt-map-meta-cap').show();
         } else {
            $('label[for="cpt_capability_type_custom_slug"]').hide();
            $('#cpt_capability_type_custom_slug_singular').hide();
            $('#cpt_capability_type_custom_slug_plural').hide();
            $('label[for="cpt_map_meta_cap"]').hide();
            $('#label-for-cpt-map-meta-cap').hide();
         }
      });
      
      var cptCapabilityType = $('#cpt_capability_type').find(":selected").val();
      if ( cptCapabilityType == 'custom' ) {
            $('label[for="cpt_capability_type_custom_slug_singular"]').show();
            $('#cpt_capability_type_custom_slug_singular').show();
            $('#cpt_capability_type_custom_slug_plural').show();
            $('label[for="cpt_map_meta_cap"]').show();
            $('#label-for-cpt-map-meta-cap').show();
      }
      
      // query_var

      $(document).on('change','#cpt_query_var', function() {
         if ( $('#cpt_query_var').is(':checked') ) {
            $('#cpt-use-custom-query-var-string').show();
         } else {
            $('#cpt_use_custom_query_var_string').prop('checked', false);
            $('#cpt-use-custom-query-var-string').hide();
            $('label[for="cpt_query_var_string"]').hide();
            $('#cpt_query_var_string').hide();            
            $('#query-var-string-description').hide();
         }
      });
      if ( $('#cpt_query_var').is(':checked') ) {
            $('#cpt-use-custom-query-var-string').show();         
      }
      
      $(document).on('click','#cpt-use-custom-query-var-string', function() {
         if ( $('#cpt_use_custom_query_var_string').is(':checked') ) {
            $('label[for="cpt_query_var_string"]').show();
            $('#cpt_query_var_string').show();
            $('#query-var-string-description').show();
         } else {
            $('label[for="cpt_query_var_string"]').hide();
            $('#cpt_query_var_string').hide();            
            $('#query-var-string-description').hide();
         }
      });
      if ( $('#cpt_use_custom_query_var_string').is(':checked') ) {
            $('label[for="cpt_query_var_string"]').show();
            $('#cpt_query_var_string').show();
            $('#query-var-string-description').show();
            if ( $('#cpt_query_var_string').val() != '' ) {
               $('.custom-query-var-string').text($('#cpt_query_var_string').val());
            }
      }

      $('#cpt_query_var_string').bind('keypress keyup blur', function() {
         var customQueryVarString = $(this).val();
         if ( customQueryVarString != '' ) {
            $('.custom-query-var-string').text(customQueryVarString);
         } else {
            $('.custom-query-var-string').text('custom_string');
         }
      });
      
      // has_archive

      $(document).on('change','#cpt_has_archive', function() {
         if ( $('#cpt_has_archive').is(':checked') ) {
            $('#cpt-use-custom-archive-slug').show();
         } else {
            $('#cpt_use_custom_archive_slug').prop('checked', false);
            $('#cpt-use-custom-archive-slug').hide();
            $('label[for="cpt_has_archive_custom_slug"]').hide();
            $('#cpt_has_archive_custom_slug').hide();            
         }
      });
      if ( $('#cpt_has_archive').is(':checked') ) {
            $('#cpt-use-custom-archive-slug').show();
      }

      $(document).on('click','#cpt-use-custom-archive-slug', function() {
         if ( $('#cpt_use_custom_archive_slug').is(':checked') ) {
            $('label[for="cpt_has_archive_custom_slug"]').show();
            $('#cpt_has_archive_custom_slug').show();
         } else {
            $('label[for="cpt_has_archive_custom_slug"]').hide();
            $('#cpt_has_archive_custom_slug').hide();            
         }
      });
      if ( $('#cpt_use_custom_archive_slug').is(':checked') ) {
            $('label[for="cpt_has_archive_custom_slug"]').show();
            $('#cpt_has_archive_custom_slug').show();         
      }

      // rewrite

      $(document).on('change','#cpt_rewrite', function() {
         if ( $('#cpt_rewrite').is(':checked') ) {
            $('#cpt-use-custom-rewrite-slug').show();
            $('.enable-rewrite-related-field').show();
         } else {
            $('#cpt_use_custom_rewrite_slug').prop('checked', false);
            $('#cpt-use-custom-rewrite-slug').hide();
            $('label[for="cpt_rewrite_custom_slug"]').hide();
            $('#cpt_rewrite_custom_slug').hide();
            $('.enable-rewrite-related-field').hide();
         }
      });
      if ( $('#cpt_rewrite').is(':checked') ) {
            $('#cpt-use-custom-rewrite-slug').show();
            $('.enable-rewrite-related-field').show();         
      }

      $(document).on('click','#cpt-use-custom-rewrite-slug', function() {
         if ( $('#cpt_use_custom_rewrite_slug').is(':checked') ) {
            $('label[for="cpt_rewrite_custom_slug"]').show();
            $('#cpt_rewrite_custom_slug').show();
         } else {
            $('label[for="cpt_rewrite_custom_slug"]').hide();
            $('#cpt_rewrite_custom_slug').hide();            
         }
      });
      if ( $('#cpt_use_custom_rewrite_slug').is(':checked') ) {
            $('label[for="cpt_rewrite_custom_slug"]').show();
            $('#cpt_rewrite_custom_slug').show();         
      }

      $(document).on('change','#cpt_ep_mask', function() {
         if ( $('#cpt_ep_mask').is(':checked') ) {
            $('label[for="cpt_ep_mask_custom"]').show();
            $('#cpt_ep_mask_custom').show();
         } else {
            $('label[for="cpt_ep_mask_custom"]').hide();
            $('#cpt_ep_mask_custom').hide();
         }
      });
      if ( $('#cpt_ep_mask').is(':checked') ) {
            $('label[for="cpt_ep_mask_custom"]').show();
            $('#cpt_ep_mask_custom').show();         
      }

      // show_in_rest

      $(document).on('change','#cpt_show_in_rest', function() {
         if ( $('#cpt_show_in_rest').is(':checked') ) {
            $('.show-in-rest-related-field').show();
         } else {
            $('.show-in-rest-related-field').hide();
         }
      });
      if ( $('#cpt_show_in_rest').is(':checked') ) {
            $('.show-in-rest-related-field').show();         
      }

      // ===== CUSTOM TAXONOMIES ======

      var pageHeading = $('.wp-heading-inline').text();
      if ( $('#ctax_plural_name').length > 0) {
         var ctaxPluralLabelSaved = $('#ctax_plural_name').val();
         if ( ctaxPluralLabelSaved != '') {
            $('.wp-heading-inline').text(pageHeading+': '+ctaxPluralLabelSaved);      
         }
      }

      // Custom taxonomy labels auto-populate based on plural and singular names

      $('#ctax_singular_name').bind('keypress keyup blur', function() {
         var ctaxSingularLabelValue = $(this).val();
         if ( ctaxSingularLabelValue != '' ) {
            $('#ctax_label_parent_item').val('Parent '+$(this).val());
            $('#ctax_label_parent_item_colon').val('Parent '+$(this).val()+':');
            $('#ctax_label_edit_item').val('Edit '+$(this).val());
            $('#ctax_label_view_item').val('View '+$(this).val());
            $('#ctax_label_update_item').val('Update '+$(this).val());
            $('#ctax_label_add_new_item').val('Add New '+$(this).val());
            $('#ctax_label_new_item_name').val('New '+$(this).val()+' Name');
            $('#ctax_label_add_or_remove_items').val('Add or remove '+$(this).val().toLowerCase());
            $('#ctax_label_filter_by_item').val('Filter by '+$(this).val());
            $('#ctax_label_item_link').val($(this).val()+' Link');
            $('#ctax_label_item_link_description').val('A link to a '+$(this).val().toLowerCase());
         } else {
            $('#ctax_label_parent_item').val('');
            $('#ctax_label_parent_item_colon').val('');
            $('#ctax_label_edit_item').val('');
            $('#ctax_label_view_item').val('');
            $('#ctax_label_update_item').val('');
            $('#ctax_label_add_new_item').val('');
            $('#ctax_label_new_item_name').val('');
            $('#ctax_label_add_or_remove_items').val('');
            $('#ctax_label_filter_by_item').val('');
            $('#ctax_label_item_link').val('');
            $('#ctax_label_item_link_description').val('');
         }
      });

      $('#ctax_plural_name').bind('keypress keyup blur', function() {
         var ctaxPluralLabelValue = $(this).val();
         if ( ctaxPluralLabelValue != '' ) {
            $('.wp-heading-inline').text(pageHeading+': '+$(this).val());
            $('#ctax_label_search_items').val('Search '+$(this).val());
            $('#ctax_label_popular_items').val('Popular '+$(this).val());
            $('#ctax_label_all_items').val('All '+$(this).val());
            $('#ctax_label_separate_items_with_commas').val('Separate '+$(this).val().toLowerCase()+' with comma');
            $('#ctax_label_choose_from_most_used').val('Choose from the most used '+$(this).val().toLowerCase());
            $('#ctax_label_not_found').val('No '+$(this).val().toLowerCase()+' found');
            $('#ctax_label_no_terms').val('No '+$(this).val().toLowerCase());
            $('#ctax_label_items_list_navigation').val($(this).val()+' list navigation');
            $('#ctax_label_items_list').val($(this).val()+' list');
            $('#ctax_label_back_to_items').val('Back to '+$(this).val().toLowerCase());
         } else {
            $('.wp-heading-inline').text(pageHeading);
            $('#ctax_label_search_items').val('');
            $('#ctax_label_popular_items').val('');
            $('#ctax_label_all_items').val('');
            $('#ctax_label_separate_items_with_commas').val('');
            $('#ctax_label_choose_from_most_used').val('');
            $('#ctax_label_not_found').val('');
            $('#ctax_label_no_terms').val('');
            $('#ctax_label_items_list_navigation').val('');
            $('#ctax_label_items_list').val('');
            $('#ctax_label_back_to_items').val('');    
         }
      });

      $('#ctax_key').bind('keypress keyup blur', function() {
         var ctaxSlug = $(this).val();
         if ( ctaxSlug != '' ) {
            $('.taxonomy-key-text').text(ctaxSlug);
         } else {
            $('.taxonomy-key-text').text('genre');
         }
      });
      var ctaxSlugSaved = $('#ctax_key').val();
      $('.taxonomy-key-text').text(ctaxSlugSaved);

      $(document).on('change','#ctax_query_var', function() {
         if ( $('#ctax_query_var').is(':checked') ) {
            $('#ctax-use-custom-query-var-string').show();
         } else {
            $('#ctax_use_custom_query_var_string').prop('checked', false);
            $('#ctax-use-custom-query-var-string').hide();
            $('label[for="ctax_query_var_string"]').hide();
            $('#ctax_query_var_string').hide();            
            $('#query-var-string-description').hide();
         }
      });
      if ( $('#ctax_query_var').is(':checked') ) {
            $('#ctax-use-custom-query-var-string').show();         
      }
      
      $(document).on('click','#ctax-use-custom-query-var-string', function() {
         if ( $('#ctax_use_custom_query_var_string').is(':checked') ) {
            $('label[for="ctax_query_var_string"]').show();
            $('#ctax_query_var_string').show();
            $('#query-var-string-description').show();
         } else {
            $('label[for="ctax_query_var_string"]').hide();
            $('#ctax_query_var_string').hide();            
            $('#query-var-string-description').hide();
         }
      });
      if ( $('#ctax_use_custom_query_var_string').is(':checked') ) {
            $('label[for="ctax_query_var_string"]').show();
            $('#ctax_query_var_string').show();
            $('#query-var-string-description').show();
            if ( $('#ctax_query_var_string').val() != '' ) {
               $('.custom-query-var-string').text($('#ctax_query_var_string').val());
            }
      }

      $('#ctax_query_var_string').bind('keypress keyup blur', function() {
         var customQueryVarString = $(this).val();
         if ( customQueryVarString != '' ) {
            $('.custom-query-var-string').text(customQueryVarString);
         } else {
            $('.custom-query-var-string').text('custom_string');
         }
      });

      // rewrite

      $(document).on('change','#ctax_rewrite', function() {
         if ( $('#ctax_rewrite').is(':checked') ) {
            $('#ctax-use-custom-rewrite-slug').show();
            $('.enable-rewrite-related-field').show();
         } else {
            $('#ctax_use_custom_rewrite_slug').prop('checked', false);
            $('#ctax-use-custom-rewrite-slug').hide();
            $('label[for="ctax_rewrite_custom_slug"]').hide();
            $('#ctax_rewrite_custom_slug').hide();
            $('.enable-rewrite-related-field').hide();
         }
      });
      if ( $('#ctax_rewrite').is(':checked') ) {
            $('#ctax-use-custom-rewrite-slug').show();
            $('.enable-rewrite-related-field').show();         
      }

      $(document).on('click','#ctax-use-custom-rewrite-slug', function() {
         if ( $('#ctax_use_custom_rewrite_slug').is(':checked') ) {
            $('label[for="ctax_rewrite_custom_slug"]').show();
            $('#ctax_rewrite_custom_slug').show();
         } else {
            $('label[for="ctax_rewrite_custom_slug"]').hide();
            $('#ctax_rewrite_custom_slug').hide();            
         }
      });
      if ( $('#ctax_use_custom_rewrite_slug').is(':checked') ) {
            $('label[for="ctax_rewrite_custom_slug"]').show();
            $('#ctax_rewrite_custom_slug').show();         
      }

      $(document).on('change','#ctax_ep_mask', function() {
         if ( $('#ctax_ep_mask').is(':checked') ) {
            $('label[for="ctax_ep_mask_custom"]').show();
            $('#ctax_ep_mask_custom').show();
         } else {
            $('label[for="ctax_ep_mask_custom"]').hide();
            $('#ctax_ep_mask_custom').hide();
         }
      });
      if ( $('#ctax_ep_mask').is(':checked') ) {
            $('label[for="ctax_ep_mask_custom"]').show();
            $('#ctax_ep_mask_custom').show();         
      }

      // show_in_rest

      $(document).on('change','#ctax_show_in_rest', function() {
         if ( $('#ctax_show_in_rest').is(':checked') ) {
            $('.show-in-rest-related-field').show();
         } else {
            $('.show-in-rest-related-field').hide();
         }
      });
      if ( $('#ctax_show_in_rest').is(':checked') ) {
            $('.show-in-rest-related-field').show();         
      }
      
      // ===== OPTIONS PAGES ======
      
      $(document).on('change','#options_page_capability', function() {
         if ( $('#options_page_capability').find(':selected').val() == 'custom' ) {
            $('#options_page_capability_custom').show();
         } else {
            $('#options_page_capability_custom').hide();
         }
      });

      var cptCapabilityType = $('#options_page_capability').find(":selected").val();
      if ( cptCapabilityType == 'custom' ) {
            $('#options_page_capability_custom').show();
      }
      
      // ===== MENU ICON SELECTOR ======

      $('#icon-picker-button').click(function(e) {
         e.preventDefault();
         $('#close-icon-picker').show();
         $('#search-input').show();
         $('#menu-icons-list').show();
         $('#menu-icons-row').removeClass('zero-margin-bottom');
      });

      $('#close-icon-picker').click(function(e) {
         e.preventDefault();
         $(this).hide();
         $('#search-input').hide();
         $('#menu-icons-list').hide();
         $('#menu-icons-row').addClass('zero-margin-bottom');
      });

      $('.menu-icon').click(function() {
         var iconId = $(this).data('icon-id');
         var iconSvg = $(this).html();
         var iconSvgBase64 = btoa(iconSvg);
         var menuIcon = 'data:image/svg+xml;base64,'+iconSvgBase64
         $('#selected-menu-icon').html(iconSvg);
         $('#the_menu_icon').val(menuIcon);
         // $('#menu-icons-list').hide();
      });

      var searchInput = $('#search-input');
      $(searchInput).on('keypress keyup blur', function() {
         var searchVal = $(this).val();
         var filterItems = $('[data-sf]'); // sf = search filter

         if ( searchVal != '' ) {
            $(searchInput).addClass('has-text-input');
            setTimeout(function() {
               filterItems.addClass('icon-is-hidden');
               $('[data-sf][data-icon-id*="' + searchVal.toLowerCase() + '"]').removeClass('icon-is-hidden');
            }, 500 );
         } else {
            $(searchInput).removeClass('has-text-input');
            setTimeout(function() {
               filterItems.removeClass('icon-is-hidden');
            }, 250 );
         }
      });

      // Restore all results when the x button on search input field is clicked. 
      // The click triggers a 'search' event we're listening to below

      if ( searchInput.length > 0 ) {
         document.getElementById("search-input").addEventListener("search", function(event) {
            $(searchInput).removeClass('has-text-input');
            $('[data-sf]').each( function() {
               $(this).removeClass('icon-is-hidden');
            });
         });         
      }


   }); // END OF $(document).ready()

})( jQuery );