(function( $ ) {
   'use strict';

   $(document).ready( function() {

      // Make page header sticky on scroll. Using https://github.com/AndrewHenderson/jSticky
      if (typeof $.fn.sticky === 'function') {
         $('#asenha-header').sticky({
            topSpacing: 0, // Space between element and top of the viewport (in pixels)
            zIndex: 100, // z-index
            stopper: '', // Id, class, or number value
            stickyClass: 'asenha-sticky' // Class applied to element when it's stuck. Class name or false.
         })       
      }
     
      // Clicking on header save button triggers click of the hidden form submit button
      $('.asenha-save-button').click( function(e) {

         e.preventDefault();
         
         $('.asenha-saving-changes').fadeIn();

         // Get current tab's URL hash and save it in cookie
         var hash = decodeURI(window.location.hash).substr(1); // get hash without the # character
         Cookies.set('asenha_tab', hash, { expires: 1 }); // expires in 1 day

         // Submit the settings form
         $('input[type="submit"]#asenha-submit').click();

      });

      // Search modules
      var searchInput = $('#module-search-input');
      
      $(searchInput).keyup(delay(function (e) {
         var searchVal = $(this).val();
         var filterItems = $('[data-search-filter]');

         if ( searchVal != '' ) {
            setTimeout(function() {
               $(searchInput).addClass('has-text-input');
               $('.modules-tab').hide();
               $('.search-tab').show();
               $('.asenha-fields.section-visible').addClass('originally-visible');
               $('.asenha-fields').removeClass('section-visible');
               $('.asenha-fields').removeClass('section-hidden');
               $('.asenha-fields').addClass('section-visible-for-search');
               filterItems.parents('.asenha-toggle').addClass('result-is-hidden');
               $('[data-search-filter][data-module-info*="' + searchVal.toLowerCase() + '"]').parents('.asenha-toggle').removeClass('result-is-hidden');
            }, 250 );
            refreshCodeMirror();
         } else {
            setTimeout(function() {
               searchInput.removeClass('has-text-input');
               filterItems.parents('.asenha-toggle').removeClass('result-is-hidden');
               clear_search();
               refreshCodeMirror();
            }, 250 );
         }
      }, 200));

      // Restore all results when the x button on search input field is clicked. 
      // The click triggers a 'search' event we're listening to below

      if ( searchInput.length > 0 ) {
         document.getElementById("module-search-input").addEventListener("search", function(event) {
            clear_search();
            refreshCodeMirror();
         });         
      }
      
      // Ref: https://stackoverflow.com/a/1909508
      function delay(fn, ms) {
         let timer = 0
         return function(...args) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, ...args), ms || 0)
         }
      }
            
      function clear_search() {
            searchInput.removeClass('has-text-input');
            $('[data-search-filter]').each( function() {
               $(this).parents('.asenha-toggle').removeClass('result-is-hidden');
               $('.modules-tab').show();
               $('.search-tab').hide();
               $('.asenha-fields').removeClass('section-visible-for-search');
               $('.asenha-fields').addClass('section-hidden');
               // Has no effect. Compensate with CSS .asenha-fields.section-visible.section-hidden { display: block; }
               // $('.asenha-fields.originally-visible').removeClass('section-hidden'); 
               $('.asenha-fields.originally-visible').addClass('section-visible');
               $('.asenha-fields').removeClass('originally-visible');
            });
      }

      // Show all / less toggler for field options | Modified from https://codepen.io/symonsays/pen/rzgEgY
      $('.asenha-field-with-options.field-show-more > .show-more').click(function(e) {

         e.preventDefault();

         var $this = $(this);
         $this.toggleClass('show-more');

         if ($this.hasClass('show-more')) {
            $this.next().removeClass('opened',0);
            $this.html(adminPageVars.expandText + ' &#9660;');
         } else {
            $this.next().addClass('opened',0);
            $this.html(adminPageVars.collapseText + ' &#9650;');
         }

      });

      /**
       * Update the SMTP password status label and inline warning from AJAX responses.
       *
       * @param {Object} response Test-email AJAX response payload.
       */
      function asenhaUpdateSmtpPasswordUiState( response ) {
         if ( ! response || typeof response !== 'object' ) {
            return;
         }

         if ( typeof response.smtp_password_description !== 'undefined' ) {
            $('.asenha-smtp-password-description').text( response.smtp_password_description );
         }

         var $warning = $('.asenha-smtp-password-warning');
         if ( typeof response.smtp_password_warning !== 'undefined' ) {
            if ( response.smtp_password_warning ) {
               $warning.empty().append(
                  $('<div class="notice notice-warning inline"></div>').append(
                     $('<p></p>').text( response.smtp_password_warning )
                  )
               ).show();
            } else {
               $warning.empty().hide();
            }
         }
      }
      
      // Email Delivery >> Send test email
      $('#send-test-email').click(function(e) {
         e.preventDefault();
         var emailTo = $('#test-email-to').val();
         var defaultTestEmailFailedMessage = $('#test-email-failed-message').text();
         if ( emailTo ) {
            $('#ajax-result').show();
            $('.sending-test-email').show();
            $('.test-email-result').hide();
            $('#test-email-success').hide();
            $('#test-email-failed').hide();
            $('#test-email-failed-message').text(defaultTestEmailFailedMessage);
            $.ajax({
               url: ajaxurl,
               dataType: 'json',
               data: {
                  'action':'send_test_email',
                  'email_to': emailTo,
                  'nonce': adminPageVars.sendTestEmailNonce
               },
               success:function(data) {
                  var response = data;
                  asenhaUpdateSmtpPasswordUiState( response );
                  if ( response.status == 'success' ) {
                     setTimeout( function() {
                        $('.sending-test-email').hide();
                        // $('.test-email-result').show();
                        $('#test-email-success').show();
                     }, 1500);
                  }
                  if ( response.status == 'failed' ) {
                     if ( response.message ) {
                        $('#test-email-failed-message').text(response.message);
                     } else {
                        $('#test-email-failed-message').text(defaultTestEmailFailedMessage);
                     }
                     setTimeout( function() {
                        $('.sending-test-email').hide();
                        // $('.test-email-result').show();
                        $('#test-email-failed').show();
                     }, 1500);                     
                  }
               },
               error:function(errorThrown) {
                  console.log(errorThrown);
                  $('#test-email-failed-message').text(defaultTestEmailFailedMessage);
                  setTimeout( function() {
                     $('.sending-test-email').hide();
                     $('.test-email-result').show();
                     $('#test-email-failed').show();
                  }, 1500);
               }
            });
         } else {
            alert( 'Please enter destination email address first.' );
         }
      });

      /*! <fs_premium_only> */
      // Form Builder >> Send test email
      $('#form-builder-send-test-email').click(function(e) {
         e.preventDefault();
         var emailTo = $('#form-builder-test-email-to').val();
         var emailTemplate = $('.form-builder-email-template select').val();
         if ( emailTo ) {
            $('#form-builder-ajax-result').show();
            $('.form-builder-sending-test-email').show();
            $('.test-email-result').hide();
            $('#form-builder-test-email-success').hide();
            $('#form-builder-test-email-failed').hide();
            $.ajax({
               type: 'POST',
               url: ajaxurl,
               data: {
                  action: 'formbuilder_test_email_template',
                  email_template: emailTemplate,
                  test_email: emailTo,
                  nonce: adminPageVars.formBuilderSendTestEmailNonce
               },
               success:function(data) {
                  var response = JSON.parse(data);
                  if ( response.success ) {
                     setTimeout( function() {
                        $('.form-builder-sending-test-email').hide();
                        $('#form-builder-test-email-success').show();
                     }, 1500);
                  }
                  if ( ! response.success ) {
                     setTimeout( function() {
                        $('.form-builder-sending-test-email').hide();
                        $('#form-builder-test-email-failed').show();
                     }, 1500);                     
                  }
               },
               error:function(errorThrown) {
                  console.log(errorThrown);
                  setTimeout( function() {
                     $('.sending-test-email').hide();
                     $('.test-email-result').show();
                     $('#test-email-failed').show();
                  }, 1500);
               }
            });
         } else {
            alert( 'Please enter destination email address first.' );
         }
      });

      // Clean Up Admin Bar >> Rescan Extra Elements
      $('#asenha-rescan-extra-admin-bar-elements').on('click', function(e) {
         e.preventDefault();

         var $button = $(this);
         var $status = $('.asenha-admin-bar-rescan-status');

         $button.prop('disabled', true);
         $status.removeClass('is-success is-error').text(adminPageVars.rescanExtraElementsWorkingText).show();

         $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
               action: 'rescan_admin_bar_nodes__premium_only',
               nonce: adminPageVars.nonce
            },
            success: function(response) {
               if (response && response.success) {
                  $status.addClass('is-success').text(adminPageVars.rescanExtraElementsDoneText);
                  setTimeout(function() {
                     location.reload();
                  }, 500);
               } else {
                  $status.addClass('is-error').text(adminPageVars.rescanExtraElementsFailedText);
                  $button.prop('disabled', false);
               }
            },
            error: function() {
               $status.addClass('is-error').text(adminPageVars.rescanExtraElementsFailedText);
               $button.prop('disabled', false);
            }
         });
      });

      // Code Snippets Manager >> Export snippets with filtering options
      $('#asenha_snippets_export_type').on('change', function() {
         var exportType = $(this).val();
         var $exportOptions = $('#asenha-snippets-export-options');
         var $exportContent = $('#asenha-snippets-export-content');
         var $loading = $('#asenha-snippets-export-loading');
         
         // Clear previous selections
         $('#asenha_selected_snippet_ids').val('');
         $('#asenha_selected_category_ids').val('');
         $('#asenha_selected_snippet_types').val('');
         
         // Hide options section for "all" type
         if (exportType === 'all') {
            $exportOptions.slideUp(300);
            $exportContent.html('');
            return;
         }
         
         // Show options section for other types
         $exportOptions.slideDown(300);
         
         // Don't load anything for "active" type - it's handled on the backend
         if (exportType === 'active') {
            $exportContent.html('<p>' + adminPageVars.snippetsExportActiveInfo + '</p>');
            return;
         }
         
         // Render checkboxes for "by_types" - no AJAX needed
         if (exportType === 'by_types') {
            renderSnippetTypesCheckboxes();
            return;
         }
         
         // Load categories or snippets via AJAX
         if (exportType === 'by_categories' || exportType === 'manual') {
            $loading.show();
            $exportContent.html('');
            
            var action = exportType === 'by_categories' ? 'get_snippet_categories_for_export' : 'get_snippets_for_export';
            
            $.ajax({
               url: ajaxurl,
               type: 'POST',
               data: {
                  action: action,
                  nonce: $('#asenha_snippets_export_ajax_nonce').val()
               },
               success: function(response) {
                  $loading.hide();
                  
                  if (response.success) {
                     if (exportType === 'by_categories') {
                        renderCategoriesHierarchy(response.data);
                     } else {
                        renderSnippetsList(response.data);
                     }
                  } else {
                     $exportContent.html('<p class="asenha-error">' + (response.data.message || 'Error loading data') + '</p>');
                  }
               },
               error: function(xhr, status, error) {
                  $loading.hide();
                  console.error('AJAX Error:', error);
                  $exportContent.html('<p class="asenha-error">Error loading data. Please try again.</p>');
               }
            });
         }
      });
      
      // Function to render categories hierarchy with expand/collapse
      function renderCategoriesHierarchy(categories) {
         var $exportContent = $('#asenha-snippets-export-content');
         
         if (!categories || categories.length === 0) {
            $exportContent.html('<p>' + adminPageVars.snippetsExportNoCategoriesInfo + '</p>');
            return;
         }
         
         var html = '<div class="asenha-categories-list">';
         html += '<p><strong>' + adminPageVars.snippetsExportSelectCategoriesLabel + '</strong></p>';
         html += '<ul class="asenha-category-tree">';
         
         // Build hierarchy - only render top-level categories first
         categories.forEach(function(category) {
            if (category.parent_id === 0) {
               html += renderCategory(category, categories);
            }
         });
         
      html += '</ul></div>';
      $exportContent.html(html);
      
      // Unbind any existing handlers to prevent multiple bindings
      $exportContent.off('change.categoryCheckbox click.categoryToggle');
      
      // Handle category checkbox changes
      $exportContent.on('change.categoryCheckbox', '.asenha-category-checkbox', function() {
         updateSelectedCategories();
      });
      
      // Handle expand/collapse toggles
      $exportContent.on('click.categoryToggle', '.asenha-category-toggle', function(e) {
         e.preventDefault();
         var $toggle = $(this);
         var $children = $toggle.closest('li').find('> ul');
         
         if ($children.length > 0) {
            $children.slideToggle(200);
            $toggle.toggleClass('expanded');
         }
      });
   }
      
      // Function to render a single category with its children
      function renderCategory(category, allCategories) {
         var hasChildren = allCategories.some(function(cat) {
            return cat.parent_id === category.term_id;
         });
         
         var html = '<li class="asenha-category-item" data-level="' + category.level + '">';
         
         // Wrap toggle and label in a header div
         html += '<div class="asenha-category-header">';
         
         // Add toggle icon if has children
         if (hasChildren) {
            html += '<span class="asenha-category-toggle dashicons dashicons-arrow-right"></span>';
         } else {
            html += '<span class="asenha-category-no-toggle"></span>';
         }
         
         // Add checkbox and label
         html += '<label>';
         html += '<input type="checkbox" class="asenha-category-checkbox" value="' + category.term_id + '" data-slug="' + category.slug + '">';
         html += ' ' + category.name;
         if (category.count > 0) {
            html += ' <span class="asenha-category-count">(' + category.count + ')</span>';
         }
         html += '</label>';
         
         html += '</div>'; // Close header div
         
         // Add children if any
         if (hasChildren) {
            html += '<ul class="asenha-category-children" style="display:none;">';
            allCategories.forEach(function(child) {
               if (child.parent_id === category.term_id) {
                  html += renderCategory(child, allCategories);
               }
            });
            html += '</ul>';
         }
         
         html += '</li>';
         return html;
      }
      
      // Function to update selected categories hidden input
      function updateSelectedCategories() {
         var selectedIds = [];
         $('.asenha-category-checkbox:checked').each(function() {
            selectedIds.push($(this).val());
         });
         $('#asenha_selected_category_ids').val(selectedIds.join(','));
      }
      
      // Function to render snippets list
      function renderSnippetsList(snippets) {
         var $exportContent = $('#asenha-snippets-export-content');
         
         if (!snippets || snippets.length === 0) {
            $exportContent.html('<p>' + adminPageVars.snippetsExportNoSnippetsInfo + '</p>');
            return;
         }
         
         // Group snippets by type
         var snippetsByType = {
            'css': [],
            'js': [],
            'html': [],
            'php': []
         };
         
         snippets.forEach(function(snippet) {
            var type = snippet.type || 'php';
            if (snippetsByType.hasOwnProperty(type)) {
               snippetsByType[type].push(snippet);
            } else {
               snippetsByType['php'].push(snippet);
            }
         });
         
         // Sort alphabetically within each category (case-insensitive)
         Object.keys(snippetsByType).forEach(function(type) {
            snippetsByType[type].sort(function(a, b) {
               return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
            });
         });
         
         // Define category labels
         var categoryLabels = {
            'css': adminPageVars.snippetTypeCssLabel,
            'js': adminPageVars.snippetTypeJsLabel,
            'html': adminPageVars.snippetTypeHtmlLabel,
            'php': adminPageVars.snippetTypePhpLabel
         };
         
         var html = '<div class="asenha-snippets-list">';
         html += '<p><strong>' + adminPageVars.snippetsExportSelectSnippetsLabel + '</strong></p>';
         
         // Render snippets by category in order: css, js, html, php
         var categoryOrder = ['css', 'js', 'html', 'php'];
         
         categoryOrder.forEach(function(type) {
            if (snippetsByType[type].length > 0) {
               html += '<div class="asenha-snippets-category">';
               html += '<h4 class="asenha-snippets-category-heading">' + categoryLabels[type] + '</h4>';
               html += '<ul class="asenha-snippet-items">';
               
               snippetsByType[type].forEach(function(snippet) {
                  var editUrl = '/wp-admin/post.php?post=' + snippet.id + '&action=edit';
                  var statusClass = snippet.is_active ? 'active' : 'inactive';
                  
                  html += '<li class="asenha-snippet-item ' + statusClass + '">';
                  html += '<label>';
                  html += '<input type="checkbox" class="asenha-snippet-checkbox" value="' + snippet.id + '">';
                  html += ' ' + snippet.title + ' <span class="asenha-snippet-id">(ID: ' + snippet.id + ')</span>';
                  html += '</label>';
                  html += '<a href="' + editUrl + '" target="_blank" class="button button-small">' + adminPageVars.snippetsExportEditLabel + '</a>';
                  html += '</li>';
               });
               
               html += '</ul>';
               html += '</div>';
            }
         });
         
         html += '</div>';
         $exportContent.html(html);
         
         // Handle snippet checkbox changes
         $exportContent.on('change', '.asenha-snippet-checkbox', function() {
            updateSelectedSnippets();
         });
      }
      
      // Function to update selected snippets hidden input
      function updateSelectedSnippets() {
         var selectedIds = [];
         $('.asenha-snippet-checkbox:checked').each(function() {
            selectedIds.push($(this).val());
         });
         $('#asenha_selected_snippet_ids').val(selectedIds.join(','));
      }
      
      // Function to render snippet types checkboxes
      function renderSnippetTypesCheckboxes() {
         var $exportContent = $('#asenha-snippets-export-content');
         
         var html = '<div class="asenha-snippet-types-list">';
         html += '<p><strong>' + adminPageVars.snippetsExportSelectTypesLabel + '</strong></p>';
         html += '<ul class="asenha-snippet-type-items">';
         
         var types = [
            { value: 'css', label: adminPageVars.snippetTypeCssLabel },
            { value: 'js', label: adminPageVars.snippetTypeJsLabel },
            { value: 'html', label: adminPageVars.snippetTypeHtmlLabel },
            { value: 'php', label: adminPageVars.snippetTypePhpLabel }
         ];
         
         types.forEach(function(type) {
            html += '<li class="asenha-snippet-type-item">';
            html += '<label>';
            html += '<input type="checkbox" class="asenha-snippet-type-checkbox" value="' + type.value + '">';
            html += ' ' + type.label;
            html += '</label>';
            html += '</li>';
         });
         
         html += '</ul></div>';
         $exportContent.html(html);
         
         // Handle type checkbox changes
         $exportContent.on('change', '.asenha-snippet-type-checkbox', function() {
            updateSelectedTypes();
         });
      }
      
      // Function to update selected snippet types hidden input
      function updateSelectedTypes() {
         var selectedTypes = [];
         $('.asenha-snippet-type-checkbox:checked').each(function() {
            selectedTypes.push($(this).val());
         });
         $('#asenha_selected_snippet_types').val(selectedTypes.join(','));
      }
      
      // Validate export form before submission
      $('#asenha-export-code-snippets-form').on('submit', function(e) {
         var exportType = $('#asenha_snippets_export_type').val();
         
         if (exportType === 'by_categories') {
            var selectedCategories = $('#asenha_selected_category_ids').val();
            if (!selectedCategories) {
               e.preventDefault();
               alert(adminPageVars.snippetsExportNoCategoriesSelectedAlert);
               return false;
            }
         }
         
         if (exportType === 'by_types') {
            var selectedTypes = $('#asenha_selected_snippet_types').val();
            if (!selectedTypes) {
               e.preventDefault();
               alert(adminPageVars.snippetsExportNoTypesSelectedAlert);
               return false;
            }
         }
         
         if (exportType === 'manual') {
            var selectedSnippets = $('#asenha_selected_snippet_ids').val();
            if (!selectedSnippets) {
               e.preventDefault();
               alert(adminPageVars.snippetsExportNoSnippetsSelectedAlert);
               return false;
            }
         }
      });

      // Form Builder >> Export forms with filtering options
      $('#asenha_forms_export_type').on('change', function() {
         var exportType = $(this).val();
         var $exportOptions = $('#asenha-forms-export-options');
         var $exportContent = $('#asenha-forms-export-content');
         var $loading = $('#asenha-forms-export-loading');

         // Clear previous selections
         $('#asenha_selected_form_ids').val('');

         // Hide options section for "all" type
         if (exportType === 'all') {
            $exportOptions.slideUp(300);
            $exportContent.html('');
            return;
         }

         // Show options section for other types
         $exportOptions.slideDown(300);

         if (exportType === 'manual') {
            $loading.show();
            $exportContent.html('');

            $.ajax({
               url: ajaxurl,
               type: 'POST',
               data: {
                  action: 'get_forms_for_export',
                  nonce: $('#asenha_forms_export_ajax_nonce').val()
               },
               success: function(response) {
                  $loading.hide();

                  if (response.success) {
                     renderFormsList(response.data);
                  } else {
                     $exportContent.html('<p class="asenha-error">' + (response.data.message || 'Error loading data') + '</p>');
                  }
               },
               error: function(xhr, status, error) {
                  $loading.hide();
                  console.error('AJAX Error:', error);
                  $exportContent.html('<p class="asenha-error">Error loading data. Please try again.</p>');
               }
            });
         }
      });

      // Function to render forms list
      function renderFormsList(forms) {
         var $exportContent = $('#asenha-forms-export-content');

         if (!forms || forms.length === 0) {
            $exportContent.html('<p>' + adminPageVars.formsExportNoFormsInfo + '</p>');
            return;
         }

         forms.sort(function(a, b) {
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
         });

         var html = '<div class="asenha-forms-list">';
         html += '<p><strong>' + adminPageVars.formsExportSelectFormsLabel + '</strong></p>';
         html += '<ul class="asenha-form-items">';

         forms.forEach(function(form) {
            var editUrl = 'admin.php?page=formbuilder&formbuilder_action=edit&id=' + form.id;

            html += '<li class="asenha-form-item">';
            html += '<label>';
            html += '<input type="checkbox" class="asenha-form-checkbox" value="' + form.id + '">';
            html += ' ' + form.title + ' <span class="asenha-form-id">(ID: ' + form.id + ')</span>';
            html += '</label>';
            html += '<a href="' + editUrl + '" target="_blank" class="button button-small">' + adminPageVars.formsExportEditLabel + '</a>';
            html += '</li>';
         });

         html += '</ul></div>';
         $exportContent.html(html);

         // Handle form checkbox changes
         $exportContent.on('change', '.asenha-form-checkbox', function() {
            updateSelectedForms();
         });
      }

      // Function to update selected forms hidden input
      function updateSelectedForms() {
         var selectedIds = [];
         $('.asenha-form-checkbox:checked').each(function() {
            selectedIds.push($(this).val());
         });
         $('#asenha_selected_form_ids').val(selectedIds.join(','));
      }

      // Validate forms export form before submission
      $('#asenha-export-forms-form').on('submit', function(e) {
         var exportType = $('#asenha_forms_export_type').val();

         if (exportType === 'manual') {
            var selectedForms = $('#asenha_selected_form_ids').val();
            if (!selectedForms) {
               e.preventDefault();
               alert(adminPageVars.formsExportNoFormsSelectedAlert);
               return false;
            }
         }
      });

      // Form Builder >> Export style templates with filtering options
      $('#asenha_style_templates_export_type').on('change', function() {
         var exportType = $(this).val();
         var $exportOptions = $('#asenha-style-templates-export-options');
         var $exportContent = $('#asenha-style-templates-export-content');
         var $loading = $('#asenha-style-templates-export-loading');

         // Clear previous selections
         $('#asenha_selected_style_template_ids').val('');

         // Hide options section for "all" type
         if (exportType === 'all') {
            $exportOptions.slideUp(300);
            $exportContent.html('');
            return;
         }

         // Show options section for "manual" type
         $exportOptions.slideDown(300);

         if (exportType === 'manual') {
            $loading.show();
            $exportContent.html('');

            $.ajax({
               url: ajaxurl,
               type: 'POST',
               data: {
                  action: 'get_style_templates_for_export',
                  nonce: $('#asenha_style_templates_export_ajax_nonce').val()
               },
               success: function(response) {
                  $loading.hide();

                  if (response.success) {
                     renderStyleTemplatesList(response.data);
                  } else {
                     $exportContent.html('<p class="asenha-error">' + (response.data.message || 'Error loading data') + '</p>');
                  }
               },
               error: function(xhr, status, error) {
                  $loading.hide();
                  console.error('AJAX Error:', error);
                  $exportContent.html('<p class="asenha-error">Error loading data. Please try again.</p>');
               }
            });
         }
      });

      // Function to render style template list
      function renderStyleTemplatesList(styleTemplates) {
         var $exportContent = $('#asenha-style-templates-export-content');

         if (!styleTemplates || styleTemplates.length === 0) {
            $exportContent.html('<p>' + adminPageVars.styleTemplatesExportNoTemplatesInfo + '</p>');
            return;
         }

         styleTemplates.sort(function(a, b) {
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
         });

         var html = '<div class="asenha-style-templates-list">';
         html += '<p><strong>' + adminPageVars.styleTemplatesExportSelectTemplatesLabel + '</strong></p>';
         html += '<ul class="asenha-style-template-items">';

         styleTemplates.forEach(function(styleTemplate) {
            var editUrl = 'post.php?post=' + styleTemplate.id + '&action=edit';

            html += '<li class="asenha-style-template-item">';
            html += '<label>';
            html += '<input type="checkbox" class="asenha-style-template-checkbox" value="' + styleTemplate.id + '">';
            html += ' ' + styleTemplate.title + ' <span class="asenha-style-template-id">(ID: ' + styleTemplate.id + ')</span>';
            html += '</label>';
            html += '<a href="' + editUrl + '" target="_blank" class="button button-small">' + adminPageVars.styleTemplatesExportEditLabel + '</a>';
            html += '</li>';
         });

         html += '</ul></div>';
         $exportContent.html(html);

         // Handle style template checkbox changes
         $exportContent.on('change', '.asenha-style-template-checkbox', function() {
            updateSelectedStyleTemplates();
         });
      }

      // Function to update selected style templates hidden input
      function updateSelectedStyleTemplates() {
         var selectedIds = [];
         $('.asenha-style-template-checkbox:checked').each(function() {
            selectedIds.push($(this).val());
         });
         $('#asenha_selected_style_template_ids').val(selectedIds.join(','));
      }

      // Validate style templates export form before submission
      $('#asenha-export-style-templates-form').on('submit', function(e) {
         var exportType = $('#asenha_style_templates_export_type').val();

         if (exportType === 'manual') {
            var selectedStyleTemplates = $('#asenha_selected_style_template_ids').val();
            if (!selectedStyleTemplates) {
               e.preventDefault();
               alert(adminPageVars.styleTemplatesExportNoTemplatesSelectedAlert);
               return false;
            }
         }
      });

      // Form Builder >> Export entries with filtering options
      var entriesExportDateRangePicker = null;

      function updateSelectedEntryFields() {
         var selectedFieldIds = [];

         $('.asenha-entry-field-checkbox:checked').each(function() {
            selectedFieldIds.push($(this).val());
         });

         $('#asenha_selected_entry_field_ids').val(selectedFieldIds.join(','));
      }

      function updateSelectedEntryAdditionalInfo() {
         var selectedAdditionalInfo = [];

         $('.asenha-entry-additional-info-checkbox:checked').each(function() {
            selectedAdditionalInfo.push($(this).val());
         });

         $('#asenha_selected_entry_additional_info').val(selectedAdditionalInfo.join(','));
      }

      function renderEntryFieldList(fields) {
         var $fieldsContent = $('#asenha-entries-export-fields-content');

         if ( ! fields || fields.length === 0 ) {
            $fieldsContent.html('<p>' + adminPageVars.entriesExportNoFieldsInfo + '</p>');
            return;
         }

         fields.sort(function(a, b) {
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
         });

         var html = '<div class="asenha-entries-fields-list">';
         html += '<p class="asenha-entries-export-section-heading"><strong>' + adminPageVars.entriesExportSelectFieldsLabel + '</strong></p>';
         html += '<ul class="asenha-entry-field-items">';

         fields.forEach(function(field) {
            html += '<li class="asenha-entry-field-item">';
            html += '<label>';
            html += '<input type="checkbox" class="asenha-entry-field-checkbox" value="' + field.id + '" checked>';
            html += ' ' + field.title + ' <span class="asenha-entry-field-id">(ID: ' + field.id + ')</span>';
            html += '</label>';
            html += '</li>';
         });

         html += '</ul></div>';
         $fieldsContent.html(html);
         updateSelectedEntryFields();
      }

      function convertPhpDateFormatToFlatpickr(phpDateFormat) {
         var dateFormat = phpDateFormat || 'F j, Y';
         var tokenMap = {
            d: 'd',
            j: 'j',
            D: 'D',
            l: 'l',
            F: 'F',
            m: 'm',
            n: 'n',
            M: 'M',
            Y: 'Y',
            y: 'y'
         };
         var flatpickrDateFormat = '';
         var isEscaped = false;

         for ( var i = 0; i < dateFormat.length; i++ ) {
            var character = dateFormat.charAt(i);

            if ( isEscaped ) {
               flatpickrDateFormat += '\\' + character;
               isEscaped = false;
               continue;
            }

            if ( '\\' === character ) {
               isEscaped = true;
               continue;
            }

            if ( 'S' === character ) {
               continue;
            }

            flatpickrDateFormat += ( tokenMap[character] || character );
         }

         return flatpickrDateFormat || 'F j, Y';
      }

      function initializeEntriesExportDateRangePicker() {
         var $rangeInput = $('#asenha_entries_export_date_range_display');

         if ( ! $rangeInput.length ) {
            return;
         }

         if ( 'function' !== typeof flatpickr ) {
            $rangeInput.prop('readonly', false);
            return;
         }

         var flatpickrDateFormat = convertPhpDateFormatToFlatpickr(adminPageVars.entriesExportDateFormatPhp);

         entriesExportDateRangePicker = flatpickr($rangeInput[0], {
            mode: 'range',
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: flatpickrDateFormat,
            locale: {
               rangeSeparator: ' - '
            },
            onChange: function(selectedDates, dateStr, instance) {
               if ( selectedDates.length > 0 ) {
                  $('#asenha_entries_export_date_from').val(instance.formatDate(selectedDates[0], 'Y-m-d'));
               } else {
                  $('#asenha_entries_export_date_from').val('');
               }

               if ( selectedDates.length > 1 ) {
                  $('#asenha_entries_export_date_to').val(instance.formatDate(selectedDates[1], 'Y-m-d'));
               } else {
                  $('#asenha_entries_export_date_to').val('');
               }
            }
         });
      }

      function setEntriesExportDateBounds(dateFrom, dateTo) {
         var normalizedDateFrom = dateFrom || '';
         var normalizedDateTo = dateTo || '';

         if ( normalizedDateFrom && ! normalizedDateTo ) {
            normalizedDateTo = normalizedDateFrom;
         } else if ( ! normalizedDateFrom && normalizedDateTo ) {
            normalizedDateFrom = normalizedDateTo;
         }

         if ( entriesExportDateRangePicker ) {
            entriesExportDateRangePicker.clear();
         }

         if ( normalizedDateFrom && normalizedDateTo ) {
            if ( entriesExportDateRangePicker ) {
               entriesExportDateRangePicker.setDate([normalizedDateFrom, normalizedDateTo], true, 'Y-m-d');
            }
            $('#asenha_entries_export_date_from').val(normalizedDateFrom);
            $('#asenha_entries_export_date_to').val(normalizedDateTo);
         } else {
            $('#asenha_entries_export_date_from').val('');
            $('#asenha_entries_export_date_to').val('');
         }
      }

      $('#asenha_entries_export_form_id').on('change', function() {
         var formId = $(this).val();
         var $selectionPanel = $('#asenha-entries-export-selection-panel');
         var $fieldsLoading = $('#asenha-entries-export-fields-loading');
         var $fieldsContent = $('#asenha-entries-export-fields-content');

         $('#asenha_selected_entry_field_ids').val('');

         if ( ! formId ) {
            $selectionPanel.slideUp(300);
            $fieldsContent.html('');
            setEntriesExportDateBounds('', '');
            return;
         }

         $selectionPanel.slideDown(300);
         $fieldsLoading.show();
         $fieldsContent.html('');

         $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
               action: 'get_form_fields_for_entry_export',
               nonce: $('#asenha_entries_export_fields_ajax_nonce').val(),
               form_id: formId
            },
            success: function(response) {
               $fieldsLoading.hide();

               if ( response.success ) {
                  var responseData = response.data || {};
                  var fields = [];
                  var dateBounds = { from: '', to: '' };

                  if ( Array.isArray(responseData) ) {
                     fields = responseData;
                  } else {
                     fields = Array.isArray(responseData.fields) ? responseData.fields : [];
                     if ( responseData.date_bounds ) {
                        dateBounds.from = responseData.date_bounds.from || '';
                        dateBounds.to = responseData.date_bounds.to || '';
                     }
                  }

                  renderEntryFieldList(fields);
                  setEntriesExportDateBounds(dateBounds.from, dateBounds.to);
               } else {
                  $fieldsContent.html('<p class="asenha-error">' + ( response.data.message || 'Error loading data' ) + '</p>');
                  setEntriesExportDateBounds('', '');
               }
            },
            error: function() {
               $fieldsLoading.hide();
               $fieldsContent.html('<p class="asenha-error">Error loading data. Please try again.</p>');
               setEntriesExportDateBounds('', '');
            }
         });
      });

      $('#asenha-entries-export-fields-content').on('change', '.asenha-entry-field-checkbox', function() {
         updateSelectedEntryFields();
      });

      $('#asenha-entries-export-additional-info-options').on('change', '.asenha-entry-additional-info-checkbox', function() {
         updateSelectedEntryAdditionalInfo();
      });

      updateSelectedEntryAdditionalInfo();
      initializeEntriesExportDateRangePicker();

      $('#asenha-export-entries-form').on('submit', function(e) {
         var selectedFormId = $('#asenha_entries_export_form_id').val();
         var selectedFields = '';
         var dateFrom = $('#asenha_entries_export_date_from').val();
         var dateTo = $('#asenha_entries_export_date_to').val();

         updateSelectedEntryFields();
         updateSelectedEntryAdditionalInfo();
         selectedFields = $('#asenha_selected_entry_field_ids').val();

         if ( ! selectedFormId ) {
            e.preventDefault();
            alert(adminPageVars.entriesExportSelectFormAlert);
            return false;
         }

         if ( ! selectedFields ) {
            e.preventDefault();
            alert(adminPageVars.entriesExportNoFieldsSelectedAlert);
            return false;
         }

         if ( dateFrom && dateTo ) {
            if ( dateFrom > dateTo ) {
               e.preventDefault();
               alert(adminPageVars.entriesExportInvalidDateRangeAlert);
               return false;
            }
         }
      });
      /*! </fs_premium_only> */

      // Initialize data tables
      var table = $("#login-attempts-log").DataTable({
         pageLength: 10,
         order: [[2, 'desc']],
         columnDefs: [
            { targets: 3, orderable: false, searchable: false }
         ],
         language: {
            emptyTable: adminPageVars.dataTable.emptyTable,
            info: adminPageVars.dataTable.info,
            infoEmpty: adminPageVars.dataTable.infoEmpty,
            infoFiltered: adminPageVars.dataTable.infoFiltered,
            lengthMenu: adminPageVars.dataTable.lengthMenu,
            search: adminPageVars.dataTable.search,
            zeroRecords: adminPageVars.dataTable.zeroRecords,
            paginate: {
                first: adminPageVars.dataTable.paginate.first,
                last: adminPageVars.dataTable.paginate.last,
                next: adminPageVars.dataTable.paginate.next,
                previous: adminPageVars.dataTable.paginate.previous
            },
         }
      });

      // Toast notifications
      function asenhaShowToast(type, message, duration) {
         if ( ! message ) {
            return;
         }

         // Create toast container if it doesn't exist.
         var $container = $('#asenha-toast-container');
         if ( ! $container.length ) {
            $container = $('<div id="asenha-toast-container"></div>');
            $('body').append($container);
         }

         // Create toast element with icon.
         var iconMap = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
         };

         var toastType = type || 'info';
         var $toast = $('<div></div>').addClass('asenha-toast asenha-toast-' + toastType);
         var $icon = $('<span></span>').addClass('asenha-toast-icon').text(iconMap[toastType] || 'ℹ');
         var $message = $('<span></span>').addClass('asenha-toast-message').text(message);
         var $close = $('<button></button>')
            .addClass('asenha-toast-close')
            .attr('type', 'button')
            .attr('aria-label', 'Dismiss')
            .text('×');

         $toast.append($icon, $message, $close);
         $container.append($toast);

         // Trigger slide-in animation after a brief delay for CSS transition.
         setTimeout(function() {
            $toast.addClass('asenha-toast-visible');
         }, 10);

         // Auto dismiss after specified duration (default 5 seconds).
         var dismissDuration = duration || 5000;
         var dismissTimeout = setTimeout(function() {
            dismissToast($toast);
         }, dismissDuration);

         // Manual dismiss on close button click.
         $close.on('click', function() {
            clearTimeout(dismissTimeout);
            dismissToast($toast);
         });

         function dismissToast($el) {
            $el.removeClass('asenha-toast-visible');
            setTimeout(function() {
               $el.remove();
            }, 300);
         }
      }

      // Release lock for an IP address (Limit Login Attempts)
      $('body').on('click', '.asenha-release-login-lock', function(e) {
         e.preventDefault();

         var $btn = $(this);
         var ipAddress = $btn.data('ip-address');

         if ( ! ipAddress ) {
            return false;
         }

         $btn.addClass('disabled').attr('aria-disabled', 'true');

         $.ajax({
            url: ajaxurl,
            method: 'POST',
            dataType: 'json',
            data: {
               'action': 'asenha_release_login_lock',
               'nonce': adminPageVars.nonce,
               'ip_address': ipAddress
            },
            success: function(response) {
               if ( response && response.success ) {
                  table.row( $btn.closest('tr') ).remove().draw(false);

                  var successTemplate = ( adminPageVars.limitLoginAttempts && adminPageVars.limitLoginAttempts.releaseLockSuccess )
                     ? adminPageVars.limitLoginAttempts.releaseLockSuccess
                     : '';
                  if ( successTemplate ) {
                     var successMessage = successTemplate.replace('%s', ipAddress);
                     asenhaShowToast('success', successMessage, 5000);
                  }
               } else {
                  $btn.removeClass('disabled').removeAttr('aria-disabled');
                  if ( adminPageVars.limitLoginAttempts && adminPageVars.limitLoginAttempts.releaseLockError ) {
                     asenhaShowToast('error', adminPageVars.limitLoginAttempts.releaseLockError, 5000);
                  }                  
               }
            },
            error: function() {
               $btn.removeClass('disabled').removeAttr('aria-disabled');
               if ( adminPageVars.limitLoginAttempts && adminPageVars.limitLoginAttempts.releaseLockError ) {
                  asenhaShowToast('error', adminPageVars.limitLoginAttempts.releaseLockError, 5000);
               }
            }
         });

         return false;
      });

      /*! <fs_premium_only> */
      // Whitelist an IP address (Limit Login Attempts)
      $('body').on('click', '.asenha-whitelist-login-ip', function(e) {
         e.preventDefault();

         var $btn = $(this);
         var ipAddress = $btn.data('ip-address');

         if ( ! ipAddress ) {
            return false;
         }

         var $textarea = $('textarea[name="admin_site_enhancements[limit_login_attempts_ip_whitelist]"]');
         if ( ! $textarea.length ) {
            return false;
         }

         var currentValue = $textarea.val() || '';
         var ips = currentValue.split(/\r?\n/).map(function(line) {
            return $.trim(line);
         }).filter(function(line) {
            return line.length > 0;
         });

         var alreadyAdded = ( ips.indexOf(ipAddress) !== -1 );
         if ( ! alreadyAdded ) {
            ips.push(ipAddress);
            $textarea.val( ips.join("\n") );
         }

         var message = ( adminPageVars.limitLoginAttempts && adminPageVars.limitLoginAttempts.whitelistAdded )
            ? adminPageVars.limitLoginAttempts.whitelistAdded
            : '';

         if ( alreadyAdded && adminPageVars.limitLoginAttempts && adminPageVars.limitLoginAttempts.whitelistAlreadyAdded ) {
            message = adminPageVars.limitLoginAttempts.whitelistAlreadyAdded;
         }

         if ( ! message ) {
            return false;
         }

         // Update the actions cell UI immediately:
         // - Remove Release Lock (should not exist for whitelisted IPs)
         // - Replace the Whitelist button with a checkmark + Whitelisted label
         var $actionsCell = $btn.closest('td');
         if ( $actionsCell.length ) {
            $actionsCell.find('.asenha-release-login-lock').remove();

            var whitelistedLabel = ( adminPageVars.limitLoginAttempts && adminPageVars.limitLoginAttempts.whitelistedLabel )
               ? adminPageVars.limitLoginAttempts.whitelistedLabel
               : '';

            if ( whitelistedLabel ) {
               var $indicator = $('<span></span>')
                  .addClass('asenha-whitelisted-indicator')
                  .append($('<span></span>').addClass('asenha-whitelisted-check').text('✓'))
                  .append(' ')
                  .append($('<span></span>').addClass('asenha-whitelisted-text').text(whitelistedLabel));

               $btn.replaceWith($indicator);
            }
         }

         asenhaShowToast('success', message, 5000);

         return false;
      });
      /*! </fs_premium_only> */

      // Place fields into the "Content Management" tab
      /*! <fs_premium_only> */
      $('.custom-content-types').appendTo('.fields-content-management > table > tbody');
      $('.custom-field-groups').appendTo('.fields-content-management .custom-content-types .asenha-subfields');
      $('.custom-content-types-description').appendTo('.fields-content-management .custom-content-types .asenha-subfields');
      $('.cct-google-maps-api-key').appendTo('.fields-content-management .custom-content-types .asenha-subfields');
      $('.post-type-switcher').appendTo('.fields-content-management > table > tbody');
      /*! </fs_premium_only> */
      $('.enable-duplication').appendTo('.fields-content-management > table > tbody');
      $('.duplication-redirect-destination').appendTo('.fields-content-management .enable-duplication .asenha-subfields');
      /*! <fs_premium_only> */
      $('.enable-duplication-link-at').appendTo('.fields-content-management .enable-duplication .asenha-subfields');
      $('.enable-duplication-on-post-types-type').appendTo('.fields-content-management .enable-duplication .asenha-subfields');
      $('.heading-for-public-cpt-duplication').appendTo('.fields-content-management .enable-duplication .asenha-subfields');
      $('.enable-duplication-on-public-post-types').appendTo('.fields-content-management .enable-duplication .asenha-subfields');
      $('.heading-for-nonpublic-cpt-duplication').appendTo('.fields-content-management .enable-duplication .asenha-subfields');
      $('.enable-duplication-on-nonpublic-post-types').appendTo('.fields-content-management .enable-duplication .asenha-subfields');
      $('.heading-for-enable-duplication-for').appendTo('.fields-content-management .enable-duplication .asenha-subfields');
      $('.enable-duplication-for').appendTo('.fields-content-management .enable-duplication .asenha-subfields');
      /*! </fs_premium_only> */
      $('.content-order').appendTo('.fields-content-management > table > tbody');
      // $('.content-order-subfields-heading').appendTo('.fields-content-management .content-order .asenha-subfields');
      $('.content-order-for').appendTo('.fields-content-management .content-order .asenha-subfields');
      /*! <fs_premium_only> */
      $('.content-order-for-non-hierarchical-description').appendTo('.fields-content-management .content-order .asenha-subfields');
      $('.content-order-for-other-post-types').appendTo('.fields-content-management .content-order .asenha-subfields');
      $('.content-order-frontend').appendTo('.fields-content-management .content-order .asenha-subfields');
      $('.content-order-wpml-independent').appendTo('.fields-content-management .content-order .asenha-subfields');
      /*! </fs_premium_only> */
      /*! <fs_premium_only> */
      $('.terms-order').appendTo('.fields-content-management > table > tbody');
      $('.terms-order-for').appendTo('.fields-content-management .terms-order .asenha-subfields');
      $('.terms-order-frontend').appendTo('.fields-content-management .terms-order .asenha-subfields');
      $('.terms-order-wpml-independent').appendTo('.fields-content-management .terms-order .asenha-subfields');
      /*! </fs_premium_only> */
      $('.media-files-visibility-control').appendTo('.fields-content-management > table > tbody');
      /*! <fs_premium_only> */
      $('.media-files-visibility-control-for-roles').appendTo('.fields-content-management .media-files-visibility-control .asenha-subfields');
      $('.media-files-visibility-control-notes').appendTo('.fields-content-management .media-files-visibility-control .asenha-subfields');
      $('.enable-media-categories').appendTo('.fields-content-management > table > tbody');
      $('.media-categories-side-panel').appendTo('.fields-content-management .enable-media-categories .asenha-subfields');
      $('.media-categories-disabled-for-roles').appendTo('.fields-content-management .enable-media-categories .asenha-subfields');
      $('.media-categories-disabled-for-roles-notes').appendTo('.fields-content-management .enable-media-categories .asenha-subfields');
      /*! </fs_premium_only> */
      $('.enable-media-replacement').appendTo('.fields-content-management > table > tbody');
      $('.disable-media-replacement-cache-busting').appendTo('.fields-content-management .enable-media-replacement .asenha-subfields');
      $('.enable-svg-upload').appendTo('.fields-content-management > table > tbody');
      $('.enable-svg-upload-for').appendTo('.fields-content-management .enable-svg-upload .asenha-subfields');
      $('.enable-avif-upload').appendTo('.fields-content-management > table > tbody');
      $('.avif-support-status').appendTo('.fields-content-management .enable-avif-upload .asenha-subfields');
      /*! <fs_premium_only> */
      $('.public-preview-for-drafts').appendTo('.fields-content-management > table > tbody');
      $('.public-preview-max-days').appendTo('.fields-content-management .public-preview-for-drafts .asenha-subfields');
      $('.public-drafts-preview-for').appendTo('.fields-content-management .public-preview-for-drafts .asenha-subfields');
      $('.public-preview-include-scheduled').appendTo('.fields-content-management .public-preview-for-drafts .asenha-subfields');
      /*! </fs_premium_only> */
      $('.enable-external-permalinks').appendTo('.fields-content-management > table > tbody');
      /*! <fs_premium_only> */
      $('.enable-external-permalinks-type').appendTo('.fields-content-management .enable-external-permalinks .asenha-subfields');
      /*! </fs_premium_only> */
      $('.enable-external-permalinks-for').appendTo('.fields-content-management .enable-external-permalinks .asenha-subfields');
      /*! <fs_premium_only> */
      $('.enable-external-permalinks-exclude-nofollow-domains').appendTo('.fields-content-management .enable-external-permalinks .asenha-subfields');
      /*! </fs_premium_only> */
      $('.external-links-new-tab').appendTo('.fields-content-management > table > tbody');
      /*! <fs_premium_only> */
      $('.external-links-new-tab-exclude-domains').appendTo('.fields-content-management .external-links-new-tab .asenha-subfields');
      $('.external-links-new-tab-exclude-nofollow-domains').appendTo('.fields-content-management .external-links-new-tab .asenha-subfields');
      /*! </fs_premium_only> */
      $('.custom-nav-menu-items-new-tab').appendTo('.fields-content-management > table > tbody');
      $('.enable-missed-schedule-posts-auto-publish').appendTo('.fields-content-management > table > tbody');

      // Place fields into "Admin Interface" tab
      $('.hide-modify-elements').appendTo('.fields-admin-interface > table > tbody');
      $('.hide-ab-wp-logo-menu').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      $('.hide-ab-site-menu').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      $('.hide-ab-customize-menu').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      $('.hide-ab-updates-menu').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      $('.hide-ab-comments-menu').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      $('.hide-ab-new-content-menu').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      $('.hide-ab-howdy').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      $('.hide-help-drawer').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      /*! <fs_premium_only> */
      $('.plugins-extra-admin-bar-items').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      $('.disabled-plugins-admin-bar-items').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      $('.rescan-plugins-admin-bar-items').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      $('.plugins-extra-admin-bar-items-description').appendTo('.fields-admin-interface .hide-modify-elements .asenha-subfields');
      /*! </fs_premium_only> */
      /*! <fs_premium_only> */
      $('.admin-bar-custom-elements').appendTo('.fields-admin-interface > table > tbody');
      /*! </fs_premium_only> */
      $('.hide-admin-notices').appendTo('.fields-admin-interface > table > tbody');
      /*! <fs_premium_only> */
      $('.hide-admin-notices-for-nonadmins').appendTo('.fields-admin-interface .hide-admin-notices .asenha-subfields');
      $('.hide-admin-notices-menu-for-nonadmins').appendTo('.fields-admin-interface .hide-admin-notices .asenha-subfields');
      /*! </fs_premium_only> */
      $('.disable-dashboard-widgets').appendTo('.fields-admin-interface > table > tbody');
      $('.disable-welcome-panel-in-dashboard').appendTo('.fields-admin-interface .disable-dashboard-widgets .asenha-subfields');
      $('.disabled-dashboard-widgets').appendTo('.fields-admin-interface .disable-dashboard-widgets .asenha-subfields');
      $('.hide-admin-bar').appendTo('.fields-admin-interface > table > tbody');
      /*! <fs_premium_only> */
      $('.heading-for-hide-admin-bar-on-frontend').appendTo('.fields-admin-interface .hide-admin-bar .asenha-subfields');
      /*! </fs_premium_only> */
      $('.hide-admin-bar-for').appendTo('.fields-admin-interface .hide-admin-bar .asenha-subfields');
      $('.hide-admin-bar-always-show-for-admins').appendTo('.fields-admin-interface .hide-admin-bar .asenha-subfields');
      /*! <fs_premium_only> */
      $('.hide-admin-bar-auto-collapse-toggle').appendTo('.fields-admin-interface .hide-admin-bar .asenha-subfields');
      $('.heading-for-hide-admin-bar-on-backend').appendTo('.fields-admin-interface .hide-admin-bar .asenha-subfields');
      $('.hide-admin-bar-on-backend-for').appendTo('.fields-admin-interface .hide-admin-bar .asenha-subfields');
      $('.hide-admin-bar-always-show-for-admins-on-backend').appendTo('.fields-admin-interface .hide-admin-bar .asenha-subfields');
      /*! </fs_premium_only> */
      $('.hide-admin-bar-description').appendTo('.fields-admin-interface .hide-admin-bar .asenha-subfields');
      /*! <fs_premium_only> */
      $('.admin-logo').appendTo('.fields-admin-interface > table > tbody');
      $('.admin-logo-location').appendTo('.fields-admin-interface .admin-logo .asenha-subfields');
      $('.admin-logo-image').appendTo('.fields-admin-interface .admin-logo .asenha-subfields');
      media_frame_init( '#admin-logo-image', '#admin-logo-image-button' );
      $('.admin-logo-replace-admin-bar-home-icon').appendTo('.fields-admin-interface .admin-logo .asenha-subfields');
      $('.admin-logo-link-heading').appendTo('.fields-admin-interface .admin-logo .asenha-subfields');
      $('.admin-logo-link-frontend').appendTo('.fields-admin-interface .admin-logo .asenha-subfields');
      /*! </fs_premium_only> */
      $('.wider-admin-menu').appendTo('.fields-admin-interface > table > tbody');
      $('.admin-menu-width').appendTo('.fields-admin-interface .wider-admin-menu .asenha-subfields');
      $('.customize-admin-menu').appendTo('.fields-admin-interface > table > tbody');
      $('.admin-menu-organizer-sticky-collapse-menu').appendTo('.fields-admin-interface .customize-admin-menu .asenha-subfields');
      $('.navigation-menu-duplicator').appendTo('.fields-admin-interface > table > tbody');
      /*! <fs_premium_only> */
      $('.admin-columns-manager').appendTo('.fields-admin-interface > table > tbody');
      /*! </fs_premium_only> */
      $('.show-custom-taxonomy-filters').appendTo('.fields-admin-interface > table > tbody');
      /*! <fs_premium_only> */
      $('.show-custom-taxonomy-filters-non-hierarchical').appendTo('.fields-admin-interface .show-custom-taxonomy-filters .asenha-subfields');
      /*! </fs_premium_only> */
      $('.enhance-list-tables').appendTo('.fields-admin-interface > table > tbody');
      $('.show-featured-image-column').appendTo('.fields-admin-interface .enhance-list-tables .asenha-subfields');
      $('.show-excerpt-column').appendTo('.fields-admin-interface .enhance-list-tables .asenha-subfields');
      $('.show-last-modified-column').appendTo('.fields-admin-interface .enhance-list-tables .asenha-subfields');
      $('.show-id-column').appendTo('.fields-admin-interface .enhance-list-tables .asenha-subfields');
      $('.show-file-size-column').appendTo('.fields-admin-interface .enhance-list-tables .asenha-subfields');
      $('.show-id-in-action_row').appendTo('.fields-admin-interface .enhance-list-tables .asenha-subfields');
      $('.hide-date-column').appendTo('.fields-admin-interface .enhance-list-tables .asenha-subfields');
      $('.hide-comments-column').appendTo('.fields-admin-interface .enhance-list-tables .asenha-subfields');
      $('.hide-post-tags-column').appendTo('.fields-admin-interface .enhance-list-tables .asenha-subfields');
      $('.various-admin-ui-enhancements').appendTo('.fields-admin-interface > table > tbody');
      $('.media-library-infinite-scrolling').appendTo('.fields-admin-interface .various-admin-ui-enhancements .asenha-subfields');
      $('.display-active-plugins-first').appendTo('.fields-admin-interface .various-admin-ui-enhancements .asenha-subfields');
      /*! <fs_premium_only> */
      $('.preserve-taxonomy-hierarchy').appendTo('.fields-admin-interface .various-admin-ui-enhancements .asenha-subfields');
      $('.enable-dashboard-columns-settings').appendTo('.fields-admin-interface .various-admin-ui-enhancements .asenha-subfields');
      $('.add-user-roles-to-admin-body-classes').appendTo('.fields-admin-interface .various-admin-ui-enhancements .asenha-subfields');
      $('.add-username-to-admin-body-classes').appendTo('.fields-admin-interface .various-admin-ui-enhancements .asenha-subfields');
      $('.open-admin-links-in-new-tab').appendTo('.fields-admin-interface .various-admin-ui-enhancements .asenha-subfields');
      /*! </fs_premium_only> */
      $('.custom-admin-footer-text').appendTo('.fields-admin-interface > table > tbody');
      $('.custom-admin-footer-left').appendTo('.fields-admin-interface .custom-admin-footer-text .asenha-subfields');
      reinitWpEditor('admin_site_enhancements--custom_admin_footer_left');
      $('.custom-admin-footer-right').appendTo('.fields-admin-interface .custom-admin-footer-text .asenha-subfields');
      reinitWpEditor('admin_site_enhancements--custom_admin_footer_right');

      // Place fields into "Log In | Log Out" tab
      $('.change-login-url').appendTo('.fields-login-logout > table > tbody');
      $('.custom-login-slug').appendTo('.fields-login-logout .change-login-url .asenha-subfields');
      $('.custom-login-whitelist').appendTo('.fields-login-logout .change-login-url .asenha-subfields');
      $('.default-login-redirect-slug').appendTo('.fields-login-logout .change-login-url .asenha-subfields');
      $('.change-login-url-description').appendTo('.fields-login-logout .change-login-url .asenha-subfields');
      $('.login-id-type-restriction').appendTo('.fields-login-logout > table > tbody');
      $('.login-id-type').appendTo('.fields-login-logout .login-id-type-restriction .asenha-subfields');
      /*! <fs_premium_only> */
      $('.login-page-customizer').appendTo('.fields-login-logout > table > tbody');
      $('.login-page-form-position').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-form-color-scheme').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-form-color-scheme-custom').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-form-section-color-bg').appendTo('.login-page-form-color-scheme-custom');
      $('#login-page-form-section-color-bg.color-picker').wpColorPicker();
      $('.login-page-form-section-color-transparency').appendTo('.login-page-form-color-scheme-custom');
      $('.login-page-logo-image-type').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-logo-image').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      media_frame_init( '#login-page-logo-image', '#login-page-logo-image-button' );
      $('.login-page-logo-image-external').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-logo-image-external-description').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-logo-image-attachment-id').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-logo-image-width-original').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-logo-image-height-original').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-logo-image-size').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-logo-image-width').appendTo('.login-page-logo-image-size');
      $('.login-page-logo-image-height').appendTo('.login-page-logo-image-size');
      $('.login-page-logo-image-width-external').appendTo('.login-page-logo-image-size');
      $('.login-page-logo-image-height-external').appendTo('.login-page-logo-image-size');
      $('.login-page-logo-image-description').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-logo-site-icon-description').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-background').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-background-image').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-background-pattern').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      media_frame_init( '#login-page-background-image', '#login-page-background-image-button' );
      $('.login-page-background-color').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('#login-page-background-color.color-picker').wpColorPicker();
      $('.login-page-login-button-color').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('#login-page-login-button-color.color-picker').wpColorPicker();
      // $('.login-page-disable-registration').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-hide-elements').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-hide-remember-me').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-hide-registration-reset').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-hide-homepage-link').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-hide-language-switcher').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-external-css').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      $('.login-page-custom-css').appendTo('.fields-login-logout .login-page-customizer .asenha-subfields');
      /*! </fs_premium_only> */
      $('.site-identity-on-login').appendTo('.fields-login-logout > table > tbody');
      $('.enable-login-logout-menu').appendTo('.fields-login-logout > table > tbody');
      /*! <fs_premium_only> */
      $('.custom-login-menu-label').appendTo('.fields-login-logout .enable-login-logout-menu .asenha-subfields');
      $('.custom-logout-menu-label').appendTo('.fields-login-logout .enable-login-logout-menu .asenha-subfields');
      $('.custom-login-logout-label-description').appendTo('.fields-login-logout .enable-login-logout-menu .asenha-subfields');
      /*! </fs_premium_only> */
      $('.enable-last-login-column').appendTo('.fields-login-logout > table > tbody');
      $('.registration-date-column').appendTo('.fields-login-logout > table > tbody');
      $('.redirect-after-login').appendTo('.fields-login-logout > table > tbody');
      /*! <fs_premium_only> */
      $('.redirect-after-login-type').appendTo('.fields-login-logout .redirect-after-login .asenha-subfields');
      /*! </fs_premium_only> */
      $('.redirect-after-login-to-slug').appendTo('.fields-login-logout .redirect-after-login .asenha-subfields');
      $('.redirect-after-login-for').appendTo('.fields-login-logout .redirect-after-login .asenha-subfields');
      /*! <fs_premium_only> */
      $('.redirect-after-login-for-separate').appendTo('.fields-login-logout .redirect-after-login .asenha-subfields');
      /*! </fs_premium_only> */
      $('.redirect-after-logout').appendTo('.fields-login-logout > table > tbody');
      /*! <fs_premium_only> */
      $('.redirect-after-logout-type').appendTo('.fields-login-logout .redirect-after-logout .asenha-subfields');
      /*! </fs_premium_only> */
      $('.redirect-after-logout-to-slug').appendTo('.fields-login-logout .redirect-after-logout .asenha-subfields');
      $('.redirect-after-logout-for').appendTo('.fields-login-logout .redirect-after-logout .asenha-subfields');
      /*! <fs_premium_only> */
      $('.redirect-after-logout-for-separate').appendTo('.fields-login-logout .redirect-after-logout .asenha-subfields');
      /*! </fs_premium_only> */
      $('.disable-user-account').appendTo('.fields-login-logout > table > tbody');

      // Place fields into "Custom Code" tab
      /*! <fs_premium_only> */
      $('.enable-code-snippets-manager').appendTo('.fields-custom-code > table > tbody');
      $('.code-snippets-manager-description').appendTo('.fields-custom-code .enable-code-snippets-manager .asenha-subfields');
      $('.code-snippets-editor-theme').appendTo('.fields-custom-code .enable-code-snippets-manager .asenha-subfields');
      $('.code-snippets-disable-custom-role').appendTo('.fields-custom-code .enable-code-snippets-manager .asenha-subfields');
      $('.code-snippets-move-storage-to-wp-content').appendTo('.fields-custom-code .enable-code-snippets-manager .asenha-subfields');
      $('.code-snippets-notes').appendTo('.fields-custom-code .enable-code-snippets-manager .asenha-subfields');
      /*! </fs_premium_only> */
      $('.enable-custom-admin-css').appendTo('.fields-custom-code > table > tbody');
      $('.custom-admin-css').appendTo('.fields-custom-code .enable-custom-admin-css .asenha-subfields');
      $('.enable-custom-frontend-css').appendTo('.fields-custom-code > table > tbody');
      /*! <fs_premium_only> */
      $('.custom-frontend-css-priority').appendTo('.fields-custom-code .enable-custom-frontend-css .asenha-subfields');
      /*! </fs_premium_only> */
      $('.custom-frontend-css').appendTo('.fields-custom-code .enable-custom-frontend-css .asenha-subfields');
      $('.insert-head-body-footer-code').appendTo('.fields-custom-code > table > tbody');
      $('.disable-code-unslash').appendTo('.fields-custom-code .insert-head-body-footer-code .asenha-subfields');
      $('.head-code-priority').appendTo('.fields-custom-code .insert-head-body-footer-code .asenha-subfields');
      $('.head-code').appendTo('.fields-custom-code .insert-head-body-footer-code .asenha-subfields');
      $('.body-code-priority').appendTo('.fields-custom-code .insert-head-body-footer-code .asenha-subfields');
      $('.body-code').appendTo('.fields-custom-code .insert-head-body-footer-code .asenha-subfields');
      $('.footer-code-priority').appendTo('.fields-custom-code .insert-head-body-footer-code .asenha-subfields');
      $('.footer-code').appendTo('.fields-custom-code .insert-head-body-footer-code .asenha-subfields');
      $('.enable-custom-body-class').appendTo('.fields-custom-code > table > tbody');
      $('.enable-custom-body-class-for').appendTo('.fields-custom-code .enable-custom-body-class .asenha-subfields');
      $('.manage-ads-appads-txt').appendTo('.fields-custom-code > table > tbody');
      $('.ads-txt-content').appendTo('.fields-custom-code .manage-ads-appads-txt .asenha-subfields');
      $('.app-ads-txt-content').appendTo('.fields-custom-code .manage-ads-appads-txt .asenha-subfields');
      $('.manage-robots-txt').appendTo('.fields-custom-code > table > tbody');
      $('.robots-txt-content').appendTo('.fields-custom-code .manage-robots-txt .asenha-subfields');

      // Place fields into the "Disable Components" tab
      $('.disable-gutenberg').appendTo('.fields-disable-components > table > tbody');
      /*! <fs_premium_only> */
      $('.disable-gutenberg-type').appendTo('.fields-disable-components .disable-gutenberg .asenha-subfields');
      /*! </fs_premium_only> */
      $('.disable-gutenberg-for').appendTo('.fields-disable-components .disable-gutenberg .asenha-subfields');
      $('.disable-gutenberg-frontend-styles').appendTo('.fields-disable-components .disable-gutenberg .asenha-subfields');
      /*! <fs_premium_only> */
      $('.disable-gutenberg-always').appendTo('.fields-disable-components .disable-gutenberg .asenha-subfields');
      $('.disable-gutenberg-always-on').appendTo('.fields-disable-components .disable-gutenberg .asenha-subfields');
      $('.disable-gutenberg-always-frontend-styles').appendTo('.fields-disable-components .disable-gutenberg .asenha-subfields');
      $('.disable-gutenberg-always-enable').appendTo('.fields-disable-components .disable-gutenberg .asenha-subfields');
      $('.disable-gutenberg-always-enable-on').appendTo('.fields-disable-components .disable-gutenberg .asenha-subfields');
      /*! </fs_premium_only> */
      $('.disable-comments').appendTo('.fields-disable-components > table > tbody');
      /*! <fs_premium_only> */
      $('.disable-comments-type').appendTo('.fields-disable-components .disable-comments .asenha-subfields');
      /*! </fs_premium_only> */
      $('.disable-comments-for').appendTo('.fields-disable-components .disable-comments .asenha-subfields');
      $('.disable-comments-all-cpts-description').appendTo('.fields-disable-components .disable-comments .asenha-subfields');
      $('.disable-rest-api').appendTo('.fields-disable-components > table > tbody');
      /*! <fs_premium_only> */
      $('.disable-rest-api-excluded-routes').appendTo('.fields-disable-components .disable-rest-api .asenha-subfields');
      $('.heading-for-enable-rest-api-for').appendTo('.fields-disable-components .disable-rest-api .asenha-subfields');
      $('.enable-rest-api-for').appendTo('.fields-disable-components .disable-rest-api .asenha-subfields');
      /*! </fs_premium_only> */
      $('.disable-feeds').appendTo('.fields-disable-components > table > tbody');
      $('.disable-embeds').appendTo('.fields-disable-components > table > tbody');
      $('.disable-all-updates').appendTo('.fields-disable-components > table > tbody');
      $('.disable-author-archives').appendTo('.fields-disable-components > table > tbody');
      $('.disable-smaller-components').appendTo('.fields-disable-components > table > tbody');
      $('.disable-head-generator-tag').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-feed-generator-tag').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-resource-version-number').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-head-wlwmanifest-tag').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-head-rsd-tag').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-head-shortlink-tag').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-frontend-dashicons').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-emoji-support').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-jquery-migrate').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-block-widgets').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-lazy-load').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-application-passwords').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-site-admin-email-verification-screen').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-user-email-notification-after-password-change').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-admin-email-notification-after-password-change').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');
      $('.disable-plugin-theme-editor').appendTo('.fields-disable-components .disable-smaller-components .asenha-subfields');

      // Place fields into "Security" tab
      $('.limit-login-attempts').appendTo('.fields-security > table > tbody');
      $('.login-fails-allowed').appendTo('.fields-security .limit-login-attempts .asenha-subfields');
      $('.login-lockout-maxcount').appendTo('.fields-security .limit-login-attempts .asenha-subfields');
      /*! <fs_premium_only> */
      $('.limit-login-attempts-ip-whitelist').appendTo('.fields-security .limit-login-attempts .asenha-subfields');
      /*! </fs_premium_only> */
      $('.limit-login-attempts-header-override').appendTo('.fields-security .limit-login-attempts .asenha-subfields');
      $('.limit-login-attempts-header-override-description').appendTo('.fields-security .limit-login-attempts .asenha-subfields');
      $('.login-attempts-log-table').appendTo('.fields-security .limit-login-attempts .asenha-subfields');
      /*! <fs_premium_only> */
      $('.captcha-protection').appendTo('.fields-security > table > tbody');
      $('.captcha-wp-locations').appendTo('.fields-security .captcha-protection .asenha-subfields');
      $('.captcha-woo-locations').appendTo('.fields-security .captcha-protection .asenha-subfields');
      $('.captcha-protection-types').appendTo('.fields-security .captcha-protection .asenha-subfields');
      $('.captcha-protection-altcha-wrapper').appendTo('.fields-security .captcha-protection .asenha-subfields');
      $('.captcha-protection-recaptcha-wrapper').appendTo('.fields-security .captcha-protection .asenha-subfields');
      $('.captcha-protection-turnstile-wrapper').appendTo('.fields-security .captcha-protection .asenha-subfields');
      $('.altcha-widget').appendTo('.captcha-protection-altcha-wrapper');
      $('.altcha-secret-key').appendTo('.captcha-protection-altcha-wrapper');
      $('.altcha-complexity').appendTo('.captcha-protection-altcha-wrapper');
      $('.altcha-expiration').appendTo('.captcha-protection-altcha-wrapper');
      $('.altcha-auto-verification').appendTo('.captcha-protection-altcha-wrapper');
      $('.altcha-enable-delay').appendTo('.captcha-protection-altcha-wrapper');
      $('.altcha-hide-logo').appendTo('.captcha-protection-altcha-wrapper');
      $('.altcha-hide-byline').appendTo('.captcha-protection-altcha-wrapper');
      $('.altcha-advanced-wrapper').appendTo('.captcha-protection-altcha-wrapper');
      $('.altcha-advanced-toggler').appendTo('.captcha-protection-altcha-wrapper');
      $('.altcha-checkbox-label').appendTo('.altcha-advanced-wrapper');
      $('.altcha-verifying-text').appendTo('.altcha-advanced-wrapper');
      $('.altcha-verifying-wait-text').appendTo('.altcha-advanced-wrapper');
      $('.altcha-verified-text').appendTo('.altcha-advanced-wrapper');
      $('.altcha-verification-failed-text').appendTo('.altcha-advanced-wrapper');
      $('.recaptcha-widget').appendTo('.captcha-protection-recaptcha-wrapper');
      $('.recaptcha-site-key-v2-checkbox').appendTo('.captcha-protection-recaptcha-wrapper');
      $('.recaptcha-secret-key-v2-checkbox').appendTo('.captcha-protection-recaptcha-wrapper');
      $('.recaptcha-site-key-v3-invisible').appendTo('.captcha-protection-recaptcha-wrapper');
      $('.recaptcha-secret-key-v3-invisible').appendTo('.captcha-protection-recaptcha-wrapper');
      $('.recaptcha-setup-instruction').appendTo('.captcha-protection-recaptcha-wrapper');
      $('.turnstile-widget-theme').appendTo('.captcha-protection-turnstile-wrapper');
      $('.turnstile-site-key').appendTo('.captcha-protection-turnstile-wrapper');
      $('.turnstile-secret-key').appendTo('.captcha-protection-turnstile-wrapper');

      // Two-Factor Authentication (2FA)
      $('.two-factor-authentication').appendTo('.fields-security > table > tbody');
      $('.heading-for-two-factor-enforce-for').appendTo('.fields-security .two-factor-authentication .asenha-subfields');
      $('.two-factor-enforce-for').appendTo('.fields-security .two-factor-authentication .asenha-subfields');
      $('.two-factor-available-providers').appendTo('.fields-security .two-factor-authentication .asenha-subfields');
      $('.two-factor-email-auto-enable').appendTo('.fields-security .two-factor-authentication .asenha-subfields');
      $('.two-factor-email-token-ttl').appendTo('.fields-security .two-factor-authentication .asenha-subfields');
      $('.two-factor-enforce-grace-days').appendTo('.fields-security .two-factor-authentication .asenha-subfields');
      $('.two-factor-settings-mode').appendTo('.fields-security .two-factor-authentication .asenha-subfields');
      $('.two-factor-settings-mode-shared').appendTo('.fields-security .two-factor-authentication .asenha-subfields');
      $('.two-factor-settings-mode-per-role').appendTo('.fields-security .two-factor-authentication .asenha-subfields');
      $('.two-factor-restrict-api-login-to-app-passwords').appendTo('.fields-security .two-factor-authentication .asenha-subfields');
      /*! </fs_premium_only> */
      $('.obfuscate-author-slugs').appendTo('.fields-security > table > tbody');
      $('.obfuscate-email-address').appendTo('.fields-security > table > tbody');
      $('.obfuscate-email-address-description').appendTo('.fields-security .obfuscate-email-address .asenha-subfields');
      /*! <fs_premium_only> */
      $('.obfuscate-email-address-in-content').appendTo('.fields-security .obfuscate-email-address .asenha-subfields');
      $('.obfuscate-email-address-visitor-only').appendTo('.fields-security .obfuscate-email-address .asenha-subfields');
      /*! </fs_premium_only> */
      $('.obfuscate-email-address-builder-safe-mode').appendTo('.fields-security .obfuscate-email-address .asenha-subfields');
      $('.disable-xmlrpc').appendTo('.fields-security > table > tbody');

      // Place fields into "Optimizations" tab
      $('.image-upload-control').appendTo('.fields-optimizations > table > tbody');
      $('.image-max-width').appendTo('.fields-optimizations .image-upload-control .asenha-subfields');
      $('.image-max-height').appendTo('.fields-optimizations .image-upload-control .asenha-subfields');
      /*! <fs_premium_only> */
      $('.image-conversion-wrapper').appendTo('.fields-optimizations .image-upload-control .asenha-subfields');
      $('.convert-to-jpg-quality').appendTo('.image-conversion-wrapper');
      $('.convert-to-webp').appendTo('.image-conversion-wrapper');
      $('.convert-to-webp-quality').appendTo('.image-conversion-wrapper');

      // $('.keep-original-image').appendTo('.fields-optimizations .image-upload-control .asenha-subfields');
      /*! </fs_premium_only> */
      $('.image-upload-control-description').appendTo('.fields-optimizations .image-upload-control .asenha-subfields');
      /*! <fs_premium_only> */
      $('.image-upload-control-only-media-library-uploads').appendTo('.fields-optimizations .image-upload-control .asenha-subfields');
      $('.disable-image-conversion').appendTo('.fields-optimizations .image-upload-control .asenha-subfields');
      $('.heading-for-disabled-image-sizes').appendTo('.fields-optimizations .image-upload-control .asenha-subfields');
      $('.disabled-image-sizes').appendTo('.fields-optimizations .image-upload-control .asenha-subfields');
      /*! </fs_premium_only> */
      $('.enable-revisions-control').appendTo('.fields-optimizations > table > tbody');
      $('.revisions-max-number').appendTo('.fields-optimizations .enable-revisions-control .asenha-subfields');
      /*! <fs_premium_only> */
      $('.enable-revisions-control-type').appendTo('.fields-optimizations .enable-revisions-control .asenha-subfields');
      /*! </fs_premium_only> */
      $('.enable-revisions-control-for').appendTo('.fields-optimizations .enable-revisions-control .asenha-subfields');
      $('.enable-heartbeat-control').appendTo('.fields-optimizations > table > tbody');
      $('.heartbeat-control-for-admin-pages').appendTo('.fields-optimizations .enable-heartbeat-control .asenha-subfields');
      $('.heartbeat-interval-for-admin-pages').appendTo('.fields-optimizations .enable-heartbeat-control .asenha-subfields');
      $('.heartbeat-control-for-post-edit').appendTo('.fields-optimizations .enable-heartbeat-control .asenha-subfields');
      $('.heartbeat-interval-for-post-edit').appendTo('.fields-optimizations .enable-heartbeat-control .asenha-subfields');
      $('.heartbeat-control-for-frontend').appendTo('.fields-optimizations .enable-heartbeat-control .asenha-subfields');
      $('.heartbeat-interval-for-frontend').appendTo('.fields-optimizations .enable-heartbeat-control .asenha-subfields');

      // Place fields into "Utilities" tab
      /*! <fs_premium_only> */
      $('.site-backup-migration').appendTo('.fields-utilities > table > tbody');
      $('.site-backup-migration-high-compatibility-mode').appendTo('.fields-utilities .site-backup-migration .asenha-subfields');
      $('.site-backup-migration-include-storage-content').appendTo('.fields-utilities .site-backup-migration .asenha-subfields');
      /*! </fs_premium_only> */
      $('.smtp-email-delivery').appendTo('.fields-utilities > table > tbody');
      $('.smtp-default-from-description').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-default-from-name').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-default-from-email').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-force-from').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      /*! <fs_premium_only> */
      $('.smtp-replyto-name').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-replyto-email').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-bcc-emails').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      /*! </fs_premium_only> */
      $('.smtp--description').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-host').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-port').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-security').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      /*! <fs_premium_only> */
      $('.smtp-authentication').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      /*! </fs_premium_only> */
      $('.smtp-username').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-password').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-bypass-ssl-verification').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-debug').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      /*! <fs_premium_only> */
      $('.smtp-email-log').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-email-log-entries-amount-to-keep').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      /*! </fs_premium_only> */
      $('.smtp-send-test-email-description').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-send-test-email-to').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      $('.smtp-send-test-email-result').appendTo('.fields-utilities .smtp-email-delivery .asenha-subfields');
      /*! <fs_premium_only> */
      $('.form-builder').appendTo('.fields-utilities > table > tbody');
      $('.form-builder-email-delivery-description').appendTo('.fields-utilities .form-builder .asenha-subfields');
      $('.form-builder-email-template').appendTo('.fields-utilities .form-builder .asenha-subfields');
      $('.form-builder-email-header-image').appendTo('.fields-utilities .form-builder .asenha-subfields');
      media_frame_init( '#form-builder-email-header-image', '#form-builder-email-header-image-button' );
      $('.form-builder-email-header-image-attachment-id').appendTo('.fields-utilities .form-builder .asenha-subfields');
      $('.form-builder-send-test-email-to').appendTo('.fields-utilities .form-builder .asenha-subfields');
      $('.form-builder-send-test-email-result').appendTo('.fields-utilities .form-builder .asenha-subfields');
      $('.form-builder-email-custom-css').appendTo('.fields-utilities .form-builder .asenha-subfields');
      $('.form-builder-captcha-description').appendTo('.fields-utilities .form-builder .asenha-subfields');
      $('.form-builder-captcha-info-wrapper').appendTo('.fields-utilities .form-builder .asenha-subfields');
      $('.form-builder-captcha-info-toggler').appendTo('.fields-utilities .form-builder .asenha-subfields');
      $('.form-builder-altcha-secret-key').appendTo('.form-builder-captcha-info-wrapper');
      $('.form-builder-recaptcha-site-key-v2-checkbox').appendTo('.form-builder-captcha-info-wrapper');
      $('.form-builder-recaptcha-secret-key-v2-checkbox').appendTo('.form-builder-captcha-info-wrapper');
      $('.form-builder-recaptcha-site-key-v3-invisible').appendTo('.form-builder-captcha-info-wrapper');
      $('.form-builder-recaptcha-secret-key-v3-invisible').appendTo('.form-builder-captcha-info-wrapper');
      $('.form-builder-turnstile-site-key').appendTo('.form-builder-captcha-info-wrapper');
      $('.form-builder-turnstile-secret-key').appendTo('.form-builder-captcha-info-wrapper');
      $('.file-manager').appendTo('.fields-utilities > table > tbody');
      $('.file-manager-folder-tree-left').appendTo('.fields-utilities .file-manager .asenha-subfields');
      $('.file-manager-top-level-menu').appendTo('.fields-utilities .file-manager .asenha-subfields');
      $('.file-manager-notes').appendTo('.fields-utilities .file-manager .asenha-subfields');
      $('.local-user-avatar').appendTo('.fields-utilities > table > tbody');
      /*! </fs_premium_only> */
      $('.multiple-user-roles').appendTo('.fields-utilities > table > tbody');
      $('.image-sizes-panel').appendTo('.fields-utilities > table > tbody');
      $('.view-admin-as-role').appendTo('.fields-utilities > table > tbody');
      $('.view-admin-as-role-description').appendTo('.fields-utilities .view-admin-as-role .asenha-subfields');
      $('.enable-password-protection').appendTo('.fields-utilities > table > tbody');
      $('.password-protection-password').appendTo('.fields-utilities .enable-password-protection .asenha-subfields');
      /*! <fs_premium_only> */
      $('.password-protection-ip-whitelist').appendTo('.fields-utilities .enable-password-protection .asenha-subfields');
      $('.password-protection-header-override').appendTo('.fields-utilities .enable-password-protection .asenha-subfields');
      $('.password-protection-header-override-description').appendTo('.fields-utilities .enable-password-protection .asenha-subfields');
      $('.password-protection-description-url-parameter').appendTo('.fields-utilities .enable-password-protection .asenha-subfields');
      $('.password-protection-description-design').appendTo('.fields-utilities .enable-password-protection .asenha-subfields');
      $('.password-protection-advanced-wrapper').appendTo('.fields-utilities .enable-password-protection .asenha-subfields');
      $('.password-protection-advanced-toggler').appendTo('.fields-utilities .enable-password-protection .asenha-subfields');
      $('.password-protection-password-field-label').appendTo('.password-protection-advanced-wrapper');
      $('.password-protection-button-label').appendTo('.password-protection-advanced-wrapper');
      /*! </fs_premium_only> */
      $('.password-protection-notes').appendTo('.fields-utilities .enable-password-protection .asenha-subfields');
      $('.maintenance-mode').appendTo('.fields-utilities > table > tbody');
      /*! <fs_premium_only> */
      $('.maintenance-page-type').appendTo('.fields-utilities .maintenance-mode .asenha-subfields');
      /*! </fs_premium_only> */
      $('.maintenance-page-type-custom').appendTo('.fields-utilities .maintenance-mode .asenha-subfields');
      /*! <fs_premium_only> */
      $('.maintenance-page-title').appendTo('.maintenance-page-type-custom');
      /*! </fs_premium_only> */
      $('.maintenance-page-heading').appendTo('.maintenance-page-type-custom');
      $('.maintenance-page-description').appendTo('.maintenance-page-type-custom');
      /*! <fs_premium_only> */
      reinitWpEditor('admin_site_enhancements--maintenance_page_heading');
      reinitWpEditor('admin_site_enhancements--maintenance_page_description');
      /*! </fs_premium_only> */
      $('.maintenance-page-background').appendTo('.maintenance-page-type-custom');
      /*! <fs_premium_only> */
      $('.maintenance-page-background-pattern').appendTo('.maintenance-page-type-custom');
      $('.maintenance-page-background-image').appendTo('.maintenance-page-type-custom');
      media_frame_init( '#maintenance-page-background-image', '#maintenance-page-background-image-button' );
      $('.maintenance-page-background-color').appendTo('.maintenance-page-type-custom');
      $('#maintenance-page-background-color.color-picker').wpColorPicker();
      $('.maintenance-page-head-code').appendTo('.maintenance-page-type-custom');
      $('.maintenance-page-custom-css').appendTo('.maintenance-page-type-custom');
      $('.maintenance-page-slug').appendTo('.fields-utilities .maintenance-mode .asenha-subfields');
      $('.maintenance-page-exclude-urls').appendTo('.fields-utilities .maintenance-mode .asenha-subfields');
      $('.heading-for-maintenance-mode-access-for').appendTo('.fields-utilities .maintenance-mode .asenha-subfields');
      $('.maintenance-mode-access-for').appendTo('.fields-utilities .maintenance-mode .asenha-subfields');
      /*! </fs_premium_only> */
      $('.maintenance-mode-description').appendTo('.fields-utilities .maintenance-mode .asenha-subfields');
      /*! <fs_premium_only> */
      $('.redirect-manager').appendTo('.fields-utilities > table > tbody');
      /*! </fs_premium_only> */
      $('.redirect-404-to-homepage').appendTo('.fields-utilities > table > tbody');
      /*! <fs_premium_only> */
      $('.redirect-404-to-slug').appendTo('.fields-utilities .redirect-404-to-homepage .asenha-subfields');
      /*! </fs_premium_only> */
      $('.display-system-summary').appendTo('.fields-utilities > table > tbody');
      $('.search-engine-visibility-status').appendTo('.fields-utilities > table > tbody');
      /*! <fs_premium_only> */
      $('.live-site-url').appendTo('.fields-utilities .search-engine-visibility-status .asenha-subfields');
      $('.live-site-url-description').appendTo('.fields-utilities .search-engine-visibility-status .asenha-subfields');
      /*! </fs_premium_only> */

      // Remove empty .form-table that originally holds the fields
      const formTableCount = $('.form-table').length;
      // $('.form-table')[formTableCount-1].remove();

      // Enable Custom Admin CSS => Initialize CodeMirror
      var adminCssTextarea = document.getElementById("admin_site_enhancements[custom_admin_css]");
      // if ( typeof CodeMirror != "undefined" ) {
      //    alert('CodeMirror is available');
      // }
      var adminCssEditor = CodeMirror.fromTextArea(adminCssTextarea, {
         mode: "css",
         lineNumbers: true,
         lineWrapping: true
      });

      adminCssEditor.setSize("100%",600);

      // Enable Custom Frontend CSS => Initialize CodeMirror
      var frontendCssTextarea = document.getElementById("admin_site_enhancements[custom_frontend_css]");
      var frontendCssEditor = CodeMirror.fromTextArea(frontendCssTextarea, {
         mode: "css",
         lineNumbers: true,
         lineWrapping: true
      });

      frontendCssEditor.setSize("100%",600);

      // Manage ads.txt and app-ads.txt=> Initialize CodeMirror
      var adsTxtTextarea = document.getElementById("admin_site_enhancements[ads_txt_content]");
      var adsTxtEditor = CodeMirror.fromTextArea(adsTxtTextarea, {
         mode: "markdown",
         lineNumbers: true,
         lineWrapping: true
      });

      adsTxtEditor.setSize("100%",300);

      var appAdsTxtTextarea = document.getElementById("admin_site_enhancements[app_ads_txt_content]");
      var appAdsTxtEditor = CodeMirror.fromTextArea(appAdsTxtTextarea, {
         mode: "markdown",
         lineNumbers: true,
         lineWrapping: true
      });

      appAdsTxtEditor.setSize("100%",300);

      // Manage robots.txt => Initialize CodeMirror
      var robotsTxtTextarea = document.getElementById("admin_site_enhancements[robots_txt_content]");
      var robotsTxtEditor = CodeMirror.fromTextArea(robotsTxtTextarea, {
         mode: "markdown",
         lineNumbers: true,
         lineWrapping: true
      });

      robotsTxtEditor.setSize("100%",400);

      // Insert <head>, <body> and <footer> code => Initialize CodeMirror
      var headCodeTextarea = document.getElementById("admin_site_enhancements[head_code]");
      var headCodeEditor = CodeMirror.fromTextArea(headCodeTextarea, {
         mode: "htmlmixed",
         lineNumbers: true,
         lineWrapping: true
      });
      headCodeEditor.setSize("100%",300);

      var bodyCodeTextarea = document.getElementById("admin_site_enhancements[body_code]");
      var bodyCodeEditor = CodeMirror.fromTextArea(bodyCodeTextarea, {
         mode: "htmlmixed",
         lineNumbers: true,
         lineWrapping: true
      });
      bodyCodeEditor.setSize("100%",300);

      var footerCodeTextarea = document.getElementById("admin_site_enhancements[footer_code]");
      var footerCodeEditor = CodeMirror.fromTextArea(footerCodeTextarea, {
         mode: "htmlmixed",
         lineNumbers: true,
         lineWrapping: true
      });
      footerCodeEditor.setSize("100%",300);

      /*! <fs_premium_only> */
      // Enable Login Page Custom CSS => Initialize CodeMirror
      var loginPageCssTextarea = document.getElementById("admin_site_enhancements[login_page_custom_css]");
      if ( loginPageCssTextarea ) {
         var loginPageCssEditor = CodeMirror.fromTextArea(loginPageCssTextarea, {
            mode: "css",
            lineNumbers: true,
            lineWrapping: true
         });
         loginPageCssEditor.setSize("100%",300);         
      }

      // Enable Form Builder Email Custom CSS => Initialize CodeMirror
      var formBuilderEmailCssTextarea = document.getElementById("admin_site_enhancements[form_builder_email_custom_css]");
      if ( formBuilderEmailCssTextarea ) {
         var formBuilderEmailCssEditor = CodeMirror.fromTextArea(formBuilderEmailCssTextarea, {
            mode: "css",
            lineNumbers: true,
            lineWrapping: true
         });
         formBuilderEmailCssEditor.setSize("100%",300);         
      }

      // Enable Maintenance Page Custom <head> code => Initialize CodeMirror
      var maintenancePageHeadCodeTextarea = document.getElementById("admin_site_enhancements[maintenance_page_head_code]");
      if ( maintenancePageHeadCodeTextarea ) {
         var maintenancePageHeadCodeEditor = CodeMirror.fromTextArea(maintenancePageHeadCodeTextarea, {
            mode: "htmlmixed",
            lineNumbers: true,
            lineWrapping: true
         });
         maintenancePageHeadCodeEditor.setSize("100%",150);         
      }

      // Enable Maintenance Page Custom CSS => Initialize CodeMirror
      var maintenanceModeCssTextarea = document.getElementById("admin_site_enhancements[maintenance_page_custom_css]");
      if ( maintenanceModeCssTextarea ) {
         var maintenanceModeCssEditor = CodeMirror.fromTextArea(maintenanceModeCssTextarea, {
            mode: "css",
            lineNumbers: true,
            lineWrapping: true
         });
         maintenanceModeCssEditor.setSize("100%",300);         
      }
      /*! </fs_premium_only> */

      function refreshCodeMirror() {
         /*! <fs_premium_only> */
         if ( loginPageCssTextarea ) {
            loginPageCssEditor.refresh(); // Maintenance page >> CodeMirror
         }
         /*! </fs_premium_only> */
         adminCssEditor.refresh(); // Custom Admin CSS >> CodeMirror
         frontendCssEditor.refresh(); // Custom Fronend CSS >> CodeMirror
         adsTxtEditor.refresh(); // Manage ads.txt >> CodeMirror
         appAdsTxtEditor.refresh(); // Manage app-ads.txt >> CodeMirror
         headCodeEditor.refresh(); // Insert <head>, <body> and <footer> code >> CodeMirror
         bodyCodeEditor.refresh(); // Insert <head>, <body> and <footer> code >> CodeMirror
         footerCodeEditor.refresh(); // Insert <head>, <body> and <footer> code >> CodeMirror
         robotsTxtEditor.refresh(); // Manage robots.txt >> CodeMirror
         /*! <fs_premium_only> */
         if ( formBuilderEmailCssTextarea ) {
            formBuilderEmailCssEditor.refresh(); // Form Builder Email >> CodeMirror
         }
         if ( maintenancePageHeadCodeTextarea ) {
            maintenancePageHeadCodeEditor.refresh(); // Maintenance page >> CodeMirror
         }
         if ( maintenanceModeCssTextarea ) {
            maintenanceModeCssEditor.refresh(); // Maintenance page >> CodeMirror
         }
         /*! </fs_premium_only> */         
      }

      // Show and hide corresponding fields on tab clicks

      function tabSwitcher( tabSlug ) {
         $('.asenha-fields.fields-'+tabSlug).addClass('section-visible');
         $('.asenha-fields.fields-'+tabSlug).removeClass('section-hidden');
         $('.asenha-fields:not(.fields-'+tabSlug+')').removeClass('section-visible');
         $('.asenha-fields:not(.fields-'+tabSlug+')').addClass('section-hidden');
         window.location.hash = tabSlug;
         Cookies.set('asenha_tab', tabSlug, { expires: 1 }); // expires in 1 day
      }

      $('#tab-content-management + label').click( function() {
         tabSwitcher('content-management');
      });

      $('#tab-admin-interface + label').click( function() {
         tabSwitcher('admin-interface');
      });

      $('#tab-login-logout + label').click( function() {
         tabSwitcher('login-logout');
         refreshCodeMirror();
      });

      $('#tab-custom-code + label').click( function() {
         tabSwitcher('custom-code');
         refreshCodeMirror();
      });

      $('#tab-disable-components + label').click( function() {
         tabSwitcher('disable-components');
      });

      $('#tab-security + label').click( function() {
         tabSwitcher('security');
      });

      $('#tab-optimizations + label').click( function() {
         tabSwitcher('optimizations');
      });

      $('#tab-utilities + label').click( function() {
         tabSwitcher('utilities');
         refreshCodeMirror();
      });

      // Open tab set in 'asenha_tab' cookie set on saving changes. Defaults to content-management tab when cookie is empty
      var asenhaTabHash = Cookies.get('asenha_tab');

      if (typeof asenhaTabHash === 'undefined') {
         $('#tab-content-management + label').trigger('click');
      } else {
         $('#tab-' + asenhaTabHash + ' + label').trigger('click');
      }
      
      // Show or hide subfields on document ready and on toggle click

      function subfieldsToggler( fieldId, fieldClass, sortableId, codeMirrorInstances ) {

         if (document.getElementById('admin_site_enhancements['+fieldId+']')) {

            // Show/hide subfields on document ready, depending on if module is enabled or not
            if ( document.getElementById('admin_site_enhancements['+fieldId+']').checked ) {

               $('.'+fieldClass+' .asenha-subfields').show();
               if (document.querySelector('.'+fieldClass+' .asenha-subfield-select-inner')) {
                  $('.'+fieldClass+' .asenha-subfield-select-inner').show();
               }
               $('.asenha-toggle.'+fieldClass+' td .asenha-field-with-options').addClass('is-enabled');
               if ( codeMirrorInstances ) {
                  Object.keys(codeMirrorInstances).forEach(function(key) {
                     if ( codeMirrorInstances[key] ) {
                        codeMirrorInstances[key].refresh();
                     }
                  });
               }

            } else {

               $('.'+fieldClass+' .asenha-subfields').hide();
               if (document.querySelector('.'+fieldClass+' .asenha-subfield-select-inner')) {
                  $('.'+fieldClass+' .asenha-subfield-select-inner').hide();
               }

            }

            // Show/hide subfields on toggle click
            document.getElementById('admin_site_enhancements['+fieldId+']').addEventListener('click', event => {
               if (event.target.checked) {

                  $('.'+fieldClass+' .asenha-subfields').fadeIn();
                  if (document.querySelector('.'+fieldClass+' .asenha-subfield-select-inner')) {
                     $('.'+fieldClass+' .asenha-subfield-select-inner').show();
                  }
                  $('.'+fieldClass+' .asenha-field-with-options').toggleClass('is-enabled');
                  if (document.getElementById(sortableId)) {
                     // Initialize sortable elements: https://api.jqueryui.com/sortable/
                     $('#' + sortableId ).sortable();                     
                  }
                  if ( codeMirrorInstances ) {
                     Object.keys(codeMirrorInstances).forEach(function(key) {
                        if ( codeMirrorInstances[key] ) {
                           codeMirrorInstances[key].refresh();                        
                        }
                     });
                  }

               } else {

                  $('.'+fieldClass+' .asenha-subfields').hide();
                  if (document.querySelector('.'+fieldClass+' .asenha-subfield-select-inner')) {
                     $('.'+fieldClass+' .asenha-subfield-select-inner').hide();
                  }
                  $('.'+fieldClass+' .asenha-field-with-options').toggleClass('is-enabled');

               }
            });
            
         }
         
      }
      
       // Re-init wp_editor for snippet description. Required because the wp_editor was moved in the DOM after document ready.
       // Ref: https://stackoverflow.com/a/21519323
       // Ref: https://core.trac.wordpress.org/ticket/19173
      function reinitWpEditor(id) {
         tinymce.execCommand('mceRemoveEditor', true, id);
         var init = tinymce.extend( {}, tinyMCEPreInit.mceInit[ id ] );
         try { tinymce.init( init ); } catch(e){}
         $('textarea[id="' + id + '"]').closest('form').find('input[type="submit"]').click(function(){
          if( getUserSetting( 'editor' ) == 'tmce' ){
              var id = mce.find( 'textarea' ).attr( 'id' );
              tinymce.execCommand( 'mceRemoveEditor', false, id );
              tinymce.execCommand( 'mceAddEditor', false, id );
          }
          return true;
         });
      }

      /*! <fs_premium_only> */
      subfieldsToggler( 'custom_content_types', 'custom-content-types' );
      /*! </fs_premium_only> */
      subfieldsToggler( 'enable_duplication', 'enable-duplication' );
      subfieldsToggler( 'content_order', 'content-order' );
      /*! <fs_premium_only> */
      subfieldsToggler( 'terms_order', 'terms-order' );
      /*! </fs_premium_only> */
      subfieldsToggler( 'media_files_visibility_control', 'media-files-visibility-control' );
      /*! <fs_premium_only> */
      subfieldsToggler( 'enable_media_categories', 'enable-media-categories' );
      /*! </fs_premium_only> */
      subfieldsToggler( 'enable_media_replacement', 'enable-media-replacement' );
      subfieldsToggler( 'enable_svg_upload', 'enable-svg-upload' );
      subfieldsToggler( 'enable_avif_upload', 'enable-avif-upload' );
      /*! <fs_premium_only> */
      subfieldsToggler( 'public_preview_for_drafts', 'public-preview-for-drafts' );
      /*! </fs_premium_only> */
      subfieldsToggler( 'enable_external_permalinks', 'enable-external-permalinks' );
      /*! <fs_premium_only> */
      subfieldsToggler( 'external_links_new_tab', 'external-links-new-tab' );
      subfieldsToggler( 'show_custom_taxonomy_filters', 'show-custom-taxonomy-filters' );
      /*! </fs_premium_only> */
      subfieldsToggler( 'enhance_list_tables', 'enhance-list-tables' );
      subfieldsToggler( 'custom_admin_footer_text', 'custom-admin-footer-text' );
      subfieldsToggler( 'wider_admin_menu', 'wider-admin-menu' );
      subfieldsToggler( 'customize_admin_menu', 'customize-admin-menu', 'custom-admin-menu' );
      subfieldsToggler( 'disable_dashboard_widgets', 'disable-dashboard-widgets' );
      subfieldsToggler( 'various_admin_ui_enhancements', 'various-admin-ui-enhancements' );
      /*! <fs_premium_only> */
      subfieldsToggler( 'admin_logo', 'admin-logo' );
      /*! </fs_premium_only> */
      // Clean Up Admin Bar
      subfieldsToggler( 'hide_modify_elements', 'hide-modify-elements' );
      /*! <fs_premium_only> */
      subfieldsToggler( 'hide_admin_notices', 'hide-admin-notices' );
      /*! </fs_premium_only> */
      subfieldsToggler( 'hide_admin_bar', 'hide-admin-bar' );
      subfieldsToggler( 'change_login_url', 'change-login-url' );
      subfieldsToggler( 'login_id_type_restriction', 'login-id-type-restriction' );
      /*! <fs_premium_only> */
      subfieldsToggler( 'login_page_customizer', 'login-page-customizer', '', {loginPageCssEditor} );
      subfieldsToggler( 'enable_login_logout_menu', 'enable-login-logout-menu' );
      /*! </fs_premium_only> */
      subfieldsToggler( 'redirect_after_login', 'redirect-after-login' );
      subfieldsToggler( 'redirect_after_logout', 'redirect-after-logout' );
      subfieldsToggler( 'enable_custom_admin_css', 'enable-custom-admin-css', '', {adminCssEditor} );
      subfieldsToggler( 'enable_custom_frontend_css', 'enable-custom-frontend-css', '', {frontendCssEditor} );
      subfieldsToggler( 'insert_head_body_footer_code', 'insert-head-body-footer-code', '', {headCodeEditor,bodyCodeEditor,footerCodeEditor} );
      subfieldsToggler( 'enable_custom_body_class', 'enable-custom-body-class' );
      subfieldsToggler( 'manage_ads_appads_txt', 'manage-ads-appads-txt', '', {adsTxtEditor,appAdsTxtEditor} );
      subfieldsToggler( 'manage_robots_txt', 'manage-robots-txt', '', {robotsTxtEditor} );
      /*! <fs_premium_only> */
      subfieldsToggler( 'enable_code_snippets_manager', 'enable-code-snippets-manager' );
      /*! </fs_premium_only> */
      subfieldsToggler( 'disable_gutenberg', 'disable-gutenberg' );
      subfieldsToggler( 'disable_comments', 'disable-comments' );
      /*! <fs_premium_only> */
      subfieldsToggler( 'disable_rest_api', 'disable-rest-api' );
      /*! </fs_premium_only> */
      subfieldsToggler( 'disable_smaller_components', 'disable-smaller-components' );
      subfieldsToggler( 'limit_login_attempts', 'limit-login-attempts' );
      /*! <fs_premium_only> */
      subfieldsToggler( 'captcha_protection', 'captcha-protection' );
      subfieldsToggler( 'two_factor_authentication', 'two-factor-authentication' );
      /*! </fs_premium_only> */
      subfieldsToggler( 'obfuscate_email_address', 'obfuscate-email-address' );
      subfieldsToggler( 'image_upload_control', 'image-upload-control' );
      subfieldsToggler( 'enable_revisions_control', 'enable-revisions-control' );
      subfieldsToggler( 'enable_heartbeat_control', 'enable-heartbeat-control' );
      /*! <fs_premium_only> */
      subfieldsToggler( 'form_builder', 'form-builder', '', {formBuilderEmailCssEditor} );
      subfieldsToggler( 'file_manager', 'file-manager' );
      subfieldsToggler( 'redirect_404_to_homepage', 'redirect-404-to-homepage' );
      subfieldsToggler( 'search_engine_visibility_status', 'search-engine-visibility-status' );
      /*! </fs_premium_only> */

      // Enable Heartbeat Control => Check if "Modify interval" is chosen/clicked and show/hide the corresponding select field
      if ( $('input[name="admin_site_enhancements[heartbeat_control_for_admin_pages]"]:checked').val() == 'modify' ) {
         $('.heartbeat-interval-for-admin-pages .asenha-subfield-select-inner').show();
      } else {
         $('.heartbeat-interval-for-admin-pages .asenha-subfield-select-inner').hide();
      }

      // Two-Factor Authentication (2FA) => Show "Email code validity" only when Email codes is enabled.
      function toggleTwoFactorEmailTokenTtlVisibility() {
         var twoFactorSettingsMode = $( 'input[name="admin_site_enhancements[two_factor_settings_mode]"]:checked' ).val() || 'same_for_all_roles';
         var emailCodesEnabled = $( '#two_factor_available_providers_email' ).is( ':checked' );

         if ( 'same_for_all_roles' !== twoFactorSettingsMode ) {
            $( '.two-factor-email-token-ttl' ).hide();
            $( '.two-factor-email-auto-enable' ).hide();
         } else if ( emailCodesEnabled ) {
            $( '.two-factor-email-token-ttl' ).show();
            $( '.two-factor-email-auto-enable' ).show();
         } else {
            $( '.two-factor-email-token-ttl' ).hide();
            $( '.two-factor-email-auto-enable' ).hide();
         }
      }

      function getTwoFactorSettingsMode() {
         return $( 'input[name="admin_site_enhancements[two_factor_settings_mode]"]:checked' ).val() || 'same_for_all_roles';
      }

      function getTwoFactorRoleSlugFromName( fieldName ) {
         var matches = fieldName.match( /two_factor_role_settings\]\[([^\]]+)\]\[enabled\]/ );

         return matches ? matches[1] : '';
      }

      function toggleTwoFactorRoleEmailTokenTtlVisibility( roleSlug ) {
         if ( ! roleSlug ) {
            return;
         }

         var emailFieldSelector = 'input[name="admin_site_enhancements[two_factor_role_settings][' + roleSlug + '][available_providers][]"][value="email"]';
         var emailCodesEnabled = $( emailFieldSelector ).is( ':checked' );

         if ( emailCodesEnabled ) {
            $( 'tr.two-factor-role-email-token-ttl-' + roleSlug ).show();
            $( 'tr.two-factor-role-email-auto-enable-' + roleSlug ).show();
         } else {
            $( 'tr.two-factor-role-email-token-ttl-' + roleSlug ).hide();
            $( 'tr.two-factor-role-email-auto-enable-' + roleSlug ).hide();
         }
      }

      function toggleTwoFactorRoleSettingsPanels() {
         var isPerRoleMode = ( 'different_per_role' === getTwoFactorSettingsMode() );

         $( 'tr.two-factor-role-settings-panel' ).hide();

         if ( ! isPerRoleMode ) {
            return;
         }

         $( 'input[name^="admin_site_enhancements[two_factor_role_settings]"][name$="[enabled]"]' ).each( function() {
            var roleSlug = getTwoFactorRoleSlugFromName( $( this ).attr( 'name' ) );

            if ( ! roleSlug || ! $( this ).is( ':checked' ) ) {
               return;
            }

            $( 'tr.two-factor-role-settings-panel-' + roleSlug ).show();
            toggleTwoFactorRoleEmailTokenTtlVisibility( roleSlug );
         } );
      }

      function toggleTwoFactorSettingsModeVisibility() {
         var isPerRoleMode = ( 'different_per_role' === getTwoFactorSettingsMode() );

         if ( isPerRoleMode ) {
            $( 'tr.two-factor-settings-mode-shared' ).hide();
            $( 'tr.two-factor-settings-mode-per-role' ).show();
         } else {
            $( 'tr.two-factor-settings-mode-shared' ).show();
            $( 'tr.two-factor-settings-mode-per-role' ).hide();
         }

         toggleTwoFactorEmailTokenTtlVisibility();
         toggleTwoFactorRoleSettingsPanels();
      }

      toggleTwoFactorEmailTokenTtlVisibility();
      toggleTwoFactorSettingsModeVisibility();

      $( document ).on( 'change', '#two_factor_available_providers_email', toggleTwoFactorEmailTokenTtlVisibility );
      $( document ).on( 'change', 'input[name="admin_site_enhancements[two_factor_authentication]"]', toggleTwoFactorEmailTokenTtlVisibility );
      $( document ).on( 'change', 'input[name="admin_site_enhancements[two_factor_settings_mode]"]', toggleTwoFactorSettingsModeVisibility );
      $( document ).on( 'change', 'input[name^="admin_site_enhancements[two_factor_role_settings]"][name$="[enabled]"]', toggleTwoFactorRoleSettingsPanels );
      $( document ).on( 'change', 'input[name^="admin_site_enhancements[two_factor_role_settings]"][name*="[available_providers]"]', function() {
         var matches = $( this ).attr( 'name' ).match( /two_factor_role_settings\]\[([^\]]+)\]\[available_providers\]/ );

         if ( matches && matches[1] ) {
            toggleTwoFactorRoleEmailTokenTtlVisibility( matches[1] );
         }
      } );

      $('input[name="admin_site_enhancements[heartbeat_control_for_admin_pages]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'modify' ) {
            $('.heartbeat-interval-for-admin-pages .asenha-subfield-select-inner').show();
         } else {
            $('.heartbeat-interval-for-admin-pages .asenha-subfield-select-inner').hide();            
         }
      });

      if ( $('input[name="admin_site_enhancements[heartbeat_control_for_post_edit]"]:checked').val() == 'modify' ) {
         $('.heartbeat-interval-for-post-edit .asenha-subfield-select-inner').show();
      } else {
         $('.heartbeat-interval-for-post-edit .asenha-subfield-select-inner').hide();
      }

      $('input[name="admin_site_enhancements[heartbeat_control_for_post_edit]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'modify' ) {
            $('.heartbeat-interval-for-post-edit .asenha-subfield-select-inner').show();
         } else {
            $('.heartbeat-interval-for-post-edit .asenha-subfield-select-inner').hide();            
         }
      });

      if ( $('input[name="admin_site_enhancements[heartbeat_control_for_frontend]"]:checked').val() == 'modify' ) {
         $('.heartbeat-interval-for-frontend .asenha-subfield-select-inner').show();
      } else {
         $('.heartbeat-interval-for-frontend .asenha-subfield-select-inner').hide();
      }

      $('input[name="admin_site_enhancements[heartbeat_control_for_frontend]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'modify' ) {
            $('.heartbeat-interval-for-frontend .asenha-subfield-select-inner').show();
         } else {
            $('.heartbeat-interval-for-frontend .asenha-subfield-select-inner').hide();            
         }
      });

      /*! <fs_premium_only> */
      subfieldsToggler( 'site_backup_migration', 'site-backup-migration' );
      /*! </fs_premium_only> */

      subfieldsToggler( 'smtp_email_delivery', 'smtp-email-delivery' );

      /*! <fs_premium_only> */
      // Show hide Username and Password input based on the value of Authentication radio buttons
      if ( $('input[name="admin_site_enhancements[smtp_authentication]"]:checked').val() == 'enable' ) {
         $('tr.smtp-username').show();
         $('tr.smtp-password').show();
      } else {
         $('tr.smtp-username').hide();
         $('tr.smtp-password').hide();
      }

      $('input[name="admin_site_enhancements[smtp_authentication]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'enable' ) {
            $('tr.smtp-username').show();
            $('tr.smtp-password').show();
         } else {
            $('tr.smtp-username').hide();
            $('tr.smtp-password').hide();
         }
      });
      /*! </fs_premium_only> */
      
      subfieldsToggler( 'view_admin_as_role', 'view-admin-as-role' );
      subfieldsToggler( 'enable_password_protection', 'enable-password-protection' );

      // Enable Password protection => Empty field value on click, so new password can be easily entered
      var oldValue = '';
      $('input[name="admin_site_enhancements[password_protection_password]"]').focusin(function() {
         oldValue = $(this).val();
         $(this).val('');
      });

      $('input[name="admin_site_enhancements[password_protection_password]"]').focusout(function() {
         if ( $(this).val() == '' ) {
            $(this).val(oldValue);
         }
      });
      
      /*! <fs_premium_only> */
      if ( maintenanceModeCssEditor != 'undefined' ) {
         subfieldsToggler( 'maintenance_mode', 'maintenance-mode', '', {maintenancePageHeadCodeEditor,maintenanceModeCssEditor} );
      } else {
      /*! </fs_premium_only> */
         subfieldsToggler( 'maintenance_mode', 'maintenance-mode' );
      /*! <fs_premium_only> */
      }
      /*! </fs_premium_only> */

      /*! <fs_premium_only> */
      // Login Page Customizer => Check if 'Custom' is chosen/clicked and show/hide the corresponding subfields      

      // Login page form section color scheme
      if ( $('input[name="admin_site_enhancements[login_page_form_color_scheme]"]:checked').val() == 'light' ) {
         $('.login-page-form-color-scheme-custom').hide();
      } else if ( $('input[name="admin_site_enhancements[login_page_form_color_scheme]"]:checked').val() == 'dark' ) {
         $('.login-page-form-color-scheme-custom').hide();
      } else if ( $('input[name="admin_site_enhancements[login_page_form_color_scheme]"]:checked').val() == 'custom' ) {
         $('.login-page-form-color-scheme-custom').show();
      } else {
         $('.login-page-form-color-scheme-custom').hide();
      }

      $('input[name="admin_site_enhancements[login_page_form_color_scheme]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'light' ) {
            $('.login-page-form-color-scheme-custom').hide();
         } else if ( radioValue == 'dark' ) {
            $('.login-page-form-color-scheme-custom').hide();
         } else if ( radioValue == 'custom' ) {
            $('.login-page-form-color-scheme-custom').show();
         } else {
            $('.login-page-form-color-scheme-custom').hide();
         }
      });

      // Login page login image type
      if ( $('input[name="admin_site_enhancements[login_page_logo_image_type]"]:checked').val() == 'site_icon' ) {
         $('tr.login-page-logo-image').hide();
         $('tr.login-page-logo-image-external').hide();
         $('tr.login-page-logo-image-external-description').hide();
         $('tr.login-page-logo-image-size').hide();
         $('tr.login-page-logo-image-width').hide();
         $('tr.login-page-logo-image-height').hide();
         $('tr.login-page-logo-image-width-external').hide();
         $('tr.login-page-logo-image-height-external').hide();
         $('tr.login-page-logo-image-description').hide();
         $('tr.login-page-logo-site-icon-description').show();
      } else if ( $('input[name="admin_site_enhancements[login_page_logo_image_type]"]:checked').val() == 'custom' ) {         
         $('tr.login-page-logo-image').show();
         $('tr.login-page-logo-image-external').hide();
         $('tr.login-page-logo-image-external-description').hide();
         $('tr.login-page-logo-image-size').show();
         $('tr.login-page-logo-image-width').show();
         $('tr.login-page-logo-image-height').show();
         $('tr.login-page-logo-image-width-external').hide();
         $('tr.login-page-logo-image-height-external').hide();
         $('tr.login-page-logo-image-description').hide();
         $('tr.login-page-logo-site-icon-description').hide();
      } else if ( $('input[name="admin_site_enhancements[login_page_logo_image_type]"]:checked').val() == 'custom_url' ) {         
         $('tr.login-page-logo-image').hide();
         $('tr.login-page-logo-image-external').show();
         $('tr.login-page-logo-image-external-description').show();
         $('tr.login-page-logo-image-size').show();
         $('tr.login-page-logo-image-width').hide();
         $('tr.login-page-logo-image-height').hide();
         $('tr.login-page-logo-image-width-external').show();
         $('tr.login-page-logo-image-height-external').show();
         $('tr.login-page-logo-image-description').show();
         $('tr.login-page-logo-site-icon-description').hide();
      } else {
         $('tr.login-page-logo-image').show();
         $('tr.login-page-logo-image-size').show();
         $('tr.login-page-logo-image-width').show();
         $('tr.login-page-logo-image-height').show();
         $('tr.login-page-logo-image-description').show();
         $('tr.login-page-logo-site-icon-description').hide();
      }

      $('input[name="admin_site_enhancements[login_page_logo_image_type]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'site_icon' ) {
            $('tr.login-page-logo-image').hide();
            $('tr.login-page-logo-image-external').hide();
            $('tr.login-page-logo-image-external-description').hide();
            $('tr.login-page-logo-image-size').hide();
            $('tr.login-page-logo-image-width').hide();
            $('tr.login-page-logo-image-height').hide();
            $('tr.login-page-logo-image-width-external').hide();
            $('tr.login-page-logo-image-height-external').hide();
            $('tr.login-page-logo-image-description').hide();
            $('tr.login-page-logo-site-icon-description').show();
         } else if ( radioValue == 'custom' ) {
            $('tr.login-page-logo-image').show();
            $('tr.login-page-logo-image-external').hide();
            $('tr.login-page-logo-image-external-description').hide();
            $('tr.login-page-logo-image-size').show();
            $('tr.login-page-logo-image-width').show();
            $('tr.login-page-logo-image-height').show();
            $('tr.login-page-logo-image-width-external').hide();
            $('tr.login-page-logo-image-height-external').hide();
            $('tr.login-page-logo-image-description').hide();
            $('tr.login-page-logo-site-icon-description').hide();
         } else if ( radioValue == 'custom_url' ) {
            $('tr.login-page-logo-image').hide();
            $('tr.login-page-logo-image-external').show();
            $('tr.login-page-logo-image-external-description').show();
            $('tr.login-page-logo-image-size').show();
            $('tr.login-page-logo-image-width').hide();
            $('tr.login-page-logo-image-height').hide();
            $('tr.login-page-logo-image-width-external').show();
            $('tr.login-page-logo-image-height-external').show();
            $('tr.login-page-logo-image-description').show();
            $('tr.login-page-logo-site-icon-description').hide();
         } else {
            $('tr.login-page-logo-image').show();
            $('tr.login-page-logo-image-size').show();
            $('tr.login-page-logo-image-width').show();
            $('tr.login-page-logo-image-height').show();
            $('tr.login-page-logo-image-description').show();
            $('tr.login-page-logo-site-icon-description').hide();
         }
      });

      // Login page background
      if ( $('input[name="admin_site_enhancements[login_page_background]"]:checked').val() == 'pattern' ) {
         $('tr.login-page-background-pattern').show();
         $('tr.login-page-background-image').hide();
         $('tr.login-page-background-color').hide();
      } else if ( $('input[name="admin_site_enhancements[login_page_background]"]:checked').val() == 'image' ) {
         $('tr.login-page-background-pattern').hide();
         $('tr.login-page-background-image').show();
         $('tr.login-page-background-color').hide();
      } else if ( $('input[name="admin_site_enhancements[login_page_background]"]:checked').val() == 'solid_color' ) {
         $('tr.login-page-background-pattern').hide();
         $('tr.login-page-background-image').hide();
         $('tr.login-page-background-color').show();
      } else {
         $('tr.login-page-background-pattern').hide();
         $('tr.login-page-background-image').hide();
         $('tr.login-page-background-color').hide();         
      }

      $('input[name="admin_site_enhancements[login_page_background]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'pattern' ) {
            $('tr.login-page-background-pattern').show();
            $('tr.login-page-background-image').hide();
            $('tr.login-page-background-color').hide();
         } else if ( radioValue == 'image' ) {
            $('tr.login-page-background-pattern').hide();
            $('tr.login-page-background-image').show();
            $('tr.login-page-background-color').hide();
         } else if ( radioValue == 'solid_color' ) {
            $('tr.login-page-background-pattern').hide();
            $('tr.login-page-background-image').hide();
            $('tr.login-page-background-color').show();
         } else {
            $('tr.login-page-background-pattern').hide();
            $('tr.login-page-background-image').hide();
            $('tr.login-page-background-color').hide();         
         }
      });

      // Redirect After Login
      if ( $('input[name="admin_site_enhancements[redirect_after_login_type]"]:checked').val() == 'single_url' ) {
         $('tr.redirect-after-login-to-slug').show();
         $('tr.redirect-after-login-for').show();
         $('tr.redirect-after-login-for-separate').hide();         
      } else {
         $('tr.redirect-after-login-to-slug').hide();
         $('tr.redirect-after-login-for').hide();
         $('tr.redirect-after-login-for-separate').show();         
      }

      $('input[name="admin_site_enhancements[redirect_after_login_type]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'single_url' ) {
            $('tr.redirect-after-login-to-slug').show();
            $('tr.redirect-after-login-for').show();
            $('tr.redirect-after-login-for-separate').hide();         
         } else {
            $('tr.redirect-after-login-to-slug').hide();
            $('tr.redirect-after-login-for').hide();
            $('tr.redirect-after-login-for-separate').show();         
         }
      });

      // Redirect After Logout
      if ( $('input[name="admin_site_enhancements[redirect_after_logout_type]"]:checked').val() == 'single_url' ) {
         $('tr.redirect-after-logout-to-slug').show();
         $('tr.redirect-after-logout-for').show();
         $('tr.redirect-after-logout-for-separate').hide();         
      } else {
         $('tr.redirect-after-logout-to-slug').hide();
         $('tr.redirect-after-logout-for').hide();
         $('tr.redirect-after-logout-for-separate').show();         
      }

      $('input[name="admin_site_enhancements[redirect_after_logout_type]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'single_url' ) {
            $('tr.redirect-after-logout-to-slug').show();
            $('tr.redirect-after-logout-for').show();
            $('tr.redirect-after-logout-for-separate').hide();         
         } else {
            $('tr.redirect-after-logout-to-slug').hide();
            $('tr.redirect-after-logout-for').hide();
            $('tr.redirect-after-logout-for-separate').show();         
         }
      });
      
      /*! <fs_premium_only> */
      // External Permalinks
      if ( $('input[name="admin_site_enhancements[enable_external_permalinks_type]"]:checked').val() == 'all-post-types' ) {
         $('.asenha-checkbox-item.enable-external-permalinks-for').hide();
         $('.enable-external-permalinks-type').removeClass('asenha-th-border-bottom');
      } else {
         $('.asenha-checkbox-item.enable-external-permalinks-for').show();
         $('.enable-external-permalinks-type').addClass('asenha-th-border-bottom');
      }

      $('input[name="admin_site_enhancements[enable_external_permalinks_type]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'all-post-types' ) {
            $('.asenha-checkbox-item.enable-external-permalinks-for').hide();
            $('.enable-external-permalinks-type').removeClass('asenha-th-border-bottom');
         } else {
            $('.asenha-checkbox-item.enable-external-permalinks-for').show();
            $('.enable-external-permalinks-type').addClass('asenha-th-border-bottom');
         }
      });
      /*! </fs_premium_only> */

      /*! <fs_premium_only> */
      // Revisions Control
      if ( $('input[name="admin_site_enhancements[enable_revisions_control_type]"]:checked').val() == 'all-post-types' ) {
         $('.asenha-checkbox.enable-revisions-control-for').hide();
         $('.enable-revisions-control-type').removeClass('asenha-th-border-bottom');
      } else {
         $('.asenha-checkbox.enable-revisions-control-for').show();
         $('.enable-revisions-control-type').addClass('asenha-th-border-bottom');
      }

      $('input[name="admin_site_enhancements[enable_revisions_control_type]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'all-post-types' ) {
            $('.asenha-checkbox.enable-revisions-control-for').hide();
            $('.enable-revisions-control-type').removeClass('asenha-th-border-bottom');
         } else {
            $('.asenha-checkbox.enable-revisions-control-for').show();
            $('.enable-revisions-control-type').addClass('asenha-th-border-bottom');
         }
      });
      /*! </fs_premium_only> */

      // Disable Gutenberg
      if ( $('input[name="admin_site_enhancements[disable_gutenberg_type]"]:checked').val() == 'all-post-types' ) {
         $('.asenha-checkbox-item.disable-gutenberg-for').hide();
         $('.disable-gutenberg-type').removeClass('asenha-th-border-bottom');
      } else {
         $('.asenha-checkbox-item.disable-gutenberg-for').show();
         $('.disable-gutenberg-type').addClass('asenha-th-border-bottom');
      }

      $('input[name="admin_site_enhancements[disable_gutenberg_type]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'all-post-types' ) {
            $('.asenha-checkbox-item.disable-gutenberg-for').hide();
            $('.disable-gutenberg-type').removeClass('asenha-th-border-bottom');
         } else {
            $('.asenha-checkbox-item.disable-gutenberg-for').show();
            $('.disable-gutenberg-type').addClass('asenha-th-border-bottom');
         }
      });

      /*! <fs_premium_only> */
      // Always disable Gutenberg on specific posts (Pro)
      function toggleDisableGutenbergAlwaysSubfields() {
         var $alwaysCheckbox = $('input[name="admin_site_enhancements[disable_gutenberg_always]"]');
         if ( ! $alwaysCheckbox.length ) {
            return;
         }

         if ( $alwaysCheckbox.is(':checked') ) {
            $('.disable-gutenberg-always-on').show();
            $('.disable-gutenberg-always-on-wrap').show();
            $('.disable-gutenberg-always-frontend-styles').show();
         } else {
            $('.disable-gutenberg-always-on').hide();
            $('.disable-gutenberg-always-on-wrap').hide();
            $('.disable-gutenberg-always-frontend-styles').hide();
         }
      }

      toggleDisableGutenbergAlwaysSubfields();

      $('input[name="admin_site_enhancements[disable_gutenberg_always]"]').on('change', function() {
         toggleDisableGutenbergAlwaysSubfields();
      });

      if ( typeof $.fn.select2 === 'function' && $('.disable-gutenberg-always-on-select').length ) {
         $('.disable-gutenberg-always-on-select').select2({
            width: '100%',
            multiple: true,
            placeholder: ( adminPageVars.disableGutenbergAlwaysPlaceholder || 'Search posts…' ),
            minimumInputLength: 2,
            ajax: {
               url: ajaxurl,
               dataType: 'json',
               delay: 250,
               data: function( params ) {
                  return {
                     action: 'asenha_search_posts_for_disable_gutenberg',
                     nonce: adminPageVars.disableGutenbergAlwaysNonce || '',
                     q: params.term || ''
                  };
               },
               processResults: function( response ) {
                  if ( response && response.success && response.data && response.data.results ) {
                     return {
                        results: response.data.results
                     };
                  }

                  return {
                     results: []
                  };
               },
               cache: true
            }
         });
      }

      // Always enable Gutenberg on specific posts (Pro)
      function toggleDisableGutenbergAlwaysEnableSubfields() {
         var $alwaysEnableCheckbox = $('input[name="admin_site_enhancements[disable_gutenberg_always_enable]"]');
         if ( ! $alwaysEnableCheckbox.length ) {
            return;
         }

         if ( $alwaysEnableCheckbox.is(':checked') ) {
            $('.disable-gutenberg-always-enable-on').show();
            $('.disable-gutenberg-always-enable-on-wrap').show();
         } else {
            $('.disable-gutenberg-always-enable-on').hide();
            $('.disable-gutenberg-always-enable-on-wrap').hide();
         }
      }

      toggleDisableGutenbergAlwaysEnableSubfields();

      $('input[name="admin_site_enhancements[disable_gutenberg_always_enable]"]').on('change', function() {
         toggleDisableGutenbergAlwaysEnableSubfields();
      });

      if ( typeof $.fn.select2 === 'function' && $('.disable-gutenberg-always-enable-on-select').length ) {
         $('.disable-gutenberg-always-enable-on-select').select2({
            width: '100%',
            multiple: true,
            placeholder: ( adminPageVars.disableGutenbergAlwaysPlaceholder || 'Search posts…' ),
            minimumInputLength: 2,
            ajax: {
               url: ajaxurl,
               dataType: 'json',
               delay: 250,
               data: function( params ) {
                  return {
                     action: 'asenha_search_posts_for_disable_gutenberg',
                     nonce: adminPageVars.disableGutenbergAlwaysNonce || '',
                     q: params.term || ''
                  };
               },
               processResults: function( response ) {
                  if ( response && response.success && response.data && response.data.results ) {
                     return {
                        results: response.data.results
                     };
                  }

                  return {
                     results: []
                  };
               },
               cache: true
            }
         });
      }
      /*! </fs_premium_only> */

      // Disable Comments
      if ( $('input[name="admin_site_enhancements[disable_comments_type]"]:checked').val() == 'all-post-types' ) {
         $('.asenha-checkbox-item.disable-comments-for').hide();
         $('.disable-comments-type').removeClass('asenha-th-border-bottom');
      } else {
         $('.asenha-checkbox-item.disable-comments-for').show();
         $('.disable-comments-type').addClass('asenha-th-border-bottom');
      }

      $('input[name="admin_site_enhancements[disable_comments_type]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'all-post-types' ) {
            $('.asenha-checkbox-item.disable-comments-for').hide();
            $('.disable-comments-type').removeClass('asenha-th-border-bottom');
         } else {
            $('.asenha-checkbox-item.disable-comments-for').show();
            $('.disable-comments-type').addClass('asenha-th-border-bottom');
         }
      });

      /*! <fs_premium_only> */
      // Disable Comments module when "All post types" is checked or unchecked
      function asenhaUpdateDisableCommentsAllPostTypesUi() {
         var isAllPostTypes = ( $('input[name="admin_site_enhancements[disable_comments_type]"]:checked').val() == 'all-post-types' );
         var $note = $('.disable-comments-all-cpts-description');
         var $forcedNote = $('.asenha-disable-comments-forced-note');

         if ( isAllPostTypes ) {
            $note.show();
            $forcedNote.show();
         } else {
            $note.hide();
            $forcedNote.hide();
         }
      }

      asenhaUpdateDisableCommentsAllPostTypesUi();
      $('input[name="admin_site_enhancements[disable_comments_type]"]').on('click', asenhaUpdateDisableCommentsAllPostTypesUi);
      /*! </fs_premium_only> */

      // CAPTCHA Protection
      // CAPTCHA Type conditional show/hide
      $(document).on('change', 'select[name="admin_site_enhancements[captcha_protection_types]"]', function() {
         var selectValue = this.value;
         if ( 'altcha' == selectValue ) {
            $('.captcha-protection-altcha-wrapper').show();
            $('.captcha-protection-recaptcha-wrapper').hide();
            $('.captcha-protection-turnstile-wrapper').hide();
            // $('input#captcha_woo_locations_woo_checkout_form').prop('disabled', '');
            // $('input#captcha_woo_locations_woo_checkout_form').show();
            // $('label[for="captcha_woo_locations_woo_checkout_form"]').show();
         } else if ( 'recaptcha' == selectValue ) {
            $('.captcha-protection-altcha-wrapper').hide();
            $('.captcha-protection-recaptcha-wrapper').show();
            $('.captcha-protection-turnstile-wrapper').hide();
            // $('input#captcha_woo_locations_woo_checkout_form').prop('disabled', '');
            // $('input#captcha_woo_locations_woo_checkout_form').show();
            // $('label[for="captcha_woo_locations_woo_checkout_form"]').show();
         } else if ( 'turnstile' == selectValue ) {
            $('.captcha-protection-altcha-wrapper').hide();
            $('.captcha-protection-recaptcha-wrapper').hide();
            $('.captcha-protection-turnstile-wrapper').show();
            // $('input#captcha_woo_locations_woo_checkout_form').prop('disabled', 'disabled');
            // $('input#captcha_woo_locations_woo_checkout_form').hide();
            // $('label[for="captcha_woo_locations_woo_checkout_form"]').hide();
         }
      });
      
      if ( 'altcha' == $('select[name="admin_site_enhancements[captcha_protection_types]"]').val() ) {
         $('.captcha-protection-altcha-wrapper').show();
         $('.captcha-protection-recaptcha-wrapper').hide();
         $('.captcha-protection-turnstile-wrapper').hide();
         $('input#captcha_woo_locations_woo_checkout_form').prop('disabled', '');
         $('input#captcha_woo_locations_woo_checkout_form').show();
         $('label[for="captcha_woo_locations_woo_checkout_form"]').show();
      } else if ( 'recaptcha' == $('select[name="admin_site_enhancements[captcha_protection_types]"]').val() ) {
         $('.captcha-protection-altcha-wrapper').hide();
         $('.captcha-protection-recaptcha-wrapper').show();
         $('.captcha-protection-turnstile-wrapper').hide();
         $('input#captcha_woo_locations_woo_checkout_form').prop('disabled', '');
         $('input#captcha_woo_locations_woo_checkout_form').show();
         $('label[for="captcha_woo_locations_woo_checkout_form"]').show();
      } else if ( 'turnstile' == $('select[name="admin_site_enhancements[captcha_protection_types]"]').val() ) {
         $('.captcha-protection-altcha-wrapper').hide();
         $('.captcha-protection-recaptcha-wrapper').hide();
         $('.captcha-protection-turnstile-wrapper').show();
         $('input#captcha_woo_locations_woo_checkout_form').prop('disabled', 'disabled');
         $('input#captcha_woo_locations_woo_checkout_form').hide();
         $('label[for="captcha_woo_locations_woo_checkout_form"]').hide();
      }

      // ALTCHA Floating UI conditional value selection
      $(document).on('change', 'select[name="admin_site_enhancements[altcha_widget]"]', function() {
         var selectValue = this.value;
         if ( 'checkbox' == selectValue ) {
            $('select[name="admin_site_enhancements[altcha_auto_verification]"]').val('');
         } else if ( 'invisible' == selectValue ) {
            $('select[name="admin_site_enhancements[altcha_auto_verification]"]').val('onsubmit');
         }
      });

      if ( 'checkbox' == $('select[name="admin_site_enhancements[altcha_widget]"]').val() ) {
         $('select[name="admin_site_enhancements[altcha_auto_verification]"]').val('');
      } else if ( 'invisible' == $('select[name="admin_site_enhancements[altcha_widget]"]').val() ) {
         $('select[name="admin_site_enhancements[altcha_auto_verification]"]').val('onsubmit');
      }

      // reCAPTCHA Type conditional show/hide
      $(document).on('change', 'select[name="admin_site_enhancements[recaptcha_widget]"]', function() {
         var selectValue = this.value;
         if ( 'v2_checkbox' == selectValue ) {
            $('.recaptcha-site-key-v2-checkbox').show();
            $('.recaptcha-secret-key-v2-checkbox').show();
            $('.recaptcha-site-key-v3-invisible').hide();
            $('.recaptcha-secret-key-v3-invisible').hide();
         } else if ( 'v3_invisible' == selectValue ) {
            $('.recaptcha-site-key-v2-checkbox').hide();
            $('.recaptcha-secret-key-v2-checkbox').hide();
            $('.recaptcha-site-key-v3-invisible').show();
            $('.recaptcha-secret-key-v3-invisible').show();
         }
      });

      if ( 'v2_checkbox' == $('select[name="admin_site_enhancements[recaptcha_widget]"]').val() ) {
         $('.recaptcha-site-key-v2-checkbox').show();
         $('.recaptcha-secret-key-v2-checkbox').show();
         $('.recaptcha-site-key-v3-invisible').hide();
         $('.recaptcha-secret-key-v3-invisible').hide();
      } else if ( 'v3_invisible' == $('select[name="admin_site_enhancements[recaptcha_widget]"]').val() ) {
         $('.recaptcha-site-key-v2-checkbox').hide();
         $('.recaptcha-secret-key-v2-checkbox').hide();
         $('.recaptcha-site-key-v3-invisible').show();
         $('.recaptcha-secret-key-v3-invisible').show();
      }

      // Email Address Obfuscator
      if ( $('input[name="admin_site_enhancements[obfuscate_email_address_in_content]"]').is(':checked') ) {
         $('.obfuscate-email-address-visitor-only').show();
      } else {
         $('.obfuscate-email-address-visitor-only').hide();
      }

      $('input[name="admin_site_enhancements[obfuscate_email_address_in_content]"]').click(function() {
         if ($(this).is(':checked')) {
            $('.obfuscate-email-address-visitor-only').show();
         } else {
            $('.obfuscate-email-address-visitor-only').hide();
         }
      });

      // Image Upload Control
      if ( $('input[name="admin_site_enhancements[convert_to_webp]"]').is(':checked') ) {
         $('.convert-to-jpg-quality').hide();
         $('.convert-to-webp-quality').show();
      } else {
         $('.convert-to-jpg-quality').show();
         $('.convert-to-webp-quality').hide();
      }

      $('input[name="admin_site_enhancements[convert_to_webp]"]').click(function() {
         if ($(this).is(':checked')) {
            $('.convert-to-jpg-quality').hide();
            $('.convert-to-webp-quality').show();
         } else {
            $('.convert-to-jpg-quality').show();
            $('.convert-to-webp-quality').hide();
         }
      });

      if ( $('input[name="admin_site_enhancements[disable_image_conversion]"]').is(':checked') ) {
         $('.image-conversion-wrapper').hide();
      } else {
         $('.image-conversion-wrapper').show();
      }

      $('input[name="admin_site_enhancements[disable_image_conversion]"]').click(function() {
         if ($(this).is(':checked')) {
            $('.image-conversion-wrapper').hide();
         } else {
            $('.image-conversion-wrapper').show();
         }
      });

      function field_value_initial_sync( originSelector, targetSelector ) {
         if ( $(originSelector).val() != '' ) {
            $(targetSelector).val($(originSelector).val());
         }
      }

      function field_value_live_sync( originSelector, targetSelector ) {
         $('.asenha-body').on('input', originSelector, function() {
            var originValue = $(this).val();
            $(targetSelector).val(originValue);
         });
      }
      
      function field_value_syncing( originSelector, targetSelector ) {
         field_value_initial_sync( originSelector, targetSelector );
         field_value_live_sync( originSelector, targetSelector );
      }

      // Form Builder site and secret keys syncing
      field_value_syncing('input[name="admin_site_enhancements[altcha_secret_key]"]', 'input[name="admin_site_enhancements[form_builder_altcha_secret_key]"]');
      field_value_syncing('input[name="admin_site_enhancements[recaptcha_site_key_v2_checkbox]"]', 'input[name="admin_site_enhancements[form_builder_recaptcha_site_key_v2_checkbox]"]');
      field_value_syncing('input[name="admin_site_enhancements[recaptcha_secret_key_v2_checkbox]"]', 'input[name="admin_site_enhancements[form_builder_recaptcha_secret_key_v2_checkbox]"]');
      field_value_syncing('input[name="admin_site_enhancements[recaptcha_site_key_v3_invisible]"]', 'input[name="admin_site_enhancements[form_builder_recaptcha_site_key_v3_invisible]"]');
      field_value_syncing('input[name="admin_site_enhancements[recaptcha_secret_key_v3_invisible]"]', 'input[name="admin_site_enhancements[form_builder_recaptcha_secret_key_v3_invisible]"]');
      field_value_syncing('input[name="admin_site_enhancements[turnstile_site_key]"]', 'input[name="admin_site_enhancements[form_builder_turnstile_site_key]"]');
      field_value_syncing('input[name="admin_site_enhancements[turnstile_secret_key]"]', 'input[name="admin_site_enhancements[form_builder_turnstile_secret_key]"]');
      
      // Maintenance Mode => Use a customizable page vs Use an existing page      
      if ( $('input[name="admin_site_enhancements[maintenance_page_type]"]:checked').val() == 'custom' ) {
         $('.maintenance-page-type-custom').show();
         $('tr.maintenance-page-slug').hide();
      } else if ( $('input[name="admin_site_enhancements[maintenance_page_type]"]:checked').val() == 'existing' ) {
         $('.maintenance-page-type-custom').hide();
         $('tr.maintenance-page-slug').show();
      } else {
         $('.maintenance-page-type-custom').show();
         $('tr.maintenance-page-slug').hide();
      }

      $('input[name="admin_site_enhancements[maintenance_page_type]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'custom' ) {
         $('.maintenance-page-type-custom').show();
            $('tr.maintenance-page-slug').hide();
         } else if ( radioValue == 'existing' ) {
         $('.maintenance-page-type-custom').hide();
            $('tr.maintenance-page-slug').show();
         } else {
            $('.maintenance-page-type-custom').show();
            $('tr.maintenance-page-slug').hide();
         }
      });

      // Maintenance Mode => Check if 'Image' or 'Color' is chosen/clicked and show/hide the corresponding select field      
      if ( $('input[name="admin_site_enhancements[maintenance_page_background]"]:checked').val() == 'pattern' ) {
         $('tr.maintenance-page-background-pattern').show();
         $('tr.maintenance-page-background-image').hide();
         $('tr.maintenance-page-background-color').hide();         
      } else if( $('input[name="admin_site_enhancements[maintenance_page_background]"]:checked').val() == 'image' ) {
         $('tr.maintenance-page-background-pattern').hide();
         $('tr.maintenance-page-background-image').show();
         $('tr.maintenance-page-background-color').hide();
      } else if ( $('input[name="admin_site_enhancements[maintenance_page_background]"]:checked').val() == 'solid_color' ) {
         $('tr.maintenance-page-background-pattern').hide();
         $('tr.maintenance-page-background-image').hide();
         $('tr.maintenance-page-background-color').show();
      } else {
         $('tr.maintenance-page-background-pattern').hide();
         $('tr.maintenance-page-background-image').hide();
         $('tr.maintenance-page-background-color').hide();         
      }

      $('input[name="admin_site_enhancements[maintenance_page_background]"]').click(function() {
         var radioValue = $(this).attr('value');
         if ( radioValue == 'pattern' ) {
            $('tr.maintenance-page-background-pattern').show();
            $('tr.maintenance-page-background-image').hide();
            $('tr.maintenance-page-background-color').hide();            
         } else if ( radioValue == 'image' ) {
            $('tr.maintenance-page-background-pattern').hide();
            $('tr.maintenance-page-background-image').show();
            $('tr.maintenance-page-background-color').hide();
         } else if ( radioValue == 'solid_color' ) {
            $('tr.maintenance-page-background-pattern').hide();
            $('tr.maintenance-page-background-image').hide();
            $('tr.maintenance-page-background-color').show();
         } else {
            $('tr.maintenance-page-background-pattern').hide();
            $('tr.maintenance-page-background-image').hide();
            $('tr.maintenance-page-background-color').hide();         
         }
      });
      /*! </fs_premium_only> */
      
      // Content Toggler
      $('.asenha-body').on('click', '.asenha-content-toggler', function(e) {
         e.preventDefault();
         var targetSelector = $(this).data('target-selector');
         var showText = $(this).data('show-text');
         var hideText = $(this).data('hide-text');
         var expanded = $(this).attr('data-expanded');
         // $(targetSelector).toggle();
         if (expanded == 'no') {
            $(targetSelector).slideDown(200);
            $(this).html(hideText + ' <span>▲</span>');
            $(this).attr('data-expanded','yes');
         } else {
            $(targetSelector).slideUp(200);
            $(this).html(showText + ' <span>▼</span>');
            $(this).attr('data-expanded','no');
         }
      });
      
      // Media frame handler for image selection / upload fields
      // Reference: https://plugins.trac.wordpress.org/browser/bm-custom-login/trunk/bm-custom-login.php
      function media_frame_init( selector, button_selector ) {
         // media_frame_init( '#login-page-logo-image', '#login-page-logo-image-button' );
         var theSelector = $(selector);
         var button = $(button_selector);

         button.click(function (event) {
            event.preventDefault();

            // Configuration of the media frame new instance
            wp.media.frames.frame = wp.media({
               title: adminPageVars.mediaFrameTitle,
               multiple: false,
               library: {
                  type: 'image'
               },
               button: {
                  text: adminPageVars.mediaFrameButtonText
               }
            });

            // Function used for the image selection and media manager closing
            var media_set_image = function() {
               var selection = wp.media.frames.frame.state().get('selection');

               // Nothing is selected
               if (!selection) {
                  return;
               }

               // Iterate through selected elements
               selection.each(function(attachment) {
                  // console.log(attachment);
                  var rawUrl = attachment.attributes.url;
                  var url = rawUrl;
                  url = url.replace( adminPageVars.wpcontentUrl, '' );
                  theSelector.val(url);

                  if ( '#login-page-logo-image' == selector ) {
                     var attachmentId = $('.login-page-logo-image-attachment-id input');
                     var originalWidthInput = $('.login-page-logo-image-width-original input');
                     var originalHeightInput = $('.login-page-logo-image-height-original input');
                     var widthInput = $('.login-page-logo-image-width input');
                     var heightInput = $('.login-page-logo-image-height input');
                     attachmentId.val(attachment.attributes.id);
                     originalWidthInput.val(attachment.attributes.width);
                     originalHeightInput.val(attachment.attributes.height);
                     widthInput.val(attachment.attributes.width);
                     heightInput.val(attachment.attributes.height);                     
                  }

                  /*! <fs_premium_only> */
                  if ( '#admin-logo-image' == selector ) {
                     var adminLogoWidthInput = $('#admin-logo-image-width');
                     var adminLogoHeightInput = $('#admin-logo-image-height');
                     var imgWidth = parseInt(attachment.attributes.width, 10);
                     var imgHeight = parseInt(attachment.attributes.height, 10);
                     adminLogoWidthInput.val(isNaN(imgWidth) ? 0 : imgWidth);
                     adminLogoHeightInput.val(isNaN(imgHeight) ? 0 : imgHeight);

                     // For SVGs, prefer viewBox-derived dimensions when possible (same-origin).
                     if ( rawUrl && asenhaLooksLikeSvgUrl(rawUrl) ) {
                        var expectedRawValue = theSelector.val();
                        asenhaGetSvgDimsFromUrl(rawUrl, function(dims) {
                           if (theSelector.val() !== expectedRawValue) {
                              return;
                           }
                           if (dims && dims.width > 0 && dims.height > 0) {
                              adminLogoWidthInput.val(dims.width);
                              adminLogoHeightInput.val(dims.height);
                           }
                        });
                     }
                  }
                  /*! </fs_premium_only> */

                  if ( '#form-builder-email-header-image' == selector ) {
                     var attachmentId = $('.form-builder-email-header-image-attachment-id input');
                     attachmentId.val(attachment.attributes.id);
                  }
               });
            };

            wp.media.frames.frame.on('close', media_set_image);
            wp.media.frames.frame.on('select', media_set_image);
            wp.media.frames.frame.open();
         });
      }

      /*! <fs_premium_only> */
      // =============== Image dimension detection for Admin Logo (external URLs) =================

      var adminLogoImageInput = $('#admin-logo-image');
      var adminLogoWidthInput = $('#admin-logo-image-width');
      var adminLogoHeightInput = $('#admin-logo-image-height');

      function asenhaLooksLikeSvgUrl(url) {
         return (/\.svg(\?|#|$)/i).test(url || '');
      }

      function asenhaIsSameOriginUrl(url) {
         try {
            var parsed = new URL(url, window.location.href);
            return parsed.origin === window.location.origin;
         } catch (e) {
            return false;
         }
      }

      function asenhaParseSvgAbsoluteLengthValue(raw) {
         var value = (raw || '').toString().trim();
         if (!value || value.indexOf('%') !== -1) {
            return null;
         }

         var matches = value.match(/^\s*([0-9]*\.?[0-9]+)\s*(px|pt|pc|mm|cm|in|q)?\s*$/i);
         if (!matches) {
            return null;
         }

         var num = parseFloat(matches[1]);
         if (isNaN(num) || num <= 0) {
            return null;
         }

         var unit = (matches[2] || 'px').toLowerCase();

         return { value: num, unit: unit };
      }

      function asenhaGetSvgDimsFromText(svgText) {
         try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(svgText || '', 'image/svg+xml');
            var svg = doc.querySelector('svg');
            if (!svg) {
               return null;
            }

            var wLen = asenhaParseSvgAbsoluteLengthValue(svg.getAttribute('width'));
            var hLen = asenhaParseSvgAbsoluteLengthValue(svg.getAttribute('height'));
            if (wLen && hLen && wLen.unit === hLen.unit) {
               return { width: Math.round(wLen.value), height: Math.round(hLen.value) };
            }

            var viewBox = (svg.getAttribute('viewBox') || '').toString().trim();
            if (!viewBox) {
               return null;
            }

            var parts = viewBox.split(/[\s,]+/).filter(function(p) { return !!p; });
            if (parts.length < 4) {
               return null;
            }

            var vbW = parseFloat(parts[2]);
            var vbH = parseFloat(parts[3]);
            if (isNaN(vbW) || isNaN(vbH) || vbW <= 0 || vbH <= 0) {
               return null;
            }

            return { width: Math.round(vbW), height: Math.round(vbH) };
         } catch (e) {
            return null;
         }
      }

      function asenhaGetSvgDimsFromUrl(url, onDone) {
         if (!onDone || typeof onDone !== 'function') {
            return;
         }

         if (!url || !window.fetch || !window.DOMParser || !asenhaIsSameOriginUrl(url)) {
            onDone(null);
            return;
         }

         fetch(url, { credentials: 'same-origin' })
            .then(function(response) {
               if (!response || !response.ok) {
                  throw new Error('Fetch failed');
               }
               return response.text();
            })
            .then(function(text) {
               onDone(asenhaGetSvgDimsFromText(text));
            })
            .catch(function() {
               onDone(null);
            });
      }

      function setAdminLogoImageDims(width, height) {
         adminLogoWidthInput.val(width);
         adminLogoHeightInput.val(height);
      }

      function normalizeAdminLogoImageUrl(rawValue) {
         var value = (rawValue || '').trim();
         if (!value) {
            return '';
         }

         // Stored Media Library value is usually a wp-content relative uploads path like: /uploads/....
         if (value.indexOf('http') !== 0 && value.indexOf('/uploads/') !== -1) {
            return adminPageVars.wpcontentUrl + value;
         }

         return value;
      }

      if (adminLogoImageInput.length && adminLogoWidthInput.length && adminLogoHeightInput.length) {
         adminLogoImageInput.on('change keyup', delay(function() {
            var currentRawValue = adminLogoImageInput.val();
            var url = normalizeAdminLogoImageUrl(currentRawValue);

            if (!url) {
               setAdminLogoImageDims(0, 0);
               return;
            }

            // If user is typing, this prevents older async loads from overwriting new values.
            var expectedRawValue = currentRawValue;

            function fallbackToImageNaturalDims() {
               var img = new Image();
               img.onload = function() {
                  if (adminLogoImageInput.val() !== expectedRawValue) {
                     return;
                  }

                  var w = parseInt(img.naturalWidth, 10);
                  var h = parseInt(img.naturalHeight, 10);

                  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
                     setAdminLogoImageDims(0, 0);
                     return;
                  }

                  setAdminLogoImageDims(w, h);
               };
               img.onerror = function() {
                  if (adminLogoImageInput.val() !== expectedRawValue) {
                     return;
                  }

                  setAdminLogoImageDims(0, 0);
               };
               img.src = url;
            }

            // For same-origin SVGs, prefer parsing viewBox to get the real aspect ratio.
            if (asenhaLooksLikeSvgUrl(url)) {
               asenhaGetSvgDimsFromUrl(url, function(dims) {
                  if (adminLogoImageInput.val() !== expectedRawValue) {
                     return;
                  }

                  if (dims && dims.width > 0 && dims.height > 0) {
                     setAdminLogoImageDims(dims.width, dims.height);
                     return;
                  }

                  fallbackToImageNaturalDims();
               });
               return;
            }

            fallbackToImageNaturalDims();
         }, 400));
      }
      /*! </fs_premium_only> */

      // Form Builder - Empty out stored/hidden attachment ID when "Email header image" field is emptied
      var emailHeaderImage = $('#form-builder-email-header-image');
      var emailHeaderImageAttachmentId = $('.form-builder-email-header-image-attachment-id input');
      
      $(emailHeaderImage).keyup(delay(function (e) {
         if ($(this).val().length === 0) {
            emailHeaderImageAttachmentId.val("");
         }
      }, 200));

      // =============== Image Ratio Calculator / Preservation for Login Page Customizer >> Logo Image =================

      // Code modified from: https://codepen.io/tobiasdev/pen/XNjxdZ by Tobias Bogliolo

      var initialWidth, initialHeight, newWidth, newHeight, aspectRatio;

      //Get new values:
      function getValues(){
         initialWidth = $(".login-page-logo-image-width-original input").val();
         initialHeight = $(".login-page-logo-image-height-original input").val();
         newWidth = $(".login-page-logo-image-width input").val();
         newHeight = $(".login-page-logo-image-height input").val();
      };

      //Aspect ratio:
      function getAspectRatio(){
         // Formula: "Aspect Ratio = Width / Height".
         return aspectRatio = initialWidth/initialHeight;
      };

      //Get new height:
      $(".login-page-logo-image-width input").on("change keyup", function(){
         // Refresh data.
         getValues();
         getAspectRatio();
         // New height = new width / (original width / original height).
         newHeight = Math.round(newWidth/aspectRatio);
         // Output:
         $(".login-page-logo-image-height input").val(newHeight);
      });

      //Get new width:
      $(".login-page-logo-image-height input").on("change keyup", function(){
         // Refresh data.
         getValues();
         getAspectRatio();
         // New width = (original width / original height) * new height.
         newWidth = Math.round(newHeight*aspectRatio);
         // Output:
         $(".login-page-logo-image-width input").val(newWidth);
      });

      //Reset:
      $(".login-page-logo-image-width-original input, .login-page-logo-image-height-original input").on("change keyup", function(){
         // Output:
         $(".login-page-logo-image-width input").val("");
         $(".login-page-logo-image-height input").val("");
      });
            
      // =============== ASE PRO =================

      if ( asenhaStats.isYearEndPromoPeriod ) {

         // Promo nudge
         if ( asenhaStats.hidePromoNudge ) {
            $('.asenha-promo-nudge').hide();
            $('#bottom-upgrade-nudge').show();
         } else {
            $('.asenha-promo-nudge').show();
            $('#bottom-upgrade-nudge').hide();
         }
         
         $('#dismiss-promo-nudge').click(function(e) {
            e.preventDefault();
            $.ajax({
               url: ajaxurl,
               data: {
                  'action':'dismiss_promo_nudge',
                  'nonce': adminPageVars.nonce
               },
               success:function(data) {
                  $('.asenha-promo-nudge').hide();
               },
               error:function(errorThrown) {
                  console.log(errorThrown);
               }
            });
         });
         
      } else {

         // Upgrade nudge to Pro
         if ( asenhaStats.hideUpgradeNudge ) {
            $('.asenha-upgrade-nudge').hide();
            $('#bottom-upgrade-nudge').show();
         } else {
            $('.asenha-upgrade-nudge').show();
            $('#bottom-upgrade-nudge').hide();
         }

         $('#dismiss-upgrade-nudge').click(function(e) {
            e.preventDefault();
            $.ajax({
               url: ajaxurl,
               data: {
                  'action':'dismiss_upgrade_nudge',
                  'nonce': adminPageVars.nonce
               },
               success:function(data) {
                  $('.asenha-upgrade-nudge').hide();
                  // $('#bottom-upgrade-nudge').show();
               },
               error:function(errorThrown) {
                  console.log(errorThrown);
               }
            });
         });

      }
      
      // =============== SPONSORSHIP =================

      // Stats on saving changes from asenha_admin_scripts() wp_localize_script() is availble in the 'asenhaStats' object-----
      // console.log( asenhaStats );
      // alert(JSON.stringify(asenhaStats));
      if ( asenhaStats.showSupportNudge ) {
         $('.asenha-support-nudge').show();
      } else {
         $('.asenha-support-nudge').hide();
      }

      $('#have-shared,#have-reviewed').click(function(e) {
         e.preventDefault();
         // $.ajax({
         //    url: 'https://bowo.io/asenha-sp-ndg',
         //    method: 'GET',
         //    dataType: 'jsonp',
         //    crossDomain: true
         // });
         $.ajax({
            url: ajaxurl,
            data: {
               'action':'have_supported',
               'nonce': adminPageVars.nonce
            },
            success:function(data) {
               $('.asenha-support-nudge').hide();
            },
            error:function(errorThrown) {
               console.log(errorThrown);
            }
         });
      });
      
      $('#support-nudge-dismiss').click(function(e) {
         e.preventDefault();
         // $.ajax({
         //    url: 'https://bowo.io/asenha-sp-ndg',
         //    method: 'GET',
         //    dataType: 'jsonp',
         //    crossDomain: true
         // });
         $.ajax({
            url: ajaxurl,
            data: {
               'action':'dismiss_support_nudge',
               'nonce': adminPageVars.nonce
            },
            success:function(data) {
               $('.asenha-support-nudge').hide();
            },
            error:function(errorThrown) {
               console.log(errorThrown);
            }
         });
      });

      // Expand support notice | Modified from https://codepen.io/symonsays/pen/rzgEgY
      $('.asenha-support-nudge.nudge-show-more > .show-more').click(function(e) {

         e.preventDefault();

         var $this = $(this);
         $this.toggleClass('show-more');
         $this.hide();

         if ($this.hasClass('show-more')) {
            $this.next().removeClass('opened',0);
         } else {
            $this.next().addClass('opened',0);
         }

      });

      // Collapse support notice | Modified from https://codepen.io/symonsays/pen/rzgEgY
      $('#support-nudge-show-less').click(function(e) {

         e.preventDefault();

         $('.nudge-wrapper-show-more').removeClass('opened',0);
         $('#support-nudge-show-moreless').addClass('show-more');
         $('#support-nudge-show-moreless').show();

      });

      /*! <fs_premium_only> */      
      // Open Export / Import settings
      if ( $('#settings-export-import').length ) {
         // Auto-open + scroll to a specific export/import section
         // e.g. tools.php?page=admin-site-enhancements&asenha_open_export_import=1&asenha_scroll_to=code_snippets#custom-code
         try {
            var urlParams = new URLSearchParams(window.location.search);
            if ( '1' === urlParams.get('asenha_open_export_import') && $('#asenha-footer').length ) {
               $('#asenha-footer').show();

               var scrollTarget = urlParams.get('asenha_scroll_to');
               if ( 'code_snippets' === scrollTarget || 'form_builder' === scrollTarget || 'style_templates' === scrollTarget || 'export_entries' === scrollTarget ) {
                  setTimeout(function() {
                     var $target = $('#asenha-footer');

                     if ( 'form_builder' === scrollTarget ) {
                        $target = $('#asenha-export-import-form-builder');
                     } else if ( 'style_templates' === scrollTarget ) {
                        $target = $('#asenha-export-import-style-templates');
                     } else if ( 'export_entries' === scrollTarget ) {
                        $target = $('#asenha-export-import-entries');
                     } else {
                        $target = $('#asenha-export-import-code-snippets');
                     }

                     if ( ! $target.length ) {
                        $target = $('#asenha-footer');
                     }

                     if ( $target.length ) {
                        $('html, body').animate({ scrollTop: $target.offset().top - 32 }, 300);
                     }
                  }, 250);
               }
            }
         } catch (e) {
            // Fail silently if URLSearchParams is not supported.
         }

         $('body').on('click', '#settings-export-import',function(e) {
            e.preventDefault();
            $('#asenha-footer').toggle();
            var yPosition = $(window).scrollTop();
            $(window).scrollTop(yPosition+720);
            // $('html, body').animate({scrollTop: '+=720px'}, 100);
         });
      }
      /*! </fs_premium_only> */

      // Modal for sponsoring plugin dev and maintenance: https://stephanwagner.me/jBox

      // var sponsorModal = new jBox('Modal', {
      //    attach: '#plugin-sponsor',
      //    trigger: 'click', // or 'mouseenter'
      //    // content: 'Test'
      //    content: $('#asenha-sponsor'),
      //    width: 740, // pixels
      //    closeButton: 'box',
      //    addClass: 'plugin-sponsor-modal',
      //    overlayClass: 'plugin-sponsor-modal-overlay',
      //    target: '#wpwrap', // where to anchor the modal
      //    position: {
      //       x: 'center',
      //       y: 'top'
      //    },
      //    // fade: 1000,
      //    animation: {
      //       open: 'slide:top',
      //       close: 'slide:top'
      //    }
      // });
      
      // $('#plugin-sponsor').click( function() {
      //    $.ajax({
      //       url: 'https://bowo.io/asenha-sp-btn',
      //       method: 'GET',
      //       dataType: 'jsonp',
      //       crossDomain: true
      //       // success: function(response) {
      //       //    console.log(response);
      //       // }
      //    });
      // });

   }); // END OF $(document).ready()

})( jQuery );