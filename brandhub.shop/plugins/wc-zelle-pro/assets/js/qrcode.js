// wc_zelle_qrcode // wp_localize_script object
console.debug("wc_zelle_qrcode", wc_zelle_qrcode);

jQuery(document).ready(function ($) {
	QRCodeGenerator($("#wc_zelle_qrcode"), wc_zelle_qrcode);
	$("body").on("updated_checkout", function () {
		QRCodeGenerator($("#wc_zelle_qrcode"), wc_zelle_qrcode);
	});
});
