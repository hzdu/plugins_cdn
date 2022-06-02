jQuery(document).ready(function($) {

  'use strict';

    /*
     * ajax request that generates a list of interlinks suggestion in the
     * "Interlinks Suggestions" meta box
     */
    $(document.body).on('click', '#generate-ideas' , function(){

      'use strict';

        //if another request is processed right now do not proceed with another ajax request
        if($('#ajax-request-status').val() == 'processing'){return;}
       
        //get the post id for which the suggestions should be generated
        const post_id = parseInt($(this).attr('data-post-id'), 10);
        
        //prepare ajax request
        const data = {
            "action": "generate_interlinks_suggestions",
            "security": daim_nonce,
            "post_id": post_id
        };

        //show the spinner
        $('#daim-meta-suggestions .spinner').css('visibility', 'visible');
        
        //set the ajax request status
        $('#ajax-request-status').val('processing');

        //send ajax request
        $.post(daim_ajax_url, data, function(list_content) {

          'use strict';

            //show the new suggestions based on the xml response
            $('#daim-interlinks-suggestions-list').empty().append(list_content).show();
            
            //hide the spinner
            $('#daim-meta-suggestions .spinner').css('visibility', 'hidden');
            
            //set the ajax request status
            $('#ajax-request-status').val('inactive'); 
        
        });
        
    });

  /**
   * When a click is performed on the copy button of the single interlink
   * suggestion the href attribute of the link associated with the copy button
   * is first copied to an hidden input field, then selected, and then copied to
   * the clipboard.
   *
   * This method is used to skip the limitations associated with the use of the
   * clipboard.
   *
   * Ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
   */
  $(document.body).on('click', '.daim-interlinks-suggestions-copy-button' , function(){

    'use strict';

    //Save the index of the copied suggestion (the index goes from 1 to 5)
    let index = $(this).attr('data-index');

    //Get the href value of the links associated with the index
    let hrefValue = $('.daim-interlinks-suggestions-link[data-index="' + index + '"]').attr('href');

    //Put the href value in the hidden input
    $('#daim-interlinks-suggestions-hidden-input').val(hrefValue);

    //Select the text in the input (this input allows the clipboard functionality to work properly)
    let copyText = document.querySelector("#daim-interlinks-suggestions-hidden-input");
    copyText.select();

    //Copy the selected text to the clipboard
    document.execCommand("copy");

  });

  /**
   * Here the wp.data API is used to detect when a post is modified and the Interlinks Optimization meta-box needs to be
   * updated.
   *
   * Note that the update of the Interlinks Optimization meta-box is performed only if:
   *
   * - The Gutenberg editor is available. (wp.blocks is checked against undefined)
   * - The Interlinks Optimization meta-box is present in the DOM (because in specific post types or when the user
   *   doesn't have the proper capability too see it it's not available)
   *
   * References:
   *
   * - https://github.com/WordPress/gutenberg/issues/4674#issuecomment-404587928
   * - https://wordpress.org/gutenberg/handbook/packages/packages-data/
   * - https://www.npmjs.com/package/@wordpress/data
   */
  if(typeof wp.blocks !== 'undefined' && //Verify if the Gutenberg editor is available
    $('#daim-meta-optimization').length > 0){ //Verify if the Interlinks Optimization meta-box is present in the DOM

    /**
     * Since plugins like "Classic Editor" and "Page Builder by SiteOrigin" and
     * probably others makes the object retuned by wp.data.select('core/editor')
     * empty causing JavaScript errors when methods like getCurrentPost() are
     * used, do not proceed if the object retuned by
     * wp.data.select('core/editor') is empty.
     *
     * @type {boolean}
     */
    let objectIsEmpty = true;
    let obj = wp.data.select('core/editor');
    for (let key in obj) {
      if (obj.hasOwnProperty(key))
        objectIsEmpty = false;
    }
    if (objectIsEmpty) {
      return;
    }

    let lastModified = '';

    const unsubscribe = wp.data.subscribe(function(){

      'use strict';

      const postId = wp.data.select('core/editor').getCurrentPost().id;
      let postModifiedIsChanged = false;

      if(typeof wp.data.select('core/editor').getCurrentPost().modified !== 'undefined' &&
          wp.data.select('core/editor').getCurrentPost().modified !== lastModified){
        lastModified = wp.data.select('core/editor').getCurrentPost().modified;
        postModifiedIsChanged = true;
      }

      /**
       * Update the Interlinks Optimization meta-box if:
       *
       * - The post has been saved
       * - This is not an not an autosave
       * - The "lastModified" flag used to detect if the post "modified" date has changed is set to true
       */
        if(wp.data.select('core/editor').isSavingPost() &&
          !wp.data.select('core/editor').isAutosavingPost() &&
            postModifiedIsChanged === true
          ) {
            updateInterlinksOptimizationMetaBox(postId);
        }

    });

  }

  /**
   * Updates the Interlinks Optimization meta-box content.
   *
   * @param post_id The id of the current post
   */
  function updateInterlinksOptimizationMetaBox(post_id){

    'use strict';

    //prepare ajax request
    const data = {
      "action": "generate_interlinks_optimization",
      "security": daim_nonce,
      "post_id": post_id
    };

    //send ajax request
    $.post(daim_ajax_url, data, function(html_content) {

      'use strict';

      //update the content of the meta-box
      $('#daim-meta-optimization td').empty().append(html_content);

    });

  }

});