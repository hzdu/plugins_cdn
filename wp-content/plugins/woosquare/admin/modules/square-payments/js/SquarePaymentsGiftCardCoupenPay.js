jQuery(document).ready(function() {
	(function ( $ ) {
	'use strict';


	const orderID =  squaregiftcardcoupenpay_params.unique_id;
	const giftCardForm = createGiftCardForm();
	
     
	
	giftCardForm.build();
	if(squaregiftcardcoupenpay_params.get_amount_store !== null && squaregiftcardcoupenpay_params.get_amount_store !== '' ){
     jQuery('.add_woosquare_gift_card_form').hide();
   	jQuery('#sq_amount_result').show();
	 if( jQuery('#sq_amount_result').length > 0 ) {
        var chc = '';
        if(squaregiftcardcoupenpay_params.squ_giftfee){
             var chc = 'checked=checked';
        }
        
        
	jQuery('#sq_amount_result').html(`<h4>Have a gift card?</h4> <input type="checkbox" `+chc+`class="input-checkbox" id="add_gift_box" name="add_gift_box" value="${squaregiftcardcoupenpay_params.get_amount_store}" /> Use ${squaregiftcardcoupenpay_params.currency_symbol}${squaregiftcardcoupenpay_params.get_amount_store} from gift card <input type="hidden" class="input-checkbox" id="sq_payment_id_box" name="square_payment_id" value="${squaregiftcardcoupenpay_params.square_payment_id}" /> <button  type="button" name="removal_square2" id="removal_square2"> Remove </button>`);
         
         
	}
	} 

			jQuery(document).on( 'click', '#add_gift_box', function(e){
			    
					jQuery('body').trigger('update_checkout');
				});
	jQuery(document).on( 'click', '#removal_square2', function(e){
	e.preventDefault();

				jQuery.ajax({
					type:"POST",
					url: squaregiftcardcoupenpay_params.ajax_url,
					data: {
						action:'sqaure_redeem_coupen_code_cancel_payment',
						paymentID:squaregiftcardcoupenpay_params.square_payment_id,
						currency_code: squaregiftcardcoupenpay_params.currency_code
					},
					success:function(res){
						var response = $.parseJSON(res);
					
						jQuery('body').trigger('update_checkout');
							jQuery( '.woowoosquare_gift_card_coupen_code_notices' ).hide();
					//	giftCardForm.build();
						 jQuery('.add_woosquare_gift_card_form').show();
						 	jQuery('#sq_amount_result').hide();
						 		
						 		jQuery('#woosquare_get_cart_redeem_send').text('Apply');
						 		
						 		
						 		
				//		location.reload();
					}
					
				});  
 	   
 	});
	
	function createGiftCardForm() {
	  //Initialize the payment form for gift cards
	  return new SqPaymentForm({
		applicationId:  squaregiftcardcoupenpay_params.application_id,
		inputClass: 'sq-input',

		giftCard: {
		  elementId: 'sq-gift-card-coupen',
		  placeholder: "* * * *  * * * *  * * * *  * * * *"
		},

		inputStyles: [
		  {
			color: "black",
			backgroundColor: "#f2f2f2",
			padding: "12px 5px 0px"
		  },
		  {
			mediaMaxWidth: "600px",
			fontSize: "26px"
		  },
		  {
			mediaMinWidth: "601px",
			fontSize: "26px"
		  }
		],

		callbacks: {
		  cardNonceResponseReceived: function(errors, nonce, paymentData, contacts) {

		  if (errors) {
			var html = errors[0].message+'.' ;
			jQuery( '.woowoosquare_gift_card_coupen_code_notices' ).eq(0).text( html );
			jQuery( '.woowoosquare_gift_card_coupen_code_notices' ).show();
			 jQuery('#woosquare_get_cart_redeem_send').text('Apply');
			return;

			} else {
		
				var response;
				let payment = {
					"nonce": nonce,
					"orderID" : orderID,
					
				  };
				  
				  
				  
			  jQuery.ajax({
				  type:"POST",
				  url: squaregiftcardcoupenpay_params.ajax_url,
				  data: {
					  action:'sqaure_redeem_coupen_code',
					  orderID:orderID,
					  nonce:nonce,
					  currency_code: squaregiftcardcoupenpay_params.currency_code
				  },
				  success:function(res){
					  var response = $.parseJSON(res);
				
					  if (response.payment.status !== undefined && response.payment.status === "FAILED") {
					//	alert();
				  	var html = 'Card denied:' + response.errors[0].code;	
					jQuery( '.woowoosquare_gift_card_coupen_code_notices' ).eq(0).text( html );
						return;
					  }
					  //If there is a balance remaining on the purchase, collect a
					  // credit or debit card and pass the ID of the Order so that the
					  //payment card nonce is posted in the context of the order
					  
					  
					  if ( response.payment.balance !== undefined && response.payment.balance > 0) {
						//Notify buyer of remaining balance and ask for another card.
						
						var html = 'Gift card authorized. Additional payment of '
						+ squaregiftcardcoupenpay_params.currency_symbol + response.payment.balance  + ' needed.';	
                                      jQuery( '.woowoosquare_gift_card_coupen_code_notices' ).eq(0).text( html );
						jQuery('#sq_amount_result').show();
					 if( jQuery('#sq_amount_result').length > 0 ) {
						if(response.errors){
							jQuery('#woosquare_get_cart_redeem_send').text('Apply');
						//	jQuery('.add_woosquare_gift_card_form').show();
						} else {
								jQuery('#sq_amount_result').html(`<h4>Have a gift card?</h4> <input type="checkbox" class="input-checkbox" id="add_gift_box" name="add_gift_box" value="${(response.payment.amount_money.amount/100).toFixed(2)}" /> Use ${squaregiftcardcoupenpay_params.currency_symbol}${(response.payment.amount_money.amount/100).toFixed(2)} from gift card <input type="hidden" class="input-checkbox" id="sq_payment_id_box" name="sq_payment_id_box" value="${(response.payment.id)}" /> <button type="button" name="removal_square" id="removal_square"> Remove </button>`);
						
							jQuery('.squareboxvisible').show();
							jQuery('.add_woosquare_gift_card_form').hide();
						}
						}
						// Display results of the call.
						// let successDiv = document.getElementsByClassName('squareboxvisible');
						// successDiv.style.display = 'block';
						//jQuery('.squareboxvisible').show();
						//jQuery('.add_woosquare_gift_card_form').hide();
					  } else if (response.payment.balance !== undefined && response.payment.balance == 0) {
					      jQuery('#sq_amount_result').show();
						if( jQuery('#sq_amount_result').length > 0 ) {
                                    
						jQuery('#sq_amount_result').html(`<h4>Have a gift card?</h4> <input type="checkbox" class="input-checkbox" id="add_gift_box" name="add_gift_box" value="${(response.payment.amount_money.amount/100).toFixed(2)}" /> Use ${squaregiftcardcoupenpay_params.currency_symbol}${(response.payment.amount_money.amount/100).toFixed(2)} from gift card. <input type="hidden" class="input-checkbox" id="sq_payment_id_box" name="sq_payment_id_box" value="${(response.payment.id)}" /> <button type="button" name="removal_square" id="removal_square"> Remove </button>`);
					
					
						}
						// Display results of the call.
						// let successDiv = document.getElementsByClassName('squareboxvisible');
						// successDiv.style.display = 'block';
						jQuery('.squareboxvisible').show();
						jQuery('.add_woosquare_gift_card_form').hide();
						
					  }
				  }
				  
			  });
			
			
			}
	
			
			jQuery(document).on( 'click', '#add_gift_box', function(e){
			    
					jQuery('body').trigger('update_checkout');
				});
		
			jQuery(document).on( 'click', '#removal_square', function(e){
			    
				e.preventDefault();
		
		//		jQuery('body').trigger('update_checkout');
				jQuery.ajax({
					type:"POST",
					url: squaregiftcardcoupenpay_params.ajax_url,
					data: {
						action:'sqaure_redeem_coupen_code_cancel_payment',
						orderID:orderID,
						nonce:nonce,
						currency_code: squaregiftcardcoupenpay_params.currency_code
					},
					success:function(res){
					    
					    
						var response = $.parseJSON(res);
						
						jQuery('body').trigger('update_checkout');
							jQuery( '.woowoosquare_gift_card_coupen_code_notices' ).hide();
					//	giftCardForm.build();
						 jQuery('.add_woosquare_gift_card_form').show();
						 	jQuery('#sq_amount_result').hide();
						 		
						 		jQuery('#woosquare_get_cart_redeem_send').text('Apply');
				//		location.reload();
					}
					
				});  
			});
		  }
		}
	  });
	}

	jQuery('#woosquare_get_cart_redeem_send').click(function(e){
		e.preventDefault();
		giftCardForm.requestCardNonce();
		jQuery('#woosquare_get_cart_redeem_send').text('Loading...');
	  });

	
}( jQuery ) );

});

jQuery(document).ready(function() {
	jQuery('.squareboxvisible').hide();
});
