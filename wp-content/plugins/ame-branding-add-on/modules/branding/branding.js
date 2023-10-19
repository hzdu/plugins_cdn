jQuery(function ($) {
	//Currently it's not possible to have the original WP logo and a custom logo at the same time.
	//Let's automatically check the "remove WP logo" box when the user selects a custom logo.
	const $logoSelector = $('.wrap')
		.find('input[name="custom_toolbar_logo_attachment_id"], input[name$="custom_toolbar_logo\\[attachmentId\\]"]')
		.closest('.ame-image-selector,.ame-image-selector-v2');
	$logoSelector.on(
		'admin-menu-editor:media-image-selected admin-menu-editor:external-image-selected',
		function () {
			$(this).closest('table').find('input[name$="is_toolbar_wp_logo_hidden"]')
				.prop('checked', true);
		}
	);

	//Add or remove predefined %tags% to the "admin page titles" field.
	const $adminTitleTemplate = $('.wrap form input[name$="admin_page_title_template"]'),
		$tagButtons = $adminTitleTemplate.closest('td').find('.ame-page-title-tags li button');

	//Remember if the title field had focus.
	$adminTitleTemplate.on('focus', function (event) {
		$(this).data('ame-was-focused', true).off(event);
	});

	/**
	 * Show tag buttons as active or inactive depending on whether the tags have been used.
	 *
	 * @param [$buttons] Defaults to updating all buttons.
	 */
	function updateTagButtonState($buttons) {
		if (!$buttons) {
			$buttons = $tagButtons;
		}
		$buttons.each(function () {
			const $this = $(this),
				$input = $this.closest('td,fieldset').find('input[name$="admin_page_title_template"]'),
				template = $input.val();

			$this.toggleClass('active', template.indexOf($this.text().trim()) >= 0);
		});
	}

	$tagButtons.on('click', function () {
		const $this = $(this),
			$input = $this.closest('td,fieldset').find('input[name$="admin_page_title_template"]'),
			tag = $this.text().trim(),
			selectionStart = $input[0].selectionStart,
			selectionEnd = $input[0].selectionEnd;

		let template = $input.val();
		if (template.indexOf(tag) >= 0) {
			//Remove the tag.
			template = template.replace(tag, '');
			$input.val(template);
			updateTagButtonState($this);
			return;
		}

		if ($input.data('ame-was-focused')) {
			//Insert the tag at the cursor.
			template = template.substring(0, selectionStart) + tag + template.substring(selectionEnd);
		} else {
			//Append the tag to the end.
			template += tag;
		}
		$input.val(template);

		//Return focus to the input.
		if ($input.data('ame-was-focused') && $input[0].setSelectionRange) {
			const newSelectionStart = selectionStart + tag.length;
			$input[0].setSelectionRange(newSelectionStart, newSelectionStart);
			$input.trigger('focus');
		}

		updateTagButtonState($this);
	});

	$adminTitleTemplate.on('change', function () {
		updateTagButtonState();
	});

	updateTagButtonState();
});
