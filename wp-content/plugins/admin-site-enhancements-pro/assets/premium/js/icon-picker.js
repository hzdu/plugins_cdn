(function( $ ) {
	'use strict';

	$(document).ready( function() {

		// ===== ICON PICKER FOR ADMIN MENU ORGANIZER =====
		
		/**
		 * Handle "Change Icon" button click
		 * Load icon library via AJAX if not already loaded for this menu item
		 */
		$(document).on('click', '.icon-picker-button', function(e) {
			e.preventDefault();
			
			var button = $(this);
			var menuItemId = button.data('menu-item-id');
			
			// Find the container for this specific menu item using closest
			var menuItem = button.closest('.menu-item, .sortable-item');
			var iconLibraryContainer = menuItem.find('.icon-library-container[data-menu-item-id="' + menuItemId + '"]');
			var spinner = menuItem.find('.icon-picker-spinner');
			var searchInput = menuItem.find('.icon-picker-search[data-menu-item-id="' + menuItemId + '"]');
			var closeButton = iconLibraryContainer.find('.icon-picker-close');
			
			// Check if icons are already loaded
			var iconsLoaded = iconLibraryContainer.data('icons-loaded');
			
			if (!iconsLoaded) {
				// Show spinner
				spinner.show();
				
				// Make AJAX call to load icon library
				var loadIconNonce = '';
				if ( typeof amoPageVars !== 'undefined' && amoPageVars.loadIconLibraryNonce ) {
					loadIconNonce = amoPageVars.loadIconLibraryNonce;
				} else if ( typeof abcePageVars !== 'undefined' && abcePageVars.loadIconLibraryNonce ) {
					loadIconNonce = abcePageVars.loadIconLibraryNonce;
				}
				$.ajax({
					type: 'post',
					url: ajaxurl,
					data: {
						'action': 'load_icon_library',
						'nonce': loadIconNonce
					},
					success: function(response) {
						// Hide spinner
						spinner.hide();
						
						if (response.success && response.data.html) {
							// Insert icon library HTML
							iconLibraryContainer.html(response.data.html);
							
							// Re-add close button at the end
							iconLibraryContainer.prepend('<span class="icon-picker-close"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M15.1 3.1L12.9.9L8 5.9L3.1.9L.9 3.1l5 4.9l-5 4.9l2.2 2.2l4.9-5l4.9 5l2.2-2.2l-5-4.9z"/></svg></span>');
							
							// Show the icon list (it has display:none inline style from menu-icons.php)
							iconLibraryContainer.find('#menu-icons-list').show();
							
							// Mark as loaded
							iconLibraryContainer.data('icons-loaded', true);
							
							// Show the icon library with slide down animation
							iconLibraryContainer.slideDown(150, function() {
								searchInput.show();
								iconLibraryContainer.find('.icon-picker-close').show();
							});
						} else {
							alert('Failed to load icon library. Please try again.');
						}
					},
					error: function() {
						// Hide spinner
						spinner.hide();
						alert('Error loading icon library. Please try again.');
					}
				});
			} else {
				// Icons already loaded, just slide down
				iconLibraryContainer.slideDown(150, function() {
					searchInput.show();
					closeButton.show();
				});
			}
		});
		
		/**
		 * Handle icon picker close button click
		 */
		$(document).on('click', '.icon-picker-close', function(e) {
			e.preventDefault();
			
			var closeButton = $(this);
			var iconLibraryContainer = closeButton.closest('.icon-library-container');
			var menuItemId = iconLibraryContainer.data('menu-item-id');
			var menuItem = iconLibraryContainer.closest('.menu-item, .sortable-item');
			var searchInput = menuItem.find('.icon-picker-search[data-menu-item-id="' + menuItemId + '"]');
			
			// Slide up and hide elements
			iconLibraryContainer.slideUp(150, function() {
				searchInput.hide();
				closeButton.hide();
				// Clear search
				searchInput.val('').removeClass('has-text-input');
				// Show all icons
				iconLibraryContainer.find('[data-sf]').removeClass('icon-is-hidden');
			});
		});
		
	/**
	 * Handle icon selection
	 */
	$(document).on('click', '.menu-icon', function() {
		var iconElement = $(this);
		var iconId = iconElement.data('icon-id');
		var iconSvg = iconElement.html();
		
		// Convert SVG to base64
		var iconSvgBase64 = btoa(iconSvg);
		var menuIcon = 'data:image/svg+xml;base64,' + iconSvgBase64;
		
		// Find the parent icon library container
		var iconLibraryContainer = iconElement.closest('.icon-library-container');
		var menuItemId = iconLibraryContainer.data('menu-item-id');
		
		// Find the sibling icon-picker-wrapper (they're both children of the same parent field)
		var iconPickerWrapper = iconLibraryContainer.siblings('.icon-picker-wrapper');
		
		// Update the selected icon display
		iconPickerWrapper.find('.selected-menu-icon').html(iconSvg);
		
		// Update input value - try both new menu items (.custom-menu-icon) and saved menu items (.custom-menu-icon-saved)
		var iconInput = iconPickerWrapper.find('input.custom-menu-icon[data-menu-item-id="' + menuItemId + '"]');
		if (iconInput.length === 0) {
			iconInput = iconPickerWrapper.find('input.custom-menu-icon-saved[data-menu-item-id="' + menuItemId + '"]');
		}
		
		// Set the value if input was found
		if (iconInput.length > 0) {
			iconInput.val(menuIcon).trigger('input');
			// console.log('Icon updated for menu item:', menuItemId, 'New value:', menuIcon);
		} else {
			console.error('Could not find icon input field for menu item:', menuItemId);
		}
		
		// Optionally close the icon picker after selection
		// iconLibraryContainer.slideUp(150);
	});
		
		/**
		 * Handle search input - filter icons
		 */
		$(document).on('keypress keyup blur', '.icon-picker-search', function() {
			var searchInput = $(this);
			var searchVal = searchInput.val();
			var menuItemId = searchInput.data('menu-item-id');
			var menuItem = searchInput.closest('.menu-item, .sortable-item');
			var iconLibraryContainer = menuItem.find('.icon-library-container[data-menu-item-id="' + menuItemId + '"]');
			var filterItems = iconLibraryContainer.find('[data-sf]'); // sf = search filter
			
			if (searchVal !== '') {
				searchInput.addClass('has-text-input');
				setTimeout(function() {
					filterItems.addClass('icon-is-hidden');
					iconLibraryContainer.find('[data-sf][data-icon-id*="' + searchVal.toLowerCase() + '"]').removeClass('icon-is-hidden');
				}, 500);
			} else {
				searchInput.removeClass('has-text-input');
				setTimeout(function() {
					filterItems.removeClass('icon-is-hidden');
				}, 250);
			}
		});
		
		/**
		 * Handle search clear (x button) - restore all results
		 */
		$(document).on('search', '.icon-picker-search', function() {
			var searchInput = $(this);
			var menuItemId = searchInput.data('menu-item-id');
			var menuItem = searchInput.closest('.menu-item, .sortable-item');
			var iconLibraryContainer = menuItem.find('.icon-library-container[data-menu-item-id="' + menuItemId + '"]');
			
			searchInput.removeClass('has-text-input');
			iconLibraryContainer.find('[data-sf]').each(function() {
				$(this).removeClass('icon-is-hidden');
			});
		});

	}); // END OF $(document).ready()

})( jQuery );

