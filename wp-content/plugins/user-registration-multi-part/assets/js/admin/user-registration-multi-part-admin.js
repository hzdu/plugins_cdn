/* global ur_multipart_admin, */
(function ($) {
	var UR_MultiPart_Admin = {
		init: function () {
			$(document).on(
				"init_perfect_scrollbar update_perfect_scrollbar",
				function () {
					// Init perfect Scrollbar.
					if ("undefined" !== typeof PerfectScrollbar) {
						var builder_wrapper_content = $(
								".ur-builder-wrapper-content"
							),
							multi_part_tabs = $(
								".user-registration-multi-part-tabs .user-registration-tabs"
							);

						if (
							builder_wrapper_content.length >= 1 &&
							"undefined" ===
								typeof window.ur_builder_content_scrollbar
						) {
							window.ur_builder_content_scrollbar =
								new PerfectScrollbar(
									document.querySelector(
										".ur-builder-wrapper-content"
									),
									{
										suppressScrollX: true,
									}
								);
						} else if (
							"undefined" !==
							typeof window.ur_builder_content_scrollbar
						) {
							window.ur_builder_content_scrollbar.update();
						}

						if (
							multi_part_tabs.length >= 1 &&
							"undefined" ===
								typeof window.ur_multi_part_tab_scrollbar
						) {
							window.ur_multi_part_tab_scrollbar =
								new PerfectScrollbar(
									document.querySelector(
										".user-registration-multi-part-tabs .user-registration-tabs"
									),
									{
										suppressScrollY: true,
									}
								);
						} else if (
							"undefined" !==
							typeof window.ur_multi_part_tab_scrollbar
						) {
							window.ur_multi_part_tab_scrollbar.update();
						}
					}
				}
			);

			var first_part_id = $(
					".user-registration-multi-part-tabs .user-registration-tabs > li:first"
				).data("part-id"),
				first_part_rows = $(
					'.ur-multipart-page-option input[name="user_registration_multipart_rows_' +
						first_part_id +
						'"]'
				).val();

			if (
				typeof first_part_rows === "undefined" ||
				0 === JSON.parse(first_part_rows).length
			) {
				var $single_rows = $(".ur-input-grids > div.ur-single-row"),
					rows_ids = [];

				$single_rows.each(function (index, row) {
					rows_ids.push(parseInt($(row).attr("data-row-id")));
				});

				if (0 === rows_ids.length) {
					rows_ids.push(0);
				}

				$(
					'.ur-multipart-page-option input[name="user_registration_multipart_rows_' +
						first_part_id +
						'"]'
				).val(JSON.stringify(rows_ids));
			}

			// Render First part on load.
			UR_MultiPart_Admin.render_part_rows(first_part_id);
			UR_MultiPart_Admin.render_part_settings();

			$(
				".user-registration-multi-part-tabs ul.user-registration-tabs"
			).on("click", "li a", function (e) {
				e.preventDefault();

				var $this = $(this),
					$part_li = $this.parent(),
					part_id = $part_li.attr("data-part-id");

				if (typeof part_id !== "undefined") {
					$part_li.siblings().removeClass("active");
					$part_li.addClass("active");

					$(
						'.ur-tab-lists li[aria-controls="ur-tab-field-options"]'
					).hide();
					$(
						'.ur-tab-lists li[aria-controls="ur-multipart-page-settings"]'
					).show();
					$("#multi-part-options").trigger("click");

					$("#ur-multipart-page-settings")
						.find(".ur-multipart-page-option")
						.hide();
					$("#ur-multipart-page-settings")
						.find(
							'.ur-multipart-page-option[data-part-id="' +
								part_id +
								'"]'
						)
						.show();

					UR_MultiPart_Admin.render_individual_part_settings(part_id);
					UR_MultiPart_Admin.render_part_rows(part_id);
				}
			});

			$("#ur-multipart-page-settings").on(
				"keyup",
				".ur-multipart-page-option input.ur-part-title",
				function () {
					var $this = $(this),
						$current_part_li = $(
							".user-registration-multi-part-tabs .user-registration-tabs > li.active"
						);

					$current_part_li.find("a > span").text($this.val().trim());
				}
			);

			// Dragged field and hover over tab buttons - multipart.
			$(document).on(
				"mouseenter",
				'.user-registration-multi-part-tabs li[class*="ui-sortable-handle"]',
				function () {
					if (
						false === $(this).hasClass("active") &&
						$(document)
							.find(".ur-selected-item")
							.hasClass("ui-sortable-helper")
					) {
						$(this).find("a").trigger("click");

						// Change sortable containment to enable drag between multi parts.
						$(".ur-grid-list-item").sortable({
							containment: ".ur-builder-wrapper",
						});
					}
				}
			);

			$("#ur-multipart-page-settings").on(
				"click",
				".ur-multipart-page-option .user-registration-part-delete",
				function (e) {
					e.preventDefault();
					var $this = $(this),
						$part_option = $this.closest(
							".ur-multipart-page-option"
						),
						$part_li_container = $(
							".user-registration-multi-part-tabs .user-registration-tabs"
						),
						$current_part_li = $part_li_container.find("li.active");

					if ($part_li_container.find("li").length === 1) {
						ur_alert(ur_multipart_admin.i18n_part_locked_msg);
						return;
					}

					ur_confirmation(
						ur_multipart_admin.i18n_delete_part_confirm,
						{
							title: ur_multipart_admin.i18n_delete_part_title,
							confirm: function () {
								$next_part_index =
									0 !== $current_part_li.index()
										? $current_part_li.index() - 1
										: 0;

								$(
									".ur-input-grids .ur-single-row:visible"
								).remove();
								$current_part_li.remove();
								$part_option.remove();

								$part_li_container
									.find(
										"li:nth(" + $next_part_index + ") > a"
									)
									.trigger("click");
								UR_MultiPart_Admin.rearrange_part_id();
							},
						}
					);
				}
			);

			$(document).on(
				"click",
				".ur-builder-wrapper .ur-selected-inputs .ur-selected-item",
				function () {
					$(
						'.ur-tab-lists li[aria-controls="ur-multipart-page-settings"]'
					).hide();
					$(
						'.ur-tab-lists li[aria-controls="ur-tab-field-options"]'
					).show();
				}
			);

			$(document).on(
				"user_registration_row_added user_registration_row_deleted",
				function (e, $row) {
					if ("user_registration_row_added" === e.type) {
						var $current_part_li = $(
								".user-registration-multi-part-tabs > ul.user-registration-tabs > li.active"
							),
							current_part_id =
								$current_part_li.attr("data-part-id"),
							current_part_row_ids = $(
								'.ur-multipart-page-option input[name="user_registration_multipart_rows_' +
									current_part_id +
									'"]'
							).val(),
							current_part_row_ids =
								typeof current_part_row_ids !== "undefined"
									? JSON.parse(current_part_row_ids)
									: [],
							row_id = parseInt($row.attr("data-row-id"));

						current_part_row_ids.push(row_id);
						$(
							'.ur-multipart-page-option input[name="user_registration_multipart_rows_' +
								current_part_id +
								'"]'
						).val(JSON.stringify(current_part_row_ids));
					} else {
						var row_id = parseInt($row.attr("data-row-id")),
							current_part_id = "",
							current_part_row_ids = "";

						$(".ur-multipart-page-option").each(function (
							index,
							element
						) {
							var part_id = $(element)
								.find(
									'input[name="user_registration_multipart_index"]'
								)
								.val();
							var part_rows = $(element)
								.find(
									'input[name="user_registration_multipart_rows_' +
										part_id +
										'"]'
								)
								.val();
							part_rows =
								typeof part_rows !== "undefined"
									? JSON.parse(part_rows)
									: [];

							if (-1 !== part_rows.indexOf(row_id)) {
								current_part_id = part_id;
								current_part_row_ids = part_rows;
								return false;
							}
						});

						current_part_row_ids.splice(
							current_part_row_ids.indexOf(row_id),
							1
						);
						if (0 === current_part_row_ids.length) {
							$(
								'.user-registration-multi-part-tabs .user-registration-tabs li[data-part-id="' +
									current_part_id +
									'"]'
							).remove();
							$(
								'.ur-multipart-page-option[data-part-id="' +
									current_part_id +
									'"]'
							).remove();
							setTimeout(function () {
								UR_MultiPart_Admin.rearrange_part_id();
								$(
									".user-registration-multi-part-tabs .user-registration-tabs li"
								).removeClass("active");
								$(
									".user-registration-multi-part-tabs .user-registration-tabs li:first-child"
								).addClass("active");
							}, 10);
						}

						$(
							'.ur-multipart-page-option input[name="user_registration_multipart_rows_' +
								current_part_id +
								'"]'
						).val(JSON.stringify(current_part_row_ids));
					}
				}
			);

			$(".user-registration-multi-part-tabs").on(
				"click",
				"button.add-new-part",
				function () {
					var $this = $(this),
						total_parts = $this.attr("data-total-parts");

					$this.attr("disabled", "disabled");

					$(".ur-builder-wrapper-content").block({
						message: null,
						overlayCSS: {
							background: "#fff",
							opacity: 0.7,
						},
					});

					var data = {
						action: "user_registration_add_new_part",
						security: ur_multipart_admin.add_new_part_nonce,
						total_parts: total_parts,
					};

					$.post(
						ur_multipart_admin.ajax_url,
						data,
						function (response) {
							if (response.success && response.data) {
								$(
									"#ur-multipart-page-settings .ur-multipart-page-option"
								).hide();
								$("#multi-part-options").trigger("click");
								$(
									'.ur-tab-lists li[aria-controls="ur-tab-field-options"]'
								).hide();
								$(
									'.ur-tab-lists li[aria-controls="ur-multipart-page-settings"]'
								).show();

								if (response.data.fragments) {
									$.each(
										response.data.fragments,
										function (key, value) {
											$(key).append(value);
										}
									);
								}

								if (response.data.new_part_id) {
									var part_clone = $(
											".user-registration-multi-part-tabs ul.user-registration-tabs"
										)
											.find("li")
											.eq(0)
											.clone(),
										total_rows =
											$(".ur-add-new-row").attr(
												"data-total-rows"
											),
										total_rows = parseInt(total_rows);

									$(
										".ur-selected-inputs .ur-input-grids .ur-single-row"
									).hide();

									$(
										".user-registration-multi-part-tabs ul.user-registration-tabs > li"
									).removeClass("active");
									// Part clone.
									part_clone.attr(
										"data-part-id",
										response.data.new_part_id
									);
									part_clone.removeAttr("data-part-rows");
									// Add sortable handle class to make elements inside part clone sortable.
									part_clone
										.removeClass()
										.addClass("active")
										.addClass("ui-sortable-handle");
									part_clone
										.find(".tips")
										.attr(
											"data-tip",
											ur_multipart_admin.i18n_tooltip_msg
										);
									part_clone
										.find("span")
										.text(
											ur_multipart_admin.i18n_part_title
										);
									$("ul.user-registration-tabs")
										.find("li")
										.last()
										.after(part_clone);
								}

								$(
									".ur-selected-inputs .ur-add-new-row"
								).trigger("click");

								// Update perfect scrollerbar.
								$(document).trigger("update_perfect_scrollbar");

								$(document)
									.find("ul.user-registration-tabs li")
									.last()
									.find("a")
									.trigger("click");

								total_parts++;
							} else {
								window.alert(response.data.error);
							}

							$this.prop("disabled", false);
							$this.attr("data-total-parts", total_parts);
							$(".ur-builder-wrapper-content").unblock();
						}
					);
				}
			);

			$(
				"#ur-field-all-settings > #multi-part-settings #user_registration_enable_multipart_field input"
			).on("change", function () {
				UR_MultiPart_Admin.render_part_settings();
			});

			$(
				".user-registration-multi-part-tabs > ul.user-registration-tabs"
			).sortable({
				items: "li",
				cursor: "move",
				axis: "x",
				scrollSensitivity: 40,
				forcePlaceholderSize: true,
				helper: "clone",
				opacity: 0.65,
				placeholder: "ur-sortable-placeholder",
				start: function (event, ui) {
					$(this).attr("data-elPos", ui.item.index());

					ui.item.css("background-color", "#f6f6f6");
				},
				stop: function (event, ui) {
					ui.item.removeAttr("style");
				},
				update: function (event, ui) {
					var origPos = $(this).attr("data-elPos");
					$(".ur-input-grids").each(function () {
						var index_field = $(this)
							.children(".ur-single-row")
							.eq(ui.item.index());

						if (origPos > ui.item.index()) {
							$(this)
								.children(".ur-single-row")
								.eq(origPos)
								.insertBefore(index_field);
						} else {
							$(this)
								.children(".ur-single-row")
								.eq(origPos)
								.insertAfter(index_field);
						}
					});
					$("#ur-multi-part-page-settings").each(function () {
						var index_option = $(this)
							.children(".ur-multipart-page-option")
							.eq(ui.item.index());

						if (origPos > ui.item.index()) {
							$(this)
								.children(".ur-multipart-page-option")
								.eq(origPos)
								.insertBefore(index_option);
						} else {
							$(this)
								.children(".ur-multipart-page-option")
								.eq(origPos)
								.insertAfter(index_option);
						}
					});

					UR_MultiPart_Admin.rearrange_part_id();
				},
			});
		},
		/**
		 * Render individual part settings.
		 *
		 * @param string part_id ID of the part.
		 */
		render_individual_part_settings: function (part_id) {
			var enable_preview = $(
					"#user_registration_multipart_enable_preview_" + part_id
				).val(),
				preview_message = $(
					"#user_registration_multipart_preview_message_" +
						part_id +
						"_field"
				),
				preview_layout = $(
					"#user_registration_multipart_preview_layout_" +
						part_id +
						"_field"
				),
				custom_css = $(
					"#user_registration_multipart_preview_custom_class_" +
						part_id +
						"_field"
				);

			if ("true" === enable_preview) {
				preview_message.show();
				preview_layout.show();
				custom_css.show();
			} else {
				preview_message.hide();
				preview_layout.hide();
				custom_css.hide();
			}

			UR_MultiPart_Admin.render_part_preview_message(
				part_id,
				enable_preview,
				preview_message
			);
		},
		/**
		 * Render preview message of each parts.
		 *
		 * @param string part_id ID of part.
		 * @param string enable_preview Preview is enabled or disabled.
		 * @param html preview_message Preview message of each parts.
		 */
		render_part_preview_message: function (
			part_id,
			enable_preview,
			preview_message
		) {
			var current_part_rows = $(
				'.ur-multipart-page-option input[name="user_registration_multipart_rows_' +
					part_id +
					'"]'
			).val();

			var all_rows = $(".ur-input-grids > div.ur-single-row");

			var all_row_ids = all_rows
				.map(function () {
					return $(this).attr("data-row-id");
				})
				.get();

			var current_part_first_row = all_rows
				.filter(function () {
					const row_id = $(this).attr("data-row-id");
					return (
						all_row_ids.includes(row_id) &&
						current_part_rows.includes(row_id)
					);
				})
				.first();

			if (current_part_first_row.length) {
				const row_id = current_part_first_row.attr("data-row-id");
				if ("true" === enable_preview) {
					if (
						$(
							'.ur-input-grids > div.ur-single-row[data-row-id="' +
								row_id +
								'"]'
						).find(".ur-multipart-preview").length > 0
					) {
						$(
							'.ur-input-grids > div.ur-single-row[data-row-id="' +
								row_id +
								'"]'
						)
							.find(".ur-multipart-preview")
							.html(
								"<h3>Preview</h3>" +
									preview_message.find("textarea").val()
							);
					} else {
						$(
							'.ur-input-grids > div.ur-single-row[data-row-id="' +
								row_id +
								'"]'
						).prepend(
							'<div class="ur-multipart-preview"><h3>Preview</h3>' +
								preview_message.find("textarea").val() +
								"</div>"
						);
					}
				} else {
					$(
						'.ur-input-grids > div.ur-single-row[data-row-id="' +
							row_id +
							'"]'
					)
						.find(".ur-multipart-preview")
						.remove();
				}
			}
		},
		render_part_rows: function (part_id) {
			var $single_rows = $(".ur-input-grids > div.ur-single-row"),
				$part_li = $(
					'.user-registration-multi-part-tabs ul.user-registration-tabs li[data-part-id="' +
						part_id +
						'"]'
				),
				current_part_id = $part_li.attr("data-part-id"),
				current_part_rows = $(
					'.ur-multipart-page-option input[name="user_registration_multipart_rows_' +
						current_part_id +
						'"]'
				).val();
			$single_rows.hide();
			if (current_part_rows !== undefined) {
				current_part_rows = JSON.parse(current_part_rows);

				$.each(current_part_rows, function (index, row_id) {
					$(
						'.ur-input-grids > div.ur-single-row[data-row-id="' +
							row_id +
							'"]'
					).show();

					// Move the part being dragged from one part to another.
					var item_being_dragged = $(".ui-sortable-helper");
					item_being_dragged.appendTo(
						$(
							'.ur-input-grids > div.ur-single-row[data-row-id="' +
								row_id +
								'"]'
						).find(".ur-grid-list-item")
					);
				});
			}

			$(document).trigger("update_perfect_scrollbar");
		},
		render_part_settings: function () {
			var $multi_part_settings = $(
					"#ur-field-all-settings > #multi-part-settings"
				),
				$enable_mulipart = $multi_part_settings.find(
					"#user_registration_enable_multipart_field input"
				),
				$builder_wrapper = $(".ur-builder-wrapper "),
				$builder_footer = $builder_wrapper.find(
					".ur-builder-wrapper-footer"
				),
				$multi_part_tabs = $builder_footer.find(
					".user-registration-multi-part-tabs"
				),
				active_part_id = $multi_part_tabs
					.find(".user-registration-tabs > li.active")
					.attr("data-part-id");

			if (!$enable_mulipart.is(":checked")) {
				$multi_part_settings
					.find("#user_registration_multipart_indicator_field")
					.hide();
				$multi_part_settings
					.find("#user_registration_multipart_nav_align_field")
					.hide();
				$multi_part_settings
					.find("#user_registration_multipart_indicator_color_field")
					.hide();
				$multi_part_tabs.hide();
				$builder_wrapper.removeClass("ur-multipart");
				$builder_wrapper
					.find(".ur-input-grids > .ur-single-row")
					.show();
				$(
					'.ur-tab-lists li[aria-controls="ur-tab-field-options"]'
				).show();
				$(
					'.ur-tab-lists li[aria-controls="ur-multipart-page-settings"]'
				).hide();
			} else {
				$multi_part_settings
					.find("#user_registration_multipart_indicator_field")
					.show();
				$multi_part_settings
					.find("#user_registration_multipart_nav_align_field")
					.show();
				$multi_part_settings
					.find("#user_registration_multipart_indicator_color_field")
					.show();
				$multi_part_tabs.show();
				$builder_wrapper.addClass("ur-multipart");
				UR_MultiPart_Admin.render_part_rows(active_part_id);
			}
		},
		rearrange_part_id: function () {
			var $part_tabs = $(
					".user-registration-multi-part-tabs > .user-registration-tabs > li"
				),
				$part_options = $(
					"#ur-multi-part-page-settings > .ur-multipart-page-option"
				);

			$part_tabs.each(function (index, el) {
				$(el).attr("data-part-id", index + 1);
			});

			$part_options.each(function (index, el) {
				var $this = $(el),
					prev_part_id = $this.attr("data-part-id"),
					current_part_id = index + 1;
				($input_index = $this.find(
					'input[name="user_registration_multipart_index"]'
				)),
					($input_rows = $this.find(
						'input[name="user_registration_multipart_rows_' +
							prev_part_id +
							'"]'
					)),
					$this.attr("data-part-id", current_part_id);

				$this
					.find(
						'input[name="user_registration_multipart_part_title_' +
							prev_part_id +
							'"]'
					)
					.attr({
						name:
							"user_registration_multipart_part_title_" +
							current_part_id,
						id:
							"user_registration_multipart_part_title_" +
							current_part_id,
						"data-id":
							"user_registration_multipart_part_title_" +
							current_part_id,
					});
				$this
					.find(
						'input[name="user_registration_multipart_next_title_' +
							prev_part_id +
							'"]'
					)
					.attr({
						name:
							"user_registration_multipart_next_title_" +
							current_part_id,
						id:
							"user_registration_multipart_next_title_" +
							current_part_id,
						"data-id":
							"user_registration_multipart_next_title_" +
							current_part_id,
					});
				$this
					.find(
						'input[name="user_registration_multipart_previous_title_' +
							prev_part_id +
							'"]'
					)
					.attr({
						name:
							"user_registration_multipart_previous_title_" +
							current_part_id,
						id:
							"user_registration_multipart_previous_title_" +
							current_part_id,
						"data-id":
							"user_registration_multipart_previous_title_" +
							current_part_id,
					});
				$this
					.find(
						'select[name="user_registration_multipart_enable_preview_' +
							prev_part_id +
							'"]'
					)
					.attr({
						name:
							"user_registration_multipart_enable_preview_" +
							current_part_id,
						id:
							"user_registration_multipart_enable_preview_" +
							current_part_id,
						"data-id":
							"user_registration_multipart_enable_preview_" +
							current_part_id,
					});
				$this
					.find(
						'textarea[name="user_registration_multipart_preview_message_' +
							prev_part_id +
							'"]'
					)
					.attr({
						name:
							"user_registration_multipart_preview_message_" +
							current_part_id,
						id:
							"user_registration_multipart_preview_message_" +
							current_part_id,
						"data-id":
							"user_registration_multipart_preview_message_" +
							current_part_id,
					});
				$this
					.find(
						'select[name="user_registration_multipart_preview_layout_' +
							prev_part_id +
							'"]'
					)
					.attr({
						name:
							"user_registration_multipart_preview_layout_" +
							current_part_id,
						id:
							"user_registration_multipart_preview_layout_" +
							current_part_id,
						"data-id":
							"user_registration_multipart_preview_layout_" +
							current_part_id,
					});
				$this
					.find(
						'input[name="user_registration_multipart_preview_custom_class_' +
							prev_part_id +
							'"]'
					)
					.attr({
						name:
							"user_registration_multipart_preview_custom_class_" +
							current_part_id,
						id:
							"user_registration_multipart_preview_custom_class_" +
							current_part_id,
						"data-id":
							"user_registration_multipart_preview_custom_class_" +
							current_part_id,
					});

				$input_index.val(current_part_id);
				$input_rows.attr(
					"name",
					"user_registration_multipart_rows_" + current_part_id
				);
			});
		},
	};

	$(document).ready(function () {
		UR_MultiPart_Admin.init();

		// Toggle settings when enable preview is toggled.
		$(document).on(
			"change",
			".user_registration_multipart_enable_preview",
			function () {
				var part_id = $(this)
					.closest(".ur-multipart-page-option")
					.data("part-id");
				UR_MultiPart_Admin.render_individual_part_settings(part_id);
			}
		);

		// Change preview text when messaged is changed.
		$(document).on(
			"keyup",
			".user_registration_multipart_preview_message",
			function () {
				var part_id = $(this)
					.closest(".ur-multipart-page-option")
					.data("part-id");

				UR_MultiPart_Admin.render_part_preview_message(
					part_id,
					"true",
					$(this).parent()
				);
			}
		);
	});
})(jQuery);
