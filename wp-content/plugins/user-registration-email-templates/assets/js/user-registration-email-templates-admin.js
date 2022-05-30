/* global user_registration_email_templates_admin_params */
jQuery(function ($) {
	var UR_Email_Templates_Admin = {
		init: function () {
			this.email_template_inline_title_edit();
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
			titleSelector.append(
				user_registration_email_templates_admin_params.user_registration_email_template_title_saving
			);
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
				},
			});
		},
	};
	UR_Email_Templates_Admin.init();
});
