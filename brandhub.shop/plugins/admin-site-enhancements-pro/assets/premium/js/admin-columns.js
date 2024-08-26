(function( $ ) {
   'use strict';

   $(document).ready( function() {
      
      var currentUrl = window.location.href;
      
      // Get post type value from URL and set the select dropdown value
      const urlParams = new URLSearchParams(window.location.search);
      const postTypeParam = urlParams.get('for');
      var postType = '';
      if ( postTypeParam ) {
         $('select[name="organize-admin-columns-for"]').val(postTypeParam);
         postType = postTypeParam;
      } else {
         $('select[name="organize-admin-columns-for"]').val('post'); 
         postType = 'post';              
      }

      // Change post type
      $(document).on('change', 'select[name="organize-admin-columns-for"]', function() {
         var postType = $(this).val();
         $('.view-button').hide();
         $('.asenha-heading-inline-wrap .spinner-img').show();
         window.location.href = currentUrl+'&for='+postType;
      });
      
      // Sort custom fields items by label in data-attribute. Ref: https://stackoverflow.com/a/27836605.
      var sortableList = $('#custom-field-columns .sortable-item');
      sortableList.sort(function(a, b) { 
         return String.prototype.localeCompare.call($(a).data('column-title').toLowerCase(), $(b).data('column-title').toLowerCase());
      });
      $('#custom-field-columns').html(sortableList);
            
      // Render sortables with jQuery UI Sortable
      $('.sortable-columns').sortable({
         connectWith: '.sortable-columns',
         items: '.sortable-item',
         handle: '.dashicons.dashicons-menu',
         placeholder: 'ui-sortable-placeholder',
         forcePlaceholderSize: true,
         tolerance: 'pointer'
      });

      // Open settings panel on clicking settings icon
      $('.settings-button').click(function(e) {
         e.preventDefault();
         $(this).parents('.sortable-item').find('.item-bar').toggleClass('expanded');
         $(this).parents('.sortable-item').find('.item-settings').toggle();
      });
            
      // Close settings panel on clicking close button
      $('.close-settings-button').click(function(e) {
         e.preventDefault();
         $(this).parents('.sortable-item').find('.item-bar').removeClass('expanded');
         $(this).parents('.sortable-item').find('.item-settings').toggle();
      });
      
      // Expand all settings panel
      $(document).on('click', '.expand-collapse-all', function(e) {
         e.preventDefault();
         $(this).addClass('all-expanded');
         $(this).text('Collapse all');
         $(this).parents('.admin-columns-current').find('.active-columns-container .item-bar').addClass('expanded');
         $(this).parents('.admin-columns-current').find('.active-columns-container .item-settings').show();
      });

      // Collapse all settings panel
      $(document).on('click', '.expand-collapse-all.all-expanded', function(e) {
         e.preventDefault();
         $(this).removeClass('all-expanded');
         $(this).text('Expand all');
         $(this).parents('.admin-columns-current').find('.active-columns-container .item-bar').removeClass('expanded');
         $(this).parents('.admin-columns-current').find('.active-columns-container .item-settings').hide();
      });

      // Set width of all columns to pixels
      $(document).on('click', '#set-width-pixel', function(e) {
         e.preventDefault();
         $('.active-columns-container').find('#current-columns .column-width-input').val('100');
         $('.active-columns-container').find('.column-width .width-number').text('100');
         $('.active-columns-container').find(".radio-group.width-type input[value='px']").prop("checked",true);
         $('.active-columns-container').find('.column-width .width-type').text('px');
      });

      // Set width of all columns to percent
      $(document).on('click', '#set-width-percent', function(e) {
         e.preventDefault();
         $('.active-columns-container').find('#current-columns .column-width-input').val('');
         $('.active-columns-container').find('.column-width .width-number').text('');
         $('.active-columns-container').find(".radio-group.width-type input[value='%']").prop("checked",true);
         $('.active-columns-container').find('.column-width .width-type').text('%');
      });

      // Set width of all columns to auto
      $(document).on('click', '#set-width-auto', function(e) {
         e.preventDefault();
         $('.active-columns-container').find('#current-columns .column-width-input').val('');
         $('.active-columns-container').find('.column-width .width-number').text('');
         $('.active-columns-container').find(".radio-group.width-type input[value='auto']").prop("checked",true);
         $('.active-columns-container').find('.column-width .width-type').text('Auto');
      });

      // Change column label based on input
      $(document).on('keyup paste', '.column-label', function() {
         var $this = $(this);
         setTimeout(function() {
            $this.parents('.sortable-item').find('.item-bar .column-title').text($this.val());
         }, 1);
      });

      // Change column width text based on text input
      $(document).on('keyup paste', '.column-width-input', function() {
         var $this = $(this);
         setTimeout(function() {
            $this.parents('.sortable-item').find('.item-bar .width-number').text($this.val());
            if ( $this.parents('.sortable-item').find('.item-bar .width-type').text() == 'Auto' ) {
               $this.parents('.sortable-item').find('.item-bar .width-type').text('');            
            }
         }, 1);
      });

      // Change column width type text based on radio input selection
      $('.width-type-radios').change(function() {
         var $this = $(this);
         var widthType = $(this).val();
         var widthNumber = $this.parents('.sortable-item').find('.item-bar .width-number').val();
         if ( widthType == 'auto' ) {
            widthType = 'Auto';
            $this.parents('.sortable-item').find('.item-bar .width-number').text('');
            $this.parents('.sortable-item').find('.column-width-input').val('');
         }
         setTimeout(function() {
            $this.parents('.sortable-item').find('.item-bar .width-type').text(widthType);
         }, 1);
      });
      
      // Update data-use-original-title attribute based on checkbox click
      $('.title-original-checkbox').click(function(e) {
         if ($(this).is(':checked')) {
            $(this).parents('.sortable-item').data('use-original-title', 'yes');
         } else {
            $(this).parents('.sortable-item').data('use-original-title', 'no');
         }
      });
      
      // Move discarded items to the Discarded container
      $('.delete-button').click(function(e){
         e.preventDefault();
         $(this).parents('.sortable-item').find('.item-settings').hide();
         $('.admin-columns-discarded').show();
         $(this).parents('.sortable-item').addClass('discarded');
         $(this).parents('.sortable-item').appendTo('#discarded-columns');
         $('.sortable-columns').sortable('refresh');
      });
      
      // Saving data via AJAX
      $('.save-button').click(function(e) {
         // Gather data on the selected active columns
         var columns = {}; // object
         columns['cb'] = {key:'cb',title:'<input type="checkbox" />'};
         $('#current-columns .sortable-item').each(function() {
            var columnKey = $(this).data('column-key');
            var columnTitle = $(this).data('column-title');
            if ( $(this).data('use-original-title') == 'yes' ) {
               var columnUseOriginalTitle = true;
            } else if ( $(this).data('use-original-title') == 'no' ) {
               var columnUseOriginalTitle = false;               
            }
            if ( $(this).data('is-extra-field') == 'yes' ) {
               var isExtraField = true;
            } else if ( $(this).data('is-extra-field') == 'no' ) {
               var isExtraField = false;
            }
            if ( $(this).data('is-custom-field') == 'yes' ) {
               var isCustomField = true;
            } else if ( $(this).data('is-custom-field') == 'no' ) {
               var isCustomField = false;
            }
            if ( $(this).data('is-sortable') == 'yes' ) {
               var isSortable = true;
            } else if ( $(this).data('is-sortable') == 'no' ) {
               var isSortable = false;
            } else if ( $(this).data('is-sortable') == 'maybe' ) {
               var isSortable = 'maybe';
            }
            var customColumnTitle = $(this).find('.item-bar .column-title').text();
            var width = $(this).find('input[name="column_width_'+columnKey+'"]').val();
            var widthType = $(this).find('input[name="width_type_'+columnKey+'"]:checked').val();
            columns[columnKey] = {};
            columns[columnKey]['key'] = columnKey;
            columns[columnKey]['title'] = columnTitle;
            columns[columnKey]['use_original_title'] = columnUseOriginalTitle;
            columns[columnKey]['is_extra_field'] = isExtraField;
            columns[columnKey]['is_custom_field'] = isCustomField;
            columns[columnKey]['is_sortable'] = isSortable;
            columns[columnKey]['custom_title'] = customColumnTitle;
            columns[columnKey]['width'] = width;
            columns[columnKey]['width_type'] = widthType;
         });
         // console.log(columns);
         // console.log(JSON.stringify(columns));

         // Gather data on discarded columns. Useful to update list of extra columns in options, i.e. admin_columns_extra
         var discardedColumns = {}; // object
         $('#discarded-columns .sortable-item').each(function() {
            var discardedColumnKey = $(this).data('column-key');
            var discardedColumnTitle = $(this).data('column-title');
            if ( $(this).data('is-extra-field') == 'yes' ) {
               var discardedIsExtraField = true;
            } else if ( $(this).data('is-extra-field') == 'no' ) {
               var discardedIsExtraField = false;
            }
            if ( $(this).data('is-custom-field') == 'yes' ) {
               var discardedIsCustomField = true;
            } else if ( $(this).data('is-custom-field') == 'no' ) {
               var discardedIsCustomField = false;
            }
            discardedColumns[discardedColumnKey] = {};
            discardedColumns[discardedColumnKey]['key'] = discardedColumnKey;
            discardedColumns[discardedColumnKey]['title'] = discardedColumnTitle;
            discardedColumns[discardedColumnKey]['is_extra_field'] = discardedIsExtraField;
            discardedColumns[discardedColumnKey]['is_custom_field'] = discardedIsCustomField;
         });

         $('.save-button').text('Saving Changes...');
         $('.saving-progress').show();
         $('.saving-progress .spinner-img').show();

         $.ajax({
            type: "post",
            url: ajaxurl,
            data: {
               'action':'save_columns_order',
               'nonce': adminColumns.nonce,
               'post_type': postType,
               'columns': JSON.stringify(columns),
               'discarded_columns': JSON.stringify(discardedColumns)
            },
            success:function(data) {
               var data = data.slice(0,-1); // remove strange trailing zero in string returned by AJAX call
               var response = JSON.parse(data);
               // console.log(response);

               if ( response.status == 'success' ) {
                  // console.log('Success');
                  $('.saving-progress .spinner-img').hide();
                  $('.changes-saved').fadeIn();
                  setTimeout( function() {
                     $('.changes-saved').fadeOut();
                  }, 3000);
                  $('.save-button').text('Save Changes');
               }
            },
            error:function(errorThrown) {
               console.log(errorThrown);
            }
         });
      });

      // Reset columns via AJAX
      $('#reset-columns').click(function(e) {
         $('#reset-columns-spinner-img').show();
         $.ajax({
            url: ajaxurl,
            data: {
               'action':'reset_columns',
               'nonce': adminColumns.nonce,
               'post_type': postType
            },
            success:function(data) {
               var data = data.slice(0,-1); // remove strange trailing zero in string returned by AJAX call
               var response = JSON.parse(data);
               // console.log(response);

               if ( response.status == 'success' ) {
                  // console.log('Success');
                  window.location.href = currentUrl+'&for='+postType;
               }
            },
            error:function(errorThrown) {
               console.log(errorThrown);
            }
         });
      });

      // Re-index custom fields via AJAX
      $('#reindex-custom-fields').click(function(e) {
         $('#reindex-custom-fields-spinner-img').show();
         $.ajax({
            url: ajaxurl,
            data: {
               'action':'reindex_custom_fields',
               'nonce': adminColumns.nonce,
               'post_type': postType
            },
            success:function(data) {
               var data = data.slice(0,-1); // remove strange trailing zero in string returned by AJAX call
               var response = JSON.parse(data);
               // console.log(response);

               if ( response.status == 'success' ) {
                  // console.log('Success');
                  window.location.href = currentUrl+'&for='+postType;
               }
            },
            error:function(errorThrown) {
               console.log(errorThrown);
            }
         });
      });

      // Search columns

      var searchInput = $('#column-search-input');
      
      $(searchInput).on('keyup', function() {
         var searchVal = $(this).val();
         var filterItems = $('[data-search-filter]');

         if ( searchVal != '' ) {
            setTimeout(function() {
               $(searchInput).addClass('has-text-input');
               filterItems.addClass('result-is-hidden');
               $('[data-search-filter][data-column-key*="' + searchVal.toLowerCase() + '"]').removeClass('result-is-hidden');
            }, 250 );
         } else {
            setTimeout(function() {
               $(searchInput).removeClass('has-text-input');
               filterItems.removeClass('result-is-hidden');
            }, 250 );
         }
      });

      // Restore all results when the x button on search input field is clicked. 
      // The click triggers a 'search' event we're listening to below

      if ( searchInput.length > 0 ) {
         document.getElementById("column-search-input").addEventListener("search", function(event) {
            $(searchInput).removeClass('has-text-input');
            $('[data-search-filter]').each( function() {
               $(this).removeClass('result-is-hidden');
            });
            updateResultsCount();
         });         
      }
      
      // Toggle private fields in the Custom Fields section
      $('#toggle-private-fields').click(function() {
         $('.sortable-item.custom-field.private-field').toggleClass('show-field');
      });
      
   }); // END OF $(document).ready()

})( jQuery );