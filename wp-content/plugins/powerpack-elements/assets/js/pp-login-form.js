;(function($) {
	window.onLoadPPReCaptcha = function () {
		var reCaptchaFields = $('.pp-grecaptcha'),
			widgetID;

		if (reCaptchaFields.length > 0) {
			reCaptchaFields.each(function (i) {
				var self = $(this),
					attrWidget = self.attr('data-widgetid'),
					newID = $(this).attr('id'); // + '-' + i;
				// Avoid re-rendering as it's throwing API error
				if ((typeof attrWidget !== typeof undefined && attrWidget !== false)) {
					return;
				}
				else {
					// Increment ID to avoid conflict with the same form.
					self.attr('id', newID);

					widgetID = grecaptcha.render(newID, {
						sitekey	: self.data('sitekey'),
						theme	: self.data('theme'),
						size	: self.data('validate'),
						callback: function (response) {
							if ( response != '' ) {
								self.attr('data-pp-grecaptcha-response', response);

								// Re-submitting the form after a successful invisible validation.
								if ('invisible' == self.data('validate')) {
									self.closest('.elementor-widget').find('.pp-submit-button').trigger('click');
								}
							}
						}
					});

					self.attr('data-widgetid', widgetID);
				}
			});
		}
	};

	var isEditMode = false;

	PPLoginForm = function( $scope, elementSettings, settings ) {
		this.node            = $scope;
		this.id              = settings.id;
		this.messages	     = settings.messages;
		this.settings 	     = settings;
		this.elementSettings = elementSettings;
		this._init();
	};

	PPLoginForm.prototype = {
		settings: {},
		isGoogleLoginClicked: false,

		_init: function() {
			if ( this.settings.facebook_login ) {
				this._initFacebookLogin();
			}
			if ( this.settings.google_login ) {
				this._initGoogleLogin();
			}

			if ( this.node.find( '#pp-form-' + this.id ).length > 0 && 'yes' === this.elementSettings.enable_ajax ) {
				this.node.find( '#pp-form-' + this.id ).on( 'submit', $.proxy( this._loginFormSubmit, this ) );
			}

			if ( this.node.find( '.pp-login-form--lost-pass' ).length > 0 ) {
				this.node.find( '.pp-login-form--lost-pass' ).on( 'submit', $.proxy( this._lostPassFormSubmit, this ) );
			}

			if ( this.node.find( '.pp-login-form--reset-pass' ).length > 0 ) {
				this.node.find( '.pp-login-form--reset-pass' ).on( 'submit', $.proxy( this._resetPassFormSubmit, this ) );
			}

			if ( this.settings.enable_recaptcha ) {
				this._initReCaptcha();
			}
		},

		_initReCaptcha: function() {
			var reCaptchaField = this.node.find( '.pp-grecaptcha' );

			if ( elementorFrontend.isEditMode() && undefined == reCaptchaField.attr( 'data-widgetid' ) ) {
				onLoadPPReCaptcha();
			}
		},

		_initFacebookLogin: function() {
			if ( '' === this.settings.facebook_app_id ) {
				return;
			}
			if ( this.node.find( '.pp-fb-login-button' ).length > 0 ) {
				this._initFacebookSDK();
			
				this.node.find( '.pp-fb-login-button' ).on( 'click', $.proxy( this._facebookLoginClick, this ) );
			}
		},

		_initFacebookSDK: function() {
			var self = this;

			if ( $( '#fb-root' ).length === 0 ) {
				$('body').prepend('<div id="fb-root"></div>');
			}
			// Load the SDK asynchronously.
			var d = document, s = 'script', id = 'facebook-jssdk';
			var js, fjs = d.getElementsByTagName(s)[0];
			
			if (d.getElementById(id)) return;
			
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);

			window.fbAsyncInit = function() {
			    // Init.
			    FB.init({
			      appId      : self.settings.facebook_app_id, // App ID.
			      cookie     : true,  // Enable cookies to allow the server to access the session.
			      xfbml      : true,  // Parse social plugins on this webpage.
			      version    : 'v2.12' // Use this Graph API version for this call.
				});
			};
		},

		_facebookLoginClick: function() {
			var self = this,
				theForm = this.node.find( '.pp-login-form' ),
				redirect = theForm.find( 'input[name="redirect_to"]' );

			var args = {
				action: 'pp_lf_process_social_login',
				provider: 'facebook',
				page_url: self.settings.page_url,
				nonce: self._getNonce(),
			};

			if ( redirect.length > 0 && '' !== redirect.val() ) {
				args['redirect'] = redirect.val();
			}

			this._disableForm();

			FB.login( function( response ) {
				if ( 'connected' === response.status ) {
					FB.api( '/me', { fields: 'id, email, name, first_name, last_name' }, function( response ) {
						var authResponse = FB.getAuthResponse();
						args['user_data'] = response;
						args['auth_response'] = authResponse;
						self._ajax( args, function( response ) {
							if ( ! response.success ) {
								console.error( response.data );
								self._enableForm();
							} else {
								if ( response.data.redirect_url ) {
									window.location.href = response.data.redirect_url;
								} else {
									window.location.reload();
								}
							}
						} );
					} );
				} else {
					if ( response.authResponse ) {
						console.error( 'PP Login Form: Unable to connect Facebook account.' );
					}
					self._enableForm();
				}
			}, {
				scope: 'email',
				return_scopes: true
			} );
		},

		_initGoogleLogin: function() {
			if ( '' === this.settings.google_client_id ) {
				return;
			}
			if ( this.node.find( '.pp-google-login-button' ).length > 0 ) {
				this._initGoogleApi();

				this.node.find( '.pp-google-login-button' ).on( 'click', $.proxy( this._googleLoginClick, this ) );
			}
		},

		_initGoogleApi: function() {
			var self = this,
				theForm = this.node.find( '.pp-login-form' ),
				redirect = theForm.find( 'input[name="redirect_to"]' );

			if ( 'undefined' === typeof gapi || '' === self.settings.google_client_id ) {
				return;
			}

			var args = {
				action: 'pp_lf_process_social_login',
				provider: 'google',
				page_url: self.settings.page_url,
				nonce: self._getNonce(),
			};

			if ( redirect.length > 0 && '' !== redirect.val() ) {
				args['redirect'] = redirect.val();
			}

			gapi.load( 'auth2', function() {
				auth2 = gapi.auth2.init( {
					client_id: self.settings.google_client_id,
					cookiepolicy: 'single_host_origin',
				} );

				auth2.attachClickHandler( 'pp-google-login-button', {}, function( GoogleUser ) {
					var profile = GoogleUser.getBasicProfile();

					args['user_data'] = {
						name: profile.getName(),
						email: profile.getEmail(),
						hash: GoogleUser.getAuthResponse().id_token
					};

					if ( self.isGoogleLoginClicked ) {
						self._ajax( args, function( response ) {
							if ( ! response.success ) {
								console.error( response.data );
								self._enableForm();
							} else {
								if ( response.data.redirect_url ) {
									var hostUrl = location.protocol + '//' + location.host;
									var redirectUrl = '';

									if ( '' === response.data.redirect_url.split( hostUrl )[0] ) {
										redirectUrl = response.data.redirect_url.split( hostUrl )[1];
									} else {
										redirectUrl = response.data.redirect_url.split( hostUrl )[0];
									}

									if ( redirectUrl === location.href.split( hostUrl )[1] ) {
										window.location.reload();
									} else {
										window.location.href = response.data.redirect_url;
									}
								} else {
									window.location.reload();
								}
							}

							self.isGoogleLoginClicked = false;
						} );
					}
				}, function( error ) {
					console.error( error );
					self._enableForm();
				} );
			} );
		},

		_googleLoginClick: function() {
			this.isGoogleLoginClicked = true;
			this._disableForm();
		},

		_loginFormSubmit: function(e) {
			e.preventDefault();

			var theForm 		= $(e.target),
				username 		= theForm.find( 'input[name="log"]' ),
				password 		= theForm.find( 'input[name="pwd"]' ),
				remember 		= theForm.find( 'input[name="rememberme"]' ),
				redirect 		= theForm.find( 'input[name="redirect_to"]' ),
				reCaptchaField 	= theForm.find( '.pp-grecaptcha' ),
				reCaptchaValue 	= reCaptchaField.data( 'pp-grecaptcha-response' ),
				self 			= this;
		
			username.parent().find( '.pp-lf-error' ).remove();
			password.parent().find( '.pp-lf-error' ).remove();
			reCaptchaField.parent().find( '.pp-lf-error' ).remove();

			// Validate username.
			if ( '' === username.val().trim() ) {
				$('<span class="pp-lf-error">').insertAfter( username ).html( this.messages.empty_username );
				return;
			}

			// Validate password.
			if ( '' === password.val() ) {
				$('<span class="pp-lf-error">').insertAfter( password ).html( this.messages.empty_password );
				return;
			}

			// Validate reCAPTCHA.
			if ( reCaptchaField.length > 0 ) {
				if ( 'undefined' === typeof reCaptchaValue || reCaptchaValue === false ) {
					if ( 'normal' == reCaptchaField.data( 'validate' ) ) {
						$('<span class="pp-lf-error">').insertAfter( reCaptchaField ).html( this.messages.empty_recaptcha );
						return;
					} else if ( 'invisible' == reCaptchaField.data( 'validate' ) ) {
						// Invoke the reCAPTCHA check.
						grecaptcha.execute( reCaptchaField.data( 'widgetid' ) );
					}
				}
			}

			var formData = new FormData( theForm[0] );

			formData.append( 'action', 'ppe_lf_process_login' );
			formData.append( 'page_url', this.settings.page_url );
			formData.append( 'username', username.val() );
			formData.append( 'password', password.val() );

			if ( redirect.length > 0 && '' !== redirect.val() ) {
				formData.append( 'redirect', redirect.val() );
			}

			if ( remember.length > 0 && remember.is(':checked') ) {
				formData.append( 'remember', '1' );
			}

			if ( reCaptchaField.length > 0 ) {
				formData.append( 'recaptcha', true );
				formData.append( 'recaptcha_validate', reCaptchaField.data( 'validate' ) );
				formData.append( 'recaptcha_validate_type', reCaptchaField.data( 'validate-type' ) );
			}
			if ( reCaptchaValue ) {
				formData.append( 'recaptcha_response', reCaptchaValue );
			}

			this._disableForm();

			this._ajax( formData, function( response ) {
				if ( ! response.success ) {
					self._enableForm();
					theForm.find( '.pp-lf-error' ).remove();
					$('<span class="pp-lf-error">').appendTo( theForm ).html( response.data );
				} else {
					if ( response.data.redirect_url ) {
						var hostUrl = location.protocol + '//' + location.host;
						var redirectUrl = '';

						if ( '' === response.data.redirect_url.split( hostUrl )[0] ) {
							redirectUrl = response.data.redirect_url.split( hostUrl )[1];
						} else {
							redirectUrl = response.data.redirect_url.split( hostUrl )[0];
						}

						if ( redirectUrl === location.href.split( hostUrl )[1] ) {
							window.location.reload();
						} else {
							window.location.href = response.data.redirect_url;
						}
					} else {
						window.location.reload();
					}
				}
			} );
		},

		_lostPassFormSubmit: function(e) {
			e.preventDefault();

			var theForm = $(e.target),
				username         = theForm.find( 'input[name="user_login"]' ),
				redirect         = theForm.find( 'input[name="lost_redirect_to"]' ),
				is_lost_redirect = theForm.find( 'input[name="is_lost_redirect"]' ),
				self = this;

			username.parent().find( '.pp-lf-error' ).remove();

			if ( '' === username.val().trim() ) {
				$('<span class="pp-lf-error">').insertAfter( username ).html( this.messages.empty_username );
				return;
			}

			var formData = new FormData( theForm[0] );

			formData.append( 'action', 'pp_lf_process_lost_pass' );
			formData.append( 'page_url', this.settings.page_url );

			if ( redirect.length > 0 && '' !== redirect.val() ) {
				formData.append( 'redirect', redirect.val() );
			}

			this._disableForm();

			this._ajax( formData, function( response ) {

				self._enableForm();
				if ( ! response.success ) {
					username.parent().find( '.pp-lf-error' ).remove();
					$('<span class="pp-lf-error">').insertAfter( username ).html( response.data );
				} else {
					if ( '0' === is_lost_redirect.val() ) {
						$('<p class="pp-lf-success">').insertAfter( theForm ).html( self.messages.email_sent );
						theForm.hide();
					} else {
						if ( response.data.redirect_url ) {
							var hostUrl = location.protocol + '//' + location.host;
							var redirectUrl = '';
	
							if ( '' === response.data.redirect_url.split( hostUrl )[0] ) {
								redirectUrl = response.data.redirect_url.split( hostUrl )[1];
							} else {
								redirectUrl = response.data.redirect_url.split( hostUrl )[0];
							}
	
							if ( redirectUrl === location.href.split( hostUrl )[1] ) {
								window.location.reload();
							} else {
								window.location.href = response.data.redirect_url;
								$('<p class="pp-lf-success">').insertAfter( theForm ).html( self.messages.email_sent );
								theForm.hide();
							}
						} else {
							window.location.reload();
						}
					}
				}
			} );
		},

		_resetPassFormSubmit: function(e) {
			e.preventDefault();

			var theForm = $(e.target),
				password_1 = theForm.find( 'input[name="password_1"]' ),
				password_2 = theForm.find( 'input[name="password_2"]' ),
				self	= this;

			password_1.parent().find( '.pp-lf-error' ).remove();
			password_2.parent().find( '.pp-lf-error' ).remove();

			if ( '' === password_1.val() ) {
				$('<span class="pp-lf-error">').insertAfter( password_1 ).html( this.messages.empty_password_1 );
				return;
			}

			if ( '' === password_2.val() ) {
				$('<span class="pp-lf-error">').insertAfter( password_2 ).html( this.messages.empty_password_2 );
				return;
			}

			var formData = new FormData( theForm[0] );

			formData.append( 'action', 'pp_lf_process_reset_pass' );
			formData.append( 'page_url', this.settings.page_url );

			this._disableForm();

			this._ajax( formData, function( response ) {
				self._enableForm();
				if ( ! response.success ) {
					theForm.find( '.pp-lf-error' ).remove();
					$('<span class="pp-lf-error">').appendTo( theForm ).html( response.data );
				} else {
					$('<p class="pp-lf-success">').insertAfter( theForm ).html( self.messages.reset_success );
					theForm.hide();
				}
			} );
		},

		_enableForm: function() {
			this.node.find( '.pp-login-form-wrap' ).removeClass( 'pp-event-disabled' );
		},

		_disableForm: function() {
			this.node.find( '.pp-login-form-wrap' ).addClass( 'pp-event-disabled' );
		},

		_getNonce: function() {
			return this.node.find( '.pp-login-form input[name="ppe-lf-login-nonce"]' ).val();
		},

		_ajax: function( data, callback ) {
			var ajaxArgs = {
				type: 'POST',
				url: ppLogin.ajax_url,
				data: data,
				dataType: 'json',
				success: function( response ) {
					if ( 'function' === typeof callback ) {
						callback( response );
					}
				},
				error: function(xhr, desc) {
					console.log(desc);
				}
			};

			if ( 'undefined' === typeof data.provider ) {
				ajaxArgs.processData = false,
				ajaxArgs.contentType = false;
			}

			$.ajax( ajaxArgs );
		},
	};

})(jQuery);