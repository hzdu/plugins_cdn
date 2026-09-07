(function($) {
	'use strict';

	var activeContainer = null;
	var originalWpLinkUpdate = null;

	function getFieldContainer($el) {
		return $el.closest('.cfgroup-hyperlink-wplink');
	}

	function getInputs($container) {
		return {
			url: $container.find('input.link-url').first(),
			text: $container.find('input.link-text').first(),
			target: $container.find('input.link-target').first()
		};
	}

	function normalizeTargetForUi(target) {
		if ('_blank' === target) {
			return '_blank';
		}
		return 'none';
	}

	function updatePreview($container) {
		var inputs = getInputs($container);
		var url = (inputs.url.val() || '').trim();
		var text = (inputs.text.val() || '').trim();
		var target = normalizeTargetForUi((inputs.target.val() || '').trim());

		var $preview = $container.find('.cfgroup-hyperlink-wplink-preview').first();
		if (!$preview.length) {
			return;
		}

		// Toggle button label based on whether a link exists.
		var $selectBtn = $container.find('.cfgroup-hyperlink-wplink-select').first();
		if ($selectBtn.length) {
			var selectText = $selectBtn.data('select-text') || 'Select Link';
			var editText = $selectBtn.data('edit-text') || 'Edit Link';
			$selectBtn.text(('' === url) ? selectText : editText);
		}

		if ('' === url) {
			var emptyText = $container.data('empty-text') || 'No link selected.';
			$preview.html('<span class="cfgroup-hyperlink-wplink-preview-empty">' + $('<div/>').text(emptyText).html() + '</span>');
			return;
		}

		var linkText = ('' !== text) ? text : url;
		var $a = $('<a/>', {
			'class': 'cfgroup-hyperlink-wplink-preview-link',
			'href': url,
			'text': linkText
		});

		if ('_blank' === target) {
			$a.attr('target', '_blank');
			$a.attr('rel', 'noopener');
		}

		$preview.empty().append($a);
	}

	function setWpLinkSubmitLabel($container) {
		if (!$container || !$container.length) {
			return;
		}

		var inputs = getInputs($container);
		var url = (inputs.url.val() || '').trim();

		var addText = $container.data('add-text') || 'Add Link';
		var updateText = $container.data('update-text') || 'Update Link';

		var label = ('' === url) ? addText : updateText;

		// Prefer the real submit control when present.
		var $submitControl = $('#wp-link-submit');

		/*
		 * In some WP/editor contexts, #wp-link-update is a wrapper element around the real
		 * clickable control (e.g., a nested <button>/<input>). Never clobber its children.
		 */
		if (!$submitControl.length) {
			var $update = $('#wp-link-update');
			if ($update.length) {
				var $inner = $update.find('button, input[type="button"], input[type="submit"], a').first();
				$submitControl = $inner.length ? $inner : $update;
			}
		}

		if (!$submitControl.length) {
			return;
		}

		var tag = ($submitControl.get(0).tagName || '').toLowerCase();
		if ('input' === tag) {
			$submitControl.val(label);
		} else {
			$submitControl.text(label);
		}

		// If the submit control is a <div>, make it keyboard-accessible.
		if ('div' === tag) {
			if (!$submitControl.attr('role')) {
				$submitControl.attr('role', 'button');
			}
			if (!$submitControl.attr('tabindex')) {
				$submitControl.attr('tabindex', '0');
			}

			$submitControl.off('keydown.asenhaCfgroupWpLink').on('keydown.asenhaCfgroupWpLink', function(evt) {
				if ('Enter' === evt.key || ' ' === evt.key) {
					evt.preventDefault();
					$(this).trigger('click');
				}
			});
		}
	}

	function hasWpLink() {
		return (typeof window.wpLink !== 'undefined' && window.wpLink && typeof window.wpLink.open === 'function');
	}

	function seedModal($container) {
		var inputs = getInputs($container);
		var url = (inputs.url.val() || '').trim();
		var text = (inputs.text.val() || '').trim();
		var target = normalizeTargetForUi((inputs.target.val() || '').trim());

		$('#wp-link-url').val(url);
		$('#wp-link-text').val(text);
		$('#wp-link-target').prop('checked', '_blank' === target);
	}

	function readModal() {
		var url = ($('#wp-link-url').val() || '').trim();
		var text = ($('#wp-link-text').val() || '').trim();
		var targetChecked = $('#wp-link-target').is(':checked');

		return {
			url: url,
			text: text,
			target: targetChecked ? '_blank' : 'none'
		};
	}

	function applyModalToField($container, data) {
		var inputs = getInputs($container);
		inputs.url.val(data.url);
		inputs.text.val(data.text);
		inputs.target.val(data.target);
		updatePreview($container);
	}

	function restoreWpLinkUpdate() {
		if (hasWpLink() && null !== originalWpLinkUpdate) {
			window.wpLink.update = originalWpLinkUpdate;
			originalWpLinkUpdate = null;
		}
	}

	$(document).on('click', '.cfgroup-hyperlink-wplink-select', function(e) {
		e.preventDefault();

		if (!hasWpLink()) {
			return;
		}

		activeContainer = getFieldContainer($(this));
		if (!activeContainer.length) {
			activeContainer = null;
			return;
		}

		var editorId = activeContainer.data('editor-id');
		if (editorId) {
			// In the Block Editor, wpLink expects an active editor ID to be set.
			window.wpActiveEditor = editorId;
		}

		// Temporarily override wpLink.update so the core Submit button updates our hidden inputs.
		if (null === originalWpLinkUpdate) {
			originalWpLinkUpdate = window.wpLink.update;
		}

		window.wpLink.update = function() {
			if (!activeContainer || !activeContainer.length) {
				restoreWpLinkUpdate();
				return;
			}

			var data = readModal();
			applyModalToField(activeContainer, data);

			window.wpLink.close();
			activeContainer = null;
			restoreWpLinkUpdate();
		};

		// Open first (core initializes / may overwrite modal fields during open).
		if (editorId) {
			window.wpLink.open(editorId);
		} else {
			window.wpLink.open();
		}

		// Seed AFTER open so core doesn't overwrite our values.
		window.setTimeout(function() {
			if (!activeContainer || !activeContainer.length) {
				return;
			}

			seedModal(activeContainer);
			setWpLinkSubmitLabel(activeContainer);

			// Let wpLink listeners react without resetting the seeded URL/Text.
			$('#wp-link-url').trigger('input').trigger('change');
			$('#wp-link-text').trigger('input').trigger('change');
			$('#wp-link-target').trigger('change');
		}, 0);
	});

	$(document).on('click', '.cfgroup-hyperlink-wplink-clear', function(e) {
		e.preventDefault();

		var $container = getFieldContainer($(this));
		var inputs = getInputs($container);
		inputs.url.val('');
		inputs.text.val('');
		inputs.target.val('none');
		updatePreview($container);
	});

	$(document).on('click', '#wp-link-cancel, #wp-link-close', function() {
		activeContainer = null;
		restoreWpLinkUpdate();
	});

	$(function() {
		$('.cfgroup-hyperlink-wplink').each(function() {
			updatePreview($(this));
		});
	});

	$(document).on('asenha-cfgroup-hyperlink-refresh', function(e, $scope) {
		var $root = ($scope && $scope.length) ? $scope : $(document);
		$root.find('.cfgroup-hyperlink-wplink').each(function() {
			updatePreview($(this));
		});
	});
})(jQuery);


