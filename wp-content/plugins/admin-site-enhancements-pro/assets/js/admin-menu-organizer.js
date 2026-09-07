(function( $ ) {
   'use strict';

   $(document).ready( function() {
      var strings = ( typeof amoPageVars !== 'undefined' && amoPageVars.strings ) ? amoPageVars.strings : {};

      // Save changes
      $('#amo-save-changes').click(function(e) {
         e.preventDefault();
         $('.asenha-saving-changes').fadeIn();
         
         var menu_data = {
            'action':'save_admin_menu',
            'nonce': amoPageVars.saveMenuNonce,            
            'custom_menu_order': document.getElementById('custom_menu_order').value,
            'custom_menu_titles': document.getElementById('custom_menu_titles').value,
            'custom_menu_hidden': document.getElementById('custom_menu_hidden').value
         }

         /*! <fs_premium_only> */
         // Check if there are new custom menu items being added
         var hasNewCustomMenus = false;
         if ($('#custom-admin-menu li[data-custom-menu-item="yes"][data-saved="false"]').length > 0) {
            hasNewCustomMenus = true;
         }

      menu_data = {
         'action':'save_admin_menu',
         'nonce': amoPageVars.saveMenuNonce,            
         'custom_menu_order': document.getElementById('custom_menu_order').value,
         'custom_menu_titles': document.getElementById('custom_menu_titles').value,
         'custom_menu_hidden': document.getElementById('custom_menu_hidden').value, // This will be empty
         'custom_submenus_order': document.getElementById('custom_submenus_order').value,
         'custom_menu_always_hidden': document.getElementById('custom_menu_always_hidden').value,
         'custom_submenu_always_hidden': document.getElementById('custom_submenu_always_hidden').value,
         'custom_menu_new_separators': document.getElementById('custom_menu_new_separators').value,
         'custom_menu_deleted_separators': document.getElementById('custom_menu_deleted_separators').value,
         'custom_menu_new_items': document.getElementById('custom_menu_new_items').value,
         'built_in_menu_rule_capability_map': amoPageVars.builtInCapabilityMapPayload || '',
         'built_in_menu_rule_capability_signature': amoPageVars.builtInCapabilityMapSignature || ''
      }
         /*! </fs_premium_only> */
         
         $.ajax({
            type: "post",
            url: ajaxurl,
            dataType: 'json',
            data: menu_data,
            success:function(response) {
               $('.asenha-saving-changes').hide();

               if ( ! response || response.success !== true ) {
                  if ( strings.saveChangesError ) {
                     window.alert( strings.saveChangesError );
                  }
                  return;
               }

               /*! <fs_premium_only> */
               // Reload page if new custom menus were added
               if (typeof hasNewCustomMenus !== 'undefined' && hasNewCustomMenus) {
                  document.location.reload(true);
                  return;
               }
               /*! </fs_premium_only> */

               $('.asenha-changes-saved').fadeIn(400).delay(2500).fadeOut(400);
            },
            error:function(jqXHR) {
               var message = strings.saveChangesError || '';

               $('.asenha-saving-changes').hide();

               if ( jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.data && jqXHR.responseJSON.data.message ) {
                  message = jqXHR.responseJSON.data.message;
               }

               if ( message ) {
                  window.alert( message );
               }
               console.log(jqXHR);
            }
         });
      });

      /*! <fs_premium_only> */
      // Reset admin menu via AJAX
      $('#reset-menu').click(function(e) {
         e.preventDefault();
         $('.reset-menu-spinner').show();
         $.ajax({
            type: "post",
            url: ajaxurl,
            data: {
               'action':'reset_admin_menu',
               'nonce': amoPageVars.resetMenuNonce
            },
            success:function(data) {
               var data = data.slice(0,-1); // remove strange trailing zero in string returned by AJAX call
               var response = JSON.parse(data);

               if ( response.status == 'success' ) {
                  document.location.reload(true);
               }
            },
            error:function(errorThrown) {
               console.log(errorThrown);
            }
         });
      });
      /*! </fs_premium_only> */

   }); // END OF $(document).ready()

})( jQuery );