(function($) {
    'use strict';

    $(document).ready(function() {
        $('body').on('change', 'input[name="payment_method"]', function() {
            $('body').trigger('update_checkout');
        });

        // jQuery('div.woocommerce').on('change', '.qty', function(){
        // 	jQuery("[name='update_cart']").prop("disabled", false);
        // 	jQuery("[name='update_cart']").trigger("click"); 
        // });
        // jQuery("[name='update_cart']").on('click', function(){
        // 	window.location.reload();
        // });
        // $('.tier_offer_table').addClass('active');
        var counter = false;
        setInterval(function() 
        {
            var c =  $('.tier_offer_table');
            counter = !counter;
            var percent=$('.percent');
            var fixed=$(".fixed");
            fixed.each(function(){
                $(this).css('display', counter ? 'block' : 'none');
            });
            percent.each(function(){
                $(this).css('display', counter ? 'none' : 'block');
            });
        }, 2000);


        $(document).on('change', '.variation_id', function() 
        {
            var rtwwdpd_var_id = $(this).val();
            var rtwwdpd_product_id = $(this).closest('div').find("input[name=product_id]").val();
            if (rtwwdpd_var_id != '') 
            {
                var data = 
                {
                    action: 'rtwwdpd_variation_id',
                    rtwwdpd_var_id: rtwwdpd_var_id,
                    rtwwdpd_prod_id: rtwwdpd_product_id,
                    security_check: rtwwdpd_ajax.rtwwdpd_nonce
                };
                $.ajax({
                    url: rtwwdpd_ajax.ajax_url,
                    type: "POST",
                    data: data,
                    dataType: 'json',
                    success: function(response) 
                    {
                        if (response != 0 && response != '') 
                        {
                            $(document).find('.rtwwdpd_apply_on_variation_' + rtwwdpd_product_id).html(response);
                            $(document).find('.rtwwdpd_apply_on_variation_' + rtwwdpd_product_id).hide();
                        }
                    }
                });
            } else 
            {
                $(document).find('.rtwwdpd_apply_on_variation_' + rtwwdpd_product_id).html('');
                $(document).find('.rtwwdpd_apply_on_variation_' + rtwwdpd_product_id).hide();
            }
        });
    })

})(jQuery);