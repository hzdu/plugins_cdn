(function($) {
	'use strict';
	
	var niceScroll = {};
	qode.modules.niceScroll = niceScroll;
	
	niceScroll.initNiceScroll = initNiceScroll;
	
	function initNiceScroll( $selector ){
		"use strict";
		
		if( $selector.length ) {
			$selector.niceScroll({
				scrollspeed: 60,
				mousescrollstep: 40,
				cursorwidth: 0,
				cursorborder: 0,
				cursorborderradius: 0,
				cursorcolor: "transparent",
				autohidemode: false,
				horizrailenabled: false
			});
		}
	}
	
})(jQuery);