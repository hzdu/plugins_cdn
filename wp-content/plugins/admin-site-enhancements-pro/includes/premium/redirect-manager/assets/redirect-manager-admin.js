/**
 * Redirect Manager Admin JavaScript
 *
 * @since 8.1.0
 */

(function($) {
	'use strict';

	/**
	 * Redirect Manager Admin Object
	 */
	const RedirectManagerAdmin = {
		
		/**
		 * Initialize
		 */
		init: function() {
			this.setupDuplicateCheck();
			this.setupAutocomplete();
			this.setupStatusCodeChange();
			this.setupGroupManagement();
			this.setupDescriptionToggle();
		},

		/**
		 * Setup duplicate redirect checking with debounce
		 */
		setupDuplicateCheck: function() {
			const $redirectFrom = $('#redirect_from');
			const $warningDiv = $('.asenha-redirect-duplicate-warning');
			let debounceTimer;

			if ($redirectFrom.length === 0) {
				return;
			}

			$redirectFrom.on('input', function() {
				clearTimeout(debounceTimer);
				
				const redirectFrom = $(this).val().trim();
				
				// Hide warning if field is empty
				if (redirectFrom === '') {
					$warningDiv.hide();
					return;
				}

				// Debounce AJAX request (800ms)
				debounceTimer = setTimeout(function() {
					RedirectManagerAdmin.checkDuplicate(redirectFrom);
				}, 800);
			});
		},

		/**
		 * Check for duplicate redirect via AJAX
		 *
		 * @param {string} redirectFrom The redirect from path
		 */
		checkDuplicate: function(redirectFrom) {
			const $warningDiv = $('.asenha-redirect-duplicate-warning');
			
			$.ajax({
				url: asenhaRedirectManager.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_check_duplicate_redirect',
					nonce: asenhaRedirectManager.nonce,
					redirect_from: redirectFrom,
					post_id: asenhaRedirectManager.postId
				},
				success: function(response) {
					if (response.success && response.data.exists) {
						const message = asenhaRedirectManager.duplicateWarning.replace(
							'%s',
							response.data.edit_link
						);
						$warningDiv.find('p').html(message);
						$warningDiv.show();
					} else {
						$warningDiv.hide();
					}
				},
				error: function() {
					$warningDiv.hide();
				}
			});
		},

		/**
		 * Setup autocomplete for redirect to field
		 */
		setupAutocomplete: function() {
			const $redirectTo = $('#redirect_to');

			if ($redirectTo.length === 0 || typeof $.ui === 'undefined' || typeof $.ui.autocomplete === 'undefined') {
				return;
			}

			$redirectTo.autocomplete({
				source: function(request, response) {
					$.ajax({
						url: asenhaRedirectManager.ajaxUrl,
						type: 'POST',
						dataType: 'json',
						data: {
							action: 'asenha_autocomplete_redirect_to',
							nonce: asenhaRedirectManager.nonce,
							term: request.term
						},
						success: function(data) {
							if (data.success) {
								response(data.data);
							} else {
								response([]);
							}
						},
						error: function() {
							response([]);
						}
					});
				},
				minLength: 2,
				select: function(event, ui) {
					$(this).val(ui.item.value);
					return false;
				}
			});
		},

		/**
		 * Setup action type and status code change handlers
		 * Filter status codes based on action type
		 * Show/hide message field for error status codes
		 * Show/hide redirect to field for error status codes
		 */
		setupStatusCodeChange: function() {
			const $actionType = $('#redirect_action_type');
			const $statusCode = $('#redirect_http_status_code');
			const $messageField = $('.asenha-message-field');
			const $redirectToField = $('.redirect-to-field');
			const $redirectToInput = $('#redirect_to');
			const $stripParamsField = $('.redirect-strip-params-field');
			const $defaultMessageField = $('.asenha-default-message-field');
			const $defaultMessageText = $('.asenha-default-message-text');
			const $defaultMessageInfo = $('.asenha-default-message-info');

			if ($actionType.length === 0 || $statusCode.length === 0 || $messageField.length === 0) {
				return;
			}

			// Define status code groups
			const redirectCodes = [301, 302, 303, 304, 307, 308];
			const errorCodes = [400, 401, 403, 404, 410, 500, 501, 503];
			const errorCodesWithMessage = [400, 401, 403, 410, 500, 501, 503]; // Exclude 404

			// Filter status code options based on action type
			const filterStatusCodes = function(actionType) {
				const $options = $statusCode.find('option');
				const currentValue = parseInt($statusCode.val());
				let newValue = null;

				// Set default values based on action type
				const defaultValues = {
					'redirect': 302,
					'error': 403
				};

				// Show/hide options based on action type
				$options.each(function() {
					const $option = $(this);
					const optionActionType = $option.attr('data-action-type');
					
					if (optionActionType === actionType) {
						$option.show();
						// Set default value if current value doesn't match action type
						if (newValue === null) {
							newValue = parseInt($option.val());
						}
					} else {
						$option.hide();
					}
				});

				// Update status code if current value doesn't match action type
				const isCurrentValueValid = (actionType === 'redirect' && redirectCodes.includes(currentValue)) ||
											(actionType === 'error' && errorCodes.includes(currentValue));
				
				if (!isCurrentValueValid) {
					// Use the appropriate default value
					$statusCode.val(defaultValues[actionType] || newValue);
				}
			};

			// Handle action type changes
			$actionType.on('change', function() {
				const actionType = $(this).val();
				filterStatusCodes(actionType);
				
				// Trigger status code change to update dependent fields
				$statusCode.trigger('change');
			});

			// Handle status code changes
			$statusCode.on('change', function() {
				const statusCode = parseInt($(this).val());
				const isErrorCode = errorCodes.includes(statusCode);
				const showMessage = errorCodesWithMessage.includes(statusCode);
				
				// Handle default message field (show for all error codes including 404)
				if (statusCode === 404 && typeof asenhaRedirectManager.default404Message !== 'undefined') {
					// Special message for 404 without "Default message:" prefix
					$defaultMessageInfo.text(asenhaRedirectManager.default404Message);
					$defaultMessageField.slideDown(200);
				} else if (showMessage && typeof asenhaRedirectManager.defaultErrorMessages !== 'undefined' && asenhaRedirectManager.defaultErrorMessages[statusCode]) {
					// Regular error messages for other codes with "Default message:" prefix
					$defaultMessageInfo.empty()
						.append(asenhaRedirectManager.defaultMessagePrefix + ' ')
						.append($('<span class="asenha-default-message-text">').text(asenhaRedirectManager.defaultErrorMessages[statusCode]));
					$defaultMessageField.slideDown(200);
				} else {
					$defaultMessageField.slideUp(200);
				}
				
				// Handle message field (show for error codes except 404)
				if (showMessage) {
					$messageField.slideDown(200);
				} else {
					$messageField.slideUp(200);
				}

				// Handle redirect to field (hide for all error codes)
				if (isErrorCode) {
					$redirectToField.slideUp(200);
					$redirectToInput.prop('required', false);
					$stripParamsField.slideUp(200);
				} else {
					$redirectToField.slideDown(200);
					$redirectToInput.prop('required', true);
					$stripParamsField.slideDown(200);
				}
			});

			// Initialize on page load
			filterStatusCodes($actionType.val());
			$statusCode.trigger('change');
		},

		/**
		 * Setup group management
		 */
		setupGroupManagement: function() {
			const $addBtn = $('.asenha-add-group-btn');
			const $editBtn = $('.asenha-edit-group-btn');
			const $deleteBtn = $('.asenha-delete-group-btn');
			const $groupSelect = $('#redirect_group');

			// Add group
			$addBtn.on('click', function(e) {
				e.preventDefault();
				
				const groupName = prompt(asenhaRedirectManager.groupAddPrompt);
				
				if (!groupName || groupName.trim() === '') {
					return;
				}

				RedirectManagerAdmin.addGroup(groupName.trim());
			});

			// Edit group
			$editBtn.on('click', function(e) {
				e.preventDefault();
				
				const selectedGroup = $groupSelect.val();
				
				if (!selectedGroup || selectedGroup === '') {
					alert(asenhaRedirectManager.groupSelectFirstEdit);
					return;
				}

				const newGroupName = prompt(asenhaRedirectManager.groupEditPrompt, selectedGroup);
				
				if (!newGroupName || newGroupName.trim() === '') {
					return;
				}

				// If name hasn't changed, do nothing
				if (newGroupName.trim() === selectedGroup) {
					return;
				}

				RedirectManagerAdmin.editGroup(selectedGroup, newGroupName.trim());
			});

			// Delete group
			$deleteBtn.on('click', function(e) {
				e.preventDefault();
				
				const selectedGroup = $groupSelect.val();
				
				if (!selectedGroup || selectedGroup === '') {
					alert(asenhaRedirectManager.groupSelectFirstDelete);
					return;
				}

				if (!confirm(asenhaRedirectManager.groupDeleteConfirm)) {
					return;
				}

				RedirectManagerAdmin.deleteGroup(selectedGroup);
			});
		},

		/**
		 * Add new group via AJAX
		 *
		 * @param {string} groupName The group name
		 */
		addGroup: function(groupName) {
			const $groupSelect = $('#redirect_group');
			
			$.ajax({
				url: asenhaRedirectManager.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_add_redirect_group',
					nonce: asenhaRedirectManager.nonce,
					group_name: groupName
				},
				beforeSend: function() {
					$groupSelect.prop('disabled', true);
				},
				success: function(response) {
					if (response.success) {
						// Rebuild dropdown with sorted groups and select the new group
						RedirectManagerAdmin.rebuildGroupSelect(response.data.groups, groupName);
					} else {
						alert(response.data.message || asenhaRedirectManager.groupAddError);
					}
				},
				error: function() {
					alert(asenhaRedirectManager.groupAddError + ' ' + asenhaRedirectManager.groupTryAgain);
				},
				complete: function() {
					$groupSelect.prop('disabled', false);
				}
			});
		},

		/**
		 * Edit group via AJAX
		 *
		 * @param {string} oldGroupName The old group name
		 * @param {string} newGroupName The new group name
		 */
		editGroup: function(oldGroupName, newGroupName) {
			const $groupSelect = $('#redirect_group');
			
			$.ajax({
				url: asenhaRedirectManager.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_edit_redirect_group',
					nonce: asenhaRedirectManager.nonce,
					old_group_name: oldGroupName,
					new_group_name: newGroupName
				},
				beforeSend: function() {
					$groupSelect.prop('disabled', true);
				},
				success: function(response) {
					if (response.success) {
						// Rebuild dropdown with sorted groups and select the renamed group
						RedirectManagerAdmin.rebuildGroupSelect(response.data.groups, newGroupName);
					} else {
						alert(response.data.message || asenhaRedirectManager.groupEditError);
					}
				},
				error: function() {
					alert(asenhaRedirectManager.groupEditError + ' ' + asenhaRedirectManager.groupTryAgain);
				},
				complete: function() {
					$groupSelect.prop('disabled', false);
				}
			});
		},

		/**
		 * Delete group via AJAX
		 *
		 * @param {string} groupName The group name
		 */
		deleteGroup: function(groupName) {
			const $groupSelect = $('#redirect_group');
			
			$.ajax({
				url: asenhaRedirectManager.ajaxUrl,
				type: 'POST',
				data: {
					action: 'asenha_delete_redirect_group',
					nonce: asenhaRedirectManager.nonce,
					group_name: groupName
				},
				beforeSend: function() {
					$groupSelect.prop('disabled', true);
				},
				success: function(response) {
					if (response.success) {
						// Remove option from select
						$groupSelect.find('option[value="' + groupName + '"]').remove();
						$groupSelect.val('');
						
						// Show success message (optional)
						// You could add a notification here
					} else {
						alert(response.data.message || asenhaRedirectManager.groupDeleteError);
					}
				},
				error: function() {
					alert(asenhaRedirectManager.groupDeleteError + ' ' + asenhaRedirectManager.groupTryAgain);
				},
				complete: function() {
					$groupSelect.prop('disabled', false);
				}
			});
		},

		/**
		 * Rebuild group select dropdowns with sorted groups
		 *
		 * @param {Array} groups Sorted array of group names
		 * @param {string} selectedValue Optional value to select after rebuild
		 */
		rebuildGroupSelect: function(groups, selectedValue) {
			// Update all group select dropdowns on the page (including quick edit)
			$('select[name="redirect_group"], select[name="redirect_group_quick"], #redirect_group').each(function() {
				const $select = $(this);
				
				// Preserve the empty/none option
				const $emptyOption = $select.find('option[value=""]');
				const emptyOptionHtml = $emptyOption.length > 0 ? $emptyOption.prop('outerHTML') : '<option value="">' + '— None —' + '</option>';
				
				// Clear all options and rebuild
				$select.empty();
				$select.append(emptyOptionHtml);
				
				// Add sorted group options
				groups.forEach(function(groupName) {
					$select.append(
						$('<option>', {
							value: groupName,
							text: groupName
						})
					);
				});
				
				// Set selected value if provided
				if (selectedValue) {
					$select.val(selectedValue);
				}
			});
		},

		/**
		 * Setup description toggle
		 */
		setupDescriptionToggle: function() {
			const $metabox = $('#asenha_redirect_configuration');
			
			if ($metabox.length === 0) {
				return;
			}

			const $header = $metabox.find('.postbox-header');
			
			if ($header.length === 0) {
				return;
			}

			// Create checkbox input
			const $checkbox = $('<input>', {
				type: 'checkbox',
				id: 'asenha-toggle-descriptions',
				class: 'asenha-toggle-descriptions-checkbox'
			});

			// Create label
			const $label = $('<label>', {
				for: 'asenha-toggle-descriptions',
				class: 'asenha-toggle-descriptions-label',
				text: asenhaRedirectManager.hideDescriptions
			});

			// Insert checkbox and label before toggle indicator or handle actions
			const $handleActions = $header.find('.handle-actions');
			const $toggleIndicator = $header.find('.toggle-indicator');
			
			if ($handleActions.length > 0) {
				$checkbox.insertBefore($handleActions);
				$label.insertBefore($handleActions);
			} else if ($toggleIndicator.length > 0) {
				$checkbox.insertBefore($toggleIndicator);
				$label.insertBefore($toggleIndicator);
			} else {
				$header.append($checkbox);
				$header.append($label);
			}

			// Get cookie value
			const cookieValue = this.getCookie('asenha_redirect_hide_descriptions');
			let descriptionsHidden = cookieValue === '1';

			// Apply saved state on page load
			if (descriptionsHidden) {
				$metabox.find('p.description').hide();
				$checkbox.prop('checked', true);
			}

			// Toggle handler
			$checkbox.on('change', function() {
				const $descriptions = $metabox.find('p.description');
				
				if ($(this).is(':checked')) {
					// Hide descriptions
					$descriptions.slideUp(100);
					RedirectManagerAdmin.setCookie('asenha_redirect_hide_descriptions', '1', 365);
					descriptionsHidden = true;
				} else {
					// Show descriptions
					$descriptions.slideDown(100);
					RedirectManagerAdmin.setCookie('asenha_redirect_hide_descriptions', '0', 365);
					descriptionsHidden = false;
				}
			});
		},

		/**
		 * Get cookie value
		 *
		 * @param {string} name Cookie name
		 * @return {string|null} Cookie value or null if not found
		 */
		getCookie: function(name) {
			const nameEQ = name + '=';
			const ca = document.cookie.split(';');
			
			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) === ' ') {
					c = c.substring(1, c.length);
				}
				if (c.indexOf(nameEQ) === 0) {
					return c.substring(nameEQ.length, c.length);
				}
			}
			
			return null;
		},

		/**
		 * Set cookie
		 *
		 * @param {string} name Cookie name
		 * @param {string} value Cookie value
		 * @param {number} days Days until expiry
		 */
		setCookie: function(name, value, days) {
			let expires = '';
			
			if (days) {
				const date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = '; expires=' + date.toUTCString();
			}
			
			document.cookie = name + '=' + value + expires + '; path=/';
		}

	};

	/**
	 * Quick Edit Functionality
	 */
	const QuickEditManager = {
		
		/**
		 * Initialize
		 */
		init: function() {
			this.setupQuickEdit();
		},

	/**
	 * Setup quick edit
	 */
	setupQuickEdit: function() {
		$('#the-list').on('click', '.editinline', function() {
			const postId = $(this).closest('tr').attr('id').replace('post-', '');
			const $row = $('#edit-' + postId);
			
			// Wait for WordPress to render quick edit
			setTimeout(function() {
				QuickEditManager.reorganizeFields($row);
				
				const $inlineData = $('#asenha_redirect_data_' + postId);
				if ($inlineData.length > 0) {
					QuickEditManager.populateQuickEditFields($inlineData);
				}
				
				// Setup status code filtering
				QuickEditManager.setupQuickEditStatusCodeFiltering();
			}, 100);
		});
	},

	/**
	 * Reorganize fields into WordPress columns
	 *
	 * @param {jQuery} $row The quick edit row
	 */
	reorganizeFields: function($row) {
		// Find our custom fields container
		const $customFields = $row.find('.asenha-redirect-quick-edit-fields');
		
		if ($customFields.length === 0) {
			return;
		}
		
		// Find WordPress's existing columns
		const $leftCol = $row.find('.inline-edit-col-left .inline-edit-col').first();
		const $rightCol = $row.find('.inline-edit-col-right .inline-edit-col').first();
		
		if ($leftCol.length === 0 || $rightCol.length === 0) {
			return;
		}
		
		// Move fields to left column
		$customFields.find('.asenha-qe-redirect-from').appendTo($leftCol).show();
		$customFields.find('.asenha-qe-regex-enabled').appendTo($leftCol).show();
		$customFields.find('.asenha-qe-redirect-to').appendTo($leftCol).show();
		$customFields.find('.asenha-qe-strip-params').appendTo($leftCol).show();
		$customFields.find('.asenha-qe-action-type').appendTo($leftCol).show();
		$customFields.find('.asenha-qe-status-code').appendTo($leftCol).show();
		
		// Move fields to right column (before status field)
		const $statusField = $rightCol.find('.inline-edit-status');
		$customFields.find('.asenha-qe-group').insertBefore($statusField).show();
		$customFields.find('.asenha-qe-notes').insertBefore($statusField).show();
		$customFields.find('.asenha-qe-message').insertBefore($statusField).show();
	},

		/**
		 * Populate quick edit fields
		 *
		 * @param {jQuery} $inlineData The inline data div
		 */
		populateQuickEditFields: function($inlineData) {
			const data = {
				redirectFrom: $inlineData.find('.redirect_from').text(),
				redirectTo: $inlineData.find('.redirect_to').text(),
				statusCode: $inlineData.find('.status_code').text(),
				regexEnabled: $inlineData.find('.regex_enabled').text() === '1',
				stripParams: $inlineData.find('.strip_params').text() === '1',
				group: $inlineData.find('.group').text(),
				notes: $inlineData.find('.notes').text(),
				message: $inlineData.find('.message').text()
			};

		// Determine action type from status code
		const redirectCodes = [301, 302, 303, 304, 307, 308];
		const errorCodes = [400, 401, 403, 404, 410, 500, 501, 503];
		const statusCodeInt = parseInt(data.statusCode);
		const actionType = errorCodes.includes(statusCodeInt) ? 'error' : 'redirect';

		// Populate fields
		$('.redirect_from_quick').val(data.redirectFrom);
		$('.redirect_to_quick').val(data.redirectTo);
		$('.redirect_action_type_quick').val(actionType);
		$('.redirect_http_status_code_quick').val(data.statusCode);
		$('.redirect_regex_enabled_quick').prop('checked', data.regexEnabled);
		$('.redirect_strip_params_quick').prop('checked', data.stripParams);
		$('.redirect_group_quick').val(data.group);
		$('.redirect_notes_quick').val(data.notes);
		$('.redirect_message_quick').val(data.message);
		},

	/**
	 * Setup status code filtering for quick edit
	 */
	setupQuickEditStatusCodeFiltering: function() {
		const $actionType = $('.redirect_action_type_quick');
		const $statusCode = $('.redirect_http_status_code_quick');
		
		if ($actionType.length === 0 || $statusCode.length === 0) {
			return;
		}

		// Define status code groups
		const redirectCodes = [301, 302, 303, 304, 307, 308];
		const errorCodes = [400, 401, 403, 404, 410, 500, 501, 503];

		// Filter status code options based on action type
		const filterStatusCodes = function(actionType) {
			const $options = $statusCode.find('option');
			const currentValue = parseInt($statusCode.val());
			let newValue = null;

			// Set default values based on action type
			const defaultValues = {
				'redirect': 302,
				'error': 403
			};

			// Show/hide options based on action type
			$options.each(function() {
				const $option = $(this);
				const optionActionType = $option.attr('data-action-type');
				
				if (optionActionType === actionType) {
					$option.show();
					// Set default value if current value doesn't match action type
					if (newValue === null) {
						newValue = parseInt($option.val());
					}
				} else {
					$option.hide();
				}
			});

			// Update status code if current value doesn't match action type
			const isCurrentValueValid = (actionType === 'redirect' && redirectCodes.includes(currentValue)) ||
										(actionType === 'error' && errorCodes.includes(currentValue));
			
			if (!isCurrentValueValid) {
				// Use the appropriate default value
				$statusCode.val(defaultValues[actionType] || newValue);
			}
		};

		// Handle action type changes
		$actionType.on('change', function() {
			const actionType = $(this).val();
			filterStatusCodes(actionType);
		});

		// Initialize on setup
		filterStatusCodes($actionType.val());
	}
	};

	/**
	 * Tips Accordion Manager
	 */
	var TipsAccordionManager = {
		/**
		 * Initialize
		 */
		init: function() {
			this.setupAccordion();
			this.restoreAccordionState();
		},

		/**
		 * Setup accordion click handlers
		 */
		setupAccordion: function() {
			var self = this;
			
			// Click handler for accordion headers
			$('.asenha-tips-accordion__header').on('click', function() {
				self.toggleAccordion($(this));
			});
			
			// Keyboard accessibility - Enter and Space keys
			$('.asenha-tips-accordion__header').on('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					self.toggleAccordion($(this));
				}
			});
		},

		/**
		 * Toggle accordion open/close
		 * 
		 * @param {jQuery} $header The accordion header element
		 */
		toggleAccordion: function($header) {
			var $content = $header.next('.asenha-tips-accordion__content');
			var isOpen = $header.hasClass('is-open');
			var accordionId = $header.closest('.asenha-tips-accordion__item').index();
			
			if (isOpen) {
				// Close accordion
				$header.removeClass('is-open').attr('aria-expanded', 'false');
				$content.removeClass('is-open').slideUp(200);
				this.saveAccordionState(accordionId, false);
			} else {
				// Open accordion
				$header.addClass('is-open').attr('aria-expanded', 'true');
				$content.addClass('is-open').slideDown(200);
				this.saveAccordionState(accordionId, true);
			}
		},

		/**
		 * Save accordion state to localStorage
		 * 
		 * @param {number} accordionId The accordion index
		 * @param {boolean} isOpen Whether the accordion is open
		 */
		saveAccordionState: function(accordionId, isOpen) {
			try {
				var state = this.getAccordionState();
				state[accordionId] = isOpen;
				localStorage.setItem('asenha_redirect_tips_accordion_state', JSON.stringify(state));
			} catch (e) {
				// localStorage might not be available
			}
		},

		/**
		 * Get accordion state from localStorage
		 * 
		 * @return {Object} Accordion state object
		 */
		getAccordionState: function() {
			try {
				var state = localStorage.getItem('asenha_redirect_tips_accordion_state');
				return state ? JSON.parse(state) : {};
			} catch (e) {
				return {};
			}
		},

		/**
		 * Restore accordion state from localStorage
		 */
		restoreAccordionState: function() {
			var self = this;
			var state = this.getAccordionState();
			
			$('.asenha-tips-accordion__item').each(function(index) {
				if (state[index] === true) {
					var $header = $(this).find('.asenha-tips-accordion__header');
					var $content = $(this).find('.asenha-tips-accordion__content');
					
					$header.addClass('is-open').attr('aria-expanded', 'true');
					$content.addClass('is-open').show();
				}
			});
		}
	};

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function() {
		// Check if we're on the redirect edit/new page
		if ($('body').hasClass('post-type-asenha_redirect')) {
			RedirectManagerAdmin.init();
			QuickEditManager.init();
			TipsAccordionManager.init();
		}
	});

})(jQuery);