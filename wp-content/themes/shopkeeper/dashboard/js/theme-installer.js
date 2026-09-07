jQuery(document).ready(function($) {
    // Handle theme installation
    $('.gbt-install-theme-ajax').on('click', function(e) {
        e.preventDefault();
        
        var $button = $(this);
        var themeUrl = $button.data('theme-url');
        var themeName = $button.data('theme-name');
        var originalText = $button.text();
        
        // Disable button and show loading state
        $button.prop('disabled', true);
        $button.text('Installing...');
        
        // Make AJAX request
        $.ajax({
            url: gbtThemeInstallerData.ajaxurl,
            type: 'POST',
            data: {
                action: 'install_theme_ajax',
                nonce: gbtThemeInstallerData.nonce,
                theme_url: themeUrl,
                theme_name: themeName
            },
            success: function(response) {
                if (response.success) {
                    $button.text('Installed & Activated!');
                    $button.removeClass('gbt-install-theme-ajax').addClass('theme-installed');
                    
                    // Show success message
                    $button.closest('.message').removeClass('error').addClass('updated');
                    $button.closest('.message').find('p').html('<strong>Success!</strong> ' + themeName + ' theme and child theme have been installed successfully.');
                    
                    // Reload page after 2 seconds to show the dashboard
                    setTimeout(function() {
                        window.location.reload();
                    }, 2000);
                } else {
                    // Show error message
                    $button.text('Installation Failed');
                    $button.closest('.message').find('p').append('<br><strong>Error:</strong> ' + response.data);
                }
            },
            error: function() {
                // Show error message
                $button.text('Installation Failed');
                $button.closest('.message').find('p').append('<br><strong>Error:</strong> Failed to install theme. Please try again.');
            },
            complete: function() {
                // Re-enable button after 3 seconds
                setTimeout(function() {
                    $button.prop('disabled', false);
                    if (!$button.hasClass('theme-installed')) {
                        $button.text(originalText);
                    }
                }, 3000);
            }
        });
    });

    // Handle theme activation
    $('.gbt-activate-theme-ajax').on('click', function(e) {
        e.preventDefault();
        
        var $button = $(this);
        var themeSlug = $button.data('theme-slug');
        var themeName = $button.data('theme-name');
        var originalText = $button.text();
        
        // Disable button and show loading state
        $button.prop('disabled', true);
        $button.text('Activating...');
        
        // Make AJAX request
        $.ajax({
            url: gbtThemeInstallerData.ajaxurl,
            type: 'POST',
            data: {
                action: 'activate_theme_ajax',
                nonce: gbtThemeInstallerData.activate_nonce,
                theme_slug: themeSlug,
                theme_name: themeName
            },
            success: function(response) {
                if (response.success) {
                    $button.text('Activated!');
                    $button.removeClass('gbt-activate-theme-ajax').addClass('theme-activated');
                    
                    // Show success message
                    $button.closest('.message').removeClass('error').addClass('updated');
                    $button.closest('.message').find('p').html('<strong>Success!</strong> ' + themeName + ' theme has been activated successfully.');
                    
                    // Reload page after 2 seconds to show the dashboard
                    setTimeout(function() {
                        window.location.reload();
                    }, 2000);
                } else {
                    // Show error message
                    $button.text('Activation Failed');
                    $button.closest('.message').find('p').append('<br><strong>Error:</strong> ' + response.data);
                }
            },
            error: function() {
                // Show error message
                $button.text('Activation Failed');
                $button.closest('.message').find('p').append('<br><strong>Error:</strong> Failed to activate theme. Please try again.');
            },
            complete: function() {
                // Re-enable button after 3 seconds
                setTimeout(function() {
                    $button.prop('disabled', false);
                    if (!$button.hasClass('theme-activated')) {
                        $button.text(originalText);
                    }
                }, 3000);
            }
        });
    });
});
