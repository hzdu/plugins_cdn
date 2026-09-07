/**
 * Auto-Update Handler JavaScript
 * Handles AJAX requests for enabling theme auto-updates
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        $(document).on('click', '.gbt-enable-auto-updates', function(e) {
            e.preventDefault();
            
            const $element = $(this);
            const isLink = $element.hasClass('gbt-auto-update-link');
            
            // Get target element and store original state
            let $targetElement, originalContent;
            if (isLink) {
                $targetElement = $element.closest('.gbt-auto-update-text-wrapper');
                originalContent = $element.closest('span').html();
            } else {
                $targetElement = $element.find('.gbt-button-text');
                originalContent = $targetElement.html();
            }
            
            // Show loading state
            $('.gbt-enable-auto-updates').css('pointer-events', 'none');
            if (isLink) {
                $targetElement.text(' ' + $targetElement.data('enabling-text'));
            } else {
                $('.gbt-enable-auto-updates').prop('disabled', true);
                $targetElement.text($targetElement.data('enabling-text'));
            }
            
            // Make AJAX request
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'gbt_enable_auto_updates',
                    theme_slug: $element.data('theme'),
                    nonce: gbtAutoUpdateData.nonce
                },
                success: function(response) {
                    if (response.success) {
                        // Update dashboard auto-update sections
                        $('.gbt-auto-update-section').each(function() {
                            const $section = $(this);
                            $section.find('.gbt-auto-update-icon').replaceWith($section.attr('data-success-icon-html'));
                            $section.find('.gbt-auto-update-title').text($section.data('success-title'));
                            $section.find('.gbt-auto-update-description').html($section.data('success-description'));
                            $section.find('dd:last').hide();
                            
                            // Pulse effect
                            const pulseBackground = function() {
                                $section.css('background-color', 'var(--color-gbt-green)').css('color', 'white');
                                setTimeout(() => $section.css('background-color', '').css('color', ''), 250);
                            };
                            $section.addClass('transition-colors duration-500');
                            pulseBackground();
                            setTimeout(pulseBackground, 500);
                        });
                        
                        // Update notification text
                        if (response.data && response.data.message && isLink && $targetElement) {
                            $targetElement.text(' ' + $targetElement.data('success-text'));
                        }
                    } else {
                        restoreState();
                    }
                },
                error: restoreState
            });
            
            function restoreState() {
                if (isLink) {
                    $('.gbt-enable-auto-updates').css('pointer-events', 'auto');
                    $element.closest('span').html(originalContent);
                } else {
                    $('.gbt-enable-auto-updates').prop('disabled', false);
                    $targetElement.html(originalContent);
                }
            }
        });
    });

})(jQuery);
