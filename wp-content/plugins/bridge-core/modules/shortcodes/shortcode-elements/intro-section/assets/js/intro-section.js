(function($) {
	'use strict';

	var introSection = {};
	qode.modules.introSection = introSection;
	introSection.qodeIntroSection = qodeIntroSection;

	introSection.qodeOnDocumentReady = qodeOnDocumentReady;

	$(document).ready(qodeOnDocumentReady);

	/*
	 ** All functions to be called on $(window).load() should be in this function
	 */
	function qodeOnDocumentReady() {
		qodeIntroSection();
	}

	/**
	 * Intro Section object that initializes intro section animations
	 * @type {Function}
	 */
	function qodeIntroSection() {
		var $introSection = $('.qode-intro-section'),
			$params = {
				start: 1.3,
				end: 1.5
			};

		var updateParams = function () {
			$params.y = $introSection.offset().top;
			$params.h = $introSection.outerHeight();
		};

		var setSizes = function () {
			var $bgHolder = $('.qode-is-bg-wrapper');

			$bgHolder.css({
				/*'top': $params.y + 'px',*/
				'height': $params.h + 'px'
			});
		};

		if ($introSection.length) {
			zIndexes($introSection);
			scrollAnimation($introSection,$params);
			appearAnimation($introSection);
			$introSection.waitForImages(function () {
				updateParams();
				setSizes();
			});
			$(window).on('resize', function () {
				updateParams();
				setSizes();
			});
		}
	}

	function zIndexes($introSection) {
		$introSection
		.closest('.elementor-section')
		.siblings().length
		&&
		$introSection
		.closest('.elementor-section')
		.siblings()
		.css({
			'position': 'relative',
			'z-index': 10
		});
	}

	function appearAnimation($introSection) {
		var $introTitle = $introSection.find('.qode-is-content');

		if ($introTitle.length) {
			$introTitle.addClass('qode--appear');
		}
	}

	function scrollAnimation($introSection, $params) {
		var buffer = 0,
			$contentW = $('.qode-is-content-wrapper'),
			$content = $('.qode-is-content'),
			$subtitle = $('.qode-is-subtitle'),
			$title = $('.qode-is-title');


		var scrollDirection = function () {
			$params.downwards = $scroll >= buffer ? true : false;
			buffer = $scroll;

			/*console.log($params.downwards);*/
			return $params.downwards;
		}

		var fadeBg = function () {
			var scrollSectionHeight = $introSection.outerHeight() / 2.5,
				fadeBgOpacity = 1 - ($scroll / scrollSectionHeight) + 1.7,
				title = $introSection.find('.qode-is-title'),
				titleInitColor = title.attr( 'data-color' ),
				titleColorAfterScroll = title.attr( 'data-color-after-scroll' ),
				titleColor = '',
				tagline = $introSection.find('.qode-is-subtitle'),
				taglineInitColor = title.attr( 'data-color' ),
				taglineColorAfterScroll = title.attr( 'data-color-after-scroll' ),
				taglineColor = '',
				introText = $introSection.find('.qode-is-content-btm'),
				textInitColor = title.attr( 'data-color' ),
				textColorAfterScroll = title.attr( 'data-color-after-scroll' ),
				textColor = '';

			fadeBgOpacity > 1 ? fadeBgOpacity = 1 : null;
			fadeBgOpacity < 0 ? fadeBgOpacity = 0 : null;

			if (fadeBgOpacity >= 1 ){
				titleColor = titleInitColor;
				taglineColor = taglineInitColor;
				textColor = textInitColor;
			} else {
				titleColor = titleColorAfterScroll;
				taglineColor = taglineColorAfterScroll;
				textColor = textColorAfterScroll;
			}

			fadeBgOpacity >= 1 ? titleColor = titleInitColor : null;
			fadeBgOpacity < 1 ? titleColor = titleColorAfterScroll : null;

			$introSection.find('.qode-is-bg-wrapper').css('opacity', fadeBgOpacity);
			/* title.css({
			 'color': titleColor,
			 'transition': '.5s ease',
			 });
			 tagline.css({
			 'color': taglineColor,
			 'transition': '.5s ease',
			 });
			 introText.css({
			 'color': textColor,
			 'transition': '.5s ease',
			 });*/

			/*$introSection.find('.qode-is-title').css('background-position', textGradientValue + '% 50%')*/

		}

		var changeContentColor = function () {
			var cW = {
				y: $contentW.offset().top,
				h: $contentW.height()
			}

			var c = cW.y <= $params.y + $params.h / 2 ? (cW.y - $params.y) / 2 : $params.y + $params.h / 2;

			if ($scroll >= c &&
				$scroll < cW.y + cW.h) {
				var coeff = ($scroll - c) / (cW.y + cW.h - c);

				coeff = Math.min(coeff, 1);
				coeff = Math.max(coeff, 0);

				var opacityVal = 1 - coeff.toFixed(2),
					yVal = !Modernizr.touch ? coeff * 50 : 0;

				$content.css({
					'opacity': opacityVal,
					'transform': 'translate3d(0px, ' + yVal + '%, 0px)',
				});
			}

			$scroll === 0 && $content.css({'opacity': 1, 'transform': 'translate3d(0px, 0%, 0px)'});
		}

		$(window).on('scroll', function () {
			scrollDirection();
			fadeBg();
			/*changeContentColor();*/
		});
	}

})(jQuery);
