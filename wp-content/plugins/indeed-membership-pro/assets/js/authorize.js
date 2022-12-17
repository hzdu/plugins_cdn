/*
* Ultimate Membership Pro - Authorize utilities
*/
"use strict";
var IhcAuthorize = {
    formId                      : 'createuser',
    init                        : function( args ){
        var object = this;

        if ( window.ihcCheckoutIsRegister === '0' ){
            object.formId = 'checkout';
        }
        
        // card name
        jQuery( '[name=ihcpay_cardholderName]' ).on( 'blur', function( evt, html ){
            object.checkField( evt, html, object );
        });

        // card number
        jQuery( '[name=ihcpay_card_number]' ).on( 'blur', function( evt, html ){
            object.checkField( evt, html, object );
        });

        // expire year
        jQuery( '[name=ihcpay_card_expire]' ).on( 'blur', function( evt, html ){
            object.checkField( evt, html, object );
        });


        // if authorize is the payment gateway
        // select payment - logos
        jQuery( '.ihc-js-select-payment' ).on( 'click', function( e, html ){
            var type = jQuery(e.target).attr( 'data-type' );
            if ( type === 'authorize' ){
                object.activatePreventSubmit();
            } else {
                object.removePreventSubmit();
            }
        });

        // select payment - select
        jQuery( '.ihc-js-select-payment-service-select' ).on( 'change', function( e, html ){
            var type = jQuery(e.target).val();
            if ( type === 'authorize' ){
                object.activatePreventSubmit();
            } else {
                object.removePreventSubmit();
            }
        });

        // select payment - radio
        jQuery( '.ihc-js-select-payment-service-radio' ).on( 'click', function( e, html ){
            var type = jQuery(e.target).val();
            if ( type === 'authorize' ){
                object.activatePreventSubmit();
            } else {
                object.removePreventSubmit();
            }
        });

        if ( jQuery( '[name=payment_selected]' ).val() === 'braintree' ){
            object.activatePreventSubmit();
        }

    },

    checkField                    : function( evt, html, object ){
        if ( evt.target.value === '' ){
            jQuery( evt.target ).addClass( 'ihc-input-notice' );
        } else {
            jQuery( evt.target ).removeClass( 'ihc-input-notice' );
        }
    },

    preventFormSubmit             : function( evt ){
        evt.preventDefault();
        evt.stopPropagation();
        self.IhcAuthorize.checkFieldsViaAjax();
        return false;
    },

    checkFieldsViaAjax            : function(){
        jQuery.ajax({
            type : "post",
            url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
            data : {
                       action                             : 'ihc_ajax_check_authorize_form_fields',
                       ihcpay_cardholderName              : jQuery( '[name=ihcpay_cardholderName]' ).val(),
                       ihcpay_card_number                 : jQuery( '[name=ihcpay_card_number]' ).val(),
                       ihcpay_card_expire                 : jQuery( '[name=ihcpay_card_expire]' ).val(),
            },
            success: function ( response ) {
   						 	var responseObject = JSON.parse( response );
                if ( responseObject.status === 1 ){
                    var theTarget = document.getElementById( self.IhcAuthorize.formId );
                    theTarget.removeEventListener( 'submit', self.IhcAuthorize.preventFormSubmit, true );
                    theTarget.submit();
                } else {
                    if ( typeof responseObject.errors.ihcpay_cardholderName !== 'undefined' ){
                        jQuery( '[name=ihcpay_cardholderName]' ).addClass( 'ihc-input-notice' );
                    }
                    if ( typeof responseObject.errors.ihcpay_card_number !== 'undefined' ){
                        jQuery( '[name=ihcpay_card_number]' ).addClass( 'ihc-input-notice' );
                    }
                    if ( typeof responseObject.errors.ihcpay_card_expire !== 'undefined' ){
                        jQuery( '[name=ihcpay_card_expire]' ).addClass( 'ihc-input-notice' );
                    }
                    return false;
                }
            }
        });
        return false;
    },

    activatePreventSubmit           : function(){
        /// prevent form submit when authorize is selected, this will perform an extra ajax check to see if the payment fields are completed
        var theTarget = document.getElementById( self.IhcAuthorize.formId );
        if ( typeof theTarget === 'undefined' || theTarget === null ){
            return;
        }
        theTarget.addEventListener( 'submit', self.IhcAuthorize.preventFormSubmit, true );
    },

    removePreventSubmit              : function(){
      var theTarget = document.getElementById( self.IhcAuthorize.formId );
      if ( typeof theTarget === 'undefined' || theTarget === null ){
          return;
      }
      theTarget.removeEventListener( 'submit', self.IhcAuthorize.preventFormSubmit, true );
    },

}

jQuery( window ).on( 'load', function(){
		IhcAuthorize.init( [] );
});
