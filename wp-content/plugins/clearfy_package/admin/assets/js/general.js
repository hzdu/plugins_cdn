/**
 * General
 * @author Webcraftic <wordpress.webraftic@gmail.com>
 * @copyright (c) 10.09.2017, Webcraftic
 * @version 1.0
 */

(function($) {
	'use strict';

	$(document).ready(function() {
		$('#wclearfy-advanced-bunny-cdn-settings').hide();
		$('#wclearfy-advanced-cdn77-settings').hide();

		$('#wbcr_clearfy_cdn_cname').keyup(function() {
			var cname = $(this).val();

			console.log(cname);

			if( cname && cname.indexOf('b-cdn.net') > 0 ) {
				$('#wclearfy-advanced-bunny-cdn-settings').show();
			}

			if( cname && cname.indexOf('cdn77.org') > 0 ) {
				$('#wclearfy-advanced-cdn77-settings').show();
			}

		});

	});

})(jQuery);