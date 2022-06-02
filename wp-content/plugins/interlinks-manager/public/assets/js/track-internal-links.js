jQuery(document).ready(function($) {

    'use strict';

    $(document.body).on('mousedown', 'a[data-ail]' , function(){

        'use strict';

        const link_type = 'ail';
        
        //save the click with an ajax request
        track_link(link_type, $(this));
        
    });

    $(document.body).on('mousedown', 'a[data-mil]' , function(){

        'use strict';

        const link_type = 'mil';
        
        //save the click with an ajax request
        track_link(link_type, $(this));
        
    });
    
    //track the link with an ajax request
    function track_link(link_type, caller_element){

        'use strict';

        //set source
        const source_post_id = caller_element.attr('data-' + link_type);

        //set target
        const target_url = caller_element.attr('href');
        
        //prepare ajax request
        const data = {
            "action": "track_internal_link",
            "security": window.DAIM_PARAMETERS.nonce,
            "link_type": link_type,
            "source_post_id": source_post_id,
            "target_url": target_url
        };

        //send the ajax request
        $.post(window.DAIM_PARAMETERS.ajax_url, data, function(data) {});
        
    }

});