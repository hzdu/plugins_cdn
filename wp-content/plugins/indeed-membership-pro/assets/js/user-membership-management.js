/*
* Ultimate Membership Pro - Member Memberships
*/
"use strict";
var IhcPublicUserMembershipManagement = {

    init: function(){
        var object = this;
        jQuery( window ).on( 'load', function(){

            // pause
            jQuery( '.ihc-js-pause-subscription-bttn' ).on( 'click', function( e, html ){
                object.pauseSubscription( e );
            });

            // resume
            jQuery( '.ihc-js-resume-subscription-bttn' ).on( 'click', function( e, html ){
                object.reactivateSubscription( e );
            });

            // finish payment
            jQuery( '.ihc-js-finish-payment-bttn' ).on( 'click', function( e, html ){
                object.finishPayment( e );
            });

            // renew payment
            jQuery( '.ihc-js-renew-level-bttn' ).on( 'click', function( e, html ){
                object.renewSubscription( e );
            });

        });

    },

    pauseSubscription: function( e ){
        var level = jQuery( e.target ).attr( 'data-lid' );
        var subscriptionId = jQuery( e.target ).attr( 'data-subscription_id' );
        jQuery.ajax({
            type : "post",
            url : decodeURI(window.ihc_site_url) + '/wp-admin/admin-ajax.php',
            data : {
                       action                 : 'ihc_user_put_subscrition_on_pause',
                       subscriptionId         : jQuery( e.target ).attr( 'data-subscription_id' ),
                       lid                    : level
            },
            success: function ( response ) {
                if ( response ){
                    window.location.reload();
                }
            }
       });
    },

    reactivateSubscription: function( e ){
        var level = jQuery( e.target ).attr( 'data-lid' );
        var subscriptionId = jQuery( e.target ).attr( 'data-subscription_id' );
        jQuery.ajax({
            type : "post",
            url : decodeURI(window.ihc_site_url) + '/wp-admin/admin-ajax.php',
            data : {
                       action                 : 'ihc_user_put_subscrition_resume',
                       subscriptionId         : jQuery( e.target ).attr( 'data-subscription_id' ),
                       lid                    : level
            },
            success: function ( response ) {
                if ( response ){
                    window.location.reload();
                }
            }
       });
    },

    finishPayment: function( e ){
        var levelName = jQuery( e.target ).attr( 'data-level_name' );
        var levelAmount = jQuery( e.target ).attr( 'data-level_amount' );
        var lid = jQuery( e.target ).attr( 'data-lid' );
        var formId = '#ihc_form_ap_subscription_page';
        var inputHiddenId = '#ihc_finish_payment_level';
        var paymntType = jQuery('[name=ihc_payment_gateway]').val();
        var orderId = jQuery( e.target ).attr( 'data-oid' );
        if ( paymntType == 'stripe' ){
            if ( typeof ihc_stripe_renew_payment == 'function' ) {
              ihc_stripe_renew_payment( levelName, levelAmount, lid );
              return false;
            }
        } else {
            if (jQuery("#ihc_coupon").val()){
              jQuery(formId).append("<input type=hidden value=" + jQuery("#ihc_coupon").val() + " name=ihc_coupon />");
            }
            jQuery(inputHiddenId).val(lid);
            jQuery(formId).append( "<input type=hidden value=" + orderId + " name=order_id />" )
            jQuery(formId).submit();
        }
    },

    renewSubscription: function( e ){
          var levelName = jQuery( e.target ).attr( 'data-level_name' );
          var levelAmount = jQuery( e.target ).attr( 'data-level_amount' );
          var lid = jQuery( e.target ).attr( 'data-lid' );
          var formId = '#ihc_form_ap_subscription_page';
          var inputHiddenId = '#ihc_renew_level';
          ihcRenewFunction( inputHiddenId, formId, lid, levelName, levelAmount );
    }

};

IhcPublicUserMembershipManagement.init();
