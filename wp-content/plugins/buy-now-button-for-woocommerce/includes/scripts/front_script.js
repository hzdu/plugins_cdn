jQuery(function($) {
 	'use strict';
 	if(phpInfo.button_style == 'theme') {
 			$('#aqbp_quick_buy_btn').addClass($('.single_add_to_cart_button').attr('class'));
 			$('a#aqbp_quick_buy_shop_btn').each(function(i){
 				$(this).addClass($('.add_to_cart_button').first().attr('class'));
 				$(this).removeClass('ajax_add_to_cart');
 			});
 	}
 	else
 	{
 		$('#aqbp_quick_buy_btn').addClass('button-quick-buy');
 		$('a#aqbp_quick_buy_shop_btn').each(function(i){
 				$(this).removeClass('button');
 				$(this).addClass('button-quick-buy');
 			});

 	}

 	jQuery('#aqbp_quick_buy_btn').click( function( e ){

 		
 		if( $(this).hasClass('disabled') ){
 			e.preventDefault(); 
 			return;
 		}
 	});

 	jQuery('.variation_id').change( function(){

 		if( $(this).val().length > 0 ){
 			jQuery('#aqbp_quick_buy_btn').removeClass('disabled wc-variation-selection-needed');
 		} else {
 			jQuery('#aqbp_quick_buy_btn').addClass('disabled wc-variation-selection-needed');
 		}
 	});

 	if($('#hide_singel_add_to_cart').length > 0 )
 		{
 			$('button[type="submit"]').hide();
 		}
 });