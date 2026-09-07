(function( $ ) {
   'use strict';

   $(document).ready( function() {
      
      var currentUrl = window.location.href;
      var hasSavedHScrollSetting = !! ( 'undefined' !== typeof adminColumns && adminColumns && adminColumns.hScrollSettingExists );

      var explicitWidthTypes = ['px', 'em', 'rem', '%'];

      /**
       * Check whether the current active columns include any fixed-width unit + positive number.
       *
       * @return {boolean}
       */
      function asenhaHasFixedWidthActiveColumn() {
         var hasFixedWidth = false;

         $('#current-columns .sortable-item').each(function() {
            var $item = $(this);
            var columnKey = $item.data('column-key');

            if ( ! columnKey ) {
               return;
            }

            var widthType = $item.find('input[name="width_type_'+columnKey+'"]:checked').val();
            var widthVal  = $item.find('input[name="column_width_'+columnKey+'"]').val();
            var widthNum  = parseFloat(widthVal);

            if ( explicitWidthTypes.indexOf(widthType) !== -1 && ! isNaN(widthNum) && widthNum > 0 ) {
               hasFixedWidth = true;
               return false; // break .each()
            }
         });

         return hasFixedWidth;
      }

      /**
       * Auto-toggle the \"Disable horizontal scrolling\" checkbox based on active column widths.
       *
       * - If all active columns are Auto width: check the box.
       * - If any active column has fixed width: uncheck the box.
       *
       * @return {void}
       */
      function asenhaSyncDisableHorizontalScrollCheckbox() {
         var $checkbox = $('input[name="disable-horizontal-scroll"]');
         if ( ! $checkbox.length ) {
            return;
         }

         if ( asenhaHasFixedWidthActiveColumn() ) {
            $checkbox.prop('checked', false);
         } else {
            $checkbox.prop('checked', true);
         }

         asenhaSyncFreezeFirstColumnsVisibility();
      }
      
      /**
       * Show/hide the “Freeze the first columns” setting based on the h-scroll checkbox.
       *
       * @return {void}
       */
      function asenhaSyncFreezeFirstColumnsVisibility() {
         var $freezeSetting = $( '.additional-setting-freeze-columns' );
         if ( ! $freezeSetting.length ) {
            return;
         }

         if ( $( 'input[name="disable-horizontal-scroll"]' ).is( ':checked' ) ) {
            $freezeSetting.addClass( 'is-hidden' );
         } else {
            $freezeSetting.removeClass( 'is-hidden' );
         }
      }

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
         return String.prototype.localeCompare.call($(a).data('column-title').toString().toLowerCase(), $(b).data('column-title').toString().toLowerCase());
      });
      $('#custom-field-columns').html(sortableList);
            
      // Render sortables with jQuery UI Sortable
      $('.sortable-columns').sortable({
         connectWith: '.sortable-columns',
         items: '.sortable-item',
         handle: '.dashicons.dashicons-menu',
         placeholder: 'ui-sortable-placeholder',
         forcePlaceholderSize: true,
         tolerance: 'pointer',
         stop: function() {
            // Update horizontal scrolling default when active columns change via drag/drop.
            asenhaSyncDisableHorizontalScrollCheckbox();
         }
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
         asenhaSyncDisableHorizontalScrollCheckbox();
      });

      // Set width of all columns to em
      $(document).on('click', '#set-width-em', function(e) {
         e.preventDefault();
         $('.active-columns-container').find('#current-columns .column-width-input').val('10');
         $('.active-columns-container').find('.column-width .width-number').text('10');
         $('.active-columns-container').find(".radio-group.width-type input[value='em']").prop("checked",true);
         $('.active-columns-container').find('.column-width .width-type').text('em');
         asenhaSyncDisableHorizontalScrollCheckbox();
      });

      // Set width of all columns to rem
      $(document).on('click', '#set-width-rem', function(e) {
         e.preventDefault();
         $('.active-columns-container').find('#current-columns .column-width-input').val('10');
         $('.active-columns-container').find('.column-width .width-number').text('10');
         $('.active-columns-container').find(".radio-group.width-type input[value='rem']").prop("checked",true);
         $('.active-columns-container').find('.column-width .width-type').text('rem');
         asenhaSyncDisableHorizontalScrollCheckbox();
      });

      // Set width of all columns to percent
      $(document).on('click', '#set-width-percent', function(e) {
         e.preventDefault();
         $('.active-columns-container').find('#current-columns .column-width-input').val('');
         $('.active-columns-container').find('.column-width .width-number').text('');
         $('.active-columns-container').find(".radio-group.width-type input[value='%']").prop("checked",true);
         $('.active-columns-container').find('.column-width .width-type').text('%');
         asenhaSyncDisableHorizontalScrollCheckbox();
      });

      // Set width of all columns to auto
      $(document).on('click', '#set-width-auto', function(e) {
         e.preventDefault();
         $('.active-columns-container').find('#current-columns .column-width-input').val('');
         $('.active-columns-container').find('.column-width .width-number').text('');
         $('.active-columns-container').find(".radio-group.width-type input[value='auto']").prop("checked",true);
         $('.active-columns-container').find('.column-width .width-type').text('Auto');
         asenhaSyncDisableHorizontalScrollCheckbox();
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
            asenhaSyncDisableHorizontalScrollCheckbox();
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
            asenhaSyncDisableHorizontalScrollCheckbox();
         }, 1);
      });
      
      // Show hide format sub-options on document ready
      $('.format-type select').each(function() {
         var savedFormatType = $(this).find('option:selected').attr('value');
         var thisSetting = $(this).parent().parent(); // .item-sub-settings
         if ('default'==savedFormatType) {
            thisSetting.find('.number-format-type').hide();
            thisSetting.find('.number-decimal-point').hide();
            thisSetting.find('.date-time-format-type').hide();
            thisSetting.find('.date-time-format-type-custom').hide();
         }
         if ('number'==savedFormatType) {
            thisSetting.find('.number-format-type').show();
            thisSetting.find('.number-decimal-point').show();
            thisSetting.find('.date-time-format-type').hide();
            thisSetting.find('.date-time-format-type-custom').hide();
         }
         if ('date_time'==savedFormatType) {
            thisSetting.find('.number-format-type').hide();
            thisSetting.find('.number-decimal-point').hide();
            thisSetting.find('.date-time-format-type').show();
            var dateTimeFormatType = thisSetting.find('.date-time-format-type').find('option:selected').attr('value');
            if ('custom'==dateTimeFormatType) {
               thisSetting.find('.date-time-format-type-custom').show();
            } else {
               thisSetting.find('.date-time-format-type-custom').hide();
            }
         }
      });

      // Show hide sub-options on format selection
      $(document).on('change','.format-type select',function() {
         var formatType = $(this).find('option:selected').attr('value');
         var thisSetting = $(this).parent().parent(); // .item-sub-settings
         console.log(formatType);
         console.log(thisSetting);
         if ('default'==formatType) {
            thisSetting.find('.number-format-type').hide();
            thisSetting.find('.number-decimal-point').hide();
            thisSetting.find('.date-time-format-type').hide();
            thisSetting.find('.date-time-format-type-custom').hide();
         }
         if ('number'==formatType) {
            thisSetting.find('.number-format-type').show();
            thisSetting.find('.number-decimal-point').show();
            thisSetting.find('.date-time-format-type').hide();
            thisSetting.find('.date-time-format-type-custom').hide();
         }
         if ('date_time'==formatType) {
            thisSetting.find('.number-format-type').hide();
            thisSetting.find('.number-decimal-point').hide();
            thisSetting.find('.date-time-format-type').show();
            var dateTimeFormatType = thisSetting.find('.date-time-format-type').find('option:selected').attr('value');
            if ('custom'==dateTimeFormatType) {
               thisSetting.find('.date-time-format-type-custom').show();
            } else {
               thisSetting.find('.date-time-format-type-custom').hide();
            }
         }
      });

      // Show or hide input field box custom date-time format 
      $(document).on('change','.date-time-format-type select',function() {
         var dateTimeFormatType = $(this).find('option:selected').attr('value');
         var thisSetting = $(this).parent(); // .date-time-format-type
         if ('custom'==dateTimeFormatType) {
            thisSetting.next('.date-time-format-type-custom').show();
         } else {
            thisSetting.next('.date-time-format-type-custom').hide();            
         }
      });

      // Show or hide Sort Order settings if the Sort checkbox is chekced 
      $(document).on('click','.default-sort-checkbox',function() {
         var columnKey = $(this).parents('.item-settings').data('column-key');
         if ($(this).is(':checked')) {
            $('.item-setting.default-sort-setting input[type="checkbox"]:not(\'.default-sort-checkbox-' + columnKey + '\')').prop('checked', false);
            $(this).parents('.item-setting').next('.item-setting').css('display','flex');
            $('.item-setting.sort-order-setting:not(\'.sort-order-setting-' + columnKey + '\')').hide();
            $('.sortable-icon.default-sort').removeClass('default-sort');
            $(this).parents('.sortable-item').find('.sortable-icon').addClass('default-sort');
         } else {
            $(this).parents('.item-setting').next('.item-setting').css('display','none');
         }
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
         asenhaSyncDisableHorizontalScrollCheckbox();
      });

      // Initialize default checkbox state only when no saved setting exists yet.
      if ( ! hasSavedHScrollSetting ) {
         asenhaSyncDisableHorizontalScrollCheckbox();
      }

      // Keep freeze setting visibility in sync with checkbox state.
      asenhaSyncFreezeFirstColumnsVisibility();
      $( document ).on( 'change', 'input[name="disable-horizontal-scroll"]', function() {
         asenhaSyncFreezeFirstColumnsVisibility();
      } );
      
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
            if ( $(this).data('is-formatable') == 'yes' ) {
               var isFormatable = true;
            } else if ( $(this).data('is-formatable') == 'no' ) {
               var isFormatable = false;
            }
            var customColumnTitle = $(this).find('.item-bar .column-title').text();
            var width = $(this).find('input[name="column_width_'+columnKey+'"]').val();
            var widthType = $(this).find('input[name="width_type_'+columnKey+'"]:checked').val();
            if ( $(this).find('select[name="format_type_'+columnKey+'"]').length ) {
               var formatType = $(this).find('select[name="format_type_'+columnKey+'"]').find(':selected').val();            
            } else {
               var formatType = 'default';
            }
            if ( $(this).find('select[name="format_type_'+columnKey+'"]').length
               && $(this).find('select[name="format_type_'+columnKey+'"]').find(':selected').val() == 'number' ) {
               var numberFormatType = $(this).find('select[name="number_format_type_'+columnKey+'"]').find(':selected').val();
               var numberDecimalPoint = $(this).find('input[name="number_decimal_point_'+columnKey+'"]').val();
            } else {
               var numberFormatType = '';
               var numberDecimalPoint = '';
            }
            if ( $(this).find('select[name="format_type_'+columnKey+'"]').length
               && $(this).find('select[name="format_type_'+columnKey+'"]').find(':selected').val() == 'date_time' ) {
               var dateTimeFormatType = $(this).find('select[name="date_time_format_type_'+columnKey+'"]').find(':selected').val();
               var dateTimeFormatCustom = $(this).find('input[name="date_time_format_custom_'+columnKey+'"]').val();
            } else {
               var dateTimeFormatType = '';
               var dateTimeFormatCustom = '';
            }
            if ( $(this).find('input[name="default_sort_'+columnKey+'"]').length ) {
               if ( $(this).find('input[name="default_sort_'+columnKey+'"]').is(':checked') ) {
                  var isTheDefaultSort = true;
               } else {
                  var isTheDefaultSort = false;
               }
            } else {
                  var isTheDefaultSort = false;
            }
            if ( $(this).find('input[name="sort_order_'+columnKey+'"]').length ) {
               var sortOrder = $(this).find('input[name="sort_order_'+columnKey+'"]:checked').val();            
            } else {
               var sortOrder = '';
            }

            columns[columnKey] = {};
            columns[columnKey]['key'] = columnKey;
            columns[columnKey]['title'] = columnTitle;
            columns[columnKey]['use_original_title'] = columnUseOriginalTitle;
            columns[columnKey]['is_extra_field'] = isExtraField;
            columns[columnKey]['is_custom_field'] = isCustomField;
            columns[columnKey]['is_sortable'] = isSortable;
            columns[columnKey]['is_formatable'] = isFormatable;
            columns[columnKey]['custom_title'] = customColumnTitle;
            columns[columnKey]['width'] = width;
            columns[columnKey]['width_type'] = widthType;
            columns[columnKey]['format_type'] = formatType;
            columns[columnKey]['number_format_type'] = numberFormatType;
            columns[columnKey]['number_decimal_point'] = numberDecimalPoint;
            columns[columnKey]['date_time_format_type'] = dateTimeFormatType;
            columns[columnKey]['date_time_format_custom'] = dateTimeFormatCustom;
            columns[columnKey]['is_the_default_sort'] = isTheDefaultSort;
            columns[columnKey]['sort_order'] = sortOrder;
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
         
         // Check if horizontal scrolling is disabled
         var isHorizontalScrollingDisabled;
         if ( $('input[name="disable-horizontal-scroll"]').is(':checked') ) {
            isHorizontalScrollingDisabled = true;
         } else {
            isHorizontalScrollingDisabled = false;
         }

         // Freeze header row.
         var freezeHeaderRow = false;
         if ( $( 'input[name="freeze-header-row"]' ).length && $( 'input[name="freeze-header-row"]' ).is( ':checked' ) ) {
            freezeHeaderRow = true;
         }

         // Freeze first columns: number of data columns (0 = No columns).
         var freezeFirstColumns = 1;
         if ( $( 'select[name="freeze-first-columns"]' ).length ) {
            freezeFirstColumns = parseInt( $( 'select[name="freeze-first-columns"]' ).val(), 10 );
         }
         if ( isNaN( freezeFirstColumns ) ) {
            freezeFirstColumns = 1;
         }
         if ( freezeFirstColumns < 0 ) {
            freezeFirstColumns = 0;
         }
         if ( freezeFirstColumns > 5 ) {
            freezeFirstColumns = 5;
         }

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
               'discarded_columns': JSON.stringify(discardedColumns),
               'is_horizontal_scrolling_disabled': isHorizontalScrollingDisabled,
               'freeze_first_columns': freezeFirstColumns,
               'freeze_header_row': freezeHeaderRow
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