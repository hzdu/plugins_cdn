//"use strict";
jQuery(document).ready(function ($) {
     jQuery("#wizard").on('onStepChanged', function (event, currentIndex, priorIndex) {
            PrepareOrderReview();
        
    });
    
});

function PrepareOrderReview() {
        if (jQuery(".order-review-tab").hasClass("current")) {

            //Prepare billing information
            var billing_fname = jQuery("#billing_first_name").val();
            var billing_lname = jQuery("#billing_last_name").val();
            var email = jQuery("#billing_email").val();
            var phone = jQuery("#billing_phone").val();

            if(jQuery("#billing_address_1").length){
                var billing_adddress1 = jQuery("#billing_address_1").val();    
            }
            
            if(jQuery("#billing_address_2").length){
                var billing_adddress2 = jQuery("#billing_address_2").val();    
            }
            
            var billing_zopcode = jQuery("#billing_postcode").val();
            var vat_number = jQuery.trim(jQuery("#vat_number").val());
            var city =  jQuery("#billing_city").length ? jQuery("#billing_city").val() : '';
            var state =  jQuery("#billing_state").length ? (jQuery("#billing_state").is("select") ? jQuery("#billing_state option:selected").text() : jQuery("#billing_state").val()) : ''
            var billing_country = jQuery("#billing_country option:selected").text();        
            if(billing_country == ''){
                billing_country = jQuery("#billing_country_field .woocommerce-input-wrapper").find("strong").text();
            }

            var billing_address = billing_adddress1;

            if (typeof  billing_adddress2 != 'undefined') {
                billing_address = billing_adddress1 + "<br>" + billing_adddress2
            }

            var billing_information = billing_fname + " " + billing_lname + '<br>' + billing_address + "<br>" + billing_zopcode + "<br>" + city + ", " + state + " " + billing_country;

            //Insert billing information
            jQuery(".order-review-tab .billing-address").html(billing_information);

            //insert customer details
            jQuery(".customer_details .customer-email").html(email);
            jQuery(".customer_details .customer-phone").html(phone);            

            jQuery(".order-review-details").empty();            

            var order_table = jQuery(".woocommerce-checkout-review-order-table").clone();      
            var no_of_shipping_methods = jQuery("ul#shipping_method li").length;
            jQuery(order_table).removeClass("shop_table woocommerce-checkout-review-order-table").addClass("review-order-details");  
            jQuery(order_table).find("#shipping_method").parent().addClass("shipping-methods");
            
            if(no_of_shipping_methods > 1){
            jQuery(order_table).find("#shipping_method").remove();            
            jQuery(".order-review-details").html(order_table);
             var shipping_method = jQuery('input[name="shipping_method[0]"]:checked').attr("id");
             var shipping_method_name = jQuery('label[for="'+shipping_method +'"]').clone();             
              jQuery(".order-review-details td.shipping-methods").html(shipping_method_name);
          }else{
              jQuery(".order-review-details").html(order_table);
          }

            //prepare shipping information
            if (jQuery("#ship-to-different-address-checkbox").is(":checked")) {

                var shippping_fname = jQuery("#shipping_first_name").val();
                var shippping_lname = jQuery("#shipping_last_name").val();
                var shippping_adddress1 = jQuery("#shipping_address_1").val();
                var shippping_adddress2 = jQuery("#shipping_address_2").val();
                var shipping_zipcode = jQuery("#shipping_postcode").val();
                var shipping_city = jQuery("#shipping_city").length ? jQuery("#shipping_city").val() : '';
                var shipping_state = jQuery("#shipping_state").length ? (jQuery("#shipping_state").is("select") ? jQuery("#shipping_state option:selected").text() : jQuery("#shipping_state").val()) : '';
                var shipping_country = jQuery("#shipping_country option:selected").text();
                
             if(shipping_country == ''){
                shipping_country = jQuery("#shipping_country_field .woocommerce-input-wrapper").find("strong").text();
            }

                var shipping_address = shippping_adddress1;

                if (shippping_adddress2.length) {
                    shipping_address = shippping_adddress1 + "<br>" + shippping_adddress2;
                }

                var shipping_information = shippping_fname + " " + shippping_lname + '<br>' + shipping_address + "<br>" + shipping_zipcode + "<br>" +  shipping_city + ", " + shipping_state + " " + shipping_country;
                jQuery(".order-review-tab .shipping-address").html(shipping_information);

            } else {
                jQuery(".order-review-tab .shipping-address").html(billing_information);
            }



        }
    }