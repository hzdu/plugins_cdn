/* global user_registration_email_templates_admin_params */
jQuery(function ($) {
	var UR_Email_Templates_Admin = {
		init: function () {
			this.email_template_inline_title_edit();
			$(document).on(
				"click",
				".user-registration-email-preview ",
				function (e) {
					e.preventDefault();
					UR_Email_Templates_Admin.email_templates_preview_selecter(
						$(this)
					);
				}
			);
		},
		states: {
			isWaitingAjaxResponse: false,
		},
		/**
		 * Opens up a input element when Edit Title is clicked
		 */
		email_template_inline_title_edit: function () {
			var isEditing = false;

			$(document.body).on(
				"click",
				".ur-template-edit-title",
				function (e) {
					e.preventDefault();

					var $this = $(this);
					var titleCell = $(this).closest(".column-title");
					var titleElement = titleCell.find(".ur-edit-title");
					var previousTitle = titleElement.find(".row-title").text();

					titleElement.html(
						'<input class="ur-title-input" value="' +
							previousTitle +
							'"/>'
					);
					titleCell.find(".ur-title-input").trigger("focus");

					titleCell
						.find(".ur-template-edit-title")
						.text(
							user_registration_email_templates_admin_params.user_registration_email_template_title_editing
						);

					var templateID = $this.data("id");
					var titleInput = titleCell.find(".ur-title-input");

					var data = {
						id: templateID,
						action: "user_registration_email_templates_save_title",
						security:
							user_registration_email_templates_admin_params.user_registration_email_template_inline_title_edit_nonce,
					};

					var newTitle = "";

					isEditing = !isEditing;
					if (isEditing) {
						titleInput.on("focusout", function () {
							newTitle = titleInput.val();
							if (newTitle) data["title"] = newTitle;
							UR_Email_Templates_Admin.edit_title_ajax(
								$this,
								titleElement,
								data
							);
						});

						titleInput.on("keypress", function (e) {
							if ("Enter" === e.key) {
								newTitle = titleInput.val();
								data["title"] = newTitle;
								UR_Email_Templates_Admin.edit_title_ajax(
									$this,
									titleElement,
									data
								);
							}
						});
						isEditing = !isEditing;
					} else {
						$this.on("click", function () {
							newTitle = titleInput.val();
							data["title"] = newTitle;
							UR_Email_Templates_Admin.edit_title_ajax(
								$this,
								titleElement,
								data
							);
							isEditing = !isEditing;
						});
					}
				}
			);
		},
		/**
		 * Fires save title ajax event when the edit title input is focused out or enter key is pressed.
		 *
		 * @param {string} selector Selector for ur-template-edit-title.
		 * @param {string} titleSelector Selector for edit title input element.
		 * @param {object} data Data to send in ajax request
		 */
		edit_title_ajax: function (selector, titleSelector, data) {
			if (
				true === UR_Email_Templates_Admin.states.isWaitingAjaxResponse
			) {
				return;
			}

			titleSelector.append(
				user_registration_email_templates_admin_params.user_registration_email_template_title_saving
			);

			UR_Email_Templates_Admin.states.isWaitingAjaxResponse = true;

			$.ajax({
				url: user_registration_email_templates_admin_params.ajax_url,
				data: data,
				type: "POST",
				success: function (response) {
					if (response.success) {
						titleSelector.html(response.data.message);

						selector.text(
							user_registration_email_templates_admin_params.user_registration_email_template_title_edit
						);
					} else {
						console.log(response);
					}

					UR_Email_Templates_Admin.states.isWaitingAjaxResponse = false;
				},
			});
		},
		/**
		 * Fires email template selector while previewing.
		 *
		 * @param {string} node Current element.
		 */
		email_templates_preview_selecter: function (node) {
			var icon = '<i class="dashicons dashicons-visibility"></i>';
			var title =
				icon +
				'<span class="user-registration-swal2-modal__title">' +user_registration_email_templates_admin_params.ur_select_template_title
				"</span>";
			var message = user_registration_email_templates_admin_params.ur_select_email_template_message;
			var preview_url = node.attr("href");

			if (
				user_registration_email_templates_admin_params
					.user_registration_email_templates_list.length === 0
			) {
				window.open(preview_url);
			} else {
				Swal.fire({
					title: title,
					html: message,
					input: "select",
					inputOptions:
						user_registration_email_templates_admin_params.user_registration_email_templates_list,
					customClass:
						"user-registration-swal2-modal user-registration-swal2-modal--centered",
					showCloseButton: true,
					confirmButtonText:user_registration_email_templates_admin_params.ur_template_preview,
				}).then(function (result) {
					if (result.isConfirmed) {
						window.open(
							preview_url + "&ur_email_template=" + result.value
						);
					}
				});
			}
		},
	};
	UR_Email_Templates_Admin.init();
});
