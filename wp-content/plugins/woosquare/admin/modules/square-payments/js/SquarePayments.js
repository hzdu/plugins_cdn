(function ( $ ) {
	'use strict';
	const appId = square_params.application_id;
	const locationId = square_params.locationId; 
	async function initializeCard(payments) {
		const card = await payments.card();
		setTimeout(function(){ 	 
		    if(jQuery('#card-container').html().length > 1){
		        card.destroy();
		    }
			    
			card.attach('#card-container');
			const cardButton = document.getElementById(
				'place_order'
			);
			
			function handlePaymentMethodSubmission(event, paymentMethod, shouldVerify = false,payments) {
				event.preventDefault();
				try {
					// disable the submit button as we await tokenization and make a
					// payment request.
					cardButton.disabled = true;
					jQuery('.woocommerce-error').remove();
					const token =  tokenize(paymentMethod,payments);
				} catch (e) {
					cardButton.disabled = false;
					console.error(e.message);
				}
			}
			cardButton.addEventListener('click', async function (event) {
				 handlePaymentMethodSubmission(event, card, true,payments);
			});
		}, 2000);
    }

	// This function tokenizes a payment method. 
	// The â€˜errorâ€™ thrown from this async function denotes a failed tokenization,
	// which is due to buyer error (such as an expired card). It is up to the
	// developer to handle the error and provide the buyer the chance to fix
	// their mistakes.
	async function tokenize(paymentMethod,payments) {
		const tokenResult = await paymentMethod.tokenize();
		if (tokenResult.status === 'OK') {
		    if(jQuery( '#sq-card-saved' ).is(":checked")){
    			var intten = 'STORE';
    		} else if(square_params.subscription) {
    			var intten = 'STORE';
    		} else if(
    		jQuery( '._wcf_flow_id' ).val() != null ||  
    		jQuery( '._wcf_flow_id' ).val() != undefined || 
    		
    		jQuery( '._wcf_checkout_id' ).val() != null ||  
    		jQuery( '._wcf_checkout_id' ).val() != undefined 
    		) {
    			var intten = 'STORE';
    		} else if(jQuery( '.is_preorder' ).val()) {
    			var intten = 'STORE';
    		} else {
    			var intten = 'CHARGE';
    		}
    		const verificationDetails = {
    			intent: intten, 
    			amount: square_params.cart_total, 
    			currencyCode: square_params.get_woocommerce_currency, 
    			billingContact: {}
    		};
    		const verificationResults = await payments.verifyBuyer(
    			tokenResult.token,
    			verificationDetails
    
    		);
            if (verificationResults !== undefined && tokenResult.token !== undefined) {
					const pay_form = jQuery( 'form.woocommerce-checkout, form#order_review' );
					pay_form.append( '<input type="hidden" class="buyerVerification-token" name="buyerVerification_token" value="'+ verificationResults.token +'"  />' );
        			if ( document.getElementsByClassName('woocommerce-error')){
            			jQuery('#place_order').prop('disabled', false);		
            		} 
            		// inject nonce to a hidden field to be submitted
            		pay_form.append( '<input type="hidden" class="square-nonce" name="square_nonce" value="' + tokenResult.token + '" />' );
            		jQuery('form.woocommerce-checkout').submit();
			} else {
				jQuery('#place_order').prop('disabled', false);
			}
		} else {
			let errorMessage = `Tokenization failed-status: ${tokenResult.status}`;
			if (tokenResult.errors) {
				errorMessage += ` and errors: ${JSON.stringify(
					tokenResult.errors
				)}`;
				jQuery('#place_order').prop('disabled', false);
			}	
			throw new Error(errorMessage);
		}
	}

	document.addEventListener('DOMContentLoaded', async function () {
		if (!window.Square) {
			throw new Error('Square.js failed to load properly');
		}
		const payments = window.Square.payments(appId, locationId);
		let card;
        /*try {
			card = await initializeCard(payments);
		} catch (e) {
			console.error('Initializing Card failed', e);
			return;
		}*/
		jQuery( document.body ).on( 'updated_checkout', function() {
			try {
			    
    			card =  initializeCard(payments);
    		} catch (e) {
    			console.error('Initializing Card failed', e);
    			return;
    		}	
		});
		
		
		
	});
}( jQuery ) );