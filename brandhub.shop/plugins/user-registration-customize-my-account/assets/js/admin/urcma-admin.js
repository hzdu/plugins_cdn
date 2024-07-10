jQuery(document).ready(function ($) {
	"use strict";

	var endpoints_container = $(".urcma-endpoints-options-wrapper");

	/*******************************
	 *  Initialize tinyMCE editor
	 *******************************/

	function init_tinyMCE(id) {
		// get tinymce options
		var mceInit = tinyMCEPreInit.mceInit,
			mceKey = Object.keys(mceInit)[0],
			mce = mceInit[mceKey],
			// get quicktags options
			qtInit = tinyMCEPreInit.qtInit,
			qtKey = Object.keys(qtInit)[0],
			qt = mceInit[qtKey];

		// change id
		mce.selector = id;
		mce.body_class = mce.body_class.replace(mceKey, id);
		qt.id = id;

		tinyMCE.init(mce);
		tinyMCE.execCommand("mceRemoveEditor", true, id);
		tinyMCE.execCommand("mceAddEditor", true, id);

		quicktags(qt);
		QTags._buttonsInit();
	}

	/*******************************
	 *  Sort and save endpoints
	 *******************************/

	if (typeof $.fn.sortable != "undefined") {
		$(".urcma-endpoint-tabs").sortable({
			containment: ".urcma-endpoint-tabs",
			tolerance: "pointer",
			revert: "invalid",
			forceHelperSize: true,
		});
	}

	$("form#mainform").on("submit", function (ev) {
		if (typeof $.fn.sortable == "undefined") {
			return;
		}

		var v = [];
		$(".urcma-endpoint-selector").each(function (i) {
			var j = { type: $(this).data("type"), id: $(this).attr("id") };
			v.push(j);
		});

		var newOrder = JSON.stringify(v);
		$("input.endpoints-order").val(newOrder);
	});

	endpoints_container.on("change", function (ev, elem) {
		if (typeof elem != "undefined") {
			init_tinyMCE(elem.find("textarea").attr("id"));
		}
	});

	/*******************
	 *  Add Endpoints
	 *********************/

	$(document).on("click", ".add_new_field", function (event) {
		event.stopPropagation();
		var icon = '<i class="dashicons dashicons-plus-alt"></i>',
			label = urcma_params.add_new_tab_title.replace("%str%", " "),
			title =
				icon +
				'<span class="user-registration-swal2-modal__title">' +
				label +
				"</span>";

		Swal.fire({
			customClass:
				"user-registration-swal2-modal user-registration-swal2-modal--center",
			title: title,
			text: urcma_params.select_field_type_description,
			input: "select",
			inputOptions: {
				endpoint: "Endpoint",
				link: "Link",
			},
			inputPlaceholder: urcma_params.select_field_type_placeholder,
			showCloseButton: false,
			showCancelButton: true,
			cancelButtonColor: "#DD6B55",
			allowOutsideClick: false,
			inputValidator: (value) => {
				if (!value) {
					return urcma_params.select_field_validation_message;
				}
			},
		}).then(function (result) {
			if (result.value) {
				var type = result.value,
					label = urcma_params.add_new_tab_title.replace(
						"%str%",
						type
					),
					field_title =
						icon +
						'<span class="user-registration-swal2-modal__title">' +
						label +
						"</span>";

				Swal.fire({
					customClass:
						"user-registration-swal2-modal user-registration-swal2-modal--center",
					title: field_title,
					text: urcma_params.field_title_description.replace(
						"%str%",
						type
					),
					input: "text",
					inputAttributes: {
						autocapitalize: "off",
					},
					inputValidator: (value) => {
						if (!value) {
							return urcma_params.field_title_validation_message.replace(
								"%str%",
								type
							);
						}
					},
					showCloseButton: false,
					showCancelButton: true,
					cancelButtonColor: "#DD6B55",
					allowOutsideClick: false,
				}).then(function (response) {
					if (response.value) {
						var title = response.value;
						$(this).add_new_field_handler(type, title);
					}
				});
			}
		});
	});

	$.fn.add_new_field_handler = function (type, title) {
		var t = $(this);

		$.ajax({
			url: urcma_params.ajaxurl,
			data: {
				target: type,
				field_name: title,
				action: urcma_params.action_add,
			},
			dataType: "json",
			beforeSend: function () {},
			success: function (res) {
				t.find(".loader").hide();

				// check for error or if field already exists
				if (
					res.error ||
					endpoints_container.find('[data-id="' + res.field + '"]')
						.length
				) {
					Swal.fire({
						customClass:
							"user-registration-swal2-modal user-registration-swal2-modal--center",
						icon: "error",
						title: "Oops...",
						text: res.error,
					});
					return;
				} else {
					Swal.fire({
						customClass:
							"user-registration-swal2-modal user-registration-swal2-modal--center",
						icon: "success",
						html:
							title.toUpperCase() +
							" " +
							urcma_params.add_endpoint_success_message.replace(
								"%str%",
								type
							),
					}).then(function (result) {
						$(".button-primary").trigger("click");
					});
				}

				var new_content = $(res.html);
				var fields_panel = $(".urcma-endpoints-options-wrapper");
				$(
					".urcma-endpoint-tabs > .urcma-endpoint-selector"
				).removeClass("active");
				fields_panel
					.find(".urcma-endpoint-content")
					.attr("style", "display:none;");
				var drag_label =
					'<div class="ur-sidebar-nav-tab urcma-endpoint-selector ui-sortable-handle active" id="' +
					res.field +
					'" data-id="' +
					res.endpoint_label +
					'" data-type="' +
					res.type +
					'">\n' +
					res.endpoint_label +
					"</div>";
				$(".urcma-endpoint-tabs > .urcma-endpoint-selector")
					.last()
					.after(drag_label);
				$(".urcma-endpoints-options-wrapper .urcma-endpoint-content")
					.last()
					.after(new_content);

				var new_item_id = res.field;
				fields_panel
					.find(".urcma-endpoint-content .urcma-endpoint-header")
					.attr("style", "display:none;");
				fields_panel
					.find("#" + new_item_id)
					.find(".urcma-endpoint-header")
					.removeAttr("style");
				fields_panel
					.find("#" + new_item_id)
					.find(".urcma-endpoint-options")
					.removeAttr("style");

				// reinit select
				applySelect2(new_content.find("select"));
				init_tinyMCE(new_content.find("textarea").attr("id"));
			},
		});
	};

	/**********************
	 *  Remove Endpoints
	 **********************/

	$(document).on("click", ".remove-trigger", function () {
		var t = $(this),
			endpoint = t.data("endpoint"),
			remove_endpoint = $("input.endpoint-to-remove");

		if (typeof endpoint == "undefined" || !remove_endpoint.length) {
			return false;
		}

		//Using sweetalert popup to show endpoint deletion warning.
		Swal.fire({
			icon: "warning",
			customClass:
				"user-registration-swal2-modal user-registration-swal2-modal--center",
			text: urcma_params.remove_alert,
			showCloseButton: true,
			confirmButtonText: "OK",
		}).then(function (response) {
			if (true == response.value) {
				var val_remove_endpoint = remove_endpoint.val(),
					remove_endpoint_array = val_remove_endpoint.length
						? val_remove_endpoint.split(",")
						: [];
				remove_endpoint_array.push(endpoint);
				// first set value
				remove_endpoint.val(remove_endpoint_array.join(","));

				// then remove field
				$("#" + endpoint).remove();
				$(".urcma-endpoints-wrapper")
					.find("#" + endpoint)
					.remove();
				var fields_panel = $(".urcma-endpoints-options-wrapper");
				var first_item = $(".urcma-endpoint-selector:first");
				first_item.addClass("active");
				var first_item_id = first_item.attr("id");
				fields_panel
					.find(".urcma-endpoint-content .urcma-endpoint-header")
					.attr("style", "display:none;");
				fields_panel.find("#" + first_item_id).removeAttr("style");
				fields_panel
					.find("#" + first_item_id)
					.find(".urcma-endpoint-header")
					.removeAttr("style");
				fields_panel
					.find("#" + first_item_id)
					.find(".urcma-endpoint-options")
					.removeAttr("style");
			} else {
				return false;
			}
		});
	});

	/********************************************
	 *  Append form settings to fields section.
	 ********************************************/

	$(document).ready(function () {
		var fields_panel = $(".urcma-endpoints-options-wrapper");
		var form_settings_section = $(".urcma-endpoints-list nav");

		var first_item = $(".urcma-endpoint-selector:first");
		first_item.addClass("active");
		var first_item_id = first_item.attr("id");
		fields_panel
			.find(".urcma-endpoint-content .urcma-endpoint-header")
			.attr("style", "display:none;");
		fields_panel
			.find("#" + first_item_id)
			.find(".urcma-endpoint-header")
			.removeAttr("style");
		fields_panel
			.find("#" + first_item_id)
			.find(".urcma-endpoint-options")
			.removeAttr("style");

		form_settings_section
			.find(".urcma-endpoint-selector")
			.on("click", function () {
				var this_id = $(this).attr("id");

				// Remove all active classes initially.
				$(this).siblings().removeClass("active");

				// Add active class on clicked tab.
				$(this).addClass("active");

				// Hide other settings and show respective id's settings.
				fields_panel
					.find(".urcma-endpoint-content")
					.attr("style", "display:none;");
				fields_panel.find("#" + this_id).removeAttr("style");
				fields_panel
					.find(".urcma-endpoint-content .urcma-endpoint-header")
					.removeAttr("style");
				fields_panel
					.find("#" + this_id)
					.find(".urcma-endpoint-options")
					.removeAttr("style");
			});
	});

	/****************************
	 *  Hide or show endpoint
	 ****************************/

	var onoff_field = function (trigger, elem) {
		var item = elem.closest(".urcma-endpoint-content"),
			all_check = item.find(".hide-show-check"),
			check = trigger == "checkbox" ? elem : all_check.first(),
			// set checkbox status
			checked =
				(check.is(":checked") && trigger == "checkbox") ||
				(!check.is(":checked") && trigger == "link")
					? true
					: false;

		if (true === checked) {
			all_check.prop("checked", checked);
			all_check
				.closest(".urcma-endpoint-header-option")
				.find(".user-registration-switch__control")
				.addClass("enabled");
			all_check
				.closest(".urcma-endpoint-header-option")
				.find("label")
				.html(urcma_params.enable_endpoint);
		} else {
			all_check.removeAttr("checked", checked);
			all_check
				.closest(".urcma-endpoint-header-option")
				.find(".user-registration-switch__control")
				.removeClass("enabled");
			all_check
				.closest(".urcma-endpoint-header-option")
				.find("label")
				.html(urcma_params.disable_endpoint);
		}
	};

	/**********************************
	 *  Event listener for hide/show
	 **********************************/

	$(document).on("change", ".hide-show-check", function () {
		onoff_field("checkbox", $(this));
	});

	/********************************
	 * Enable same slug validation
	 ********************************/

	$(document).on("change keyup", ".urcma_slug_input", function () {
		var current_ele = $(this);

		$(".urcma-endpoint-options")
			.find(".urcma_slug_input")
			.each(function (i, elem) {
				var $elem = $(elem);

				if (!$elem.is(current_ele)) {
					if ($.trim($elem.val()) === $.trim(current_ele.val())) {
						Swal.fire({
							customClass:
								"user-registration-swal2-modal user-registration-swal2-modal--center",
							icon: "error",
							title: "Oops...",
							text: urcma_params.same_slug_error_message,
						});
						$(".swal2-confirm").on("click", function () {
							$(".submit")
								.find(".button-primary")
								.attr("disabled", "disabled");
						});
					}
					return;
				}
			});

		$(".submit").find(".button-primary").removeAttr("disabled");
	});

	/********************************
	 * Enable same label validation
	 ********************************/

	$(document).on("change keyup", ".urcma_label_input", function () {
		var current_ele = $(this);

		$(".urcma-endpoint-options")
			.find(".urcma_label_input")
			.each(function (i, elem) {
				var $elem = $(elem);

				if (!$elem.is(current_ele)) {
					if ($.trim($elem.val()) === $.trim(current_ele.val())) {
						Swal.fire({
							customClass:
								"user-registration-swal2-modal user-registration-swal2-modal--center",
							icon: "error",
							title: "Oops...",
							text: urcma_params.same_label_error_message,
						});
						$(".swal2-confirm").on("click", function () {
							$(".submit")
								.find(".button-primary")
								.attr("disabled", "disabled");
						});
						return;
					}
				}
			});

		$(".submit").find(".button-primary").removeAttr("disabled");
	});

	/********************************************
	 * Dynamically chaneg options for link type
	 *******************************************/
	$(document)
		.find(".urcma_link_endpoint_type")
		.each(function () {
			urcma_handle_link_type_option_change($(this));
		});

	$(document).on("change", ".urcma_link_endpoint_type", function () {
		urcma_handle_link_type_option_change($(this));
	});

	function urcma_handle_link_type_option_change(node) {
		if (node.val() === "internal") {
			$(node)
				.closest(".urcma-endpoint-options")
				.find("#urcma_link_endpoint_select_page")
				.closest("tr")
				.show();
			$(node)
				.closest(".urcma-endpoint-options")
				.find(".urcma_url_input")
				.closest("tr")
				.hide();
		} else {
			$(node)
				.closest(".urcma-endpoint-options")
				.find("#urcma_link_endpoint_select_page")
				.closest("tr")
				.hide();
			$(node)
				.closest(".urcma-endpoint-options")
				.find(".urcma_url_input")
				.closest("tr")
				.show();
		}
	}

	/**************************************
	 * Initialize applyselect2 on select
	 **************************************/

	function format(icon) {
		return $(
			'<span><i class="fa fa-' +
				icon.text +
				'"></i>   ' +
				icon.text +
				"</span>"
		);
	}
	function applySelect2(select, is_endpoint) {
		if (typeof $.fn.select2 != "undefined") {
			$.each(select, function () {
				var data, value;
				// build data
				if ($(this).hasClass("icon-select")) {
					value = $(this).data("value");
					data = {
						templateResult: format,
						width: "100%",
					};
				} else if (is_endpoint) {
					data = {
						width: "100%",
					};
				} else {
					data = {
						minimumResultsForSearch: 10,
					};
				}

				$(this).select2(data);
				if (typeof value != "undefined" && value) {
					$(this).val(value).change();
				}
			});
		}
	}

	applySelect2(
		endpoints_container.find("select").not(".urcma_link_endpoint_type"),
		true
	);
});
