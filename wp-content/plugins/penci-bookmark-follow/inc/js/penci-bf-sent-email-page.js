"use strict";

//<![CDATA[
jQuery(document).ready( function($) {
	$('.if-js-closed').removeClass('if-js-closed').addClass('closed');
	postboxes.add_postbox_toggles( Penci_Bf_Email_Settings.main_page_slug + '_page_penci-bf-send-email' );
});
//]]>