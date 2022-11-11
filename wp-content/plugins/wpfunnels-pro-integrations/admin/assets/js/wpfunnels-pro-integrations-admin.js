(function( $ ) {
	'use strict';

	/**
	 * All of the code for your admin-facing JavaScript source
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

	jQuery(document).ready(function($) {

		// Start Mailchimp authentication 
		$('.mailchimp-auth').click(function(e){
			e.preventDefault();
			var payload = {
                mailchimp_apikey : $('.mailchimp-apikey').val(),
                mailchimp_server : $('.mailchimp-server').val(),
                mailchimp_status : $( ".mailchimp-active" ).is(':checked') ? 'active' : 'deactive'
            };

			$('.mailchimp-hints').css('display','none');
			var is_validate = validation( 'mailchimp', payload );
			if( !is_validate ){
				return false;
			}
			$('.mailchimp-auth .wpfnl-loader').css('display','block');
			$('.mailchimp-auth').prop('disabled', true);
			$('.mailchimp-hints-auth').text('Please input valid credentials');
			wpAjaxHelperRequest("wpfnl-update-addons-cred", payload)
                .success(function(response) {
					
                    getAddonsCredAffterUpdate( 'mailchimp' );
					$('.mailchimp-auth .wpfnl-loader').css('display','none');
					$('.mailchimp-auth').prop("disabled",false);
                })
                .error(function(response) {
					$('.mailchimp-auth .wpfnl-loader').css('display','none');
                    $('.mailchimp-auth').prop("disabled",false);
                });
				
		})
		// End Mailchimp authentication 

		// Start Active Campaign authentication 
		$('.active-campaign-auth').click(function(e){
			e.preventDefault();
			var payload = {
                active_camp_url    : $('.active-campaign-url').val(),
                active_camp_api    : $('.active-campaign-api').val(),
                active_camp_status : $( ".active-campaign-active" ).is(':checked') ? 'active' : 'deactive'
            };

			$('.active-campaign-hints').css('display','none');
			var is_validate = validation( 'active-campaign', payload );
			if( !is_validate ){
				return false;
			}

			$('.active-campaign-auth .wpfnl-loader').css('display','block');
			$('.active-campaign-auth').prop('disabled', true)
			$('.active-campaign-hints-auth').text('Please input valid credentials');
			wpAjaxHelperRequest("wpfnl-update-addons-cred", payload)
                .success(function(response) {
					
                    getAddonsCredAffterUpdate( 'active-campaign' );
					$('.active-campaign-auth .wpfnl-loader').css('display','none');
					$('.active-campaign-auth').prop("disabled",false);
                })
                .error(function(response) {
					$('.active-campaign-auth .wpfnl-loader').css('display','none');
					$('.active-campaign-auth').prop("disabled",false);
                });
			
		})
		// End Active campaign authentication 

		// Start Constant Conatct authentication 
		$('.constant-contact-auth').click( function(e){
			e.preventDefault();
			var payload = {
                cc_url    : $('.constant-contact-url').val(),
                cc_api    : $('.constant-contact-api').val(),
                cc_secret : $('.constant-contact-secret').val(),
				cc_status : $( ".constant-contact-active" ).is(':checked') ? 'active' : 'deactive'
            };
			$('.constant-contact-hints').css('display','none');
			$('.constant-contact-hints-auth').text('Please input valid credentials');
			var is_validate = validation( 'constant-contact', payload );
			if( !is_validate ){
				return false;
			}
			wpAjaxHelperRequest("wpfnl-constant-contact-authentication", payload)
                .success(function(response) {
					if( response.success ){
						window.location.href = response.data;
					}
				})
		})
		// End Constant Contact authentication 

		// Start Aweber authentication 
		$('.aweber-auth').click( function(e){
			e.preventDefault();
			var payload = {
                aweber_url    : $('.aweber-url').val(),
                aweber_api    : $('.aweber-api').val(),
                aweber_secret : $('.aweber-secret').val(),
				aweber_status : $( ".aweber-active" ).is(':checked') ? 'active' : 'deactive'
            };
			$('.aweber-hints').css('display','none');
			$('.aweber-hints-auth').text('Please input valid credentials');
			var is_validate = validation( 'aweber', payload );
			if( !is_validate ){
				return false;
			}
			wpAjaxHelperRequest("wpfnl-aweber-authentication", payload)
                .success(function(response) {
					if( response.success ){
						window.location.href = response.data;
					}
				})
		})
		// End Aweber authentication 

		// Start Sendinblue authentication 
        $('.sendinblue-auth').click( function(e){
			e.preventDefault();
			var payload = {
                sendinblue_api    : $('.sendinblue-api').val(),
				sendinblue_status : $( ".sendinblue-active" ).is(':checked') ? 'active' : 'deactive'
            };
			$('.sendinblue-hints').css('display','none');
			var is_validate = validation( 'sendinblue', payload );
			if( !is_validate ){
				return false;
			}
            $('.sendinblue-auth .wpfnl-loader').css('display','flex');
			$('.sendinblue-hints-auth').text('Please input valid credentials');
			wpAjaxHelperRequest("wpfnl-sendinblue-authentication", payload)
                .success(function(response) {
					if( response.success ){
						
						getAddonsCredAffterUpdate( 'sendinblue' );
                        $('.sendinblue-auth .wpfnl-loader').css('display','none');
                        $('.sendinblue-auth').prop("disabled",false);
					}
				})
		})
		// End Sendinblue authentication 

		// Start Mailerlite authentication 
		$('.mailerlite-auth').click( function(e){
			e.preventDefault();
			var payload = {
                mailerlite_api    : $('.mailerlite-api').val(),
				mailerlite_status : $( ".mailerlite-active" ).is(':checked') ? 'active' : 'deactive'
            };
			$('.mailerlite-hints').css('display','none');
			var is_validate = validation( 'mailerlite', payload );
			if( !is_validate ){
				return false;
			}
            $('.mailerlite-auth .wpfnl-loader').css('display','flex');
			$('.mailerlite-hints-auth').text('Please input valid credentials');
			wpAjaxHelperRequest("wpfnl-mailerlite-authentication", payload)
                .success(function(response) {
					if( response.success ){
						
						getAddonsCredAffterUpdate( 'mailerlite' );
                        $('.mailerlite-auth .wpfnl-loader').css('display','none');
                        $('.mailerlite-auth').prop("disabled",false);
					}
				})
		})
		// End Mailerlite authentication 

		// Start GetResponse authentication 
		$('.getresponse-auth').click( function(e){
			e.preventDefault();
			var payload = {
                getresponse_api    : $('.getresponse-api').val(),
				getresponse_status : $( ".getresponse-active" ).is(':checked') ? 'active' : 'deactive'
            };
			$('.getresponse-hints').css('display','none');
			$('.getresponse-hints-auth').text('Please input valid credentials');
			var is_validate = validation( 'getresponse', payload );
			if( !is_validate ){
				return false;
			}
			$('.getresponse-auth .wpfnl-loader').css('display','flex');
			wpAjaxHelperRequest("wpfnl-getresponse-authentication", payload)
                .success(function(response) {
					getAddonsCredAffterUpdate( 'getresponse' );
					$('.getresponse-reset .wpfnl-loader').css('display','none');
					$('.getresponse-auth .wpfnl-loader').css('display','none');
					$('.getresponse-auth').prop("disabled",false);
					$('.getresponse-auth .wpfnl-loader').css('display','none');
					
				})
		})
		// End GetResponse authentication 


		// Start Encharge authentication 
		$('.encharge-auth').click( function(e){
			e.preventDefault();
			var payload = {
                encharge_api    : $('.encharge-api').val(),
				encharge_status : $( ".encharge-active" ).is(':checked') ? 'active' : 'deactive'
            };
			$('.encharge-hints').css('display','none');
			$('.encharge-hints-auth').text('Please input valid credentials');
			var is_validate = validation( 'encharge', payload );
			if( !is_validate ){
				return false;
			}
			$('.encharge-auth .wpfnl-loader').css('display','flex');
			wpAjaxHelperRequest("wpfnl-encharge-authentication", payload)
                .success(function(response) {
					getAddonsCredAffterUpdate( 'encharge' );
					$('.encharge-reset .wpfnl-loader').css('display','none');
					$('.encharge-auth .wpfnl-loader').css('display','none');
					$('.encharge-auth').prop("disabled",false);
					$('.encharge-auth .wpfnl-loader').css('display','none');
					
				})
		})

		// End Encharge authentication 

		// Start Reset Authentication
		$('.mailchimp-reset').click(function (e){
			 $('.mailchimp-apikey').val('')
			 $('.mailchimp-server').val('')
			var payload = {
				mailchimp_apikey : $('.mailchimp-apikey').val(),
				mailchimp_server : $('.mailchimp-server').val(),
				mailchimp_status : $( ".mailchimp-active" ).is(':checked') ? 'active' : 'deactive'
			};
			$('.mailchimp-reset .wpfnl-loader').css('display','block');
			$('.mailchimp-auth').prop('disabled', true);
			wpAjaxHelperRequest("wpfnl-update-addons-cred", payload)
				.success(function(response) {
					$('.mailchimp-auth .btn-text').text('Authorize Now');
					getAddonsCredAffterUpdate( 'mailchimp' );
					$('.mailchimp-reset .wpfnl-loader').css('display','none');
					$('.mailchimp-auth').prop("disabled",false);
				})
				.error(function(response) {
					$('.mailchimp-reset .wpfnl-loader').css('display','none');
					$('.mailchimp-auth').prop("disabled",false);
				});

		})

		$('.active-campaign-reset').click(function (e){
			 $('.active-campaign-url').val('')
			 $('.active-campaign-api').val('')
			var payload = {
				active_camp_url    : $('.active-campaign-url').val(),
				active_camp_api    : $('.active-campaign-api').val(),
				active_camp_status : $( ".active-campaign-active" ).is(':checked') ? 'active' : 'deactive'
			};

			$('.active-campaign-reset .wpfnl-loader').css('display','block');
			$('.active-campaign-auth').prop('disabled', true)

			wpAjaxHelperRequest("wpfnl-update-addons-cred", payload)
				.success(function(response) {
					$('.active-campaign-auth .btn-text').text('Authorize Now');
					getAddonsCredAffterUpdate( 'active-campaign' );
					$('.active-campaign-reset .wpfnl-loader').css('display','none');
					$('.active-campaign-auth').prop("disabled",false);
				})
				.error(function(response) {
					$('.active-campaign-reset .wpfnl-loader').css('display','none');
					$('.active-campaign-auth').prop("disabled",false);
				});

		})

		$('.constant-contact-reset').click( function(e){
			e.preventDefault();
			$('.constant-contact-url').val('')
			$('.constant-contact-api').val('')
			$('.constant-contact-secret').val('')
			var payload = {
				cc_url    : $('.constant-contact-url').val(),
				cc_api    : $('.constant-contact-api').val(),
				cc_secret : $('.constant-contact-secret').val(),
				cc_status : $( ".constant-contact-active" ).is(':checked') ? 'active' : 'deactive'
			};
			wpAjaxHelperRequest("wpfnl-constant-contact-authentication", payload)
				.success(function(response) {
					$('.constant-contact-auth .btn-text').text('Authorize Now');
					if( response.success ){
						window.location.href = response.data;
					}
				})
		})

		$('.aweber-reset').click( function(e){
			e.preventDefault();
			 $('.aweber-url').val('')
			 $('.aweber-api').val('')
			 $('.aweber-secret').val('')
			var payload = {
				aweber_url    : $('.aweber-url').val(),
				aweber_api    : $('.aweber-api').val(),
				aweber_secret : $('.aweber-secret').val(),
				aweber_status : $( ".aweber-active" ).is(':checked') ? 'active' : 'deactive'
			};
			wpAjaxHelperRequest("wpfnl-aweber-authentication", payload)
				.success(function(response) {
					$('.aweber-auth .btn-text').text('Authorize Now');

					if( response.success ){
						
						window.location.href = response.data;
					}
				})
		})
		
		$('.sendinblue-reset').click( function(e){
			e.preventDefault();
			$('.sendinblue-api').val('')
			var payload = {
				sendinblue_api    : $('.sendinblue-api').val(),
				sendinblue_status : $( ".sendinblue-active" ).is(':checked') ? 'active' : 'deactive'
			};
			$('.sendinblue-reset .wpfnl-loader').css('display','flex');
			wpAjaxHelperRequest("wpfnl-sendinblue-authentication", payload)
				.success(function(response) {
					if( response.success ){
						
						getAddonsCredAffterUpdate( 'sendinblue' );
						$('.sendinblue-reset .wpfnl-loader').css('display','none');
						$('.sendinblue-auth').prop("disabled",false);
					}
					$('.sendinblue-auth .btn-text').text('Authorize Now');
				})
		})

		$('.mailerlite-reset').click( function(e){
			e.preventDefault();
			$('.mailerlite-api').val('')
			var payload = {
				mailerlite_api    : $('.mailerlite-api').val(),
				mailerlite_status : $( ".mailerlite-active" ).is(':checked') ? 'active' : 'deactive'
			};
			$('.mailerlite-reset .wpfnl-loader').css('display','flex');
			wpAjaxHelperRequest("wpfnl-mailerlite-authentication", payload)
				.success(function(response) {
					if( response.success ){
						
						getAddonsCredAffterUpdate( 'mailerlite' );
						$('.mailerlite-reset .wpfnl-loader').css('display','none');
						$('.mailerlite-auth').prop("disabled",false);
					}
					$('.mailerlite-auth .btn-text').text('Authorize Now');
				})
		})

		$('.getresponse-reset').click( function(e){
			e.preventDefault();
			$('.getresponse-api').val('')
			var payload = {
				getresponse_api    : $('.getresponse-api').val(),
				getresponse_status : $( ".getresponse-active" ).is(':checked') ? 'active' : 'deactive'
			};
			$('.getresponse-reset .wpfnl-loader').css('display','flex');
			wpAjaxHelperRequest("wpfnl-getresponse-authentication", payload)
				.success(function(response) {
					if( response.success ){
						
						getAddonsCredAffterUpdate( 'getresponse' );
					}
					$('.getresponse-auth .btn-text').text('Authorize Now');
					$('.getresponse-reset .wpfnl-loader').css('display','none');
					$('.getresponse-auth').prop("disabled",false);
				})
		})
		
		
		$('.encharge-reset').click( function(e){
			e.preventDefault();
			$('.encharge-api').val('')
			var payload = {
				encharge_api    : $('.encharge-api').val(),
				encharge_status : $( ".encharge-active" ).is(':checked') ? 'active' : 'deactive'
			};
			$('.encharge-reset .wpfnl-loader').css('display','flex');
			wpAjaxHelperRequest("wpfnl-encharge-authentication", payload)
				.success(function(response) {
					if( response.success ){
						getAddonsCredAffterUpdate( 'encharge' );
					}
					$('.encharge-auth .btn-text').text('Authorize Now');
					$('.encharge-reset .wpfnl-loader').css('display','none');
					$('.encharge-auth').prop("disabled",false);
				})
		})
		// End Reset authentication 

		
		// Start CRM's field validation
		function validation( crm , payload ){
			var is_validate = true;
			if( 'mailchimp' === crm ){
				if( !payload.mailchimp_apikey || !payload.mailchimp_server ){
					is_validate = false;
					$('.mailchimp-auth .btn-text').text('Authorize Now');
				}
				if( !payload.mailchimp_apikey ){
					$('.mailchimp-hints-api').css('display','block');
				}
				if( !payload.mailchimp_server ){
					$('.mailchimp-hints-server').css('display','block');
				}

			}

			if( 'constant-contact' === crm ){
				if( !payload.cc_url || !payload.cc_api || !payload.cc_secret){
					is_validate = false;
					$('.constant-contact-auth .btn-text').text('Authorize Now');
				}
				if( !payload.cc_api ){
					$('.constant-contact-hints-api').css('display','block');
				}
				if( !payload.cc_url ){
					$('.constant-contact-hints-url').css('display','block');
				}
				if( !payload.cc_secret ){
					$('.constant-contact-hints-secret').css('display','block');
				}
			}
			
			if( 'aweber' === crm ){
				if( !payload.aweber_url || !payload.aweber_api || !payload.aweber_secret ){
					is_validate = false;
					$('.aweber-auth .btn-text').text('Authorize Now');
				}
				if( !payload.aweber_api ){
					$('.aweber-hints-api').css('display','block');
				}
				if( !payload.aweber_url ){
					$('.aweber-hints-url').css('display','block');
				}
				if( !payload.aweber_secret ){
					$('.aweber-hints-secret').css('display','block');
				}
				
			}

			if( 'active-campaign' === crm ){
				if( !payload.active_camp_url || !payload.active_camp_api ){
					is_validate = false;
					$('.active-campaign-auth .btn-text').text('Authorize Now');
				}
				if( !payload.active_camp_api ){
					$('.active-campaign-hints-api').css('display','block');
				}
				if( !payload.active_camp_url ){
					$('.active-campaign-hints-url').css('display','block');
				}
			}

            if( 'sendinblue' === crm ){
                if( !payload.sendinblue_api ){
					is_validate = false;
					$('.sendinblue-auth .btn-text').text('Authorize Now');
				}
				if( !payload.sendinblue_api ){
					$('.sendinblue-hints-api').css('display','block');
				}
				
			}

			if( 'mailerlite' === crm ){
                if( !payload.mailerlite_api ){
					is_validate = false;
					$('.mailerlite-auth .btn-text').text('Authorize Now');
				}
				if( !payload.mailerlite_api ){
					$('.mailerlite-hints-api').css('display','block');
				}
				
			}

			if( 'getresponse' === crm ){
                if( !payload.getresponse_api ){
					is_validate = false;
					$('.getresponse-auth .btn-text').text('Authorize Now');
					$('.getresponse-hints-api').css('display','block');
				}
				
			}
			
			if( 'encharge' === crm ){
                if( !payload.encharge_api ){
					is_validate = false;
					$('.encharge-auth .btn-text').text('Authorize Now');
					$('.encharge-hints-api').css('display','block');
				}
				
			}
			return is_validate;
		}
		// End CRM's field validation

		getAddonsCred();

		// Get CRM's credentials
		function getAddonsCred(){
			wpAjaxHelperRequest("wpfnl-get-addons-cred")
                .success(function(response) {
					if( response.success ){
						
						if( response.data.mailchimp.mailchimp_apikey ){
							$('.mailchimp-apikey').val(response.data.mailchimp.mailchimp_apikey)
						}
						if( response.data.mailchimp.mailchimp_server ){
							$('.mailchimp-server').val(response.data.mailchimp.mailchimp_server)
						}
						if( response.data.mailchimp.status == 'active' ){
							$('.mailchimp-active').prop('checked', true);
							$('.mailchimp-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.mailchimp-active').prop('checked', false);
							$('.mailchimp-active').parents('.single-addon').removeClass('addon-enabled');
						}

						if( response.data.mailchimp.mailchimp_status == 'active' ){
							$('.mailchimp-auth .btn-text').text('Authorized');
						}else{
							$('.mailchimp-auth .btn-text').text('Authorize Now');
						}

						if( response.data.activecamp.active_camp_url ){
							$('.active-campaign-url').val(response.data.activecamp.active_camp_url)
						}
						if( response.data.activecamp.active_camp_api ){
							$('.active-campaign-api').val(response.data.activecamp.active_camp_api)
						}
						if( response.data.activecamp.status == 'active' ){
							
							$('.active-campaign-active').prop('checked', true);
							$('.active-campaign-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.active-campaign-active').prop('checked', false);
							$('.active-campaign-active').parents('.single-addon').removeClass('addon-enabled');
						}

						if( response.data.activecamp.activecamp_status == 'active' ){
							$('.active-campaign-auth .btn-text').text('Authorized');
						}else{
							$('.active-campaign-auth .btn-text').text('Authorize Now');
						}

						if( response.data.mailpoet.status == 'active' ){
							
							$('.mailpoet-active').prop('checked', true);
							$('.mailpoet-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.mailpoet-active').prop('checked', false);
							$('.mailpoet-active').parents('.single-addon').removeClass('addon-enabled');
						}

						if( response.data.cc.cc_url ){
							$('.constant-contact-url').val(response.data.cc.cc_url)
						}
						if( response.data.cc.cc_api ){
							$('.constant-contact-api').val(response.data.cc.cc_api)
						}
						if( response.data.cc.cc_secret ){
							$('.constant-contact-secret').val(response.data.cc.cc_secret)
						}
						if( response.data.cc.cc_status == 'active' ){
							$('.constant-contact-auth .btn-text').text('Authorized');
						}else{
							$('.constant-contact-auth .btn-text').text('Authorize Now');
						}

						if( response.data.cc.status == 'active' ){
							$('.constant-contact-active').prop('checked', true);
							$('.constant-contact-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.constant-contact-active').prop('checked', false);
							$('.constant-contact-active').parents('.single-addon').removeClass('addon-enabled');
						}


						if( response.data.aweber.aweber_url ){
							$('.aweber-url').val(response.data.aweber.aweber_url)
						}
						if( response.data.aweber.aweber_api ){
							$('.aweber-api').val(response.data.aweber.aweber_api)
						}
						if( response.data.aweber.aweber_secret ){
							$('.aweber-secret').val(response.data.aweber.aweber_secret)
						}
						if( response.data.aweber.aweber_ac ){
							$('.aweber-ac').val(response.data.aweber.aweber_ac)
						}
						
						if( response.data.aweber.aweber_status == 'active' ){
							$('.aweber-auth .btn-text').text('Authorized');
						}else{
							$('.aweber-auth .btn-text').text('Authorize Now');
						}

						if( response.data.aweber.status == 'active' ){
							$('.aweber-active').prop('checked', true);
							$('.aweber-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.aweber-active').prop('checked', false);
							$('.aweber-active').parents('.single-addon').removeClass('addon-enabled');
						}

                        if( response.data.sendinblue.sendinblue_api ){
							$('.sendinblue-api').val(response.data.sendinblue.sendinblue_api)
						}
						
						if( response.data.sendinblue.sendinblue_status == 'active' ){
							$('.sendinblue-auth .btn-text').text('Authorized');
						}else{
							$('.sendinblue-auth .btn-text').text('Authorize Now');
						}

						if( response.data.sendinblue.status == 'active' ){
							$('.sendinblue-active').prop('checked', true);
							$('.sendinblue-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.sendinblue-active').prop('checked', false);
							$('.sendinblue-active').parents('.single-addon').removeClass('addon-enabled');
						}

						if( response.data.mailerlite.mailerlite_api ){
							$('.mailerlite-api').val(response.data.mailerlite.mailerlite_api)
						}

						if( response.data.mailerlite.mailerlite_status == 'active' ){
							$('.mailerlite-auth .btn-text').text('Authorized');
						}else{
							$('.mailerlite-auth .btn-text').text('Authorize Now');
						}

						if( response.data.mailerlite.status == 'active' ){
							$('.mailerlite-active').prop('checked', true);
							$('.mailerlite-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.mailerlite-active').prop('checked', false);
							$('.mailerlite-active').parents('.single-addon').removeClass('addon-enabled');
						}

						if( response.data.getresponse.getresponse_url ){
							$('.getresponse-url').val(response.data.getresponse.getresponse_url)
						}
						if( response.data.getresponse.getresponse_api ){
							$('.getresponse-api').val(response.data.getresponse.getresponse_api)
						}
						if( response.data.getresponse.getresponse_secret ){
							$('.getresponse-secret').val(response.data.getresponse.getresponse_secret)
						}
						if( response.data.getresponse.getresponse_status == 'active' ){
							$('.getresponse-auth .btn-text').text('Authorized');
						}else{
							$('.getresponse-auth .btn-text').text('Authorize Now');
						}

						if( response.data.getresponse.status == 'active' ){
							$('.getresponse-active').prop('checked', true);
							$('.getresponse-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.getresponse-active').prop('checked', false);
							$('.getresponse-active').parents('.single-addon').removeClass('addon-enabled');
						}
						

						
						if( response.data.encharge.encharge_api ){
							$('.encharge-api').val(response.data.encharge.encharge_api)
						}
						
						if( response.data.encharge.encharge_status == 'active' ){
							$('.encharge-auth .btn-text').text('Authorized');
						}else{
							$('.encharge-auth .btn-text').text('Authorize Now');
						}

						if( response.data.encharge.status == 'active' ){
							$('.encharge-active').prop('checked', true);
							$('.encharge-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.encharge-active').prop('checked', false);
							$('.encharge-active').parents('.single-addon').removeClass('addon-enabled');
						}
						
					}
					$('.addon-loader').css('display','none');
					
                })
                .error(function(response) {
                    
                });
		
		}

		// Get CRM's credentials after update
		function getAddonsCredAffterUpdate( crm = '' ){
			
			wpAjaxHelperRequest("wpfnl-get-addons-cred")
                .success(function(response) {
					if( response.success ){
						
						if( response.data.mailchimp.mailchimp_apikey ){
							$('.mailchimp-apikey').val(response.data.mailchimp.mailchimp_apikey)
						}
						if( response.data.mailchimp.mailchimp_server ){
							$('.mailchimp-server').val(response.data.mailchimp.mailchimp_server)
						}
						if( response.data.mailchimp.status == 'active' ){
							$('.mailchimp-active').prop('checked', true);
							$('.mailchimp-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.mailchimp-active').prop('checked', false);
							$('.mailchimp-active').parents('.single-addon').removeClass('addon-enabled');
						}

						if( response.data.mailchimp.mailchimp_status == 'active' ){
							$('.mailchimp-auth .btn-text').text('Authorized');
						}else{
							$('.mailchimp-auth .btn-text').text('Authorize Now');
							if( 'mailchimp' == crm ){
								invalidAuth( crm );
							}
							
						}


						if( response.data.activecamp.active_camp_url ){
							$('.active-campaign-url').val(response.data.activecamp.active_camp_url)
						}
						if( response.data.activecamp.active_camp_api ){
							$('.active-campaign-api').val(response.data.activecamp.active_camp_api)
						}
						if( response.data.activecamp.status == 'active' ){
							
							$('.active-campaign-active').prop('checked', true);
							$('.active-campaign-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.active-campaign-active').prop('checked', false);
							$('.active-campaign-active').parents('.single-addon').removeClass('addon-enabled');
						}

						if( response.data.activecamp.activecamp_status == 'active' ){
							$('.active-campaign-auth .btn-text').text('Authorized');
						}else{
							$('.active-campaign-auth .btn-text').text('Authorize Now');
						}


						if( response.data.cc.cc_url ){
							$('.constant-contact-url').val(response.data.cc.cc_url)
						}
						if( response.data.cc.cc_api ){
							$('.constant-contact-api').val(response.data.cc.cc_api)
						}
						if( response.data.cc.cc_secret ){
							$('.constant-contact-secret').val(response.data.cc.cc_secret)
						}
						if( response.data.cc.cc_status == 'active' ){
							$('.constant-contact-auth .btn-text').text('Authorized');
						}else{
							$('.constant-contact-auth .btn-text').text('Authorize Now');
							if( 'constant-contact' == crm ){
								invalidAuth( crm );
							}
							
						}
						if( response.data.cc.status == 'active' ){
							$('.constant-contact-active').prop('checked', true);
							$('.constant-contact-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.constant-contact-active').prop('checked', false);
							$('.constant-contact-active').parents('.single-addon').removeClass('addon-enabled');
						}


						if( response.data.aweber.aweber_url ){
							$('.aweber-url').val(response.data.aweber.aweber_url)
						}
						if( response.data.aweber.aweber_api ){
							$('.aweber-api').val(response.data.aweber.aweber_api)
						}
						if( response.data.aweber.aweber_secret ){
							$('.aweber-secret').val(response.data.aweber.aweber_secret)
						}
						if( response.data.aweber.aweber_ac ){
							$('.aweber-ac').val(response.data.aweber.aweber_ac)
						}
						if( response.data.aweber.aweber_status == 'active' ){
							$('.aweber-auth .btn-text').text('Authorized');
						}else{
							$('.aweber-auth .btn-text').text('Authorize Now');
							if( 'aweber' == crm ){
								invalidAuth( crm );
							}
						}

						if( response.data.aweber.status == 'active' ){
							$('.aweber-active').prop('checked', true);
							$('.aweber-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.aweber-active').prop('checked', false);
							$('.aweber-active').parents('.single-addon').removeClass('addon-enabled');
						}
						
						if( response.data.sendinblue.sendinblue_api ){
							$('.sendinblue-api').val(response.data.sendinblue.sendinblue_api)
						}
						
						if( response.data.sendinblue.sendinblue_status == 'active' ){
							$('.sendinblue-auth .btn-text').text('Authorized');
						}else{
							$('.sendinblue-auth .btn-text').text('Authorize Now');
							if( 'sendinblue' == crm ){
								invalidAuth( crm );
							}
						}

						if( response.data.sendinblue.status == 'active' ){
							$('.sendinblue-active').prop('checked', true);
							$('.sendinblue-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.sendinblue-active').prop('checked', false);
							$('.sendinblue-active').parents('.single-addon').removeClass('addon-enabled');
						}

						if( response.data.mailerlite.mailerlite_api ){
							$('.mailerlite-api').val(response.data.mailerlite.mailerlite_api)
						}
						
						if( response.data.mailerlite.mailerlite_status == 'active' ){
							$('.mailerlite-auth .btn-text').text('Authorized');
						}else{
							$('.mailerlite-auth .btn-text').text('Authorize Now');
							if( 'mailerlite' == crm ){
								invalidAuth( crm );
							}
							
						}

						if( response.data.mailerlite.status == 'active' ){
							$('.mailerlite-active').prop('checked', true);
							$('.mailerlite-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.mailerlite-active').prop('checked', false);
							$('.mailerlite-active').parents('.single-addon').removeClass('addon-enabled');
						}


						if( response.data.getresponse.getresponse_api ){
							$('.getresponse-api').val(response.data.getresponse.getresponse_api)
						}
		
						if( response.data.getresponse.getresponse_status == 'active' ){
							$('.getresponse-auth .btn-text').text('Authorized');
						}else{
							$('.getresponse-auth .btn-text').text('Authorize Now');
							if( 'getresponse' == crm ){
								invalidAuth( crm );
							}
						}

						if( response.data.getresponse.status == 'active' ){
							$('.getresponse-active').prop('checked', true);
							$('.getresponse-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.getresponse-active').prop('checked', false);
							$('.getresponse-active').parents('.single-addon').removeClass('addon-enabled');
						}


						if( response.data.encharge.encharge_api ){
							$('.encharge-api').val(response.data.encharge.encharge_api)
						}
		
						if( response.data.encharge.encharge_status == 'active' ){
							$('.encharge-auth .btn-text').text('Authorized');
						}else{
							$('.encharge-auth .btn-text').text('Authorize Now');
							if( 'encharge' == crm ){
								invalidAuth( crm );
							}
						}

						if( response.data.encharge.status == 'active' ){
							$('.encharge-active').prop('checked', true);
							$('.encharge-active').parents('.single-addon').addClass('addon-enabled');
						}else{
							$('.encharge-active').prop('checked', false);
							$('.encharge-active').parents('.single-addon').removeClass('addon-enabled');
						}

					}
					
                })
                .error(function(response) {
                    
                });
		
		}


		//------addon switcher option------

		// Enable/Disbale CRM's status
		$('.single-addon .wpfnl-switcher input[type="checkbox"]').on('click', function(){
			let id  = $(this).attr('id'),
				crm = '',
				className = '';

			if( 'mailchimp-active' == id ){
				crm 		= 'mailchimp';
				className 	= 'mailchimp';
			}else if( 'active-campaign-active' == id ){
				crm 		= 'activecamp';
				className 	= 'active-campaign';
			}else if( 'mailpoet-active' == id ){
				crm 		= 'mailpoet';
				className 	= 'mailpoet';
			}else if( 'constant-contact-active' == id ){
				crm 		= 'cc';
				className 	= 'constant-contact';
			}else if( 'aweber-active' == id ){
				crm 		= 'aweber';
				className 	= 'aweber';
			}else if( 'sendinblue-active' == id ){
				crm 		= 'sendinblue';
				className 	= 'sendinblue';
			}else if( 'mailerlite-active' == id ){
				crm 		= 'mailerlite';
				className 	= 'mailerlite';
			}else if( 'getresponse-active' == id ){
				crm 		= 'getresponse';
				className 	= 'getresponse';
			}else if( 'encharge-active' == id ){
				crm 		= 'encharge';
				className 	= 'encharge';
			}

			if($(this).is(":checked")){
                $(this).parents('.single-addon').addClass('addon-enabled');
            }else {
                $(this).parents('.single-addon').removeClass('addon-enabled');
			}
			updateCrmStatus( crm ,className );

		});

		// Update CRM's status
		function updateCrmStatus( crm, className ){
			var payload = {
				'crm'	 : crm, 	
                'status' : $('.'+className+'-active').is(':checked') ? 'active' : 'deactive',
            };
            wpAjaxHelperRequest("wpfnl-update-crm-status", payload)
                .success(function(response) {
                    
                })
                .error(function(response) {
                    
                });
		}

		// Show error message if credentials are wrong
		function invalidAuth( crm ){
			
			$('.'+crm+'-hints-auth').css('display','block');
			setTimeout(function () {
				$('.'+crm+'-hints-auth').text('');
			}, 1500)
		}
	
	})



})( jQuery );
