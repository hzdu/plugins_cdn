var $var = jQuery.noConflict();
(function( $var ) {
    'use strict';

    $var(function() {
        

        $var('.wcva_common_select_nosearch').select2({
            minimumResultsForSearch: -1
        });

        $var('.woocommerce_wcva_custom_texonomies_input').select2({
            width:"450px"
        });

        $var('.wcva_outofstock_options_behavior_input,.wcva_disable_unavailable_options_input,.woocommerce_shop_swatches_display_input,.woocommerce_hover_imaga_size_input').select2({
            minimumResultsForSearch: -1,
            width:"450px"
        });

        $var('.wcva_common_select').select2();

        $var('.globalcheckbox').on('change',function(){

            if ($var(this).prop('checked')) {
               $var(this).closest("tr").next().show(200);
           } else {
               $var(this).closest("tr").next().hide(200);
           }
        });

        
        //hide show "disable tooltip on iphone devices checkbox"
        $var('.woocommerce_enable_shop_slider_input').change(function() {

            var wcvarow = $var(this).closest('tr').next();

            if( $var(this).is(':checked')) {
                wcvarow.show();
            } else {
                wcvarow.hide();
            }
        }); 


        //hide show "disable tooltip on iphone devices checkbox"
        $var('.woocommerce_wcva_swatch_tooltip_input').change(function() {

            var wcvarow = $var(this).closest('tr').next();

            var wcvarow2 = $var(this).closest('tr').next().next();

            if( $var(this).is(':checked')) {
                wcvarow.show();
                wcvarow2.show();
            } else {
                wcvarow.hide();
                wcvarow2.hide();
            }
        });

        var next_tr_to_shop_more         = $var('.woocommerce_enable_shop_show_more_input').closest('tr').next();
    
        var second_next_to_shop_more     = $var('.woocommerce_enable_shop_show_more_input').closest('tr').next().next();


        $var(".wcva_activate_license").on('click',function(event) {

         event.preventDefault();

         var licensekey = $var(".wcva_license_key_input").val();

         $var.ajax({
            data: {
                action    : "wcva_activate_license",
                licensekey  : licensekey

            },
            type: 'POST',
            url: wcvaadmin.ajax_url,
            success: function( response ) { 
                console.log(response);
                window.location.reload();
            }
        });

         return false;

     });

        
    
        $var('.woocommerce_enable_shop_show_more_input').on('change',function() {

            if( $var(this).is(':checked')) {
                next_tr_to_shop_more.show();
                second_next_to_shop_more.show();
            } else {
                next_tr_to_shop_more.hide();
                second_next_to_shop_more.hide();
            }
        }); 
    });

 
})( jQuery );


