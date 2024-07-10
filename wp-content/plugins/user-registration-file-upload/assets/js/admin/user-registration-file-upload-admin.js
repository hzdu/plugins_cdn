(function ($) {
	$(document).ready(function () {
		/* global  urfu_upload_script_data */
		var file_frame;
		// Set this
		$("body").on("click", ".wp_urfu_upload", function (event) {
			var $this = $(this);
			event.preventDefault();

			var attachment_ids = [];
			var previous_attachment_ids = $(this)
				.closest("td")
				.find(".urfu-file-upload-input")
				.val();

			//Check if previous_attachment_ids is empty to remove missing attachment error.
			if (previous_attachment_ids.length >= 1) {
				attachment_ids.push(previous_attachment_ids);
			}

			// Create the media frame.
			file_frame = wp.media.frames.file_frame = wp.media({
				title: urfu_upload_script_data.uploader_title,
				button: { text: urfu_upload_script_data.use_this_file },
				multiple: false, // Set to true to allow multiple files to be selected
			});
			// When an image is selected, run a callback.
			file_frame.on("select", function () {
				// We set multiple to false so only get one image from the uploader
				var attachments = file_frame.state().get("selection").toJSON(),
					attids = [],
					result = "",
					thumb = "",
					thumbnailUrl = "";

				for (var i = 0; i < attachments.length; i++) {
					// Do something with attachment.id and/or attachment.url here
					attids.push(attachments[i].id);
					if (attachments[i].sizes !== undefined) {
						if (attachments[i].sizes.thumbnail !== undefined) {
							thumb = attachments[i].sizes.thumbnail;
						} else {
							thumb = attachments[i].sizes.full;
							thumbnailUrl = thumb.url;
						}
					} else {
						thumbnailUrl = attachments[i].icon;
					}
					let new_attachments = {};

					$.ajax({
						url:
							urfu_upload_script_data.ajax_url +
							"?action=user_registration_file_upload_admin_upload&security=" +
							urfu_upload_script_data.urfu_admin_upload_nonce,
						type: "POST",
						data: attachments[i],
						success: function (response) {
							if (response.success) {
								new_attachments = {
									id: response.data.attachment_id,
									url: response.data.attachment_url,
									filename: response.data.file_name,
									thumbnail: response.data.attachment_url,
								};

								ext = getExtension(new_attachments.filename);
								if (ext) {
									new_attachments.thumbnail =
									urfu_upload_script_data.home_url +"/images/filetypes/" +
										ext +
										".svg";
								}

								result = '<div class="urfu-file-details">';
								result += '<div class="urfu-file-thumb">';
								result +=
									'<img src="' +
									new_attachments.thumbnail +
									'"/></div>';
								result += '<div class="urfu-file-heading">';
								result +=
									'<h4 class="urfu-file-name" title="' +
									new_attachments.filename +
									'">' +
									new_attachments.filename +
									"</h4>";
								result +=
									'<span class="urfu-file-size">' +
									"5 MB" +
									"</span></div>";
								result +=
									'<div class="urfu-file-action">' +
									'<a class="urfu-remove" data-attachment-id="' +
									new_attachments.id +
									'">' +
									'<span class="dashicons dashicons-trash" title="Delete"></span>' +
									"</a>";
								result += "</div>";
								result += "</div>";

								attachment_ids.push(new_attachments.id);

								$this
									.closest("td")
									.find(".urfu-file-upload-input")
									.val(attachment_ids.toString());
								$this
									.closest("td")
									.find(".urfu-file-uploaded")
									.append(result);
							}
						},
					});
				} // Restore the main post ID
			});
			// Finally, open the modal
			file_frame.open();
		});
	});

	$(document).on("click", ".urfu-remove", function () {
		var attachment_id = $(this).data("attachment-id"),
			attachment_ids = $(this)
				.closest("td")
				.find(".urfu-file-upload-input")
				.val();

		var attachment_ids_array = attachment_ids.split(",");

		for (var i = attachment_ids_array.length - 1; i >= 0; i--) {
			if (attachment_ids_array[i] == attachment_id) {
				attachment_ids_array.splice(i, 1);
			}
		}

		$(this)
			.closest("td")
			.find(".urfu-file-upload-input")
			.attr("value", attachment_ids_array.toString());
		$(this).closest(".urfu-file-details").remove();
	});

	$(document).ready(function () {
		$(".urfu-file-uploaded")
			.find(".urfu-file-details")
			.each(function () {
				var fileName = $(this).find(".urfu-file-name").text();
				var imgElement = $(this).find("img");
				renderThumbnail(fileName, imgElement);
			});
	});

	/**
	 * Set Thumbnail for given element.
	 *
	 * @param {string} filename
	 * @param {jquery object} el Image Thumbnail element.
	 */
	function renderThumbnail(filename, el) {
		fileIcon = getExtension(filename);

		if (fileIcon !== null) {
			el.attr(
				"src",
				urfu_upload_script_data.home_url +
					"/images/filetypes/" +
					fileIcon +
					".svg"
			);
		}
	}

	/**
	 * Extracts and returns file extension from given filename.
	 * @param {string} filename
	 * @returns stirng
	 */
	function getExtension(filename) {
		// Diiferent image for different extensions.
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

		return fileIcon;
	}
})(jQuery);
