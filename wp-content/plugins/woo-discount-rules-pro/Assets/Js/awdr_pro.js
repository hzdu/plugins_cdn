/* global jQuery, ajaxurl, wdr_data */
(function ($) {
    $(document).ready(function () {
        $(document).on("click", ".awdr_change_product", function() {
            var product_id = $(this).attr('data-pid');
            var rule_unique_id = $(this).attr('data-rule_id');
            var parent_id = $(this).attr('data-parent_id');

            var data = {
                action: 'awdr_change_discount_product_in_cart',
                product_id: product_id,
                rule_unique_id: rule_unique_id,
                parent_id: parent_id,
                awdr_nonce: awdr_params.nonce,
            };
            $.ajax({
                url: awdr_params.ajaxurl,
                data: data,
                type: 'POST',
                success: function (response) {
                    if(response.success == true){
                        if(response.data == 1){
                            jQuery("[name='update_cart']").removeAttr('disabled');
                            jQuery("[name='update_cart']").trigger("click");
                        }
                    }
                },
                error: function (response) {
                }
            });
        });

        var acc = document.getElementsByClassName("awdr-select-free-variant-product-toggle");
        var i;

        //for (i = 0; i < acc.length; i++) {
        $(document).on("click",'.awdr-select-free-variant-product-toggle' , function (e) {
                e.preventDefault();
                this.classList.toggle("awdr-select-free-variant-product-toggle-active");
                var panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    ///  panel.style.display = "none";
                    $(panel).slideUp(1000);
                } else {
                    $(panel).slideDown(1000);
                    ///panel.style.display = "block";
                }
            });
        //}
    });
})(jQuery);