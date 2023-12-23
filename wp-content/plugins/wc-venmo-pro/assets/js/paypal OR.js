// wc_venmo_pay_object // wp_localize_script object
console.debug("wc_venmo_pay_object", wc_venmo_pay_object);

(function ($, window, document) {
	("use strict");

	// Show error notice at top of checkout form, or else within button container
	var showError = function (message) {
		console.error(message);
		var message_container = document.getElementById("venmo-status-container");
		if (!message_container || !message) return;
		message_container.innerHTML = message;
		message_container.style.display = "block";
		document.getElementById("venmo-spinner").style.display = "none";
	};

	try {
		var fromCheckout =
			wc_venmo_pay_object.checkout_url.replace(/\/$/, "") ===
			wc_venmo_pay_object.checkout_url2.replace(/\/$/, "");

		var amount = wc_venmo_pay_object.amount;
		// console.debug(`Venmo amount: ${amount}`);
		if (!amount) throw new Error("Mismatched amounts");

		if (!fromCheckout) throw new Error("Not checkout");

		var render = async function () {
			var selector = "#venmo-button-container";

			// Don't render if selector doesn't exist or is already rendered in DOM.
			if (
				!$(selector).length ||
				$(selector).children().length ||
				!document.getElementById("venmo-button-container")
			)
				throw new Error("Venmo button container not found");
			console.debug($(selector));

			await fetch(wc_venmo_pay_object.paypaljs);
			var paypal = window.paypal;
			if (!paypal) throw new Error("PayPal CDN error");

			var button_args = {
				style: {
					layout: "vertical",
					color: "blue",
					shape: wc_venmo_pay_button_style.shape ?? "rect",
					label: wc_venmo_pay_button_style.label ?? "pay",
					// branding: true,
					// tagline: false,
				},

				createOrder: function (data, actions) {
					console.log(data);
					// Clear any errors from previous attempt.
					$(selector).remove();

					// Set up the transaction
					return actions.order.create({
						purchase_units: wc_venmo_pay_object.purchase_units,
						intent: "AUTHORIZE",
						application_context: {
							// DEPRECATED https://developer.paypal.com/docs/api/orders/v2/#definition-application_context
							brand_name: wc_venmo_pay_object.brand_name,
							cancel_url: wc_venmo_pay_object.checkout_url,
							return_url: wc_venmo_pay_object.checkout_url,
							// landing_page: "BILLING",
							// locale: "en-US",
							// shipping_preference: "GET_FROM_FILE",
							// user_action: "CONTINUE",
						},
					});

					// return new Promise(function (resolve, reject) {
					// 	resolve();
					// }).then(function () {
					// 	// Make PayPal Checkout initialization request.
					// 	var request_callback = function (response) {
					// 		if (!response.success) {
					// 			// Error messages may be preformatted in which case response structure will differ
					// 			var messages = response.data
					// 				? response.data.messages
					// 				: response.messages;
					// 			if ("string" === typeof messages) {
					// 				showError(messages);
					// 			} else {
					// 				var messageItems = messages
					// 					.map(function (message) {
					// 						return "<li>" + message + "</li>";
					// 					})
					// 					.join("");
					// 				showError(
					// 					'<ul class="woocommerce-error" role="alert">' +
					// 						messageItems +
					// 						"</ul>"
					// 				);
					// 			}
					// 			return null;
					// 		}
					// 		return response.data.token;
					// 	};

					// 	// return paypal
					// 	//     .request({
					// 	//         method: "post",
					// 	//         url: wc_venmo_pay_object.start_checkout_url,
					// 	//         body: data,
					// 	//     })
					// 	//     .then(request_callback);
					// });
				},

				onApprove: function (data, actions) {
					// This function authorizes the funds from the transaction.
					// https://developer.paypal.com/docs/api/orders/v2/#orders_authorize
					// Authorize the transaction https://developer.paypal.com/docs/checkout/standard/customize/authorization/
					console.log(data);
					document.getElementById("wc_venmo_paypal_data").value =
						JSON.stringify(data);
					document.getElementById("wc_venmo_orderID").value = data.orderID;
					//   console.log(actions.order.authorize());
					actions.order.authorize().then(function (authorization) {
						console.log(`-------------authorization---- ${authorization}`);
						// Get the authorization id
						var wc_venmo_authorizationID =
							authorization.purchase_units[0].payments.authorizations[0].id;
						console.log(
							`orderID: ${data.orderID}, wc_venmo_authorizationID: ${wc_venmo_authorizationID}`
						);
						document.getElementById("wc_venmo_authorizationID").value =
							wc_venmo_authorizationID;
					});
					// if (fromCheckout) {
					// 	// Pass data necessary for authorizing createOrder to back-end.
					// 	$("form.checkout")
					// 		.append(
					// 			$('<input type="hidden" name="wc_venmo_orderID" /> ').attr(
					// 				"value",
					// 				data.orderID
					// 			)
					// 		)
					// 		.append(
					// 			$('<input type="hidden" name="wc_venmo_payerID" /> ').attr(
					// 				"value",
					// 				data.payerID
					// 			)
					// 		)
					// 		.trigger("submit");
					// } else {
					// 	// Navigate to order confirmation URL specified in original request to PayPal from back-end.
					// 	return actions.redirect(wc_venmo_pay_object.checkout_url);
					// }
				},

				onCancel: function (data, actions) {
					console.log(data);
					showError("Payment cancelled");
					// // Show a cancel page, or return to cart
					// window.location.href = wc_venmo_pay_object.checkout_url;
					return actions.redirect(wc_venmo_pay_object.checkout_url);
				},

				onError: function () {
					console.error(err);
					jQuery(selector).empty();
					// render();
				},
			};

			// Render Venmo button.
			var venmo_button = paypal.Buttons({
				fundingSource: paypal.FUNDING.VENMO,
				createOrder: button_args.createOrder,
				onApprove: button_args.onApprove,
				onError: button_args.onError,
				onCancel: button_args.onCancel,
				style: button_args.style,
			});
			if (venmo_button.isEligible()) venmo_button.render(selector);
		};

		// Render Venmo button.
		setTimeout(render, 5000);

		// if (!fromCheckout) {
		// 	render();
		// } else {
		// 	$(document.body).on(
		// 		"updated_cart_totals updated_checkout",
		// 		render.bind(this, false)
		// 	);
		// }
	} catch (error) {
		showError(error.message);
	}
})(jQuery, window, document);
