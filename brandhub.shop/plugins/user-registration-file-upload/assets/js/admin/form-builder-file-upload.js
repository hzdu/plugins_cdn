(function ($) {
	/* global  form_builder_file_upload_script_data */

	$(document).ready(function () {
		$(".ur-selected-item").each(function () {
			if ("file" === $(this).find(".ur-field").data("field-key")) {
				var count = $(this)
						.find(
							".ur-general-setting-maximum-number-limit-on-uploads .ur-general-setting-field"
						)
						.val(),
					msg =
						form_builder_file_upload_script_data.urfu_max_file_remaining.replace(
							"%qty%",
							count
						);

				$(this)
					.find(".ur-field .user-registration-file-upload-hint")
					.text(msg);
			}
		});

		$(document.body).on(
			"input",
			".ur-general-setting-maximum-number-limit-on-uploads .ur-general-setting-field",
			function () {
				var msg =
					form_builder_file_upload_script_data.urfu_max_file_remaining.replace(
						"%qty%",
						$(this).val()
					);

				$(
					".ur-selected-item.ur-item-active .ur-field .user-registration-file-upload-hint"
				).text(msg);
			}
		);
	});
})(jQuery);
