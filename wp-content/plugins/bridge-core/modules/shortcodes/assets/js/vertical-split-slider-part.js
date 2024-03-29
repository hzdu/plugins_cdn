(function($) {
	'use strict';
	
	var verticalSplitSlider = {};
	qode.modules.verticalSplitSlider = verticalSplitSlider;
	
	verticalSplitSlider.initVerticalSplitSlider = initVerticalSplitSlider;
	verticalSplitSlider.qodeInitElementorVerticalSplitSlider = qodeInitElementorVerticalSplitSlider;
	
	verticalSplitSlider.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$( window ).on( 'load', qodeOnWindowLoad);
	
	function qodeOnWindowLoad() {
		initVerticalSplitSlider();
		qodeInitElementorVerticalSplitSlider();
	}
	
	function initVerticalSplitSlider(){
		"use strict";
		if($('html').hasClass('vertical_split_screen_initalized')){
			$('html').removeClass('vertical_split_screen_initalized');
			$.fn.multiscroll.destroy();
			//this has to be added due to elementor duplicating navigation
			$('#multiscroll-nav').remove();
		}
		if($('.vertical_split_slider').length) {
			
			var default_header_style = '';
			if ($('header.page_header').hasClass('light')) {
				default_header_style = 'light';
			} else if ($('header.page_header').hasClass('dark')) {
				default_header_style = 'dark';
			} else {
				default_header_style = header_style_admin;
			}
			
			var data_disable_header_skin_change = $('.vertical_split_slider').data('disable-header-skin-change');
			
			$('.vertical_split_slider').height($window_height).animate({opacity:1},300);
			$('.vertical_split_slider').multiscroll({
				scrollingSpeed: 500,
				navigation: true,
				afterRender: function(){
					checkVerticalSplitSectionsForHeaderStyle($('.ms-right .ms-section:last-child').data('header_style'), default_header_style, data_disable_header_skin_change);
					$('html').addClass('vertical_split_screen_initalized');
					initButtonHover(); // this function need to be initialized after initVerticalSplitSlider
					var contactForm7 = $('div.wpcf7 > form');
					if (contactForm7.length) {
						contactForm7.each(function(){
							var thisForm = $(this),
								thisFromDOMObject = $(this)[0];
							
							thisForm.find('.wpcf7-submit').off().on('click', function(e){
								e.preventDefault();
								wpcf7.submit(thisFromDOMObject);
							});
						});
					}
					
					if ($('body').hasClass('vss_responsive_adv')){
						//prepare html for smaller screens - start //
						var vertical_split_slider_responsive = $("<div class='vertical_split_slider_responsive' />");
						$(".vertical_split_slider").after(vertical_split_slider_responsive);
						var left_side = $('.vertical_split_slider .ms-left > div');
						
						var right_side = $('.vertical_split_slider .ms-right > div');
						for(var i = 0; i < left_side.length; i++){
							vertical_split_slider_responsive.append($(left_side[i]).clone(true));
							vertical_split_slider_responsive.append($(right_side[left_side.length-1-i]).clone(true));
						}
						
						if ($('.vertical_split_slider_responsive .qode_google_map').length) {
							$('.vertical_split_slider_responsive .qode_google_map').each(function () {
								var map = $(this);
								map.empty();
								var num = Math.floor((Math.random() * 100000) + 1);
								map.attr('id', 'map_canvas_' + num);
								map.data('unique-id', num);
							});
						}
						
						if($('.vertical_split_slider_responsive .counter.random').length){
							if( 'object' === typeof qode.modules.counter ) {
								qode.modules.counter.initCounter();
							}
						}
					}
					
					if( 'object' === typeof qode.modules.progressBar ) {
						qode.modules.progressBar.initProgressBars();
					}
					if( 'object' === typeof qode.modules.countdown ) {
						qode.modules.countdown.initCountdown();
					}
					if( 'object' === typeof qode.modules.googleMap ) {
						qode.modules.googleMap.showGoogleMap();
					}
					initAccordion();
					initAccordionContentLink();
					qodeInitAccordions();
				},
				onLeave: function(index, nextIndex, direction){
					checkVerticalSplitSectionsForHeaderStyle($($('.ms-right .ms-section')[$(".ms-right .ms-section").length-nextIndex]).data('header_style'), default_header_style, data_disable_header_skin_change);
				}
			});
			
			if ($('body').hasClass('vss_responsive_adv')){
				
				var windowSize = 768;
				
				if($('body').hasClass('vss_width_1000')) windowSize = 1000;
				if($('body').hasClass('vss_width_600')) windowSize = 600;
				
				if($window_width < windowSize){
					$.fn.multiscroll.destroy();
					$('html,body').css('height', 'auto').css('overflow', 'auto');
				}else{
					$.fn.multiscroll.build();
					$('html,body').css('height', '100%').css('overflow', 'hidden');
				}
				
				$(window).resize(function() {
					if($window_width < windowSize){
						$.fn.multiscroll.destroy();
						$('html,body').css('height', 'auto').css('overflow', 'auto');
					}else{
						$.fn.multiscroll.build();
						$('html,body').css('height', '100%').css('overflow', 'hidden');
					}
				});
			}
			
		}else{
			if(!$('.full_screen_holder').length) { //because this is not necessary on pages if there are full screen sections
				$('html,body').css('height', 'auto').css('overflow', 'auto');
			}
		}
	}
	
	function checkVerticalSplitSectionsForHeaderStyle(section_header_style, default_header_style, data_disable_header_skin_change){
		"use strict";
		
		if(section_header_style != ""){
			if(data_disable_header_skin_change == 'no'){$('header.page_header').removeClass('dark light').addClass(section_header_style)};
			$('#multiscroll-nav').removeClass('dark light').addClass(section_header_style);
		}else{
			if(data_disable_header_skin_change == 'no'){$('header.page_header').removeClass('dark light').addClass(default_header_style)};
			$('#multiscroll-nav').removeClass('dark light').addClass(default_header_style);
		}
	}
	
	function qodeInitElementorVerticalSplitSlider(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_vertical_split_slider.default', function() {
				initVerticalSplitSlider();
			} );
		});
	}
	
})(jQuery);