(function($) { 
	"use strict";
	
	
	var icon = wp.element.RawHTML({
			children: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><polygon points="13.74 0 2.43 0 0 1.94 0.18 1.94 16 1.94 13.74 0"/><path d="M17.5,4.65H2V18H18V4.65ZM10,6.12A2.53,2.53,0,1,1,7.47,8.65,2.53,2.53,0,0,1,10,6.12Zm3.48,10.13h-7a1,1,0,0,1-1-1,4.58,4.58,0,0,1,2.66-3.7,1.95,1.95,0,0,0,3.56,0,4.58,4.58,0,0,1,2.66,3.7A1,1,0,0,1,13.48,16.25Z" transform="translate(-2 -2)"/></svg>'
	});
	
	
		
	// recreate attributes from PHP array
	var atts = {};
	$.each(pc_user_del_defaults, function(i, v) {
		atts[i] = {default : v.default};
	});
	
	
	
	
	// trick executing javascript on server rendered element
	window.pc_user_del_guten_on_display = function(blockId) {
		setTimeout(function() { // wait a bit for possible guten mess
			
			if(!$('#block-'+ blockId +' .pc_del_user_wrap').length || $('#block-'+ blockId +' .components-placeholder').length) {
				setTimeout(function() {
					pc_user_del_guten_on_display(blockId);
				}, 350);
				return false;
			}
		}, 400);
	};
	
		
	
	// register block
	var args = {
		block_id			: 'lcweb/pc-user-del-box',
		category			: 'lc-pvtcontent',
		title				: wp.i18n.__('User Deletion Box', 'pc_ml'),
		icon				: icon,
		panels				: pc_panels,
		structure			: pc_user_del_defaults,
		attributes			: atts,
		on_display_callback : 'pc_user_del_guten_on_display',
	};
	lc_register_block(args); 


})(jQuery); 