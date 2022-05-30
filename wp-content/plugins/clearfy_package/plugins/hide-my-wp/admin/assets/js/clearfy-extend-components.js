/**
 * Clearfy quick configuration
 *
 * @author Webcraftic <wordpress.webraftic@gmail.com>
 * @copyright (c) 01.09.2018, Webcraftic
 * @version 1.0
 */


(function($) {
	'use strict';

	if( $.wbcr_factory_clearfy_000 ) {
		$.wbcr_factory_clearfy_000.hooks.add('clearfy/components/updated', function(data, response) {
			//console.log(data);
			//console.log(response);
		});
	}

})(jQuery);
