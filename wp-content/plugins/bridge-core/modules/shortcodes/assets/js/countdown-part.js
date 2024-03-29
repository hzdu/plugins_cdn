(function($) {
	'use strict';
	
	var countdown = {};
	qode.modules.countdown = countdown;
	
	countdown.initCountdown = initCountdown;
	countdown.qodeInitElementorCountdown = qodeInitElementorCountdown;
	
	countdown.qodeOnDocumentReady = qodeOnDocumentReady;
	countdown.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	/*
	 All functions to be called on $(window).load() should be in this function
	 */
	function qodeOnDocumentReady() {
		if( ! $( '.vertical_split_slider' ).length ){
			initCountdown();
		}
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorCountdown();
	}
	
	function initCountdown(){
		"use strict";
		if($('.countdown').length){
			$('.countdown').each(function(){
				
				var countdownId = $(this).attr('id');
				var $this = $('#'+countdownId);
				var year = 0;
				var month = 0;
				var day = 0;
				var hour = 0;
				var minute = 0;
				var monthsLabel;
				var monthLabel;
				var daysLabel;
				var dayLabel;
				var hoursLabel;
				var hourLabel;
				var minutesLabel;
				var minuteLabel;
				var secondsLabel;
				var secondLabel;
				var tickf;
				var timezone;
				var digitfs;
				var labelfs;
				var color;
				
				if(typeof $this.data('year') !== 'undefined' && $this.data('year') !== false) {
					year = $this.data('year');
				}
				if(typeof $this.data('month') !== 'undefined' && $this.data('month') !== false) {
					month = $this.data('month');
				}
				if(typeof $this.data('day') !== 'undefined' && $this.data('day') !== false) {
					day = $this.data('day');
				}
				if(typeof $this.data('hour') !== 'undefined' && $this.data('hour') !== false) {
					hour = $this.data('hour');
				}
				if(typeof $this.data('minute') !== 'undefined' && $this.data('minute') !== false) {
					minute = $this.data('minute');
				}
				if(typeof $this.data('monthslabel') !== 'undefined' && $this.data('monthslabel') !== false) {
					monthsLabel = $this.data('monthslabel');
				}
				if(typeof $this.data('monthlabel') !== 'undefined' && $this.data('monthlabel') !== false) {
					monthLabel = $this.data('monthlabel');
				}
				if(typeof $this.data('dayslabel') !== 'undefined' && $this.data('dayslabel') !== false) {
					daysLabel = $this.data('dayslabel');
				}
				if(typeof $this.data('daylabel') !== 'undefined' && $this.data('daylabel') !== false) {
					dayLabel = $this.data('daylabel');
				}
				if(typeof $this.data('hourslabel') !== 'undefined' && $this.data('hourslabel') !== false) {
					hoursLabel = $this.data('hourslabel');
				}
				if(typeof $this.data('hourlabel') !== 'undefined' && $this.data('hourlabel') !== false) {
					hourLabel = $this.data('hourlabel');
				}
				if(typeof $this.data('minuteslabel') !== 'undefined' && $this.data('minuteslabel') !== false) {
					minutesLabel = $this.data('minuteslabel');
				}
				if(typeof $this.data('minutelabel') !== 'undefined' && $this.data('minutelabel') !== false) {
					minuteLabel = $this.data('minutelabel');
				}
				if(typeof $this.data('secondslabel') !== 'undefined' && $this.data('secondslabel') !== false) {
					secondsLabel = $this.data('secondslabel');
				}
				if(typeof $this.data('secondlabel') !== 'undefined' && $this.data('secondlabel') !== false) {
					secondLabel = $this.data('secondlabel');
				}
				if(typeof $this.data('tickf') !== 'undefined' && $this.data('tickf') !== false) {
					tickf = $this.data('tickf');
				}
				if(typeof $this.data('timezone') !== 'undefined' && $this.data('timezone') !== false) {
					timezone = $this.data('timezone');
				}
				if(typeof $this.data('digitfs') !== 'undefined' && $this.data('digitfs') !== false) {
					digitfs = $this.data('digitfs');
				}
				if(typeof $this.data('labelfs') !== 'undefined' && $this.data('labelfs') !== false) {
					labelfs = $this.data('labelfs');
				}
				if(typeof $this.data('color') !== 'undefined' && $this.data('color') !== false) {
					color = $this.data('color');
				}
				
				$this.countdown({
					until: new Date( year, month - 1, day, hour, minute, 44),
					labels: ['Years', monthsLabel, 'Weeks', daysLabel, hoursLabel, minutesLabel, secondsLabel],
					labels1: ['Year', monthLabel, 'Week', dayLabel, hourLabel, minuteLabel, secondLabel],
					format: 'ODHMS',
					timezone: timezone,
					padZeroes: true,
					significant: 0,
					onTick: function(){
						if (digitfs !== 'undefined' && digitfs !== ''){
							$this.find('.countdown-amount').css('font-size',digitfs + 'px').css('line-height',digitfs + 'px');
						}
						if (labelfs !== 'undefined' && labelfs !== ''){
							$this.find('.countdown-period').css('font-size',labelfs + 'px');
						}
						if (color !== 'undefined' && color !== ''){
							$this.find('.countdown_separator').css('background-color',color);
						}
					}
				});
			});
		}
	}
	
	function qodeInitElementorCountdown(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_countdown.default', function() {
				initCountdown();
			} );
		});
	}
	
})(jQuery);