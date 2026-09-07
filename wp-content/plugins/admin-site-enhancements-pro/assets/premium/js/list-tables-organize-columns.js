(function( $ ) {
   'use strict';

   /**
    * Check whether Admin Columns Manager horizontal scrolling wrapper is enabled on the page.
    *
    * @return {boolean}
    */
   function asenhaIsListTableWrapperEnabled() {
      return !! document.getElementById( 'list-table-wrapper' );
   }

   /**
    * Update whether list table wrapper should have horizontal scrolling enabled.
    *
    * @return {void}
    */
   function asenhaUpdateHScrollClass() {
      if ( ! asenhaIsListTableWrapperEnabled() ) {
         return;
      }

      var $wrapper = $( '#list-table-wrapper' );
      var $table   = $wrapper.find( '.wp-list-table' );

      if ( ! $table.length ) {
         return;
      }

      var wrapperWidth = $wrapper.width();
      var tableWidth   = $table.width();

      if ( tableWidth > wrapperWidth ) {
         $wrapper.addClass( 'h-scrollable' );
      } else {
         $wrapper.removeClass( 'h-scrollable' );
      }
   }

   /**
    * Get configured freeze-header-row value for current post type.
    *
    * @return {boolean}
    */
   function asenhaGetFreezeHeaderRow() {
      return !! (
         'undefined' !== typeof asenhaListTablesOrganizeColumns
         && asenhaListTablesOrganizeColumns
         && !! asenhaListTablesOrganizeColumns.freezeHeaderRow
      );
   }

   /**
    * Get the current fixed admin bar height (if present).
    *
    * @return {number}
    */
   function asenhaGetAdminBarHeight() {
      var adminBar = document.getElementById( 'wpadminbar' );
      if ( ! adminBar ) {
         return 0;
      }

      return adminBar.getBoundingClientRect().height || 0;
   }

   /**
    * Freeze the list table header row on vertical scroll.
    *
    * This is JS-driven (translateY) so it works reliably even when ancestors have overflow-x set.
    *
    * @return {void}
    */
   function asenhaInitFreezeHeaderRow() {
      var listTable = document.querySelector( '.wp-list-table' );
      if ( ! listTable ) {
         return;
      }

      // Enable/disable per post type.
      if ( ! asenhaGetFreezeHeaderRow() ) {
         listTable.classList.remove( 'asenha-acm-freeze-header-row' );
         if ( listTable.tHead ) {
            listTable.tHead.style.transform = '';
         }
         return;
      }

      listTable.classList.add( 'asenha-acm-freeze-header-row' );

      var head = listTable.tHead ? listTable.tHead : listTable.querySelector( 'thead' );
      if ( ! head ) {
         return;
      }

      var ticking = false;

      function update() {
         ticking = false;

         // If the table is hidden (e.g. during init), avoid invalid measurements.
         if ( ! listTable.offsetParent ) {
            return;
         }

         var topOffset = asenhaGetAdminBarHeight();
         var tableRect = listTable.getBoundingClientRect();
         var headRect  = head.getBoundingClientRect();

         // If table is entirely above/below viewport, remove translation to avoid odd overlaps.
         if ( tableRect.bottom <= topOffset || tableRect.top >= window.innerHeight ) {
            head.style.transform = '';
            return;
         }

         var maxTranslate = Math.max( 0, tableRect.height - headRect.height );
         var desired      = Math.max( 0, topOffset - tableRect.top );
         var translateY   = Math.min( desired, maxTranslate );

         // Use translate3d to get smoother updates.
         head.style.transform = translateY ? 'translate3d(0,' + translateY + 'px,0)' : '';
      }

      function requestUpdate() {
         if ( ticking ) {
            return;
         }
         ticking = true;
         window.requestAnimationFrame( update );
      }

      // Initial positioning.
      requestUpdate();

      // Update on scroll + resize.
      window.addEventListener( 'scroll', requestUpdate, { passive: true } );
      window.addEventListener( 'resize', requestUpdate );
   }

   /**
    * Get configured freeze-first-columns value for current post type.
    *
    * Value represents the number of data columns to freeze (excludes checkbox column).
    * 0 = No columns (do not freeze anything).
    *
    * @return {number}
    */
   function asenhaGetFreezeFirstColumns() {
      var freezeFirstColumns = 1;

      if (
         'undefined' !== typeof asenhaListTablesOrganizeColumns
         && asenhaListTablesOrganizeColumns
         && 'undefined' !== typeof asenhaListTablesOrganizeColumns.freezeFirstColumns
      ) {
         freezeFirstColumns = parseInt( asenhaListTablesOrganizeColumns.freezeFirstColumns, 10 );
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

      return freezeFirstColumns;
   }

   /**
    * Remove previously applied frozen column styles.
    *
    * @param {Element} listTable List table element.
    * @return {void}
    */
   function asenhaClearFrozenColumns( listTable ) {
      if ( ! listTable ) {
         return;
      }

      var frozenCells = listTable.querySelectorAll( '.asenha-acm-frozen, .asenha-acm-last-frozen' );
      Array.prototype.forEach.call( frozenCells, function( cell ) {
         cell.classList.remove( 'asenha-acm-frozen' );
         cell.classList.remove( 'asenha-acm-last-frozen' );
         cell.style.left = '';
      } );
   }

   /**
    * Apply sticky positioning to checkbox column + N data columns.
    *
    * @return {void}
    */
   function asenhaApplyFrozenColumns() {
      if ( ! asenhaIsListTableWrapperEnabled() ) {
         return;
      }

      var wrapper   = document.getElementById( 'list-table-wrapper' );
      var listTable = wrapper ? wrapper.querySelector( '.wp-list-table' ) : null;

      if ( ! wrapper || ! listTable ) {
         return;
      }

      // Always clear first to avoid stale offsets after DOM updates.
      asenhaClearFrozenColumns( listTable );

      // Only apply when the wrapper is actually scrollable.
      if ( ! wrapper.classList.contains( 'h-scrollable' ) ) {
         return;
      }

      var freezeDataColumns = asenhaGetFreezeFirstColumns();
      if ( 0 === freezeDataColumns ) {
         return;
      }

      var headRow = null;
      if ( listTable.tHead && listTable.tHead.rows && listTable.tHead.rows.length ) {
         headRow = listTable.tHead.rows[0];
      } else {
         headRow = listTable.querySelector( 'thead tr' );
      }

      if ( ! headRow || ! headRow.cells || ! headRow.cells.length ) {
         return;
      }

      var freezeTotalCells = 1 + freezeDataColumns; // include checkbox column
      freezeTotalCells = Math.min( freezeTotalCells, headRow.cells.length );

      if ( freezeTotalCells <= 0 ) {
         return;
      }

      var leftOffsets = [];
      var currentLeft = 0;

      for ( var i = 0; i < freezeTotalCells; i++ ) {
         leftOffsets[i] = currentLeft;

         var headCell = headRow.cells[i];
         if ( ! headCell ) {
            break;
         }

         currentLeft += headCell.getBoundingClientRect().width;
      }

      function applyToRow( row ) {
         if ( ! row || ! row.cells || ! row.cells.length ) {
            return;
         }

         // Skip rows that use colspan and/or have different cell structures.
         if ( row.classList && ( row.classList.contains( 'inline-edit-row' ) || row.classList.contains( 'no-items' ) ) ) {
            return;
         }

         for ( var i = 0; i < freezeTotalCells; i++ ) {
            var cell = row.cells[i];
            if ( ! cell ) {
               continue;
            }

            cell.classList.add( 'asenha-acm-frozen' );
            cell.style.left = leftOffsets[i] + 'px';

            if ( i === freezeTotalCells - 1 ) {
               cell.classList.add( 'asenha-acm-last-frozen' );
            } else {
               cell.classList.remove( 'asenha-acm-last-frozen' );
            }
         }
      }

      if ( listTable.tHead && listTable.tHead.rows ) {
         Array.prototype.forEach.call( listTable.tHead.rows, applyToRow );
      }

      if ( listTable.tBodies && listTable.tBodies.length ) {
         Array.prototype.forEach.call( listTable.tBodies, function( tbody ) {
            if ( tbody && tbody.rows ) {
               Array.prototype.forEach.call( tbody.rows, applyToRow );
            }
         } );
      }

      if ( listTable.tFoot && listTable.tFoot.rows ) {
         Array.prototype.forEach.call( listTable.tFoot.rows, applyToRow );
      }
   }

   /**
    * Re-apply background colors for the custom field color preview element.
    *
    * @param {jQuery} $context Context where .custom-field-color should be searched.
    * @return {void}
    */
   function asenhaInitColorPreviews( $context ) {
      if ( ! $context || ! $context.length ) {
         return;
      }

      // For color field columns when the inline style contains RGAB color and is stripped out by wp_kses_post.
      // Ref: https://core.trac.wordpress.org/ticket/24157
      $context.find( '.custom-field-color' ).each( function() {
         var bgColor = $( this ).text();
         $( this ).find( '.custom-field-color-preview' ).css( 'background', bgColor );
      } );
   }

   /**
    * Wrap list table inside #list-table-wrapper and initialize h-scroll class.
    *
    * @return {void}
    */
   function asenhaInitListTableWrapper() {
      if ( ! asenhaIsListTableWrapperEnabled() ) {
         return;
      }

      var listTableWrapper = document.getElementById( 'list-table-wrapper' );
      var listTable        = document.querySelector( '.wp-list-table' );

      if ( ! listTableWrapper || ! listTable ) {
         return;
      }

      // Move wrapper before the list table, then move list table inside the wrapper.
      if ( ! listTableWrapper.contains( listTable ) ) {
         $( listTableWrapper ).insertBefore( listTable );
         $( listTable ).appendTo( listTableWrapper );
      }

      asenhaUpdateHScrollClass();
      asenhaApplyFrozenColumns();

      // Add .is-sticky class when the first column is positioned as sticky when horizontally scrolling
      // At present, adds .is-sticky on page load, not on scroll.
      // const options = {
      //    // The horizontally scrolling container
      //    root: document.querySelector('#list-table-wrapper'),
      //    rootMargin: '0px',
      //    threshold: [0, 1] // Observe when any part is visible (0) and when fully visible (1)
      // };
      //
      // const callback = (entries, observer) => {
      //    entries.forEach(entry => {
      //       if (entry.isIntersecting) {
      //          // Element is intersecting (e.g., becoming sticky or unsticky)
      //          if (entry.intersectionRatio === 1) {
      //             // Element is fully visible and potentially "stuck"
      //             entry.target.classList.add('is-sticky');
      //          } else if (entry.intersectionRatio > 0) {
      //             // Element is partially visible
      //             entry.target.classList.remove('is-sticky');
      //          }
      //       } else {
      //          // Element is completely out of view
      //          entry.target.classList.remove('is-sticky');
      //       }
      //    });
      // };
      //
      // const observer = new IntersectionObserver(callback, options);
      //
      // const stickyThElement = document.querySelector('#list-table-wrapper > table > thead > tr > th:first-of-type');
      // const stickyTdElement = document.querySelector('#list-table-wrapper > table > tbody > tr > td:first-of-type');
      // observer.observe(stickyThElement);
      // observer.observe(stickyTdElement);
   }

   /**
    * Initialize row-level enhancements after a row gets inserted/replaced (e.g. Quick Edit AJAX save).
    *
    * @param {Element} row Row element (expected: tr#post-123).
    * @return {void}
    */
   function asenhaInitRowEnhancements( row ) {
      if ( ! row || 1 !== row.nodeType ) {
         return;
      }

      if ( '1' === row.getAttribute( 'data-asenha-acm-inited' ) ) {
         return;
      }

      row.setAttribute( 'data-asenha-acm-inited', '1' );

      asenhaInitColorPreviews( $( row ) );

      // Only needed when the horizontal scroll wrapper is enabled for this list table.
      asenhaUpdateHScrollClass();
      asenhaApplyFrozenColumns();
   }

   /**
    * Observe list table rows and re-init enhancements when rows are inserted/replaced via AJAX.
    * This is intentionally gated by #list-table-wrapper existence (horizontal scrolling enabled).
    *
    * @return {void}
    */
   function asenhaObserveListTable() {
      if ( ! asenhaIsListTableWrapperEnabled() ) {
         return;
      }

      if ( 'undefined' === typeof MutationObserver ) {
         return;
      }

      var list = document.getElementById( 'the-list' );
      if ( ! list ) {
         return;
      }

      var observer = new MutationObserver( function( mutations ) {
         mutations.forEach( function( mutation ) {
            if ( ! mutation.addedNodes || ! mutation.addedNodes.length ) {
               return;
            }

            Array.prototype.forEach.call( mutation.addedNodes, function( node ) {
               if ( ! node || 1 !== node.nodeType ) {
                  return;
               }

               // Common case: a single row gets inserted/replaced.
               if ( node.id && 0 === node.id.indexOf( 'post-' ) ) {
                  asenhaInitRowEnhancements( node );
               }

               // Defensive: handle cases where a fragment/wrapper contains the row(s).
               if ( node.querySelectorAll ) {
                  Array.prototype.forEach.call(
                     node.querySelectorAll( 'tr[id^=\"post-\"]' ),
                     function( row ) {
                        asenhaInitRowEnhancements( row );
                     }
                  );
               }
            } );
         } );
      } );

      observer.observe( list, { childList: true } );
   }

   $(document).ready( function() {

      // Move "Manage Columns" button to the right of "Filter" button on list tables.
      $( '#organize-columns' ).appendTo( '.tablenav.top .alignleft.actions:not(.bulkactions)' );

      // Encapsulate list table inside a wrapper for horizontal scrolling (if enabled).
      asenhaInitListTableWrapper();

      // Ensure list table UI is visible even when CSS hides it by default.
      $( '.tablenav.top, .tablenav.bottom' ).show();
      $( '.wp-list-table' ).show();

      // Freeze header row on vertical scroll (works with or without list-table wrapper).
      asenhaInitFreezeHeaderRow();

      // Expand / collapse toggler for repeater field content | Modified from https://codepen.io/symonsays/pen/rzgEgY
      $( document ).on( 'click', '.collection-items-wrapper > .show-more-less', function( e ) {
         e.preventDefault();

         var $this = $( this );
         $this.toggleClass( 'show-more' );

         if ( $this.hasClass( 'show-more' ) ) {
            $this.next().removeClass( 'opened', 0 );
            $this.html( 'Expand &#9660;' );
         } else {
            $this.next().addClass( 'opened', 0 );
            $this.html( 'Collapse &#9650;' );
         }
      } );

      $( document ).on( 'click', '.wp-list-table .column-primary .toggle-row', function() {
         var $this         = $( this );
         var $thCheckColumn = $this.parents( 'tr.hentry' ).find( 'th.check-column' );

         $this.parents( 'td.column-primary' ).insertAfter( $thCheckColumn );
         asenhaApplyFrozenColumns();
      } );

      // Initial run (covers page load).
      asenhaInitColorPreviews( $( document ) );

      // Re-init after Quick Edit replaces rows via AJAX (only when #list-table-wrapper exists).
      asenhaObserveListTable();

      // Recompute scrollability + frozen columns on resize.
      var asenhaResizeTimer = null;
      $( window ).on( 'resize', function() {
         if ( ! asenhaIsListTableWrapperEnabled() ) {
            return;
         }

         if ( asenhaResizeTimer ) {
            window.clearTimeout( asenhaResizeTimer );
         }

         asenhaResizeTimer = window.setTimeout( function() {
            asenhaUpdateHScrollClass();
            asenhaApplyFrozenColumns();
         }, 150 );
      } );

   }); // END OF $(document).ready()

})( jQuery );