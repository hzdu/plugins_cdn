
jQuery(function() {

	if (!jQuery('.pwbe-intro').is(':visible')) {
		pwbeInit();
	}

	jQuery(".pwbe-begin-button").click(function() {
		if (jQuery('#pwbe-dismiss-intro').prop('checked')) {
			jQuery.post(ajaxurl, {'action': 'pwbe_options', 'option_name': 'pwbe_help_dismiss_intro', 'option_value': 'true'});
		}

		pwbeInit();
	});
});

function pwbeInit() {
	jQuery.post(ajaxurl, {'action': 'pwbe_activation'}, function(registration) {
		if (typeof registration.active === 'undefined') {
			registration = JSON.parse(registration);
		}
		if (!registration.active) {
			jQuery('.pwbe-premium-item').css('display', 'none');
			jQuery('#pwbe-activation-main').css('display', 'inline-block');
			jQuery('.pwbe-filter').css('display', 'none');
			jQuery('.pwbe-license-key').focus();
			if (registration.error != '') {
				jQuery('#pwbe-activation-error').text(registration.error).removeClass('pwbe-hidden');
			}
		}
	});

	pwbeLoadSavedFilters();

	jQuery('#pwbe-filters-form').ajaxForm({
		url: ajaxurl,
		type: 'POST',
		target: '#pwbe-results',
		replaceTarget: false,
		data: { 'action': 'pwbe_filter_results' },
		dataType: null,
		beforeSubmit: function(arr, $form, options) {
			if (jQuery('.pwbe-field-changed').length > 0) {
				if (!confirm(pwbeFilters.i18n.unsavedChangesPrompt)) {
					return false;
				}
			}

			jQuery('body').css('cursor', 'wait');

			var results = document.getElementById("pwbe-results");
			while (results.firstChild) {
				results.removeChild(results.firstChild);
			}

			jQuery('.pwbe-field-edit-button-cancel').click();
			jQuery('.pwbe-processing-message').text(pwbeFilters.i18n.searching + '...');
			jQuery('.pwbe-processing').css('display', 'block');
			jQuery('#pwbe-message').html('');

			var valid = true;
			var fields = jQuery('.pwbe-filter-field');
			for(var i = 0, len = fields.length; i < len; i++) {
				var field = jQuery(fields[i]);
				if (field.is(':visible') && !field.val()) {
					field.closest('.pwbe-filter-row').find('.pwbe-filter-required').css('display', 'inline-block');
					valid = false;
				} else {
					field.closest('.pwbe-filter-row').find('.pwbe-filter-required').css('display', 'none');
				}
			}

			if (!valid) {
				jQuery('.pwbe-processing').css('display', 'none');
				jQuery('body').css('cursor', 'default');
				return false;
			}
		},
		success: function() {
			jQuery('#pwbe-hide-filters-button').css('display', 'inline');
			jQuery('.pwbe-processing').css('display', 'none');
			pwbeSearchResults();
			jQuery('body').css('cursor', 'default');
		},
		error: function(xhr, status, error) {
			jQuery('body').css('cursor', 'default');
			alert("Error while filtering:\n\n" + xhr.status + " " + xhr.statusText);
		}
	});

	jQuery('#pwbe-filters-form').change(function() {
		pwbeSetFilterDirtyStatus('true');
	});

	jQuery('#pwbe-show-filters-button').click(function() {
		jQuery(this).css('display', 'none');
		jQuery('#pwbe-hide-filters-button').css('display', 'inline');
		jQuery('#pwbe-filters-help-container').css('display', 'inline-block');
		jQuery('#pwbe-filters-form').css('display', 'block');
		return false;
	});

	jQuery('#pwbe-hide-filters-button').click(function() {
		jQuery(this).css('display', 'none');
		jQuery('#pwbe-show-filters-button').css('display', 'inline');
		jQuery('#pwbe-filters-help-container').css('display', 'none');
		jQuery('#pwbe-filters-form').css('display', 'none');
		return false;
	});

	jQuery('.pwbe-filter-name').change(function() {
		var row = jQuery(this).closest('.pwbe-filter-row');
		pwbePrepareCriteria(row);
	});

	jQuery('.pwbe-filter-type').change(function() {
		var row = jQuery(this).closest('.pwbe-filter-row');
		pwbePrepareValueInput(row);
	});

	jQuery('.pwbe-filter-add').click(function() {
		var row = jQuery(this).closest('.pwbe-filter-row');
		pwbeAddRow(row);
		pwbeNameAllInputs();
		return false;
	});

	jQuery('.pwbe-filter-remove').click(function() {
		var row = jQuery(this).closest('.pwbe-filter-row');
		pwbeRemoveRow(row);
		pwbeNameAllInputs();
		return false;
	});

	jQuery('.pwbe-filter-add-group').click(function() {
		var row = jQuery(this).closest('.pwbe-filter-row');

		var newGroup = pwbeAddRow(row, '-group');
		pwbeAddRow(newGroup);

		pwbeNameAllInputs();

		return false;
	});

	jQuery('#pwbe-filters-help-dismiss').click(function() {
		jQuery.post(ajaxurl, {'action': 'pwbe_options', 'option_name': 'pwbe_help_minimize_filter_help', 'option_value': 'true'});
		jQuery('#pwbe-filters-help-container').css('display', 'none');
	});

	jQuery('#pwbe-filters-renew-dismiss').click(function() {
		jQuery.post(ajaxurl, {'action': 'pwbe_options', 'option_name': 'pwbe_help_minimize_renew_notice', 'option_value': 'true'});
		jQuery('#pwbe-renew-notice').css('display', 'none');
	});

	jQuery('#pwbe-help').click(function() {
		jQuery.post(ajaxurl, {'action': 'pwbe_options', 'option_name': 'pwbe_help_minimize_filter_help', 'option_value': 'false'});
		jQuery('#pwbe-filters-help-container').css('display', 'inline-block');
	});

	jQuery('#pwbe-filter-save').click(function() {
		var saveButton = jQuery('#pwbe-filter-save');
		var postId = saveButton.attr('data-filter-post-id');
		var filterName = saveButton.attr('data-filter-name');

		filterName = prompt('Filter name', filterName);

		if (filterName) {
			jQuery('body').css('cursor', 'wait');
			jQuery.post(ajaxurl, {
				'action': 'pwbe_filter_manager',
				'function': 'save',
				'ID': postId,
				'name': filterName,
				'data': JSON.stringify( jQuery('#pwbe-filters-form').serializeArray() )
			}, function(data) {
				var saveButton = jQuery('#pwbe-filter-save');
				saveButton.attr('data-filter-post-id', data.ID);
				saveButton.attr('data-filter-name', filterName);
				saveButton.pwbe_highlight();
				pwbeSetFilterDirtyStatus('false');
				jQuery('body').css('cursor', 'default');
			});
		}
	});

	jQuery('#pwbe-filter-open').click(function() {
		if (!pwbeFilterIsDirty() || confirm(pwbeFilters.i18n.discardChanges)) {
			var dialog = pwbeShowDialog('filter-manager', 'open');
		}
	});

	jQuery('#pwbe-filter-new').click(function() {
		if (!pwbeFilterIsDirty() || confirm(pwbeFilters.i18n.discardChanges)) {
			pwbeInitFilters();
			jQuery('#pwbe-message').html('');
			jQuery('#pwbe-results').html('');
		}
	});

	jQuery('#pwbe-filter-manager-dialog-button-cancel').click(function(e) {
		pwbeFilterManagerDialogClose();
		e.preventDefault();
		return false;
	});

	jQuery('.pwbe-social-link').click(function() {
		var logoImage = 'https://www.pimwick.com/wp-content/uploads/2016/09/logo-large.png';
		var title = 'PW WooCommerce Bulk Edit';
		var url = 'https://pimwick.com/pw-bulk-edit/';

		switch(jQuery(this).attr('data-site')) {
			case 'facebook':
				redirect = 'http://www.facebook.com/sharer/sharer.php?picture=' + logoImage + '&u=' + url + '&title=' + title;
			break;

			case 'twitter':
				redirect = 'http://twitter.com/intent/tweet?status=' + title + '+' + url;
			break;

			case 'google-plus':
				redirect = 'https://plus.google.com/share?url=' + url;
			break;

			case 'reddit':
				redirect = 'http://www.reddit.com/submit?url=' + url + '&title=' + title;
			break;

			case 'tumblr':
				redirect = 'http://www.tumblr.com/share?v=3&u=' + url + '&t=' + title;
			break;

			case 'pinterest':
				redirect = 'http://pinterest.com/pin/create/bookmarklet/?media=' + logoImage + '&url=' + url + '&is_video=false&description=' + title;
			break;
		}

		var win = window.open(redirect, '_blank');
		if (win) {
			win.focus();
		} else {
			window.location.href = redirect;
		}
	});

	jQuery('.pwbe-intro').css('display', 'none');
	jQuery('.pwbe-filter').css('display', 'block');

	return false;
}

function pwbeShowDialog(dialogName, contentName, owner, attributes) {

	var dialog = jQuery('#pwbe-' + dialogName + '-dialog');
	var content = jQuery('#pwbe-dialog-content-' + contentName);

	if (attributes) {
		for (var key in attributes) {
			content.attr(key, attributes[key]);
		}
	}

	// Grey out the background.
	var overlay = jQuery('<div class="pwbe-overlay">');
	jQuery('body').append(overlay);
	overlay.css('top', jQuery('#wpadminbar').height() + 'px');
	overlay.css('left', jQuery('#adminmenuwrap').width() + 'px');
	overlay.css('display', 'block');

	// Make sure all open editors have been closed.
	jQuery('.pwbe-field-edit-button-cancel').click();

	dialog.css('position', 'fixed');
	dialog.css('display', 'inline');
	dialog.css('height', '');
	dialog.css('width', '');

	if (owner) {
		// popup from clicked position
		dialog.css('left', Math.max(jQuery('#adminmenuwrap').width(), owner.offset().left - jQuery(window).scrollLeft()));
		dialog.css('top', Math.max(jQuery('#wpadminbar').height(), owner.offset().top - jQuery(window).scrollTop()));
	} else {
		// center on form
		dialog.css('left', jQuery('.pwbe-filter').position().left + (jQuery('.pwbe-filter').width() / 2) - dialog.width());
		dialog.css('top', jQuery('.pwbe-filter').position().top);
	}

	// Hide all editors except the one we're about to use.
	jQuery('.pwbe-dialog-content').css('display', 'none');

	var func = content.attr('data-function');
	window[func]('init');

	// Show the editor (only the selected DIV will be visible).
	content.css('display', 'block');
	dialog.css('display', 'block');

	var maxWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	var rightEdge = (jQuery('#adminmenuwrap').width() + dialog.position().left + dialog.width() + 50);
	if (rightEdge >= maxWidth) {
		dialog.css('left', dialog.position().left + (maxWidth - rightEdge));
	}

	dialog.draggable({ handle: '.pwbe-dialog-heading' });

	return dialog;
}

function pwbeFilterManagerDialogClose() {
	var dialog = jQuery('#pwbe-filter-manager-dialog');
	var func = dialog.find('.pwbe-dialog-content:visible:first').attr('data-function');

	dialog.css('display', 'none');
	jQuery('.pwbe-overlay').remove();

	window[func]('reset');
}

function pwbeLoadSavedFilters(data) {
	jQuery('#pwbe-show-all-variations').prop('checked', false);

	if (data) {
		data = jQuery.parseJSON(data);

		jQuery('.pwbe-filter-row-container').find('.pwbe-filter-row').remove();

		var row;
		var justAddedGroup = false;
		for (var i = 0, len = data.length; i < len; i++) {
			var name = data[i].name;
			var value = data[i].value;

			if (name == 'show_all_variations') {
				jQuery('#pwbe-show-all-variations').prop('checked', value);

			} else if (name == 'row[]') {
				if (value == 'group') {
					var newGroup = pwbeAddRow(row, '-group');
					row = pwbeAddRow(newGroup);
					justAddedGroup = true;
				} else {
					if (!justAddedGroup) {
						row = pwbeAddRow(row);
					}
					justAddedGroup = false;
				}

			} else {
				var el = jQuery('[name="' + name + '"]');

				switch (el.prop('type')) {
					case 'checkbox':
						el.prop('checked', true);
					break;

					case 'radio':
						el.filter('[value="' + value + '"]').prop('checked', true);
					break;

					case 'select-multiple':
						var values = [value];

						while (i + 1 < len && data[i + 1].name == name) {
							i++;
							values.push(data[i].value);
						}
						el.val(values);
					break;

					default:
						el.val(value);
					break;
				}

				el.trigger('change');
			}
			pwbeNameAllInputs();
		}

		pwbeSetFilterDirtyStatus('false');

	} else {
		pwbeInitFilters();

		setTimeout(function() {
			jQuery('.pwbe-filter-row-container').find('.pwbe-filter-value').first().focus();
		});
	}
}

function pwbeInitFilters(group) {
	if (!group) { group = ''; }

	jQuery('.pwbe-filter-row-container').find('.pwbe-filter-row').remove();
	jQuery('.pwbe-filter-remove').css('display', 'none');
	pwbeSetFilterDirtyStatus('false');
	jQuery('#pwbe-filter-group').val('pwbe_and');

	var newRow = jQuery('.pwbe-row-template' + group).clone(true).removeClass('pwbe-row-template' + group);
	jQuery('.pwbe-filter-row-container').append(newRow);
	newRow.find('.pwbe-filter-name').val('post_title');
	pwbePrepareCriteria(newRow);

	jQuery('.pwbe-filter-row-container').find('.pwbe-filter-value').first().focus();

	return newRow;
}

function pwbeAddRow(row, group) {
	if (!row) {
		return pwbeInitFilters(group);
	}

	if (!group) { group = ''; }

	var newRow = jQuery('.pwbe-row-template' + group).clone(true).removeClass('pwbe-row-template' + group);

	if ( group == '' ) {
		newRow.find('.pwbe-filter-name').val('post_title');
	}

	var margin = row.css('margin-left');

	if (row.hasClass('pwbe-filter-group-row')) {
		newRow.appendTo(row);
		newRow.css('margin-left', parseInt(margin) + 30);
	} else {
		newRow.insertAfter(row);
		newRow.css('margin-left', margin);
	}

	pwbePrepareCriteria(newRow);

	pwbeSetFilterDirtyStatus('true');

	newRow.find('.pwbe-filter-value').focus();

	jQuery('.pwbe-filter-remove').css('display', 'inline-block');

	return newRow;
}

function pwbeRemoveRow(row) {
	if (row.parent().children('.pwbe-filter-row').length == 1 && jQuery('.pwbe-filter-row-container').length > 1) {
		row.parent().remove();
	}

	var a = row.next().find('.pwbe-filter-value').first();
	if (a.length == 0) {
		a = row.prev().find('.pwbe-filter-value').first();
	}
	a.focus();
	row.remove();

	if (jQuery('.pwbe-filter-row-container .pwbe-filter-row').length == 1) {
		jQuery('.pwbe-filter-remove').css('display', 'none');

	} else if (jQuery('.pwbe-filter-row-container .pwbe-filter-row').length == 0) {
		pwbeInitFilters();
	}
}

function pwbePrepareCriteria(row) {
	pwbePrepareTypeDropdown(row);
	pwbePrepareValueInput(row);
	pwbeNameAllInputs();
}

function pwbePrepareTypeDropdown(row) {
	if (!row) { return; }

	var nameType = row.find('.pwbe-filter-name option:selected').attr('data-type');
	if (!nameType) { return; }

	var dropdown = row.find('.pwbe-filter-type').first();
	dropdown.empty();

	var types;
	var translatedTypes;
	switch (nameType) {
		case 'boolean':
			types = pwbeFilters.booleanTypes;
			translatedTypes = pwbeFilters.i18n.booleanTypes;
		break;

		case 'numeric':
		case 'currency':
			types = pwbeFilters.numericTypes;
			translatedTypes = pwbeFilters.i18n.numericTypes;
		break;

		case 'attributes':
		case 'categories':
		case 'tags':
		case 'multiselect':
			types = pwbeFilters.multiSelectTypes;
			translatedTypes = pwbeFilters.i18n.multiSelectTypes;
		break;

		case 'statuses':
		case 'stock_statuses':
		case 'product_type':
		case 'yith_shop_vendor':
		case 'tax_classes':
		case 'tax_statuses':
		case 'wpml':
		case 'store':
		case 'lieferzeit':
		case 'select':
			types = pwbeFilters.selectTypes;
			translatedTypes = pwbeFilters.i18n.selectTypes;
		break;

		case 'catalog_visibility':
			types = pwbeFilters.catalogVisibilityTypes;
			translatedTypes = pwbeFilters.i18n.catalogVisibilityTypes;
		break;

		case 'image':
			types = pwbeFilters.imageTypes;
			translatedTypes = pwbeFilters.i18n.imageTypes;
		break;

		default:
			types = pwbeFilters.stringTypes;
			translatedTypes = pwbeFilters.i18n.stringTypes;
		break;
	}

	for (var i = 0; i < types.length; i++) {
		var selected = '';

		dropdown.append('<option value="' + types[i] + '">' + translatedTypes[i] + '</option>');
	}
}

function pwbePrepareValueInput(row) {
	if (!row) { return; }

	var selectedOption = row.find('.pwbe-filter-name option:selected');
	if (!selectedOption) { return; }

	var key = selectedOption.attr('data-key');

	var nameType = selectedOption.attr('data-type');
	if (!nameType) { return; }

	row.find('.pwbe-filter-required').css('display', 'none');

	var filterType = row.find('.pwbe-filter-type');
	var valueType = filterType.find('option:selected').val();
	var value = row.find('.pwbe-filter-value');

	if (nameType == 'boolean' || valueType == 'is empty' || valueType == 'is not empty') {
		pwbeRemoveValue(row);
		return;
	}

	switch (nameType) {
		case 'attributes':
		case 'categories':
		case 'tags':
		case 'statuses':
		case 'stock_statuses':
		case 'catalog_visibility':
		case 'image':
		case 'product_type':
		case 'yith_shop_vendor':
		case 'tax_classes':
		case 'tax_statuses':
		case 'wpml':
		case 'store':
		case 'lieferzeit':
		case 'multiselect':
		case 'select':
			var dropdownTemplate = (nameType == 'attributes') ? 'attribute_' + selectedOption.val() : nameType;
			if (key) {
				dropdownTemplate = key;
			}

			if ( value.parent().attr('data-dropdown-template') != dropdownTemplate ) {
				pwbeRemoveValue(row);

				var filterTemplate = jQuery('.pwbe-filter-' + nameType + '-template').clone(true).removeClass('pwbe-filter-' + nameType + '-template');
				if (key) {
					filterTemplate = jQuery('.pwbe-filter-' + key + '-template').clone(true).removeClass('pwbe-filter-' + key + '-template');
				}

				var filterSelect = filterTemplate.find('select');
				filterTemplate.insertAfter(filterType);

				jQuery('.pwbe-dropdown-template-' + dropdownTemplate + ' option').clone().appendTo(filterSelect);
				filterSelect.attr('data-dropdown-template', dropdownTemplate);

				if (!pwbe.select2filterBypass.includes(nameType)) {
					if (pwbe.select2copypaste) {
						filterSelect.pwbeselect2({ placeholder: 'Select values...', tokenSeparators: [','], tags: true, multiple: true });
					} else {
						filterSelect.pwbeselect2({ placeholder: 'Select values...' });
					}
				}
			}
		break;

		default:
			pwbeRemoveValue(row);

			var text = jQuery('.pwbe-filter-value-template').clone(true).removeClass('pwbe-filter-value-template');
			text.insertAfter(filterType);
			text.focus();

			if (valueType == 'is in the range') {
				jQuery('.pwbe-filter-value2-template').clone(true).removeClass('pwbe-filter-value2-template').insertAfter(text);
			} else {
				row.find('.pwbe-filter-value2-container').remove();
			}
		break;
	}

	pwbeNameAllInputs();
}

function pwbeRemoveValue(row) {
	var value = row.find('.pwbe-filter-value');

	if (value.data('pwbeselect2')) {
		value.pwbeselect2('destroy');
		value.parent().remove();
	} else {
		value.remove();
		row.find('.pwbe-filter-value2-container').remove();
	}
}

function pwbeNameAllInputs() {
	pwbeNameInputs(0, jQuery('.pwbe-filter-row-container'), '-0');
}

function pwbeNameInputs(rowIndex, container, suffix) {
	var rows = container.children('.pwbe-filter-row').not('.pwbe-row-template, .pwbe-row-template-group');
	for(var i = 0, len = rows.length; i < len; i++) {
		var row = jQuery(rows[i]);

		row.attr('data-suffix', suffix);

		row.find('.pwbe-filter-name').attr('name', rowIndex + 'filter_name' + suffix);
		row.find('.pwbe-filter-type').attr('name', rowIndex + 'filter_type' + suffix);
		row.find('.pwbe-filter-value').attr('name', rowIndex + 'filter_value' + suffix);
		row.find('.pwbe-filter-value2').attr('name', rowIndex + 'filter_value2' + suffix);
		row.find('.pwbe-filter-select').attr('name', rowIndex + 'filter_select' + suffix + '[]');

		rowIndex++;

		if (row.hasClass('pwbe-filter-group-row')) {
			pwbeNameInputs(rowIndex, row, suffix + '-' + i);
		}
	}
}

function pwbeFilterIsDirty() {
	if (jQuery('#pwbe-filters-form').attr('data-dirty') != 'false') {
		return true;
	} else {
		return false;
	}
}

function pwbeSetFilterDirtyStatus(status) {
	jQuery('#pwbe-filters-form').attr('data-dirty', status);
}

jQuery.fn.pwbe_highlight = function () {
	jQuery(this).each(function () {
		var el = jQuery(this);
		jQuery('<div/>')
		.width(el.outerWidth())
		.height(el.outerHeight())
		.css({
			'position': 'absolute',
			'left': el.offset().left,
			'top': el.offset().top,
			'background-color': '#ffff99',
			'opacity': '.9',
			'border-radius': '3px',
			'z-index': '9999999'
		}).appendTo('body').fadeOut(1000).queue(function () { jQuery(this).remove(); });
	});
};
