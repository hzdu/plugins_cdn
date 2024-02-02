jQuery(document).ready(function($){
    
    var calendar_image = '';
    
    if (typeof woocommerce_writepanel_params != 'undefined'){
            calendar_image = woocommerce_writepanel_params.calendar_image;
    } else if (typeof woocommerce_admin_meta_boxes != 'undefined'){
            calendar_image = woocommerce_admin_meta_boxes.calendar_image;
    }

    jQuery('.datetimepicker').datetimepicker({
        defaultDate: "",
        dateFormat: "yy-mm-dd",
        numberOfMonths: 1,
        showButtonPanel: true,
        showOn: "button",
        buttonImage: calendar_image,
        buttonImageOnly: true
    });	

    var productType = jQuery('#product-type').val();
    if (productType=='lottery'){
        jQuery('.show_if_simple').show();
        jQuery('.inventory_options').show();
        jQuery('#inventory_product_data ._manage_stock_field').addClass('hide_if_lottery').hide();
        jQuery('#inventory_product_data ._sold_individually_field').parent().addClass('hide_if_lottery').hide();
        jQuery('#inventory_product_data ._sold_individually_field').addClass('hide_if_lottery').hide();
        jQuery('#inventory_product_data ._stock_field ').addClass('hide_if_lottery').hide();
        jQuery('#inventory_product_data ._backorders_field ').parent().addClass('hide_if_lottery').hide();
        jQuery('#inventory_product_data ._stock_status_field ').addClass('hide_if_lottery').hide();
        jQuery('#lottery_tab .required').each(function(index, el) {
            jQuery(this).attr("required", true);
        });
    } else {
        jQuery('#lottery_tab .required').each(function(index, el) {
            jQuery(this).attr("required", false);
        });
    }
    
    jQuery('#product-type').on('change', function(){
        if  (jQuery(this).val() =='lottery'){
            jQuery('.show_if_simple').show();
            jQuery('.inventory_options').show();
            jQuery('#inventory_product_data ._manage_stock_field').addClass('hide_if_lottery').hide();
            jQuery('#inventory_product_data ._sold_individually_field').parent().addClass('hide_if_lottery').hide();
            jQuery('#inventory_product_data ._sold_individually_field').addClass('hide_if_lottery').hide();
            jQuery('#inventory_product_data ._stock_field ').addClass('hide_if_lottery').hide();
            jQuery('#inventory_product_data ._backorders_field ').parent().addClass('hide_if_lottery').hide();
            jQuery('#inventory_product_data ._stock_status_field ').addClass('hide_if_lottery').hide();
            jQuery('#lottery_tab .required').each(function(index, el) {
                jQuery(this).attr("required", true);
            });
        } else {
            jQuery('#lottery_tab .required').each(function(index, el) {
                jQuery(this).attr("required", false);
            });
        }
    });
    
    jQuery('label[for="_virtual"]').addClass('show_if_lottery');
    
    jQuery('label[for="_downloadable"]').addClass('show_if_lottery');

    jQuery('.lottery-table .action a').on('click',function(event){
        var logid = $(this).data('id');
        var postid = $(this).data('postid');
        var curent = $(this);
        jQuery.ajax({
        type : "post",
        url : ajaxurl,
        data : {action: "delete_lottery_participate_entry", logid : logid, postid: postid},
        success: function(response) {
               if (response === 'deleted'){
                       curent.parent().parent().addClass('deleted').fadeOut('slow');
               }
           }
        });
        event.preventDefault();
    });

    jQuery('#lottery-refund').on('click',function(event){
        if ( window.confirm( woocommerce_admin_meta_boxes.i18n_do_refund ) ) {
            var product_id = $(this).data('product_id');
            var curent = $(this);
            var $wrapper     = $('#Lottery' );

            $( "#refund-status" ).empty();

            $wrapper.block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.6
                }
            });
            
            jQuery.ajax({
            type : "post",
            url : ajaxurl,
            data : {action: "lottery_refund", product_id : product_id , security : woocommerce_lottery.lottery_refund_nonce},
            success: function(response) {
                

                if(response.error){

                     $( "#refund-status" ).append( '<div class="error notice"></div>');

                    $.each(response.error, function(index, value) {

                        $( "#refund-status .error" ).append( '<p class"error">'+index + ': ' +value + '</p>' );
                        
                    });

                    
                      

                }

                if(response.succes){

                    $( "#refund-status" ).append( '<div class="updated  notice"></div>');
                    $.each(response.succes, function(index, value) {

                        $( "#refund-status .updated " ).append( '<li class"ok">'+index + ': ' +value + '</li>' );
                        
                    });    
                }
                $wrapper.unblock();
               }
            });
        }    
            event.preventDefault();
    });
    
    jQuery('#general_product_data #_regular_price').on('keyup',function(){
        jQuery('#auction_tab #_regular_price').val(jQuery(this).val());
    });
	
    var lotterymaxwinners = jQuery('#_lottery_num_winners').val();

     if ( lotterymaxwinners > 1){
        $('._lottery_multiple_winner_per_user_field').show();
      } else{
        $('._lottery_multiple_winner_per_user_field').hide();
      }
    jQuery('#relistlottery').on('click',function(event){
            event.preventDefault();
            jQuery('.relist_lottery_dates_fields').toggle();
    });
    jQuery('#extendlottery').on('click',function(event){
            event.preventDefault();
            jQuery('.extend_lottery_dates_fields').toggle();
    });  
 
});

jQuery( function ( $ ) {
        $( document.body )
            .on( 'wc_add_error_tip_lottery', function( e, element, error_type ) {
            var offset = element.position();

            if ( element.parent().find( '.wc_error_tip' ).size() === 0 ) {
                element.after( '<div class="wc_error_tip ' + error_type + '">' + woocommerce_lottery[error_type] + '</div>' );
                element.parent().find( '.wc_error_tip' )
                    .css( 'left', offset.left + element.width() - ( element.width() / 2 ) - ( $( '.wc_error_tip' ).width() / 2 ) )
                    .css( 'top', offset.top + element.height() )
                    .fadeIn( '100' );
            }
        })
        .on( 'wc_remove_error_tip_lottery', function( e, element, error_type ) {
            element.parent().find( '.wc_error_tip.' + error_type ).remove();
        })

        .on( 'keyup change', '#_max_tickets.input_text[type=number]', function() {
            var max_ticket_field = $( this ), min_ticket_field;
                          
            min_ticket_field = $( '#_min_tickets' );

            var max_ticket    = parseInt( max_ticket_field.val());
            var min_ticket = parseInt( min_ticket_field.val());

            if ( max_ticket <= min_ticket ) {
                $( document.body ).triggerHandler( 'wc_add_error_tip_lottery', [ $(this), 'i18_max_ticket_less_than_min_ticket_error' ] );
            } else {
                $( document.body ).triggerHandler( 'wc_remove_error_tip_lottery', [ $(this), 'i18_max_ticket_less_than_min_ticket_error' ] );
            }
        })

         .on( 'keyup change focusout ', '#_lottery_num_winners.input_text[type=number]', function() {
            var lottery_num_winners_field = $( this );
            var lottery_winers    = parseInt( lottery_num_winners_field.val());
                       
            if ( lottery_winers <= 0 || !lottery_winers) {
                $( document.body ).triggerHandler( 'wc_add_error_tip_lottery', [ $(this), 'i18_minimum_winers_error' ] );
            } else {
                $( document.body ).triggerHandler( 'wc_remove_error_tip_lottery', [ $(this), 'i18_minimum_winers_error' ] );
            }
            

              if ( lottery_winers > 1){
                $('._lottery_multiple_winner_per_user_field').show();
              } else{
                $('._lottery_multiple_winner_per_user_field').hide();
              }
        });




});