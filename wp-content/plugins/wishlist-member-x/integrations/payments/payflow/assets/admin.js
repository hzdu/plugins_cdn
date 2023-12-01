$.getScript(WLM3VARS.pluginurl + '/integrations/payments/paypalec/assets/common.js?build=3.24.4', function() {
	paypal_common.products = $.extend({}, WLM3ThirdPartyIntegration['payflow']['paypalpayflowproducts']),
	paypal_common.new_product = {
		amount: 10,

		recurring: 0,
		recur_amount: 10,
		recur_billing_frequency: 1,
		payflow_recur_pay_period: 'MONT',
	}
	integration_modal_save['payflow'] = paypal_common.fxn.after_modal_save;
	paypal_common.prefix = 'payflow';
	paypal_common.products_option = 'paypalpayflowproducts';

});

integration_before_open['payflow'] = function(obj) {
	var interval_id = setInterval(function() {
		if(typeof paypal_common == 'object' && paypal_common.prefix == 'payflow') {
			clearInterval(interval_id);
			paypal_common.fxn.init(obj);
		}
	}, 100);
}
