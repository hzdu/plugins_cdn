(function ($) {
	var UR_MultiPart_Frontend = {
		init: function () {
			UR_MultiPart_Frontend.render_parts();

			// Clear all previews when ajax submission is complete.
			$(document).on(
				"user_registration_frontend_after_ajax_complete",
				function () {
					$(".ur-frontend-form").each(function () {
						if (
							$(this).find(
								".user-registration-form-submission-preview"
							).length > 0
						) {
							$(this)
								.find(
									".user-registration-form-submission-preview"
								)
								.each(function () {
									$(this).remove();
								});
						}
					});
				}
			);

			$(".user-registration-multi-part-nav").on("click", function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();

				var $this = $(this),
					$form = $this.closest(".ur-frontend-form form.register"),
					$indicator = $form.find(
						".user-registration-multi-part-indicator"
					),
					action = $this.attr("data-action"),
					current_part = parseInt(
						$indicator.attr("data-current-part")
					),
					total_part = parseInt($indicator.attr("data-total"));

				$form.find(".ur-multipart-preview-loader").remove();
				$form
					.find(".user-registration-form-submission-preview")
					.remove();
				$form
					.find(".user-registration-form-submission-preview-error")
					.remove();

				if ("next" === action && current_part < total_part) {
					if (
						UR_MultiPart_Frontend.check_form_validation(
							$form,
							current_part
						)
					) {
						$indicator.attr("data-current-part", ++current_part);
					}
				} else if ("prev" === action && 1 < current_part) {
					$indicator.attr("data-current-part", --current_part);
				}

				UR_MultiPart_Frontend.render_indicator();
				UR_MultiPart_Frontend.render_parts();
				UR_MultiPart_Frontend.scroll_top($form);
			});
		},
		entry_preview: function ($form) {
			$form.each(function (index, el) {
				var $this = $(el),
					$indicator = $this.find(
						".user-registration-multi-part-indicator"
					),
					current_part = parseInt(
						$indicator.attr("data-current-part")
					);

				if (
					1 !== current_part &&
					0 === $this.find(".ur-multipart-preview-loader").length &&
					"false" !==
						$(".user-registration-multi-part-previewer").attr(
							"data-part-preview-" + current_part
						)
				) {
					$this
						.find(".user-registration-multi-part-indicator")
						.after(
							'<div class="ur-multipart-preview-loader"><div class="lds-dual-ring"></div></div>'
						);
				}

				// Form Data.
				var data = $this.serializeArray();

				// Ajax Action.
				data.push({
					name: "action",
					value: "user_registration_multipart_form_submission_preview",
				});

				// Nonce.
				data.push({
					name: "security",
					value: user_registration_multi_part_params.user_registration_multipart_form_submission_preview_nonce,
				});

				// Current Part.
				data.push({
					name: "current_part",
					value: current_part,
				});

				$.ajax({
					url: user_registration_multi_part_params.ajax_url,
					type: "POST",
					data: data,
				})
					.done(function (xhr, textStatus, errorThrown) {
						if (
							"success" === xhr.data.response ||
							true === xhr.success
						) {
							// Load html at the begining of current part.
							if (
								0 ===
								$this.has(
									".user-registration-form-submission-preview"
								).length
							) {
								$this
									.find(
										".user-registration-multi-part-indicator"
									)
									.after(xhr.data);
							} else {
								$this
									.find(
										".user-registration-form-submission-preview"
									)
									.remove();
								$this
									.find(
										".user-registration-multi-part-indicator"
									)
									.after(xhr.data);
							}
						} else {
							// Load error html at the begining of current part.
							if (
								0 ===
								$this.has(
									".user-registration-form-submission-preview-error"
								).length
							) {
								$this
									.find(
										".user-registration-multi-part-indicator"
									)
									.after(
										'<div class="user-registration-form-submission-preview-error">' +
											user_registration_multi_part_params.user_registration_multipart_form_submission_preview_error +
											"</div>"
									);
							}
						}
					})
					.fail(function () {
						// Load error html at the begining of current part.
						if (
							0 ===
							$this.has(
								".user-registration-form-submission-preview-error"
							).length
						) {
							$this
								.find(".user-registration-multi-part-indicator")
								.after(
									'<div class="user-registration-form-submission-preview-error">' +
										user_registration_params.error +
										"</div>"
								);
						}
					})
					.always(function () {
						// Remove Preview Loader.
						$this.find(".ur-multipart-preview-loader").remove();
					});
			});
		},
		render_parts: function () {
			var $form = $(".ur-frontend-form form.register");

			$form.each(function (index, el) {
				var $this = $(el),
					$indicator = $this.find(
						".user-registration-multi-part-indicator"
					),
					$btn_container = $this.find(".ur-button-container"),
					$btn_next = $btn_container.find(
						"button.user-registration-multi-part-nav-next"
					),
					$btn_prev = $btn_container.find(
						"button.user-registration-multi-part-nav-prev"
					),
					$btn_submit = $btn_container.find(".ur-submit-button"),
					$btn_reset = $btn_container.find(".ur-reset-button"),
					$recaptcha_node = $this.find("#ur-recaptcha-node"),
					current_part = parseInt(
						$indicator.attr("data-current-part")
					),
					total_part = parseInt($indicator.attr("data-total"));

				if (0 === $indicator.length || 1 === total_part) {
					return;
				}

				// Hide and show part fields.
				$this.find(".user-registration-part").hide();
				$this
					.find(
						".user-registration-part.user-registration-part-" +
							current_part
					)
					.show();

				// Change text of part navigations.
				$btn_next.text(
					$btn_next.attr("data-label-part-" + current_part)
				);
				$btn_prev.text(
					$btn_prev.attr("data-label-part-" + current_part)
				);

				// Hide and show part navigations.
				if (1 == current_part) {
					$btn_next.show();
					$btn_prev.hide();
					$btn_submit.hide();
					$btn_reset.hide();
					$recaptcha_node.hide();
				} else if (current_part === total_part) {
					$btn_next.hide();
					$btn_prev.show();
					$btn_submit.show();
					$btn_reset.show();
					$recaptcha_node.show();
				} else {
					$btn_next.show();
					$btn_prev.show();
					$btn_submit.hide();
					$btn_reset.hide();
					$recaptcha_node.hide();
				}

				UR_MultiPart_Frontend.entry_preview($form);
			});
		},
		render_indicator: function () {
			var $form = $(".ur-frontend-form form.register");

			$form.each(function (index, el) {
				var $this = $(el),
					$indicator = $this.find(
						".user-registration-multi-part-indicator"
					),
					indicator_type = $indicator.attr("data-indicator"),
					current_part = parseInt(
						$indicator.attr("data-current-part")
					),
					total_part = parseInt($indicator.attr("data-total"));

				switch (indicator_type) {
					case "progress":
						var $progress_status = $indicator.find(
								".user-registration-progressbar-status"
							),
							$indicator_title = $progress_status.find(
								".user-registration-multi-part-indicator-title"
							),
							$current_step = $indicator.find(
								".user-registration-multi-part-indicator-steps-current"
							),
							$progress_indicator = $indicator.find(
								".user-registration-multi-part-indicator-progress-wrap > .user-registration-multi-part-indicator-progress"
							),
							progress_width =
								(current_part / total_part) * 100 + "%";

						$indicator_title.text(
							$indicator_title.attr(
								"data-part-title-" + current_part
							)
						);
						$current_step.text(current_part);
						$progress_indicator.css("width", progress_width);
						break;

					case "circle":
					case "arrow":
						var $indicator_list = $indicator.find(
							".user-registration-multi-part--steps-list"
						);

						$indicator_list
							.find(
								"li.user-registration-multi-part-indicator-title"
							)
							.removeClass("active");

						for (var i = 0; i < current_part; i++) {
							$indicator_list
								.find(
									"li.user-registration-multi-part-indicator-title:nth(" +
										i +
										")"
								)
								.addClass("active");
						}
						break;
				}
			});
		},
		scroll_top: function ($form) {
			// Scroll to top.
			var form_top = $form.offset().top,
				page_top = $("html, body").scrollTop(),
				admin_bar_height = 0;

			// Include admin bar height if exists.
			if ($("#wpadminbar").length !== 0) {
				admin_bar_height = $("#wpadminbar").height();
			}

			if (page_top > form_top) {
				$("html, body").animate(
					{
						scrollTop: form_top - admin_bar_height - 30, // Additional height for clear visibility
					},
					500
				);
			}
		},
		check_form_validation: function ($form, part_id) {
			var valid = $form.valid();

			if (valid) {
				// Check password strength.
				if ($form.find(".user-registration-password-strength").length) {
					var current_strength = $form
						.find(".user-registration-password-strength")
						.attr("data-current-strength");
					var min_strength = $form
						.find(".user-registration-password-strength")
						.attr("data-min-strength");

					if (
						parseInt(current_strength, 0) <
						parseInt(min_strength, 0)
					) {
						// Show error message.
						if ("" !== $form.find("#user_pass").val()) {
							var error_msg_dom =
								'<label id="user_pass_error" class="user-registration-error" for="user_pass">' +
								user_registration_params.ursL10n
									.password_strength_error +
								".</label>";

							$form.find("#user_pass_error").remove();
							$form
								.find(".user-registration-password-hint")
								.after(error_msg_dom);
							$form.find("#user_pass").attr("aria-invalid", true);
							$form.find("#user_pass").trigger("focus");
						}
						valid = false;
					}
				}

				if (
					0 <
					$(".user-registration-part-" + part_id).find(
						"[data-field-type='date']"
					).length
				) {
					$.each(
						$(".user-registration-part-" + part_id).find(
							"[data-field-type='date']"
						),
						function () {
							if (
								"" == $(this).val() &&
								"required" == $(this).attr("required")
							) {
								$data_id = $(this).data("id");
								var error_msg_dom =
									'<label id="' +
									$data_id +
									'_error" class="user-registration-error" for="' +
									$data_id +
									'">' +
									user_registration_params.message_required_fields +
									".</label>";

								$(".user-registration-part-" + part_id)
									.find("#" + $data_id + "_error")
									.remove();
								$(".user-registration-part-" + part_id)
									.find("[data-id='" + $data_id + "']")
									.parent()
									.append(error_msg_dom);

								valid = false;
							}
						}
					);
				}
			}

			return valid;
		},
	};

	$(document).ready(function () {
		UR_MultiPart_Frontend.init();
	});

	/**
	 * Reinitialize the form again after page is fully loaded,
	 * in order to support third party popup plugins like elementor.
	 *
	 * @since 1.0.5
	 */
	$(window).on("load", function () {
		UR_MultiPart_Frontend.init();
	});
})(jQuery);
