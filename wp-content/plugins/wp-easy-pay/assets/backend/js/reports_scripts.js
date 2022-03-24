jQuery( 'document' ).ready(
	function(){

		jQuery( '.give_refund_button' ).click(
			function(event) {
				event.preventDefault();

				var transaction_id = jQuery( this ).data( 'transactionid' );
				var amount         = jQuery( this ).data( 'amount' ).toString();
				var postid         = jQuery( this ).data( 'postid' );
				
				if (confirm( "You are about to process refund. Click OK to proceed and CANCEL to stop refund" )) {

					var currency_symbols = ['USD', 'CAD', 'GBP', 'AUD', 'JPY', 'C$', 'A$', '¥', '£', '$'];

					currency_symbols.forEach(
						element => {
						amount = amount.replace( element, "" );
						}
					);

					var data = {
						'action': 'wpep_payment_refund',
						'transaction_id': transaction_id,
						'amount': amount,
						'post_id': postid
					};


					jQuery.post(
						ajaxurl,
						data,
						function(response) {
				  
							response = JSON.parse( response );
				  
							if ('failed' == response.status) {
								  alert( response.detail );
							}
				  
							if ('success' == response.status) {
								location.reload();
							}
				  
						}
					);


				}

			}
		);



		jQuery( '#wpep_refund_amount' ).keyup(function(event){


			if (jQuery(this).val() == '') {

				jQuery('#wpep_refund_number').text('0.00');
				jQuery('#give_refund_button').attr( "data-amount", '0.00' );

			}else {

				var refund_value = parseFloat(jQuery(this).val()).toFixed(2);
				jQuery('#wpep_refund_number').text(refund_value);
				jQuery('#give_refund_button').attr( "data-amount",  refund_value);

			}
			

		});


	}
);
