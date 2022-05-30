/**
 * UserRegistrationEmailTemplateSetup JS
 * global user_registration_email_templates_setup_script_data
 */

jQuery(function ($) {
	var UR_Email_Templates_setup = {
		init: function () {
			this.email_template_setup();
		},
		/**
		 * Opens up a sweetalert popup to get template title from user and performs an ajax call to create a template.
		 *
		 * @since  1.0.0
		 *
		 */
		email_template_setup: function () {
			$(document).ready(function () {
				$(".ur-email-template-select").each(function () {
					// Open up sweetalert popup when add template button is clicked
					$(this).on("click", function (event) {
						var $this = $(this),
							template = $this.data("template"),
							templateName = $this.data("template-name-raw");

						event.preventDefault();

						Swal.fire({
							customClass:
								"user-registration-swal2-modal user-registration-swal2-modal--center",
							title: user_registration_email_templates_setup_script_data.user_registration_add_email_template_title,
							confirmButtonText:
								user_registration_email_templates_setup_script_data.user_registration_add_email_template_confirm_text,
							allowOutsideClick: false,
							showCancelButton: true,
							cancelButtonText:
								user_registration_email_templates_setup_script_data.user_registration_add_email_template_cancel_text,
							input: "text",
							inputAttributes: {
								autocapitalize: "off",
							},
							inputPlaceholder:
								user_registration_email_templates_setup_script_data.user_registration_add_email_template_placeholder,
						}).then(function (result) {
							if (result.value) {
								var template_name = result.value;
								$(".user-registration-template-setup").prepend(
									'<div class="user-registration-overlay is-fixed"><span class="ur-spinner"></span></div>'
								);

								UR_Email_Templates_setup.add_email_template_handler(
									template,
									template_name
								);
							} else if ("" === result.value) {
								Swal.fire({
									icon: "error",
									title: user_registration_email_templates_setup_script_data.user_registration_empty_email_template_title_text,
									text: user_registration_email_templates_setup_script_data.user_registration_empty_email_template_title_message,
								});
							}
						});
					});
				});
			});
		},
		/**
		 * Ajax call to create a email template.
		 *
		 * @param {string} template Template slug to identify and pull template styles.
		 * @param {string} template_name Title for the email template.
		 */
		add_email_template_handler: function (template, template_name) {
			var data = {
				title: template_name,
				action: "user_registration_email_templates_create_template",
				template: template,
				security:
					user_registration_email_templates_setup_script_data.create_email_template_nonce,
			};

			$.ajax({
				url: user_registration_email_templates_setup_script_data.ajax_url,
				data: data,
				type: "POST",
				success: function (response) {
					if (response.success) {
						window.location.href = response.data.redirect;
					} else {
						overlay.hide();
						$(".user-registration-email-template-name")
							.addClass("user-registration-required")
							.focus();
						window.console.log(response);
					}
				},
			});
		},
	};
	UR_Email_Templates_setup.init();
});
