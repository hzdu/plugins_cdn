jQuery(document).ready(function(){

    jQuery('.tab-switch').click(function(e){
        e.preventDefault();

        jQuery('.tab-switch').each(function(index, obj){
            jQuery(this).removeClass('active_coupon_settings_switch');
        });
        jQuery(this).addClass('active_coupon_settings_switch');

    });

});