"use strict"; 
jQuery(document).ready(function()
{
	jQuery(document).on('wc_fragments_refreshed', wcqt_refreshed_fragments);
	wcqt_refresh_fragments();
	
});
function wcqt_refreshed_fragments()
{
	//wcqt_menu.quote_page_url
	
}

function wcqt_refresh_fragments() 
{
   jQuery( document.body ).trigger( 'wc_fragment_refresh' );
}


setTimeout(wcqt_refresh_fragments, 500);
