(function ($) {
	"use strict";

	var telInputs = $(wipiMainJsVars.wpiElements).toArray();

	for (var i = 0; i < telInputs.length; i++) {
		let telInput = $(telInputs[i]);

		let options = {
			nationalMode: true,
			utilsScript: wipiMainJsVars.utilsScript
		}

		if (wipiMainJsVars.initialCountry.length > 0) {
			options.initialCountry = wipiMainJsVars.initialCountry;
		} else if (wipiMainJsVars.autoSetIp) {
			options.initialCountry = "auto";

			let requestData = {};
			if (wipiMainJsVars.ipInfoToken.length > 0) {
				requestData = { token: wipiMainJsVars.ipInfoToken };
			}
			options.geoIpLookup = function (success, failure) {
				$.get("https://ipinfo.io/json", requestData, "jsonp").always(function (resp) {
					var countryCode = (resp && resp.country) ? resp.country : "";
					success(countryCode);
				});
			}
		}

		if (wipiMainJsVars.onlySelectedCountries) {
			options.onlyCountries = JSON.parse(wipiMainJsVars.onlyCountries);
		}

		if (wipiMainJsVars.preferredCountries.length > 0) {
			options.preferredCountries = wipiMainJsVars.preferredCountries;
		}

		$(telInput).intlTelInput(options);
	}
})(jQuery);