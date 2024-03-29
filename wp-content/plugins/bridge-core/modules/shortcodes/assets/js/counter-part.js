(function($) {
	'use strict';
	
	var counter = {};
	qode.modules.counter = counter;
	
	counter.initToCounter = initToCounter;
	counter.initCounter = initCounter;
	counter.qodeInitElementorCounter = qodeInitElementorCounter;
	
	counter.qodeOnDocumentReady = qodeOnDocumentReady;
	counter.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	/*
	 All functions to be called on $(window).load() should be in this function
	 */
	function qodeOnDocumentReady() {
		initToCounter();
		initCounter();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorCounter();
	}
	
	function initToCounter(){
		"use strict";
		
		if($('.counter.zero').length){
			$('.counter.zero').each(function() {
				
				var parent = $(this).parent();
				var axis = 100;
				
				if(typeof parent.data('element-appearance') !== 'undefined' && parent.data('element-appearance') !== false) {
					axis = parent.data('element-appearance');
				}
				
				if(!$(this).hasClass('executed')){
					$(this).addClass('executed');
					if($(this).parents('.vertical_split_slider').length){
						$(this).parent().css('opacity', '1');
						var $max = parseFloat($(this).text());
						$(this).countTo({
							from: 0,
							to: $max,
							speed: 1500,
							refreshInterval: 100
						});
					}
					else{
						$(this).appear(function() {
							$(this).parent().css('opacity', '1');
							var $max = parseFloat($(this).text());
							$(this).countTo({
								from: 0,
								to: $max,
								speed: 1500,
								refreshInterval: 100
							});
						},{accX: 0, accY: -axis});
					}
				}
			});
		}
	}
	
	function initCounter(){
		"use strict";
		
		if($('.counter.random').length){
			$('.counter.random').each(function() {
				
				var parent = $(this).parent();
				var axis = 100;
				
				if(typeof parent.data('element-appearance') !== 'undefined' && parent.data('element-appearance') !== false) {
					axis = parent.data('element-appearance');
				}
				
				if(!$(this).hasClass('executed')){
					$(this).addClass('executed');
					if($(this).parents('.vertical_split_slider').length){
						$(this).parent().css('opacity', '1');
						$(this).absoluteCounter({
							speed: 2000,
							fadeInDelay: 1000
						});
					}
					else{
						$(this).appear(function() {
							$(this).parent().css('opacity', '1');
							$(this).absoluteCounter({
								speed: 2000,
								fadeInDelay: 1000
							});
						},{accX: 0, accY: -axis});
					}
				} else {
					if( $(this).parents('.vertical_split_slider_responsive').length ){
						var counterSpans = $(this).find('span');
						if( counterSpans.length ){
							counterSpans.remove();
						}
						var digit = 0;
						if( typeof( parent.data('digit') ) !== 'undefined' && parent.data('digit') !== '' ){
							digit = parent.data('digit');
						}
						
						$(this).html(digit);
						$(this).appear(function() {
							$(this).absoluteCounter({
								speed: 2000,
								fadeInDelay: 1000
							});
						},{accX: 0, accY: -axis});
					}
				}
			});
		}
	}
	
	function qodeInitElementorCounter(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_counter.default', function() {
				initToCounter();
				initCounter();
			} );
		});
	}
	
})(jQuery);