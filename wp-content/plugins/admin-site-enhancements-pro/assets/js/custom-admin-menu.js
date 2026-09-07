(function( $ ) {
   'use strict';

   /**
    * Get an element by ID without using CSS selector parsing.
    *
    * This avoids jQuery selector syntax errors when IDs contain percent-encoded
    * sequences (e.g. %e3%83...) which can happen for multibyte site languages.
    *
    * @param {string} id Element ID (without '#').
    * @return {Object} jQuery object (empty set when not found).
    */
   function asenhaGetById( id ) {
      var el = document.getElementById( id );
      return el ? $( el ) : $();
   }

   /*! <fs_premium_only> */
   /**
    * Sync the custom parent menu UI with the selected target type.
    *
    * @param {Object}  menuItem    Parent menu item element.
    * @param {string}  targetType  Selected target type.
    * @param {boolean} isSavedItem Whether this is an already-saved custom menu.
    */
   function syncCustomMenuTargetTypeUi( menuItem, targetType, isSavedItem ) {
      var optionsPanel = menuItem.find( '.custom-menu-options-panel' );
      var urlFieldSelector = isSavedItem ? '.custom-menu-url-field-saved' : '.custom-menu-url-field';
      var iconFieldSelector = isSavedItem ? '.custom-menu-icon-field-saved' : '.custom-menu-icon-field';
      var stylingFieldSelector = isSavedItem ? '.custom-menu-styling-options-saved' : '.custom-menu-styling-options';
      var isTargetNone = targetType === 'none';

      menuItem.find( '.menu-item-handle' ).toggleClass( 'menu-item-target-none', isTargetNone );

      if ( isTargetNone ) {
         optionsPanel.find( urlFieldSelector ).hide();
         optionsPanel.find( iconFieldSelector ).hide();
         optionsPanel.find( stylingFieldSelector ).show();
         menuItem.find( '.submenu-wrapper' ).hide();
         menuItem.find( '.add-submenu-to-custom-parent' ).hide();
      } else {
         optionsPanel.find( urlFieldSelector ).show();
         optionsPanel.find( iconFieldSelector ).show();
         optionsPanel.find( stylingFieldSelector ).hide();
         menuItem.find( '.submenu-wrapper' ).show();
         menuItem.find( '.add-submenu-to-custom-parent' ).show();
      }
   }
   /*! </fs_premium_only> */

   // Get localized strings with fallback to empty object
   var strings = (typeof amoPageVars !== 'undefined' && amoPageVars.strings) ? amoPageVars.strings : {};

   /*! <fs_premium_only> */
   function initAmoUserExclusionsSelects( context ) {
      if ( typeof $.fn.select2 === 'undefined' ) {
         return;
      }

      $( context ).find( '.amo-user-exclusions-select' ).each( function() {
         var $select = $( this );
         var selectedUsers = $select.attr( 'data-selected-users' );
         var initialSelection = [];

         if ( $select.data( 'amo-user-select-init' ) ) {
            return;
         }

         if ( selectedUsers ) {
            try {
               initialSelection = JSON.parse( selectedUsers );
            } catch ( error ) {
               initialSelection = [];
            }
         }

         $select.select2( {
            multiple: true,
            placeholder: strings.alwaysShowUsersPlaceholder || 'Select users',
            minimumInputLength: 0,
            ajax: {
               url: ajaxurl,
               type: 'POST',
               dataType: 'json',
               quietMillis: 250,
               data: function( term ) {
                  return {
                     action: 'search_users_for_admin_menu_visibility',
                     nonce: amoPageVars.searchUsersNonce,
                     required_capability: $select.data( 'required-capability' ) || 'read',
                     search: term || ''
                  };
               },
               results: function( response ) {
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
            },
            initSelection: function( element, callback ) {
               callback( initialSelection );
            }
         } );

         $select.data( 'amo-user-select-init', true );
      } );
   }

   function resetAmoUserExclusionsSelectMarkup( context ) {
      var $context = $( context );

      $context.find( '.select2-container' ).remove();
      $context.find( '.amo-user-exclusions-select' ).each( function() {
         $( this ).removeData( 'amo-user-select-init' );
         $( this )
            .val( '' )
            .attr( 'data-selected-users', '[]' );
      } );
   }
   /*! </fs_premium_only> */

   $(document).ready( function() {

      // ----- Menu Ordering -----

      // Initialize sortable elements for parent menu items: https://api.jqueryui.com/sortable/
      $('#custom-admin-menu').sortable({
         items: '> li',
         opacity: 0.6,
         placeholder: 'sortable-placeholder',
         tolerance: 'pointer',
         revert: 250
      });

      // Get the default/current menu order
      let menuOrder = $('#custom-admin-menu').sortable("toArray").toString();

      // Set hidden input value for saving in options
      document.getElementById('custom_menu_order').value = menuOrder;

      // Save custom order into a comma-separated string, triggerred after each drag and drop of menu item
      // https://api.jqueryui.com/sortable/#event-update
      // https://api.jqueryui.com/sortable/#method-toArray
      $('#custom-admin-menu').on( 'sortupdate', function( event, ui) {

         // Get the updated menu order
         let menuOrder = $('#custom-admin-menu').sortable("toArray").toString();

         // Set hidden input value for saving in options
         document.getElementById('custom_menu_order').value = menuOrder;

      });

      /*! <fs_premium_only> */
      // Prepare variables to store submenu items order
      var submenuSortableId = '',
          submenuOrder = {}; // New object to hold values of submenu items order

      // Initialize sortable elements for submenu items: https://api.jqueryui.com/sortable/
      $('.submenu-sortable').each(function() {
         submenuSortableId = $(this).attr('id');

         $(this).sortable({
            containment: $(this),
            items: '> li',
            opacity: 0.6,
            placeholder: 'submenu-sortable-placeholder',
            tolerance: 'pointer',
            revert: 250
         });
      });

      // Store current submenus items order for saving to options
      $('.submenu-sortable').each(function() {
         submenuSortableId = $(this).attr('id');

         // Get the default/current menu order
         submenuOrder[submenuSortableId] = $(this).sortable("toArray").toString();

         // Set hidden input value for saving in options
         document.getElementById('custom_submenus_order').value = JSON.stringify(submenuOrder);
      });

      // Update submenus items order for saving to options
      $('.submenu-sortable').on('sortupdate', function( event, ui) {
         submenuSortableId = $(this).attr('id');
         submenuOrder[submenuSortableId] = $(this).sortable("toArray").toString();
         document.getElementById('custom_submenus_order').value = JSON.stringify(submenuOrder);
      });
      
      // Sync target type UI on page load for saved custom parent menus.
      $('.parent-menu-item[data-custom-menu-item="yes"]').each(function() {
         var parentMenuItem = $(this);
         var checkedTargetType = parentMenuItem.find('.custom-menu-target-type-saved:checked');

         if (checkedTargetType.length > 0) {
            syncCustomMenuTargetTypeUi(parentMenuItem, checkedTargetType.val(), true);
         }
      });
      
      // Hide Target URL field on page load for custom menus that have submenus.
      $('.parent-menu-item[data-custom-menu-item="yes"]').each(function() {
         var parentMenuItem = $(this);
         // Check if this menu has submenus (indicated by presence of .submenu-toggle)
         if (parentMenuItem.find('.submenu-toggle').length > 0) {
            var menuId = parentMenuItem.attr('id');
            var optionsPanel = asenhaGetById('options-for-' + menuId);

            optionsPanel.find('.custom-menu-target-url, .custom-menu-target-url-saved').closest('.custom-menu-field').hide();
         }
      });
      
      // Toggle submenu items
      $('#custom-admin-menu').on('click', '.submenu-toggle', function() {
         $(this).children('.arrow-right').toggleClass('rotate-down');
         var submenuWrapper = $(this).parents('.menu-item').find('.submenu-wrapper');
         if (submenuWrapper.is(':visible')) {
            submenuWrapper.slideUp(150);
         } else {
            submenuWrapper.slideDown(150);
         }
      });

      // Prepare constant to store IDs of menu items that will be hidden
      var hiddenMenuByRoleInput = document.getElementById('custom_menu_always_hidden');
      if ( hiddenMenuByRoleInput && hiddenMenuByRoleInput.value ) {
         var menuAlwaysHidden = JSON.parse(hiddenMenuByRoleInput.value); // object
      } else {
         var menuAlwaysHidden = {}; // object
      }

      // Initialize object to store hidden menus and set check mark of 'Hide' checkbox
      $('.parent-menu-hide-checkbox-prm').each(function() {
         initMenuAlwaysHidden(menuAlwaysHidden,this);
      });

      // Toggle options panel for hiding parent menu items
      $('#custom-admin-menu').on('click', '.parent-menu-hide-checkbox-prm', function() {
         var menuId = $(this).data('menu-item-id'); // may contain transformed ID
         if ($(this).is(':checked')) {
            asenhaGetById('options-for-' + menuId).show();
            asenhaGetById('all-selected-roles-options-for-' + menuId).show();
         } else {
            asenhaGetById('options-for-' + menuId).hide();
            asenhaGetById('hide-until-toggled-for-' + menuId).prop('checked', false);
            asenhaGetById('hide-by-role-for-' + menuId).prop('checked', false);
            asenhaGetById('all-selected-roles-radio-for-' + menuId).hide();
            asenhaGetById('hide-for-roles-' + menuId).hide();
            asenhaGetById('menu-required-capability-for-' + menuId).hide();
            asenhaGetById('always-show-for-users-for-' + menuId).hide();
            menuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            menuAlwaysHidden[menuId]['always_hide'] = false;
            menuAlwaysHidden[menuId]['always_show_for_users'] = [];
         }
         if ( asenhaGetById('options-for-' + menuId).is(':visible') ) {
            $(this).parent().next('.options-toggle').children('.arrow-right').addClass('rotate-down');
         } else {
            $(this).parent().next('.options-toggle').children('.arrow-right').removeClass('rotate-down');            
         }
         document.getElementById('custom_menu_always_hidden').value = JSON.stringify(menuAlwaysHidden);
      });

      // On clicking "Hide until toggled" on parent menu items
      $('#custom-admin-menu').on('click', '.hide-until-toggled-checkbox', function() {
         var menuId = $(this).data('menu-item-id'); // may contain transformed ID
         if ($(this).is(':checked')) {
            menuAlwaysHidden[menuId]['hide_by_toggle'] = true;
            asenhaGetById('hide-status-for-' + menuId).prop('checked',true);
         } else {
            menuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            if (!asenhaGetById('hide-by-role-for-' + menuId).is(':checked')) {
               asenhaGetById('hide-status-for-' + menuId).prop('checked',false);
               // delete menuAlwaysHidden[menuId];
            }
         }
         document.getElementById('custom_menu_always_hidden').value = JSON.stringify(menuAlwaysHidden);
      });

      // Prepare constant to store IDs of submenu items that will be hidden
      var hiddenSubmenuByRoleInput = document.getElementById('custom_submenu_always_hidden');
      if ( hiddenSubmenuByRoleInput && hiddenSubmenuByRoleInput.value ) {
         var submenuAlwaysHidden = JSON.parse(hiddenSubmenuByRoleInput.value); // object
      } else {
         var submenuAlwaysHidden = {}; // object
      }

      // Initialize object to store hidden menus and set check mark of 'Hide' checkbox
      $('.submenu-hide-checkbox-prm').each(function() {
         initSubmenuAlwaysHidden(submenuAlwaysHidden,this);
      });

      initAmoUserExclusionsSelects( document );

      // Toggle options panel for hiding submenu items
      $('#custom-admin-menu').on('click', '.submenu-hide-checkbox-prm', function() {
         var menuId = $(this).data('menu-item-id'); // may contain transformed ID
         if ($(this).is(':checked')) {
            asenhaGetById('options-for-' + menuId).show();
            asenhaGetById('all-selected-roles-options-for-' + menuId).show();
         } else {
            asenhaGetById('options-for-' + menuId).hide();
            asenhaGetById('hide-until-toggled-for-' + menuId).prop('checked', false);
            asenhaGetById('hide-by-role-for-' + menuId).prop('checked', false);
            asenhaGetById('all-selected-roles-radio-for-' + menuId).hide();
            asenhaGetById('hide-for-roles-' + menuId).hide();
            asenhaGetById('menu-required-capability-for-' + menuId).hide();
            asenhaGetById('always-show-for-users-for-' + menuId).hide();
            submenuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            submenuAlwaysHidden[menuId]['always_hide'] = false;
            submenuAlwaysHidden[menuId]['always_show_for_users'] = [];
         }
         if ( asenhaGetById('options-for-' + menuId).is(':visible') ) {
            $(this).parent().next('.options-toggle').children('.arrow-right').addClass('rotate-down');
         } else {
            $(this).parent().next('.options-toggle').children('.arrow-right').removeClass('rotate-down');            
         }
         document.getElementById('custom_submenu_always_hidden').value = JSON.stringify(submenuAlwaysHidden);
      });
      
      // On clicking "Hide until toggled" on submenu items
      $('#custom-admin-menu').on('click', '.hide-until-toggled-submenu-checkbox', function() {
         var menuId = $(this).data('menu-item-id'); // may contain transformed ID
         if ($(this).is(':checked')) {
            submenuAlwaysHidden[menuId]['hide_by_toggle'] = true;
            asenhaGetById('hide-status-for-' + menuId).prop('checked',true);
         } else {
            submenuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            if (!asenhaGetById('hide-by-role-for-' + menuId).is(':checked')) {
               asenhaGetById('hide-status-for-' + menuId).prop('checked',false);
               // delete submenuAlwaysHidden[menuId];
            }
         }
         // console.log('submenuAlwaysHidden:');
         // console.log(submenuAlwaysHidden);
         document.getElementById('custom_submenu_always_hidden').value = JSON.stringify(submenuAlwaysHidden);
      });
      
      // On clicking the "Options" toggle
      $('#custom-admin-menu').on('click', '.options-toggle', function() {
         $(this).children('.arrow-right').toggleClass('rotate-down');
         var menuId = $(this).data('menu-item-id');
         asenhaGetById('options-for-' + menuId).toggle();
         if (!asenhaGetById('hide-until-toggled-for-' + menuId).is(':checked') && !asenhaGetById('hide-by-role-for-' + menuId).is(':checked')) {
            asenhaGetById('hide-status-for-' + menuId).prop('checked', false);
         }
      });
            
      // Set checked status of 'Always Hide for user role(s)' checkbox and show sub-options accordingly
      $('.hide-by-role-checkbox').each(function() {
         var menuId = $(this).data('menu-item-id');
         if ( $(this).is(':checked') ) {
            asenhaGetById('hide-status-for-' + menuId).prop('checked', true);
            asenhaGetById('all-selected-roles-options-for-' + menuId).show();
            asenhaGetById('all-selected-roles-radio-for-' + menuId).show();
            asenhaGetById('always-show-for-users-for-' + menuId).show();
            if ( asenhaGetById('all-roles-except-for-' + menuId).is(':checked') || asenhaGetById('selected-roles-for-' + menuId).is(':checked') ) {
               asenhaGetById('hide-for-roles-' + menuId).show();
               asenhaGetById('menu-required-capability-for-' + menuId).show();
            }
         }
      });
      
      // Handle checkbox to always hide and for which
      $('#custom-admin-menu').on('click', '.hide-by-role-checkbox', function() {
         var menuId = $(this).data('menu-item-id');
         var menuType = $(this).data('menu-type'); // 'parent' (menu) or 'sub' (menu)
         // console.log( '.hide-by-role-checkbox >> menuId: ' + menuId + ' // menuType: ' + menuType );
         asenhaGetById('hide-status-for-' + menuId).prop('checked', true);
         asenhaGetById('hide-until-toggled-for-' + menuId).prop('checked', false);
         
         // For a parent menu item
         if ( menuType == 'parent' ) {
            if (typeof menuAlwaysHidden[menuId] === 'undefined') {
               menuAlwaysHidden[menuId] = {};
            }            
            menuAlwaysHidden[menuId]['hide_by_toggle'] = false;
         }
         // For a submenu item
         if ( menuType == 'sub' ) {
            if (typeof submenuAlwaysHidden[menuId] === 'undefined') {
               submenuAlwaysHidden[menuId] = {};
            }            
            submenuAlwaysHidden[menuId]['hide_by_toggle'] = false;
         }

         if ($(this).is(':checked')) {
            // For a parent menu item
            if ( menuType == 'parent' ) {
               menuAlwaysHidden[menuId]['always_hide'] = true;
            }
            // For a submenu item
            if ( menuType == 'sub' ) {
               submenuAlwaysHidden[menuId]['always_hide'] = true;
            }
            asenhaGetById('all-selected-roles-radio-for-' + menuId).show();
            asenhaGetById('always-show-for-users-for-' + menuId).show();
            if (asenhaGetById('all-roles-except-for-' + menuId).is(':checked') || asenhaGetById('selected-roles-for-' + menuId).is(':checked')) {
               asenhaGetById('hide-for-roles-' + menuId).show();
               asenhaGetById('menu-required-capability-for-' + menuId).show();
               if (asenhaGetById('selected-roles-for-' + menuId).is(':checked')) {
                  // For a parent menu item
                  if ( menuType == 'parent' ) {
                     menuAlwaysHidden[menuId]['always_hide_for'] = 'selected-roles';
                  }
                  // For a submenu item
                  if ( menuType == 'sub' ) {
                     submenuAlwaysHidden[menuId]['always_hide_for'] = 'selected-roles';                  
                  }
               } else if ( asenhaGetById('all-roles-except-for-' + menuId).is(':checked') ) {
                  // For a parent menu item
                  if ( menuType == 'parent' ) {
                     menuAlwaysHidden[menuId]['always_hide_for'] = 'all-roles-except';
                  }
                  // For a submenu item
                  if ( menuType == 'sub' ) {
                     submenuAlwaysHidden[menuId]['always_hide_for'] = 'all-roles-except';                  
                  }
               }

            } else if ( asenhaGetById('all-roles-for-' + menuId).is(':checked') ) {
               // For a parent menu item
               if ( menuType == 'parent' ) {
                  menuAlwaysHidden[menuId]['always_hide_for'] = 'all-roles';
               }
               // For a submenu item
               if ( menuType == 'sub' ) {
                  submenuAlwaysHidden[menuId]['always_hide_for'] = 'all-roles';               
               }
            }
         } else {
            // For a parent menu item
            if ( menuType == 'parent' ) {
               menuAlwaysHidden[menuId]['always_hide'] = false;
               menuAlwaysHidden[menuId]['always_hide_for'] = '';
               menuAlwaysHidden[menuId]['which_roles'] = [];
               menuAlwaysHidden[menuId]['always_show_for_users'] = [];
            }
            // For a submenu item
            if ( menuType == 'sub' ) {
               submenuAlwaysHidden[menuId]['always_hide'] = false;
               submenuAlwaysHidden[menuId]['always_hide_for'] = '';
               submenuAlwaysHidden[menuId]['which_roles'] = [];
               submenuAlwaysHidden[menuId]['always_show_for_users'] = [];
            }

            asenhaGetById('all-selected-roles-radio-for-' + menuId).hide();
            asenhaGetById('hide-for-roles-' + menuId).hide();
            asenhaGetById('menu-required-capability-for-' + menuId).hide();
            asenhaGetById('always-show-for-users-for-' + menuId).hide();
            asenhaGetById('always-show-for-users-select-' + menuId).val('').attr('data-selected-users', '[]').trigger('change');
            if (!asenhaGetById('hide-until-toggled-for-' + menuId).is(':checked')) {
               asenhaGetById('hide-status-for-' + menuId).prop('checked',false);
            }
         }

         // For a parent menu item
         if ( menuType == 'parent' ) {
            document.getElementById('custom_menu_always_hidden').value = JSON.stringify(menuAlwaysHidden);
         }
         // For a submenu item
         if ( menuType == 'sub' ) {
            document.getElementById('custom_submenu_always_hidden').value = JSON.stringify(submenuAlwaysHidden);         
         }
      });

      // Handle selection of roles scope
      $('#custom-admin-menu').on('change', '.all-selected-roles-radios', function() {
         var menuId = $(this).data('menu-item-id');
         var menuType = $(this).data('menu-type'); // 'parent' (menu) or 'sub' (menu)
         // console.log( '.all-selected-roles-radios >> menuId: ' + menuId + ' // menuType: ' + menuType );
         if (this.value == 'all-roles-except' || this.value == 'selected-roles') {
            asenhaGetById('hide-for-roles-' + menuId).show();
            asenhaGetById('menu-required-capability-for-' + menuId).show();
            asenhaGetById('always-show-for-users-for-' + menuId).show();
            if (this.value == 'all-roles-except') {
               if ( menuType == 'parent' ) {
                  menuAlwaysHidden[menuId]['always_hide_for'] = 'all-roles-except';
               }
               // For a submenu item
               if ( menuType == 'sub' ) {
                  submenuAlwaysHidden[menuId]['always_hide_for'] = 'all-roles-except';
               }
            } else if (this.value == 'selected-roles') {
               if ( menuType == 'parent' ) {
                  menuAlwaysHidden[menuId]['always_hide_for'] = 'selected-roles';
               }
               // For a submenu item
               if ( menuType == 'sub' ) {
                  submenuAlwaysHidden[menuId]['always_hide_for'] = 'selected-roles';
               }
            }
         } else if ( this.value == 'all-roles' ) {
            if ( menuType == 'parent' ) {
               menuAlwaysHidden[menuId]['always_hide_for'] = 'all-roles';
               menuAlwaysHidden[menuId]['which_roles'] = [];
            }
            // For a submenu item
            if ( menuType == 'sub' ) {
               submenuAlwaysHidden[menuId]['always_hide_for'] = 'all-roles';
               submenuAlwaysHidden[menuId]['which_roles'] = [];
            }

            asenhaGetById('hide-until-toggled-for-' + menuId).prop('checked',false);

            if ( menuType == 'parent' ) {
               menuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            }
            // For a submenu item
            if ( menuType == 'sub' ) {
               submenuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            }

            asenhaGetById('hide-for-roles-' + menuId).hide();
            asenhaGetById('menu-required-capability-for-' + menuId).hide();
            asenhaGetById('always-show-for-users-for-' + menuId).show();
         }

         if ( menuType == 'parent' ) {
            document.getElementById('custom_menu_always_hidden').value = JSON.stringify(menuAlwaysHidden);
         }
         // For a submenu item
         if ( menuType == 'sub' ) {
            document.getElementById('custom_submenu_always_hidden').value = JSON.stringify(submenuAlwaysHidden);
         }
      });

      // Store role checkboxes selection
      $('#custom-admin-menu').on('click', '.role-checkbox', function() {
         var menuId = $(this).parent().parent().data('menu-item-id');
         var menuType = $(this).parent().parent().data('menu-type'); // 'parent' (menu) or 'sub' (menu)
         // console.log( '.role-checkbox >> menuId: ' + menuId + ' // menuType: ' + menuType );
         var roleSlug = $(this).data('role');

         // For a parent menu item
         if ( menuType == 'parent' ) {
            if ( ! menuAlwaysHidden[menuId]['which_roles'] ) {
               menuAlwaysHidden[menuId]['which_roles'] = []; // initialize array          
            }
            if ($(this).is(':checked')) {
               menuAlwaysHidden[menuId]['which_roles'].push(roleSlug);            
            } else {
               const parentIndex = menuAlwaysHidden[menuId]['which_roles'].indexOf(roleSlug);
               menuAlwaysHidden[menuId]['which_roles'].splice(parentIndex,1);
            }
            document.getElementById('custom_menu_always_hidden').value = JSON.stringify(menuAlwaysHidden);            
         }

         // For a submenu item
         if ( menuType == 'sub' ) {
            if ( ! submenuAlwaysHidden[menuId]['which_roles'] ) {
               submenuAlwaysHidden[menuId]['which_roles'] = []; // initialize array          
            }
            if ($(this).is(':checked')) {
               submenuAlwaysHidden[menuId]['which_roles'].push(roleSlug);            
            } else {
               const subIndex = submenuAlwaysHidden[menuId]['which_roles'].indexOf(roleSlug);
               submenuAlwaysHidden[menuId]['which_roles'].splice(subIndex,1);
            }
            // console.log("submenuAlwaysHidden[menuId]['which_roles']");
            // console.log(submenuAlwaysHidden[menuId]['which_roles']);
            document.getElementById('custom_submenu_always_hidden').value = JSON.stringify(submenuAlwaysHidden);            
         }
      });

      $('#custom-admin-menu').on('change', '.amo-user-exclusions-select', function() {
         var menuId = $(this).data('menu-item-id');
         var menuType = $(this).data('menu-type');
         var selectedUserIdsRaw = $(this).select2('val');
         var requiredCapability = $(this).data('required-capability') || '';

         if ( typeof selectedUserIdsRaw === 'string' ) {
            selectedUserIdsRaw = selectedUserIdsRaw.length ? selectedUserIdsRaw.split(',') : [];
         } else if ( ! $.isArray( selectedUserIdsRaw ) ) {
            selectedUserIdsRaw = [];
         }

         var selectedUsers = selectedUserIdsRaw.map(function(userId) {
            return parseInt(userId, 10);
         }).filter(function(userId) {
            return !isNaN(userId) && userId > 0;
         });

         if ( menuType == 'parent' ) {
            if ( ! menuAlwaysHidden[menuId] ) {
               menuAlwaysHidden[menuId] = {};
            }

            menuAlwaysHidden[menuId]['required_capability'] = requiredCapability;
            menuAlwaysHidden[menuId]['always_show_for_users'] = selectedUsers;
            document.getElementById('custom_menu_always_hidden').value = JSON.stringify(menuAlwaysHidden);
         }

         if ( menuType == 'sub' ) {
            if ( ! submenuAlwaysHidden[menuId] ) {
               submenuAlwaysHidden[menuId] = {};
            }

            submenuAlwaysHidden[menuId]['required_capability'] = requiredCapability;
            submenuAlwaysHidden[menuId]['always_show_for_users'] = selectedUsers;
            document.getElementById('custom_submenu_always_hidden').value = JSON.stringify(submenuAlwaysHidden);
         }
      });

      $('#custom-admin-menu').on('change', '.custom-menu-capability-saved, .custom-menu-capability', function() {
         var requiredCapability = $(this).val();
         var menuItem = $(this).closest('.menu-item');
         var userExclusionsField = menuItem.find('.amo-user-exclusions-select');
         var hideCheckbox = menuItem.find('.parent-menu-hide-checkbox-prm, .submenu-hide-checkbox-prm').first();
         var ruleId = hideCheckbox.data('menu-item-id');

         userExclusionsField
            .attr('data-required-capability', requiredCapability)
            .data('required-capability', requiredCapability);

         hideCheckbox
            .attr('data-required-capability', requiredCapability)
            .data('required-capability', requiredCapability);

         if ( hideCheckbox.hasClass('parent-menu-hide-checkbox-prm') && menuAlwaysHidden[ruleId] ) {
            menuAlwaysHidden[ruleId]['required_capability'] = requiredCapability;
            document.getElementById('custom_menu_always_hidden').value = JSON.stringify(menuAlwaysHidden);
         }

         if ( hideCheckbox.hasClass('submenu-hide-checkbox-prm') && submenuAlwaysHidden[ruleId] ) {
            submenuAlwaysHidden[ruleId]['required_capability'] = requiredCapability;
            document.getElementById('custom_submenu_always_hidden').value = JSON.stringify(submenuAlwaysHidden);
         }
      });

      // Prepare constant to store IDs of new separator menu items
      var newSeparatorsInput = document.getElementById('custom_menu_new_separators');
      if ( newSeparatorsInput && newSeparatorsInput.value ) {
         var newSeparators = JSON.parse(newSeparatorsInput.value); // object
      } else {
         var newSeparators = {}; // object
      }

      // Prepare storage for deleted built-in separators
      var deletedSeparatorsInput = document.getElementById('custom_menu_deleted_separators');
      if ( deletedSeparatorsInput && deletedSeparatorsInput.value ) {
         var deletedSeparators = JSON.parse(deletedSeparatorsInput.value); // array
      } else {
         var deletedSeparators = []; // array
      }

      // Add new separator
      $('.admin-menu-organizer-main').on('click', '#add-menu-separator', function(e) {
         e.preventDefault();
         // console.log('Adding new separator...');
         var separatorCount = $('#custom-admin-menu li[id^="separator"]').length;
         separatorCount++;
         // console.log('separatorCount: '+separatorCount);
         while (document.getElementById('separator'+separatorCount)) {
            separatorCount++;
         }
         addNewSeparator(menuAlwaysHidden,newSeparators,separatorCount);
         $('#custom-admin-menu').sortable('refresh');
         
         // Update menu order after adding new separator
         var menuOrder = $('#custom-admin-menu').sortable("toArray").toString();
         document.getElementById('custom_menu_order').value = menuOrder;
      });
      
      // Remove separator (built-in or custom)
      $('#custom-admin-menu').on('click', '.remove-menu-item', function(e) {
         var separator = $(this).parents('.menu-item.parent-menu-item');
         var separatorId = separator.attr('id');
         
         // Check if this is a built-in separator (separator1, separator2, separator-last)
         var builtInSeparators = ['separator1', 'separator2', 'separator-last'];
         
         if (builtInSeparators.includes(separatorId)) {
            // Track deleted built-in separator
            if (!deletedSeparators.includes(separatorId)) {
               deletedSeparators.push(separatorId);
            }
            document.getElementById('custom_menu_deleted_separators').value = JSON.stringify(deletedSeparators);
         } else {
            // Handle custom separator deletion (existing logic)
            dontSaveNewSeparator(newSeparators, separator);
         }
         
         // Remove from DOM
         separator.remove();
         $('#custom-admin-menu').sortable('refresh');
      });

      // ----- Custom Menu Items -----
      
      // Prepare storage for new custom menu items
      var newCustomMenus = {};
      var newCustomMenusInput = document.getElementById('custom_menu_new_items');
      if ( newCustomMenusInput && newCustomMenusInput.value ) {
         newCustomMenus = JSON.parse(newCustomMenusInput.value);
      }

      // Add custom menu click handler (parent level)
      $('#add-custom-menu').on('click', function(e) {
         e.preventDefault();
         var customMenuCount = $('#custom-admin-menu li[id^="custom-menu-"]').length;
         // console.log('Current custom menu count:', customMenuCount);
         // console.log('Custom menus found:', $('#custom-admin-menu li[id^="custom-menu-"]').map(function() { 
         //    return {id: this.id, slug: $(this).data('menu-slug'), customItem: $(this).data('custom-menu-item')}; 
         // }).get());
         // console.log('newCustomMenus object:', newCustomMenus);
         // console.log('Hidden field value:', document.getElementById('custom_menu_new_items').value);
         customMenuCount++;
         while (document.getElementById('custom-menu-'+customMenuCount)) {
            customMenuCount++;
         }
         // console.log('Creating new menu with ID: custom-menu-' + customMenuCount);
         addNewCustomMenu(menuAlwaysHidden, newCustomMenus, customMenuCount, false, '', null);
         $('#custom-admin-menu').sortable('refresh');
         
         // Update menu order after adding new menu
         var menuOrder = $('#custom-admin-menu').sortable("toArray").toString();
         document.getElementById('custom_menu_order').value = menuOrder;
         // console.log('Updated menu order:', menuOrder);
      });

      // Add custom submenu click handler
      $('#custom-admin-menu').on('click', '.add-custom-submenu', function(e) {
         e.preventDefault();
         var parentMenuId = $(this).data('parent-menu-id');
         var parentMenuElement = $(this).closest('.menu-item.parent-menu-item');
         var submenuSortable = parentMenuElement.find('.submenu-sortable');
         var customMenuCount = $('#custom-admin-menu li[id^="custom-submenu-"]').length;
         customMenuCount++;
         while ($('#custom-submenu-'+customMenuCount).length > 0) {
            customMenuCount++;
         }
         addNewCustomMenu(menuAlwaysHidden, newCustomMenus, customMenuCount, true, parentMenuId, submenuSortable);
         submenuSortable.sortable('refresh');
      });

      // Add submenu to custom parent menu that doesn't have one yet
      $('#custom-admin-menu').on('click', '.add-submenu-to-custom-parent', function(e) {
         e.preventDefault();
         var parentMenuId = $(this).data('parent-menu-id');
         var parentMenuElement = $(this).closest('.menu-item.parent-menu-item');
         
         // Create submenu wrapper HTML
         var triangleIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 16 16"><path fill="currentColor" d="M14.222 6.687a1.5 1.5 0 0 1 0 2.629l-10 5.499A1.5 1.5 0 0 1 2 13.5V2.502a1.5 1.5 0 0 1 2.223-1.314z"/></svg>';
         var submenuHtml = '<div class="submenu-wrapper" style="display: block;">';
         submenuHtml += '<ul id="' + parentMenuId + '" class="submenu submenu-sortable">';
         submenuHtml += '<div class="submenu-actions">';
         submenuHtml += '<a href="#" class="add-custom-submenu" data-parent-menu-id="' + parentMenuId + '">' + (strings.addMenu || 'Add Menu') + '</a>';
         submenuHtml += '</div>';
         submenuHtml += '</ul></div>';
         
         // Insert submenu wrapper before the remove-menu-item div or remove-custom-menu-item-saved div
         var removeButton = parentMenuElement.find('.remove-menu-item, .remove-custom-menu-item-saved').first();
         if (removeButton.length > 0) {
            removeButton.before(submenuHtml);
         } else {
            parentMenuElement.append(submenuHtml);
         }
         
         // Add submenu toggle to title wrapper if not present
         var titleWrapper = parentMenuElement.find('.title-wrapper');
         if (titleWrapper.find('.submenu-toggle').length === 0) {
            titleWrapper.find('.menu-item-title').after('<div class="submenu-toggle"><span class="arrow-right rotate-down">' + triangleIcon + '</span><span class="submenu-text">' + (strings.submenu || 'Submenu') + '</span></div>');
         }
         
         // Hide the "Add Submenu" link
         $(this).hide();
         
         // Hide the Target URL field since parent menus with submenus don't need it
         var optionsPanel = asenhaGetById('options-for-' + parentMenuId);
         optionsPanel.find('.custom-menu-target-url, .custom-menu-target-url-saved').closest('.custom-menu-field').hide();
         
         // Get the submenu sortable
         var submenuSortable = parentMenuElement.find('.submenu-sortable');
         
         // Initialize sortable on new submenu
         submenuSortable.sortable({
            containment: submenuSortable,
            items: '> li',
            opacity: 0.6,
            placeholder: 'submenu-sortable-placeholder',
            tolerance: 'pointer',
            revert: 250
         });
         
         // Set up sortable update handler for this new submenu
         submenuSortable.on('sortupdate', function(event, ui) {
            var submenuSortableId = $(this).attr('id');
            submenuOrder[submenuSortableId] = $(this).sortable("toArray").toString();
            document.getElementById('custom_submenus_order').value = JSON.stringify(submenuOrder);
         });
         
         // Add first submenu item - count existing submenu items to avoid ID collisions
         var customMenuCount = $('#custom-admin-menu li[id^="custom-submenu-"]').length;
         customMenuCount++;
         while ($('#custom-submenu-'+customMenuCount).length > 0) {
            customMenuCount++;
         }
         addNewCustomMenu(menuAlwaysHidden, newCustomMenus, customMenuCount, true, parentMenuId, submenuSortable);
         submenuSortable.sortable('refresh');
         
         // Update submenu order
         var submenuSortableId = submenuSortable.attr('id');
         submenuOrder[submenuSortableId] = submenuSortable.sortable("toArray").toString();
         document.getElementById('custom_submenus_order').value = JSON.stringify(submenuOrder);
      });

      // Remove custom menu item handler (works for both parent and submenu items)
      $('#custom-admin-menu').on('click', '.remove-custom-menu-item', function(e) {
         e.preventDefault();
         var customMenuItem = $(this).closest('.menu-item');
         var isSubmenuItem = customMenuItem.hasClass('submenu-item');
         
         // Remove from data storage
         dontSaveNewCustomMenu(newCustomMenus, customMenuItem);
         
         // Remove from DOM
         customMenuItem.remove();
         
         // Refresh appropriate sortable
         if (isSubmenuItem) {
            // For submenu items, refresh the submenu sortable
            $('.submenu-sortable').sortable('refresh');
         } else {
            // For parent menu items, refresh the main sortable
            $('#custom-admin-menu').sortable('refresh');
         }
      });

      // Initialize saved custom menu capability fields
      if (typeof amoPageVars !== 'undefined' && amoPageVars.capabilities) {
         $('.custom-menu-capability-saved').each(function() {
            var $select = $(this);
            var menuId = $select.data('menu-item-id');
            var currentValue = $select.data('current-value') || 'manage_options';
            
            var keyCapabilities = ['manage_options', 'edit_others_posts', 'edit_published_posts', 'edit_posts', 'read'];
            var coreCapabilities = amoPageVars.coreCapabilities || [];
            
            var optionsHtml = '';
            
            // Key WordPress Core Capabilities group
            optionsHtml += '<optgroup label="' + (strings.keyWpCoreCapabilities || 'Key WordPress Core Capabilities') + '">';
            for (var i = 0; i < keyCapabilities.length; i++) {
               var capability = keyCapabilities[i];
               if (amoPageVars.capabilities.hasOwnProperty(capability)) {
                  var roles = amoPageVars.capabilities[capability];
                  var rolesText = roles.length > 0 ? ' (' + roles.join(', ') + ')' : '';
                  var selected = (capability === currentValue) ? ' selected' : '';
                  optionsHtml += '<option value="' + capability + '"' + selected + '>' + capability + rolesText + '</option>';
               }
            }
            optionsHtml += '</optgroup>';
            
            // Other WordPress Core Capabilities group
            optionsHtml += '<optgroup label="' + (strings.otherWpCoreCapabilities || 'Other WordPress Core Capabilities') + '">';
            for (var capability in amoPageVars.capabilities) {
               if (amoPageVars.capabilities.hasOwnProperty(capability)) {
                  if (keyCapabilities.indexOf(capability) === -1 && coreCapabilities.indexOf(capability) !== -1) {
                     var roles = amoPageVars.capabilities[capability];
                     var rolesText = roles.length > 0 ? ' (' + roles.join(', ') + ')' : '';
                     var selected = (capability === currentValue) ? ' selected' : '';
                     optionsHtml += '<option value="' + capability + '"' + selected + '>' + capability + rolesText + '</option>';
                  }
               }
            }
            optionsHtml += '</optgroup>';
            
            // Custom Capabilities group
            optionsHtml += '<optgroup label="' + (strings.customCapabilities || 'Custom Capabilities') + '">';
            for (var capability in amoPageVars.capabilities) {
               if (amoPageVars.capabilities.hasOwnProperty(capability)) {
                  if (keyCapabilities.indexOf(capability) === -1 && coreCapabilities.indexOf(capability) === -1) {
                     var roles = amoPageVars.capabilities[capability];
                     var rolesText = roles.length > 0 ? ' (' + roles.join(', ') + ')' : '';
                     var selected = (capability === currentValue) ? ' selected' : '';
                     optionsHtml += '<option value="' + capability + '"' + selected + '>' + capability + rolesText + '</option>';
                  }
               }
            }
            optionsHtml += '</optgroup>';
            
            $select.html(optionsHtml);
            
            $select.on('change', function() {
               saveCustomMenuChange(menuId, 'capability', $(this).val());
            });
         });
      }

      // Save changes to saved custom menu fields
      function saveCustomMenuChange(menuId, field, value) {
         // Get current custom menu items
         var customMenusInput = document.getElementById('custom_menu_new_items');
         if (customMenusInput && customMenusInput.value) {
            var customMenus = JSON.parse(customMenusInput.value);
            
            if (customMenus[menuId]) {
               customMenus[menuId][field] = value;
               customMenusInput.value = JSON.stringify(customMenus);
            }
         }
      }

      // Event listeners for Target URL and Icon changes
      $('#custom-admin-menu').on('input', '.custom-menu-target-url-saved', function() {
         var menuId = $(this).data('menu-item-id');
         saveCustomMenuChange(menuId, 'url', $(this).val());
      });

   $('#custom-admin-menu').on('input', '.custom-menu-icon-saved', function() {
      var menuId = $(this).data('menu-item-id');
      saveCustomMenuChange(menuId, 'icon', $(this).val());
   });

   // Event listeners for saved custom menu styling fields
   
   // Target type change
   $('#custom-admin-menu').on('change', '.custom-menu-target-type-saved', function() {
      var menuId = $(this).data('menu-item-id');
      var targetType = $(this).val();
      var menuItem = $(this).closest('.parent-menu-item');
      
      saveCustomMenuChange(menuId, 'target_type', targetType);

      syncCustomMenuTargetTypeUi(menuItem, targetType, true);
   });
   
   // Color type change - show/hide Line Style
   $('#custom-admin-menu').on('change', '.custom-menu-color-type-saved', function() {
      var menuId = $(this).data('menu-item-id');
      var colorType = $(this).val();
      var menuItem = $(this).closest('.parent-menu-item');
      var lineStyleField = menuItem.find('.custom-menu-line-style-field-saved');
      
      saveCustomMenuChange(menuId, 'color_type', colorType);
      
      if (colorType === 'background') {
         lineStyleField.hide();
      } else {
         lineStyleField.show();
      }
   });
   
   // Text Transform change
   $('#custom-admin-menu').on('change', '.custom-menu-text-transform-saved', function() {
      var menuId = $(this).data('menu-item-id');
      saveCustomMenuChange(menuId, 'text_transform', $(this).val());
   });
   
   // Text Size change
   $('#custom-admin-menu').on('change', '.custom-menu-text-size-saved', function() {
      var menuId = $(this).data('menu-item-id');
      saveCustomMenuChange(menuId, 'text_size', $(this).val());
   });
   
   // Font Weight change
   $('#custom-admin-menu').on('change', '.custom-menu-font-weight-saved', function() {
      var menuId = $(this).data('menu-item-id');
      saveCustomMenuChange(menuId, 'font_weight', $(this).val());
   });
   
   // Alignment change
   $('#custom-admin-menu').on('change', '.custom-menu-alignment-saved', function() {
      var menuId = $(this).data('menu-item-id');
      saveCustomMenuChange(menuId, 'alignment', $(this).val());
   });
   
   // Line Style change
   $('#custom-admin-menu').on('change', '.custom-menu-line-style-saved', function() {
      var menuId = $(this).data('menu-item-id');
      saveCustomMenuChange(menuId, 'line_style', $(this).val());
   });
   
   // Initialize color picker for saved custom menus on page load
   $('.custom-menu-color-picker-saved').each(function() {
      var $this = $(this);
      var menuId = $this.data('menu-item-id');
      
      // Initialize wpColorPicker
      $this.wpColorPicker({
         change: function(event, ui) {
            var color = ui.color.toString();
            saveCustomMenuChange(menuId, 'color_value', color);
            
            // Compute text color if background is selected
            var menuItem = $this.closest('.parent-menu-item');
            var colorType = menuItem.find('.custom-menu-color-type-saved:checked').val();
            if (colorType === 'background') {
               var computedTextColor = isColorDark(color) ? '#ffffff' : '#3c434a';
               saveCustomMenuChange(menuId, 'computed_text_color', computedTextColor);
            }
         },
         clear: function() {
            saveCustomMenuChange(menuId, 'color_value', '');
         }
      });
   });

   // Event listener for custom submenu title changes
   $('#custom-admin-menu').on('input', '.custom-submenu-title-input-saved', function() {
      var menuId = $(this).data('menu-item-id');
      saveCustomMenuChange(menuId, 'title', $(this).val());
   });

      // Handle delete button click for saved custom menu items
      $('#custom-admin-menu').on('click', '.remove-custom-menu-item-saved', function(e) {
         e.preventDefault();
         var menuId = $(this).data('menu-item-id');
         
         // Since the delete button is inside the menu item, use .closest()
         var customMenuItem = $(this).closest('.menu-item');
         
         // Check if this is a submenu item by seeing if it's inside a .submenu-sortable container
         var isSubmenuItem = customMenuItem.closest('.submenu-sortable').length > 0;
         
         // Remove from custom_menu_new_items
         var customMenusInput = document.getElementById('custom_menu_new_items');
         if (customMenusInput && customMenusInput.value) {
            var customMenus = JSON.parse(customMenusInput.value);
            
            // If this is a parent menu, also delete all its submenus
            if (!isSubmenuItem) {
               // Find and delete all submenu items that have this menu as their parent
               for (var itemId in customMenus) {
                  if (customMenus.hasOwnProperty(itemId) && customMenus[itemId]['parent_id'] === menuId) {
                     delete customMenus[itemId];
                  }
               }
            }
            
            // Delete the menu item itself
            delete customMenus[menuId];
            customMenusInput.value = JSON.stringify(customMenus);
         }
         
         // Remove the menu item from DOM (this also removes the delete button inside it)
         customMenuItem.remove();
         
         // Refresh appropriate sortable
         if (isSubmenuItem) {
            $('.submenu-sortable').sortable('refresh');
         } else {
            $('#custom-admin-menu').sortable('refresh');
         }
      });

      /*! </fs_premium_only> */

      // ----- Parent Menu Item Hiding -----

      // Prepare constant to store IDs of menu items that will be hidden
      if ( document.getElementById('custom_menu_hidden') != null ) {
         var hiddenMenuItems = document.getElementById('custom_menu_hidden').value.split(","); // array
      } else {
         var hiddenMenuItems = []; // array
      }


      // Detect which menu items are being checked. Ref: https://stackoverflow.com/a/3871602
      Array.from(document.getElementsByClassName('parent-menu-hide-checkbox')).forEach(function(item,index,array) {

         item.addEventListener('click', event => {

            if (event.target.checked) {

               // Add ID of menu item to array
               hiddenMenuItems.push(event.target.dataset.menuItemId);
               
            } else {

               // Remove ID of menu item from array
               const start = hiddenMenuItems.indexOf(event.target.dataset.menuItemId);
               const deleteCount = 1;
               hiddenMenuItems.splice(start, deleteCount);

            }

            // Set hidden input value
            document.getElementById('custom_menu_hidden').value = hiddenMenuItems;

         });

      });

      // Clicking on header save button
      $('#amo-save-changes').click( function(e) {

         e.preventDefault();

         // Prepare variable to store ID-Title pairs of menu items
         var customMenuTitles = []; // empty array

         // Initialize other variables
         var menuItemId = '';
         var customTitle = '';

         // Save default/custom title values. Ref: https://stackoverflow.com/a/3871602
         Array.from(document.getElementsByClassName('menu-item-custom-title')).forEach(function(item,index,array) {

            menuItemId = item.dataset.menuItemId;
            customTitle = item.value;
            customMenuTitles.push(menuItemId + '__' + customTitle);            

         });

         // Set hidden input value
         document.getElementById('custom_menu_titles').value = customMenuTitles;

      });

      /*! <fs_premium_only> */
      // Initialize accordions for saved custom menu styling options
      $('.custom-menu-styling-options-saved .asenha-accordion-trigger').on('click', function() {
         var $button = $(this);
         var $panel = $button.closest('.asenha-accordion').find('.asenha-accordion-panel');
         var isExpanded = $button.attr('aria-expanded') === 'true';
         
         // Toggle the panel
         if (isExpanded) {
            $button.attr('aria-expanded', 'false');
            $panel.attr('hidden', 'hidden').slideUp(200);
         } else {
            $button.attr('aria-expanded', 'true');
            $panel.removeAttr('hidden').slideDown(200);
         }
      });
      /*! </fs_premium_only> */

   }); // End of $(document).ready()

   /*! <fs_premium_only> */
   function initMenuAlwaysHidden(menuAlwaysHidden,menuItemObject) {
      var menuId = $(menuItemObject).data('menu-item-id');
      var menuTitle = $(menuItemObject).data('menu-item-title');
      var menuIdOri = $(menuItemObject).data('menu-item-id-ori'); // original, untransformed ID
      var menuUrlFragment = $(menuItemObject).data('menu-url-fragment');
      var requiredCapability = $(menuItemObject).data('required-capability') || '';
      if (typeof menuAlwaysHidden[menuId] === 'undefined') {
         menuAlwaysHidden[menuId] = {};
      }
      if (typeof menuAlwaysHidden[menuId]['menu_title'] === 'undefined') {
         menuAlwaysHidden[menuId]['menu_title'] = menuTitle;
      }
      if (typeof menuAlwaysHidden[menuId]['original_menu_id'] === 'undefined') {
         menuAlwaysHidden[menuId]['original_menu_id'] = menuIdOri;         
      }
      if (typeof menuAlwaysHidden[menuId]['hide_by_toggle'] === 'undefined') {
         menuAlwaysHidden[menuId]['hide_by_toggle'] = false;         
      }
      if (typeof menuAlwaysHidden[menuId]['always_hide'] === 'undefined') {
         menuAlwaysHidden[menuId]['always_hide'] = false;         
      }
      if (typeof menuAlwaysHidden[menuId]['always_hide_for'] === 'undefined') {
         menuAlwaysHidden[menuId]['always_hide_for'] = '';         
      }
      if (typeof menuAlwaysHidden[menuId]['which_roles'] === 'undefined') {
         menuAlwaysHidden[menuId]['which_roles'] = [];         
      }
      if (typeof menuAlwaysHidden[menuId]['always_show_for_users'] === 'undefined') {
         menuAlwaysHidden[menuId]['always_show_for_users'] = [];
      }
      if ( asenhaGetById('hide-until-toggled-for-' + menuId).is(':checked') || asenhaGetById('hide-by-role-for-' + menuId).is(':checked') ) {
         $(menuItemObject).prop('checked', true);            
      }
      if (typeof menuAlwaysHidden[menuId]['menu_url_fragment'] === 'undefined') {
         menuAlwaysHidden[menuId]['menu_url_fragment'] = menuUrlFragment;
      }
      if (typeof menuAlwaysHidden[menuId]['required_capability'] === 'undefined' || menuAlwaysHidden[menuId]['required_capability'] === '') {
         menuAlwaysHidden[menuId]['required_capability'] = requiredCapability;
      }
      // console.log(menuAlwaysHidden);
      document.getElementById('custom_menu_always_hidden').value = JSON.stringify(menuAlwaysHidden);
   }

   function initSubmenuAlwaysHidden(submenuAlwaysHidden,submenuItemObject) {
      var submenuId = $(submenuItemObject).data('menu-item-id');
      var submenuTitle = $(submenuItemObject).data('menu-item-title');
      var submenuIdOri = $(submenuItemObject).data('menu-item-id-ori'); // original, untransformed ID
      var submenuUrlFragment = $(submenuItemObject).data('menu-url-fragment');
      var requiredCapability = $(submenuItemObject).data('required-capability') || '';
      if (typeof submenuAlwaysHidden[submenuId] === 'undefined') {
         submenuAlwaysHidden[submenuId] = {};
      }
      if (typeof submenuAlwaysHidden[submenuId]['menu_title'] === 'undefined') {
         submenuAlwaysHidden[submenuId]['menu_title'] = submenuTitle;
      }
      if (typeof submenuAlwaysHidden[submenuId]['original_menu_id'] === 'undefined') {
         submenuAlwaysHidden[submenuId]['original_menu_id'] = submenuIdOri;         
      }
      if (typeof submenuAlwaysHidden[submenuId]['hide_by_toggle'] === 'undefined') {
         submenuAlwaysHidden[submenuId]['hide_by_toggle'] = false;         
      }
      if (typeof submenuAlwaysHidden[submenuId]['always_hide'] === 'undefined') {
         submenuAlwaysHidden[submenuId]['always_hide'] = false;         
      }
      if (typeof submenuAlwaysHidden[submenuId]['always_hide_for'] === 'undefined') {
         submenuAlwaysHidden[submenuId]['always_hide_for'] = '';         
      }
      if (typeof submenuAlwaysHidden[submenuId]['which_roles'] === 'undefined') {
         submenuAlwaysHidden[submenuId]['which_roles'] = [];         
      }
      if (typeof submenuAlwaysHidden[submenuId]['always_show_for_users'] === 'undefined') {
         submenuAlwaysHidden[submenuId]['always_show_for_users'] = [];
      }
      if ( asenhaGetById('hide-until-toggled-for-' + submenuId).is(':checked') || asenhaGetById('hide-by-role-for-' + submenuId).is(':checked') ) {
         $(submenuItemObject).prop('checked', true);            
      }
      if (typeof submenuAlwaysHidden[submenuId]['menu_url_fragment'] === 'undefined') {
         submenuAlwaysHidden[submenuId]['menu_url_fragment'] = submenuUrlFragment;
      }
      if (typeof submenuAlwaysHidden[submenuId]['required_capability'] === 'undefined' || submenuAlwaysHidden[submenuId]['required_capability'] === '') {
         submenuAlwaysHidden[submenuId]['required_capability'] = requiredCapability;
      }
      // console.log(submenuAlwaysHidden);
      document.getElementById('custom_submenu_always_hidden').value = JSON.stringify(submenuAlwaysHidden);
   }
   
   /**
    * Escape a string for use in RegExp (literal match).
    *
    * @param {string} s Input.
    * @return {string} Escaped string.
    */
   function escapeRegExpForAmo( s ) {
      return s.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
   }

   // Add a new separator and make sure
   function addNewSeparator( menuAlwaysHidden, newSeparators, separatorCount ) {
      var newId = 'separator' + separatorCount;
      var $template = $( '#separator1' );
      if ( ! $template.length ) {
         $template = $( '#separator2' );
      }
      if ( ! $template.length ) {
         $template = $( '#separator-last' );
      }
      if ( ! $template.length ) {
         $template = $( '#custom-admin-menu li[id^="separator"]' ).first();
      }
      if ( ! $template.length ) {
         $template = $( '#amo-separator-clone-source' );
      }
      if ( ! $template.length ) {
         return;
      }

      var sourceId = $template.attr( 'id' ) || '';
      var newSeparator = $template.clone();
      newSeparator.prop( 'id', newId ).addClass( 'custom-menu-item' ).attr( 'data-custom-menu-item', 'yes' ).attr( 'data-menu-slug', newId );
      newSeparator.find( '.menu-item-title' ).html( '~~ Spacer-' + separatorCount + ' ~~' );

      if ( sourceId ) {
         var raw = newSeparator.html();
         var inner = raw == null ? '' : String( raw );
         var newHtml = inner.replace( new RegExp( escapeRegExpForAmo( sourceId ), 'g' ), newId );
         newSeparator.html( newHtml );
      }

      resetAmoUserExclusionsSelectMarkup( newSeparator );
      $( '#custom-admin-menu' ).append( newSeparator );
      initAmoUserExclusionsSelects( newSeparator );
      initMenuAlwaysHidden( menuAlwaysHidden, newSeparator.find( '.parent-menu-hide-checkbox-prm' ) );
      saveNewSeparator( newSeparators, newSeparator );
   }
   
   // Add separator to list of separators to save
   function saveNewSeparator( newSeparators, newSeparatorLi ) {
      var menuId = $( newSeparatorLi ).attr( 'id' );
      if ( ! menuId ) {
         return;
      }
      if ( typeof newSeparators[ menuId ] === 'undefined' ) {
         newSeparators[ menuId ] = {};
      }

      newSeparators[ menuId ]['menu_id'] = menuId;
      // newSeparators = {}; // To reset value during dev/testing

      document.getElementById('custom_menu_new_separators').value = JSON.stringify(newSeparators);
   }

   // Remove separator from list of separators to save
   function dontSaveNewSeparator(newSeparators,newSeparatorObject) {
      var menuId = newSeparatorObject[0].id;
      // console.log('menuId: '+menuId);
      // console.log('newSeparators before: ' + JSON.stringify(newSeparators));
      delete newSeparators[menuId];
      // console.log('newSeparators after: ' + JSON.stringify(newSeparators));
      document.getElementById('custom_menu_new_separators').value = JSON.stringify(newSeparators);
   }

   // JavaScript sanitize_title function (similar to WordPress PHP function)
   function sanitizeTitle(title) {
      return title.toLowerCase()
         .replace(/[^\w\s-]/g, '') // Remove special characters
         .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with hyphens
         .replace(/^-+|-+$/g, '');  // Trim hyphens from start and end
   }

   // Add a new custom menu item
   function addNewCustomMenu(menuAlwaysHidden, newCustomMenus, customMenuCount, isSubmenu, parentMenuId, submenuSortable) {
      var menuId = isSubmenu ? 'custom-submenu-' + customMenuCount : 'custom-menu-' + customMenuCount;
      var menuClasses = isSubmenu ? 'menu-item submenu-item ui-sortable-handle custom-menu-item' : 'menu-item parent-menu-item ui-sortable-handle custom-menu-item';
      
      // Build the HTML structure
      var menuHtml = '<li id="' + menuId + '" class="' + menuClasses + '" data-custom-menu-item="yes" data-saved="false">';
      menuHtml += '  <div class="menu-item-bar">';
      menuHtml += '    <div class="menu-item-handle ui-sortable-handle">';
      menuHtml += '      <span class="dashicons dashicons-menu"></span>';
      menuHtml += '      <div class="item-title">';
      menuHtml += '        <div class="title-wrapper">';
      menuHtml += '          <input type="text" class="menu-item-custom-title custom-menu-title-input" data-menu-item-id="' + menuId + '" placeholder="' + (isSubmenu ? (strings.submenu || 'Submenu') : (strings.menuTitle || 'Menu')) + ' Title" value="" />';
      
      // Add "Add Submenu" link for parent menus
      if (!isSubmenu) {
         menuHtml += '          <a href="#" class="add-submenu-to-custom-parent" data-parent-menu-id="' + menuId + '">' + (strings.addSubmenu || 'Add Submenu') + '</a>';
      }
      
      menuHtml += '        </div>';
      menuHtml += '        <div class="options-for-hiding">';
      menuHtml += '          <div class="options-toggle" data-menu-item-id="' + menuId + '">';
      menuHtml += '            <span class="arrow-right rotate-down"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 16 16"><path fill="currentColor" d="M14.222 6.687a1.5 1.5 0 0 1 0 2.629l-10 5.499A1.5 1.5 0 0 1 2 13.5V2.502a1.5 1.5 0 0 1 2.223-1.314z"/></svg></span>';
      menuHtml += '            <span class="options-text">' + (strings.options || 'Options') + '</span>';
      menuHtml += '          </div>';
      menuHtml += '        </div>';
      menuHtml += '      </div>';
      menuHtml += '    </div>';
      menuHtml += '  </div>';
      
      // Options panel (immediately visible for unsaved items)
      menuHtml += '  <div class="custom-menu-options-panel" id="options-for-' + menuId + '">';
      
      // Target type selection (pro-only)
      if (!isSubmenu) {
         menuHtml += '    <div class="custom-menu-field custom-menu-field-margin">';
         menuHtml += '      <label class="custom-menu-field-label">' + (strings.target || 'Target:') + '</label>';
         menuHtml += '      <div class="custom-menu-radios-wrapper">';
         menuHtml += '        <label class="custom-menu-radio-label">';
         menuHtml += '          <input type="radio" name="target-type-' + menuId + '" class="custom-menu-target-type" data-menu-item-id="' + menuId + '" value="url" checked />';
         menuHtml += '          <span>' + (strings.url || 'URL') + '</span>';
         menuHtml += '        </label>';
         menuHtml += '        <label class="custom-menu-radio-label">';
         menuHtml += '          <input type="radio" name="target-type-' + menuId + '" class="custom-menu-target-type" data-menu-item-id="' + menuId + '" value="none" />';
         menuHtml += '          <span>' + (strings.none || 'None') + '</span>';
         menuHtml += '        </label>';
         menuHtml += '      </div>';
         menuHtml += '    </div>';
      }
      
      menuHtml += '    <div class="custom-menu-field custom-menu-url-field custom-menu-field-margin">';
      menuHtml += '      <label class="custom-menu-field-label-tight">' + (strings.targetUrl || 'Target URL:') + '</label>';
      menuHtml += '      <input type="text" class="custom-menu-target-url custom-menu-input-full" data-menu-item-id="' + menuId + '" placeholder="' + (strings.placeholderUrl || 'e.g. /wp-admin/admin.php?page=my-page') + '" />';
      menuHtml += '    </div>';
      
      // Icon picker (only for parent menus, shown only for URL target type)
      if (!isSubmenu) {
         menuHtml += '    <div class="custom-menu-field custom-menu-icon-field custom-menu-field-margin">';
         menuHtml += '      <label class="custom-menu-field-label-tight">' + (strings.icon || 'Icon:') + '</label>';
         menuHtml += '      <div class="icon-picker-wrapper">';
         menuHtml += '        <div class="icon-picker">';
         menuHtml += '          <div class="selected-menu-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M2.586 11.414a2 2 0 0 1 0-2.828l6.002-6a2 2 0 0 1 2.828 0l6.002 6a2 2 0 0 1 0 2.828l-6.002 6a2 2 0 0 1-2.828 0l-6.002-6Z"></path></svg></div>';
         menuHtml += '          <input type="text" class="custom-menu-icon custom-menu-input-full" data-menu-item-id="' + menuId + '" value="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yLjU4NiAxMS40MTRhMiAyIDAgMCAxIDAtMi44MjhsNi4wMDItNmEyIDIgMCAwIDEgMi44MjggMGw2LjAwMiA2YTIgMiAwIDAgMSAwIDIuODI4bC02LjAwMiA2YTIgMiAwIDAgMS0yLjgyOCAwbC02LjAwMi02WiI+PC9wYXRoPjwvc3ZnPg==" placeholder="' + (strings.placeholderIcon || 'e.g. data:image/svg+xml;base64,...') + '" />';
         menuHtml += '        </div>';
         menuHtml += '        <div class="icon-picker-controls">';
         menuHtml += '          <button type="button" class="button icon-picker-button" data-menu-item-id="' + menuId + '">' + (strings.changeIcon || 'Change Icon') + '</button>';
         menuHtml += '          <img src="' + (strings.asenhUrl || '') + 'assets/img/oval.svg" class="icon-picker-spinner" style="display: none;" />';
         menuHtml += '          <input type="search" class="icon-picker-search" placeholder="' + (strings.searchIcon || 'Search...') + '" style="display:none;" data-menu-item-id="' + menuId + '" />';
         menuHtml += '        </div>';
         menuHtml += '      </div>';
         menuHtml += '      <div class="icon-library-container" data-menu-item-id="' + menuId + '" style="display:none; position:relative;">';
         menuHtml += '        <span class="icon-picker-close" style="display: none;"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M15.1 3.1L12.9.9L8 5.9L3.1.9L.9 3.1l5 4.9l-5 4.9l2.2 2.2l4.9-5l4.9 5l2.2-2.2l-5-4.9z"/></svg></span>';
         menuHtml += '      </div>';
         menuHtml += '    </div>';
      }
      
      // Styling fields wrapper (only for parent menus)
      if (!isSubmenu) {
      // Styling fields (shown when target type is "none")
      menuHtml += '    <div class="custom-menu-styling-options" style="display:none;">';
      
      // Menu Style heading
      menuHtml += '      <div class="custom-menu-styling-heading">';
      menuHtml += '        <span class="custom-menu-styling-title">' + (strings.menuStyle || 'Menu Style') + '</span>';
      menuHtml += '      </div>';
      
      // Text Transform
      menuHtml += '      <div class="custom-menu-field custom-menu-field-margin">';
      menuHtml += '        <label class="custom-menu-field-label">' + (strings.textTransform || 'Text Transform:') + '</label>';
      menuHtml += '        <div class="custom-menu-radios-wrapper">';
      menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="text-transform-' + menuId + '" class="custom-menu-text-transform" data-menu-item-id="' + menuId + '" value="uppercase" /><span>' + (strings.upperCase || 'UPPER CASE') + '</span></label>';
      menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="text-transform-' + menuId + '" class="custom-menu-text-transform" data-menu-item-id="' + menuId + '" value="title" checked /><span>' + (strings.titleCase || 'Title Case') + '</span></label>';
      menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="text-transform-' + menuId + '" class="custom-menu-text-transform" data-menu-item-id="' + menuId + '" value="lowercase" /><span>' + (strings.lowerCase || 'lower case') + '</span></label>';
      menuHtml += '        </div>';
      menuHtml += '      </div>';
      
      // Text Size
      menuHtml += '      <div class="custom-menu-field custom-menu-field-margin">';
      menuHtml += '        <label class="custom-menu-field-label">' + (strings.fontSize || 'Font Size:') + '</label>';
      menuHtml += '        <div class="custom-menu-radios-wrapper">';
      menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="text-size-' + menuId + '" class="custom-menu-text-size" data-menu-item-id="' + menuId + '" value="smaller" /><span>' + (strings.smaller || 'Smaller') + '</span></label>';
      menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="text-size-' + menuId + '" class="custom-menu-text-size" data-menu-item-id="' + menuId + '" value="normal" checked /><span>' + (strings.normal || 'Normal') + '</span></label>';
      menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="text-size-' + menuId + '" class="custom-menu-text-size" data-menu-item-id="' + menuId + '" value="larger" /><span>' + (strings.larger || 'Larger') + '</span></label>';
      menuHtml += '        </div>';
      menuHtml += '      </div>';
         
         // Font Weight
         menuHtml += '      <div class="custom-menu-field custom-menu-field-margin">';
         menuHtml += '        <label class="custom-menu-field-label">' + (strings.fontWeight || 'Font Weight:') + '</label>';
         menuHtml += '        <div class="custom-menu-radios-wrapper">';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="font-weight-' + menuId + '" class="custom-menu-font-weight" data-menu-item-id="' + menuId + '" value="normal" checked /><span>' + (strings.normal || 'Normal') + '</span></label>';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="font-weight-' + menuId + '" class="custom-menu-font-weight" data-menu-item-id="' + menuId + '" value="medium" /><span>' + (strings.medium || 'Medium') + '</span></label>';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="font-weight-' + menuId + '" class="custom-menu-font-weight" data-menu-item-id="' + menuId + '" value="bold" /><span>' + (strings.bold || 'Bold') + '</span></label>';
         menuHtml += '        </div>';
         menuHtml += '      </div>';
         
         // Alignment
         menuHtml += '      <div class="custom-menu-field custom-menu-field-margin">';
         menuHtml += '        <label class="custom-menu-field-label">' + (strings.alignment || 'Alignment:') + '</label>';
         menuHtml += '        <div class="custom-menu-radios-wrapper">';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="alignment-' + menuId + '" class="custom-menu-alignment" data-menu-item-id="' + menuId + '" value="left" checked /><span>' + (strings.left || 'Left') + '</span></label>';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="alignment-' + menuId + '" class="custom-menu-alignment" data-menu-item-id="' + menuId + '" value="center" /><span>' + (strings.center || 'Center') + '</span></label>';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="alignment-' + menuId + '" class="custom-menu-alignment" data-menu-item-id="' + menuId + '" value="right" /><span>' + (strings.right || 'Right') + '</span></label>';
         menuHtml += '        </div>';
         menuHtml += '      </div>';
         
         // Color
         menuHtml += '      <div class="custom-menu-field custom-menu-field-margin">';
         menuHtml += '        <label class="custom-menu-field-label">' + (strings.color || 'Color:') + '</label>';
         menuHtml += '        <div class="custom-menu-color-radios-wrapper">';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="color-type-' + menuId + '" class="custom-menu-color-type" data-menu-item-id="' + menuId + '" value="title" checked /><span>' + (strings.title || 'Title') + '</span></label>';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="color-type-' + menuId + '" class="custom-menu-color-type" data-menu-item-id="' + menuId + '" value="background" /><span>' + (strings.background || 'Background') + '</span></label>';
         menuHtml += '        </div>';
         menuHtml += '        <input type="text" class="custom-menu-color-picker custom-menu-input-full" data-menu-item-id="' + menuId + '" value="" />';
         menuHtml += '      </div>';
         
         // Line Style
         menuHtml += '      <div class="custom-menu-field custom-menu-line-style-field custom-menu-field-margin">';
         menuHtml += '        <label class="custom-menu-field-label">' + (strings.lineStyle || 'Line Style:') + '</label>';
         menuHtml += '        <div class="custom-menu-radios-wrapper">';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="line-style-' + menuId + '" class="custom-menu-line-style" data-menu-item-id="' + menuId + '" value="no-line" checked /><span>' + (strings.noLine || 'No line') + '</span></label>';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="line-style-' + menuId + '" class="custom-menu-line-style" data-menu-item-id="' + menuId + '" value="underline" /><span>' + (strings.underline || 'Underline') + '</span></label>';
         menuHtml += '          <label class="custom-menu-radio-label"><input type="radio" name="line-style-' + menuId + '" class="custom-menu-line-style" data-menu-item-id="' + menuId + '" value="side-line" /><span>' + (strings.sideline || 'Sideline') + '</span></label>';
         menuHtml += '        </div>';
         menuHtml += '      </div>';
         
         menuHtml += '    </div>';
      }
      
      // Required Capability field (outside styling wrapper)
      menuHtml += '    <div class="custom-menu-field custom-menu-capability-field custom-menu-field-margin">';
      menuHtml += '      <label class="custom-menu-field-label-tight">' + (strings.requiredCapability || 'Required Capability:') + '</label>';
      menuHtml += '      <select class="custom-menu-capability custom-menu-input-full" data-menu-item-id="' + menuId + '">';
      
      // Add capabilities organized into three groups
      if (typeof amoPageVars !== 'undefined' && amoPageVars.capabilities) {
         var keyCapabilities = ['manage_options', 'edit_others_posts', 'edit_published_posts', 'edit_posts', 'read'];
         var coreCapabilities = amoPageVars.coreCapabilities || [];
         
         // Key WordPress Core Capabilities group
         menuHtml += '<optgroup label="' + (strings.keyWpCoreCapabilities || 'Key WordPress Core Capabilities') + '">';
         for (var i = 0; i < keyCapabilities.length; i++) {
            var capability = keyCapabilities[i];
            if (amoPageVars.capabilities.hasOwnProperty(capability)) {
               var roles = amoPageVars.capabilities[capability];
               var rolesText = roles.length > 0 ? ' (' + roles.join(', ') + ')' : '';
               var selected = (capability === 'manage_options') ? ' selected' : '';
               menuHtml += '<option value="' + capability + '"' + selected + '>' + capability + rolesText + '</option>';
            }
         }
         menuHtml += '</optgroup>';
         
         // Other WordPress Core Capabilities group
         menuHtml += '<optgroup label="' + (strings.otherWpCoreCapabilities || 'Other WordPress Core Capabilities') + '">';
         for (var capability in amoPageVars.capabilities) {
            if (amoPageVars.capabilities.hasOwnProperty(capability)) {
               if (keyCapabilities.indexOf(capability) === -1 && coreCapabilities.indexOf(capability) !== -1) {
                  var roles = amoPageVars.capabilities[capability];
                  var rolesText = roles.length > 0 ? ' (' + roles.join(', ') + ')' : '';
                  menuHtml += '<option value="' + capability + '">' + capability + rolesText + '</option>';
               }
            }
         }
         menuHtml += '</optgroup>';
         
         // Custom Capabilities group
         menuHtml += '<optgroup label="' + (strings.customCapabilities || 'Custom Capabilities') + '">';
         for (var capability in amoPageVars.capabilities) {
            if (amoPageVars.capabilities.hasOwnProperty(capability)) {
               if (keyCapabilities.indexOf(capability) === -1 && coreCapabilities.indexOf(capability) === -1) {
                  var roles = amoPageVars.capabilities[capability];
                  var rolesText = roles.length > 0 ? ' (' + roles.join(', ') + ')' : '';
                  menuHtml += '<option value="' + capability + '">' + capability + rolesText + '</option>';
               }
            }
         }
         menuHtml += '</optgroup>';
      }
      menuHtml += '      </select>';
      menuHtml += '    </div>';
      
      menuHtml += '    <input type="hidden" class="custom-menu-css-class" data-menu-item-id="' + menuId + '" value="" />';
      menuHtml += '  </div>';
      
      // Add delete button inside the li element
      menuHtml += '  <div class="remove-custom-menu-item" data-menu-item-id="' + menuId + '"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#bbbbbb" d="M24 2.4L21.6 0L12 9.6L2.4 0L0 2.4L9.6 12L0 21.6L2.4 24l9.6-9.6l9.6 9.6l2.4-2.4l-9.6-9.6z"/></svg></div>';
      
      menuHtml += '</li>';
      
      // Append menu item to appropriate container
      var newMenuItem = $(menuHtml);
      if (isSubmenu) {
         submenuSortable.find('.submenu-actions').before(newMenuItem);
      } else {
         $('#custom-admin-menu').append(newMenuItem);
      }
      
      // Setup event listeners
      setupCustomMenuListeners(menuId, isSubmenu, parentMenuId, newCustomMenus);
   }

   // Setup event listeners for a custom menu item
   function setupCustomMenuListeners(menuId, isSubmenu, parentMenuId, newCustomMenus) {
      var menuItem = asenhaGetById(menuId);
      
      // Title input change - update CSS class and save data
      menuItem.find('.custom-menu-title-input').on('input', function() {
         var title = $(this).val();
         var cssClass = 'custom-menu-' + sanitizeTitle(title);
         menuItem.find('.custom-menu-css-class').val(cssClass);
         saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
      });
      
      // URL input change - save data
      menuItem.find('.custom-menu-target-url').on('input', function() {
         saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
         
         // Show warning for external URLs
         var url = $(this).val();
         var warning = $(this).next('.url-warning');
         if (url.startsWith('http://') || url.startsWith('https://')) {
            if (warning.length === 0) {
               $(this).after('<div class="url-warning url-warning-inline">' + (strings.externalUrlWarning || '⚠️ External URLs will open in the same window.') + '</div>');
            }
         } else {
            warning.remove();
         }
      });
      
      // Capability select change - save data
      menuItem.find('.custom-menu-capability').on('change', function() {
         saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
      });
      
      // Icon input change - save data (only for parent menus)
      if (!isSubmenu) {
         menuItem.find('.custom-menu-icon').on('input', function() {
            saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
         });
         
         // Target type radio change - show/hide fields
         menuItem.find('.custom-menu-target-type').on('change', function() {
            var targetType = $(this).val();

            syncCustomMenuTargetTypeUi(menuItem, targetType, false);
            
            saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
         });
         
      // Color type radio change - show/hide Line Style
      menuItem.find('.custom-menu-color-type').on('change', function() {
         var colorType = $(this).val();
         var lineStyleField = menuItem.find('.custom-menu-line-style-field');
         
         if (colorType === 'background') {
            lineStyleField.hide();
         } else {
            lineStyleField.show();
         }
         
         saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
      });
      
      // Text Transform radio change
      menuItem.find('.custom-menu-text-transform').on('change', function() {
         saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
      });
      
      // Text Size radio change
      menuItem.find('.custom-menu-text-size').on('change', function() {
         saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
      });
         
         // Font Weight radio change
         menuItem.find('.custom-menu-font-weight').on('change', function() {
            saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
         });
         
         // Alignment radio change
         menuItem.find('.custom-menu-alignment').on('change', function() {
            saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
         });
         
         // Line Style radio change
         menuItem.find('.custom-menu-line-style').on('change', function() {
            saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
         });
         
         // Initialize color picker
         var colorPicker = menuItem.find('.custom-menu-color-picker');
         if (colorPicker.length > 0) {
            // Leave color empty by default to use existing admin menu color
            // colorPicker.val(''); // Not needed as it's already empty in HTML
            
            // Initialize wpColorPicker
            colorPicker.wpColorPicker({
               change: function(event, ui) {
                  saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
               },
               clear: function() {
                  saveNewCustomMenu(newCustomMenus, menuItem, isSubmenu, parentMenuId);
               }
            });
         }
      }
   }

   // Save custom menu item to list
   function saveNewCustomMenu(newCustomMenus, menuItemElement, isSubmenu, parentMenuId) {
      var menuId = menuItemElement.attr('id');
      var title = menuItemElement.find('.custom-menu-title-input').val();
      var url = menuItemElement.find('.custom-menu-target-url').val();
      var capability = menuItemElement.find('.custom-menu-capability').val();
      var icon = isSubmenu ? '' : menuItemElement.find('.custom-menu-icon').val();
      var cssClass = menuItemElement.find('.custom-menu-css-class').val();
      
      if (typeof newCustomMenus[menuId] === 'undefined') {
         newCustomMenus[menuId] = {};
      }
      
      newCustomMenus[menuId]['menu_id'] = menuId;
      newCustomMenus[menuId]['title'] = title;
      newCustomMenus[menuId]['url'] = url;
      newCustomMenus[menuId]['capability'] = capability;
      newCustomMenus[menuId]['icon'] = icon;
      newCustomMenus[menuId]['css_class'] = cssClass;
      newCustomMenus[menuId]['parent_id'] = isSubmenu ? parentMenuId : '';
      
      // Save styling options for parent menus
      if (!isSubmenu) {
         // Get target type
         var targetType = menuItemElement.find('.custom-menu-target-type:checked').val() || 'url';
         newCustomMenus[menuId]['target_type'] = targetType;
         
      // Save styling fields if target type is "none"
      if (targetType === 'none') {
         newCustomMenus[menuId]['text_transform'] = menuItemElement.find('.custom-menu-text-transform:checked').val() || 'title';
         newCustomMenus[menuId]['text_size'] = menuItemElement.find('.custom-menu-text-size:checked').val() || 'normal';
         newCustomMenus[menuId]['font_weight'] = menuItemElement.find('.custom-menu-font-weight:checked').val() || 'normal';
         newCustomMenus[menuId]['alignment'] = menuItemElement.find('.custom-menu-alignment:checked').val() || 'left';
         newCustomMenus[menuId]['color_type'] = menuItemElement.find('.custom-menu-color-type:checked').val() || 'title';
         newCustomMenus[menuId]['color_value'] = menuItemElement.find('.custom-menu-color-picker').val() || '';
         newCustomMenus[menuId]['line_style'] = menuItemElement.find('.custom-menu-line-style:checked').val() || 'no-line';
            
            // Compute text color for background color type
            if (newCustomMenus[menuId]['color_type'] === 'background' && newCustomMenus[menuId]['color_value']) {
               newCustomMenus[menuId]['computed_text_color'] = isColorDark(newCustomMenus[menuId]['color_value']) ? '#ffffff' : '#3c434a';
            }
         }
      }
      
      var hiddenField = document.getElementById('custom_menu_new_items');
      if (hiddenField) {
         hiddenField.value = JSON.stringify(newCustomMenus);
      }
   }

   // Remove custom menu item from list
   function dontSaveNewCustomMenu(newCustomMenus, menuItemElement) {
      var menuId = menuItemElement.attr('id');
      var isSubmenuItem = menuItemElement.hasClass('submenu-item');
      
      // If this is a parent menu, also delete all its submenus
      if (!isSubmenuItem) {
         // Find and delete all submenu items that have this menu as their parent
         for (var itemId in newCustomMenus) {
            if (newCustomMenus.hasOwnProperty(itemId) && newCustomMenus[itemId]['parent_id'] === menuId) {
               delete newCustomMenus[itemId];
            }
         }
      }
      
      // Delete the menu item itself
      delete newCustomMenus[menuId];
      var hiddenField = document.getElementById('custom_menu_new_items');
      if (hiddenField) {
         hiddenField.value = JSON.stringify(newCustomMenus);
      }
   }

   // Helper function to determine if a color is dark (ported from PHP is_color_dark)
   function isColorDark(hex) {
      hex = String(hex).replace('#', '').trim();

      if (hex.length === 3) {
         hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) {
         return true;
      }

      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);

      var lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 510.0;

      return lightness <= 0.8;
   }

   // References
   // Bind events to dynamically-generated elements: https://stackoverflow.com/a/1207393
   /*! </fs_premium_only> */

})( jQuery );