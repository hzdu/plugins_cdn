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

      /**
       * Show "REST API" row in Settings only when Placement is "On Posts".
       */
      const syncCfgroupRestApiRowVisibility = () => {
         const $row = $('#asenha-cfgroup-rest-api-row');
         if (!$row.length) {
            return;
         }
         const $checked = $('input[name="cfgroup[rules][placement]"]:checked');
         const placement = $checked.length ? $checked.val() : '';
         if (placement === 'posts') {
            $row.show();
         } else {
            $row.hide();
         }
      };

      syncCfgroupRestApiRowVisibility();
      $(document).on('change', 'input[name="cfgroup[rules][placement]"]', syncCfgroupRestApiRowVisibility);

      /**
       * Sticky top bar showing Field Group Title + Publish/Update button.
       *
       * Appears when Publish meta box (#submitdiv) is out of view, and hides again when it re-enters.
       */
      const initStickyPublishBar = () => {
         const $submitDiv = $('#submitdiv');
         const $titleInput = $('#title');
         const $publishButton = $('#publish');
         const $wpBodyContent = $('#wpbody-content');
         const $wpContent = $('#wpcontent');

         if (
            !$submitDiv.length ||
            !$titleInput.length ||
            !$publishButton.length ||
            !$wpBodyContent.length ||
            !$wpContent.length
         ) {
            return;
         }

         if ($('#asenha-cfgroup-sticky-publish-bar').length) {
            return;
         }

         $wpBodyContent.prepend(
            '<div id="asenha-cfgroup-sticky-publish-bar" class="asenha-cfgroup-sticky-publish-bar" aria-hidden="true">' +
               '<div class="asenha-cfgroup-sticky-publish-bar__inner">' +
                  '<div class="asenha-cfgroup-sticky-publish-bar__title" aria-live="polite"></div>' +
                  '<div class="asenha-cfgroup-sticky-publish-bar__actions">' +
                     '<button type="button" class="button button-primary asenha-cfgroup-sticky-publish-bar__action"></button>' +
                  '</div>' +
               '</div>' +
            '</div>'
         );

         const $bar = $('#asenha-cfgroup-sticky-publish-bar');
         const $barTitle = $bar.find('.asenha-cfgroup-sticky-publish-bar__title');
         const $barAction = $bar.find('.asenha-cfgroup-sticky-publish-bar__action');
         let isBarVisible = false;
         let isPositionSyncScheduled = false;

         const getTitleText = () => {
            const val = $.trim($titleInput.val());
            if (val) {
               return val;
            }

            const placeholder = $.trim($titleInput.attr('placeholder') || '');
            if (placeholder) {
               return placeholder;
            }

            const promptText = $.trim($('#title-prompt-text').text() || '');
            if (promptText) {
               return promptText;
            }

            return '';
         };

         const getPrimaryActionLabel = () => {
            const val = $.trim($publishButton.val() || '');
            if (val) {
               return val;
            }

            const text = $.trim($publishButton.text() || '');
            if (text) {
               return text;
            }

            return 'Publish';
         };

         const syncTitle = () => {
            $barTitle.text(getTitleText());
         };

         const syncPosition = () => {
            const el = $wpContent.get(0);
            if (!el) {
               return;
            }

            const rect = el.getBoundingClientRect();

            // Align the fixed bar to #wpcontent so it sits flush against the admin menu.
            $bar.css({
               left: rect.left + 'px',
               width: rect.width + 'px'
            });
         };

         const scheduleSyncPosition = () => {
            if (isPositionSyncScheduled) {
               return;
            }
            isPositionSyncScheduled = true;

            window.requestAnimationFrame(() => {
               isPositionSyncScheduled = false;
               syncPosition();
            });
         };

         const syncAction = () => {
            $barAction.text(getPrimaryActionLabel());

            const isDisabled =
               $publishButton.is(':disabled') ||
               $publishButton.hasClass('disabled') ||
               'true' === $publishButton.attr('aria-disabled');

            $barAction.prop('disabled', isDisabled);
            $barAction.toggleClass('disabled', isDisabled);
         };

         const setVisible = shouldShow => {
            // If Publish meta box is hidden (screen options), keep bar hidden too.
            if (!$submitDiv.is(':visible')) {
               shouldShow = false;
            }

            shouldShow = !!shouldShow;

            if (shouldShow === isBarVisible) {
               return;
            }

            isBarVisible = shouldShow;

            if (shouldShow) {
               scheduleSyncPosition();
               syncTitle();
               syncAction();
            }

            $bar.toggleClass('is-visible', shouldShow);
            $bar.attr('aria-hidden', shouldShow ? 'false' : 'true');

         };

         const isElementInViewport = el => {
            if (!el) {
               return true;
            }
            const rect = el.getBoundingClientRect();
            const windowH = window.innerHeight || document.documentElement.clientHeight;
            const windowW = window.innerWidth || document.documentElement.clientWidth;

            // Consider "in view" if any part of the element intersects the viewport.
            return rect.bottom > 0 && rect.right > 0 && rect.top < windowH && rect.left < windowW;
         };

         $barAction.on('click', function(e) {
            e.preventDefault();
            $publishButton.trigger('click');
         });

         $titleInput.on('input keyup change', function() {
            syncTitle();
         });

         // Keep positioning correct when the admin menu collapses/expands or window resizes.
         $(window).on('resize', function() {
            scheduleSyncPosition();
         });
         $('#collapse-menu, #wp-admin-bar-menu-toggle').on('click', function() {
            scheduleSyncPosition();
            window.setTimeout(scheduleSyncPosition, 250);
         });

         // Keep the sticky action in sync if WP toggles the primary action state/label.
         if ('MutationObserver' in window) {
            const publishEl = $publishButton.get(0);
            const mo = new MutationObserver(() => {
               if (isBarVisible) {
                  syncAction();
               }
            });
            mo.observe(publishEl, {
               attributes: true,
               attributeFilter: [ 'value', 'disabled', 'class', 'aria-disabled' ]
            });
         }

         // Toggle visibility based on #submitdiv viewport intersection.
         if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
               entries => {
                  if (!entries || !entries.length) {
                     return;
                  }

                  const entry = entries[0];
                  setVisible(!entry.isIntersecting);
               },
               {
                  root: null,
                  threshold: 0
               }
            );

            observer.observe($submitDiv.get(0));
         } else {
            let ticking = false;
            const onScroll = () => {
               if (ticking) {
                  return;
               }
               ticking = true;

               window.requestAnimationFrame(() => {
                  ticking = false;
                  setVisible(!isElementInViewport($submitDiv.get(0)));
               });
            };

            $(window).on('scroll resize', onScroll);
         }

         // Initial state.
         syncPosition();
         setVisible(!isElementInViewport($submitDiv.get(0)));
      };

      initStickyPublishBar();

   }); // END OF $(document).ready()

})( jQuery );