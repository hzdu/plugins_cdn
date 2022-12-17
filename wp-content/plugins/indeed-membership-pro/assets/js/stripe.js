/*
* Ultimate Membership Pro - Stripe Payment Service
*/
"use strict";
jQuery( window ).on( 'load', function(){
  if ( jQuery( ".ihc-js-stripe-v1-data" ).length ){
      jQuery( ".ihc-js-stripe-v1-data" ).each( function(){
        var theKey = jQuery( this ).attr( "data-key" );
        var locale = jQuery( this ).attr( "data-locale" );
        var image = jQuery( this ).attr( "data-image" );
        var bttn = jQuery( this ).attr( "data-bttn" );
        var email = jQuery( this ).attr( "data-email" );
        var multiply = jQuery( this ).attr( "data-multiply" );
        var target_url = jQuery( this ).attr( "data-target_url" );
        var theUid = jQuery( this ).attr( "data-uid" );
        var blogname = jQuery( this ).attr( "data-blogname" );
        var theCurrency = jQuery( this ).attr( "data-currency" );
        var form = jQuery( this ).attr( "data-form" );
        var isRenew = jQuery( this ).attr( "data-is_renew" );

        if ( isRenew ){
          window.ihcStripeHandlerRenew = StripeCheckout.configure({
              key           : theKey,
              locale        : locale,
              image         : image,
              panelLabel    : bttn,
              email         : email,
              token         : function(response) {
                  var input = jQuery("<input type=hidden name=stripeToken id=stripeToken />").val(response.id);
                  var email = jQuery("<input type=hidden name=stripeEmail id=stripeEmail />").val(response.email);
                  jQuery( form ).append(input);
                  jQuery( form ).append(email);
                  jQuery( form ).submit();
              }
          });
        } else {
          window.ihcStripeHandler = StripeCheckout.configure({
              key           : theKey,
              locale        : locale,
              image         : image,
              panelLabel    : bttn,
              email         : email,
              token         : function(response) {
                  var input = jQuery("<input type=hidden name=stripeToken id=stripeToken />").val(response.id);
                  var email = jQuery("<input type=hidden name=stripeEmail id=stripeEmail />").val(response.email);
                  jQuery( form ).append(input);
                  jQuery( form ).append(email);
                  jQuery( form ).submit();
              }
          });
        }


          if ( jQuery( ".ihc-js-stripe-v1-data" ).attr("data-bind") == 1 ){
              jQuery("#ihc_submit_bttn").on("click", function(e){
                var multiply = jQuery( ".ihc-js-stripe-v1-data" ).attr( "data-multiply" );
                e.preventDefault();
                if (jQuery("#stripeToken").val() && jQuery("#stripeEmail").val()){
                  jQuery(".ihc-form-create-edit").submit();
                  return true;
                }
                var p = jQuery("#iumpfinalglobalp").val();
                p = p * multiply;
                var accessType = jQuery( ".ihc-js-stripe-v1-data" ).attr( "data-access_type" );

                if ( accessType != "regular_period" && p == 0 ){
                    jQuery(".ihc-form-create-edit").submit();
                    return;
                }

                if ( multiply == 100 && p>0 && p<50){
                  p = 50;
                }

                window.ihcStripeHandler.open({
                        name: jQuery("#iump_site_name").val(),
                        description: jQuery("#iumpfinalglobal_ll").val(),
                        email: jQuery("[name=user_email]").val(),
                        amount: p,
                        currency: jQuery("#iumpfinalglobalc").val()
                });
              });
          }
      });
  }

});

function ihc_stripe_payment(l_name, l_amount, lid){
  var multiply = jQuery(".ihc-js-stripe-v1-data").attr( "data-multiply" );
  var l_amount = l_amount * multiply;
  if (l_amount<50){
    l_amount = 50;
  }
  var theUid = jQuery(".ihc-js-stripe-v1-data").attr( "data-uid" );
  var blogname = jQuery(".ihc-js-stripe-v1-data").attr( "data-blogname" );
  var theCurrency = jQuery(".ihc-js-stripe-v1-data").attr( "data-currency" );

  jQuery("#ihc_lid_stripe").val(lid);
  if (jQuery("#ihc_coupon").val()){
    //with coupon
    jQuery.ajax({
          type : "post",
          url : target_url,
          data : {
                ihc_coupon        : jQuery("#ihc_coupon").val(),
                l_id              : lid,
                initial_price     : l_amount,
          },
          success: function (data) {
            if (data!=0){
              var obj = jQuery.parseJSON(data);
              if (typeof obj.price!="undefined"){
                jQuery(".ihc-stripe-form-payment").append("<input type=hidden value=" + jQuery("#ihc_coupon").val() + " name=ihc_coupon />");
                if (obj.price==0){
                    jQuery(".ihc-stripe-form-payment").append("<input type=hidden name=stripeToken value=stripe />");
                    jQuery(".ihc-stripe-form-payment").append("<input type=hidden name=stripeEmail value=stripe />");
                    jQuery(".ihc-stripe-form-payment").submit();
                    return;
                  } else if ( multiply==100 && obj.price<50 ){
                    obj.price = 50;
                  }
                var l_amount = obj.price;
                ///
                  jQuery.ajax({
                        type: "post",
                        url: decodeURI(window.ihc_site_url)+"/wp-admin/admin-ajax.php",
                          data: {
                              action: "ihc_get_amount_plus_taxes_by_uid",
                                    uid     : theUid,
                                    price   : l_amount,
                          },
                          success: function(data){
                              if (data){
                                var l_amount = data;
                              }
                            window.ihcStripeHandler.open({
                              name          : blogname,
                              description   : l_name,
                              amount        : l_amount,
                              currency      : theCurrency
                            });
                          }
                  });
              }
            }
          }
    });
  } else {
    //without coupon
    jQuery.ajax({
          type: "post",
          url: decodeURI(window.ihc_site_url)+"/wp-admin/admin-ajax.php",
            data: {
                action  : "ihc_get_amount_plus_taxes_by_uid",
                uid     : theUid,
                price   : l_amount,
            },
            success: function(data){
                if (data){
                  var l_amount = data;
                }
              jQuery("#ihc_lid_stripe").val(lid);
                window.ihcStripeHandler.open({
                name          : blogname,
                description   : l_name,
                amount        : l_amount,
                currency      : theCurrency
              });
          }
    });
  }
}

function ihc_stripe_renew_payment(l_name, l_amount, lid){
  var multiply      = jQuery(".ihc-js-stripe-v1-data").attr( "data-multiply" );
  var uid           = jQuery(".ihc-js-stripe-v1-data").attr( "data-uid" );
  var targetUrl     = jQuery(".ihc-js-stripe-v1-data").attr( "data-target_url" );
  var form          = jQuery(".ihc-js-stripe-v1-data").attr( "data-form" );
  var userEmail     = jQuery(".ihc-js-stripe-v1-data").attr( "data-email" );

  var l_amount = l_amount * multiply;
  if ( multiply == 100 && l_amount>0 && l_amount<50){
      l_amount = 50;
  }
  jQuery("#ihc_renew_level").val(lid);
  if (jQuery("#ihc_coupon").val()){
    jQuery.ajax({
          type : "post",
          url : targetUrl,
          data : {
                ihc_coupon      : jQuery("#ihc_coupon").val(),
                l_id            : lid,
                initial_price   : l_amount
          },
          success: function (data) {
              if (data!=0){
                  if (jQuery("#ihc_coupon").val()){
                    jQuery( form ).append("<input type=hidden value=" + jQuery("#ihc_coupon").val() + " name=ihc_coupon />");
                  }
                  var obj = jQuery.parseJSON(data);
                  if (typeof obj.price!="undefined"){
                      var l_amount = obj.price;
                      if (multiply==100 && l_amount>0 && l_amount<50){
                        l_amount = 50;
                      }

                      if(l_amount == 0){
                          return;
                      }

                      jQuery.ajax({
                            type: "post",
                            url: decodeURI(window.ihc_site_url)+"/wp-admin/admin-ajax.php",
                            data: {
                                  action    : "ihc_get_amount_plus_taxes_by_uid",
                                  uid       : uid,
                                  price     : l_amount,
                            },
                            success: function(data){
                                if (data){
                                    var l_amount = data;
                                }
                                window.ihcStripeHandlerRenew.open({
                                      name        : l_name,
                                      email       : userEmail,
                                      description : "Level " + lid,
                                      amount      : l_amount,
                                });
                            }
                      });
                  }
              }
          }
    });
  } else {
      jQuery.ajax({
          type      : "post",
          url       : decodeURI( window.ihc_site_url )+"/wp-admin/admin-ajax.php",
          data      : {
                action    : "ihc_get_amount_plus_taxes_by_uid",
                uid       : uid,
                price     : l_amount,
          },
          success   : function(data){
              if ( data ){
                  var l_amount = data;
              }
              window.ihcStripeHandlerRenew.open({
                      name          : l_name,
                      email         : userEmail,
                      description   : "Level " + lid,
                      amount        : l_amount,
              });
          }
      });
  }
}
