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

   }); // END OF $(document).ready()

})( jQuery );