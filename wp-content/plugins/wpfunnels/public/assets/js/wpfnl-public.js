(function ($) {

	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	$(document).on("click", "#wpfunnels_next_step_controller", function (e) {
		e.preventDefault();
		var ajaxurl = window.wpfnl_obj.ajaxurl;

		// === Detect editor ===//
		var sPageURL = '';
		var sURLVariables = '';
		sPageURL = window.location.search.substring(1);
		sURLVariables = sPageURL.split('=');
		if (sURLVariables[0] == "elementor-preview") {
			console.log("elementor");
		} else {
			$('#wpfnl-next-button-loader').show();
			var products = $(this).attr('data-products');
			var step_id = window.wpfnl_obj.step_id;
			jQuery.ajax({
				type: "POST",
				url: ajaxurl,
				data: {
					action: "wpfnl_next_button_ajax",
					step_id: step_id,
					products: products,
				},
				success: function (response) {
					$('#wpfnl-next-button-loader').hide();
					if (response == 'error') {
						console.log(response);
					} else {
						console.log(response)
						window.location.href = response;
					}
				}
			});
		}
		// === Detect editor ===//
	});

	jQuery(document).ready(function () {

		//-------multistep checkout------
		var is_user_logged_in = window.wpfnl_obj.is_user_logged_in;
		var is_login_reminder = window.wpfnl_obj.is_login_reminder;

		function scroll_to_top(){
			$('html, body').animate({
				scrollTop: $('.wpfnl-multistep, .wpfnl-checkout-form-wpfnl-multistep').offset().top - 100
			}, 800);
		}

		function show_checkout_step( targetID ){
			if( 'login' == targetID ){

				//------for Elementor widget-------
				$('.wpfnl-multistep .woocommerce-form-login-toggle').show();

				$('.wpfnl-multistep .woocommerce-form-coupon').fadeOut();
				$('.wpfnl-multistep #wpfnl_checkout_billing').fadeOut();
				$('.wpfnl-multistep #wpfnl_checkout_shipping').fadeOut();
				$('.wpfnl-multistep #order_review').fadeOut();
				$('.wpfnl-multistep .woocommerce-form-coupon-toggle').fadeOut().removeClass('show-form');

				//------for Gutenberg block-------
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-login-toggle').show();

				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-coupon').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep #wpfnl_checkout_billing').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep #wpfnl_checkout_shipping').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep #order_review').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-coupon-toggle').fadeOut().removeClass('show-form');

			}else if( 'billing' == targetID ){
				//------for Elementor widget-------
				$('.wpfnl-multistep #wpfnl_checkout_billing').fadeIn();

				$('.wpfnl-multistep .woocommerce-form-login').fadeOut();
				$('.wpfnl-multistep .woocommerce-form-login-toggle').fadeOut();
				$('.wpfnl-multistep .woocommerce-form-coupon-toggle').fadeOut().removeClass('show-form');
				$('.wpfnl-multistep .woocommerce-form-coupon').fadeOut();
				$('.wpfnl-multistep #wpfnl_checkout_shipping').fadeOut();
				$('.wpfnl-multistep #order_review').fadeOut();

				//------for Gutenberg block-------
				$('.wpfnl-checkout-form-wpfnl-multistep #wpfnl_checkout_billing').fadeIn();

				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-login').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-login-toggle').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-coupon-toggle').fadeOut().removeClass('show-form');
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-coupon').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep #wpfnl_checkout_shipping').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep #order_review').fadeOut();

			}else if( 'shipping' == targetID ){
				//------for Elementor widget-------
				$('.wpfnl-multistep #wpfnl_checkout_shipping').fadeIn();

				$('.wpfnl-multistep .woocommerce-form-login-toggle').fadeOut();
				$('.wpfnl-multistep .woocommerce-form-login').fadeOut();
				$('.wpfnl-multistep .woocommerce-form-coupon-toggle').fadeOut().removeClass('show-form');
				$('.wpfnl-multistep .woocommerce-form-coupon').fadeOut();
				$('.wpfnl-multistep #wpfnl_checkout_billing').fadeOut();
				$('.wpfnl-multistep #order_review').fadeOut();

				//------for Gutenberg block-------
				$('.wpfnl-checkout-form-wpfnl-multistep #wpfnl_checkout_shipping').fadeIn();

				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-login-toggle').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-login').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-coupon-toggle').fadeOut().removeClass('show-form');
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-coupon').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep #wpfnl_checkout_billing').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep #order_review').fadeOut();

			}else if( 'order-review' == targetID ){
				//------for Elementor widget-------
				$('.wpfnl-multistep #order_review').fadeIn();
				$('.wpfnl-multistep .woocommerce-form-coupon-toggle').fadeIn();

				$('.wpfnl-multistep .woocommerce-form-login-toggle').fadeOut();
				$('.wpfnl-multistep .woocommerce-form-login').fadeOut();
				$('.wpfnl-multistep .woocommerce-form-coupon').fadeOut();
				$('.wpfnl-multistep #wpfnl_checkout_billing').fadeOut();
				$('.wpfnl-multistep #wpfnl_checkout_shipping').fadeOut();

				//------for Gutenberg block-------
				$('.wpfnl-checkout-form-wpfnl-multistep #order_review').fadeIn();
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-coupon-toggle').fadeIn();

				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-login-toggle').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-login').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep .woocommerce-form-coupon').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep #wpfnl_checkout_billing').fadeOut();
				$('.wpfnl-checkout-form-wpfnl-multistep #wpfnl_checkout_shipping').fadeOut();
			}
		}


		//-------when wizard button click------
		$(".wpfnl-multistep-wizard > li > button").on("click", function () {
			var targetID = $(this).attr('data-target');

			checkoutFieldValidation();
			var isValidate = true;

			if( 'billing' == targetID ){
				// Login validation goes here if needed
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

				//-----for gutenberg------
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

			}else if( 'shipping' == targetID ){
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

				//-------for gutenberg-----
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

				checkoutFieldValidation('#wpfnl_checkout_billing');

				$('#wpfnl_checkout_billing .validate-required').each(function(){

					if($(this).find('.field-required').length){
						isValidate =  false;
					}

				});

				if(isValidate == false){
					return false;
				}

			}else if( 'order-review' == targetID ){
				var is_enabled_dirrerent_address = $('input[name="ship_to_different_address"]').is(":checked");

				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').show();

				//---for gutenberg---
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').show();

				//----billing validation---
				checkoutFieldValidation('#wpfnl_checkout_billing');
				$('#wpfnl_checkout_billing .validate-required').each(function(){

					if($(this).find('.field-required').length){
						isValidate =  false;
					}

				});

				if(isValidate == false){
					return false;
				}

				//----shipping validation---
				if ( is_enabled_dirrerent_address == true ){
					checkoutFieldValidation('#wpfnl_checkout_shipping');

					$('#wpfnl_checkout_shipping .validate-required').each(function(){

						if($(this).find('.field-required').length){
							isValidate =  false;
						}

					});

					if(isValidate == false){
						return false;
					}
				} else {
					checkoutFieldValidation('.woocommerce-additional-fields');

					$('.woocommerce-additional-fields .validate-required').each(function(){

						if($(this).find('.field-required').length){
							isValidate =  false;
						}

					});

					if(isValidate == false){
						return false;
					}
				}
			}

			$(this).parent('li').addClass('current');
			$(this).parent('li').prevAll().addClass('completed').removeClass('current');
			$(this).parent('li').nextAll().removeClass('completed current');

			show_checkout_step(targetID);

			if( 'login' == targetID ){
				$('.wpfnl-multistep-navigation button.previous').attr('data-target', '').prop('disabled', true);
				$('.wpfnl-multistep-navigation button.next').attr('data-target', 'billing').prop('disabled', false);

			}else if( 'billing' == targetID ){
				if( is_user_logged_in ){
					$('.wpfnl-multistep-navigation button.previous').attr('data-target', 'login').prop('disabled', true);
				}else{
					if( 'yes' === is_login_reminder ){
						$('.wpfnl-multistep-navigation button.previous').attr('data-target', 'login').prop('disabled', false);
					}else{
						$('.wpfnl-multistep-navigation button.previous').attr('data-target', 'login').prop('disabled', true);
					}
				}

				$('.wpfnl-multistep-navigation button.next').attr('data-target', 'shipping').prop('disabled', false);

			}else if( 'shipping' == targetID ){
				$('.wpfnl-multistep-navigation button.previous').attr('data-target', 'billing').prop('disabled', false);
				$('.wpfnl-multistep-navigation button.next').attr('data-target', 'order-review').prop('disabled', false);

			}else if( 'order-review' == targetID ){
				$('.wpfnl-multistep-navigation button.previous').attr('data-target', 'shipping').prop('disabled', false);
				$('.wpfnl-multistep-navigation button.next').attr('data-target', '').prop('disabled', true);

			}

		});

		//-------when next step button click------
		$(".wpfnl-multistep-navigation button.next").on("click", function () {
			var targetID = $(this).attr('data-target');

			var isValidate = true;

			if( 'billing' == targetID ){
				// Login validation goes here if needed

				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

				//-----for gutenberg------
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();
				
			}else if( 'shipping' == targetID ){
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

				//-----for gutenberg------
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

				checkoutFieldValidation('#wpfnl_checkout_billing');

				$('#wpfnl_checkout_billing .validate-required').each(function(){

					if($(this).find('.field-required').length){
						isValidate =  false;
					}

				});

				if(isValidate == false){
					return false;
				}

			}else if( 'order-review' == targetID ){
				var is_enabled_dirrerent_address = $('input[name="ship_to_different_address"]').is(":checked");

				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').show();

				//-----gutenberg-----
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').show();

				if ( is_enabled_dirrerent_address == true ){
					checkoutFieldValidation('#wpfnl_checkout_shipping');

					$('#wpfnl_checkout_shipping .validate-required').each(function(){

						if($(this).find('.field-required').length){
							isValidate =  false;
						}

					});

					if(isValidate == false){
						return false;
					}
				} else {
					checkoutFieldValidation('.woocommerce-additional-fields');

					$('.woocommerce-additional-fields .validate-required').each(function(){

						if($(this).find('.field-required').length){
							isValidate =  false;
						}

					});

					if(isValidate == false){
						return false;
					}
				}

			}

			scroll_to_top();

			$('.wpfnl-multistep-wizard > li.'+targetID).addClass('current');
			$('.wpfnl-multistep-wizard > li.'+targetID).prevAll().addClass('completed').removeClass('current');
			$('.wpfnl-multistep-wizard > li.'+targetID).nextAll().removeClass('completed current');

			show_checkout_step(targetID);

			if( 'billing' == targetID ){
				$(this).siblings().attr('data-target', 'login').prop('disabled', false);
				$(this).attr('data-target', 'shipping');

			}else if( 'shipping' == targetID ){
				$(this).siblings().attr('data-target', 'billing').prop('disabled', false);
				$(this).attr('data-target', 'order-review');

			}else if( 'order-review' == targetID ){
				$(this).siblings().attr('data-target', 'shipping');
				$(this).prop('disabled', true);
			}
		});

		function checkoutFieldValidation(step){

			$(step+' .validate-required input').each(function(){
				var fieldValue = $(this).val();
				if( !fieldValue ){
					$(this).parent().find('.field-required').remove();
					$(this).parent().append('<span class="field-required">Field required</span>');
				} else if( fieldValue){
					$(this).parent().find('.field-required').remove();
				}
            })

			$(step+' .validate-required select').each(function(){
				var fieldValue = $(this).children('option:selected').val();
				if( !fieldValue ){
					$(this).parent().find('.field-required').remove();
					$(this).parent().append('<span class="field-required">Field required</span>');
				} else if( fieldValue){
					$(this).parent().find('.field-required').remove();
				}
            })

			$(step+' .validate-required input[type="checkbox"]').each(function(){
				var fieldValue = $(this).is(":checked");
				if( !fieldValue ){
					$(this).parent().find('.field-required').remove();
					$(this).parent().append('<span class="field-required">Field required</span>');
				} else if( fieldValue){
					$(this).parent().find('.field-required').remove();
				}
            })

		}

		//-------when previous button click------
		$(".wpfnl-multistep-navigation button.previous").on("click", function () {
			var targetID = $(this).attr('data-target');

			scroll_to_top();

			$('.wpfnl-multistep-wizard > li.'+targetID).addClass('current');
			$('.wpfnl-multistep-wizard > li.'+targetID).prevAll().addClass('completed').removeClass('current');
			$('.wpfnl-multistep-wizard > li.'+targetID).nextAll().removeClass('completed current');

			show_checkout_step(targetID);

			if( 'login' == targetID ){
				$(this).attr('data-target', '').prop('disabled', true);
				$(this).siblings().attr('data-target', 'billing').prop('disabled', false);

			}else if( 'billing' == targetID ){
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

				//------for gutenberg------
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

				if( is_user_logged_in ){
					$(this).attr('data-target', 'login').prop('disabled', true);
				}else{
					if( 'yes' === is_login_reminder ){
						$(this).attr('data-target', 'login').prop('disabled', false);
					}else{
						$(this).attr('data-target', 'login').prop('disabled', true);
					}
				}

				$(this).siblings().attr('data-target', 'shipping').prop('disabled', false);

			}else if( 'shipping' == targetID ){
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout.wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

				//-------for gutenberg--------
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content').hide();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-content[data-step="first"]').show();
				$('.theme-woostify.checkout-layout-2 .wpfnl-checkout-form-wpfnl-multistep .multi-step-checkout-wrapper .multi-step-checkout-button-wrapper').hide();

				$(this).attr('data-target', 'billing');
				$(this).siblings().attr('data-target', 'order-review').prop('disabled', false);

			}
		});
		//-------end multistep checkout------


		$(".wpfnl-learndash-pay form input[type='submit']").on("click", function () {
			var ajaxurl = window.wpfnl_obj.ajaxurl;
			let step_id = $('.wpfnl-learndash-pay').data('id');
			jQuery.ajax({
				type: "POST",
				url: ajaxurl,
				data: {
					action			: "wpfnl_set_learndash_session",
					step_id			: step_id,
				},
				success: function (response) {
					console.log(response)
				}
			});
		});



		/**
		 *
		 * @param response
		 */
		var wpf_remove_spinner = function (response ) {
			if ( $( '.wc_payment_methods' ).length ) {
				if (response.hasOwnProperty('wc_custom_fragments')) {
					// update the fragments
					if ( response.hasOwnProperty( 'fragments' ) ) {
						$.each( response.fragments, function ( key, value ) {
							$( key ).replaceWith( value );
						} );
					}

					if ( parseFloat( response.cart_total ) <= 0 ) {
						$( 'body' ).trigger( 'update_checkout' );
					}
				}
			} else {
				$( 'body' ).trigger( 'update_checkout' );
			}
		}
		$(document).on('change', '.wpfnl-update-variation', function(e){
			e.preventDefault();
			var ajaxurl = window.wpfnl_obj.ajaxurl;

			let variations = [],
				i = 0,
				thisProductID = $(this).data('product-id');
			$('.wpfnl-update-variation').each(function() {
				if( thisProductID == $(this).data('product-id') ){
					variations[i] = {
						'attr' 			: $(this).data('attr'),
						'product_id' 	: $(this).data('product-id'),
						'variation_id' 	: $(this).data('variation-id'),
						'quantity' 		: $(this).data('quantity'),
						'value' 		: $(this).val().trim(),
					}
					i++;
				}
			});
			jQuery.ajax({
				type: "POST",
				url: ajaxurl,
				data: {
					action			: "wpfnl_update_variation",
					variations  	: variations,
				},
				success: function (response) {
					$( 'body' ).trigger( 'update_checkout' );
				}
			});
		});

		

		// $(document).on("click", ".learndash_checkout_button", function (e) {
		// 	var dropDownId = $(this).data('jq-dropdown');
		// 	$(mainCourseId).attr("id", dropDownId.replace('#',''));
		// 	$(dropDownId).css('display','block');

		// 	// console.log(mainCourseId);
		// 	// $(dropDownId).show();

		// 	var ajaxurl = window.wpfnl_obj.ajaxurl;
		// 	jQuery.ajax({
		// 		type: "POST",
		// 		url: ajaxurl,
		// 		data: {
		// 			action			: "wpfnl_get_course_details",
		// 			course_id		: dropDownId.replace('#jq-dropdown-',''),
		// 		},
		// 		success: function (response) {
		// 			$('input[name=item_number]').val(response.course.id);
		// 			$('input[name=amount]').val(response.course.price);
		// 			$('input[name=item_name]').val(response.course.title);
		// 			$('input[name=custom]').val(window.wpfnl_obj.step_id);
		// 			$('input[name=stripe_course_id]').val(response.course.id);
		// 			$('input[name=stripe_plan_id]').val('learndash-course-'+response.course.id);
		// 			$('input[name=stripe_name]').val(response.course.title);
		// 			$('input[name=stripe_price]').val(response.course.price*100);
		// 		}
		// 	});


		// });




		$(document).on("change", ".wpfnl-order-bump-cb", function (e) {

			e.preventDefault();
			$(this).parents('.wpfnl-reset').find('.oderbump-loader').css('display', 'flex');
			var ajaxurl = window.wpfnl_obj.ajaxurl;
			var user_id = window.wpfnl_obj.user_id;
			var step_id = $(this).attr('data-step');
			var quantity = $(this).attr('data-quantity');
			var key = $(this).attr('data-key');
			var isLms = $(this).attr('data-lms');
			var product = $(this).val();
			let checker = false,
				main_products = $(this).attr('data-main-products');

			if ( $(this).prop("checked") == true ) {
				checker = true;
			} else if ( $(this).prop("checked") == false ) {
				checker = false;
			}

			if(checker) {
				
				$("input[name='_wpfunnels_order_bump_product_"+key +"']").val(product);
				
			} else {
				$("input[name='_wpfunnels_order_bump_product_"+key +"']").val('');
				
			}
		
			jQuery.ajax({
				type: "POST",
				url: ajaxurl,
				data: {
					action			: "wpfnl_order_bump_ajax",
					step_id			: step_id,
					quantity		: quantity,
					product			: product,
					checker			: checker,
					is_lms			: isLms,
					user_id			: user_id,
					key			    : key,
					main_products 	: main_products
				},
				success: function (response) {
					$('.wpfnl-lms-access-course-message').text('')
					wpf_remove_spinner( response );
					$('.oderbump-loader').css('display', 'none');
					if(isLms === 'wc'){
						jQuery('body').trigger('update_checkout');
					}else{
						$( ".wpfnl-order-bump-cb" ).each(function( index ) {
							if($(this).val() != product){
								$(this).prop("checked", false);
							}
						});

						$('.wpfnl-lms-checkout').empty();
						
						$('.wpfnl-lms-checkout').append(response.html);
						var notify_url = $('input[name=notify_url]').val();
						var return_url = $('input[name=return]').val();
						var cancel_url = $('input[name=cancel_return]').val();

						notify_url = notify_url.split('=')[0]+ "="+ response.paypal_nonce;
						return_url = return_url.split('return-success=')[0]+ "step_id="+response.step_id+"&user_id="+response.user_id+"&return-success="+ response.paypal_nonce;
						cancel_url = cancel_url.split('=')[0]+ "="+ response.paypal_nonce;
					
						$('input[name=notify_url]').val(notify_url);
						$('input[name=return]').val(return_url);
						$('input[name=cancel_return]').val(cancel_url);
						
					}


					$( ".wpfnl-order-bump-cb" ).each(function( index ) {
						var isReplace = $(this).data('replace');
						var qty = $(this).data('quantity');
						if( (isReplace == 'yes') && ( (qty != quantity ) || product != $(this).val() ) ){
							$(this).prop("checked", false);
						}

						if(isLms == 'yes'){
							console.log($(this).val());
							console.log(product);
							if($(this).val() != product){
								$(this).prop("checked", false);
							}
						}

					});
					
				}
			});
		});

		//----show order bump modal-----
		var inner_height = $('.wpfnl-order-bump__popup-wrapper').innerHeight() + 30;
		$('.wpfnl-order-bump__popup-wrapper').css('top', '-' + inner_height + 'px');

		$(window).on('load', function () {
			setTimeout(function () {
				$('.wpfnl-order-bump__popup-wrapper').addClass('show').css('top', '30px');
			}, 2000);

		});

		$('.close-order-bump').on('click', function () {
			$('.wpfnl-order-bump__popup-wrapper').removeClass('show').css('top', '-' + inner_height + 'px');
		});


		//--------woocommerce checkout page coupon toggle add class-----------
		$('.wpfnl-checkout .woocommerce-form-coupon-toggle .showcoupon').on('click', function(){
			$(this).parents('.woocommerce-form-coupon-toggle').toggleClass('show-form');
		});


		/**
		 * Elementor optin form submission ajax
		 */
		$('.wpfnl-elementor-optin-form-wrapper form').on('submit', function (e) {
			e.preventDefault();
			var thisParents = $(this).parents('.wpfnl-elementor-optin-form-wrapper');

			var thisEmail 		= thisParents.find('#wpfnl-email');
			var thisFirstName 	= thisParents.find('#wpfnl-first-name');
			var thisLastName 	= thisParents.find('#wpfnl-last-name');
			var thisAcceptance 	= thisParents.find('#wpfnl-acceptance_checkbox');
			var thisPhone 	= thisParents.find('#wpfnl-phone');


			$('.wpfnl-elementor-optin-form-wrapper .response').css('display','none');
			if( ( thisEmail.val() == '' && thisEmail.prop('required') ) || ( thisLastName.val() == '' && thisLastName.prop('required') ) || ( thisFirstName.val() == '' && thisFirstName.prop('required')) || ( thisAcceptance.val() == '' && thisAcceptance.prop('required')) || ( thisPhone.val() == '' && thisPhone.prop('required') ) ){
				thisParents.find('.response').css('color', 'red');
				thisParents.find('.response').text('Please fill all the required fields');
				thisParents.find('.response').css('display','flex');
				return false;
			}

			var ajaxurl 	= wpfnl_obj.ajaxurl,
				security 	= wpfnl_obj.optin_form_nonce,
				step_id 	= wpfnl_obj.step_id,
				email		= '',
				data   		= {
					action 		: 'wpfnl_optin_submission',
					security 	: security,
					step_id 	: step_id,
					postData 	: $(this).serialize()
				},
				postData = data.postData.split('&'),
				form 		= $(this)
			form.find('.wpfnl-loader').show();
			$.ajax({
				type	: "POST",
				url		: ajaxurl,
				data	: data,
				dataType: 'json',
				success	: function (response) {
					if(response.success) {
						form.hide();
						thisParents.find('.response').fadeIn('fast');
						thisParents.find('.response').css('color', 'green');
						thisParents.find('.response').text(response.notification_text);
						if( response.redirect ) {
							setTimeout(function() {
								window.location.href = response.redirect_url;
							}, 1000)
						}
					}
				}
			});
		})


		/**
		 * Shortcode optin form submission ajax
		 */
		 $('.wpfnl-shortcode-optin-form-wrapper form').on('submit', function (e) {
			e.preventDefault();
			 var thisParents = $(this).parents('.wpfnl-shortcode-optin-form-wrapper');
			optinSubmit(thisParents);
		})

		/**
		 * Divi optin form submission ajax
		 */
		 $('.wpfnl-shortcode-optin-form-wrapper form #wpfunnels_optin-button').on('click', function (e) {
			e.preventDefault();
			 var thisParents = $(this).parents('.wpfnl-shortcode-optin-form-wrapper');
			optinSubmit(thisParents);
		})

		/**
		 * Optin form submission for Shortcode and Divi
		 */
		function optinSubmit(thisParents){
			var thisEmail 		= thisParents.find('#wpfnl-email');
			var thisFirstName 	= thisParents.find('#wpfnl-first-name');
			var thisLastName 	= thisParents.find('#wpfnl-last-name');
			var thisAcceptance 	= thisParents.find('#wpfnl-acceptance_checkbox');
			var thisPhone 		= thisParents.find('#wpfnl-phone');

			thisParents.find('response').css('display','none');
			if( ( thisEmail.val() == '' && thisEmail.prop('required') ) || ( thisLastName.val() == '' && thisLastName.prop('required') ) || ( thisFirstName.val() == '' && thisFirstName.prop('required')) || ( thisAcceptance.val() == '' && thisAcceptance.prop('required')) || ( thisPhone.val() == '' && thisPhone.prop('required') ) ){
				thisParents.find('.response').css('color', 'red');
				if( thisEmail.val() == '' ){
					thisParents.find('.response').text('Email field is required');
				}else{
					thisParents.find('.response').text('Please fill all the required fields');
				}
				thisParents.find('.response').css('display','flex');
				return false;
			}

			var ajaxurl 	= wpfnl_obj.ajaxurl,
				security 	= wpfnl_obj.optin_form_nonce,
				step_id 	= wpfnl_obj.step_id,
				email		= '',
				data   		= {
					action 		: 'wpfnl_shortcode_optin_submission',
					security 	: security,
					step_id 	: step_id,
					postData 	: thisParents.find('form').serialize()
				},
				postData = data.postData.split('&'),
				form 		= thisParents.find('form')
			form.find('.wpfnl-loader').css('display','inline-block');
			$.ajax({
				type	: "POST",
				url		: ajaxurl,
				data	: data,
				dataType: 'json',
				success	: function (response) {
					if(response.success) {
						form.hide();
						thisParents.find('.response').fadeIn('fast');
						thisParents.find('.response').css('color', 'green');
						thisParents.find('.response').text(response.notification_text);
						if( response.redirect ) {
							setTimeout(function() {
								window.location.href = response.redirect_url;
							}, 1000)
						}
					}
				}
			});
		}


		/**
		 * Gutenberg optin form submission ajax
		 */
		 $('.wpfnl-gutenberg-optin-form-wrapper form').on('submit', function (e) {
			e.preventDefault();
			 var thisParents = $(this).parents('.wpfnl-gutenberg-optin-form-wrapper');
			 var thisEmail 		= thisParents.find('#wpfnl-email');
			 var thisFirstName 	= thisParents.find('#wpfnl-first-name');
			 var thisLastName 	= thisParents.find('#wpfnl-last-name');
			 var thisAcceptance 	= thisParents.find('#wpfnl-acceptance_checkbox');
			 var thisPhone 		= thisParents.find('#wpfnl-phone');

			 thisParents.find('.response').css('display','none');
			 if( ( thisEmail.val() == '' && thisEmail.prop('required') ) || ( thisLastName.val() == '' && thisLastName.prop('required') ) || ( thisFirstName.val() == '' && thisFirstName.prop('required')) || ( thisAcceptance.val() == '' && thisAcceptance.prop('required')) || ( thisPhone.val() == '' && thisPhone.prop('required') ) ){
				 thisParents.find('.response').css('color', 'red');
				 thisParents.find('.response').text('Please fill all the required fields');
				 thisParents.find('.response').css('display','flex');
				// setTimeout(function() {
				// 	$('.wpfnl-gutenberg-optin-form-wrapper .response').css('display','none');
				//  }, 2000);

				return false;
			}
			$('.wpfnl-optin-form .wpfnl-optin-form-group .btn-default').addClass('show-loader');
			var ajaxurl 	= wpfnl_obj.ajaxurl,
				security 	= wpfnl_obj.optin_form_nonce,
				step_id 	= wpfnl_obj.step_id,
				email		= '',
				data   		= {
					action 		: 'wpfnl_gutenberg_optin_submission',
					security 	: security,
					step_id 	: step_id,
					postData 	: $(this).serialize()
				},
				form 		= $(this);
			form.find('.wpfnl-loader').show();
			$.ajax({
				type	: "POST",
				url		: ajaxurl,
				data	: data,
				dataType: 'json',
				success	: function (response) {

					if(response.success) {
						form.hide();
						let post_action = response.post_action;
						$('.wpfnl-optin-form .wpfnl-optin-form-group .btn-default').removeClass('show-loader');
						thisParents.find('.response').fadeIn('fast');
						thisParents.find('.response').css('color', 'green');
						thisParents.find('.response').text(response.notification_text);
						if( 'notification' !== post_action ) {
							setTimeout(function() {
								window.location.href = response.redirect_url;
							}, 1000)
						}
					}
				}
			});
		})

		// $('.learndash_join_button form').on('submit', function(e){
		$('#wpfnl-lms-free-course').on('click', function(e){
			e.preventDefault()
			$(this).html('Enrolling... <span class="wpfnl-loader"></span>');
			var ajaxurl = window.wpfnl_obj.ajaxurl;
			var step_id = $(this).attr('step_id')
			var course_id = $(this).attr('course_id')
			var user_id = $(this).attr('user_id');
			var data    = {
				action 	: 'wpfnl_learndash_free_course',
				step_id : step_id,
				course_id : course_id,
				user_id : user_id,
				data 	: $(this).serialize(),
			};
			$.ajax({
				type	: "POST",
				url		: ajaxurl,
				data	: data,
				dataType: 'json',
				success	: function (response) {
					if(response.success) {
						setTimeout(function(){
							window.location = response.next_step;
						}, 1000);
					}
				}
			});
		});
		
		$('.learndash-stripe-checkout').append('<input type="hidden" name="custom" value="'+window.wpfnl_obj.step_id+"&"+window.wpfnl_obj.user_id+'">');
		$(document).on("click", "#wpfnl-lms-access-course", function (e) {
		// $('#wpfnl-lms-access-course').on('click',function(e){
			e.preventDefault()
			// $(this).html('Enrolling... <span class="wpfnl-loader"></span>');
			var next_step_url = $(this).attr('href');
			var ajaxurl = window.wpfnl_obj.ajaxurl;

			var data    = {
				action 	: 'wpfnl_learndash_already_enroll_course',
				step_id : window.wpfnl_obj.step_id,
				user_id : window.wpfnl_obj.user_id,
			};
			
			console.log(data);
			$.ajax({
				type	: "POST",
				url		: ajaxurl,
				data	: data,
				dataType: 'json',
				success	: function (response) {
					if(response.success) {
						$('.wpfnl-lms-access-course-message').text('You are already enrolled in this course.')
						setTimeout(function(){
							window.location = next_step_url;
						}, 2500);
					}
				}
			});

		})

		$(document).ready(function () {
			// window.onbeforeunload = doAjaxBeforeUnload;
			// $(window).unload(doAjaxBeforeUnload);
		});
	});

})(jQuery);
