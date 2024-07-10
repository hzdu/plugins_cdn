(function ($) {
	document.addEventListener("DOMContentLoaded", function () {
		Dropzone.autoDiscover = false;
	});

	/* global  urfu_script_data */
	$(document).on(
		"user_registration_frontend_form_data_render",
		function (event, field, formwise_data) {
			var node_type = field.get(0).tagName.toLowerCase();
			if ("input" === node_type) {
				if (field.hasClass(".urfu-file-input")) {
					if ("undefined" !== field.val()) {
						if (field.val() > 0) {
							formwise_data.value = field.val();
						}
					}
				}
			}
		}
	);
	var tg_uploader = {
		init: function () {
			this.init_event();
		},
		init_event: function () {
			// Function to hide or show the dropzone dz-message section.
			function toggle_dz_message(element, length) {
				if (
					length >=
					element
						.closest(".dropzone")
						.find(".urfu-file-input")
						.data("max-file-limit")
				) {
					element
						.closest(".dropzone")
						.find(".dz-message")
						.addClass("hide");
				} else {
					element
						.closest(".dropzone")
						.find(".dz-message")
						.removeClass("hide");
				}
				var $dz_message =
					urfu_script_data.urfu_max_file_remaining.replace(
						"%qty%",
						element
							.closest(".dropzone")
							.find(".urfu-file-input")
							.data("max-file-limit") - length
					);
				element
					.closest(".dropzone")
					.find(".user-registration-file-upload-hint")
					.text($dz_message);
			}

			// Handle the remove uploaded file event when the remove button is clicked.
			$(document).on("click", ".urfu-remove-file", function () {
				var $node = $(this);
				(attachment_id = $(this).data("attachment-id")),
					(field_name = $(this).data("field-name")),
					(attachment_ids = $(this)
						.closest(".dropzone")
						.find(".urfu-file-input")
						.val()),
					(attachment_ids_array = attachment_ids.split(","));

				if ("undefined" !== typeof attachment_id) {
					for (var i = attachment_ids_array.length - 1; i >= 0; i--) {
						if (attachment_ids_array[i] == attachment_id) {
							if (
								$(this)
									.closest(".dropzone")
									.find(".urfu_removed_files").length <= 0
							) {
								var urfu_removed_files =
									document.createElement("input");
								urfu_removed_files.setAttribute(
									"type",
									"hidden"
								);
								urfu_removed_files.setAttribute(
									"class",
									"urfu_removed_files"
								);
								urfu_removed_files.setAttribute(
									"name",
									"urfu_removed_files_" + field_name
								);
								urfu_removed_files.setAttribute("value", "");
								$(this)
									.closest(".dropzone")
									.find(".urfu-upload-node")
									.append(urfu_removed_files);
							}
							var el_value = $(this)
								.closest(".dropzone")
								.find(".urfu_removed_files")
								.val();
							var urfu_removed_files = new Set(
								!!el_value ? JSON.parse(el_value) : []
							);
							urfu_removed_files.add(attachment_id);
							$(this)
								.closest(".dropzone")
								.find(".urfu_removed_files")
								.val(
									JSON.stringify(
										Array.from(urfu_removed_files)
									)
								);

							attachment_ids_array.splice(i, 1);
						}
					}
					toggle_dz_message($(this), attachment_ids_array.length);
					$(this)
						.closest(".dropzone")
						.find(".urfu-file-input")
						.val(attachment_ids_array.toString());

					var max_files = $(this)
						.closest(".dropzone")
						.find(".urfu-file-input")
						.data("max-file-number");

					$(this).closest(".dropzone")[0].dropzone.options.maxFiles =
						++max_files;
					$(this)
						.closest(".dropzone")
						.find(".urfu-file-input")
						.data("max-file-number", max_files);
				}

				$(this).closest(".dz-preview").remove();
			});

			// Handles each dropzone instance separately in case of multiple file upload fields.
			$(".dropzone").each(function () {
				var $this = $(this);
				var form_id = $this
					.closest(".ur-frontend-form")
					.find("form.register, form.edit-profile")
					.data("form-id");

				// Fix - Form Id not found in Woocommerce checkout.
				if ("undefined" === typeof form_id) {
					form_id = $(".user-registration").data("form-id");
				}

				var unique_identifier = $this.data("id");
				var max_upload_size_selector = $("#" + unique_identifier).data(
					"max-upload-size-limit"
				);
				max_upload_size_selector = parseInt(max_upload_size_selector);
				var max_upload_size =
					"" !== max_upload_size_selector
						? max_upload_size_selector / 1024
						: 0;

				var valid_file_type_selector = $("#" + unique_identifier).data(
					"valid-file-type"
				);
				var valid_file_type =
					"" !== valid_file_type_selector
						? valid_file_type_selector
						: "";

				// Initialize and handles the file upload process in dropzone.
				$this.dropzone({
					url:
						urfu_script_data.ajax_url +
						"?action=user_registration_file_upload_method_upload&security=" +
						urfu_script_data.urfu_upload_nonce +
						"&form_id=" +
						form_id +
						"&field_name=" +
						unique_identifier,
					uploadMultiple: true, // to select multiple files at once.
					parallelUploads: 1,
					paramName: function () {
						return "file[]";
					}, // puts multiple files uploaded at once in an array.
					maxFiles: $("#" + unique_identifier).data(
						"max-file-number"
					),
					maxFilesize: max_upload_size,
					dictFileTooBig:
						urfu_script_data.urfu_file_size_exceeded.replace(
							"%qty%",
							max_upload_size < 1
								? max_upload_size.toFixed(2)
								: max_upload_size
						),
					acceptedFiles: valid_file_type,
					successmultiple: function (file, response) {
						file = Array.isArray(file) ? file[0] : file;
						file.previewElement.classList.add("dz-success");
						file.attachment_id = response; // push the id for future reference
						var upload_files = "";
						var message = "";

						if (
							"undefined" === typeof response.success ||
							"undefined" === typeof response.data
						) {
							throw urfu_script_data.urfu_something_wrong;
						}
						message = response.data.message;

						$(file.previewElement)
							.closest(".urfu-file-upload")
							.find(".user-registration-error")
							.remove();

						renderIcon(file.name, file.previewElement);

						if (!response.success) {
							$(file.previewElement)
								.addClass("dz-error")
								.find(".dz-error-message")
								.text(message);
							$(file.previewElement).append(
								'<a class="dz-remove urfu-remove-file" href="javascript:undefined;" data-dz-remove="">Remove file</a>'
							);
						}

						if (response.success) {
							upload_files = response.data.upload_files;
							$(file.previewElement).append(message);
						}

						var value = $("#" + unique_identifier);

						if (0 == upload_files) {
							var max_files = value.data("max-file-number");

							value.closest(
								".dropzone"
							)[0].dropzone.options.maxFiles = ++max_files;
							value
								.closest(".dropzone")
								.find(".urfu-file-input")
								.data("max-file-number", max_files);
						} else {
							// If only one file is uploaded and if no file was uploaded before save it in the value attribute.
							if ("" === value.val()) {
								value.val(upload_files);
							} else {
								// If multiple files were uploaded before push it to the array and save it in the value attribute.

								var arr = [];

								arr.push(value.val());
								arr.push(upload_files);
								value.val(arr);
							}

							length = value.val().split(",").length;
							toggle_dz_message(value, length);
						}
					},
					/**
					 * Remove missing attachment issue due to form filler on all file upload completion.
					 *
					 * @since 1.2.0
					 */
					queuecomplete: function name(file, resonse) {
						value_array = $("#" + unique_identifier)
							.val()
							.split(",");

						for (var i = value_array.length; i >= 0; i--) {
							if (!$.isNumeric(value_array[i])) {
								value_array.splice(i, 1);
							}
						}
						toggle_dz_message(
							$("#" + unique_identifier),
							value_array.length
						);
						$("#" + unique_identifier).val(value_array);
					},
					error: function (file, response) {
						$(file.previewElement)
							.closest(".urfu-file-upload")
							.find(".user-registration-error")
							.remove();
						$(file.previewElement)
							.addClass("dz-error")
							.find(".dz-error-message")
							.text(response);
						$(file.previewElement).append(
							'<a class="dz-remove urfu-remove-file" href="javascript:undefined;" data-dz-remove="">Remove file</a>'
						);
					},
				});
			});
		},
	};

	$(document).bind(
		"user_registration_frontend_validate_before_form_submit",
		function (e, form) {
			var fields = form.find(".dz-error-message");

			$.each(fields, function () {
				var field = $(this);

				if (field.text() == "") {
					field.removeClass("dz-error-message");
					field.addClass("dz-error-message-custom-class");
				}
			});
		}
	);

	$(document).bind(
		"user_registration_frontend_form_data_filter",
		function (e, form_data) {
			var files = $(".urfu-uploaded-file");
			$uploaded_files = [];
			$.each(files, function () {
				var field_name = $(this).closest(".dropzone").data("id");
				if (typeof $uploaded_files[field_name] === "undefined") {
					$uploaded_files[field_name] = [];
				}
				$uploaded_files[field_name].push($(this).val());
			});

			$.each(form_data, function (key, field) {
				if (typeof $uploaded_files[field.field_name] !== "undefined") {
					field.value = $uploaded_files[field.field_name];
					field.field_type = field.field_type;
					field.label = field.label;
					field.field_name = field.field_name;
					form_data[key] = field;
				}
			});
		}
	);

	$(document).bind(
		"user_registration_frontend_before_edit_profile_submit",
		function (e, data, form) {
			var files = $(".urfu_removed_files");
			$.each(files, function () {
				var field_name = $(this).attr("name");
				data[field_name] = $(this).val();
			});
		}
	);

	$(document).bind(
		"user_registration_frontend_before_form_submit",
		function (e, data, form, message) {
			var fields = form.find(".dz-error-message-custom-class");

			fields.addClass("dz-error-message");
		}
	);

	// Prevent form submit during ajax form submission in edit profile.
	$(document).on("click", ".user-registration-submit-Button", function (e) {
		urPreventFormSubmit(e, $(this).closest(".ur-frontend-form form"));
	});

	// Prevent form submit during normal form submission in edit profile.
	$(document).on("submit", "form.edit-profile", function (e) {
		urPreventFormSubmit(e, $(this).closest(".ur-frontend-form form"));
	});

	// Prevent form submission in case of file upload error.
	function urPreventFormSubmit(event, form) {
		var fields = form.find(".dz-error-message");

		if (fields.length > 0) {
			$.each(fields, function () {
				var field = $(this);

				if (field.text() !== "") {
					$(window).scrollTop(
						field.closest(".dz-preview").offset().top
					);
					event.preventDefault();
				}
			});
		}
	}

	/**
	 * Reinitialize dropzone again after page is fully loaded,
	 * in order to support third party popup plugins like elementor.
	 *
	 * @since 1.2.0
	 */
	$(window).on("load", function () {
		$(".dropzone").each(function () {
			Dropzone.autoDiscover = false;
			var dropzoneControl = $(this)[0].dropzone;
			if (dropzoneControl) {
				dropzoneControl.destroy();
			}
		});

		tg_uploader.init();
	});

	$(document).on(
		"user_registration_frontend_after_ajax_complete",
		function (event, response, status, form) {
			if (status === "message") {
				Dropzone.autoDiscover = false;
				urfu_reset_file_upload_field();
			}
		}
	);

	/**
	 * Trigger to reset the  the file upload field data
	 *
	 */
	$(document).on("user_registration_frontend_reset_button", function (event) {
		urfu_reset_file_upload_field();
	});

	/**
	 * Common function to reset file upload field
	 */
	function urfu_reset_file_upload_field() {
		$(".dropzone").each(function () {
			var $this = $(this);
			// Remove all files in every dropzone container at once.
			Dropzone.forElement("#" + $this.attr("id")).removeAllFiles(true);
			$this.find(".dz-message").show();
			var max_files = $this
				.closest(".dropzone")
				.find(".urfu-file-input")
				.data("max-file-limit");

			var $dz_message = urfu_script_data.urfu_max_file_remaining.replace(
				"%qty%",
				max_files
			);
			$this
				.closest(".dropzone")
				.find(".user-registration-file-upload-hint")
				.text($dz_message);
		});
	}
	// handle file upload when field visibility is enabled
	$(".dropzone").each(function () {
		var $this = $(this);
		var file_upload = $this
			.closest(".dropzone")
			.find(".urfu-file-input")
			.attr("readonly");
		if (file_upload === "readonly") {
			$this
				.closest(".urfu-file-upload")
				.find(".dropzone")
				.find(".dz-preview")
				.find(".urfu-download-file")
				.css("pointer-events", "auto");
			$this.closest(".urfu-file-upload").css("pointer-events", "none");
		}
	});

	// Render File Icons for existing files on Document Load.
	$(".dropzone")
		.find(".dz-image img")
		.each(function () {
			var filename = $(this).attr("alt");
			var previewElement = $(this).closest(".dz-preview");
			renderIcon(filename, previewElement);
		});

	// Show icon for uploaded file according to filetype.
	function renderIcon(filename, element) {
		var ext = filename.split(".").pop();

		var supportedFileTypes = new Array(
			"pdf",
			"doc",
			"xls",
			"ppt",
			"mp3",
			"mp4",
			"zip"
		);
		var newMsFileTypes = new Array("docx", "xlsx", "pptx");
		var imageFileTypes = new Array("jpg", "jpeg", "png", "gif");

		var fileIcon = null;

		if (supportedFileTypes.indexOf(ext) != -1) {
			fileIcon = ext;
		} else if (newMsFileTypes.indexOf(ext) != -1) {
			fileIcon = ext.substr(0, ext.length - 1);
		} else if (imageFileTypes.indexOf(ext) == -1) {
			fileIcon = "default";
		}

		if (fileIcon !== null) {
			$(element)
				.find(".dz-image img")
				.attr(
					"src",
					urfu_script_data.home_url +
						"/images/filetypes/" +
						fileIcon +
						".svg"
				);
		}
	}

	/**
	 * Trigger to fill download link in the file upload field data
	 *
	 */
	$(document).on(
		"user_registration_edit_profile_after_ajax_complete",
		function (event, ajax_response, $form) {
			var response = JSON.parse(ajax_response.responseText);
			if (
				typeof response.success !== "undefined" &&
				response.success === true
			) {
				$form.find(".urfu-uploaded-file").remove();
				if (
					typeof response.data.file_upload_attachments !== "undefined"
				) {
					$.each(
						response.data.file_upload_attachments,
						function ($field_name, value) {
							var dropzone = $(
								"#ur_user_registration_" + $field_name
							);
							dropzone
								.find(".urfu-remove-file")
								.each(function () {
									var remove_file = $(this);
									var $file_name =
										remove_file.data("file-name");
									if (typeof $file_name !== "undefined") {
										$.each(
											value,
											function (attachment_id, value) {
												if (
													value.filename ===
													$file_name
												) {
													remove_file.data(
														"attachment-id",
														attachment_id
													);
													var download_link =
														'<a class="urfu-download-file" href="' +
														value.url +
														'" title="Download" target="_blank"><span class="dashicons dashicons-arrow-down-alt"></span></a>';
													remove_file.before(
														download_link
													);
												}
											}
										);
									}
								});
						}
					);
				}
			}
		}
	);
})(jQuery);
