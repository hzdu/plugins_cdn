/* global  user_registration_params  */
/* global  user_registration_advanced_fields_params  */
jQuery(function ($) {
	// user_registration_params is required to continue, ensure the object exists.

	var user_registration_advanced_fields_init = function () {
		if (typeof user_registration_params === "undefined") {
			return false;
		}

		$(document).on(
			"user_registration_frontend_form_data_render",
			function (event, field, formwise_data) {
				var node_type = field.get(0).tagName.toLowerCase();

				if ("input" === node_type) {
					if (field.hasClass(".uraf-profile-picture-input")) {
						if ("undefined" !== field.val()) {
							if (field.val() > 0) {
								formwise_data.value = field.val();
							}
						}
					}
				}
			}
		);
		var URAF_Frontend = {
			init: function () {
				$(document).ready(URAF_Frontend.ready);

				this.load_validation();
				this.init_event();
			},
			ready: function () {
				URAF_Frontend.loadPhoneField();
			},
			load_validation: function () {
				if (typeof $.fn.validate === "undefined") {
					return false;
				}
			},

			/**
			 * Load phone field.
			 *
			 * @since 1.2.4
			 */
			loadPhoneField: function () {
				var countryCode = "",
					inputOptions = {};

				// Only continue if intlTelInput library exists.
				if (typeof $.fn.intlTelInput === "undefined") {
					return false;
				}

				// Determine the country by IP if storing user details is enabled.
				if ("yes" !== user_registration_params.disable_user_details) {
					inputOptions.geoIpLookup = URAF_Frontend.currentIpToCountry;
				}

				// Try an alternative solution if storing user details is disabled.
				if ("yes" === user_registration_params.disable_user_details) {
					var lang = this.getFirstBrowserLanguage();

					countryCode =
						lang.indexOf("-") > -1 ? lang.split("-").pop() : "";
				}

				// Make sure the library recognizes browser country code to avoid console error.
				if (countryCode) {
					var countryData =
						window.intlTelInputGlobals.getCountryData();

					countryData = countryData.filter(function (country) {
						return country.iso2 === countryCode.toLowerCase();
					});
					countryCode = countryData.length ? countryCode : "";
				}

				// Set default country.
				inputOptions.initialCountry =
					"yes" === user_registration_params.disable_user_details &&
					countryCode
						? countryCode
						: "auto";

				$(".ur-smart-phone-field").each(function (i, el) {
					var $el = $(el);

					// Hidden input allows to include country code into submitted data.
					inputOptions.hiddenInput = $el.data("id");
					inputOptions.utilsScript =
						user_registration_advanced_fields_params.utils_url;

					$el.intlTelInput(inputOptions);

					$el.blur(function () {
						var wrapper = $el.closest("p.form-row");

						if ($el.intlTelInput("isValidNumber")) {
							$el.siblings('input[type="hidden"]').val(
								$el.intlTelInput("getNumber")
							);

							wrapper
								.find("#" + $el.data("id"))
								.attr("aria-invalid", false);
							wrapper
								.find("#" + $el.data("id") + "-error")
								.remove();
						} else {
							if ($el.val() !== "") {
								wrapper
									.find("#" + $el.data("id") + "-error")
									.remove();
								var error_msg_dom =
									'<label id="' +
									$el.data("id") +
									"-error" +
									'" class="user-registration-error" for="' +
									$el.data("id") +
									'">' +
									user_registration_params.message_validate_phone_number +
									"</label>";
								wrapper.append(error_msg_dom);
								wrapper
									.find("#" + $el.data("id"))
									.attr("aria-invalid", true);
							}
						}
					});
				});
			},

			/**
			 * Get user browser preferred language.
			 *
			 * @since 1.2.4
			 *
			 * @returns {String} Language code.
			 */
			getFirstBrowserLanguage: function () {
				var nav = window.navigator,
					browserLanguagePropertyKeys = [
						"language",
						"browserLanguage",
						"systemLanguage",
						"userLanguage",
					],
					i,
					language;

				// Support for HTML 5.1 "navigator.languages".
				if (Array.isArray(nav.languages)) {
					for (i = 0; i < nav.languages.length; i++) {
						language = nav.languages[i];

						if (language && language.length) {
							return language;
						}
					}
				}

				// Support for other well known properties in browsers.
				for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
					language = nav[browserLanguagePropertyKeys[i]];

					if (language && language.length) {
						return language;
					}
				}

				return "";
			},

			/**
			 * Asynchronously fetches country code using current IP
			 * and executes a callback with the relevant country code.
			 *
			 * @since 1.2.4
			 *
			 * @param {Function} callback Executes once the fetch is completed.
			 */
			currentIpToCountry: function (callback) {
				$.get("https://ipapi.co/json").always(function (resp) {
					var countryCode = resp && resp.country ? resp.country : "";
					if (!countryCode) {
						var lang = URAF_Frontend.getFirstBrowserLanguage();
						countryCode =
							lang.indexOf("-") > -1 ? lang.split("-").pop() : "";
					}
					callback(countryCode);
				});
			},
			dataURItoBlob: function (dataURI) {
				// convert base64/URLEncoded data component to raw binary data held in a string
				var byteString;

				if (dataURI.split(",")[0].indexOf("base64") >= 0) {
					byteString = atob(dataURI.split(",")[1]);
				} else {
					byteString = unescape(dataURI.split(",")[1]);
				}

				// separate out the mime component
				var mimeString = dataURI
					.split(",")[0]
					.split(":")[1]
					.split(";")[0];

				// write the bytes of the string to a typed array
				var ia = new Uint8Array(byteString.length);

				for (var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}

				return new Blob([ia], { type: mimeString });
			},

			/**
			 * Sends the file, the user is willing to upload as an ajax request
			 * and receives output in order to process any errors occured during file upload
			 * or to display a preview of the picture on the frontend.
			 *
			 * @since  1.3.0
			 *
			 * @param {Function} $node Executes once the picture upload triggers an event.
			 */
			send_file: function ($node) {
				var url =
					user_registration_advanced_fields_params.ajax_url +
					"?action=uraf_profile_picture_upload_method_upload&security=" +
					user_registration_advanced_fields_params.uraf_profile_picture_upload_nonce;
				var formData = new FormData();

				// Get cropped img data
				var img = $("#crop_container").attr("src");

				if ($node[0].files[0]) {
					formData.append("file", $node[0].files[0]);
				} else {
					// Converts base64/URLEncoded data component to blob using link above and appends to the input type file.
					var blob = URAF_Frontend.dataURItoBlob(img);
					var fileOfBlob = new File([blob], "snapshot.jpg");
					formData.append("file", fileOfBlob);
				}
				// Appends the dimensions of cropped image
				formData.append(
					"cropped_image",
					$(".cropped_image_size").val()
				);

				formData.append(
					"valid_extension",
					$('input[name="profile-pic"]').attr("accept")
				);

				formData.append(
					"max_uploaded_size",
					$('input[name="profile-pic"]').attr("size")
				);

				var upload_node = $node
					.closest(".uraf-profile-picture-upload")
					.find(".wp_uraf_profile_picture_upload");
				var upload_node_value = upload_node.text();
				$.ajax({
					url: url,
					data: formData,
					type: "POST",
					processData: false,
					contentType: false,
					// tell jQuery not to set contentType
					beforeSend: function () {
						upload_node.text(
							user_registration_advanced_fields_params.uraf_profile_picture_uploading
						);
					},
					complete: function (ajax_response) {
						var message = "";
						var attachment_id = 0;
						var profile_pic_url = "";

						$node
							.parent()
							.parent()
							.parent()
							.find(".user-registration-error")
							.remove();
						$node
							.closest(".uraf-profile-picture-upload")
							.find(".uraf-profile-picture-input")
							.val("");

						try {
							var response_obj = JSON.parse(
								ajax_response.responseText
							);

							if (
								"undefined" === typeof response_obj.success ||
								"undefined" === typeof response_obj.data
							) {
								throw user_registration_advanced_fields_params.uraf_profile_picture_something_wrong;
							}
							message = response_obj.data.message;

							if (!response_obj.success) {
								message =
									'<p class="uraf-profile-picture-error user-registration-error">' +
									message +
									"</p>";
							}

							if (response_obj.success) {
								message = "";
								attachment_id = response_obj.data.attachment_id;

								// Gets the profile picture url and displays the picture on frontend
								profile_pic_url =
									response_obj.data.profile_picture_url;
								$(".user-registration-img-container")
									.find(".profile-preview")
									.attr("src", profile_pic_url);
								$node
									.closest(".uraf-profile-picture-upload")
									.find(".profile-preview")
									.attr("src", profile_pic_url);
							}
						} catch (e) {
							message =
								user_registration_advanced_fields_params.uraf_profile_picture_something_wrong;
						}

						// Shows the remove button and hides the upload and take snapshot buttons after successfull picture upload
						$node
							.closest(".uraf-profile-picture-upload")
							.find(".uraf-profile-picture-remove")
							.removeAttr("style");
						$node
							.closest(".uraf-profile-picture-upload")
							.find(".wp_uraf_take_snapshot ")
							.attr("style", "display:none");
						$node
							.closest(".uraf-profile-picture-upload")
							.find(".wp_uraf_profile_picture_upload ")
							.attr("style", "display:none");

						// Finds and removes any prevaling errors and appends new errors occured during picture upload
						$node
							.closest(".uraf-profile-picture-upload")
							.find(".uraf-profile-picture-error")
							.remove();
						$node
							.closest(".uraf-profile-picture-upload")
							.find(".uraf-profile-picture-file-error")
							.remove();
						$node
							.closest(".uraf-profile-picture-upload")
							.append(
								'<span class="uraf-profile-picture-file-error">' +
									message +
									"</span>"
							);

						if (attachment_id > 0) {
							$node
								.closest(".uraf-profile-picture-upload")
								.find(".uraf-profile-picture-input")
								.val(profile_pic_url);
						}
						upload_node.text(upload_node_value);
					},
				});
			},

			/**
			 * Utilizes Jcrop library to provide a space for cropping the picture
			 * and determining exact dimensions of cropped picture.
			 *
			 * @since  1.3.0
			 *
			 */
			crop_image: function (file_instance) {
				var size;
				$("#crop_container").Jcrop({
					aspectRatio: 1,
					onSelect: function (c) {
						size = { x: c.x, y: c.y, w: c.w, h: c.h };
					},
					setSelect: [100, 100, 50, 50],
				});

				$(".swal2-confirm").on("click", function () {
					var cropped_image_size = {
						x: size.x,
						y: size.y,
						w: size.w,
						h: size.h,
						holder_width: $("#crop_container").css("width"),
						holder_height: $("#crop_container").css("height"),
					};
					$(".cropped_image_size").val(
						JSON.stringify(cropped_image_size)
					);
					URAF_Frontend.send_file(file_instance);
				});
			},
			init_event: function () {
				URAF_Frontend.handle_profile_picture_upload();
				URAF_Frontend.handle_range_field();
			},
			handle_profile_picture_upload: function () {
				$("body").on(
					"change",
					'.uraf-profile-picture-upload-node input[type="file"]',
					function () {
						if (this.files && this.files[0]) {
							var reader = new FileReader();

							reader.onload = function (e) {
								$(".img").attr("src", e.target.result);
							};

							reader.readAsDataURL(this.files[0]);
							var message_body =
								'<img id="crop_container" src="#" alt="your image" class="img"/><input type="hidden" name="cropped_image" class="cropped_image_size"/>';

							Swal.fire({
								title: user_registration_advanced_fields_params.uraf_profile_picture_crop_picture_title,
								html: message_body,
								confirmButtonText:
									user_registration_advanced_fields_params.uraf_profile_picture_crop_picture_button,
								allowOutsideClick: false,
								showCancelButton: true,
								cancelButtonText:
									user_registration_advanced_fields_params.uraf_profile_picture_cancel_button,
								customClass: {
									container:
										"user-registration-swal2-container",
								},
							});

							$(".swal2-cancel ").on("click", function () {
								$(".uraf-profile-picture-upload")
									.find("#ur-profile-pic")
									.val("");
							});
							URAF_Frontend.crop_image($(this));
						}
					}
				);

				$(document).on(
					"click",
					".wp_uraf_profile_picture_upload",
					function () {
						$(this)
							.closest(".uraf-profile-picture-upload")
							.find('input[type="file"]')
							.trigger("click");
					}
				);

				$(document).on("click", ".wp_uraf_take_snapshot", function () {
					var message_body = '<div id="my_camera"></div>';
					var $this = $(this);
					Swal.fire({
						title: user_registration_advanced_fields_params.uraf_profile_picture_capture,
						html: message_body,
						confirmButtonText:
							user_registration_advanced_fields_params.uraf_profile_picture_capture,
						allowOutsideClick: false,
						showCancelButton: true,
						cancelButtonText:
							user_registration_advanced_fields_params.uraf_profile_picture_cancel_button,
						customClass: {
							container: "user-registration-swal2-container",
						},
					});

					// Standard image frame size for bigger screen devices
					var width = 320;
					var height = 240;

					// Check if screen size is of smaller screen devices and change height and width.
					if ($(window).width() < $(window).height()) {
						// Standard image frame size for smaller screen devices
						width = 240;
						height = 320;
					}

					/**
					 * Utilizes Webcam js library to provide a container for taking snapshot
					 *
					 * @since  1.3.0
					 *
					 */
					Webcam.set({
						width: width,
						height: height,
						dest_width: width,
						dest_height: height,
						crop_width: width,
						crop_height: height,
						image_format: "jpeg",
						jpeg_quality: 90,
					});

					var error_exist = false;
					Webcam.on("error", function (err) {
						var title = "",
							error_msg = "";

						if ("WebcamError" === err.name) {
							title =
								user_registration_advanced_fields_params.uraf_profile_picture_ssl_error_title;
							error_msg =
								user_registration_advanced_fields_params.uraf_profile_picture_ssl_error_text;
						} else {
							title =
								user_registration_advanced_fields_params.uraf_profile_picture_permission_error_title;
							error_msg =
								user_registration_advanced_fields_params.uraf_profile_picture_permission_error_text;
						}

						error_exist = true;
						swal.fire({
							icon: "warning",
							title: title,
							html: error_msg,
							showConfirmButton: false,
							showCancelButton: true,
							cancelButtonText:
								user_registration_advanced_fields_params.uraf_profile_picture_cancel_button_confirmation,
							cancelButtonColor: "#236bb0",
							customClass: {
								container: "user-registration-swal2-container",
							},
						});
					});

					if (!error_exist) {
						Webcam.attach("#my_camera");

						$(".swal2-confirm").on("click", function () {
							// take snapshot and get image data
							Webcam.snap(function (data_uri) {
								// display results in page
								var messages =
									'<img id="crop_container" src="#" alt="your image" class="img"/><input type="hidden" name="cropped_image" class="cropped_image_size"/>';

								Swal.fire({
									title: user_registration_advanced_fields_params.uraf_profile_picture_crop_picture_title,
									html: messages,
									confirmButtonText:
										user_registration_advanced_fields_params.uraf_profile_picture_crop_picture_button,
									allowOutsideClick: false,
									showCancelButton: true,
									cancelButtonText:
										user_registration_advanced_fields_params.uraf_profile_picture_cancel_button,
									customClass: {
										container:
											"user-registration-swal2-container",
									},
								});
								$("#crop_container").attr("src", data_uri);
								URAF_Frontend.crop_image(
									$this
										.closest(".uraf-profile-picture-upload")
										.find(
											'.uraf-profile-picture-upload-node input[type="file"]'
										)
								);
							});
							Webcam.reset();
						});

						$(".swal2-cancel").on("click", function () {
							Webcam.reset();
						});
					}
				});

				$(document).on(
					"click",
					".uraf-profile-picture-remove",
					function () {
						$(this)
							.closest(".uraf-profile-picture-upload")
							.find("#ur-profile-pic")
							.val("");
						$(this)
							.closest(".uraf-profile-picture-upload")
							.find(".uraf-profile-picture-input")
							.val("");
						$(this)
							.closest(".uraf-profile-picture-upload")
							.find(".uraf-profile-picture-file-error")
							.remove();
						$(".profile-preview").attr(
							"src",
							"https://secure.gravatar.com/avatar/?s=96&d=mm&r=g"
						);
						$(this)
							.closest(".uraf-profile-picture-upload")
							.find(".uraf-profile-picture-remove")
							.attr("style", "display:none");
						$(this)
							.closest(".uraf-profile-picture-upload")
							.find(".wp_uraf_take_snapshot ")
							.removeAttr("style");
						$(this)
							.closest(".uraf-profile-picture-upload")
							.find(".wp_uraf_profile_picture_upload ")
							.removeAttr("style");
						$(this)
							.closest(".uraf-profile-picture-upload")
							.find('input[type="file"]')
							.off("click");
					}
				);
			},
			/**
			 * Handle change in range field slider and inputs.
			 *
			 * @since 1.4.0
			 */
			handle_range_field: function () {
				$(".ur-range-slider").each(function () {
					var ur_range_slider = $(this),
						ur_range_input = $(this)
							.closest(".ur-range-row")
							.find(".ur-range-input"),
						ur_range_reset = $(this)
							.closest(".ur-range-row")
							.find(".ur-range-slider-reset-icon"),
						default_range_value = ur_range_slider.val();
					ur_range_input.val(default_range_value);

					// Handle range input when slider is slided.
					ur_range_slider.on("change", function () {
						var range_val = $(this).val();
						ur_range_input.val(range_val);
						URAF_Frontend.render_range_bubble($(this));
					});

					// Handle range slider position when slider is slided.
					ur_range_input.on("change", function () {
						ur_range_slider.val($(this).val());
						URAF_Frontend.render_range_bubble(ur_range_slider);
					});

					// Handle range input and range slider position when reset button is clicked.
					ur_range_reset.on("click", function () {
						ur_range_slider.val(default_range_value);
						ur_range_input.val(default_range_value);
						URAF_Frontend.render_range_bubble(ur_range_slider);
					});
					//handle range input field when field visibility is enabled
					if (ur_range_slider.attr("readonly") === "readonly") {
						$(".ur-range-number").remove();
					}
				});
			},
			/**
			 * Display bubble when range field value is changed on the slider.
			 *
			 * @since 1.4.0
			 */
			render_range_bubble: function (this_node) {
				var max = this_node.attr("max"),
					min = this_node.attr("min"),
					range = max - min,
					point = (this_node.val() - min) / range,
					width = this_node.width(),
					offset = -1,
					bubblePosition;

				// Prevent bubble from going beyond left or right (unsupported browsers)
				if (point < 0) {
					bubblePosition = 0;
				} else if (point > 1) {
					bubblePosition = width;
				} else {
					bubblePosition = width * point + offset;
					offset -= point;
				}

				// Move bubble
				this_node
					.next("output")
					.css({
						left: bubblePosition,
						marginLeft: offset + "%",
					})
					.text(this_node.val())
					.show()
					// Fake a change to position bubble at page load
					.trigger("change");
			},
		};
		URAF_Frontend.init(jQuery);

		jQuery(document).ready(function () {
			jQuery(".input-timepicker").each(function () {
				var $this = $(this);
				var timeInterval = $this.data("time-interval");
				var timeMin = $this.data("time-min");
				var timeMax = $this.data("time-max");

				var currentTime = $this.data("current-time");

				if (typeof timeInterval === "undefined") {
					timeInterval = 30;
				}

				$this.timepicker({
					disableTextInput: true,
					step: timeInterval,
					minTime: timeMin,
					maxTime: timeMax,
				});

				//Set the current time
				if (currentTime == "yes") {
					$this.timepicker("setTime", new Date());
				}
			});

			// Check if the form is edit-profile form.
			if (
				$(".ur-frontend-form")
					.find("form.edit-profile")
					.hasClass("user-registration-EditProfileForm")
			) {
				$(".ur-smart-phone-field").each(function (i, el) {
					var $el = $(el),
						phone_number = $el.val();

					$el.siblings('input[type="hidden"]').val(phone_number);
				});
			}

			jQuery(
				".ur-field-item.field-select2 select, .ur-field-item.field-multi_select2 select, select.ur-field-profile-select2"
			).selectWoo();

			/**
			 * This block of code is for the "MultiSelect2" Field
			 *
			 * Doc: https://select2.org/
			 * Ref: https://jsfiddle.net/beaver71/tjvjytp3/
			 */
			$.fn.select2.amd.define(
				"select2/selectAllAdapter",
				[
					"select2/utils",
					"select2/dropdown",
					"select2/dropdown/attachBody",
				],

				/**
				 * Create SelectAll Adapter for Select All/Uselect All button
				 */

				function (Utils, Dropdown, AttachBody) {
					function SelectAll() {}
					SelectAll.prototype.render = function (decorated) {
						var self = this,
							$rendered = decorated.call(this);
						$selectAll = $(
							'<a class="button-check-all" >Select All</a>'
						);
						$unselectAll = $(
							'<a class="button-check-all">Unselect All</a>'
						);
						$btnContainer = $("<div>")
							.append($selectAll)
							.append($unselectAll);
						$rendered
							.find(".select2-dropdown")
							.prepend($btnContainer);
						$selectAll.on("click", function (e) {
							var $options = self.$element.find("option");

							var values = [];

							$options.each(function () {
								values.push($(this).val());
							});
							self.$element.val(values);
							self.$element.trigger("change");
							self.trigger("close");
						});
						$unselectAll.on("click", function (e) {
							self.$element.val([]);
							self.$element.trigger("change");
							self.trigger("close");
						});
						return $rendered;
					};
					return Utils.Decorate(
						Utils.Decorate(Dropdown, AttachBody),
						SelectAll
					);
				}
			);

			$("select[data-check-all=yes]").select2({
				placeholder: "",
				dropdownAdapter: $.fn.select2.amd.require(
					"select2/selectAllAdapter"
				),
			});
		});

		$(document).on(
			"user_registration_frontend_after_ajax_complete",
			function (event, response, status, form) {
				if (status === "message") {
					form.find("#ur-profile-pic").val("");
					form.find(".uraf-profile-picture-file-error").remove();
					$(".profile-preview").attr(
						"src",
						"https://secure.gravatar.com/avatar/?s=96&d=mm&r=g"
					);
					form.find(".uraf-profile-picture-remove").attr(
						"style",
						"display:none"
					);
					form.find(".wp_uraf_take_snapshot ").removeAttr("style");
					form.find(".wp_uraf_profile_picture_upload ").removeAttr(
						"style"
					);
					form.find('input[type="file"]').off("click");
				}
			}
		);
	};

	user_registration_advanced_fields_init(jQuery);

	/**
	 * Elementor loads popup with ajax which is run when the page is fully loaded.
	 * So re-initialize the advanced fields after elementor popup is fully loaded.
	 *
	 * @since 1.4.1
	 */
	$(document).on("elementor/popup/show", function () {
		$(document).off("click", ".wp_uraf_profile_picture_upload");
		user_registration_advanced_fields_init(jQuery);
	});

	// handle WYSIWYG when field visibility readonly enabled
	$(".field-wysiwyg").each(function () {
		var uraf_wysiwyg = $(this);
		var readonly = uraf_wysiwyg.find("input").attr("readonly");
		if (readonly === "readonly") {
			uraf_wysiwyg.find(".wp-core-ui").css("pointer-events", "none");
		}
	});
});
