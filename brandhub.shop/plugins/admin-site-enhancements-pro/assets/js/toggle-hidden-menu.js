(function( $ ) {
   'use strict';

   $(document).ready( function() {

      $('#toplevel_page_asenha_hide_hidden_menu').hide();

      // Show hidden menu items

      $('#toplevel_page_asenha_show_hidden_menu a').on( 'click', function(e) {
         e.preventDefault();
         $('#toplevel_page_asenha_show_hidden_menu').hide();
         $('#toplevel_page_asenha_hide_hidden_menu').show();
         $('.menu-top.asenha_hidden_menu').toggleClass('hidden');
         $('.wp-menu-separator.asenha_hidden_menu').toggleClass('hidden');
         /*! <fs_premium_only> */
         $('#adminmenu .wp-submenu li.asenha_hidden_menu').toggleClass('hidden');
         $('#adminmenu .wp-submenu a.asenha_hidden_menu').toggleClass('hidden');
         /*! </fs_premium_only> */
         $(document).trigger('wp-window-resized');         
      });

      // Hide menu items set for hiding

      $('#toplevel_page_asenha_hide_hidden_menu a').on( 'click', function(e) {
         e.preventDefault();
         $('#toplevel_page_asenha_show_hidden_menu').show();
         $('#toplevel_page_asenha_hide_hidden_menu').hide();
         $('.menu-top.asenha_hidden_menu').toggleClass('hidden');
         $('.wp-menu-separator.asenha_hidden_menu').toggleClass('hidden');
         /*! <fs_premium_only> */
         $('#adminmenu .wp-submenu li.asenha_hidden_menu').toggleClass('hidden');
         $('#adminmenu .wp-submenu a.asenha_hidden_menu').toggleClass('hidden');
         /*! </fs_premium_only> */
         $(document).trigger('wp-window-resized');         
      });
      
   });

})( jQuery );