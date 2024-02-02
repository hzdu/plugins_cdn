jQuery(document).ready(function ($) {
	var msg_search_box_placeholder = wpfd_search_block.msg_search_box_placeholder;
	setInterval(function() {
	    if ( $('.wpfd-search-block').length ) {
	        if (jQuery('select[name="extension"]').length) {
	            jQuery('select[name="extension"]').chosen({width: '100%', search_contains: true});
	        } 
	        else {
	            setTimeout(function() {
	                if (jQuery('select[name="extension"]').length) {
	                    jQuery('select[name="extension"]').chosen({width: '100%', search_contains: true});
	                }
	            }, 1000)
	        }
            if ($(".wpfd-adminForm").length) {
                if ($(".input_tags").length) {
                    if ($(".tags-filtering .tagit-new input").length) {
                        $(".tags-filtering .tagit-new input").attr("placeholder", msg_search_box_placeholder);    
                    } else {
                        setTimeout(function() {
                            jQuery(".tagit.input_tags").tagit({allowSpaces: true});
                            if ($(".tags-filtering .tagit-new input").length) {
                                $(".tags-filtering .tagit-new input").attr("placeholder", msg_search_box_placeholder);
                            }
                        }, 1000);
                    }
                }
            }
    	}
    }, 1000);
});