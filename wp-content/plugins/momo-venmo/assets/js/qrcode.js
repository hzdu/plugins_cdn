// wc_venmo_qrcode // wp_localize_script object
console.log("wc_venmo_qrcode", wc_venmo_qrcode);

jQuery(document).ready(function ($) {
	QRCodeGenerator($("#wc_venmo_qrcode"), wc_venmo_qrcode);
	$("body").on("updated_checkout", function () {
		QRCodeGenerator(
			$("#wc_venmo_qrcode"),
			wc_venmo_qrcode
		);
	});
});