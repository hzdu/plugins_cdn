jQuery(function($) {

	"use strict";

	// Add styles for button hover effects
	$('head').append(`
		<style>
			.button-pro:hover, .button-pro-topbar:hover {
				background-color: #A4084B !important;
				border-color: #A4084B !important;
				color: #fff !important;
			}
		</style>
	`);

	/**
	 * Scans the DOM and prepends the tracking URL.
	 * Handles both initial page load and dynamically injected content.
	 */
	function gbtEnhanceElementorLinks() {
		// Process all anchor elements
		$('a').each(function() {
			var $link = $(this);
			var href = $link.attr('href');
			
			if (!href) {
				return;
			}

			// Check if it's an Elementor connect URL
			if (href.indexOf('page=elementor-connect') !== -1) {
				try {
					var url = new URL(href);
					
					// Skip if already has affid with our value
					if (url.searchParams.get('affid') === '208394') {
						return;
					}

					// Add or update affid parameter
					url.searchParams.set('affid', '208394');
					$link.attr('href', url.toString());
				} catch (e) {
					// Fallback for invalid URLs
					var separator = href.indexOf('?') !== -1 ? '&' : '?';
					var newHref = href + separator + 'affid=208394';
					$link.attr('href', newHref);
				}
			}
			// Check if it's a regular Elementor URL
			else if (href.indexOf('elementor.com') !== -1 && href.indexOf(gbt_elementor.gbt_elementor_prefix_aff_link) === -1) {
				// Apply the modified URL for regular Elementor links
				var newHref = gbt_elementor.gbt_elementor_prefix_aff_link + href;
				$link.attr('href', newHref);
			}
		});

		// Replace Pro Elements plugin activation link with Pro link
		$('tr[data-plugin="pro-elements/pro-elements.php"] .active_license a').each(function() {
			var $link = $(this);
			$link.attr({
				'href': gbt_elementor.gbt_elementor_prefix_aff_link + gbt_elementor.gbt_elementor_pro_link,
				'target': '_blank'
			});
		});

		// Add Pro button to elementor-box-action
		$('.elementor-box-action').each(function() {
			var $boxAction = $(this);
			
			// Check if we haven't already added the button
			if ($boxAction.find('.button-pro').length === 0) {
				var $proButton = $('<a>', {
					'class': 'button button-primary button-pro',
					'href': gbt_elementor.gbt_elementor_prefix_aff_link + gbt_elementor.gbt_elementor_pro_link,
					'style': 'background-color: #D30C5C; border-color: #D30C5C; color: #fff; text-decoration: none;',
					'html': '<i class="e-admin-top-bar__bar-button-icon eicon-star" style="margin-right: 8px;"></i>Upgrade Now',
					'target': '_blank'
				});
				
				$boxAction.find('.button').before($proButton);
			}
		});

		// Add Pro button to top bar secondary area
		$('.e-admin-top-bar__secondary-area').each(function() {
			var $secondaryArea = $(this);
			
			// Check if we haven't already added the button
			if ($secondaryArea.find('.button-pro-topbar').length === 0) {
				var $proButton = $('<a>', {
					'class': 'button-pro-topbar',
					'href': gbt_elementor.gbt_elementor_prefix_aff_link + gbt_elementor.gbt_elementor_pro_link,
					'target': '_blank',
					'style': 'background-color: #D30C5C; border-color: #D30C5C; color: #fff; text-decoration: none; padding: 8px 12px; border-radius: 3px; display: inline-flex; align-items: center; margin-left: 8px;',
					'html': '<i class="e-admin-top-bar__bar-button-icon eicon-star" style="margin-right: 4px;"></i><span class="e-admin-top-bar__bar-button-title">Go Pro</span>'
				});
				
				$secondaryArea.find('a[href*="elementor-connect"]').after($proButton);
			}
		});
	}

	// Process existing links on page initialization
	gbtEnhanceElementorLinks();
	
	// Monitor DOM for dynamically added Elementor links
	if (window.MutationObserver) {
		// Implement debouncing to optimize performance
		var debouncedModifyLinks = (function() {
			var timer = null;
			return function() {
				clearTimeout(timer);
				timer = setTimeout(function() {
					gbtEnhanceElementorLinks();
				}, 300);
			};
		})();

		// Initialize mutation observer
		var observer = new MutationObserver(function(mutations) {
			if (mutations.length) {
				debouncedModifyLinks();
			}
		});

		// Configure observer to monitor the entire DOM tree
		observer.observe(document.body, {
			childList: true,    	// Track element additions/removals
			subtree: true,      	// Include all descendants
			attributes: false,  	// Ignore attribute changes
			characterData: false 	// Ignore text content changes
		});
	}

	/**
	 * Handle AJAX-loaded content and dynamic updates
	 */
	$(document).ajaxComplete(function() {
		gbtEnhanceElementorLinks();
	});

});