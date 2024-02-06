// wc_venmo_pay_object // wp_localize_script object
console.debug(
	"wc_venmo_pay_object",
	wc_venmo_pay_object
	// wc_venmo_pay_object?.isPro
);

jQuery(document).ready(function ($) {
	$("body").on("updated_checkout", async function () {
		await loadVenmoPay();
	});
});

let venmostatus = false;
async function loadVenmoPay() {
	// console.debug("loading Pay with Venmo");
	try {
		var checkout_url = wc_venmo_pay_object.checkout_url;
		var purchase_units = wc_venmo_pay_object.purchase_units;
		// var cart = wc_venmo_pay_object.cart;
		// var cart_items = wc_venmo_pay_object.cart_items;
		console.debug(wc_venmo_pay_object);

		var venmo_style = {
			layout: "vertical",
			color: "blue",
			shape: wc_venmo_pay_button_style.shape ?? "rect",
			label: wc_venmo_pay_button_style.label ?? "pay",
		};
		console.debug(wc_venmo_pay_button_style, venmo_style);
		// var venmo_style = {
		// 	layout: "vertical", // "horizontal",
		// 	color: "blue", // blue or gold
		// 	shape: "rect", // rect or pill
		// 	label: "pay", // pay, checkout, buynow, pay, installment
		// 	// tagline: true, // Note: Set the style.layout to horizontal for taglines.
		// };

		let venmobutton;
		// var referenceId = Math.random().toString(35).slice(2);

		var amount = wc_venmo_pay_object.amount;
		// console.debug(`Venmo amount: ${amount}`);
		if (!amount) throw new Error("Mismatched amounts");

		if (!window.paypal) throw new Error("PayPal CDN error");

		if (!document.getElementById("venmo-button-container"))
			throw new Error("Venmo button container not found");

		// if (venmobutton && venmobutton.close) {
		// 	venmobutton.close();
		// }
		// Initialize Venmo, Render the Venmo button into #venmo-button-container
		// https://developer.paypal.com/sdk/js/reference/#buttons
		venmobutton = paypal.Buttons({
			fundingSource: paypal.FUNDING.VENMO,
			style: venmo_style,
			// style: {
			// 	layout: "vertical", // "horizontal",
			// 	color: "blue", // blue or gold
			// 	shape: "rect", // rect or pill
			// 	label: "pay", // pay, checkout, buynow, pay, installment
			// 	// tagline: true, // Note: Set the style.layout to horizontal for taglines.
			// },
			createOrder: function (data, actions) {
				// Set up the transaction
				return actions.order.create({
					purchase_units,
					// [
					// 	{
					// 		amount: {
					// 			currency_code: "USD",
					// 			value: amount,
					// 		},
					// 	},
					// ],
					intent: "AUTHORIZE",
					application_context: {
						// DEPRECATED https://developer.paypal.com/docs/api/orders/v2/#definition-application_context
						brand_name: wc_venmo_pay_object.brand_name,
						cancel_url: checkout_url,
						return_url: checkout_url,
						// landing_page: "BILLING",
						// locale: "en-US",
						// shipping_preference: "GET_FROM_FILE",
						// user_action: "CONTINUE",
					},
				});
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
					document.getElementById("venmo-button-container").innerHTML =
						"<p>Click on Place Order to finish your order. <strong>Order in progress...</strong></p>";
				});
			},
			onCancel: function (data) {
				console.log(data);
				// Show a cancel page, or return to cart
				window.location.href = wc_venmo_pay_object.checkout_url;
			},
			onError: function (err) {
				console.error(err);
				// For example, redirect to a specific error page
				// window.location.href = wc_venmo_pay_object.checkout_url;
			},
		});

		// Check if the Venmo Button is eligible
		document
			.getElementById("venmo-spinner")
			.style.setProperty("display", "none", "important");
		if (
			venmobutton &&
			document.getElementById("venmo-button-container") &&
			venmobutton.isEligible() &&
			!venmostatus
		) {
			// Render the standalone Venmo Button for that funding source
			venmobutton.render("#venmo-button-container");
			venmostatus = true;
		} else if (venmobutton && venmobutton.isEligible()) {
			console.info(`Venmo is already eligible`, venmobutton);
			// venmobutton.render("#venmo-button-container");
			// venmostatus = true;
		} else {
			// render PayPal instead when Venmo is not eligible
			// document.getElementById("venmo-button-container").style.setProperty('display', 'none', 'important');
			// document.getElementById("venmo-container").style.setProperty('display', 'none', 'important');
			console.error(venmobutton);
			throw new Error("Venmo is not eligible for this transaction");
		}
	} catch (error) {
		console.error(error);
		var error_message = typeof error === "object" ? error.message : error;
		wc_venmo_pay_displayMessage(
			`<p>PayPal.js failed to load properly due to <strong>${error_message}</strong>.</p>`
		);
	}
}

function wc_venmo_pay_displayMessage(message) {
	console.error(message);
	document
		.getElementById("venmo-spinner")
		.style.setProperty("display", "none", "important");
	var message_container = document.getElementById("venmo-status-container");
	if (!message_container || !message) return;
	message_container.innerHTML = message;
	message_container.style.display = "block";
}

// jQuery(document).ready(function ($) {
// 	(async function () {
// 		if (
// 			wc_venmo_pay_object.checkout_url.replace(/\/$/, "") ===
// 			wc_venmo_pay_object.checkout_url2.replace(/\/$/, "")
// 		) {
// 			if (
// 				$("li.payment_method_venmo-pay") &&
// 				$("#venmo-button-container") &&
// 				$("#venmo-status-container")
// 			) {
// 				// await loadVenmoPay();
// 				setTimeout(loadVenmoPay, 3000);
// 			} else {
// 				// console.log("payment_method_venmo-pay not found");
// 				setTimeout(arguments.callee, 1000); // call myself again in 1000 msecs
// 			}
// 		}
// 	})();
// });
