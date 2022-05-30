/**
 * Assets manager scripts
 * @author Webcraftic <wordpress.webraftic@gmail.com>
 * @copyright (c) 13.11.2017, Webcraftic
 * @version 1.0
 */

(function($) {
	'use strict';

	class AssetsManagerPro {
		constructor() {
			if( undefined === typeof window.wam_localize_data || !wam_localize_data.ajaxurl ) {
				throw new Error("Undefined wam_localize_data, please check the var in source!");
			}

			this.pluginVars = window.wam_localize_data;
			this.initEvents();
		}

		initEvents() {
			let self = this;

			$('.js-wam-add-dns-prefetch').click(function() {
				let $this = $(this);

				let stackBottomRight = {
					'dir1': 'up',
					'dir2': 'left',
					'firstpos1': 25,
					'firstpos2': 25
				};

				WamPnotify.closeAll();
				WamPnotify.alert({
					title: 'Adding domain!',
					text: 'Please wait, adding domain to dns prefetch list ...',
					stack: stackBottomRight,
					hide: false
				});

				$.ajax(self.pluginVars.ajaxurl, {
					type: 'post',
					dataType: 'json',
					data: {
						action: 'wam-add-to-dns-prefetch',
						domain: $(this).data('domain'),
						_wpnonce: $(this).data('nonce')
					},
					success: function(response) {
						WamPnotify.closeAll();

						if( !response || !response.success ) {
							if( response.data ) {
								console.log(response.data.error_message_content);
								WamPnotify.alert({
									title: response.data.error_message_title,
									text: response.data.error_message_content,
									stack: stackBottomRight,
									type: 'error',
									delay: 15000,
									hide: true
								});
							} else {
								console.log(response);
							}
							return;
						}
						if( response.data ) {
							WamPnotify.alert({
								title: response.data.save_massage_title,
								text: response.data.save_message_content,
								stack: stackBottomRight,
								type: 'success',
								delay: 3000,
								hide: true
							});
							$this.hide();
						}
					},
					error: function(xhr, ajaxOptions, thrownError) {
						WamPnotify.alert({
							title: 'Unknown error',
							text: thrownError,
							stack: {
								'dir1': 'up',
								'dir2': 'left',
								'firstpos1': 25,
								'firstpos2': 25
							},
							type: 'error',
							delay: 15000,
							hide: true
						});
					}
				});
				return false;
			});

		}
	}

	$(function() {
		new AssetsManagerPro();
	});

})(jQuery);
