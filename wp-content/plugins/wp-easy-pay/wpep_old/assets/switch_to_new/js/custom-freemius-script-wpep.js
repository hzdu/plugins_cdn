jQuery(document).ready(function($) {
	
	jQuery( "#pro_features_section a.addons-button-solid" ).click(function(e) {
	
	var imgtg = jQuery(this).attr('href').split('#');
	imgtg = jQuery('.'+imgtg[1]+'_png').attr('src');
	 
	 var plan_id = '';
	  
	  if(jQuery(this).attr('href') == "#starter"){
		var plan_ids = 2847;
		var licenses = 1;
	  }
	  
	  if(jQuery(this).attr('href') == "#professional"){
		 var plan_ids = 2882;
		 var licenses = 3;
	  }
	  
	  if(jQuery(this).attr('href') == "#business"){
		 var plan_ids = 2852;
		 var licenses = 15;
	  }
	    
		var handler = FS.Checkout.configure({
			plugin_id:  '1920',
			plan_id:    plan_ids,
			public_key: 'pk_4c854593bf607fd795264061bbf57',
			image:      imgtg,
			// IMPORTANT:
			// Remove timestamp and sandbox token before deployment to production,
			// otherwise, user will be able to upgrade with dummy credit-cards.
			
		});
		handler.open({
			name     : 'WP Easy Pay',
			licenses : licenses,
			// You can consume the response for after purchase logic.
			purchaseCompleted  : function (response) {
				// The logic here will be executed immediately after the purchase confirmation.                                // alert(response.user.email);
			},
			success  : function (response) {
				// The logic here will be executed after the customer closes the checkout, after a successful purchase.                                // alert(response.user.email);
			}
		});
		e.preventDefault();
	});


});