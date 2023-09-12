/* http://keith-wood.name/countdown.html
 */
(function($) {
	$.wc_lotery_countdown.regionalOptions['us'] = {
		labels: [wc_lottery_language_data .labels.Years, wc_lottery_language_data .labels.Months, wc_lottery_language_data .labels.Weeks, wc_lottery_language_data .labels.Days, wc_lottery_language_data .labels.Hours, wc_lottery_language_data .labels.Minutes, wc_lottery_language_data .labels.Seconds],
		labels1: [wc_lottery_language_data .labels1.Year, wc_lottery_language_data .labels1.Month, wc_lottery_language_data .labels1.Week, wc_lottery_language_data .labels1.Day, wc_lottery_language_data .labels1.Hour, wc_lottery_language_data .labels1.Minute, wc_lottery_language_data .labels1.Second],
		
		compactLabels: [wc_lottery_language_data .compactLabels.y, wc_lottery_language_data .compactLabels.m, wc_lottery_language_data .compactLabels.w, wc_lottery_language_data .compactLabels.d,  wc_lottery_language_data .compactLabels.h, wc_lottery_language_data .compactLabels.min, wc_lottery_language_data .compactLabels.s],
		whichLabels: function(amount) {
			return (amount == 1 ? 1 : (amount >= 2 && amount <= 4 ? 2 : 0));
		},
		digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
		timeSeparator: ':', isRTL: false};
	$.wc_lotery_countdown.setDefaults($.wc_lotery_countdown.regionalOptions['us']);
})(jQuery);
