(function ($) {
    'use strict';
    wfacp.hooks.addAction('wfacp_loaded', function () {
        var copied_model = $("#modal-section-success_shortcodes6456");
        $(document).on('click', '.wfacp_copy_text', function () {
            var sibling = $(this).siblings('.wfacp_description');
            if (sibling.length > 0) {
                sibling.find('input').select();
                document.execCommand("copy");
                copied_model.iziModal('open');
            }
        });

        if (copied_model.length > 0) {
            copied_model.iziModal({
                    title: wpacpef.shortcode_copy_message,
                    icon: 'icon-check',
                    headerColor: '#6dbe45',
                    background: '#6dbe45',
                    borderBottom: false,
                    width: 600,
                    timeout: 1000,
                    timeoutProgressbar: true,
                    transitionIn: 'fadeInUp',
                    transitionOut: 'fadeOutDown',
                    bottom: 0,
                    loop: true,
                    pauseOnHover: true,
                    overlay: false
                }
            );
        }

    });
})(jQuery);