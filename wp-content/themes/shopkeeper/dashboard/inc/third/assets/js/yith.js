jQuery(function($) {

    "use strict";

    /**
     * Scans the DOM and adds referral ID to YITH links.
     * Handles both initial page load and dynamically injected content.
     */
    function gbtEnhanceYithLinks() {
        // Process all anchor elements
        $('a').each(function() {
            var $link = $(this);
            var href = $link.attr('href');
            
            // Skip if no href
            if (!href) {
                return;
            }

            // Check if it's a YITH URL
            if (href.indexOf('yithemes.com') !== -1) {
                try {
                    var url = new URL(href);
                    
                    // Skip if already has refer_id with our value
                    if (url.searchParams.get('refer_id') === gbt_yith.refer_id) {
                        return;
                    }

                    // Add or update refer_id parameter
                    url.searchParams.set('refer_id', gbt_yith.refer_id);
                    $link.attr('href', url.toString());
                } catch (e) {
                    // Fallback for invalid URLs
                    var separator = href.indexOf('?') !== -1 ? '&' : '?';
                    var newHref = href + separator + 'refer_id=' + gbt_yith.refer_id;
                    $link.attr('href', newHref);
                }
            }
        });
    }

    // Process existing links on page initialization
    gbtEnhanceYithLinks();
    
    // Monitor DOM for dynamically added YITH links
    if (window.MutationObserver) {
        // Implement debouncing to optimize performance
        var debouncedModifyLinks = (function() {
            var timer = null;
            return function() {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    gbtEnhanceYithLinks();
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
            childList: true,     // Track element additions/removals
            subtree: true,       // Include all descendants
            attributes: false,    // Ignore attribute changes
            characterData: false  // Ignore text content changes
        });
    }

    /**
     * Handle AJAX-loaded content and dynamic updates
     */
    $(document).ajaxComplete(function() {
        gbtEnhanceYithLinks();
    });

}); 