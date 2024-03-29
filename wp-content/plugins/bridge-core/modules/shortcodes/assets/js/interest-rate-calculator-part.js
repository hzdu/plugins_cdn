(function($) {
    'use strict';
	
	var interestRateCalculator = {};
	qode.modules.interestRateCalculator = interestRateCalculator;
	
	interestRateCalculator.qodeInitInterestRateCalculator = qodeInitInterestRateCalculator;
	interestRateCalculator.qodeInitElementorInterestRateCalculator = qodeInitElementorInterestRateCalculator;
	
	interestRateCalculator.qodeOnDocumentReady = qodeOnDocumentReady;
	interestRateCalculator.qodeOnWindowLoad = qodeOnWindowLoad;
	
	$(document).ready(qodeOnDocumentReady);
	$(window).on('load', qodeOnWindowLoad);
	
	function qodeOnDocumentReady() {
		qodeInitInterestRateCalculator();
	}
	
	function qodeOnWindowLoad() {
		qodeInitElementorInterestRateCalculator();
	}

	function qodeInitInterestRateCalculator(){
		qodeInitRangeSlider();
	}

	function qodeInitRangeSlider(){

		var holder =  $('.qode-irc-holder');

		if(holder.length){		
			holder.each(function(){
				var holder1 = $(this);
				var slider = holder1.find('.irc-range-slider');
				var interestRate;

				if(holder1.data('rate')!=''){
					interestRate = parseFloat(holder1.data('rate'));
				}

				// Rangeslider initialization
				slider.rangeslider({
					polyfill: false,
					onInit: function(position, value) {
						if(holder1.data('active-color')!=''){
							var activeColor = holder1.data('active-color');
							holder1.find('.rangeslider__fill').css('background-color',activeColor);
							holder1.find('.rangeslider__handle').css('background-color',activeColor);
						}
						qodeInterestRateCalculate(holder1, interestRate);
					},
					onSlide: function(position, value) {
						qodeInterestRateCalculate(holder1, interestRate);
					}
				});
			})
		}

	}

	function qodeInterestRateCalculate(holder, interestRate){

		var loanSlider = holder.find('.irc-range-slider-loan');
		var periodSlider = holder.find('.irc-range-slider-period');
		var borrowHolder = holder.find('.qode-irc-borrow-row .qode-irc-value');
		var interestHolder = holder.find('.qode-irc-interest-row .qode-irc-value');
		var totalHolder = holder.find('.qode-irc-total-row .qode-irc-value');
		var currentLoanHolder = holder.find('.qode-irc-slider-loan-value.irc-current .irc-current-value');
		var currentPeriodHolder = holder.find('.qode-irc-slider-period-value.irc-current .irc-current-value');
		var loanValue, periodValue, interest, borrow, total;

		loanValue = parseFloat(loanSlider.val());
		periodValue = parseFloat(periodSlider.val());
		interest = loanValue * interestRate / 100;
		total = loanValue + interest;
		if(periodValue != 0){
			borrow = total / periodValue;
		}
		borrowHolder.html(Math.round(borrow*100)/100);
		interestHolder.html(Math.round(interest*100)/100);
		totalHolder.html(Math.round(total*100)/100);
		currentLoanHolder.html(loanValue);
		currentPeriodHolder.html(periodValue);
	}
	
	function qodeInitElementorInterestRateCalculator(){
		$(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bridge_interest_rate_calculator.default', function() {
				qodeInitInterestRateCalculator();
			} );
		});
	}

})(jQuery);