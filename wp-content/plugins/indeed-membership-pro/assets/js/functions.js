/*
* Ultimate Membership Pro - Main Functions
*/
"use strict";
function ihcDeleteFileViaAjax(id, u_id, parent, name, hidden_id){
    var r = confirm("Are you sure you want to delete?");
	if (r) {
    var s = jQuery(parent).attr('data-h');
    jQuery.ajax({
        type : "post",
        url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
        data : {
                   action: "ihc_delete_attachment_ajax_action",
                   attachemnt_id: id,
                   user_id: u_id,
                   field_name: name,
                   h: s
               },
        success: function (data) {
			    jQuery(hidden_id).val('');
        	jQuery(parent + ' .ajax-file-upload-filename').remove();
        	jQuery(parent + ' .ihc-delete-attachment-bttn').remove();
        	if (jQuery(parent + ' .ihc-member-photo').length){
        		jQuery(parent + ' .ihc-member-photo').remove();
        		if (name=='ihc_avatar'){
        			jQuery(parent).prepend("<div class='ihc-no-avatar ihc-member-photo'></div>");
        			jQuery(parent + " .ihc-file-upload").css("display", 'block');
        		}
        	}

        	if (jQuery(parent + " .ihc-file-name-uploaded").length){
        		jQuery(parent + " .ihc-file-name-uploaded").remove();
        	}

        	if (jQuery(parent + ' .ajax-file-upload-progress').length){
        		jQuery(parent + ' .ajax-file-upload-progress').remove();
        	}
        	if (jQuery(parent + ' .ihc-icon-file-type').length){
        		jQuery(parent + ' .ihc-icon-file-type').remove();
        	}
        }
   });
	}
}

function ihcSetFormI(i_id, f_id, l_id, confirm){
	/*
	 * i_id = input hidden id
	 * f_id = form id
	 * l_id = level id
	 */
	if (confirm){
    if ( typeof window.ihc_translated_labels == 'object' ){
        var ihc_labels = window.ihc_translated_labels;
    } else {
        var ihc_labels = JSON.parse(window.ihc_translated_labels);
    }

		var c = window.confirm( ihc_labels.delete_level );
		if (!c){
			return;
		}
	}
	if (jQuery("#ihc_coupon").val()){
		jQuery(f_id).append("<input type=hidden value=" + jQuery("#ihc_coupon").val() + " name=ihc_coupon />");
	}
	jQuery(i_id).val(l_id);
	jQuery(f_id).submit();
}



function ihcDhSelector(id, display){
	if (display){
		jQuery(id).css('visibility', 'visible');
	} else {
		jQuery(id).css('visibility', 'hidden');
	}
}

function ihcSetLevelAp(l){
	jQuery('#ihc_renew_level').val(l);
	jQuery('#ihc_form_ap_subscription_page').submit();
}

function ihcRunSocialReg(s){
	var form = jQuery("form#createuser");
	jQuery("form#createuser input, form#createuser textarea").each(function(){
		ihcAppendInput(this.name, this.value, "#ihc_social_login_form");
	});
	ihcAppendInput('sm_type', s, "#ihc_social_login_form");
	jQuery("#ihc_social_login_form").submit();
}

function ihcAppendInput(n,v,w){
	jQuery(w).append("<input type=hidden value="+v+" name="+n+" />");
}

function ihcBuyNewLevel(href){
	if (jQuery("#ihc_coupon").val()){
		//we have a coupon
		var url = href + "&ihc_coupon=" + jQuery("#ihc_coupon").val();
		window.location.href = url;
	} else {
		window.location.href = href;
	}
}


function ihcRegisterCheckViaAjax(the_type){
	var target_id = '#' + jQuery('.ihc-form-create-edit [name='+the_type+']').parent().attr('id');
	var val1 = jQuery('.ihc-form-create-edit [name='+the_type+']').val();
	var val2 = '';

	if (the_type=='pass2'){
		val2 = jQuery('.ihc-form-create-edit [name=pass1]').val();
	} else if (the_type=='confirm_email'){
		val2 = jQuery('.ihc-form-create-edit [name=user_email]').val();
	}
   	jQuery.ajax({
        type : "post",
        url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
        data : {
                   action: "ihc_check_reg_field_ajax",
                   type: the_type,
                   value: val1,
                   second_value: val2
               },
        success: function (data) {
        	//remove prev notice, if its case
          if ( typeof window.indeedRegisterErrors === 'undefined' ){
              window.indeedRegisterErrors = [];
          }
        	jQuery(target_id + ' .ihc-register-notice').remove();
        	jQuery('.ihc-form-create-edit [name='+the_type+']').removeClass('ihc-input-notice');
        	if (data==1){
        		// it's all good
            indeedRemoveElementFromArray( window.indeedRegisterErrors, the_type );
        	} else {
        		jQuery(target_id).append('<div class="ihc-register-notice">'+data+'</div>');
        		jQuery('.ihc-form-create-edit [name='+the_type+']').addClass('ihc-input-notice');
            indeedAddElementToArray( window.indeedRegisterErrors, the_type );
          }
        }
   	});
}

function indeedAddElementToArray( array, value )
{
    var index = array.indexOf( value );
    if (index > -1) {
        return;
    }
    array.push( value );
}

function indeedRemoveElementFromArray( array, value )
{
    var index = array.indexOf( value );
    if (index > -1) {
        array.splice( index, 1 );
    }
}

function ihcCheckLoginField(t, e){
	var n = jQuery('#notice_' + t);
	n.fadeOut(500, function(){
		n.remove();
	});
	var target = jQuery('#ihc_login_form [name='+t+']').parent();
	var v = jQuery('#ihc_login_form [name='+t+']').val();
	if (v==''){
		jQuery(target).append('<div class="ihc-login-notice" id="notice_' + t + '">' + e + '</div>');
	}
}

function ihcGetCheckboxRadioValue(type, selector){
	if (type=='radio'){
		var r = jQuery('[name='+selector+']:checked').val();
		if (typeof r!='undefined'){
			return r;
		}
	} else {
		var arr = [];
		jQuery('[name=\''+selector+'[]\']:checked').each(function(){
			arr.push(this.value);
		});
		if (arr.length>0){
			return arr.join(',');
		}
	}
  if ( jQuery('[name="' + selector + '"]').is(':checked') ){
      return 1;
  }
	return '';
}

function ihcRegisterCheckViaAjaxRec( types_arr )
{
  if ( typeof window.ihcRegisterCheckFieldsAjaxFired === 'undefined' || window.ihcRegisterCheckFieldsAjaxFired === 0 ){
      window.ihcRegisterCheckFieldsAjaxFired = 1;
  } else {
      return;
  }

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
              } else {
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

          window.ihcRegisterCheckFieldsAjaxFired = 0;
        	if (must_submit==1){
             window.must_submit = 1;
             jQuery(".ihc-form-create-edit").submit();
        	} else {
             window.must_submit = 0;
    			   return false;
        	}
        }
   	});

}

function ihcPaymentGatewayUpdate(v, is_r){
	//remove authorize block
	//remove stripe stuff
	jQuery('[name=ihc_payment_gateway]').val(v);
	jQuery('#ihc_authorize_r_fields').fadeOut(200);
	jQuery('#ihc_braintree_r_fields').fadeOut(200);
	switch (v){
		case 'stripe':
  	jQuery('#ihc_submit_bttn').off('click');
			jQuery('#ihc_submit_bttn').on('click', function(e){
				e.preventDefault();
				var p = jQuery("#iumpfinalglobalp").val();
				if ((jQuery("#stripeToken").val() && jQuery("#stripeEmail").val()) || p==0){
					jQuery(".ihc-form-create-edit").submit();
					return true;
				}
        window.ihcStripeMultiply = parseInt( window.ihcStripeMultiply );
				p = p * window.ihcStripeMultiply;
				if ( window.ihcStripeMultiply== 100 && p<50 ){
					p = 50;
				}
				window.ihcStripeHandler.open({
								name          : jQuery('#iump_site_name').val(),
								description   : jQuery('#iumpfinalglobal_ll').val(),
								amount        : p,
								currency      : jQuery('#iumpfinalglobalc').val(),
				});
			});
		break;
		case 'authorize':
			if (is_r==1){
				jQuery('#ihc_authorize_r_fields').fadeIn(200);
			}
		break;
		case 'braintree':
			jQuery('#ihc_braintree_r_fields').fadeIn(200);
		break;
	}
}

function iumpStripePrice(){
	var p = jQuery("#iumpfinalglobalp").val();
  window.ihcStripeMultiply = parseInt( window.ihcStripeMultiply );
	p = p * window.ihcStripeMultiply;
	if ( window.ihcStripeMultiply == 100 && p<50 ){
		p = 50;
	}
	return p;
}

function ihcBuyNewLevelFromAp(l_name, l_amount, lid, url){
	var v = jQuery('[name=ihc_payment_gateway]').val();
	if (v=='stripe'){
	   	jQuery.ajax({
	        type : "post",
	        url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
	        data : {
	                   action: "ihc_check_lid_price",
	                   level_id: lid
	               },
	        success: function (data){
	        	if (data==1){
	        		//it's free
	        		ihcBuyNewLevel(url+'&ihc_payment_gateway='+v);
	        	} else {
	        		// make payment with stripe
	        		ihc_stripe_payment(l_name, l_amount, lid);
	        	}
	        }
		});
		//
	} else {
		var c = jQuery('#ihc_coupon').val();

    if (typeof v!='undefined'){
			url = url +'&ihc_payment_gateway='+v;
		}
		ihcBuyNewLevel(url);
	}
}

function ihcRenewFunction(i_id, f_id, l_id, l_name, l_amount){
	/*
	 * i_id = input hidden id
	 * f_id = form id
	 * l_id = level id
	 * l_name = level name
	 * l_amount = level amount
	 */
	var v = jQuery('[name=ihc_payment_gateway]').val();
	if (v=='stripe'){
		if (typeof ihc_stripe_renew_payment == 'function') {
			ihc_stripe_renew_payment(l_name, l_amount, l_id);
			return false;
		}
	} else {
		ihcSetFormI(i_id, f_id, l_id);
	}
}

function ihcPaymentSelectIcon(t){
	jQuery('.ihc-payment-icon').removeClass('ihc-payment-select-img-selected');
	jQuery('#ihc_payment_icon_'+t).addClass('ihc-payment-select-img-selected');
}

//////////////logic condition

function ihcAjaxCheckFieldConditionOnblurOnclick(check_name, field_id, field_name, show){
	var check_value = jQuery(".ihc-form-create-edit [name="+check_name+"]").val();
	ihcAjaxCheckFieldCondition(check_value, field_id, field_name, show);
}

function ihcAjaxCheckOnClickFieldCondition(check_name, field_id, field_name, type, show){
	if (type=='checkbox'){
		var vals = [];
		jQuery(".ihc-form-create-edit [name='"+check_name+"[]']:checked").each(function() {
			vals.push(jQuery(this).val());
	    });
		var check_value = vals.join(',');
	} else {
		var check_value = jQuery(".ihc-form-create-edit [name="+check_name+"]:checked").val();
	}

	ihcAjaxCheckFieldCondition(check_value, field_id, field_name, show);
}

function ihcAjaxCheckOnChangeMultiselectFieldCondition(check_name, field_id, field_name, show){
	var obj = jQuery(".ihc-form-create-edit [name='"+check_name+"[]']").val();
	if (obj!=null){
		var check_value = obj.join(',');
		ihcAjaxCheckFieldCondition(check_value, field_id, field_name, show);
	}
}

function ihcAjaxCheckFieldCondition(check_value, field_id, field_name, show){
   	jQuery.ajax({
        type : "post",
        url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
        data : {
                   action: "ihc_check_logic_condition_value",
                   val: check_value,
                   field: field_name
               },
        success: function (data){
        	var str = jQuery("#ihc_exceptionsfields").val();
        	if (str){
            	var arr = str.split(',');
            	var index = arr.indexOf(field_name);
        	} else {
        		var arr = [];
        	}

        	if (data=='1'){
                if (show==1){
                	jQuery(field_id).fadeIn(200);
                	if (arr.indexOf(field_name)!=-1){
                        arr.splice(index, 1);
                	}
                } else {
                	jQuery(field_id).fadeOut(200);
                	if (arr.indexOf(field_name)==-1){
                		arr.push(field_name);
                	}

                }
        	} else {
                    if (show==1){
                    	jQuery(field_id).fadeOut(200);
                    	if (arr.indexOf(field_name)==-1){
                    		arr.push(field_name);
                    	}
                    } else {
                    	jQuery(field_id).fadeIn(200);
                    	if (arr.indexOf(field_name)!=-1){
                            arr.splice(index, 1);
                    	}
                    }
        	}
        	if (arr){
            	var str = arr.join(',');
            	jQuery("#ihc_exceptionsfields").val(str);
        	}
        }
   	});
}

function ihcCheckUniqueValueField(the_type){
	var target_id = '#' + jQuery('.ihc-form-create-edit [name='+the_type+']').parent().attr('id');
	var v = jQuery('.ihc-form-create-edit [name='+the_type+']').val();
	if (v){
	   	jQuery.ajax({
	        type : "post",
	        url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
	        data : {
	                   action: "ihc_check_unique_value_field_register",
	                   meta_key: the_type,
	                   meta_value: v
	               },
	        success: function (data) {
	        	//remove prev notice, if its case
	        	jQuery(target_id + ' .ihc-register-notice').remove();
	        	jQuery('.ihc-form-create-edit [name='+the_type+']').removeClass('ihc-input-notice');
	        	if (data==1){
	        		// it's all good

	        	} else {
	        		jQuery(target_id).append('<div class="ihc-register-notice">'+data+'</div>');
	        		jQuery('.ihc-form-create-edit [name='+the_type+']').addClass('ihc-input-notice');
	        		window.must_submit = 0;
	        	}
	        }
	   	});
	}
}

function ihcCheckInvitationCode(){
	var target_id = '#' + jQuery('.ihc-form-create-edit #ihc_invitation_code_field').parent().attr('id');
	var v = jQuery('#ihc_invitation_code_field').val();
	if (v){
	   	jQuery.ajax({
	        type : "post",
	        url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
	        data : {
	                   action: "ihc_check_invitation_code_via_ajax",
	                   c: v,
	               },
	        success: function (data) {
	        	//remove prev notice, if its case
	        	jQuery(target_id + ' .ihc-register-notice').remove();
	        	jQuery('.ihc-form-create-edit #ihc_invitation_code_field').removeClass('ihc-input-notice');

	        	if (data==1){
	        		// it's all good
	        	} else {
	        		jQuery(target_id).append('<div class="ihc-register-notice">'+data+'</div>');
	        		jQuery('.ihc-form-create-edit #ihc_invitation_code_field').addClass('ihc-input-notice');
	        		window.must_submit = 0;
	        	}
	        }
	   	});
	}
}

function ihcUpdateCart(){
	var lid_val = jQuery('.ihc-form-create-edit [name=lid]').val();
	var coupon_val = jQuery('.ihc-form-create-edit [name=ihc_coupon]').val();
	var country_val = jQuery('.ihc-form-create-edit #ihc_country_field').val();
	var state_val = jQuery('.ihc-form-create-edit [name=ihc_state]').val();
	if (jQuery('#ihc_dynamic_price').length){
		var d_a = jQuery('#ihc_dynamic_price').val();
	} else {
		var d_a = -1;
	}
  var payment_gateway = jQuery('[name=ihc_payment_gateway]').val()
//console.log(country_val + ' ' + state_val );
	jQuery.ajax({
		type : "post",
	    url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
	    data : {
	            action         : "ihc_get_cart_via_ajax",
	            country        : country_val,
	            lid            : lid_val,
	            coupon         : coupon_val,
	            state          : state_val,
	            a              : d_a,
              payment_type   : payment_gateway,
	    },
		success: function (response){
			jQuery('#ihc_cart_wrapper').remove();
			jQuery('.ihc-form-create-edit').after(response);
		}
	});
}

function ihcShowPrint(i){
	jQuery(i).css('display', 'block');
}

function ihcHidePrint(i){
	jQuery(i).css('display', 'none');
}

function ihcDoPrint(i){
	  var file = jQuery(i).files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
                    var html  = "<html><head>" +
                        "</head>" +
                        "<body  style = '-webkit-print-color-adjust:exact;'>"+
                        "<img src=\"" + event.target.result + "\" onload=\"javascript:window.print();\"/>" +
                        "</body>";
                    var win = window.open("about:blank","_blank");
                    win.document.write(html);

    };
    reader.readAsDataURL(file);
}

function ihcUpdateStateField( updateCart ){
	var s = jQuery('.ihc-form-create-edit [name=ihc_state]').length>0;
	if (s){
		var e = jQuery('.ihc-form-create-edit [name=ihc_country]');
		jQuery.ajax({
			type : "post",
		    url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
		    data : {
		             action: "ihc_get_ihc_state_field",
		             country: e.val(),
		    },
		    success: function (r) {


          var promise = new Promise(function(resolve, reject) {
              var f = jQuery('.ihc-form-create-edit [name=ihc_state]');
    		    	var p = f.parent();
    		    	f.remove();
    		    	p.append(r);
              resolve();
          });

          promise.then(function() {
            if (updateCart){
                ihcUpdateCart();
            }
          });


		    }
		});
	}
}

function ihcRemoveSocial(t){
	jQuery.ajax({
		type : "post",
	    url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
	    data : {
	             action: "ihc_remove_sm_from_user",
	             type: t,
	    },
	    success: function (r) {
	    	location.reload();
	    }
	});
}

function iumpGenerateInvoice(i){
	jQuery.ajax({
		type : "post",
	    url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
	    data : {
	            action: "ihc_generate_invoice",
				      order_id: i
	    },
	    success: function (r) {
	    	if (r){
				   jQuery('body').append(r);
	    	}
	    }
	});
}

function ihcClosePopup(){
	jQuery('#popup_box').fadeOut(300, function(){
		jQuery(this).remove();
	});
}

function ihcDeselectAll(n, c){
	if (jQuery(c).is(':checked')){
		jQuery('[name="'+n+'[]"]').each(function(){
			if (jQuery(this).val()!=''){
				jQuery(this).attr('checked', false);
			}
		});
	}
}

function ihcDynamicPriceUpdateGlobal(){
	var p = jQuery('#ihc_dynamic_price').val();
	jQuery('#iumpfinalglobalp').val(p);
	ihcUpdateCart();
}

function ihcDoUsersiteModuleDelete(i){
  var question = jQuery( '.ihc-js-user-sites-table-data' ).attr( 'data-current_question' );
	var c = confirm( question );
	if (c){
		jQuery.ajax({
			type : "post",
		    url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
		    data : {
		             action  : "ihc_do_user_delete_blog",
					       lid     : i
		    },
		    success: function (r){
          var currentUrl = window.location.href;
          // do a refresh
		    	window.location.href = currentUrl;
		    }
		});
	}
}

jQuery(document).ajaxSend(function (event, jqXHR, ajaxOptions) {

    if ( typeof ajaxOptions.data !== 'string' ||  ajaxOptions.data.includes( 'action=ihc' ) === false ){
        return;
    }

    if ( typeof ajaxOptions.url === 'string' && ajaxOptions.url.includes('/admin-ajax.php')) {
       var token = jQuery('meta[name="ump-token"]').attr("content");
       jqXHR.setRequestHeader('X-CSRF-UMP-TOKEN', token );
    }

});

function ihcInitiateOwl(selector)
{
		var selector = jQuery( selector ).attr( 'data-selector' );
		var autoHeight = jQuery( selector ).attr( 'data-autoHeight' );
		var animateOut = jQuery( selector ).attr( 'data-animateOut' );
		var animateIn = jQuery( selector ).attr( 'data-animateIn' );
		var lazyLoad = jQuery( selector ).attr( 'data-lazyLoad' );
		var loop = jQuery( selector ).attr( 'data-loop' );
		var autoplay = jQuery( selector ).attr( 'data-autoplay' );
		var autoplayTimeout = jQuery( selector ).attr( 'data-autoplayTimeout' );
		var autoplayHoverPause = jQuery( selector ).attr( 'data-autoplayHoverPause' );
		var autoplaySpeed = jQuery( selector ).attr( 'data-autoplaySpeed' );
		var nav = jQuery( selector ).attr( 'data-nav' );
		var navSpeed = jQuery( selector ).attr( 'data-navSpeed' );
		var dots = jQuery( selector ).attr( 'data-dots' );
		var dotsSpeed = jQuery( selector ).attr( 'data-dotsSpeed' );
		var responsiveClass = jQuery( selector ).attr( 'data-responsiveClass' );
		var navigation = jQuery( selector ).attr( 'data-navigation' );
		var owl = jQuery( selector );

		owl.owlihcCarousel({
				items : 1,
				mouseDrag: true,
				touchDrag: true,

				autoHeight: autoHeight,

				animateOut: animateOut,
				animateIn: animateIn,

				lazyLoad : lazyLoad,
				loop: loop,

				autoplay : autoplay,
				autoplayTimeout: autoplayTimeout,
				autoplayHoverPause: autoplayHoverPause,
				autoplaySpeed: autoplaySpeed,

				nav : nav,
				navSpeed : navSpeed,
				navText: [ '', '' ],

				dots: dots,
				dotsSpeed : dotsSpeed,

				responsiveClass: responsiveClass,
				responsive:{
					0:{
						nav:false
					},
					450:{
						nav : navigation
					}
				}
		});
}

window.addEventListener( 'load', function(){

        // Listing Members
        if ( jQuery( '.ihc-js-owl-settings-data' ).length > 0 ){
            jQuery( '.ihc-js-owl-settings-data' ).each(function( e, html ){
                ihcInitiateOwl( this );
            });
        }
});

window.addEventListener( 'load', function(){

      if ( jQuery( '.ihc-js-login-popup-data' ).length ){
          jQuery( '.ihc-js-login-popup-data' ).each( function(){

              // login modal
              if ( jQuery( this ).attr('data-is_register_page') == '1' ){
                jQuery('.ihc-modal-trigger-login').on( 'click', function() {
                    jQuery('html, body').animate({
                        scrollTop: jQuery( '.ihc-login-form-wrap' ).offset().top
                    }, 1000);
                });
              } else if ( jQuery( this ).attr('data-is_logged') == '1' ){
                  jQuery('.ihc-modal-trigger-login').on( 'click', function() {
                      return false;
                  });
              } else {
                  if ( typeof IhcLoginModal !== 'undefined' ){
                      var triggerSelector = jQuery( this ).attr('data-trigger_selector');
                      var preventDefault = jQuery( this ).attr('data-trigger_default');
                      var autostart = jQuery( this ).attr('data-autoStart');
                      IhcLoginModal.init({
                          triggerModalSelector  : triggerSelector,
                          preventDefault        : preventDefault,
                          autoStart             : autostart
                      });
                  }
              }
          });
      }

      jQuery('.ihc-mobile-bttn').on('click', function(){
        jQuery('.ihc-ap-menu').toggle();
      });

      // invoices
      if ( jQuery( '.fa-invoice-preview-ihc' ).length ){
          jQuery( document ).on( 'click', '.ihc-js-public-do-print-this', function(){
              var id = jQuery( this ).attr( 'data-id' );
              jQuery( id ).printThis(window.ihcPrintThisOptions);
          });
      }

      // account page - banner
      if ( jQuery( ".ihc-js-account-page-account-banner-data" ).length ){
          IhcAccountPageBanner.init({
              triggerId					: 'js_ihc_edit_top_ap_banner',
              saveImageTarget		: jQuery( '.ihc-js-account-page-account-banner-data' ).attr( 'data-url_target' ),
              cropImageTarget   : jQuery( '.ihc-js-account-page-account-banner-data' ).attr( 'data-url_target' ),
              bannerClass       : 'ihc-user-page-top-ap-background'
          });
      }

      // Print This Options
      window.ihcPrintThisOptions = {
          importCSS: true,
          importStyle: true,
          loadCSS: window.ihc_plugin_url + "assets/css/style.css",
          debug: false,
          printContainer: true,
          pageTitle: "",
          removeInline: true,
          printDelay: 333,
          header: null,
          formValues: false,
      };

      // Print This
      if ( jQuery(".fa-print-ihc").length ){
          jQuery(".fa-print-ihc").on("click", function(e){
              var idToPrint = jQuery( e.target ).attr( "data-id-to-print" );
              jQuery( "#" + idToPrint ).printThis( window.ihcPrintThisOptions );
          });
      }

      // Coupons
      var e = jQuery('.ihc-form-create-edit [name=ihc_coupon]');
    	e.on('blur', function(){
    		ihcUpdateCart();
    		var p = '#' + e.parent().attr('id');
    		jQuery(p+' #ihc_coupon_code_check_div_msg').remove();
    		if (e.val()){
    			jQuery.ajax({
    				type : "post",
    			    url : decodeURI(window.ihc_site_url)+'/wp-admin/admin-ajax.php',
    			    data : {
    			             action: "ihc_check_coupon_status_via_ajax",
    			             c: e.val(),
    			             l: jQuery('.ihc-form-create-edit [name=lid]').val(),
    			    },
    			    success: function (r) {
    			    	var obj = JSON.parse(r);
    			      if (obj.is_active){
    						    jQuery(p).append('<div class="ihc-coupon-valid" id="ihc_coupon_code_check_div_msg">' + obj.success_msg + '</div>');
    			      } else {
    						    jQuery(p).append('<div class="ihc-coupon-not-valid" id="ihc_coupon_code_check_div_msg">' + obj.err_msg + '</div>');
    			      }
    			      setTimeout(function(){jQuery('#ihc_coupon_code_check_div_msg').fadeOut(500, function(){this.remove();});},5000);
    			    }
    			});
    		}
    	});

      if ( jQuery( '.ihc-js-register-popup-data' ).length ){
          // register modal
          if ( jQuery( '.ihc-js-register-popup-data' ).attr('data-is_register_page') == '1' ){
              jQuery('.ihc-modal-trigger-register' ).on( 'click', function() {
                  jQuery('html, body').animate({
                      scrollTop: jQuery( '.ihc-form-create-edit' ).offset().top
                  }, 1000);
              });
          } else if ( jQuery( '.ihc-js-register-popup-data' ).attr('data-is_registered') == '1' ){
              jQuery('.ihc-modal-trigger-register').on( 'click', function() {
                  return false;
              });
          } else {
              if ( typeof IhcRegisterModal !== 'undefined' ){
                  var triggerSelector = jQuery( '.ihc-js-register-popup-data' ).attr('data-trigger_selector');
                  var preventDefault = jQuery( '.ihc-js-register-popup-data' ).attr('data-trigger_default');
                  IhcRegisterModal.init({
                            triggerModalSelector  : triggerSelector,
                            preventDefault        : preventDefault
                  });
              }
          }
      }

      if ( jQuery( '.ihc-js-upload-image-data' ).length ){
          // upload image ( avatar )
          jQuery( '.ihc-js-upload-image-data' ).each( function(e,html){
              var rand = jQuery( this ).attr( 'data-rand' );
              var url = jQuery( this ).attr( 'data-url' );
              var name = jQuery( this ).attr( 'data-name' );
              var bttn = jQuery( this ).attr( 'data-bttn_label' );
              IhcAvatarCroppic.init({
                  triggerId					           : 'js_ihc_trigger_avatar' + rand,
                  saveImageTarget		           : url,
                  cropImageTarget              : url,
                  imageSelectorWrapper         : '.ihc-js-upload-image-wrapp',
                  hiddenInputSelector          : '[name='+name+']',
                  imageClass                   : 'ihc-member-photo',
                  removeImageSelector          : '#ihc_upload_image_remove_bttn_' + rand,
                  buttonId 					           : 'ihc-avatar-button',
                  buttonLabel 			           : bttn
              });
          });
      }

      if ( jQuery( '.ihc-js-datepicker-data' ).length ){
          // datepicker
          jQuery( '.ihc-js-datepicker-data' ).each( function(e,html){
              var currentYear = new Date().getFullYear() + 10;
              jQuery( jQuery(this).attr('data-selector') ).datepicker({
                  dateFormat        : "dd-mm-yy",
                  changeMonth       : true,
                  changeYear        : true,
                  yearRange         : "1900:"+currentYear,
                  onClose           : function(r) {
                        var callback = jQuery(this).attr('data-callback');
                        if ( typeof callback == 'function' ){
                            callback();
                        }
                  }
              });
          });

      }

      if ( jQuery( '.ihc-js-upload-file-public-data' ).length ){
          /// upload file
          jQuery( '.ihc-js-upload-file-public-data' ).each( function( e, html ){
            var rand = jQuery( this ).attr( 'data-rand' );
            var url = jQuery( this ).attr( 'data-url' );
            var max_size = jQuery( this ).attr( 'data-max_size' );
            var allowed_types = jQuery( this ).attr( 'data-allowed_types' );
            var name = jQuery( this ).attr( 'data-name' );
            var remove_label = jQuery( this ).attr( 'data-remove_label' );
            var alert_text = jQuery( this ).attr('data-alert_text');
            jQuery("#ihc_fileuploader_wrapp_"+ rand +" .ihc-file-upload").uploadFile({
              onSelect: function (files) {
                  jQuery("#ihc_fileuploader_wrapp_"+ rand +" .ajax-file-upload-container").css("display", "block");
                  var check_value = jQuery("#ihc_upload_hidden_" + rand ).val();
                  if (check_value!="" ){
                    alert(alert_text);
                    return false;
                  }
                  return true;
              },
              url: url,
              fileName: "ihc_file",
              dragDrop: false,
              showFileCounter: false,
              showProgress: true,
              showFileSize: false,
              maxFileSize: max_size,
              allowedTypes: allowed_types,
              onSuccess: function(a, response, b, c){
                if (response){
                  var obj = jQuery.parseJSON(response);
                  if (typeof obj.secret!="undefined"){
                      jQuery("#ihc_fileuploader_wrapp_" + rand ).attr("data-h", obj.secret);
                  }
                  var theHtml = "<div onClick=\"ihcDeleteFileViaAjax("+obj.id+", -1, '#ihc_fileuploader_wrapp_" + rand + "' , '" + name + "', '#ihc_upload_hidden_" + rand + "' );\" class='ihc-delete-attachment-bttn'>"+remove_label+"</div>";
                  jQuery("#ihc_fileuploader_wrapp_" + rand + " .ihc-file-upload").prepend( theHtml );
                  switch (obj.type){
                    case "image":
                      jQuery("#ihc_fileuploader_wrapp_" + rand + " .ihc-file-upload").prepend("<img src="+obj.url+" class=\'ihc-member-photo\' /><div class=\'ihc-clear\'></div>");
                    break;
                    case "other":
                      jQuery("#ihc_fileuploader_wrapp_"+ rand +" .ihc-file-upload").prepend("<div class=ihc-icon-file-type></div><div class=ihc-file-name-uploaded>"+obj.name+"</div>");
                    break;
                  }
                  jQuery("#ihc_upload_hidden_"+ rand ).val(obj.id);
                  setTimeout(function(){
                    jQuery("#ihc_fileuploader_wrapp_"+ rand +" .ajax-file-upload-container").css("display", "none");
                  }, 3000);
                }
              }
            });

          });
      }

      if ( jQuery( '.ihc-js-countries-list-data' ).length ){
    			jQuery( jQuery( '.ihc-js-countries-list-data' ).attr( 'data-selector' ) ).select2({
    					placeholder: jQuery( '.ihc-js-countries-list-data' ).attr( 'data-placeholder' ),
    					allowClear: true,
    					selectionCssClass: "ihc-select2-dropdown"
    			});
    	}

      if ( jQuery( '.ihc-js-login-data' ).length ){
          var user_field = jQuery( '.ihc-js-login-data' ).attr('data-user_field');
          var password_field = jQuery( '.ihc-js-login-data' ).attr('data-password_field');
          var error_message = jQuery( '.ihc-js-login-data' ).attr('data-error_message');
          jQuery( user_field ).on('blur', function(){
              ihcCheckLoginField('log', error_message );
          });
          jQuery( password_field ).on('blur', function(){
              ihcCheckLoginField('pwd', error_message );
          });
          jQuery('#ihc_login_form').on('submit', function(e){
              e.preventDefault();
              var u = jQuery('#ihc_login_form [name=log]').val();
              var p = jQuery('#ihc_login_form [name=pwd]').val();
              if (u!='' && p!=''){
                document.getElementById( 'ihc_login_form' ).submit();
              } else {
                ihcCheckLoginField('log', error_message );
                ihcCheckLoginField('pwd', error_message );
                return false;
              }
          });
      }

      if ( jQuery( '.ihc-hide-pw' ).length > 0 ){
        jQuery('.ihc-hide-pw').each(function(index, button) {
          jQuery(button).on( 'click', function () {
            var pass = jQuery(button).prev();
            if ( 'password' === pass.attr( 'type' ) ) {
              pass.attr( 'type', 'text' );
              jQuery( this ).children().removeClass( 'dashicons-visibility' ).addClass('dashicons-hidden');
            } else {
              pass.attr( 'type', 'password' );
              jQuery( this ).children().removeClass( 'dashicons-hidden' ).addClass('dashicons-visibility');
            }
          });
        });
      }
});

function indeedDetectBrowser()
{
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
        return 'Opera';
    } else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
        return 'Chrome';
    } else if(navigator.userAgent.indexOf("Safari") != -1) {
        return 'Safari';
    } else if(navigator.userAgent.indexOf("Firefox") != -1 ){
        return 'Firefox';
    } else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
        return 'IE';//crap
    } else {
        return 'Unknown';
    }
}
