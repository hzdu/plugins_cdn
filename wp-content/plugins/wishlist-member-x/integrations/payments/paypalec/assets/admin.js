$.getScript(WLM3VARS.pluginurl + '/integrations/payments/paypalec/assets/common.js?build=3.24.4', function() {
	paypal_common.products = $.extend({}, WLM3ThirdPartyIntegration['paypalec']['paypalecproducts']),
	paypal_common.new_product = {
		amount: 10,

		recurring: 0,
		recur_amount: 10,
		recur_billing_frequency: 1,
		recur_billing_period: wp.i18n.__( 'Month', 'wishlist-member' ),

		trial: 0,
		trial_amount: 10,
		trial_recur_billing_frequency: 7,
		trial_recur_billing_period: wp.i18n.__( 'Day', 'wishlist-member' ),

		max_failed_payments: 3
	}
	integration_modal_save['paypalec'] = paypal_common.fxn.after_modal_save;
	paypal_common.prefix = 'paypalec';
	paypal_common.products_option = 'paypalecproducts';

});

integration_before_open['paypalec'] = function(obj) {
	var interval_id = setInterval(function() {
		if(typeof paypal_common == 'object' && paypal_common.prefix == 'paypalec') {
			clearInterval(interval_id);
			paypal_common.fxn.init(obj);
		}
	}, 100);
}

$(function() {
	$('body').off('.paypalec');
	$('body').on('change.paypalec', 'input[name="paypalec_spb[enable]"]', function() {
		$('#paypalec-spb-settings').toggle(this.checked);
	});
	$('body').on('change.paypalec', 'select[name^="paypalec_spb"]', function() {
		var settings = {
			env : 'sandbox',
			style : {
				layout : $('select[name="paypalec_spb[layout]"]').val(),
				size : $('select[name="paypalec_spb[size]"]').val(),
				shape : $('select[name="paypalec_spb[shape]"]').val(),
				color : $('select[name="paypalec_spb[color]"]').val(),
			},
			funding : {
				allowed : $('select[name="paypalec_spb[funding]"] option:selected').map(function() {return paypal.FUNDING[this.value]}).get(),
				disallowed : $('select[name="paypalec_spb[funding]"] option:not(:selected)').map(function() {return paypal.FUNDING[this.value]}).get(),
			},
			payment : function() {},
			onAuthorize : function() {},
		}
		$('#paypalec-spb-preview').empty();
		paypal.Button.render(settings, '#paypalec-spb-preview');
	});
	$('input[name="paypalec_spb[enable]"]').trigger('change.paypalec');
	$('select[name="paypalec_spb[layout]"]').trigger('change.paypalec');
});

