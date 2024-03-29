(function($) {
	'use strict';
	
	var textMarquee = {};
	qode.modules.textMarquee = textMarquee;
	
	textMarquee.initTextMarquee = initTextMarquee;
	textMarquee.qodeElementorInitTextMarque = qodeElementorInitTextMarque;
	
	textMarquee.qodeOnDocumentReady = qodeOnDocumentReady;
	textMarquee.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		initTextMarquee();
	}
	
	function qodeOnWindowLoad() {
		qodeElementorInitTextMarque();
	}
	
	function initTextMarquee() {
		"use strict";
		var textMarquees = $('.qode-text-marquee');
		
		if (textMarquees.length) {
			textMarquees.each(function() {
				var textMarquee = $(this);
				
				if ( !textMarquee.hasClass('qode-text-marquee-initialized')){
					
					//two titles for marquee scroll effect
					if (!$('html').hasClass('touch') || !$('html').hasClass('touchevents')) {
						textMarquee.find('.qode-text-marquee-wrapper').clone().appendTo(textMarquee);
					}
					
					var titleWrapper = textMarquee.find('.qode-text-marquee-wrapper'),
						marqueeTitle = textMarquee.find('.qode-text-marquee-title');
					
					//symmetrical spacings for marquee scroll effect
					if (!$('html').hasClass('touch') || !$('html').hasClass('touchevents')) {
						titleWrapper.each(function () {
							var currentTitleWrapper = $(this),
								title = currentTitleWrapper.find('.qode-text-marquee-title'),
								text = title.html().split(' '),
								len = text.length,
								result = [];
							
							for (var i = 0; i < len; i++) {
								result[i] = '<span class="qode-inner-text">' + text[i] + '</span>';
							}
							
							title.html(result.join(''));
							
							title.find('.qode-inner-text').css({
								"display": "inline-block",
								"margin-right": "40px"
							});
						});
					}
					
					//stretch calcs
					marqueeTitle.stretch();
					titleWrapper.eq(1).addClass('qode-marquee-additional-title');
					marqueeTitle.css('visibility', 'visible');
					
					//stretch recalcs
					var stretchRecalcs = function () {
						marqueeTitle.unwrap('.stretch--resizer');
						marqueeTitle.unwrap('.stretch--handle');
						marqueeTitle.stretch();
					}
					
					//marquee scroll effect on non touch devices
					if (!$('html').hasClass('touch') || !$('html').hasClass('touchevents')) {
						qodeRequestAnimationFrame();
						
						var firstTitleWrapper = titleWrapper.first(),
							firstTitleWrapperOffset = firstTitleWrapper.offset().left,
							lastTitleWrapper = titleWrapper.last(),
							reset = false;
						
						lastTitleWrapper.offset({left: firstTitleWrapperOffset - $(window).width()});
						
						titleWrapper.each(function () {
							var title = $(this),
								offset = title.offset().left,
								currentPos = 0,
								delta = 2;
							
							var qodeMarqueeText = function () {
								reset = false;
								currentPos += delta;
								
								if (title.offset().left > $(window).width()) {
									currentPos = -($(window).width() + offset); //reset
								}
								
								title.css('transform', 'translate3d(' + currentPos + 'px,0,0)');
								requestAnimFrame(qodeMarqueeText);
								
								//reset
								$(window).resize(function () {
									if (!reset) {
										stretchRecalcs();
										currentPos = 0;
										lastTitleWrapper.offset({left: -marqueeTitle.first().width()});
										reset = true;
									}
								});
							}
							
							qodeMarqueeText();
						});
					} else {
						//touch recalcs if device orientation changes
						$(window).resize(function () {
							stretchRecalcs();
						});
					}
					
					textMarquee.addClass('qode-text-marquee-initialized');
					
				}
			});
		}
	}
	
	function qodeElementorInitTextMarque(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_text_marquee.default', function() {
				initTextMarquee();
			} );
		});
	}
	
})(jQuery);