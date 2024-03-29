(function($) {
	'use strict';
	
	var qodeSlider = {};
	qode.modules.qodeSlider = qodeSlider;
	
	qodeSlider.initQodeSlider = initQodeSlider;
	qodeSlider.checkSliderForHeaderStyle = checkSliderForHeaderStyle;
	
	qodeSlider.qodeOnDocumentReady = qodeOnDocumentReady;
	qodeSlider.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	var default_header_style;
	var skrollr_slider;
	
	function qodeOnDocumentReady() {
		initQodeSlider();
	}
	
	function qodeOnWindowLoad() {
		setTimeout(function(){
			if( $( '.no-touchevents .carousel' ).length ){
				skrollr_slider.refresh();
			} //in order to reload rest of scroll animation on same page after page loads
		},700); //timeout is set because of some function that interferes with calculating
	}
	
	function initQodeSlider(){
		"use strict";
		
		var image_regex = /url\(["']?([^'")]+)['"]?\)/;
		default_header_style = "";
		if($('header.page_header').hasClass('light')){ default_header_style = 'light';}
		if($('header.page_header').hasClass('dark')){ default_header_style = 'dark';}
		
		if($('.carousel').length){
			
			var matrixArray = { zoom_center : '1.2, 0, 0, 1.2, 0, 0', zoom_top_left: '1.2, 0, 0, 1.2, -150, -150', zoom_top_right : '1.2, 0, 0, 1.2, 150, -150', zoom_bottom_left: '1.2, 0, 0, 1.2, -150, 150', zoom_bottom_right: '1.2, 0, 0, 1.2, 150, 150'};
			
			// Function for translating image in slide - START //
			(function ($) {
				//
				// regular expression for parsing out the matrix
				// components from the matrix string
				//
				var matrixRE = /\([0-9epx\.\, \t\-]+/gi;
				
				//
				// parses a matrix string of the form
				// "matrix(n1,n2,n3,n4,n5,n6)" and
				// returns an array with the matrix
				// components
				//
				var parseMatrix = function (val) {
					return val.match(matrixRE)[0].substr(1).
					split(",").map(function (s) {
						return parseFloat(s);
					});
				};
				
				//
				// transform css property names with vendor prefixes;
				// the plugin will check for values in the order the
				// names are listed here and return as soon as there
				// is a value; so listing the W3 std name for the
				// transform results in that being used if its available
				//
				var transformPropNames = [
					"transform",
					"-webkit-transform"
				];
				
				var getTransformMatrix = function (el) {
					//
					// iterate through the css3 identifiers till we
					// hit one that yields a value
					//
					var matrix = null;
					transformPropNames.some(function (prop) {
						matrix = el.css(prop);
						return (matrix !== null && matrix !== "");
					});
					
					//
					// if "none" then we supplant it with an identity matrix so
					// that our parsing code below doesn't break
					//
					matrix = (!matrix || matrix === "none") ?
						"matrix(1,0,0,1,0,0)" : matrix;
					return parseMatrix(matrix);
				};
				
				//
				// set the given matrix transform on the element; note that we
				// apply the css transforms in reverse order of how its given
				// in "transformPropName" to ensure that the std compliant prop
				// name shows up last
				//
				var setTransformMatrix = function (el, matrix) {
					var m = "matrix(" + matrix.join(",") + ")";
					for (var i = transformPropNames.length - 1; i >= 0; --i) {
						el.css(transformPropNames[i], m + ' rotate(0.01deg)');
					}
				};
				
				//
				// interpolates a value between a range given a percent
				//
				var interpolate = function (from, to, percent) {
					return from + ((to - from) * (percent / 100));
				};
				
				$.fn.transformAnimate = function (opt) {
					//
					// extend the options passed in by caller
					//
					var options = {
						transform: "matrix(1,0,0,1,0,0)"
					};
					$.extend(options, opt);
					
					//
					// initialize our custom property on the element
					// to track animation progress
					//
					this.css("percentAnim", 0);
					
					//
					// supplant "options.step" if it exists with our own
					// routine
					//
					var sourceTransform = getTransformMatrix(this);
					var targetTransform = parseMatrix(options.transform);
					options.step = function (percentAnim, fx) {
						//
						// compute the interpolated transform matrix for
						// the current animation progress
						//
						var $this = $(this);
						var matrix = sourceTransform.map(function (c, i) {
							return interpolate(c, targetTransform[i],
								percentAnim);
						});
						
						//
						// apply the new matrix
						//
						setTransformMatrix($this, matrix);
						
						//
						// invoke caller's version of "step" if one
						// was supplied;
						//
						if (opt.step) {
							opt.step.apply(this, [matrix, fx]);
						}
					};
					
					//
					// animate!
					//
					return this.stop().animate({ percentAnim: 100 }, options);
				};
			})(jQuery);
			// Function for translating image in slide - END //
			
			$('.carousel').each(function(){
				var $this = $(this);
				var mobile_header;
				
				var mobile_header = $(window).width() < 1000 ? $('header.page_header').height() : 0;
				var header_height_add_for_paspartu = $window_width > 1000 && !$('header.page_header').hasClass('transparent') && $('body.paspartu_on_top_fixed').length == 0 ? $('header.page_header').height() : 0;
				var paspartu_amount_with_top = $('.paspartu_outer:not(.disable_top_paspartu)').length > 0 ? Math.round($window_width*paspartu_width + header_height_add_for_paspartu) : 0;
				var paspartu_amount_with_bottom = $('.paspartu_outer.paspartu_on_bottom_slider').length > 0 ? Math.round($window_width*paspartu_width) : 0;
				var slider_graphic_coefficient;
				var slider_title_coefficient;
				var slider_subtitle_coefficient;
				var slider_text_coefficient;
				var slider_button_coefficient;
				
				var responsive_breakpoint_set = [1300,1000,768];
				if($this.hasClass('advanced_responsiveness')){
					responsive_breakpoint_set = [1600,1200,900,650,500,320];
					if($this.data('q_responsive_breakpoints')){
						if($this.data('q_responsive_breakpoints') == 'set2'){
							responsive_breakpoint_set = [1600,1300,1000,768,567,320];
						}
					}
					
					var coefficients_graphic_array = $this.data('q_responsive_graphic_coefficients').split(',');
					var coefficients_title_array = $this.data('q_responsive_title_coefficients').split(',');
					var coefficients_subtitle_array = $this.data('q_responsive_subtitle_coefficients').split(',');
					var coefficients_text_array = $this.data('q_responsive_text_coefficients').split(',');
					var coefficients_button_array = $this.data('q_responsive_button_coefficients').split(',');
				}
				
				//calculate heights for slider holder and slide item, depending on size, but only if slider is set to be responsive and not full screen
				function setSliderHeight($this, $def_height){
					var slider_height = $def_height;
					
					if($this.hasClass('advanced_responsiveness')){
						//advanced responsiveness
						if($window_width > responsive_breakpoint_set[0]){
							slider_height = $def_height;
						}else if($window_width > responsive_breakpoint_set[1]){
							slider_height = $def_height * 0.75;
						}else if($window_width > responsive_breakpoint_set[2]){
							slider_height = $def_height * 0.6;
						}else if($window_width > responsive_breakpoint_set[3]){
							slider_height = $def_height * 0.55;
						}else if($window_width <= responsive_breakpoint_set[3]){
							slider_height = $def_height * 0.45;
						}
					}else{
						//old way responsiveness
						if($window_width > responsive_breakpoint_set[0]){
							slider_height = $def_height;
						}else if($window_width > responsive_breakpoint_set[1]){
							slider_height = $def_height * 0.8;
						}else if($window_width > responsive_breakpoint_set[2]){
							slider_height = $def_height * 0.7;
						}else if($window_width <= responsive_breakpoint_set[2]){
							slider_height = $def_height * 1;
						}
					}
					
					$this.css({'height': (slider_height) + 'px'});
					$this.find('.qode_slider_preloader').css({'height': (slider_height) + 'px'});
					$this.find('.qode_slider_preloader .ajax_loader').css({'display': 'block'});
					$this.find('.item').css({'height': (slider_height) + 'px'});
				}
				
				function resetSliderHeight($def_height){
					$this.css({'height': ($def_height) + 'px'});
					$this.find('.qode_slider_preloader').css({'height': ($def_height) + 'px'});
					$this.find('.qode_slider_preloader .ajax_loader').css({'display': 'block'});
					$this.find('.item').css({'height': ($def_height) + 'px'});
				}
				
				function setSliderInitialElementsSize($item,i){
					
					window["slider_graphic_width_" + i] = [];
					window["slider_graphic_height_" + i] = [];
					window["slider_svg_width_" + i] = [];
					window["slider_svg_height_" + i] = [];
					window["slider_title_" + i] = [];
					window["slider_subtitle_" + i] = [];
					window["slider_text_" + i] = [];
					window["slider_button1_" + i] = [];
					window["slider_button2_" + i] = [];
					window["slider_separator_" + i] = [];
					
					//graphic size
					window["slider_graphic_width_" + i].push(parseFloat($item.find('.thumb img').data("width")));
					window["slider_graphic_height_" + i].push(parseFloat($item.find('.thumb img').data("height")));
					window["slider_svg_width_" + i].push(parseFloat($item.find('.qode_slide-svg-holder svg').attr("width")));
					window["slider_svg_height_" + i].push(parseFloat($item.find('.qode_slide-svg-holder svg').attr("height")));
					
					// font-size (0)
					window["slider_title_" + i].push(parseFloat($item.find('.q_slide_title').css("font-size")));
					window["slider_subtitle_" + i].push(parseFloat($item.find('.q_slide_subtitle').css("font-size")));
					window["slider_text_" + i].push(parseFloat($item.find('.q_slide_text').css("font-size")));
					window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("font-size")));
					window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("font-size")));
					
					// line-height (1)
					window["slider_title_" + i].push(parseFloat($item.find('.q_slide_title').css("line-height")));
					window["slider_subtitle_" + i].push(parseFloat($item.find('.q_slide_subtitle').css("line-height")));
					window["slider_text_" + i].push(parseFloat($item.find('.q_slide_text').css("line-height")));
					window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("line-height")));
					window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("line-height")));
					
					// letter-spacing (2)
					window["slider_title_" + i].push(parseFloat($item.find('.q_slide_title').css("letter-spacing")));
					window["slider_subtitle_" + i].push(parseFloat($item.find('.q_slide_subtitle').css("letter-spacing")));
					window["slider_text_" + i].push(parseFloat($item.find('.q_slide_text').css("letter-spacing")));
					window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("letter-spacing")));
					window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("letter-spacing")));
					
					// margin-bottom (3)
					window["slider_title_" + i].push(parseFloat($item.find('.q_slide_title').css("margin-bottom")));
					window["slider_subtitle_" + i].push(parseFloat($item.find('.q_slide_subtitle').css("margin-bottom")));
					
					// slider_button height(3), width(4), padding(5)
					window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("height")));
					window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("height")));
					if(parseFloat($item.find('.qbutton:eq(0)').css("width")) != 0){
						window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("width")));
					}else{
						window["slider_button1_" + i].push(0);
					}
					if(parseFloat($item.find('.qbutton:eq(1)').css("width")) != 0){
						window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("width")));
					}else{
						window["slider_button2_" + i].push(0);
					}
					window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("padding-left")));
					window["slider_button1_" + i].push(parseFloat($item.find('.qbutton:eq(0)').css("padding-right")));
					window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("padding-left")));
					window["slider_button2_" + i].push(parseFloat($item.find('.qbutton:eq(1)').css("padding-right")));
					
					// margin separator, margin top(0), margin bottom(1)
					window["slider_separator_" + i].push(parseFloat($item.find('.separator').css("margin-top")));
					window["slider_separator_" + i].push(parseFloat($item.find('.separator').css("margin-bottom")));
					
				}
				
				//calculate size for slider title, subtitle and text, depending on window size
				function setSliderElementsSize($item,i){
					if($window_width > responsive_breakpoint_set[0]) {
						slider_graphic_coefficient = coefficients_graphic_array[0];
						slider_title_coefficient = coefficients_title_array[0];
						slider_subtitle_coefficient = coefficients_subtitle_array[0];
						slider_text_coefficient = coefficients_text_array[0];
						slider_button_coefficient = coefficients_button_array[0];
					}else if($window_width > responsive_breakpoint_set[1]){
						slider_graphic_coefficient = coefficients_graphic_array[1];
						slider_title_coefficient = coefficients_title_array[1];
						slider_subtitle_coefficient = coefficients_subtitle_array[1];
						slider_text_coefficient = coefficients_text_array[1];
						slider_button_coefficient = coefficients_button_array[1];
					}else if($window_width > responsive_breakpoint_set[2]){
						slider_graphic_coefficient = coefficients_graphic_array[2];
						slider_title_coefficient = coefficients_title_array[2];
						slider_subtitle_coefficient = coefficients_subtitle_array[2];
						slider_text_coefficient = coefficients_text_array[2];
						slider_button_coefficient = coefficients_button_array[2];
					}else if($window_width > responsive_breakpoint_set[3]){
						slider_graphic_coefficient = coefficients_graphic_array[3];
						slider_title_coefficient = coefficients_title_array[3];
						slider_subtitle_coefficient = coefficients_subtitle_array[3];
						slider_text_coefficient = coefficients_text_array[3];
						slider_button_coefficient = coefficients_button_array[3];
					}else if ($window_width > responsive_breakpoint_set[4]) {
						slider_graphic_coefficient = coefficients_graphic_array[4];
						slider_title_coefficient = coefficients_title_array[4];
						slider_subtitle_coefficient = coefficients_subtitle_array[4];
						slider_text_coefficient = coefficients_text_array[4];
						slider_button_coefficient = coefficients_button_array[4];
					}else if ($window_width > responsive_breakpoint_set[5]){
						slider_graphic_coefficient = coefficients_graphic_array[5];
						slider_title_coefficient = coefficients_title_array[5];
						slider_subtitle_coefficient = coefficients_subtitle_array[5];
						slider_text_coefficient = coefficients_text_array[5];
						slider_button_coefficient = coefficients_button_array[5];
					}
					else{
						slider_graphic_coefficient = coefficients_graphic_array[6];
						slider_title_coefficient = coefficients_title_array[6];
						slider_subtitle_coefficient = coefficients_subtitle_array[6];
						slider_text_coefficient = coefficients_text_array[6];
						slider_button_coefficient = coefficients_button_array[6];
					}
					
					// letter-spacing decrease quicker
					var slider_title_coefficient_letter_spacing = slider_title_coefficient;
					var slider_subtitle_coefficient_letter_spacing = slider_subtitle_coefficient;
					var slider_text_coefficient_letter_spacing = slider_text_coefficient;
					if($window_width <= responsive_breakpoint_set[0]) {
						slider_title_coefficient_letter_spacing = slider_title_coefficient/2;
						slider_subtitle_coefficient_letter_spacing = slider_subtitle_coefficient/2;
						slider_text_coefficient_letter_spacing = slider_text_coefficient/2;
					}
					
					$item.find('.thumb').css({"width": Math.round(window["slider_graphic_width_" + i][0]*slider_graphic_coefficient) + 'px'}).css({"height": Math.round(window["slider_graphic_height_" + i][0]*slider_graphic_coefficient) + 'px'});
					$item.find('.qode_slide-svg-holder svg').css({"width": Math.round(window["slider_svg_width_" + i][0]*slider_graphic_coefficient) + 'px'}).css({"height": Math.round(window["slider_svg_height_" + i][0]*slider_graphic_coefficient) + 'px'});
					
					$item.find('.q_slide_title').css({"font-size": Math.round(window["slider_title_" + i][0]*slider_title_coefficient) + 'px'});
					$item.find('.q_slide_title').css({"line-height": Math.round(window["slider_title_" + i][1]*slider_title_coefficient) + 'px'});
					$item.find('.q_slide_title').css({"letter-spacing": Math.round(window["slider_title_" + i][2]*slider_title_coefficient_letter_spacing) + 'px'});
					$item.find('.q_slide_title').css({"margin-bottom": Math.round(window["slider_title_" + i][3]*slider_title_coefficient) + 'px'});
					
					$item.find('.q_slide_subtitle').css({"font-size": Math.round(window["slider_subtitle_" + i][0]*slider_subtitle_coefficient) + 'px'});
					$item.find('.q_slide_subtitle').css({"line-height": Math.round(window["slider_subtitle_" + i][1]*slider_subtitle_coefficient) + 'px'});
					$item.find('.q_slide_subtitle').css({"letter-spacing": Math.round(window["slider_subtitle_" + i][2]*slider_subtitle_coefficient_letter_spacing) + 'px'});
					$item.find('.q_slide_subtitle').css({"margin-bottom": Math.round(window["slider_subtitle_" + i][3]*slider_subtitle_coefficient) + 'px'});
					
					$item.find('.q_slide_text').css({"font-size": Math.round(window["slider_text_" + i][0]*slider_text_coefficient) + 'px'});
					$item.find('.q_slide_text').css({"line-height": Math.round(window["slider_text_" + i][1]*slider_text_coefficient) + 'px'});
					$item.find('.q_slide_text').css({"letter-spacing": Math.round(window["slider_text_" + i][2]*slider_text_coefficient_letter_spacing) + 'px'});
					
					$item.find('.qbutton:eq(0)').css({"font-size": Math.round(window["slider_button1_" + i][0]*slider_button_coefficient) + 'px'});
					$item.find('.qbutton:eq(1)').css({"font-size": Math.round(window["slider_button2_" + i][0]*slider_button_coefficient) + 'px'});
					$item.find('.qbutton:eq(0)').css({"line-height": Math.round(window["slider_button1_" + i][1]*slider_button_coefficient) + 'px'});
					$item.find('.qbutton:eq(1)').css({"line-height": Math.round(window["slider_button2_" + i][1]*slider_button_coefficient) + 'px'});
					$item.find('.qbutton:eq(0)').css({"letter-spacing": Math.round(window["slider_button1_" + i][2]*slider_button_coefficient) + 'px'});
					$item.find('.qbutton:eq(1)').css({"letter-spacing": Math.round(window["slider_button2_" + i][2]*slider_button_coefficient) + 'px'});
					$item.find('.qbutton:eq(0)').css({"height": Math.round(window["slider_button1_" + i][3]*slider_button_coefficient) + 'px'});
					$item.find('.qbutton:eq(1)').css({"height": Math.round(window["slider_button2_" + i][3]*slider_button_coefficient) + 'px'});
					if(window["slider_button1_" + i][4] != 0) {
						$item.find('.qbutton:eq(0)').css({"width": Math.round(window["slider_button1_" + i][4]*slider_button_coefficient) + 'px'});
					}else{
						$item.find('.qbutton:eq(0)').css({"width": 'auto'});
					}
					if(window["slider_button2_" + i][4] != 0) {
						$item.find('.qbutton:eq(1)').css({"width": Math.round(window["slider_button2_" + i][4]*slider_button_coefficient) + 'px'});
					}else{
						$item.find('.qbutton:eq(1)').css({"width": 'auto'});
					}
					$item.find('.qbutton:eq(0)').css({"padding-left": Math.round(window["slider_button1_" + i][5]*slider_button_coefficient) + 'px'});
					$item.find('.qbutton:eq(1)').css({"padding-left": Math.round(window["slider_button2_" + i][5]*slider_button_coefficient) + 'px'});
					$item.find('.qbutton:eq(0)').css({"padding-right": Math.round(window["slider_button1_" + i][6]*slider_button_coefficient) + 'px'});
					$item.find('.qbutton:eq(1)').css({"padding-right": Math.round(window["slider_button2_" + i][6]*slider_button_coefficient) + 'px'});
					
					$item.find('.separator').css({"margin-top": Math.round(window["slider_separator_" + i][0]*slider_title_coefficient) + 'px'});
					$item.find('.separator').css({"margin-bottom": Math.round(window["slider_separator_" + i][1]*slider_title_coefficient) + 'px'});
					
				}
				
				function resetSliderElementsSize($item,i){
					$item.find('.thumb').css({"width": Math.round(window["slider_graphic_width_" + i][0]) + 'px'}).css({"height": Math.round(window["slider_graphic_height_" + i][0]) + 'px'});
					$item.find('.qode_slide-svg-holder svg').css({"width": Math.round(window["slider_svg_width_" + i][0]) + 'px'}).css({"height": Math.round(window["slider_svg_height_" + i][0]) + 'px'});
					
					$item.find('.q_slide_title').css({"font-size": Math.round(window["slider_title_" + i][0]) + 'px'});
					$item.find('.q_slide_title').css({"line-height": Math.round(window["slider_title_" + i][1]) + 'px'});
					$item.find('.q_slide_title').css({"letter-spacing": Math.round(window["slider_title_" + i][2]) + 'px'});
					$item.find('.q_slide_title').css({"margin-bottom": Math.round(window["slider_title_" + i][3]) + 'px'});
					
					$item.find('.q_slide_subtitle').css({"font-size": Math.round(window["slider_subtitle_" + i][0]) + 'px'});
					$item.find('.q_slide_subtitle').css({"line-height": Math.round(window["slider_subtitle_" + i][1]) + 'px'});
					$item.find('.q_slide_subtitle').css({"letter-spacing": Math.round(window["slider_subtitle_" + i][2]) + 'px'});
					$item.find('.q_slide_subtitle').css({"margin-bottom": Math.round(window["slider_subtitle_" + i][3]) + 'px'});
					
					$item.find('.q_slide_text').css({"font-size": Math.round(window["slider_text_" + i][0]) + 'px'});
					$item.find('.q_slide_text').css({"line-height": Math.round(window["slider_text_" + i][1]) + 'px'});
					$item.find('.q_slide_text').css({"letter-spacing": Math.round(window["slider_text_" + i][2]) + 'px'});
					
					$item.find('.qbutton:eq(0)').css({"font-size": Math.round(window["slider_button1_" + i][0]) + 'px'});
					$item.find('.qbutton:eq(1)').css({"font-size": Math.round(window["slider_button2_" + i][0]) + 'px'});
					$item.find('.qbutton:eq(0)').css({"line-height": Math.round(window["slider_button1_" + i][1]) + 'px'});
					$item.find('.qbutton:eq(1)').css({"line-height": Math.round(window["slider_button2_" + i][1]) + 'px'});
					$item.find('.qbutton:eq(0)').css({"letter-spacing": Math.round(window["slider_button1_" + i][2]) + 'px'});
					$item.find('.qbutton:eq(1)').css({"letter-spacing": Math.round(window["slider_button2_" + i][2]) + 'px'});
					$item.find('.qbutton:eq(0)').css({"height": Math.round(window["slider_button1_" + i][3]) + 'px'});
					$item.find('.qbutton:eq(1)').css({"height": Math.round(window["slider_button2_" + i][3]) + 'px'});
					if(window["slider_button1_" + i][4] != 0) {
						$item.find('.qbutton:eq(0)').css({"width": Math.round(window["slider_button1_" + i][4]) + 'px'});
					}else{
						$item.find('.qbutton:eq(0)').css({"width": 'auto'});
					}
					if(window["slider_button2_" + i][4] != 0) {
						$item.find('.qbutton:eq(1)').css({"width": Math.round(window["slider_button2_" + i][4]) + 'px'});
					}else{
						$item.find('.qbutton:eq(1)').css({"width": 'auto'});
					}
					$item.find('.qbutton:eq(0)').css({"padding-left": Math.round(window["slider_button1_" + i][5]) + 'px'});
					$item.find('.qbutton:eq(1)').css({"padding-left": Math.round(window["slider_button2_" + i][5]) + 'px'});
					$item.find('.qbutton:eq(0)').css({"padding-right": Math.round(window["slider_button1_" + i][6]) + 'px'});
					$item.find('.qbutton:eq(1)').css({"padding-right": Math.round(window["slider_button2_" + i][6]) + 'px'});
					
					$item.find('.separator').css({"margin-top": Math.round(window["slider_separator_" + i][0]) + 'px'});
					$item.find('.separator').css({"margin-bottom": Math.round(window["slider_separator_" + i][1]) + 'px'});
					
				}
				
				if($this.hasClass('full_screen')){
					$this.css({'height': ($(window).height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px'});
					$this.find('.qode_slider_preloader').css({'height': ($(window).height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px'});
					$this.find('.qode_slider_preloader .ajax_loader').css({'display': 'block'});
					$this.find('.item').css({'height': ($(window).height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px'});
					
					if($('.paspartu_outer:not(.disable_top_paspartu)').length){
						if(!$('body').hasClass('paspartu_on_top_fixed')){
							$this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
						}
					}
					
					if($('.paspartu_outer.paspartu_on_bottom_slider').length){
						$this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
					}
					
					$(window).resize(function() {
						mobile_header = $(window).width() < 1000 ? $('header.page_header').height() : 0;
						header_height_add_for_paspartu = $window_width > 1000 && !$('header.page_header').hasClass('transparent') && $('body.paspartu_on_top_fixed').length == 0 ? $('header.page_header').height() : 0;
						paspartu_amount_with_top = $('.paspartu_outer:not(.disable_top_paspartu)').length > 0 ? Math.round($window_width*paspartu_width + header_height_add_for_paspartu) : 0;
						paspartu_amount_with_bottom = $('.paspartu_outer.paspartu_on_bottom_slider').length > 0 ? Math.round($window_width*paspartu_width) : 0;
						$this.css({'height': ($(window).height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px'});
						$this.find('.qode_slider_preloader .ajax_loader').css({'display': 'block'});
						$this.find('.item').css({'height': ($(window).height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px'});
						
						if($('.paspartu_outer:not(.disable_top_paspartu)').length){
							if(!$('body').hasClass('paspartu_on_top_fixed')){
								$this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
							}
						}
						if($('.paspartu_outer.paspartu_on_bottom_slider').length){
							$this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
						}
						
						if($this.hasClass('advanced_responsiveness')){
							$this.find('.item').each(function(i){
								setSliderElementsSize($(this),i);
							});
						}
					});
				}else if($this.hasClass('responsive_height')){
					var $def_height = $this.data('height');
					
					$this.find('.qode_slider_preloader').css({'height': ($this.height() - mobile_header - paspartu_amount_with_top - paspartu_amount_with_bottom) + 'px', 'display': 'block'});
					if($('.paspartu_outer:not(.disable_top_paspartu)').length){
						if(!$('body').hasClass('paspartu_on_top_fixed')){
							$this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
						}
					}
					if($('.paspartu_outer.paspartu_on_bottom_slider').length){
						$this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
					}
					
					setSliderHeight($this, $def_height);
					
					$(window).resize(function() {
						if($('.paspartu_outer:not(.disable_top_paspartu)').length){
							header_height_add_for_paspartu = $window_width > 1000 && !$('header.page_header').hasClass('transparent') ? $('header.page_header').height() : 0;
							if(!$('body').hasClass('paspartu_on_top_fixed')){
								$this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
							}
						}
						if($('.paspartu_outer.paspartu_on_bottom_slider').length){
							$this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
						}
						
						setSliderHeight($this, $def_height);
						if($this.hasClass('advanced_responsiveness')){
							$this.find('.item').each(function(i){
								setSliderElementsSize($(this),i);
							});
						}
					});
				}else {
					$this.find('.qode_slider_preloader').css({'height': ($this.height() - mobile_header) + 'px', 'display': 'block'});
					$this.find('.qode_slider_preloader .ajax_loader').css({'display': 'block'});
					if($('.paspartu_outer:not(.disable_top_paspartu)').length){
						if(!$('body').hasClass('paspartu_on_top_fixed')){
							$this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
						}
					}
					if($('.paspartu_outer.paspartu_on_bottom_slider').length){
						$this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
					}
					
					if($this.hasClass('advanced_responsiveness')){
						$this.find('.item').each(function(i){
							setSliderInitialElementsSize($(this),i);
							setSliderElementsSize($(this),i);
						});
					}
					$window_width < 1000 ? setSliderHeight($this, $def_height) : resetSliderHeight($def_height);
					
					$(window).resize(function() {
						if($('.paspartu_outer:not(.disable_top_paspartu)').length){
							header_height_add_for_paspartu = $window_width > 1000 && !$('header.page_header').hasClass('transparent') ? $('header.page_header').height() : 0;
							if(!$('body').hasClass('paspartu_on_top_fixed')){
								$this.closest('.q_slider').css('padding-top', Math.round(header_height_add_for_paspartu + $window_width * paspartu_width));
							}
						}
						if($('.paspartu_outer.paspartu_on_bottom_slider').length){
							$this.closest('.q_slider').css('padding-bottom', Math.round($window_width * paspartu_width));
						}
						
						if($window_width < 1000){
							setSliderHeight($this, $def_height);
							if($this.hasClass('advanced_responsiveness')){
								$this.find('.item').each(function(i){
									setSliderElementsSize($(this),i);
								});
							}
						}else{
							resetSliderHeight($def_height);
							if($this.hasClass('advanced_responsiveness')){
								$this.find('.item').each(function(i){
									resetSliderElementsSize($(this),i);
								});
							}
						}
					});
				}
				
				if($('body:not(.boxed):not(.vertical_menu_transparency):not(.vertical_menu_hidden):not(.page-template-landing_page-php)').hasClass('vertical_menu_enabled') && $(window).width() > 1000){
					var paspartu_add = $('body').hasClass('paspartu_enabled') ? 2*Math.round($window_width*paspartu_width) : 0; //2 times paspartu (left and right side)
					$this.find('.carousel-inner').width($window_width - 260 - paspartu_add);
					$(window).resize(function() {
						if($(window).width() > 1000){
							paspartu_add = $('body').hasClass('paspartu_enabled') ? 2*Math.round($window_width*paspartu_width) : 0; //2 times paspartu (left and right side)
							$this.find('.carousel-inner').width($window_width - 260 - paspartu_add);
						} else {
							$this.find('.carousel-inner').css('width','100%');
						}
					});
				}
				
				if($('body:not(.boxed):not(.vertical_menu_transparency):not(.page-template-landing_page-php)').hasClass('vertical_menu_hidden') && $window_width > 1000){
					var paspartu_add = $('body').hasClass('paspartu_enabled') ? 2*Math.round($window_width*paspartu_width) : 0; //2 times paspartu (left and right side)
					$this.find('.carousel-inner').width($window_width - 40 - paspartu_add);
					$(window).resize(function() {
						if($(window).width() > 1000){
							paspartu_add = $('body').hasClass('paspartu_enabled') ? 2*Math.round($window_width*paspartu_width) : 0; //2 times paspartu (left and right side)
							$this.find('.carousel-inner').width($window_width - 40 - paspartu_add);
						} else {
							$this.find('.carousel-inner').css('width','100%');
						}
					});
				}
				
				$(window).scroll(function() {
					if($scroll > ($this.height()+$('header.page_header').height()) && $(window).width() > 1000){
						$this.find('.carousel-inner, .carousel-indicators, button').hide();
					}else{
						$this.find('.carousel-inner, .carousel-indicators, button').show();
					}
				});
				
				var $slide_animation = $this.data('slide_animation');
				if($slide_animation === ""){
					$slide_animation = 6000;
				}
				
				// function for setting prev/next numbers on arrows
				var all_items_count = $('div.item').length;
				function setPrevNextNumbers(curr_item, all_items_count){
					if(curr_item == 1){
						$this.find('.left.carousel-control .prev').html(all_items_count);
						$this.find('.right.carousel-control .next').html(curr_item + 1);
					}else if(curr_item == all_items_count){
						$this.find('.left.carousel-control .prev').html(curr_item - 1);
						$this.find('.right.carousel-control .next').html(1);
					}else{
						$this.find('.left.carousel-control .prev').html(curr_item - 1);
						$this.find('.right.carousel-control .next').html(curr_item + 1);
					}
				}
				
				function initSlider(){
					//set active class on first item
					$this.find('.carousel-inner .item:first-child').addClass('active');
					checkSliderForHeaderStyle($('.carousel .active'), $this.hasClass('header_effect'));
					
					if($this.hasClass('slider_thumbs')){
						// initial state of prev/next numbers
						setPrevNextNumbers(1, all_items_count);
						
						//set prev and next thumb on load
						if($this.find('.active').next('div').find('.image').length){
							src = image_regex.exec($this.find('.active').next('div').find('.image').attr('style'));
							next_image = new Image();
							next_image.src = src[1];
						}else{
							next_image = $this.find('.active').next('div').find('> .video').clone();
							next_image.find('.video-overlay').remove();
							next_image.find('.video-wrap').width(170).height(95);
							next_image.find('.mejs-container').width(170).height(95);
							next_image.find('video').width(170).height(95);
						}
						$this.find('.right.carousel-control .img').html(next_image).find('img, div.video').addClass('old');
						
						if($this.find('.carousel-inner .item:last-child .image').length){
							src = image_regex.exec($this.find('.carousel-inner .item:last-child .image').attr('style'));
							prev_image = new Image();
							prev_image.src = src[1];
						}else{
							prev_image = $this.find('.carousel-inner .item:last-child > .video').clone();
							prev_image.find('.video-overlay').remove();
							prev_image.find('.video-wrap').width(170).height(95);
							prev_image.find('.mejs-container').width(170).height(95);
							prev_image.find('video').width(170).height(95);
						}
						$this.find('.left.carousel-control .img').html(prev_image).find('img, div.video').addClass('old');
					}
					
					if($this.hasClass('q_auto_start')){
						$this.carousel({
							interval: $slide_animation,
							pause: false
						});
					} else {
						$this.carousel({
							interval: 0,
							pause: false
						});
					}
					if($this.find('.item video').length){
						initVideoBackgroundSize();
					}
					
					if($this.hasClass('advanced_responsiveness') && ($this.hasClass('responsive_height') || $this.hasClass('full_screen'))){
						$this.find('.item').each(function (i) {
							setSliderInitialElementsSize($(this), i);
							setSliderElementsSize($(this), i);
						});
					}
					
					//initiate image animation
					if($('.carousel-inner .item:first-child').hasClass('animate_image') && $window_width > 1000){
						$this.find('.carousel-inner .item.animate_image:first-child .image').transformAnimate({
							transform: "matrix("+matrixArray[$('.carousel-inner .item:first-child').data('animate_image')]+")",
							duration: 30000
						});
					}
				}
				
				if($('html').hasClass('touch') || $('html').hasClass('touchevents')){
					if($this.find('.item:first-child .mobile-video-image').length > 0){
						src = image_regex.exec($this.find('.item:first-child .mobile-video-image').attr('style'));
						if (src) {
							var backImg = new Image();
							backImg.src = src[1];
							$(backImg).on('load', function(){
								$('.qode_slider_preloader').fadeOut(500);
								initSlider();
								checkSVG($this);
							});
						}
					}
					else{
						src = image_regex.exec($this.find('.item:first-child .image').attr('style'));
						if (src) {
							var backImg = new Image();
							backImg.src = src[1];
							$(backImg).on('load', function(){
								$('.qode_slider_preloader').fadeOut(500);
								initSlider();
								checkSVG($this);
							});
						}
					}
				} else {
					if($this.find('.item:first-child video').length > 0){
						$this.find('.item:first-child video').get(0).addEventListener('loadeddata',function(){
							$('.qode_slider_preloader').fadeOut(500);
							initSlider();
							checkSVG($this);
						});
					}else{
						src = image_regex.exec($this.find('.item:first-child .image').attr('style'));
						if (src) {
							var backImg = new Image();
							backImg.src = src[1];
							$(backImg).on('load', function(){
								$('.qode_slider_preloader').fadeOut(500);
								initSlider();
								checkSVG($this);
							});
						}
					}
				}
				
				$this.on('slide.bs.carousel', function () {
					$this.addClass('in_progress');
					$this.find('.active .slider_content_outer').fadeTo(800,0);
				});
				$this.on('slid.bs.carousel', function () {
					$this.removeClass('in_progress');
					$this.find('.active .slider_content_outer').fadeTo(0,1);
					checkSVG($this);
					
					// initiate image animation on active slide and reset all others
					$('div.item.animate_image .image').stop().css({'transform':'', '-webkit-transform':''});
					if($('div.item.active').hasClass('animate_image') && $window_width > 1000){
						$('div.item.animate_image.active .image').transformAnimate({
							transform: "matrix("+matrixArray[$('div.item.animate_image.active').data('animate_image')]+")",
							duration: 30000
						});
					}
					
					if($this.hasClass('slider_thumbs')){
						var curr_item = $('div.item').index($('div.item.active')[0]) + 1;
						setPrevNextNumbers(curr_item, all_items_count);
						
						// prev thumb
						if($this.find('.active').prev('div.item').length){
							if($this.find('.active').prev('div').find('.image').length){
								src = image_regex.exec($this.find('.active').prev('div').find('.image').attr('style'));
								prev_image = new Image();
								prev_image.src = src[1];
							}else{
								prev_image = $this.find('.active').prev('div').find('> .video').clone();
								prev_image.find('.video-overlay').remove();
								prev_image.find('.video-wrap').width(170).height(95);
								prev_image.find('.mejs-container').width(170).height(95);
								prev_image.find('video').width(170).height(95);
							}
							$this.find('.left.carousel-control .img .old').fadeOut(300,function(){
								$(this).remove();
							});
							$this.find('.left.carousel-control .img').append(prev_image).find('img, div.video').fadeIn(300).addClass('old');
							
						}else{
							if($this.find('.carousel-inner .item:last-child .image').length){
								src = image_regex.exec($this.find('.carousel-inner .item:last-child .image').attr('style'));
								prev_image = new Image();
								prev_image.src = src[1];
							}else{
								prev_image = $this.find('.carousel-inner .item:last-child > .video').clone();
								prev_image.find('.video-overlay').remove();
								prev_image.find('.video-wrap').width(170).height(95);
								prev_image.find('.mejs-container').width(170).height(95);
								prev_image.find('video').width(170).height(95);
							}
							$this.find('.left.carousel-control .img .old').fadeOut(300,function(){
								$(this).remove();
							});
							$this.find('.left.carousel-control .img').append(prev_image).find('img, div.video').fadeIn(300).addClass('old');
						}
						
						// next thumb
						if($this.find('.active').next('div.item').length){
							if($this.find('.active').next('div').find('.image').length){
								src = image_regex.exec($this.find('.active').next('div').find('.image').attr('style'));
								next_image = new Image();
								next_image.src = src[1];
							}else{
								next_image = $this.find('.active').next('div').find('> .video').clone();
								next_image.find('.video-overlay').remove();
								next_image.find('.video-wrap').width(170).height(95);
								next_image.find('.mejs-container').width(170).height(95);
								next_image.find('video').width(170).height(95);
							}
							
							$this.find('.right.carousel-control .img .old').fadeOut(300,function(){
								$(this).remove();
							});
							$this.find('.right.carousel-control .img').append(next_image).find('img, div.video').fadeIn(300).addClass('old');
							
						}else{
							if($this.find('.carousel-inner .item:first-child .image').length){
								src = image_regex.exec($this.find('.carousel-inner .item:first-child .image').attr('style'));
								next_image = new Image();
								next_image.src = src[1];
							}else{
								next_image = $this.find('.carousel-inner .item:first-child > .video').clone();
								next_image.find('.video-overlay').remove();
								next_image.find('.video-wrap').width(170).height(95);
								next_image.find('.mejs-container').width(170).height(95);
								next_image.find('video').width(170).height(95);
							}
							$this.find('.right.carousel-control .img .old').fadeOut(300,function(){
								$(this).remove();
							});
							$this.find('.right.carousel-control .img').append(next_image).find('img, div.video').fadeIn(300).addClass('old');
						}
					}
				});
				
				$this.swipe( {
					swipeLeft: function(event, direction, distance, duration, fingerCount){ $this.carousel('next'); },
					swipeRight: function(event, direction, distance, duration, fingerCount){ $this.carousel('prev'); },
					threshold:20
				});
				
			});
			
			if ($('.no-touchevents .carousel').length) {
				skrollr_slider = skrollr.init({
					edgeStrategy: 'set',
					smoothScrolling: true,
					forceHeight: false
				});
				skrollr_slider.refresh();
			}
		}
	}
	
	function checkSliderForHeaderStyle($this, header_effect){
		"use strict";
		
		var slide_header_style = "";
		var navigation_color = $this.data('navigation-color');
		if($this.hasClass('light')){ slide_header_style = 'light';}
		if($this.hasClass('dark')){ slide_header_style = 'dark';}
		
		if( slide_header_style !== ""){
			if(header_effect){
				$('header.page_header').removeClass('dark light').addClass(slide_header_style);
				$('aside.vertical_menu_area').removeClass('dark light').addClass(slide_header_style);
			}
			$('.carousel .carousel-control, .carousel .carousel-indicators').removeClass('dark light').addClass(slide_header_style);
		}else{
			if(header_effect){
				$('header.page_header').removeClass('dark light').addClass(default_header_style);
				$('aside.vertical_menu_area').removeClass('dark light').addClass(default_header_style);
			}
			$('.carousel .carousel-control, .carousel .carousel-indicators').removeClass('dark light').addClass(default_header_style);
		}
		
		if(navigation_color !== undefined){
			$('.carousel-control .thumb_holder .thumb_top, .carousel-indicators li').css('background-color',navigation_color);
			$('.carousel-control .prev_nav, .carousel-control .next_nav').css('border-color',navigation_color);
			$('.carousel-control .prev_nav i, .carousel-control .next_nav i').css('color',navigation_color);
		}else{
			$('.carousel-control .thumb_holder .thumb_top, .carousel-indicators li').css('background-color','');
			$('.carousel-control .prev_nav, .carousel-control .next_nav').css('border-color','');
			$('.carousel-control .prev_nav i, .carousel-control .next_nav i').css('color','');
		}
	}
	
})(jQuery);