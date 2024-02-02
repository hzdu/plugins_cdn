/**
 *
 * @author Webcraftic <wordpress.webraftic@gmail.com>
 * @copyright (c) 10.07.2020, Webcraftic
 * @version 1.0
 */

(function($) {
	'use strict';

	$(document).ready(function() {
		$('.wdanpro-checkbox').change(function() {
			let menuID = $(this).data('menu-id'),
				isChecked = $(this).find('.factory-result').is(":checked");

			if( !isChecked ) {
				$('#wp-admin-bar-' + menuID).hide();
			} else {
				$('#wp-admin-bar-' + menuID).show();
			}

			$.ajax(ajaxurl, {
				type: 'post',
				dataType: 'json',
				data: {
					action: 'wdanpro-disable-adminbar-menus',
					menu_id: menuID,
					enable_menu: isChecked,
					_wpnonce: $(this).data('nonce')
				},
				success: function(result, textStatus, jqXHR) {
					var noticeId, successNoticeID;

					if( !result || !result.success ) {
						console.log(result);

						if( result.data && result.data.error_message ) {
							noticeId = $.wbcr_factory_clearfy_000.app.showNotice(result.data.error_message, 'danger');
							setTimeout(function() {
								$.wbcr_factory_clearfy_000.app.hideNotice(noticeId);
							}, 5000);

						}

						return;
					}

					successNoticeID = $.wbcr_factory_clearfy_000.app.showNotice(result.data.success_message, 'success');
					setTimeout(function() {
						$.wbcr_factory_clearfy_000.app.hideNotice(successNoticeID);
					}, 2000);

				},
				error: function(xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(xhr.responseText);
					console.log(thrownError);

					var noticeId = $.wbcr_factory_clearfy_000.app.showNotice('Error: [' + thrownError + '] Status: [' + xhr.status + '] Error massage: [' + xhr.responseText + ']', 'danger');
				}
			});

		});
	});
})(jQuery);
