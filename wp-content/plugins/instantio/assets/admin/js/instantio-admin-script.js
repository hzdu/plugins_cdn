(function ($) {

    jQuery(document).ready(function () {

        $(".ins-scroll-to").parent().css({ "padding": "0", "margin": "0", "visibility": "hidden" });

        $(".admin-scroll").click(function (e) {

            e.preventDefault();

            var secID = $(this).attr("data-id");
            console.log(secID);

            $('html, body').animate({
                scrollTop: $('#' + secID).offset().top
            }, 1000);
        });

        /**
         * Ajax install WooCommerce
         * 
         * @since 1.0
         */
        // $(document).on('click', '.tf-install', function (e) {
        //     e.preventDefault();

        //     var current = $(this);
        //     var plugin_slug = current.attr("data-plugin-slug");

        //     current.addClass('updating-message').text('Installing...');
        //     console.log('click');

        //     var data = {
        //         action: 'ins_ajax_install_plugin',
        //         _ajax_nonce: tf_admin_params.ins_nonce,
        //         slug: plugin_slug,
        //     };

        //     console.log(data);

        //     jQuery.post(tf_admin_params.ajax_url, data, function (response) {
        //         console.log(response);
        //         //console.log(response.data.activateUrl);
        //         current.removeClass('updating-message');
        //         current.addClass('updated-message').text('Installed!');
        //         current.attr("href", response.data.activateUrl);
        //     })
        //         .fail(function () {
        //             current.removeClass('updating-message').text('Failed!');
        //         })
        //         .always(function () {
        //             current.removeClass('install-now updated-message').addClass('activate-now button-primary').text('Activating...');
        //             current.unbind(e);
        //             current[0].click();
        //         });
        // });

        /**
         * Ajax install WooCommerce
         * 
         * @since 3.0
         */
        $(document).on('click', '.ins_wooinstall', function (e) {
            e.preventDefault();

            var current = $(this);
            var plugin_slug = current.attr("data-plugin-slug");

            current.addClass('updating-message').text('Installing...');

            var data = {
                action: 'ins_ajax_install_woocommerce',
                _ajax_nonce: tf_admin_params.ins_nonce,
                slug: plugin_slug,
            };

            jQuery.post(tf_admin_params.ajax_url, data, function (response) {
                // console.log(response);
                // console.log(response.data.activateUrl);
                current.removeClass('updating-message');
                current.addClass('updated-message').text('Installed!');
                current.attr("href", response.data.activateUrl);
            })
                .fail(function () {
                    current.removeClass('updating-message').text('Failed!');
                })
                .always(function () {
                    current.removeClass('install-now updated-message').addClass('activate-now button-primary').text('Activating...');
                    current.unbind(e);
                    current[0].click();
                });
        });

        /**
         * Pro Feature button link
         */
        $(document).on('click', '.ins-pro', function (e) {
            window.open('https://themefic.com/instantio/go/upgrade');
        });

        $(document).on('click', '.ins-csf-pro', function (e) {
            window.open('https://themefic.com/instantio/go/upgrade');
        });

    });

})(jQuery);