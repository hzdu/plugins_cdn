/*
* Ultimate Membership Pro - Stripe Connect utilities
*/
"use strict";
var IhcStripeConnect = {
    formId                      : 'createuser',
    stripeObject                : null,
    card                        : null,
    elements                    : null,
    canDoSubmit                 : false,
    stripeSelected              : false,

    init                        : function( args ){
        var object = this;
        if ( window.ihcCheckoutIsRegister === '0' ){
            object.formId = 'checkout';
        }

        // saved cards
        if ( jQuery('[name=ihc_stripe_connect_payment_methods]').length > 0  ){
            jQuery( '[name=ihc_stripe_connect_payment_methods]' ).on( 'click', function(){
                jQuery( '.ihc-stripe-connect-saved-card-wrapper' ).removeClass( 'ihc-stripe-connect-saved-card-wrapper-selected' );
                if ( this.value === 'new' ){
                    // show stripe new card field
                    jQuery( '.ihc-js-stripe-connect-wrapp' ).removeClass( 'ihc-display-none' );
                } else {
                    // hide stripe new card field
                    jQuery( '.ihc-js-stripe-connect-wrapp' ).addClass( 'ihc-display-none' );
                }
                jQuery( this ).parent().addClass( 'ihc-stripe-connect-saved-card-wrapper-selected' );
            });
        }

        if ( jQuery('.ihc-js-connect-do-setup-intent').length == 0 && jQuery('.ihc-js-connect-do-payment-intent').length == 0 ){
            object.removePreventSubmit();
            return;
        }

        ihcAddAction( 'checkeout-payment-type-radio-change', function(){
        		var type = jQuery('[name=ihc_payment_gateway]').val();
            if ( type !== 'stripe_connect' ){
                if ( jQuery( '#ihc_submit_bttn' ).length > 0 ){
                    // remove disabled attr from submit button
                    jQuery( '#ihc_submit_bttn' ).removeAttr( 'disabled' );
                    jQuery( '#ihc_submit_bttn' ).attr( 'value', jQuery( '#ihc_submit_bttn' ).attr('data-standard-label') );
                }
                object.removePreventSubmit();
            }
        }, 0 );

        ihcAddAction( 'checkeout-payment-type-select-change', function(){
            var type = jQuery('[name=ihc_payment_gateway]').val();
            if ( type !== 'stripe_connect' ){
                if ( jQuery( '#ihc_submit_bttn' ).length > 0 ){
                    // remove disabled attr from submit button
                    jQuery( '#ihc_submit_bttn' ).removeAttr( 'disabled' );
                    jQuery( '#ihc_submit_bttn' ).attr( 'value', jQuery( '#ihc_submit_bttn' ).attr('data-standard-label') );
                }
                object.removePreventSubmit();
            }
        }, 0 );

        ihcAddAction( 'checkeout-payment-type-logos-change', function(){
            var type = jQuery('[name=ihc_payment_gateway]').val();
            if ( type !== 'stripe_connect' ){
                if ( jQuery( '#ihc_submit_bttn' ).length > 0 ){
                    // remove disabled attr from submit button
                    jQuery( '#ihc_submit_bttn' ).removeAttr( 'disabled' );
                    jQuery( '#ihc_submit_bttn' ).attr( 'value', jQuery( '#ihc_submit_bttn' ).attr('data-standard-label') );
                }
                object.removePreventSubmit();
            }
        }, 0 );

        if ( jQuery( '[name=payment_selected]' ).val() === 'stripe_connect' ){
            self.IhcStripeConnect.initStripeObject();
            object.activatePreventSubmit();
        }

        // hook into indeed checkout object
        /*
        ihcAddAction( 'checkout-loaded', function(){
        		self.IhcStripeConnect.initStripeObject();
        }, 0 );
        */
        self.IhcStripeConnect.initStripeObject();

    },

    activatePreventSubmit           : function(){
        /// prevent form submit when stripe connect is selected, this will perform an extra ajax check to see if the payment fields are completed
        var theTarget = document.getElementById( self.IhcStripeConnect.formId );
        if ( typeof theTarget === 'undefined' || theTarget === null ){
            return;
        }

        if ( indeedDetectBrowser() === 'Firefox' ){
            // FIREFOX
            self.stripeSelected = true;
            jQuery( '#' + self.IhcStripeConnect.formId ).on( 'submit', self.IhcStripeConnect.preventFormSubmit );
        } else {
            theTarget.addEventListener( 'submit', self.IhcStripeConnect.preventFormSubmit, true );
        }

    },

    removePreventSubmit              : function(){
        var theTarget = document.getElementById( self.IhcStripeConnect.formId );
        if ( typeof theTarget === 'undefined' || theTarget === null ){
            return;
        }
        if ( indeedDetectBrowser() === 'Firefox' ){
            // FIREFOX
            self.stripeSelected = false;
            theTarget.removeEventListener( 'submit', self.IhcStripeConnect.preventFormSubmit );
        } else {
            theTarget.removeEventListener( 'submit', self.IhcStripeConnect.preventFormSubmit, true );
        }

    },

    initStripeObject                  : function(){
      // initiate stripe
      self.IhcStripeConnect.stripeObject = Stripe( window.ihcStripeConnectPublicKey, { stripeAccount: window.ihcStripeConnectAcctNumber, locale: window.ihcStripeConnectLang } );
      //var clientSecret = jQuery('#ihc-js-stripe-connect-card-element').attr('data-client');

      self.IhcStripeConnect.elements = self.IhcStripeConnect.stripeObject.elements( );

      self.IhcStripeConnect.card = self.IhcStripeConnect.elements.create("card", {
        style: {
        base: {
          lineHeight: '50px',
          color: '#444444',
          fontWeight: '500',
          fontFamily: 'Montserrat, Arial, Helvetica',
          fontSize: '15px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {
            backgroundColor: '#fce883',
          },
          '::placeholder': {
            color: '#aaaaaa',
          },
        },
        invalid: {
          iconColor: '#dd3559',
          color: '#dd3559',
        },
      },
        hidePostalCode: true
      });
      self.IhcStripeConnect.card.mount( "#ihc-js-stripe-connect-card-element" );

    },

    preventFormSubmit             : function( evt ){
      if ( indeedDetectBrowser() === 'Firefox' ){
          // special conditions for firefox
          if ( self.stripeSelected == false ){
              return true;
          } else {
              evt.preventDefault();
              evt.stopPropagation();
              evt.stopImmediatePropagation();
              self.IhcStripeConnect.check();
              return false;
          }
      } else {
          evt.preventDefault();
          evt.stopPropagation();
          evt.stopImmediatePropagation();
          self.IhcStripeConnect.check();
          return false;
      }
    },

    check                         : function(){

      if ( self.IhcStripeConnect.formId === 'createuser' ){
          // is register, so we must verify if the form is properly completed
          if ( typeof window.indeedRegisterErrors !== 'undefined' && window.indeedRegisterErrors.length > 0 ){
              // function ihcRegisterCheckViaAjax has find errors so we won't go further
              return;
          }
          if ( typeof window.ihc_req_fields_arr !== 'undefined'
              && window.ihc_req_fields_arr
              && self.IhcStripeConnect.canDoSubmit === false
              && ( typeof window.ihcRegisterCheckFieldsAjaxFired === 'undefined'
              || window.ihcRegisterCheckFieldsAjaxFired == 0 )
          ){
                self.IhcStripeConnect.checkRequiredFields( window.ihc_req_fields_arr );
                return;
          }
      }

      if ( jQuery('[name=ihc_stripe_connect_payment_methods]').length > 0
            && jQuery('input[name=ihc_stripe_connect_payment_methods]:checked').val() !== 'new'
            && jQuery('[name=ihc_stripe_connect_payment_methods]').val() !== '' ){
         // payment with old card
         var theTarget = document.getElementById( self.IhcStripeConnect.formId );
         self.IhcStripeConnect.removePreventSubmit();
         self.IhcStripeConnect.activateSpinner();
         theTarget.submit();
         return false; /// very important to stop the process here
      } else if ( jQuery('.ihc-js-connect-do-payment-intent').length > 0 ){
          // new card - payment intent
          var fullName = jQuery( '[name=ihc_stripe_connect_full_name]' ).val();
          self.IhcStripeConnect.activateSpinner();

          self.IhcStripeConnect.stripeObject.createPaymentMethod({
            type              : 'card',
            card              : self.IhcStripeConnect.card,
            billing_details   : {
                                  name      : fullName,
            },
          }).then(function(result) {
              if ( jQuery( '#ihc_js_stripe_connect_card_error_message').length > 0 ){
                  jQuery( '#ihc_js_stripe_connect_card_error_message' ).remove();
              }
              if ( typeof result.error !== 'undefined' ){
                  jQuery( '#ihc_stripe_connect_payment_fields' ).append( '<div class="ihc-wrapp-the-errors" id="ihc_js_stripe_connect_card_error_message">' + result.error.message + '</div>' );
                  self.IhcStripeConnect.deactivateSpinner();
                  return false;
              }

              if ( typeof result.paymentMethod.id !== 'undefined' ){
                  // send ajax to get the payment intent or setup intent
                  jQuery.ajax({
                       type 		: "post",
                       url 		: decodeURI(window.ihc_site_url) + '/wp-admin/admin-ajax.php',
                       data 		: {
                                  action							: "ihc_ajax_stripe_connect_generate_payment_intent",
                                  session             : jQuery( '.ihc-js-checkout-session' ).attr( 'data-value'),
                                  payment_method      : result.paymentMethod.id,

                       },
                       success	: function( responseJson ) {
                          var response = JSON.parse( responseJson );
                          if ( response.status === 0 ){
                              self.IhcStripeConnect.deactivateSpinner();
                              return false;
                          }
                          var fullName = jQuery( '[name=ihc_stripe_connect_full_name]' ).val();
                          jQuery( '[name=stripe_payment_intent]' ).val( response.payment_intent_id );
                          self.IhcStripeConnect.stripeObject.confirmCardPayment( response.client_secret, {
                                payment_method: {
                                    card: self.IhcStripeConnect.card,
                                    billing_details: {
                                      name: fullName
                                    }
                                }
                          }).then(function(result) {
                              if ( typeof result.error !== 'undefined' ){
                                  self.IhcStripeConnect.deactivateSpinner();
                                  return false;
                              } else {
                                  //self.IhcStripeConnect.activateSpinner();
                                  var theTarget = document.getElementById( self.IhcStripeConnect.formId );
                                  self.IhcStripeConnect.removePreventSubmit();
                                  theTarget.submit();
                              }
                          });
                       }
                  });
              }
          });
          //return false;
      } else if ( jQuery('.ihc-js-connect-do-setup-intent').length > 0 ){
          // new card - setup intent
          var fullName = jQuery( '[name=ihc_stripe_connect_full_name]' ).val();
          self.IhcStripeConnect.activateSpinner();
          self.IhcStripeConnect.stripeObject.createPaymentMethod({
            type              : 'card',
            card              : self.IhcStripeConnect.card,
            billing_details   : {
                                  name      : fullName,
            },
          }).then(function(result) {
              if ( jQuery( '#ihc_js_stripe_connect_card_error_message').length > 0 ){
                  jQuery( '#ihc_js_stripe_connect_card_error_message' ).remove();
              }
              if ( typeof result.error !== 'undefined' ){
                  jQuery( '#ihc_stripe_connect_payment_fields' ).append( '<div class="ihc-wrapp-the-errors" id="ihc_js_stripe_connect_card_error_message">' + result.error.message + '</div>' );
                  self.IhcStripeConnect.deactivateSpinner();
                  return;
              }

              if ( typeof result.paymentMethod.id !== 'undefined' ){
                  // send ajax to get the payment intent or setup intent
                  jQuery.ajax({
                       type 		: "post",
                       url 		: decodeURI(window.ihc_site_url) + '/wp-admin/admin-ajax.php',
                       data 		: {
                                  action							: "ihc_ajax_stripe_connect_generate_setup_intent",
                                  session             : jQuery( '.ihc-js-checkout-session' ).attr( 'data-value'),
                                  payment_method      : result.paymentMethod.id,

                       },
                       success	: function( responseJson ) {
                          var response = JSON.parse( responseJson );
                          if ( response.status === 0 ){
                              self.IhcStripeConnect.deactivateSpinner();
                              return false;
                          }
                          var fullName = jQuery( '[name=ihc_stripe_connect_full_name]' ).val();
                          jQuery( '[name=stripe_setup_intent]' ).val( response.setup_intent_id );
                          self.IhcStripeConnect.stripeObject.confirmCardSetup( response.client_secret, {
                                payment_method: {
                                    card: self.IhcStripeConnect.card,
                                    billing_details: {
                                      name: fullName
                                    }
                                }
                          }).then(function(result) {
                              if ( typeof result.error !== 'undefined' ){
                                  self.IhcStripeConnect.deactivateSpinner();
                                  return false;
                              } else {
                                  //self.IhcStripeConnect.activateSpinner();
                                  var theTarget = document.getElementById( self.IhcStripeConnect.formId );
                                  self.IhcStripeConnect.removePreventSubmit();
                                  theTarget.submit();
                              }

                          });
                       }
                  });
              }
          });
          return false;
      }

    },

    activateSpinner: function(){
        if ( jQuery( '.ihc-loading-purchase-button' ).length > 0 ){
          jQuery( '.ihc-complete-purchase-button' ).addClass( 'ihc-display-none' );
          jQuery('.ihc-loading-purchase-button').removeClass('ihc-display-none').addClass('ihc-display-block');
        } else {
            if ( jQuery( '#ihc_submit_bttn' ).length > 0 ){
                // make submit button disabled
                jQuery( '#ihc_submit_bttn' ).attr( 'disabled', 'disabled' );
                jQuery( '#ihc_submit_bttn' ).attr( 'value', jQuery( '#ihc_submit_bttn' ).attr('data-loading-label') );
            }
        }
    },

    deactivateSpinner: function(){
        if ( jQuery( '.ihc-loading-purchase-button' ).length > 0 ){
          jQuery('.ihc-loading-purchase-button').removeClass('ihc-display-block').addClass('ihc-display-none');
          jQuery( '.ihc-complete-purchase-button' ).removeClass('ihc-display-none').addClass( 'ihc-display-block' );
        } else {
            if ( jQuery( '#ihc_submit_bttn' ).length > 0 ){
                // remove disabled attr from submit button
                jQuery( '#ihc_submit_bttn' ).removeAttr( 'disabled' );
                jQuery( '#ihc_submit_bttn' ).attr( 'value', jQuery( '#ihc_submit_bttn' ).attr('data-standard-label') );
            }
        }
    },

    checkRequiredFields: function( types_arr ){

      if ( typeof window.ihcRegisterCheckFieldsAjaxFired === 'undefined' || window.ihcRegisterCheckFieldsAjaxFired === 0 ){
          window.ihcRegisterCheckFieldsAjaxFired = 1;
      } else {
          return;
      }
      self.IhcStripeConnect.activateSpinner();
      jQuery('.ihc-register-notice').remove();
      var fields_to_send = [];

      //EXCEPTIONS
      var exceptions = jQuery("#ihc_exceptionsfields").val();
      if (exceptions){
        var exceptions_arr = exceptions.split(',');
      }

      for (var i=0; i<types_arr.length; i++){
        //CHECK IF FIELD is in exceptions
        if (exceptions_arr && exceptions_arr.indexOf(types_arr[i])>-1){
          continue;
        }
        var is_unique_field = false;

        jQuery('.ihc-form-create-edit [name='+types_arr[i]+']').removeClass('ihc-input-notice');

        var field_type = jQuery('.ihc-form-create-edit [name=' + types_arr[i] + ']').attr('type');
        if (typeof field_type=='undefined'){
          var field_type = jQuery('.ihc-form-create-edit [name=\'' + types_arr[i] + '[]\']').attr('type');
        }
        if (typeof field_type=='undefined'){
          var field_type = jQuery('.ihc-form-create-edit [name=\'' + types_arr[i] + '\']').prop('nodeName');
        }
        if (typeof field_type=='undefined'){
          var field_type = jQuery('.ihc-form-create-edit [name=\'' + types_arr[i] + '[]\']').prop('nodeName');
          if (field_type=='SELECT'){
            field_type = 'multiselect';
          }
        }

        if (field_type=='checkbox' || field_type=='radio'){
          var val1 = ihcGetCheckboxRadioValue(field_type, types_arr[i]);
        } else if ( field_type=='multiselect' ){
          val1 = jQuery('.ihc-form-create-edit [name=\'' + types_arr[i] + '[]\']').val();
          if (typeof val1=='object' && val1!=null){
            val1 = val1.join(',');
          }
        } else {
          var val1 = jQuery('.ihc-form-create-edit [name='+types_arr[i]+']').val();
          if (jQuery('.ihc-form-create-edit [name='+types_arr[i]+']').attr('data-search-unique')){
            var is_unique_field = true;
          }
        }

        var val2 = '';
        if (types_arr[i]=='pass2'){
          val2 = jQuery('.ihc-form-create-edit [name=pass1]').val();
        } else if (types_arr[i]=='confirm_email'){
          val2 = jQuery('.ihc-form-create-edit [name=user_email]').val();
        } else if (types_arr[i]=='tos') {
          if (jQuery('.ihc-form-create-edit [name=tos]').is(':checked')){
            val1 = 1;
          } else {
            val1 = 0;
          }
        } else if ( types_arr[i] == 'recaptcha' ){
            val1 = jQuery( '.ihc-form-create-edit [name=g-recaptcha-response]' ).val();
        }

        var params_to_send = {type: types_arr[i], value: val1, second_value: val2};
        if (is_unique_field){
          params_to_send.is_unique_field = true;
        }
        fields_to_send.push(params_to_send);
      }

        jQuery.ajax({
            type : "post",
            url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
            data : {
                       action: "ihc_check_reg_field_ajax",
                       fields_obj: fields_to_send
                   },
            success: function (data) {
              var obj = JSON.parse(data);
              var must_submit = 1;

              for (var j=0; j<obj.length; j++){
                  var field_type = jQuery('.ihc-form-create-edit [name=' + obj[j].type + ']').attr('type');
                  if (typeof field_type=='undefined'){
                    var field_type = jQuery('.ihc-form-create-edit [name=\'' + obj[j].type + '[]\']').attr('type');
                  }
                  if (typeof field_type=='undefined'){
                    var field_type = jQuery('.ihc-form-create-edit [name=\'' + obj[j].type + '\']').prop('nodeName');
                  }
                  if (typeof field_type=='undefined'){
                    var field_type = jQuery('.ihc-form-create-edit [name=\'' + obj[j].type + '[]\']').prop('nodeName');
                    if (field_type=='SELECT'){
                      field_type = 'multiselect';
                    } else if ( obj[j].type === 'recaptcha' ){
                        field_type = 'recaptcha';
                    }
                  }

                  if (field_type=='radio'){
                    var target_id = jQuery('.ihc-form-create-edit [name='+obj[j].type+']').parent().parent().attr('id');
                  } else if (field_type=='checkbox' && obj[j].type!='tos'){
                    var target_id = jQuery('.ihc-form-create-edit [name=\''+obj[j].type+'[]\']').parent().parent().attr('id');
                  } else if ( field_type=='multiselect'){
                    var target_id = jQuery('.ihc-form-create-edit [name=\''+obj[j].type+'[]\']').parent().attr('id');
                  } else if ( field_type == "recaptcha" ){
                    var target_id = jQuery( '.g-recaptcha-wrapper' ).parent().attr('id');
                  }  else {
                    var target_id = jQuery('.ihc-form-create-edit [name='+obj[j].type+']').parent().attr('id');
                  }

                  if (obj[j].value==1){
                    // it's all good
                  } else {
                    //errors
                      if (typeof target_id=='undefined'){
                        //no target id...insert msg after input
                        jQuery('.ihc-form-create-edit [name='+obj[j].type+']').after('<div class="ihc-register-notice">'+obj[j].value+'</div>');
                        must_submit = 0;
                      } else {
                        jQuery('#'+target_id).append('<div class="ihc-register-notice">'+obj[j].value+'</div>');
                        jQuery('.ihc-form-create-edit [name=' + obj[j].type + ']').addClass('ihc-input-notice');
                        must_submit = 0;
                      }
                  }
              }

              self.IhcStripeConnect.deactivateSpinner();
              window.ihcRegisterCheckFieldsAjaxFired = 0;
              if (must_submit==1){
                 // do submit
                 self.IhcStripeConnect.canDoSubmit = true;
                 self.IhcStripeConnect.check();
                 window.must_submit = 1;
              } else {
                 self.IhcStripeConnect.canDoSubmit = false;
                 window.must_submit = 0;
              }
            }
        });

    }

}

jQuery( window ).on( 'load', function(){
		window.ihcStripeObject = IhcStripeConnect.init( [] );

    ihcAddAction( 'checkout-loaded', function(){
          window.ihcStripeObject = null;
          window.ihcStripeObject = IhcStripeConnect.init( [] );
    }, 0 );

});
