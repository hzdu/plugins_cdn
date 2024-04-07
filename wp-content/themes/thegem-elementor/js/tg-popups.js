(function ($) {
	const CookieService = {

		setCookie(name, value, days) {
			let expires = '';

			if (days) {
				const date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = '; expires=' + date.toUTCString();
			}

			document.cookie = name + '=' + (value || '') + '; path=/' + expires + ';';
		},

		getCookie(name) {
			const cookies = document.cookie.split(';');

			for (const cookie of cookies) {
				if (cookie.indexOf(name + '=') > -1) {
					return cookie.split('=')[1];
				}
			}

			return null;
		}
	}

	const runPopupScript = (settings) => {
		if ((!settings['show_on_mobile'] && $(window).width() < 768) ||
			(!settings['show_on_tablet'] && $(window).width() > 767 && $(window).width() < 992)) {
			return;
		}

		if (settings['show_after_x_page_views'] && settings['show_page_views'] > 0) {
			let cookieName = 'pageViews' + settings['id'],
				pageViews = 1;
			if (CookieService.getCookie(cookieName)) {
				pageViews += parseInt(CookieService.getCookie(cookieName));
			}
			if (pageViews < settings['show_page_views']) {
				CookieService.setCookie(cookieName, pageViews, settings['cookie_time']);
				return;
			}
		}

		if (settings['show_up_to_x_times']) {
			let cookieName = 'popupShown' + settings['id'];
			if (CookieService.getCookie(cookieName) && parseInt(CookieService.getCookie(cookieName)) >= settings['show_popup_count']) {
				return;
			}
		}

		if (settings['images_preloading']) {
			$('#' + settings['id']).show().hide();
		}

		function showPopup() {
			$.fancybox.open({
				src: '#' + settings['id'],
				type: 'inline',
				opts: {
					animationEffect: settings['animation_exit'] == '' ? 'fade' : 'popup',
					animationDuration: settings['animation_exit'] == '' ? 366 : 500,
					slideClass: "fancybox-popup-wrapper",
					baseClass: "popup-overlay overlay-" + settings['id'],
					afterLoad:function(instance, current) {
						if(window.tgpLazyItems !== undefined) {
							window.tgpLazyItems.scrollHandle()
						}
					},
					beforeShow: function (instance, current) {
						$(current.src).addClass('animate__popup_animated').removeClass('animate__popup_' + settings['animation_exit']).addClass('animate__popup_' + settings['animation_entrance']);
					},
					afterShow: function (instance, current) {
						if (settings['show_up_to_x_times']) {
							let cookieName = 'popupShown' + settings['id'],
								popupShown = 1;
							if (CookieService.getCookie(cookieName)) {
								popupShown += parseInt(CookieService.getCookie(cookieName));
							}
							CookieService.setCookie(cookieName, popupShown, settings['cookie_time']);
						}
					},
					beforeClose: function (instance, current) {
						$(current.src).removeClass('animate__popup_' + settings['animation_entrance']).addClass('animate__popup_' + settings['animation_exit']);
					},
				}
			});
		}

		settings['triggers'].forEach(function (trigger) {
			if (trigger['trigger_type'] == 'on_page_load') {
				$(function () {
					setTimeout(showPopup, trigger['popup_delay'] * 1000);
				});

			} else if (trigger['trigger_type'] == 'on_scroll') {

				let position = $(window).scrollTop();

				const scrollHandler = () => {
					let scroll = $(window).scrollTop();
					if (trigger['scroll_direction'] == 'down'
						&& scroll > position
						&& scroll * 100 / $(document).height() > parseInt(trigger['within'])) {
						showPopup();
						$(window).off("scroll", scrollHandler);
					}
					if (trigger['scroll_direction'] == 'up'
						&& scroll < position
						&& ($(document).height() - scroll - $(window).height()) * 100 / $(document).height() > parseInt(trigger['within'])) {
						showPopup();
						$(window).off("scroll", scrollHandler);
					}
					position = scroll;
				}

				$(window).scroll(scrollHandler);

			} else if (trigger['trigger_type'] == 'on_click') {

				$('#' + trigger['unique_id'] + ', .' + trigger['unique_id']).on('click', function(e){
					e.preventDefault();
					showPopup();
				});

			} else if (trigger['trigger_type'] == 'on_exit') {

				const mouseHandler = e => {
					const shouldShowExitIntent =
						!e.toElement &&
						!e.relatedTarget &&
						e.clientY < 10;

					if (shouldShowExitIntent) {
						showPopup();
						$(document).off('mouseout', mouseHandler);
					}
				};

				$(document).on('mouseout', mouseHandler);

			} else if (trigger['trigger_type'] == 'after_activity') {

				const inactivityTime = () => {
					let time;
					$(window).on('load', resetTimer);
					$(document).on('mousemove', resetTimer);
					$(document).on('keypress', resetTimer);

					function runPopup() {
						showPopup();
						$(document).off('mousemove', resetTimer);
						$(document).off('keypress', resetTimer);
					}

					function resetTimer() {
						clearTimeout(time);
						time = setTimeout(runPopup, 1000 * parseInt(trigger['inactivity']))
					}
				};

				$(function () {
					inactivityTime();
				});
			}
		});
	}

	$(function () {
		$('.gem-popup').each(function () {
			let settings = $(this).data('popup-settings');
			runPopupScript(settings);
		});
	});

})(jQuery);