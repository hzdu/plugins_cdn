/**
 * Global Notification Handler for GetBowtied Theme Dashboard
 * 
 * Handles the dismissal of all dashboard notifications through AJAX
 */
(function($) {
    'use strict';
    
    // Handle legacy notifications with gbt-dashboard-notification class
    $(document).on('click', '.gbt-dashboard-notification .notice-dismiss, .gbt-dashboard-notification .dismiss-notification', function(e) {
        if ($(this).is('a')) e.preventDefault();
        
        var $notification = $(this).closest('.gbt-dashboard-notification');
        var messageId = $notification.data('message-id');
        var themeSlug = $notification.data('theme-slug');
        
        if (!messageId || !themeSlug) return;
        
        $.ajax({
            url: gbtNotificationHandler.ajaxurl,
            type: 'POST',
            data: {
                action: 'gbt_dismiss_notification',
                message_id: messageId,
                theme_slug: themeSlug,
                nonce: gbtNotificationHandler.nonce
            },
            success: function(response) {
                if (response.success) {
                    $notification.fadeOut(300, function() { $(this).remove(); });
                }
            }
        });
    });

})(jQuery); 