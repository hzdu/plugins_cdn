(function ( $ ) {
	'use strict';

	const gpay_appId = squaregpay_params.application_id;
	const gpay_locationId = squaregpay_params.lid;


	function buildPaymentRequest(payments) {
		return payments.paymentRequest({
			countryCode: squaregpay_params.country_code,
			currencyCode: squaregpay_params.currency_code,
			total: {
				amount: squaregpay_params.order_total,
				label: 'Total',
			},
		});
	}

	async function tokenize(paymentMethod) {

		const tokenResult = await
		paymentMethod.tokenize();
		if (tokenResult.status === 'OK') {
			return tokenResult.token;
		} else {
			let errorMessage = tokenResult.status;
			if (tokenResult.errors) {
				errorMessage += tokenResult.errors;
			}
			throw new Error(errorMessage);
		}
	}


	async function initializeGooglePay(payments) {
		const paymentRequest = buildPaymentRequest(payments)
		const googlePay = await
		payments.googlePay(paymentRequest);
		await
		googlePay.attach('#google-pay-button');
		return googlePay;
	}

// Helper method for displaying the Payment Status on the screen.
// status is either SUCCESS or FAILURE;
	function displayPaymentResults(status) {
		const statusContainer = document.getElementById(
				'payment-status-container'
		);
		if (status === 'SUCCESS') {
			statusContainer.classList.remove('is-failure');
			statusContainer.classList.add('is-success');
		} else {
			statusContainer.classList.remove('is-success');
			statusContainer.classList.add('is-failure');
		}

		statusContainer.style.visibility = 'visible';
	}

	document.addEventListener('DOMContentLoaded', async function () {
		if (!window.Square) {
			throw new Error('Square.js failed to load properly');
		}
		const payments = window.Square.payments(gpay_appId, gpay_locationId);

		let googlePay;
		try {
			googlePay = await
			initializeGooglePay(payments);

		} catch (e) {
			console.error('Initializing Google Pay failed', e);
			// There are a number of reason why Google Pay may not be supported
			// (e.g. Browser Support, Device Support, Account). Therefore you
			// should handle initialization failures, while still loading other
			// applicable payment methods.
		}

		async function handlePaymentMethodSubmission(event, paymentMethod) {
			console.log(paymentMethod);
			//debugger;
			event.preventDefault();

			try {
				// disable the submit button as we await tokenization and make a
				// payment request.
				const token = await
				tokenize(paymentMethod);

				if (token) {
					console.log(token);

					var $form = jQuery('form.woocommerce-checkout, form#order_review');
					// inject nonce to a hidden field to be submitted
					$form.append('<input type="hidden" class="square-nonce" name="square_nonce" value="' + token + '" />');


					$form.submit();
				} else {
					var html = '';
					html += '<ul class="woocommerce_error woocommerce-error">';
					$('#place_order').prop('disabled', false);
					html += '<li>' + token + '</li>';
					html += '</ul>';
					$('.payment_method_square_plus fieldset').eq(0).prepend(html);

				}

				console.debug('Payment Success', paymentResults);
			} catch (e) {
				console.error(e.message);
			}
		}

		//Checkpoint 2
		if (googlePay !== undefined) {
			const googlePayButton = document.getElementById('google-pay-button');
			googlePayButton.addEventListener('click', async function (event) {
				await
				handlePaymentMethodSubmission(event, googlePay);
			}

		);
		}
	}

	);

}( jQuery ) );


jQuery( window  ).load(function() {
	jQuery(".woocommerce-checkout-payment").on('change', '.input-radio', function(){
		setTimeout(explode, 300);
	});
	setTimeout(explode, 1000);
});


jQuery( function($){
	$('form.checkout').on('change', '.woocommerce-checkout-payment input', function(){
		hideunhide();
	});
});

function hideunhide(){
	if( jQuery('.woocommerce-checkout-payment .input-radio:checked').val() == 'square_google_pay' ){
		jQuery('#place_order').css('display', 'none');
	} else if(jQuery('.woocommerce-checkout-payment .input-radio:checked').val() == 'square_gift_card_pay' ) {
		jQuery('#place_order').css('display', 'block');
	} else if(jQuery('.woocommerce-checkout-payment .input-radio:checked').val() == 'square_plus' ){
		jQuery('#place_order').css('display', 'block');
	} else if(jQuery('.woocommerce-checkout-payment .input-radio:checked').val() == 'square_apple_pay' ){
		jQuery('#place_order').css('display', 'none');
	}else if(jQuery('.woocommerce-checkout-payment .input-radio:checked').val() == 'square_ach_payment' ){
		jQuery('#place_order').css('display', 'none');
	} else {
		jQuery('#place_order').css('display', 'block');
	}
}

function explode(){
	jQuery('.woocommerce-checkout-payment .input-radio').change(function() {
		console.log(jQuery('.woocommerce-checkout-payment .input-radio:checked').val());
		hideunhide();
	});

	console.log(jQuery('.woocommerce-checkout-payment .input-radio:checked').val());
	hideunhide();

}
