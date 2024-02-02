(function ($) {
	"use strict";
	
	var telInputs = $(wipiValidationJsVars.wpiElements).toArray();

	for (var i = 0; i < telInputs.length; i++) {

		let telInput = $(telInputs[i]);

		telInput.after(`<span class="int-phone valid-msg hide">${wipiValidationJsVars.successMessage}</span>`);
		telInput.after(`<span class="int-phone error-msg hide">${wipiValidationJsVars.failMessage}</span>`);

		telInput.blur(function () {
			wpisValidateIntPhone(this);
		});

		telInput.keydown(function () {
			wpisHideValidationErrors(this);
		});

		if (telInput.val().length > 0) {
			setTimeout(function () {
				wpisValidateIntPhone(telInput[0]);
			}, 3000);
		}
	}
})(jQuery);

function wpisHideValidationErrors(telInputEl) {
	jQuery(telInputEl).removeClass("error");
	jQuery(telInputEl).parent().parent().find(".error-msg").addClass("hide");
	jQuery(telInputEl).parent().parent().find(".valid-msg").addClass("hide");
}

function wpisValidateIntPhone(telInputEl) {

	let telInput = jQuery(telInputEl);

	let errorMsg = telInput.parent().parent().find(".error-msg");
	let validMsg = telInput.parent().parent().find(".valid-msg");

	wpisHideValidationErrors(telInputEl);

	if (jQuery.trim(telInput.val())) {
		if (telInput.intlTelInput("isValidNumber")) {
			validMsg.removeClass("hide");
			const nationalPhone = telInput.intlTelInput("getNumber");
			telInput.val(nationalPhone);
			// jQuery('.woocommerce #payment #place_order').prop( "disabled", false );
		} else {
			telInput.addClass("error");
			errorMsg.removeClass("hide");
			validMsg.addClass("hide");
			// jQuery('.woocommerce #payment #place_order').prop( "disabled", true );
		}
	}
}