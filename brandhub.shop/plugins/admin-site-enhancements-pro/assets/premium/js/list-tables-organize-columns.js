(function( $ ) {
   'use strict';

   $(document).ready( function() {

      // Move "Manage Columns" button to the right of "Filter" button on list tables
      $('#organize-columns').appendTo('.tablenav.top .alignleft.actions:not(.bulkactions)');

      // Move "Manage Columns" button to the right of "Filter" button on media library
      // $('#organize-columns').appendTo('.filter-items');

      // Encapsulate list table inside a wrapper for horizontal scrolling
      const listTableWrapper = document.getElementById('list-table-wrapper');
      $(listTableWrapper).insertBefore('.wp-list-table');
      $('.wp-list-table').appendTo(listTableWrapper);
      
      // Calculate widths and append hscrollable class as needed
      const listTableWrapperWidth = $('#list-table-wrapper').width();
      const listTableWidth = $('#list-table-wrapper .wp-list-table').width();
      
      if ( listTableWidth > listTableWrapperWidth ) {
         $('#list-table-wrapper').addClass('h-scrollable');
      }

      // Expand / collapse toggler for repeater field content | Modified from https://codepen.io/symonsays/pen/rzgEgY
      $('.collection-items-wrapper > .show-more').click(function(e) {

         e.preventDefault();

         var $this = $(this);
         $this.toggleClass('show-more');

         if ($this.hasClass('show-more')) {
            $this.next().removeClass('opened',0);
            $this.html('Expand &#9660;');
         } else {
            $this.next().addClass('opened',0);
            $this.html('Collapse &#9650;');
         }

      });
      
      $('.wp-list-table .column-primary .toggle-row').click(function(e) {
         var $this = $(this),
             $thCheckColumn = $this.parents('tr.hentry').find('th.check-column');
             
             $this.parents('td.column-primary').insertAfter($thCheckColumn);
      });

   }); // END OF $(document).ready()

})( jQuery );