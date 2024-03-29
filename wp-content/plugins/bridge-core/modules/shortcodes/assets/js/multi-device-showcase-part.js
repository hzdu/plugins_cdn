(function ($) {
	'use strict';
	
	var multiDeviceShowcase = {};
	qode.modules.multiDeviceShowcase = multiDeviceShowcase;
	
	multiDeviceShowcase.qodeInitMultiDeviceShowcase = qodeInitMultiDeviceShowcase;
	multiDeviceShowcase.qodeInitElementorNumberedCarousel = qodeInitElementorMultiDeviceShowcase;
	
	multiDeviceShowcase.qodeOnDocumentReady = qodeOnDocumentReady;
	multiDeviceShowcase.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		qodeInitMultiDeviceShowcase();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorMultiDeviceShowcase();
	}
	
	function qodeInitMultiDeviceShowcase(){
		var mds = $('#qode-multi-device-showcase');
		
		if (mds.length) {
			var	shortcodeHeight = mds.height(),
				shortcodeOffset = mds.offset().top,
				shortcodeArea = shortcodeHeight - shortcodeOffset,
				laptopSlider = $('#qode-mds-laptop-slider'),
				laptopSlides = laptopSlider.find('.qode-mds-slide'),
				tabletSlider = $('#qode-mds-tablet-slider'),
				tabletSlides = tabletSlider.find('.qode-mds-slide'),
				phoneSlider = $('#qode-mds-phone-slider'),
				phoneSlides = phoneSlider.find('.qode-mds-slide'),
				spinner = $("#qode-mds-spinner"),
				prepped = false, //slides given active class
				initialized = false, //first scroll done
				readyToScroll = false; //flag for one scroll effect
			
			//fullscreen calcs
			var fullscreenCalcs = function() {
				var heightVal = $window_height - mds.offset().top;
				mds.css('height', heightVal);
			}
			
			//fix sizes to prevent flicker on slide animation
			var fixSizes = function(slider) {
				var slidesInnerHolders = slider.find('.qode-mds-slides-inner');
				
				slidesInnerHolders.each(function(){
					var slidesInnerHolder = $(this),
						heightVal = Math.round(slidesInnerHolder.parent().height() - 1),
						widthVal = Math.round(slidesInnerHolder.parent().width() - 1);
					
					slidesInnerHolder.css({
						'height': heightVal,
						'width': widthVal
					});
				});
			}
			
			//set active classes for first slides
			var prepSlides = function(slides, slider, numberOfSliders, sliderIndex) {
				slides.first().addClass('qode-active qode-mds-no-animation');
				
				if (!prepped && (sliderIndex == numberOfSliders)) {
					prepped = true;
					$(document).trigger('qodeMDSSlidePrepped');
				}
			}
			
			//slideshow loop
			var nextSlide = function(slides) {
				if (slides.filter('.qode-active').next().index() > 0) {
					slides.removeClass('qode-remove qode-mds-no-animation');
					slides.filter('.qode-active').removeClass('qode-active').addClass('qode-remove');
					slides.filter('.qode-remove').next().addClass('qode-active');
				} else {
					slides.removeClass('qode-active qode-remove qode-mds-no-animation');
					slides.last().addClass('qode-remove');
					slides.first().addClass('qode-active');
				}
			}
			
			var initDeviceSliders = function() {
				var sliders = laptopSlider.add(tabletSlider).add(phoneSlider),
					numberOfSliders = sliders.length,
					startDelay = mds.data('start-delay'), //slideshow start delay
					slideInterval = mds.data('slide-interval'); //slideshow repeat interval
				
				sliders.each(function(i){
					var slider = $(this),
						slides = slider.find('.qode-mds-slide'),
						numberOfSlides = slides.length;
					
					prepSlides(slides, slider, numberOfSliders, i+1);
				});
				
				qodeRequestAnimationFrame(); //init raf shim
				mds.addClass('qode-mds-animating'); //slideshow ready
				
				//to upgrade: not to require all sliders for slideshow
				//to upgrade: if one image set in slider, no slideshow
				var slideSequence = function() {
					//laptop, tablet, phone - all visible OR laptop visible only
					if (tabletSlider.is(':visible') && phoneSlider.is(':visible')) {
						//laptop slide
						nextSlide(laptopSlides);
						laptopSlider.one(qode.animationEnd, function(){
							//tablet slide
							nextSlide(tabletSlides);
							tabletSlider.one(qode.animationEnd, function(){
								//phone slide
								nextSlide(phoneSlides);
								phoneSlider.one(qode.animationEnd, function(){
									//repeat
									setTimeout(function(){
										requestAnimFrame(slideSequence);
									}, slideInterval);
								});
							});
						});
					} else {
						//laptop slide
						nextSlide(laptopSlides);
						laptopSlider.one(qode.animationEnd, function(){
							//repeat
							setTimeout(function(){
								requestAnimFrame(slideSequence);
							}, slideInterval);
						});
					}
				}
				
				//slideshow sequence start
				setTimeout(function(){
					slideSequence();
				}, startDelay);
			}
			
			//loading appear animation fx on non-touch devices
			var appearAnimation = function() {
				if (mds.hasClass('qode-mds-appear-effect') && (!$('html').hasClass('touch') || !$('html').hasClass('touchevents'))) {
					var deviceHolders = mds.find('.qode-mds-device-holder'),
						contentHolder = mds.find('.qode-mds-content-holder');
					
					mds.addClass('qode-mds-loading');
					
					spinner.fadeOut(300, function(){
						deviceHolders.addClass('qode-show-device');
						mds.one(qode.transitionEnd, function(){
							contentHolder.addClass('qode-show-item');
							contentHolder.last().one(qode.transitionEnd, function(){
								if (!readyToScroll) {
									readyToScroll = true;
									$(document).trigger('qodeMDSReadyToScroll');
								}
							});
						});
					});
				} else {
					spinner.fadeOut(300);
					if (!readyToScroll) {
						readyToScroll = true;
						$(document).trigger('qodeMDSReadyToScroll');
					}
				}
			}
			
			//mds scroll initialized
			var mdsScrollStart = function() {
				if (!initialized) {
					initialized = true;
					//if filter present blink fix if page scrolled initially
					if ($('.qode-demos-filter-holder').length) {
						$('.qode-demos-filter-holder').css('visibility','visible');
					}
				}
			}
			
			//perform one scroll effect
			var scrollWheelBehavior = function() {
				if (mds.hasClass('qode-mds-one-scroll-to-content') && (!$('html').hasClass('touch') || !$('html').hasClass('touchevents'))) {
					var shortcode = mds,
						scrollingForward = false,
						pageJump = false,
						reInitOneScroll = false,
						normalScroll = true,
						fixScroll = false;
					
					var scrollHandler = function() {
						if  ($(window).scrollTop() < shortcodeArea) {
							normalScroll = false;
						}
						
						var qScrollTo = function() {
							mdsScrollStart();
							pageJump = true;
							$('html, body').stop(true).animate({
								scrollTop: shortcodeArea
							}, 1000, 'easeInOutQuint', function() {
								fixScroll = true;
								if (fixScroll) {
									$(window).scrollTop(shortcodeArea);
								}
								$(window).scroll(function(){
									if (fixScroll) {
										$(window).scrollTop(shortcodeArea);
									}
								});
								normalScroll = true;
								reInitOneScroll = false;
								setTimeout(function(){
									pageJump = false;
									fixScroll = false;
									$(document).trigger('qodeMDSScrolled');
								}, 200);
							});
						}
						
						//update values
						$(window).scroll(function(){
							if ($scroll < shortcodeArea) {
								reInitOneScroll = true;
								
								if (scrollingForward) {
									normalScroll = false;
								}
							}
						});
						
						//wheel handle
						window.addEventListener('wheel', function(event) {
							if ($scroll < shortcodeArea) {
								var wheelScroll = event.deltaY;
								
								if (wheelScroll > 0) {
									scrollingForward = true;
								} else {
									scrollingForward = false;
								}
								
								if (!pageJump && !normalScroll) {
									if (scrollingForward) {
										event.preventDefault();
										qScrollTo();
									}
								} else {
									if (!normalScroll) {
										event.preventDefault();
									}
									if (normalScroll && !scrollingForward && reInitOneScroll) {
										pageJump = false;
										normalScroll = false;
										event.preventDefault();
									}
								}
							}
							
							if (pageJump) {
								event.preventDefault();
							}
						});
						
						//scrollbar click
						$(document).on('mousedown', function(event){
							if(($(window).outerWidth() <= event.pageX) && ($scroll <= shortcodeArea)) {
								event.preventDefault();
								qScrollTo();
							}
						});
					}
					
					//prevent mousewheel scroll
					window.addEventListener('wheel', function (event) {
						if (!readyToScroll || !initialized) {
							event.preventDefault();
						}
					});
					
					//prevent scrollbar scroll
					window.addEventListener('scroll', function () {
						if (!readyToScroll || !initialized) {
							$(window).scrollTop(shortcodeOffset);
						}
					})
					
					//init scroll handler
					$(document).on('qodeMDSReadyToScroll', function(){
						scrollHandler();
					});
				}
			}
			
			//btn click, works on touch as well
			var scrollBtnBehavior = function() {
				if (mds.hasClass('qode-mds-btn-scroll-below')) {
					var	shortcode = mds,
						btn = mds.find('.qode-mds-button-holder .qbutton');
					
					btn.on('click', function(event) {
						event.preventDefault();
						
						if (readyToScroll) {
							mdsScrollStart();
							
							$('html, body').stop().animate({
								scrollTop: shortcodeArea
							}, 1000, 'easeInOutQuint', function() {
								$(document).trigger('qodeMDSScrolled');
							});
						}
						
						return false;
					});
				}
			}
			
			//update shortcode height and offset
			var updateCoordinates = function() {
				shortcodeHeight = mds.height();
				shortcodeOffset = mds.offset().top;
				shortcodeArea = shortcodeHeight - shortcodeOffset;
			}
			
			//initialization
			scrollWheelBehavior();
			scrollBtnBehavior();
			
			mds.imagesLoaded({background: true}, function() {
				fullscreenCalcs();
				initDeviceSliders();
			});
			
			$(document).on('qodeMDSSlidePrepped', function(){
				appearAnimation();
			});
			
			$(window).on('load', function(){
				fixSizes(laptopSlider);
			});
			
			$(window).scroll(function(){
				updateCoordinates();
			});
			
			$(window).resize(function(){
				fullscreenCalcs();
				updateCoordinates();
				fixSizes(laptopSlider);
			});
		}
	}
	
	function qodeInitElementorMultiDeviceShowcase(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_multi_device_showcase.default', function() {
				qodeInitMultiDeviceShowcase();
			} );
		});
	}
})(jQuery);