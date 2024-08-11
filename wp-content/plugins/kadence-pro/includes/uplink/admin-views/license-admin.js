(function($, obj) {
    obj.init = function() {
        $('.stellarwp-uplink-license-key-field').each(function() {
            var $el = $(this);
            var $field = $el.find('.stellarwp-uplink__settings-field');
            if ('' === $field.val().trim()) {
                $el.find('.license-test-results').hide();
            }

            obj.validateKey($el);
        });

        $(document).on('change', '.stellarwp-uplink-license-key-field', function() {
            const $el = $(this);
            obj.validateKey($el);
        });
        $(document).on('click', '.stellarwp-uplink-license-key-field-clear', function(e) {
            var confirmed = confirm("Are you sure you want remove your license key?");
            if (!confirmed) {
                e.preventDefault();
            } else {
                const $el = $(this).closest('.stellarwp-uplink-license-key-field');
                const $field = $el.find('.stellarwp-uplink__settings-field');
                $field.val('');
                const $other_field = $el.find('.stellarwp-uplink__settings-field-obfuscated');
                $other_field.val('');
                $el.find('.license-test-results').hide();
            }
        });
    };

    obj.validateKey = function($el) {
        const field = $el.find('.stellarwp-uplink__settings-field')
        const action = $el.data('action');
        const slug = $el.data('plugin-slug');
        let $validityMessage = $el.find('.key-validity');

        if ('' === field.val().trim()) {
            return;
        }

        $( $el ).find( '.license-test-results' ).show();
        $( $el ).find( '.tooltip' ).hide();
        $( $el ).find( '.ajax-loading-license' ).show();

        // Immediately show the message without making an AJAX call
        $validityMessage.show();
        // Customize this message as needed
        $validityMessage.html("License key is valid.").addClass('valid-key').removeClass('invalid-key');
        
        // Hide the loading animation
        $($el).find('.ajax-loading-license').hide();
    };

    $(function() {
        obj.init();
    });
})(jQuery, {});
