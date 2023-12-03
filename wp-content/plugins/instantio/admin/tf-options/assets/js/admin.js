
(function ($) {

    $(document).ready(function () {



        // Create an instance of Notyf
        const notyf = new Notyf({
            ripple: true,
            dismissable: true,
            duration: 3000,
            position: {
                x: 'right',
                y: 'bottom',
            },
        });

        /**
         * Reset Billing Fields
         * @author M Hemel Hasan
         */
        $(document).on('click', '.ins-del-billing-fields', function (e) {
            e.preventDefault();
            var $this = $(this);
            var data = {
                action: 'ins_del_billing_fields'
            };

            $this.addClass("tf-btn-loading");
            $.ajax({
                type: 'post',
                url: ins_admin.ajax_url,
                data: data,
                success: function (data) {
                    notyf.success('Reset Billing Fields');
                    $this.removeClass("tf-btn-loading");
                    window.location.reload();
                },
                error: function (data) {
                    notyf.error("Something wrong");
                    $this.removeClass("tf-btn-loading");
                },

            });

        });

        /**
         * Reset Shipping Fields
         * @author M Hemel Hasan
         */
        $(document).on('click', '.ins-del-shipping-fields', function (e) {
            e.preventDefault();
            var $this = $(this);
            var data = {
                action: 'ins_del_shipping_fields'
            };

            $this.addClass("tf-btn-loading");
            $.ajax({
                type: 'post',
                url: ins_admin.ajax_url,
                data: data,
                success: function (data) {
                    notyf.success('Reset Shipping Fields');
                    $this.removeClass("tf-btn-loading");
                    location.reload();
                },
                error: function (data) {
                    notyf.error("Something wrong");
                    $this.removeClass("tf-btn-loading");
                },

            });

        });

        /**
         * Pro Feature button link
         */
        $(document).on('click', '.tf-pro', function (e) {
            e.preventDefault();
            window.open('https://themefic.com/instantio/');
        });

        $(window).on('load', function () {
            $('.tf-field-disable').find('input, select, textarea, button, div, span').attr('disabled', 'disabled');
        });

        $(document).on('click', '.tf-field-pro', function (e) {
            e.preventDefault();
            window.open('https://themefic.com/instantio/');
        });



    });

})(jQuery);