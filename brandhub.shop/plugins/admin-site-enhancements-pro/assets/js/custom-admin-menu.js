(function( $ ) {
   'use strict';

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
      document.getElementById('admin_site_enhancements[custom_menu_order]').value = menuOrder;

      // Save custom order into a comma-separated string, triggerred after each drag and drop of menu item
      // https://api.jqueryui.com/sortable/#event-update
      // https://api.jqueryui.com/sortable/#method-toArray
      $('#custom-admin-menu').on( 'sortupdate', function( event, ui) {

         // Get the updated menu order
         let menuOrder = $('#custom-admin-menu').sortable("toArray").toString();

         // Set hidden input value for saving in options
         document.getElementById('admin_site_enhancements[custom_menu_order]').value = menuOrder;

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
         document.getElementById('admin_site_enhancements[custom_submenus_order]').value = JSON.stringify(submenuOrder);
      });

      // Update submenus items order for saving to options
      $('.submenu-sortable').on('sortupdate', function( event, ui) {
         submenuSortableId = $(this).attr('id');
         submenuOrder[submenuSortableId] = $(this).sortable("toArray").toString();
         document.getElementById('admin_site_enhancements[custom_submenus_order]').value = JSON.stringify(submenuOrder);
      });
      
      // Toggle submenu items
      $('#custom-admin-menu').on('click', '.submenu-toggle', function() {
         $(this).children('.arrow-right').toggleClass('rotate-down');
         $(this).parents('.menu-item').find('.submenu-wrapper').toggle();
      });

      // Prepare constant to store IDs of menu items that will be hidden
      var hiddenMenuByRoleInput = document.getElementById('admin_site_enhancements[custom_menu_always_hidden]');
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
            $('#options-for-'+menuId).show();
            $('#all-selected-roles-options-for-'+menuId).show();
         } else {
            $('#options-for-'+menuId).hide();
            $('#hide-until-toggled-for-'+menuId).prop('checked', false);
            $('#hide-by-role-for-'+menuId).prop('checked', false);
            $('#all-selected-roles-radio-for-'+menuId).hide();
            $('#hide-for-roles-'+menuId).hide();
            $('#menu-required-capability-for-'+menuId).hide();
            menuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            menuAlwaysHidden[menuId]['always_hide'] = false;
         }
         if ( $('#options-for-'+menuId).is(':visible') ) {
            $(this).parent().next('.options-toggle').children('.arrow-right').addClass('rotate-down');
         } else {
            $(this).parent().next('.options-toggle').children('.arrow-right').removeClass('rotate-down');            
         }
         document.getElementById('admin_site_enhancements[custom_menu_always_hidden]').value = JSON.stringify(menuAlwaysHidden);
      });

      // On clicking "Hide until toggled" on parent menu items
      $('#custom-admin-menu').on('click', '.hide-until-toggled-checkbox', function() {
         var menuId = $(this).data('menu-item-id'); // may contain transformed ID
         if ($(this).is(':checked')) {
            menuAlwaysHidden[menuId]['hide_by_toggle'] = true;
            $('#hide-status-for-'+menuId).prop('checked',true);
         } else {
            menuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            if (!$('#hide-by-role-for-'+menuId).is(':checked')) {
               $('#hide-status-for-'+menuId).prop('checked',false);
               // delete menuAlwaysHidden[menuId];
            }
         }
         document.getElementById('admin_site_enhancements[custom_menu_always_hidden]').value = JSON.stringify(menuAlwaysHidden);
      });

      // Prepare constant to store IDs of submenu items that will be hidden
      var hiddenSubmenuByRoleInput = document.getElementById('admin_site_enhancements[custom_submenu_always_hidden]');
      if ( hiddenSubmenuByRoleInput && hiddenSubmenuByRoleInput.value ) {
         var submenuAlwaysHidden = JSON.parse(hiddenSubmenuByRoleInput.value); // object
      } else {
         var submenuAlwaysHidden = {}; // object
      }

      // Initialize object to store hidden menus and set check mark of 'Hide' checkbox
      $('.submenu-hide-checkbox-prm').each(function() {
         initSubmenuAlwaysHidden(submenuAlwaysHidden,this);
      });

      // Toggle options panel for hiding submenu items
      $('#custom-admin-menu').on('click', '.submenu-hide-checkbox-prm', function() {
         var menuId = $(this).data('menu-item-id'); // may contain transformed ID
         if ($(this).is(':checked')) {
            $('#options-for-'+menuId).show();
            $('#all-selected-roles-options-for-'+menuId).show();
         } else {
            $('#options-for-'+menuId).hide();
            $('#hide-until-toggled-for-'+menuId).prop('checked', false);
            $('#hide-by-role-for-'+menuId).prop('checked', false);
            $('#all-selected-roles-radio-for-'+menuId).hide();
            $('#hide-for-roles-'+menuId).hide();
            $('#menu-required-capability-for-'+menuId).hide();
            submenuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            submenuAlwaysHidden[menuId]['always_hide'] = false;
         }
         if ( $('#options-for-'+menuId).is(':visible') ) {
            $(this).parent().next('.options-toggle').children('.arrow-right').addClass('rotate-down');
         } else {
            $(this).parent().next('.options-toggle').children('.arrow-right').removeClass('rotate-down');            
         }
         document.getElementById('admin_site_enhancements[custom_submenu_always_hidden]').value = JSON.stringify(submenuAlwaysHidden);
      });
      
      // On clicking "Hide until toggled" on submenu items
      $('#custom-admin-menu').on('click', '.hide-until-toggled-submenu-checkbox', function() {
         var menuId = $(this).data('menu-item-id'); // may contain transformed ID
         if ($(this).is(':checked')) {
            submenuAlwaysHidden[menuId]['hide_by_toggle'] = true;
            $('#hide-status-for-'+menuId).prop('checked',true);
         } else {
            submenuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            if (!$('#hide-by-role-for-'+menuId).is(':checked')) {
               $('#hide-status-for-'+menuId).prop('checked',false);
               // delete submenuAlwaysHidden[menuId];
            }
         }
         // console.log('submenuAlwaysHidden:');
         // console.log(submenuAlwaysHidden);
         document.getElementById('admin_site_enhancements[custom_submenu_always_hidden]').value = JSON.stringify(submenuAlwaysHidden);
      });
      
      // On clicking the "Options" toggle
      $('#custom-admin-menu').on('click', '.options-toggle', function() {
         $(this).children('.arrow-right').toggleClass('rotate-down');
         var menuId = $(this).data('menu-item-id');
         $('#options-for-'+menuId).toggle();
         if (!$('#hide-until-toggled-for-'+menuId).is(':checked') && !$('#hide-by-role-for-'+menuId).is(':checked')) {
            $('#hide-status-for-'+menuId).prop('checked',false);         
         }
      });
            
      // Set checked status of 'Always Hide for user role(s)' checkbox and show sub-options accordingly
      $('.hide-by-role-checkbox').each(function() {
         var menuId = $(this).data('menu-item-id');
         if ( $(this).is(':checked') ) {
            $('#hide-status-for-'+menuId).prop('checked', true);
            $('#all-selected-roles-options-for-'+menuId).show();
            $('#all-selected-roles-radio-for-'+menuId).show();
            if ($('#all-roles-except-for-'+menuId).is(':checked') || $('#selected-roles-for-'+menuId).is(':checked')) {
               $('#hide-for-roles-'+menuId).show();
               $('#menu-required-capability-for-'+menuId).show();
            }
         }
      });
      
      // Handle checkbox to always hide and for which
      $('#custom-admin-menu').on('click', '.hide-by-role-checkbox', function() {
         var menuId = $(this).data('menu-item-id');
         var menuType = $(this).data('menu-type'); // 'parent' (menu) or 'sub' (menu)
         // console.log( '.hide-by-role-checkbox >> menuId: ' + menuId + ' // menuType: ' + menuType );
         $('#hide-status-for-'+menuId).prop('checked', true);
         $('#hide-until-toggled-for-'+menuId).prop('checked', false);
         
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
            $('#all-selected-roles-radio-for-'+menuId).show();
            if ($('#all-roles-except-for-'+menuId).is(':checked') || $('#selected-roles-for-'+menuId).is(':checked')) {
               $('#hide-for-roles-'+menuId).show();
               $('#menu-required-capability-for-'+menuId).show();
               if ($('#selected-roles-for-'+menuId).is(':checked')) {
                  // For a parent menu item
                  if ( menuType == 'parent' ) {
                     menuAlwaysHidden[menuId]['always_hide_for'] = 'selected-roles';
                  }
                  // For a submenu item
                  if ( menuType == 'sub' ) {
                     submenuAlwaysHidden[menuId]['always_hide_for'] = 'selected-roles';                  
                  }
               } else if ($('#all-roles-except-for-'+menuId).is(':checked')) {
                  // For a parent menu item
                  if ( menuType == 'parent' ) {
                     menuAlwaysHidden[menuId]['always_hide_for'] = 'all-roles-except';
                  }
                  // For a submenu item
                  if ( menuType == 'sub' ) {
                     submenuAlwaysHidden[menuId]['always_hide_for'] = 'all-roles-except';                  
                  }
               }

            } else if ($('#all-roles-for-'+menuId).is(':checked')) {
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
            }
            // For a submenu item
            if ( menuType == 'sub' ) {
               submenuAlwaysHidden[menuId]['always_hide'] = false;
               submenuAlwaysHidden[menuId]['always_hide_for'] = '';
               submenuAlwaysHidden[menuId]['which_roles'] = [];            
            }

            $('#all-selected-roles-radio-for-'+menuId).hide();
            $('#hide-for-roles-'+menuId).hide();
            $('#menu-required-capability-for-'+menuId).hide();
            if (!$('#hide-until-toggled-for-'+menuId).is(':checked')) {
               $('#hide-status-for-'+menuId).prop('checked',false);
            }
         }

         // For a parent menu item
         if ( menuType == 'parent' ) {
            document.getElementById('admin_site_enhancements[custom_menu_always_hidden]').value = JSON.stringify(menuAlwaysHidden);
         }
         // For a submenu item
         if ( menuType == 'sub' ) {
            document.getElementById('admin_site_enhancements[custom_submenu_always_hidden]').value = JSON.stringify(submenuAlwaysHidden);         
         }
      });

      // Handle selection of roles scope
      $('#custom-admin-menu').on('change', '.all-selected-roles-radios', function() {
         var menuId = $(this).data('menu-item-id');
         var menuType = $(this).data('menu-type'); // 'parent' (menu) or 'sub' (menu)
         // console.log( '.all-selected-roles-radios >> menuId: ' + menuId + ' // menuType: ' + menuType );
         if (this.value == 'all-roles-except' || this.value == 'selected-roles') {
            $('#hide-for-roles-'+menuId).show();
            $('#menu-required-capability-for-'+menuId).show();
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

            $('#hide-until-toggled-for-'+menuId).prop('checked',false);

            if ( menuType == 'parent' ) {
               menuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            }
            // For a submenu item
            if ( menuType == 'sub' ) {
               submenuAlwaysHidden[menuId]['hide_by_toggle'] = false;
            }

            $('#hide-for-roles-'+menuId).hide();
            $('#menu-required-capability-for-'+menuId).hide();
         }

         if ( menuType == 'parent' ) {
            document.getElementById('admin_site_enhancements[custom_menu_always_hidden]').value = JSON.stringify(menuAlwaysHidden);
         }
         // For a submenu item
         if ( menuType == 'sub' ) {
            document.getElementById('admin_site_enhancements[custom_submenu_always_hidden]').value = JSON.stringify(submenuAlwaysHidden);
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
            document.getElementById('admin_site_enhancements[custom_menu_always_hidden]').value = JSON.stringify(menuAlwaysHidden);            
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
            document.getElementById('admin_site_enhancements[custom_submenu_always_hidden]').value = JSON.stringify(submenuAlwaysHidden);            
         }
      });

      // Prepare constant to store IDs of new separator menu items
      var newSeparatorsInput = document.getElementById('admin_site_enhancements[custom_menu_new_separators]');
      if ( newSeparatorsInput && newSeparatorsInput.value ) {
         var newSeparators = JSON.parse(newSeparatorsInput.value); // object
      } else {
         var newSeparators = {}; // object
      }

      // Add new separator
      $('.admin-interface.custom-menu-order').on('click', '#add-menu-separator', function(e) {
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
      });
      
      // Remove custom menu item
      $('#custom-admin-menu').on('click', '.remove-menu-item', function(e) {
         var newSeparator = $(this).parents('.menu-item.parent-menu-item');
         // console.log(newSeparator);
         dontSaveNewSeparator(newSeparators,newSeparator);
         newSeparator.remove();
         $('#custom-admin-menu').sortable('refresh');
      });
      /*! </fs_premium_only> */

      // ----- Parent Menu Item Hiding -----

      // Prepare constant to store IDs of menu items that will be hidden
      if ( document.getElementById('admin_site_enhancements[custom_menu_hidden]') != null ) {
         var hiddenMenuItems = document.getElementById('admin_site_enhancements[custom_menu_hidden]').value.split(","); // array
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
            document.getElementById('admin_site_enhancements[custom_menu_hidden]').value = hiddenMenuItems;

         });

      });

      // Clicking on header save button
      $('.asenha-save-button').click( function(e) {

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
         document.getElementById('admin_site_enhancements[custom_menu_titles]').value = customMenuTitles;

      });

   }); // End of $(document).ready()

   /*! <fs_premium_only> */
   function initMenuAlwaysHidden(menuAlwaysHidden,menuItemObject) {
      var menuId = $(menuItemObject).data('menu-item-id');
      var menuTitle = $(menuItemObject).data('menu-item-title');
      var menuIdOri = $(menuItemObject).data('menu-item-id-ori'); // original, untransformed ID
      var menuUrlFragment = $(menuItemObject).data('menu-url-fragment');
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
      if ( $('#hide-until-toggled-for-'+menuId).is(':checked') || $('hide-by-role-for-'+menuId).is(':checked') ) {
         $(menuItemObject).prop('checked', true);            
      }
      if (typeof menuAlwaysHidden[menuId]['menu_url_fragment'] === 'undefined') {
         menuAlwaysHidden[menuId]['menu_url_fragment'] = menuUrlFragment;
      }
      // console.log(menuAlwaysHidden);
      document.getElementById('admin_site_enhancements[custom_menu_always_hidden]').value = JSON.stringify(menuAlwaysHidden);
   }

   function initSubmenuAlwaysHidden(submenuAlwaysHidden,submenuItemObject) {
      var submenuId = $(submenuItemObject).data('menu-item-id');
      var submenuTitle = $(submenuItemObject).data('menu-item-title');
      var submenuIdOri = $(submenuItemObject).data('menu-item-id-ori'); // original, untransformed ID
      var submenuUrlFragment = $(submenuItemObject).data('menu-url-fragment');
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
      if ( $('#hide-until-toggled-for-'+submenuId).is(':checked') || $('hide-by-role-for-'+submenuId).is(':checked') ) {
         $(submenuItemObject).prop('checked', true);            
      }
      if (typeof submenuAlwaysHidden[submenuId]['menu_url_fragment'] === 'undefined') {
         submenuAlwaysHidden[submenuId]['menu_url_fragment'] = submenuUrlFragment;
      }
      // console.log(submenuAlwaysHidden);
      document.getElementById('admin_site_enhancements[custom_submenu_always_hidden]').value = JSON.stringify(submenuAlwaysHidden);
   }
   
   // Add a new separator and make sure 
   function addNewSeparator(menuAlwaysHidden,newSeparators,separatorCount) {
         var newSeparator = $('#separator1').clone().prop('id','separator' + separatorCount).addClass('custom-menu-item').attr('data-custom-menu-item','yes');
         // console.log(newSeparator);
         newSeparator.find('.menu-item-title').html('~~ Separator-'+ separatorCount +' ~~');
         // Replace all occurrences of 'separator1' with the new separator ID using regex /separator1/g
         var newHtml = newSeparator.html().replace(/separator1/g,'separator' + separatorCount);
         newSeparator.html(newHtml);
         $('#custom-admin-menu').append(newSeparator);
         initMenuAlwaysHidden(menuAlwaysHidden,newSeparator.find('.parent-menu-hide-checkbox-prm'));
         saveNewSeparator(newSeparators,newSeparator.find('.parent-menu-hide-checkbox-prm'));      
   }
   
   // Add separator to list of separators to save
   function saveNewSeparator(newSeparators,newSeparatorObject) {
      var menuId = $(newSeparatorObject).data('menu-item-id');
      if (typeof newSeparators[menuId] === 'undefined') {
         newSeparators[menuId] = {};
      }

      newSeparators[menuId]['menu_id'] = menuId;
      // newSeparators = {}; // To reset value during dev/testing

      document.getElementById('admin_site_enhancements[custom_menu_new_separators]').value = JSON.stringify(newSeparators);
   }

   // Remove separator from list of separators to save
   function dontSaveNewSeparator(newSeparators,newSeparatorObject) {
      var menuId = newSeparatorObject[0].id;
      // console.log('menuId: '+menuId);
      // console.log('newSeparators before: ' + JSON.stringify(newSeparators));
      delete newSeparators[menuId];
      // console.log('newSeparators after: ' + JSON.stringify(newSeparators));
      document.getElementById('admin_site_enhancements[custom_menu_new_separators]').value = JSON.stringify(newSeparators);
   }

   // References
   // Bind events to dynamically-generated elements: https://stackoverflow.com/a/1207393
   /*! </fs_premium_only> */

})( jQuery );