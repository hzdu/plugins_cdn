jQuery(document).ready(function($){
    var val = jQuery('input[name="qcld_wpbotpro_buy_from_where"]:checked').val();
    show_hide_license_box(val);
    jQuery('input[name="qcld_wpbotpro_buy_from_where"]').on('change',function(e){
        var val = jQuery(this).val();
        show_hide_license_box(val);
    });
    function show_hide_license_box(value){
        if(value == 'quantumcloud'){
            jQuery('#quantumcloud_portfolio_license_row').show();
            jQuery('#show_envato_plugin_downloader').hide();
        }else if(value == 'codecanyon'){
            jQuery('#show_envato_plugin_downloader').show();
            jQuery('#quantumcloud_portfolio_license_row').hide();
        }
    }

    jQuery('.qc_accordion_title').on('click', function(e){
        e.preventDefault();
        console.log('clicked');
        var obj = $(this);
        
        jQuery('.qc_accordion_content_third').hide();

        if($( "h3[data-accordion='qc_accordion_content_third']" ).find('i').hasClass("fa-minus")){
            $( "h3[data-accordion='qc_accordion_content_third']" ).find('i').removeClass("fa-minus");
            $( "h3[data-accordion='qc_accordion_content_third']" ).find('i').addClass("fa-plus");
        }
        jQuery('.qc_accordion_content_second').hide();
        if($( "h3[data-accordion='qc_accordion_content_second']" ).find('i').hasClass("fa-minus")){
            $( "h3[data-accordion='qc_accordion_content_second']" ).find('i').removeClass("fa-minus");
            $( "h3[data-accordion='qc_accordion_content_second']" ).find('i').addClass("fa-plus");
        }
        jQuery('.qc_accordion_content_first').hide();
        if($( "h3[data-accordion='qc_accordion_content_first']" ).find('i').hasClass("fa-minus")){
            $( "h3[data-accordion='qc_accordion_content_first']" ).find('i').removeClass("fa-minus");
            $( "h3[data-accordion='qc_accordion_content_first']" ).find('i').addClass("fa-plus");
        }
        setTimeout(function(){
            jQuery('.'+obj.attr('data-accordion')).show();
            obj.find('i').toggleClass("fa-plus fa-minus");
        }, 200)
    })
});